import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { GoodsManager } from "../../../manager/GoodsManager";
import { SimpleDictionary } from "../../../../core/utils/SimpleDictionary";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { BagSortType, BagType } from "../../../constant/BagDefine";
import { PlayerManager } from "../../../manager/PlayerManager";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import { PlayerEvent } from "../../../constant/event/PlayerEvent";
import { BagEvent, NotificationEvent } from "../../../constant/event/NotificationEvent";
import LangManager from '../../../../core/lang/LangManager';
import { SocketManager } from "../../../../core/net/SocketManager";
import { C2SProtocol } from "../../../constant/protocol/C2SProtocol";
import { BagModel } from "../model/BagModel";
import { EmWindow } from "../../../constant/UIDefine";
import UIManager from "../../../../core/ui/UIManager";
import { Enum_BagGridState, Enum_BagState } from "../model/Enum_BagState";
import GoodsSonType from "../../../constant/GoodsSonType";
import { GoodsCheck } from "../../../utils/GoodsCheck";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import Logger from "../../../../core/logger/Logger";
import { NotificationManager } from "../../../manager/NotificationManager";
import { PlayerBagCell } from "../../../component/item/PlayerBagCell";
import { TipsShowType } from "../../../tips/ITipedDisplay";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { RoleCtrl } from "../control/RoleCtrl";
import { RoleWnd } from "./RoleWnd";
import { BagHelper } from '../utils/BagHelper';
import PayTypeMsg = com.road.yishi.proto.player.PayTypeMsg;
import { FashionManager } from "../../../manager/FashionManager";
import Utils from "../../../../core/utils/Utils";
import { TempleteManager } from "../../../manager/TempleteManager";
import { ConsortiaManager } from "../../../manager/ConsortiaManager";

/**
 * @description 背包界面
 * @author yuanzhan.yu
 * @date 2021/2/22 17:40
 * @ver 1.0
 *
 */
export class BagWnd extends BaseWindow {
    public onSale: fgui.Controller;
    public frame: fgui.GLabel;
    public list: fgui.GList;
    public txt_page: fgui.GTextField;
    public list_tab: fgui.GList;
    public btn_sale: fgui.GButton;
    public btn_tidy: fgui.GButton;
    public btn_sure: fgui.GButton;
    public btn_cancel: fgui.GButton;
    public btn_cancel_1: fgui.GButton;

    public batch_put: fgui.GButton;//批量放入
    public btn_tidy2: fgui.GButton;//整理
    public btn_put: fgui.GButton;//放入
    public btn_cancel2: fgui.GButton;//取消
    private _itemList: GoodsInfo[];//按背包格子顺序存的物品信息,  有可能中间有空数据
    private _bagDic: SimpleDictionary;
    private _itemDic: SimpleDictionary;
    private _sortByType: number = BagSortType.Default;
    private _bagTotalNum: number = 175;
    private _bagNumPerLine: number = 5;//一行拥有的格子数量
    private filterFlag: boolean = false;
    private _isBattleGuardShow: boolean = false;//战斗守护面板是否显示中
    private pageListData: GoodsInfo[][];


    constructor() {
        super();
    }

    public OnInitWind() {
        super.OnInitWind();
        this.list_tab.getChildAt(0).asButton.title = LangManager.Instance.GetTranslation('bag.tabTitle0');
        this.list_tab.getChildAt(1).asButton.title = LangManager.Instance.GetTranslation('CampaignResult.Prop');
        this.list_tab.getChildAt(2).asButton.title = LangManager.Instance.GetTranslation('card.CardFrame.equip');
        this.list_tab.getChildAt(3).asButton.title = LangManager.Instance.GetTranslation('FightingItem.typeNameTxt1');
        this.setCenter();
        this.pageListData = [[], [], [], []];
        this.onSale = this.frame.parent.getController("onSale");
        
        this.list.scrollPane.mouseWheelEnabled = false;
        this.list_tab.selectedIndex = -1;
        this.initData();
        this.addEventListener();
        PlayerManager.Instance.currentPlayerModel.bagWndIsOpen = true;
    }

    private initData() {
        this.updateBagData();

        this._itemDic = new SimpleDictionary();
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
        if (this._sortByType > 0) {
            // console.time("sortByFrame");
            this.pageListData[this._sortByType] = tempItemList.concat().sort(this.sortFun.bind(this));
            // console.timeEnd("sortByFrame");
        }
        //其它页分帧排序
        Laya.timer.callLater(this, this.sortByFrame.bind(this));
        if (sonType == GoodsSonType.RESIST_GEM) {
            this._itemList = sonTypeItemList.sort(this.sortByTpye.bind(this));
        }
    }

    private sortByFrame(sortIndex = 1) {
        if (sortIndex >= 5) return;
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



    private addEventListener() {
        this.list_tab.on(fgui.Events.CLICK_ITEM, this, this.onTabClick);//onTabClick方法的第一个参数就是当前被点击的对象
        this.list.itemRenderer = Laya.Handler.create(this, this.renderListItem, null, false);
        this.list.on(fgui.Events.SCROLL_END, this, this.updateBagPage);
        this.list.on(fgui.Events.CLICK_ITEM, this, this.onClickItem);
        this.btn_tidy.onClick(this, this.onBtnTidyClick.bind(this));
        this.btn_sale.onClick(this, this.onBtnSaleClick.bind(this));
        this.btn_cancel.onClick(this, this.onBtnCancelClick.bind(this));
        this.btn_sure.onClick(this, this.onBtnSureClick.bind(this));
        this.btn_cancel_1.onClick(this, this.onBtnCancelClick.bind(this));
        this.batch_put.onClick(this, this.onBtnBatchPutClick.bind(this));
        this.btn_tidy2.onClick(this, this.onBtnTidyClick.bind(this));
        this.btn_put.onClick(this, this.onBtnPutClick.bind(this));
        this.btn_cancel2.onClick(this, this.onBtnCancelClick.bind(this));
        PlayerManager.Instance.currentPlayerModel.playerInfo.addEventListener(PlayerEvent.BAG_CAPICITY_INCRESS, this.__infoChange, this);
        GoodsManager.Instance.addEventListener(BagEvent.UPDATE_BAG, this.__bagItemUpdateHandler, this);
        GoodsManager.Instance.addEventListener(BagEvent.DELETE_BAG, this.__bagItemDeleteHandler, this);
        GoodsManager.Instance.addEventListener(BagEvent.CHECK_BAG_FULL, this.__bagIsFullHandler, this);
        NotificationManager.Instance.addEventListener(NotificationEvent.SHOW_BATTLE_GUARD_ITEMS, this.showBattleGuardItems, this);
    }

    public OnShowWind() {
        super.OnShowWind();
        // this.onTabClick(null, null);
        let displayObject = this.list.displayObject;
        Utils.setDrawCallOptimize(this.contentPane);
        // displayObject.drawCallOptimize = true;
        displayObject['dyna'] = true;
        this.list_tab.selectedIndex = 0;
        BagModel.lastBagSortType = this._sortByType = this.list_tab.selectedIndex;

        //启用虚拟列表有几个条件: 
        // 需要定义itemRenderer。
        // 需要开启滚动。溢出处理不是滚动的列表不能开启虚拟。
        // 需要设置好列表的“项目资源”。可以在编辑器内设置, 也可以调用GList.defaultItem设置。
        this.list.setVirtual();
        
        this.list.numItems = this._bagTotalNum;
        this.list.selectionMode = fgui.ListSelectionMode.None;
        this.updateBagPage();

        // if (this.frameData && this.frameData.openFromFashion) {
        //     this.list_tab.selectedIndex = 1;
        //     this.onTabClick(this.list_tab.getChildAt(1), null);
        // }
        if (ConsortiaManager.Instance.ConsortiaStorageIsOpen) {
            this.onSale.selectedIndex = 3;
        }
        else {
            this.onSale.selectedIndex = 0;
        }
    }

    private renderListItem(index: number, item: PlayerBagCell) {
        if (!item || item.isDisposed) return;
        if (this._isBattleGuardShow) {
            item.item.showType = TipsShowType.onLongPress;
        } else {
            item.item.showType = TipsShowType.onClick;
        }

        item.item.bagType = BagType.Player;
        item.item.pos = index;
        item.item.objectId = 0;
        this._itemDic.add(item.item.pos + "_0_" + item.item.bagType, item);

        // Logger.yyz("触发背包列表刷新！！！！！！");
        if (this._itemList[index]) {
            item.info = this._itemList[index];
        } else {
            item.info = null;

            if (index < this.bagLimit) {
                //没道具的空格子
                item.state = Enum_BagGridState.Empty;
            }
            else {
                //未解锁的格子
                item.state = Enum_BagGridState.Lock;
            }
        }
    }

    private onClickItem(item: PlayerBagCell, evt: Laya.Event) {
        let childIndex: number = this.list.getChildIndex(item);
        let pos: number = this.list.childIndexToItemIndex(childIndex);
        // Logger.yyz(`点击了${pos}号格子, 格子内容: `, item.itemData);
        if (BagModel.bag_state == Enum_BagState.BatchPut) {
            let selections: number[] = this.list.getSelection();
            let leftCount = BagHelper.checkConsortiaStorageLeftNum();
            if (selections.length > leftCount) {//格子数不足
                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("bagwnd.consortia.storage.numberNotEnlogh"));
                item.selected = false;
                return;
            }
        }
        else {
            if (item.state == -1) {
                let line: number = Math.floor((pos + this._bagNumPerLine) / this._bagNumPerLine);
                let openLine: number = this.bagLimit / this._bagNumPerLine;
                let count: number = line - openLine;

                let point = this.getPointByLine(count);
                let confirm: string = LangManager.Instance.GetTranslation("public.confirm");
                let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
                let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
                let content: string = LangManager.Instance.GetTranslation("cell.mediator.playerbag.OpenGridMediator.content", point, count);
                let checkStr = LangManager.Instance.GetTranslation("mainBar.view.VipCoolDownFrame.useBind");
                let checkStr2 = LangManager.Instance.GetTranslation("mainBar.view.VipCoolDownFrame.promptTxt");
                SimpleAlertHelper.Instance.Show(SimpleAlertHelper.USEBINDPOINT_ALERT, { line: count, point: point, checkRickText: checkStr, checkRickText2: checkStr2, checkDefault: true }, prompt, content, confirm, cancel, this.confirmFunc.bind(this));
            }
            else if (item.state == 1) {
                if (BagModel.bag_state == Enum_BagState.Split) {
                    let selections: number[] = this.list.getSelection();
                    let itemIndex: number = selections[0];
                    let childIndex: number = this.list.itemIndexToChildIndex(itemIndex);
                    let currGrid: PlayerBagCell = this.list.getChildAt(childIndex) as PlayerBagCell;
                    let targetPos: number = this.getNearestEmptyGridPos(currGrid);

                    if (currGrid.info.count > 1) {
                        if (targetPos == -1) {
                            let str: string = LangManager.Instance.GetTranslation("cell.mediator.consortiabag.ConsortiaCaseCellClickMediator.command01");
                            MessageTipManager.Instance.show(str);
                        }
                        else {
                            UIManager.Instance.ShowWind(EmWindow.SplitConfirmWnd, [currGrid, targetPos]);
                        }
                    }
                }
                else if (BagModel.bag_state == Enum_BagState.Sale) {
                    let gold: number = GoodsCheck.getSellGold(item.info) * item.info.count;
                    if (gold == 0)//不可出售
                    {
                        let str: string = LangManager.Instance.GetTranslation("bag.helper.BagHelper.command01");
                        MessageTipManager.Instance.show(str);
                        this.list.removeSelection(pos);
                    }
                    else if (item.info.existJewel())//有宝石
                    {
                        let str: string = LangManager.Instance.GetTranslation("bag.helper.BagHelper.command02");
                        MessageTipManager.Instance.show(str);
                        this.list.removeSelection(pos);
                    }
                    else if (item.info.isLock)//已锁定
                    {
                        let str: string = LangManager.Instance.GetTranslation("vicepassword.description2");
                        MessageTipManager.Instance.show(str);
                        this.list.removeSelection(pos);
                    }
                }
            }
        }
    }

    /**
     * 根据行数计算开启背包所需的钻石或者礼金
     * */
    private getPointByLine(line: number): number {
        let cfgValue = 10;
        let cfgItem = TempleteManager.Instance.getConfigInfoByConfigName("Hero_EngagePrice");
        if (cfgItem) {
            cfgValue = Number(cfgItem.ConfigValue);
        }
        let count: number = 0;
        let openLine: number = PlayerManager.Instance.currentPlayerModel.playerInfo.bagCount / this._bagNumPerLine;
        let totolLine: number = line + openLine
        for (let i: number = openLine; i < totolLine; i++) {
            if (i < 10) {
                count += (i + 1) * cfgValue;
            } else {
                count += 10 * cfgValue;
            }
        }
        return count;
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

    private __infoChange() {
        this.list.refreshVirtualList();
    }

    private __bagItemUpdateHandler(info: GoodsInfo) {
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
            this.list.numItems = Math.max(Math.ceil(this._itemList.length / 25), 1) * 25;//this._itemList.length;
        }
        else {
            this.updateBagData();
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
        for (let info of infos) {
            this.list.removeSelection(info.pos);
        }
    }

    private __bagIsFullHandler() {
        GoodsManager.Instance.filterGoodsInGeneralAndConsortiaBag();
    }

    private __tabIntervalOnce() {
        this.tabIntervalState = true;
        this.list_tab.displayObject.mouseEnabled = true;
        Laya.timer.clear(this, this.__tabIntervalOnce);
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

        this.tabIntervalState = false;
        this.list_tab.displayObject.mouseEnabled = false;
        if (ConsortiaManager.Instance.ConsortiaStorageIsOpen) {
            this.onSale.selectedIndex = 3;
        } else {
            this.onSale.selectedIndex = 0;
        }

        BagModel.bag_state = Enum_BagState.Default;
        this.list.selectNone();

        if (this.list_tab.selectedIndex > 0) {//时装移除后类型要加1
            this._sortByType = this.list_tab.selectedIndex + 1;
        } else {
            this._sortByType = this.list_tab.selectedIndex
        }
        BagModel.lastBagSortType = this._sortByType;

        this.sortBag(true, this._sortByType);

        this.filterFlag = true;
        GoodsManager.Instance.filterFlag = this.filterFlag;
        this.list.scrollToView(0);
        this.updateBagPage();
        Laya.timer.once(this.tabInterval, this, this.__tabIntervalOnce)
        if (!item) {
            return;
        }
        let roleCtrl: RoleCtrl = FrameCtrlManager.Instance.getCtrl(EmWindow.RoleWnd) as RoleCtrl;
        if (!roleCtrl) return;
        let wnd: RoleWnd = roleCtrl.view as RoleWnd;
        if (wnd && wnd.isShowing) {
            wnd.changeBagWnd = false;
            if (this._sortByType == BagSortType.Fashion) {
                wnd.page.selectedIndex = 1;
            }
            else {
                wnd.page.selectedIndex = 0;
            }
            Logger.yyz("⚽触发角色面板切页！");
        }

    }

    private onBtnTidyClick(event: Laya.Event) {
        this.sortBag(true, this._sortByType);
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
        }
        else {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("bagwnd.consortia.putTips"));
            return;
        }
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
        if (boxGoods && boxGoods.templateInfo.SonType == GoodsSonType.SONTYPE_NOVICE_BOX) {
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
            t_old_pos = (sort_arr[i]).pos;
            if (t_old_pos != i) {
                isChange = true;
            }
            send_pos_old.push(t_old_pos);
            send_pos_new.push(i);
        }

        if (isChange || isOverlay) {
            GoodsManager.Instance.fixBagItem(send_pos_old, send_pos_new, BagType.Player, isOverlay);
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

    protected get bagLimit(): number {
        return PlayerManager.Instance.currentPlayerModel.playerInfo.bagTotalCount;
    }

    protected sortFun(a: GoodsInfo, b: GoodsInfo): number {
        if (!a.templateInfo || !b.templateInfo) return 1;//不存在的物品排序处理
        let index_a: number = a.templateInfo.SonType;
        let index_b: number = b.templateInfo.SonType;
        if (GoodsManager.Instance.isType(a, this._sortByType) && !GoodsManager.Instance.isType(b, this._sortByType)) {
            return -1
        }
        else if (!GoodsManager.Instance.isType(a, this._sortByType) && GoodsManager.Instance.isType(b, this._sortByType)) {
            return 1;
        }
        else {
            // 高阶时装在前- SonType小的在前- templateId大的在前
            if (GoodsManager.Instance.isFashion(a.templateInfo) && GoodsManager.Instance.isFashion(b.templateInfo)) {
                let aLevel = FashionManager.Instance.getFashionLevelByInfo(a)
                let bLevel = FashionManager.Instance.getFashionLevelByInfo(b)
                if (aLevel == bLevel) {
                    if (index_a == index_b) {
                        return b.templateId - a.templateId
                    } else {
                        return index_a - index_b
                    };
                } else {
                    return bLevel - aLevel;
                }
            } else {
                if (index_a < index_b) {
                    return -1;
                }
                else if (index_a > index_b) {
                    return 1;
                }
                else {
                    if (a.templateId < b.templateId) {
                        return 1;
                    }
                    else if (a.templateId > b.templateId) {
                        return -1;
                    }
                    else {
                        if (a.strengthenGrade < b.strengthenGrade) {
                            return 1;
                        }
                        else if (a.strengthenGrade > b.strengthenGrade) {
                            return -1;
                        }
                        else {
                            if (!a.isBinds && b.isBinds) {
                                return -1;
                            }
                            else if (a.isBinds && !b.isBinds) {
                                return 1;
                            }
                            else {
                                return 0;
                            }
                        }
                    }
                }
            }
        }

        return 0;
    }

    private updateBagPage() {
        //因为是延迟执行, 所以当在批量使用播放动画时关闭界面会报错, modify by zhihua.zhou2021-12-20
        if (this.txt_page) {
            this.txt_page.text = (this.list.scrollPane.currentPageX + 1) + "/" + Math.max(Math.ceil(this.list.numItems / 25), 1);
        }
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

    private showBattleGuardItems(isShow: boolean) {
        this._isBattleGuardShow = isShow;
        this.list_tab.enabled = !isShow;
        this.btn_sale.enabled = this.btn_tidy.enabled = !isShow;
        this.btn_cancel.enabled = this.btn_cancel_1.enabled = this.btn_sure.enabled = !isShow;
        this.onSale.selectedIndex = 0;
        BagModel.bag_state = Enum_BagState.Default;
        this.list.selectNone();
        this.updateItemlist();
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
                }
                else {
                    return 1;
                }
            }
            else {
                return item2.templateId - item1.templateId;
            }
        }
        else {
            return index1 - index2;
        }
    }

    public getBaseBagItemByPos(pos: number): PlayerBagCell {
        return this._itemDic.get(pos + "_0_" + BagType.Player);
    }

    public showEffectBySontype(sontype: number) {
        for (const key in this._itemDic) {
            if (Object.prototype.hasOwnProperty.call(this._itemDic, key)) {
                const item: PlayerBagCell = this._itemDic.get(key)
                if (item.info && item.info.templateInfo.SonType == sontype) {
                    // item.showEffect();
                }
            }
        }
    }

    public getBaseBagItemByType(sontype: number = GoodsSonType.SONTYPE_WEAPON): PlayerBagCell {
        for (const key in this._itemDic) {
            if (Object.prototype.hasOwnProperty.call(this._itemDic, key)) {
                const item: PlayerBagCell = this._itemDic.get(key)
                if (item.info && item.info.templateInfo.SonType == sontype) {
                    return item
                }
            }
        }
    }

    public OnHideWind() {
        super.OnHideWind();

        this.removeEventListener();
        PlayerManager.Instance.currentPlayerModel.bagWndIsOpen = false;
        // 右下角提示有新的装备, 进背包点装备弹出提示, 此时执行新手关闭背包了, 导致提示界面依然显示
        if (UIManager.Instance.isShowing(EmWindow.EquipTip)) {
            UIManager.Instance.HideWind(EmWindow.EquipTip);
        }
        if (UIManager.Instance.isShowing(EmWindow.EquipContrastTips)) {
            UIManager.Instance.HideWind(EmWindow.EquipContrastTips);
        }
    }

    private removeEventListener() {
        this.list_tab.off(fgui.Events.CLICK_ITEM, this, this.onTabClick);//onTabClick方法的第一个参数就是当前被点击的对象
        this.list.off(fgui.Events.SCROLL_END, this, this.updateBagPage);
        this.list.off(fgui.Events.CLICK_ITEM, this, this.onClickItem);
        this.btn_tidy.offClick(this, this.onBtnTidyClick.bind(this));
        this.btn_sale.offClick(this, this.onBtnSaleClick.bind(this));
        this.btn_cancel.offClick(this, this.onBtnCancelClick.bind(this));
        this.btn_sure.offClick(this, this.onBtnSureClick.bind(this));
        this.btn_cancel_1.offClick(this, this.onBtnCancelClick.bind(this));
        this.batch_put.offClick(this, this.onBtnBatchPutClick.bind(this));
        this.btn_tidy2.offClick(this, this.onBtnTidyClick.bind(this));
        this.btn_put.offClick(this, this.onBtnPutClick.bind(this));
        this.btn_cancel2.offClick(this, this.onBtnCancelClick.bind(this));
        PlayerManager.Instance.currentPlayerModel.playerInfo.removeEventListener(PlayerEvent.BAG_CAPICITY_INCRESS, this.__infoChange, this);
        GoodsManager.Instance.removeEventListener(BagEvent.UPDATE_BAG, this.__bagItemUpdateHandler, this);
        GoodsManager.Instance.removeEventListener(BagEvent.DELETE_BAG, this.__bagItemDeleteHandler, this);
        GoodsManager.Instance.removeEventListener(BagEvent.CHECK_BAG_FULL, this.__bagIsFullHandler, this);
        NotificationManager.Instance.removeEventListener(NotificationEvent.SHOW_BATTLE_GUARD_ITEMS, this.showBattleGuardItems, this);
    }

    dispose() {
        this.onSale.selectedIndex = 0;
        BagModel.bag_state = Enum_BagState.Default;
        this.list.selectNone();
        this.list.itemRenderer.recover();
        this.list.itemRenderer = null;
        this._itemDic.clear();
        this._itemDic = null;
        this.filterFlag = false;
        this._itemList = null;
        this._bagDic = null;
        super.dispose();
    }
}