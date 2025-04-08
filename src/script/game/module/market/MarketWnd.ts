// @ts-nocheck
import FUI_TabButton from "../../../../fui/Base/FUI_TabButton";
import LangManager from "../../../core/lang/LangManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIManager from "../../../core/ui/UIManager";
import { EmWindow } from "../../constant/UIDefine";
import MarketManager from "../../manager/MarketManager";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import MarketListCom from "./component/MarketListCom";
import MarketMineCom from "./component/MarketMineCom";
import MarketRecordCom from "./component/MarketRecordCom";


import MarketItemListMsg = com.road.yishi.proto.market.MarketItemListMsg;

import MarketOrderListMsg = com.road.yishi.proto.market.MarketOrderListMsg;

import MarketItemSellInfoMsg = com.road.yishi.proto.market.MarketItemSellInfoMsg;

import MarketItemPurchaseInfoMsg = com.road.yishi.proto.market.MarketItemPurchaseInfoMsg;

import MarketOrderRespMsg = com.road.yishi.proto.market.MarketOrderRespMsg;

import MarketOrderReqMsg = com.road.yishi.proto.market.MarketOrderReqMsg;

import MarketInfoReqMsg = com.road.yishi.proto.market.MarketInfoReqMsg;

import IMarketOrderMsg = com.road.yishi.proto.market.IMarketOrderMsg;

import MarketItemInfoMsg = com.road.yishi.proto.market.IMarketItemInfoMsg;

import TemplateIDConstant from "../../constant/TemplateIDConstant";
import BaseTipItem from "../../component/item/BaseTipItem";
import { FormularySets } from "../../../core/utils/FormularySets";
import ColorConstant from "../../constant/ColorConstant";
import { PlayerManager } from "../../manager/PlayerManager";
import HomeWnd from "../home/HomeWnd";
import { PlayerEvent } from "../../constant/event/PlayerEvent";
import { MessageTipManager } from "../../manager/MessageTipManager";
import NewbieModule from "../guide/NewbieModule";
import NewbieConfig from "../guide/data/NewbieConfig";


/**
 * 市场
 */
export default class MarketWnd extends BaseWindow {

    public resizeContent = true;
    public setOptimize = true;
    protected setSceneVisibleOpen: boolean = true;

    public tabSelectCol: fgui.Controller;
    public frame: fgui.GLabel;
    public yLine: fgui.GImage;
    public marketTabs: fgui.GList;
    public sellBtn: fgui.GButton;
    public marketListCom: MarketListCom;
    public marketMineCom: MarketMineCom;
    public marketRecordCom: MarketRecordCom;
    public pushLab: fgui.GRichTextField;
    public giftTxt: fgui.GLabel;
    public btn_buy: fgui.GButton;

    public diamondTip: BaseTipItem;

    private tablesName: string[];

    OnInitWind(): void {
        this.initTranslate();
        this.diamondTip.setInfo(TemplateIDConstant.TEMP_ID_DIAMOND);
        this.updateAccount();
    }

    OnShowWind() {
        super.OnShowWind();
        this.addEvent();
        this.marketTabs.selectedIndex = 0;
        this.onTabChange();
        MarketManager.Instance.reqData();
    }

    OnHideWind(): void {
        super.OnHideWind();
        this.removeEvent();
    }

    private initTranslate() {
        this.frame.title = LangManager.Instance.GetTranslation("Market.main.title");
        this.tablesName = [
            LangManager.Instance.GetTranslation("Market.main.tab0"),
            LangManager.Instance.GetTranslation("Market.main.tab1"),
            LangManager.Instance.GetTranslation("Market.main.tab2")]
        this.sellBtn.title = LangManager.Instance.GetTranslation("Market.main.sell");

    }

    private addEvent() {
        this.sellBtn.onClick(this, this.onSellTap);
        this.marketTabs.itemRenderer = Laya.Handler.create(this, this.onTableRender, null, false);
        this.marketTabs.numItems = this.tablesName.length;
        this.marketTabs.on(fgui.Events.CLICK_ITEM, this, this.onTabChange);
        MarketManager.Instance.addEventListener(MarketManager.OnMineOrderList, this.OnMineOrderList, this);
        MarketManager.Instance.addEventListener(MarketManager.OnMarketInfoList, this.OnMarketInfoList, this);
        MarketManager.Instance.addEventListener(MarketManager.OnMarketPurcharseList, this.OnMarketPurcharseList, this);

        MarketManager.Instance.addEventListener(MarketManager.OnMarketOrderOption, this.OnMarketOrderOption, this);
        MarketManager.Instance.addEventListener(MarketManager.OnMineOrderSucessList, this.OnMineOrderSucessList, this)

        PlayerManager.Instance.currentPlayerModel.playerInfo.addEventListener(PlayerEvent.PLAYER_INFO_UPDATE, this.updateAccount, this);
        this.btn_buy.onClick(this, this.onBuy);

    }

    private OnMarketInfoList(list: MarketItemInfoMsg[]) {
        this.marketListCom.setInfoList(list);
    }

    private OnMineOrderList(marketOrders: IMarketOrderMsg[]) {
        this.marketMineCom.setInfoList(marketOrders)
        this.updatePush(marketOrders.length, MarketManager.Instance.marketPuchareMax);
    }

    private onTabChange() {
        if (this.marketTabs.selectedIndex == 1) {
            MarketManager.Instance.sortOrder();
            this.marketMineCom.scrollToTop();
            this.marketMineCom.setInfoList(MarketManager.Instance.getMarketOrders());
            return;
        }

        if (this.marketTabs.selectedIndex == 0) {
            NewbieModule.Instance.manualTrigger(NewbieConfig.NEWBIE_400)
            MarketManager.Instance.refreshMarketInfo();
            this.marketListCom.scrollToTop();
            return;
        }

        this.marketRecordCom.scrollToTop();
    }

    private OnMineOrderSucessList(successOrders: IMarketOrderMsg[]) {
        this.marketRecordCom.setInfoList(successOrders);
    }

    private OnMarketOrderOption(msg: MarketOrderRespMsg) {

        // 求购发布成功
        if (msg.result && msg.op == 1 && msg.type == 2) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("market.buy.pushSuccess"));
            return;
        }

        //求购发布失败
        if (!msg.result && msg.op == 1 && msg.type == 2) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("Market.buy.failed"));
            return
        }


        // 出售发布成功
        if (msg.result && msg.op == 1 && msg.type == 1) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("market.buy.pushSuccess"));
            return;
        }

        //出售发布失败
        if (!msg.result && msg.op == 1 && msg.type == 1) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("market.sell.pushFailed"));
            return
        }

    }

    public OnMarketPurcharseList(msg: MarketItemPurchaseInfoMsg) {
        FrameCtrlManager.Instance.open(EmWindow.MarketBuyWnd, msg);
        MarketManager.Instance.refreshMarketInfo();
    }

    private helpBtnClick() {
        let title = LangManager.Instance.GetTranslation("public.help");
        let content = LangManager.Instance.GetTranslation("Market.main.help");
        UIManager.Instance.ShowWind(EmWindow.Help, { title: title, content: content });
    }

    private onSellTap() {
        FrameCtrlManager.Instance.open(EmWindow.MarketSellWnd);
    }

    private onTableRender(index: number, item: FUI_TabButton) {
        item.title = this.tablesName[index];
    }


    private updateAccount() {
        // //钻石
        this.giftTxt.text = FormularySets.toStringSelf(PlayerManager.Instance.currentPlayerModel.playerInfo.point, HomeWnd.STEP);
        this.giftTxt.color = PlayerManager.Instance.currentPlayerModel.playerInfo.point < 0 ? ColorConstant.RED_COLOR : ColorConstant.LIGHT_TEXT_COLOR;
    }

    private onBuy() {
        FrameCtrlManager.Instance.open(EmWindow.ShopWnd, { page: 7 });
    }

    private updatePush(c: number, t: number) {
        this.pushLab.text = LangManager.Instance.GetTranslation("Market.sell.pushCount", c, t);
    }

    private removeEvent() {
        this.sellBtn.offClick(this, this.onSellTap);
        this.marketTabs.itemRenderer.recover();
        this.marketTabs.itemRenderer = null;

        MarketManager.Instance.removeEventListener(MarketManager.OnMarketInfoList, this.OnMarketInfoList, this);
        MarketManager.Instance.removeEventListener(MarketManager.OnMineOrderList, this.OnMineOrderList, this);
        MarketManager.Instance.removeEventListener(MarketManager.OnMarketPurcharseList, this.OnMarketPurcharseList, this);
        MarketManager.Instance.removeEventListener(MarketManager.OnMarketOrderOption, this.OnMarketOrderOption, this);
        MarketManager.Instance.removeEventListener(MarketManager.OnMineOrderSucessList, this.OnMineOrderSucessList, this)
        PlayerManager.Instance.currentPlayerModel.playerInfo.removeEventListener(PlayerEvent.PLAYER_INFO_UPDATE, this.updateAccount, this);

        this.btn_buy.offClick(this, this.onBuy);
    }


}