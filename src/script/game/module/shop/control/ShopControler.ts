// @ts-nocheck
import FrameCtrlBase from "../../../mvc/FrameCtrlBase";
import { ShopManager } from "../../../manager/ShopManager";
import { ShopModel } from "../model/ShopModel";
import { ShopGoodsInfo } from "../model/ShopGoodsInfo";
import ConfigMgr from "../../../../core/config/ConfigMgr";
import { ConfigType } from "../../../constant/ConfigDefine";
import { t_s_itemtemplateData } from "../../../config/t_s_itemtemplate";
import { PlayerInfo } from "../../../datas/playerinfo/PlayerInfo";
import { PlayerManager } from "../../../manager/PlayerManager";
import { ArrayConstant, ArrayUtils } from "../../../../core/utils/ArrayUtils";
import { SimpleDictionary } from "../../../../core/utils/SimpleDictionary";
import { GoodsType } from "../../../constant/GoodsType";
import { t_s_startemplateData } from "../../../config/t_s_startemplate";
import { ArmyManager } from "../../../manager/ArmyManager";
import { SceneManager } from "../../../map/scene/SceneManager";
import SceneType from "../../../map/scene/SceneType";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { ConsortiaControler } from "../../consortia/control/ConsortiaControler";
import { EmWindow } from "../../../constant/UIDefine";
import { FarmManager } from "../../../manager/FarmManager";

/**
 * 商城控制器
 *
 */
export class ShopControler extends FrameCtrlBase {

    constructor() {
        super();
    }

    public get model(): ShopModel {
        return ShopManager.Instance.model;
    }


    /**
     * 搜索商品
     *
     * */
    public searchGoods(str: string) {
        let arr: any[] = [];
        for (const key in this.model.allGoodsList) {
            if (this.model.allGoodsList.hasOwnProperty(key)) {
                let item: ShopGoodsInfo = this.model.allGoodsList[key];
                let temp: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate, item.ItemId);
                if (!temp) {
                    continue;
                }
                if (temp.TemplateNameLang.indexOf(str) != -1) {
                    if (this.playerInfo.isBackPlayer) {
                        arr.push(item);
                    }
                    else if (item.Area != ShopGoodsInfo.BACK_PLAYER) {
                        arr.push(item);
                    }
                }
            }
        }
        this.setCurrentGoodsList(arr);
    }

    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    /**
     * 设置当前物品
     *
     * */
    public setCurrentGoodsList(list: any[], pageNum: number = 9, changeCurrentPage: boolean = true) {
        this.model.currentPageNum = pageNum;
        this.model.currentGoodsList = list;
        if (changeCurrentPage) {
            this.model.currentPage = 1;
        }
        this.model.totalPage = Math.ceil(this.model.currentGoodsList.length / this.model.currentPageNum);
        this.model.showGoodsList = this.getShopShowList();
    }

    /**
     * 翻页处理
     *
     * */
    public shopPageBtnHandler(isPrePage: boolean) {
        if (isPrePage && this.model.currentPage > 1) {
            this.model.currentPage--;
        }
        else if (!isPrePage && this.model.currentPage < this.model.totalPage) {
            this.model.currentPage++;
        }
        else {
            return;
        }
        this.model.showGoodsList = this.getShopShowList();
    }

    private getShopShowList(): any[] {
        let startIndex: number = (this.model.currentPage - 1) * this.model.currentPageNum;
        let endIndex: number = startIndex + this.model.currentPageNum;
        if (endIndex > this.model.currentGoodsList.length) {
            endIndex = this.model.currentGoodsList.length;
        }
        return this.model.currentGoodsList.slice(startIndex, endIndex);
    }

    /**
     * 紫晶积分兑换商城商品表
     *
     */
    public get mineralShopGoods(): ShopGoodsInfo[] {
        let goodsList: ShopGoodsInfo[] = [];
        let dic = ConfigMgr.Instance.mineralShopTemplateDic;
        for (const key in dic) {
            if (dic.hasOwnProperty(key)) {
                let gInfo: ShopGoodsInfo = dic[key];
                goodsList.push(gInfo);
            }
        }
        return goodsList;
    }

    public mineralShopGoodsSort(a: ShopGoodsInfo, b: ShopGoodsInfo): number {
        let sort: number = 0;
        if (a.NeedMinGrade <= ArmyManager.Instance.thane.grades && b.NeedMinGrade <= ArmyManager.Instance.thane.grades) {
            if (a.MineScore < b.MineScore) {
                sort = -1;
            }
            else if (a.MineScore > b.MineScore) {
                sort = 1;
            }
            else if (a.MineScore == b.MineScore) {
                sort = 0;
            }
        }
        else {
            if (a.NeedMinGrade < b.NeedMinGrade) {
                sort = -1;
            }
            else if (a.NeedMinGrade > b.NeedMinGrade) {
                sort = 1;
            }
            else if (a.NeedMinGrade == b.NeedMinGrade) {
                if (a.MineScore < b.MineScore) {
                    sort = -1;
                }
                else if (a.MineScore > b.MineScore) {
                    sort = 1;
                }
                else if (a.MineScore == b.MineScore) {
                    sort = 0;
                }
            }
        }
        return sort;
    }

    /**
     * 公会商城
     *
     */
    public initConsortiaShopFrame() {
        this.model.currentPage = 1;
        this.model.currentPageNum = ShopModel.PAGE_NUM;

        let goodsList: ShopGoodsInfo[] = [];
        let goodsList2: ShopGoodsInfo[] = [];
        let consortiaLevel = this.consortiaLevel;

        let dic = ConfigMgr.Instance.consortiaShopTemplateDic;
        for (const key in dic) {
            if (dic.hasOwnProperty(key)) {
                let gInfo: ShopGoodsInfo = dic[key];
                if (gInfo.NeedConsortiaLevels > consortiaLevel) {
                    goodsList2.push(gInfo);
                } else {
                    goodsList.push(gInfo);
                }
            }
        }

        goodsList.sort((a, b) => { return a.Sort - b.Sort });
        goodsList2.sort((a, b) => { return a.Sort - b.Sort });
        goodsList2.sort((a, b) => { return a.NeedConsortiaLevels - b.NeedConsortiaLevels });

        goodsList.push(...goodsList2);

        // goodsList = this.selectList(goodsList);
        // goodsList = ArrayUtils.sortOn(goodsList, ["NeedConsortiaLevels", "Sort"], [ArrayConstant.CASEINSENSITIVE | ArrayConstant.NUMERIC, ArrayConstant.NUMERIC])
        // this.model.totalPage = Math.ceil(goodsList.length / this.model.currentPageNum);
        this.model.currentGoodsList = goodsList;
        this.model.showGoodsList = goodsList;
    }

    public initConsortiaHighShopFrame(){
        this.model.currentPage = 1;
        this.model.currentPageNum = ShopModel.PAGE_NUM;

        let goodsList: ShopGoodsInfo[] = [];
        let goodsList2: ShopGoodsInfo[] = [];
        let consortiaLevel = this.consortiaLevel;

        let dic = ConfigMgr.Instance.consortiaHighShopTemplateDic;
        for (const key in dic) {
            if (dic.hasOwnProperty(key)) {
                let gInfo: ShopGoodsInfo = dic[key];
                if (gInfo.NeedConsortiaLevels > consortiaLevel) {
                    goodsList2.push(gInfo);
                } else {
                    goodsList.push(gInfo);
                }
            }
        }
        goodsList.sort((a, b) => { return a.Sort - b.Sort });
        goodsList2.sort((a, b) => { return a.Sort - b.Sort });
        goodsList2.sort((a, b) => { return a.NeedConsortiaLevels - b.NeedConsortiaLevels });
        goodsList.push(...goodsList2);
        this.model.currentGoodsList = goodsList;
        this.model.showGoodsList = goodsList;
    }
    /**
     * 高级公会商城
     *
     */
    public initAdvConsortiaShopFrame() {
        this.model.currentPage = 1;
        this.model.currentPageNum = ShopModel.PAGE_NUM;

        let goodsList: ShopGoodsInfo[] = [];
        let goodsList2: ShopGoodsInfo[] = [];
        let heroJob: number = ArmyManager.Instance.thane.templateInfo.Job;
        let dic = ConfigMgr.Instance.advConsortiaShopTemplateDic;
        let consortiaLevel = this.consortiaLevel;
        for (let key in dic) {
            if (dic.hasOwnProperty(key)) {
                let gInfo: ShopGoodsInfo = dic[key];
                //高级公会商城添加职业限定
                if (this.isJobFix(heroJob, ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate, gInfo.ItemId))) {

                    if (gInfo.NeedConsortiaLevels > consortiaLevel) {
                        goodsList2.push(gInfo);
                    } else {
                        goodsList.push(gInfo);
                    }
                }
            }
        }
        goodsList.sort((a, b) => { return a.Sort - b.Sort });
        goodsList2.sort((a, b) => { return a.Sort - b.Sort });
        goodsList2.sort((a, b) => { return a.NeedConsortiaLevels - b.NeedConsortiaLevels });

        goodsList.push(...goodsList2);
        // goodsList = this.selectList(goodsList);
        // goodsList = ArrayUtils.sortOn(goodsList, ["NeedConsortiaLevels", "Sort"], [ArrayConstant.CASEINSENSITIVE | ArrayConstant.NUMERIC, ArrayConstant.NUMERIC])
        // this.model.totalPage = Math.ceil(goodsList.length / this.model.currentPageNum);
        this.model.currentGoodsList = goodsList;
        this.model.showGoodsList = goodsList;
        // this.model.showGoodsList = this.getShopShowList();
    }

    private get consortiaLevel(): number {
        let lv = 0;
        let contorller = FrameCtrlManager.Instance.getCtrl(EmWindow.Consortia) as ConsortiaControler;
        if (contorller && contorller.model) {
            lv = contorller.model.consortiaInfo.shopLevel;
        }
        return lv;
    }


    private selectList(arr: any[]): any[] {
        let resultArr: any[] = [];
        for (let i = 0; i < arr.length; i++) {
            const item: ShopGoodsInfo = arr[i];
            let contorller: ConsortiaControler = FrameCtrlManager.Instance.getCtrl(EmWindow.Consortia) as ConsortiaControler;
            let model = contorller.model;
            if (model) {
                resultArr.push(item);
            }
        }
        return resultArr;
    }

    /**
     * 农场商城
     *
     */
    public initFarmShopFrame() {
        this.model.resetData(ShopModel.SEEDS_PER_PAGE, -1, -1);
        //已解锁
        let unLockedGoodsList: ShopGoodsInfo[] = [];
        //未解锁
        let lockedGoodsList: ShopGoodsInfo[] = [];
        let next: number = 0;
        let myFrameGrade = FarmManager.Instance.model.myFarm.grade;
        let farmShopTempArr = this.model.farmShopTempArr;
        for (let i = 0, length = farmShopTempArr.length; i < length; i++) {
            const gInfo: ShopGoodsInfo = farmShopTempArr[i];
            if (gInfo.NeedGrades <= myFrameGrade) {
                unLockedGoodsList.push(gInfo);
            }
            else {
                if (next == 0 || next == 5) {
                    next = gInfo.NeedGrades;
                }
                if (gInfo.NeedGrades == next) {
                    lockedGoodsList.push(gInfo);
                }
            }
        }

        unLockedGoodsList.sort((a, b) => { return a.Sort - b.Sort });
        lockedGoodsList.sort((a, b) => { return a.Sort - b.Sort });
        lockedGoodsList.sort((a, b) => { return a.NeedGrades - b.NeedGrades });

        unLockedGoodsList.push(...lockedGoodsList)
        this.model.farmShopList = unLockedGoodsList;
        this.model.currentTab = 1;
    }

    //排序规则: 1、品质, 2、成熟时间, 3、类型: 礼金－勋章－经验－黄金－光晶－战魂
    private farmShopSortFunc(a: ShopGoodsInfo, b: ShopGoodsInfo): number {
        let at: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate, a.ItemId);
        let bt: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate, b.ItemId);
        if (!at || !bt) {
            return 0;
        }
        if (at.Profile > bt.Profile) {
            return -1;
        }
        else if (at.Profile == bt.Profile) {
            if (at.Property1 > bt.Property1) {
                return -1;
            }
            else if (at.Property1 == bt.Property1) {
                switch (at.Property2) {
                    case -500: //礼金
                        return -1;
                        break;
                    case 208001:  //勋章
                        if (bt.Property2 != -500) {
                            return -1;
                        }
                        break;
                    case -700:  //经验
                        if (bt.Property2 != -500 && bt.Property2 != 208001) {
                            return -1;
                        }
                        break;
                    case -100:  //黄金
                        if (bt.Property2 != -500 && bt.Property2 != 208001 && bt.Property2 != -700) {
                            return -1;
                        }
                        break;
                    case -600:  //光晶
                        if (bt.Property2 != -500 && bt.Property2 != 208001 && bt.Property2 != -700 && bt.Property2 != -100) {
                            return -1;
                        }
                        break;
                    case -300:  //战魂
                        if (bt.Property2 != -500 && bt.Property2 != 208001 && bt.Property2 != -700 && bt.Property2 != -100 && bt.Property2 != -600) {
                            return -1;
                        }
                        break;
                }
            }
        }
        return 1;
    }

    /**
     * 竞技商城
     *
     */
    public initPVPShopFrame() {
        this.model.currentPage = 1;
        this.model.currentPageNum = ShopModel.PAGE_NUM_8;

        let goodsList: any[] = [];
        let heroJob: number = ArmyManager.Instance.thane.templateInfo.Job;
        let dic = ConfigMgr.Instance.athleticsShopTemplateDic;
        for (const key in dic) {
            if (dic.hasOwnProperty(key)) {
                let gInfo: ShopGoodsInfo = dic[key];
                if (this.isJobFix(heroJob, ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate, gInfo.ItemId))) {
                    goodsList.push(gInfo);
                }
            }
        }
        goodsList.sort(this.pvpShopSortFunc.bind(this));
        this.model.totalPage = Math.ceil(goodsList.length / this.model.currentPageNum);
        this.model.currentGoodsList = goodsList;
        this.model.showGoodsList = this.getShopShowList();
    }

    /*竞技商店排序规则: 
    1、达到购买条件的物品: Sort(排序字段)－勋章－NeedGeste(需要荣誉等级)－Profile(品质)－TemplateId(模板id)
    2、未达到购买条件的物品: NeedGeste(需要荣誉等级)－ItemId(即模板id)
    */
    private pvpShopSortFunc(a: ShopGoodsInfo, b: ShopGoodsInfo): number {
        if (ArmyManager.Instance.thane.honer >= a.NeedGeste && ArmyManager.Instance.thane.honer >= b.NeedGeste) {
            if (a.Sort > 0 && b.Sort > 0) {
                if (a.Sort <= b.Sort) {
                    return -1;
                }
                return 1;
            }
            else if (a.Sort == 0 && b.Sort == 0) {
                let at: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate, a.ItemId);
                let bt: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate, b.ItemId);
                if (!at || !bt) {
                    return 0;
                }
                if (at.MasterType == GoodsType.HONER && bt.MasterType == GoodsType.HONER) {
                    if (a.NeedGeste >= b.NeedGeste) {
                        return -1;
                    }
                    return 1;
                }
                else if (at.MasterType == GoodsType.HONER || bt.MasterType == GoodsType.HONER) {
                    if (at.MasterType == GoodsType.HONER) {
                        return -1;
                    }
                    return 1;
                }
                else {
                    if (a.NeedGeste > b.NeedGeste) {
                        return -1;
                    }
                    if (a.NeedGeste == b.NeedGeste) {
                        if (at.Profile > bt.Profile) {
                            return -1;
                        }
                        if (at.Profile == bt.Profile) {
                            if (at.TemplateId < bt.TemplateId) {
                                return -1;
                            }
                        }
                    }
                    return 1;
                }
            }
            else {
                if (a.Sort > 0) {
                    return -1;
                }
                if (b.Sort > 0) {
                    return 1;
                }
                return 0;
            }
        }
        else if (ArmyManager.Instance.thane.honer >= a.NeedGeste || ArmyManager.Instance.thane.honer >= b.NeedGeste) {
            if (ArmyManager.Instance.thane.honer >= a.NeedGeste) {
                return -1;
            }
            return 1;
        }
        else {
            if (a.NeedGeste < b.NeedGeste) {
                return -1;
            }
            if (a.NeedGeste == b.NeedGeste) {
                if (a.ItemId > b.ItemId) {
                    return -1;
                }
            }
            return 1;
        }
        return 0;
    }

    /**
     * 武斗会商城
     *
     */
    public initWarlordsShopFrame() {
        this.model.currentPage = 1;
        this.model.currentPageNum = ShopModel.PAGE_NUM;

        let goodsList: any[] = [];
        let heroJob: number = ArmyManager.Instance.thane.templateInfo.Job;
        let dic = ConfigMgr.Instance.warlordsShopTemplateDic;
        for (const key in dic) {
            if (dic.hasOwnProperty(key)) {
                let gInfo: ShopGoodsInfo = dic[key];
                if (this.isJobFix(heroJob, ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate, gInfo.ItemId))) {
                    goodsList.push(gInfo);
                }
            }
        }
        goodsList = ArrayUtils.sortOn(goodsList, ["NeedGeste", "Sort"], ArrayConstant.NUMERIC);
        this.model.totalPage = Math.ceil(goodsList.length / this.model.currentPageNum);
        this.model.currentGoodsList = goodsList;
        this.model.showGoodsList = this.getShopShowList();
    }

    /**
     * 多人武斗会商城（泰坦商城）
     *
     */
    public initMultilordsShopFrame() {
        this.model.currentPage = 1;
        this.model.currentPageNum = ShopModel.PAGE_NUM;

        let goodsList: any[] = [];
        let heroJob: number = ArmyManager.Instance.thane.templateInfo.Job;
        let dic = ConfigMgr.Instance.multilordsShopTemplateDic;
        for (const key in dic) {
            if (dic.hasOwnProperty(key)) {
                let gInfo: ShopGoodsInfo = dic[key];
                if (this.isJobFix(heroJob, ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate, gInfo.ItemId))) {
                    goodsList.push(gInfo);
                }
            }
        }
        goodsList = ArrayUtils.sortOn(goodsList, ["NeedGeste", "Sort"], ArrayConstant.NUMERIC);
        this.model.totalPage = Math.ceil(goodsList.length / this.model.currentPageNum);
        this.model.currentGoodsList = goodsList;
        this.model.showGoodsList = this.getShopShowList();
    }

    /**
     * 星运商城
     *
     * */
    public initStarShopFrame() {
        this.model.currentPage = 1;
        this.model.currentPageNum = ShopModel.STARS_PER_PAGE;

        let goodsList: any[] = this.getStarTemplatesByPoint(0, true);
        this.model.totalPage = Math.ceil(goodsList.length / this.model.currentPageNum);
        this.model.currentGoodsList = goodsList;
        this.model.showGoodsList = this.getShopShowList();
    }

    private isJobFix(heroJob: number, gInfo: t_s_itemtemplateData): boolean {
        if (!gInfo) {
            return false;
        }
        let arr: any[] = gInfo.Job;
        for (let i = 0; i < arr.length; i++) {
            const job = arr[i];
            if (job == 0 || job == heroJob) {
                return true;
            }
        }
        return false;
    }

    /**
     * 根据地图初始化商城
     * @param mapId
     *
     */
    public initPetExchangeShopFrame(mapId: number = 0) {
        this.model.currentPage = 1;
        this.model.currentPageNum = ShopModel.PAGE_NUM_8;

        let goodsList: any[] = [];
        let dic = ConfigMgr.Instance.petExchangeShopTemplateDic;
        for (const key in dic) {
            if (dic.hasOwnProperty(key)) {
                let gInfo: ShopGoodsInfo = dic[key];
                // if (SceneManager.Instance.currentType == SceneType.SPACE_SCENE) {
                goodsList.push(gInfo);
                // }
                // else if (SceneManager.Instance.currentType == SceneType.CAMPAIGN_MAP_SCENE) {
                //     if (gInfo.Area == mapId) {
                //         goodsList.push(gInfo);
                //     }
                // }
            }
        }
        goodsList = ArrayUtils.sortOn(goodsList, "Sort", ArrayConstant.NUMERIC);
        this.model.totalPage = Math.ceil(goodsList.length / this.model.currentPageNum);
        this.model.currentGoodsList = goodsList;
        this.model.showGoodsList = goodsList;//this.getShopShowList();
    }

    private getStarTemplatesByPoint(point: number, isOverPoint: boolean = false) {
        let arr: t_s_startemplateData[] = [];
        //优化标记 数据不大就算了
        let templateDic = ConfigMgr.Instance.getDicSync(ConfigType.t_s_startemplate);
        for (const dicKey in templateDic) {
            if (templateDic.hasOwnProperty(dicKey)) {
                let temp: t_s_startemplateData = templateDic[dicKey];
                if (temp.StarPoint > point) {
                    arr.push(temp)
                }
            }
        }
        arr.sort(this.tempCompare.bind(this));
        return arr;
    }

    private tempCompare(a: t_s_startemplateData, b: t_s_startemplateData): number {
        if (!a || !b) {
            return 0;
        }
        if (a.Profile == 6 || a.Profile > b.Profile) {
            return -1;
        }
        return 1;
    }

}