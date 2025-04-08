import { ITransSceneEffect } from "./ITransSceneEffect";
import { DisplayObject } from "../../component/DisplayObject";
import { CellEffectUtils } from "./CellEffectUtils";
import { Func } from "../../../core/comps/Func";
import Logger from "../../../core/logger/Logger";

/**
 * 进入战斗时的切换效果2.(从左往右)
 * 该类主要是实现了方块的逐步变换,表现为所有方块按一定顺序消失,翻转,缩小等效果.
 * @author yuanzhan.yu
 */
export class TransSceneEffect2 implements ITransSceneEffect {

    private _effectType: number;

    private _complete: Func;

    protected _cells: DisplayObject[] = [];
    protected _cellSize: number = 0;
    protected _row: number = 0;
    protected _col: number = 0;

    protected _completeCount: number = 0;
    private _timeIndex: number = 0;
    private _tweenType: number = 0;

    constructor(cells:  DisplayObject[], row: number, col: number, cellSize: number) {
        this._cells = cells;
        this._row = row;
        this._col = col;
        this._cellSize = cellSize
    }

    effectType(type: number) {
        this._effectType = type;
    }

    public start(complete: Func) {
        // Logger.info("特效" + this._effectType + "---start");
        this._complete = complete;
        this._tweenType = Math.round(Math.random() * 2) + 1;
        // this._tweenType =1;
        this.startTimer();
    }

    private startTimer() {
        Laya.stage.timerLoop(20, this, this.onTimer)
    }

    private onTimer() {
        let c: DisplayObject;
        let tempCells = this.getCellsByIndex(this._timeIndex);
        if (tempCells && tempCells.length > 0) {
            for (let i: number = 0; i < tempCells.length; i++) {
                c = tempCells[i];
                this.cellEffect(c);
            }
        } else {
            this.removeTimer();
        }
        this._timeIndex++;
    }

    protected getCellsByIndex(index: number) {
        let arr: DisplayObject[] = [];
        if (this._timeIndex >= this._col) {
            return null;
        }

        let c: DisplayObject;
        for (let i: number = 0; i < this._row; i++) {
            c = this._cells[i * this._col + index];
            arr.push(c);
        }
        return arr;
    }

    private removeTimer() {
        Laya.stage.clearTimer(this, this.onTimer);
    }

    protected cellEffect(c: DisplayObject) {
        switch (this._tweenType) {
            case 1:
                CellEffectUtils.zoomOut(c, this.onTweenComplete, this);
                break;
            case 2:
                CellEffectUtils.fadeOut(c, this.onTweenComplete, this);
                break;
            case 3:
                CellEffectUtils.rotate(c, this.onTweenComplete, this);
                break;
            default:
                CellEffectUtils.fadeOut(c, this.onTweenComplete, this);
        }

    }

    protected onTweenComplete() {
        this._completeCount++;
        Logger.info("特效" + this._effectType + "=onTweenComplete:", this._completeCount, this._cells.length);
        if (this._completeCount >= this._cells.length) {
            if (this._complete != null) {
                this._complete.Invoke();
            }
            this._cells = null;
            this._complete = null;
        }

    }
}