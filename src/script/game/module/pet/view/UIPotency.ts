import FUI_PetPotencyItem from "../../../../../fui/Pet/FUI_PetPotencyItem";
import ConfigMgr from "../../../../core/config/ConfigMgr";
import LangManager from "../../../../core/lang/LangManager";
import BaseFguiCom from "../../../../core/ui/Base/BaseFguiCom";
import Utils from "../../../../core/utils/Utils";
import { NumericStepper } from "../../../component/NumericStepper";
import { t_s_pettemplateData } from "../../../config/t_s_pettemplate";
import { ConfigType } from "../../../constant/ConfigDefine";
import { BagEvent, PetEvent } from "../../../constant/event/NotificationEvent";
import { GoodsManager } from "../../../manager/GoodsManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import PetCtrl from "../control/PetCtrl";
import { PetData } from "../data/PetData";
import PetModel from "../data/PetModel";
import PetPotencyCell from "./item/PetPotencyCell";

export default class UIPotency extends BaseFguiCom {
  public txtDesc1: fgui.GTextField;
  public txtDesc2: fgui.GTextField;
  public txtDesc3: fgui.GTextField;
  public goodsList: fgui.GList;
  public itemQualification1: FUI_PetPotencyItem;
  public itemQualification2: FUI_PetPotencyItem;
  public itemQualification3: FUI_PetPotencyItem;
  public itemQualification4: FUI_PetPotencyItem;
  public itemQualification5: FUI_PetPotencyItem;
  public btnActive: fgui.GButton;
  public simBox: NumericStepper;
  private _selectItem: PetPotencyCell;
  private _initValue: number = 0; //初始值
  private _petData: PetData;
  public static MAX_VALUE: number = 1000;
  public static MAX_WIDTH: number = 400;
  constructor(comp: fgui.GComponent) {
    super(comp);
    this.addEvent();
    this.initView();
  }

  private initView() {
    for (let i: number = 1; i <= 3; i++) {
      this["txtDesc" + i].text = LangManager.Instance.GetTranslation(
        "petWnd.potency.txtDesc" + i,
      );
    }
    for (let j: number = 1; j <= 5; j++) {
      this["itemQualification" + j].titleTxt.text =
        LangManager.Instance.GetTranslation("petWnd.potency.itemTitleTxt" + j);
    }
    this.simBox.show(0, 0, 0, 0);
    this.goodsList.numItems = 5;
    this.initPetValue();
  }

  private addEvent() {
    GoodsManager.Instance.addEventListener(
      BagEvent.UPDATE_BAG,
      this.__updateNumberHandler,
      this,
    );
    GoodsManager.Instance.addEventListener(
      BagEvent.DELETE_BAG,
      this.__updateNumberHandler,
      this,
    );
    this.goodsList.itemRenderer = Laya.Handler.create(
      this,
      this.renderListItem,
      null,
      false,
    );
    this.goodsList.on(fgui.Events.CLICK_ITEM, this, this.onClickItem);
    this.btnActive.onClick(this, this.btnActiveHandler);
  }

  private removeEvent() {
    GoodsManager.Instance.removeEventListener(
      BagEvent.UPDATE_BAG,
      this.__updateNumberHandler,
      this,
    );
    GoodsManager.Instance.removeEventListener(
      BagEvent.DELETE_BAG,
      this.__updateNumberHandler,
      this,
    );
    this.goodsList.off(fgui.Events.CLICK_ITEM, this, this.onClickItem);
    Utils.clearGListHandle(this.goodsList);
    this.btnActive.offClick(this, this.btnActiveHandler);
    // if (this._petData) this._petData.removeEventListener(PetEvent.PETINFO_CHANGE, this.updatePetValue, this);
  }

  renderListItem(index: number, item: PetPotencyCell) {
    item.info = PetModel.potencyActiveTempIdArr[index];
  }

  private onClickItem(selectedItem: PetPotencyCell) {
    if (!selectedItem) return;
    for (let i: number = 0; i < this.goodsList.numChildren; i++) {
      let item: PetPotencyCell = this.goodsList.getChildAt(i) as PetPotencyCell;
      let count = GoodsManager.Instance.getGoodsNumByTempId(item.info);
      if (item.info == selectedItem.info && count > 0) {
        item.status = 1;
      } else {
        item.status = 0;
      }
    }
    this._selectItem = selectedItem;
    this.__updateNumberHandler();
  }

  private __updateNumberHandler() {
    if (!this._selectItem) return;
    this._initValue = GoodsManager.Instance.getGoodsNumByTempId(
      this._selectItem.info,
    );
    if (this._initValue > 0) {
      let max =
        this.getMaxCost() > this._initValue
          ? this._initValue
          : this.getMaxCost();
      this.simBox.show(0, 1, 1, max);
      this.btnActive.enabled = true;
    } else {
      this.simBox.show(0, 0, 0, 0);
      this.btnActive.enabled = false;
    }
  }

  private initPetValue() {
    for (let j: number = 1; j <= 5; j++) {
      this["itemQualification" + j].progressGroup.visible = false;
    }
  }

  private updatePetValue() {
    for (let j: number = 1; j <= 5; j++) {
      let maxWidth =
        (this.getMaxValue(j) * UIPotency.MAX_WIDTH) / UIPotency.MAX_VALUE; //算出来进度条的最大宽度;
      if (this.getMaxValue(j) > UIPotency.MAX_VALUE) {
        this["itemQualification" + j].progressGroup.visible = true;
        this["itemQualification" + j].commGroup.visible = false;
        this["itemQualification" + j].hpGroup.visible = true;
        (this["itemQualification" + j].prog2 as fgui.GProgressBar).width =
          UIPotency.MAX_WIDTH;
        (this["itemQualification" + j].prog3 as fgui.GProgressBar).width =
          maxWidth - UIPotency.MAX_WIDTH;
        this["itemQualification" + j].txtValue.text =
          this._petData.potencyArr[j - 1] + "/" + this.getMaxValue(j);
        (this["itemQualification" + j].prog2 as fgui.GProgressBar).max =
          UIPotency.MAX_VALUE;
        (this["itemQualification" + j].prog3 as fgui.GProgressBar).max =
          this.getMaxValue(j) - UIPotency.MAX_VALUE;
        if (this._petData.potencyArr[j - 1] > UIPotency.MAX_VALUE) {
          (this["itemQualification" + j].prog2 as fgui.GProgressBar).value =
            UIPotency.MAX_VALUE;
          (this["itemQualification" + j].prog3 as fgui.GProgressBar).value =
            this._petData.potencyArr[j - 1] - UIPotency.MAX_VALUE;
        } else {
          (this["itemQualification" + j].prog2 as fgui.GProgressBar).value =
            this._petData.potencyArr[j - 1];
          (this["itemQualification" + j].prog3 as fgui.GProgressBar).value = 0;
        }
        if (
          this._petData.potencyArr[j - 1] - this._petData.potencyOldArr[j - 1] >
          0
        ) {
          this["itemQualification" + j].addTxt.text =
            "+" +
            (
              this._petData.potencyArr[j - 1] -
              this._petData.potencyOldArr[j - 1]
            ).toString();
          this._petData.potencyOldArr[j - 1] = this._petData.potencyArr[j - 1];
        } else {
          this["itemQualification" + j].addTxt.text = "";
        }
      } else {
        this["itemQualification" + j].progressGroup.visible = true;
        this["itemQualification" + j].commGroup.visible = true;
        this["itemQualification" + j].hpGroup.visible = false;
        (this["itemQualification" + j].prog1 as fgui.GProgressBar).width =
          maxWidth;
        this["itemQualification" + j].txtValue.text =
          this._petData.potencyArr[j - 1] + "/" + this.getMaxValue(j);
        (this["itemQualification" + j].prog1 as fgui.GProgressBar).max =
          this.getMaxValue(j);
        (this["itemQualification" + j].prog1 as fgui.GProgressBar).value =
          this._petData.potencyArr[j - 1];
        if (
          this._petData.potencyArr[j - 1] - this._petData.potencyOldArr[j - 1] >
          0
        ) {
          this["itemQualification" + j].addTxt.text =
            "+" +
            (
              this._petData.potencyArr[j - 1] -
              this._petData.potencyOldArr[j - 1]
            ).toString();
          this._petData.potencyOldArr[j - 1] = this._petData.potencyArr[j - 1];
        } else {
          this["itemQualification" + j].addTxt.text = "";
        }
      }
    }
  }

  //激活
  private btnActiveHandler() {
    if (!this._selectItem) return;
    if (this.hasReciveMax()) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("UIPotency.btnActiveTips"),
      );
      return;
    }
    if (this._initValue == 0) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("wishpoolView.descTxt12"),
      );
      return;
    }
    this._petData.potencyOldArr = this._petData.potencyArr;
    PetCtrl.sendPetPotencyActive(
      this._petData.petId,
      this._selectItem.info,
      this.simBox.value,
    );
  }

  public get data(): PetData {
    return this._petData;
  }

  public set data(value: PetData) {
    if (this._petData) {
      if (this._petData.petId == value.petId) {
        //更新当前英灵的数据
        if (this._selectItem) {
          this.btnActive.enabled = true;
          this.__updateNumberHandler();
        } else {
          this.btnActive.enabled = false;
        }
      } else {
        this._petData = value;
        this.btnActive.enabled = false;
        this._selectItem = null;
        for (let i: number = 0; i < this.goodsList.numChildren; i++) {
          let item: PetPotencyCell = this.goodsList.getChildAt(
            i,
          ) as PetPotencyCell;
          if (item) item.status = 0;
        }
      }
      this.updatePetValue();
    } else {
      //初次设置
      this._petData = value;
      if (this._petData) {
        // this._petData.addEventListener(PetEvent.PETINFO_CHANGE, this.updatePetValue, this);
        this.updatePetValue();
        this.btnActive.enabled = false;
      }
    }
  }

  public resetView() {}

  private getMaxCost(): number {
    let count: number = 0;
    for (let j: number = 1; j <= 5; j++) {
      count += this.getMaxValue(j) - this._petData.potencyArr[j - 1];
    }
    count = Math.ceil(count / 5);
    return count;
  }

  private hasReciveMax(): boolean {
    let flag: boolean = true;
    for (let j: number = 1; j <= 5; j++) {
      if (this._petData.potencyArr[j - 1] < this.getMaxValue(j)) {
        flag = false;
      }
    }
    return flag;
  }

  /**
   *  得到各个属性的潜能最大值
   * @param type 1,2,3,4,5分别为物攻、魔攻、物防、魔防、生命
   * @returns
   */
  private getMaxValue(type: number): number {
    let value = 0;
    let quality: number = Math.floor((this._petData.temQuality - 1) / 5 + 1);
    let tempId: number =
      this._petData.template.TemplateId +
      quality -
      this._petData.template.Quality;
    let currTemp: t_s_pettemplateData = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_pettemplate,
      tempId.toString(),
    );
    switch (type) {
      case 1:
        value = currTemp.AtkPotential;
        break;
      case 2:
        value = currTemp.MatPotential;
        break;
      case 3:
        value = currTemp.DefPotential;
        break;
      case 4:
        value = currTemp.MdfPotential;
        break;
      case 5:
        value = currTemp.HpPotential;
        break;
      default:
        break;
    }
    return value;
  }

  public dispose() {
    this.removeEvent();
    super.dispose();
  }
}
