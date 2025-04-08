import { TransSceneEffect2 } from "./TransSceneEffect2";
import { DisplayObject } from "../../component/DisplayObject";

/**
 * 从左中往右
 * @author yuanzhan.yu
 */
export class TransSceneEffect2_4 extends TransSceneEffect2 {
    private _centerIndex: number = 0;

    constructor(cells: DisplayObject[], row: number, col: number, cellSize: number) {
        super(cells, row, col, cellSize);
        this._centerIndex = Math.floor(this._row * 0.5);
    }

    protected getCellsByIndex(index: number): DisplayObject[] {
        let arr: DisplayObject[] = this.getCellsByIndex2(index * 2);
        arr = arr.concat(this.getCellsByIndex2(index * 2 + 1))
        return arr;
    }

    private getCellsByIndex2(index: number): DisplayObject[] {
        let arr: DisplayObject[] = [];

        let rowI: number = this._centerIndex;
        let colI: number = index;
        let count: number = 0;

        let c: DisplayObject;
        while (true) {
            rowI = this._centerIndex - count
            colI = index - count;
            if (this.isExit(rowI, colI)) {
                c = this._cells[rowI * this._col + colI];
                arr.push(c);
            }
            if (count > 0) {
                rowI = this._centerIndex + count
                if (this.isExit(rowI, colI)) {
                    c = this._cells[rowI * this._col + colI];
                    arr.push(c);
                }
                else if (rowI >= this._row) {
                    break;
                }
            }
            count++;
        }

        return arr;
    }

    private isExit(row: number, col: number): boolean {
        if (row > -1 && col > -1 && row < this._row && col < this._col) {
            return true
        }
        return false;
    }
}