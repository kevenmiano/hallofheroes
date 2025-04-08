// @ts-nocheck
import { TransSceneEffect2 } from "./TransSceneEffect2";
import { DisplayObject } from "../../component/DisplayObject";

/**
 * 从中间往上下
 * @author yuanzhan.yu
 */
export class TransSceneEffect2_6 extends TransSceneEffect2 {
    private _centerIndex: number = 0;

    constructor(cells: DisplayObject[], row: number, col: number, cellSize: number) {
        super(cells, row, col, cellSize);
        this._centerIndex = Math.floor(this._row * 0.5);
    }

    protected getCellsByIndex(index: number): DisplayObject[] {
        let arr: DisplayObject[] = [];

        let rowI: number = 0;

        let c: DisplayObject;
        let i: number = 0;
        rowI = this._centerIndex - index
        if (rowI > -1) {
            for (i = 0; i < this._col; i++) {
                c = this._cells[rowI * this._col + i];
                arr.push(c);
            }
        }
        if (index > 0) {
            rowI = this._centerIndex + index
            if (rowI < this._row) {
                for (i = 0; i < this._col; i++) {
                    c = this._cells[rowI * this._col + i];
                    arr.push(c);
                }
            }
        }

        return arr;
    }
}