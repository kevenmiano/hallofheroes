//@ts-expect-error: External dependencies
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { ThaneInfo } from "../../../datas/playerinfo/ThaneInfo";
import UIButton from "../../../../core/ui/UIButton";
import LangManager from "../../../../core/lang/LangManager";
import FriendItemCellInfo from "../../../datas/FriendItemCellInfo";
import IMManager from "../../../manager/IMManager";
import RelationType from "../../../constant/RelationType";
import { FriendManager } from "../../../manager/FriendManager";
import { PlayerInfoManager } from "../../../manager/PlayerInfoManager";
import FreedomTeamManager from "../../../manager/FreedomTeamManager";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import SDKManager from "../../../../core/sdk/SDKManager";
import {
  ChatEvent,
  OuterCityEvent,
  RequestInfoEvent,
  SpaceEvent,
} from "../../../constant/event/NotificationEvent";
import { PlayerManager } from "../../../manager/PlayerManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import Logger from "../../../../core/logger/Logger";
import { EmWindow } from "../../../constant/UIDefine";
import RequestInfoRientation from "../../../datas/RequestInfoRientation";
import { NotificationManager } from "../../../manager/NotificationManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { ConsortiaControler } from "../../consortia/control/ConsortiaControler";
import { PlayerInfo } from "../../../datas/playerinfo/PlayerInfo";
import { SceneManager } from "../../../map/scene/SceneManager";
import SceneType from "../../../map/scene/SceneType";
import { ArmyState } from "../../../constant/ArmyState";
import SpaceManager from "../../../map/space/SpaceManager";
import { SpaceSocketOutManager } from "../../../map/space/SpaceSocketOutManager";
import SpaceArmy from "../../../map/space/data/SpaceArmy";
import { OuterCityManager } from "../../../manager/OuterCityManager";
import { BaseArmy } from "../../../map/space/data/BaseArmy";
import ChatCellData from "../../chat/data/ChatCellData";
import Resolution from "../../../../core/comps/Resolution";
import { DataCommonManager } from "../../../manager/DataCommonManager";
import SortData from "../../sort/SortData";
import StringHelper from "../../../../core/utils/StringHelper";
import { ConsortiaDutyInfo } from "../../consortia/data/ConsortiaDutyInfo";
import IconAvatarFrame from "../../../map/space/view/physics/IconAvatarFrame";
import { t_s_itemtemplateData } from "../../../config/t_s_itemtemplate";
import { TempleteManager } from "../../../manager/TempleteManager";
import OutercityVehicleArmyView from "../../../map/campaign/view/physics/OutercityVehicleArmyView";

/**
 * @description 外城玩家tips
 * @author yuanzhan.yu
 * @date 2021/12/7 14:32
 * @ver 1.0
 */
export class OuterCityArmyTips extends BaseWindow {
  public bg: fgui.GLoader;
  public txt_name: fgui.GTextField;
  public txt_consortia: fgui.GTextField;
  public txt_lv: fgui.GTextField;
  public txt_power: fgui.GTextField;
  public btn_addFriend: UIButton;
  public btn_deleteFriend: UIButton;
  public btn_black: UIButton;
  public btn_copy: UIButton;
  public btn_info: UIButton;
  public btn_team: UIButton;

  public btn_private: UIButton; //私聊
  public btn_inviteConsortia: UIButton; //公会邀请
  public btn_battle: UIButton; //攻击
  private _thane: ThaneInfo;
  private _userId: number = 0;
  private _data: any;
  private _cellData: ChatCellData;
  private _sortData: SortData;
  private _point: Laya.Point;
  private _isRankData: boolean = false;
  private _isChatData: boolean = false;
  private _isFriendData: boolean = false;
  public btn_petPk: UIButton; //英灵切磋
  public headIcon: IconAvatarFrame;
  private _headId: number = 0;
  private _frameId: number = 0;
  constructor() {
    super();
  }

  public OnInitWind() {
    super.OnInitWind();
    this.initData();
    this.initView();
    this.initEvent();
    //请求查询是否是对方的黑名单
    FriendManager.getInstance().reqBlackList(this._userId);
  }

  private initData() {
    [this._data] = this.params;
    if (this._data) {
      if (this._data instanceof BaseArmy) {
        this._thane = this._data.baseHero;
        this._headId = this._thane.headId;
        if (this._thane) {
          this._userId = this._thane.userId;
        }
        this.setCenter();
      } else if (this._data instanceof ThaneInfo) {
        this._thane = this._data;
        this._isFriendData = true;
        this._headId = this._thane.snsInfo.headId;
        if (this._thane) {
          this._userId = this._thane.userId;
        }
        this._point = this.params[1];
        if (this._point.x + this.contentPane.width > Resolution.gameWidth) {
          //超出屏幕
          this.contentPane.x = Resolution.gameWidth - this.contentPane.width;
        } else {
          this.contentPane.x = this._point.x;
        }
        if (SceneManager.Instance.currentType == SceneType.BATTLE_SCENE) {
          this.contentPane.y = this._point.y;
          if (
            this.contentPane.y + this.contentPane.height >
            Resolution.gameHeight
          ) {
            //超出屏幕
            this.contentPane.y =
              Resolution.gameHeight - this.contentPane.height;
          }
        } else {
          this.contentPane.y = this._point.y - this.contentPane.height + 20;
        }
        if (this.contentPane.y < 0) {
          this.contentPane.y = 0;
        }
      } else if (this._data instanceof ChatCellData) {
        this._isChatData = true;
        [this._cellData] = this.params;
        this._thane = this.initThane(this._cellData);
        this._headId = this._cellData.headId;
        this._userId = this._thane.userId;
        this._point = this._cellData.point;
        this.contentPane.x = this._point.x + 20;

        if (SceneManager.Instance.currentType == SceneType.BATTLE_SCENE) {
          this.contentPane.y = this._point.y;
          if (
            this.contentPane.y + this.contentPane.height >
            Resolution.gameHeight
          ) {
            //超出屏幕
            this.contentPane.y =
              Resolution.gameHeight - this.contentPane.height;
          }
        } else {
          this.contentPane.y = this._point.y - this.contentPane.height + 20;
        }
        if (this.contentPane.y < 0) {
          this.contentPane.y = 0;
        }
      } else if (this._data instanceof SortData) {
        [this._sortData] = this.params;
        this._thane = this.initThaneBySortData(this._sortData);
        this._headId = this._data.headId;
        this._userId = this._thane.userId;
        this._point = this._sortData.point;
        this.contentPane.x = this._point.x + 20;
        this._isRankData = true;
        if (SceneManager.Instance.currentType == SceneType.BATTLE_SCENE) {
          this.contentPane.y = this._point.y;
          if (
            this.contentPane.y + this.contentPane.height >
            Resolution.gameHeight
          ) {
            //超出屏幕
            this.contentPane.y =
              Resolution.gameHeight - this.contentPane.height;
          }
        } else {
          this.contentPane.y = this._point.y - this.contentPane.height + 20;
        }
        if (this.contentPane.y < 0) {
          this.contentPane.y = 0;
        }
      }
      this._frameId = this._thane.frameId;
      if (this._headId == 0) {
        this._headId = this._thane.job;
      }
      this.headIcon.headId = this._headId;
      if (this._frameId > 0) {
        let itemData: t_s_itemtemplateData =
          TempleteManager.Instance.getGoodsTemplatesByTempleteId(this._frameId);
        if (itemData) {
          this.headIcon.headFrame = itemData.Avata;
          this.headIcon.headEffect =
            Number(itemData.Property1) == 1 ? itemData.Avata : "";
        }
      } else {
        this.headIcon.headFrame = "";
        this.headIcon.headEffect = "";
      }
    }
  }

  private initThane(chatCellData: ChatCellData): ThaneInfo {
    let thaneInfo = new ThaneInfo();
    thaneInfo.userId = chatCellData.userId;
    thaneInfo.fightingCapacity = chatCellData.fight;
    thaneInfo.consortiaName = chatCellData.consortName;
    thaneInfo.grades = chatCellData.userLevel;
    thaneInfo.nickName = chatCellData.nickName;
    thaneInfo.consortiaID = chatCellData.consortiaId;
    thaneInfo.serviceName = chatCellData.serverName;
    thaneInfo.frameId = chatCellData.frameId;
    thaneInfo.job = chatCellData.job;
    thaneInfo.isRobot = false;
    return thaneInfo;
  }

  private initThaneBySortData(sortData: SortData): ThaneInfo {
    let thaneInfo = new ThaneInfo();
    thaneInfo.userId = sortData.userId;
    thaneInfo.fightingCapacity = sortData.fightCapacity;
    thaneInfo.consortiaName = sortData.consortiaName;
    thaneInfo.grades = sortData.grades;
    thaneInfo.nickName = sortData.nickName;
    thaneInfo.serviceName = sortData.serverName;
    thaneInfo.isRobot = false;
    thaneInfo.mainSite = sortData.mainSite;
    thaneInfo.frameId = sortData.frameId;
    thaneInfo.job = sortData.job;
    return thaneInfo;
  }

  private initView() {
    this.txt_name.text = this._thane.nickName;
    this.txt_consortia.text = this._thane.consortiaName
      ? this._thane.consortiaName
      : LangManager.Instance.GetTranslation(
          "yishi.view.PlayerMenu.consortiaName",
        );
    this.txt_lv.text = this._thane.grades.toString();
    this.txt_power.text = this._thane.fightingCapacity.toString();
    this.btn_addFriend.enabled = this.btn_deleteFriend.enabled = false;
    this.btn_black.enabled = true;
    if (DataCommonManager.playerInfo.userId == this._userId) {
      this.btn_deleteFriend.enabled =
        this.btn_addFriend.enabled =
        this.btn_black.enabled =
        this.btn_team.enabled =
          false;
      this.btn_private.enabled =
        this.btn_info.enabled =
        this.btn_inviteConsortia.enabled =
          false;
      this.btn_battle.visible = false;
      this.btn_petPk.visible = false;
      return;
    }
    let fInfo: FriendItemCellInfo = IMManager.Instance.getFriendInfo(
      this._thane.userId,
    ); //因为可能从排行榜中点开菜单, 排行榜赋值进来的_thane.relation没值, 所以要取好友里的
    if (fInfo) {
      switch (fInfo.relation) {
        case RelationType.NONE:
        case RelationType.RECENT_CONTACT:
          this.btn_addFriend.enabled = true;
          break;
        case RelationType.FRIEND:
          this.btn_deleteFriend.enabled = true;
          break;
        case RelationType.STRANGER:
          this.btn_deleteFriend.enabled = true;
          break;
        case RelationType.BLACKLIST:
          this.btn_black.enabled = false;
          this.btn_deleteFriend.enabled = true;
          break;
      }
    } else {
      this.btn_addFriend.enabled = true;
      this.btn_deleteFriend.enabled = false;
    }
    if (!this.sameServiceName()) {
      this.btn_black.enabled = false;
    }
    let showInvite: boolean = FreedomTeamManager.Instance.canInviteMember(
      this._userId,
    );
    this.btn_team.enabled = showInvite;
    let showConsortia: boolean = false;
    if (!StringHelper.isNullOrEmpty(this.playerInfo.consortiaName)) {
      showConsortia = (
        FrameCtrlManager.Instance.getCtrl(
          EmWindow.Consortia,
        ) as ConsortiaControler
      ).getRightsByIndex(ConsortiaDutyInfo.INVITEMEMBER);
      showConsortia =
        showConsortia && StringHelper.isNullOrEmpty(this._thane.consortiaName);
    }
    this.btn_inviteConsortia.enabled = showConsortia;
    this.btn_battle.visible = this.canShowAttackBtn();
    this.btn_petPk.visible = this.canShowPetPKBtn();
    if (SceneManager.Instance.currentType == SceneType.SPACE_SCENE) {
      //在天空之城
      this.btn_battle.enabled = true;
      this.btn_battle.title = LangManager.Instance.GetTranslation(
        "yishi.view.PlayerMenu.pk",
      );
    } else {
      this.btn_battle.enabled = true;
      this.btn_battle.title = LangManager.Instance.GetTranslation(
        "outyard.OutyardActorView.attackBtn.text",
      );
    }
  }

  private sameServiceName(): boolean {
    if (this._thane.serviceName) {
      return (
        this._thane.serviceName ==
        PlayerManager.Instance.currentPlayerModel.playerInfo.serviceName
      );
    }
    return true;
  }

  //外城 显示发起攻击
  private canShowAttackBtn(): boolean {
    var attack: boolean = false;
    if (
      this._isRankData ||
      this._isChatData ||
      this.isSelf() ||
      this._isFriendData
    ) {
    } else {
      if (
        !this.isSelf() &&
        !FreedomTeamManager.Instance.inMyTeam(this._userId) &&
        (SceneManager.Instance.currentType == SceneType.OUTER_CITY_SCENE ||
          SceneManager.Instance.currentType == SceneType.SPACE_SCENE)
      ) {
        attack = true;
      }
    }
    return attack;
  }

  //天空之城点人可用英灵PK
  private canShowPetPKBtn() {
    var attack: boolean = false;
    if (
      this._isRankData ||
      this._isChatData ||
      this.isSelf() ||
      this._isFriendData
    ) {
    } else {
      if (
        !this.isSelf() &&
        !FreedomTeamManager.Instance.inMyTeam(this._userId) &&
        SceneManager.Instance.currentType == SceneType.SPACE_SCENE
      ) {
        attack = true;
      }
    }
    return attack;
  }

  private isSelf(): boolean {
    if (!this._thane) return false;
    return (
      this.playerInfo.userId == this._userId &&
      this.playerInfo.serviceName == this._thane.serviceName
    );
  }

  private get playerInfo(): PlayerInfo {
    return PlayerManager.Instance.currentPlayerModel.playerInfo;
  }

  private initEvent() {
    this.btn_addFriend.onClick(this, this.__onAddFriendHandler);
    this.btn_deleteFriend.onClick(this, this.__onDelFriendHandler);
    this.btn_black.onClick(this, this.__onBlacklistHandler);
    this.btn_copy.onClick(this, this.__onCopynameHandler);
    this.btn_info.onClick(this, this.__onInfoHandler);
    this.btn_team.onClick(this, this.__inviteHandler);
    this.btn_private.onClick(this, this.__privateHandler);
    this.btn_inviteConsortia.onClick(this, this.__inviteConsortiaHandler);
    this.btn_battle.onClick(this, this.__battleHandler);
    this.btn_petPk.onClick(this, this._petPkHandler);
  }

  public OnShowWind() {
    super.OnShowWind();
  }

  private __privateHandler() {
    if (FriendManager.getInstance().isInBlackList) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("chat.notfriend02"),
      );
      return;
    }
    if (!FriendManager.getInstance().checkIsFriend(this._userId)) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("chat.notfriend"),
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
    info.nickName = this._thane.nickName;
    info.isRobot = this._thane.isRobot;
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

  private __inviteConsortiaHandler() {
    if (this._thane.isRobot) {
      this.hide();
      return;
    }
    if (FriendManager.getInstance().isInBlackList) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("chat.notfriend02"),
      );
      return;
    }

    let contorller: ConsortiaControler = FrameCtrlManager.Instance.getCtrl(
      EmWindow.Consortia,
    ) as ConsortiaControler;
    contorller.sendConsortiaInvitePlayer(this._userId);
    this.hide();
  }

  private __battleHandler() {
    if (FriendManager.getInstance().isInBlackList) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("chat.notfriend02"),
      );
      return;
    }
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
      this.hide();
    } else if (
      SceneManager.Instance.currentType == SceneType.OUTER_CITY_SCENE
    ) {
      let bArmy: BaseArmy = OuterCityManager.Instance.model.getWorldArmyById(
        this._data.id,
      );
      if (!bArmy) {
        this.hide();
        return;
      }
      let self: OutercityVehicleArmyView =
        OuterCityManager.Instance.model.getSelfVehicle();
      if (self) {
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation(
            "OuterCityCastleTips.gotoBtnTips",
          ),
        );
        return;
      }
      NotificationManager.Instance.dispatchEvent(
        OuterCityEvent.OUTERCITY_LOCK_WAR_FIGHT,
        bArmy,
      );
      this.hide();
    }
  }

  private _petPkHandler() {
    if (FriendManager.getInstance().isInBlackList) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("chat.notfriend02"),
      );
      return;
    }
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
        SpaceSocketOutManager.Instance.sendMapPetPkInviteTo(
          armyInfo.baseHero.userId,
        );
      } else {
        //正在战斗不能攻击
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation("playermenu.command01"),
        );
      }
      this.hide();
    }
  }

  private __onAddFriendHandler(): void {
    if (FriendManager.getInstance().isInBlackList) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("chat.notfriend02"),
      );
      return;
    }
    FriendManager.getInstance().sendAddFriendRequest(
      this._thane.nickName,
      RelationType.FRIEND,
    );
    this.hide();
  }

  private __onCopynameHandler(): void {
    SDKManager.Instance.getChannel().copyStr(this._thane.nickName);
    this.hide();
  }

  private __onBlacklistHandler(): void {
    FriendManager.getInstance().sendAddFriendRequest(
      this._thane.nickName,
      RelationType.BLACKLIST,
    );
    this.hide();
  }

  private __onDelFriendHandler(): void {
    if (this._thane) {
      let fInfo: FriendItemCellInfo = IMManager.Instance.getFriendInfo(
        this._thane.userId,
      ); //因为可能从排行榜中点开菜单, 排行榜赋值进来的_thane.relation没值, 所以要取好友里的
      if (fInfo) {
        let str: string;
        switch (fInfo.relation) {
          case RelationType.RECENT_CONTACT:
            str = LangManager.Instance.GetTranslation(
              "yishi.view.PlayerMenu.str01",
            );
            break;
          case RelationType.STRANGER:
            str = LangManager.Instance.GetTranslation(
              "yishi.view.PlayerMenu.delStrangerTip",
            );
            break;
          case RelationType.BLACKLIST:
            str = LangManager.Instance.GetTranslation(
              "yishi.view.PlayerMenu.str02",
            );
            break;
          default:
            str = LangManager.Instance.GetTranslation(
              "yishi.view.PlayerMenu.str03",
            );
        }
        let confirm: string =
          LangManager.Instance.GetTranslation("public.confirm");
        let cancel: string =
          LangManager.Instance.GetTranslation("public.cancel");
        let prompt: string =
          LangManager.Instance.GetTranslation("public.prompt");
        SimpleAlertHelper.Instance.Show(
          SimpleAlertHelper.SIMPLE_ALERT,
          [fInfo],
          prompt,
          str,
          confirm,
          cancel,
          this._delFriendResponse.bind(this),
        );
      }
    }
    this.hide();
  }

  private _delFriendResponse(b: boolean, flag: boolean, data: any): void {
    let info: FriendItemCellInfo = data[0];
    if (b && info) {
      if (info.relation == RelationType.RECENT_CONTACT) {
        FriendManager.getInstance().removePrivatePerson(info.userId);
      } else {
        FriendManager.getInstance().sendRemoveFriendRequest(info.userId);
      }
      this.hide();
    }
  }

  protected __onInfoHandler(): void {
    let hInfo: ThaneInfo = this._thane;
    if (hInfo) {
      PlayerManager.Instance.addEventListener(
        RequestInfoEvent.REQUEST_SIMPLEINFO,
        this.__recentContactHandler,
        this,
      );
      if (this._isRankData) {
        if (this.isSameZone()) {
          PlayerInfoManager.Instance.sendRequestSimpleInfo(hInfo.userId);
        } else {
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation(
              "sort.SortGeneralListCell.notSameZone",
            ),
          );
        }
      } else {
        if (!this.isSameZone()) {
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation(
              "sort.SortGeneralListCell.notSameZone",
            ),
          );
          return;
        }
        let serverName = hInfo.serviceName;
        Logger.xjy(
          "[OuterCityArmyTips]__onInfoHandler",
          serverName,
          hInfo.nickName,
        );
        if (
          serverName &&
          serverName !=
            PlayerManager.Instance.currentPlayerModel.playerInfo.serviceName
        ) {
          PlayerInfoManager.Instance.sendRequestSimpleInfoCross(
            hInfo.userId,
            serverName,
          );
        } else {
          PlayerInfoManager.Instance.sendRequestSimpleInfo(hInfo.userId);
        }
      }
    }
  }

  private isSameZone(): boolean {
    if (this._thane && this._thane.mainSite) {
      return (
        PlayerManager.Instance.currentPlayerModel.userInfo.mainSite ==
        this._thane.mainSite
      );
    }
    return true;
  }

  private __recentContactHandler(data1: number, data2: ThaneInfo) {
    PlayerManager.Instance.removeEventListener(
      RequestInfoEvent.REQUEST_SIMPLEINFO,
      this.__recentContactHandler,
      this,
    );
    var thane: ThaneInfo = data2;
    thane.isRobot = false;
    if (!(thane && thane.nickName)) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "ChatItemMenu.cannotSearchPlayerInfo",
        ),
      );
      this.hide();
      return;
    }
    if (data1 == 10000) {
      PlayerInfoManager.Instance.show(thane, 10000);
    } else {
      PlayerInfoManager.Instance.show(thane);
    }
    this.hide();
  }

  private __inviteHandler(): void {
    if (FriendManager.getInstance().isInBlackList) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("chat.notfriend02"),
      );
      return;
    }
    FreedomTeamManager.Instance.inviteMember(this._thane.userId);
    this.hide();
  }

  private removeEvent() {
    this.btn_addFriend.offClick(this, this.__onAddFriendHandler);
    this.btn_deleteFriend.offClick(this, this.__onDelFriendHandler);
    this.btn_black.offClick(this, this.__onBlacklistHandler);
    this.btn_copy.offClick(this, this.__onCopynameHandler);
    this.btn_info.offClick(this, this.__onInfoHandler);
    this.btn_team.offClick(this, this.__inviteHandler);
    this.btn_private.offClick(this, this.__privateHandler);
    this.btn_inviteConsortia.offClick(this, this.__inviteConsortiaHandler);
    this.btn_battle.offClick(this, this.__battleHandler);
    this.btn_petPk.offClick(this, this._petPkHandler);
  }

  public OnHideWind() {
    super.OnHideWind();
    this.removeEvent();
  }

  dispose(dispose?: boolean) {
    this._thane = null;
    PlayerManager.Instance.currentPlayerModel.selectTarget = null;
    PlayerManager.Instance.currentPlayerModel.dispatchEvent(
      SpaceEvent.TARGET_CHANGE,
      null,
    );
    super.dispose(dispose);
  }
}
