import { TransSceneEffect2 } from "./TransSceneEffect2";
import { DisplayObject } from "../../component/DisplayObject";

/**
 * 从右往左
 * @author yuanzhan.yu
 */
export class TransSceneEffect2_1 extends TransSceneEffect2 {
    constructor(cells: DisplayObject[], row: number, col: number, cellSize: number) {
        super(cells, row, col, cellSize);
    }

    protected getCellsByIndex(index: number): DisplayObject[] {
        var arr: DisplayObject[] = [];
        if (index >= this._col) {
            return null;
        }

        var c: DisplayObject;
        for (var i: number = 0; i < this._row; i++) {
            c = this._cells[i * this._col + this._col - index - 1];
            arr.push(c);
        }
        return arr;
    }
}