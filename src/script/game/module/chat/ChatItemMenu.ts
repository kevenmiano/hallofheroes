import LangManager from "../../../core/lang/LangManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIManager from "../../../core/ui/UIManager";
import {
  ChatEvent,
  FriendUpdateEvent,
  NotificationEvent,
  RequestInfoEvent,
} from "../../constant/event/NotificationEvent";
import RelationType from "../../constant/RelationType";
import { EmWindow } from "../../constant/UIDefine";
import FriendItemCellInfo from "../../datas/FriendItemCellInfo";
import { ThaneInfo } from "../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../manager/ArmyManager";
import { CampaignManager } from "../../manager/CampaignManager";
import FreedomTeamManager from "../../manager/FreedomTeamManager";
import { FriendManager } from "../../manager/FriendManager";
import IMManager from "../../manager/IMManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { PlayerInfoManager } from "../../manager/PlayerInfoManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { CampaignArmy } from "../../map/campaign/data/CampaignArmy";
import { SceneManager } from "../../map/scene/SceneManager";
import SceneType from "../../map/scene/SceneType";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import { WorldBossHelper } from "../../utils/WorldBossHelper";
import ChatItemMenuCell from "./ChatItemMenuCell";
import { DataCommonManager } from "../../manager/DataCommonManager";
import RequestInfoRientation from "../../datas/RequestInfoRientation";
import { ConsortiaControler } from "../consortia/control/ConsortiaControler";
import SpaceManager from "../../map/space/SpaceManager";
import SpaceArmy from "../../map/space/data/SpaceArmy";
import { ArmyState } from "../../constant/ArmyState";
import { SpaceSocketOutManager } from "../../map/space/SpaceSocketOutManager";
import { SharedManager } from "../../manager/SharedManager";
import SDKManager from "../../../core/sdk/SDKManager";
import Resolution from "../../../core/comps/Resolution";
import Utils from "../../../core/utils/Utils";

/**
 * @author:pzlricky
 * @data: 2021-06-07 20:58
 * @description 聊天菜单
 */
export default class ChatItemMenu extends BaseWindow {
  private _userId: number = 0;
  private _name: string = "";
  private _showConsortia: boolean;
  private _serverName: string;
  private _showAttack: boolean;
  private _isRobot: boolean = false;
  private _showInvite: boolean = false;
  private _point: Laya.Point = null;
  private list: fgui.GList;
  private _thaneInfo: ThaneInfo;
  public static ChatItemMenu_Chat: number = 0;
  public static ChatItemMenu_ADDFRI: number = 1;
  public static ChatItemMenu_COPY: number = 2;
  public static ChatItemMenu_MESSAGE: number = 3;
  public static ChatItemMenu_INVITE: number = 4;
  public static ChatItemMenu_CONSORTIA: number = 5;
  public static ChatItemMenu_BLACK: number = 6;
  public static ChatItemMenu_DELFRI: number = 7;
  public static ChatItemMenu_ATTACK: number = 8;
  private btnTextKeys = [
    "ChatItemMenu_Chat",
    "ChatItemMenu_ADDFRI",
    "ChatItemMenu_COPY",
    "ChatItemMenu_MESSAGE",
    "ChatItemMenu_INVITE",
    "ChatItemMenu_CONSORTIA",
    "ChatItemMenu_BLACK",
    "ChatItemMenu_DELFRI",
    "ChatItemMenu_ATTACK",
  ];
  private btnTextStrs = {
    ChatItemMenu_Chat: LangManager.Instance.GetTranslation(
      "chatII.view.ChatItemMenu.chatMessageText",
    ),
    ChatItemMenu_ADDFRI: LangManager.Instance.GetTranslation(
      "chatII.view.ChatItemMenu.addfriendText",
    ),
    ChatItemMenu_COPY: LangManager.Instance.GetTranslation(
      "chatII.view.ChatItemMenu.copyNametext",
    ),
    ChatItemMenu_MESSAGE: LangManager.Instance.GetTranslation(
      "chatII.view.ChatItemMenu.messageText",
    ),
    ChatItemMenu_INVITE: LangManager.Instance.GetTranslation(
      "yishi.view.PlayerMenu.invite",
    ),
    ChatItemMenu_CONSORTIA: LangManager.Instance.GetTranslation(
      "chatII.view.ChatItemMenu.consortiaBtnText",
    ),
    ChatItemMenu_BLACK: LangManager.Instance.GetTranslation(
      "chatII.view.ChatItemMenu.blacklistText",
    ),
    ChatItemMenu_DELFRI: LangManager.Instance.GetTranslation(
      "friends.im.IMFrame.delFriend",
    ), //删除好友 添加好友这两个按钮同时只能显示一个, 并且位置是在一起的
    ChatItemMenu_ATTACK: LangManager.Instance.GetTranslation(
      "ChatItemMenu.attack",
    ),
  };

  constructor() {
    super();
  }

  /**
   * 展示聊天菜单
   * @param name            用户姓名
   * @param id            用户ID
   * @param showConsortia    是否显示公会邀请
   * @param $serverName    服务器名称（跨服）
   * @param $showAttack    是否显示发起攻击（紫晶矿场）
   * @param $isRobot        是否是机器人（天空之城）
   * @param $showInvite    是否显示邀请组队（组队机制）
   *
   */
  public static Show(
    name: string,
    id: number,
    showConsortia: boolean,
    $serverName: string = null,
    $showAttack: boolean = false,
    $isRobot: boolean = false,
    $showInvite: boolean = false,
    point?: Laya.Point,
    $thaneInfo?: ThaneInfo,
  ) {
    let obj = {
      name: name,
      id: id,
      showConsortia: showConsortia,
      serverName: $serverName,
      showAttack: $showAttack,
      isRobot: $isRobot,
      showInvite: $showInvite,
      point: point,
      thaneInfo: $thaneInfo,
    };
    if (!UIManager.Instance.isShowing(EmWindow.ChatItemMenu)) {
      UIManager.Instance.ShowWind(EmWindow.ChatItemMenu, obj);
    } else {
      //打开的情况更新显示位置
      this.Hide();
      UIManager.Instance.ShowWind(EmWindow.ChatItemMenu, obj);
    }
  }

  public static Hide() {
    if (UIManager.Instance.isShowing(EmWindow.ChatItemMenu)) {
      UIManager.Instance.HideWind(EmWindow.ChatItemMenu);
    }
  }

  public OnInitWind() {
    this.list.itemRenderer = Laya.Handler.create(
      this,
      this.renderFaceListItem,
      null,
      false,
    );
    this._name = this.params.name;
    this._userId = this.params.id;
    // this._appellId = this.params.id;
    this._showConsortia = this.params.showConsortia;
    this._serverName = this.params.serverName;
    this._showAttack = this.params.showAttack;
    this._isRobot = this.params.isRobot;
    this._showInvite = this.params.showInvite;

    this._point = this.params.point;
    this._thaneInfo = this.params.thaneInfo;
    if (
      this._userId ==
      PlayerManager.Instance.currentPlayerModel.playerInfo.userId
    ) {
      this._showConsortia = false;
    }
    this.init();
    this.initEvent();

    if (!this._point) {
      this._point = new Laya.Point(Laya.stage.mouseX, Laya.stage.mouseY);
    }
    this.contentPane.x = this._point.x;
    if (SceneManager.Instance.currentType == SceneType.BATTLE_SCENE) {
      this.contentPane.y = this._point.y;
      if (
        this.contentPane.y + this.contentPane.height >
        Resolution.gameHeight
      ) {
        //超出屏幕
        this.contentPane.y = Resolution.gameHeight - this.contentPane.height;
      }
    } else {
      this.contentPane.y = this._point.y - this.contentPane.height - 5;
    }
    if (this.contentPane.y < 0) {
      this.contentPane.y = 0;
    }

    this.modelMask.alpha = 0; //点击其他地方需要消失
    this.mouseThrough = true;
    this.modelMask.mouseThrough = true;
  }

  init() {
    let count = this.btnTextKeys.length;
    this.list.numItems = count;
    this.list.resizeToFit();
    this.setBtnState();
  }

  private setBtnState() {
    if (DataCommonManager.playerInfo.userId == this._userId) {
      this.list.getChildAt(ChatItemMenu.ChatItemMenu_ADDFRI).enabled =
        this.list.getChildAt(ChatItemMenu.ChatItemMenu_BLACK).enabled =
        this.list.getChildAt(ChatItemMenu.ChatItemMenu_DELFRI).enabled =
          false;
      this.list.removeChildAt(ChatItemMenu.ChatItemMenu_BLACK);
      return;
    }
    var fInfo: FriendItemCellInfo = IMManager.Instance.getFriendInfo(
      this._userId,
    );
    if (fInfo) {
      switch (fInfo.relation) {
        case RelationType.NONE: //
        case RelationType.RECENT_CONTACT: //
          this.list.getChildAt(ChatItemMenu.ChatItemMenu_DELFRI).enabled =
            false;
          break;
        case RelationType.FRIEND: //删除好友
          this.list.getChildAt(ChatItemMenu.ChatItemMenu_DELFRI).enabled = true;
          this.list.getChildAt(ChatItemMenu.ChatItemMenu_ADDFRI).enabled =
            false;
          break;
        case RelationType.STRANGER:
          this.list.getChildAt(ChatItemMenu.ChatItemMenu_ADDFRI).enabled =
            false; //添加好友//陌生人列表中添加好友图标应置灰
          this.list.getChildAt(ChatItemMenu.ChatItemMenu_DELFRI).enabled = true; //删除好友
          break;
        case RelationType.BLACKLIST:
          this.list.getChildAt(ChatItemMenu.ChatItemMenu_BLACK).enabled = false; //黑名单
          this.list.getChildAt(ChatItemMenu.ChatItemMenu_DELFRI).enabled = true; //删除好友
          break;
      }
    } else {
      this.list.getChildAt(ChatItemMenu.ChatItemMenu_ADDFRI).enabled = true; //添加好友
      this.list.getChildAt(ChatItemMenu.ChatItemMenu_DELFRI).enabled = false; //删除好友
    }

    if (!this.sameServiceName()) {
      this.list.getChildAt(ChatItemMenu.ChatItemMenu_Chat).enabled = false; //私聊
      this.list.getChildAt(ChatItemMenu.ChatItemMenu_ADDFRI).enabled = false; //添加好友
      this.list.getChildAt(ChatItemMenu.ChatItemMenu_BLACK).enabled = false; //黑名单
      this.list.getChildAt(ChatItemMenu.ChatItemMenu_CONSORTIA).visible = false; //公会邀请
    } else {
      if (this.isSelf()) {
        //自己除复制名称 全灰
        this.list.getChildAt(ChatItemMenu.ChatItemMenu_Chat).enabled = false; //私聊
        this.list.getChildAt(ChatItemMenu.ChatItemMenu_ADDFRI).enabled = false; //添加好友
        this.list.getChildAt(ChatItemMenu.ChatItemMenu_BLACK).enabled = false; //黑名单
        this.list.getChildAt(ChatItemMenu.ChatItemMenu_CONSORTIA).enabled =
          false; //公会
        this.list.getChildAt(ChatItemMenu.ChatItemMenu_ATTACK).enabled = false; //发起攻击
        this.list.getChildAt(ChatItemMenu.ChatItemMenu_INVITE).enabled = false; //组队邀请
      }
    }

    if (!this._showConsortia) {
      this.list.getChildAt(ChatItemMenu.ChatItemMenu_CONSORTIA).enabled = false;
    } //公会邀请
    // if (!this._showAttack) {//发起攻击
    //     this.list.getChildAt(6).enabled = false;
    // }
    if (!this._showInvite) {
      this.list.getChildAt(ChatItemMenu.ChatItemMenu_INVITE).enabled = false;
    }
    //PK  仅限天空之城
    if (
      SceneManager.Instance.currentType != SceneType.SPACE_SCENE ||
      !this._showAttack
    ) {
      //切磋
      this.list.removeChildAt(ChatItemMenu.ChatItemMenu_ATTACK);
    }
    //组队邀请
    // this.list.getChildAt(4).enabled = false;
    //私聊界面中不可以点击私聊按键
    let wnd = UIManager.Instance.FindWind(EmWindow.ChatWnd);
    if (wnd && wnd.isShowing) {
      if (
        wnd.chatTablist.selectedIndex == ChatItemMenu.ChatItemMenu_CONSORTIA
      ) {
        this.list.getChildAt(ChatItemMenu.ChatItemMenu_Chat).enabled = false;
      }
    }
  }

  private isSelf(): boolean {
    return this.sameServiceName() && this.sameUserId();
  }

  private sameServiceName(): boolean {
    if (this._serverName) {
      return (
        this._serverName ==
        PlayerManager.Instance.currentPlayerModel.playerInfo.serviceName
      );
    }
    return true;
  }

  private sameUserId(): boolean {
    return (
      this._userId ==
      PlayerManager.Instance.currentPlayerModel.playerInfo.userId
    );
  }

  initEvent() {
    this.list.on(fairygui.Events.CLICK_ITEM, this, this.__onFaceItemSelect);
  }

  onRemoveEvent() {
    if (this.list) {
      this.list.off(fairygui.Events.CLICK_ITEM, this, this.__onFaceItemSelect);
    }
    PlayerManager.Instance.removeEventListener(
      RequestInfoEvent.REQUEST_SIMPLEINFO,
      this.__recentContactHandler,
      this,
    );
  }

  /**渲染表情item */
  renderFaceListItem(index: number, item: ChatItemMenuCell) {
    let key: string = this.btnTextKeys[index];
    let data = {
      index: index,
      text: this.btnTextStrs[key],
    };
    item.itemdata = data;
  }

  /**选择功能按钮 */
  __onFaceItemSelect(targetItem) {
    let targetData = targetItem.itemdata;
    let index = -1;
    if (targetData) index = targetData.index;
    switch (index) {
      case ChatItemMenu.ChatItemMenu_Chat: //私聊
        this.__chatmessageHandler();
        break;
      case ChatItemMenu.ChatItemMenu_ADDFRI: //添加好友
        this.__addfriendHandler();
        break;
      case ChatItemMenu.ChatItemMenu_COPY: //复制名称
        this.__copyNameHandler();
        break;
      case ChatItemMenu.ChatItemMenu_BLACK: //黑名单
        this.__blacklistHandler();
        break;
      case ChatItemMenu.ChatItemMenu_MESSAGE: //查看资料
        this.__messageHandler();
        break;
      case ChatItemMenu.ChatItemMenu_CONSORTIA: //公会邀请
        this.__consortiaHandler();
        break;
      case ChatItemMenu.ChatItemMenu_ATTACK: //发起攻击
        // this.__attackHandler();
        this.__pkBtnClickHandler();
        break;
      case ChatItemMenu.ChatItemMenu_INVITE: //邀请组队
        this.__inviteHandler();
        break;
      case ChatItemMenu.ChatItemMenu_DELFRI: //删除好友
        this.__deleteHandler();
        break;
      default:
        break;
    }
  }

  /**
   * 私聊
   */
  private __chatmessageHandler() {
    if (ArmyManager.Instance.thane.grades < 6) {
      var str: string = LangManager.Instance.GetTranslation(
        "chat.view.ChatItemMenu.command01",
      );
      MessageTipManager.Instance.show(str);
      this.hide();
      return;
    }
    if (this.isSelf()) {
      var str: string = LangManager.Instance.GetTranslation(
        "chat.view.ChatInputView.content01",
      );
      MessageTipManager.Instance.show(str);
      this.hide();
      return;
    }
    if (!FriendManager.getInstance().checkIsFriend(this._userId)) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("chat.notfriend02"),
      );
      return;
    }
    PlayerManager.Instance.addEventListener(
      RequestInfoEvent.REQUEST_SIMPLEANDSNS_INFO,
      this.getSnsInfo,
      this,
    );
    PlayerManager.Instance.sendRequestSimpleAndSnsInfo(
      this._userId,
      RequestInfoRientation.RECENT_CONTACT,
    );
  }

  private getSnsInfo(orientation: number, pInfo: FriendItemCellInfo) {
    PlayerManager.Instance.removeEventListener(
      RequestInfoEvent.REQUEST_SIMPLEANDSNS_INFO,
      this.getSnsInfo,
      this,
    );
    var info: ThaneInfo = new ThaneInfo();
    info.userId = this._userId;
    info.nickName = this._name;
    info.isRobot = this._isRobot;
    info.snsInfo = pInfo.snsInfo;
    if (!FrameCtrlManager.Instance.isOpen(EmWindow.ChatWnd)) {
      FrameCtrlManager.Instance.open(EmWindow.ChatWnd, {
        thaneInfo: info,
        type: 1,
      });
    } else {
      NotificationManager.Instance.dispatchEvent(ChatEvent.CHAT_MESSAGE, info);
    }
    this.hide();
  }

  /**
   * 添加好友
   */
  private __addfriendHandler() {
    var str: string;
    if (ArmyManager.Instance.thane.grades < 6) {
      str = LangManager.Instance.GetTranslation(
        "chat.view.ChatItemMenu.command01",
      );
      MessageTipManager.Instance.show(str);
      this.hide();
      return;
    }
    if (this._isRobot) {
      str = LangManager.Instance.GetTranslation(
        "chat.view.ChatItemMenu.RobotTips01",
      );
      MessageTipManager.Instance.show(str);
      this.hide();
      return;
    }
    FriendManager.getInstance().sendAddFriendRequest(
      this._name,
      RelationType.FRIEND,
    );
    this.hide();
  }

  /**删除好友 */
  private __deleteHandler() {
    var str: string;
    if (ArmyManager.Instance.thane.grades < 6) {
      str = LangManager.Instance.GetTranslation(
        "chat.view.ChatItemMenu.command01",
      );
      MessageTipManager.Instance.show(str);
      this.hide();
      return;
    }
    if (this._isRobot) {
      str = LangManager.Instance.GetTranslation(
        "chat.view.ChatItemMenu.RobotTips01",
      );
      MessageTipManager.Instance.show(str);
      this.hide();
      return;
    }
    if (!this._thaneInfo) {
      this._thaneInfo = ArmyManager.Instance.thane;
    }
    if (this._thaneInfo) {
      if (this._thaneInfo.friendGrade >= 2) {
        var preDate: Date = new Date(
          SharedManager.Instance.deleteFriendCheckDate,
        );
        var now: Date = new Date();
        var outdate: boolean = false;
        var check: boolean = SharedManager.Instance.deleteFriendTip;
        if (
          !check ||
          (preDate.getMonth() <= preDate.getMonth() &&
            preDate.getDay() < now.getDay())
        )
          outdate = true;
        if (outdate) {
          var content: string = LangManager.Instance.GetTranslation(
            "ChatItemMenu.deleteFriend.Alert",
            this._thaneInfo.friendGrade,
          );
          UIManager.Instance.ShowWind(EmWindow.TodayNotAlert, {
            content: content,
            backFunction: this.deleteFriendAlertBack.bind(this),
            closeFunction: null,
            state: 2,
          });
        } else {
          FriendManager.getInstance().sendRemoveFriendRequest(this._userId);
        }
        this.hide();
      } else {
        FriendManager.getInstance().sendRemoveFriendRequest(this._userId);
        this.hide();
      }
    }
  }

  private deleteFriendAlertBack(check: boolean) {
    SharedManager.Instance.deleteFriendTip = check;
    SharedManager.Instance.deleteFriendCheckDate = new Date();
    SharedManager.Instance.saveDeleteFriendTipCheck();
    FriendManager.getInstance().sendRemoveFriendRequest(this._userId);
  }

  /**
   * 复制名称
   */
  private __copyNameHandler() {
    SDKManager.Instance.getChannel().copyStr(this._name);
    this.hide();
  }

  /**
   * 黑名单
   */
  private __blacklistHandler() {
    var str: string;
    if (ArmyManager.Instance.thane.grades < 6) {
      str = LangManager.Instance.GetTranslation(
        "chat.view.ChatItemMenu.command01",
      );
      MessageTipManager.Instance.show(str);
      this.hide();
      return;
    }
    if (this._isRobot) {
      str = LangManager.Instance.GetTranslation(
        "chat.view.ChatItemMenu.RobotTips02",
      );
      MessageTipManager.Instance.show(str);
      this.hide();
      return;
    }
    FriendManager.getInstance().sendAddFriendRequest(
      this._name,
      RelationType.BLACKLIST,
    );
    this.hide();
  }

  /**
   * 查看资料
   */
  private __messageHandler() {
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
        this._userId,
        this._serverName,
      );
    } else {
      PlayerInfoManager.Instance.sendRequestSimpleInfo(this._userId);
    }
  }

  /**
   * 公会邀请
   */
  private __consortiaHandler() {
    if (this._isRobot) {
      this.hide();
      return;
    }
    let contorller: ConsortiaControler = FrameCtrlManager.Instance.getCtrl(
      EmWindow.Consortia,
    ) as ConsortiaControler;
    contorller.sendConsortiaInvitePlayer(this._userId);
    this.hide();
  }

  /**天空之城PK */
  private __pkBtnClickHandler() {
    if (SceneManager.Instance.currentType == SceneType.SPACE_SCENE) {
      var armyInfo: SpaceArmy = SpaceManager.Instance.model.getUserArmyByUserId(
        this._userId,
      );
      if (!armyInfo) {
        this.hide();
        return;
      }
      if (ArmyState.checkCampaignAttack(armyInfo.state)) {
        SpaceManager.PKInvite = true;
        SpaceSocketOutManager.Instance.sendMapPkInviteTo(
          armyInfo.baseHero.userId,
        );
      } else {
        //正在战斗不能攻击
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation("playermenu.command01"),
        );
      }
    }
    this.hide();
  }

  /**
   * 发起攻击
   */
  // private __attackHandler() {
  //     var msg: string;
  //     var thane: ThaneInfo = ArmyManager.Instance.thane;
  //     if (SceneManager.Instance.currentType == SceneType.CAMPAIGN_MAP_SCENE) {
  //         var army: CampaignArmy = CampaignManager.Instance.mapModel.getBaseArmyByUserId(this._userId);
  //         if (army) {
  //             var gradeDiff: number = Math.abs(army.baseHero.grades - thane.grades);
  //             var sameConsortia: boolean = false;
  //             var armyConsortiaName: string = army.baseHero.consortiaName;
  //             if (armyConsortiaName && armyConsortiaName == thane.consortiaName) {
  //                 sameConsortia = true;
  //             }

  //             if (gradeDiff >= 10 && !WorldBossHelper.checkMineral(CampaignManager.Instance.mapModel.mapId)) {
  //                 msg = LangManager.Instance.GetTranslation("ChatItemMenu.gradeDiff");
  //                 MessageTipManager.Instance.show(msg);
  //             }
  //             else if (sameConsortia) {
  //                 msg = LangManager.Instance.GetTranslation("map.outercity.mediator.mapview.OuterCityPkMediator.command01");
  //                 MessageTipManager.Instance.show(msg);
  //             }
  //             else {
  //                 NotificationManager.Instance.sendNotification(NotificationEvent.LOCK_PVP_WARFIGHT, army);
  //             }
  //         }
  //     }
  //     this.hide();
  // }

  /**
   * 邀请组队
   */
  private __inviteHandler() {
    FreedomTeamManager.Instance.inviteMember(this._userId);
    this.hide();
  }

  private __recentContactHandler(data1: number, data2: ThaneInfo) {
    PlayerManager.Instance.removeEventListener(
      RequestInfoEvent.REQUEST_SIMPLEINFO,
      this.__recentContactHandler,
      this,
    );
    var thane: ThaneInfo = data2;
    thane.isRobot = this._isRobot;
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
    this.hide();
  }

  OnHideWind() {
    this.onRemoveEvent();
    if (this.list) {
      // this.list.itemRenderer.recover();
      Utils.clearGListHandle(this.list);
      this.list.numItems = 0;
      this._point = null;
      this.list = null;
    }
    super.OnHideWind();
  }
}
