import LangManager from '../../../core/lang/LangManager';
import Logger from '../../../core/logger/Logger';
import ByteArray from '../../../core/net/ByteArray';
import ResMgr from '../../../core/res/ResMgr';
import UIManager from '../../../core/ui/UIManager';
import { DateFormatter } from '../../../core/utils/DateFormatter';
import { RequestInfoEvent, SortEvent } from '../../constant/event/NotificationEvent';
import { EmWindow } from '../../constant/UIDefine';
import { GoodsInfo } from '../../datas/goods/GoodsInfo';
import { BattleGuardInfo } from '../../datas/playerinfo/BattleGuardInfo';
import { BattleGuardSocketInfo } from '../../datas/playerinfo/BattleGuardSocketInfo';
import { PlayerInfo } from '../../datas/playerinfo/PlayerInfo';
import { SimpleMountInfo } from '../../datas/playerinfo/SimpleMountInfo';
import { PathManager } from '../../manager/PathManager';
import { PlayerInfoManager } from '../../manager/PlayerInfoManager';
import { PlayerManager } from '../../manager/PlayerManager';
import FrameCtrlBase from '../../mvc/FrameCtrlBase';
import { ThaneInfoHelper } from '../../utils/ThaneInfoHelper';
import MagicCardFightInfo from '../card/MagicCardFightInfo';
import StarInfo from '../mail/StarInfo';
import { PetData } from '../pet/data/PetData';
import SortData from './SortData';
import SortModel from './SortModel';
/**
* @author:pzlricky
* @data: 2021-08-20 10:59
* @description 排行榜数据管理器
*/
export default class SortController extends FrameCtrlBase {

    private _model: SortModel;
    constructor() {
        super();
    }

    show() {
        this._model = new SortModel();
        this._model.initLanguageConfig();
        this._model.initWidthConfig();
        super.show();
    }

    /**
    * 查看英灵对比
    */
    public reqPetCompare(userId: number, petId: number = 0) {
        PlayerManager.Instance.addEventListener(RequestInfoEvent.QUERY_PETDATA_RESULT, this.onRecvPetData, this);
        PlayerInfoManager.Instance.sendRequestPetData(userId, petId);
    }

    private onRecvPetData(petData:PetData) {
        PlayerManager.Instance.removeEventListener(RequestInfoEvent.QUERY_PETDATA_RESULT, this.onRecvPetData, this);
        if (petData) {
            UIManager.Instance.ShowWind(EmWindow.PlayerPetWnd, petData);
            //查看自己的英灵
            let selfData = PlayerManager.Instance.currentPlayerModel.playerInfo.enterWarPet;
            if (selfData) {
                // FrameCtrlManager.Instance.open(EmWindow.MyPetWnd,selfData);
                UIManager.Instance.ShowWind(EmWindow.MyPetWnd, selfData);
            }
        } else {
            // var str: string = LangManager.Instance.GetTranslation("playerinfo.PlayerInfoFrameII.noWarPet");
            // MessageTipManager.Instance.show(str);
        }
    }

    /**
     * 设置排行榜类型  大类
     * @param value
     * 
     */
    public setSelectType(value: number) {
        if (this._model.currentSelected == value) return;
        this._model.currentSelected = value;
        this._model.currentPage = 1;

        if (this._model.currentSelected == SortModel.PET_POWER) {
            this._model.isCross = false;
        }
        this.loadXMLData();
    }

    /**
     * 设置排行榜 小类 日榜 周榜 累积 
     * @param value
     * 
     */
    public setAddType(value: number) {
        if (this._model.addType == value) return;
        this._model.addType = value;
        this._model.currentPage = 1;
        this.loadXMLData();
    }

    /**
     * 是否跨服 
     * @param b
     * 
     */
    public setCross(b: boolean) {
        if (this._model.isCross == b) return;
        this._model.isCross = b;
        this._model.currentPage = 1;
        this.loadXMLData();
    }

    public loadXMLData() {
        var sortName: number = this._model.currentSelected;
        var sortType: number = this._model.addType;
        var isCross: boolean = this._model.isCross;
        var crossName: string = isCross ? "cross/" : "";
        var fileName: string = this.getSortFileName(sortName, sortType);
        if (fileName) {
            fileName = crossName + fileName;
            this.setShowList();
            if (!this._model.loaded.get(fileName)) {
                this.loadData(fileName);
            }
        }
        else {
            this.setShowList();
        }
    }
    /**
     *  
     * @param sortName 排行大类
     * @param sortType 小类
     * @return 排行榜对应的xml名称 不区分跨服, 跨服是在此基础上加上cross/
     * 
     */
    private getSortFileName(sortName: number, sortType: number): string {
        var fileName: string;
        if (sortName == SortModel.SELF_POW) {
            fileName = "fight";
        } else if (sortName == SortModel.CONSORTIA_LEVEL) {
            fileName = "constain";
        } else if (sortName == SortModel.CONSORTIA_POW) {
            fileName = "constainfight";
        } else if (sortName == SortModel.SELF_HONOUR) {
            fileName = "geste";
        } else if (sortName == SortModel.SELF_SOULSCORE) {
            fileName = "soulscore";
        } else if (sortName == SortModel.SELF_LEVEL) {
            if (sortType == SortModel.DAY_ADD) {
                fileName = "day";
            } else if (sortType == SortModel.WEEK_ADD) {
                fileName = "week";
            } else if (sortType == SortModel.ACCUMULAT_ADD) {
                fileName = "total";
            }
        } else if (sortName == SortModel.SELF_CHARMS) {
            if (sortType == SortModel.DAY_ADD) {
                fileName = "daycharm";
            } else if (sortType == SortModel.WEEK_ADD) {
                fileName = "weekcharm";
            } else if (sortType == SortModel.ACCUMULAT_ADD) {
                fileName = "totalcharm";
            }
        } else if (sortName == SortModel.WARLORDS) {
            fileName = "final";
        } else if (sortName == SortModel.PET_POWER) {
            fileName = "petfightcapacityrank";
        } else {
            fileName = "";
        }
        return fileName ? fileName + ".json" : fileName;
    }

    public loadData(path: string) {
        let self = this;
        var path: string = PathManager.info.TEMPLATE_PATH + path + "?v=" + new Date().getTime();
        // path = "https://s1-h5.7road.net/web//xml/total.xml" + "?v=" + new Date().getTime();
        ResMgr.Instance.loadRes(path, (info) => {
            let contentStr: string = "";
            let dataObj = null;
            if (info) {
                try {
                    let content: ByteArray = new ByteArray();
                    content.writeArrayBuffer(info);
                    if (content && content.length) {
                        content.position = 0;
                        content.uncompress();
                        contentStr = content.readUTFBytes(content.bytesAvailable);
                        content.clear();
                    }
                } catch (error) {
                    Logger.error('SortController __onXMLDataLoaded Error');
                    return;
                }
                // console.log(contentStr)
                // console.time("decode xml")
                // dataObj = XmlMgr.Instance.decode(contentStr);
                dataObj = JSON.parse(contentStr);
                // console.timeEnd("decode xml")
                var isCross: boolean = false;
                isCross = path.indexOf("cross") >= 0;
                var url: string = path;
                url = url.replace(PathManager.info.TEMPLATE_PATH, "");
                var index: number = url.indexOf("?");
                if (index != -1) {
                    url = url.substring(0, index);
                }
                this._model.loaded.set(url, true);
                if (dataObj) {
                    this.resolveXML(dataObj, isCross);
                }
                this.setShowList();
            }
        }, null, Laya.Loader.BUFFER);
    }


    /**************************************
     *     重载逻辑
     * ***********************************/

    exit() {
        super.exit();
        this._model.currentSelected = 0;
        this._model.addType = 0;
        this._model.currentPage = 1;
        this._model.currentShowList = [];
        this._model.loaded.clear();
        this._model.initArrs();
        // this._model.loaded = new Map();
    }

    public get model(): SortModel {
        return this._model;
    }

    public pageBtnHandler(isPrePage: boolean) {//翻页
        if (isPrePage && this._model.currentPage > 1)
            this._model.currentPage--;
        else if (!isPrePage && this._model.currentPage < this._model.totalPage)
            this._model.currentPage++;
        else return;
        this._model.commitChange();
    }

    /** 排行榜xml解析  */
    private resolveXML(xml, cross: boolean) {
        this.resolveCharmDayAddXML(xml, cross);
        this.resolveCharmWeekAddXML(xml, cross);
        this.resolveCharmTotalAddXML(xml, cross);
        this.resolveConstainFightXML(xml, cross);
        this.resolveConstainOrderXML(xml, cross);
        this.resolveDayAddXML(xml, cross);
        this.resolvePlayerFightXML(xml, cross);
        this.resolvePlayerGesteXML(xml, cross);
        this.resolveSoulScoreTotalAddXML(xml, cross);
        this.resolveTotalAddXML(xml, cross);
        this.resolveWeekAddXML(xml, cross);
        this.resolveWarlordsXML(xml, cross);
        this.resolvePetPowerXML(xml, cross);
    }
    //个人等级 日增 排行榜xml解析 
    private resolveDayAddXML(value, cross: boolean) {
        if (value && value.DayAdds) {
            let xml = value.DayAdds;
            this._model.createDate = DateFormatter.parse(xml.info.createDate, "YYYY-MM-DD hh:mm:ss");
            this._model.createDate.setHours(3, 0, 0, 0);
            var dayAdd = xml.DayAdd;
            var items: Array<any> = cross ? this._model.dayAddList2 : this._model.dayAddList;
            if (dayAdd instanceof Array) {
                for (const key in dayAdd) {
                    if (Object.prototype.hasOwnProperty.call(dayAdd, key)) {
                        const item = dayAdd[key];
                        if (item) {
                            var sortData: SortData = SortController.read(item);
                            if (sortData.userId == this.playerInfo.userId && item.site == this.playerInfo.site) {
                                this.playerInfo.playerOrdeInfo.gpDayOrder = Number(key) + 1;
                            }
                            items.push(sortData);
                        }
                    }
                }
            } else {
                const item = dayAdd;
                if (item) {
                    var sortData: SortData = SortController.read(item);
                    items.push(sortData);
                }
            }
        }
    }
    //个人等级 周增  排行榜xml解析 
    private resolveWeekAddXML(value, cross: boolean) {
        if (value && value.WeekAdds) {
            let xml = value.WeekAdds;
            this._model.createDate = DateFormatter.parse(xml.info.createDate, "YYYY-MM-DD hh:mm:ss");
            this._model.createDate.setHours(3, 0, 0, 0);
            var weekAdd = xml.WeekAdd;
            var items: Array<any> = cross ? this._model.weekAddList2 : this._model.weekAddList;
            if (weekAdd instanceof Array) {
                for (const key in weekAdd) {
                    if (Object.prototype.hasOwnProperty.call(weekAdd, key)) {
                        const item = weekAdd[key];
                        if (item) {
                            var sortData: SortData = SortController.read(item);
                            if (sortData.userId == this.playerInfo.userId && item.site == this.playerInfo.site) {
                                this.playerInfo.playerOrdeInfo.gpWeekOrder = Number(key) + 1;
                            }
                            items.push(sortData);
                        }
                    }
                }
            } else {
                const item = weekAdd;
                if (item) {
                    var sortData: SortData = SortController.read(item);
                    items.push(sortData);
                }
            }
        }
    }
    //个人等级 累积  排行榜xml解析 
    private resolveTotalAddXML(value, cross: boolean) {
        if (value && value.TotalAdds) {
            let xml = value.TotalAdds;
            this._model.createDate = DateFormatter.parse(xml.info.createDate, "YYYY-MM-DD hh:mm:ss");
            this._model.createDate.setHours(3, 0, 0, 0);
            var totalAdd = xml.TotalAdd;
            var items: Array<any> = cross ? this._model.accumulationAddList2 : this._model.accumulationAddList;
            if (totalAdd instanceof Array) {
                for (const key in totalAdd) {
                    if (Object.prototype.hasOwnProperty.call(totalAdd, key)) {
                        let item = totalAdd[key];
                        if (item) {
                            var sortData: SortData = SortController.read(item);
                            items.push(sortData);
                        }
                    }
                }
            } else {
                let item = totalAdd;
                if (item) {
                    var sortData: SortData = SortController.read(item);
                    items.push(sortData);
                }
            }
        }

    }
    //个人战斗力   排行榜xml解析   
    private resolvePlayerFightXML(value, cross: boolean) {
        if (value && value.PlayerFights) {
            let xml = value.PlayerFights;
            this._model.createDate = DateFormatter.parse(xml.info.createDate, "YYYY-MM-DD hh:mm:ss");
            this._model.createDate.setHours(3, 0, 0, 0);
            var list = xml.PlayerFight;
            var items: Array<any> = cross ? this._model.playerFightList2 : this._model.playerFightList;
            if (list instanceof Array) {
                for (const key in list) {
                    if (Object.prototype.hasOwnProperty.call(list, key)) {
                        const item = list[key];
                        if (item) {
                            var sortData: SortData = SortController.read(item);
                            items.push(sortData);
                        }
                    }
                }
            } else {
                const item = list;
                if (item) {
                    var sortData: SortData = SortController.read(item);
                    items.push(sortData);
                }
            }
        }
    }
    //公会等级    排行榜xml解析   
    private resolveConstainOrderXML(value, cross: boolean) {
        if (value && value.ConstainOrder) {
            let xml = value.ConstainOrder;
            this._model.createDate = DateFormatter.parse(xml.info.createDate, "YYYY-MM-DD hh:mm:ss");
            this._model.createDate.setHours(3, 0, 0, 0);
            var list = xml.orderItems;
            var items = cross ? this._model.consortiaLevelList2 : this._model.consortiaLevelList;
            if (list instanceof Array) {
                for (const key in list) {
                    if (Object.prototype.hasOwnProperty.call(list, key)) {
                        const item = list[key];
                        if (item) {
                            var sortData: SortData = SortController.read(item);
                            items.push(sortData);
                        }
                    }
                }
            } else {
                const item = list;
                if (item) {
                    var sortData: SortData = SortController.read(item);
                    items.push(sortData);
                }
            }
        }
    }
    //公会战斗力    排行榜xml解析   
    private resolveConstainFightXML(value, cross: boolean) {
        if (value && value.ConstainFight) {
            let xml = value.ConstainFight;
            this._model.createDate = DateFormatter.parse(xml.info.createDate, "YYYY-MM-DD hh:mm:ss");
            this._model.createDate.setHours(3, 0, 0, 0);
            var list = xml.fightItems;
            var items = cross ? this._model.consortiaFightList2 : this._model.consortiaFightList;
            if (list instanceof Array) {
                for (const key in list) {
                    if (Object.prototype.hasOwnProperty.call(list, key)) {
                        var item = list[key];
                        if (item) {
                            var sortData: SortData = SortController.read(item);
                            items.push(sortData);
                        }
                    }
                }
            } else {
                var item = list;
                if (item) {
                    var sortData: SortData = SortController.read(item);
                    items.push(sortData);
                }
            }
        }
    }

    //个人荣誉   排行榜xml解析  
    private resolvePlayerGesteXML(value, cross: boolean) {
        if (value && value.PlayerGeste) {
            let xml = value.PlayerGeste;
            this._model.createDate = DateFormatter.parse(xml.info.createDate, "YYYY-MM-DD hh:mm:ss");
            this._model.createDate.setHours(3, 0, 0, 0);
            var list = xml.PlayerGeste;
            var items = cross ? this._model.playerHonourList2 : this._model.playerHonourList;
            if (list instanceof Array) {
                for (const key in list) {
                    if (Object.prototype.hasOwnProperty.call(list, key)) {
                        var item = list[key];
                        if (item) {
                            var sortData: SortData = SortController.read(item);
                            sortData.army.baseHero.honer = Number(item.CurrentGeste);
                            items.push(sortData);
                        }
                    }
                }
            } else {
                var item = list;
                if (item) {
                    var sortData: SortData = SortController.read(item);
                    sortData.army.baseHero.honer = Number(item.CurrentGeste);
                    items.push(sortData);
                }
            }
        }
    }

    //个人魅力日增   排行榜xml解析  
    private resolveCharmDayAddXML(value, cross: boolean) {
        if (value && value.CharmDayAdds) {
            let xml = value.CharmDayAdds;
            this._model.createDate = DateFormatter.parse(xml.info.createDate, "YYYY-MM-DD hh:mm:ss");
            this._model.createDate.setHours(3, 0, 0, 0);
            var list = xml.CharmDayAdd;
            var items = cross ? this._model.charmsDayAddList2 : this._model.charmsDayAddList;
            if (list instanceof Array) {
                for (const key in list) {
                    if (Object.prototype.hasOwnProperty.call(list, key)) {
                        var item = list[key];
                        if (item) {
                            var sortData: SortData = SortController.read(item);
                            if (sortData.userId == this.playerInfo.userId && item.site == this.playerInfo.site) {
                                this.playerInfo.playerOrdeInfo.charmsDayOrder = Number(key) + 1;
                            }
                            items.push(sortData);
                        }
                    }
                }
            } else {
                var item = list;
                if (item) {
                    var sortData: SortData = SortController.read(item);
                    items.push(sortData);
                }
            }

        }
    }
    //个人魅力周增   排行榜xml解析  
    private resolveCharmWeekAddXML(value, cross: boolean) {
        if (value && value.CharmWeekAdds) {
            let xml = value.CharmWeekAdds;
            this._model.createDate = DateFormatter.parse(xml.info.createDate, "YYYY-MM-DD hh:mm:ss");
            this._model.createDate.setHours(3, 0, 0, 0);
            var list = xml.CharmWeekAdd;
            var items = cross ? this._model.charmsWeekAddList2 : this._model.charmsWeekAddList;
            if (list instanceof Array) {
                for (const key in list) {
                    if (Object.prototype.hasOwnProperty.call(list, key)) {
                        var item = list[key];
                        if (item) {
                            var sortData: SortData = SortController.read(item);
                            if (sortData.userId == this.playerInfo.userId && item.site == this.playerInfo.site) {
                                this.playerInfo.playerOrdeInfo.charmsWeekOrder = Number(key) + 1;
                            }
                            items.push(sortData);
                        }
                    }
                }
            } else {
                var item = list;
                if (item) {
                    var sortData: SortData = SortController.read(item);
                    items.push(sortData);
                }
            }
        }
    }
    //个人魅力累积   排行榜xml解析  
    private resolveCharmTotalAddXML(value, cross: boolean) {
        if (value && value.CharmTotalAdds) {
            let xml = value.CharmTotalAdds;
            this._model.createDate = DateFormatter.parse(xml.info.createDate, "YYYY-MM-DD hh:mm:ss");
            this._model.createDate.setHours(3, 0, 0, 0);
            var list = xml.CharmTotalAdd;
            var items = cross ? this._model.charmsTotalAddList2 : this._model.charmsTotalAddList;
            if (list instanceof Array) {
                for (const key in list) {
                    if (Object.prototype.hasOwnProperty.call(list, key)) {
                        var item = list[key];
                        if (item) {
                            var sortData: SortData = SortController.read(item);
                            sortData.army.baseHero.charms = Number(item.totalCharm);
                            items.push(sortData);
                        }
                    }
                }
            } else {
                var item = list;
                if (item) {
                    var sortData: SortData = SortController.read(item);
                    sortData.army.baseHero.charms = Number(item.totalCharm);
                    items.push(sortData);
                }
            }

        }
    }
    //兽魂值   排行榜xml解析  
    private resolveSoulScoreTotalAddXML(value, cross: boolean) {
        if (value && value.SoulScoreTotalAdds) {
            let xml = value.SoulScoreTotalAdds;
            this._model.createDate = DateFormatter.parse(xml.info.createDate, "YYYY-MM-DD hh:mm:ss");
            this._model.createDate.setHours(3, 0, 0, 0);
            var list = xml.SoulScoreTotalAdd;
            var items = cross ? this._model.soulScoreTotalAddList2 : this._model.soulScoreTotalAddList;
            if (list instanceof Array) {
                for (const key in list) {
                    if (Object.prototype.hasOwnProperty.call(list, key)) {
                        var item = list[key];
                        if (item) {
                            var sortData: SortData = SortController.read(item);
                            items.push(sortData);
                        }
                    }
                }
            } else {
                var item = list;
                if (item) {
                    var sortData: SortData = SortController.read(item);
                    items.push(sortData);
                }
            }

        }
    }

    /**
     * 众神榜解析
     */
    private resolveWarlordsXML(value, cross: boolean) {
        if (value && value.FinalInfos) {
            let xml = value.FinalInfos;
            var warlordsList: Array<any>;
            var sd: SortData;
            var job: number = 0;
            var period: number = 0;
            var list = xml.LordsInfo;
            if (list instanceof Array) {
                for (const key in list) {
                    if (Object.prototype.hasOwnProperty.call(list, key)) {
                        var item = list[key]
                        job = Number(item.job);
                        period = Number(item.lordsIndex);
                        warlordsList = this._model.warlordsDic[ThaneInfoHelper.getJob(job)];
                        if (!warlordsList) {
                            warlordsList = [];
                            this._model.warlordsDic.add(ThaneInfoHelper.getJob(job), warlordsList);
                        }
                        sd = warlordsList[period] as SortData;
                        if (!sd) {
                            sd = new SortData();
                            warlordsList[period] = sd;
                        }
                        sd.orderId = period;
                        sd.army.baseHero.userId = Number(item.userId);
                        sd.army.baseHero.serviceName = item.serverName;
                        sd.army.baseHero.mainSite = item.mainSite;
                        sd.army.baseHero.nickName = item.nickName;
                        sd.army.baseHero.templateId = job;
                        sd.army.baseHero.job = job;
                        sd.army.baseHero.grades = Number(item.grades);
                        sd.army.baseHero.IsVipAndNoExpirt = Boolean(item.isVip);
                        sd.army.baseHero.fightingCapacity = Number(item.fightPower);
                        sd.army.baseHero.wingAvata = item.fashionWing;
                        sd.army.baseHero.hairFashionAvata = item.fashionHair;
                        sd.army.baseHero.cloakAvata = item.fashionHat;
                        if (item.fashionArm.indexOf("fashion") > -1) {//判断传过来的是否时装
                            sd.army.baseHero.armsFashionAvata = item.fashionArm;
                        }
                        else {
                            sd.army.baseHero.armsEquipAvata = item.fashionArm;
                        }
                        if (item.fashionCloth.indexOf("fashion") > -1) {//判断传过来的是否时装
                            sd.army.baseHero.bodyFashionAvata = item.fashionCloth;
                        }
                        else {
                            sd.army.baseHero.bodyEquipAvata = item.fashionCloth;
                        }
                    }
                }
            } else {
                var item = list
                job = Number(item.job);
                period = Number(item.lordsIndex);
                warlordsList = this._model.warlordsDic[ThaneInfoHelper.getJob(job)];
                if (!warlordsList) {
                    warlordsList = [];
                    this._model.warlordsDic.add(ThaneInfoHelper.getJob(job), warlordsList);
                }
                sd = warlordsList[period] as SortData;
                if (!sd) {
                    sd = new SortData();
                    warlordsList[period] = sd;
                }
                sd.orderId = period;
                sd.army.baseHero.userId = Number(item.userId);
                sd.army.baseHero.serviceName = item.serverName;
                sd.army.baseHero.mainSite = item.mainSite;
                sd.army.baseHero.nickName = item.nickName;
                sd.army.baseHero.templateId = job;
                sd.army.baseHero.job = job;
                sd.army.baseHero.grades = Number(item.grades);
                sd.army.baseHero.IsVipAndNoExpirt = Boolean(item.isVip);
                sd.army.baseHero.fightingCapacity = Number(item.fightPower);
                sd.army.baseHero.wingAvata = item.fashionWing;
                sd.army.baseHero.hairFashionAvata = item.fashionHair;
                sd.army.baseHero.cloakAvata = item.fashionHat;
                if (item.fashionArm.indexOf("fashion") > -1) {//判断传过来的是否时装
                    sd.army.baseHero.armsFashionAvata = item.fashionArm;
                }
                else {
                    sd.army.baseHero.armsEquipAvata = item.fashionArm;
                }
                if (item.fashionCloth.indexOf("fashion") > -1) {//判断传过来的是否时装
                    sd.army.baseHero.bodyFashionAvata = item.fashionCloth;
                }
                else {
                    sd.army.baseHero.bodyEquipAvata = item.fashionCloth;
                }
            }
            this._model.dispatchEvent(SortEvent.WARLORD_RANK_DATA_UPDATE)
        }
    }

    /**
     * 解析英灵战斗力排行榜 
     * @param xml
     * @param cross
     * 
     */
    private resolvePetPowerXML(value, cross: boolean) {
        if (value && value.PetCapabilityRankInfos) {
            let xml = value.PetCapabilityRankInfos;
            this._model.createDate = DateFormatter.parse(xml.info.createDate, "YYYY-MM-DD hh:mm:ss");
            this._model.createDate.setHours(3, 0, 0, 0);

            var list = xml.PetCapabilityRankInfo;
            var items = cross ? this._model.petPowerList2 : this._model.petPowerList;
            var sortData: SortData;
            if (list instanceof Array) {
                for (const key in list) {
                    if (Object.prototype.hasOwnProperty.call(list, key)) {
                        var item = list[key];
                        sortData = new SortData();
                        sortData.orderId = Number(item.Rank);
                        sortData.nickName = item.NickName;
                        sortData.userId = item.UserId;
                        sortData.grades = Number(item.CurGrade) ? Number(item.CurGrade) : 0;
                        sortData.fightCapacity = Number(item.FightCapacity) ? Number(item.FightCapacity) : 0;
                        sortData.consortiaName = item.ConsortiaName ? String(item.ConsortiaName) : String(item.consortiaName);
                        sortData.serverName = LangManager.Instance.GetTranslation("sort.serverName", String(item.serverId));
                        sortData.mainSite = item.mainSite;
                        sortData.job = Number(item.Job) ? Number(item.Job) : Number(item.job);
                        sortData.headId = Number(item.headId)?Number(item.headId):0;
                        sortData.frameId = Number(item.frameId)?Number(item.frameId):0;
                        sortData.army.nickName = item.NickName;
                        sortData.army.baseHero.serviceName = LangManager.Instance.GetTranslation("sort.serverName", String(item.serverId));
                        sortData.army.baseHero.mainSite = item.mainSite;
                        sortData.army.baseHero.userId = Number(item.UserId);
                        sortData.army.baseHero.IsVipAndNoExpirt = item.IsVip == "true" ? true : false;
                        sortData.army.baseHero.vipType = Number(item.VipType);
                        sortData.petData = PetData.createWithXML(item);
                        items.push(sortData);
                    }
                }
            } else {
                var item = list;
                sortData = new SortData();
                sortData.orderId = Number(item.Rank);
                sortData.nickName = item.NickName;
                sortData.serverName = LangManager.Instance.GetTranslation("sort.serverName", String(item.serverId));
                sortData.mainSite = item.mainSite;
                sortData.army.nickName = item.NickName;
                sortData.userId = item.UserId;
                sortData.job = Number(item.Job) ? Number(item.Job) : Number(item.job);
                sortData.headId = Number(item.headId)?Number(item.headId):0;
                sortData.frameId = Number(item.frameId)?Number(item.frameId):0;
                sortData.grades = Number(item.CurGrade) ? Number(item.CurGrade) : 0;
                sortData.fightCapacity = Number(item.FightCapacity) ? Number(item.FightCapacity) : 0;
                sortData.consortiaName = item.ConsortiaName ? String(item.ConsortiaName) : String(item.consortiaName);
                sortData.army.baseHero.serviceName = LangManager.Instance.GetTranslation("sort.serverName", String(item.serverId));
                sortData.army.baseHero.mainSite = item.mainSite;
                sortData.army.baseHero.userId = Number(item.UserId);
                sortData.army.baseHero.IsVipAndNoExpirt = item.IsVip == "true" ? true : false;
                sortData.army.baseHero.vipType = Number(item.VipType);
                sortData.petData = PetData.createWithXML(item);
                items.push(sortData);
            }


            //确定自己的排名
            var userId: number = this.playerInfo.userId;
            var nickName: string = this.playerInfo.nickName;
            var serverName: string = this.playerInfo.serviceName;

            for (const key in items) {
                if (Object.prototype.hasOwnProperty.call(items, key)) {
                    var sortData: SortData = items[key];
                    if (sortData.army.baseHero.userId != userId) continue;
                    if (!cross) {
                        this._model.petRanking = sortData;
                        break;
                    }
                    if (serverName == sortData.serverName) {
                        this._model.petRankingCross = sortData;
                        break;
                    }
                }
            }
        }
    }

    public static read(item: any): SortData {
        var sortInfo: SortData = new SortData();
        sortInfo.userId = Number(item.userid);
        sortInfo.orderId = Number(item.orderId);
        sortInfo.nickName = item.nikcName;
        sortInfo.grades = Number(item.grades) ? Number(item.grades) : 0;
        sortInfo.gp = Number(item.gp) ? Number(item.gp) : 0;
        sortInfo.fightCapacity = Number(item.fightCapaity) ? Number(item.fightCapaity) : 0;
        sortInfo.consortiaName = item.ConsortiaName ? String(item.ConsortiaName) : String(item.consortiaName);
        sortInfo.HideFashion = item.HideFashion == "true" ? true : false;
        sortInfo.consortiaLevel = Number(item.Levels);
        sortInfo.offer = Number(item.Offer);
        sortInfo.consortiaFightPower = Number(item.FightPower);
        sortInfo.selfHonour = Number(item.CurrentGeste);
        sortInfo.honorEquipStage = Number(item.honorEquipStage);
        sortInfo.charms = Number(item.charm);
        sortInfo.pvpScore = Number(item.weekScore);
        sortInfo.soulScore = Number(item.CurrentSoulScore);
        sortInfo.serverName = LangManager.Instance.GetTranslation("sort.serverName", String(item.serverId));
        sortInfo.mainSite = item.mainSite;
        sortInfo.job = Number(item.Job) ? Number(item.Job) : Number(item.job);
        sortInfo.headId = Number(item.headId)?Number(item.headId):0;
        sortInfo.frameId = Number(item.frameId)?Number(item.frameId):0;
        sortInfo.army.nickName = item.nikcName ? item.nikcName : "";
        sortInfo.army.baseHero.userId = item.userid;
        sortInfo.army.baseHero.templateId = item.Job ? item.Job : 0;
        if (sortInfo.army.baseHero.templateId == 0)
            sortInfo.army.baseHero.templateId = Number(item.job ? item.job : 0);
        sortInfo.army.baseHero.grades = Number(item.grades);
        sortInfo.army.baseHero.gp = Number(item.CurrentGp);
        sortInfo.army.baseHero.IsVipAndNoExpirt = item.IsVip == "true" ? true : false;
        sortInfo.army.baseHero.vipType = item.VipType;
        sortInfo.army.baseHero.jewelGrades = item.StoreGrade;
        sortInfo.army.baseHero.fateTotalGp = item.fateTotalGp;
        sortInfo.army.baseHero.fateGrades = item.fateGrades;

        sortInfo.army.baseHero.nickName = item.nickName;
        sortInfo.army.baseHero.consortiaName = item.ConsortiaName ? String(item.ConsortiaName) : String(item.consortiaName);

        sortInfo.army.baseHero.playerOrdeInfo.gpDayOrder = Number(item.gpOrde);
        sortInfo.army.baseHero.playerOrdeInfo.gpWeekOrder = Number(item.gpOrde);
        sortInfo.army.baseHero.playerOrdeInfo.gpOrder = Number(item.CurrentOrder);
        sortInfo.army.baseHero.playerOrdeInfo.fightCapacityOrder = Number(item.gpOrde);
        sortInfo.army.baseHero.playerOrdeInfo.honourOrder = Number(item.CurrentOrder);
        sortInfo.army.baseHero.playerOrdeInfo.charmsOrder = Number(item.charmOrder);

        sortInfo.army.baseHero.fightingCapacity = item.fightCapaity;
        sortInfo.army.baseHero.attackProrerty.totalParry = item.parry;
        sortInfo.army.baseHero.attackProrerty.totalPhyAttack = item.totalPhyAttack;
        sortInfo.army.baseHero.attackProrerty.totalPhyDefence = item.totalPhyDefence;
        sortInfo.army.baseHero.attackProrerty.totalMagicAttack = item.totalMagicAttack;
        sortInfo.army.baseHero.attackProrerty.totalMagicDefence = item.totalMagicDefence;
        sortInfo.army.baseHero.attackProrerty.totalForceHit = item.totalForceHit;
        sortInfo.army.baseHero.attackProrerty.totalConatArmy = item.totalConatArmy;
        sortInfo.army.baseHero.attackProrerty.totalLive = item.live;
        sortInfo.army.baseHero.attackProrerty.totalTenacity = item.Tenacity;
        sortInfo.army.baseHero.attackProrerty.totalIntensity = item.Strength;

        sortInfo.army.baseHero.baseProperty.totalPower = item.power;
        sortInfo.army.baseHero.baseProperty.totalAgility = item.agility;
        sortInfo.army.baseHero.baseProperty.totalIntellect = item.intellect;
        sortInfo.army.baseHero.baseProperty.totalCaptain = item.captain;
        sortInfo.army.baseHero.baseProperty.totalPhysique = item.physique;

        sortInfo.army.baseHero.baseProperty.fashionPower = item.fashionPower;
        sortInfo.army.baseHero.baseProperty.fashionAgility = item.fashionArmor;
        sortInfo.army.baseHero.baseProperty.fashionIntellect = item.fashionIntellect;
        sortInfo.army.baseHero.baseProperty.fashionPhysigue = item.fashionPhysique;
        sortInfo.army.baseHero.baseProperty.hasSetFashionProperty = true;

        sortInfo.army.baseHero.charms = Number(item.totalCharm);
        sortInfo.army.baseHero.honer = Number(item.geste);
        sortInfo.army.baseHero.appellId = Number(item.appellId);
        sortInfo.army.baseHero.charms = Number(item.totalCharm);
        sortInfo.army.baseHero.headId = Number(item.headId)?Number(item.headId):0;
        sortInfo.army.baseHero.frameId = Number(item.frameId)?Number(item.frameId):0;
        // for (const key in item.PlayerSNSInfo) {
        //     if (Object.prototype.hasOwnProperty.call(item.PlayerSNSInfo, key)) {
        //         var goods = item.PlayerSNSInfo[key];
        //         sortInfo.army.baseHero.snsInfo.userId = goods.userId;
        //         sortInfo.army.baseHero.snsInfo.nickName = sortInfo.army.nickName
        //         sortInfo.army.baseHero.snsInfo.headId = goods.HeadId;
        //         sortInfo.army.baseHero.snsInfo.sign = goods.randomSkill1;
        //         sortInfo.army.baseHero.snsInfo.sex = goods.Sex;
        //         sortInfo.army.baseHero.snsInfo.birthdayType = goods.BirthdayType;
        //         sortInfo.army.baseHero.snsInfo.birthYear = goods.BirthYear;
        //         sortInfo.army.baseHero.snsInfo.birthMonth = goods.BirthMonth;
        //         sortInfo.army.baseHero.snsInfo.birthDay = goods.BirthDay;
        //         sortInfo.army.baseHero.snsInfo.horoscope = goods.StarId;
        //         sortInfo.army.baseHero.snsInfo.bloodType = goods.BloodType;
        //         sortInfo.army.baseHero.snsInfo.country = goods.Country;
        //         sortInfo.army.baseHero.snsInfo.province = goods.Province;
        //         sortInfo.army.baseHero.snsInfo.city = goods.City;
        //         sortInfo.army.baseHero.snsInfo.sign = goods.Desc;
        //     }
        // }

        // for (const key in item.Item) {
        //     if (Object.prototype.hasOwnProperty.call(item.Item, key)) {
        //         var goods = item.Item[key];
        //         var gInfo: GoodsInfo = new GoodsInfo();
        //         gInfo.id = goods.id;
        //         gInfo.pos = goods.pos;
        //         gInfo.objectId = goods.objectId;
        //         gInfo.bagType = goods.bagType;
        //         gInfo.templateId = goods.templateId;
        //         gInfo.isBinds = goods.isBinds;
        //         gInfo.strengthenGrade = goods.strengthenGrade;
        //         gInfo.join1 = goods.join1;
        //         gInfo.join2 = goods.join2;
        //         gInfo.join3 = goods.join3;
        //         gInfo.join4 = goods.join4;
        //         gInfo.randomSkill1 = goods.randomSkill1;
        //         gInfo.randomSkill2 = goods.randomSkill2
        //         gInfo.randomSkill3 = goods.randomSkill3;
        //         gInfo.randomSkill4 = goods.randomSkill4;
        //         gInfo.randomSkill5 = goods.randomSkill5;
        //         sortInfo.army.baseHero.id = goods.objectId;
        //         gInfo.appraisal_skill = goods.appraisalSkill;
        //         sortInfo.army.baseHero.equipDic[gInfo.pos + "_" + gInfo.objectId + "_" + gInfo.bagType] = gInfo;
        //     }
        // }

        // for (const key in item.StarInfo) {
        //     if (Object.prototype.hasOwnProperty.call(item.StarInfo, key)) {
        //         const goods = item.StarInfo[key];
        //         var sInfo: StarInfo = new StarInfo();
        //         sInfo.id = goods.id;
        //         sInfo.userId = goods.userId;
        //         sInfo.bagType = goods.bagType;
        //         sInfo.pos = goods.pos;
        //         sInfo.tempId = goods.templateId;
        //         sInfo.grade = goods.grade;
        //         sInfo.gp = goods.gp;
        //         sortInfo.army.baseHero.equipDic[sInfo.pos + "_0_" + sInfo.bagType] = sInfo;
        //     }
        // }
        // sortInfo.cardFightInfoList = new Array<MagicCardFightInfo>();
        // for (const key in item.PowCardFightInfo) {
        //     if (Object.prototype.hasOwnProperty.call(item.PowCardFightInfo, key)) {
        //         const goods = item.PowCardFightInfo[key];
        //         var fightInfo: MagicCardFightInfo = new MagicCardFightInfo();
        //         fightInfo.op = goods.op;
        //         fightInfo.userId = goods.userId;
        //         fightInfo.campType = goods.camptype;
        //         fightInfo.add = goods.add;
        //         sortInfo.cardFightInfoList.push(fightInfo);
        //     }
        // }

        // //read pet info
        // for (const key in item.PetInfo) {
        //     if (Object.prototype.hasOwnProperty.call(item.PetInfo, key)) {
        //         const petXml = item.PetInfo[key];
        //         var petData: PetData = PetData.createWithXML(petXml);
        //         petData.isEnterWar = true;
        //         sortInfo.army.baseHero.addPet(petData);
        //     }
        // }
        // //read mount info
        // for (const key in item.MountInfo) {
        //     if (Object.prototype.hasOwnProperty.call(item.MountInfo, key)) {
        //         var mountXml = item.MountInfo[key];
        //         sortInfo.army.baseHero.mountInfo = SimpleMountInfo.createFromXml(mountXml);
        //     }
        // }

        // if (!sortInfo.army.baseHero.battleGuardInfo) {
        //     sortInfo.army.baseHero.battleGuardInfo = new BattleGuardInfo();
        // }
        // for (const key in item.WatchInfo) {
        //     if (Object.prototype.hasOwnProperty.call(item.WatchInfo, key)) {
        //         var itemXml = item.WatchInfo[key];
        //         var socketInfo: BattleGuardSocketInfo = sortInfo.army.baseHero.battleGuardInfo.getSocketInfo(itemXml.GridType, itemXml.GridPos - 1);
        //         socketInfo.addItem(itemXml.Jion1, 0);
        //         socketInfo.addItem(itemXml.Jion2, 1);
        //         socketInfo.addItem(itemXml.Jion3, 2);
        //         socketInfo.state = BattleGuardSocketInfo.OPEN;
        //         socketInfo.commit();
        //     }
        // }

        return sortInfo;
    }

    /** 设置当前显示列表 */
    private setShowList() {
        if (this._model.isCross) {
            this.cross();
        } else {
            this.notCross();
        }
    }

    private cross() {
        switch (this._model.currentSelected) {
            case SortModel.SELF_LEVEL:
                if (this._model.addType == SortModel.DAY_ADD)
                    this._model.currentShowList = this._model.dayAddList2;
                else if (this._model.addType == SortModel.WEEK_ADD)
                    this._model.currentShowList = this._model.weekAddList2;
                else
                    this._model.currentShowList = this._model.accumulationAddList2;
                break;
            case SortModel.SELF_POW:
                this._model.currentShowList = this._model.playerFightList2;
                break;
            case SortModel.CONSORTIA_LEVEL:
                this._model.currentShowList = this._model.consortiaLevelList2;
                break;
            case SortModel.CONSORTIA_POW:
                this._model.currentShowList = this._model.consortiaFightList2;
                break;
            case SortModel.SELF_HONOUR:
                this._model.currentShowList = this._model.playerHonourList2;
                break;
            case SortModel.SELF_CHARMS:
                if (this._model.addType == SortModel.DAY_ADD)
                    this._model.currentShowList = this._model.charmsDayAddList2;
                else if (this._model.addType == SortModel.WEEK_ADD)
                    this._model.currentShowList = this._model.charmsWeekAddList2;
                else
                    this._model.currentShowList = this._model.charmsTotalAddList2;
                break;
            case SortModel.SELF_SOULSCORE:
                this._model.currentShowList = this._model.soulScoreTotalAddList2;
                break;
            case SortModel.WARLORDS:
                this._model.currentShowList = [];
                this._model.dispatchEvent(SortEvent.WARLORD_RANK_DATA_UPDATE)
                break;
            case SortModel.PET_POWER:
                this._model.currentShowList = this._model.petPowerList2;
                break;
        }
        this._model.commitChange();
    }

    private notCross() {
        switch (this._model.currentSelected) {
            case SortModel.SELF_LEVEL:
                if (this._model.addType == SortModel.DAY_ADD)
                    this._model.currentShowList = this._model.dayAddList;
                else if (this._model.addType == SortModel.WEEK_ADD)
                    this._model.currentShowList = this._model.weekAddList;
                else
                    this._model.currentShowList = this._model.accumulationAddList;
                break;
            case SortModel.SELF_POW:
                this._model.currentShowList = this._model.playerFightList;
                break;
            case SortModel.CONSORTIA_LEVEL:
                this._model.currentShowList = this._model.consortiaLevelList;
                break;
            case SortModel.CONSORTIA_POW:
                this._model.currentShowList = this._model.consortiaFightList;
                break;
            case SortModel.SELF_HONOUR:
                this._model.currentShowList = this._model.playerHonourList;
                break;
            case SortModel.SELF_CHARMS:
                if (this._model.addType == SortModel.DAY_ADD)
                    this._model.currentShowList = this._model.charmsDayAddList;
                else if (this._model.addType == SortModel.WEEK_ADD)
                    this._model.currentShowList = this._model.charmsWeekAddList;
                else
                    this._model.currentShowList = this._model.charmsTotalAddList;
                break;
            case SortModel.SELF_SOULSCORE:
                this._model.currentShowList = this._model.soulScoreTotalAddList;
                break;
            case SortModel.WARLORDS:
                this._model.currentShowList = [];
                this._model.dispatchEvent(SortEvent.WARLORD_RANK_DATA_UPDATE);
                break;
            case SortModel.PET_POWER:
                this._model.currentShowList = this._model.petPowerList;
                break;
        }
        this._model.commitChange();
    }

    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    /**是否是个人等级经验Tab */
    public get isHideTabCell(): boolean {
        if (this._model.currentSelected == SortModel.SELF_LEVEL && this._model.addType == SortModel.ACCUMULAT_ADD) {
            return true;
        }
        return false;
    }

    public get isHideTabIndex(): number {
        if (this._model.isCross) {
            return 5;
        }
        return 4;
    }

}