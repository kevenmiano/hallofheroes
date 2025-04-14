/*
 * @Author: jeremy.xu
 * @Date: 2024-03-07 09:43:49
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-03-19 18:33:46
 * @Description: 失去提示视图
 */
import FUI_SecretLoseTipCom from "../../../../../../../fui/PveSecretScene/FUI_SecretLoseTipCom";
import LangManager from "../../../../../../core/lang/LangManager";
import { SecretEvent } from "../../../../../constant/event/NotificationEvent";
import { SecretType } from "../../../../../datas/secret/SecretConst";
import { NotificationManager } from "../../../../../manager/NotificationManager";
import { SecretTipData } from "../../model/SecretTipData";
import SecretItem from "../SecretItem";

export class SecretLoseTipCom extends FUI_SecretLoseTipCom {
  private _type: SecretType;
  get type(): SecretType {
    return this._type;
  }

  set type(value: SecretType) {
    this._type = value;
  }
  private _info: SecretTipData;
  get info(): SecretTipData {
    return this._info;
  }

  set info(value: SecretTipData) {
    this._info = value;
    if (value) {
      this.list.numItems = this._info.infoList.length;
    } else {
    }
  }

  protected onConstruct() {
    super.onConstruct();
    this.txtTitle.text = LangManager.Instance.GetTranslation(
      "Pve.secretScene.title.lose",
    );
    this.btnContinue.text =
      LangManager.Instance.GetTranslation("public.continue");
    this.list.itemRenderer = Laya.Handler.create(
      this,
      this.onRenderItem,
      null,
      false,
    );
    this.btnContinue.onClick(this, this.btnContinueClick);
  }

  protected onRenderItem(index: number, item: SecretItem) {
    let info = this._info.infoList[index];
    item.info = info;
  }

  private btnContinueClick() {
    NotificationManager.Instance.dispatchEvent(SecretEvent.GAIN_TRESURE);
  }
}
