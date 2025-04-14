//@ts-expect-error: External dependencies
/*
 * @Author: jeremy.xu
 * @Date: 2021-08-12 17:53:47
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2021-11-04 14:33:42
 * @Description: 选择修炼宠物列表项
 */

import FUI_FarmPetListItem from "../../../../../../fui/Farm/FUI_FarmPetListItem";
import { IconFactory } from "../../../../../core/utils/IconFactory";
import { PetData } from "../../../pet/data/PetData";
import LangManager from "../../../../../core/lang/LangManager";

export class FarmPetListItem extends FUI_FarmPetListItem {
  private _info: PetData;
  public get info(): PetData {
    return this._info;
  }

  public set info(value: PetData) {
    this._info = value;
    if (value) {
      this.title = value.template.TemplateNameLang;
      this.getChild("title").asLabel.color = PetData.getQualityColor(
        this._info.quality - 1,
      );
      this.icon = IconFactory.getPetHeadSmallIcon(value.templateId);
      this.txtLevel.text = LangManager.Instance.GetTranslation(
        "public.level2",
        value.grade,
      );
    } else {
      this.title = "";
      this.icon = "";
      this.txtLevel.text = "";
    }
  }

  public dispose() {
    super.dispose();
  }
}
