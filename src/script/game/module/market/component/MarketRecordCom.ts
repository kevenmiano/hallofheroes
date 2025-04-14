import FUI_MarketRecordCom from "../../../../../fui/Market/FUI_MarketRecordCom";
import MarketRecordItem from "./MarketRecordItem";

import IMarketOrderMsg = com.road.yishi.proto.market.IMarketOrderMsg;

export default class MarketRecordCom extends FUI_MarketRecordCom {
  private _marketOrders: IMarketOrderMsg[];

  protected onConstruct(): void {
    super.onConstruct();
    this.init();
  }

  private init() {
    this.recordList.setVirtual();
    this.recordList.itemRenderer = Laya.Handler.create(
      this,
      this.onMarkRecordItemRender,
      null,
      false,
    );
  }

  private onMarkRecordItemRender(index: number, item: MarketRecordItem) {
    item.info = this._marketOrders[index];
  }

  public scrollToTop() {
    this.recordList.scrollToView(0);
  }

  public setInfoList(successOrders: IMarketOrderMsg[]) {
    this._marketOrders = successOrders;
    if (this._marketOrders) {
      this.recordList.numItems = this._marketOrders.length;

      this.recordList.ensureBoundsCorrect();
      this.recordList.ensureSizeCorrect();
    }
  }
}
