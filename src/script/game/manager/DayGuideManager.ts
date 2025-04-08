import GameEventDispatcher from '../../core/event/GameEventDispatcher';
import { ChatEvent, DayGuideEvent, NotificationEvent, RewardEvent } from '../constant/event/NotificationEvent';
import OpenGrades from '../constant/OpenGrades';
import { PlayerInfo } from '../datas/playerinfo/PlayerInfo';
import { ThaneInfo } from '../datas/playerinfo/ThaneInfo';
import { SceneManager } from '../map/scene/SceneManager';
import SceneType from '../map/scene/SceneType';
import { WorldBossHelper } from '../utils/WorldBossHelper';
import { ArmyManager } from './ArmyManager';
import { FarmManager } from './FarmManager';
import { MessageTipManager } from './MessageTipManager';
import { NotificationManager } from './NotificationManager';
import LangManager from '../../core/lang/LangManager';
import { PlayerManager } from './PlayerManager';
import DayGuideCatecory from '../module/welfare/data/DayGuideCatecory';
import { GlobalConfig } from '../constant/GlobalConfig';
import SpaceNodeType from '../map/space/constant/SpaceNodeType';
import { SwitchPageHelp } from '../utils/SwitchPageHelp';
import { FrameCtrlManager } from '../mvc/FrameCtrlManager';
import { EmWindow } from '../constant/UIDefine';
import { ChatChannel } from '../datas/ChatChannel';
import LeedInfo from '../module/welfare/data/LeedInfo';
import { PackageIn } from '../../core/net/PackageIn';


import DayActiveRspMsg = com.road.yishi.proto.active.DayActiveRspMsg;
import ClickDatasRspMsg = com.road.yishi.proto.leed.ClickDatasRspMsg;
import LeedData = com.road.yishi.proto.leed.LeedData;
import LeedFinishedRspMsg = com.road.yishi.proto.leed.LeedFinishedRspMsg;
import LeedUpdatedRspMsg = com.road.yishi.proto.leed.LeedUpdatedRspMsg;
import PlayerSignRspMsg = com.road.yishi.proto.player.PlayerSignRspMsg;
import MonthCardRsp = com.road.yishi.proto.active.MonthCardRsp;
import { S2CProtocol } from '../constant/protocol/S2CProtocol';
import { ServerDataManager } from '../../core/net/ServerDataManager';
import OfferRewardManager from './OfferRewardManager';
import BuildingManager from '../map/castle/BuildingManager';
import RingTaskManager from './RingTaskManager';
import TreasureMapManager from './TreasureMapManager';
import { KingTowerManager } from './KingTowerManager';
import DayActionInfo from '../module/welfare/data/DayActionInfo';
import { DateFormatter } from '../../core/utils/DateFormatter';
import DayGuideHelper from '../utils/DayGuideHelper';
import DailyList from '../module/welfare/data/DailyList';
import DailyItemInfo from '../module/welfare/data/DailyItemInfo';
import MonthCardInfo from '../module/welfare/data/MonthCardInfo';
import SinglePassManager from './SinglePassManager';
import GTabIndex from '../constant/GTabIndex';
import UIManager from '../../core/ui/UIManager';
import { DamageData } from '../battle/data/DamageData';
import { CampaignManager } from './CampaignManager';
import { ConsortiaManager } from './ConsortiaManager';
/**
* @author:pzlricky
* @data: 2021-06-24 17:12
* @description 日常活动的管理类
*/
export default class DayGuideManager extends GameEventDispatcher {

    private static _instance: DayGuideManager;
    public static get Instance(): DayGuideManager {
        if (!this._instance) this._instance = new DayGuideManager();
        return this._instance;
    }

    private _cate: DayGuideCatecory;
    private _callback: Function;
    private _dayActiveList: Array<any> = [];
    private _dailyInfoList: Array<any> = [];

    public isVipInfoUpdate: boolean;
    public isShowNoActive: boolean;
    public page: number = -1;

    public setup() {
        this.addEvent();
        this._cate = new DayGuideCatecory();
    }

    private addEvent() {
        ServerDataManager.listen(S2CProtocol.U_C_PLAYER_SIGN, this, this.__signHandler);
        ServerDataManager.listen(S2CProtocol.U_C_LEED_UPDATE, this, this.__onLeedUpdateHandler);
        ServerDataManager.listen(S2CProtocol.U_C_LEED_RECEIVE, this, this.__onLeedReceiveHandler);
        ServerDataManager.listen(S2CProtocol.U_C_DAYACTION, this, this.__dayActivityHandler);
        ServerDataManager.listen(S2CProtocol.U_C_CLICKDATA, this, this.__dailyCount);
        ServerDataManager.listen(S2CProtocol.U_C_MONTH_CARD, this, this.__monthCardHandler);
        OfferRewardManager.Instance.addEventListener(RewardEvent.REWARD_TASK_FINISH, this.__finishRewardTaskHandler, this);
    }
    /**
     * 接收某些活动的完成次数（包括世界boss, 多人竞技, 战场, 悬赏）
     * 部分活动的完成次数客户端可获知
     * */
    private __dailyCount(evtData) {
        var pkg: PackageIn = evtData as PackageIn;
        var msg: ClickDatasRspMsg = pkg.readBody(ClickDatasRspMsg) as ClickDatasRspMsg;
        var acceptInfo: Array<any> = msg.info;
        var idStrr: string;
        var fightCount: number = 0;
        let datalist = this.dailyList;
        for (var i: number = 0; i < acceptInfo.length; i++) {
            switch (acceptInfo[i].keys) {
                case "5001"://赤眼狼王
                    idStrr = "1";
                    break;
                case "match"://多人竞技
                    idStrr = "2";
                    break;
                case "5002"://狂暴魔虫
                    idStrr = "3";
                    break;
                case "4001"://战场上
                case "4002"://战场下
                    idStrr = "4";
                    break;
                case "5003"://幽冥骨龙
                    idStrr = "5";
                    break;
                case "reward"://悬赏任务
                    idStrr = "9";
                    break;
                case "vehicle"://魔灵试炼
                    idStrr = "12";
                    break;
                case "minefield"://紫晶矿场
                    idStrr = "13";
                    break;
                case "pet"://英灵竞技
                    idStrr = "14";
                    break;
                default:
                    idStrr = "";
                    break;
            }
            for (const key in datalist) {
                if (Object.prototype.hasOwnProperty.call(datalist, key)) {
                    var info: DailyItemInfo = datalist[key];
                    if (info.TemplateId == idStrr) {
                        if (idStrr == "4") {
                            fightCount += acceptInfo[i].keyData;
                            info.currentFinsh = fightCount > info.MaxCount ? info.MaxCount : fightCount;
                        } else {
                            info.currentFinsh = acceptInfo[i].keyData > info.MaxCount ? info.MaxCount : acceptInfo[i].keyData;
                        }
                    }
                    if (info.TemplateId == "10" && idStrr == "2")//多人竞技
                    {
                        info.currentFinsh = acceptInfo[i].keyData > info.MaxCount ? info.MaxCount : acceptInfo[i].keyData;
                    }
                }
            }
        }
        this.dispatchEvent(DayGuideEvent.DAILY_ITEM_REFRESH);
    }
    /**
     * 剩余悬赏次数
     * */
    public get remainRewardCount(): number {
        let datalist = this.dailyList;
        for (const key in datalist) {
            if (Object.prototype.hasOwnProperty.call(datalist, key)) {
                var info: DailyItemInfo = datalist[key];
                if (info.TemplateId == "9") {
                    return info.MaxCount - info.currentFinsh;
                }
            }
        }
        return 0;
    }
    /**
     * 完成悬赏次数后立即更新
     * */
    private __finishRewardTaskHandler(evt) {
        let datalist = this.dailyList;
        for (const key in datalist) {
            if (Object.prototype.hasOwnProperty.call(datalist, key)) {
                var info: DailyItemInfo = datalist[key];
                if (info.TemplateId == "9" && info.currentFinsh < info.MaxCount) {
                    info.currentFinsh++;
                }
            }
        }
    }

    /**
     * 中控改变悬赏总次数
     * */
    public set maxRewardCount(value: number) {
        let datalist = this.dailyList;
        for (const key in datalist) {
            if (Object.prototype.hasOwnProperty.call(datalist, key)) {
                var info: DailyItemInfo = datalist[key];
                if (info.TemplateId == "9") {
                    info.MaxCount = value;
                }
            }
        }
        this.dispatchEvent(DayGuideEvent.DAILY_ITEM_REFRESH);
    }
    /**
     * 获得日常活动列表
     * */
    public get dailyList(): Array<any> {
        if (this._dailyInfoList.length == 0) {
            var list: DailyList = new DailyList();
            this._dailyInfoList = list.infoList;
        }
        for (const key in this._dailyInfoList) {
            if (Object.prototype.hasOwnProperty.call(this._dailyInfoList, key)) {
                var info: DailyItemInfo = this._dailyInfoList[key];
                switch (info.TemplateId) {
                    case "4": //战场
                        info.currentFinsh = Math.max(info.MaxCount - Math.max(this.playerInfo.warFieldCount, 0), 0);
                        break;
                    case "6"://英雄之门
                        info.currentFinsh = info.MaxCount - this.playerInfo.multiCopyCount;
                        if (info.currentFinsh < 0) {
                            info.currentFinsh = 0;
                        }
                        break;
                    case "7"://祝福轮盘
                        info.currentFinsh = this.playerInfo.seminaryCount;
                        break;
                    case "8"://个人挑战
                        info.currentFinsh = BuildingManager.Instance.model.getOrderById(10000).currentCount;
                        break;
                    case "11"://试炼之塔
                        info.currentFinsh = this.playerInfo.trialCount;
                        break;
                    case "15"://环任务
                        info.currentFinsh = RingTaskManager.Instance.model.rewardNum - 1;
                        break;
                    case "16"://藏宝图
                        info.currentFinsh = TreasureMapManager.Instance.model.rewardCount;
                        break;
                    case "17"://藏宝图
                        info.currentFinsh = SinglePassManager.Instance.model.count;
                        break;
                    case "18"://王者之塔
                        info.currentFinsh = KingTowerManager.Instance.kingTowerInfo.kingCount;
                        break;
                    default:
                        break;
                }
                if (info.currentFinsh > info.MaxCount)
                    info.currentFinsh = info.MaxCount;
            }
        }
        return this._dailyInfoList;
    }
    /**
     * 活动数据, 1.5.0已停用（精彩活动代替）
     * */
    private __dayActivityHandler(evtData) {
        var pkg: PackageIn = evtData as PackageIn;
        var msg: DayActiveRspMsg = pkg.readBody(DayActiveRspMsg) as DayActiveRspMsg;

        var arr: Array<any> = msg.dayActiveRspInfo;
        var len: number = arr.length;
        this._dayActiveList = [];

        for (var i: number = 0; i < len; i++) {
            var info: DayActionInfo = new DayActionInfo();
            info.endDate = DateFormatter.parse(arr[i].endDate, "YYYY-MM-DD hh:mm:ss").getTime();
            info.startDate = DateFormatter.parse(arr[i].startDate, "YYYY-MM-DD hh:mm:ss").getTime();
            info.sort = arr[i].sort;
            info.title = arr[i].title;
            info.activeId = arr[i].activeId;
            info.contents = arr[i].contents;
            info.description = arr[i].description;
            info.awardContent = arr[i].awardContent;
            info.actionTimeContent = arr[i].actionTimeContent;
            this._dayActiveList.push(info);
        }
        // this._dayActiveList.sortOn("sort", Array.NUMERIC);
    }

    public get dayActiveList(): Array<any> {
        return this._dayActiveList;
    }
    /**
     * 签到数据
     * */
    private __signHandler(evtData) {
        var pkg: PackageIn = evtData as PackageIn;
        var msg: PlayerSignRspMsg = pkg.readBody(PlayerSignRspMsg) as PlayerSignRspMsg;
        this.playerInfo.beginChanges();
        //'2024-01-23 00:00:00'新签到从5点开始
        let str = msg.signDate.split(' ')[0] + ' 05:00:00';
        this.playerInfo.signDate = new Date(str.replace(/-/g, '/'));
        this.playerInfo.signTimes = msg.signTimes;
        this.playerInfo.signSite = msg.signSite;
        this.playerInfo.reissueNum = msg.reissueNum;
        this.playerInfo.rewardState = msg.rewardState;
        this.playerInfo.hasGetData = true;
        this.playerInfo.commit();
    }

    /**
     * 月卡数据
     */
    private __monthCardHandler(evtData) {
        var pkg: PackageIn = evtData as PackageIn;
        var msg: MonthCardRsp = pkg.readBody(MonthCardRsp) as MonthCardRsp;
        this.playerInfo.beginChanges();
        let infos = msg.info;
        let monthCardInfos = [];
        for (const key in infos) {
            if (Object.prototype.hasOwnProperty.call(infos, key)) {
                let item = infos[key];
                let info = new MonthCardInfo(item);
                monthCardInfos.push(info);
            }
        }
        this.playerInfo.monthCardInfos = monthCardInfos;
        this.playerInfo.commit();
    }


    /**
     * 领取每日引导的数据更新
     * */
    protected __onLeedUpdateHandler(pkg: PackageIn) {
        var msg: LeedUpdatedRspMsg = new LeedUpdatedRspMsg();
        msg = pkg.readBody(LeedUpdatedRspMsg) as LeedUpdatedRspMsg;
        if (msg.state == 1) {//默认为0  为1 只更新totalNum,weekActive
            this._cate.beginChange();
            if (msg.hasOwnProperty("totalNum")) {
                this._cate.active = msg.totalNum;
            }
            if (msg.hasOwnProperty("weekActive")) {
                this._cate.weekActive = msg.weekActive;
            }
            this._cate.conmmitChange();
        } else {
            if (msg.hasOwnProperty("leed")) {
                for (var i: number = 0; i < msg.leed.length; i++) {
                    this.addLeedData(DayGuideHelper.readLeedInfo(msg.leed[i] as LeedData));
                }
            }
            this._cate.beginChange();
            if (msg.hasOwnProperty("leedProcess")) {
                this._cate.leedProcess = msg.leedProcess;
            }
            if (msg.hasOwnProperty("totalNum")) {
                this._cate.active = msg.totalNum;
            }
            if (msg.hasOwnProperty("weekActive")) {
                this._cate.weekActive = msg.weekActive;
            }
            this._cate.conmmitChange();
        }
    }

    /**
     * 领取每日引导的完成
     * */
    protected __onLeedReceiveHandler(pkg: PackageIn) {
        var msg: LeedFinishedRspMsg = pkg.readBody(LeedFinishedRspMsg) as LeedFinishedRspMsg;
        this._cate.beginChange();
        this._cate.leedProcess = msg.leedProcess;
        this._cate.conmmitChange();
    }
    /**
     * 每日引导的领取数据, 任务数据
     * */
    private addLeedData(info: LeedInfo) {
        if (this._cate.allList.hasOwnProperty(info.templateId))
            this.update(info);
        else
            this._cate.allList[info.templateId] = info;
    }

    private update(info: LeedInfo) {
        var item: LeedInfo = this._cate.allList[info.templateId];
        item.currentCount = info.currentCount;
        item.isComplete = info.isComplete;
    }

    public get cate(): DayGuideCatecory {
        return this._cate;
    }

    /**
     * 点击每日引导中的任务触发切换场景
     * */
    public switchScene(type: number) {
        var str: string = "";
        FrameCtrlManager.Instance.exit(EmWindow.Welfare);//跳转其他关闭福利界面
        switch (type) {
            case DayGuideCatecory.WATER_SELF_TREE:
            case DayGuideCatecory.WATER_FRIENDS_TREE:
            case DayGuideCatecory.GET_FRIUT:
            case DayGuideCatecory.FARM_HARVEST:
            case DayGuideCatecory.FARM_VISIT:
                this.openWaterFrame();
                break;
            case DayGuideCatecory.PASS_SINGLE_CAMPAIGN:
                SwitchPageHelp.gotoSingleCampaign()
                break;
            case DayGuideCatecory.PASS_MUL_CAMPAIGN:
                if (ArmyManager.Instance.thane.grades < OpenGrades.PVE_MUlTI_CAMPAIGN) {
                    str = LangManager.Instance.GetTranslation("dayGuide.DayGuideManager.command01");
                    MessageTipManager.Instance.show(str);
                    return;
                }
                if (!this.checkScene()) return;
                if (this.checkCampainOpen())
                    SwitchPageHelp.goSpaceAndFind(SpaceNodeType.ID_PVE_ROOMLIST);
                break;
            case DayGuideCatecory.TRIAL:
                if (ArmyManager.Instance.thane.grades < OpenGrades.PVE_MUlTI_CAMPAIGN) {
                    str = LangManager.Instance.GetTranslation("dayGuide.DayGuideManager.command01");
                    MessageTipManager.Instance.show(str);
                    return;
                }
                if (!this.checkScene()) return;
                if (this.thane.grades < OpenGrades.TRIAL) {
                    str = LangManager.Instance.GetTranslation("dayGuide.view.DailyItem.UnderLevel");
                    MessageTipManager.Instance.show(str);
                    return;
                }
                SwitchPageHelp.goSpaceAndFind(SpaceNodeType.ID_PVE_ROOMLIST);
                break;
            case DayGuideCatecory.INTENSIFY:
                SwitchPageHelp.gotoStoreFrame(GTabIndex.Forge_QH);
                break;
            case DayGuideCatecory.OCCUPY_FAILED:
            case DayGuideCatecory.PLUNDER:
                if (SceneManager.Instance.currentType == SceneType.CASTLE_SCENE) {
                    SwitchPageHelp.gotoOuterCity();
                } else if (SceneManager.Instance.currentType != SceneType.OUTER_CITY_SCENE) {
                    MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("tip.outercity"));
                }
                break;
            case DayGuideCatecory.CONTRIBUTE:
            case DayGuideCatecory.BLESS:
                SwitchPageHelp.gotoConsortiaFrame();
                break;
            case DayGuideCatecory.PVP:
                SwitchPageHelp.gotoPvpFrame();
                break;
            case DayGuideCatecory.CONSUME_GIFT_POINT:
                SwitchPageHelp.gotoShopFrame();
                break;
            case DayGuideCatecory.CONSUME_SMALL_BUGLE:
                if (!FrameCtrlManager.Instance.isOpen(EmWindow.ChatWnd)) {
                    FrameCtrlManager.Instance.open(EmWindow.ChatWnd, { type: 0 });
                }
                break;
            case DayGuideCatecory.STAR:
                SwitchPageHelp.gotoStarFrame();
                break;
            case DayGuideCatecory.WORLDBOSS:
                SwitchPageHelp.gotoWorldBossFrame();
                break;
            case DayGuideCatecory.COLOSSEUM:
                SwitchPageHelp.gotoColosseumFrame();
                break;
            case DayGuideCatecory.COMMOMTASK:
                //TODO
                // FrameCtrlManager.Instance.open(EmWindow.SpaceTaskInfoWnd,{callback:this.callBack});
                // FrameControllerManager.Instance.openControllerByInfo(UIModuleTypes.TASK, null, this.callBack);
                break;
            case DayGuideCatecory.HOOKROOM:
                SwitchPageHelp.gotoHookRoom();
                break;
            case DayGuideCatecory.MAZEROOM:
                SwitchPageHelp.gotoMazeFrame();
                break;
            case DayGuideCatecory.OFFERREWARD:
                SwitchPageHelp.gotoOfferRewardFrame();
                break;
            case DayGuideCatecory.WAR_FIGHT:
                SwitchPageHelp.gotoWorldFightFrame();
                break;
            case DayGuideCatecory.OFFER_REWARD:
                if (!this.checkScene()) return;
                SwitchPageHelp.goSpaceAndFind(SpaceNodeType.ID_OFFER_REWARD);
                break;
            case DayGuideCatecory.AMETHYST_FIELD:
                if (!this.checkScene()) return;
                SwitchPageHelp.goSpaceAndFind(SpaceNodeType.ID_AMETHYST_FIELD);
                break;
            case DayGuideCatecory.RING_TASK:
                if (!this.checkScene()) return;
                SwitchPageHelp.goSpaceAndFind(SpaceNodeType.ID_RING_TASK);
                break;
            case DayGuideCatecory.SEMINARYBLESS:
                if (this.thane.grades < OpenGrades.SEMINARY_ALTAR) {
                    str = LangManager.Instance.GetTranslation("dayGuide.DayGuideManager.command02", OpenGrades.SEMINARY_ALTAR);
                    MessageTipManager.Instance.show(str);
                    return;
                }
                break;
            case DayGuideCatecory.CONSORTIA_SHOP:
                if (PlayerManager.Instance.currentPlayerModel.playerInfo.consortiaID == 0) {
                    FrameCtrlManager.Instance.open(EmWindow.ConsortiaApply);
                } else {
                    if(ConsortiaManager.Instance.model.consortiaInfo.shopLevel > 0){
                        FrameCtrlManager.Instance.open(EmWindow.ShopWnd, { page: 1 });
                    }else{
                        MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("consortia.shop.unopen"));
                    }
                }
                break;
            case DayGuideCatecory.PET_JINGJI:
                if (!this.checkScene()) return;
                SwitchPageHelp.goSpaceAndFind(SpaceNodeType.ID_PET_CHALLENGE);
                break;
            case DayGuideCatecory.MYSTER_SHOP:
                FrameCtrlManager.Instance.open(EmWindow.OuterCityShopWnd);
                break;
            case DayGuideCatecory.WANGZHE:
                if (!this.checkScene()) return;
                SwitchPageHelp.goSpaceAndFind(SpaceNodeType.ID_PVE_ROOMLIST);
                break;
            case DayGuideCatecory.OUTER_GUAIWU:
            case DayGuideCatecory.OUTER_JINYING:
            case DayGuideCatecory.OUTER_BOSS:
                if (!this.checkScene()) return;
                SceneManager.Instance.setScene(SceneType.OUTER_CITY_SCENE);
                break;
            case DayGuideCatecory.EQUIP_XILIAN:
                FrameCtrlManager.Instance.open(EmWindow.Forge, { tabIndex: GTabIndex.Forge_XL });
                break;
            case DayGuideCatecory.FUSHI_FENJIE:
                FrameCtrlManager.Instance.open(EmWindow.Skill, { tabIndex: GTabIndex.Skill_FK })
                break;
            case DayGuideCatecory.PET_EQUIP_FENJIE:
                FrameCtrlManager.Instance.open(EmWindow.Pet, { tabIndex: GTabIndex.Pet_Euip });
                break;
            case DayGuideCatecory.SIGN_VIEW:
                FrameCtrlManager.Instance.open(EmWindow.Welfare, { str: LangManager.Instance.GetTranslation('welfareWnd.tabTitle.SignIn') });
                break;
            case DayGuideCatecory.PETLAND:
                if (!this.checkScene()) return;
                SwitchPageHelp.goSpaceAndFind(SpaceNodeType.ID_PET_LAND);
                break;
            case DayGuideCatecory.COST_POWER:
                //【活跃度】在英灵岛界面通过活跃度跳转至战役界面后, 未对挑战按钮添加限
                let mapModel = CampaignManager.Instance.mapModel;
                if(mapModel){
                    let mapId: number = CampaignManager.Instance.mapModel.mapId;
                    if (WorldBossHelper.checkPetLand(mapId)) {
                        let tip = LangManager.Instance.GetTranslation("dayGuide.DayGuideManager.command06");
                        MessageTipManager.Instance.show(tip)
                        return;
                    }
                }
                FrameCtrlManager.Instance.open(EmWindow.PveCampaignWnd);
                break;
            case DayGuideCatecory.ENTER_PETCAMPAIGN:
                if (!this.checkScene()) return;
                SwitchPageHelp.goSpaceAndFind(SpaceNodeType.PET_CAMPAIGN);
                break;
            case DayGuideCatecory.ENTER_SECRET_CAMPAIGN:
                if (!this.checkScene()) return;
                FrameCtrlManager.Instance.open(EmWindow.PveSecretWnd);
                break;
        }

    }
    private callBack() {
        //TODO
        // var frame: Frame = FrameControllerManager.Instance.taskControler.frame;
        // if (TaskManage.Instance.cate.completedList.length > 0) return;
        // var commonTaskList: Array = TaskManage.Instance.cate.commonTaskList;
        // if (frame.parent) {
        //     commonTaskList.sortOn(["isCompleted", 'Sort'], [Array.DESCENDING, Array.NUMERIC]);
        //     frame['selectedByInfo'] = commonTaskList[0];
        // }
    }
    private checkCampainOpen(): boolean {
        if (this.thane.grades >= OpenGrades.WORLD_BOSS) return true;
        this.showFaildMes();
        return false;
    }
    private checkScene(): boolean {
        return SwitchPageHelp.checkScene();
    }

    public openWaterFrame() {
        if (!this.checkScene()) return;
        // if (SceneManager.Instance.currentType != SceneType.CASTLE_SCENE && SceneManager.Instance.currentType != SceneType.SPACE_SCENE) {
        //     NotificationManager.Instance.addEventListener(NotificationEvent.SWITCH_SCENE, this.__sceneSwitchHandler, this);
        //     this._callback = this.openWaterFrame;
        //     SceneManager.Instance.setScene(SceneType.CASTLE_SCENE);
        //     return;
        // }
        if (this.thane.grades >= OpenGrades.FARM) {
            FarmManager.Instance.enterFarm();
        }
        else {
            this.showFaildMes();
        }
    }

    private __sceneSwitchHandler(event: Event) {
        NotificationManager.Instance.removeEventListener(NotificationEvent.SWITCH_SCENE, this.__sceneSwitchHandler, this);
        if (this._callback != null && SceneManager.Instance.currentType == SceneType.CASTLE_SCENE)
            this._callback();
        this._callback = null;
    }
    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }
    private get thane(): ThaneInfo {
        return ArmyManager.Instance.thane;
    }
    private showFaildMes(str: string = "") {
        if (str == "")
            str = LangManager.Instance.GetTranslation("dayGuide.DayGuideManager.command04");
        MessageTipManager.Instance.show(str);
    }

}