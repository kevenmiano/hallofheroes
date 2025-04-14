import AudioManager from "../../core/audio/AudioManager";
import ConfigMgr from "../../core/config/ConfigMgr";
import GameEventDispatcher from "../../core/event/GameEventDispatcher";
import LangManager from "../../core/lang/LangManager";
import Logger from "../../core/logger/Logger";
import { LoginSocketManager } from "../../core/net/LoginSocketManager";
import { SocketManager } from "../../core/net/SocketManager";
import { NativeChannel } from "../../core/sdk/native/NativeChannel";
import Utils from "../../core/utils/Utils";
import {
  NotificationEvent,
  StartupEvent,
} from "../constant/event/NotificationEvent";
import { PlayerEvent } from "../constant/event/PlayerEvent";
import { SoundIds } from "../constant/SoundIds";
import { PlayerInfo } from "../datas/playerinfo/PlayerInfo";
import { SwitchInfo } from "../datas/SwitchInfo";
import { UserInfo } from "../datas/userinfo/UserInfo";
import BuildingManager from "../map/castle/BuildingManager";
import { SceneManager } from "../map/scene/SceneManager";
import SceneType from "../map/scene/SceneType";
import { LoadingWnd } from "../module/loading/LoadingWnd";
import { LoginManager } from "../module/login/LoginManager";
import { WelfareManager } from "../module/welfare/WelfareManager";
import { CampaignMapModel } from "../mvc/model/CampaignMapModel";
import ExitGameUtils from "../utils/ExitGameUtils";
import { WorldBossHelper } from "../utils/WorldBossHelper";
import ActivityManager from "./ActivityManager";
import AllManExchangeManager from "./AllManExchangeManager";
import AppellManager from "./AppellManager";
import { ArmyManager } from "./ArmyManager";
import { BaseManager } from "./BaseManager";
import { CampaignManager } from "./CampaignManager";
import { CampaignMovieQueueManager } from "./CampaignMovieQueueManager";
import { CampaignRankManager } from "./CampaignRankManager";
import { CampaignTemplateManager } from "./CampaignTemplateManager";
import ChatAirBubbleManager from "./ChatAirBubbleManager";
import { ChatManager } from "./ChatManager";
import { ConfigManager } from "./ConfigManager";
import { ConsortiaManager } from "./ConsortiaManager";
import { CoreTransactionManager } from "./CoreTransactionManager";
import DayGuideManager from "./DayGuideManager";
import EmailManager from "./EmailManager";
import { FarmManager } from "./FarmManager";
import { FashionManager } from "./FashionManager";
import FeedBackManager from "./FeedBackManager";
import FirstPayManager from "./FirstPayManager";
import FoisonHornManager from "./FoisonHornManager";
import FreedomTeamManager from "./FreedomTeamManager";
import { FriendManager } from "./FriendManager";
import FunnyManager from "./FunnyManager";
import { GameBaseQueueManager } from "./GameBaseQueueManager";
import { GoodsManager } from "./GoodsManager";
import { HookManager } from "./HookManager";
import { KingContractManager } from "./KingContractManager";
import { KingTowerManager } from "./KingTowerManager";
import MailCheckMgr from "./MailCheckMgr";
import { MapSocketInnerManager } from "./MapSocketInnerManager";
import { MountsManager } from "./MountsManager";
import { NotificationManager } from "./NotificationManager";
import OfferRewardManager from "./OfferRewardManager";
import { OuterCityShopManager } from "./OuterCityShopManager";
import { PathManager } from "./PathManager";
import { PetCampaignManager } from "./PetCampaignManager";
import { PlayerBufferManager } from "./PlayerBufferManager";
import { PlayerManager } from "./PlayerManager";
import QuestionnaireManager from "./QuestionnaireManager";
import RingTaskManager from "./RingTaskManager";
import { SharedManager } from "./SharedManager";
import { ShopManager } from "./ShopManager";
import SinglePassManager from "./SinglePassManager";
import { SocketSceneBufferManager } from "./SocketSceneBufferManager";
import { StarManager } from "./StarManager";
import { TaskManage } from "./TaskManage";
import { TaskTraceTipManager } from "./TaskTraceTipManager";
import { TempleteManager } from "./TempleteManager";
import TreasureMapManager from "./TreasureMapManager";
import { VIPManager } from "./VIPManager";
import WarlordsManager from "./WarlordsManager";
import { WaterManager } from "./WaterManager";
import WorldBossManager from "./WorldBossManager";
import FaceSlapManager from "./FaceSlapManager";
import { TailaFbManager } from "./TailaFbManager";
import GoldenSheepManager from "./GoldenSheepManager";
import { DiscountShopManager } from "../module/shop/control/DiscountShopManager";
import { MonopolyManager } from "./MonopolyManager";
import { RemotePetManager } from "./RemotePetManager";
import QQDawankaManager from "./QQDawankaManager";
import QQGiftManager from "./QQGiftManager";
import OutyardManager from "./OutyardManager";
import { BottleManager } from "./BottleManager";
import CarnivalManager from "./CarnivalManager";
import { AirGardenFivecardManager } from "./AirGardenFivecardManager";
import { AirGardenManager } from "./AirGardenManager";
import { ChargeLotteryManager } from "./ChargeLotteryManager";
import { LuckBlindBoxManager } from "./LuckBlindBoxManager";
import AirGardenMemoryCardManager from "./AirGardenMemoryCardManager";
import AirGardenGameLlkManager from "./AirGardenGameLlkManager";
import WishPoolManager from "./WishPoolManager";
import WeakNetCheckModel from "../../core/check/WeakNetCheckModel";
import FunOpenManager from "./FunOpenManager";
import { AirGardenSudokuManager } from "./AirGardenSudokuManager";
import MarketManager from "./MarketManager";
import { SuperGiftOfGroupManager } from "./SuperGiftOfGroupManager";
import RechargeAlertMannager from "./RechargeAlertMannager";
import { isOversea } from "../module/login/manager/SiteZoneCtrl";
import DebugModule from "../module/debug/DebugModule";
import { Func } from "../../core/comps/Func";
import { SecretManager } from "./SecretManager";
import SevenGoalsManager from "./SevenGoalsManager";

/**
 * @author:pzlricky
 * @data: 2020-12-31 15:19
 * @description 游戏数据管理类
 */
export default class GameManager extends GameEventDispatcher {
  private static _instance: GameManager;

  public static get Instance(): GameManager {
    if (!this._instance) {
      this._instance = new GameManager();
    }
    return this._instance;
  }

  private _configXml: any;
  private _siteXml: any;
  private _userInfo: UserInfo;
  private _callFunc: Func;
  public lunch(callFunc?: Func) {
    this._callFunc = callFunc;
    this.socketConnect();
    this.setupComponent();
  }

  public parseConfig(configXml: any, siteXML: any) {
    this._configXml = configXml;
    this._siteXml = siteXML;
    if (!ConfigMgr.Instance.isInit) {
      ConfigMgr.Instance.parse(this._configXml, this._siteXml);
      //解析包
      if (Utils.isAndroid() || Utils.isIOS()) {
        let pkgName = NativeChannel.packageName;
        PathManager.info.isLogoActive =
          PathManager.info.LOGO_CODE.indexOf(pkgName) == -1;
      } else {
        PathManager.info.isLogoActive = true;
      }
      if (!Utils.isApp()) {
        window.DESKEY = this.DESKEY;
      }
    }
  }

  public get DESKEY(): string {
    let webfrom = Utils.GetUrlQueryString("channelId");
    let graphyss = PathManager.info.SECURITY_GRAPHY;
    let desKey = "";
    if (!isOversea()) {
      //默认读取wan
      desKey = graphyss["WAN0"] ? graphyss["WAN0"] : graphyss["WAN"];
    } else {
      desKey = graphyss["WAN1"] ? graphyss["WAN1"] : graphyss["WAN"];
    }
    if (webfrom) {
      desKey = graphyss[webfrom];
    }
    return desKey;
  }

  public initUserInfo(userInfo: UserInfo) {
    if (userInfo) {
      this._userInfo = new UserInfo();
      this._userInfo.user = userInfo.user;
      this._userInfo.tempPassword = userInfo.key;
      this._userInfo.userId = userInfo.userId;
      this._userInfo.password = userInfo.password;
      this._userInfo.site = userInfo.site;
      this._userInfo.isActive = userInfo.isActive;
      this._userInfo.noviceProcess = userInfo.noviceProcess;
    }
  }

  private initEvent() {
    PlayerManager.Instance.addEventListener(
      PlayerEvent.LOGIN_SUCCESS,
      this.__tryLoadStartupResource,
      this,
    ); //得到玩家信息
    NotificationManager.Instance.addEventListener(
      StartupEvent.CORE_SETUP_COMPLETE,
      this.__onCoreSetupLoadComplete,
      this,
    ); //UIMODEL和AMF
    NotificationManager.Instance.addEventListener(
      StartupEvent.CORE_LOAD_COMPLETE,
      this.__coreLoadCompleteHandler,
      this,
    );
  }

  private socketConnect() {
    this.initEvent();
    this.beforSocketConnect(); //连接socket前
    this.onLoginSocketConnect(); //连接socket
  }

  private beforSocketConnect() {
    ConfigManager.setup(new SwitchInfo());
    VIPManager.Instance.setup();
    BuildingManager.Instance.setup();
    BaseManager.Instance.setup();
    LoginManager.Instance.setup();
    PlayerManager.Instance.setup();
    ActivityManager.Instance.setup();
    FunnyManager.Instance.setup();
    FoisonHornManager.Instance.setup();
    AllManExchangeManager.Instance.setup();
    QuestionnaireManager.Instance.setup();
    MapSocketInnerManager.Instance.setup();
    FriendManager.getInstance().init();
    AppellManager.Instance.setup();
    ChatAirBubbleManager.Instance.setup();
    PetCampaignManager.Instance.setup();
    FaceSlapManager.Instance.setup();
    QQDawankaManager.Instance.addEvent(); //QQ大厅大玩咖
    QQGiftManager.Instance.addEvent(); //QQ大厅大玩咖
    CarnivalManager.Instance.setup(); //嘉年华
    ChargeLotteryManager.instance.setup();
    LuckBlindBoxManager.Instance.setup();
    GoldenSheepManager.Instance.setup();
    WarlordsManager.Instance.setup();
    StarManager.Instance.setup();
    PlayerBufferManager.Instance.setup();
    DayGuideManager.Instance.setup();
    GoodsManager.Instance.setup();
    SceneManager.Instance.setup();
    FirstPayManager.Instance.setup();
    KingTowerManager.Instance.setup(); //王者之塔
    FreedomTeamManager.Instance.setup();
    TailaFbManager.Instance.setup();
    TreasureMapManager.Instance.setup();
    WelfareManager.Instance.setup();
    MarketManager.Instance.setup();
    SuperGiftOfGroupManager.Instance.setup(); // 超值团购礼包活动
    RechargeAlertMannager.Instance;
  }

  /**链接登录服 */
  private onLoginSocketConnect() {
    Logger.base(
      "连接登录socket : " +
        PathManager.SocktPath +
        ", Port:" +
        PathManager.SocketPort,
    );
    LoginSocketManager.Instance.connect(
      PathManager.SocktPath,
      PathManager.SocketPort,
    );
    LoginSocketManager.Instance.on(
      Laya.Event.COMPLETE,
      this.onLoginSocketConnectSuccess,
      this,
    );
  }

  /**链接网关服 */
  private _socketConnectCB: Function = null;
  public onGameSocketConnect(ip?: string, port?: number, callFunc?: Function) {
    Logger.base("连接socket : " + ip + ", Port:" + port);
    this._socketConnectCB = callFunc;
    SocketManager.Instance.connect(ip, port);
    SocketManager.Instance.on(
      Laya.Event.COMPLETE,
      this.onSocketConnectSuccess,
      this,
    );
  }

  /**
   * 断开网关服（从主界面返回登录时调用）
   */
  // public closeGameSocket():void
  // {
  //     clearInterval(this._timeInterval);
  //     LoginManager.Instance.clearCheckAccelerator();
  //     SDKManager.Instance.getChannel().logout(true);
  //     //关闭登录Socket
  //     LoginSocketManager.Instance.close();
  //     Logger.base("关闭登录Socket");

  //     Logger.base("关闭心跳");
  //     SocketManager.Instance.close();
  //     Logger.base("断开网关服（从主界面返回登录时调用） ");
  //     //关闭登录服的心跳定时器和网关服的心跳定时器
  // }

  public createGameConnection() {}

  private onSocketConnectSuccess() {
    Logger.base("连接网关服成功!!!");
    this._socketConnectCB && this._socketConnectCB();
  }

  private onLoginSocketConnectSuccess() {
    Logger.base("连接登录服成功!!!");
    this._callFunc && this._callFunc.Invoke();
    this._callFunc = null;
  }

  private __tryLoadStartupResource(evt) {
    Logger.yyz("登陆成功 : __tryLoadStartupResource: ");
    let playerInfo: PlayerInfo =
      PlayerManager.Instance.currentPlayerModel.playerInfo;
    if (playerInfo.userId != 0) {
      GameManager.Instance.initUserInfo(
        PlayerManager.Instance.currentPlayerModel.userInfo,
      );
      SharedManager.Instance.setup(this._userInfo.userId);
      //登录完成之后再重置状态
      SharedManager.Instance.setWindowItem("isLoginAfterRestart", "false");
      window.localStorage.setItem("isSwitchSite", "false"); //重置状态
      Logger.yyz("登陆成功 : ~~~~~~~~ 显示加载界面  instShow ~~~~~~~~ ");
      LoadingWnd.getInstance.instShow(this._userInfo, this._configXml, false);
      this.__checkAccelerator();
      LoginManager.Instance.clearRegisterTime();
      Laya.stage.frameRate = SharedManager.Instance.openHighFrame
        ? Laya.Stage.FRAME_FAST
        : Laya.Stage.FRAME_SLOW;
    }
  }

  public checkAccelerator() {
    this.__checkAccelerator();
  }

  public clearAccelerator() {
    Laya.stage.clearTimer(this, this.__timeUpdateHandler);
  }

  private __checkAccelerator() {
    this.count = 0;
    this.clearAccelerator();
    Laya.stage.timerLoop(1000, this, this.__timeUpdateHandler);
    this.__timeUpdateHandler();
  }

  private count: number = 0;

  private __timeUpdateHandler() {
    this.count++;
    if (this.count % 60 == 0) {
      PlayerManager.Instance.checkAccelerator();
      this.count = 0;
    }

    PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond++;
    this.dispatchEvent(PlayerEvent.SYSTIME_UPGRADE_SECOND, null);
    let leftTime: number =
      PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond % 3600;
    if (leftTime % WeakNetCheckModel.heatbeatTime == 0) {
      PlayerManager.Instance.synchronizedSystime();
      this.dispatchEvent(PlayerEvent.SYSTIME_UPGRADE_MINUTE, null);
    }
    if (leftTime == 0) {
      if (
        PlayerManager.Instance.currentPlayerModel.sysCurtime.getDate() !=
        PlayerManager.Instance.currentPlayerModel.sysCurtime.getDate()
      ) {
        this.dispatchEvent(PlayerEvent.SYSTIME_UPGRADE_DATE, null);
      }
      if (
        PlayerManager.Instance.currentPlayerModel.sysCurtime.getHours() == 5
      ) {
        TaskManage.Instance.requestCanAcceptTask();
        // AlchemyManager.Instance.senUpdateAlchemy();
        // if(ConfigManager.info.SOULMAKE_BTN)
        // {
        //     SoulMakeManager.Instance.sendUpdateSoulMake();
        // }
        // StarManager.Instance.sendResetStarData();
        OfferRewardManager.Instance.model.isNeedReset = true;
        NotificationManager.Instance.sendNotification(
          NotificationEvent.REFRESH_TOPTOOLS,
        );
      }
      if (
        PlayerManager.Instance.currentPlayerModel.sysCurtime.getHours() == 21
      ) {
        //21点关闭公会战按钮
        PlayerManager.Instance.currentPlayerModel.playerInfo.beginChanges();
        PlayerManager.Instance.currentPlayerModel.playerInfo.gvgIsOpen = false;
        PlayerManager.Instance.currentPlayerModel.playerInfo.commit();
      }
      if (
        PlayerManager.Instance.currentPlayerModel.sysCurtime.getHours() == 0
      ) {
        // if(GuideTaskManager.Instance.model.statu == 1)
        // {
        //     GuideTaskManager.Instance.getReward(-1001);
        // }
      }
    }
  }

  private __coreLoadCompleteHandler(evt: StartupEvent) {
    // ServicesManager.Instance.setup(PathManager.CastleServicePath);
    // CastleServiceManager.Instance.setup();
    // BuildingManager.Instance.setup();//准备接收AMF数据
    // AlchemyManager.Instance.setup();
    // SoulMakeManager.Instance.setup();

    ArmyManager.Instance.setup();
    TaskManage.Instance.setup();
    FarmManager.Instance.setup();
    WaterManager.Instance.setup();
    // BoxManager.Instance.setup();

    ShopManager.Instance.setup();
    WishPoolManager.Instance.setup();

    // MysteryShopManager.Instance.setup();
    // SnsPortManager.Instance.setup();
    // MopupManager.Instance.setup();
    KingContractManager.Instance.setup();
    FeedBackManager.Instance.setup();
    BottleManager.Instance.setup();
    SevenGoalsManager.Instance.setup();
    // FundManager.Instance.setup();
    // GuideTaskManager.Instance.setup();
    // LotteryManager.Instance.setup();
    // GodArriveManager.Instance.setup();
    // SlotManager.Instance.setup();
    // if (PlayerManager.Instance.currentPlayerModel.userInfo.site.indexOf("360_") >= 0 && ConfigManager.info.GIFT_360) {
    //     Bag360Manager.Instance.setup();
    // }
    // AnswerManager.Instance.setup();

    SinglePassManager.Instance.setup();
    // ExpBackManager.Instance.setUp();//经验找回
    // TreasureHuntManager.Instance.setup();
    // MagicCardManager.Instance.setup();//卡牌系统
    // FishManager.Instance.setup();
    // GemMazeManager.Instance.setup(); //夺宝奇兵
    // MailCheckManager.Instance.setup();
    OfferRewardManager.Instance.setup();
    TempleteManager.Instance.initTemplate();
    RingTaskManager.Instance.setup();
    MountsManager.Instance.setup();

    OuterCityShopManager.instance.setup();

    MonopolyManager.Instance.setup();

    RemotePetManager.Instance.setup(); //英灵远征
    QQDawankaManager.Instance.setup(); //QQ大厅大玩咖
    QQGiftManager.Instance.setup(); //QQ大厅特权礼包
    OutyardManager.Instance.setup();
    AirGardenManager.Instance.setup();
    AirGardenFivecardManager.Instance.setup();
    AirGardenMemoryCardManager.Instance.setup();
    AirGardenGameLlkManager.Instance.setup();
    AirGardenSudokuManager.Instance.setup();
    FashionManager.Instance.setup();
    FunOpenManager.Instance.setup();
    DiscountShopManager.Instance.setup(); //折扣商城
    SecretManager.Instance.setup();
  }

  private __onCoreSetupLoadComplete(event: StartupEvent) {
    this.setupManager();
    this.requestLoginState();
    this.loginOverCall();
  }

  private requestLoginState() {
    //请求登陆状态
    NotificationManager.Instance.addEventListener(
      NotificationEvent.SWITCH_SCENE,
      this.__switchSceneHandler,
      this,
    );
    LoginManager.Instance.loginStateReq();
  }

  private __switchSceneHandler(evt) {
    //此处执行登陆切换完场景需要执行的操作
    NotificationManager.Instance.removeEventListener(
      NotificationEvent.SWITCH_SCENE,
      this.__switchSceneHandler,
      this,
    );
    if (this.checkScence()) {
      if (ArmyManager.Instance.thane.grades >= 20) {
        if (this.isNeedShowMailCheck()) {
        }
        // else if (PlayerManager.Instance.currentPlayerModel.playerInfo.showVersion) {
        //     if (ConfigManager.info.TIME_STORY) {
        //         FrameControllerManager.Instance.openControllerByInfo(EmWindow.TIME_STORY, null, this.callBack);
        //     }  else {
        //         let frame: UpdateBroadCastFrame = ComponentFactory.Instance.creatComponentByStylename("mainToolBar.BroadCastFrame");
        //         frame.show();
        //     }
        // } else if (PlayerManager.Instance.currentPlayerModel.playerInfo.showStory) {
        //     let module: number = PlayerManager.Instance.currentPlayerModel.playerInfo.showStoryModule;
        //     FrameControllerManager.Instance.openControllerByInfo(EmWindow.TIME_STORY, module, this.callBack);
        // } else
        //     FrameControllerManager.Instance.openControllerByInfo(EmWindow.DAY_GUIDE);
      }
    }
  }

  private isNeedShowMailCheck(): boolean {
    let curScene: SceneType = SceneManager.Instance.currentType;
    // if ((curScene == SceneType.SPACE_SCENE || curScene == SceneType.CASTLE_SCENE) && MailCheckManager.Instance.model.isShow)
    //     return true;
    return false;
  }

  private callBack() {
    // FrameControllerManager.Instance.openControllerByInfo(EmWindow.DAY_GUIDE);
  }

  private checkScence(): boolean {
    let curScene: SceneType = SceneManager.Instance.currentType;
    switch (curScene) {
      case SceneType.BATTLE_SCENE:
      case SceneType.PVE_ROOM_SCENE:
      case SceneType.PVP_ROOM_SCENE:
      case SceneType.EMPTY_SCENE:
      case SceneType.VEHICLE:
      case SceneType.VEHICLE_ROOM_SCENE:
        return false;
        break;
      case SceneType.CAMPAIGN_MAP_SCENE:
        let model: CampaignMapModel = CampaignManager.Instance.mapModel;
        let flag: boolean;
        if (model)
          flag =
            WorldBossHelper.checkWorldBoss(model.mapId) ||
            WorldBossHelper.checkPvp(model.mapId) ||
            WorldBossHelper.checkGvg(model.mapId);
        else flag = false;
        if (flag) {
          return false;
        }
    }
    return true;
  }

  private setupManager() {
    // ShowTipManager.Instance.setup();
    // LocalConnectionManager.Instance.connId;
    ChatManager.Instance.setup();
    // GameUiManager.Instance.setup();
    CampaignTemplateManager.Instance.setup();
    CampaignRankManager.Instance.setup();

    // StageFocusManager.getInstance().setup(StageReferance.stage);
    // KeyboardManager.getInstance().init(StageReferance.stage);
    // KeyBoardRegister.Instance.setup();
    AudioManager.Instance.setup(this._configXml);
    GameBaseQueueManager.Instance.setup();
    CampaignMovieQueueManager.Instance.setup();
    CoreTransactionManager.getInstance().setup();
    SocketSceneBufferManager.Instance.setup();
    // FullBar.Instance.hide();
    TaskTraceTipManager.Instance.setup();
    EmailManager.Instance.setup();
    MailCheckMgr.Instance.setup();
    HookManager.Instance.setup(); //修行神殿
    // CustomerServiceManager.Instance.setup();
    DebugModule.Instance.setup();
  }

  private loginOverCall() {
    PlayerManager.Instance.removeEventListener(
      PlayerEvent.LOGIN_SUCCESS,
      this.__tryLoadStartupResource,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      StartupEvent.CORE_SETUP_COMPLETE,
      this.__onCoreSetupLoadComplete,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      StartupEvent.CORE_LOAD_COMPLETE,
      this.__coreLoadCompleteHandler,
      this,
    );
    LoadingWnd.getInstance.instHide();

    TaskManage.Instance.loadData();
    ConsortiaManager.Instance.setup();
    WorldBossManager.Instance.setup();
    //请求用户绑定状态
    if (isOversea()) PlayerManager.Instance.reqUserBindState();
    // ChatAirBubbleManager.Instance.reqAllAirBubbles();
    if (this._userInfo.isActive) {
      GameManager.openCache();
    } else {
      let vSQsevenRoad: string = LangManager.Instance.GetTranslation(
        "yishi.manager.GameStoreManager.SQsevenRoad",
      );
      // ExternalInterfaceManager.Instance.setFavorite(PathManager.forwardSite, vSQsevenRoad);
    }
    let exitGameUtils: ExitGameUtils = new ExitGameUtils();
    exitGameUtils.setup();
  }

  public static openCache() {
    // LoaderSavingManager.eventDispatcher.addEventListener(LoaderSavingManager.SO_OPEN, GameManager.__soOpenHandler);
    // LoaderSavingManager.loadFilesInLocal(true);
  }

  private setupComponent() {
    // ComponentSetting.COMBOX_LIST_LAYER = LayerMgr.Instance.getLayerByType(EmLayer.GAME_TOP_LAYER);
    // let alertInfo: AlertInfo = new AlertInfo();
    // alertInfo.mutiline = true;
    // alertInfo.buttonGape = 15;
    // alertInfo.autoDispose = true;
    // alertInfo.closeSoundFunc = this.closeSoundPlay;
    // alertInfo.submitSoundFunc = this.submitSoundPlay;
    // AlertManager.Instance.setup(LayerManager.STAGE_DYANMIC_LAYER, alertInfo);
    // Frame.closeSoundFunc = this.frameCloseSoundPlay;
    // Frame.submitSoundFunc = this.frameSubmitSoundPlay;
  }

  private closeSoundPlay() {
    AudioManager.Instance.playSound(SoundIds.CLOSE_SOUND);
  }

  private submitSoundPlay(b: boolean = true) {
    AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
  }

  private frameCloseSoundPlay() {
    AudioManager.Instance.playSound(SoundIds.CLOSE_SOUND);
  }

  private frameSubmitSoundPlay() {
    AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
  }
}
