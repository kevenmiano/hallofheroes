//@ts-expect-error: External dependencies
import LangManager from "../../../core/lang/LangManager";
import Logger from "../../../core/logger/Logger";
import UIManager from "../../../core/ui/UIManager";
import { IconFactory } from "../../../core/utils/IconFactory";
import { t_s_upgradetemplateData } from "../../config/t_s_upgradetemplate";
import {
  ArmyEvent,
  ConsortiaEvent,
  FunnyEvent,
  KingContractEvents,
  NotificationEvent,
  PlayerBufferEvent,
  RoomEvent,
  RoomHallEvent,
  SNSEvent,
  WarlordsEvent,
} from "../../constant/event/NotificationEvent";
import { PlayerEvent } from "../../constant/event/PlayerEvent";
import { IconType } from "../../constant/IconType";
import { EmWindow } from "../../constant/UIDefine";
import { UpgradeType } from "../../constant/UpgradeType";
import { ArmyManager } from "../../manager/ArmyManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { ResourceManager } from "../../manager/ResourceManager";
import { SNSManager } from "../../manager/SNSManager";
import { TempleteManager } from "../../manager/TempleteManager";
import HomeWnd from "./HomeWnd";
import BuyHpBtn from "./BuyHpBtn";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import { PlayerBufferManager } from "../../manager/PlayerBufferManager";
import { SceneManager } from "../../map/scene/SceneManager";
import SceneType from "../../map/scene/SceneType";
import { PlayerBufferInfo } from "../../datas/playerinfo/PlayerBufferInfo";
import { PlayerInfo } from "../../datas/playerinfo/PlayerInfo";
import { PlayerModel } from "../../datas/playerinfo/PlayerModel";
import { CampaignManager } from "../../manager/CampaignManager";
import { CampaignArmy } from "../../map/campaign/data/CampaignArmy";
import { CampaignArmyState } from "../../map/campaign/data/CampaignArmyState";
import { WorldBossHelper } from "../../utils/WorldBossHelper";
import FunnyManager from "../../manager/FunnyManager";
import { NotificationManager } from "../../manager/NotificationManager";
import WarlordsManager from "../../manager/WarlordsManager";
import { ThaneInfo } from "../../datas/playerinfo/ThaneInfo";
import { ResourceData } from "../../datas/resource/ResourceData";
import { SimplePlayerInfo } from "../../datas/playerinfo/SimplePlayerInfo";
import LevelUpWnd from "../levelup/LevelUpWnd";
import BufferItem from "./BufferItem";
import { ToolTipsManager } from "../../manager/ToolTipsManager";
import AudioManager from "../../../core/audio/AudioManager";
import { SoundIds } from "../../constant/SoundIds";
import HeadIconModel from "../bag/view/HeadIconModel";
import TransportBufferInfo from "../../datas/playerinfo/TransportBufferInfo";
import { PlayerBufferType } from "../../constant/PlayerBufferType";
import { RoomManager } from "../../manager/RoomManager";
import { RoomInfo } from "../../mvc/model/room/RoomInfo";
import ConfigMgr from "../../../core/config/ConfigMgr";
import { t_s_campaignbufferData } from "../../config/t_s_campaignbuffer";
import { ConfigType } from "../../constant/ConfigDefine";
import { CampaignMapModel } from "../../mvc/model/CampaignMapModel";
import { ConsortiaManager } from "../../manager/ConsortiaManager";

/**
 * @author:pzlricky
 * @data: 2021-02-18 16:59
 * @description ***
 */
export default class RoleCom {
  private roleCom: fgui.GComponent;

  private playerIcon: fgui.GComponent; //顶部图标容器
  public static STEP: number = 9999999;
  public static STEP_ONE: number = 99999;
  public static BLOOD_MAX: number = 1000000;
  public Btn_Buy_Hp: BuyHpBtn; //购买血量
  private userNameTxt: fgui.GBasicTextField;
  public powerValueTxt: fgui.GBasicTextField; //体力
  private levelTxt: fgui.GBasicTextField; //等级
  private fightOpt: fgui.GBasicTextField; //战斗力
  public redStatus: fgui.Controller;
  public Bar_Exp: fgui.GProgressBar;

  private view: HomeWnd;
  public bufferList: fgui.GList;
  private _bufferData: Array<any> = [];
  private _extraBufferData: Array<any> = [];
  private _firstBufferIndex: number = 0;

  private _simpleInfo: SimplePlayerInfo;

  private btnUpAccount: fgui.GButton;
  public static BACK_BUFFER_TEMPLATEID = 2612;
  public static CAMPAIGN_BUFFER_TEMPLATEID1 = 81101;
  public static CAMPAIGN_BUFFER_TEMPLATEID2 = 81102;
  public flag: boolean = false;
  public hasPersonBufferFlag: boolean = false;
  constructor(com: fgui.GComponent, view?: HomeWnd) {
    this.roleCom = com;
    this.view = view;
    this.onInit();
    this.initEvent();
    this.initUserInfo();
    this.refreshBuffer();
    this.refreshPower();
  }

  onInit() {
    this.playerIcon = this.roleCom.asCom.getChild(
      "playerIcon",
    ) as fgui.GComponent;
    this.userNameTxt = this.roleCom.asCom.getChild(
      "userNameTxt",
    ) as fgui.GBasicTextField;
    this.powerValueTxt = this.roleCom.asCom.getChild(
      "powerValueTxt",
    ) as fgui.GBasicTextField;
    this.levelTxt = this.roleCom.asCom.getChild(
      "levelTxt",
    ) as fgui.GBasicTextField;
    this.fightOpt = this.roleCom.asCom.getChild(
      "fightOpt",
    ) as fgui.GBasicTextField;
    this.Btn_Buy_Hp = this.roleCom.asCom.getChild("Btn_Buy_Hp") as BuyHpBtn;
    this.Bar_Exp = this.roleCom.asCom.getChild("Bar_Exp") as fgui.GProgressBar;
    this.bufferList = this.roleCom.asCom.getChild("bufferList") as fgui.GList;
    this.redStatus = this.roleCom.asCom.getController("redStatus");
    this.btnUpAccount = this.roleCom.asCom.getChild(
      "btnUpAccount",
    ) as fgui.GButton;
  }

  public initUserInfo() {
    if (
      PlayerManager.Instance.currentPlayerModel.playerInfo.nickName ==
        PlayerManager.Instance.currentPlayerModel.playerInfo.userId + "$" ||
      PlayerManager.Instance.currentPlayerModel.playerInfo.nickName ==
        LangManager.Instance.GetTranslation("public.nickName")
    ) {
      this.userNameTxt.text =
        LangManager.Instance.GetTranslation("public.nickName"); //新手
    } else {
      this.userNameTxt.text =
        PlayerManager.Instance.currentPlayerModel.playerInfo.nickName;
    }
    this.setLevelTxt();
    this.refreshIcon();
    this.refreshExp();
    this.refreshView();
    this.__updateBloodBtnHandlerr();
    this.refreshBuffer();
    this.updateHeadRedStatus();
  }

  initEvent() {
    this.btnUpAccount.onClick(this, this.onUpgradeAccount);
    this.Btn_Buy_Hp.onClick(this, this.buyHp);
    ToolTipsManager.Instance.register(this.Btn_Buy_Hp);
    this.playerIcon.onClick(this, this.onPersonalCenter.bind(this));
    this.bufferList.itemRenderer = Laya.Handler.create(
      this,
      this.renderListItem,
      null,
      false,
    );
    PlayerManager.Instance.currentPlayerModel.playerInfo.addEventListener(
      PlayerEvent.PLAYER_INFO_UPDATE,
      this.__playerDataUpdate,
      this,
    );
    ArmyManager.Instance.thane.addEventListener(
      PlayerEvent.THANE_LEVEL_UPDATE,
      this.__heroLevelUpdate,
      this,
    );
    ArmyManager.Instance.thane.addEventListener(
      PlayerEvent.THANE_INFO_UPDATE,
      this.__thaneInfoChangeHandler,
      this,
    );
    ArmyManager.Instance.thane.addEventListener(
      PlayerEvent.BLOOD_VISIBLE_UPDATE,
      this.__updateBloodBtnHandlerr,
      this,
    );
    ArmyManager.Instance.thane.addEventListener(
      PlayerEvent.BLOOD_UPDATE,
      this.__updateBloodHandler,
      this,
    );
    ArmyManager.Instance.thane.addEventListener(
      PlayerEvent.THANE_EXP_UPDATE,
      this.__heroExpUpdate,
      this,
    );
    ArmyManager.Instance.army.addEventListener(
      ArmyEvent.ARMY_INFO_CHANGE,
      this.__armyInfoChangeHandler,
      this,
    );
    SNSManager.Instance.addEventListener(
      SNSEvent.SNSINFO_UPDATE,
      this.__snsInfoUpdateHandler,
      this,
    );
    PlayerBufferManager.Instance.addEventListener(
      PlayerBufferEvent.CAMPAIGN_BUFFER_UPDATE,
      this.refreshBuffer,
      this,
    );
    PlayerBufferManager.Instance.addEventListener(
      PlayerBufferEvent.ITEM_BUFFER_UPDATE,
      this.refreshBuffer,
      this,
    );
    this.playerInfo.addEventListener(
      PlayerEvent.WEARY_CHANGE,
      this.refreshPower,
      this,
    );
    this.playerInfo.addEventListener(
      PlayerEvent.IS_AUTO_CHANGE,
      this.refreshBuffer,
      this,
    );
    this.playerInfo.addEventListener(
      PlayerEvent.CONSORTIA_CHANGE,
      this.refreshBuffer,
      this,
    );
    this.playerInfo.addEventListener(
      ConsortiaEvent.CONSORTIA_STUDY,
      this.refreshBuffer,
      this,
    );
    this.playerInfo.addEventListener(
      ConsortiaEvent.CONSORTIA_STUDY_UPGRADE,
      this.refreshBuffer,
      this,
    );
    this.playerInfo.addEventListener(
      PlayerEvent.SEMINARY_EFFECT,
      this.refreshBuffer,
      this,
    );
    this.playerInfo.addEventListener(
      PlayerEvent.WORLDPROSPERITY,
      this.refreshBuffer,
      this,
    );
    this.thane.addEventListener(
      PlayerEvent.BLOOD_VISIBLE_UPDATE,
      this.refreshBuffer,
      this,
    );
    this.playerInfo.addEventListener(
      PlayerEvent.GVGISOPEN,
      this.refreshBuffer,
      this,
    );
    this.playerInfo.addEventListener(
      PlayerEvent.MINERAL,
      this.refreshBuffer,
      this,
    );
    NotificationManager.Instance.addEventListener(
      PlayerEvent.UPDATE_EXTRABUFFER,
      this.refreshBuffer,
      this,
    );
    NotificationManager.Instance.addEventListener(
      KingContractEvents.UPDATE_KINGCONTRACT,
      this.refreshBuffer,
      this,
    );
    this.playerInfo.addEventListener(
      PlayerEvent.CROSS_SCORE_RAWARD,
      this.refreshBuffer,
      this,
    );
    this.playerInfo.addEventListener(
      PlayerEvent.VEHICLESTART,
      this.refreshBuffer,
      this,
    );
    NotificationManager.Instance.addEventListener(
      NotificationEvent.SEMINARY_BLESS,
      this.refreshBuffer,
      this,
    );
    NotificationManager.Instance.addEventListener(
      NotificationEvent.KING_CONTRACT,
      this.refreshBuffer,
      this,
    );
    NotificationManager.Instance.addEventListener(
      NotificationEvent.TRANSPORT_STATE,
      this.refreshBuffer,
      this,
    );
    FunnyManager.Instance.addEventListener(
      FunnyEvent.REFRESH_ITEM,
      this.refreshBuffer,
      this,
    );
    WarlordsManager.Instance.model.addEventListener(
      WarlordsEvent.REWARD_STATE_CHANGE,
      this.refreshBuffer,
      this,
    );
    NotificationManager.Instance.addEventListener(
      NotificationEvent.ANSWER_SWITCH,
      this.refreshBuffer,
      this,
    );
    this.thane.addEventListener(
      PlayerEvent.PLAYER_AVATA_CHANGE,
      this.__heroPropertyHandler,
      this,
    );
    NotificationManager.Instance.addEventListener(
      NotificationEvent.UPDATE_HEADFRAME_ACTIVE,
      this.updateHeadRedStatus,
      this,
    );
    NotificationManager.Instance.addEventListener(
      NotificationEvent.UPDATE_HEADFRAME_CLICK_STATUS,
      this.removeHeadRedStatus,
      this,
    );
    NotificationManager.Instance.addEventListener(
      NotificationEvent.USER_BIND_REWARD,
      this.onUpdateBindState,
      this,
    );
    NotificationManager.Instance.addEventListener(
      NotificationEvent.ROOM_INFO_UPDATE,
      this.refreshBuffer,
      this,
    );
    NotificationManager.Instance.addEventListener(
      NotificationEvent.UPDATE_SCREET_TREE,
      this.refreshBuffer,
      this,
    );
    NotificationManager.Instance.on(
      RoomHallEvent.CHANGE_CAMPAIGN,
      this.refreshBuffer,
      this,
    );
    NotificationManager.Instance.addEventListener(
      NotificationEvent.UPDATE_ROOM_BASE_DATA,
      this.refreshBuffer,
      this,
    );
  }

  private removeEvent() {
    this.Btn_Buy_Hp.offClick(this, this.buyHp);
    ToolTipsManager.Instance.unRegister(this.Btn_Buy_Hp);
    PlayerManager.Instance.currentPlayerModel.playerInfo.removeEventListener(
      PlayerEvent.PLAYER_INFO_UPDATE,
      this.__playerDataUpdate,
      this,
    );
    ArmyManager.Instance.thane.removeEventListener(
      PlayerEvent.THANE_LEVEL_UPDATE,
      this.__heroLevelUpdate,
      this,
    );
    ArmyManager.Instance.thane.removeEventListener(
      PlayerEvent.THANE_INFO_UPDATE,
      this.__thaneInfoChangeHandler,
      this,
    );
    ArmyManager.Instance.thane.removeEventListener(
      PlayerEvent.BLOOD_VISIBLE_UPDATE,
      this.__updateBloodBtnHandlerr,
      this,
    );
    ArmyManager.Instance.thane.removeEventListener(
      PlayerEvent.BLOOD_UPDATE,
      this.__updateBloodHandler,
      this,
    );
    ArmyManager.Instance.thane.removeEventListener(
      PlayerEvent.THANE_EXP_UPDATE,
      this.__heroExpUpdate,
      this,
    );
    ArmyManager.Instance.army.removeEventListener(
      ArmyEvent.ARMY_INFO_CHANGE,
      this.__armyInfoChangeHandler,
      this,
    );
    SNSManager.Instance.removeEventListener(
      SNSEvent.SNSINFO_UPDATE,
      this.__snsInfoUpdateHandler,
      this,
    );
    PlayerBufferManager.Instance.removeEventListener(
      PlayerBufferEvent.CAMPAIGN_BUFFER_UPDATE,
      this.refreshBuffer,
      this,
    );
    PlayerBufferManager.Instance.removeEventListener(
      PlayerBufferEvent.ITEM_BUFFER_UPDATE,
      this.refreshBuffer,
      this,
    );
    this.playerInfo.removeEventListener(
      PlayerEvent.WEARY_CHANGE,
      this.refreshPower,
      this,
    );
    this.playerInfo.removeEventListener(
      PlayerEvent.IS_AUTO_CHANGE,
      this.refreshBuffer,
      this,
    );
    this.playerInfo.removeEventListener(
      PlayerEvent.CONSORTIA_CHANGE,
      this.refreshBuffer,
      this,
    );
    this.playerInfo.removeEventListener(
      ConsortiaEvent.CONSORTIA_STUDY,
      this.refreshBuffer,
      this,
    );
    this.playerInfo.removeEventListener(
      ConsortiaEvent.CONSORTIA_STUDY_UPGRADE,
      this.refreshBuffer,
      this,
    );
    this.playerInfo.removeEventListener(
      PlayerEvent.SEMINARY_EFFECT,
      this.refreshBuffer,
      this,
    );
    this.playerInfo.removeEventListener(
      PlayerEvent.WORLDPROSPERITY,
      this.refreshBuffer,
      this,
    );
    this.thane.removeEventListener(
      PlayerEvent.BLOOD_VISIBLE_UPDATE,
      this.refreshBuffer,
      this,
    );
    this.playerInfo.removeEventListener(
      PlayerEvent.GVGISOPEN,
      this.refreshBuffer,
      this,
    );
    this.playerInfo.removeEventListener(
      PlayerEvent.MINERAL,
      this.refreshBuffer,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      PlayerEvent.UPDATE_EXTRABUFFER,
      this.refreshBuffer,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      KingContractEvents.UPDATE_KINGCONTRACT,
      this.refreshBuffer,
      this,
    );
    this.playerInfo.removeEventListener(
      PlayerEvent.CROSS_SCORE_RAWARD,
      this.refreshBuffer,
      this,
    );
    this.playerInfo.removeEventListener(
      PlayerEvent.VEHICLESTART,
      this.refreshBuffer,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      NotificationEvent.SEMINARY_BLESS,
      this.refreshBuffer,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      NotificationEvent.KING_CONTRACT,
      this.refreshBuffer,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      NotificationEvent.TRANSPORT_STATE,
      this.refreshBuffer,
      this,
    );
    FunnyManager.Instance.removeEventListener(
      FunnyEvent.REFRESH_ITEM,
      this.refreshBuffer,
      this,
    );
    WarlordsManager.Instance.model.removeEventListener(
      WarlordsEvent.REWARD_STATE_CHANGE,
      this.refreshBuffer,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      NotificationEvent.ANSWER_SWITCH,
      this.refreshBuffer,
      this,
    );
    this.thane.removeEventListener(
      PlayerEvent.PLAYER_AVATA_CHANGE,
      this.__heroPropertyHandler,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      NotificationEvent.UPDATE_HEADFRAME_ACTIVE,
      this.updateHeadRedStatus,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      NotificationEvent.UPDATE_HEADFRAME_CLICK_STATUS,
      this.removeHeadRedStatus,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      NotificationEvent.USER_BIND_REWARD,
      this.onUpdateBindState,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      NotificationEvent.ROOM_INFO_UPDATE,
      this.refreshBuffer,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      NotificationEvent.UPDATE_SCREET_TREE,
      this.refreshBuffer,
      this,
    );
    NotificationManager.Instance.off(
      RoomHallEvent.CHANGE_CAMPAIGN,
      this.refreshBuffer,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      NotificationEvent.UPDATE_ROOM_BASE_DATA,
      this.refreshBuffer,
      this,
    );
  }

  private get roomInfo(): RoomInfo {
    return RoomManager.Instance.roomInfo;
  }

  onUpdateBindState() {
    this.btnUpAccount &&
      (this.btnUpAccount.visible =
        PlayerManager.Instance.currentPlayerModel.playerInfo.showBindReward);
  }

  renderListItem(index: number, item: BufferItem) {
    if (!item) return;

    if (index < this._firstBufferIndex) {
      item.info = this._extraBufferData[index];
    } else {
      item.info = this._bufferData[index - this._firstBufferIndex];
    }
  }

  /**
   * 个人详细说明
   */
  onDetailInfo() {
    if (!UIManager.Instance.isShowing(EmWindow.PlayerDescribeWnd))
      UIManager.Instance.ShowWind(EmWindow.PlayerDescribeWnd);
  }

  private checkNeedShowBackBuffer(): boolean {
    let flag: boolean = false;
    let curScene: string = SceneManager.Instance.currentType;
    if (
      this.mapModel &&
      WorldBossHelper.checkInConsortiaScretTree(this.mapModel.mapId)
    ) {
      //公会秘境
      if (ConsortiaManager.Instance.model.checkHasReturnBackPlayer()) {
        flag = true;
      }
    } else if (curScene == SceneType.PVE_ROOM_SCENE) {
      if (this.roomInfo && this.roomInfo.mapTemplate) {
        if (
          this.roomInfo.mapTemplate.SonTypes != 301 &&
          this.roomInfo.mapTemplate.SonTypes != 400
        ) {
          if (this.roomInfo.checkRoomHasBackPlayer()) {
            flag = true;
          }
        }
      }
    } else if (curScene == SceneType.PVP_ROOM_SCENE) {
      if (this.roomInfo.checkRoomHasBackPlayer()) {
        flag = true;
      }
    } else if (curScene == SceneType.CAMPAIGN_MAP_SCENE) {
      flag = false;
    } else if (this.playerInfo.isBackPlayer) {
      flag = true;
    }
    return flag;
  }

  refreshBuffer() {
    this.bufferList.numItems = 0;
    this._extraBufferData = [];
    this._firstBufferIndex = 0;
    this._bufferData = [];
    let curScene: string = SceneManager.Instance.currentType;
    if (
      curScene == SceneType.FARM ||
      curScene == SceneType.BATTLE_SCENE ||
      curScene == SceneType.VEHICLE
    ) {
      return;
    }

    let seminaryEffect: number = this.playerModel.playerInfo.seminaryEffect;
    if (seminaryEffect > 0) {
      this._extraBufferData.push({ type: 3, bufferData: [0] });
      this._firstBufferIndex++;
    }
    this.flag = false;
    this.hasPersonBufferFlag = false;
    if (this.checkNeedShowBackBuffer()) {
      let bufferData = new PlayerBufferInfo();
      bufferData.templateId = RoleCom.BACK_BUFFER_TEMPLATEID;
      this._extraBufferData.push({
        type: PlayerBufferType.REGRESS_PLAYER_BUFFER,
        bufferData: bufferData,
      });
      this._firstBufferIndex++;
      this.flag = true;
    }
    if (CampaignManager.Instance.mapModel) {
      let selfMemberData: CampaignArmy =
        CampaignManager.Instance.mapModel.selfMemberData;
      if (selfMemberData) {
        let transportState: number = selfMemberData.isDie;
        if (
          (transportState == CampaignArmyState.STATE_DIEDTRAN ||
            transportState == CampaignArmyState.STATE_TRAN) &&
          WorldBossHelper.checkPvp(CampaignManager.Instance.mapId)
        ) {
          let transportInfo: TransportBufferInfo = new TransportBufferInfo();
          transportInfo.infoContent = LangManager.Instance.GetTranslation(
            "mainBar.TopToolsBar.TransportTip2",
          );
          let arr: Array<any> = new Array(transportInfo);
          this._extraBufferData.push({ type: 5, bufferData: arr });
          this._firstBufferIndex++;
        }
      }
    }
    if (
      this.roomInfo &&
      SceneManager.Instance.currentType == SceneType.PVE_ROOM_SCENE
    ) {
      if (this.roomInfo.playerCount < 3) {
        let bufferData = new PlayerBufferInfo();
        let campaignbufferData: t_s_campaignbufferData;
        if (this.roomInfo.playerCount == 1) {
          campaignbufferData = ConfigMgr.Instance.getTemplateByID(
            ConfigType.t_s_campaignbuffer,
            RoleCom.CAMPAIGN_BUFFER_TEMPLATEID1.toString(),
          ) as t_s_campaignbufferData;
          if (campaignbufferData) {
            bufferData.templateId = RoleCom.CAMPAIGN_BUFFER_TEMPLATEID1;
            this._bufferData.push(bufferData);
            this.hasPersonBufferFlag = true;
          }
        } else if (this.roomInfo.playerCount == 2) {
          campaignbufferData = ConfigMgr.Instance.getTemplateByID(
            ConfigType.t_s_campaignbuffer,
            RoleCom.CAMPAIGN_BUFFER_TEMPLATEID2.toString(),
          ) as t_s_campaignbufferData;
          if (campaignbufferData) {
            bufferData.templateId = RoleCom.CAMPAIGN_BUFFER_TEMPLATEID2;
            this._bufferData.push(bufferData);
            this.hasPersonBufferFlag = true;
          }
        }
      }
    }

    let data: PlayerBufferInfo =
      PlayerBufferManager.Instance.basePropertyBuffer;
    if (data) {
      this._bufferData.push(data);
    }

    let arr: Array<PlayerBufferInfo> =
      PlayerBufferManager.Instance.itemBufferList.getList();
    let item: PlayerBufferInfo;
    let PropertyDataArray: Array<PlayerBufferInfo> = [];
    let PropertyType1: number;
    for (let i = 0; i < arr.length; i++) {
      item = arr[i];
      if (item.template) {
        PropertyType1 = item.template.PropertyType1;
        if (
          PropertyType1 == 135 ||
          PropertyType1 == 137 ||
          PropertyType1 == 138 ||
          PropertyType1 == 139 ||
          PropertyType1 == 140 ||
          PropertyType1 == 202
        ) {
          PropertyDataArray.push(item);
        } else {
          this._bufferData.push(item);
        }
      } else {
        this._bufferData.push(item);
      }
    }
    if (PropertyDataArray.length > 0) {
      this._extraBufferData.push({ type: 999, bufferData: PropertyDataArray });
      this._firstBufferIndex++;
    }
    let list: Array<PlayerBufferInfo> =
      PlayerBufferManager.Instance.campaignBufferList;
    for (let j = 0; j < list.length; j++) {
      if (list[j].templateId == RoleCom.BACK_BUFFER_TEMPLATEID) {
        if (!this.flag) {
          this._bufferData.push(list[j]);
        }
      } else if (
        list[j].templateId == RoleCom.CAMPAIGN_BUFFER_TEMPLATEID1 ||
        list[j].templateId == RoleCom.CAMPAIGN_BUFFER_TEMPLATEID2
      ) {
        if (!this.hasPersonBufferFlag) {
          this._bufferData.push(list[j]);
        }
      } else {
        this._bufferData.push(list[j]);
      }
    }
    Logger.info("更新buff", this._extraBufferData, this._bufferData);
    this.bufferList.numItems = this._firstBufferIndex + this._bufferData.length;
  }

  private get mapModel(): CampaignMapModel {
    return CampaignManager.Instance.mapModel;
  }
  /**
   * 个人中心
   */
  private onPersonalCenter(): void {
    AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
    FrameCtrlManager.Instance.open(EmWindow.PersonalCenter);
  }

  private __refreshGold() {
    // if (this.gold.count >= this.gold.limit) {
    //     this.goldTxt.color = ColorConstant.RED_COLOR;
    // } else {
    //     this.goldTxt.color = ColorConstant.LIGHT_TEXT_COLOR;
    // }
    // this.goldTxt.text = FormularySets.toStringSelf(ResourceManager.Instance.gold.count, HomeWnd.STEP);
  }

  private get gold(): ResourceData {
    return ResourceManager.Instance.gold;
  }

  private __playerDataUpdate(data: any) {
    this._simpleInfo = data;
    // this.goldTxt.text = FormularySets.toStringSelf(ResourceManager.Instance.gold.count, HomeWnd.STEP);
    // this.voucherTxt.text = FormularySets.toStringSelf(PlayerManager.Instance.currentPlayerModel.playerInfo.point, HomeWnd.STEP);
    // this.giftTxt.text = FormularySets.toStringSelf(PlayerManager.Instance.currentPlayerModel.playerInfo.giftToken, HomeWnd.STEP);
    if (
      PlayerManager.Instance.currentPlayerModel.playerInfo.nickName ==
        PlayerManager.Instance.currentPlayerModel.playerInfo.userId + "$" ||
      PlayerManager.Instance.currentPlayerModel.playerInfo.nickName ==
        LangManager.Instance.GetTranslation("public.nickName")
    ) {
      this.userNameTxt.text =
        LangManager.Instance.GetTranslation("public.nickName"); //新手
    } else {
      this.userNameTxt.text =
        PlayerManager.Instance.currentPlayerModel.playerInfo.nickName;
    }
    this.refreshView();
    this.setLevelTxt();
    this.refreshFightOpt();
  }

  private __heroLevelUpdate(data: any) {
    Logger.xjy("[RoleCom]__heroLevelUpdate", data);
    this.refreshView();
    this.setLevelTxt();
    this.setBloodBtn();

    LevelUpWnd.open = true;
    UIManager.Instance.ShowWind(EmWindow.LevelUp);
    // DelayActionsUtils.Instance.addAction(new HeroLeveUpdateAction());
  }

  private __thaneInfoChangeHandler(data: any) {
    this.refreshView();
    this.refreshIcon();
  }

  private __heroPropertyHandler() {
    this.refreshIcon();
  }

  private updateHeadRedStatus() {
    if (HeadIconModel.instance.checkHasAllClick()) {
      //所有激活的都被点击过了
      this.redStatus.selectedIndex = 0;
    } else {
      this.redStatus.selectedIndex = 1;
    }
  }

  private removeHeadRedStatus() {
    this.redStatus.selectedIndex = 0;
  }

  private __snsInfoUpdateHandler() {
    this.refreshIcon();
  }

  private __armyInfoChangeHandler(data: any) {
    this.refreshView();
  }

  //体力
  refreshPower() {
    if (ArmyManager.Instance.army) {
      Logger.xjy(
        "[RoleCom]更新体力",
        PlayerManager.Instance.currentPlayerModel.playerInfo.weary,
      );
      this.powerValueTxt.text =
        PlayerManager.Instance.currentPlayerModel.playerInfo.weary + "/200";
    } else {
      this.powerValueTxt.text = "0/200";
    }
  }

  private refreshView() {
    this.refreshFightOpt();
    this.__updateBloodBtnHandlerr();
    this.onUpdateBindState();
  }

  private refreshFightOpt() {
    if (this._simpleInfo == null) {
      this.fightOpt.text = this.thane.fightingCapacity.toString();
    } else {
      this.fightOpt.text = this._simpleInfo.fightingCapacity.toString();
    }
  }

  private getNextGradeTemp(
    grade: number,
    type: number,
  ): t_s_upgradetemplateData {
    return TempleteManager.Instance.getTemplateByTypeAndLevel(grade, type);
  }

  private __updateBloodBtnHandlerr() {
    this.setBloodBtn();
  }

  private __updateBloodHandler() {
    this.setBloodBtn();
    this.refreshView();
  }

  private setLevelTxt() {
    let level: number = 0;
    if (ArmyManager.Instance.thane) {
      level = ArmyManager.Instance.thane.grades;
    }
    this.levelTxt.text = level.toString();
  }

  private setBloodBtn() {
    var hasBood: boolean = ArmyManager.Instance.army.baseHero.blood > 0;
    let tipData = "";
    if (ArmyManager.Instance.thane.grades < 11) {
    } else {
      if (hasBood) {
        tipData = LangManager.Instance.GetTranslation(
          "mainBar.view.ResourceView.blood",
          ArmyManager.Instance.army.baseHero.blood,
        );
      } else {
        tipData = LangManager.Instance.GetTranslation(
          "mainBar.view.ResourceView.quickBuyBtnTipData",
        );
      }
    }
    this.Btn_Buy_Hp.tipData = tipData;
  }

  public refreshIcon() {
    let path: string = IconFactory.getPlayerIcon(
      ArmyManager.Instance.thane.snsInfo.headId,
      IconType.HEAD_ICON,
    );
    (<fgui.GLoader>this.playerIcon.getChild("n0")).url = path;
  }

  /**玩家经验变化 */
  __heroExpUpdate() {
    this.refreshExp();
  }

  private buyHp() {
    if (this.Btn_Buy_Hp.callBack) this.Btn_Buy_Hp.callBack();
    UIManager.Instance.ShowWind(EmWindow.BuyHpWnd);
  }

  /**升级账户 */
  private onUpgradeAccount() {
    FrameCtrlManager.Instance.open(EmWindow.UpgradeAccountWnd);
  }

  /**刷新经验 */
  private refreshExp() {
    if (!this.Bar_Exp || this.Bar_Exp.isDisposed) return;
    var _percent: number = 0;
    var upGrade: t_s_upgradetemplateData = this.getNextGradeTemp(
      ArmyManager.Instance.thane.grades + 1,
      UpgradeType.UPGRADE_TYPE_PLAYER,
    );
    if (upGrade) {
      _percent = Number((ArmyManager.Instance.thane.gp / upGrade.Data) * 100);
    } else {
      _percent = 100;
    }
    if (this.Bar_Exp && !this.Bar_Exp.isDisposed) {
      this.Bar_Exp.value = _percent;
    }
  }

  private get playerInfo(): PlayerInfo {
    return this.playerModel.playerInfo;
  }

  private get playerModel(): PlayerModel {
    return PlayerManager.Instance.currentPlayerModel;
  }

  private get thane(): ThaneInfo {
    return ArmyManager.Instance.thane;
  }

  public dispose() {
    (<fgui.GLoader>this.playerIcon.getChild("n0")).url = "";
    this.removeEvent();
  }
}
