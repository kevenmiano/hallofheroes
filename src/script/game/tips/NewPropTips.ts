import { BaseItem } from "../component/item/BaseItem";
import { GoodsInfo } from "../datas/goods/GoodsInfo";
import BaseTips from "./BaseTips";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/5/13 15:56
 * @ver 1.0
 *
 */
export class NewPropTips extends BaseTips {
  public bg: fgui.GLoader;
  public item: BaseItem;
  public txt_tip0: fgui.GTextField;
  public txt_tip1: fgui.GTextField;
  private _info: GoodsInfo;

  constructor() {
    super();
  }

  public OnInitWind() {
    super.OnInitWind();
    this.initData();
    this.updateView();
  }

  private initData() {
    [this._info] = this.params;
  }

  private updateView() {
    if (this._info) {
      this.item.info = this._info;
      this.txt_tip0.text = this._info.templateInfo.TemplateNameLang;
      this.txt_tip1.text = this._info.templateInfo.DescriptionLang;
    }
  }

  public OnShowWind() {
    super.OnShowWind();
  }

  protected OnClickModal() {
    this.hide();
  }

  public OnHideWind() {
    super.OnHideWind();
  }

  dispose(dispose?: boolean) {
    this._info = null;
    super.dispose(dispose);
  }
}
