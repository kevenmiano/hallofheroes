import FUI_MarketRecordItem from "../../../../../fui/Market/FUI_MarketRecordItem";

//@ts-expect-error: External dependencies
import IMarketOrderMsg = com.road.yishi.proto.market.IMarketOrderMsg;
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import GoodsSonType from "../../../constant/GoodsSonType";
import LangManager from "../../../../core/lang/LangManager";
import { TipsShowType } from "../../../tips/ITipedDisplay";
import { EmWindow } from "../../../constant/UIDefine";
import { ToolTipsManager } from "../../../manager/ToolTipsManager";

export default class MarketRecordItem extends FUI_MarketRecordItem {
  tipType: EmWindow;
  tipData: any;
  showType?: TipsShowType;
  canOperate?: boolean;
  extData?: any;
  startPoint?: Laya.Point;
  iSDown?: boolean;
  isMove?: boolean;
  mouseDownPoint?: Laya.Point;
  moveDistance?: number;
  alphaTest?: boolean;
  tipDirctions?: string;
  tipGapV?: number;
  tipGapH?: number;

  private _data: IMarketOrderMsg;

  private _cachesGoods: GoodsInfo;

  protected onConstruct(): void {
    super.onConstruct();
    this.tipType = EmWindow.PropTips;
    this.descLab.on(Laya.Event.LINK, this, this.onDescTap);
  }

  public set info(v: IMarketOrderMsg) {
    this._data = v;
    this.updateView();
  }

  public get info() {
    return this._data;
  }

  private updateView() {
    if (!this._data) return;

    if (!this._cachesGoods) {
      this._cachesGoods = new GoodsInfo();
    }

    this._cachesGoods.templateId = this._data.templateId;

    let time = this.formateTime(this._data.actionTime);

    let goodsName = this._cachesGoods.templateInfo.TemplateNameLang;

    let color = GoodsSonType.getColorByProfile(
      this._cachesGoods.templateInfo.Profile,
    );

    let desc = "";
    let bp = this._data.point - this._data.tradingPoint;

    if (this._data.type == 1) {
      // let tax = MarketManager.Instance.marketTaxRare / 100;
      let getPoint = this._data.tradingPoint - this._data.tax;
      //出售
      desc = LangManager.Instance.GetTranslation(
        "Market.record.sell",
        time,
        color,
        goodsName,
        this._data.point,
        getPoint,
      );
    } else if (bp > 0) {
      //求购退还差价
      desc = LangManager.Instance.GetTranslation(
        "Market.record.buyBack",
        time,
        color,
        goodsName,
        this._data.tradingPoint,
        bp,
      );
    } else {
      //求购
      desc = LangManager.Instance.GetTranslation(
        "Market.record.buy",
        time,
        color,
        goodsName,
        this._data.tradingPoint,
      );
    }
    this.descLab.text = desc;
  }

  private onDescTap() {
    if (!this._cachesGoods) return;
    this.tipData = this._cachesGoods;
    ToolTipsManager.Instance.showTip(null, this.displayObject);
  }

  private formateTime(time: string) {
    let ts = time.split(" ");

    let days = ts[0].split("-");

    let hours = ts[1].split(":");

    return days[1] + "-" + days[2] + " " + hours[0] + ":" + hours[1] + "   ";
  }
}
