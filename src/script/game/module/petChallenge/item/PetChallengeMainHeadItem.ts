//@ts-expect-error: External dependencies
/*
 * @Author: jeremy.xu
 * @Date: 2021-11-08 15:17:02
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-06-12 12:08:40
 * @Description: 英灵头像Item - 英灵主界面
 */

import FUI_PetChallengeMainHeadItem from "../../../../../fui/PetChallenge/FUI_PetChallengeMainHeadItem";
import { PetData } from "../../pet/data/PetData";
import { BaseItem } from "../../../component/item/BaseItem";
import { PetTipType } from "../../../constant/PetDefine";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";

export class PetChallengeMainHeadItem extends FUI_PetChallengeMainHeadItem {
  onConstruct() {
    super.onConstruct();
  }

  private _info: PetData;
  public get info(): PetData {
    return this._info;
  }

  public set info(value: PetData) {
    this._info = value;
    if (value) {
      let gInfo = new GoodsInfo();
      gInfo.petData = value;
      // this.item.icon = IconFactory.getPetHeadSmallIcon(value.templateId);
      (this.item as BaseItem).info = gInfo;
      this.imgFlag.visible = true;
      this.txtCapacity.text = value.fightPower.toString();
    } else {
      (this.item as BaseItem).info = null;
      this.imgFlag.visible = false;
      this.txtCapacity.text = "";
    }
  }

  public dispose() {}
}
