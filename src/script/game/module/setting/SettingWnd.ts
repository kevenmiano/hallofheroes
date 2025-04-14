import AudioManager from "../../../core/audio/AudioManager";
import SDKManager from "../../../core/sdk/SDKManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import { BattleEvent } from "../../constant/event/NotificationEvent";
import { BaseManager } from "../../manager/BaseManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { SharedManager } from "../../manager/SharedManager";
import { SocketSendManager } from "../../manager/SocketSendManager";
import BuildingManager from "../../map/castle/BuildingManager";
import SettingData, { SettingType } from "./SettingData";
import { Main } from "../../../../Main";
import LangManager from "../../../core/lang/LangManager";
import Utils from "../../../core/utils/Utils";
/**
 * @author:pzlricky
 * @data: 2021-07-12 15:14
 * @description 设置面板
 */
export default class SettingWnd extends BaseWindow {
  public state: fgui.Controller;
  public frame: fgui.GComponent;
  public musicCheckbox: fgui.GButton;
  public effectCheckbox: fgui.GButton;
  public musicProgress: fgui.GSlider;
  public effectProgress: fgui.GSlider;
  public list: fgui.GList;
  private PersonalCenter: fgui.GButton;
  private Logout: fgui.GButton;
  private Exchange: fgui.GButton;
  private listData: any[] = [];

  public OnInitWind() {
    super.OnInitWind();
    this.setCenter();
    this.state = this.getController("state");
    this.state.selectedIndex = Utils.isApp() ? 1 : 0;
    this.addEvent();
    this.listData = [];
    this.initData();
  }

  OnShowWind() {
    super.OnShowWind();
  }

  OnHideWind() {
    super.OnHideWind();
  }

  addEvent() {
    this.musicCheckbox.onClick(this, this.__musicChkBtnClick);
    this.effectCheckbox.onClick(this, this.__soundChkBtnClick);
    this.musicProgress.on(
      fairygui.Events.STATE_CHANGED,
      this,
      this.__backMusicSilderchange,
    );
    this.effectProgress.on(
      fairygui.Events.STATE_CHANGED,
      this,
      this.__musicEffectSilderchange,
    );
    this.list.on(fairygui.Events.CLICK_ITEM, this, this.__onSelectItem);
    this.list.itemRenderer = Laya.Handler.create(
      this,
      this.renderListItem,
      null,
      false,
    );
    this.PersonalCenter.onClick(this, this.userCenter);
    if (Utils.isWxMiniGame()) {
      this.Logout.displayObject.visible = false;
      this.Logout.y = 1000;
    }

    this.Logout.onClick(this, this.loginOut, [false]);
    this.Exchange.onClick(this, this.loginOut, [true]);
  }

  removeEvent() {
    this.musicCheckbox.offClick(this, this.__musicChkBtnClick);
    this.effectCheckbox.offClick(this, this.__soundChkBtnClick);
    this.musicProgress.off(
      fairygui.Events.STATE_CHANGED,
      this,
      this.__backMusicSilderchange,
    );
    this.effectProgress.off(
      fairygui.Events.STATE_CHANGED,
      this,
      this.__musicEffectSilderchange,
    );
    this.list.off(fairygui.Events.CLICK_ITEM, this, this.__onSelectItem);
    // this.list.itemRenderer.recover();
    Utils.clearGListHandle(this.list);
    this.PersonalCenter.offClick(this, this.userCenter);
    this.Logout.offClick(this, this.loginOut);
    this.Exchange.offClick(this, this.loginOut);
  }

  userCenter() {
    SDKManager.Instance.getChannel().openPersonalCenter();
  }

  /**退出游戏, 切换账号 */
  loginOut(b: boolean = false) {
    SDKManager.Instance.getChannel().logout(b);
  }

  renderListItem(index: number, item: any) {
    let itemData = this.listData[index];
    item.title = itemData.Value;
    item.selected = itemData.Progress;
    item.data = itemData;
  }

  /**单击列表 */
  __onSelectItem(target) {
    let itemData = target.data;
    if (!itemData) return;
    let targetState = target.selected;
    switch (itemData.Type) {
      case SettingType.SCENE_EFFECT: //场景特效
        this.__sceneEffectClick(targetState);
        break;
      case SettingType.REFUSE_ROOM_INVITE: //拒绝房间邀请
        this.__refuseInviteClick();
        break;
      case SettingType.SHADOW_Effect: //战斗幻影
        this.__shadowEffectClick(targetState);
        break;
      case SettingType.HIDE_FIGHTING_OBJECT: //技能特效
        this.__attackEffectClick(targetState);
        break;
      case SettingType.REFUSE_TEAM_INVITE: //拒绝队伍邀请
        this.___allowTeamInviteClick();
        break;
      case SettingType.REFUSE_INVITATION: //拒绝切磋邀请
        break;
      case SettingType.REFUSE_FRIEND: //拒绝被添加为好友
        this.__refuseFriendClick();
        break;
      case SettingType.BUILDING_NAME: //建筑名称
        this.__buildingNameClick(targetState);
        break;
      default:
        break;
    }
  }

  private initData() {
    this.musicProgress.min = 0;
    this.musicProgress.max = 100;
    this.effectProgress.min = 0;
    this.effectProgress.max = 100;

    this.musicCheckbox.selected = SharedManager.Instance.allowMusic;
    this.effectCheckbox.selected = SharedManager.Instance.allowSound;
    this.musicProgress.value = SharedManager.Instance.musicVolumn;
    this.effectProgress.value = SharedManager.Instance.soundVolumn;

    this.listData = [];
    let settingData = null;
    //场景特效
    // settingData = new SettingData();
    // settingData.Type = SettingType.SCENE_EFFECT;
    // settingData.Value = LangManager.Instance.GetTranslation("SettingWnd.settingData1");
    // settingData.Progress = SharedManager.Instance.allowSceneEffect;
    // this.listData.push(settingData);
    //拒绝房间邀请
    settingData = new SettingData();
    settingData.Type = SettingType.REFUSE_ROOM_INVITE;
    settingData.Value = LangManager.Instance.GetTranslation(
      "SettingWnd.settingData2",
    );
    settingData.Progress =
      PlayerManager.Instance.currentPlayerModel.playerInfo.refuseInvite;
    this.listData.push(settingData);
    //显示战斗幻影
    settingData = new SettingData();
    settingData.Type = SettingType.SHADOW_Effect;
    settingData.Value = LangManager.Instance.GetTranslation(
      "SettingWnd.settingData3",
    );
    settingData.Progress = SharedManager.Instance.shadowEffect;
    this.listData.push(settingData);
    //技能特效
    settingData = new SettingData();
    settingData.Type = SettingType.HIDE_FIGHTING_OBJECT;
    settingData.Value = LangManager.Instance.GetTranslation(
      "SettingWnd.settingData4",
    );
    settingData.Progress = SharedManager.Instance.allowAttactedEffect;
    this.listData.push(settingData);
    //拒绝队伍邀请
    settingData = new SettingData();
    settingData.Type = SettingType.REFUSE_TEAM_INVITE;
    settingData.Value = LangManager.Instance.GetTranslation(
      "SettingWnd.settingData5",
    );
    settingData.Progress =
      PlayerManager.Instance.currentPlayerModel.playerInfo.refuseTeamInvite;
    this.listData.push(settingData);
    //拒绝切磋邀请
    settingData = new SettingData();
    settingData.Type = SettingType.REFUSE_INVITATION;
    settingData.Value = LangManager.Instance.GetTranslation(
      "SettingWnd.settingData6",
    );
    settingData.Progress = SharedManager.Instance.refuseInvitation;
    this.listData.push(settingData);
    //拒绝被添加好友
    settingData = new SettingData();
    settingData.Type = SettingType.REFUSE_FRIEND;
    settingData.Value = LangManager.Instance.GetTranslation(
      "SettingWnd.settingData7",
    );
    settingData.Progress =
      PlayerManager.Instance.currentPlayerModel.playerInfo.refuseFriend;
    this.listData.push(settingData);
    //建筑名称
    settingData = new SettingData();
    settingData.Type = SettingType.BUILDING_NAME;
    settingData.Value = LangManager.Instance.GetTranslation(
      "SettingWnd.settingData8",
    );
    settingData.Progress = BuildingManager.Instance.isShowBuildingName;
    this.listData.push(settingData);

    this.list.numItems = this.listData.length;
  }

  private __backMusicSilderchange() {
    SharedManager.Instance.musicVolumn = Number(this.musicProgress.value);
    AudioManager.Instance.musicVolume = Number(this.musicProgress.value) / 100;
    SharedManager.Instance.save();
  }
  private __musicEffectSilderchange() {
    SharedManager.Instance.soundVolumn = Number(this.effectProgress.value);
    AudioManager.Instance.soundVolume = Number(this.effectProgress.value) / 100;
    SharedManager.Instance.save();
  }

  private __musicChkBtnClick() {
    BaseManager.isMusicOn = this.musicCheckbox.selected;
    SharedManager.Instance.allowMusic = this.musicCheckbox.selected;
    AudioManager.Instance.allowMusic = this.musicCheckbox.selected;
    NotificationManager.Instance.dispatchEvent(
      BattleEvent.BATTLE_MUSIC_ON_OFF,
      null,
    );
    SharedManager.Instance.save();
  }

  private __soundChkBtnClick() {
    BaseManager.isSoundOn = this.effectCheckbox.selected;
    SharedManager.Instance.allowSound = this.effectCheckbox.selected;
    AudioManager.Instance.allowSound = this.effectCheckbox.selected;
    SharedManager.Instance.save();
  }

  private __sceneEffectClick(state: boolean) {
    if (SharedManager.Instance.allowSceneEffect != state) {
      SharedManager.Instance.allowSceneEffect = state;
      NotificationManager.Instance.dispatchEvent(
        BattleEvent.SCENE_EFFECT_CLOSE,
        null,
      );
    }
    SharedManager.Instance.save();
  }

  private __buildingNameClick(state: boolean) {
    BuildingManager.Instance.isShowBuildingName = state;
  }

  private __shadowEffectClick(state: boolean) {
    SharedManager.Instance.shadowEffect = state;
    SharedManager.Instance.save();
  }

  private __attackEffectClick(state: boolean) {
    SharedManager.Instance.allowAttactedEffect = state;
    SharedManager.Instance.save();
  }

  private __refuseFriendClick() {
    SocketSendManager.Instance.sendFriendRefuse();
  }

  /**拒绝队伍邀请 */
  private ___allowTeamInviteClick() {
    SocketSendManager.Instance.sendRefuseTeamInvite();
  }

  /**拒绝房间邀请 */
  private __refuseInviteClick() {
    SocketSendManager.Instance.sendRefuseInvite();
  }

  dispose() {
    this.removeEvent();
    super.dispose();
  }
}
