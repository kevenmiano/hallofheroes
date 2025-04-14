//@ts-expect-error: External dependencies
import FUI_SystemSetCom from "../../../../../fui/PersonalCenter/FUI_SystemSetCom";
import AudioManager from "../../../../core/audio/AudioManager";
import LangManager from "../../../../core/lang/LangManager";
import UIManager from "../../../../core/ui/UIManager";
import Utils from "../../../../core/utils/Utils";
import { t_s_mapData } from "../../../config/t_s_map";
import { BattleEvent } from "../../../constant/event/NotificationEvent";
import { SoundIds } from "../../../constant/SoundIds";
import { EmWindow } from "../../../constant/UIDefine";
import { BaseManager } from "../../../manager/BaseManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { SharedManager } from "../../../manager/SharedManager";
import { SocketSendManager } from "../../../manager/SocketSendManager";
import SettingData, { OptType, SettingType } from "../../setting/SettingData";
import SetItem from "../item/SetItem";
import SetItem1 from "../item/SetItem1";

/**
 * 个人中心里的系统设置页面
 */
export default class SystemSetCom extends FUI_SystemSetCom {
  private listData: any[] = [];
  private listData1: any[] = [];
  private listData2: any[] = [];

  onConstruct() {
    super.onConstruct();
    this.addEvent();
    this.initData();
  }

  private initData() {
    this.musicSlider.min = 0;
    this.musicSlider.max = 100;
    this.soundSlider.min = 0;
    this.soundSlider.max = 100;

    this.musicCbx.selected = SharedManager.Instance.allowMusic;
    this.soundCbx.selected = SharedManager.Instance.allowSound;
    this.musicSlider.value = SharedManager.Instance.musicVolumn;
    this.soundSlider.value = SharedManager.Instance.soundVolumn;

    this.musicSlider.enabled = this.musicCbx.selected;
    this.soundSlider.enabled = this.soundCbx.selected;

    this.txt_pro0.text = this.musicSlider.value.toFixed(0) + "%";
    this.txt_pro1.text = this.soundSlider.value.toFixed(0) + "%";

    this.listData = [];
    this.listData1 = [];
    this.listData2 = [];
    let settingData = null;

    //拒绝队伍邀请
    settingData = new SettingData();
    settingData.Type = SettingType.REFUSE_TEAM_INVITE;
    settingData.Value = LangManager.Instance.GetTranslation(
      "SettingWnd.settingData5",
    );
    settingData.Progress =
      PlayerManager.Instance.currentPlayerModel.playerInfo.refuseTeamInvite;
    this.listData.push(settingData);

    settingData = new SettingData();
    settingData.Type = SettingType.REFUSE_ROOM_INVITE;
    settingData.Value = LangManager.Instance.GetTranslation(
      "SettingWnd.settingData2",
    );
    settingData.Progress =
      PlayerManager.Instance.currentPlayerModel.playerInfo.refuseInvite;
    this.listData.push(settingData);
    //拒绝切磋邀请
    settingData = new SettingData();
    settingData.Type = SettingType.REFUSE_INVITATION;
    settingData.Value = LangManager.Instance.GetTranslation(
      "SettingWnd.settingData6",
    );
    settingData.Progress =
      PlayerManager.Instance.currentPlayerModel.playerInfo.refuseFamInvite;
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

    settingData = new SettingData();
    settingData.Type = SettingType.REFUSE_CONSORTIA_INVITE;
    settingData.Value = LangManager.Instance.GetTranslation(
      "SettingWnd.settingData13",
    );
    settingData.Progress =
      PlayerManager.Instance.currentPlayerModel.playerInfo.refuseConsortiaInvite;
    this.listData.push(settingData);
    //拒绝被查看信息
    // settingData = new SettingData();
    // settingData.Type = SettingType.REFUSE_ACCESS_INFO;
    // settingData.Value = LangManager.Instance.GetTranslation("SettingWnd.settingData14");
    // settingData.Progress = PlayerManager.Instance.currentPlayerModel.playerInfo.refuseLookInfo;
    // this.listData.push(settingData);

    this.list.numItems = this.listData.length;

    // let mapId: number = PlayerManager.Instance.currentPlayerModel.mapNodeInfo.info.mapId;
    // let mapData:t_s_mapData = TempleteManager.Instance.getMapTemplatesByID(mapId);

    settingData = new SettingData();
    settingData.Type = SettingType.mbSetingTK;
    settingData.Value = LangManager.Instance.GetTranslation(
      "SettingWnd.settingData15",
    );
    settingData.Progress =
      PlayerManager.Instance.currentPlayerModel.playerInfo.isOpenSettingType5;
    this.listData1.push(settingData);

    settingData = new SettingData();
    settingData.Type = SettingType.mbSetingYW;
    settingData.Value = LangManager.Instance.GetTranslation(
      "SettingWnd.settingData16",
    );
    settingData.Progress =
      PlayerManager.Instance.currentPlayerModel.playerInfo.isOpenSettingType6;
    this.listData1.push(settingData);

    settingData = new SettingData();
    settingData.Type = SettingType.mbSetingFB;
    settingData.Value = LangManager.Instance.GetTranslation(
      "SettingWnd.settingData17",
    );
    settingData.Progress =
      PlayerManager.Instance.currentPlayerModel.playerInfo.isOpenSettingType7;
    this.listData1.push(settingData);

    // settingData = new SettingData();
    // settingData.Type = SettingType.mbSetingHD;
    // settingData.Value = "活动地图气泡显示";
    // settingData.Progress = PlayerManager.Instance.currentPlayerModel.playerInfo.isOpenSettingType8;
    // this.listData1.push(settingData);

    settingData = new SettingData();
    settingData.Type = SettingType.mbSetingZD;
    settingData.Value = LangManager.Instance.GetTranslation(
      "SettingWnd.settingData18",
    );
    settingData.Progress =
      PlayerManager.Instance.currentPlayerModel.playerInfo.isOpenSettingType9;
    this.listData1.push(settingData);

    settingData = new SettingData();
    settingData.Type = SettingType.mbSetingDW;
    settingData.Value = LangManager.Instance.GetTranslation(
      "SettingWnd.settingData19",
    );
    settingData.Progress =
      PlayerManager.Instance.currentPlayerModel.playerInfo.isOpenSettingType10;
    this.listData1.push(settingData);

    this.list1.numItems = this.listData1.length;

    settingData = new SettingData();
    settingData.Type = SettingType.ShortCut_InTeam;
    settingData.Value = LangManager.Instance.GetTranslation("shortCut.str1");
    this.listData2.push(settingData);

    settingData = new SettingData();
    settingData.Type = SettingType.ShortCut_AllTeam;
    settingData.Value = LangManager.Instance.GetTranslation("shortCut.str2");
    this.listData2.push(settingData);

    this.list2.numItems = this.listData2.length;
  }

  private addEvent(): void {
    this.musicCbx.onClick(this, this.onMusic);
    this.soundCbx.onClick(this, this.onSound);
    this.musicSlider.on(fairygui.Events.STATE_CHANGED, this, this.onMusicPro);
    this.soundSlider.on(fairygui.Events.STATE_CHANGED, this, this.onSoundPro);

    this.list.itemRenderer = Laya.Handler.create(
      this,
      this.renderListItem,
      null,
      false,
    );
    this.list1.itemRenderer = Laya.Handler.create(
      this,
      this.renderListItem1,
      null,
      false,
    );
    this.list2.itemRenderer = Laya.Handler.create(
      this,
      this.renderListItem2,
      null,
      false,
    );
  }

  private renderListItem2(index: number, item: SetItem1) {
    if (item) {
      let itemData = this.listData2[index];
      item.txt_name.text = itemData.Value;
      item.btn_set.onClick(this, this.onSelectItem1, [index]);
    }
  }

  private renderListItem1(index: number, item: SetItem) {
    let itemData = this.listData1[index];
    item.txt_name.text = itemData.Value;

    item.btn_switch.selected = itemData.Progress;
    item.btn_switch.data = itemData;
    item.btn_switch.onClick(this, this.onSelectItem, [item.btn_switch]);
  }

  private renderListItem(index: number, item: SetItem) {
    let itemData = this.listData[index];
    item.txt_name.text = itemData.Value;

    item.btn_switch.selected = itemData.Progress;
    item.btn_switch.data = itemData;
    item.btn_switch.onClick(this, this.onSelectItem, [item.btn_switch]);
  }

  private onSelectItem1(index: number) {
    UIManager.Instance.ShowWind(EmWindow.ShortCutSetWnd, { type: index });
  }

  private onSelectItem(target: any) {
    let itemData = target.data;
    if (!itemData) return;
    let targetState = target.selected;
    // Logger.log('--------------itemData.TYPE',itemData.Type,'targetState',targetState)
    switch (itemData.Type) {
      case SettingType.REFUSE_ROOM_INVITE: //拒绝房间邀请
        SocketSendManager.Instance.sendRefuseInvite();
        break;
      case SettingType.REFUSE_TEAM_INVITE: //拒绝队伍邀请
        SocketSendManager.Instance.sendRefuseTeamInvite();
        break;
      case SettingType.REFUSE_INVITATION: //拒绝切磋邀请
        SocketSendManager.Instance.reqPlayerSetting(
          OptType.refuseFamInvite,
          targetState ? 1 : 0,
        );
        break;
      case SettingType.REFUSE_FRIEND: //拒绝被添加为好友
        SocketSendManager.Instance.sendFriendRefuse();
        break;
      case SettingType.REFUSE_ACCESS_INFO: //拒绝被查看信息
        SocketSendManager.Instance.reqPlayerSetting(
          OptType.refuseLookInfo,
          targetState ? 1 : 0,
        );
        break;
      case SettingType.REFUSE_CONSORTIA_INVITE: //
        SocketSendManager.Instance.reqPlayerSetting(
          OptType.refuseConsortiaInvite,
          targetState ? 1 : 0,
        );
        break;
      case SettingType.mbSetingTK: //
        SocketSendManager.Instance.reqPlayerSetting(
          OptType.mbSetingTK,
          targetState ? 1 : 0,
        );
        break;
      case SettingType.mbSetingYW: //
        SocketSendManager.Instance.reqPlayerSetting(
          OptType.mbSetingYW,
          targetState ? 1 : 0,
        );
        break;
      case SettingType.mbSetingFB: //
        SocketSendManager.Instance.reqPlayerSetting(
          OptType.mbSetingFB,
          targetState ? 1 : 0,
        );
        break;
      case SettingType.mbSetingHD: //
        SocketSendManager.Instance.reqPlayerSetting(
          OptType.mbSetingHD,
          targetState ? 1 : 0,
        );
        break;
      case SettingType.mbSetingZD: //
        SocketSendManager.Instance.reqPlayerSetting(
          OptType.mbSetingZD,
          targetState ? 1 : 0,
        );
        break;
      case SettingType.mbSetingDW: //
        SocketSendManager.Instance.reqPlayerSetting(
          OptType.mbSetingDW,
          targetState ? 1 : 0,
        );
        break;

      default:
        break;
    }
  }

  private onMusic(): void {
    this.playSound();
    BaseManager.isMusicOn = this.musicCbx.selected;
    SharedManager.Instance.allowMusic = this.musicCbx.selected;
    AudioManager.Instance.allowMusic = this.musicCbx.selected;
    NotificationManager.Instance.dispatchEvent(
      BattleEvent.BATTLE_MUSIC_ON_OFF,
      null,
    );
    SharedManager.Instance.save();
    this.musicSlider.enabled = this.musicCbx.selected;
  }

  private onSound(): void {
    this.playSound();
    BaseManager.isSoundOn = this.soundCbx.selected;
    SharedManager.Instance.allowSound = this.soundCbx.selected;
    AudioManager.Instance.allowSound = this.soundCbx.selected;
    SharedManager.Instance.save();
    this.soundSlider.enabled = this.soundCbx.selected;
  }

  private onMusicPro(): void {
    let val = Number(this.musicSlider.value);
    SharedManager.Instance.musicVolumn = val;
    AudioManager.Instance.musicVolume = val / 100;
    this.txt_pro0.text = val.toFixed(0) + "%";
    SharedManager.Instance.save();
  }

  private onSoundPro(): void {
    let val = Number(this.soundSlider.value);
    SharedManager.Instance.soundVolumn = val;
    AudioManager.Instance.soundVolume = val / 100;
    this.txt_pro1.text = val.toFixed(0) + "%";
    SharedManager.Instance.save();
  }

  public removeEvent(): void {
    for (let i = 0; i < this.list.numChildren; i++) {
      let btn_switch: fairygui.GButton = (this.list.getChildAt(i) as SetItem)
        .asButton;
      btn_switch.offClick(this, this.onSelectItem);
    }
    for (let i = 0; i < this.list1.numChildren; i++) {
      let btn_switch: fairygui.GButton = (this.list1.getChildAt(i) as SetItem)
        .asButton;
      btn_switch.offClick(this, this.onSelectItem);
    }
    for (let i = 0; i < this.list2.numChildren; i++) {
      let btn_set: fairygui.GButton = (this.list2.getChildAt(i) as SetItem1)
        .asButton;
      btn_set.offClick(this, this.onSelectItem1);
    }
    // this.list.itemRenderer.recover();
    // this.list1.itemRenderer.recover();
    Utils.clearGListHandle(this.list);
    Utils.clearGListHandle(this.list1);
    this.musicCbx.offClick(this, this.onMusic);
    this.soundCbx.offClick(this, this.onSound);
    this.musicSlider.off(fairygui.Events.STATE_CHANGED, this, this.onMusicPro);
    this.soundSlider.off(fairygui.Events.STATE_CHANGED, this, this.onSoundPro);
  }

  private playSound() {
    AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
  }
}
