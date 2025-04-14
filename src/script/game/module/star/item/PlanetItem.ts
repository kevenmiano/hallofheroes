//@ts-expect-error: External dependencies
/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-05-21 16:10:09
 * @LastEditTime: 2023-06-25 18:23:50
 * @LastEditors: jeremy.xu
 * @Description:
 */

import FUI_PlanetItem from "../../../../../fui/Star/FUI_PlanetItem";
import { UIFilter } from "../../../../core/ui/UIFilter";
import BaseTipItem from "../../../component/item/BaseTipItem";
import TemplateIDConstant from "../../../constant/TemplateIDConstant";

export default class PlanetItem extends FUI_PlanetItem {
  private _info: any;
  private _enabled: boolean = false;

  onConstruct() {
    super.onConstruct();
    (this.tipItem as BaseTipItem).setInfo(TemplateIDConstant.TEMP_ID_GOLD);
  }

  public set info(data: any) {
    this._info = data;
    if (data) {
    }
  }

  public get info() {
    return this._info;
  }

  public setAniCtrl(index: number = 0) {
    let crl = this.getController("effectCtrl");
    crl.selectedIndex = index;
  }

  public setEnabled(enable: boolean = false) {
    this._enabled = enable;
    this.filters = [enable ? UIFilter.normalFilter : UIFilter.grayFilter];

    this.gCost.visible = enable;
  }

  public getEnabled(): boolean {
    return this._enabled;
  }

  public resetItem() {}
}
