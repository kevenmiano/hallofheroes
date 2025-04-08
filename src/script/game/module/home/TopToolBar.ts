import LangManager from '../../../core/lang/LangManager';
import Logger from "../../../core/logger/Logger";
import { PackageIn } from '../../../core/net/PackageIn';
import { ServerDataManager } from '../../../core/net/ServerDataManager';
import BaseFguiCom from '../../../core/ui/Base/BaseFguiCom';
import UIButton from '../../../core/ui/UIButton';
import UIManager from '../../../core/ui/UIManager';
import { ArrayConstant, ArrayUtils } from '../../../core/utils/ArrayUtils';
import StringHelper from '../../../core/utils/StringHelper';
import { t_s_dropitemData } from '../../config/t_s_dropitem';
import { DropCondictionType } from '../../constant/DropContictionType';
import { BagEvent, CampaignEvent, ConsortiaEvent, DayGuideEvent, EmailEvent, ExpBackEvent, FunOpenEvent, FunnyEvent, GoldenSheepEvent, NotificationEvent, PassCheckEvent, QQ_HALL_EVENT, QuestionnaireEvent, ResourceEvent, SwitchEvent, WarlordsEvent, WorldBossEvent } from "../../constant/event/NotificationEvent";
import { PlayerEvent } from "../../constant/event/PlayerEvent";
import OpenGrades from "../../constant/OpenGrades";
import { S2CProtocol } from '../../constant/protocol/S2CProtocol';
import { EmPackName, EmWindow } from "../../constant/UIDefine";
import FeedBackItemData from '../../datas/feedback/FeedBackItemData';
import { PlayerInfo } from "../../datas/playerinfo/PlayerInfo";
import { PlayerModel } from '../../datas/playerinfo/PlayerModel';
import { ThaneInfo } from "../../datas/playerinfo/ThaneInfo";
import AllManExchangeManager from '../../manager/AllManExchangeManager';
import { ArmyManager } from "../../manager/ArmyManager";
import { CampaignManager } from '../../manager/CampaignManager';
import { DataCommonManager } from "../../manager/DataCommonManager";
import DayGuideManager from '../../manager/DayGuideManager';
import FeedBackManager from '../../manager/FeedBackManager';
import FirstPayManager from '../../manager/FirstPayManager';
import FunnyManager from '../../manager/FunnyManager';
import { GemMazeManager } from '../../manager/GemMazeManager';
import LuckyExchangeManager from '../../manager/LuckyExchangeManager';
import { MessageTipManager } from '../../manager/MessageTipManager';
import { MopupManager } from "../../manager/MopupManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { PlayerManager } from "../../manager/PlayerManager";
import QuestionnaireManager from '../../manager/QuestionnaireManager';
import { SharedManager } from '../../manager/SharedManager';
import { TempleteManager } from '../../manager/TempleteManager';
import WarlordsManager from '../../manager/WarlordsManager';
import { MineralCarInfo } from '../../map/campaign/data/MineralCarInfo';
import { SpaceSocketOutManager } from '../../map/space/SpaceSocketOutManager';
import { FrameCtrlManager } from '../../mvc/FrameCtrlManager';
import MineralModel from '../../mvc/model/MineralModel';
import FUIHelper from '../../utils/FUIHelper';
import { WorldBossHelper } from '../../utils/WorldBossHelper';
import FirstPayModel from '../firstpay/FirstPayModel';
import FunnyConditionType from '../funny/model/FunnyConditionType';
import FunnyExchangeItem from '../funny/view/FunnyExchangeItem';
import WarlordsModel from '../warlords/WarlordsModel';
import DegreeActivityBoxData from '../welfare/data/DegreeActivityBoxData';
import GrowthFundItemInfo from '../welfare/data/GrowthFundItemInfo';
import WelfareCtrl from '../welfare/WelfareCtrl';
import WelfareData from '../welfare/WelfareData';
import { WelfareManager } from '../welfare/WelfareManager';
import LuckExchangeTempMsg = com.road.yishi.proto.active.LuckExchangeTempMsg;
import ChallengeRankRewardMsg = com.road.yishi.proto.player.ChallengeRankRewardMsg;
import OnlineRewardInfoRsp = com.road.yishi.proto.active.OnlineRewardInfoRsp;
import { ConfigManager } from '../../manager/ConfigManager';
import SimpleAlertHelper from '../../component/SimpleAlertHelper';
import { SocketManager } from '../../../core/net/SocketManager';
import { C2SProtocol } from '../../constant/protocol/C2SProtocol';
import PetBossModel from '../petguard/PetBossModel';
import { SceneManager } from '../../map/scene/SceneManager';
import SceneType from '../../map/scene/SceneType';
import FoisonHornManager from '../../manager/FoisonHornManager';
import ComponentSetting from '../../utils/ComponentSetting';
import Utils from '../../../core/utils/Utils';
import ModelMgr from '../../manager/ModelMgr';
import { EmModel } from '../../constant/model/modelDefine';
import { UserModelAttribute } from '../../constant/model/UserModelParams';
import GoldenSheepManager from '../../manager/GoldenSheepManager';
import { DateFormatter } from '../../../core/utils/DateFormatter';
import { MonopolyManager } from '../../manager/MonopolyManager';
import { FormularySets } from '../../../core/utils/FormularySets';
import { ResourceManager } from '../../manager/ResourceManager';
import HomeWnd from './HomeWnd';
import ColorConstant from '../../constant/ColorConstant';
import { ResourceData } from '../../datas/resource/ResourceData';
import QQDawankaManager from '../../manager/QQDawankaManager';
import QQGiftManager from '../../manager/QQGiftManager';
import StackHeadStateMsg = com.road.yishi.proto.stackhead.StackHeadStateMsg;
import ConfigInfoManager from '../../manager/ConfigInfoManager';
import OutyardManager from '../../manager/OutyardManager';
import { ConsortiaControler } from '../consortia/control/ConsortiaControler';
import { ConsortiaModel } from '../consortia/model/ConsortiaModel';
import OutyardModel from '../outyard/OutyardModel';
import { SwitchPageHelp } from '../../utils/SwitchPageHelp';
import CarnivalManager from '../../manager/CarnivalManager';
import TemplateIDConstant from '../../constant/TemplateIDConstant';
import BaseTipItem from '../../component/item/BaseTipItem';
import { Int64Utils } from '../../../core/utils/Int64Utils';
import { ChargeLotteryManager } from "../../manager/ChargeLotteryManager";
import FunOpenManager from '../../manager/FunOpenManager';
import ExpBackModel from '../expback/model/ExpBackModel';
import { ConsortiaDutyInfo } from '../consortia/data/ConsortiaDutyInfo';
import PassportView from '../welfare/view/PassportView';
import ProductType from '../../constant/ProductType';
import { GoodsManager } from '../../manager/GoodsManager';
import { isOversea } from '../login/manager/SiteZoneCtrl';
import SevenGoalsManager from '../../manager/SevenGoalsManager';

// 排序也按照这个来
export enum MainBtnType {
    FUNNY = 0,//精彩活动
    WELFARE,//福利任务
    MINIGAME,//游戏盒子
    FIRSTPAY,//首充
    QUESTIONNAIRE,//问卷调查
    WORDLBOSS,//世界BOSS
    PVP,//多人竞技
    RVRBATTLE,//战场
    MULTILORD,//泰坦之战
    WARLORD,//众神之战
    WARlORD_REWARD,//众神之战奖励
    QQHALL_DAWANKA,//QQ大厅大玩咖
    QQHALL_GIFT,//QQ大厅特权礼包
    OUTYARD,//公会战
    CARNIVAL,//嘉年华
    MINTERAL,//紫金矿产双倍
    PETGUARD,//保卫英灵岛
    MYSTERYSHOP,//神秘商店
    MICROAPP,//微端Icon
    GOLDENSHEEL,//好运红包
    CROSS_PVP_REWARD,//跨服积分排名奖励
    PET_EXCHANGE,//英灵兑换
    EXP_BACK_FREE,//免费经验找回
    EXP_BACK_EXTRA,//额外经验找回
    ACTIVE_TIME,//活动日程
    SEVEN_GOALS,//七日目标
}

/**
 * @data: 2020-12-31 16:47
 */
export default class TopToolBar extends BaseFguiCom {

    //从右至左排列
    public static MainCount: number = 6;//列总数
    public static LineCount: number = 3;//行总数
    // public static btnPosArr: Laya.Point[] = [new Laya.Point(482, 35), new Laya.Point(387, 35), new Laya.Point(292, 35), new Laya.Point(197, 35), new Laya.Point(100, 35), new Laya.Point(5, 35),
    // new Laya.Point(482, 139), new Laya.Point(387, 139), new Laya.Point(292, 139), new Laya.Point(197, 139), new Laya.Point(100, 139), new Laya.Point(5, 139),
    // new Laya.Point(482, 239), new Laya.Point(387, 239), new Laya.Point(292, 239), new Laya.Point(197, 239), new Laya.Point(100, 239), new Laya.Point(5, 239)];
    public static btnPosArr: Laya.Point[] = []
    public btn_extend: UIButton;
    public btn_fold: UIButton;
    public Btn_more: UIButton;
    public btn_funOpen: UIButton;
    public btn_main0: UIButton;//首充
    public chargeBtn: UIButton;
    private c1: fgui.Controller;
    private c2: fgui.Controller;

    private _btnList: UIButton[] = [];

    private btnDataList: Array<MainMenuBtnData> = [];
    private btnMoreDataList: Array<MainMenuBtnData> = []
    private _worldBossVislble: boolean = false;
    private _getWardRewarFlag: boolean = false;
    private _countDown: number = 0;

    private _pvpCanJoin: boolean;
    private _pvpCanJoinLeftTime: number = 0;
    private _pvpOpenTimeArr: any[] = [];

    public voucherTxt: fgui.GTextField;
    public giftTxt: fgui.GTextField;
    public goldTxt: fgui.GTextField;
    private _needOpenOutyardOpenWnd: boolean = false;
    public diamond: BaseTipItem;
    public gift: BaseTipItem;
    public gold: BaseTipItem;
    constructor(container?: fgui.GComponent) {
        super(container);

        this.c1 = this.getController('c1');
        this.c2 = this.getController('c2');
        this.c1.selectedIndex = 0;
        this.addEvent();
        this.initPvpOpenTime();
        this.initDegreeActivityData();
        this.control.sendOnlineRewardReq(1);
        this.initGrowgrowthFundData();
        if (this.ctrlData.isPay != 4) {
            this.control.clickFundViewTab();
        }
        if (PlayerManager.Instance.currentPlayerModel.playerInfo.isSignOpen) {//七日登录开启
            if (this.ctrlData.sevenLoginRewardArr.length == 0) {
                this.control.requestSevenLoginInfo();
            }
        }
        if (PlayerManager.Instance.currentPlayerModel.playerInfo.isPassOpen) {//通行证开启
            WelfareManager.Instance.reqPassRewardInfo(1, 0, 0);
            WelfareManager.Instance.reqPassTaskInfo();
        }
        this.control.sendOnlineRewardReq(1);
        AllManExchangeManager.Instance.sendOpenView();

        this.initBtnPos();
        this.initTips();
        this.initResoueceTxt();
        this.chargeBtn.scaleParas.paraScale = 1;
        if (!FunOpenManager.Instance.newFunData) {
            FunOpenManager.Instance.checkNewFunOpen(this.thane.grades);
        }
    }

    private initTips() {
        this.diamond.setInfo(TemplateIDConstant.TEMP_ID_DIAMOND);
        this.gift.setInfo(TemplateIDConstant.TEMP_ID_GIFT);
        this.gold.setInfo(TemplateIDConstant.TEMP_ID_GOLD);
    }

    private initResoueceTxt() {
        this.__refreshGold();
        this.voucherTxt.text = FormularySets.toStringSelf(PlayerManager.Instance.currentPlayerModel.playerInfo.point, HomeWnd.STEP);
        this.giftTxt.text = FormularySets.toStringSelf(PlayerManager.Instance.currentPlayerModel.playerInfo.giftToken, HomeWnd.STEP);
        this.voucherTxt.color = PlayerManager.Instance.currentPlayerModel.playerInfo.point < 0 ? ColorConstant.RED_COLOR : ColorConstant.LIGHT_TEXT_COLOR;
    }

    private initBtnPos() {
        let maxCount = TopToolBar.MainCount * TopToolBar.LineCount;//生成总数
        this.btnDataList = ArrayUtils.sortOn(this.btnDataList, ["sort"], ArrayConstant.NUMERIC);
        this.btn_fold.visible = this.btnDataList.length > 0;

        for (let i = 0, len = maxCount; i < len; i++) {
            let uBtn: UIButton = this["btn_main" + i];
            if (uBtn) {
                TopToolBar.btnPosArr[i] = new Laya.Point(uBtn.x, uBtn.y)
            }
        }
    }

    private __refreshGold() {
        if (this.goldResData.count >= this.goldResData.limit) {
            this.goldTxt.color = ColorConstant.RED_COLOR;
        } else {
            this.goldTxt.color = ColorConstant.LIGHT_TEXT_COLOR;
        }
        this.goldTxt.text = FormularySets.toStringSelf(ResourceManager.Instance.gold.count, HomeWnd.STEP);
    }

    initBtnDataList() {
        this.btnDataList = [];

        if (this.isFirstChargeOpen) {
            this.createBtnData(MainBtnType.FIRSTPAY, FUIHelper.getItemURL(EmPackName.Home, "Btn_Eve_Recharge"), 3, LangManager.Instance.GetTranslation("TopToolBar.btnText6"));
        } else {
            this.removeBtnData(MainBtnType.FIRSTPAY);
        }
        if (this.thane.grades >= OpenGrades.FUNNY && !ComponentSetting.IOS_VERSION) {
            this.createBtnData(MainBtnType.FUNNY, FUIHelper.getItemURL(EmPackName.Home, "Btn_Eve_HotEvents"), 1, LangManager.Instance.GetTranslation("TopToolBar.btnText1"));
        }
        if (this.thane.grades >= OpenGrades.WELFARE) {
            this.createBtnData(MainBtnType.WELFARE, FUIHelper.getItemURL(EmPackName.Home, "Btn_Eve_Welfare"), 2, LangManager.Instance.GetTranslation("TopToolBar.btnText2"));
        }
        if (QuestionnaireManager.Instance.model.questionnaireVisible && this.thane.grades >= OpenGrades.QUESTION_NAIRE) {
            this.createBtnData(MainBtnType.QUESTIONNAIRE, FUIHelper.getItemURL(EmPackName.Home, "Btn_Eve_Survey"), 4, LangManager.Instance.GetTranslation("TopToolBar.btnText7"));
        }
        if (this.isMineralDouble && this.thane.grades >= OpenGrades.MINERAL_DOUBLE && this.mineralModel && this.mineralModel.maxCount > 0 && !WorldBossHelper.checkMineral(CampaignManager.Instance.mapId)) {//紫金矿产双倍
            this.createBtnData(MainBtnType.MINTERAL, FUIHelper.getItemURL(EmPackName.Home, "Btn_Eve_Amethyst"), 99, LangManager.Instance.GetTranslation("TopToolBar.btnText8"));
        }
        if (this.thane.grades >= OpenGrades.MULTILORD && ComponentSetting.MULTILORD) {
            this.createBtnData(MainBtnType.MULTILORD, FUIHelper.getItemURL(EmPackName.Home, "Btn_Eve_Titan"), 8, LangManager.Instance.GetTranslation("ui.toptoolbar.TopToolsBar.tipData_multilords"));
        }
        if (this.playerInfo.canAcceptCrossScoreAward && this.thane.grades >= OpenGrades.RVR) {
            this.createBtnData(MainBtnType.CROSS_PVP_REWARD, FUIHelper.getItemURL(EmPackName.Home, "Btn_Eve_CrossServerRewards"), 99, LangManager.Instance.GetTranslation("mainBar.TopToolsBar.crossPvpAwardBtnTipData"));
        }
        if (this.thane.grades >= OpenGrades.MYSTERIOUS) {
            this.createBtnData(MainBtnType.MYSTERYSHOP, FUIHelper.getItemURL(EmPackName.Home, "Btn_Eve_MysteryShop"), 99, LangManager.Instance.GetTranslation("HigherGradeOpenTipView.content17"));
        }
        if (Utils.isQQHall()) {
            this.createBtnData(MainBtnType.QQHALL_DAWANKA, FUIHelper.getItemURL(EmPackName.Home, "Btn_Eve_QQ"), 9, "");
            if (ConfigManager.info.QQ_HALL_GIFT) {
                this.createBtnData(MainBtnType.QQHALL_GIFT, FUIHelper.getItemURL(EmPackName.Home, "Btn_Eve_qq1"), 10, LangManager.Instance.GetTranslation("QQ.Hall.Gift.QQIcon"));
            }
        }
        if (this.thane.grades >= OpenGrades.PET) {
            let showPetboss: boolean = true;
            if (SceneManager.Instance.currentType == SceneType.CAMPAIGN_MAP_SCENE) {
                if (WorldBossHelper.checkPetLand(CampaignManager.Instance.mapModel.mapId) || WorldBossHelper.checkInPetBossFloor(CampaignManager.Instance.mapModel.mapId)) {
                    showPetboss = false;
                }
            }
            if (showPetboss) {
                this.createBtnData(MainBtnType.PETGUARD, FUIHelper.getItemURL(EmPackName.Home, "Btn_Eve_DefendSylphAtoll"), 7, LangManager.Instance.GetTranslation("TopToolBar.petGuard"));
            }
        }
        if (ExpBackModel.instance.openState == 1) {
            this.createBtnData(MainBtnType.EXP_BACK_FREE, FUIHelper.getItemURL(EmPackName.Home, "Btn_Eve_Gift"), 9999, LangManager.Instance.GetTranslation("TopToolBar.btnText_expFree"), 0, true);
            this.setTabBtnState(MainBtnType.EXP_BACK_FREE, true);
        } else {
            this.removeBtnData(MainBtnType.EXP_BACK_FREE);
        }
        if (ExpBackModel.instance.openState == 2) {
            this.createBtnData(MainBtnType.EXP_BACK_EXTRA, FUIHelper.getItemURL(EmPackName.Home, "Btn_Eve_Gift"), 9999, LangManager.Instance.GetTranslation("TopToolBar.btnText_expExtra"), 0, true);

        } else {
            this.removeBtnData(MainBtnType.EXP_BACK_EXTRA);
        }

        if (isOversea()) {
            if (this.thane.grades >= OpenGrades.ACTIVITY_TIME) {
                this.createBtnData(MainBtnType.ACTIVE_TIME, FUIHelper.getItemURL(EmPackName.Home, "Btn_Eve_Calendar"), 9999, LangManager.Instance.GetTranslation("TopToolBar.activeTime"));
            } else {
                this.removeBtnData(MainBtnType.ACTIVE_TIME);
            }
        }

        let mapModel = CampaignManager.Instance.mapModel
        if (mapModel && WorldBossHelper.checkPetLand(mapModel.mapId)) {
            this.createBtnData(MainBtnType.PET_EXCHANGE, FUIHelper.getItemURL(EmPackName.Home, "Btn_Main_Sylph"), 9999, LangManager.Instance.GetTranslation("TopToolBar.btnText11"), 0, false);
        } else {
            this.removeBtnData(MainBtnType.PET_EXCHANGE);
        }

        /**
         * check接口里面有刷新数据功能, 如果还有刷新视图功能需加上needRefresh防止循环调用
         */
        this.checkMiniGame(false);
        this.checkMicroApp(false);
        this.checkPVP(false);
        this.checkRvrBattle(false);
        this.checkOutyard(false);
        this.checkCarnival(false);
        this.checkWorldBoss();
        this.checkWarlords();
        this.checkWarlordsReward();
        this.checkGoldenSheep();
        this.checkSevenGoals();
        this.btnMoreDataList = [];
    }

    private updateDegreeActivityData() {
        if (this.thane.grades < OpenGrades.WELFARE) return;

        let nowDate: Date = PlayerManager.Instance.currentPlayerModel.sysCurtime
        if (nowDate && nowDate.getHours() == 5 && nowDate.getMinutes() == 0) {
            this.control.requestRefreshActivity();
        }
    }

    private get isShowOutyard(): boolean {
        let flag: boolean = false;
        if (!ComponentSetting.CONSORTIA_GVG) return flag;
        if (PlayerManager.Instance.currentPlayerModel.playerInfo.consortiaID == 0) {
            return flag;
        }
        let stateMsg: StackHeadStateMsg = OutyardManager.Instance.stateMsg;
        if (!stateMsg) return flag;
        //如果能报名 确没有报名
        if (stateMsg.canSignin && !stateMsg.myGuildSignup
            && this.outyardModel.checkIsOpenDay()
            && PlayerManager.Instance.currentPlayerModel.sysCurtime.getHours() >= 1) {
            flag = true;
        } else {
            if (stateMsg.state != OutyardModel.NOT_OPEN && this.outyardModel.checkIsOpenDay()
                && PlayerManager.Instance.currentPlayerModel.sysCurtime.getHours() >= 1) {
                flag = true;
            }
        }
        return flag;
    }

    private checkOutyard(needRefresh: boolean = true) {
        if (this.thane.grades < OpenGrades.CONSORTIA) return false;

        let flag = this.isShowOutyard;
        let preVisible = this.checkIsInListByType(MainBtnType.OUTYARD)
        if (flag) {
            this.createBtnData(MainBtnType.OUTYARD, FUIHelper.getItemURL(EmPackName.Home, "Btn_Eve_Outland"), 0, LangManager.Instance.GetTranslation("gvg.view.ready.GvgReadyFrame.title"));
        } else {
            this.removeBtnData(MainBtnType.OUTYARD);
        }

        // 频繁调用, 判断优化
        needRefresh = needRefresh && (flag != preVisible)
        if (needRefresh) {
            this.refreshBtnViews()
        } else {
            this.__refreshOutyardBtnStatus()
        }
    }

    private checkGoldenSheep() {
        let flag: boolean = GoldenSheepManager.Instance.model.getTopBtnShow();
        if (ComponentSetting.GOLDEN_SHEEP && flag) {
            let titleStr: string = LangManager.Instance.GetTranslation("mainBar.TopToolsBar.goldensheep");
            this.createBtnData(MainBtnType.GOLDENSHEEL, FUIHelper.getItemURL(EmPackName.Home, "Btn_Eve_GoldenSheep"), 99, titleStr);
        } else {
            this.removeBtnData(MainBtnType.GOLDENSHEEL);
        }
    }

    private checkSevenGoals() {
        let grade: number = parseInt(TempleteManager.Instance.getConfigInfoByConfigName("seventarget_Grade").ConfigValue);
        if (this.thane.grades >= grade && DataCommonManager.playerInfo.isTargetOpen) {//七日目标
            let titleStr: string = LangManager.Instance.GetTranslation("mainBar.TopToolsBar.sevenGoals");
            this.createBtnData(MainBtnType.SEVEN_GOALS, FUIHelper.getItemURL(EmPackName.Home, "Icon_7Target"), 99, titleStr);
            SevenGoalsManager.Instance.requestTaskInfo();//请求七日任务活动数据
        }else{
            this.removeBtnData(MainBtnType.SEVEN_GOALS);
        }
    }

    private onCheckMysteryShop() {
        if (ArmyManager.Instance.thane.grades >= OpenGrades.MYSTERIOUS) {
            this.createBtnData(MainBtnType.MYSTERYSHOP, FUIHelper.getItemURL(EmPackName.Home, "Btn_Eve_MysteryShop"), 99, LangManager.Instance.GetTranslation("HigherGradeOpenTipView.content17"));
        } else {
            this.removeBtnData(MainBtnType.MYSTERYSHOP);
        }
    }

    checkMiniGame(needRefresh: boolean = true) {
        let gemMazeOpen: boolean = false;//宝石迷阵
        if (ConfigManager.info.GEMMAZE) {
            if (ArmyManager.Instance.thane.grades >= OpenGrades.GEM_MAZE) {
                let curDay = PlayerManager.Instance.currentPlayerModel.sysCurtime.getDay();
                if (curDay == 0) {
                    curDay = 7;
                }
                if (GemMazeManager.Instance.model.openDay.indexOf(curDay.toString()) != -1) {
                    gemMazeOpen = true;
                }
            }
        } else {
            gemMazeOpen = false;
        }
        let monopolyOpen: boolean = false;//云端历险
        if (ConfigManager.info.MONOPOLY) {
            if (ArmyManager.Instance.thane.grades >= OpenGrades.GEM_MAZE) {
                let curDay = PlayerManager.Instance.currentPlayerModel.sysCurtime.getDay();
                if (curDay == 0) {
                    curDay = 7;
                }
                if (MonopolyManager.Instance.model.openDay.indexOf(curDay.toString()) != -1) {
                    monopolyOpen = true;
                }
            }
        } else {
            monopolyOpen = false;
        }

        if (gemMazeOpen || monopolyOpen) {
            MonopolyManager.Instance.setup();
            this.createBtnData(MainBtnType.MINIGAME, FUIHelper.getItemURL(EmPackName.Home, "Btn_Eve_GameBox"), 1, LangManager.Instance.GetTranslation("TopToolBar.btnText9"));
        } else {
            this.removeBtnData(MainBtnType.MINIGAME);
        }

        if (needRefresh) {
            this.refreshBtnViews()
        }
    }

    checkMicroApp(needRefresh: boolean = true) {
        let isMicroPlat = false;
        let terminalCfg = TempleteManager.Instance.getConfigInfoByConfigName("Microterminal_Platform");
        if (terminalCfg) {
            let curChannelID = ModelMgr.Instance.getProperty(EmModel.USER_MODEL, UserModelAttribute.channelId);
            let cfgValue = terminalCfg.ConfigValue;
            let plats = cfgValue.split(",");
            if (plats.indexOf(curChannelID) != -1) {
                isMicroPlat = true;
            }
        }

        if (isMicroPlat && !PlayerManager.Instance.hasRecMicroAppReward && ConfigManager.info.MICRO_APP) {
            this.createBtnData(MainBtnType.MICROAPP, FUIHelper.getItemURL(EmPackName.Home, "Btn_Eve_Micro"), 99, LangManager.Instance.GetTranslation("mainBar.TopToolsBar.microterminal"));
        } else {
            this.removeBtnData(MainBtnType.MICROAPP);
        }

        if (needRefresh) {
            this.refreshBtnViews();
        }
    }

    initPvpOpenTime() {
        let str = TempleteManager.Instance.getConfigInfoByConfigName("MatchTime").ConfigValue;
        let array = str.split("|")
        this._pvpOpenTimeArr = []
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            let temp = element.split(",")

            var starray: any[] = temp[0].split(":");
            var endarray: any[] = temp[1].split(":");
            let startTimeMin = Number(starray[0]) * 60 + Number(starray[1])
            let endTimeMin = Number(endarray[0]) * 60 + Number(endarray[1])
            let obj = { startTimeMin: startTimeMin, endTimeMin: endTimeMin }
            this._pvpOpenTimeArr.push(obj)
        }
    }

    checkPVP(needRefresh: boolean = true) {
        if (this.thane.grades < OpenGrades.CHALLENGE) {
            return;
        }

        let curDate: Date = PlayerManager.Instance.currentPlayerModel.sysCurtime;
        let curTimeMin = curDate.getHours() * 60 + curDate.getMinutes();
        // Logger.info("XXXX", curDate.getTime(), curDate.getHours(), curDate.getMinutes(), curTimeMin)

        let flag = false
        this._pvpCanJoinLeftTime = 0;
        for (let index = 0; index < this._pvpOpenTimeArr.length; index++) {
            const element = this._pvpOpenTimeArr[index];
            if (curTimeMin >= element.startTimeMin - 15 && curTimeMin <= element.endTimeMin) {
                flag = true;
                this._pvpCanJoinLeftTime = Math.ceil(Math.abs(curTimeMin - element.startTimeMin))
                break;
            }
        }

        let preVisible = this.checkIsInListByType(MainBtnType.PVP)
        if (flag) {
            this.createBtnData(MainBtnType.PVP, FUIHelper.getItemURL(EmPackName.Home, "Btn_Main_Arena"), 0, LangManager.Instance.GetTranslation("TopToolBar.btnText13"));
        } else {
            this.removeBtnData(MainBtnType.PVP);
        }

        // 频繁调用, 判断优化
        needRefresh = needRefresh && (flag != preVisible)
        if (needRefresh) {
            this.refreshBtnViews();
        } else {
            this.__refreshPvpBtnstatus()
        }
    }

    /**
     * 刷新所有按钮的状态
     */
    refreshBtnViews() {
        this.initBtnDataList();
        this.initBtnViewList();
        this.removeEvent();
        this.addEvent();
        this.__refreshAllRedDot();
        this.__refreshAllBtnStatus();
    }

    // 刷新红点
    private __refreshAllRedDot() {
        this.__refreshFunnyHandler();
        this.__refreshWelfareRedPoint();
        this.__refreshQuestionRedPoint();
        this.__refreshCrossPvpRewardRedPoint();
        this.__refreshFirstPayRedPoint();
        this.__refreshCarnivalRedPoint();
        this.__refreshQQGiftRedPoint();
        this.__refreshQQHallRedPoint();
        this._refreshExpBackRedPoint();
        this._refreshSevenGoalsRedPoint();
    }

    private _refreshExpBackRedPoint() {
        if (ExpBackModel.instance.openState == 1) {
            this.setTabBtnState(MainBtnType.EXP_BACK_FREE, true);
        }
        if (ExpBackModel.instance.openState == 2) {
            this.setTabBtnState(MainBtnType.EXP_BACK_EXTRA, false);
        }
    }

    // 刷新光效
    private __refreshAllBtnStatus() {
        this.__refreshWorldBossBtnstatus();
        this.__refreshPetBossBtnStatus();
        this.__refreshWarlordsBtnStatus();
        this.__refreshCarnivalBtnStatus();
        this.__refreshOutyardBtnStatus();
        this.__refreshMineralBtnStatus();
        this.__refreshRvrBattleBtnStatus();
        this.__refreshPvpBtnstatus();
        this.__refreshFirstPayBtnStatus();
    }

    /**
     * 创建按钮
     * @param type
     * @param icon
     * @param order
     * @param title
     * @param openLevel 开放等级
     * @param canFold   按钮是否可收起
     */
    private createBtnData(type: number = 0, icon: string = "", order: number = 0, title: string = "", openLevel: number = 0, canFold: boolean = true) {
        let data = new MainMenuBtnData();
        data.type = type;
        data.icon = icon;
        data.sort = type;
        data.title = title;
        data.grade = openLevel;
        data.canFold = canFold;
        if (!this.checkIsInList(data)) {
            this.btnDataList.push(data);
        }
    }

    private checkIsInList(data: MainMenuBtnData): boolean {
        let flag: boolean = false;
        let item: MainMenuBtnData;
        for (let i: number = 0; i < this.btnDataList.length; i++) {
            item = this.btnDataList[i];
            if (item && data && item.type == data.type) {
                flag = true;
                break;
            }
        }
        return flag;
    }

    private checkIsInListByType(type: number): boolean {
        let flag: boolean = false;
        let item: MainMenuBtnData;
        for (let i: number = 0; i < this.btnDataList.length; i++) {
            item = this.btnDataList[i];
            if (item && item.type == type) {
                flag = true;
                break;
            }
        }
        return flag;
    }

    /**移除按钮 */
    private removeBtnData(type: number = 0) {
        let maxCount = this.btnDataList.length;//按钮总数
        for (let i = 0, len = maxCount; i < len; i++) {
            let data = this.btnDataList[i];
            if (data && data.type == type) {
                this.btnDataList.splice(i, 1);
                break;
            }
        }
    }

    /**更多 */
    private createMoreBtnData(type: number = 0, icon: string = "", MainIndex: number = 0, SubIndex: number = 0, title: string = "") {
        let data = new MainMenuBtnData();
        data.type = type;
        data.icon = icon;
        data.MainIndex = MainIndex;
        data.SubIndex = SubIndex;
        data.title = title;
        this.btnMoreDataList.push(data);
    }

    /**更多 */
    private removeMoreBtnData(type: number = 0) {
        let count = this.btnMoreDataList.length;
        for (let i = 0, len = count; i < len; i++) {
            let data = this.btnMoreDataList[i];
            if (data && data.type == type) {
                this.btnMoreDataList.splice(i, 1);
                break;
            }
        }
    }

    private checkWarlords() {
        var warlordsModel: WarlordsModel = WarlordsManager.Instance.model;
        if (!warlordsModel) return;
        var beginTime: number = warlordsModel.getMatchDate(1).getTime() / 1000 - 259200;  //提前3天
        var curTime: number = PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond;
        var endTime: number = WarlordsManager.Instance.model.getMatchDate(5).getTime() / 1000;
        var isOpenTime: boolean = ((curTime > beginTime && curTime < endTime) || this.checkWarlordsProcess());
        if (ComponentSetting.WARLORD && this.thane.grades >= WarlordsModel.BET_OPEN_GRADE && isOpenTime) {
            let titleStr: string = LangManager.Instance.GetTranslation("mainBar.TopToolsBar.warlordsBtnTipData");
            this.createBtnData(MainBtnType.WARLORD, FUIHelper.getItemURL(EmPackName.Home, "Btn_Eve_ClassWars"), 8, titleStr);
        } else {
            this.removeBtnData(MainBtnType.WARLORD);
        }
    }

    private checkWarlordsReward() {
        if (WarlordsManager.Instance.model.rewardState > 0 && !this._getWardRewarFlag) {
            let titleStr: string = LangManager.Instance.GetTranslation("mainBar.TopToolsBar.warlordsBtnTipData2");
            this.createBtnData(MainBtnType.WARlORD_REWARD, FUIHelper.getItemURL(EmPackName.Home, "Btn_jingcai"), 9, titleStr);
        } else {
            this.removeBtnData(MainBtnType.WARlORD_REWARD);
        }
    }

    private checkWarlordsProcess(): boolean {
        switch (WarlordsManager.Instance.model.process) {
            case WarlordsModel.PROCESS_PRELIM:
            case WarlordsModel.PROCESS_FINAL:
            case WarlordsModel.PROCESS_BET:
                return true;
                break;
            default:
                return false;
        }
    }

    // 不要直接调用,会导致按钮状态有问题
    private initBtnViewList() {
        this._btnList = [];
        this.Btn_more.visible = this.btnMoreDataList.length > 0;
        this.btn_funOpen.y = this.Btn_more.visible ? 270 : 177;
        this.btn_funOpen.view.getController('bg').selectedIndex = 1;
        this.btn_extend.visible = false;
        let maxCount = TopToolBar.MainCount * TopToolBar.LineCount;//生成总数
        this.btnDataList = ArrayUtils.sortOn(this.btnDataList, ["sort"], ArrayConstant.NUMERIC);
        this.btn_fold.visible = this.btnDataList.length > 0;

        for (let i = 0, len = maxCount; i < len; i++) {
            let uBtn: UIButton = this["btn_main" + i];
            let data = this.btnDataList[i];
            if (uBtn) {
                UIButton.setEffect(uBtn.view, 0);
                if (data) {
                    if (!data.canFold) {
                        this.btn_extend.visible = true;
                        uBtn.visible = false;
                        this.btn_extend.x = TopToolBar.btnPosArr[i].x;
                        this.btn_extend.y = TopToolBar.btnPosArr[i].y;
                        this.btn_extend.icon = data.icon;
                        this.btn_extend.title = data.title;
                        this.btn_extend.view.data = data;
                    }
                    else {
                        data.btn = uBtn;
                        uBtn.title = data.title;
                        uBtn.icon = data.icon;
                        uBtn.selectedIcon = data.icon;
                        uBtn.view.data = data;
                        uBtn.visible = true;
                        data.setRedPoint(false, 0)
                        this._btnList.push(uBtn);
                    }
                } else {
                    uBtn.title = "";
                    uBtn.icon = "";
                    uBtn.selectedIcon = "";
                    uBtn.view.data = null;
                    uBtn.visible = false;
                }
            }
        }
    }

    private get isMineralDouble(): boolean {
        return PlayerManager.Instance.currentPlayerModel.playerInfo.mineralIsOpen;
    }

    /**切换收缩时候自动关闭才控制器 */
    private onChangeController() {
        this.c2.selectedIndex = 0;
    }

    private addEvent() {
        this.c1.on(fairygui.Events.STATE_CHANGED, this, this.onChangeController);
        this.chargeBtn.onClick(this, this.chargeBtnHandler);
        for (let i = 0, len = this._btnList.length; i < len; i++) {
            const btn = this._btnList[i];
            btn && btn.onClick(this, this.onBtnListHClickItem);
        }
        this.btn_funOpen.onClick(this, this.onFunOpen);
        this.btn_extend.onClick(this, this.onBtnListHClickItem);
        this.playerInfo.addEventListener(PlayerEvent.MINERAL, this._onMineralChange, this);
        this.mineralModel.addEventListener(CampaignEvent.UPDATE_MINERAL_INFO, this._onMineralChange, this);
        this.playerInfo.addEventListener(PlayerEvent.FIRSTCHARGE, this.__firstChargeHandler, this);
        NotificationManager.Instance.addEventListener(NotificationEvent.FIRSTPAY_DATA_UPDATE, this.__firstChargeHandler, this);
        this.playerInfo.addEventListener(PlayerEvent.WORLDBOSSSTATE, this.heroLevelUpdate, this);
        NotificationManager.Instance.addEventListener(WorldBossEvent.UPDATE_WARFIGHT_STATE_LIST, this.checkRvrBattle, this);
        ArmyManager.Instance.thane.addEventListener(PlayerEvent.THANE_LEVEL_UPDATE, this.heroLevelUpdate, this);
        FunnyManager.Instance.addEventListener(FunnyEvent.REFRESH_ITEM, this.__refreshFunnyHandler, this);
        DayGuideManager.Instance.addEventListener(DayGuideEvent.DAILY_AWARD_STATE, this.__refreshWelfareRedPoint, this);
        QuestionnaireManager.Instance.model.addEventListener(QuestionnaireEvent.QUESTIONNAIRE_CHANGE, this.updateQuestionVisible, this);
        WarlordsManager.Instance.model.addEventListener(WarlordsEvent.REWARD_STATE_CHANGE, this.refreshBtnViews, this);
        NotificationManager.Instance.addEventListener(FunnyEvent.REMAIN_STATE, this.__refreshFunnyHandler, this);
        this.playerInfo.addEventListener(PlayerEvent.PLAYER_SIGNSITE_CHANGE, this.__refreshWelfareRedPoint, this);
        this.playerInfo.addEventListener(PlayerEvent.REWARDSTATE_CHANGE, this.__refreshWelfareRedPoint, this);
        NotificationManager.Instance.addEventListener(NotificationEvent.LEVEL_GIFT_UPDATE, this.__refreshWelfareRedPoint, this);
        DayGuideManager.Instance.cate.addEventListener(DayGuideEvent.LEED_PROGRESS_CHANGE, this.__refreshWelfareRedPoint, this);
        DayGuideManager.Instance.cate.addEventListener(DayGuideEvent.ACTIVE_CHANGE, this.__refreshWelfareRedPoint, this);
        DayGuideManager.Instance.cate.addEventListener(DayGuideEvent.WEEK_ACTIVE_CHANGE, this.__refreshWelfareRedPoint, this);
        NotificationManager.Instance.addEventListener(NotificationEvent.SEVEN_GOALS_TASK_UPDATE, this._refreshSevenGoalsRedPoint, this);
        NotificationManager.Instance.addEventListener(NotificationEvent.SEVEN_GOALS_TASKGET_UPDATE, this._refreshSevenGoalsRedPoint, this);
        NotificationManager.Instance.addEventListener(NotificationEvent.SEVEN_LOGIN_REWARD_UPDATE, this.__refreshWelfareRedPoint, this);
        NotificationManager.Instance.addEventListener(NotificationEvent.GROWTH_FUND_UPDATE, this.__refreshWelfareRedPoint, this);
        NotificationManager.Instance.addEventListener(NotificationEvent.PASS_CHECK_AWARD_STATE, this.__refreshWelfareRedPoint, this);
        NotificationManager.Instance.addEventListener(ExpBackEvent.UPDATE_INFO, this.__refreshWelfareRedPoint, this);
        NotificationManager.Instance.addEventListener(EmailEvent.WELFARE_BIND_STATE, this.__refreshWelfareRedPoint, this);
        NotificationManager.Instance.addEventListener(NotificationEvent.LUCK_EXCHANGE_BTN_STATUS_CHANGE, this.__refreshFunnyHandler, this);
        ServerDataManager.listen(S2CProtocol.U_C_ONLINE_REWARD, this, this.onLineRewardBack);
        ServerDataManager.listen(S2CProtocol.U_C_CROSS_SCORE_REWARD_RESULT, this, this.onCrossScoreRewardHandler);
        NotificationManager.Instance.addEventListener(NotificationEvent.FOISONHORN_RED_CHANGE, this.__refreshFunnyHandler, this);
        NotificationManager.Instance.addEventListener(NotificationEvent.FOISONHORN_INFO_CHANGE, this.__refreshFunnyHandler, this);
        NotificationManager.Instance.addEventListener(SwitchEvent.SWITCH_GEMMAZE, this.checkMiniGame, this);//夺宝奇兵开关切换
        NotificationManager.Instance.addEventListener(PlayerEvent.MICRO_APP_EVENT, this.checkMicroApp, this);
        NotificationManager.Instance.addEventListener(SwitchEvent.MICRO_APP, this.checkMicroApp, this);
        GoldenSheepManager.Instance.model.addEventListener(GoldenSheepEvent.STATE_UPDATE, this.updateGoldenSheepVisible, this);
        PlayerManager.Instance.currentPlayerModel.playerInfo.addEventListener(PlayerEvent.PLAYER_INFO_UPDATE, this.initResoueceTxt, this);
        ResourceManager.Instance.gold.addEventListener(ResourceEvent.RESOURCE_UPDATE, this.__refreshGold, this);
        NotificationManager.Instance.addEventListener(SwitchEvent.SWITCH_MAP_SHOP, this.onCheckMysteryShop, this);
        QQDawankaManager.Instance.model.addEventListener(QQ_HALL_EVENT.GARDE_CHANGE, this.__refreshQQHallRedPoint, this);
        QQGiftManager.Instance.model.addEventListener(QQ_HALL_EVENT.GIFT_CHANGE, this.__refreshQQGiftRedPoint, this);
        NotificationManager.Instance.addEventListener(NotificationEvent.OUTYARD_OPEN_FRAME, this.openOutyardOpenWnd, this);
        NotificationManager.Instance.addEventListener(NotificationEvent.REFRESH_TOPTOOLS, this.checkCarnival, this);
        NotificationManager.Instance.addEventListener(NotificationEvent.CHARGELOTTERY_RESULT_UPDATE, this.__refreshFunnyHandler, this);
        if (this.playerModel) this.playerModel.addEventListener(NotificationEvent.UPDATE_SYSTEM_TIME, this.__updateSystemTime, this);
        CarnivalManager.Instance.addEventListener(CarnivalManager.EVENT_UPDATE, this.onCarnivalUpdate, this);
        NotificationManager.Instance.addEventListener(FunOpenEvent.UPDATE_FUNOPEN_STATE, this.checkNewFun, this);
        //最小化或者被其他窗口挡住都会触发, 可见状态改变
        Laya.stage.on(Laya.Event.VISIBILITY_CHANGE, this, this.onVisible);
        this.playerInfo.addEventListener(PlayerEvent.CONSORTIA_CHANGE, this.checkOutyard, this);
        if (this.warlordsModel) this.warlordsModel.addEventListener(WarlordsEvent.DATE_INIT_COMPLETE, this.refreshBtnViews, this);
        NotificationManager.Instance.addEventListener(ExpBackEvent.UPDATE_EXPBACK_STATUS, this.refreshBtnViews, this);
        NotificationManager.Instance.addEventListener(ConsortiaEvent.GOTO_GUILD_FIGHT, this.enterOutyardScene, this);
        NotificationManager.Instance.addEventListener(PassCheckEvent.PASS_TASK_FRESH, this.__refreshWelfareRedPoint, this);
        GoodsManager.Instance.addEventListener(BagEvent.UPDATE_BAG, this.onCarnivalUpdate, this);
        GoodsManager.Instance.addEventListener(BagEvent.DELETE_BAG, this.onCarnivalUpdate, this);
    }

    private get warlordsModel(): WarlordsModel {
        return WarlordsManager.Instance.model;
    }

    private __updateSystemTime() {
        this.checkPVP(true)
        this.checkOutyard(true)

        this.updateDegreeActivityData()
    }

    updateQuestionVisible() {
        this.refreshBtnViews();
    }

    onCarnivalUpdate() {
        this.__refreshCarnivalBtnStatus()
        this.__refreshCarnivalRedPoint()
    }


    private onLineRewardBack(pkg: PackageIn) {
        let msg: OnlineRewardInfoRsp = pkg.readBody(OnlineRewardInfoRsp) as OnlineRewardInfoRsp;
        if (msg && msg.rewardTime > 0) {
            this._onlineFlag = true;
        } else {
            this._onlineFlag = false;
        }
        if (msg.leftTime != -1) {
            this._countDown = msg.leftTime;
            if (this._countDown >= 0) {
                Laya.timer.loop(1000, this, this.updateCountDown)
                this.updateCountDown();
            }
        }
        else {
            Laya.timer.clear(this, this.updateCountDown);
        }
        this.__refreshWelfareRedPoint();
    }

    // 跨服积分排名奖励
    private onCrossScoreRewardHandler(pkg: PackageIn) {

        let msg = pkg.readBody(ChallengeRankRewardMsg) as ChallengeRankRewardMsg;
        this.playerInfo.canAcceptCrossScoreAward = false;
        let param1: number = msg.param1;//排名
        let param2: number = msg.param2;//积分
        let param3: number = msg.param3;//斗神宝箱数量
        let param4: number = msg.param4;//1 惊天斗神
        let str: string = "";
        let str2: string = "";
        if (param4 == 1) {
            //与“<font color='#68df0b'> {0} </font>”的尊贵称号
            str = LangManager.Instance.GetTranslation("crossscore.txt02", LangManager.Instance.GetTranslation("crossscore.name01"));
        }
        if (param3 <= 0) {
            //未达到斗神宝箱的领取条件, 请再接再厉！
            str = LangManager.Instance.GetTranslation("crossscore.txt04");
            str = LangManager.Instance.GetTranslation("crossscore.txt", param2) + str;
        } else {
            str2 = LangManager.Instance.GetTranslation("crossscore.txt03", param3);
            str = LangManager.Instance.GetTranslation("crossscore.txt", param2) + str2 + str;
        }
        SimpleAlertHelper.Instance.Show(null, null, null, str, null, null, (b) => { });

        this.refreshBtnViews();
    }

    // 单人竞技排名奖励
    private onChallengeTakeHandler(pkg: PackageIn) {
        let msg = pkg.readBody(ChallengeRankRewardMsg) as ChallengeRankRewardMsg;
        this.playerInfo.isChallReward = msg.isTake;
        let param1: number = msg.param1;//排名
        let param2: number = msg.param2;//黄金
        let param4: number = msg.param4;//时间
        let str: string = LangManager.Instance.GetTranslation("mainBar.TopToolsBar.str01", param1);
        if (param2 > 0) str += LangManager.Instance.GetTranslation("mainBar.TopToolsBar.str02", param2);
        str += LangManager.Instance.GetTranslation("mainBar.TopToolsBar.str04", param4);
        SimpleAlertHelper.Instance.Show(null, null, null, str, null, null, (b) => { });

        this.refreshBtnViews();
    }


    private updateCountDown() {
        if (this._countDown > 0) {
            this._countDown--;
        }
        else {
            Laya.timer.clear(this, this.updateCountDown);
            this.control.sendOnlineRewardReq(1);//倒计时结束重新请求数据
        }
    }

    private _onlineFlag: boolean = false;

    private get playerModel(): PlayerModel {
        return PlayerManager.Instance.currentPlayerModel;
    }

    private get outyardModel(): OutyardModel {
        return OutyardManager.Instance.model;
    }
    private get mineralModel(): MineralModel {
        return CampaignManager.Instance.mineralModel;
    }

    private get selfCarInfo(): MineralCarInfo {
        return CampaignManager.Instance.mineralModel.selfCarInfo;
    }

    private removeEvent() {
        this.c1.off(fairygui.Events.STATE_CHANGED, this, this.onChangeController);

        for (let i = 0, len = this._btnList.length; i < len; i++) {
            const btn = this._btnList[i];
            btn && btn.offClick(this, this.onBtnListHClickItem);
        }
        this.btn_funOpen.offClick(this, this.onFunOpen);
        this.btn_extend.offClick(this, this.onBtnListHClickItem);
        this.playerInfo.removeEventListener(PlayerEvent.MINERAL, this._onMineralChange, this);
        this.mineralModel.removeEventListener(CampaignEvent.UPDATE_MINERAL_INFO, this._onMineralChange, this);
        this.playerInfo.removeEventListener(PlayerEvent.FIRSTCHARGE, this.__firstChargeHandler, this);
        NotificationManager.Instance.removeEventListener(NotificationEvent.FIRSTPAY_DATA_UPDATE, this.__firstChargeHandler, this);
        this.playerInfo.removeEventListener(PlayerEvent.WORLDBOSSSTATE, this.heroLevelUpdate, this);
        NotificationManager.Instance.removeEventListener(WorldBossEvent.UPDATE_WARFIGHT_STATE_LIST, this.checkRvrBattle, this);
        ArmyManager.Instance.thane.removeEventListener(PlayerEvent.THANE_LEVEL_UPDATE, this.heroLevelUpdate, this);
        FunnyManager.Instance.removeEventListener(FunnyEvent.REFRESH_ITEM, this.__refreshFunnyHandler, this);
        QuestionnaireManager.Instance.model.removeEventListener(QuestionnaireEvent.QUESTIONNAIRE_CHANGE, this.updateQuestionVisible, this);
        WarlordsManager.Instance.model.removeEventListener(WarlordsEvent.REWARD_STATE_CHANGE, this.refreshBtnViews, this);
        NotificationManager.Instance.removeEventListener(FunnyEvent.REMAIN_STATE, this.__refreshFunnyHandler, this);

        this.playerInfo.removeEventListener(PlayerEvent.PLAYER_SIGNSITE_CHANGE, this.__refreshWelfareRedPoint, this);
        this.playerInfo.removeEventListener(PlayerEvent.REWARDSTATE_CHANGE, this.__refreshWelfareRedPoint, this);
        NotificationManager.Instance.removeEventListener(NotificationEvent.LEVEL_GIFT_UPDATE, this.__refreshWelfareRedPoint, this);
        DayGuideManager.Instance.cate.removeEventListener(DayGuideEvent.LEED_PROGRESS_CHANGE, this.__refreshWelfareRedPoint, this);
        DayGuideManager.Instance.cate.removeEventListener(DayGuideEvent.ACTIVE_CHANGE, this.__refreshWelfareRedPoint, this);
        DayGuideManager.Instance.cate.removeEventListener(DayGuideEvent.LEED_PROGRESS_CHANGE, this.__refreshWelfareRedPoint, this);
        DayGuideManager.Instance.removeEventListener(DayGuideEvent.DAILY_AWARD_STATE, this.__refreshWelfareRedPoint, this);
        NotificationManager.Instance.removeEventListener(NotificationEvent.SEVEN_GOALS_TASK_UPDATE, this.__refreshWelfareRedPoint, this);
        NotificationManager.Instance.removeEventListener(NotificationEvent.SEVEN_GOALS_TASKGET_UPDATE, this.__refreshWelfareRedPoint, this);
        NotificationManager.Instance.removeEventListener(NotificationEvent.SEVEN_LOGIN_REWARD_UPDATE, this.__refreshWelfareRedPoint, this);
        NotificationManager.Instance.removeEventListener(NotificationEvent.PASS_CHECK_AWARD_STATE, this.__refreshWelfareRedPoint, this);
        ServerDataManager.cancel(S2CProtocol.U_C_ONLINE_REWARD, this, this.onLineRewardBack);
        NotificationManager.Instance.removeEventListener(NotificationEvent.GROWTH_FUND_UPDATE, this.__refreshWelfareRedPoint, this);
        NotificationManager.Instance.removeEventListener(ExpBackEvent.UPDATE_INFO, this.__refreshWelfareRedPoint, this);
        NotificationManager.Instance.removeEventListener(EmailEvent.WELFARE_BIND_STATE, this.__refreshWelfareRedPoint, this);
        ServerDataManager.cancel(S2CProtocol.U_C_CROSS_SCORE_REWARD_RESULT, this, this.onCrossScoreRewardHandler);
        NotificationManager.Instance.removeEventListener(NotificationEvent.FOISONHORN_RED_CHANGE, this.__refreshFunnyHandler, this);
        NotificationManager.Instance.removeEventListener(NotificationEvent.FOISONHORN_INFO_CHANGE, this.__refreshFunnyHandler, this);
        NotificationManager.Instance.removeEventListener(SwitchEvent.SWITCH_GEMMAZE, this.checkMiniGame, this);//夺宝奇兵开关切换
        NotificationManager.Instance.removeEventListener(SwitchEvent.MICRO_APP, this.checkMicroApp, this);
        GoldenSheepManager.Instance.model.removeEventListener(GoldenSheepEvent.STATE_UPDATE, this.updateGoldenSheepVisible, this);
        this.playerModel.playerInfo.removeEventListener(PlayerEvent.PLAYER_INFO_UPDATE, this.initResoueceTxt, this);
        ResourceManager.Instance.gold.removeEventListener(ResourceEvent.RESOURCE_UPDATE, this.__refreshGold, this);
        NotificationManager.Instance.removeEventListener(SwitchEvent.SWITCH_MAP_SHOP, this.onCheckMysteryShop, this);
        QQDawankaManager.Instance.model.removeEventListener(QQ_HALL_EVENT.GARDE_CHANGE, this.__refreshQQHallRedPoint, this);
        QQGiftManager.Instance.model.removeEventListener(QQ_HALL_EVENT.GIFT_CHANGE, this.__refreshQQGiftRedPoint, this);
        this.chargeBtn.offClick(this, this.chargeBtnHandler);
        Laya.stage.off(Laya.Event.VISIBILITY_CHANGE, this, this.onVisible)
        NotificationManager.Instance.removeEventListener(NotificationEvent.OUTYARD_OPEN_FRAME, this.openOutyardOpenWnd, this);
        NotificationManager.Instance.removeEventListener(NotificationEvent.REFRESH_TOPTOOLS, this.checkCarnival, this);
        this.playerModel.removeEventListener(NotificationEvent.UPDATE_SYSTEM_TIME, this.__updateSystemTime, this);
        CarnivalManager.Instance.removeEventListener(CarnivalManager.EVENT_UPDATE, this.onCarnivalUpdate, this);
        GoodsManager.Instance.removeEventListener(BagEvent.UPDATE_BAG, this.onCarnivalUpdate, this);
        GoodsManager.Instance.removeEventListener(BagEvent.DELETE_BAG, this.onCarnivalUpdate, this);
        NotificationManager.Instance.removeEventListener(NotificationEvent.CHARGELOTTERY_RESULT_UPDATE, this.__refreshFunnyHandler, this);
        this.playerInfo.removeEventListener(PlayerEvent.CONSORTIA_CHANGE, this.checkOutyard, this);
        NotificationManager.Instance.removeEventListener(FunOpenEvent.UPDATE_FUNOPEN_STATE, this.checkNewFun, this);
        if (this.warlordsModel) this.warlordsModel.removeEventListener(WarlordsEvent.DATE_INIT_COMPLETE, this.refreshBtnViews, this);
        NotificationManager.Instance.removeEventListener(ExpBackEvent.UPDATE_EXPBACK_STATUS, this.refreshBtnViews, this);
        NotificationManager.Instance.removeEventListener(ConsortiaEvent.GOTO_GUILD_FIGHT, this.enterOutyardScene, this);
        NotificationManager.Instance.removeEventListener(PassCheckEvent.PASS_TASK_FRESH, this.__refreshWelfareRedPoint, this);
    }

    chargeBtnHandler() {
        SwitchPageHelp.gotoShopFrame(7)
    }

    private heroLevelUpdate() {
        this.refreshBtnViews()
        this.control.sendLevelGiftReward(1);//请求等级礼包数据
        WelfareManager.Instance.reqBindState();//达到开启绑定手机邮箱的提示等级
    }

    private checkNewFun() {
        if (this.thane.grades < OpenGrades.SHOW_FUNOPEN_TIP) {//10级出现
            this.btn_funOpen.visible = false;
            return;
        } else {
            this.btn_funOpen.visible = true;
        }

        let newFunData = FunOpenManager.Instance.newFunData;
        if (newFunData && newFunData.length > 0) {
            this.btn_funOpen.title = LangManager.Instance.GetTranslation('FunOpen.opening');//已开放
            let curFun = newFunData[0];
            for (let i = 0; i < newFunData.length; i++) {
                const element = newFunData[i];
                if (SharedManager.Instance.newFunOpenType != element.Type) {
                    // if(element.Order >= SharedManager.Instance.newFunOpenOrder){
                    curFun = element;
                    break;
                    // } 
                }
            }
            this.btn_funOpen.icon = FunOpenManager.Instance.getFunIconUrl(curFun.Type);
            UIButton.setEffect(this.btn_funOpen.view, 1);
            this.adjustIconPos(curFun.Type)
        } else {
            //未达到功能开放等级时显示: 功能图标+提示文本“xx级开放”
            UIButton.setEffect(this.btn_funOpen.view, 0);
            let nextArr = FunOpenManager.Instance.nextOpenArr;
            if (nextArr.length) {
                let type = nextArr[0].Type;
                let url = FunOpenManager.Instance.getFunIconUrl(type);
                this.btn_funOpen.icon = url;
                this.btn_funOpen.title = LangManager.Instance.GetTranslation('market.tips.openLevel', nextArr[0].Grade);//{0}级开放
                this.adjustIconPos(type)
            } else {
                this.btn_funOpen.visible = false;
            }
        }
    }

    private adjustIconPos(type) {
        let icon = this.btn_funOpen.view.getChild('icon');
        //图标资源尺寸不一, 显示大小效果不一, 特殊处理
        let sizeCtrl = this.btn_funOpen.view.getController('sizeCtrl');
        if (type == 23 || type == 26) {//天赋
            sizeCtrl.selectedIndex = 1;
            icon.x = 10;
            icon.y = 10;
        } else if (type == 8 || type == 25) {//荣誉勋章
            sizeCtrl.selectedIndex = 2;
            icon.x = 8;
            icon.y = 7;
        } else if (type == 7 || type == 10) {
            sizeCtrl.selectedIndex = 0;
            icon.x = 1;
            icon.y = 2;
        } else if (type == 13) {//符文
            sizeCtrl.selectedIndex = 2;
            icon.x = 8;
            icon.y = 7;
        } else if (type == 14 || type == 15) {//符孔 //灵魂刻印
            sizeCtrl.selectedIndex = 2;
            icon.x = 9;
            icon.y = 9;
        } else {
            sizeCtrl.selectedIndex = 0;
            icon.x = 0;
            icon.y = 0;
        }
    }

    /**
     * 设置Tab按钮关效果状态
     * @param tabIndex Tab索引
     * @param redPointState 是否展示红点
     */
    private setTabBtnEffect(type: number, effect: boolean) {
        // Logger.xjy("[TopToolBar]setTabBtnState", type, redPointState, count)
        let btnView = this.getBtn(type);
        if (btnView && btnView.view && btnView.view.data) {
            if (effect) {
                UIButton.setEffect(btnView.view, 1)
            } else {
                UIButton.setEffect(btnView.view, 0)
            }
        }
    }

    /**
     * 设置Tab按钮红点状态  TODO BtnMore的没做处理, 数字大于9没做拉升处理
     * @param tabIndex Tab索引
     * @param redPointState 是否展示红点
     */
    private setTabBtnState(type: number, redPointState: boolean, count: number = 0) {
        // Logger.xjy("[TopToolBar]setTabBtnState", type, redPointState, count)
        let btnView = this.getBtn(type);
        if (btnView && btnView.view && btnView.view.data) {
            let data = btnView.view.data as MainMenuBtnData
            data.setRedPoint(redPointState, count)
        }
    }

    private onFunOpen() {
        // SwitchPageHelp.gotoPvpFrame();
        FrameCtrlManager.Instance.open(EmWindow.FunOpenWnd);
    }

    private onBtnListHClickItem(target) {
        let clickItem = target;
        Logger.info("点击了" + clickItem["_title"] + "按钮");
        let targetData: any = clickItem.data;
        if (!targetData) return;
        switch (targetData.type) {
            case MainBtnType.WELFARE://福利
                if (MopupManager.Instance.model.isMopup) {
                    var str: string = LangManager.Instance.GetTranslation("mopup.MopupManager.mopupTipData01");
                    MessageTipManager.Instance.show(str);
                    return;
                }
                FrameCtrlManager.Instance.open(EmWindow.Welfare);
                break;
            case MainBtnType.FIRSTPAY://首充送豪礼
                PlayerManager.Instance.currentPlayerModel.playerInfo.hasClickFirstCharge = true;
                this.__refreshFirstPayRedPoint();
                UIManager.Instance.ShowWind(EmWindow.FirstPayWnd);
                break;
            case MainBtnType.WORDLBOSS:
                if (MopupManager.Instance.model.isMopup) {
                    var str: string = LangManager.Instance.GetTranslation("mopup.MopupManager.mopupTipData01");
                    MessageTipManager.Instance.show(str);
                    return;
                }
                if (ArmyManager.Instance.army.onVehicle) {
                    MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("OuterCityCastleTips.gotoBtnTips"));
                    return;
                }
                FrameCtrlManager.Instance.open(EmWindow.WorldBossWnd);
                break;
            case MainBtnType.RVRBATTLE:
                if (MopupManager.Instance.model.isMopup) {
                    var str: string = LangManager.Instance.GetTranslation("mopup.MopupManager.mopupTipData01");
                    MessageTipManager.Instance.show(str);
                    return;
                }
                if (ArmyManager.Instance.army.onVehicle) {
                    MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("OuterCityCastleTips.gotoBtnTips"));
                    return;
                }
                FrameCtrlManager.Instance.open(EmWindow.RvrBattleWnd);
                break;
            case MainBtnType.FUNNY://精彩活动
                FrameCtrlManager.Instance.open(EmWindow.Funny);
                break;
            case MainBtnType.QUESTIONNAIRE://有奖问答
                QuestionnaireManager.Instance.model.questionNaireRedpoint = false;
                this.__refreshQuestionRedPoint();
                FrameCtrlManager.Instance.open(EmWindow.QuestionNaireWnd);
                break;
            case MainBtnType.WARLORD://众神之战
                FrameCtrlManager.Instance.open(EmWindow.WarlordsMainWnd);
                break;
            case MainBtnType.WARlORD_REWARD://众神之战奖励
                WarlordsManager.Instance.reqGetReward();
                WarlordsManager.Instance.model.rewardState = 0;
                this._getWardRewarFlag = true;
                this.refreshBtnViews();
                break;
            case MainBtnType.MULTILORD://泰坦之战
                FrameCtrlManager.Instance.open(EmWindow.MultilordsMainWnd);
                break;
            case MainBtnType.MINTERAL://紫金矿产双倍
                if (StringHelper.isNullOrEmpty(WorldBossHelper.getCampaignTips())) {
                    SpaceSocketOutManager.Instance.nodeMineral();
                } else {
                    MessageTipManager.Instance.show(WorldBossHelper.getCampaignTips());
                }
                break;
            case MainBtnType.MINIGAME://
                FrameCtrlManager.Instance.open(EmWindow.MiniGameWnd);
                break;
            case MainBtnType.CROSS_PVP_REWARD:
                let msg = new ChallengeRankRewardMsg();
                SocketManager.Instance.send(C2SProtocol.C_TAKE_CROSS_SCORE_REWARD, msg);
                break;
            case MainBtnType.PETGUARD:
                if (ArmyManager.Instance.thane.grades >= OpenGrades.PET) {
                    UIManager.Instance.ShowWind(EmWindow.PetGuardWnd);
                }
                break;
            case MainBtnType.MICROAPP://微端大礼
                if (!ConfigManager.info.STORE_RATING) {
                    MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("TopToolBar.openTips"));
                    return;
                }
                FrameCtrlManager.Instance.open(EmWindow.MicroAppWnd);
                break;
            case MainBtnType.GOLDENSHEEL:
                let goldenSheepOpenTime: Date = GoldenSheepManager.Instance.model.openTime;
                let goldenSheepOpenTimeFormatterStr: string = LangManager.Instance.GetTranslation("public.dateFormat");
                let goldenSheepOpenTimeStr: string = DateFormatter.format(goldenSheepOpenTime, goldenSheepOpenTimeFormatterStr);
                let tipStr: string;
                let index: number = GoldenSheepManager.Instance.model.index;
                if (index > 0) {
                    let count: number = GoldenSheepManager.Instance.model.count;
                    tipStr = LangManager.Instance.GetTranslation("ui.toptoolbar.TopBtnItemView.goldenSheepOpenTips", count, index);
                }
                else {
                    tipStr = LangManager.Instance.GetTranslation("ui.toptoolbar.TopBtnItemView.goldenSheepTips", goldenSheepOpenTimeStr);
                }
                MessageTipManager.Instance.show(tipStr);
                break;
            case MainBtnType.MYSTERYSHOP:
                if (ArmyManager.Instance.thane.grades >= OpenGrades.MYSTERIOUS) {
                    FrameCtrlManager.Instance.open(EmWindow.OuterCityShopWnd);
                } else {
                    MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("public.unopen"));
                }
                break;
            case MainBtnType.QQHALL_DAWANKA:
                FrameCtrlManager.Instance.open(EmWindow.QQDawankaWnd);
                break;
            case MainBtnType.QQHALL_GIFT:
                FrameCtrlManager.Instance.open(EmWindow.QQGiftWnd);
                break;
            case MainBtnType.PET_EXCHANGE:
                UIManager.Instance.ShowWind(EmWindow.PetExchangeShopWnd);
                break;
            case MainBtnType.OUTYARD:
                this.enterOutyardScene();
                break;
            case MainBtnType.CARNIVAL:
                if (CarnivalManager.Instance.isOpen)
                    FrameCtrlManager.Instance.open(EmWindow.Carnival);
                break;
            case MainBtnType.PVP:
                if (this._pvpCanJoin) {
                    FrameCtrlManager.Instance.open(EmWindow.PvpGate);
                } else {
                    MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("mainBar.TopToolsBar.PvpTip", this._pvpCanJoinLeftTime));
                }
                break;
            case MainBtnType.EXP_BACK_FREE:
            case MainBtnType.EXP_BACK_EXTRA:
                FrameCtrlManager.Instance.open(EmWindow.ExpBackWnd);
                break;
            case MainBtnType.ACTIVE_TIME:
                FrameCtrlManager.Instance.open(EmWindow.ActivityTimeWnd);
                break;
            case MainBtnType.SEVEN_GOALS:
                FrameCtrlManager.Instance.open(EmWindow.SevenGoalsWnd);
                break;
            default:
                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("TopToolBar.openTips"));
                break;
        }
    }

    private enterOutyardScene() {
        this._needOpenOutyardOpenWnd = false;
        if (this.playerInfo.consortiaID == 0) {//请先加入公会！
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("friends.im.IMFrame.consortia.TipTxt"))
            return;
        }
        let stateMsg: StackHeadStateMsg = OutyardManager.Instance.stateMsg;
        if (!stateMsg.myGuildSignup)//未报名
        {
            if (stateMsg.state == OutyardModel.COLLECT) {
                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("outyard.TopToolsBar.NotCanSignup"));
                return;
            }
            if (stateMsg.canSignin)//可报名
            {
                if (this.isConsortiaChairman())//公会会长
                {
                    let config: number = ConfigInfoManager.Instance.getStackHeadJoinFee();
                    let content: string = LangManager.Instance.GetTranslation("outyard.OutyardBlessFrame.openTxt.text", config);
                    let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
                    let confirm: string = LangManager.Instance.GetTranslation("public.confirm");
                    let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
                    SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, null, prompt, content, confirm, cancel, this.__alertOutyardHandler.bind(this));
                }
                else {//您所在的公会尚未报名
                    MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("outyard.OutyardFrame.consortiaSignup"));
                }
            }
            else //今日不可报名
            {
                if (stateMsg.isSpan) {
                    MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("outyard.TopToolsBar.nextOpenDateNew"));
                } else {
                    MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("outyard.OutyardFrame.cannotReportToday"));
                }
            }
            return;
        }
        //已经报名的情况
        let time = stateMsg.nextOpenTime as Long
        var nextOpenTime: number = 0;
        if (time.high) {
            nextOpenTime = Int64Utils.int64ToNumber(time);
        } else {
            nextOpenTime = Number(stateMsg.nextOpenTime);
        }
        if (nextOpenTime == 0) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("outyard.TopToolsBar.noOpenToday"));
            return;
        }
        let zoneOffset = PlayerManager.Instance.currentPlayerModel.zoneId;
        var start: Date = Utils.formatTimeZone(nextOpenTime, zoneOffset);
        var timeStr: string = DateFormatter.timeFormat1(start);
        // if (stateMsg.state == OutyardModel.NOT_OPEN)//今天不开放
        // {
        //     if (stateMsg.isSpan) {
        //         MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("outyard.TopToolsBar.nextOpenDateNew"));
        //     } else {
        //         MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("outyard.TopToolsBar.nextOpenDate", timeStr));
        //     }
        //     return;
        // }
        // if (stateMsg.state == OutyardModel.COLLECT)//收集报名信息中
        // {
        //     MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("outyard.OutyardFrame.gatherToday"));
        //     return;
        // }
        if (!stateMsg.myGuildJoin)//我自己今天不能玩
        {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("outyard.TopToolsBar.nextOpenDate", timeStr));
            return;
        }
        //请求活动数据, 如果能够收到返回数据打开入口界面,否则不处理
        this._needOpenOutyardOpenWnd = true;
        OutyardManager.Instance.OperateOutyard(OutyardManager.OPEN_FRAME);
    }

    private openOutyardOpenWnd() {
        if (this._needOpenOutyardOpenWnd) {
            FrameCtrlManager.Instance.open(EmWindow.OutyardFigureWnd);
            this._needOpenOutyardOpenWnd = false;
        }
    }

    private checkCarnival(needRefresh: boolean = true) {
        if (CarnivalManager.Instance.isOpen) {
            this.createBtnData(MainBtnType.CARNIVAL, FUIHelper.getItemURL(EmPackName.Home, "Btn_Eve_Carnival"), 11, LangManager.Instance.GetTranslation("TopToolBar.btnText12"));
        } else {
            this.removeBtnData(MainBtnType.CARNIVAL);
        }
        if (needRefresh) {
            this.refreshBtnViews();
        }
    }

    private __alertOutyardHandler(b: boolean, flag: boolean) {
        if (b) {
            OutyardManager.Instance.OperateOutyard(OutyardManager.ENTER);
        }
    }

    private isConsortiaChairman(): boolean {
        let flag: boolean = false;
        let consortiaControler: ConsortiaControler = FrameCtrlManager.Instance.getCtrl(EmWindow.ConsortiaSecretInfoWnd) as ConsortiaControler;
        if (consortiaControler) {
            let consortiaModel: ConsortiaModel = consortiaControler.model;
            if (consortiaModel) {
                flag = consortiaModel.getRightsByIndex(ConsortiaDutyInfo.STACKHEAD_SIGNIN);
            }
        }
        return flag;
    }



    /**刷新紫金矿产 */
    private _onMineralChange() {
        this.refreshBtnViews();
    }

    private __firstChargeHandler() {
        this.refreshBtnViews();
    }

    private checkWorldBoss() {
        if (this.thane.grades >= OpenGrades.WORLD_BOSS) {
            if (this.playerInfo.worldbossState) {
                this._worldBossVislble = true;
                this.createBtnData(MainBtnType.WORDLBOSS, FUIHelper.getItemURL(EmPackName.Home, "Btn_Eve_WorldBOSS"), 6, LangManager.Instance.GetTranslation("TopToolBar.btnText3"));
            } else {
                this.removeBtnData(MainBtnType.WORDLBOSS);
            }
        } else {
            this.removeBtnData(MainBtnType.WORDLBOSS);
        }
    }

    private checkRvrBattle(needRefresh: boolean = true) {
        if (this.thane.grades < OpenGrades.RVR) return;

        if (DataCommonManager.playerInfo.isOpenPvpWar) {
            this.createBtnData(MainBtnType.RVRBATTLE, FUIHelper.getItemURL(EmPackName.Home, "Btn_Eve_Battle"), 7, LangManager.Instance.GetTranslation("TopToolBar.btnText4"));
        } else {
            this.removeBtnData(MainBtnType.RVRBATTLE);
        }

        if (needRefresh) {
            this.refreshBtnViews();
        }
    }

    private updateGoldenSheepVisible() {
        this.refreshBtnViews();
    }

    private get isFirstChargeOpen(): boolean {
        let flag: boolean = true;

        if (this.thane.grades < OpenGrades.FIRST_PAY) {
            flag = false;
        } else if (this.thane.grades >= OpenGrades.FIRST_PAY) {
            if (this.playerInfo.isFirstCharge
                && FirstPayManager.Instance.model.state1 == FirstPayModel.HAS_GETED
                && FirstPayManager.Instance.model.state2 == FirstPayModel.HAS_GETED
                && FirstPayManager.Instance.model.state3 == FirstPayModel.HAS_GETED) {
                flag = false;
            }
        }

        if (this.thane.grades < OpenGrades.SHOP) {
            flag = false
        }
        return flag;
    }

    firstChargeRed(): boolean {
        let flag: boolean = false;
        if (!this.playerInfo.isFirstCharge
            || FirstPayManager.Instance.model.state1 == FirstPayModel.CAN_GET
            || FirstPayManager.Instance.model.state2 == FirstPayModel.CAN_GET
            || FirstPayManager.Instance.model.state3 == FirstPayModel.CAN_GET) {
            flag = true;
        }
        return flag;
    }

    public getBtn(type: number): UIButton {
        let btn: UIButton = null;
        for (let i = 0; i < this._btnList.length; i++) {
            let item = this._btnList[i];
            if (item && item.view && item.view.data) {
                let itemData: MainMenuBtnData = item.view.data as MainMenuBtnData;
                if (itemData && itemData.type === type) {
                    btn = item;
                    break;
                }
            }
        }
        return btn;
    }

    public mopupIng() {
        let btn = this.getBtn(MainBtnType.WORDLBOSS);
        if (btn) btn.enabled = false;
        btn = this.getBtn(MainBtnType.RVRBATTLE);
        if (btn) btn.enabled = false;
    }

    public mopupEnd() {
        let btn = this.getBtn(MainBtnType.WORDLBOSS);
        if (btn) btn.enabled = true;
        btn = this.getBtn(MainBtnType.RVRBATTLE);
        if (btn) btn.enabled = true;
    }

    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    private get thane(): ThaneInfo {
        return ArmyManager.Instance.thane;
    }

    private initGrowgrowthFundData() {
        this.ctrlData._growthFundInfoArr = TempleteManager.Instance.getGrowthFundInfoArr();
        let firstItem: GrowthFundItemInfo = new GrowthFundItemInfo();
        firstItem.packageState = 1;
        let rechargeData = TempleteManager.Instance.getRechargeTempletes(ProductType.GROWTH_RECHARGE);
        if (rechargeData && rechargeData.length) {
            firstItem.bindDiamondCount = Number(rechargeData[0].Para1);
        }
        this.ctrlData._growthFundInfoArr.unshift(firstItem);
    }

    initDegreeActivityData() {
        //获取活跃度配置宝箱
        let activityBoxs = TempleteManager.Instance.getDropConditionByType(DropCondictionType.DEGREE);
        this.ctrlData.dayDegreeBoxs = [];
        this.ctrlData.weekDegreeBoxs = [];
        for (const key in activityBoxs) {
            if (Object.prototype.hasOwnProperty.call(activityBoxs, key)) {
                let keyIndex: number = Number(key);
                let box = activityBoxs[key];
                let data = new DegreeActivityBoxData();
                data.index = keyIndex;
                data.point = box.Para1[0];
                data.type = box.Para2[0];
                data.tipData = this.getTipsStr(box.DropId);
                if (data.type == 1) {//周宝箱宝箱
                    this.ctrlData.weekDegreeBoxs.push(data);
                } else if (data.type == 0) {//每日宝箱
                    this.ctrlData.dayDegreeBoxs.push(data);
                    if (data.point >= this.ctrlData.dayMaxDegreePoint) {
                        this.ctrlData.dayMaxDegreePoint = data.point;
                    }
                }
            }
        }
    }

    /**获取提示 */
    private getTipsStr(value: number): string {
        var arr: Array<t_s_dropitemData> = TempleteManager.Instance.getDropItemssByDropId(value);
        var str: string = LangManager.Instance.GetTranslation("dayguide.LimitedSellView.ActiveBoxItemTips") + "<br>";
        if (arr != null) {
            for (var i: number = 0; i < arr.length; i++) {
                if (i == arr.length - 1) {
                    if (arr[i].ItemId < 0) {
                        str += this.getGoodsName(arr[i].ItemId) + arr[i].Data + "";
                    } else if (arr[i].ItemId > 0) {
                        str += this.getGoodsName(arr[i].ItemId) + arr[i].Data + LangManager.Instance.GetTranslation("shop.view.frame.BuyFrame.vipBuyInfo03");
                    }
                } else {
                    if (arr[i].ItemId < 0) {
                        str += this.getGoodsName(arr[i].ItemId) + arr[i].Data + ",<br>";
                    } else if (arr[i].ItemId > 0) {
                        str += this.getGoodsName(arr[i].ItemId) + arr[i].Data + LangManager.Instance.GetTranslation("shop.view.frame.BuyFrame.vipBuyInfo03") + ",<br>";
                    }
                }
            }
        }
        return str;
    }

    private getGoodsName(itemId: number): string {
        let itemTmp = TempleteManager.Instance.getGoodsTemplatesByTempleteId(itemId);
        if (itemTmp) {
            return itemTmp.TemplateNameLang;
        }
        return "";
    }

    public get isFolded(): boolean {
        return this.btn_fold.rotation == 180
    }

    private _fold: boolean = false;
    public set fold(val: boolean) {
        this._fold = val;
        this.c1.selectedIndex = val ? 1 : 0;
    }

    private get control(): WelfareCtrl {
        return FrameCtrlManager.Instance.getCtrl(EmWindow.Welfare) as WelfareCtrl;
    }

    private get ctrlData(): WelfareData {
        return this.control.data;
    }

    private get goldResData(): ResourceData {
        return ResourceManager.Instance.gold;
    }

    private onVisible() {
        //从不可见=>可见的时候, 重新刷新一下按钮数据
        if (Laya.stage.isVisibility) {
            this.refreshBtnViews();
        }
    }

    public dispose() {
        this.removeEvent();
        this._needOpenOutyardOpenWnd = false;
        this._btnList = null;
        this.btnDataList = null;
        this.btnMoreDataList = null;
        super.dispose();
    }

    ////////////////////////////////按钮红点 begin//////////////////////////////////////
    /**精彩活动红点 */
    __refreshFunnyHandler() {
        let awardState = false;
        let datalist = FunnyManager.Instance.data;
        for (const key in datalist) {
            if (Object.prototype.hasOwnProperty.call(datalist, key)) {
                const data = datalist[key];
                if (data.showEnd < this.playerModel.nowDate || data.showStart > this.playerModel.nowDate) continue;
                for (const key in data.bagList) {
                    if (Object.prototype.hasOwnProperty.call(data.bagList, key)) {
                        let element = data.bagList[key];
                        if (element.conditionList[0].id == FunnyConditionType.EXCHANGE) {//兑换奖励是否可领奖
                            let keyId = FunnyExchangeItem._shareWarnKey + element.id;
                            let state = SharedManager.Instance.getProperty(keyId);//是否提醒兑换物品
                            if ((state == true || state == undefined) && element.status == 1) {
                                awardState = true;
                                break;
                            }
                        } else if (element.conditionList[0].id == FunnyConditionType.RECHARGE_TIME) {
                            if (FunnyManager.Instance.rechargeBagData.status == 1) {
                                awardState = true;
                                break;
                            }
                        }
                        else if (element.conditionList[0].id == FunnyConditionType.TYPE_DELETE_FILELEVEL) {
                            if (element.status == 1 || data.state == -1) {
                                awardState = true;
                                break;
                            }
                        }
                        else {
                            if (element.status == 1) {
                                awardState = true;
                                break;
                            }
                        }
                    }
                }
            }
        }

        if (FeedBackManager.Instance.switchBtn1) {
            let array: Array<FeedBackItemData> = FeedBackManager.Instance.list;
            let item: FeedBackItemData;
            if (array.length > 0) {
                for (let i = 0; i < array.length; i++) {
                    item = array[i];
                    if (item && FeedBackManager.Instance.data.userPoint >= item.point && !item.state) {
                        awardState = true;
                        break;
                    }
                }
            }
        }

        let arr: Array<LuckExchangeTempMsg> = LuckyExchangeManager.Instance.showData;
        if (arr && arr.length > 0) {
            for (let i: number = 0; i < arr.length; i++) {
                if (LuckyExchangeManager.Instance.idMap.get(arr[i].id) == true) {
                    awardState = true;
                }
            }
        }
        if (FoisonHornManager.Instance.model.isOpen) {
            if ((FoisonHornManager.Instance.model
                && FoisonHornManager.Instance.model.activeCount >= FoisonHornManager.Instance.model.goodsList.length
                && FoisonHornManager.Instance.model.hasActiveCount <= 0)
                || !SharedManager.Instance.foisonHornClick) {
                awardState = true;
            }
        }
        if (ChargeLotteryManager.instance.openChargeLottery && ChargeLotteryManager.instance.chargeMsg && ChargeLotteryManager.instance.chargeMsg.leftCount > 0) {
            awardState = true;
        }

        this.setTabBtnState(MainBtnType.FUNNY, awardState);
    }

    private _refreshSevenGoalsRedPoint(){
        let sevenGoalsAwardState = false;
        for (let i = 1; i <= 7; i++) {
            let receiveActive = SevenGoalsManager.Instance.sevenGoalsModel.checkDayRed(i);
            if (receiveActive) {
                sevenGoalsAwardState = true;
                break;
            }
        }
        this.setTabBtnState(MainBtnType.SEVEN_GOALS, sevenGoalsAwardState);
    }

    /**刷新福利任务红点 */
    __refreshWelfareRedPoint() {
        //签到
        // let signState = this.ctrlData.canGetSignAward;
        let canSign = this.ctrlData.canSign;
        let signAwardState = canSign;//签到是否可领取
        //等级礼包
        let canReceiveLevelGift = this.ctrlData.canReceiveLevelGift;
        //活跃度
        let receiveActive = this.ctrlData.canReceiveActive;
        let receiveWeekActive = this.ctrlData.canReceiveWeekActive;
        let activityAwardState = receiveActive || receiveWeekActive;
        //七日登录
        let sevenLoginAwardState = false;
        for (let i = 0; i < 7; i++) {
            if (i <= this.ctrlData.sevenLoginTotalDays) {
                let receiveActive = this.ctrlData.checkSevenLoginDayRed(i);
                if (receiveActive) {
                    sevenLoginAwardState = true;
                }
                break;
            }
        }

        //成长基金
        let growthFundFlag: boolean = false;
        if (!PlayerManager.Instance.currentPlayerModel.playerInfo.hasBuyGrowthFund
            && !PlayerManager.Instance.currentPlayerModel.playerInfo.todayHasClickGrowthFund) {//未购买成长基金并且当天没有点击过成长基金页签
            growthFundFlag = true;
        } else { //已经购买
            for (let i = 0; i < this.ctrlData.growthFundInfoArr.length; i++) {
                let item: GrowthFundItemInfo = this.ctrlData.growthFundInfoArr[i];
                if (item && item.packageState == 2) {
                    growthFundFlag = true;//有未领取的奖励
                    break;
                }
            }
        }

        let expBackFlag: boolean = false;//资源找回
        if (this.ctrlData.expBackItemDataArr.length > 0 && !this.ctrlData.hasClickExpTab) {
            expBackFlag = true;
        }

        //通行证红点
        let showRed = false;
        if (PlayerManager.Instance.currentPlayerModel.playerInfo.isPassOpen && this.ctrlData.passRewardInfo.leftTime > 0) {
            showRed = PassportView.isLogin && !this.ctrlData.passRewardInfo.isPay;
        }
        let passCheckFlag: boolean = this.ctrlData.canReceivePassCheckReward > 0 || this.ctrlData.canReceivePassCheckTaskReward || showRed;

        let welfareAwardState = signAwardState || canReceiveLevelGift || activityAwardState || sevenLoginAwardState || growthFundFlag || expBackFlag || this._onlineFlag || passCheckFlag;
        if (WelfareManager.Instance.isReachOpenBindCon(1)) {
            welfareAwardState = welfareAwardState || WelfareManager.Instance.getBindPhoneRedFlag()
        }
        if (WelfareManager.Instance.isReachOpenBindCon(2)) {
            welfareAwardState = welfareAwardState || WelfareManager.Instance.getBindMailRedFlag()
        }

        this.setTabBtnState(MainBtnType.WELFARE, welfareAwardState);
    }

    __refreshQQHallRedPoint() {
        if (Utils.isQQHall()) {
            this.setTabBtnState(MainBtnType.QQHALL_DAWANKA, QQDawankaManager.Instance.model.isRedDot());
        }
    }

    __refreshQQGiftRedPoint() {
        if (Utils.isQQHall() && ConfigManager.info.QQ_HALL_GIFT) {
            this.setTabBtnState(MainBtnType.QQHALL_GIFT, QQGiftManager.Instance.model.isRedDot());
        }
    }

    __refreshFirstPayRedPoint() {
        let active = this.isFirstChargeOpen;
        if (active) {
            if (this.playerInfo.isFirstCharge && (FirstPayManager.Instance.model.state1 == FirstPayModel.CAN_GET
                || FirstPayManager.Instance.model.state2 == FirstPayModel.CAN_GET
                || FirstPayManager.Instance.model.state3 == FirstPayModel.CAN_GET)) {
                this.setTabBtnState(MainBtnType.FIRSTPAY, true);
            } else {
                this.setTabBtnState(MainBtnType.FIRSTPAY, false);
            }
        }
    }
    private __refreshCarnivalRedPoint() {
        let isOpen = CarnivalManager.Instance.isOpen;
        if (!isOpen) {
            return;
        }
        let btn = this.getBtn(MainBtnType.CARNIVAL)
        if (btn) {
            let b = false
            let carnivalGameCount = CarnivalManager.Instance.model.hasGameCounts();//游戏收益次数
            let carnivalLuckyTimes = CarnivalManager.Instance.model.hasLuckyDarwCount();//幸运夺宝次数 
            let carnivalFreeDiscount = CarnivalManager.Instance.model.hasFreeDiscount();//特惠礼包免费礼包
            let carnivalOnlineAward = CarnivalManager.Instance.model.hasOnlineReward();//在线奖励
            if (CarnivalManager.Instance.isRewardTime) {
                b = carnivalGameCount || carnivalFreeDiscount || carnivalOnlineAward
            }
            let carnivalScoreAward = CarnivalManager.Instance.model.hasScoreRewardInfoAward();//嘉年华 积分领奖
            let carnivalDaytaskAward = CarnivalManager.Instance.model.hasDayTaskReward();//每日挑战奖励
            let carnivalRecharge = CarnivalManager.Instance.model.hasLeftlotteryCount();//充值有礼
            b = b || carnivalScoreAward || carnivalDaytaskAward || carnivalLuckyTimes
            this.setTabBtnState(MainBtnType.CARNIVAL, b);
        }
    }

    private __refreshQuestionRedPoint() {
        if (!QuestionnaireManager.Instance.model.questionnaireVisible || this.thane.grades < OpenGrades.QUESTION_NAIRE) {
            return;
        }
        if (QuestionnaireManager.Instance.model.questionNaireRedpoint) {
            this.setTabBtnState(MainBtnType.QUESTIONNAIRE, true);
        } else {
            this.setTabBtnState(MainBtnType.QUESTIONNAIRE, false);
        }
    }

    /**跨服竞技积分奖励红点 */
    private __refreshCrossPvpRewardRedPoint() {
        if (this.playerInfo.canAcceptCrossScoreAward) {
            this.setTabBtnState(MainBtnType.CROSS_PVP_REWARD, true);
        } else {
            this.setTabBtnState(MainBtnType.CROSS_PVP_REWARD, false);
        }
    }
    ////////////////////////////////按钮红点 end////////////////////////////////////////


    ////////////////////////////按钮发光特效 begin////////////////////////////////
    private __refreshWarlordsBtnStatus() {
        let btn = this.getBtn(MainBtnType.WARLORD);
        if (!btn) return;
        let warlordsModel: WarlordsModel = WarlordsManager.Instance.model;
        if (!warlordsModel) return;
        let beginTime: number = warlordsModel.getMatchDate(3).getTime() / 1000;
        let curTime: number = PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond;
        let endTime: number = WarlordsManager.Instance.model.getMatchDate(4).getTime() / 1000;
        var isOpenTime: boolean = ((curTime > beginTime && curTime < endTime) || this.checkWarlordsProcess());
        if (ComponentSetting.WARLORD && this.thane.grades >= WarlordsModel.BET_OPEN_GRADE && isOpenTime) {
            UIButton.setEffect(btn.view, 1);
        } else {
            UIButton.setEffect(btn.view, 0);
        }
    }
    private __refreshCarnivalBtnStatus() {
        let btn = this.getBtn(MainBtnType.CARNIVAL)
        if (btn) {
            let isOpen = CarnivalManager.Instance.isOpen;
            if (!isOpen) {
                UIButton.setEffect(btn.view, 0);
                return;
            }
            UIButton.setEffect(btn.view, 1);
        }
    }
    private __refreshOutyardBtnStatus() {
        let btn = this.getBtn(MainBtnType.OUTYARD)
        if (btn) {
            if (this.isShowOutyard && this.outyardModel.isOpenTime()) {
                UIButton.setEffect(btn.view, 1);
            } else {
                UIButton.setEffect(btn.view, 0);
            }
        }
    }
    private __refreshRvrBattleBtnStatus() {
        let btn = this.getBtn(MainBtnType.RVRBATTLE);
        if (btn) {
            if (this.thane.grades >= OpenGrades.RVR && btn) {
                if (DataCommonManager.playerInfo.isOpenPvpWar && ArmyManager.Instance.thane.grades >= OpenGrades.RVR) {
                    UIButton.setEffect(btn.view, 1);
                } else {
                    UIButton.setEffect(btn.view, 0);
                }
            }
        }
    }
    /**刷新紫金矿产效果 */
    private __refreshMineralBtnStatus() {
        let btn = this.getBtn(MainBtnType.MINTERAL);
        if (this.thane.grades >= OpenGrades.MINERAL_DOUBLE && btn) {
            if (this.isMineralDouble) {
                UIButton.setEffect(btn.view, 1);
            } else {
                UIButton.setEffect(btn.view, 0);
            }
        }
    }
    private __refreshPetBossBtnStatus() {
        let btn = this.getBtn(MainBtnType.PETGUARD);
        if (!btn) return;
        let petBossModel: PetBossModel = CampaignManager.Instance.petBossModel;
        if (petBossModel.leftTime > 0) {
            UIButton.setEffect(btn.view, 1);
        } else {
            UIButton.setEffect(btn.view, 0);
        }
    }
    private __refreshWorldBossBtnstatus() {
        let btn = this.getBtn(MainBtnType.WORDLBOSS);
        if (this.thane.grades >= OpenGrades.WORLD_BOSS && btn) {
            if (this.playerInfo.worldbossState) {
                UIButton.setEffect(btn.view, 1);
            } else {
                UIButton.setEffect(btn.view, 0);
            }
        }
    }
    private __refreshPvpBtnstatus() {
        let btn = this.getBtn(MainBtnType.PVP);
        if (!btn) return;

        if (this.thane.grades >= OpenGrades.CHALLENGE) {
            let curDate: Date = PlayerManager.Instance.currentPlayerModel.sysCurtime;
            let curTimeMin = curDate.getHours() * 60 + curDate.getMinutes();
            this._pvpCanJoin = false;
            for (let index = 0; index < this._pvpOpenTimeArr.length; index++) {
                const element = this._pvpOpenTimeArr[index];
                if (curTimeMin >= element.startTimeMin && curTimeMin <= element.endTimeMin) {
                    this._pvpCanJoin = true;
                    break;
                }
            }

            if (this._pvpCanJoin) {
                UIButton.setEffect(btn.view, 1);
            } else {
                UIButton.setEffect(btn.view, 0);
            }
        }
    }

    /**
     * 首冲可领取奖励特效
     * @returns 
     */
    private __refreshFirstPayBtnStatus(): void {
        let btn = this.getBtn(MainBtnType.FIRSTPAY);
        if (!btn) {
            return;
        }

        let active = this.isFirstChargeOpen;
        if (active) {
            UIButton.setEffect(btn.view, 1);
        } else {
            UIButton.setEffect(btn.view, 0);
        }
    }
    ////////////////////////////按钮发光特效 end////////////////////////////////

}

export class MainMenuBtnData {
    public type: number = 0;
    public icon: string = "";
    public MainIndex: number = 0;//第几行索引
    public SubIndex: number = 0;//第几列索引
    public title: string = "";
    public grade: number = 0;//开放等级
    public sort: number = 0;//排序
    public canFold: boolean = true;//是否可收起, 默认为true可收起
    public btn: UIButton;
    public setRedPoint(visible: boolean, num: number = 0) {
        if (!this.btn) return;

        let view = this.btn.getView();
        let dot = view.getChild('redDot');
        let newDot = view.getChild("newRedDot");
        let redDotLabel = view.getChild('redDotLabel');
        if (num > 0) {
            newDot.visible = true;
            dot.visible = false;
            redDotLabel.visible = true;
            redDotLabel.text = num.toString();
        }
        else {
            newDot.visible = false;
            dot.visible = visible;
            redDotLabel.visible = false;
            redDotLabel.text = "";
        }
    }

}