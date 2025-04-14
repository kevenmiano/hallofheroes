import FUI_MineCircleItem from "../../../../../fui/OuterCity/FUI_MineCircleItem";

export default class MineCircleItem extends FUI_MineCircleItem {
  constructor() {
    super();
  }

  protected onConstruct() {
    super.onConstruct();
  }

  public set hasOccupy(flag: boolean) {
    this.c1.selectedIndex = flag ? 1 : 0;
  }

  dispose() {
    super.dispose();
  }
}
