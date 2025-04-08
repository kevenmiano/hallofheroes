/*
 * @Author: jeremy.xu
 * @Date: 2022-12-08 17:37:58
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-01-09 16:16:20
 * @Description: 欢乐折扣商城物品单元格
 */
import FUI_ShopDiscountGoodItem from "../../../../../../fui/Shop/FUI_ShopDiscountGoodItem";
import LangManager from "../../../../../core/lang/LangManager";
import UIManager from "../../../../../core/ui/UIManager";
import { BaseItem } from "../../../../component/item/BaseItem";
import TemplateIDConstant from "../../../../constant/TemplateIDConstant";
import { EmWindow } from "../../../../constant/UIDefine";
import { GoodsInfo } from "../../../../datas/goods/GoodsInfo";
import { MessageTipManager } from "../../../../manager/MessageTipManager";
import { PlayerManager } from "../../../../manager/PlayerManager";
import RechargeAlertMannager from "../../../../manager/RechargeAlertMannager";
import { DiscountShopManager } from "../../control/DiscountShopManager";
import { DiscountShopGoodInfo, DiscountShopModel } from "../../model/DiscountShopModel";

export default class ShopDiscountGoodItem extends FUI_ShopDiscountGoodItem {
    private _cellData: DiscountShopGoodInfo = null;
    //@ts-ignore
    public tipBtn1: BaseTipItem
    //@ts-ignore
    public tipBtn2: BaseTipItem
    protected onConstruct() {
        super.onConstruct();
        this.onEvent();
    }

    private onEvent() {
        this.btnBuy.onClick(this, this.btnBuyClick);
    }

    private offEvent() {
        this.btnBuy.offClick(this, this.btnBuyClick);
    }

    public set info(value: DiscountShopGoodInfo) {
        if (!value) return;
        this.tipBtn1.setInfo(TemplateIDConstant.TEMP_ID_DIAMOND);
        this.tipBtn2.setInfo(TemplateIDConstant.TEMP_ID_DIAMOND,false);
        this._cellData = value;
        let goodsInfo: GoodsInfo = new GoodsInfo();
        goodsInfo.templateId = value.itemId;
        goodsInfo.count = value.count;
        (this.item as BaseItem).info = goodsInfo;
        this.txtOriginalPrice.text = value.price.toString();
        this.txtOriginalPrice.displayObject.cacheAs = "bitmap";
        this.txtLimit.text = LangManager.Instance.GetTranslation("public.shop.limitbuy", value.buycount, value.limit);

        let leftBuyCount = value.limit - value.buycount;
        this.cCanBuy.selectedIndex = leftBuyCount > 0 ? 1 : 0;

        if (this.discountModel.myDiscount <= 0) {
            this.txtCurrentPrice.text = "?";
        } else {
            let price = (value.price * this.discountModel.myDiscount / 10 < 1) ? 1 : value.price * this.discountModel.myDiscount / 10;
            this.txtCurrentPrice.text = Math.floor(price).toString();
        }
    }

    private btnBuyClick() {
        if (!this._cellData) return;
        if (this.discountModel.myDiscount <= 0) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("public.shop.takeTodayDiscount"))
            return;
        }

        let price = (this._cellData.price * this.discountModel.myDiscount / 10 < 1) ? 1 : this._cellData.price * this.discountModel.myDiscount / 10;
        let consume = Math.floor(price);
        let hasMoney = PlayerManager.Instance.currentPlayerModel.playerInfo.point;
        if (hasMoney < consume) {
            RechargeAlertMannager.Instance.show();
            return;
        }

        let canBuyCnt = Math.floor(hasMoney / consume)
        let leftBuyCnt = this._cellData.limit - this._cellData.buycount

        var goodsInfo: GoodsInfo = new GoodsInfo();
        goodsInfo.templateId = this._cellData.itemId;
        goodsInfo.count = this._cellData.count;
        UIManager.Instance.ShowWind(EmWindow.QuantitySelector, {
            content: "QuantitySelector.title01",
            count: 1,
            showNum: true,
            maxCount: Math.min(canBuyCnt, leftBuyCnt),
            info: goodsInfo,
            price: consume,
            callBack: this.quantitySelectorCallBack.bind(this)
        })
    }

    private quantitySelectorCallBack(b: boolean, count: number, info: GoodsInfo) {
        if (b) {
            DiscountShopManager.Instance.operationDiscountShop(3, this._cellData.index, count);
        }
    }

    public get discountModel(): DiscountShopModel {
        return DiscountShopManager.Instance.model;
    }

    dispose() {
        this.offEvent();
        super.dispose();
    }
}