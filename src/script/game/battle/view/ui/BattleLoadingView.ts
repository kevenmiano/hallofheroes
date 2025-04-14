//@ts-expect-error: External dependencies
import Logger from "../../../../core/logger/Logger";
import LoadingSceneWnd from "../../../module/loading/LoadingSceneWnd";
import { BattleManager } from "../../BattleManager";
import { BattleModel } from "../../BattleModel";
/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/1/11 11:21
 * @ver 1.0
 */
export class BattleLoadingView extends Laya.Sprite {
  private _num: number = 0;
  private _showing: boolean;

  public show() {
    LoadingSceneWnd.Instance.Show();
  }

  public hide() {
    this._showing = false;
    this._num = 0;
    LoadingSceneWnd.Instance.Hide();
    this.event(Laya.Event.CLOSE);
  }

  public update(value: number, curStr: string = "") {
    LoadingSceneWnd.Instance.update(value, curStr, true);
  }

  public startShowLoad(callback: Function) {
    this._callback = callback;
    Laya.timer.frameLoop(1, this, this.__enterFrame);
  }

  private _callback: Function;

  private __enterFrame() {
    if (!BattleManager.Instance.resourceModel) {
      Logger.battle("[BattleLoadingView]resourceModel 不存在");
      return;
    }
    if (BattleModel.battleUILoaded) {
      if (this.stage) {
        this.update(99);
      }
      Logger.battle(
        "------------enter battle ui loaded complete-----------------",
      );
      this._callback();
      return;
    }
    if (this.stage) {
      this.update(
        BattleManager.Instance.resourceModel.progress(),
        BattleManager.Instance.resourceModel.progressString(),
      );
    }
  }

  public stopShowLoad() {
    Laya.timer.clear(this, this.__enterFrame);
  }

  // public set pkg($pkg:PackageIn)
  // {
  //     PlayerManager.instance.currentPlayerModel.currntBattleId = $pkg.readInt().toString();
  // }

  public dispose() {
    this.stopShowLoad();
    this._callback = null;
  }
}
