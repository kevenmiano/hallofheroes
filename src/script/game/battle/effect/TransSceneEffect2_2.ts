import { TransSceneEffect2 } from "./TransSceneEffect2";
import { DisplayObject } from "../../component/DisplayObject";

/**
 * 从上往下
 * @author yuanzhan.yu
 */
export class TransSceneEffect2_2 extends TransSceneEffect2 {
    constructor(cells: DisplayObject[], row: number, col: number, cellSize: number) {
        super(cells, row, col, cellSize);
    }

    protected getCellsByIndex(index: number) {
        let arr: DisplayObject[] = [];
        if (index >= this._row) {
            return null;
        }

        let c: DisplayObject;
        for (let i: number = 0; i < this._col; i++) {
            c = this._cells[index * this._col + i];
            arr.push(c);
        }
        return arr;
    }
}