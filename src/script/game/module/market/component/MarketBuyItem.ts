import FUI_MarketBuyItem from "../../../../../fui/Market/FUI_MarketBuyItem";

//@ts-expect-error: External dependencies
import IMarketItemPriceMsg = com.road.yishi.proto.market.IMarketItemPriceMsg;

export default class MarketBuyItem extends FUI_MarketBuyItem {
  private _info: IMarketItemPriceMsg;

  public set info(v: IMarketItemPriceMsg) {
    this._info = v;
    this.updateView();
  }

  public get info() {
    return this._info;
  }

  private updateView() {
    if (!this._info) return;
    this.sellPriceLab.text = this._info.point + "";
    this.sellCountLab.text = this._info.count + "";
    this.topCrol.selectedIndex = this._info.top >= 100 ? 1 : 0;
  }
}
