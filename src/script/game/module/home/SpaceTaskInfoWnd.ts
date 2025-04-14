//@ts-expect-error: External dependencies
import FUI_QueueItem from "../../../../fui/Home/FUI_QueueItem";
import FUI_TaskRingItem from "../../../../fui/Home/FUI_TaskRingItem";
import AudioManager from "../../../core/audio/AudioManager";
import Resolution from "../../../core/comps/Resolution";
import LangManager from "../../../core/lang/LangManager";
import Logger from "../../../core/logger/Logger";
import { PackageIn } from "../../../core/net/PackageIn";
import { ServerDataManager } from "../../../core/net/ServerDataManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIButton from "../../../core/ui/UIButton";
import { ArrayConstant, ArrayUtils } from "../../../core/utils/ArrayUtils";
import StringHelper from "../../../core/utils/StringHelper";
import SimpleAlertHelper from "../../component/SimpleAlertHelper";
import { t_s_questcondictionData } from "../../config/t_s_questcondiction";
import NewbieEvent, {
  BuildOrderEvent,
  FreedomTeamEvent,
  KingContractEvents,
  NotificationEvent,
  OuterCityEvent,
  RequestInfoEvent,
  RewardEvent,
  RingTaskEvent,
  RoomEvent,
  TaskEvent,
  VIPEvent,
} from "../../constant/event/NotificationEvent";
import { PlayerEvent } from "../../constant/event/PlayerEvent";
import { S2CProtocol } from "../../constant/protocol/S2CProtocol";
import RelationType from "../../constant/RelationType";
import { SoundIds } from "../../constant/SoundIds";
import { TaskConditionType } from "../../constant/TaskConditionType";
import { EmPackName, EmWindow } from "../../constant/UIDefine";
import FriendItemCellInfo from "../../datas/FriendItemCellInfo";
import { BuildingOrderInfo } from "../../datas/playerinfo/BuildingOrderInfo";
import { PlayerInfo } from "../../datas/playerinfo/PlayerInfo";
import { ThaneInfo } from "../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../manager/ArmyManager";
import { CampaignManager } from "../../manager/CampaignManager";
import FreedomTeamManager from "../../manager/FreedomTeamManager";
import FreedomTeamSocketOutManager from "../../manager/FreedomTeamSocketOutManager";
import { FriendManager } from "../../manager/FriendManager";
import IMManager from "../../manager/IMManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { NotificationManager } from "../../manager/NotificationManager";
import OfferRewardManager from "../../manager/OfferRewardManager";
import { PlayerInfoManager } from "../../manager/PlayerInfoManager";
import { PlayerManager } from "../../manager/PlayerManager";
import RingTaskManager from "../../manager/RingTaskManager";
import { RoomManager } from "../../manager/RoomManager";
import { RoomSocketOutManager } from "../../manager/RoomSocketOutManager";
import { TaskManage } from "../../manager/TaskManage";
import { VIPManager } from "../../manager/VIPManager";
import { CampaignArmy } from "../../map/campaign/data/CampaignArmy";
import BuildingManager from "../../map/castle/BuildingManager";
import { SceneManager } from "../../map/scene/SceneManager";
import SceneType from "../../map/scene/SceneType";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import { CampaignMapModel } from "../../mvc/model/CampaignMapModel";
import { OfferRewardModel } from "../../mvc/model/OfferRewardModel";
import { RoomInfo } from "../../mvc/model/room/RoomInfo";
import { VIPModel } from "../../mvc/model/VIPModel";
import RingTaskModel from "../../mvc/RingTaskModel";
import { WorldBossHelper } from "../../utils/WorldBossHelper";
import { ConsortiaControler } from "../consortia/control/ConsortiaControler";
import { ConsortiaDutyInfo } from "../consortia/data/ConsortiaDutyInfo";
import NewbieUtils from "../guide/utils/NewbieUtils";
import { NoviceArrowView } from "../guide/views/NoviceArrowView";
import BaseOfferReward from "../offerReward/BaseOfferReward";
import { RingTask } from "../ringtask/RingTask";
import TaskCategory from "../task/TaskCategory";
import { TaskTemplate } from "../task/TaskTemplate";
import FUI_TaskAddFriendItem from "../../../../fui/Home/FUI_TaskAddFriendItem";
import { OuterCityBossInfoView } from "./OuterCityBossInfoView";
import QueueItem from "./QueueItem";
import TaskAddFriendItem from "./TaskAddFriendItem";
import TaskRingItem from "./TaskRingItem";
import { StageReferance } from "../../roadComponent/pickgliss/toplevel/StageReferance";
import ChallengeCoolTimeMsg = com.road.yishi.proto.player.ChallengeCoolTimeMsg;
import { GlobalConfig } from "../../constant/GlobalConfig";
import SDKManager from "../../../core/sdk/SDKManager";
import Utils from "../../../core/utils/Utils";
import BaseFguiCom from "../../../core/ui/Base/BaseFguiCom";
import ObjectUtils from "../../../core/utils/ObjectUtils";
import FUIHelper from "../../utils/FUIHelper";
import ComponentSetting from "../../utils/ComponentSetting";
import NewbieModule from "../guide/NewbieModule";
import NewbieConfig from "../guide/data/NewbieConfig";
import { RoomSceneType } from "../../constant/RoomDefine";
import RoomHallCtrl from "../../room/room/roomHall/RoomHallCtrl";
import OpenGrades from "../../constant/OpenGrades";
export default class SpaceTaskInfoWnd extends BaseWindow {
  public static ISINIT: boolean = false;
  public tab: fgui.Controller;
  public showQuickInvite: fgui.Controller;
  public outercityBoss: fgui.Controller;
  public scrollList: fgui.GList; //列表信息
  public tablist: fgui.GList; //Tab按钮
  private taskTabBtn: fgui.GButton;
  private openVipTxt: fgui.GRichTextField;
  private BtnFold: UIButton; //伸缩按钮
  private BtnUnFold: UIButton; //伸缩按钮
  private Btn_TaskInfo: UIButton;
  private infoGroup: fgui.GGroup;
  private quickInviteBtn: UIButton; //调整阵型
  private changeBattleStatusBtn: UIButton; //调整阵型
  private lookBattleStatusBtn: UIButton; //查看阵型
  private removeTeamBtn: UIButton; //踢出队伍
  private leaveTeamBtn: UIButton; //离开队伍
  private captainTansferBtn: UIButton; //队长转移
  private addFriendBtn: UIButton; //添加好友
  private blackListBtn: UIButton; //黑名单
  private selfContractBtn: UIButton; //私聊
  private inviteConsortiaBtn: UIButton; //公会
  private lookInfoBtn: UIButton; //查看信息
  private followBtn: UIButton; //跟随
  private copyNameBtn: UIButton; //复制名称
  public bossInfo: OuterCityBossInfoView;
  private gComTaskInfo: fgui.GGroup;
  private comTaskInfo: fgui.GComponent;

  private delayTimeId: number = 0;
  private _refreshTimerId: number = 0;
  private selectedItem: any;
  private userId: number = 0;
  private userName: string = "";
  private consortiaId: number = 0;
  private consortiaName: string = "";
  private _addFriendlistData: Array<any> = [];
  private _taskListData: Array<any> = [];
  private _queueDatalist: Array<any> = [];
  private serverName: string = "";
  private _tweening: boolean = false;
  private _showing: boolean = false;
  private _lastTabIndex: number;

  // 新手
  private _noviceArrow: NoviceArrowView;
  public get noviceArrow(): NoviceArrowView {
    return this._noviceArrow;
  }
  private _noviceArrowShowFlag: boolean;
  public get noviceArrowShowFlag(): boolean {
    return this._noviceArrowShowFlag;
  }
  private _noviceCallBack: Function;
  private _noviceCallArgs: any;
  private _noviceCurTaskTempId: number = 0;
  static IS_LOGIN: boolean = true; //玩家每次登录游戏时, 左侧任务栏需要默认打开状态
  static LAST_SELECT_IDNEX: number = 0; //上次选中的页签

  private get hideX() {
    return -327;
  }

  public infoImg: fgui.GImage;
  public OnInitWind() {
    super.OnInitWind();
    BaseFguiCom.autoGenerate(this.comTaskInfo, this);
    this.tab = this.comTaskInfo.getController("tab");
    this.showQuickInvite = this.comTaskInfo.getController("showQuickInvite");
    this.outercityBoss = this.comTaskInfo.getController("outercityBoss");
    this.gComTaskInfo = this.comTaskInfo.getChild("gComTaskInfo").asGroup;
    this.scrollList.itemProvider = Laya.Handler.create(
      this,
      this.getListItemResource,
      null,
      false,
    );
    this.scrollList.itemRenderer = Laya.Handler.create(
      this,
      this.renderListItem,
      null,
      false,
    );
    this.scrollList.on(fgui.Events.CLICK_ITEM, this, this.onClickItem);
    Utils.setDrawCallOptimize(this.scrollList);
    this.initNoviceArrow();
    this.scrollList.displayObject.mouseThrough = true;
    Resolution.addWidget(this);

    this.taskTabBtn = this.tablist.getChildAt(0).asButton;
    this.y = (Resolution.gameHeight - this.contentPane.sourceHeight) / 2 + 48;
    this.gComTaskInfo.x = this.hideX;
    this.setBtnFoldVisible(false);
    this.tab.selectedIndex = SpaceTaskInfoWnd.LAST_SELECT_IDNEX; //默认选择任务栏
  }

  OnShowWind() {
    super.OnShowWind();
    this.addEvent();
    this.addNewbieEvent();

    let text = "";
    if (VIPManager.Instance.model.vipInfo.VipGrade <= 0) {
      text = LangManager.Instance.GetTranslation("openVip.Speed.CoolDown");
    } else {
      text = LangManager.Instance.GetTranslation(
        "VipCoolDownFrameWnd.n7",
        VIPManager.Instance.model.vipInfo.VipGrade,
      );
    }
    this.openVipTxt.text = text;
    this.changeBattleStatusBtn.visible = this.lookBattleStatusBtn.visible =
      false;
    if (this.thane.grades >= 6) {
      this.refreshQueueView();
    }
    this.__onTabChange(false);
    this.checkTouchEnableTabListBtn();
    this.checkShowNoviceMapArrow();

    if (SpaceTaskInfoWnd.IS_LOGIN) {
      // SpaceTaskInfoWnd.IS_LOGIN = false;
      this.btnUnFoldClick(false);
    }
  }

  private addEvent() {
    this.lookInfoBtn.onClick(this, this.onLookInfo.bind(this));
    this.BtnFold.onClick(this, this.btnFoldClick.bind(this));
    this.BtnUnFold.onClick(this, this.btnUnFoldClick.bind(this));
    this.quickInviteBtn.onClick(this, this.onQuickInviteHandler.bind(this));
    this.changeBattleStatusBtn.onClick(this, this.onChangeHandler.bind(this));
    this.lookBattleStatusBtn.onClick(this, this.onLookHandler.bind(this));
    this.Btn_TaskInfo.onClick(this, this.openTaskIWnd.bind(this));
    this.removeTeamBtn.onClick(this, this.removeTeamHander.bind(this));
    this.leaveTeamBtn.onClick(this, this.leaveTeamHandler.bind(this));
    this.blackListBtn.onClick(this, this.blackListHandler.bind(this));
    this.addFriendBtn.onClick(this, this.addFriendHandler.bind(this));
    this.followBtn.onClick(this, this.followHandler.bind(this));
    this.captainTansferBtn.onClick(this, this.captainTansferHandler.bind(this));
    this.selfContractBtn.onClick(this, this.selfContractHandler.bind(this));
    this.copyNameBtn.onClick(this, this.copyNameHandler.bind(this));
    this.inviteConsortiaBtn.onClick(
      this,
      this.inviteConsortiaBtnHandler.bind(this),
    );
    this.tablist.on(fairygui.Events.CLICK_ITEM, this, this.__onTabChange);
    //冷却CD
    this.thane.addEventListener(
      PlayerEvent.THANE_LEVEL_UPDATE,
      this.__upgradeHandler,
      this,
    );
    this.buildManager.addEventListener(
      BuildOrderEvent.ADD_ONE_ORDER,
      this.__addQueueItemHandler,
      this,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_CHALLENGE_TIME,
      this,
      this.__colosseumTimeHandler,
    );
    this.vipModel.addEventListener(
      VIPEvent.UPFRAMEVIEW_CHANGE,
      this.__UpvipInfoHandler,
      this,
    );

    //任务
    this.cate.addEventListener(
      TaskEvent.TASK_ADDED,
      this.__taskChangeHandler,
      this,
    );
    this.cate.addEventListener(
      TaskEvent.TASK_REMOVE,
      this.__taskFinishHandler,
      this,
    );
    TaskManage.Instance.addEventListener(
      TaskEvent.TASK_DETAIL_CHANGE,
      this.__taskChangeHandler,
      this,
    );
    OfferRewardManager.Instance.addEventListener(
      RewardEvent.REWARD_TASK_ADD,
      this.__taskChangeHandler,
      this,
    );
    OfferRewardManager.Instance.addEventListener(
      RewardEvent.REWARD_TASK_FINISH,
      this.__taskFinishHandler,
      this,
    );
    RingTaskManager.Instance.addEventListener(
      RingTaskEvent.REFRESHRING,
      this.__taskChangeHandler,
      this,
    );
    NotificationManager.Instance.addEventListener(
      KingContractEvents.UPDATE_KINGCONTRACT,
      this.__updateKingContractHandler,
      this,
    );
    //组队
    NotificationManager.Instance.addEventListener(
      FreedomTeamEvent.TEAM_INFO_UPDATE,
      this.__teamInfoUpdateHandler,
      this,
    );
    if (this.checkIsTeamList()) {
      if (this.mapModel)
        this.mapModel.addEventListener(
          OuterCityEvent.ADD_GARRISON,
          this.__addArmyHandler,
          this,
        );
      if (this.mapModel)
        this.mapModel.addEventListener(
          OuterCityEvent.REMOVE_ARMY,
          this.__removeArmyHandler,
          this,
        );
      if (this.roomInfo) {
        this.roomInfo.addEventListener(
          RoomEvent.ROOM_HOUSEOWNER_CHANGE,
          this.__houseownerChangeHandler,
          this,
        );
        this.roomInfo.addEventListener(
          RoomEvent.REMOVE_PLAYER_ROOM,
          this.__houseownerChangeHandler,
          this,
        );
        this.roomInfo.addEventListener(
          RoomEvent.ADD_PLAYER_ROOM,
          this.__houseownerChangeHandler,
          this,
        );
        this.roomInfo.addEventListener(
          RoomEvent.UPDATE_ROOM_BASE_DATA,
          this.__houseownerChangeHandler,
          this,
        );
        this.roomInfo.addEventListener(
          RoomEvent.UPDATE_ROOM_PLAYER_DATA,
          this.__houseownerChangeHandler,
          this,
        );
        NotificationManager.Instance.addEventListener(
          NotificationEvent.UPDATE_TEAM_ONLINE_STATUS,
          this.__houseownerChangeHandler,
          this,
        );
      }
    }
    NotificationManager.Instance.addEventListener(
      NotificationEvent.TASKRING_ITEM_UPDATE,
      this.__taskChangeHandler,
      this,
    );
    StageReferance.stage.on(Laya.Event.RESIZE, this, this.__stageResizeHandler);
    NotificationManager.Instance.addEventListener(
      NotificationEvent.MAP_CLICK,
      this.hideGroup,
      this,
    );
    NotificationManager.Instance.addEventListener(
      OuterCityEvent.OUTERCITY_CLICK,
      this.hideGroup,
      this,
    );
  }

  private hideGroup() {
    this.infoGroup.visible = false;
  }

  /**
   * 隐藏界面也不关闭新手监听, 防止IOS新手卡死
   */
  private addNewbieEvent() {
    NotificationManager.Instance.addEventListener(
      NotificationEvent.TASKWND_VISIBLE,
      this.__selfVisibleHandler,
      this,
    );
    NotificationManager.Instance.addEventListener(
      NewbieEvent.ARROW_STATE,
      this.__noviceArrowSwitchHandler,
      this,
    );
    NotificationManager.Instance.addEventListener(
      NewbieEvent.MAIN_NODE_FINISH,
      this.__mainNodeFinishHandler,
      this,
    );
  }

  private offNewbieEvent() {
    NotificationManager.Instance.removeEventListener(
      NotificationEvent.TASKWND_VISIBLE,
      this.__selfVisibleHandler,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      NewbieEvent.ARROW_STATE,
      this.__noviceArrowSwitchHandler,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      NewbieEvent.MAIN_NODE_FINISH,
      this.__mainNodeFinishHandler,
      this,
    );
  }

  private offEvent() {
    this.lookInfoBtn.offClick(this, this.onLookInfo.bind(this));
    this.BtnFold.offClick(this, this.btnFoldClick.bind(this));
    this.BtnUnFold.offClick(this, this.btnUnFoldClick.bind(this));
    this.quickInviteBtn.offClick(this, this.onQuickInviteHandler.bind(this));
    this.changeBattleStatusBtn.offClick(this, this.onChangeHandler.bind(this));
    this.lookBattleStatusBtn.offClick(this, this.onLookHandler.bind(this));
    this.Btn_TaskInfo.offClick(this, this.openTaskIWnd.bind(this));
    this.removeTeamBtn.offClick(this, this.removeTeamHander.bind(this));
    this.leaveTeamBtn.offClick(this, this.leaveTeamHandler.bind(this));
    this.blackListBtn.offClick(this, this.blackListHandler.bind(this));
    this.addFriendBtn.offClick(this, this.addFriendHandler.bind(this));
    this.followBtn.offClick(this, this.followHandler.bind(this));
    this.captainTansferBtn.offClick(
      this,
      this.captainTansferHandler.bind(this),
    );
    this.selfContractBtn.offClick(this, this.selfContractHandler.bind(this));
    this.copyNameBtn.offClick(this, this.copyNameHandler.bind(this));
    this.inviteConsortiaBtn.offClick(
      this,
      this.inviteConsortiaBtnHandler.bind(this),
    );
    this.tablist.off(fairygui.Events.CLICK_ITEM, this, this.__onTabChange);

    //冷却CD
    this.thane.removeEventListener(
      PlayerEvent.THANE_LEVEL_UPDATE,
      this.__upgradeHandler,
      this,
    );
    this.buildManager.removeEventListener(
      BuildOrderEvent.ADD_ONE_ORDER,
      this.__addQueueItemHandler,
      this,
    );
    ServerDataManager.cancel(
      S2CProtocol.U_C_CHALLENGE_TIME,
      this,
      this.__colosseumTimeHandler,
    );
    this.vipModel.removeEventListener(
      VIPEvent.UPFRAMEVIEW_CHANGE,
      this.__UpvipInfoHandler,
      this,
    );

    //任务
    this.cate.removeEventListener(
      TaskEvent.TASK_ADDED,
      this.__taskChangeHandler,
      this,
    );
    this.cate.removeEventListener(
      TaskEvent.TASK_REMOVE,
      this.__taskFinishHandler,
      this,
    );
    TaskManage.Instance.removeEventListener(
      TaskEvent.TASK_DETAIL_CHANGE,
      this.__taskChangeHandler,
      this,
    );
    OfferRewardManager.Instance.removeEventListener(
      RewardEvent.REWARD_TASK_ADD,
      this.__taskChangeHandler,
      this,
    );
    OfferRewardManager.Instance.removeEventListener(
      RewardEvent.REWARD_TASK_FINISH,
      this.__taskFinishHandler,
      this,
    );
    RingTaskManager.Instance.removeEventListener(
      RingTaskEvent.REFRESHRING,
      this.__taskChangeHandler,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      KingContractEvents.UPDATE_KINGCONTRACT,
      this.__updateKingContractHandler,
      this,
    );
    //组队
    NotificationManager.Instance.removeEventListener(
      FreedomTeamEvent.TEAM_INFO_UPDATE,
      this.__teamInfoUpdateHandler,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      NotificationEvent.UPDATE_TEAM_ONLINE_STATUS,
      this.__houseownerChangeHandler,
      this,
    );

    if (this.checkIsTeamList()) {
      if (this.mapModel)
        this.mapModel.removeEventListener(
          OuterCityEvent.ADD_GARRISON,
          this.__addArmyHandler,
          this,
        );
      if (this.mapModel)
        this.mapModel.removeEventListener(
          OuterCityEvent.REMOVE_ARMY,
          this.__removeArmyHandler,
          this,
        );
      if (this.roomInfo) {
        this.roomInfo.removeEventListener(
          RoomEvent.ROOM_HOUSEOWNER_CHANGE,
          this.__houseownerChangeHandler,
          this,
        );
        this.roomInfo.removeEventListener(
          RoomEvent.REMOVE_PLAYER_ROOM,
          this.__houseownerChangeHandler,
          this,
        );
        this.roomInfo.removeEventListener(
          RoomEvent.ADD_PLAYER_ROOM,
          this.__houseownerChangeHandler,
          this,
        );
        this.roomInfo.removeEventListener(
          RoomEvent.UPDATE_ROOM_BASE_DATA,
          this.__houseownerChangeHandler,
          this,
        );
        this.roomInfo.removeEventListener(
          RoomEvent.UPDATE_ROOM_PLAYER_DATA,
          this.__houseownerChangeHandler,
          this,
        );
      }
    }

    NotificationManager.Instance.removeEventListener(
      NotificationEvent.TASKRING_ITEM_UPDATE,
      this.__taskChangeHandler,
      this,
    );
    StageReferance.stage.off(
      Laya.Event.RESIZE,
      this,
      this.__stageResizeHandler,
    );
    NotificationManager.Instance.removeEventListener(
      NotificationEvent.MAP_CLICK,
      this.hideGroup,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      OuterCityEvent.OUTERCITY_CLICK,
      this.hideGroup,
      this,
    );
  }

  private __stageResizeHandler() {
    this.y = (Resolution.gameHeight - this.contentPane.sourceHeight) / 2 + 48;
  }

  /**检测是不是多人本 */
  private checkIsTeamList(): boolean {
    let flag: boolean = false;
    if (
      this.mapModel &&
      !WorldBossHelper.checkFogMap(this.mapModel.mapId) &&
      !WorldBossHelper.checkMaze(this.mapModel.mapId) &&
      !WorldBossHelper.checkIsNoviceMap(this.mapModel.mapId)
    ) {
      flag = true;
    } else if (
      this.mapModel &&
      this.mapModel.campaignTemplate.Types == 0 &&
      this.mapModel.campaignTemplate.isKingTower
    ) {
      flag = true;
    } else if (
      this.mapModel &&
      this.mapModel.campaignTemplate.Types == 0 &&
      this.mapModel.campaignTemplate.SonTypes != 0
    ) {
      flag = true;
    }
    return flag;
  }

  private __addArmyHandler(data1: any, data2?: any) {
    if (data2) return;
    if (this.mapModel && this.mapModel.campaignTemplate.Capacity > 1) {
      let army: CampaignArmy = data1 as CampaignArmy;
      if (army) this.addItem(army);
    }
  }
  /**
   * 有人退出副本 移出队伍
   * @param army
   *
   */
  private removeItem(army: CampaignArmy) {
    for (let i = 0; i < this._addFriendlistData.length; i++) {
      let item = this._addFriendlistData[i];
      if (item && item == army) {
        this._addFriendlistData.splice(i, 1);
      }
    }
    this.roomteamInfoUpdate();
  }

  /**
   * 加入队伍
   * @param army
   *
   */
  private addItem(army: CampaignArmy) {
    if (this._addFriendlistData) {
      this._addFriendlistData.push(army);
    }
    this.roomteamInfoUpdate();
  }

  private __removeArmyHandler(data1: any) {
    let army: CampaignArmy = data1 as CampaignArmy;
    if (army) this.removeItem(army);
  }

  private roomteamInfoUpdate() {
    if (this.roomInfo) {
      this.scrollList.numItems = this._addFriendlistData.length;
      this.refreshRoomAddFriendView();
    } else {
      //房间销毁了
      this._addFriendlistData = [];
      this.scrollList.numItems = ComponentSetting.TEAM_NUM;
      this.changeBattleStatusBtn.visible = this.lookBattleStatusBtn.visible =
        false;
    }
  }

  private refreshRoomAddFriendView() {
    this.__houseownerChangeHandler();
  }

  private __houseownerChangeHandler() {
    this.changeBattleStatusBtn.visible =
      this.lookBattleStatusBtn.visible =
      this.infoGroup.visible =
        false;
    if (!this.roomInfo) {
      this._addFriendlistData = [];
      this.scrollList.numItems = ComponentSetting.TEAM_NUM;

      return;
    } else {
      this._addFriendlistData = [];
      if (this.mapModel) {
        let dic: Map<string, CampaignArmy> = this.mapModel.allBaseArmy;
        if (dic) {
          dic.forEach((element) => {
            this._addFriendlistData.push(element);
          });
        }
      }
      this._addFriendlistData = ArrayUtils.sortOn(
        this._addFriendlistData,
        "pos",
        ArrayConstant.NUMERIC,
      );
      if (this._addFriendlistData.length < ComponentSetting.TEAM_NUM) {
        this.showQuickInvite.selectedIndex = 1;
        // this.scrollList.numItems = ComponentSetting.TEAM_NUM + 1;
      } else {
        this.showQuickInvite.selectedIndex = 0;
      }
      this.scrollList.numItems = ComponentSetting.TEAM_NUM;
      if (this.tablist.selectedIndex == 1) {
        if (this.roomInfo) {
          if (this.roomInfo.isCross) {
            if (
              this.roomInfo.houseOwnerId == this.playerInfo.userId &&
              this.checkIsPve &&
              this.playerInfo.serviceName == this.roomInfo.serverName
            ) {
              this.changeBattleStatusBtn.visible = true;
            } else {
              this.lookBattleStatusBtn.visible = true;
            }
          } else {
            if (
              this.roomInfo.houseOwnerId == this.playerInfo.userId &&
              this.checkIsPve
            ) {
              this.changeBattleStatusBtn.visible = true;
            } else {
              this.lookBattleStatusBtn.visible = true;
            }
          }
        }
      }
    }
  }

  /**渲染Tab列表 */
  private renderListItem(index: number, item) {
    let selectTabIndex = this.tablist.selectedIndex;
    let datalist = [];
    switch (selectTabIndex) {
      case 0:
        datalist = this._taskListData; //任务详情
        break;
      case 1:
        datalist = this._addFriendlistData; //添加好友
        break;
      case 2:
        datalist = this._queueDatalist; //冷却队列
        break;
      default:
        break;
    }
    let dataObject = datalist[index];
    if (selectTabIndex == 1) {
      // if (index + 1 > ComponentSetting.TEAM_NUM) {
      // 	item.quickInviteBtn();
      // }
      item.vData = dataObject;
    } else {
      if (dataObject) item.vData = dataObject;
    }

    if (!SpaceTaskInfoWnd.ISINIT && index >= datalist.length - 1) {
      SpaceTaskInfoWnd.ISINIT = true;
    }
  }

  private onClickItem(item: any, _evt: Laya.Event) {
    if (item && item.vData && item instanceof TaskAddFriendItem) {
      if (this.selectedItem && this.selectedItem == item) {
        //点击的是同一个
        this.setInfoGroupVisible(!this.infoGroup.visible);
      } else {
        //点击的不是同一个
        this.selectedItem = item;
        this.setInfoGroupVisible(true);
      }
      this.infoGroup.y = item.y + this.scrollList.y;
      if (
        this.infoGroup.y + this.y + this.infoGroup.height >
        StageReferance.stageHeight
      ) {
        this.infoGroup.y =
          StageReferance.stageHeight - this.infoGroup.height - this.y;
      }
      this.userId = this.selectedItem.vData.baseHero.userId;
      this.serverName = this.selectedItem.vData.baseHero.serviceName;
      this.userName = this.selectedItem.vData.baseHero.nickName;
      this.consortiaId = this.selectedItem.vData.baseHero.consortiaID;
      this.consortiaName = this.selectedItem.vData.baseHero.consortiaName;
    } else {
      this.setInfoGroupVisible(false);
    }
    if (this.infoGroup.visible) {
      this.initGroup();
    }
  }

  private setCrossBtnVisible() {
    this.lookInfoBtn.visible = false;
    this.addFriendBtn.visible = false;
    this.inviteConsortiaBtn.visible = false;
    this.selfContractBtn.visible = false;
    this.followBtn.visible = false;
    this.leaveTeamBtn.visible = false;
    this.copyNameBtn.visible = false;
    this.blackListBtn.visible = false;
    this.captainTansferBtn.y = this.infoGroup.y + 8;
    this.removeTeamBtn.y = this.infoGroup.y + 64;
    this.infoImg.width = 149;
    this.infoImg.height = 122;
  }

  private initGroup() {
    this.addFriendBtn.enabled = true;
    this.inviteConsortiaBtn.enabled = false;
    this.selfContractBtn.enabled = true;
    this.followBtn.enabled = true;
    this.blackListBtn.enabled = true;
    this.captainTansferBtn.enabled = true;
    this.copyNameBtn.enabled = true;
    this.lookInfoBtn.enabled = true;

    this.lookInfoBtn.visible = true;
    this.addFriendBtn.visible = true;
    this.inviteConsortiaBtn.visible = true;
    this.selfContractBtn.visible = true;
    this.followBtn.visible = true;
    this.leaveTeamBtn.visible = true;
    this.copyNameBtn.visible = true;
    this.captainTansferBtn.visible = true;
    this.removeTeamBtn.visible = true;
    this.blackListBtn.visible = true;
    this.captainTansferBtn.y = this.infoGroup.y + 181;
    this.removeTeamBtn.y = this.infoGroup.y + 236;
    this.infoImg.width = 288;
    this.infoImg.height = 291;
    if (this.roomInfo && this.roomInfo.isCross) {
      this.removeTeamBtn.title = LangManager.Instance.GetTranslation(
        "spacetaskwnd.removeTeamBtn.title1",
      );
    } else {
      this.removeTeamBtn.title = LangManager.Instance.GetTranslation(
        "map.campaign.view.frame.ArmyManageFrame.kick",
      );
      ("投票踢出");
    }
    this.removeTeamBtn.enabled = true;
    this.leaveTeamBtn.enabled = true;
    let fInfo: FriendItemCellInfo = IMManager.Instance.getFriendInfo(
      this.userId,
    );
    if (fInfo) {
      switch (fInfo.relation) {
        case RelationType.FRIEND:
          this.addFriendBtn.title = LangManager.Instance.GetTranslation(
            "friends.im.IMFrame.delFriend",
          );
          break;
        case RelationType.STRANGER:
          this.addFriendBtn.title = LangManager.Instance.GetTranslation(
            "chatII.view.ChatItemMenu.addfriendText",
          );
          break;
        case RelationType.BLACKLIST:
          this.blackListBtn.enabled = false;
          break;
      }
    } else {
      this.addFriendBtn.title = LangManager.Instance.GetTranslation(
        "chatII.view.ChatItemMenu.addfriendText",
      );
    }
    if (!this.sameServiceName()) {
      this.selfContractBtn.enabled = false;
      this.addFriendBtn.enabled = false;
      this.blackListBtn.enabled = false;
    } else {
      if (this.isSelf()) {
        //自己除复制名称 全灰
        this.lookInfoBtn.enabled = false;
        this.followBtn.enabled = false;
        this.selfContractBtn.enabled = false;
        this.addFriendBtn.enabled = false;
        this.blackListBtn.enabled = false;
      }
    }
    if (SceneManager.Instance.currentType == SceneType.OUTER_CITY_SCENE) {
      this.followBtn.enabled = false;
    }
    if (WorldBossHelper.checkShowRoomTeam()) {
      this.followBtn.enabled = false;
      this.leaveTeamBtn.enabled = false; //离开
      if (
        this.roomInfo &&
        this.roomInfo.houseOwnerId == this.playerInfo.userId
      ) {
        if (this.roomInfo.isCross) {
          if (this.roomInfo.serverName == this.playerInfo.serviceName) {
            //自己是队长
            if (
              this.userId == this.playerInfo.userId &&
              this.serverName == this.playerInfo.serviceName
            ) {
              //点击自己
              this.removeTeamBtn.enabled = false;
              this.captainTansferBtn.enabled = false; //转让
            } else {
              this.captainTansferBtn.enabled = true;
              this.removeTeamBtn.enabled = true;
            }
          } else {
            if (
              this.userId == this.playerInfo.userId &&
              this.serverName == this.playerInfo.serviceName
            ) {
              //点击自己
              this.removeTeamBtn.enabled = false;
              this.captainTansferBtn.enabled = false; //转让
            } else {
              this.removeTeamBtn.enabled = true;
              this.captainTansferBtn.enabled = false; //转让
            }
          }
          this.setCrossBtnVisible();
        } else {
          if (this.userId == this.playerInfo.userId) {
            //点击的是自己
            this.removeTeamBtn.enabled = false; //踢人
            this.captainTansferBtn.enabled = false; //转让
          } else {
            this.removeTeamBtn.enabled = true;
            this.captainTansferBtn.enabled = true;
          }
        }
      } else {
        //自己不是队长
        if (this.roomInfo.isCross) {
          if (
            this.userId == this.playerInfo.userId &&
            this.serverName == this.playerInfo.serviceName
          ) {
            this.removeTeamBtn.enabled = false;
          }
          this.captainTansferBtn.enabled = false;
          this.setCrossBtnVisible();
        } else {
          this.removeTeamBtn.enabled = false;
          this.captainTansferBtn.enabled = false;
        }
      }
    } else {
      if (this.captainId == this.playerInfo.userId) {
        //如果自己是队长
        if (this.userId == this.playerInfo.userId) {
          //点击的是自己
          this.removeTeamBtn.enabled = false;
          this.captainTansferBtn.enabled = false;
          this.leaveTeamBtn.enabled = true;
        } else {
          this.removeTeamBtn.enabled = true;
          this.leaveTeamBtn.enabled = false;
          this.captainTansferBtn.enabled = true;
        }
      } else {
        //自己不是队长
        if (this.userId != this.playerInfo.userId) {
          //点击的是别人
          this.removeTeamBtn.enabled = false;
          this.captainTansferBtn.enabled = false;
          this.leaveTeamBtn.enabled = false;
        } else {
          //点击的是自己
          this.removeTeamBtn.enabled = false;
          this.captainTansferBtn.enabled = false;
          this.leaveTeamBtn.enabled = true;
        }
      }
    }
    if (FreedomTeamManager.Instance.model) {
      if (
        FreedomTeamManager.Instance.model.followId == 0 ||
        FreedomTeamManager.Instance.model.followId != this.userId
      ) {
        this.followBtn.title = LangManager.Instance.GetTranslation(
          "yishi.view.PlayerMenu.follow",
        );
      } else {
        this.followBtn.title = LangManager.Instance.GetTranslation(
          "map.internals.mediator.team.FreedomTeamFollowMediator.Tips02",
        );
      }
    }
    if (PlayerManager.Instance.currentPlayerModel.playerInfo.consortiaID > 0) {
      let showConsortia: boolean = (
        FrameCtrlManager.Instance.getCtrl(
          EmWindow.Consortia,
        ) as ConsortiaControler
      ).getRightsByIndex(ConsortiaDutyInfo.PASSINVITE);
      showConsortia =
        showConsortia &&
        this.consortiaId <= 0 &&
        StringHelper.isNullOrEmpty(this.consortiaName);
      this.inviteConsortiaBtn.enabled = showConsortia;
    }
    if (this.inviteConsortiaBtn.enabled) {
      //请求查询是否是对方的黑名单
      FriendManager.getInstance().reqBlackList(this.userId);
    }
  }

  //不同渲染聊天单元格
  private getListItemResource(_index: number) {
    let selectIndex = this.tablist.selectedIndex;
    this.changeBattleStatusBtn.visible = this.lookBattleStatusBtn.visible =
      false;
    this.setInfoGroupVisible(false);
    switch (selectIndex) {
      case 0:
        return FUI_TaskRingItem.URL; //任务详情
      case 1:
        if (FreedomTeamManager.Instance.hasTeam) {
          if (this.captainId == this.playerInfo.userId) {
            //队长
            this.changeBattleStatusBtn.visible = true;
          } else {
            this.lookBattleStatusBtn.visible = true;
          }
        }
        return FUI_TaskAddFriendItem.URL; //添加队友
      case 2:
        return FUI_QueueItem.URL; //冷却CD
      default:
        break;
    }
  }

  // 收缩的时候如果有提示显示红点
  private setBtnUnFoldRedDotVisible(visible: boolean) {
    if (UIButton.hasRedDot(this.BtnUnFold.view)) {
      let redCom = this.BtnUnFold.selfRedDotCom();
      if (redCom) {
        redCom.alpha = visible ? 1 : 0;
        if (visible) {
          redCom.x -= 5;
          redCom.y -= 5;
        }
      }
    }
  }

  private setBtnFoldVisible(b: boolean = true) {
    this.BtnFold.visible = b;
    this.BtnUnFold.visible = !b;
  }

  private _serverName: string;
  private onLookInfo() {
    PlayerManager.Instance.addEventListener(
      RequestInfoEvent.REQUEST_SIMPLEINFO,
      this.__recentContactHandler,
      this,
    );
    if (
      this._serverName &&
      this._serverName !=
        PlayerManager.Instance.currentPlayerModel.playerInfo.serviceName
    ) {
      PlayerInfoManager.Instance.sendRequestSimpleInfoCross(
        this.userId,
        this._serverName,
      );
    } else {
      PlayerInfoManager.Instance.sendRequestSimpleInfo(this.userId);
    }
  }

  private __recentContactHandler(data1: number, data2: ThaneInfo) {
    PlayerManager.Instance.removeEventListener(
      RequestInfoEvent.REQUEST_SIMPLEINFO,
      this.__recentContactHandler,
      this,
    );
    let thane: ThaneInfo = data2;
    // thane.isRobot = this._isRobot;
    if (!(thane && thane.nickName)) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "ChatItemMenu.cannotSearchPlayerInfo",
        ),
      );
      return;
    }
    if (data1 == 10000) {
      PlayerInfoManager.Instance.show(thane, 10000);
    } else {
      PlayerInfoManager.Instance.show(thane);
    }
    this.setInfoGroupVisible(false);
  }

  private btnFoldClick() {
    if (this._tweening) {
      // Logger.xjy("[SpaceTaskInfoWnd]btnFoldClick 缓动中")
      return;
    }

    // Logger.xjy("[SpaceTaskInfoWnd]开始收缩任务栏")

    this.gComTaskInfo.x == 0;
    this._tweening = true;
    this.infoGroup.visible = false;
    this.setBtnFoldVisible(true);
    this.setBtnUnFoldRedDotVisible(true);
    Laya.Tween.to(
      this.gComTaskInfo,
      { x: this.hideX },
      500,
      Laya.Ease.quadOut,
      Laya.Handler.create(this, () => {
        // Logger.xjy("[SpaceTaskInfoWnd]收缩缓动结束")
        this._tweening = false;
        this._showing = false;
        this.showNoviceArrowWithFlag(false);
        this.setBtnFoldVisible(false);
        this.runNoviceShineFunc();
        this.runNoviceFunc();
      }),
    );
  }

  private btnUnFoldClick(useSound?: boolean) {
    if (this._tweening) {
      // Logger.xjy("[SpaceTaskInfoWnd]btnUnFoldClick 缓动中")
      return;
    }
    // Logger.xjy("[SpaceTaskInfoWnd]开始展开任务栏")
    // 有红点默认选择任务栏 隐藏收缩按钮上的红点
    if (UIButton.hasRedDot(this.BtnUnFold.view)) {
      this.tab.selectedIndex = 0;
    }

    this.gComTaskInfo.x == this.hideX;
    this._tweening = true;
    this.infoGroup.visible = false;
    this.__onTabChange(useSound);
    this.setBtnFoldVisible(true);
    this.setBtnUnFoldRedDotVisible(false);
    Laya.Tween.to(
      this.gComTaskInfo,
      { x: 0 },
      500,
      Laya.Ease.quadOut,
      Laya.Handler.create(this, () => {
        // Logger.xjy("[SpaceTaskInfoWnd]展开缓动结束")
        this._tweening = false;
        this._showing = true;
        this.showNoviceArrowWithFlag(true);
        this.runNoviceShineFunc();
        this.runNoviceFunc();
      }),
    );
  }

  private onQuickInviteHandler() {
    let ctrl = FrameCtrlManager.Instance.getCtrl(
      EmWindow.RoomHall,
    ) as RoomHallCtrl;
    if (ctrl) {
      ctrl.quickInvite();
    }
    // FrameCtrlManager.Instance.open(EmWindow.QuickInvite, { roomSceneType: RoomSceneType.PVE });
  }

  /**调整阵型 */
  private onChangeHandler() {
    if (WorldBossHelper.checkShowRoomTeam()) {
      FrameCtrlManager.Instance.open(EmWindow.TeamFormation, {
        isHouseOwner: true,
        openType: 0,
      });
    } else {
      FrameCtrlManager.Instance.open(EmWindow.TeamFormation, {
        isHouseOwner: true,
        openType: 1,
      });
    }
  }

  /**查看阵型 */
  private onLookHandler() {
    if (WorldBossHelper.checkShowRoomTeam()) {
      FrameCtrlManager.Instance.open(EmWindow.TeamFormation, {
        isHouseOwner: false,
        openType: 0,
      });
    } else {
      FrameCtrlManager.Instance.open(EmWindow.TeamFormation, {
        isHouseOwner: false,
        openType: 1,
      });
    }
  }

  /**踢人 */
  private removeTeamHander() {
    this.setInfoGroupVisible(false);
    let content: string = LangManager.Instance.GetTranslation(
      "map.internals.view.team.FreedomTeamManageFrame.kickTipTxt",
    );
    let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
    let confirm: string = LangManager.Instance.GetTranslation("public.confirm");
    let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
    SimpleAlertHelper.Instance.Show(
      SimpleAlertHelper.SIMPLE_ALERT,
      [this.userId, this.serverName],
      prompt,
      content,
      confirm,
      cancel,
      this.__requestKickBtnHandler.bind(this),
    );
  }

  private __requestKickBtnHandler(b: boolean, _flag: boolean, data: any) {
    if (b) {
      if (WorldBossHelper.checkShowRoomTeam()) {
        if (this.roomInfo.isCross) {
          RoomSocketOutManager.crossSendKickingInfo(data[0], data[1]);
        } else {
          RoomSocketOutManager.sendKickingInfo(data[0]);
        }
      } else {
        FreedomTeamSocketOutManager.sendKickMember(data[0]);
        this.setInfoGroupVisible(false);
      }
    }
  }

  /**离开队伍 */
  private leaveTeamHandler() {
    let content: string = LangManager.Instance.GetTranslation(
      "map.internals.view.team.FreedomTeamManageFrame.quitTipTxt",
    );
    let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
    let confirm: string = LangManager.Instance.GetTranslation("public.confirm");
    let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
    SimpleAlertHelper.Instance.Show(
      SimpleAlertHelper.SIMPLE_ALERT,
      null,
      prompt,
      content,
      confirm,
      cancel,
      this.__requestQuitBtnHandler.bind(this),
    );
  }

  private __requestQuitBtnHandler(b: boolean, _flag: boolean) {
    if (b) {
      FreedomTeamSocketOutManager.sendQuik();
      this.setInfoGroupVisible(false);
    }
  }

  /**跟随 */
  private followHandler() {
    if (FreedomTeamManager.Instance.hasTeam) {
      if (this.selectedItem.vData) {
        if (
          this.followBtn.title ==
          LangManager.Instance.GetTranslation(
            "map.internals.mediator.team.FreedomTeamFollowMediator.Tips02",
          )
        ) {
          FreedomTeamManager.Instance.model.followId = 0;
          NotificationManager.Instance.sendNotification(
            NotificationEvent.LOCK_TEAM_FOLLOW_TARGET,
            0,
          );
        } else {
          FreedomTeamManager.Instance.model.followId = this.userId; //我点跟随时保存被跟随者id
          NotificationManager.Instance.sendNotification(
            NotificationEvent.LOCK_TEAM_FOLLOW_TARGET,
            this.userId,
          );
        }
      }
    }
    this.setInfoGroupVisible(false);
  }

  /**队长转移 */
  private captainTansferHandler() {
    if (WorldBossHelper.checkShowRoomTeam()) {
      if (this.roomInfo.isCross) {
        //跨服
        // if(!(this.playerInfo.userId == this.houseOwnerId
        //     && this.playerInfo.userId == this.userId
        //     && this.roomInfo.serverName == this.playerInfo.serviceName))
        RoomSocketOutManager.sendChangeRoomOwner(
          this.userId,
          this.selectedItem.vData.baseHero.serviceName,
        );
      } else {
        if (
          this.playerInfo.userId == this.houseOwnerId &&
          this.playerInfo.userId != this.userId
        ) {
          RoomSocketOutManager.sendChangeRoomOwner(this.userId);
        }
      }
    } else {
      if (
        this.playerInfo.userId == this.captainId &&
        this.playerInfo.userId != this.userId
      ) {
        FreedomTeamSocketOutManager.sendChangeCaptain(this.userId);
      }
    }
    this.setInfoGroupVisible(false);
  }

  /**私聊 */
  private selfContractHandler() {
    //打开私聊界面
    if (!FrameCtrlManager.Instance.isOpen(EmWindow.ChatWnd)) {
      FrameCtrlManager.Instance.open(EmWindow.ChatWnd, {
        thaneInfo: this.selectedItem.vData.baseHero,
        type: 1,
      });
    }
    this.setInfoGroupVisible(false);
  }

  /**复制名称 */
  private copyNameHandler() {
    SDKManager.Instance.getChannel().copyStr(this.userName);
    this.setInfoGroupVisible(false);
  }

  /**邀请入会 */
  inviteConsortiaBtnHandler() {
    if (FriendManager.getInstance().isInBlackList) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("chat.notfriend02"),
      );
      return;
    }
    (
      FrameCtrlManager.Instance.getCtrl(
        EmWindow.Consortia,
      ) as ConsortiaControler
    ).sendConsortiaInvitePlayer(this.userId);
    this.setInfoGroupVisible(false);
  }

  /**加入黑名单 */
  private blackListHandler() {
    if (ArmyManager.Instance.thane.grades < 6) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("chat.view.ChatItemMenu.command01"),
      );
      this.setInfoGroupVisible(false);
      return;
    }
    FriendManager.getInstance().sendAddFriendRequest(
      this.selectedItem.vData.baseHero.nickName,
      RelationType.BLACKLIST,
    );
    this.setInfoGroupVisible(false);
  }

  /**添加好友 */
  private addFriendHandler() {
    if (ArmyManager.Instance.thane.grades < 6) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("chat.view.ChatItemMenu.command01"),
      );
      this.infoGroup.visible = false;
      return;
    }

    if (
      this.addFriendBtn.title ==
      LangManager.Instance.GetTranslation("friends.im.IMFrame.delFriend")
    ) {
      FriendManager.getInstance().sendRemoveFriendRequest(this.userId);
    } else {
      FriendManager.getInstance().sendAddFriendRequest(
        this.userName,
        RelationType.FRIEND,
      );
    }

    this.setInfoGroupVisible(false);
  }

  private __upgradeHandler() {
    if (this.thane.grades >= 6 || this.thane.grades >= 11) {
      this.refreshQueueView();
    }
  }

  private __addQueueItemHandler() {
    this.refreshQueueView();
  }

  private __colosseumTimeHandler(pkg: PackageIn) {
    let order: BuildingOrderInfo =
      BuildingManager.Instance.model.colosseumOrderList[0];
    let msg: ChallengeCoolTimeMsg = pkg.readBody(
      ChallengeCoolTimeMsg,
    ) as ChallengeCoolTimeMsg;
    if (msg.type == 1) return;
    order.totalCount = msg.totalCount;
    order.currentCount = msg.challengeCount;
    order.totalBuyCount = msg.totalBuyCount;
    order.remainTime = msg.leftTime;
  }

  private __UpvipInfoHandler() {
    this.refreshQueueView();
    // if (this.vipModel.vipInfo.IsVipAndNoExpirt) {
    //     for (let i: number = 0; i < this.scrollList.numChildren; i++) {
    //         let item: QueueItem = this.scrollList.getChildAt(i) as QueueItem;
    //         if (item && item.vData && item.vData.remainTime > 0) {
    //             // item.__itemClickHandler();
    //         }
    //     }
    // }
  }

  private refreshQueueView() {
    let datalist = BuildingManager.Instance.model.queneList;
    this._queueDatalist = datalist;
    if (this.tablist.selectedIndex != 2) return;
    this.scrollList.numItems = this._queueDatalist.length;
  }

  private refreshOuterCityView() {
    if (TaskManage.Instance.IsTaskFinish(TaskManage.SETARMY_TASK)) {
      this.outercityBoss.selectedIndex = 0;
    } else {
      this.outercityBoss.selectedIndex = 1;
    }
  }

  /**列表切换  选择*/
  private __onTabChange(useSound?: boolean) {
    if (useSound == undefined || useSound == true)
      //默认打开不用播放音效
      AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
    if (this.delayTimeId) clearTimeout(this.delayTimeId);
    let selectedIndex = this.tablist.selectedIndex;
    this.scrollList.numItems = 0;
    switch (selectedIndex) {
      case 0: //任务
        this.refreshTaskView();
        if (this._noviceArrowShowFlag) {
          this.showNoviceArrowWithFlag(true);
        }
        break;
      case 1: //邀请队友
        this._noviceArrow.visible = false;
        if (WorldBossHelper.checkShowRoomTeam()) {
          this.refreshRoomAddFriendView();
        } else {
          this.refreshAddFriendView();
        }
        break;
      case 2: //冷却CD
        this._noviceArrow.visible = false;
        this.refreshQueueView();
        break;
      case 3:
        this._noviceArrow.visible = false;
        if (
          this.thane.grades < OpenGrades.TRANSFER &&
          this._lastTabIndex != 3
        ) {
          this.tablist.selectedIndex = this._lastTabIndex;
          selectedIndex = this._lastTabIndex;
          this.__onTabChange(useSound);
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation("public.unopen2"),
          );
        } else {
          this.refreshOuterCityView();
        }
        break;
    }

    this._lastTabIndex = selectedIndex;
  }

  private __teamInfoUpdateHandler() {
    if (this.tablist.selectedIndex != 1) return;
    this.infoGroup.visible = false;
    if (FreedomTeamManager.Instance.hasTeam) {
      this.refreshAddFriendView();
      if (this.tablist.selectedIndex == 1) {
        if (this.captainId == this.playerInfo.userId) {
          //队长
          this.changeBattleStatusBtn.visible = true;
        } else {
          this.lookBattleStatusBtn.visible = true;
        }
      }
    } else {
      //队伍销毁了
      this._addFriendlistData = [];
      this.scrollList.numItems = ComponentSetting.TEAM_NUM;
      this.changeBattleStatusBtn.visible = this.lookBattleStatusBtn.visible =
        false;
    }
  }

  private __updateKingContractHandler() {
    this.delayRefreshView();
  }

  private __taskFinishHandler() {
    this.delayRefreshView();
  }

  private __taskChangeHandler() {
    this.delayRefreshView();
  }

  private delayRefreshView() {
    if (this.tablist.selectedIndex != 0) return;
    this.refreshTaskView();
  }

  private refreshTaskView() {
    if (this.tablist.selectedIndex != 0) return;
    this.scrollList.numItems = 0;
    let redPointTip: number = 0;
    let arr = [];

    // 主线支线任务
    let taskList: Array<TaskTemplate | BaseOfferReward> =
      this.cate.acceptedList;
    let taskLen: number = taskList.length;
    let info: TaskTemplate;
    for (let i: number = 0; i < taskLen; i++) {
      info = taskList[i] as TaskTemplate;
      info.sortFlag = info.hasCompleted;
      arr.push(info);
    }

    // 悬赏任务
    taskList = this.rewardModel.baseRewardDic.getList();
    taskLen = taskList.length;
    let rewardInfo: BaseOfferReward;
    for (let i: number = 0; i < taskLen; i++) {
      rewardInfo = taskList[i] as BaseOfferReward;
      arr.push(rewardInfo);
    }
    let index: number = 0;
    for (index = 0; index < arr.length; index++) {
      arr[index].sortFlag = arr[index].isCompleted;
    }

    // 跑环任务
    let ringtaskInfos: any[];
    let taskInfo: RingTask;
    let len: number = 0;
    if (RingTaskManager.Instance.getRingTask()) {
      ringtaskInfos = this.ringTaskModel.hasAccessList.getList();
      len = ringtaskInfos.length;
      for (let i: number = 0; i < len; i++) {
        taskInfo = ringtaskInfos[i] as RingTask;
        taskInfo.sortFlag = taskInfo.hasCompleted || taskInfo.isCompleted;
        arr.push(taskInfo);
      }
      arr = ArrayUtils.sortOn(
        arr,
        ["sortFlag", "TemplateType", "changeDate", "Sort"],
        [
          ArrayConstant.DESCENDING,
          ArrayConstant.NUMERIC,
          ArrayConstant.DESCENDING | ArrayConstant.NUMERIC,
          ArrayConstant.NUMERIC,
        ],
      );
    } else {
      ringtaskInfos = RingTaskManager.Instance._defaultList.getList();
      len = ringtaskInfos.length;
      for (let i: number = 0; i < len; i++) {
        taskInfo = ringtaskInfos[i] as RingTask;
        taskInfo.sortFlag = taskInfo.hasCompleted || taskInfo.isCompleted;
        arr.unshift(taskInfo);
      }
      arr = ArrayUtils.sortOn(
        arr,
        ["sortFlag", "TemplateType", "changeDate", "Sort"],
        [
          ArrayConstant.DESCENDING,
          ArrayConstant.NUMERIC,
          ArrayConstant.DESCENDING | ArrayConstant.NUMERIC,
          ArrayConstant.NUMERIC,
        ],
      );
    }
    for (index = 0; index < arr.length; index++) {
      if (arr[index].isCompleted) {
        redPointTip++;
      }
      if (arr[index] instanceof TaskTemplate) {
        for (let m: number = 0; m < arr[index].conditionList.length; m++) {
          let con: t_s_questcondictionData = arr[index].conditionList[m];
          if (con.CondictionType == TaskConditionType.PHONE_CHECK) {
            this.setMobileToTop(arr, index);
          }
        }
      }
    }
    this._taskListData = ArrayUtils.arrayNonRepeatfy(arr); //去重
    this.scrollList.numItems = this._taskListData.length;

    this.BtnUnFold.selfRedDot(redPointTip > 0 ? 1 : 0);
    this.BtnUnFold.selfRedDotPos(48, 10, true);

    UIButton.setRedDot(
      this.taskTabBtn as fgui.GComponent,
      redPointTip > 0 ? 1 : 0,
    );
    this.setBtnUnFoldRedDotVisible(!this.showing);
    if (this.scrollList.numItems > 0) {
      this.scrollList.scrollToView(0); //当玩家完成任务时, 需要将任务栏上拉到顶
    } else {
      this.scrollList.scrollPane.scrollTop();
    }
    // Logger.xjy("[SpaceTaskInfoWnd]refreshTaskView", this._taskListData)
  }

  private setMobileToTop(arr: any[], index: number) {
    let indexNotCompleted: number; //第一个未完成的任务位置
    for (let i: number = 0; i < arr.length; i++) {
      if (arr[i].isCompleted == false) {
        indexNotCompleted = i;
        break;
      }
    }
    let mobileTem: TaskTemplate = arr[index] as TaskTemplate;
    arr.splice(index, 1);
    if (mobileTem.isCompleted == false) {
      arr.splice(indexNotCompleted, 0, mobileTem);
    } else {
      arr.splice(0, 0, mobileTem);
    }
  }

  private refreshAddFriendView() {
    if (!FreedomTeamManager.Instance.hasTeam) {
      this._addFriendlistData = [];
      this.scrollList.numItems = ComponentSetting.TEAM_NUM;
      this.changeBattleStatusBtn.visible = this.lookBattleStatusBtn.visible =
        false;
      return;
    } else {
      this._addFriendlistData = FreedomTeamManager.Instance.model.allMembers;
      this.scrollList.numItems = ComponentSetting.TEAM_NUM;
    }
  }

  private checkRefreshCall() {
    if (PlayerManager.Instance.isExistNewbieMask == false) {
      clearInterval(this._refreshTimerId);
      this._refreshTimerId = 0;
      this.delayRefreshView();
    }
  }

  private openTaskIWnd() {
    FrameCtrlManager.Instance.open(EmWindow.TaskWnd);
  }

  // 新手地图只显示任务按钮
  private checkTouchEnableTabListBtn() {
    let b = NewbieModule.Instance.checkEnterCastle();
    for (let index = 0; index < this.tablist.numChildren; index++) {
      if (index > 0) {
        this.tablist.getChildAt(index).touchable = b;
      } else {
        this.tablist.getChildAt(0).touchable = true;
      }
    }
  }

  // 新手用
  ////////////////////////////////////////////////////////////////////////

  private initNoviceArrow() {
    this._noviceArrow = new NoviceArrowView(
      NoviceArrowView.UP,
      LangManager.Instance.GetTranslation("newbie.autoFindPath"),
      false,
    );
    this._noviceArrow.name = "_noviceArrow";
    this.addChild(this._noviceArrow);
    this._noviceArrow.visible = false;
    this.setArrowPosByTaskTempId();
  }

  private checkShowNoviceMapArrow() {
    if (
      WorldBossHelper.checkIsNoviceMap(CampaignManager.Instance.mapId) &&
      NewbieModule.Instance.checkNodeFinish(NewbieConfig.NEWBIE_10)
    ) {
      this.noviceArrowByState({
        type: 1,
        taskTempId: TaskManage.STUPID_TAURENS_TASK,
        tip: null,
      });
    }
  }

  // 有指引时候收缩任务栏对指引箭头的可见处理
  public showNoviceArrowWithFlag(b: boolean) {
    if (!this._noviceArrow) return;

    this._noviceArrow.visible = b;

    // 收缩了或者标记了不显示
    if (!this._showing || !this._noviceArrowShowFlag) {
      this._noviceArrow.visible = false;
    }
    if (this._shineItem) {
      if (b) {
        if (this._shineItem["startBlink"]) {
          this._shineItem.startBlink(-1);
        }
      } else {
        if (this._shineItem["stopBlink"]) {
          this._shineItem.stopBlink();
        }
      }
    }
  }

  private __selfVisibleHandler(data: any) {
    // Logger.xjy("[SpaceTaskInfoWnd]__selfVisibleHandler", data)

    if (data.callback) {
      this._noviceCallBack = data.callback;
      this._noviceCallArgs = data.callArgs;
    }

    if (data.visible) {
      this.showing ? this.runNoviceFunc() : this.btnUnFoldClick();
    } else {
      !this.showing ? this.runNoviceFunc() : this.btnFoldClick();
    }
  }

  private __mainNodeFinishHandler(nodeId: number) {
    this.checkShowNoviceMapArrow();
  }

  private __noviceArrowSwitchHandler(data: any) {
    this.noviceArrowByState(data);
  }

  private _shineItem: TaskRingItem;
  private noviceArrowByState(obj: any) {
    if (this.tab.selectedIndex != 0) {
      this.tab.selectedIndex = 0;
    }
    if (this.tablist.selectedIndex != 0) {
      this.tablist.selectedIndex = 0;
    }

    // Logger.xjy("[SpaceTaskInfoWnd]noviceArrowByState", obj)
    if (obj.callback) {
      this._noviceCallBack = obj.callback;
      this._noviceCallArgs = obj.callArgs;
    }

    if (!this._noviceArrow) {
      this.runNoviceFunc();
      return;
    }

    this._noviceArrow.tip = obj["tip"]
      ? obj["tip"]
      : LangManager.Instance.GetTranslation("newbie.autoFindPath");

    this._shineItem = this.getTraceItemByTaskTempId(obj.taskTempId);
    if (!this._shineItem) {
      this._shineItem = this.scrollList.getChildAt(0) as TaskRingItem;
    }

    let resetArrowfunc = () => {
      this._noviceArrowShowFlag = false;
      this.showNoviceArrowWithFlag(false);
      this._noviceArrow.stopEffect();
      this._shineItem = null;
      this._noviceCurTaskTempId = 0;
      this.runNoviceFunc();
    };
    let type = Number(obj["type"]);
    switch (type) {
      case 1:
        this._noviceArrowShowFlag = true;
        if (this.showing) {
          this.showNoviceArrowWithFlag(true);
          this.runNoviceFunc();
        } else {
          this.btnUnFoldClick();
        }
        this._noviceArrow.showTween();
        this._noviceArrow.playEffect();
        this.setArrowPosByTaskTempId(obj.taskTempId ? obj.taskTempId : 0);
        break;
      case 0:
        if (WorldBossHelper.checkIsNoviceMap(CampaignManager.Instance.mapId)) {
          // 新手地图箭头常驻
        } else {
          // 点击（TaskWnd中的奖励按钮 或 当前界面Item）完成任务时需要关闭当前存在的新手指引任务箭头
          if (obj.taskTempId) {
            if (
              this._noviceCurTaskTempId > 0 &&
              obj.taskTempId == this._noviceCurTaskTempId
            ) {
              resetArrowfunc();
            }
          } else {
            resetArrowfunc();
          }
        }
        break;
    }
  }

  // 需要等任务栏收缩动画做完后才能进行下一步引导 要不然可能报错
  private runNoviceFunc() {
    if (this._noviceCallBack) {
      NewbieUtils.execFunc(this._noviceCallBack, this._noviceCallArgs);
      this._noviceCallBack = null;
      this._noviceCallArgs = null;
    }
  }

  public getTraceItemByTaskTempId(taskTempId: number): TaskRingItem {
    if (this.tablist.selectedIndex != 0) {
      Logger.warn(
        "[SpaceTaskInfoWnd]getTraceItemByTaskTempId 请先切换到任务栏",
        taskTempId,
      );
      return;
    }
    for (let index = 0; index < this.scrollList.numItems; index++) {
      const item = this.scrollList.getChildAt(index) as TaskRingItem;
      if (item.vData) {
        switch (item.vData["TemplateType"]) {
          case -2: //环任务
            if (item.vData["currTaskId"] == taskTempId) {
              return item;
            }
            break;
          case -1:
            if (item.vData["rewardID"] == taskTempId) {
              return item;
            }
            break;
          default:
            if (item.vData["taskId"] == taskTempId) {
              return item;
            }
            break;
        }
      }
    }
    return null;
  }

  public getTaskItemByIndex(index: number): TaskRingItem {
    if (this.tablist.selectedIndex != 0) {
      Logger.warn(
        "[SpaceTaskInfoWnd]getTaskItemByIndex 请先切换到任务栏",
        index,
      );
      return;
    }
    for (let idx = 0; idx < this.scrollList.numChildren; idx++) {
      const item = this.scrollList.getChildAt(idx) as TaskRingItem;
      if (item && idx == index) {
        return item;
      }
    }
    return null;
  }

  public getQueueItemByType(type: number): QueueItem {
    if (this.tablist.selectedIndex != 2) {
      Logger.warn(
        "[SpaceTaskInfoWnd]getQueueItemByType 请先切换到冷却栏",
        type,
      );
      return;
    }
    for (let index = 0; index < this.scrollList.numChildren; index++) {
      const item = this.scrollList.getChildAt(index) as QueueItem;
      if (item && item.type == type) {
        return item;
      }
    }
    return null;
  }

  public scrollToItemByTaskTempId(taskTempId: number) {
    if (this.tablist.selectedIndex != 0) {
      Logger.warn(
        "[SpaceTaskInfoWnd]scrollToItemByTaskTempId 请先切换到任务栏",
        taskTempId,
      );
      return;
    }
    let item = this.getTraceItemByTaskTempId(taskTempId);
    for (let index = 0; index < this.scrollList.numChildren; index++) {
      if (item == this.scrollList.getChildAt(index)) {
        this.scrollList.scrollToView(index);
        break;
      }
    }
  }

  public static NoviceArrowW = 300;
  public static NoviceArrowH = 180;
  public setArrowPosByTaskTempId(taskTempId: number = 0) {
    if (!this._noviceArrow) return;

    this._noviceArrow.x = 277 / 2;
    this._noviceCurTaskTempId = taskTempId;
    if (taskTempId <= 0) {
      this._noviceArrow.y = -18 + SpaceTaskInfoWnd.NoviceArrowH / 2;
    } else {
      if (!this._noviceArrow.parent) return;
      let item: TaskRingItem = this.getTraceItemByTaskTempId(taskTempId);
      if (item) {
        let itemPos = item.displayObject.localToGlobal(
          new Laya.Point(0, 0),
          false,
          this,
        );
        this._noviceArrow.y =
          -12 + itemPos.y + item.height + SpaceTaskInfoWnd.NoviceArrowH / 2;
      }
    }
  }

  private _noviceShineBack: Function;
  public novicShine(callback, callArgs) {
    if (this.tablist.selectedIndex != 0) {
      this.tablist.selectedIndex = 0;
    }

    let func = () => {
      let item = this.scrollList.getChildAt(0);
      if (item && item["startBlink"]) {
        item["startBlink"](2);
      }

      let imgShine = new fgui.GLoader();
      this.addChild(imgShine.displayObject);
      imgShine.url = FUIHelper.getItemURL(
        EmPackName.Base,
        "Icon_IconBox70_Sel",
      );
      imgShine.fill = fgui.LoaderFillType.ScaleFree;
      imgShine.setSize(377, 480);
      imgShine.setXY(-10, -46);
      TweenMax.to(imgShine, 0.5, {
        alpha: 0,
        yoyo: true,
        repeat: 2,
        onComplete: () => {
          NewbieUtils.execFunc(callback, callArgs);
          ObjectUtils.disposeObject(imgShine);
        },
      });
    };
    this._noviceShineBack = func;
    if (!this.showing) {
      if (this._tweening) {
        this.runNoviceShineFunc();
      } else {
        this.btnUnFoldClick();
      }
    } else {
      this.runNoviceShineFunc();
    }
  }

  private runNoviceShineFunc() {
    if (this._noviceShineBack) {
      this._noviceShineBack();
      this._noviceShineBack = null;
    }
  }

  ////////////////////////////////////////////////////////////////

  private get thane(): ThaneInfo {
    return ArmyManager.Instance.thane;
  }

  public get playerInfo(): PlayerInfo {
    return PlayerManager.Instance.currentPlayerModel.playerInfo;
  }

  private get vipModel(): VIPModel {
    return VIPManager.Instance.model;
  }

  private get buildManager(): BuildingManager {
    return BuildingManager.Instance;
  }

  private get showing() {
    return this._showing;
  }

  private setInfoGroupVisible(value: boolean) {
    this.infoGroup.visible = value;
    if (!value && this.selectedItem) {
      this.selectedItem.selected = false;
    }
  }

  private get cate(): TaskCategory {
    return TaskManage.Instance.cate;
  }

  private get rewardModel(): OfferRewardModel {
    return OfferRewardManager.Instance.model;
  }

  private get ringTaskModel(): RingTaskModel {
    return RingTaskManager.Instance.model;
  }

  private get mapModel(): CampaignMapModel {
    return CampaignManager.Instance.mapModel;
  }

  public get captainId(): number {
    return (
      FreedomTeamManager.Instance.model &&
      FreedomTeamManager.Instance.model.captainId
    );
  }

  private isSelf(): boolean {
    return this.sameServiceName() && this.sameUserId();
  }

  private sameServiceName(): boolean {
    return true;
  }

  private sameUserId(): boolean {
    return (
      this.userId == PlayerManager.Instance.currentPlayerModel.playerInfo.userId
    );
  }

  private get roomInfo(): RoomInfo {
    return RoomManager.Instance.roomInfo;
  }

  private get houseOwnerId(): number {
    return this.roomInfo && this.roomInfo.houseOwnerId;
  }

  private get checkIsPve(): boolean {
    let curScene: string = SceneManager.Instance.currentType;
    let mapModel: CampaignMapModel = CampaignManager.Instance.mapModel;
    if (
      curScene == SceneType.CAMPAIGN_MAP_SCENE &&
      mapModel &&
      mapModel.campaignTemplate &&
      mapModel.campaignTemplate.Capacity > 1 &&
      mapModel.campaignTemplate.Types == 0
    )
      return true;
    else return false;
  }

  public OnHideWind() {
    SpaceTaskInfoWnd.LAST_SELECT_IDNEX = this.tab.selectedIndex;
    this._tweening = false;
    this.offEvent();
    super.OnHideWind();
  }

  public dispose() {
    this.offNewbieEvent();
    this._noviceArrow && this._noviceArrow.dispose();
    super.dispose();
  }
}
