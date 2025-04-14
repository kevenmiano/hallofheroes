//@ts-expect-error: External dependencies
import { ITransSceneEffect } from "./ITransSceneEffect";
import { CellEffectUtils } from "./CellEffectUtils";
import { Func } from "../../../core/comps/Func";
import Logger from "../../../core/logger/Logger";
import { DisplayObject } from "../../component/DisplayObject";

/**
 * 进入战斗时的切换效果1.
 * 该类主要是实现了方块的同时变换,表现为所有方块同时消失,翻转,缩小等效果.
 * @author yuanzhan.yu
 */
export class TransSceneEffect1 implements ITransSceneEffect {
  public _effectType: number;

  private _complete: Func;
  private _cells: DisplayObject[] = [];
  protected _cellSize: number = 0;
  protected _completeCount: number = 0;

  constructor(cells: DisplayObject[], cellSize: number) {
    this._cells = cells;
    this._cellSize = cellSize;
  }

  public start(complete: Func) {
    // Logger.info("特效" + this._effectType + "---start");
    this._complete = complete;
    this._cells.forEach((value) => {
      this.cellEffect(value);
    });
  }

  effectType(type: number) {
    this._effectType = type;
  }

  protected cellEffect(c: Laya.Sprite) {
    CellEffectUtils.zoomOut(c, this.onTweenComplete, this);
  }

  protected onTweenComplete() {
    this._completeCount++;
    Logger.info(
      "特效" + this._effectType + "=onTweenComplete:",
      this._completeCount,
      this._cells.length,
    );
    if (this._completeCount >= this._cells.length) {
      if (this._complete != null) {
        this._complete.Invoke();
      }
      this._cells = null;
      this._complete = null;
    }
  }
}
