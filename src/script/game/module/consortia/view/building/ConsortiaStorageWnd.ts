import BaseWindow from "../../../../../core/ui/Base/BaseWindow";
import { ConsortiaModel } from "../../model/ConsortiaModel";
import { FrameCtrlManager } from "../../../../mvc/FrameCtrlManager";
import { EmWindow } from "../../../../constant/UIDefine";
import { ConsortiaControler } from "../../control/ConsortiaControler";
import { GoodsInfo } from "../../../../datas/goods/GoodsInfo";
import { SimpleDictionary } from "../../../../../core/utils/SimpleDictionary";
import { BagSortType, BagType } from "../../../../constant/BagDefine";
import { Enum_BagGridState } from "../../../bag/model/Enum_BagState";
import { ConsortiaStorageCell } from "../../../../component/item/ConsortiaStorageCell";
import {
  BagEvent,
  ConsortiaEvent,
} from "../../../../constant/event/NotificationEvent";
import { GoodsManager } from "../../../../manager/GoodsManager";
import { ConsortiaUpgradeType } from "../../../../constant/ConsortiaUpgradeType";
import { TipsShowType } from "../../../../tips/ITipedDisplay";
import GoodsSonType from "../../../../constant/GoodsSonType";
import { ConsortiaManager } from "../../../../manager/ConsortiaManager";
import Utils from "../../../../../core/utils/Utils";

/**
 * @description 公会仓库
 * @author yuanzhan.yu
 * @date 2021/7/24 15:03
 * @ver 1.0
 */
export class ConsortiaStorageWnd extends BaseWindow {
  public frame: fgui.GLabel;
  public list: fgui.GList;
  public txt_page: fgui.GTextField;

  private _model: ConsortiaModel;
  private _bagTotalNum: number = 56;
  private _itemList: GoodsInfo[]; //按背包格子顺序存的物品信息,  有可能中间有空数据
  private _bagDic: SimpleDictionary;
  private _itemDic: SimpleDictionary;
  private bagLimit: number = 0;
  public dirtyBtn: fgui.GButton;
  private _sortByType: number = BagSortType.Default;
  constructor() {
    super();
  }

  public OnInitWind() {
    super.OnInitWind();
    this.setCenter();
    this.initData();
    this.initEvent();
    this.initView();
  }

  public OnShowWind() {
    super.OnShowWind();

    this._model.caseBagCanUse = true;
    ConsortiaManager.Instance.ConsortiaStorageIsOpen = true;
    FrameCtrlManager.Instance.open(EmWindow.BagWnd);
  }

  private initData() {
    this._model = (
      FrameCtrlManager.Instance.getCtrl(
        EmWindow.Consortia,
      ) as ConsortiaControler
    ).model;
    this._itemDic = new SimpleDictionary();
    this.updateBagData();
  }

  private initEvent() {
    this.list.on(fgui.Events.SCROLL_END, this, this.updateBagPage);
    // this.list.on(fgui.Events.CLICK_ITEM, this, this.onClickItem);

    this._model.addEventListener(
      ConsortiaEvent.UPDA_CONSORTIA_INFO,
      this.__onConsortiaInfoUpdataHandler,
      this,
    );
    GoodsManager.Instance.addEventListener(
      BagEvent.UPDATE_BAG,
      this.__bagItemUpdateHandler,
      this,
    );
    GoodsManager.Instance.addEventListener(
      BagEvent.DELETE_BAG,
      this.__bagItemDeleteHandler,
      this,
    );
    this.dirtyBtn.onClick(this, this.dirtyBtnHandler);
  }

  private initView() {
    //启用虚拟列表有几个条件:
    // 需要定义itemRenderer。
    // 需要开启滚动。溢出处理不是滚动的列表不能开启虚拟。
    // 需要设置好列表的“项目资源”。可以在编辑器内设置, 也可以调用GList.defaultItem设置。
    this.list.itemRenderer = Laya.Handler.create(
      this,
      this.renderListItem,
      null,
      false,
    );
    this.list.setVirtual();
    this.list.numItems = this._bagTotalNum;
    this.list.scrollPane.mouseWheelEnabled = false;
    this.list.selectionMode = fgui.ListSelectionMode.None;
    this.updateBagPage();
    this.updateBagLimit();
    this.list.ensureBoundsCorrect();
  }

  private updateBagData() {
    this._itemList = [];
    this._bagDic = GoodsManager.Instance.consoritaBagList;
    for (const key in this._bagDic) {
      if (this._bagDic.hasOwnProperty(key) && !key.startsWith("__")) {
        let info: GoodsInfo = this._bagDic[key];
        this._itemList[info.pos] = info;
      }
    }
  }

  private renderListItem(index: number, item: ConsortiaStorageCell) {
    item.item.showType = TipsShowType.onClick;
    item.item.bagType = BagType.Storage;
    item.item.pos = index;
    item.item.objectId = 0;
    this._itemDic.add(
      item.item.pos + "_" + item.item.objectId + "_" + item.item.bagType,
      item,
    );

    if (this._itemList[index]) {
      item.info = this._itemList[index];
    } else {
      item.info = null;

      if (index < this.bagLimit) {
        //没道具的空格子
        item.state = Enum_BagGridState.Empty;
      } else {
        //未解锁的格子
        item.state = Enum_BagGridState.Lock;
      }
    }
  }

  private updateBagPage() {
    this.txt_page.text =
      this.list.scrollPane.currentPageX +
      1 +
      "/" +
      Math.max(Math.ceil(this.list.numItems / 25), 1);
  }

  /**
   * 已开启的背包格子总数
   * @private
   */
  private updateBagLimit() {
    let preLevel = this._model.consortiaInfo.storeLevel;
    this.bagLimit =
      preLevel == ConsortiaUpgradeType.MAX_LEVEL
        ? this._bagTotalNum
        : preLevel * ConsortiaModel.CASE_CELL_OPEN_BY_LEVEL;
  }

  private __onConsortiaInfoUpdataHandler(evt: Event) {
    this.updateBagLimit();
    this.list.numItems = this._bagTotalNum;
  }

  private __bagItemUpdateHandler(infos: GoodsInfo[]) {
    Laya.timer.callLater(this, this.updateItemlist);
  }

  private __bagItemDeleteHandler(infos: GoodsInfo[]) {
    Laya.timer.callLater(this, this.updateItemlist);
  }

  private dirtyBtnHandler() {
    this.sortBag(true, this._sortByType);
  }

  private sortBag(isOverlay: boolean, sortType: number) {
    if (!this._bagDic) {
      return;
    }
    let send_pos_old: number[] = [];
    let send_pos_new: number[] = [];
    let sort_arr: GoodsInfo[] = [];
    let temp: GoodsInfo;
    sort_arr = sort_arr.concat(this._bagDic.getList());
    let boxGoods: GoodsInfo = GoodsManager.Instance.goodsListByPos["0_0_1"];
    if (
      boxGoods &&
      boxGoods.templateInfo.SonType == GoodsSonType.SONTYPE_NOVICE_BOX
    ) {
      temp = sort_arr.splice(sort_arr.indexOf(boxGoods), 1)[0];
    }
    sort_arr.sort(this.sortFun.bind(this));
    if (temp) {
      sort_arr.unshift(temp);
    }
    let isChange: boolean = false;
    let t_old_pos: number;
    for (let i: number = 0; i < sort_arr.length; i++) {
      t_old_pos = sort_arr[i].pos;
      if (t_old_pos != i) {
        isChange = true;
      }
      send_pos_old.push(t_old_pos);
      send_pos_new.push(i);
    }
    if (isChange || isOverlay) {
      GoodsManager.Instance.fixBagItem(
        send_pos_old,
        send_pos_new,
        BagType.Storage,
        isOverlay,
      );
    }
  }

  private sortFun(a: GoodsInfo, b: GoodsInfo): number {
    let index_a: number = a.templateInfo.SonType;
    let index_b: number = b.templateInfo.SonType;
    if (
      GoodsManager.Instance.isType(a, this._sortByType) &&
      !GoodsManager.Instance.isType(b, this._sortByType)
    ) {
      return -1;
    } else if (
      !GoodsManager.Instance.isType(a, this._sortByType) &&
      GoodsManager.Instance.isType(b, this._sortByType)
    ) {
      return 1;
    } else {
      if (index_a < index_b) {
        return -1;
      } else if (index_a > index_b) {
        return 1;
      } else {
        if (a.templateId < b.templateId) {
          return 1;
        } else if (a.templateId > b.templateId) {
          return -1;
        } else {
          if (a.strengthenGrade < b.strengthenGrade) {
            return 1;
          } else if (a.strengthenGrade > b.strengthenGrade) {
            return -1;
          } else {
            if (!a.isBinds && b.isBinds) {
              return -1;
            } else if (a.isBinds && !b.isBinds) {
              return 1;
            } else {
              return 0;
            }
          }
        }
      }
    }
    return 0;
  }

  private updateItemlist() {
    this.updateBagData();
    this.list.numItems = this._bagTotalNum;
    this.updateBagPage();
  }

  get itemList(): GoodsInfo[] {
    return this._itemList;
  }

  private removeEvent() {
    this.list.off(fgui.Events.SCROLL_END, this, this.updateBagPage);
    // this.list.off(fgui.Events.CLICK_ITEM, this, this.onClickItem);
    this._model.removeEventListener(
      ConsortiaEvent.UPDA_CONSORTIA_INFO,
      this.__onConsortiaInfoUpdataHandler,
      this,
    );
    GoodsManager.Instance.removeEventListener(
      BagEvent.UPDATE_BAG,
      this.__bagItemUpdateHandler,
      this,
    );
    GoodsManager.Instance.removeEventListener(
      BagEvent.DELETE_BAG,
      this.__bagItemDeleteHandler,
      this,
    );
    this.dirtyBtn.offClick(this, this.dirtyBtnHandler);
  }

  public OnHideWind() {
    super.OnHideWind();

    this.removeEvent();
    FrameCtrlManager.Instance.exit(EmWindow.BagWnd);
  }

  dispose(dispose?: boolean) {
    // this.list.itemRenderer.recover();
    Utils.clearGListHandle(this.list);
    this._model = null;
    this._itemList = null;
    this._bagDic = null;
    this._itemDic = null;
    ConsortiaManager.Instance.ConsortiaStorageIsOpen = false;
    super.dispose(dispose);
  }
}
