import FUI_AirGardenGameSuDuItem from "../../../../../fui/Carnival/FUI_AirGardenGameSuDuItem";

export default class AirGardenGameSuDuItem extends FUI_AirGardenGameSuDuItem {
  private _row: number = -1;

  private _col: number = -1;

  private _value: number = -1;

  private _count: number = 0;

  public get row() {
    return this._row;
  }

  public set row(v: number) {
    this._row = v;
  }

  public get col() {
    return this._col;
  }

  public set col(v: number) {
    this._col = v;
  }

  public get cellType() {
    return this.cellTypeCtrl.selectedIndex;
  }

  /**默认0，1为选择格子**/
  public set cellType(v: number) {
    this.cellTypeCtrl.selectedIndex = v;
  }

  public set value(v: number) {
    this._value = v;
    this.valueText.text = this._value == 0 ? "" : this._value + "";
  }

  public get value() {
    return this._value;
  }

  public set count(v: number) {
    this._count = v;
    this.countText.text = this._count + "";
  }

  public get count() {
    return this._count;
  }
}
