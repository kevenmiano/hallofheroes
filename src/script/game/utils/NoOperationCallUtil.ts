import { StageReferance } from "../roadComponent/pickgliss/toplevel/StageReferance";
import { TimerEvent } from "./TimerTicker";

export default class NoOperationCallUtil {
  private _time: number = 0; //无操作时间（毫秒）
  private _noOperationCall: Function; //无操作回调
  private _activeCall: Function; //激活回调
  private _isNeedActive: boolean = false; //是否需要激活

  public constructor(
    time: number,
    noOperationCall: Function,
    activeCall: Function
  ) {
    this._time = time;
    this._noOperationCall = noOperationCall;
    this._activeCall = activeCall;
    Laya.timer.once(this._time, this, this.__timeUpHandler);
    this.addEvent();
  }

  private addEvent() {
    StageReferance.stage.on(
      Laya.Event.MOUSE_MOVE,
      this,
      this.__mouseMoveHandler
    );
    StageReferance.stage.on(Laya.Event.KEY_DOWN, this, this.__keyDownHandler);
  }

  private removeEvent() {
    StageReferance.stage.off(
      Laya.Event.MOUSE_MOVE,
      this,
      this.__mouseMoveHandler
    );
    StageReferance.stage.off(Laya.Event.KEY_DOWN, this, this.__keyDownHandler);
  }

  private __timeUpHandler(e: TimerEvent) {
    if (this._noOperationCall != null) {
      this._noOperationCall();
      this._isNeedActive = true;
    }
  }

  private __mouseMoveHandler(e: Laya.Event) {
    this.reset();
  }

  private __keyDownHandler(e: KeyboardEvent) {
    this.reset();
  }

  private reset() {
    if (this._isNeedActive && this._activeCall != null) {
      this._activeCall();
      this._isNeedActive = false;
    }
    this.resetTimeOut();
  }

  private resetTimeOut() {
    Laya.timer.clear(this, this.__timeUpHandler);
    Laya.timer.once(this._time, this, this.__timeUpHandler);
  }

  public dispose() {
    this.removeEvent();
    Laya.timer.clear(this, this.__timeUpHandler);
    this._noOperationCall = null;
    this._activeCall = null;
  }
}
