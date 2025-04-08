import { ITransSceneEffect } from "./ITransSceneEffect";
import ObjectUtils from "../../../core/utils/ObjectUtils";
import { DisplayObject, DisplayObjectContainer } from "../../component/DisplayObject";
import { TransSceneEffect1 } from "./TransSceneEffect1";
import { TransSceneEffect2 } from "./TransSceneEffect2";
import { TransSceneEffect2_1 } from "./TransSceneEffect2_1";
import { TransSceneEffect2_2 } from "./TransSceneEffect2_2";
import { TransSceneEffect2_3 } from "./TransSceneEffect2_3";
import { TransSceneEffect2_4 } from "./TransSceneEffect2_4";
import { TransSceneEffect2_5 } from "./TransSceneEffect2_5";
import { TransSceneEffect2_6 } from "./TransSceneEffect2_6";
import { TransSceneEffect2_7 } from "./TransSceneEffect2_7";
import { BattleManager } from "../BattleManager";
import { Func } from "../../../core/comps/Func";
import Resolution from "../../../core/comps/Resolution";

/**
 * 切换效果(上下文).
 * @author yuanzhan.yu
 */
export class TransSceneEffectContext {
    private _container: Laya.Sprite;
    private _callback: Func;


    private _cellSize: number = 50;
    private _cells: Laya.Sprite[];
    private _row: number = 0;
    private _col: number = 0;
    private _cellsContainer: Laya.Sprite;
    private _target: any = null;

    public static testType: number = 1
    public effectType: number = 0

    constructor(container: Laya.Sprite, callBack: Func = null) {
        this._container = container;
        this._callback = callBack;
    }

    public start() {
        if (!this._container) {
            this.completeFun();
            return;
        }
        let effect: ITransSceneEffect = this.createEffect();
        if (effect) {
            effect.start(new Func(this, this.completeFun));
        } else {
            this.completeFun();
        }
    }

    /**
     * 创建随机切换效果
     * @return
     */
    private createEffect(): ITransSceneEffect {
        if (!this.initCells()) {
            return null;
        }


        let effect: ITransSceneEffect

        let type: number
        if (this.effectType) {
            type = this.effectType
        } else {
            type = Math.round(Math.random() * 8) + 1;
        }

        switch (type) {
            case 1:
                effect = new TransSceneEffect1(this._cells, this._cellSize);
                break
            case 2:
                effect = new TransSceneEffect2(this._cells, this._row, this._col, this._cellSize);
                break;
            case 3:
                effect = new TransSceneEffect2_1(this._cells, this._row, this._col, this._cellSize);
                break;
            case 4:
                effect = new TransSceneEffect2_2(this._cells, this._row, this._col, this._cellSize);
                break;
            case 5:
                effect = new TransSceneEffect2_3(this._cells, this._row, this._col, this._cellSize);
                break;
            case 6:
                effect = new TransSceneEffect2_4(this._cells, this._row, this._col, this._cellSize);
                break;
            case 7:
                effect = new TransSceneEffect2_5(this._cells, this._row, this._col, this._cellSize);
                break;
            case 8:
                effect = new TransSceneEffect2_6(this._cells, this._row, this._col, this._cellSize);
                break;
            case 9:
                effect = new TransSceneEffect2_7(this._cells, this._row, this._col, this._cellSize);
                break;
        }
        effect.effectType(type);
        return effect;
    }

    private testCells(): boolean {
        this._cellSize = 50;
        // this._cellBmd = new Laya.Sprite();
        // this._cellBmd.graphics.drawRect(0, 0, this._cellSize, this._cellSize, "#000000");


        let offsetX: number = 0;
        let offsetY: number = 0;

        offsetX = (Resolution.gameWidth) * 0.5
        offsetY = (Resolution.gameHeight) * 0.5
        if (offsetX > -1) {
            offsetX = -1
        }
        if (offsetY > -1) {
            offsetY = -1
        }
        this._row = Math.ceil(Resolution.gameHeight / this._cellSize);
        this._col = Math.ceil(Resolution.gameWidth / this._cellSize);
        this._cells = [];

        let rowIndex: number = 0;
        let colIndex: number;
        let cell: Laya.Sprite = null;

        this._cellsContainer = new Laya.Sprite();
        //			_cellsContainer.alpha = 0.6
        this._container.addChild(this._cellsContainer);

        this._cellsContainer.x = 0;
        this._cellsContainer.y = 0;

        while (rowIndex < this._row) {
            colIndex = 0;
            while (colIndex < this._col) {
                cell = new Laya.Sprite();
                cell.graphics.drawRect(0, 0, this._cellSize, this._cellSize, "#000000");
                cell.width = this._cellSize;
                cell.height = this._cellSize;
                cell.x = colIndex * this._cellSize + offsetX;
                cell.y = rowIndex * this._cellSize + offsetY;

                this._cellsContainer.addChild(cell);
                this._cells.push(cell);

                colIndex++;
            }
            rowIndex++;
        }
        return true;
    }

    private initCells(): boolean {

        let offsetX: number = 0;
        let offsetY: number = 0;

        /** 不止战斗场景用 */
        // if (!BattleManager.Instance.mainViewContainer || !BattleManager.Instance.mainViewContainer.view) {
        //     this.completeFun();
        //     return false;
        // }

        //下面代码注释；不能完全遮住, 会留边。 offsetX offsetY 必定大于-1, 这时候为-1；当宽高刚好为 _cellSize=50 的倍数时, 下边和右边就会留下 (offsetX offsetY) *倍数 的边。
        // offsetX = (BattleManager.Instance.mainViewContainer.view.sceneWidth) * 0.5
        // offsetY = (BattleManager.Instance.mainViewContainer.view.sceneHeight) * 0.5
        // if (offsetX > -1) {
        //     offsetX = -1
        // }
        // if (offsetY > -1) {
        //     offsetY = -1
        // }
        this._row = Math.ceil(Resolution.gameHeight / this._cellSize);
        this._col = Math.ceil(Resolution.gameWidth / this._cellSize);
        this._cells = [];

        let rowIndex: number = 0;
        let colIndex: number;
        let cell: Laya.Sprite = null;

        this._cellsContainer = new Laya.Sprite();

        this._container.addChild(this._cellsContainer);
        this._cellsContainer.x = 0;
        this._cellsContainer.y = 0;

        while (rowIndex < this._row) {
            colIndex = 0;
            while (colIndex < this._col) {
                cell = new Laya.Sprite();
                cell.graphics.drawRect(0, 0, this._cellSize, this._cellSize, "#000000");

                cell.x = colIndex * this._cellSize + offsetX;
                cell.y = rowIndex * this._cellSize + offsetY;

                this._cellsContainer.addChild(cell);
                this._cells.push(cell);
                cell.width = this._cellSize;
                cell.height = this._cellSize;
                colIndex++;
            }
            rowIndex++;
        }
        return true;
    }

    public reset(){

    }

    private completeFun() {
        this.clean();
        if (this._callback != null) {
            this._callback.Invoke();
            this._callback = null;
        }
    }

    public clean() {

        let c: DisplayObject
        if (this._cellsContainer) {
            if (this._cellsContainer.parent) {
                this._cellsContainer.parent.removeChild(this._cellsContainer);
            }
            ObjectUtils.disposeAllChildren(this._cellsContainer as DisplayObjectContainer);
            this._cellsContainer = null;
        }
        if (!this._cells) {
            return;
        }
        for (let i: number = 0; i < this._cells.length; i++) {
            c = this._cells[i];
            if (c.parent) {
                c.parent.removeChild(c);
            }
        }
        this._cells = [];
    }
}