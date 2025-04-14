//@ts-expect-error: External dependencies
/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-03-03 10:35:50
 * @LastEditTime: 2022-06-02 18:10:32
 * @LastEditors: jeremy.xu
 * @Description: 通用展示物品列表界面
 */

import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIButton from "../../../core/ui/UIButton";
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import { BaseItem } from "../../component/item/BaseItem";
import Utils from "../../../core/utils/Utils";
import { PlayerManager } from "../../manager/PlayerManager";
import { GameBaseQueueManager } from "../../manager/GameBaseQueueManager";
import StoreRatingAction from "../../action/hero/StoreRatingAction";
import { StoreRatingsType } from "../../constant/StoreRatingsType";

export default class DisplayItemsWnd extends BaseWindow {
  private btnConfirm: UIButton;
  private itemList: fgui.GList;
  private tagBg: fgui.GLabel;

  constructor() {
    super();
  }

  public OnInitWind() {
    this.setCenter();
  }

  /**界面打开 */
  OnShowWind() {
    super.OnShowWind();
    this.itemList.on(fgui.Events.CLICK_ITEM, this, this.onClickItem);
    Utils.setDrawCallOptimize(this.itemList);
    this.itemList.itemRenderer = Laya.Handler.create(
      this,
      this.renderListItem,
      null,
      false,
    );

    this.refresh();
  }

  /**关闭界面 */
  OnHideWind() {
    super.OnHideWind();
    if (
      PlayerManager.Instance.isScoreRatingApp &&
      PlayerManager.Instance.isExistScoreRating &&
      PlayerManager.Instance.scoreRatingCondition ==
        StoreRatingsType.FIRST_MAZE_100_LEVEL
    ) {
      GameBaseQueueManager.Instance.addAction(new StoreRatingAction(), true);
    }
  }

  private refresh() {
    let frameData = this.params.frameData;
    if (frameData.itemInfos) {
      this.itemList.numItems = frameData.itemInfos.length;
    }
    if (frameData.title) {
      this.tagBg.getChild("title").asTextField.text = frameData.title;
    }
    if (frameData.btnText) {
      this.btnConfirm.title = frameData.btnText;
    }
  }

  private onClickItem(item: BaseItem) {}

  private renderListItem(index: number, item: BaseItem) {
    let frameData = this.params.frameData;
    if (!frameData) return;
    let itemInfos = frameData.itemInfos as GoodsInfo[];
    if (!itemInfos) return;
    let itemData = itemInfos[index];
    if (!itemData) return;

    item.info = itemData;
    item.countText = itemData.count.toString();
  }

  private btnConfirmClick() {
    this.OnBtnClose();
  }
}
