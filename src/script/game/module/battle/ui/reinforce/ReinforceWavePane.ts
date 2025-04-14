/*
 * @Author: jeremy.xu
 * @Date: 2023-08-23 17:45:23
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-02-02 14:38:02
 * @Description:
 */
import FUI_ReinforceWavePane from "../../../../../../fui/Battle/FUI_ReinforceWavePane";
import LangManager from "../../../../../core/lang/LangManager";
import ReinforceWaveBall from "./ReinforceWaveBall";

/**
 * 增援波数面板
 */
export default class ReinforceWavePane extends FUI_ReinforceWavePane {
  private _totalWave: number;
  private _currentWave = 1;

  private _balls: Array<number> = [];

  onConstruct() {
    super.onConstruct();
    this.forceText.text = LangManager.Instance.GetTranslation(
      "battle.view.reinforce.ReinforceWavePane.tf.text",
    );
    this.list.itemRenderer = Laya.Handler.create(
      this,
      this.renderReinforeListItem,
      null,
      false,
    );
  }

  remove() {
    if (this.list && this.list.itemRenderer) {
      if (this.list.itemRenderer instanceof Laya.Handler) {
        this.list.itemRenderer.recover();
      }

      this.list.itemRenderer = null;
    }
  }

  public setTotalWave(value: number) {
    this._totalWave = value;
    this.createBalls();
  }

  private createBalls() {
    this._balls = [];
    for (let i: number = 0; i < this._totalWave; i++) {
      this._balls.push(i + 1);
    }
    this.list.numItems = this._balls.length;
    this.list.resizeToFit();
  }

  /**渲染增援列表 */
  renderReinforeListItem(index: number, item: ReinforceWaveBall) {
    if (!item || item.isDisposed) return;
    let keyINdex = this._balls[index];
    item.showReinforce(this._currentWave <= keyINdex);
  }

  public setCurrentWave(value: number) {
    this._currentWave = value;
    this.list.numItems = this._balls.length;
  }

  public showNextWave() {
    this._currentWave++;
    this.list.numItems = this._balls.length;
  }

  public dispose() {
    this.remove();
    super.dispose();
  }
}
