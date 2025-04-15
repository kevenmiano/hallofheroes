import FUI_Promotion from "../../../../../../fui/Shop/FUI_Promotion";
import LangManager from "../../../../../core/lang/LangManager";
import { t_s_rechargeData } from "../../../../config/t_s_recharge";
import ProductType from "../../../../constant/ProductType";
import { TempleteManager } from "../../../../manager/TempleteManager";
import PromotionItem from "./PromotionItem";

/**
 * 特惠商场
 * ProductType = 4
 */
export default class Promotion extends FUI_Promotion {
  private _data: t_s_rechargeData[];

  public init(): void {
    super.onConstruct();
    this.initData();
    this.initView();
    this.initEvent();
  }

  public resetUI() {}

  private initData() {
    let datalist = TempleteManager.Instance.getRechargeTempletes(
      ProductType.PROMOTION,
    );
    let dataweeklist = TempleteManager.Instance.getRechargeTempletes(
      ProductType.PROMOTION_WEEK,
    );
    this._data = datalist.concat(dataweeklist);
  }

  private initView() {
    this.list.itemRenderer = Laya.Handler.create(
      this,
      this.renderListItem,
      null,
      false,
    );
    this.list.numItems = this._data.length;
    this.txt_describe.text = LangManager.Instance.GetTranslation(
      "Shop.Promotion.describe",
    );
  }

  private initEvent() {}

  /**渲染单元格 */
  private renderListItem(index: number, item: PromotionItem) {
    item.index = index;
    item.info = this._data[index];
  }

  public dispose(destroy = true) {
    if (this.list.itemRenderer instanceof Laya.Handler) {
      this.list.itemRenderer.recover();
    }
    this.list.itemRenderer = null;
    this.list.itemRenderer = null;
    if (destroy) {
      super.dispose();
    }
  }
}
