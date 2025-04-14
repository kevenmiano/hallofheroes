//@ts-expect-error: External dependencies
import FUI_EquipHoldBagItem from "../../../../../fui/Skill/FUI_EquipHoldBagItem";
import { BagType } from "../../../constant/BagDefine";
import { ItemSelectState } from "../../../constant/Const";
import GoodsSonType from "../../../constant/GoodsSonType";
import { EmWindow } from "../../../constant/UIDefine";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { Enum_BagGridState } from "../../bag/model/Enum_BagState";
import SkillWndCtrl from "../SkillWndCtrl";
import { RuneHoldRuneItem2 } from "./RuneHoldRuneItem2";

export class EquipHoldBagItem extends FUI_EquipHoldBagItem {
  declare runeItem: RuneHoldRuneItem2;

  private _info: GoodsInfo;

  constructor() {
    super();
  }

  protected onConstruct(): void {
    super.onConstruct();
    // this.runeItem.setLevelHide();
  }

  public set info(v: GoodsInfo) {
    this._info = v;
    this.updateView();
  }

  public get info() {
    return this._info;
  }

  private updateView() {
    if (!this._info) return;
    this.runeItem.info = this._info;
    this.runeName.text = this._info.templateInfo.TemplateNameLang; // + (this._info.strengthenGrade == 0 ? "" : "+" + this._info.strengthenGrade);
    this.runeName.color = GoodsSonType.getColorByProfile(
      this._info.templateInfo.Profile,
    );
    let ctrl = FrameCtrlManager.Instance.getCtrl(
      EmWindow.Skill,
    ) as SkillWndCtrl;
    this.addDesc.text = ctrl.addPropertyTxt(this._info);
    this.equipValue.visible = this._info.bagType == BagType.RUNE_EQUIP;
    this.haveValue.visible = !this.equipValue.visible;
  }

  public set hadPropertyFlag(v: boolean) {
    this.haveFlag.visible = v;
  }

  public get hadPropertyFlag() {
    return this.haveFlag.visible;
  }

  /**背包状态, -1: 未解锁；  0: 空格子；  1: 有道具*/
  private _state: number = Enum_BagGridState.Lock;
  set state(value: number) {
    this._state = value;
    switch (this._state) {
      case Enum_BagGridState.Lock:
        this.c2.selectedIndex = 0;
        break;
      case Enum_BagGridState.Empty:
        this.c2.selectedIndex = 1;
        break;
      case Enum_BagGridState.Item:
        this.c2.selectedIndex = 2;
        break;
    }
  }

  private _selectState: ItemSelectState = ItemSelectState.Default;
  public get selectState(): ItemSelectState {
    return this._selectState;
  }

  /**
   * 分解选中状态
   */
  public set selectState(value: ItemSelectState) {
    this._selectState = value;
    if (!this._info) return;
    switch (value) {
      case ItemSelectState.Default:
        // this.item.touchable = true;
        this.c1.selectedIndex = 0;
        break;
      case ItemSelectState.Selectable:
        // this.item.touchable = false;
        this.c1.selectedIndex = 1;
        // this.offClick(this,this.onClickSelect);
        // this.onClick(this,this.onClickSelect);
        break;
      case ItemSelectState.Selected:
        // this.item.touchable = false;
        this.c1.selectedIndex = 2;
        break;
      default:
        break;
    }
  }
}
