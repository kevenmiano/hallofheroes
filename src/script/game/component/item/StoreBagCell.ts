import FUI_StoreBagCell from "../../../../fui/Base/FUI_StoreBagCell";
import { BaseItem } from "./BaseItem";
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import { EmWindow } from "../../constant/UIDefine";
import { GoodsCheck } from "../../utils/GoodsCheck";
import { ThaneInfo } from "../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../manager/ArmyManager";
import MediatorMananger from "../../manager/MediatorMananger";
import { StoreBagCellClickMediator } from "../../cell/mediator/storebag/StoreBagCellClickMediator";
import { TipsShowType } from "../../tips/ITipedDisplay";
import { GoodsType } from "../../constant/GoodsType";
import { ItemSelectState } from "../../constant/Const";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/5/25 14:55
 * @ver 1.0
 *
 */
export class StoreBagCell extends FUI_StoreBagCell {
  public item: BaseItem;
  protected _registed: boolean = false;
  protected _mediatorKey: string;
  private _info: GoodsInfo;
  public static NAME: string = "cell.view.storebag.StoreBagCell";

  constructor() {
    super();
  }

  protected onConstruct() {
    super.onConstruct();
    //铁匠铺面板显示装备背景
    this.item.hideBgHasInfo = true;
    this.heroEquipIcon.visible = false;
    this.item.needShowBetterImg = false;
  }

  get info(): GoodsInfo {
    return this._info;
  }

  set info(value: GoodsInfo) {
    this._info = value;

    this.dark = false;
    this.item.showType = TipsShowType.onClick;
    this.item.info = value;
    // if (!this._registed) {
    //     this.registerMediator();
    // }
    if (value) {
      let template = value.templateInfo;
      if (
        template.MasterType == GoodsType.EQUIP ||
        template.MasterType == GoodsType.HONER
      ) {
        this.item.tipType = EmWindow.ForgeEquipTip;
      } else if (template.MasterType == GoodsType.PROP) {
        this.item.tipType = EmWindow.ForgePropTip;
      }
    }

    this.heroEquipIcon.visible = false;
    if (value) {
      if (value.objectId == this.thane.id) {
        this.heroEquipIcon.visible = true;
      }

      let icon: fgui.GLoader = <fgui.GLoader>this.item.getChild("icon");
      if (
        GoodsCheck.isEquip(value.templateInfo) &&
        !this.checkGoodsByHero(false)
      ) {
        icon.color = "#FF0000";
      } else {
        icon.color = "#FFFFFF";
      }
    }
  }

  private _selectState: ItemSelectState = ItemSelectState.Default;
  public get selectState(): ItemSelectState {
    return this._selectState;
  }

  public set selectState(value: ItemSelectState) {
    this._selectState = value;
    this.__starSelectState(value);
  }

  public set dark(value: boolean) {
    this.cDark.selectedIndex = value ? 1 : 0;
  }

  private __starSelectState(state: ItemSelectState) {
    if (!this._info) return;

    switch (state) {
      case ItemSelectState.Default:
        this.cSelectState.selectedIndex = 0;
        break;
      case ItemSelectState.Selectable:
        this.cSelectState.selectedIndex = 1;
        break;
      case ItemSelectState.Selected:
        this.cSelectState.selectedIndex = 2;
        break;
      default:
        break;
    }
  }

  public checkGoodsByHero(popMsg: boolean = true): boolean {
    if (GoodsCheck.isGradeFix(this.thane, this._info.templateInfo, popMsg)) {
      return GoodsCheck.checkGoodsByHero(this._info, this.thane, popMsg);
    }
    return false;
  }

  private get thane(): ThaneInfo {
    return ArmyManager.Instance.thane;
  }

  // 以前双击的方式操作 现在改成在tip上按钮操作
  protected registerMediator() {
    this._registed = true;
    var arr: any[] = [
      StoreBagCellClickMediator,
      // StoreBagCellDropMediator
    ];
    this._mediatorKey = MediatorMananger.Instance.registerMediatorList(
      arr,
      this,
      StoreBagCell.NAME,
    );
  }

  dispose() {
    this._info = null;
    this.item.dispose();
    MediatorMananger.Instance.unregisterMediatorList(this._mediatorKey, this);
    super.dispose();
  }
}
