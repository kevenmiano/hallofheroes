//@ts-expect-error: External dependencies
/*
 * @Author: jeremy.xu
 * @Date: 2022-12-08 17:37:58
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2022-12-13 12:29:03
 * @Description: 欢乐折扣商城积分单元格
 */

import FUI_ShopDiscountScoreItem from "../../../../../../fui/Shop/FUI_ShopDiscountScoreItem";
import { UIFilter } from "../../../../../core/ui/UIFilter";
import { BaseItem } from "../../../../component/item/BaseItem";
import { GoodsInfo } from "../../../../datas/goods/GoodsInfo";
import { DiscountShopManager } from "../../control/DiscountShopManager";
import {
  DiscountShopScoreInfo,
  DiscountShopModel,
} from "../../model/DiscountShopModel";

export default class ShopDiscountScoreItem extends FUI_ShopDiscountScoreItem {
  public index: number = -1;
  private _cellData: DiscountShopScoreInfo = null;

  protected onConstruct() {
    super.onConstruct();
    this.onEvent();
  }

  private onEvent() {
    this.onClick(this, this.btnRewardClick);
  }

  private offEvent() {
    this.offClick(this, this.btnRewardClick);
  }

  public set info(value: DiscountShopScoreInfo) {
    if (!value) return;
    this._cellData = value;
    var goodsInfo: GoodsInfo = new GoodsInfo();
    goodsInfo.templateId = value.itemId;
    goodsInfo.count = value.count;
    (this.item as BaseItem).info = goodsInfo;
    this.item.filters = [];
    this.cState.selectedIndex = 0;
    this.txtIntegral.text = value.score.toString();
    if (this.discountModel.myScore >= value.score) {
      this.cState.selectedIndex = value.isTake ? 2 : 1;
      this.effect.visible = !value.isTake;
      this.item.touchable = value.isTake;
      if (value.isTake) {
        this.item.filters = [UIFilter.darkFilter3];
      }
    }
  }

  public get info(): DiscountShopScoreInfo {
    return this._cellData;
  }

  private btnRewardClick() {
    if (this._cellData.isTake) return;
    if (this.discountModel.myScore < this._cellData.score) return;
    DiscountShopManager.Instance.operationDiscountShop(4, this._cellData.score);
  }

  public get discountModel(): DiscountShopModel {
    return DiscountShopManager.Instance.model;
  }

  dispose() {
    this.offEvent();
    super.dispose();
  }
}
