import BaseWindow from "../../../core/ui/Base/BaseWindow";
import { GoldenSheepEvent } from "../../constant/event/NotificationEvent";
import GoldenSheepManager from "../../manager/GoldenSheepManager";
import GoldenSheepModel from "./GoldenSheepModel";

export default class GoldenSheepBoxWnd extends BaseWindow {
  private _model: GoldenSheepModel;
  public openRedBtn: fgui.GButton;
  public OnInitWind() {
    this._model = GoldenSheepManager.Instance.model;
    this.addEvent();
    this.setCenter();
  }

  OnShowWind() {
    super.OnShowWind();
  }

  private addEvent() {
    this._model.addEventListener(
      GoldenSheepEvent.STATE_UPDATE,
      this.stateUpdateHandler,
      this,
    );
  }

  private removeEvent() {
    this._model.removeEventListener(
      GoldenSheepEvent.STATE_UPDATE,
      this.stateUpdateHandler,
      this,
    );
  }

  private openRedBtnClick() {
    GoldenSheepManager.Instance.openBox();
    this.OnHideWind();
  }

  private stateUpdateHandler() {
    if (!this._model.needShow) {
      this.OnHideWind();
    }
  }

  OnHideWind() {
    super.OnHideWind();
    this.removeEvent();
    super.dispose();
  }
}
