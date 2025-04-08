// @ts-nocheck

import FUI_OpSuDuCellGroup from "../../../../../fui/Carnival/FUI_OpSuDuCellGroup";

import AirGardenGameSuDuItem from "./AirGardenGameSuDuItem";

export default class OpSuDuCellGroup extends FUI_OpSuDuCellGroup {

    private cells: AirGardenGameSuDuItem[];

    private _curSelected: AirGardenGameSuDuItem;

    protected onConstruct() {
        super.onConstruct();
        this.cells = [this.c0 as AirGardenGameSuDuItem, this.c1 as AirGardenGameSuDuItem, this.c2 as AirGardenGameSuDuItem, this.c3 as AirGardenGameSuDuItem, this.c4 as AirGardenGameSuDuItem, this.c5 as AirGardenGameSuDuItem];
        this.initIndex();
    }

    private initIndex() {
        let cellsLength = this.cells.length;
        let cells = this.cells;
        let cell: AirGardenGameSuDuItem;
        for (let r = 0; r < cellsLength; r++) {
            cell = cells[r];
            cell.cellType = 1;
            cell.value = r + 1;
            cell.valueColorCtrl.selectedIndex = 1;
            cell.onClick(this, this.onSelectedClick, [cell]);
        }
    }

    private onSelectedClick(e: AirGardenGameSuDuItem) {
        if (e.count <= 0) return;
        this._curSelected = e;
        this.showSelected();
    }

    public setNum(num: number, count: number) {
        if (!this.cells[num - 1]) return;
        this.cells[num - 1].count = count;
    }

    public getCurSelected() {
        return this._curSelected;
    }

    public updateSelected() {
        if (this._curSelected && this._curSelected.count > 0) {
            return;
        }
        let cellsLength = this.cells.length;
        let cells = this.cells;
        let cell: AirGardenGameSuDuItem = null;
        let first: AirGardenGameSuDuItem = null
        for (let r = 0; r < cellsLength; r++) {
            cell = cells[r];
            if (cell.count > 0) {
                first = cell;
                break;
            }
        }
        this._curSelected = first;
        this.showSelected();
    }

    public resetData() {
        let cellsLength = this.cells.length;
        let cells = this.cells;
        let cell: AirGardenGameSuDuItem;
        for (let r = 0; r < cellsLength; r++) {
            cell = cells[r];
            cell.cellType = 1;
            cell.count = 0;
        }
    }

    public showSelected() {
        let cellsLength = this.cells.length;
        let cells = this.cells;
        let cell: AirGardenGameSuDuItem;
        for (let r = 0; r < cellsLength; r++) {
            cell = cells[r];
            cell.ts.visible = (cell == this._curSelected)
        }

    }

}