//@ts-expect-error: External dependencies
import FUI_TaskAddFriendItem from "../../../../fui/Home/FUI_TaskAddFriendItem";
import LangManager from "../../../core/lang/LangManager";
import { UIFilter } from "../../../core/ui/UIFilter";
import { IconFactory } from "../../../core/utils/IconFactory";
import ObjectUtils from "../../../core/utils/ObjectUtils";
import { t_s_itemtemplateData } from "../../config/t_s_itemtemplate";
import ColorConstant from "../../constant/ColorConstant";
import {
  FreedomTeamEvent,
  FriendUpdateEvent,
} from "../../constant/event/NotificationEvent";
import { IconType } from "../../constant/IconType";
import { RoomInviteType, RoomSceneType } from "../../constant/RoomDefine";
import { StateType } from "../../constant/StateType";
import { EmWindow } from "../../constant/UIDefine";
import { PlayerInfo } from "../../datas/playerinfo/PlayerInfo";
import { ThaneInfo } from "../../datas/playerinfo/ThaneInfo";
import { CampaignManager } from "../../manager/CampaignManager";
import FreedomTeamManager from "../../manager/FreedomTeamManager";
import { FriendManager } from "../../manager/FriendManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { RoomManager } from "../../manager/RoomManager";
import { TempleteManager } from "../../manager/TempleteManager";
import { CampaignArmy } from "../../map/campaign/data/CampaignArmy";
import { SceneManager } from "../../map/scene/SceneManager";
import SceneType from "../../map/scene/SceneType";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import { CampaignMapModel } from "../../mvc/model/CampaignMapModel";
import { RoomInfo } from "../../mvc/model/room/RoomInfo";
import { WorldBossHelper } from "../../utils/WorldBossHelper";
/**
 * @author:pzlricky
 * @data: 2021-05-11 15:16
 * @description 主界面添加队友列表
 */
export default class TaskAddFriendItem extends FUI_TaskAddFriendItem {
  public roomSceneType = RoomSceneType.PVE;
  private _vData: CampaignArmy;
  private _showQuickInviteBtn: boolean = false;

  public playerIcon: IconAvatarFrame;
  constructor() {
    super();
  }

  onConstruct() {
    super.onConstruct();
    this.addEvent();
    this.updateView();
  }

  public quickInviteBtn() {
    this._showQuickInviteBtn = true;
    this.updateView();
    this.refreshIconFilter();
  }

  public set vData(value: CampaignArmy) {
    this._vData = value;
    this.updateView();
    this.refreshIconFilter();
  }

  public get vData(): CampaignArmy {
    return this._vData;
  }

  private addEvent() {
    NotificationManager.Instance.addEventListener(
      FreedomTeamEvent.TEAM_INFO_SYNC,
      this.__syncTeamInfoHandler,
      this,
    );
    FriendManager.getInstance().addEventListener(
      FriendUpdateEvent.FRIEND_CHANGE,
      this.onFriendStatusChange,
      this,
    );
    this.onClick(this, this.clickHandler.bind(this));
  }

  private removeEvent() {
    NotificationManager.Instance.removeEventListener(
      FreedomTeamEvent.TEAM_INFO_SYNC,
      this.__syncTeamInfoHandler,
      this,
    );
    FriendManager.getInstance().removeEventListener(
      FriendUpdateEvent.FRIEND_CHANGE,
      this.onFriendStatusChange,
      this,
    );

    this.offClick(this, this.clickHandler.bind(this));
  }

  /**
   * 好友上线、下线通知
   */
  onFriendStatusChange(info: ThaneInfo) {
    if (this._vData && this._vData.baseHero.userId == info.userId) {
      this.playerIcon.grayed = info.state == StateType.OFFLINE;
      this.playerIcon.setMovieGray(!(info.state == StateType.OFFLINE));
    }
  }

  private clickHandler() {
    if (!this._vData) {
      if (WorldBossHelper.checkShowRoomTeam()) {
        if (!this.roomInfo.isCross) {
          if (this._showQuickInviteBtn) {
            FrameCtrlManager.Instance.open(EmWindow.QuickInvite, {
              roomSceneType: this.roomSceneType,
            });
          } else {
            FrameCtrlManager.Instance.open(EmWindow.Invite, {
              type: RoomInviteType.RoomInvite,
            });
          }
        }
      } else {
        if (this.checkIsSingleCampign) {
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation(
              "selectcampaign.data.CanNotBegainCampaignInTeam1",
            ),
          );
          return;
        }
        FrameCtrlManager.Instance.open(EmWindow.Invite, {
          type: RoomInviteType.SpaceInvite,
        });
      }
    }
  }

  private updateView() {
    if (this._vData) {
      this.playerIcon.headId = this._vData.baseHero.headId;
      if (this._vData.baseHero.frameId > 0) {
        let itemData: t_s_itemtemplateData =
          TempleteManager.Instance.getGoodsTemplatesByTempleteId(
            this._vData.baseHero.frameId,
          );
        if (itemData) {
          this.playerIcon.headFrame = itemData.Avata;
          this.playerIcon.headEffect =
            Number(itemData.Property1) == 1 ? itemData.Avata : "";
        }
      } else {
        this.playerIcon.headFrame = "";
        this.playerIcon.headEffect = "";
      }
      this.playerIcon.visible = true;
      this.hpProgress.visible = true;
      this.userNameTxt.text = this._vData.baseHero.nickName;
      this.addFriendBtn.visible = false;
      this.LevelBg.visible = true;
      this.playerLevelTxt.text = this._vData.baseHero.grades.toString();
      this.userNameTxt.color = ColorConstant.DEEP_TEXT_COLOR;
      this.hpProgress.value = Math.floor(
        (this._vData.hp / this._vData.maxHp) * 100,
      );
      if (this.roomInfo && this.roomInfo.isCross) {
        if (
          this.roomInfo.houseOwnerId == this._vData.baseHero.userId &&
          this.checkIsPve &&
          this._vData.baseHero.serviceName == this.roomInfo.serverName
        ) {
          this.teamImg.visible = true;
          this.userNameTxt.color = ColorConstant.BLUE_COLOR;
        } else {
          this.teamImg.visible = false;
        }
      } else {
        if (
          (FreedomTeamManager.Instance.hasTeam &&
            FreedomTeamManager.Instance.model.captainId ==
              this._vData.baseHero.userId) ||
          (this.roomInfo &&
            this.roomInfo.houseOwnerId == this._vData.baseHero.userId &&
            this.checkIsPve)
        ) {
          this.teamImg.visible = true;
          this.userNameTxt.color = ColorConstant.BLUE_COLOR;
        } else {
          this.teamImg.visible = false;
        }
      }
    } else {
      this.userNameTxt.text = "";
      this.addFriendBtn.visible = true;
      this.playerIcon.headId = 0;
      this.playerIcon.headFrame = "";
      this.playerIcon.headEffect = "";
      this.playerIcon.visible = false;
      this.teamImg.visible = false;
      this.playerLevelTxt.text = "";
      this.LevelBg.visible = false;
      this.selected = false;
      this.hpProgress.visible = false;
      this.quick_invite.visible = false;
      if (this._showQuickInviteBtn) {
        this.addFriendBtn.visible = false;
        this.icon_background.visible = false;
        this.quick_invite.visible = true;
        this.quick_invite.text = LangManager.Instance.GetTranslation(
          "invite.friend.quick",
        );
      }
    }
  }

  public get playerInfo(): PlayerInfo {
    return PlayerManager.Instance.currentPlayerModel.playerInfo;
  }

  private refreshIconFilter() {
    if (!this._vData) {
      return;
    }
    if (
      FreedomTeamManager.Instance.memberIsOnline(this._vData.baseHero.userId) ||
      this._vData.online
    ) {
      UIFilter.normal(this);
    } else {
      UIFilter.gray(this);
    }
  }

  private __syncTeamInfoHandler() {
    this.updateView();
    this.refreshIconFilter();
  }

  private get checkIsPve(): boolean {
    var curScene: string = SceneManager.Instance.currentType;
    var mapModel: CampaignMapModel = CampaignManager.Instance.mapModel;
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

  private get checkIsSingleCampign(): boolean {
    let mapModel: CampaignMapModel = CampaignManager.Instance.mapModel;
    let currentScene: string = SceneManager.Instance.currentType;
    if (
      currentScene == SceneType.CAMPAIGN_MAP_SCENE &&
      mapModel &&
      mapModel.isSingleCampaign()
    ) {
      return true;
    }
    return false;
  }

  private get roomInfo(): RoomInfo {
    return RoomManager.Instance.roomInfo;
  }

  private get mapModel(): CampaignMapModel {
    return CampaignManager.Instance.mapModel;
  }

  public dispose() {
    this.removeEvent();
    ObjectUtils.disposeAllChildren(this);
    super.dispose();
  }
}
