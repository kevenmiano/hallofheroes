/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-02-19 11:40:58
 * @LastEditTime: 2024-03-07 15:13:22
 * @LastEditors: jeremy.xu
 * @Description: 铁匠铺
 */

import LangManager from "../../../core/lang/LangManager";
import Logger from "../../../core/logger/Logger";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import Tabbar from "../../../core/ui/Tabbar";
import UIManager from "../../../core/ui/UIManager";
import { SimpleDictionary } from "../../../core/utils/SimpleDictionary";
import { BagType } from "../../constant/BagDefine";
import { SoundIds } from "../../constant/SoundIds";
import { EmWindow } from "../../constant/UIDefine";
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import ForgeData from "./ForgeData";
import UIFenJie from "./UIFenJie";
import UIHeCheng from "./UIHeCheng";
import UIQiangHua from "./UIQiangHua";
import UIXiangQian from "./UIXiangQian";
import UIXiLian from "./UIXiLian";
import UIZhuanHuan from "./UIZhuanHuan";
import { StoreBagCell } from "../../component/item/StoreBagCell";
import { InteractiveEvent } from "../../constant/event/NotificationEvent";
import GoodsSonType from "../../constant/GoodsSonType";
import { DataCommonManager } from "../../manager/DataCommonManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { GoodsManager } from "../../manager/GoodsManager";
import { GoodsType } from "../../constant/GoodsType";
import SimpleAlertHelper from "../../component/SimpleAlertHelper";
import { SharedManager } from "../../manager/SharedManager";
import ItemID from "../../constant/ItemID";
import OpenGrades from "../../constant/OpenGrades";
import { ItemSelectState } from "../../constant/Const";
import ComponentSetting from "../../utils/ComponentSetting";
import Utils from "../../../core/utils/Utils";
import UIShenZhu from "./UIShenZhu";
import { isOversea } from "../login/manager/SiteZoneCtrl";
import GTabIndex from "../../constant/GTabIndex";
import { UIFilter } from "../../../core/ui/UIFilter";

export default class ForgeWnd extends BaseWindow {
  // private _uiFenJie: UIFenJie;
  private _uiHeCheng: UIHeCheng;
  private _uiQiangHua: UIQiangHua;
  public get uiQiangHua(): UIQiangHua {
    return this._uiQiangHua;
  }
  private _uiXiangQian: UIXiangQian;
  private _uiXiLian: UIXiLian;
  private _uiZhuanHuan: UIZhuanHuan;
  private _uiShenZhu: UIShenZhu;

  // private txtPageIndex: fgui.GLabel;
  private bagItemList: fgui.GList;
  private hechengTabs: fgui.GGroup;
  private cQuickOptState: fgui.Controller;

  private _tabbar: Tabbar;
  private _openTab3: boolean;
  private _openTab6: boolean;
  private _openTab7: boolean;

  private _tabMainList: fgui.GButton[] = [];
  private _tabSubMap: Map<number, fgui.GButton[]> = new Map();

  private _inQuickAdd: boolean = false;
  private _inDelayRefreshBagList: boolean = false;
  private _itemDic: SimpleDictionary = new SimpleDictionary();
  public modelEnable: boolean = false;

  public OnInitWind() {
    this.setCenter();
    Utils.setDrawCallOptimize(this.bagItemList);
    this.bagItemList.displayObject["dyna"] = true;
    this.cQuickOptState = this.getController("cQuickOptState");

    let pagenode = {
      [ForgeData.TabIndex.QH]: this["pQiangHua"],
      [ForgeData.TabIndex.XQ]: this["pXiangQian"],
      [ForgeData.TabIndex.HC]: this["pHeCheng"],
      [ForgeData.TabIndex.HC_ZB]: this["pHeCheng"],
      [ForgeData.TabIndex.HC_ZBSJ]: this["pHeCheng"],
      [ForgeData.TabIndex.HC_ZBJJ]: this["pHeCheng"],
      [ForgeData.TabIndex.HC_BS]: this["pHeCheng"],
      [ForgeData.TabIndex.HC_SJ]: this["pHeCheng"],
      [ForgeData.TabIndex.HC_DJ]: this["pHeCheng"],
      [ForgeData.TabIndex.XL]: this["pXiLian"],
      // [ForgeData.TabIndex.FJ]: this["pFenJie"],
      [ForgeData.TabIndex.ZH]: this["pZhuanHuan"],
      [ForgeData.TabIndex.SZ]: this["pShenZhu"],
    };
    this._tabMainList = [
      this["tabQiangHua"],
      this["tabXiangQian"],
      this["tabHeCheng"],
      this["tabXiLian"],
      this["tabFenJie"],
      this["tabZhuanHuan"],
      this["tabShenZhu"],
    ];
    let mainIdxHC = Math.floor(ForgeData.TabIndex.HC / 10);
    this._tabSubMap.set(mainIdxHC, [
      this["tabZB"],
      this["tabZBSJ"],
      this["tabZBJJ"],
      this["tabSJ"],
      this["tabBS"],
      this["tabDJ"],
    ]);
    this["tabSJ"].visible = ComponentSetting.FORGE_SJ;
    this["tabShenZhu"].visible = ComponentSetting.SHEN_ZHOU;
    this["tabZB"].getController("cFontSize").selectedIndex = isOversea()
      ? 1
      : 0;

    this._tabbar = new Tabbar();
    this._tabbar.subTabClickLimit = 300;
    this._tabbar.openSubTabClickLimit = true;
    this._tabbar.init(
      pagenode,
      this._tabMainList,
      this._tabSubMap,
      this.selectTabCallback.bind(this),
    );
    this._tabbar.interruptCallback = this.interruptCallback.bind(this);
    this._tabbar.setTag(GTabIndex.Forge_QH);

    // this._uiFenJie = new UIFenJie(pagenode[ForgeData.TabIndex.FJ])
    this._uiHeCheng = new UIHeCheng(pagenode[ForgeData.TabIndex.HC]);
    this._uiQiangHua = new UIQiangHua(pagenode[ForgeData.TabIndex.QH]);
    this._uiXiangQian = new UIXiangQian(pagenode[ForgeData.TabIndex.XQ]);
    this._uiXiLian = new UIXiLian(pagenode[ForgeData.TabIndex.XL]);
    this._uiZhuanHuan = new UIZhuanHuan(pagenode[ForgeData.TabIndex.ZH]);
    this._uiShenZhu = new UIShenZhu(pagenode[ForgeData.TabIndex.SZ]);

    // this.bagItemList.on(fgui.Events.SCROLL_END, this, this.onScrollEnd);
    this.bagItemList.on(fgui.Events.CLICK_ITEM, this, this.onClickItem);
    this.bagItemList.itemPool.useGlobal = true;
    // this.bagItemList.splitFrame = true;
    // this.bagItemList.splitTime = 24;
    // this.bagItemList.setVirtual();
    this.bagItemList.itemRenderer = Laya.Handler.create(
      this,
      this.onRenderListItem,
      null,
      false,
    );

    this._openTab3 = DataCommonManager.thane.grades >= OpenGrades.INSERT;
    this._openTab6 = DataCommonManager.thane.grades >= OpenGrades.REFRESH;
    this._openTab7 = DataCommonManager.thane.grades >= OpenGrades.MAX_GRADE;
    this._updateBtnFilter();
    PlayerManager.Instance.currentPlayerModel.forgeWndIsOpen = true;
  }

  private _updateBtnFilter() {
    let disableColor = "#aaaaaa";
    let enableColor = "#d1b186";
    if (!this._openTab3) {
      this._tabMainList[1].filters = [UIFilter.grayFilter];
      this._tabMainList[2].filters = [UIFilter.grayFilter];
      this._tabMainList[1].titleColor = disableColor;
      this._tabMainList[2].titleColor = disableColor;
    } else {
      this._tabMainList[1].filters = [];
      this._tabMainList[2].filters = [];
      this._tabMainList[1].titleColor = enableColor;
      this._tabMainList[2].titleColor = enableColor;
    }
    if (!this._openTab6) {
      this._tabMainList[3].filters = [UIFilter.grayFilter];
      this._tabMainList[4].filters = [UIFilter.grayFilter];
      this._tabMainList[5].filters = [UIFilter.grayFilter];
      this._tabMainList[3].titleColor = disableColor;
      this._tabMainList[4].titleColor = disableColor;
      this._tabMainList[5].titleColor = disableColor;
    } else {
      this._tabMainList[3].filters = [];
      this._tabMainList[4].filters = [];
      this._tabMainList[5].filters = [];
      this._tabMainList[3].titleColor = enableColor;
      this._tabMainList[4].titleColor = enableColor;
      this._tabMainList[5].titleColor = enableColor;
    }
    if (!this._openTab7) {
      this._tabMainList[6].filters = [UIFilter.grayFilter];
      this._tabMainList[6].titleColor = disableColor;
    } else {
      this._tabMainList[6].filters = [];
      this._tabMainList[6].titleColor = enableColor;
    }
  }

  OnHideWind() {
    super.OnHideWind();
    this.delayRefershBagList(false);
    Laya.timer.once(1000, this, this.onDelaySetFlag);
    this.bagItemList.removeChildrenToPool();
  }

  onDelaySetFlag() {
    PlayerManager.Instance.currentPlayerModel.forgeWndIsOpen = false;
  }

  private removeEvent() {
    // this.bagItemList.off(fgui.Events.SCROLL_END, this, this.onScrollEnd);
    this.bagItemList.off(fgui.Events.CLICK_ITEM, this, this.onClickItem);
  }

  public dispose() {
    this.removeEvent();
    this._tabbar.dispose();
    // this._uiFenJie.dispose();
    this._uiHeCheng.dispose();
    this._uiQiangHua.dispose();
    this._uiXiLian.dispose();
    this._uiXiangQian.dispose();
    this._uiShenZhu.dispose();

    super.dispose();
  }

  public changeIndex(
    index: number,
    bConvert: boolean = false,
    bSwitchSound: boolean = true,
  ) {
    if (this._tabbar) {
      this._tabbar.changeIndex(index, bConvert, bSwitchSound);
    }
  }
  public refresh(index: number, tag: string, data?: any) {
    if (!index) index = this.curTabIndex;

    if (tag == "BagItemUpdate") {
      this.__bagItemUpdateHandler(data);
    }
    if (tag == "BagItemDelete") {
      this.__bagItemDeleteHandler(data);
    }
    switch (index) {
      // case ForgeData.TabIndex.FJ:
      //     this._uiFenJie.refresh(tag, data)
      //     break;
      case ForgeData.TabIndex.HC:
      case ForgeData.TabIndex.HC_BS:
      case ForgeData.TabIndex.HC_DJ:
      case ForgeData.TabIndex.HC_ZB:
      case ForgeData.TabIndex.HC_ZBSJ:
      case ForgeData.TabIndex.HC_ZBJJ:
      case ForgeData.TabIndex.HC_SJ:
        this._uiHeCheng.refresh(tag, data, index);
        break;
      case ForgeData.TabIndex.QH:
        this._uiQiangHua.refresh(tag, data);
        break;
      case ForgeData.TabIndex.XQ:
        this._uiXiangQian.refresh(tag, data);
        break;
      case ForgeData.TabIndex.XL:
        this._uiXiLian.refresh(tag, data);
        break;
      case ForgeData.TabIndex.ZH:
        this._uiZhuanHuan.refresh(tag, data);
        break;
      case ForgeData.TabIndex.SZ:
        this._uiShenZhu.refresh(tag, data);
        break;
      default:
        break;
    }
  }

  public refreshBagList(data: any[]) {
    if (!data) return;
    this._itemDic.clear();

    let len = data.length ? data.length : ForgeData.BagPageSize;
    this.bagItemList.numItems =
      Math.ceil(len / ForgeData.BagPageSize) * ForgeData.BagPageSize;
    // this.onScrollEnd()
  }

  private onRenderListItem(index: number, item: StoreBagCell) {
    let bagData = this.model.bagData;
    if (!bagData) return;
    let itemData = bagData[index];
    if (!itemData) {
      item.info = null;
      return;
    }

    item.item.bagType = itemData.bagType;
    item.item.pos = itemData.pos;
    item.info = itemData;
    this._itemDic.add(
      itemData.pos + "_" + itemData.objectId + "_" + itemData.bagType,
      item,
    );

    if (itemData.templateInfo.MasterType == GoodsType.EQUIP) {
      item.item.tipType = EmWindow.ForgeEquipTip;
    } else if (itemData.templateInfo.MasterType == GoodsType.PROP) {
      item.item.tipType = EmWindow.ForgePropTip;
    }

    if (index == this.model.bagData.length - 1) {
      // this.refreshBagListDark(this.curTabIndex, this.hasEquiped)
      if (this._inQuickAdd) {
        this.setBagItemsState(ItemSelectState.Selectable);
      }
    }
  }

  private onClickItem(item: StoreBagCell) {
    // Logger.xjy("[ForgeWnd]onClickItem", this._itemDic)
    // 批量分解
    // if (this.dealFenJieQuickAdd(item)) return;
  }

  private __bagItemDeleteHandler(info: GoodsInfo) {
    var item: StoreBagCell =
      this._itemDic[info.pos + "_" + info.objectId + "_" + info.bagType];
    // Logger.xjy("[ForgeWnd]__bagItemDeleteHandler", info.pos + "_" + info.objectId + "_" + info.bagType, this._itemDic)
    if (item) {
      item.info = null;
    }
  }

  // 1.Thane放入A至Hide: (A、B指装备)
  // 1-1.Thane删除A
  // 1-2.Hide更新A

  // 2.Hide卸入A至Thane:
  // 1-1.Hide删除A
  // 1-2.Thane更新A

  // 3.Hide已经有A,更新Thane中B至Hide
  // 3-1.Thane更新A
  // 3-2.Thane删除B
  // 3-3.Hide更新B

  // 4.卸下A的宝石D
  // 1-1.更新Hide A
  // 1-2.更新Thane D
  private __bagItemUpdateHandler(info: GoodsInfo) {
    if (
      info.templateInfo.TransformId > 0 &&
      this.curTabIndex != ForgeData.TabIndex.ZH
    ) {
      // 卸下A的宝石D（情况4）
      if (this.curTabIndex == ForgeData.TabIndex.XQ && this.hasEquiped) {
        this.ctrl.refreshBagList(this.curTabIndex);
      } else {
        // 从已装备物品的转换页面切换至其他tab页（情况2）, filterGoods会过滤掉, 从而导致不会刷新
        this.ctrl.refreshBagList();
      }
      return;
    }

    if (!this.model.filterGoods(info)) return;

    /**
     * 处理1、3
     */
    if (info.bagType == BagType.Hide) {
      this.ctrl.refreshBagList(this.curTabIndex);
      this.delayRefershBagList(false);
      return;
    }

    var item: StoreBagCell =
      this._itemDic[info.pos + "_" + info.objectId + "_" + info.bagType];
    // Logger.xjy("[ForgeWnd]__bagItemUpdateHandler", info.pos + "_" + info.objectId + "_" + info.bagType, this._itemDic)
    if (item) {
      item.info = info;

      // 处理分解洗练石的暗显
      // if (this.curTabIndex == ForgeData.TabIndex.FJ && info.templateInfo.SonType == GoodsSonType.SONTYPE_REFRESH) {
      //     this.refreshBagListDark(ForgeData.TabIndex.FJ);
      // }
    } else {
      /**
       * 处理2, 以及物品实时更新
       */
      this.delayRefershBagList(true);
    }
  }

  // 3-1、3-3更新两次会出现闪现, 延迟刷新来处理此问题
  private delayRefershBagList(bo: boolean) {
    if (bo) {
      this._inDelayRefreshBagList = true;
      Laya.timer.once(300, this, this.onDelayRefershBagList);
    } else {
      this._inDelayRefreshBagList = false;
      Laya.timer.clear(this, this.onDelayRefershBagList);
    }
  }

  private onDelayRefershBagList() {
    this._inDelayRefreshBagList = false;
    if (this.hasEquiped) {
      this.ctrl.refreshBagList(this.curTabIndex);
    } else {
      this.ctrl.refreshBagList();
    }
  }

  public refreshBagListDark(index: number = 0, equiped: boolean = false) {
    for (const key in this._itemDic) {
      if (Object.prototype.hasOwnProperty.call(this._itemDic, key)) {
        const item = this._itemDic[key] as StoreBagCell;
        let normal = true;
        if (item && item.info && equiped) {
          switch (index) {
            case ForgeData.TabIndex.QH:
              normal =
                item.info.templateInfo.SonType ==
                GoodsSonType.SONTYPE_INTENSIFY;
              break;
            case ForgeData.TabIndex.XQ:
              normal =
                item.info.templateInfo.SonType == GoodsSonType.SONTYPE_MOUNT ||
                item.info.templateInfo.SonType ==
                  GoodsSonType.SONTYPE_MOUNT_PORP;
              break;
            case ForgeData.TabIndex.XL:
              normal =
                item.info.templateInfo.SonType ==
                  GoodsSonType.SONTYPE_REFRESH ||
                item.info.templateInfo.TemplateId == ItemID.REFRESH_LOCK_PROP;
              break;
            // case ForgeData.TabIndex.FJ:
            //     normal = item.info.templateInfo.SonType != GoodsSonType.SONTYPE_REFRESH
            //     break;
            default:
              break;
          }
        }
        item.dark = !normal;

        // for in遍历了带的方法而不是元素本身,去掉__开头的方法
        if (!key.startsWith("__")) {
          item.item.getChild("title")["color"] = !normal
            ? "#332F28"
            : "#FFECC6";
        }
      }
    }
  }

  /**
   * 打开铁匠铺时把相应物品放上去
   */
  public moveItem(gInfo: GoodsInfo) {
    if (gInfo == null) return;
    if (this.model.filterGoods(gInfo) && this.model.bagData && this._itemDic) {
      for (let index = 0; index < this._itemDic.keys.length; index++) {
        const key = this._itemDic.keys[index];
        const item = this._itemDic[key];
        if (item.info == gInfo && item.icon) {
          item.displayObject.event(InteractiveEvent.DOUBLE_CLICK);
        }
      }
    }
  }

  // private onScrollEnd() {
  //     this.txtPageIndex.text = String((this.bagItemList.scrollPane.currentPageX + 1) + "/" + Math.ceil(this.bagItemList.numItems / ForgeData.BagPageSize))
  // }

  private isHeCheng(index: number) {
    switch (index) {
      case ForgeData.TabIndex.HC:
      case ForgeData.TabIndex.HC_BS:
      case ForgeData.TabIndex.HC_DJ:
      case ForgeData.TabIndex.HC_ZB:
      case ForgeData.TabIndex.HC_ZBSJ:
      case ForgeData.TabIndex.HC_ZBJJ:
      case ForgeData.TabIndex.HC_SJ:
        return true;
      default:
        return false;
    }
  }

  /**刷新金币资源数据 */
  public refreshResources() {
    switch (this.curTabIndex) {
      // case ForgeData.TabIndex.FJ:
      //     this._uiFenJie.refreshResources()
      //     break;
      case ForgeData.TabIndex.HC:
      case ForgeData.TabIndex.HC_BS:
      case ForgeData.TabIndex.HC_DJ:
      case ForgeData.TabIndex.HC_ZB:
      case ForgeData.TabIndex.HC_ZBSJ:
      case ForgeData.TabIndex.HC_ZBJJ:
      case ForgeData.TabIndex.HC_SJ:
        this._uiHeCheng.refreshResources();
        break;
      case ForgeData.TabIndex.QH:
        this._uiQiangHua.refreshResources();
        break;
      case ForgeData.TabIndex.XQ:
        this._uiXiangQian.refreshResources();
        break;
      case ForgeData.TabIndex.XL:
        this._uiXiLian.refreshResources();
        break;
      case ForgeData.TabIndex.ZH:
        this._uiZhuanHuan.refreshResources();
        break;
      case ForgeData.TabIndex.SZ:
        this._uiShenZhu.refreshResources();
        break;
      default:
        break;
    }
  }

  private selectTabCallback(index: number, lastTabIndex: number) {
    let isHC = this.isHeCheng(index);
    // this.txtPageIndex.visible = !isHC
    this.bagItemList.visible = !isHC;
    this.hechengTabs.visible = isHC;
    this.btnCancelAddClick();
    switch (lastTabIndex) {
      // case ForgeData.TabIndex.FJ:
      //     this._uiFenJie.resetView()
      //     this._uiFenJie.resetTarget()
      //     break;
      case ForgeData.TabIndex.HC_BS:
      case ForgeData.TabIndex.HC_DJ:
      case ForgeData.TabIndex.HC_ZB:
      case ForgeData.TabIndex.HC_ZBSJ:
      case ForgeData.TabIndex.HC_ZBJJ:
      case ForgeData.TabIndex.HC_SJ:
        this._uiHeCheng.resetView();
        this._uiHeCheng.resetTarget();
        break;
      case ForgeData.TabIndex.QH:
        this._uiQiangHua.resetView();
        this._uiQiangHua.resetTarget();
        break;
      case ForgeData.TabIndex.XQ:
        this._uiXiangQian.resetView();
        this._uiXiangQian.resetTarget();
        break;
      case ForgeData.TabIndex.XL:
        this._uiXiLian.resetView();
        this._uiXiLian.resetTarget();
        break;
      case ForgeData.TabIndex.ZH:
        this._uiZhuanHuan.resetView();
        this._uiZhuanHuan.resetTarget();
        break;
      case ForgeData.TabIndex.SZ:
        this._uiShenZhu.resetView();
        this._uiShenZhu.resetTarget();
        break;
    }
    Logger.xjy("[ForgeWnd]selectTabCallback", index, lastTabIndex, isHC);
    if (isHC) {
      this["tabZBSJ"].visible = this.model.upgradeEquipOpen;
      this["tabZBJJ"].visible = this.model.advanceEquipOpen;
      this._uiHeCheng.refresh("ChangeIndex", null, index);
    }
    this.cQuickOptState.selectedIndex = 0; //index == ForgeData.TabIndex.FJ ? 1 : 0

    this.bagItemList.scrollPane.scrollTop();
    this.ctrl.refreshBagList();
    this.ctrl.moveGoodsBack();
  }

  private interruptCallback(changeToTabIndex: number): boolean {
    this._tabbar.soundRes =
      changeToTabIndex == ForgeData.TabIndex.XQ
        ? SoundIds.BAG_EQUIP_SOUND
        : SoundIds.CONFIRM_SOUND;

    switch (changeToTabIndex) {
      case ForgeData.TabIndex.XQ:
      case ForgeData.TabIndex.HC:
      case ForgeData.TabIndex.HC_BS:
      case ForgeData.TabIndex.HC_DJ:
      case ForgeData.TabIndex.HC_ZB:
      case ForgeData.TabIndex.HC_ZBSJ:
      case ForgeData.TabIndex.HC_ZBJJ:
      case ForgeData.TabIndex.HC_SJ:
        if (this._openTab3) {
          return false;
        } else {
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation(
              "store.view.StoreFrame.command01",
              OpenGrades.INSERT,
            ),
          );
          return true;
        }
      case ForgeData.TabIndex.XL:
      // case ForgeData.TabIndex.FJ:
      case ForgeData.TabIndex.ZH:
        if (this._openTab6) {
          return false;
        } else {
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation(
              "store.view.StoreFrame.command01",
              OpenGrades.REFRESH,
            ),
          );
          return true;
        }
      case ForgeData.TabIndex.SZ:
        // if(PlayerManager.Instance.currentPlayerModel.playerInfo.vocationGrades <= 0){//当未进行职业进阶时, 点击该btn, 提示”该功能80级职业进阶后开放“, 界面不开放
        //     let str = LangManager.Instance.GetTranslation("store.view.StoreFrame.command02",80);
        //     MessageTipManager.Instance.show(str);
        // }
        if (this._openTab7) {
          return false;
        } else {
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation(
              "store.view.StoreFrame.command01",
              OpenGrades.MAX_GRADE,
            ),
          );
          return true;
        }
        break;
      default:
        return false;
    }
  }

  // private dealFenJieQuickAdd(item: StoreBagCell) {
  //     if (this.curTabIndex != ForgeData.TabIndex.FJ || !this._inQuickAdd) return false;

  //     if (!item.info) return

  //     if (item.selectState == ItemSelectState.Selectable &&
  //         (ForgeData.FJEquipNum <= (this.getBagItemSelectCount() + this.getFenJieItemCount()))) {
  //         MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("cell.mediator.storebag.StoreBagCellClickMediator.command02"))
  //         return true;
  //     }

  //     if (item.info.isLock) {
  //         MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("vicepassword.description2"));
  //         return true;
  //     }
  //     if (item.info.existJewel()) {
  //         MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("cell.mediator.storebag.StoreBagCellClickMediator.command01"));
  //         return true;
  //     }

  //     if (item.selectState == ItemSelectState.Selectable && item.info.strengthenGrade > 0 && ForgeData.showResolveAlert()) {
  //         let content: string = LangManager.Instance.GetTranslation("cell.mediator.storebag.StoreBagCellClickMediator.resolveStrengthenAlert");
  //         let checkTxt: string = LangManager.Instance.GetTranslation("yishi.view.base.ThewAlertFrame.text");
  //         SimpleAlertHelper.Instance.Show(SimpleAlertHelper.USEBINDPOINT_ALERT, { checkRickText: checkTxt }, null, content, null, null, (b: boolean, check: boolean) => {
  //             if (b) {
  //                 SharedManager.Instance.resolveStrengthen = check;
  //                 SharedManager.Instance.resolveStrengthenCheckDate = new Date();
  //                 SharedManager.Instance.saveResolveStrengthenTipCheck();
  //                 item.selectState = ItemSelectState.Selected;
  //             }
  //         });
  //         return true;
  //     }

  //     if (item.selectState == ItemSelectState.Selectable) {
  //         item.selectState = ItemSelectState.Selected
  //     } else if (item.selectState == ItemSelectState.Selected) {
  //         item.selectState = ItemSelectState.Selectable
  //     }
  //     return true;
  // }

  private setBagItemsState(state: ItemSelectState) {
    for (let index = 0; index < this.bagItemList.numChildren; index++) {
      const item = this.bagItemList.getChildAt(index) as StoreBagCell;
      if (!item || !item.info) {
        continue;
      }
      // if (this.curTabIndex == ForgeData.TabIndex.FJ && item.info.templateInfo.MasterType == GoodsType.EQUIP) {
      //     item.selectState = state
      // } else {
      item.selectState = ItemSelectState.Default;
      // }
    }
  }

  /**
   * 已选中的Item数量
   */
  private getBagItemSelectCount(): number {
    let count = 0;
    for (let index = 0; index < this.bagItemList.numItems; index++) {
      const item = this.bagItemList.getChildAt(index) as StoreBagCell;
      if (item && item.selectState == ItemSelectState.Selected) {
        count++;
      }
    }
    return count;
  }

  /**
   * 已添加至分解区的Item数量
   */
  // private getFenJieItemCount(): number {
  //     let count = 0;
  //     for (let index = 0; index < this._uiFenJie.equipList.numItems; index++) {
  //         const item = this._uiFenJie.equipList.getChildAt(index) as StoreBagCell;
  //         if (item && item.info) {
  //             count++
  //         }
  //     }
  //     return count
  // }

  // 新手 从背包获得一个武器
  public getWeaponItem(): StoreBagCell {
    for (let index = 0; index < this.bagItemList.numItems; index++) {
      const bagCell = this.bagItemList.getChildAt(index) as StoreBagCell;
      if (
        bagCell &&
        bagCell.info &&
        bagCell.info.templateInfo.SonType == GoodsSonType.SONTYPE_WEAPON
      )
        return bagCell;
    }
    return null;
  }

  public get hasEquiped() {
    let arr: GoodsInfo[] = GoodsManager.Instance.getGoodsByBagType(
      BagType.Hide,
    );
    return arr.length > 0;
  }

  private get curBagListHasEquip() {
    for (let index = 0; index < this.bagItemList.numItems; index++) {
      const bagCell = this.bagItemList.getChildAt(index) as StoreBagCell;
      if (
        bagCell &&
        bagCell.info &&
        bagCell.info.templateInfo.MasterType == GoodsType.EQUIP
      ) {
        return true;
      }
    }
    return false;
  }

  private btnQuickAddClick() {
    if (!this.curBagListHasEquip) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "store.view.StoreFrame.notHaveFenjieProp",
        ),
      );
      return;
    }
    this._inQuickAdd = true;
    this.cQuickOptState.selectedIndex = 2;
    this.setBagItemsState(ItemSelectState.Selectable);
  }

  private btnConfirmAddClick() {
    this._inQuickAdd = false;
    this.cQuickOptState.selectedIndex = 1;

    //发协议批量添加
    let arrTemp = [];
    for (let index = 0; index < this.bagItemList.numItems; index++) {
      const item = this.bagItemList.getChildAt(index) as StoreBagCell;
      if (item) {
        let info = item.info;
        if (info && item.selectState == ItemSelectState.Selected) {
          let endPos = 0;
          for (let i: number = 0; i < ForgeData.FJEquipNum; i++) {
            let info: GoodsInfo = GoodsManager.Instance.getHideBagItemByPos(i);
            if (info == null && arrTemp.indexOf(i) == -1) {
              endPos = i;
              arrTemp.push(i);
              break;
            }
          }
          PlayerManager.Instance.moveBagToBag(
            info.bagType,
            info.objectId,
            info.pos,
            BagType.Hide,
            0,
            endPos,
            1,
          );
        }
      }
    }

    this.setBagItemsState(ItemSelectState.Default);
  }

  private btnCancelAddClick() {
    this._inQuickAdd = false;
    this.cQuickOptState.selectedIndex = 1;
    this.setBagItemsState(ItemSelectState.Default);
  }

  private helpBtnClick() {
    let index = ForgeData.HelpIndex[this.curTabIndex];
    if (this.isHeCheng(this.curTabIndex)) {
      index = 3;
    }
    if (index) {
      let titleStr = "store.view.StoreHelpFrame.title0" + index;
      let tipStr = "store.StoreControler.helpContent0" + index;
      let title: string = LangManager.Instance.GetTranslation(titleStr);
      let content: string = LangManager.Instance.GetTranslation(tipStr);
      UIManager.Instance.ShowWind(EmWindow.Help, {
        title: title,
        content: content,
      });
    }
  }

  public get curTabIndex(): number {
    return this._tabbar.curTabIndex;
  }
}
