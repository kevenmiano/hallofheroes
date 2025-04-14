//@ts-expect-error: External dependencies
import FUI_SecretItem from "../../../../../../fui/PveSecretScene/FUI_SecretItem";
import { BaseItem } from "../../../../component/item/BaseItem";
import SecretTresureItem from "../../../../component/item/SecretTresureItem";
import { SecretDropType } from "../../../../datas/secret/SecretConst";
import { SecretItemInfo } from "../../../../datas/secret/SecretItemInfo";

/*
 * @Author: jeremy.xu
 * @Date: 2024-03-12 12:28:24
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-04-26 15:04:27
 * @Description: 秘境物品Item 秘宝或物品
 */
export default class SecretItem extends FUI_SecretItem {
  private _info: SecretItemInfo;

  get info(): SecretItemInfo {
    return this._info;
  }

  set info(value: SecretItemInfo) {
    this._info = value;
    if (value) {
      this.cType.setSelectedIndex(Number(value.dropType));
      if (value.dropType == SecretDropType.Tresure) {
        (this.secretItem as SecretTresureItem).info = value.secretInfo;
      } else if (value.dropType == SecretDropType.Item) {
        (this.baseItem as BaseItem).showName = true;
        (this.baseItem as BaseItem).info = value.itemGoodInfo;
      }
    } else {
      this.txtTitle.visible = false;
      this.cType.setSelectedIndex(0);
    }
  }

  dispose() {
    super.dispose();
  }
}
