//@ts-expect-error: External dependencies
/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-02-19 11:40:58
 * @LastEditTime: 2023-05-16 15:20:54
 * @LastEditors: jeremy.xu
 * @Description:
 */

import FUI_PetArtifactItem from "../../../../../fui/Pet/FUI_PetArtifactItem";
import LangManager from "../../../../core/lang/LangManager";
import BaseFguiCom from "../../../../core/ui/Base/BaseFguiCom";
import UIButton from "../../../../core/ui/UIButton";
import { NumericStepper } from "../../../component/NumericStepper";
import BaseTipItem from "../../../component/item/BaseTipItem";
import TemplateIDConstant from "../../../constant/TemplateIDConstant";
import { BagEvent } from "../../../constant/event/NotificationEvent";
import { GoodsManager } from "../../../manager/GoodsManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { SharedManager } from "../../../manager/SharedManager";
import FUIHelper from "../../../utils/FUIHelper";
import { GoodsCheck } from "../../../utils/GoodsCheck";
import PetCtrl from "../control/PetCtrl";
import { PetData } from "../data/PetData";
import PetModel from "../data/PetModel";

export default class UIAttrIntensify extends BaseFguiCom {
  public simBox: NumericStepper;
  /**开启数量变更处理 */
  private _openNumberChangeHandler: Laya.Handler;

  private btnNormal: UIButton;
  private btnAdvanced: UIButton;
  private txtCost: fgui.GLabel;
  private txtCostAdvanced: fgui.GLabel;

  private itemQualification1: FUI_PetArtifactItem;
  private itemQualification2: FUI_PetArtifactItem;
  private itemQualification3: FUI_PetArtifactItem;
  private itemQualification4: FUI_PetArtifactItem;

  private _strengthOld: number = 0;
  private _intellectOld: number = 0;
  private _staminaOld: number = 0;
  private _armorOld: number = 0;

  private multi: number = 10; //倍数

  private advancedCost: number = 1; //单次消耗个数
  private _needMax: number = 0;
  public tipItem1: BaseTipItem;
  public tipItem2: BaseTipItem;
  public static MAX_VALUE: number = 10000;
  public static MAX_WIDTH: number = 400;
  /**高阶强化消耗 */
  private get multiAdvancedCost(): number {
    return this.multi * this.advancedCost;
  }

  /**高阶强化次数 */
  private get multiAdvancedCount(): number {
    return this.multi;
  }

  constructor(comp: fgui.GComponent) {
    super(comp);
    this.initView();
    this.addEvent();
  }

  private addEvent() {
    this.btnNormal.onClick(this, this.__trainHandler);
    this.btnAdvanced.onClick(this, this.__trainHandler);
    GoodsManager.Instance.addEventListener(
      BagEvent.UPDATE_BAG,
      this.__onUpdateNumberHandler,
      this,
    );
  }

  private removeEvent() {
    GoodsManager.Instance.removeEventListener(
      BagEvent.UPDATE_BAG,
      this.__onUpdateNumberHandler,
      this,
    );
  }

  private initView() {
    let colon = LangManager.Instance.GetTranslation("public.colon2");
    this.itemQualification1.titleTxt.text =
      LangManager.Instance.GetTranslation("pet.strengthCoe") + colon;
    this.itemQualification2.titleTxt.text =
      LangManager.Instance.GetTranslation("pet.armorCoe") + colon;
    this.itemQualification3.titleTxt.text =
      LangManager.Instance.GetTranslation("pet.intellectCoe") + colon;
    this.itemQualification4.titleTxt.text =
      LangManager.Instance.GetTranslation("pet.staminaCoe") + colon;
    this.itemQualification1.progressGroup.visible = false;
    this.itemQualification2.progressGroup.visible = false;
    this.itemQualification3.progressGroup.visible = false;
    this.itemQualification4.progressGroup.visible = false;
    this.tipItem1.setInfo(
      TemplateIDConstant.TEMP_ID_PET_COE_STONE,
      true,
      FUIHelper.getItemURL("Base", "Icon_Unit_Sepulcrum_L"),
    );
    this.tipItem2.setInfo(TemplateIDConstant.TEMP_ID_PET_COE_STONE);
  }

  private _lastCickTime1: number = 0;
  private __trainHandler(target: fgui.GComponent, evt: any) {
    let time: number = new Date().getTime();
    if (time - this._lastCickTime1 < 500) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "activity.view.ActivityItem.command01",
        ),
      );
      return;
    } else {
      this._lastCickTime1 = time;
    }

    if (!PetModel.hasPet) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("pet.PetFrame.notHasPet"),
      );
    }
    if (!this.data) return;

    if (this.data.isFullRes()) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("PetStrengthenView.isFullRes"),
      );
      return;
    }

    this.normalTrain();
  }

  private normalTrain() {
    if (!this.checkGrowthStone(this.multiAdvancedCost)) {
      return;
    }

    this.checkUseBindForNoramlBack(true, true);
  }

  private checkUseBindForNoramlBack(result: boolean, payType: boolean) {
    let type: number = 0;
    if (result) {
      if (!payType) {
        type = 2;
      }
      this.normalTrain2(type);
      SharedManager.Instance.petadvanceWillbeBindCheckDate3 = new Date();
      SharedManager.Instance.petadvanceWillbeBindCheck3 = type;
      SharedManager.Instance.savePetadvanceWillbeBindCheck3();
    } else {
      this.normalTrain2(type);
    }
  }

  private normalTrain2(useGoodsType: number) {
    PetCtrl.trainCoe(this.data.petId, this.multiAdvancedCost, useGoodsType);
  }

  private __onUpdateNumberHandler(e: BagEvent = null) {
    this.txtCost.text = this.advancedCost.toString();
    this.txtCostAdvanced.text = this.multiAdvancedCount.toString();

    this._openNumberChangeHandler && this._openNumberChangeHandler.recover();
    this._openNumberChangeHandler = Laya.Handler.create(
      this,
      this.onOpenNumberChangeHandler,
      null,
      false,
    );

    this.multi =
      this.growthStoneCount < this.multi
        ? this.growthStoneCount < 1
          ? 1
          : this.growthStoneCount
        : this.multi;
    this._needMax = this.getMaxCostValue();
    this.simBox.show(
      0,
      this.multi,
      1,
      this.growthStoneCount < this._needMax
        ? this.growthStoneCount
        : this._needMax,
      this.growthStoneCount < this._needMax
        ? this.growthStoneCount
        : this._needMax,
      10,
      this._openNumberChangeHandler,
    );
  }

  private _data: PetData;

  public get data(): PetData {
    return this._data;
  }

  public set data(value: PetData) {
    if (value) {
      if (!this._data) {
        this._strengthOld = value.coeStrength;
        this._intellectOld = value.coeIntellect;
        this._staminaOld = value.coeStamina;
        this._armorOld = value.coeArmor;
      } else if (value.petId != this._data.petId) {
        this._strengthOld = value.coeStrength;
        this._intellectOld = value.coeIntellect;
        this._staminaOld = value.coeStamina;
        this._armorOld = value.coeArmor;
        this.multi = 10;
      }
    }
    this.clearAllTimeout();
    this._data = value;
    if (this._data) {
      this.updatePetValue();
    } else {
      this.resetView();
    }
    this.__onUpdateNumberHandler();
  }

  /**数量变更处理 */
  private onOpenNumberChangeHandler(value: number) {
    this.multi = value;
  }

  private updatePetValue() {
    for (let j: number = 1; j <= 4; j++) {
      let maxWidth =
        (this.getMaxValue(j) * UIAttrIntensify.MAX_WIDTH) /
        UIAttrIntensify.MAX_VALUE; //算出来进度条的最大宽度;
      if (this.getMaxValue(j) > UIAttrIntensify.MAX_VALUE) {
        this["itemQualification" + j].progressGroup.visible = true;
        this["itemQualification" + j].commGroup.visible = false;
        this["itemQualification" + j].hpGroup.visible = true;
        (this["itemQualification" + j].prog2 as fgui.GProgressBar).width =
          UIAttrIntensify.MAX_WIDTH;
        (this["itemQualification" + j].prog3 as fgui.GProgressBar).width =
          maxWidth - UIAttrIntensify.MAX_WIDTH;
        this["itemQualification" + j].txtValue.text =
          this.getCurrentValue(j) + "/" + this.getMaxValue(j);
        (this["itemQualification" + j].prog2 as fgui.GProgressBar).max =
          UIAttrIntensify.MAX_VALUE;
        (this["itemQualification" + j].prog3 as fgui.GProgressBar).max =
          this.getMaxValue(j) - UIAttrIntensify.MAX_VALUE;
        if (this.getCurrentValue(j) > UIAttrIntensify.MAX_VALUE) {
          (this["itemQualification" + j].prog2 as fgui.GProgressBar).value =
            UIAttrIntensify.MAX_VALUE;
          (this["itemQualification" + j].prog3 as fgui.GProgressBar).value =
            this.getCurrentValue(j) - UIAttrIntensify.MAX_VALUE;
        } else {
          (this["itemQualification" + j].prog2 as fgui.GProgressBar).value =
            this.getCurrentValue(j);
          (this["itemQualification" + j].prog3 as fgui.GProgressBar).value = 0;
        }
      } else {
        this["itemQualification" + j].progressGroup.visible = true;
        this["itemQualification" + j].commGroup.visible = true;
        this["itemQualification" + j].hpGroup.visible = false;
        (this["itemQualification" + j].prog1 as fgui.GProgressBar).width =
          maxWidth;
        this["itemQualification" + j].txtValue.text =
          this.getCurrentValue(j) + "/" + this.getMaxValue(j);
        (this["itemQualification" + j].prog1 as fgui.GProgressBar).max =
          this.getMaxValue(j);
        (this["itemQualification" + j].prog1 as fgui.GProgressBar).value =
          this.getCurrentValue(j);
      }
    }

    this.itemQualification1.addTxt.text = "";
    this.itemQualification2.addTxt.text = "";
    this.itemQualification3.addTxt.text = "";
    this.itemQualification4.addTxt.text = "";

    let result = this._data.coeStrength - this._strengthOld;
    if (result > 0) {
      this.itemQualification1.addTxt.text = "+" + result;
    }

    result = this._data.coeArmor - this._armorOld;
    if (result > 0) {
      this.itemQualification2.addTxt.text = "+" + result;
    }

    result = this._data.coeIntellect - this._intellectOld;
    if (result > 0) {
      this.itemQualification3.addTxt.text = "+" + result;
    }

    result = this._data.coeStamina - this._staminaOld;
    if (result > 0) {
      this.itemQualification4.addTxt.text = "+" + result;
    }

    this._strengthOld = this._data.coeStrength;
    this._intellectOld = this._data.coeIntellect;
    this._staminaOld = this._data.coeStamina;
    this._armorOld = this._data.coeArmor;
  }

  private getMaxCostValue(): number {
    let value: number = 0;
    if (!this._data) {
      return 0;
    }
    for (let i: number = 1; i <= 4; i++) {
      if (i == 1) {
        value = this._data.coeStrengthLimit - this._data.coeStrength;
      } else if (i == 2) {
        value += this._data.coeArmorLimit - this._data.coeArmor;
      } else if (i == 3) {
        value += this._data.coeIntellectLimit - this._data.coeIntellect;
      } else if (i == 4) {
        value += this._data.coeStaminaLimit - this._data.coeStamina;
      }
    }
    return value;
  }

  private getCurrentValue(type: number): number {
    let value = 0;
    switch (type) {
      case 1:
        value = this._data.coeStrength;
        break;
      case 2:
        value = this._data.coeArmor;
        break;
      case 3:
        value = this._data.coeIntellect;
        break;
      case 4:
        value = this._data.coeStamina;
        break;
    }
    return value;
  }

  private getMaxValue(type: number): number {
    let value = 0;
    switch (type) {
      case 1:
        value = this._data.coeStrengthLimit;
        break;
      case 2:
        value = this._data.coeArmorLimit;
        break;
      case 3:
        value = this._data.coeIntellectLimit;
        break;
      case 4:
        value = this._data.coeStaminaLimit;
        break;
    }
    return value;
  }

  /**当前圣魂石数量 */
  private get growthStoneCount(): number {
    let num: number = GoodsManager.Instance.getGoodsNumByTempId(
      GoodsCheck.PET_COE_STONE,
    );
    return num;
  }

  private checkGrowthStone(value: number): boolean {
    let userCount = this.growthStoneCount;
    if (userCount < value) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "PetStrengthenView.notEnougthGoods",
        ),
      );
      return false;
    }
    return true;
  }

  public resetView(lastTabIndex: boolean = false) {
    if (!lastTabIndex) {
      return;
    }
    this._data = null;
    this.itemQualification1.txtValue.text = "";
    this.itemQualification2.txtValue.text = "";
    this.itemQualification3.txtValue.text = "";
    this.itemQualification4.txtValue.text = "";
    this.itemQualification1.prog1.value = 0;
    this.itemQualification2.prog1.value = 0;
    this.itemQualification3.prog1.value = 0;
    this.itemQualification4.prog1.value = 0;
    this.itemQualification4.prog2.value = 0;
    this.itemQualification4.prog3.value = 0;
    this.itemQualification1.addTxt.text = "";
    this.itemQualification2.addTxt.text = "";
    this.itemQualification3.addTxt.text = "";
    this._strengthOld = 0;
    this._intellectOld = 0;
    this._staminaOld = 0;
    this._armorOld = 0;
  }

  private clearAllTimeout() {}

  public dispose() {
    this.removeEvent();
    this.clearAllTimeout();
    super.dispose();
  }
}
