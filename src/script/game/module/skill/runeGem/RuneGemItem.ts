//@ts-expect-error: External dependencies
import FUI_RuneGemItem from "../../../../../fui/Skill/FUI_RuneGemItem";
import LangManager from "../../../../core/lang/LangManager";
import { BaseItem } from "../../../component/item/BaseItem";
import { EmWindow } from "../../../constant/UIDefine";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { TipsShowType } from "../../../tips/ITipedDisplay";

/**
 * 符石装备背包子项
 */
export class RuneGemItem extends FUI_RuneGemItem {
  private _info: GoodsInfo;
  public item: BaseItem;

  get info(): GoodsInfo {
    return this._info;
  }

  set info(value: GoodsInfo) {
    this._info = value;
    this.item.getChild("back").visible = false;
    this.item.getChild("profile").visible = false;
    this.item.showType = TipsShowType.onClick;
    this.item.info = value;
    // if (!this._registed) {
    //     this.registerMediator();
    // }
    if (value) {
      this.item.tipType = EmWindow.RuneTip;
      this.txt_num.text = LangManager.Instance.GetTranslation(
        "public.level3",
        value.strengthenGrade,
      );
      this.txt_num.visible = true;
    }
  }
}
