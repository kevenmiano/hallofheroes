import FUI_ItemWithSelectEffect from "../../../../fui/Base/FUI_ItemWithSelectEffect";
import { BaseItem } from "./BaseItem";
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import GoodsSonType from "../../constant/GoodsSonType";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/5/26 12:21
 * @ver 1.0
 *
 */
export class ItemWithSelectEffect extends FUI_ItemWithSelectEffect {
  public item: BaseItem;
  public showName: boolean = false;

  private _info: GoodsInfo;

  constructor() {
    super();
  }

  get info(): GoodsInfo {
    return this._info;
  }

  set info(value: GoodsInfo) {
    this._info = value;
    this.item.info = value;
    this.txtName.visible = false;
    if (value) {
      if (this.showName) {
        this.txtName.visible = true;
        this.txtName.text = value.templateInfo.TemplateNameLang;
        this.txtName.color = GoodsSonType.getColorByProfile(
          value.templateInfo.Profile,
        );
      }
    }
  }

  dispose() {
    this.item.dispose();
    this._info = null;
    super.dispose();
  }
}
