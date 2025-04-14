import FUI_GemMazeBoxItem from "../../../../../../fui/GemMaze/FUI_GemMazeBoxItem";
import { BaseItem } from "../../../../component/item/BaseItem";
import { GoodsInfo } from "../../../../datas/goods/GoodsInfo";
import { GemMazeManager } from "../../../../manager/GemMazeManager";

/**
 * 夺宝奇兵积分宝箱组件
 */
export default class GemMazeBoxItem extends FUI_GemMazeBoxItem {
  private _boxIndex: number;

  protected onConstruct() {
    super.onConstruct();
  }

  public set boxIndex(value: number) {
    this._boxIndex = value;
    var boxItemInfo: GoodsInfo = new GoodsInfo();
    boxItemInfo.templateId =
      GemMazeManager.Instance.model.boxTempleteIdArr[value - 1];
    (this.item as BaseItem).info = boxItemInfo;
  }

  /**
   * 宝箱可领取状态
   * @param state
   */
  setStatus(state: number) {
    this.c1.setSelectedIndex(state);
  }
}
