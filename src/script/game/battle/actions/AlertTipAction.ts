import { MapBaseAction } from "./MapBaseAction";

export class AlertTipAction extends MapBaseAction {
  private _callBack: Function;
  private _result: object;
  private _scene: string;
  private _callBackTarget: any;

  constructor(
    $result: object,
    $callBack: Function,
    scene: string = "",
    $level: number = 0,
    callBackTarget?: any,
  ) {
    super();

    this.level = $level;
    this._scene = scene;
    this._result = $result;
    this._callBack = $callBack;
    this._callBackTarget = callBackTarget;
  }

  public update() {
    if (this._callBack != null) {
      if (this._callBackTarget)
        this._callBack.call(this._callBackTarget, this._result);
      else this._callBack(this._result);
    }
    this.actionOver();
    this._callBack = null;
    this._result = null;
  }

  public get scene(): string {
    return this._scene;
  }
}
