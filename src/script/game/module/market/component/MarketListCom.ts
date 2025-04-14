import FUI_MarketListCom from "../../../../../fui/Market/FUI_MarketListCom";
import LangManager from "../../../../core/lang/LangManager";
import MarketListItem from "./MarketListItem";

import MarketItemInfoMsg = com.road.yishi.proto.market.IMarketItemInfoMsg;
import MarketManager from "../../../manager/MarketManager";

export default class MarketListCom extends FUI_MarketListCom {
  private _listData: MarketItemInfoMsg[];
  protected onConstruct(): void {
    super.onConstruct();
    this.init();
  }

  private init() {
    this.goodsList.setVirtual();
    this.goodsList.itemRenderer = Laya.Handler.create(
      this,
      this.onMarketItemRender,
      null,
      false,
    );
    // this.goodsList.on(fgui.Events.CLICK_ITEM, this, this.onItemTap);
    this.initTranslate();
  }

  private initTranslate() {
    this.goodsNameLab.text = LangManager.Instance.GetTranslation(
      "Market.list.goodsName",
    );
    this.onlineCountLab.text = LangManager.Instance.GetTranslation(
      "Market.list.onlineCount",
    );
    this.priceLab.text =
      LangManager.Instance.GetTranslation("Market.list.price");
  }

  public setInfoList(list: MarketItemInfoMsg[]) {
    this._listData = list;
    this.goodsList.numItems = this._listData.length;
  }

  public updateList() {
    this.goodsList.refreshVirtualList();
  }

  private onMarketItemRender(index: number, item: MarketListItem) {
    item.info = this._listData[index];
    item.b1.onClick(this, this.onItemTap, [item]);
  }

  private onItemTap(item: MarketListItem) {
    // FrameCtrlManager.Instance.open(EmWindow.MarketBuyWnd);
    MarketManager.Instance.reqMarketOpertion(5, item.info.templateId);
  }

  public scrollToTop() {
    this.goodsList.scrollToView(0);
  }

  public remove() {
    this.goodsList.itemRenderer.recover();
    this.goodsList.itemRenderer = null;
  }
}
