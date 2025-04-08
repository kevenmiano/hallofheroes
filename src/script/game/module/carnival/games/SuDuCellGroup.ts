// @ts-nocheck

import FUI_SuDuCellGroup from "../../../../../fui/Carnival/FUI_SuDuCellGroup";
import AirGardenGameSuDuItem from "./AirGardenGameSuDuItem";

export default class SuDuCellGroup extends FUI_SuDuCellGroup {

    public cells: AirGardenGameSuDuItem[][];



    protected onConstruct() {
        super.onConstruct();
        this.cells = [
            [this.c0 as AirGardenGameSuDuItem, this.c1 as AirGardenGameSuDuItem, this.c2 as AirGardenGameSuDuItem, this.c3 as AirGardenGameSuDuItem, this.c4 as AirGardenGameSuDuItem, this.c5 as AirGardenGameSuDuItem],
            [this.c6 as AirGardenGameSuDuItem, this.c7 as AirGardenGameSuDuItem, this.c8 as AirGardenGameSuDuItem, this.c9 as AirGardenGameSuDuItem, this.c10 as AirGardenGameSuDuItem, this.c11 as AirGardenGameSuDuItem],
            [this.c12 as AirGardenGameSuDuItem, this.c13 as AirGardenGameSuDuItem, this.c14 as AirGardenGameSuDuItem, this.c15 as AirGardenGameSuDuItem, this.c16 as AirGardenGameSuDuItem, this.c17 as AirGardenGameSuDuItem],
            [this.c18 as AirGardenGameSuDuItem, this.c19 as AirGardenGameSuDuItem, this.c20 as AirGardenGameSuDuItem, this.c21 as AirGardenGameSuDuItem, this.c22 as AirGardenGameSuDuItem, this.c23 as AirGardenGameSuDuItem],
            [this.c24 as AirGardenGameSuDuItem, this.c25 as AirGardenGameSuDuItem, this.c26 as AirGardenGameSuDuItem, this.c27 as AirGardenGameSuDuItem, this.c28 as AirGardenGameSuDuItem, this.c29 as AirGardenGameSuDuItem],
            [this.c30 as AirGardenGameSuDuItem, this.c31 as AirGardenGameSuDuItem, this.c32 as AirGardenGameSuDuItem, this.c33 as AirGardenGameSuDuItem, this.c34 as AirGardenGameSuDuItem, this.c35 as AirGardenGameSuDuItem]
        ]

        this.initIndex();
    }

    private initIndex() {
        let cellsLength = this.cells.length;
        let cells = this.cells;
        let cell: AirGardenGameSuDuItem;
        for (let i = 0; i < cellsLength; i++) {
            for (let j = 0; j < cellsLength; j++) {
                cell = cells[i][j];
                cell.row = i;
                cell.col = j;
                cell.cellType = 0;
                cell.emptyCtrl.selectedIndex = 1;
            }
        }
    }

    public getCellItem(r: number, c: number) {
        return this.cells[r][c];
    }

    public setCellItem(r: number, c: number, v: number, first = false) {
        this.cells[r][c].value = v;
        this.cells[r][c].valueColorCtrl.selectedIndex = first ? 0 : 1;
        this.cells[r][c].emptyCtrl.selectedIndex = v == 0 ? 1 : 0;
    }

    public resetData() {
        let cellsLength = this.cells.length;
        let cells = this.cells;
        let cell: AirGardenGameSuDuItem;
        for (let i = 0; i < cellsLength; i++) {
            for (let j = 0; j < cellsLength; j++) {
                cell = cells[i][j];
                cell.value = 0;
            }
        }
    }

    public checkValue(r: number, c: number, v: number) {
        return !(this.checkRowValue(r, v) && this.checkColValue(c, v) && this.checkGridValue(r, c, v));
    }

    private checkRowValue(r: number, v: number) {
        let cellsLength = this.cells.length;
        let cells = this.cells;
        let cell: AirGardenGameSuDuItem;
        for (let i = 0; i < cellsLength; i++) {
            cell = cells[r][i];
            if (cell.value == v) {
                return false;
            }
        }
        return true;
    }

    private checkColValue(c: number, v: number) {
        let cellsLength = this.cells.length;
        let cells = this.cells;
        let cell: AirGardenGameSuDuItem;
        for (let i = 0; i < cellsLength; i++) {
            cell = cells[i][c];
            if (cell.value == v) {
                return false;
            }
        }
        return true;
    }


    private checkGridValue(r: number, c: number, v: number) {
        r = ~~(r / 2);

        c = ~~(c / 3);

        r *= 2;
        c *= 3;

        let cells = this.cells;
        let cell: AirGardenGameSuDuItem;

        for (let i = r; i <= r + 1; i++) {
            for (let j = c; j <= c + 2; j++) {
                cell = cells[i][j];
                if (cell.value == v) {
                    return false;
                }
            }
        }
        return true;
    }

    public showSelected(r: number, c: number) {
        let cellsLength = this.cells.length;
        let cells = this.cells;
        let cell: AirGardenGameSuDuItem;
        for (let i = 0; i < cellsLength; i++) {
            for (let j = 0; j < cellsLength; j++) {
                cell = cells[i][j];
                cell.ts.visible=(i==r&&c==j)
            }
        }

    }
}