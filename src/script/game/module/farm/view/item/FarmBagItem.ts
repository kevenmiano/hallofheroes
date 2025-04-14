/*
 * @Author: jeremy.xu
 * @Date: 2021-08-15 10:39:53
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2021-12-22 15:21:11
 * @Description:
 */

import { GoodsInfo } from "../../../../datas/goods/GoodsInfo";
import FUI_FarmBagItem from "../../../../../../fui/Farm/FUI_FarmBagItem";
import { BaseItem } from "../../../../component/item/BaseItem";
import { TipsShowType } from "../../../../tips/ITipedDisplay";
import { StringUtil } from "../../../../utils/StringUtil";
import LangManager from "../../../../../core/lang/LangManager";

export class FarmBagItem extends FUI_FarmBagItem {
  public pos: number = -1;

  protected onConstruct() {
    super.onConstruct();
    (this.baseItem as BaseItem).showType = TipsShowType.onLongPress2;
  }

  private _info: GoodsInfo;
  public get info(): GoodsInfo {
    return this._info;
  }

  public set info(value: GoodsInfo) {
    this._info = value;
    if (value) {
      let gTemp = value.templateInfo;
      let timeStr = "";
      if (gTemp) {
        this.title = gTemp.TemplateNameLang;
        if (parseInt((gTemp.Property1 / 60).toString()) <= 0)
          timeStr = LangManager.Instance.GetTranslation(
            "public.needMinutes",
            gTemp.Property1 % 60,
          );
        else if (gTemp.Property1 % 60 == 0)
          timeStr =
            parseInt((gTemp.Property1 / 60).toString()) +
            LangManager.Instance.GetTranslation("public.time.hour");
        else
          timeStr = LangManager.Instance.GetTranslation(
            "public.needHM",
            parseFloat((gTemp.Property1 / 60).toString()),
            gTemp.Property1 % 60,
          );
        this.txt_time.text = timeStr;
      }
      (this.baseItem as BaseItem).info = value;
      // this.baseItem.icon = IconFactory.getGoodsIconByTID(value.templateInfo.TemplateId);
      // this.baseItem.text = value.count + ""
    } else {
      (this.baseItem as BaseItem).info = null;
    }
  }

  public dispose() {
    super.dispose();
  }
}
