//@ts-expect-error: External dependencies
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { GuildGroupIndex } from "../data/gvg/GuildGroupIndex";
import { PlayerEvent } from "../../../constant/event/PlayerEvent";
import { GvgReadyController } from "../control/GvgReadyController";
import FUI_Dialog2 from "../../../../../fui/Base/FUI_Dialog2";
import { PlayerInfo } from "../../../datas/playerinfo/PlayerInfo";
import { PlayerManager } from "../../../manager/PlayerManager";
import AudioManager from "../../../../core/audio/AudioManager";
import { SoundIds } from "../../../constant/SoundIds";
import { GuildGroupInfo } from "../data/gvg/GuildGroupInfo";
import { VSTeamItem } from "./component/VSTeamItem";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import LangManager from "../../../../core/lang/LangManager";
import { GvgEvent } from "../../../constant/event/NotificationEvent";
import UIManager from "../../../../core/ui/UIManager";
import { EmWindow } from "../../../constant/UIDefine";
import { WorldBossHelper } from "../../../utils/WorldBossHelper";
import StringHelper from "../../../../core/utils/StringHelper";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import Utils from "../../../../core/utils/Utils";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/10/20 10:50
 * @ver 1.0
 */
export class GvgRankListWnd extends BaseWindow {
  public c1: fgui.Controller;
  public c2: fgui.Controller;
  public frame: FUI_Dialog2;
  public tab_monDay: fgui.GButton;
  public tab_wednesDay: fgui.GButton;
  public tab_friDay: fgui.GButton;
  public btn_rank: fgui.GButton;
  public btn_joinMember: fgui.GButton;
  public btn_enterBattle: fgui.GButton;
  public list: fgui.GList;

  private _curDay: number = 1;
  private _controller: GvgReadyController;
  private _teamInfos: any[];

  constructor() {
    super();
  }

  public OnInitWind() {
    super.OnInitWind();
    this.initData();
    this.initEvent();
    this.initView();
    this._controller.requestGuildGroup();

    this.setCenter();
  }

  private initData() {
    this._controller = FrameCtrlManager.Instance.getCtrl(
      EmWindow.GvgRankListWnd,
    ) as GvgReadyController;
    this.c1 = this.getController("c1");
    this.c2 = this.getController("c2");
  }

  private initEvent() {
    this.c1.on(fgui.Events.STATE_CHANGED, this, this.__groupHandler);
    this.btn_rank.onClick(this, this.__rankHandler);
    this.btn_joinMember.onClick(this, this.__joinMemhandler);
    this.frame.helpBtn.onClick(this, this.__helpHandler);
    this.btn_enterBattle.onClick(this, this.__enterBattlerhandler);
    this.playerInfo.addEventListener(
      PlayerEvent.CONSORTIA_CHANGE,
      this.__existConsortiaHandler,
      this,
    );
    this._controller.model.addEventListener(
      GvgEvent.UPDATE_GUILD_GROUP,
      this.__updateGuildGroupHandler,
      this,
    );
    this._controller.model.addEventListener(
      GvgEvent.UPDATE_GUILD_ORDER_GROUP,
      this.__updateGuildOrderGroupHandler,
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
    // this.refreshView();
  }

  public OnShowWind() {
    super.OnShowWind();
  }

  private __updateGuildGroupHandler(): void {
    if (!this._controller.model.gvgScheduling) {
      this.c2.selectedIndex = 1;
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("GvgRankListFrame.noDate"),
      ); //"本轮公会战暂未排期"
    } else if (!this._controller.model.isFightMember) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "GvgRankListFrame.noQualifications",
        ),
      ); //"您的公会本周没有获得参与公会战资格"
    }
    this.refreshView();
  }

  private __updateGuildOrderGroupHandler(): void {
    this.btn_rank.enabled = this._controller.model.hasGuildOrder;
  }

  private onListItemRender(index: number, item: VSTeamItem) {
    item.info = this._teamInfos[index];
    item.setBg(index);
  }

  protected __groupHandler(cc: fgui.Controller): void {
    AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
    switch (cc.selectedIndex) {
      case 0:
        this._curDay = GuildGroupIndex.group1;
        break;
      case 1:
        this._curDay = GuildGroupIndex.group2;
        break;
      case 2:
        this._curDay = GuildGroupIndex.group3;
        break;
    }
    this.refreshView();
  }

  private refreshView(): void {
    let arr: GuildGroupInfo[] = this._controller.model.getGroupByIndex(
      this._curDay,
    );
    if (!arr) {
      return;
    }
    let count: number = arr.length;
    count = Math.ceil(count / 2);
    this._teamInfos = [];
    for (let k: number = 0; k < count; k++) {
      //要对名次先进行调整
      let info: any = {
        team01: arr[k * 2],
        team02: arr[k * 2 + 1],
        index: k,
        day: this._curDay,
      };
      this._teamInfos.push(info);
    }

    for (let n: number = this._teamInfos.length - 1; n >= 0; n--) {
      let info: any = this._teamInfos[n];
      if (info.team01.consortiaName == "" && info.team02.consortiaName == "") {
        this._teamInfos.splice(n, 1);
        this._teamInfos.push(info);
      }
    }
    this.list.numItems = this._teamInfos.length;

    this.refreshButtons();
    if (!this.isInit) {
      this.initButtonState();
    }
  }

  private refreshButtons(): void {
    this.tab_monDay.enabled = false;
    this.tab_wednesDay.enabled = false;
    this.tab_friDay.enabled = false;
    let btnArr: any[] = [this.tab_monDay, this.tab_wednesDay, this.tab_friDay];

    let startGroups: number[] = this._controller.model.getStartGroups();
    let i: number = 0;
    for (let j = 0, len = startGroups.length; j < len; j++) {
      const isStart = startGroups[j];
      if (isStart) {
        btnArr[i].enabled = true;
      } else {
        btnArr[i].enabled = false;
      }
      i++;
    }

    let isMember: boolean = this._controller.model.isFightMember;
    this.btn_enterBattle.enabled = isMember;
    this.btn_joinMember.enabled = true;
  }

  private isInit: boolean = false;

  private initButtonState(): void {
    this.isInit = true;
    let index: number = this._controller.model.isStartGroup;
    switch (index) {
      case GuildGroupIndex.group1:
        this.c1.selectedIndex = 0;
        break;
      case GuildGroupIndex.group2:
        this.c1.selectedIndex = 1;
        break;
      case GuildGroupIndex.group3:
        this.c1.selectedIndex = 2;
        break;
    }
  }

  private get playerInfo(): PlayerInfo {
    return PlayerManager.Instance.currentPlayerModel.playerInfo;
  }

  private __rankHandler() {
    UIManager.Instance.ShowWind(EmWindow.ConsortiaRankWnd);
  }

  protected __joinMemhandler(): void {
    AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
    this._controller.openGvgMemberManager();
  }

  private __helpHandler() {
    AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
    let titleStr = "public.help";
    let tipStr = "consortia.GvgGameListHelpFrame.helpContent";
    let count = 25;
    let cfg = TempleteManager.Instance.getConfigInfoByConfigName("GVG_People");
    if (cfg) {
      count = Number(cfg.ConfigValue);
    }
    let title: string = LangManager.Instance.GetTranslation(titleStr);
    let content: string = LangManager.Instance.GetTranslation(tipStr, count);
    UIManager.Instance.ShowWind(EmWindow.Help, {
      title: title,
      content: content,
    });
  }

  protected __enterBattlerhandler(event: MouseEvent): void {
    AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
    if (this.checkScene()) {
      this._controller.enterGvgWarMap();
    }
  }

  /**
   * 场景检测 是否能在当前场景进行的操作
   * @return 能返回true 否则返回false
   *
   */
  private checkScene(): boolean {
    let tipStr: string = WorldBossHelper.getCampaignTips();
    if (StringHelper.isNullOrEmpty(tipStr)) {
      return true;
    } else {
      MessageTipManager.Instance.show(tipStr);
      return false;
    }
  }

  private __existConsortiaHandler(evt: PlayerEvent): void {
    if (this.playerInfo.consortiaID == 0) {
      this.hide();
    }
  }

  public OnHideWind() {
    super.OnHideWind();
    this.removeEvent();
  }

  private removeEvent() {
    this.c1.off(fgui.Events.STATE_CHANGED, this, this.__groupHandler);
    this.btn_rank.offClick(this, this.__rankHandler);
    this.btn_joinMember.offClick(this, this.__joinMemhandler);
    this.frame.helpBtn.offClick(this, this.__helpHandler);
    this.btn_enterBattle.offClick(this, this.__enterBattlerhandler);
    this.playerInfo.removeEventListener(
      PlayerEvent.CONSORTIA_CHANGE,
      this.__existConsortiaHandler,
      this,
    );
    this._controller.model.removeEventListener(
      GvgEvent.UPDATE_GUILD_GROUP,
      this.__updateGuildGroupHandler,
      this,
    );
    this._controller.model.removeEventListener(
      GvgEvent.UPDATE_GUILD_ORDER_GROUP,
      this.__updateGuildOrderGroupHandler,
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
