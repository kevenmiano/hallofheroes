// @ts-nocheck
import { TransSceneEffect2 } from "./TransSceneEffect2";
import { DisplayObject } from "../../component/DisplayObject";

/**
 * 从中间往左右
 * @author yuanzhan.yu
 */
export class TransSceneEffect2_7 extends TransSceneEffect2 {
    private _centerIndex: number = 0;

    constructor(cells: DisplayObject[], row: number, col: number, cellSize: number) {
        super(cells, row, col, cellSize);
        this._centerIndex = Math.floor(this._col * 0.5);
    }

    protected getCellsByIndex(index: number): DisplayObject[] {
        let arr: DisplayObject[] = [];

        let colI: number = 0;

        let c: DisplayObject;
        let i: number = 0;
        colI = this._centerIndex - index
        if (colI > -1) {
            for (i = 0; i < this._row; i++) {
                c = this._cells[i * this._col + colI];
                arr.push(c);
            }
        }
        if (index > 0) {
            colI = this._centerIndex + index
            if (colI < this._col) {
                for (i = 0; i < this._row; i++) {
                    c = this._cells[i * this._col + colI];
                    arr.push(c);
                }
            }
        }

        return arr;
    }
}