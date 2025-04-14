import BaseWindow from "../../../core/ui/Base/BaseWindow";
import SDKManager from "../../../core/sdk/SDKManager";
import { PlayerManager } from "../../manager/PlayerManager";
import LTextInput from "../../component/laya/LTextInput";

/**
 * @description iOS app评价   调用方法: FrameCtrlManager.Instance.open(EmWindow.EvaluationWnd);
 * @author yuanzhan.yu
 * @date 2022/11/4 16:52
 * @ver 1.0
 */
export class EvaluationWnd extends BaseWindow {
  public star: fgui.Controller;
  public appIcon: fgui.GLoader;
  public bttn_later: fgui.GButton;
  public bttn_cancel: fgui.GButton;
  public bttn_submit: fgui.GButton;
  public wordsTitle: fgui.GTextField;
  public contentmask: fgui.GComponent;
  private content: LTextInput;
  private wordsCount: number = 0;
  private maxCount: number = 50;

  constructor() {
    super();
  }

  public OnInitWind() {
    super.OnInitWind();
    this.setCenter();
    this.initData();
    this.initView();
    this.initEvent();
  }

  private initData() {}

  private initView() {
    this.wordsCount = 0;
    this.star = this.getController("star");
    this.star.selectedIndex = 0;
    this.wordsTitle.setVar("cur", this.wordsCount.toString()).flushVars();
    this.wordsTitle.setVar("max", this.maxCount.toString()).flushVars();
    this.content = LTextInput.create(
      this,
      "",
      18,
      "#000000",
      this.contentmask.width,
      this.contentmask.height,
      this.contentmask.x,
      this.contentmask.y,
      5,
    );
    this.content.text = "";
  }

  private initEvent() {
    this.bttn_later.onClick(this, this.onBtnLaterClick);
    this.bttn_cancel.onClick(this, this.onBtnCancelClick);
    this.bttn_submit.onClick(this, this.onBtnSubmitClick);
    this.content.on(Laya.Event.INPUT, this, this.__onTxtChange);
    this.star.on(fgui.Events.STATE_CHANGED, this, this.onStateChange);
  }

  private _txtChange: string = "";

  private __onTxtChange(evt: Event) {
    let contentWords: string = this.content.text;
    var vStr: string = contentWords.replace(/(^\s*)|(\s*$)/g, "");
    this.wordsCount = vStr.length;
    if (this.wordsCount > this.maxCount) {
      this.content.text = this._txtChange;
      return;
    }
    this.wordsTitle.setVar("cur", this.wordsCount.toString()).flushVars();
    this._txtChange = vStr;
  }

  public OnShowWind() {
    super.OnShowWind();
  }

  private onBtnLaterClick(e: Laya.Event) {
    this.hide();
  }

  private onBtnCancelClick(e: Laya.Event) {
    this.hide();
  }

  private onStateChange(cc: fgui.Controller) {
    this.content.visible = cc.selectedIndex < 5;
  }

  private onBtnSubmitClick(e: Laya.Event) {
    if (this.star.selectedIndex < 5) {
      let comment: string = this.content.text;
      PlayerManager.Instance.ratingStoreReport(
        this.star.selectedIndex,
        comment,
      );
    } else {
      PlayerManager.Instance.ratingStoreReport(this.star.selectedIndex);
      SDKManager.Instance.getChannel().evaluateOnAppStore();
    }
    this.hide();
  }

  private removeEvent() {
    this.bttn_later.offClick(this, this.onBtnLaterClick);
    this.bttn_cancel.offClick(this, this.onBtnCancelClick);
    this.bttn_submit.offClick(this, this.onBtnSubmitClick);
    this.content.off(Laya.Event.INPUT, this, this.__onTxtChange);
    this.star.off(fgui.Events.STATE_CHANGED, this, this.onStateChange);
  }

  public OnHideWind() {
    super.OnHideWind();
    this.removeEvent();
    PlayerManager.Instance.clearScoreRating();
  }

  dispose(dispose?: boolean) {
    super.dispose(dispose);
  }
}
