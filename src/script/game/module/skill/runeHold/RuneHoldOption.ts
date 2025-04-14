import FUI_RuneHoldOption from "../../../../../fui/Skill/FUI_RuneHoldOption";
import UIManager from "../../../../core/ui/UIManager";
import { EmWindow } from "../../../constant/UIDefine";
import { RuneEvent } from "../../../constant/event/NotificationEvent";
import { RuneHoleInfo } from "../../../datas/RuneHoleInfo";
import { NotificationManager } from "../../../manager/NotificationManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { HoldEffectOptionlCom } from "./HoldEffectOptionlCom";
import { HoldOptionCom } from "./HoldOptionCom";
import { HoldValueOptionCom } from "./HoldValueOptionCom";
import { RuneOptionCom } from "./RuneOptionCom";

export class RuneHoldOption extends FUI_RuneHoldOption {
  declare public hoc: HoldOptionCom;
  declare public hvoc: HoldValueOptionCom;
  declare public roc: RuneOptionCom;
  declare public heoc: HoldEffectOptionlCom;

  //符孔
  private _info: RuneHoleInfo;
  //符石位
  private _runePos = 0;

  onConstruct() {
    super.onConstruct();
    this.roc.btn_getGem.onClick(this, this.onGetGem);
    this.hoc.moreBg.onClick(this, this.onGetGem);
  }

  public set info(info: RuneHoleInfo) {
    this._info = info;
    this.showHoleInfo();
  }

  public get info() {
    return this._info;
  }

  public showHoleInfo() {
    this.hideAll();
    this.hoc.visible = true;
    this.backBtn.visible = false;
    this.updateView();
  }

  public showRune(pos: number) {
    this._runePos = pos;
    this.hideAll();
    this.roc.visible = true;
    this.updateView();
  }

  public showValue() {
    this.hideAll();
    this.hvoc.visible = true;
    this.updateView();
  }

  public showEffect() {
    this.hideAll();
    this.heoc.visible = true;
    this.updateView();
  }

  public updateView() {
    if (!this._info) return;
    this.hoc.updateView(this._info);
    this.roc.updateView(this._info, this._runePos);
    this.hvoc.updateView(this._info);
    this.heoc.updateView(this._info);
  }

  public hideAll() {
    this.hoc.visible = false;
    this.hvoc.visible = false;
    this.roc.visible = false;
    this.heoc.visible = false;
    this.backBtn.visible = true;
  }

  private onGetGem() {
    UIManager.Instance.ShowWind(EmWindow.RuneGemWnd);
    NotificationManager.Instance.addEventListener(
      RuneEvent.CLOSE_GEM,
      this.showView,
      this,
    );
    this.parent.visible = false;
  }

  private showView() {
    this.parent.visible = true;
    NotificationManager.Instance.removeEventListener(
      RuneEvent.CLOSE_GEM,
      this.showView,
      this,
    );
  }

  public updateRuneReddot() {
    let state =
      PlayerManager.Instance.currentPlayerModel.playerInfo.runePowerPoint >=
      100;
    this.hoc.moreBg.getChild("redDot").visible = state;
    this.roc.btn_getGem.getChild("redDot").visible = state;
  }
}
