import FUI_MarketListItem from "../../../../../fui/Market/FUI_MarketListItem";
import MarketItemInfoMsg = com.road.yishi.proto.market.IMarketItemInfoMsg;
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import MarkGoodsItem from "./MarkGoodsItem";
import GoodsSonType from "../../../constant/GoodsSonType";
import LangManager from "../../../../core/lang/LangManager";
import BaseTipItem from "../../../component/item/BaseTipItem";
import TemplateIDConstant from "../../../constant/TemplateIDConstant";
export default class MarketListItem extends FUI_MarketListItem {
  private _data: MarketItemInfoMsg;

  private _cacheGoods: GoodsInfo;

  protected onConstruct(): void {
    super.onConstruct();
    // this.goodsItem.touchable = false;
    (this.diamondTip as BaseTipItem).setInfo(
      TemplateIDConstant.TEMP_ID_DIAMOND,
    );
  }

  public set info(v: MarketItemInfoMsg) {
    this._data = v;
    this.updateView();
  }

  public get info() {
    return this._data;
  }

  public updateView() {
    if (!this._data) return;
    this.countLab.text = LangManager.Instance.GetTranslation(
      "market.online.count",
      this._data.total,
      this._data.purchaseTotal,
    );
    this.priceLab.text = this._data.total == 0 ? "--" : this._data.point + "";

    if (!this._cacheGoods) {
      this._cacheGoods = new GoodsInfo();
    }
    this._cacheGoods.templateId = this._data.templateId;

    this.goodsLab.text = this._cacheGoods.templateInfo.TemplateNameLang;

    this.goodsLab.color = GoodsSonType.getColorByProfile(
      this._cacheGoods.templateInfo.Profile,
    );

    (this.goodsItem as MarkGoodsItem).info = this._cacheGoods;
  }
}
