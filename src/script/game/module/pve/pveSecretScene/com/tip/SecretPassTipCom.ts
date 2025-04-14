import FUI_SecretPassTipCom from "../../../../../../../fui/PveSecretScene/FUI_SecretPassTipCom";
import { SecretType } from "../../../../../datas/secret/SecretConst";
import { ArmyManager } from "../../../../../manager/ArmyManager";
import { CampaignSocketOutManager } from "../../../../../manager/CampaignSocketOutManager";
import { SecretTipData } from "../../model/SecretTipData";
import SecretItem from "../SecretItem";

/*
 * @Author: jeremy.xu
 * @Date: 2024-02-26 17:41:31
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-03-19 11:50:02
 * @Description: 通关提示视图
 */
export class SecretPassTipCom extends FUI_SecretPassTipCom {
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
    this.list.itemRenderer = Laya.Handler.create(
      this,
      this.onRenderItem,
      null,
      false,
    );
    this.btnConfirm.onClick(this, this.btnConfirmClick);
  }

  protected onRenderItem(index: number, item: SecretItem) {
    let info = this._info.infoList[index];
    item.info = info;
  }

  private btnConfirmClick() {
    CampaignSocketOutManager.Instance.sendReturnCampaignRoom(
      this.currentArmyId,
    );
  }

  private get currentArmyId(): number {
    var bArmy: any = ArmyManager.Instance.army;
    if (bArmy) {
      return bArmy.id;
    }
    return 0;
  }
}
