//@ts-expect-error: External dependencies
import FUI_MarketMineItem from "../../../../../fui/Market/FUI_MarketMineItem";
import LangManager from "../../../../core/lang/LangManager";
import IMarketOrderMsg = com.road.yishi.proto.market.IMarketOrderMsg;
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import MarkGoodsItem from "./MarkGoodsItem";
import UIButton from "../../../../core/ui/UIButton";

export default class MarketMineItem extends FUI_MarketMineItem {
  public myCancelBtn: UIButton;

  public myGetBtn: UIButton;

  private _cacheGoodsInfo: GoodsInfo;

  private _IMarketOrderMsg: IMarketOrderMsg;
  protected onConstruct(): void {
    super.onConstruct();
    this.initTranslate();
  }

  private initTranslate() {
    this.bpriceTxt.text = LangManager.Instance.GetTranslation(
      "Market.mine.backPrice",
    );
    this.cancelBtn.title =
      LangManager.Instance.GetTranslation("Market.mine.cancel");
    this.getBtn.title = LangManager.Instance.GetTranslation(
      "Market.mine.getting",
    );
    this.taxTxt.text =
      LangManager.Instance.GetTranslation("market.mine.taxTxt");
    this.myCancelBtn = new UIButton(this.cancelBtn);
    this.myGetBtn = new UIButton(this.getBtn);
  }

  public set info(v: IMarketOrderMsg) {
    this._IMarketOrderMsg = v;
    this.updateView();
  }

  public get info() {
    return this._IMarketOrderMsg;
  }

  public updateView() {
    if (!this._IMarketOrderMsg) return;
    this.priceLab.text = this._IMarketOrderMsg.point + "";
    this.wpriceLab.text = this.priceLab.text;

    if (!this._cacheGoodsInfo) {
      this._cacheGoodsInfo = new GoodsInfo();
    }

    this._cacheGoodsInfo.templateId = this._IMarketOrderMsg.templateId;
    this._cacheGoodsInfo.count = this._IMarketOrderMsg.count;

    (this.mineItem as MarkGoodsItem).info = this._cacheGoodsInfo;
    (this.wantItem as MarkGoodsItem).info = this._cacheGoodsInfo;

    this.stateCrol.selectedIndex = this._IMarketOrderMsg.status;

    this.typeCrol.selectedIndex = this._IMarketOrderMsg.type - 1;

    //出售成功 减去税
    if (this.typeCrol.selectedIndex == 0 && this.stateCrol.selectedIndex == 6) {
      let getPoint =
        this._IMarketOrderMsg.tradingPoint - this._IMarketOrderMsg.tax;
      this.wpriceLab.text = getPoint + "";
    }

    //提取/取消/无操作
    this.extCrol.selectedIndex =
      this._IMarketOrderMsg.status == 2
        ? 1
        : (this._IMarketOrderMsg.status == 4 ||
              this._IMarketOrderMsg.status == 6) &&
            !this._IMarketOrderMsg.extract
          ? 2
          : 0;

    let tradingPoint = this._IMarketOrderMsg.tradingPoint;

    let backPoint = this._IMarketOrderMsg.point - tradingPoint;

    this.backCrol.selectedIndex =
      this._IMarketOrderMsg.status == 6 && backPoint > 0 ? 1 : 0;

    if (backPoint > 0) {
      this.bpriceLab.text = backPoint + "";
    }

    this.setMineGrayed(this._IMarketOrderMsg.status == 6);

    this.setWantGrayed(this._IMarketOrderMsg.status != 6);
  }

  private setMineGrayed(grayed: boolean) {
    this.u1.grayed = grayed;
    this.priceLab.grayed = grayed;
    this.mineItem.grayed = grayed;
  }

  private setWantGrayed(grayed: boolean) {
    this.u3.grayed = grayed;
    this.wpriceLab.grayed = grayed;
    this.wantItem.grayed = grayed;
    this.taxTxt.grayed = grayed;
  }
}
