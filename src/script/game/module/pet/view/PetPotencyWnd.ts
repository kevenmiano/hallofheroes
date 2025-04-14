//@ts-expect-error: External dependencies
/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-02-19 11:40:58
 * @LastEditTime: 2021-12-24 11:30:23
 * @LastEditors: jeremy.xu
 * @Description:
 */

import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { NumericStepper } from "../../../component/NumericStepper";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import LangManager from "../../../../core/lang/LangManager";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import ConfigInfosTempInfo from "../../../datas/ConfigInfosTempInfo";
import { PlayerInfo } from "../../../datas/playerinfo/PlayerInfo";
import { PlayerManager } from "../../../manager/PlayerManager";
import RechargeAlertMannager from "../../../manager/RechargeAlertMannager";
import { SharedManager } from "../../../manager/SharedManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import PetCtrl from "../control/PetCtrl";
import { PetData } from "../data/PetData";
import UIButton from "../../../../core/ui/UIButton";
import { PetEvent } from "../../../constant/event/NotificationEvent";

export default class PetPotencyWnd extends BaseWindow {
  private _data: PetData;
  private _remainPoint: number = 0;
  /** [力量, 智力, 体质, 护甲] */
  private _allocation: number[] = [0, 0, 0, 0];

  private txtPotencyValue: fgui.GLabel;
  private txtPower: fgui.GLabel;
  private txtPowerAdd: fgui.GLabel;
  private txtArmor: fgui.GLabel;
  private txtArmorAdd: fgui.GLabel;
  private txtIntelligence: fgui.GLabel;
  private txtIntelligenceAdd: fgui.GLabel;
  private txtStamina: fgui.GLabel;
  private txtStaminaAdd: fgui.GLabel;

  private btnPowerPlus: UIButton;
  private btnArmorPlus: UIButton;
  private btnIntelligencePlus: UIButton;
  private btnStaminaPlus: UIButton;
  private btnPowerMinus: UIButton;
  private btnArmorMinus: UIButton;
  private btnIntelligenceMinus: UIButton;
  private btnStaminaMinus: UIButton;

  private tfPower: fgui.GTextInput;
  private tfArmor: fgui.GTextInput;
  private tfIntelligence: fgui.GTextInput;
  private tfStamina: fgui.GTextInput;

  private btnWash: UIButton;
  private btnRcommend: UIButton;
  private btnConfirm: UIButton;

  public OnInitWind() {
    super.OnInitWind();
    this.setCenter();
  }

  OnShowWind() {
    super.OnShowWind();

    this.btnPowerPlus.onClick(this, this.__stepHandler);
    this.btnPowerMinus.onClick(this, this.__stepHandler);
    this.btnStaminaPlus.onClick(this, this.__stepHandler);
    this.btnStaminaMinus.onClick(this, this.__stepHandler);
    this.btnIntelligencePlus.onClick(this, this.__stepHandler);
    this.btnIntelligenceMinus.onClick(this, this.__stepHandler);
    this.btnArmorPlus.onClick(this, this.__stepHandler);
    this.btnArmorMinus.onClick(this, this.__stepHandler);

    this.addEvent();
    this.data = this.frameData;
  }

  OnHideWind() {
    super.OnHideWind();
    this.delEvent();
  }

  private addEvent() {
    this.tfPower.on(Laya.Event.BLUR, this, this.__onTxtChangePower);
    this.tfArmor.on(Laya.Event.BLUR, this, this.__onTxtChangeArmor);
    this.tfIntelligence.on(Laya.Event.BLUR, this, this.__onTxtIntelligence);
    this.tfStamina.on(Laya.Event.BLUR, this, this.__onTxtChangeStamina);
    this.playerInfo.addEventListener(
      PetEvent.PET_UPDATE,
      this.__updatePetHandler,
      this,
    );
  }

  private delEvent() {
    if (this.playerInfo) {
      this.playerInfo.removeEventListener(
        PetEvent.PET_UPDATE,
        this.__updatePetHandler,
        this,
      );
    }
  }

  private __onTxtChangePower() {
    let curValue = Number(this.tfPower.text);
    // 输入之前的值
    let beforeValue = this._data.strength + this._allocation[0];
    // 剩余可分配点
    let remCnt =
      this._data.remainPoint -
      (this._allocation[0] +
        this._allocation[1] +
        this._allocation[2] +
        this._allocation[3]);
    if (remCnt <= 0) {
      this.tfPower.text = beforeValue.toString();
      return;
    }

    if (this._data.strength > curValue) {
      this.tfPower.text = this._data.strength.toString();
    } else if (curValue > remCnt + beforeValue) {
      this.tfPower.text = (remCnt + beforeValue).toString();
    }

    let afterValue = Number(this.tfPower.text);
    let delta = afterValue - beforeValue;

    this._allocation[0] += delta;
    this._remainPoint -= delta;

    this.refresh();
  }

  private __onTxtChangeArmor() {
    let curValue = Number(this.tfArmor.text);
    // 输入之前的值
    let beforeValue = this._data.strength + this._allocation[3];
    // 剩余可分配点
    let remCnt =
      this._data.remainPoint -
      (this._allocation[0] +
        this._allocation[1] +
        this._allocation[2] +
        this._allocation[3]);
    if (remCnt <= 0) {
      this.tfArmor.text = beforeValue.toString();
      return;
    }

    if (this._data.strength > curValue) {
      this.tfArmor.text = this._data.strength.toString();
    } else if (curValue > remCnt + beforeValue) {
      this.tfArmor.text = (remCnt + beforeValue).toString();
    }

    let afterValue = Number(this.tfArmor.text);
    let delta = afterValue - beforeValue;

    this._allocation[3] += delta;
    this._remainPoint -= delta;

    this.refresh();
  }

  private __onTxtIntelligence() {
    let curValue = Number(this.tfIntelligence.text);
    // 输入之前的值
    let beforeValue = this._data.strength + this._allocation[1];
    // 剩余可分配点
    let remCnt =
      this._data.remainPoint -
      (this._allocation[0] +
        this._allocation[1] +
        this._allocation[2] +
        this._allocation[3]);
    if (remCnt <= 0) {
      this.tfIntelligence.text = beforeValue.toString();
      return;
    }

    if (this._data.strength > curValue) {
      this.tfIntelligence.text = this._data.strength.toString();
    } else if (curValue > remCnt + beforeValue) {
      this.tfIntelligence.text = (remCnt + beforeValue).toString();
    }

    let afterValue = Number(this.tfIntelligence.text);
    let delta = afterValue - beforeValue;

    this._allocation[1] += delta;
    this._remainPoint -= delta;

    this.refresh();
  }

  private __onTxtChangeStamina() {
    let curValue = Number(this.tfStamina.text);
    // 输入之前的值
    let beforeValue = this._data.strength + this._allocation[2];
    // 剩余可分配点
    let remCnt =
      this._data.remainPoint -
      (this._allocation[0] +
        this._allocation[1] +
        this._allocation[2] +
        this._allocation[3]);
    if (remCnt <= 0) {
      this.tfStamina.text = beforeValue.toString();
      return;
    }

    if (this._data.strength > curValue) {
      this.tfStamina.text = this._data.strength.toString();
    } else if (curValue > remCnt + beforeValue) {
      this.tfStamina.text = (remCnt + beforeValue).toString();
    }

    let afterValue = Number(this.tfStamina.text);
    let delta = afterValue - beforeValue;

    this._allocation[2] += delta;
    this._remainPoint -= delta;

    this.refresh();
  }

  private __updatePetHandler(value: PetData) {
    this.data = value;
  }

  private set data(value: PetData) {
    this._data = value;
    if (this._data) {
      this._remainPoint = this._data.remainPoint;
      this.refresh();
    } else {
      this.resetView();
    }
  }

  private refresh() {
    this.tfPower.color = this._allocation[0] > 0 ? "#39a82d" : "#94866e";
    this.tfStamina.color = this._allocation[2] > 0 ? "#39a82d" : "#94866e";
    this.tfIntelligence.color = this._allocation[1] > 0 ? "#39a82d" : "#94866e";
    this.tfArmor.color = this._allocation[3] > 0 ? "#39a82d" : "#94866e";
    this.tfPower.text = (this._data.strength + this._allocation[0]).toString();
    this.tfStamina.text = (this._data.stamina + this._allocation[2]).toString();
    this.tfIntelligence.text = (
      this._data.intellect + this._allocation[1]
    ).toString();
    this.tfArmor.text = (this._data.armor + this._allocation[3]).toString();

    this.txtPowerAdd.text =
      this._allocation[0] > 0 ? this._allocation[0].toString() : "";
    this.txtStaminaAdd.text =
      this._allocation[2] > 0 ? this._allocation[2].toString() : "";
    this.txtIntelligenceAdd.text =
      this._allocation[1] > 0 ? this._allocation[1].toString() : "";
    this.txtArmorAdd.text =
      this._allocation[3] > 0 ? this._allocation[3].toString() : "";

    this.txtPotencyValue.text = this._remainPoint.toString();

    var plusEnable: boolean = false;
    var confirmEnable: boolean = false;
    if (this._data.remainPoint > 0) {
      plusEnable = this._remainPoint > 0;
      confirmEnable = this._remainPoint < this._data.remainPoint;
    }

    this.btnWash.enabled = false;
    this.btnRcommend.enabled = plusEnable;
    this.btnConfirm.enabled = confirmEnable;
    this.btnWash.enabled =
      this._data.remainPoint !=
      (this._data.grade - 1) * PetData.EACH_LEVEL_POINT;

    this.btnPowerPlus.enabled = plusEnable;
    this.btnStaminaPlus.enabled = plusEnable;
    this.btnIntelligencePlus.enabled = plusEnable;
    this.btnArmorPlus.enabled = plusEnable;
    this.btnPowerMinus.enabled = this._allocation[0] > 0;
    this.btnStaminaMinus.enabled = this._allocation[2] > 0;
    this.btnIntelligenceMinus.enabled = this._allocation[1] > 0;
    this.btnArmorMinus.enabled = this._allocation[3] > 0;
  }

  private resetView() {
    this._remainPoint = 0;
  }

  private __stepHandler(target: any, offset: number) {
    switch (target) {
      case this.btnPowerPlus.view:
        if (this._remainPoint <= 0) return;
        this._allocation[0]++;
        this._remainPoint--;
        break;
      case this.btnPowerMinus.view:
        if (this._allocation[0] <= 0) return;
        this._allocation[0]--;
        this._remainPoint++;
        break;
      case this.btnStaminaPlus.view:
        if (this._remainPoint <= 0) return;
        this._allocation[2]++;
        this._remainPoint--;
        break;
      case this.btnStaminaMinus.view:
        if (this._allocation[2] <= 0) return;
        this._allocation[2]--;
        this._remainPoint++;
        break;
      case this.btnIntelligencePlus.view:
        if (this._remainPoint <= 0) return;
        this._allocation[1]++;
        this._remainPoint--;
        break;
      case this.btnIntelligenceMinus.view:
        if (this._allocation[1] <= 0) return;
        this._allocation[1]--;
        this._remainPoint++;
        break;
      case this.btnArmorPlus.view:
        if (this._remainPoint <= 0) return;
        this._allocation[3]++;
        this._remainPoint--;
        break;
      case this.btnArmorMinus.view:
        if (this._allocation[3] <= 0) return;
        this._allocation[3]--;
        this._remainPoint++;
        break;
      default:
        break;
    }
    this.refresh();
  }

  private btnRcommendClick() {
    if (!this._data) return;
    if (!this._data.template) return;
    if (this._data.remainPoint <= 0) return;

    this._allocation = [0, 0, 0, 0];
    switch (this._data.template.PetType) {
      case 101:
      case 104:
      case 105:
        //力+2, 体+2
        this._allocation[0] = Number(Math.ceil(this._data.remainPoint / 2));
        this._allocation[2] = this._data.remainPoint - this._allocation[0];
        break;
      case 102:
      case 103:
      case 106:
        //智+2, 体+2
        this._allocation[1] = Number(Math.ceil(this._data.remainPoint / 2));
        this._allocation[2] = this._data.remainPoint - this._allocation[1];
        break;
      default:
        break;
    }
    this._remainPoint = 0;
    this.refresh();
  }

  private btnConfirmClick() {
    if (!this._data) return;
    let flag: boolean = false;
    for (let i = 0; i < this._allocation.length; i++) {
      if (this._allocation[i] > 0) {
        flag = true;
        break;
      }
    }

    if (flag) {
      PetCtrl.addPoint(this._data.petId, this._allocation);
      this._allocation = [0, 0, 0, 0];
      this._remainPoint = 0;
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("GrowthInfoView.addPointSucc"),
      );
    }
  }

  private btnWashClick() {
    if (!this._data) return;
    if (
      this._data.remainPoint ==
      (this._data.grade - 1) * PetData.EACH_LEVEL_POINT
    ) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("GrowthInfoView.noNeedWash"),
      );
      return;
    }

    let content: string = LangManager.Instance.GetTranslation(
      "pet.PetFrame.washPointTip",
      this.washPrice,
    );
    let checkStr = LangManager.Instance.GetTranslation(
      "mainBar.view.VipCoolDownFrame.useBind",
    );
    let checkStr2 = LangManager.Instance.GetTranslation(
      "mainBar.view.VipCoolDownFrame.promptTxt",
    );
    SimpleAlertHelper.Instance.Show(
      SimpleAlertHelper.USEBINDPOINT_ALERT,
      {
        checkRickText: checkStr,
        checkRickText2: checkStr2,
        checkDefault: true,
      },
      null,
      content,
      null,
      null,
      this.__btnWashClick.bind(this),
    );
  }

  private _cost: number = 0;
  private get washPrice(): number {
    if (this._cost == 0) {
      this._cost = 100;
      let temp: ConfigInfosTempInfo =
        TempleteManager.Instance.getConfigInfoByConfigName("pet_reset_att");
      if (temp) {
        this._cost = parseInt(temp.ConfigValue);
      }
    }
    return this._cost;
  }

  private __btnWashClick(
    result: boolean,
    flag: boolean,
    id: number = 0,
    type: number = 0,
  ) {
    if (!this._data) return;
    if (!result) return;

    if (this.willUsedBindForWash(flag)) {
      if (this._data.isBind) {
        this.doWash(true);
        return;
      } else {
        this.checkUseBind();
        return;
      }
    }
    this.doWash(flag);
  }

  /**
   *  [洗点] 检测是否会使用到绑定钻石
   * @param useBind 玩家是否选择使用绑定钻石
   */
  private willUsedBindForWash(useBind: boolean): boolean {
    if (!useBind) return false;
    let cost: number = 100;
    let temp: ConfigInfosTempInfo =
      TempleteManager.Instance.getConfigInfoByConfigName("pet_reset_att");
    if (temp) {
      cost = parseInt(temp.ConfigValue);
    }
    return PlayerManager.Instance.currentPlayerModel.playerInfo.giftToken > 0;
  }

  private checkUseBind() {
    let content: string = LangManager.Instance.GetTranslation(
      "PetAdvancedView.useBindPointTip",
    );
    let checkStr = LangManager.Instance.GetTranslation(
      "mainBar.view.VipCoolDownFrame.useBind",
    );
    let checkStr2 = LangManager.Instance.GetTranslation(
      "mainBar.view.VipCoolDownFrame.promptTxt",
    );
    SimpleAlertHelper.Instance.Show(
      SimpleAlertHelper.USEBINDPOINT_ALERT,
      {
        checkRickText: checkStr,
        checkRickText2: checkStr2,
        checkDefault: true,
      },
      null,
      content,
      null,
      null,
      this.__checkUseBind.bind(this),
    );
  }

  private __checkUseBind(result: boolean, flag: boolean) {
    this.doWash(flag);

    if (result) {
      SharedManager.Instance.petadvanceWillbeBindCheckDate6 = new Date();
      SharedManager.Instance.petadvanceWillbeBindCheck6 = true;

      SharedManager.Instance.savePetadvanceWillbeBindCheck6();
    }
  }

  private doWash(useBind: boolean) {
    if (!this._data) return;
    let player: PlayerInfo =
      PlayerManager.Instance.currentPlayerModel.playerInfo;
    if (
      player.allPoint < this.washPrice ||
      (!useBind && player.point < this.washPrice)
    ) {
      RechargeAlertMannager.Instance.show();
      return;
    }

    PetCtrl.washPoint(this._data.petId, useBind);
  }

  public get playerInfo(): PlayerInfo {
    return PlayerManager.Instance.currentPlayerModel.playerInfo;
  }
}
