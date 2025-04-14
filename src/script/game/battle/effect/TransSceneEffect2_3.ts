import { TransSceneEffect2 } from "./TransSceneEffect2";
import { DisplayObject } from "../../component/DisplayObject";

/**
 * 从下往上
 * @author yuanzhan.yu
 */
export class TransSceneEffect2_3 extends TransSceneEffect2 {
  constructor(
    cells: DisplayObject[],
    row: number,
    col: number,
    cellSize: number,
  ) {
    super(cells, row, col, cellSize);
  }

  protected getCellsByIndex(index: number): DisplayObject[] {
    let arr: DisplayObject[] = [];
    if (index >= this._row) {
      return null;
    }

    let c: DisplayObject;
    for (let i: number = 0; i < this._col; i++) {
      c = this._cells[(this._row - index - 1) * this._col + i];
      arr.push(c);
    }
    return arr;
  }
}
