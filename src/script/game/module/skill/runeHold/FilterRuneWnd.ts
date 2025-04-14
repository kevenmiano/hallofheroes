import LangManager from "../../../../core/lang/LangManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import UIButton from "../../../../core/ui/UIButton";
import { EmWindow } from "../../../constant/UIDefine";
import { RuneEvent } from "../../../constant/event/NotificationEvent";
import { NotificationManager } from "../../../manager/NotificationManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";

import SkillWndData from "../SkillWndData";

export class FilterRuneWnd extends BaseWindow {
  //品质
  public qBtn1: fgui.GButton;
  public qBtn2: fgui.GButton;
  public qBtn3: fgui.GButton;
  public qBtn4: fgui.GButton;
  public qBtn5: fgui.GButton;

  //属性
  public sBtn1: fgui.GButton;
  public sBtn2: fgui.GButton;
  public sBtn3: fgui.GButton;
  public sBtn4: fgui.GButton;
  public sBtn5: fgui.GButton;
  public sBtn6: fgui.GButton;
  public sBtn7: fgui.GButton;
  public btn_clear: fgui.GButton;

  /**确认按钮 */
  private btn_confirm: UIButton;
  /**取消按钮 */
  private btn_cancel: UIButton;

  private qualityBtns: fgui.GButton[];

  private statsBtns: fgui.GButton[];

  private filterProfile: number[];

  private filterAttributes: number[];

  private isResolve: boolean = false;

  /**1 符石背包, 2 符孔符石**/
  private filterType = 1;

  private frame: fairygui.GComponent;

  public OnInitWind() {
    super.OnInitWind();
    this.filterType = this.params.filterType;
    this.isResolve = this.params.isResolve;
    if (this.isResolve) {
      this.frame.getChild("title").asCom.text =
        LangManager.Instance.GetTranslation("runeGem.str4");
    }
    this.qualityBtns = [
      this.qBtn1,
      this.qBtn2,
      this.qBtn3,
      this.qBtn4,
      this.qBtn5,
    ];
    this.statsBtns = [
      this.sBtn1,
      this.sBtn2,
      this.sBtn3,
      this.sBtn4,
      this.sBtn5,
      this.sBtn6,
      this.sBtn7,
    ];
    this.setCenter();
  }

  OnShowWind() {
    super.OnShowWind();
    this.init();
  }

  private init() {
    let skillModel = this.skillWndData;
    if (this.isResolve) {
      this.filterProfile = skillModel.runeProfileFilter2;
      this.filterAttributes = skillModel.runeAttributeFilter2;
    } else {
      this.filterProfile =
        this.filterType == 1
          ? skillModel.runeProfileFilter
          : skillModel.runeHoldProfileFilter;
      this.filterAttributes =
        this.filterType == 1
          ? skillModel.runeAttributeFilter
          : skillModel.runeHoldAttributeFilter;
    }

    let i = 0;
    for (let item of this.qualityBtns) {
      item.selected = !!this.filterProfile[i];
      i++;
    }

    i = 0;
    for (let item of this.statsBtns) {
      item.selected = !!this.filterAttributes[i];
      i++;
    }
    this.btn_confirm.onClick(this, this.onOkClick);
    this.btn_cancel.onClick(this, this.onCancelClick);
    this.btn_clear.onClick(this, this.onClear);
  }

  private onOkClick() {
    this.save();
    this.hide();
    this.skillWndData.dispatchEvent(
      this.isResolve
        ? SkillWndData.CHAMGE_RUNE_FILTER
        : SkillWndData.CHAMGE_HOLD_FILTER,
    );
  }

  private save() {
    let i = 0;
    for (let item of this.qualityBtns) {
      this.filterProfile[i] = +item.selected;
      i++;
    }

    i = 0;
    for (let item of this.statsBtns) {
      this.filterAttributes[i] = +item.selected;
      i++;
    }
  }

  private onCancelClick() {
    this.hide();
    // if(this.isResolve){
    //     NotificationManager.Instance.dispatchEvent(RuneEvent.CANCEL_RESOLOVE);
    // }
  }

  private onClear() {
    let i = 0;
    for (let item of this.qualityBtns) {
      item.selected = false;
      i++;
    }

    i = 0;
    for (let item of this.statsBtns) {
      item.selected = false;
      i++;
    }
  }

  public get skillWndData() {
    return FrameCtrlManager.Instance.getCtrl(EmWindow.Skill)
      .data as SkillWndData;
  }
}
