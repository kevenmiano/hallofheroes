import FUI_FashionBagCell from "../../../../fui/Base/FUI_FashionBagCell";
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import { BaseItem } from "./BaseItem";
import MediatorMananger from "../../manager/MediatorMananger";
import { ArmyManager } from "../../manager/ArmyManager";
import { EmWindow } from "../../constant/UIDefine";
import { GoodsCheck } from "../../utils/GoodsCheck";
import { ThaneInfo } from "../../datas/playerinfo/ThaneInfo";
import { FashionBagCellClickMediator } from "../../cell/mediator/fashionbag/FashionBagCellClickMediator";
import { TipsShowType } from "../../tips/ITipedDisplay";
import { SFashionSwitchItem } from "../../module/sbag/fashion/SFashionSwitchItem";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/5/24 20:51
 * @ver 1.0
 *
 */
export class FashionBagCell extends FUI_FashionBagCell {
  public item: BaseItem;
  protected _registed: boolean = false;
  protected _mediatorKey: string;
  private _info: GoodsInfo;
  private _moveType: string; //移动类型（主要分为穿上或者脱下）
  public sonType: number; //子类型（试穿时展示用到）

  public static NAME: string = "cell.view.fashionbag.FashionBagCell";

  constructor() {
    super();
  }

  protected onConstruct() {
    super.onConstruct();

    this.heroEquipIcon.visible = false;
  }

  public set moveType(v: string) {
    this._moveType = v;
    if (this._info) {
      this._info.moveType = v;
    }
  }

  public get moveType(): string {
    return this._moveType;
  }

  get info(): GoodsInfo {
    return this._info;
  }

  set info(value: GoodsInfo) {
    this._info = value;

    if (this.parent instanceof SFashionSwitchItem) {
      this.item.showType = TipsShowType.onLongPress;
    }
    this.item.info = value;
    this.item.isActive.selectedIndex = 0; //不显示时装和坐骑的已激活标识
    if (!this._registed) {
      this.registerMediator();
    }
    this.heroEquipIcon.visible = false;

    if (value) {
      if (value.objectId == this.thane.id) {
        this.heroEquipIcon.visible = true;
        this.item.tipType = EmWindow.EquipTip;
      } else {
        if (this.parent instanceof SFashionSwitchItem) {
        } else {
          this.item.canOperate = true;
        }
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

  public checkGoodsByHero(popMsg: boolean = true): boolean {
    if (GoodsCheck.isGradeFix(this.thane, this._info.templateInfo, popMsg)) {
      return GoodsCheck.checkGoodsByHero(this._info, this.thane, popMsg);
    }
    return false;
  }

  private get thane(): ThaneInfo {
    return ArmyManager.Instance.thane;
  }

  protected registerMediator() {
    this._registed = true;
    var arr: any[] = [
      // StoreBagCellClickMediator,
      // StoreBagCellDropMediator
      FashionBagCellClickMediator,
    ];
    this._mediatorKey = MediatorMananger.Instance.registerMediatorList(
      arr,
      this,
      FashionBagCell.NAME,
    );
  }

  dispose() {
    this.item.dispose();
    this._info = null;
    MediatorMananger.Instance.unregisterMediatorList(this._mediatorKey, this);
    super.dispose();
  }
}
