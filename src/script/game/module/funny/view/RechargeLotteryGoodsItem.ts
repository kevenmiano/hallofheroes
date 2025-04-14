import FUI_RechargeLotteryGoodsItem from "../../../../../fui/Funny/FUI_RechargeLotteryGoodsItem";
import { BaseItem } from "../../../component/item/BaseItem";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
/**
 * @description
 * @author yuanzhan.yu
 * @date 2023/6/1 17:40
 * @ver 1.0
 */
export class RechargeLotteryGoodsItem extends FUI_RechargeLotteryGoodsItem {
  public effect: fgui.Controller;
  public item: BaseItem;

  private _info: GoodsInfo;
  private _templateType: number;
  public pos: number;

  constructor() {
    super();
  }

  protected onConstruct() {
    super.onConstruct();
  }

  set info(value: GoodsInfo) {
    this._info = value;
    if (value) {
      this.item.info = value;
    }
  }

  set templateType(value: number) {
    this._templateType = value;
    if (value == 1) {
      this.effect.selectedIndex = 1;
    } else {
      this.effect.selectedIndex = 0;
    }
  }

  dispose() {
    this._info = null;
    super.dispose();
  }
}
