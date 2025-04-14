//@ts-expect-error: External dependencies
/*
 * @Author: jeremy.xu
 * @Date: 2021-08-12 17:53:47
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2021-12-15 10:33:18
 * @Description: 农场背包
 */

import BaseFguiCom from "../../../../../core/ui/Base/BaseFguiCom";
import { SimpleDictionary } from "../../../../../core/utils/SimpleDictionary";
import GoodsSonType from "../../../../constant/GoodsSonType";
import { GoodsInfo } from "../../../../datas/goods/GoodsInfo";
import { FarmManager } from "../../../../manager/FarmManager";
import { GoodsManager } from "../../../../manager/GoodsManager";
import { FarmModel } from "../../data/FarmModel";
import { FarmBagItem } from "../item/FarmBagItem";
import { NotificationManager } from "../../../../manager/NotificationManager";
import { FarmEvent } from "../../../../constant/event/NotificationEvent";
import UIButton from "../../../../../core/ui/UIButton";
import {
  ArrayConstant,
  ArrayUtils,
} from "../../../../../core/utils/ArrayUtils";

export class FarmBagListView extends BaseFguiCom {
  seedBag: fgui.GComponent;
  private list: fgui.GList;
  private btnFoldBag: UIButton;
  private _itemDic: SimpleDictionary;
  private _seedList: any[];

  constructor(container?: fgui.GComponent) {
    super(container);
    this.list = this.seedBag.getChild("list").asList;
  }

  public initView() {
    this.btnFoldBag.onClick(this, this.onBag);
    this.list.on(fgui.Events.CLICK_ITEM, this, this.__clickItem);
    this.list.itemRenderer = Laya.Handler.create(
      this,
      this.__renderListItem,
      null,
      false,
    );
    this._itemDic = new SimpleDictionary();
    this.seedBag.visible = false;
    this.refreshView();
  }

  public onBag() {
    FarmManager.Instance.showingBag = !this.seedBag.visible;
    if (this.seedBag.visible) {
      this.seedBag.alpha = 1;
      Laya.Tween.to(
        this.seedBag,
        { scaleX: 0, alpha: 0 },
        30,
        null,
        Laya.Handler.create(this, function () {
          this.seedBag.visible = false;
          this.view.getChild("listbg").visible = false;
        }),
      );
    } else {
      this.seedBag.alpha = 0;
      this.seedBag.scaleX = 0;
      Laya.Tween.to(
        this.seedBag,
        { scaleX: 1, alpha: 1 },
        30,
        null,
        Laya.Handler.create(this, function () {
          this.seedBag.visible = true;
        }),
      );
      this.view.getChild("listbg").visible = true;
    }
    // this.seedBag.visible = !this.seedBag.visible;

    // FarmManager.Instance.closeBagFrame()
  }

  private defaultView() {
    if (this.list.numItems > 0) {
      this.list.selectedIndex = 0;
      let item = this.list.getChildAt(0) as FarmBagItem;
      this.__clickItem(item);
    }
  }

  public show() {
    FarmManager.Instance.showingBag = true;
    this.refreshView();
  }

  public hide() {
    FarmManager.Instance.showingBag = false;
    this.model.curSelectedGoodInfo = null;
  }

  private __clickItem(item: FarmBagItem) {
    this.model.curSelectedGoodInfo = item.info;
    NotificationManager.Instance.dispatchEvent(
      FarmEvent.LIGHT_AVAILABLE_LAND,
      true,
    );
  }

  private __renderListItem(index: number, item: FarmBagItem) {
    let data = this._seedList[index];
    if (data) {
      item.info = data;
      item.pos = data.pos;
      this._itemDic.add(data.pos, item);
    }

    if (index == this._seedList.length - 1) {
      this.defaultView();
    }
  }

  public getBagItemByPos(pos: number): FarmBagItem {
    if (this.list.numChildren <= 0) return null;
    return this.list.getChildAt(pos) as FarmBagItem;
  }

  /**
   * 农场种子背包更新
   */
  public __bagItemUpdateHandler(infos: GoodsInfo[]) {
    let refresh = false;
    for (let info of infos)
      if (info && info.templateInfo.SonType == GoodsSonType.SONTYPE_SEED) {
        var item: FarmBagItem = this._itemDic[info.pos];
        if (item) {
          item.info = info;
        } else {
          refresh = true;
        }
      }
    refresh && this.refreshView();
  }
  /**
   * 农场背包种子删除
   */
  public __bagItemDeleteHandler(infos: GoodsInfo[]) {
    let refresh = false;
    for (let info of infos) {
      if (info && info.templateInfo.SonType == GoodsSonType.SONTYPE_SEED) {
        var item: FarmBagItem = this._itemDic[info.pos];
        if (item) {
          item.info = null;
          refresh = true;
        }
      }
    }

    refresh && this.refreshView(); // 被选中的种子用尽, 需要刷新并默认选择一个
  }

  public refreshView() {
    this.cleanGoods();
    this._seedList = GoodsManager.Instance.getGeneralBagGoodsBySonType(
      GoodsSonType.SONTYPE_SEED,
    );
    //种子列表按照道具id从小到大排序一下
    this._seedList = ArrayUtils.sortOn(
      this._seedList,
      ["templateId"],
      ArrayConstant.NUMERIC | ArrayConstant.DESCENDING,
    );
    this.list.numItems = this._seedList.length;
    if (this._seedList.length == 0) {
      this.model.curSelectedGoodInfo = null;
    }
  }
  /**
   * 清除农场背包的物品
   */
  private cleanGoods() {
    for (const key in this._itemDic) {
      if (Object.prototype.hasOwnProperty.call(this._itemDic, key)) {
        const item = this._itemDic[key];
        item.info = null;
        item.pos = -1;
      }
    }
    this._itemDic.clear();
  }

  private get model(): FarmModel {
    return FarmManager.Instance.model;
  }

  public dispose() {
    super.dispose();
  }
}
