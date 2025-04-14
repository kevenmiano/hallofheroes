import FUI_DiscountTitleItem from "../../../../../../fui/Shop/FUI_DiscountTitleItem";
import LangManager from "../../../../../core/lang/LangManager";
import { DisocuntInfo } from "../../model/DiscountInfo";

export default class DiscountTitleItem extends FUI_DiscountTitleItem {
  private _cellIndex: number = 0;

  public set cellIndex(value: number) {
    this._cellIndex = value;
  }

  public get cellIndex(): number {
    return this._cellIndex;
  }

  setItemData(data: DisocuntInfo) {
    this.title.text = LangManager.Instance.GetTranslation(
      "shop.discount.useCount" + data.type,
      data.count,
    );
  }
}
