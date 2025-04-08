// @ts-nocheck
import FUI_PromotionItem from "../../../../../../fui/Shop/FUI_PromotionItem"
import LangManager from "../../../../../core/lang/LangManager";
import Utils from "../../../../../core/utils/Utils";
import { BaseItem } from "../../../../component/item/BaseItem";
import { t_s_rechargeData } from "../../../../config/t_s_recharge";
import { ShopEvent } from "../../../../constant/event/NotificationEvent";
import { GoodsInfo } from "../../../../datas/goods/GoodsInfo";
import { NotificationManager } from "../../../../manager/NotificationManager";
import RechargeAlertMannager from "../../../../manager/RechargeAlertMannager";
import { ShopManager } from "../../../../manager/ShopManager";

/**
 * 特惠商城单元格
 */
export default class PromotionItem extends FUI_PromotionItem {

    private _listdata: GoodsInfo[] = [];
    private _cellData: t_s_rechargeData = null;

    protected onConstruct() {
        super.onConstruct();
        Utils.setDrawCallOptimize(this.list);

        this.onEvent();
    }

    private onEvent() {
        this.Btn_Buy.onClick(this, this.onBuyPromotion);
        this.list.itemRenderer = Laya.Handler.create(this, this.renderListItem, null, false);
        NotificationManager.Instance.addEventListener(ShopEvent.PRODUCT_TODAY_UPDATE_COUNT, this.onUpdateProductCount, this);
        NotificationManager.Instance.addEventListener(ShopEvent.PRODUCT_WEEK_UPDATE_COUNT, this.onUpdateProductCount, this);
    }

    private offEvent() {
        this.Btn_Buy.offClick(this, this.onBuyPromotion);
        Utils.clearGListHandle(this.list);
        NotificationManager.Instance.removeEventListener(ShopEvent.PRODUCT_TODAY_UPDATE_COUNT, this.onUpdateProductCount, this);
        NotificationManager.Instance.removeEventListener(ShopEvent.PRODUCT_WEEK_UPDATE_COUNT, this.onUpdateProductCount, this);
    }

    private onUpdateProductCount() {
        if (!this._cellData) return;
        let rechargeCount = ShopManager.Instance.getTodayProductCount(this._cellData.ProductId);
        let maxCount = Number(this._cellData.Para3);
        let leftTxt = "";
        let leftCount = maxCount - rechargeCount;
        leftTxt = (leftCount > 0 ? "[color=#FFECC6]" : "[color=#FF0000]") + leftCount + "[/color]"
        if (this._cellData.ProductType == 6) {
            this.limitCount.text = LangManager.Instance.GetTranslation("Shop.Promotion.weeklimitText", leftTxt, maxCount);
        } else {
            this.limitCount.text = LangManager.Instance.GetTranslation("Shop.Promotion.limitText", leftTxt, maxCount);
        }

        if (rechargeCount >= maxCount) {
            //已领取
            this.Btn_Buy.title = LangManager.Instance.GetTranslation("dayGuide.view.FetchItem.alreadyGet");
            this.txt_money.text = "";
            this.Btn_Buy.enabled = false;
        } else {
            //花费金额
            let countMoney = Number(this._cellData.MoneyNum);
            this.Btn_Buy.title = "";
            if (Utils.isInteger(countMoney.toString())) {
                this.txt_money.text = ShopManager.Instance.getMoneyString() + parseInt(countMoney.toString());//价格
            } else {
                this.txt_money.text = ShopManager.Instance.getMoneyString() + countMoney.toString();//价格
            }
            this.Btn_Buy.enabled = true;
        }
    }

    public set index(value: number) {
        this.itemType.selectedIndex = value;
    }

    public set info(value: t_s_rechargeData) {
        if (!value) return;
        this._cellData = value;
        this.itemTitle.text = LangManager.Instance.GetTranslation("Shop.Promotion.itemTitle" + Number(this.itemType.selectedIndex + 1));
        this.onUpdateProductCount();
        this._listdata = [];
        let rewardDataStr = value.Para2;
        if (!rewardDataStr)
            return;
        let rewardItem: string[] = rewardDataStr.split("|");
        let count = rewardItem.length;
        for (let index = 0; index < count; index++) {
            let tempStr = rewardItem[index];
            if (!tempStr) {
                continue;
            }
            let infos = tempStr.split(",");
            let info = new GoodsInfo();
            info.templateId = Number(infos[0]);
            info.count = Number(infos[1]);
            this._listdata.push(info);
        }
        this.list.numItems = this._listdata.length;
    }

    /**渲染单元格 */
    private renderListItem(index: number, item: BaseItem) {
        item.info = this._listdata[index];
    }

    private onBuyPromotion() {
        if (!this._cellData) return;
        RechargeAlertMannager.Instance.recharge(this._cellData.ProductId);
    }

    dispose() {
        // this.list.itemRenderer && this.list.itemRenderer.recover();
        Utils.clearGListHandle(this.list);
        this.offEvent();
        super.dispose();
    }

}