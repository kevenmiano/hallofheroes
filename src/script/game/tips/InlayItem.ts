import FUI_InlayItem from "../../../fui/Base/FUI_InlayItem";
import LangManager from "../../core/lang/LangManager";
import { ArmyManager } from "../manager/ArmyManager";
import { ThaneInfo } from "../datas/playerinfo/ThaneInfo";
import { t_s_itemtemplateData } from "../config/t_s_itemtemplate";
import ConfigMgr from "../../core/config/ConfigMgr";
import { ConfigType } from "../constant/ConfigDefine";
import { GoodsHelp } from "../utils/GoodsHelp";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/5/17 15:54
 * @ver 1.0
 *
 */
export class InlayItem extends FUI_InlayItem {
  private _resArr: string[] = [
    "",
    "Icon_Gem_7",
    "Icon_Gem_1",
    "Icon_Gem_2",
    "Icon_Gem_6",
    "Icon_Gem_5",
    "Icon_Gem_8",
    "Icon_Gem_3",
    "Icon_Gem_4",
    "Icon_GemBox2",
    "Icon_GemBox",
  ];

  private _txtColors: string[] = ["", "#7b7b7b", "#ffffff", "#eedb05"];

  constructor() {
    super();
  }

  public setData(value: number, objectId: number) {
    this.ld_icon.url = fgui.UIPackage.getItemURL(
      "Base",
      this._resArr[
        value == -1 ? 9 : value == 0 ? 10 : this.getColorByType(value)
      ]
    );
    this.txt.color = this._txtColors[value == -1 ? 1 : value == 0 ? 2 : 3];
    this.txt.text =
      value == -1
        ? LangManager.Instance.GetTranslation(
            "yishi.view.tips.goods.InlayItem.value01"
          )
        : value == 0
        ? LangManager.Instance.GetTranslation(
            "yishi.view.tips.goods.InlayItem.value02"
          )
        : this.getDiscription(value, objectId);
  }

  private getDiscription(value: number, objectId: number): string {
    let temp: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_itemtemplate,
      value
    );
    if (!temp) {
      return "";
    }
    if (objectId == this.thane.id) {
      let addValue: number = Math.floor(
        (temp.totalAttribute *
          GoodsHelp.getJewelEffecyByGrade(this.thane.jewelGrades)) /
          100
      );
      if (addValue == 0) {
        return temp.DescriptionLang;
      } else {
        return temp.DescriptionLang + `[color=#48d72a] +${addValue}[/color]`;
      }
    } else {
      return temp.DescriptionLang;
    }
  }

  private getColorByType(value: number): number {
    let temp: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_itemtemplate,
      value
    );
    return temp.Property1;
  }

  private get thane(): ThaneInfo {
    return ArmyManager.Instance.thane;
  }

  dispose() {
    super.dispose();
  }
}
