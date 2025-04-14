//@ts-expect-error: External dependencies
import FUI_GvgEnterWarItem from "../../../../../../fui/Consortia/FUI_GvgEnterWarItem";
import AudioManager from "../../../../../core/audio/AudioManager";
import LangManager from "../../../../../core/lang/LangManager";
import { ConsortiaEvent } from "../../../../constant/event/NotificationEvent";
import { SoundIds } from "../../../../constant/SoundIds";
import { EmWindow } from "../../../../constant/UIDefine";
import { ThaneInfo } from "../../../../datas/playerinfo/ThaneInfo";
import { ConsortiaManager } from "../../../../manager/ConsortiaManager";
import { FrameCtrlManager } from "../../../../mvc/FrameCtrlManager";
import { GvgReadyController } from "../../control/GvgReadyController";
import { GvgTeamEditType } from "../../data/gvg/GvgTeamEditType";
import { JobType } from "../../../../constant/JobType";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/10/22 12:15
 * @ver 1.0
 */
export class GvgEnterWarItem extends FUI_GvgEnterWarItem {
  private _info: ThaneInfo;
  private _controller: GvgReadyController;

  constructor() {
    super();
  }

  protected onConstruct() {
    super.onConstruct();
    this._controller = FrameCtrlManager.Instance.getCtrl(
      EmWindow.GvgRankListWnd,
    ) as GvgReadyController;
    this._captionIcon.visible = false;
    this.addEvent();
  }

  private addEvent(): void {
    this._delBtn.onClick(this, this.onDelBtnClick);
    this._info &&
      this._info.addEventListener(
        ConsortiaEvent.UPDE_MEMEBER_STATE,
        this.__memberStateChangeHandler,
        this,
      );
  }

  private removeEvent(): void {
    this._delBtn.offClick(this, this.onDelBtnClick);
    this._info &&
      this._info.removeEventListener(
        ConsortiaEvent.UPDE_MEMEBER_STATE,
        this.__memberStateChangeHandler,
        this,
      );
  }

  private onDelBtnClick(): void {
    AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
    this._controller.model.selectMember = null;
    this._controller.sendGvgTeamEdit(
      this._info.userId,
      GvgTeamEditType.REMOVE_TEAM,
      GvgTeamEditType.CANNEL_MANAGER,
    );
    // e.stopImmediatePropagation();
  }

  private __memberStateChangeHandler(): void {
    if (this._info) {
      this.state.selectedIndex = this._info.isOnline ? 0 : 1;
    }
  }

  get info(): ThaneInfo {
    return this._info;
  }

  set info(value: ThaneInfo) {
    this._info = value;

    if (this._info) {
      this._captionIcon.visible =
        this._info.dutyId == 1 || this._info.dutyId == 2;
      this._jobIcon.icon = JobType.getJobIcon(this._info.job);
      this._vipIcon.visible = this.isVip;
      this.txt_name.text = this._info.nickName;
      this.txt_lv.text = String(this._info.grades);
      this.txt_state.text =
        this._info.isInwar == 0
          ? "—"
          : LangManager.Instance.GetTranslation("gvg.view.EnterWarrightitem");
      this.txt_power.text = String(this._info.fightingCapacity);
      let chairmanID: number =
        ConsortiaManager.Instance.model.consortiaInfo.chairmanID;
      this._delBtn.visible =
        this._info.userId != chairmanID &&
        this._controller.model.isFightManager;
      this.state.selectedIndex = this._info.isOnline ? 0 : 1;
      // this._info.vipType == 1? this._vipIcon.setFrame(1):this._vipIcon.setFrame(2);
    }
  }

  private get isVip(): boolean {
    return this._info.IsVipAndNoExpirt;
  }

  dispose() {
    this._controller = null;
    this.removeEvent();
    super.dispose();
  }
}
