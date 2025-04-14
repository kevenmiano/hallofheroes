import FUI_SBagCom from "../../../../../fui/SBag/FUI_SBagCom";
import LangManager from "../../../../core/lang/LangManager";
import Logger from "../../../../core/logger/Logger";
import { SocketManager } from "../../../../core/net/SocketManager";
import UIManager from "../../../../core/ui/UIManager";
import { SimpleDictionary } from "../../../../core/utils/SimpleDictionary";
import Utils from "../../../../core/utils/Utils";
import { PlayerBagCell } from "../../../component/item/PlayerBagCell";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import { BagSortType, BagType } from "../../../constant/BagDefine";
import {
  BagEvent,
  FashionEvent,
  NotificationEvent,
} from "../../../constant/event/NotificationEvent";
import { PlayerEvent } from "../../../constant/event/PlayerEvent";
import GoodsSonType from "../../../constant/GoodsSonType";
import { C2SProtocol } from "../../../constant/protocol/C2SProtocol";
import { EmWindow } from "../../../constant/UIDefine";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { FashionManager } from "../../../manager/FashionManager";
import { GoodsManager } from "../../../manager/GoodsManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { TipsShowType } from "../../../tips/ITipedDisplay";
import { GoodsCheck } from "../../../utils/GoodsCheck";
import { BagModel } from "../../bag/model/BagModel";
import {
  Enum_BagGridState,
  Enum_BagState,
} from "../../bag/model/Enum_BagState";
import { BagHelper } from "../../bag/utils/BagHelper";
import PayTypeMsg = com.road.yishi.proto.player.PayTypeMsg;
import { ArmyManager } from "../../../manager/ArmyManager";

/**
 * 新版背包
 * @description 背包格子列表
 * @author zhihua.zhou
 * @date 2022/12/9
 * @ver 1.3
 */
export class SBagCom extends FUI_SBagCom {
  private _itemList: GoodsInfo[]; //按背包格子顺序存的物品信息,  有可能中间有空数据
  private _bagDic: SimpleDictionary;
  private _itemDic: SimpleDictionary;
  private _sortByType: number = BagSortType.Default;
  private _bagTotalNum: number = 235;
  private _bagNumPerLine: number = 5; //一行拥有的格子数量
  private filterFlag: boolean = false;
  private _isBattleGuardShow: boolean = false; //战斗守护面板是否显示中
  private _isConsortiaStorageShow: boolean = false; //公会仓库面板是否显示中
  private pageListData: GoodsInfo[][];
  protected cache = true;
  public isInited: boolean = false;
  // private _lastSelectIndex: number = 0;

  onConstruct() {
    super.onConstruct();
    this.list_tab.getChildAt(0).asButton.title =
      LangManager.Instance.GetTranslation("bag.tabTitle0");
    this.list_tab.getChildAt(1).asButton.title =
      LangManager.Instance.GetTranslation("CampaignResult.Prop");
    this.list_tab.getChildAt(2).asButton.title =
      LangManager.Instance.GetTranslation("card.CardFrame.equip");
    this.list_tab.getChildAt(3).asButton.title =
      LangManager.Instance.GetTranslation("FightingItem.typeNameTxt1");
  }

  onShow() {
    this.btn_tidy.touchable = true;
    this.initView();
  }

  onHide() {
    if (this.isInited) {
      this.isInited = false;
      this.removeEvent();
      this.onSale.selectedIndex = 0;
      BagModel.bag_state = Enum_BagState.Default;
      this.list.selectNone();
      // this.list.itemRenderer.recover();
      Utils.clearGListHandle(this.list);
      this._itemDic.clear();
      this._itemDic = null;
      this.filterFlag = false;
      this._itemList = null;
      this._bagDic = null;
    }
    // 右下角提示有新的装备, 进背包点装备弹出提示, 此时执行新手关闭背包了, 导致提示界面依然显示
    if (UIManager.Instance.isShowing(EmWindow.EquipTip)) {
      UIManager.Instance.HideWind(EmWindow.EquipTip);
    }
    if (UIManager.Instance.isShowing(EmWindow.EquipContrastTips)) {
      UIManager.Instance.HideWind(EmWindow.EquipContrastTips);
    }
  }

  private initView() {
    if (this._isBattleGuardShow) {
      this.showBattleGuardItems(false);
    }
    this.showListTab(true);
    // this.list_tab.getChildAt(1).grayed = ArmyManager.Instance.thane.grades < 10;
    if (this.isInited) return;
    this.isInited = true;
    this.pageListData = [[], [], [], []];
    // this.list.scrollPane.mouseWheelEnabled = false;
    this.list_tab.selectedIndex = -1;
    this.initData();
    this.addEvent();
    this.refreshView();
    this.list_tab.getChildAt(3).asCom.getChild("n6").visible = false;
  }

  private initData() {
    this.updateBagData();
    this._itemDic = new SimpleDictionary();
  }

  // public selectFashionTab() {
  //     this.list_tab.selectedIndex = 1;
  //     this.onTabClick(this.list_tab.getChildAt(1), null);
  // }

  public selectAll() {
    this.list_tab.selectedIndex = 0;
    this.onTabClick(this.list_tab.getChildAt(0), null);
  }

  /**
   * 点了战斗守护后需要隐藏操作按钮
   * @param boo
   */
  showListTab(boo: boolean) {
    this.list_tab.visible = boo;
    if (!boo) {
      this.list_tab.selectedIndex = 0;
      // this._lastSelectIndex = this.list_tab.selectedIndex;
      this.onTabClick(this.list_tab.getChildAt(0), null);
      this.showBattleGuardItems(true);
    }
  }
  /**
   * windown.OnShow()
   * @param frameData
   */
  refreshView(frameData?) {
    Utils.setDrawCallOptimize(this);
    Utils.setDrawCallDyna(this.list.displayObject, true);
    this.list_tab.selectedIndex = 0;
    // this._lastSelectIndex = this.list_tab.selectedIndex;
    // if(this.list_tab.selectedIndex > 0){
    //     BagModel.lastBagSortType = this._sortByType = this.list_tab.selectedIndex+1;
    // }else{
    BagModel.lastBagSortType = this._sortByType = this.list_tab.selectedIndex;
    // }

    //启用虚拟列表有几个条件:
    // 需要定义itemRenderer。
    // 需要开启滚动。溢出处理不是滚动的列表不能开启虚拟。
    // 需要设置好列表的“项目资源”。可以在编辑器内设置, 也可以调用GList.defaultItem设置。
    this.list.setVirtual();
    this.list.itemRenderer = Laya.Handler.create(
      this,
      this.renderListItem,
      null,
      false,
    );
    this.list.numItems = this._bagTotalNum;
    this.list.selectionMode = fgui.ListSelectionMode.None;
    this.updateBagPage();

    // if (frameData && frameData.openFromFashion) {
    //     this.list_tab.selectedIndex = 1;
    //     this._lastSelectIndex = this.list_tab.selectedIndex;
    //     this.onTabClick(this.list_tab.getChildAt(1), null);
    // }
    if (this._isConsortiaStorageShow) {
      this.onSale.selectedIndex = 2;
    } else {
      this.onSale.selectedIndex = 0;
    }
    let level = 0;
    if (ArmyManager.Instance.thane) {
      level = ArmyManager.Instance.thane.grades;
    }
    this.btn_sale.visible = level >= 20;
  }

  private tabInterval: number = 300;
  private tabIntervalState: boolean = true;
  public onTabClick(item: fgui.GObject, evt: Laya.Event) {
    if (!this.tabIntervalState) return;
    let idx = this.list_tab.selectedIndex;
    if (idx > 0) {
      idx += 1;
    }
    if (BagModel.lastBagSortType == idx) {
      return;
    }
    // if (this.list_tab.selectedIndex == 1) {
    //     if (ArmyManager.Instance.thane.grades < 10) {
    //         let str: string = LangManager.Instance.GetTranslation("dayGuide.DayGuideManager.command02", 10);
    //         MessageTipManager.Instance.show(str);
    //         this.list_tab.selectedIndex = this._lastSelectIndex;
    //         return;
    //     }
    // }
    // this._lastSelectIndex = this.list_tab.selectedIndex;
    this.tabIntervalState = false;
    this.list_tab.displayObject.mouseEnabled = false;
    if (this._isConsortiaStorageShow) {
      this.onSale.selectedIndex = 3;
    } else {
      this.onSale.selectedIndex = 0;
    }

    BagModel.bag_state = Enum_BagState.Default;
    this.list.selectNone();
    if (this.list_tab.selectedIndex > 0) {
      //时装移除后类型要加1
      this._sortByType = this.list_tab.selectedIndex + 1;
    } else {
      this._sortByType = this.list_tab.selectedIndex;
    }
    BagModel.lastBagSortType = this._sortByType;
    this.sortBag(true, this._sortByType);

    this.filterFlag = true;
    GoodsManager.Instance.filterFlag = this.filterFlag;
    this.list.scrollToView(0);
    this.updateBagPage();
    Laya.timer.once(this.tabInterval, this, this.__tabIntervalOnce);
    if (!item) {
      return;
    }

    //TODO
    // NotificationManager.Instance.dispatchEvent(FashionEvent.SWITCH_FASION, this.list_tab.selectedIndex);
    // let roleCtrl: RoleCtrl = FrameCtrlManager.Instance.getCtrl(EmWindow.RoleWnd) as RoleCtrl;
    // let wnd: RoleWnd = roleCtrl.view as RoleWnd;
    // if (wnd && wnd.isShowing) {
    //     wnd.changeBagWnd = false;
    //     if (this._sortByType == BagSortType.Fashion) {
    //         wnd.page.selectedIndex = 1;
    //     }
    //     else {
    //         wnd.page.selectedIndex = 0;
    //     }
    //     Logger.yyz("⚽触发角色面板切页！");
    // }
  }

  private __bagIsFullHandler() {
    GoodsManager.Instance.filterGoodsInGeneralAndConsortiaBag();
  }

  private __tabIntervalOnce() {
    this.tabIntervalState = true;
    this.list_tab.displayObject.mouseEnabled = true;
    Laya.timer.clear(this, this.__tabIntervalOnce);
  }

  private sortBag(isOverlay: boolean, sortType: number) {
    // this._bagDic = GoodsManager.Instance.getGeneralBagList();
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
    // this._sortByType = sortType;
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
    Logger.log("send_pos_old=>", send_pos_old);
    Logger.log("send_pos_new=>", send_pos_new);
    if (isChange || isOverlay) {
      GoodsManager.Instance.fixBagItem(
        send_pos_old,
        send_pos_new,
        BagType.Player,
        isOverlay,
      );
    }
  }

  private renderListItem(index: number, item: PlayerBagCell) {
    if (this.isDisposed) return;
    if (!item || item.isDisposed) return;
    this._isConsortiaStorageShow = FrameCtrlManager.Instance.isOpen(
      EmWindow.ConsortiaStorageWnd,
    );
    if (this._isBattleGuardShow) {
      item.item.showType = TipsShowType.onLongPress;
    } else {
      item.item.showType = TipsShowType.onClick;
    }

    item.item.bagType = BagType.Player;
    item.item.pos = index;
    item.item.objectId = 0;
    if (this._itemDic) {
      this._itemDic.add(item.item.pos + "_0_" + item.item.bagType, item);
    }
    // Logger.yyz("触发背包列表刷新！！！！！！");
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

  protected get bagLimit(): number {
    return PlayerManager.Instance.currentPlayerModel.playerInfo.bagTotalCount;
  }

  private updateBagPage() {
    //因为是延迟执行, 所以当在批量使用播放动画时关闭界面会报错, modify by zhihua.zhou2021-12-20
    if (this.txt_page) {
      this.txt_page.text =
        this.list.scrollPane.currentPageX +
        1 +
        "/" +
        Math.max(Math.ceil(this.list.numItems / 25), 1);
    }
  }

  private updateBagData(sonType?: number) {
    this._itemList = [];
    let sonTypeItemList: GoodsInfo[] = [];
    let tempItemList: GoodsInfo[] = [];
    this._bagDic = GoodsManager.Instance.getGeneralBagList();
    for (const key in this._bagDic) {
      if (this._bagDic.hasOwnProperty(key) && !key.startsWith("__")) {
        let info: GoodsInfo = this._bagDic[key];
        if (info.templateInfo && info.templateInfo.SonType == sonType) {
          sonTypeItemList.push(info);
        } else {
          this._itemList[info.pos] = info;
        }
      }
    }

    this.pageListData[0] = tempItemList;

    //只对当前页进行排序, 第一页不需要排序
    // if (this._sortByType > 0) {
    // console.time("sortByFrame");
    this.pageListData[this._sortByType] = tempItemList
      .concat()
      .sort(this.sortFun.bind(this));
    // console.timeEnd("sortByFrame");
    // }
    //其它页分帧排序
    Laya.timer.callLater(this, this.sortByFrame.bind(this));
    if (sonType == GoodsSonType.RESIST_GEM) {
      this._itemList = sonTypeItemList.sort(this.sortByTpye.bind(this));
    }
  }

  private sortByFrame(sortIndex = 1) {
    if (sortIndex >= 4) return;
    //当前页已经排序,不需要排序,跳过
    if (sortIndex != this._sortByType) {
      let originSortByType = this._sortByType;
      this._sortByType = sortIndex;
      let temp = this.pageListData[0].concat();
      // console.time("sortByFrame");
      let temp1 = temp.sort(this.sortFun.bind(this));
      // console.timeEnd("sortByFrame");
      this.pageListData[sortIndex] = temp1;
      this._sortByType = originSortByType;
    }
    sortIndex++;
    Laya.timer.callLater(this, this.sortByFrame.bind(this), [sortIndex]);
  }

  private addEvent() {
    this.list_tab.on(fgui.Events.CLICK_ITEM, this, this.onTabClick); //onTabClick方法的第一个参数就是当前被点击的对象
    this.list.on(fgui.Events.SCROLL_END, this, this.updateBagPage);
    this.list.on(fgui.Events.CLICK_ITEM, this, this.onClickItem);
    this.btn_tidy.onClick(this, this.onBtnTidyClick);
    this.btn_sale.onClick(this, this.onBtnSaleClick);
    this.btn_cancel.onClick(this, this.onBtnCancelClick);
    this.btn_sure.onClick(this, this.onBtnSureClick);
    this.btn_cancel_1.onClick(this, this.onBtnCancelClick);
    this.batch_put.onClick(this, this.onBtnBatchPutClick);
    this.btn_tidy2.onClick(this, this.onBtnTidyClick);
    this.btn_put.onClick(this, this.onBtnPutClick);
    this.btn_cancel2.onClick(this, this.onBtnCancelClick);
    PlayerManager.Instance.currentPlayerModel.playerInfo.addEventListener(
      PlayerEvent.BAG_CAPICITY_INCRESS,
      this.__infoChange,
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
    GoodsManager.Instance.addEventListener(
      BagEvent.CHECK_BAG_FULL,
      this.__bagIsFullHandler,
      this,
    );
    NotificationManager.Instance.addEventListener(
      NotificationEvent.SHOW_BATTLE_GUARD_ITEMS,
      this.showBattleGuardItems,
      this,
    );
  }

  private removeEvent() {
    this.list_tab.off(fgui.Events.CLICK_ITEM, this, this.onTabClick); //onTabClick方法的第一个参数就是当前被点击的对象
    this.list.off(fgui.Events.SCROLL_END, this, this.updateBagPage);
    this.list.off(fgui.Events.CLICK_ITEM, this, this.onClickItem);
    this.btn_tidy.offClick(this, this.onBtnTidyClick);
    this.btn_sale.offClick(this, this.onBtnSaleClick);
    this.btn_cancel.offClick(this, this.onBtnCancelClick);
    this.btn_sure.offClick(this, this.onBtnSureClick);
    this.btn_cancel_1.offClick(this, this.onBtnCancelClick);
    this.batch_put.offClick(this, this.onBtnBatchPutClick);
    this.btn_tidy2.offClick(this, this.onBtnTidyClick);
    this.btn_put.offClick(this, this.onBtnPutClick);
    this.btn_cancel2.offClick(this, this.onBtnCancelClick);
    PlayerManager.Instance.currentPlayerModel.playerInfo.removeEventListener(
      PlayerEvent.BAG_CAPICITY_INCRESS,
      this.__infoChange,
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
    GoodsManager.Instance.removeEventListener(
      BagEvent.CHECK_BAG_FULL,
      this.__bagIsFullHandler,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      NotificationEvent.SHOW_BATTLE_GUARD_ITEMS,
      this.showBattleGuardItems,
      this,
    );
  }

  private onBtnTidyClick(event: Laya.Event) {
    this.btn_tidy.touchable = false;
    this.sortBag(true, this._sortByType);
    Laya.timer.once(2000, this, this.delayTidy);
  }

  private delayTidy() {
    if (this.btn_tidy) this.btn_tidy.touchable = true;
  }

  /**批量放入 */
  private onBtnBatchPutClick() {
    BagModel.bag_state = Enum_BagState.BatchPut;
    this.list.refreshVirtualList();
    this.list.selectionMode = fgui.ListSelectionMode.Multiple_SingleClick;
  }

  /**放入 */
  onBtnPutClick() {
    let selections: number[] = this.list.getSelection();
    let selectedItemDatas: GoodsInfo[] = [];
    for (let i = 0; i < selections.length; i++) {
      const pos = selections[i];
      if (this._itemList[pos]) {
        selectedItemDatas.push(this._itemList[pos]);
      }
    }
    if (selectedItemDatas.length > 0) {
      BagHelper.oneKeyMoveToConsortiaBag(selectedItemDatas);
    } else {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("bagwnd.consortia.putTips"),
      );
      return;
    }
  }

  private onClickItem(item: PlayerBagCell, evt: Laya.Event) {
    let childIndex: number = this.list.getChildIndex(item);
    let pos: number = this.list.childIndexToItemIndex(childIndex);
    // Logger.yyz(`点击了${pos}号格子, 格子内容: `, item.itemData);
    if (BagModel.bag_state == Enum_BagState.BatchPut) {
      let selections: number[] = this.list.getSelection();
      let leftCount = BagHelper.checkConsortiaStorageLeftNum();
      if (selections.length > leftCount) {
        //格子数不足
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation(
            "bagwnd.consortia.storage.numberNotEnlogh",
          ),
        );
        item.selected = false;
        return;
      }
    } else {
      if (item.state == -1) {
        let line: number = Math.floor(
          (pos + this._bagNumPerLine) / this._bagNumPerLine,
        );
        let openLine: number = this.bagLimit / this._bagNumPerLine;
        let count: number = line - openLine;
        count = Math.ceil(count); //以防出现0.7999999999的情况

        let point = this.getPointByLine(count);
        let confirm: string =
          LangManager.Instance.GetTranslation("public.confirm");
        let cancel: string =
          LangManager.Instance.GetTranslation("public.cancel");
        let prompt: string =
          LangManager.Instance.GetTranslation("public.prompt");
        let content: string = LangManager.Instance.GetTranslation(
          "cell.mediator.playerbag.OpenGridMediator.content",
          point,
          count,
        );
        let checkStr = LangManager.Instance.GetTranslation(
          "mainBar.view.VipCoolDownFrame.useBind",
        );
        let checkStr2 = LangManager.Instance.GetTranslation(
          "mainBar.view.VipCoolDownFrame.promptTxt",
        );
        SimpleAlertHelper.Instance.Show(
          SimpleAlertHelper.USEBINDPOINT_ALERT,
          {
            line: count,
            point: point,
            checkRickText: checkStr,
            checkRickText2: checkStr2,
            checkDefault: true,
          },
          prompt,
          content,
          confirm,
          cancel,
          this.confirmFunc.bind(this),
        );
      } else if (item.state == 1) {
        if (BagModel.bag_state == Enum_BagState.Split) {
          let selections: number[] = this.list.getSelection();
          let itemIndex: number = selections[0];
          let childIndex: number = this.list.itemIndexToChildIndex(itemIndex);
          let currGrid: PlayerBagCell = this.list.getChildAt(
            childIndex,
          ) as PlayerBagCell;
          let targetPos: number = this.getNearestEmptyGridPos(currGrid);

          if (currGrid.info.count > 1) {
            if (targetPos == -1) {
              let str: string = LangManager.Instance.GetTranslation(
                "cell.mediator.consortiabag.ConsortiaCaseCellClickMediator.command01",
              );
              MessageTipManager.Instance.show(str);
            } else {
              UIManager.Instance.ShowWind(EmWindow.SplitConfirmWnd, [
                currGrid,
                targetPos,
              ]);
            }
          }
        } else if (BagModel.bag_state == Enum_BagState.Sale) {
          let gold: number =
            GoodsCheck.getSellGold(item.info) * item.info.count;
          if (gold <= 0) {
            //不可出售
            let str: string = LangManager.Instance.GetTranslation(
              "bag.helper.BagHelper.command01",
            );
            MessageTipManager.Instance.show(str);
            this.list.removeSelection(pos);
          } else if (item.info.existJewel()) {
            //有宝石
            let str: string = LangManager.Instance.GetTranslation(
              "bag.helper.BagHelper.command02",
            );
            MessageTipManager.Instance.show(str);
            this.list.removeSelection(pos);
          } else if (item.info.isLock) {
            //已锁定
            let str: string = LangManager.Instance.GetTranslation(
              "vicepassword.description2",
            );
            MessageTipManager.Instance.show(str);
            this.list.removeSelection(pos);
          }
        }
      }
    }
  }

  /**
   * remark 带勾选的确认提示框的回调函数
   * @param result   点击了确定还是取消按钮
   * @param flag  是否勾选了checkbox, 这里指是否使用绑钻
   * @param data  回调参数
   * @private
   */
  private confirmFunc(result: boolean, flag: boolean, data: any) {
    if (result) {
      let msg: PayTypeMsg = new PayTypeMsg();
      msg.payType = 0;
      if (!flag) {
        msg.payType = 1;
      }
      msg.property1 = data.line;
      SocketManager.Instance.send(C2SProtocol.U_C_BAG_BUY, msg);
    }
  }

  private onBtnSaleClick(event: Laya.Event) {
    BagModel.bag_state = Enum_BagState.Sale;
    this.list.refreshVirtualList();

    this.list.selectionMode = fgui.ListSelectionMode.Multiple_SingleClick;
  }

  private onBtnCancelClick(event: Laya.Event) {
    BagModel.bag_state = Enum_BagState.Default;
    this.list.refreshVirtualList();

    this.list.selectionMode = fgui.ListSelectionMode.None;
    this.list.selectNone();
  }

  private onBtnSureClick(event: Laya.Event) {
    let selections: number[] = this.list.getSelection();
    let selectedItemDatas: GoodsInfo[] = [];
    for (let i = 0; i < selections.length; i++) {
      const pos = selections[i];
      if (this._itemList[pos]) {
        selectedItemDatas.push(this._itemList[pos]);
      }
    }
    if (selectedItemDatas.length > 0) {
      UIManager.Instance.ShowWind(EmWindow.SaleConfirmWnd, selectedItemDatas);
    }
  }

  private __infoChange() {
    this.list.refreshVirtualList();
  }

  private __bagItemUpdateHandler(infos: GoodsInfo[]) {
    // console.error("update");
    Laya.timer.callLater(this, this.refreshBagList);
    // //note 由于是虚拟列表, 隐藏不见的列表项是没有被创建的, 得到的childIndex会等于-1而报错, 应该忽略-1不更新, 反正也看不到
    // let item: BagGrid = this._itemDic[info.pos+"_"+info.objectId+"_"+info.bagType];
    // let childIndex:number = this.list.itemIndexToChildIndex(info.pos);
    // if(item && childIndex > 0)
    // {
    //     (this.list.getChildAt(childIndex) as BagGrid).itemData = info;
    // }

    // this.renderListItem(info.pos, this.list.getChildAt(childIndex) as BagGrid);
  }

  private updateItemlist() {
    if (this._isBattleGuardShow) {
      this.updateBagData(GoodsSonType.RESIST_GEM);
      this.list.itemRenderer = Laya.Handler.create(
        this,
        this.renderListItem,
        null,
        false,
      );
      this.list.numItems =
        Math.max(Math.ceil(this._itemList.length / 25), 1) * 25; //this._itemList.length;
    } else {
      this.updateBagData();
      this.list.itemRenderer = Laya.Handler.create(
        this,
        this.renderListItem,
        null,
        false,
      );
      this.list.numItems = this._bagTotalNum;
    }
    this.updateBagPage();
  }

  private refreshBagList() {
    Logger.yyz("刷新背包物品！");
    this.updateItemlist();
  }

  private __bagItemDeleteHandler(infos: GoodsInfo[]) {
    this.updateItemlist();

    // let item: BagGrid = this._itemDic[info.pos+"_"+info.objectId+"_"+info.bagType];
    // let childIndex:number = this.list.itemIndexToChildIndex(info.pos);
    // if(item && childIndex > 0)
    // {
    //     (this.list.getChildAt(childIndex) as BagGrid).itemData = null;
    // }

    // this.renderListItem(info.pos, this.list.getChildAt(childIndex) as BagGrid);

    //物品出售后取消选中状态
    for (let info of infos) this.list.removeSelection(info.pos);
  }

  private showBattleGuardItems(isShow: boolean) {
    this._isBattleGuardShow = isShow;
    this.list_tab.enabled = !isShow;
    this.btn_sale.enabled = this.btn_tidy.enabled = !isShow;
    this.btn_cancel.enabled =
      this.btn_cancel_1.enabled =
      this.btn_sure.enabled =
        !isShow;
    this.onSale.selectedIndex = 0;
    BagModel.bag_state = Enum_BagState.Default;
    this.list.selectNone();
    this.updateItemlist();
  }

  private getNearestEmptyGridPos(currGrid: PlayerBagCell): number {
    let targetIndex: number = -1;
    let index: number = currGrid.info.pos;
    for (let i = index; i < this.bagLimit; i++) {
      if (!this._itemList[i]) {
        targetIndex = i;
        break;
      }
    }

    if (targetIndex == -1) {
      for (let i = 0; i < index; i++) {
        if (!this._itemList[i]) {
          targetIndex = i;
          break;
        }
      }
    }

    return targetIndex;
  }

  /**
   * 根据行数计算开启背包所需的钻石或者礼金
   * */
  private getPointByLine(line: number): number {
    let cfgValue = 10;
    let cfgItem =
      TempleteManager.Instance.getConfigInfoByConfigName("Hero_EngagePrice");
    if (cfgItem) {
      cfgValue = Number(cfgItem.ConfigValue);
    }
    let count: number = 0;
    let openLine: number =
      PlayerManager.Instance.currentPlayerModel.playerInfo.bagCount /
      this._bagNumPerLine;
    let totolLine: number = line + openLine;
    for (let i: number = openLine; i < totolLine; i++) {
      if (i < 10) {
        count += (i + 1) * cfgValue;
      } else {
        count += 10 * cfgValue;
      }
    }
    return count;
  }

  protected sortFun(a: GoodsInfo, b: GoodsInfo): number {
    if (!a.templateInfo || !b.templateInfo) return 1; //不存在的物品排序处理
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
      if (a.templateInfo.IsCanBatch == 1 && b.templateInfo.IsCanBatch == 0) {
        return -1;
      } else if (
        a.templateInfo.IsCanBatch == 0 &&
        b.templateInfo.IsCanBatch == 1
      ) {
        return 1;
      } else {
        if (
          (index_a == GoodsSonType.SONTYPE_OPENBOX ||
            index_a == GoodsSonType.SONTYPE_MULTI_BOX) &&
          index_b != GoodsSonType.SONTYPE_OPENBOX &&
          index_b != GoodsSonType.SONTYPE_MULTI_BOX
        ) {
          return -1;
        } else if (
          (index_b == GoodsSonType.SONTYPE_OPENBOX ||
            index_b == GoodsSonType.SONTYPE_MULTI_BOX) &&
          index_a != GoodsSonType.SONTYPE_OPENBOX &&
          index_a != GoodsSonType.SONTYPE_MULTI_BOX
        ) {
          return 1;
        } else {
          if (
            index_a == GoodsSonType.SONTYPE_BUFFER &&
            index_b != GoodsSonType.SONTYPE_BUFFER
          ) {
            return -1;
          } else if (
            index_a != GoodsSonType.SONTYPE_BUFFER &&
            index_b == GoodsSonType.SONTYPE_BUFFER
          ) {
            return 1;
          } else {
            if (
              BagHelper.checkCanUseGoods(a.templateInfo.SonType) &&
              !BagHelper.checkCanUseGoods(b.templateInfo.SonType)
            ) {
              return -1;
            } else if (
              !BagHelper.checkCanUseGoods(a.templateInfo.SonType) &&
              BagHelper.checkCanUseGoods(b.templateInfo.SonType)
            ) {
              return 1;
            } else {
              if (index_a < index_b) {
                return -1;
              } else if (index_a > index_b) {
                return 1;
              } else {
                if (a.templateId < b.templateId) {
                  return -1;
                } else if (a.templateId > b.templateId) {
                  return 1;
                } else {
                  if (a.strengthenGrade < b.strengthenGrade) {
                    return 1;
                  } else if (a.strengthenGrade > b.strengthenGrade) {
                    return -1;
                  } else {
                    if (a.templateInfo.NeedGrades < b.templateInfo.NeedGrades) {
                      return -1;
                    } else if (
                      a.templateInfo.NeedGrades > b.templateInfo.NeedGrades
                    ) {
                      return 1;
                    } else {
                      return 0;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  private sortByTpye(item1: GoodsInfo, item2: GoodsInfo): number {
    let arr: any[] = [100, 104, 101, 102, 103, 106, 105];
    let type1: number = item1.templateInfo.Property1;
    let type2: number = item2.templateInfo.Property1;
    let index1: number = arr.indexOf(type1);
    let index2: number = arr.indexOf(type2);
    //            若返回值为负, 则表示 A 在排序后的序列中出现在 B 之前。
    //            若返回值为 0, 则表示 A 和 B 具有相同的排序顺序。
    //            若返回值为正, 则表示 A 在排序后的序列中出现在 B 之后。
    if (index1 == index2) {
      if (item1.templateId == item2.templateId) {
        if (item1.isBinds) {
          return -1;
        } else {
          return 1;
        }
      } else {
        return item2.templateId - item1.templateId;
      }
    } else {
      return index1 - index2;
    }
  }

  // private onHelp(){
  //     let title = '';
  //     let content = '';
  //     title = LangManager.Instance.GetTranslation("public.help");
  //     content = LangManager.Instance.GetTranslation("role.roleProperty.helpContent");
  //     UIManager.Instance.ShowWind(EmWindow.Help, { title: title, content: content });
  // }

  public getBaseBagItemByPos(pos: number): PlayerBagCell {
    return this._itemDic.get(pos + "_0_" + BagType.Player);
  }

  public getBaseBagItemByType(
    sontype: number = GoodsSonType.SONTYPE_WEAPON,
  ): PlayerBagCell {
    for (const key in this._itemDic) {
      if (Object.prototype.hasOwnProperty.call(this._itemDic, key)) {
        const item: PlayerBagCell = this._itemDic.get(key);
        if (item.info && item.info.templateInfo.SonType == sontype) {
          return item;
        }
      }
    }
  }

  dispose() {
    super.dispose();
  }
}
