import BaseFguiCom from "../../../core/ui/Base/BaseFguiCom";
import { DateFormatter } from "../../../core/utils/DateFormatter";
import { GoldenSheepEvent } from "../../constant/event/NotificationEvent";
import GoldenSheepManager from "../../manager/GoldenSheepManager";
import ComponentSetting from "../../utils/ComponentSetting";
import GoldenSheepModel from "../goldensheep/GoldenSheepModel";

export default class GoldenSheepView extends BaseFguiCom {
  private goldenSheepBtn: any;
  private _model: GoldenSheepModel;
  private goldenSheepShine: fgui.Controller;
  private picIcon: fgui.GLoader;
  private leftTimeTxt: fgui.GTextField;
  private _leftTime: number = 0;
  private _parent: fairygui.GComponent;
  constructor(
    target: fgui.GComponent,
    target2: fgui.Controller,
    target3: fgui.GLoader,
    target4: fgui.GTextField,
    parent: fairygui.GComponent,
  ) {
    super(target);
    this._model = GoldenSheepManager.Instance.model;
    this.goldenSheepBtn = target as fgui.GButton;
    this.goldenSheepShine = target2 as fgui.Controller;
    this.picIcon = target3 as fgui.GLoader;
    this.leftTimeTxt = target4 as fgui.GTextField;
    this._parent = parent;
    this.init();
    this.refreshView();
  }

  init() {
    this.offEvent();
    this.addEvent();
  }

  private offEvent() {
    this.picIcon.offClick(this, this.__btnClickHandler);
    this._model.removeEventListener(
      GoldenSheepEvent.STATE_UPDATE,
      this.__stateUpdateHandler,
      this,
    );
  }

  private addEvent() {
    this.picIcon.onClick(this, this.__btnClickHandler);
    this._model.addEventListener(
      GoldenSheepEvent.STATE_UPDATE,
      this.__stateUpdateHandler,
      this,
    );
  }

  private __btnClickHandler() {
    if (ComponentSetting.GOLDEN_SHEEP && this._model.needShow) {
      this.goldenSheepShine.selectedIndex = 0;
      GoldenSheepManager.Instance.checkState();
    }
  }

  private __stateUpdateHandler() {
    this.refreshView();
  }

  private refreshView() {
    if (ComponentSetting.GOLDEN_SHEEP && this._model.needShow) {
      this.goldenSheepBtn.visible = true;
      this.goldenSheepBtn.mouseEnabled = true;
      this.visible = this._parent.visible = true;
    } else {
      this.goldenSheepBtn.visible = false;
      this.goldenSheepBtn.mouseEnabled = false;
      this.visible = this._parent.visible = false;
    }
    if (this._model.needShine) {
      this.goldenSheepShine.selectedIndex = 1;
      this.leftTimeTxt.visible = false;
    } else {
      this.goldenSheepShine.selectedIndex = 0;
      this.leftTimeTxt.visible = true;
    }
    this._leftTime = this._model.nextTime;
    if (this._leftTime > 0) {
      this.leftTimeTxt.text = DateFormatter.getSevenDateString(this._leftTime);
      Laya.timer.loop(1000, this, this.updateLeftTimeHandler);
    }
  }

  private updateLeftTimeHandler() {
    this.leftTimeTxt.text = DateFormatter.getSevenDateString(this._leftTime);
    this._leftTime--;
    if (this._leftTime <= 0) {
      Laya.timer.clear(this, this.updateLeftTimeHandler);
      this.leftTimeTxt.text = "";
    }
  }

  public dispose() {
    this.offEvent();
    Laya.timer.clearAll(this);
    super.dispose();
  }
}
