import FUI_DiscountItem from "../../../../../fui/Shop/FUI_DiscountItem";
import FUI_DiscountTitleItem from "../../../../../fui/Shop/FUI_DiscountTitleItem";
import LangManager from "../../../../core/lang/LangManager";
import Logger from "../../../../core/logger/Logger";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import Utils from "../../../../core/utils/Utils";
import { DISCOUNT_ITEM } from "../../../constant/event/NotificationEvent";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { NotificationManager } from "../../../manager/NotificationManager";
import { ShopManager } from "../../../manager/ShopManager";
import { DisocuntInfo } from "../model/DiscountInfo";
import DiscountItem from "./component/DiscountItem";
import DiscountTitleItem from "./component/DiscountTitleItem";


/**
 * 折扣卷
 */
export default class DiscountWnd extends BaseWindow {

    private list: fgui.GList;
    private btn_confirm: fgui.GButton;

    private txt_price: fgui.GTextField;
    private txt_price2: fgui.GTextField;
    private txt_des: fgui.GTextField;

    public c_discount: fgui.Controller;

    private listData: any[] = [];
    private selectItemCount: number = 0;
    private _selectedTempIndex: number = -1;
    private _selectedTempleteId: number = 0;
    private _selectedTempId: number = -1;
    private chooseTempleteId: number = 0;
    private _selectedTempleteData: GoodsInfo = null;
    private _callFunc: Function = null;

    public OnInitWind() {
        super.OnInitWind();
        this._selectedTempId = -1;
        this.c_discount = this.getController("c_discount");
        this.selectItemCount = this.frameData.count;
        this.listData = ShopManager.Instance.getDiscountData(this.selectItemCount);
        this._callFunc = this.frameData.callFunc;
        this._selectedTempleteData = this.frameData.selectData;
        let selectId = this.frameData.selectId ? this.frameData.selectId : 0;
        if (selectId <= 0) {//默认选择一个
            this._selectedTempleteData = ShopManager.Instance.getDefaultSelectGoods(this.selectItemCount);
            if (this._selectedTempleteData)
                selectId = this._selectedTempleteData.templateId;
        }
        this._selectedTempleteId = this.chooseTempleteId = selectId;
        if (this._selectedTempleteData)
            this._selectedTempId = this._selectedTempleteData.id;

        this.setCenter();
        this.addEvent();
        this.initView();
    }

    private addEvent() {
        this.list.itemRenderer = Laya.Handler.create(this, this.renderListItem, null, false);
        this.list.itemProvider = Laya.Handler.create(this, this.getListItemResource, null, false);
        this.list.on(fairygui.Events.CLICK_ITEM, this, this.__itemClickHandler);
        this.btn_confirm.onClick(this, this._onConfirmHandler);
        NotificationManager.Instance.addEventListener(DISCOUNT_ITEM.DISCOUNT_ITEM_CHECK_STATE, this.onCheckStateChange, this);
    }

    private offEvent() {
        // this.list && this.list.itemRenderer && this.list.itemRenderer.recover();
        // this.list && this.list.itemProvider && this.list.itemProvider.recover();
        Utils.clearGListHandle(this.list);
        this.list.off(fairygui.Events.CLICK_ITEM, this, this.__itemClickHandler);
        this.btn_confirm.offClick(this, this._onConfirmHandler);
        NotificationManager.Instance.removeEventListener(DISCOUNT_ITEM.DISCOUNT_ITEM_CHECK_STATE, this.onCheckStateChange, this);
    }

    private __itemClickHandler(item: DiscountItem, evt) {
        let evtTarget = evt.target;
        let target = fgui.GObject.cast(evtTarget)
        if (evtTarget && !(target instanceof DiscountItem) && (target instanceof fgui.GButton)) {
            let count = this.list.numItems;
            for (let index = 0; index < count; index++) {
                let element = this.list.getChildAt(index);
                if (element instanceof DiscountItem) {
                    if (item.cellIndex != index) {
                        element && element.setSelected(false)
                    } else {
                        if (item.isSelected()) {
                            item.setSelected(true);
                            this._selectedTempIndex = item.cellIndex;
                            this._selectedTempleteId = item.selectTempleteId;
                            this._selectedTempleteData = item.dataInfo;
                        } else {
                            item.setSelected(false);
                            this._selectedTempleteId = 0;
                            this._selectedTempleteData = null;
                        }
                    }
                }
            }
            this.updateCost();
            return;
        }
    }

    /**更新显示优惠 */
    private updateCost() {
        let discountValue = 0;
        this.txt_price2.text = this.selectItemCount.toString();
        if (!this._selectedTempleteData) {
            this.c_discount.selectedIndex = 0;
        } else {
            this.c_discount.selectedIndex = 1;
            discountValue = Number(this._selectedTempleteData.templateInfo.Property3);
        }
        this.txt_price.text = (this.selectItemCount - discountValue).toString();
        this.txt_des.text = LangManager.Instance.GetTranslation("shop.discount.discountText", discountValue);
    }

    private initView() {
        Utils.setDrawCallOptimize(this.list);

        this.list.numItems = this.listData.length;
        this.updateCost();
    }

    /** */
    private _onConfirmHandler() {
        Logger.warn("_selectedTempleteId:", this._selectedTempleteId);
        if (this._callFunc) {
            this._callFunc(this._selectedTempleteId, this._selectedTempleteData);
        }
        this.OnBtnClose();
    }

    //不同渲染单元格
    private getListItemResource(index: number) {
        let data = this.listData[index];
        if (data instanceof DisocuntInfo) {
            return FUI_DiscountTitleItem.URL
        } else if (data instanceof GoodsInfo) {
            return FUI_DiscountItem.URL;
        }
    }

    private renderListItem(index: number, item: DiscountItem | DiscountTitleItem) {
        if (!item || item.isDisposed) return;
        item.cellIndex = index;
        if (item instanceof DiscountItem) {
            item.chooseTempleteId = this.chooseTempleteId;
            item.setItemData(this.listData[index], this.selectItemCount);
            if (this._selectedTempleteId == this.listData[index].templateId && this.listData[index].id == this._selectedTempId && (this.listData[index] as GoodsInfo).validDate >= 0) {
                this._selectedTempleteData = this.listData[index];
                item.setSelected(true);
            } else {
                item.setSelected(false);
            }
        } else if (item instanceof DiscountTitleItem) {
            item.setItemData(this.listData[index]);
        }
    }

    /** */
    private onCheckStateChange(cellIndex: number = 0) {
        let count = this.list.numChildren;
        for (let index = 0; index < count; index++) {
            let cellItem = this.list.getChildAt(cellIndex) as DiscountItem;
            cellItem.setSelected(cellIndex == index);
        }
    }

    public OnShowWind() {
        super.OnShowWind();
    }

    public OnHideWind() {
        super.OnHideWind();
        this.offEvent();
    }

    dispose(dispose?: boolean) {
        this.offEvent();
        super.dispose(dispose);
    }
}