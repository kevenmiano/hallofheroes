// @ts-nocheck
import LangManager from "../../../core/lang/LangManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIManager from "../../../core/ui/UIManager";
import { NumericStepper } from "../../component/NumericStepper";
import { EmWindow } from "../../constant/UIDefine";
import MarkGoodsItem from "./component/MarkGoodsItem";
import MarketBuyItem from "./component/MarketBuyItem";
import MarketItemPurchaseInfoMsg = com.road.yishi.proto.market.MarketItemPurchaseInfoMsg;
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import MarketManager from "../../manager/MarketManager";
import { t_s_itempricelimitData } from "../../config/t_s_itempricelimit";

import IMarketItemPriceMsg = com.road.yishi.proto.market.IMarketItemPriceMsg;
import { PlayerManager } from "../../manager/PlayerManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import GoodsSonType from "../../constant/GoodsSonType";
import RechargeAlertMannager from "../../manager/RechargeAlertMannager";
import { ResourceManager } from "../../manager/ResourceManager";
import ColorConstant from "../../constant/ColorConstant";
/**
 * 市场求购
 */
export default class MarketBuyWnd extends BaseWindow {
    public resizeContent = true;
    public setOptimize = true;

    public frame: fgui.GLabel;
    public bbg: fgui.GImage;
    public itemBg: fgui.GImage;
    public tb1: fgui.GImage;
    public br1: fgui.GImage;
    public br2: fgui.GImage;
    public bt: fgui.GImage;
    public goodsItem: MarkGoodsItem;
    public priceStepper: NumericStepper;
    public buyStepper: NumericStepper;
    public marketBuyList: fgui.GList;
    public marketSellList: fgui.GList;
    public pushBtn: fgui.GButton;
    public sellCountLab: fgui.GRichTextField;
    public buyCountLab: fgui.GRichTextField;
    public pushCountLab: fgui.GRichTextField;
    public goodsNameLab: fgui.GTextField;
    public sellPriceTxt: fgui.GTextField;
    public sellCountTxt: fgui.GTextField;
    public buyPriceTxt: fgui.GTextField;
    public buyCountTxt: fgui.GTextField;
    public myBuyPriceTxt: fgui.GTextField;
    public myBuyCountTxt: fgui.GTextField;
    public mySumPriceTxt: fgui.GTextField;
    public buyPriceLab: fgui.GTextField;
    public main: fgui.GGroup;

    public pushGoldLab: fgui.GRichTextField;
    public goldIcon: fgui.GImage;

    private _cacheGoodsInfo: GoodsInfo;

    private _cacheLimit: t_s_itempricelimitData;

    private sellListData: IMarketItemPriceMsg[];

    private buyListData: IMarketItemPriceMsg[];

    private payGold = 0;

    OnInitWind(): void {
        this.initTranslate();
    }

    OnShowWind() {
        super.OnShowWind();
        this.addEvent();
        this.initPuchargeView();
    }

    OnHideWind(): void {
        super.OnHideWind();
    }

    private initTranslate() {
        this.frame.title = LangManager.Instance.GetTranslation("Market.buy.title");

        this.sellCountLab.text = LangManager.Instance.GetTranslation("Market.sell.sellCount", 0);
        this.buyCountLab.text = LangManager.Instance.GetTranslation("Market.sell.buyCount", 0);
        // this.pushCountLab.text = LangManager.Instance.GetTranslation("Market.sell.pushCount", 0, 0);

        this.sellPriceTxt.text = LangManager.Instance.GetTranslation("Market.buy.sellPrice");
        this.sellCountTxt.text = LangManager.Instance.GetTranslation("Market.buy.sellCount");

        this.buyPriceTxt.text = LangManager.Instance.GetTranslation("Market.buy.buyPrice");
        this.buyCountTxt.text = LangManager.Instance.GetTranslation("Market.buy.buyCount");

        this.myBuyPriceTxt.text = LangManager.Instance.GetTranslation("Market.buy.minePrice");
        this.myBuyCountTxt.text = LangManager.Instance.GetTranslation("Market.buy.mineCount");
        this.mySumPriceTxt.text = LangManager.Instance.GetTranslation("Market.buy.sumPrice");

        this.pushBtn.title = LangManager.Instance.GetTranslation("Market.buy.pushTxt");
    }

    private addEvent() {
        this.marketBuyList.setVirtual();
        this.marketBuyList.itemRenderer = Laya.Handler.create(this, this.onMarketBuyRender, null, false);

        this.marketSellList.setVirtual();
        this.marketSellList.itemRenderer = Laya.Handler.create(this, this.onMarketSellRender, null, false);

        this.pushBtn.onClick(this, this.onPushBtnTap);
        // this.buyStepper.show(0, 1, 1);
    }

    private initPuchargeView() {
        let msg = this.frameData as MarketItemPurchaseInfoMsg;
        if (!msg || !(msg instanceof MarketItemPurchaseInfoMsg)) return;

        let c = MarketManager.Instance.curPuchareCount;
        let m = MarketManager.Instance.marketPuchareMax;

        let fc = MarketManager.Instance.freeUseMarkeOrderCount;
        let fm = MarketManager.Instance.freeUseMarkeOrderMax;

        let pc = MarketManager.Instance.payUseMarketOrderCount;
        let pm = MarketManager.Instance.payUseMarketOrderMax;


        this.sellListData = msg.sellPriceList.sort((a, b) => { return a.top - b.top });

        this.buyListData = msg.purchasePriceList.sort((a, b) => { return a.top - b.top });

        this.sellCountLab.text = LangManager.Instance.GetTranslation("Market.sell.sellCount", msg.sellTotal);
        this.buyCountLab.text = LangManager.Instance.GetTranslation("Market.sell.buyCount", msg.purchaseTotal);

        // this.pushCountLab.text = LangManager.Instance.GetTranslation("Market.sell.pushCount", c, m);

        if (!this._cacheGoodsInfo) {
            this._cacheGoodsInfo = new GoodsInfo();
        }

        this._cacheGoodsInfo.templateId = msg.templateId;
        this.goodsNameLab.text = this._cacheGoodsInfo.templateInfo.TemplateNameLang;
        this.goodsNameLab.color = GoodsSonType.getColorByProfile(this._cacheGoodsInfo.templateInfo.Profile);

        this.goodsItem.info = this._cacheGoodsInfo;
        this._cacheLimit = MarketManager.Instance.getLimitBuyTemplateId(this._cacheGoodsInfo.templateId);

        let defaultPoint = this.buyListData[0] ? this.buyListData[0].point : this.sellListData[0] ? this.sellListData[0].point : this._cacheLimit.MinPrice;

        let priceStep = Math.floor(this._cacheLimit.MinPrice * 0.2);

        this.priceStepper.show(0, defaultPoint, this._cacheLimit.MinPrice, this._cacheLimit.MaxPrice, this._cacheLimit.MaxPrice, priceStep, Laya.Handler.create(this, this.onPriceChange, null, false));

        let dc = fm - fc > 0 ? fm - fc : pm - pc;
        // 取最小发布数量
        let buyMaxCount = Math.min(m - c, dc);
        //最小购买数量 1
        if (buyMaxCount <= 0) {
            buyMaxCount = 1;
        }
        this.buyStepper.show(0, 1, 1, buyMaxCount, buyMaxCount, 1, Laya.Handler.create(this, this.onPriceChange, null, false));

        this.onPriceChange();

        this.marketBuyList.numItems = this.buyListData.length;

        this.marketSellList.numItems = this.sellListData.length;

    }

    private onMarketBuyRender(index: number, item: MarketBuyItem) {
        item.info = this.buyListData[index];
        item.smllTopCrol.selectedIndex = 1;
    }

    private onMarketSellRender(index: number, item: MarketBuyItem) {
        item.info = this.sellListData[index];
        item.smllTopCrol.selectedIndex = 0;
    }

    private onPushBtnTap() {
        if (this._cacheGoodsInfo && this._cacheLimit) {
            let p = this.priceStepper.value;
            let c = this.buyStepper.value;
            this.openAlert(p, c, (this._cacheGoodsInfo.templateInfo.TemplateNameLang));
        }
    }

    private onPriceChange() {
        this.buyPriceLab.text = this.priceStepper.value * this.buyStepper.value + "";
        this.updatePushInfo();
    }

    private helpBtnClick() {
        // let title = LangManager.Instance.GetTranslation("public.help");
        // let content = LangManager.Instance.GetTranslation("Market.buy.help");
        // UIManager.Instance.ShowWind(EmWindow.Help, { title: title, content: content });
    }

    private openAlert(p: number, c: number, goodsName: string) {

        let pc = MarketManager.Instance.curPuchareCount;
        let pm = MarketManager.Instance.marketPuchareMax;
        //槽位不足
        if (pc >= pm) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("market.push.countMax"));
            return
        }

        //金币不足
        if (this.payGold > 0 && ResourceManager.Instance.gold.count < this.payGold) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("Market.sell.pushTips2"));
            return
        }
        //最小出售订单
        let myMinOrder = MarketManager.Instance.getSellOrderMinByTemplateId(this._cacheGoodsInfo.templateId);
        //您正以更低价格出售相同物品
        if (myMinOrder && p >= myMinOrder.point) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("Market.sell.errorSame"));
            return;
        }

        let content: string = LangManager.Instance.GetTranslation("market.buy.pushConfirm", p, c, goodsName, p * c);

        UIManager.Instance.ShowWind(EmWindow.TodayNotAlert, { content: content, state: 2, hidecheck1: true, backFunction: this.openAlertBack.bind(this), closeFunction: null });

    }

    private openAlertBack(check: boolean) {

        let p = this.priceStepper.value;
        let c = this.buyStepper.value;

        if (PlayerManager.Instance.currentPlayerModel.playerInfo.point < p * c) {
            RechargeAlertMannager.Instance.show();
            return;
        }

        MarketManager.Instance.reqMarketOrderOpertion(1, "", 2, this._cacheGoodsInfo.templateId, c, p);
        this.hide();
        // SharedManager.Instance.marketRefresh = check;
        // SharedManager.Instance.marketRefreshCheckDate = new Date();
        // SharedManager.Instance.saveMysteryShopRefreshCheck();
    }

    private updatePushInfo() {
        this.payGold = 0;
        let freeCount = MarketManager.Instance.freeUseMarkeOrderCount;
        let freeMax = MarketManager.Instance.freeUseMarkeOrderMax;

        let payCount = MarketManager.Instance.payUseMarketOrderCount;
        let payMax = MarketManager.Instance.payUseMarketOrderMax;
        let payGold = MarketManager.Instance.payUseMarketOrderGold;

        let fc = freeMax - freeCount;
        let pc = payMax - payCount;


        let buyCount = this.buyStepper.value;
        this.pushBtn.enabled = true;
        this.goldIcon.visible = false;
        this.pushGoldLab.visible = false;
        //免费
        if (fc >= buyCount) {
            this.pushCountLab.text = LangManager.Instance.GetTranslation("Market.sell.pushCount1", freeMax - freeCount, freeMax);
            return
        }
        //付费
        if (pc >= buyCount) {
            this.goldIcon.visible = true;
            this.pushGoldLab.visible = true;
            this.pushCountLab.text = LangManager.Instance.GetTranslation("Market.sell.pushCount2", payMax - payCount, payMax);
            this.payGold = buyCount * payGold;
            this.pushGoldLab.text = this.payGold + "";
            this.updatePushGoldColor();
            return;
        }
        //已达上限
        this.pushCountLab.text = LangManager.Instance.GetTranslation("Market.sell.pushTips3");
        this.pushBtn.enabled = false;
    }

    private updatePushGoldColor() {
        this.pushGoldLab.color = ResourceManager.Instance.gold.count >= this.payGold ? ColorConstant.LIGHT_TEXT_COLOR : ColorConstant.RED_COLOR;
    }

}