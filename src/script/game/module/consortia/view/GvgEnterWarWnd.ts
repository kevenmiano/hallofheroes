//@ts-expect-error: External dependencies
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { EmWindow } from "../../../constant/UIDefine";
import { GvgReadyController } from "../control/GvgReadyController";
import { PlayerEvent } from "../../../constant/event/PlayerEvent";
import { ConsortiaEvent } from "../../../constant/event/NotificationEvent";
import { PlayerInfo } from "../../../datas/playerinfo/PlayerInfo";
import { PlayerManager } from "../../../manager/PlayerManager";
import { ConsortiaManager } from "../../../manager/ConsortiaManager";
import { ThaneInfo } from "../../../datas/playerinfo/ThaneInfo";
import LangManager from "../../../../core/lang/LangManager";
import { ArmyManager } from "../../../manager/ArmyManager";
import AudioManager from "../../../../core/audio/AudioManager";
import { SoundIds } from "../../../constant/SoundIds";
import UIManager from "../../../../core/ui/UIManager";
import { GvgEnterWarItem } from "./component/GvgEnterWarItem";
import FUI_CommonFrame3 from "../../../../../fui/Base/FUI_CommonFrame3";
import { TempleteManager } from "../../../manager/TempleteManager";
import Utils from "../../../../core/utils/Utils";

/**
 * @description 参战成员列表
 * @author yuanzhan.yu
 * @date 2021/10/21 20:09
 * @ver 1.0
 */
export class GvgEnterWarWnd extends BaseWindow {
  public frame: FUI_CommonFrame3;
  public memberBtn: fgui.GButton;
  public lvBtn: fgui.GButton;
  public stateBtn: fgui.GButton;
  public powerBtn: fgui.GButton;
  public list: fgui.GList;
  public txt_num: fgui.GTextField;
  public txt_in: fgui.GTextField;
  public btn_addMember: fgui.GButton;

  private _controller: GvgReadyController;
  private _sortField: string = "fightingCapacity";
  private _isReverse: boolean = true;
  private _memberList: ThaneInfo[];

  constructor() {
    super();
  }

  public OnInitWind() {
    super.OnInitWind();
    this.setCenter();
    this.initData();
    this.initEvent();
    this.initView();
  }

  private initData() {
    this._controller = FrameCtrlManager.Instance.getCtrl(
      EmWindow.GvgRankListWnd,
    ) as GvgReadyController;
  }

  private initEvent() {
    this.memberBtn.onClick(this, this.__onSortClick, [1]);
    this.lvBtn.onClick(this, this.__onSortClick, [2]);
    this.stateBtn.onClick(this, this.__onSortClick, [3]);
    this.powerBtn.onClick(this, this.__onSortClick, [4]);
    this.btn_addMember.onClick(this, this.__addMemberHandler);
    this.frame.btnHelp.onClick(this, this.__helpHandler);
    this.playerInfo.addEventListener(
      PlayerEvent.CONSORTIA_CHANGE,
      this.__existConsortiaHandler,
      this,
    );
    ConsortiaManager.Instance.model.addEventListener(
      ConsortiaEvent.UPDATA_CONSORTIA_MEMBER,
      this.__consortiaMemberHandler,
      this,
    );
  }

  private initView() {
    this.list.itemRenderer = Laya.Handler.create(
      this,
      this.onListItemRender,
      null,
      false,
    );
    this.list.setVirtual();
    this.setListView();
    this.btn_addMember.enabled = this._controller.model.isFightManager;
    this.setTips();
  }

  public OnShowWind() {
    super.OnShowWind();
  }

  public setListView(): void {
    let chairmanID: number =
      ConsortiaManager.Instance.model.consortiaInfo.chairmanID;
    this._memberList = [];
    let list = ConsortiaManager.Instance.model.getSortMemberList(
      this._sortField,
      this._isReverse,
    );
    for (let j = 0, len = list.length; j < len; j++) {
      const info = list[j];
      if (!info.isTeamPlayer && info.userId != chairmanID) {
        continue;
      }
      this._memberList.push(info);
    }
    this.list.numItems = this._memberList.length;
    let count = 25;
    let cfg = TempleteManager.Instance.getConfigInfoByConfigName("GVG_People");
    if (cfg) {
      count = Number(cfg.ConfigValue);
    }
    this.txt_num.text = this._memberList.length + " / " + count.toString();
  }

  private __onSortClick(type: number): void {
    AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);

    switch (type) {
      case 1:
        this._sortField = "nickName";
        break;
      case 2:
        this._sortField = "grades";
        break;
      case 3:
        this._sortField = "isInwar";
        break;
      case 4:
        this._sortField = "fightingCapacity";
        break;
    }
    this._isReverse = !this._isReverse;
    this.setListView();
  }

  private __addMemberHandler(): void {
    AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
    this._controller.openGvgMemberManagerII();
  }

  private __consortiaMemberHandler(): void {
    this.setListView();
    this.setTips();
  }

  protected __helpHandler(): void {
    AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
    let title: string = LangManager.Instance.GetTranslation(
      "friends.view.FriendsHelpFrame.title",
    );
    let count = 25;
    let cfg = TempleteManager.Instance.getConfigInfoByConfigName("GVG_People");
    if (cfg) {
      count = Number(cfg.ConfigValue);
    }
    let content: string = LangManager.Instance.GetTranslation(
      "consortia.GvgJionMemberHelpFrame.helpContent",
      count,
    );
    UIManager.Instance.ShowWind(EmWindow.Help, {
      title: title,
      content: content,
    });
  }

  private setTips(): void {
    let chairmanID: number =
      ConsortiaManager.Instance.model.consortiaInfo.chairmanID;
    let list: ThaneInfo[] = ConsortiaManager.Instance.model.getSortMemberList();
    this.txt_in.color = "#ff0100";
    this.txt_in.text =
      LangManager.Instance.GetTranslation("gvg.InwarTips") +
      LangManager.Instance.GetTranslation("gvg.NotinWarList");
    for (let i = 0, len = list.length; i < len; i++) {
      const info: ThaneInfo = list[i];
      if (
        info.userId == ArmyManager.Instance.thane.userId &&
        (info.isTeamPlayer || info.userId == chairmanID)
      ) {
        this.txt_in.color = "#FFECC6";
        this.txt_in.text =
          LangManager.Instance.GetTranslation("gvg.InwarTips") +
          LangManager.Instance.GetTranslation("gvg.InWarList");
        break;
      }
    }
  }

  private onListItemRender(index: number, item: GvgEnterWarItem) {
    item.info = this._memberList[index];
  }

  private __existConsortiaHandler(): void {
    if (this.playerInfo.consortiaID == 0) {
      this.hide();
    }
  }

  public OnHideWind() {
    super.OnHideWind();
    this.removeEvent();
  }

  private get playerInfo(): PlayerInfo {
    return PlayerManager.Instance.currentPlayerModel.playerInfo;
  }

  private removeEvent() {
    this.memberBtn.offClick(this, this.__onSortClick);
    this.lvBtn.offClick(this, this.__onSortClick);
    this.stateBtn.offClick(this, this.__onSortClick);
    this.powerBtn.offClick(this, this.__onSortClick);
    this.btn_addMember.offClick(this, this.__addMemberHandler);
    this.frame.btnHelp.offClick(this, this.__helpHandler);
    this.playerInfo.removeEventListener(
      PlayerEvent.CONSORTIA_CHANGE,
      this.__existConsortiaHandler,
      this,
    );
    ConsortiaManager.Instance.model.removeEventListener(
      ConsortiaEvent.UPDATA_CONSORTIA_MEMBER,
      this.__consortiaMemberHandler,
      this,
    );
  }

  dispose(dispose?: boolean) {
    this._controller = null;
    // this.list.itemRenderer.recover();
    Utils.clearGListHandle(this.list);

    super.dispose(dispose);
  }
}
