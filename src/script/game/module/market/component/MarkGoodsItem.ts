import FUI_MarkGoodsItem from "../../../../../fui/Market/FUI_MarkGoodsItem";
import { BaseItem } from "../../../component/item/BaseItem";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import MarketSellGoodsInfo from "./MarketSellGoodsInfo";

export default class MarkGoodsItem extends FUI_MarkGoodsItem {
  private _goods: GoodsInfo;

  private _mgoods: MarketSellGoodsInfo;

  protected onConstruct(): void {
    super.onConstruct();
  }

  public set info(g: GoodsInfo) {
    this._goods = g;
    (this.goodsItem as BaseItem).info = this._goods;
  }

  public hideTitle() {
    (this.goodsItem as BaseItem).getChild("title").visible = false;
  }

  public get info() {
    return this._goods;
  }

  public set MarketGoodsInfo(g: MarketSellGoodsInfo) {
    this._mgoods = g;
    this.info = g ? g.goodsInfo : null;
  }

  public get MarketGoodsInfo() {
    return this._mgoods;
  }

  public set itemTouch(v: boolean) {
    (this.goodsItem as BaseItem).touchable = v;
  }
}
