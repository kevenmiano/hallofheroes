//@ts-expect-error: External dependencies
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { EmWindow } from "../../../constant/UIDefine";
import { GvgReadyController } from "../control/GvgReadyController";
import { PlayerEvent } from "../../../constant/event/PlayerEvent";
import { ConsortiaManager } from "../../../manager/ConsortiaManager";
import { ConsortiaEvent } from "../../../constant/event/NotificationEvent";
import { PlayerInfo } from "../../../datas/playerinfo/PlayerInfo";
import { PlayerManager } from "../../../manager/PlayerManager";
import FUI_Dialog2 from "../../../../../fui/Base/FUI_Dialog2";
import AudioManager from "../../../../core/audio/AudioManager";
import { SoundIds } from "../../../constant/SoundIds";
import LangManager from "../../../../core/lang/LangManager";
import UIManager from "../../../../core/ui/UIManager";
import { ThaneInfo } from "../../../datas/playerinfo/ThaneInfo";
import { GvgAddMembersItem } from "./component/GvgAddMembersItem";
import { GvgEnterWarItem } from "./component/GvgEnterWarItem";
import { TempleteManager } from "../../../manager/TempleteManager";
import Utils from "../../../../core/utils/Utils";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/10/22 16:32
 * @ver 1.0
 */
export class GvgAddMembersWnd extends BaseWindow {
  public frame: FUI_Dialog2;
  public btn_member_0: fgui.GButton;
  public btn_lv_0: fgui.GButton;
  public btn_power_0: fgui.GButton;
  public btn_member_1: fgui.GButton;
  public btn_lv_1: fgui.GButton;
  public btn_state_1: fgui.GButton;
  public btn_power_1: fgui.GButton;
  public list_0: fgui.GList;
  public list_1: fgui.GList;
  public txt_search: fgui.GTextInput;
  public txt_memberNum: fgui.GTextField;
  public txt_num: fgui.GTextField;

  private _controller: GvgReadyController;
  private _sortField: string = "fightingCapacity";
  private _isReverse: boolean = true;
  private _memberList1: ThaneInfo[];
  private _memberList2: ThaneInfo[];

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
    this.btn_member_0.onClick(this, this.__onSortClick, [1]);
    this.btn_lv_0.onClick(this, this.__onSortClick, [2]);
    this.btn_power_0.onClick(this, this.__onSortClick, [3]);

    this.btn_member_1.onClick(this, this.__onSortClick, [4]);
    this.btn_lv_1.onClick(this, this.__onSortClick, [5]);
    this.btn_state_1.onClick(this, this.__onSortClick, [6]);
    this.btn_power_1.onClick(this, this.__onSortClick, [7]);

    this.frame.helpBtn.onClick(this, this.__helpHandler);
    this.txt_search.on(Laya.Event.INPUT, this, this.onSearch);
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
    this.list_0.itemRenderer = Laya.Handler.create(
      this,
      this.onListItemRender1,
      null,
      false,
    );
    this.list_1.itemRenderer = Laya.Handler.create(
      this,
      this.onListItemRender2,
      null,
      false,
    );
    this.list_0.setVirtual();
    this.list_1.setVirtual();

    this.setListView1();
    this.setListView2();
  }

  public OnShowWind() {
    super.OnShowWind();
  }

  private onListItemRender1(index: number, item: GvgAddMembersItem) {
    item.info = this._memberList1[index];
  }

  private onListItemRender2(index: number, item: GvgEnterWarItem) {
    item.info = this._memberList2[index];
  }

  private setListView1() {
    this._memberList1 = ConsortiaManager.Instance.model.getSortMemberList(
      this._sortField,
      this._isReverse,
    );
    this._memberList1 = this._memberList1.filter((value, index, array) => {
      return value.nickName.indexOf(this.txt_search.text) != -1;
    });
    this.txt_memberNum.text = this._memberList1.length + "";
    this.list_0.numItems = this._memberList1.length;
  }

  private setListView2() {
    let chairmanID: number =
      ConsortiaManager.Instance.model.consortiaInfo.chairmanID;
    this._memberList2 = [];
    let list = ConsortiaManager.Instance.model.getSortMemberList(
      this._sortField,
      this._isReverse,
    );
    for (let j = 0, len = list.length; j < len; j++) {
      const info = list[j];
      if (!info.isTeamPlayer && info.userId != chairmanID) {
        continue;
      }
      this._memberList2.push(info);
    }
    let count = 25;
    let cfg = TempleteManager.Instance.getConfigInfoByConfigName("GVG_People");
    if (cfg) {
      count = Number(cfg.ConfigValue);
    }
    this.txt_num.text = this._memberList2.length + " / " + count.toString();
    this.list_1.numItems = this._memberList2.length;
  }

  private onSearch(e: Laya.Event = null) {
    this.setListView1();
  }

  private __onSortClick(type: number): void {
    AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
    this._isReverse = !this._isReverse;
    switch (type) {
      case 1:
        this._sortField = "nickName";
        this.setListView1();
        break;
      case 2:
        this._sortField = "grades";
        this.setListView1();
        break;
      case 3:
        this._sortField = "fightingCapacity";
        this.setListView1();
        break;
      case 4:
        this._sortField = "nickName";
        this.setListView2();
        break;
      case 5:
        this._sortField = "grades";
        this.setListView2();
        break;
      case 6:
        this._sortField = "isInwar";
        this.setListView2();
        break;
      case 7:
        this._sortField = "fightingCapacity";
        this.setListView2();
        break;
    }
  }

  private __consortiaMemberHandler(): void {
    this.setListView1();
    this.setListView2();
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

  protected __helpHandler(): void {
    AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
    let titleStr = "friends.view.FriendsHelpFrame.title";
    let tipStr = "consortia.GvgJionMemberHelpFrame.helpContent";
    let title: string = LangManager.Instance.GetTranslation(titleStr);
    let content: string = LangManager.Instance.GetTranslation(tipStr);
    UIManager.Instance.ShowWind(EmWindow.Help, {
      title: title,
      content: content,
    });
  }

  private removeEvent() {
    this.btn_member_0.offClick(this, this.__onSortClick);
    this.btn_lv_0.offClick(this, this.__onSortClick);
    this.btn_power_0.offClick(this, this.__onSortClick);

    this.btn_member_1.offClick(this, this.__onSortClick);
    this.btn_lv_1.offClick(this, this.__onSortClick);
    this.btn_state_1.offClick(this, this.__onSortClick);
    this.btn_power_1.offClick(this, this.__onSortClick);

    this.frame.helpBtn.offClick(this, this.__helpHandler);
    this.txt_search.off(Laya.Event.INPUT, this, this.onSearch);
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
    // this.list_0.itemRenderer.recover();
    // this.list_1.itemRenderer.recover();

    Utils.clearGListHandle(this.list_0);
    Utils.clearGListHandle(this.list_1);

    super.dispose(dispose);
  }
}
