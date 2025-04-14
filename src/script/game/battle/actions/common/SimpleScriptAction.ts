/**
 * @author:jeremy.xu
 * @data: 2020-11-30 15:00
 * @description  简单的可在外部设置prepare,update方法的动作.
 **/
import { InheritIActionType } from "../../../constant/BattleDefine";
import { GameBaseAction } from "../GameBaseAction";

export class SimpleScriptAction extends GameBaseAction {
  public inheritType: InheritIActionType =
    InheritIActionType.SimpleScriptAction;

  public onPrepare: Function;
  public onUpdate: Function;
  public frameCount: number = 0;
  private _finishFun: Function;
  private _autoFinishNum: number = 0;

  constructor(
    liftTime: number = 0,
    finishFun: Function = null,
    autoFinishNum: number = -1,
  ) {
    super();
    this._liftTime = liftTime;
    this._finishFun = finishFun;
    this._autoFinishNum = autoFinishNum;
  }
  public prepare() {
    if (this.onPrepare != null) {
      this.onPrepare();
    }
  }
  public update() {
    this.frameCount++;
    if (this.onUpdate != null) {
      this.onUpdate();
    }
    if (this._autoFinishNum > 0) {
      if (this.frameCount >= this._autoFinishNum) {
        this.finish();
      }
    }
  }
  public finish() {
    this.finished = true;
    this._finishFun && this._finishFun();
  }

  public dispose() {
    this.onPrepare = null;
    this.onUpdate = null;
    this._finishFun = null;
    super.dispose();
  }
}
