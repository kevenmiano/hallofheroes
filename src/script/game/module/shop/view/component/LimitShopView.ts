// @ts-nocheck
import FUI_LimitShopView from "../../../../../../fui/Shop/FUI_LimitShopView";
import LangManager from "../../../../../core/lang/LangManager";
import { PackageIn } from "../../../../../core/net/PackageIn";
import { ServerDataManager } from '../../../../../core/net/ServerDataManager';
import UIButton from '../../../../../core/ui/UIButton';
import StringHelper from "../../../../../core/utils/StringHelper";
import { eFilterFrameText, FilterFrameText } from "../../../../component/FilterFrameText";
import { BaseItem } from "../../../../component/item/BaseItem";
import { NumericStepper } from "../../../../component/NumericStepper";
import { t_s_itemtemplateData } from "../../../../config/t_s_itemtemplate";
import { NotificationEvent, ShopEvent } from "../../../../constant/event/NotificationEvent";
import GoodsSonType from "../../../../constant/GoodsSonType";
import { S2CProtocol } from '../../../../constant/protocol/S2CProtocol';
import { EmWindow } from "../../../../constant/UIDefine";
import { GoodsInfo } from "../../../../datas/goods/GoodsInfo";
import { PlayerInfo } from "../../../../datas/playerinfo/PlayerInfo";
import { PlayerModel } from "../../../../datas/playerinfo/PlayerModel";
import { GoodsManager } from "../../../../manager/GoodsManager";
import { MessageTipManager } from "../../../../manager/MessageTipManager";
import { MountsManager } from "../../../../manager/MountsManager";
import { NotificationManager } from "../../../../manager/NotificationManager";
import { PathManager } from "../../../../manager/PathManager";
import { PlayerManager } from "../../../../manager/PlayerManager";
import RechargeAlertMannager from "../../../../manager/RechargeAlertMannager";
import { ShopManager } from "../../../../manager/ShopManager";
import { TempleteManager } from "../../../../manager/TempleteManager";
import { WildSoulInfo } from "../../../mount/model/WildSoulInfo";
import { MainShopInfo } from "../../model/MainShopInfo";
import { ShopGoodsInfo } from "../../model/ShopGoodsInfo";
import { LimitShopItem } from './LimitShopItem';
import SimpleAlertHelper from '../../../../component/SimpleAlertHelper';
import Utils from "../../../../../core/utils/Utils";
import { FrameCtrlManager } from "../../../../mvc/FrameCtrlManager";
import Logger from "../../../../../core/logger/Logger";
import { C2SProtocol } from "../../../../constant/protocol/C2SProtocol";
import BaseTipItem from "../../../../component/item/BaseTipItem";
import ShopMsg = com.road.yishi.proto.shop.ShopMsg;
import { getMultiLangList, getMultiLangValue } from "../../../../../core/lang/LanguageDefine";

/**
 * 限时商店
 */

export default class LimitShopView extends FUI_LimitShopView {
    private _btnDiscount: UIButton;
    private _btnBuy: UIButton;
    //@ts-ignore
    public item: BaseItem;
    //@ts-ignore
    public stepper: NumericStepper;

    private _goodsList: MainShopInfo[] = [];
    private _giftsList: GoodsInfo[] = [];
    private _currentSelectedItem: LimitShopItem;
    private _currentSelectedItemData: any;
    private _handler: Laya.Handler;

    private _countGood: number = 0;
    private _isVIPShop: boolean = false;
    private _homepageTime: number = 0;
    private showNum: number = 0;//当前可购买的数量

    private isSelected: boolean = false;

    private _discountTempleteId: number = 0;
    private _discountTempleteData: GoodsInfo = null;
    //@ts-ignore
    public tipBtn2: BaseTipItem;

    public init() {
        this.isSelected = false;
        ShopManager.Instance.isFrist = true;
        ShopManager.Instance.isTimeBuyOpen = true;
        this.initView();
        this.initEvent();
        this.initTimeGoods();
    }

    public resetUI() {
        this._discountTempleteId = 0;
        this._discountTempleteData = null;
        this.c_discount.selectedIndex = 0;
    }

    public set isVIPShop(value: boolean) {
        this._isVIPShop = value;
    }


    /** 第一次打开时向服务端请求限时抢购物品的倒计时时间 和 数目 */
    private initTimeGoods() {
        if (ShopManager.Instance.isFrist) {
            ShopManager.Instance.refreshTimeGoods();
            ShopManager.Instance.isFrist = false;
        }
    }

    private initView() {
        this._btnBuy = new UIButton(this.btn_buy);
        this.setBuybtnState();
        this._btnBuy.btnInternal = 300;
        this._btnDiscount = new UIButton(this.btn_discount);
        this._btnDiscount.visible = GoodsManager.Instance.hasDiscount;
        this.list_shop.itemRenderer = Laya.Handler.create(this, this.renderListItem, null, false);
        // this.list_shop.setVirtual();
        Utils.setDrawCallOptimize(this.itemList);
        this.itemList.itemRenderer = Laya.Handler.create(this, this.renderGiftListItem, null, false);
        this.itemList.setVirtual();
        this.onTabChanged();
    }

    private initEvent() {
        this.list_shop.on(fgui.Events.CLICK_ITEM, this, this.onListShopClick);
        this._btnBuy.onClick(this, this.onBtnBuyClick);
        this._btnDiscount.onClick(this, this.onBtnDiscount);
        ServerDataManager.listen(S2CProtocol.U_C_SHOP_BUY, this, this.__shopResult);
        NotificationManager.Instance.addEventListener(NotificationEvent.SHOPHOMEPAGE_UPDATA, this.__updateHandler, this);
        NotificationManager.Instance.addEventListener(NotificationEvent.SHOP_TIME_BUY_REFRESH, this.__refreshTimeBuy, this);
        NotificationManager.Instance.addEventListener(ShopEvent.BUY_DISCOUNT_RET, this.buyDisCountRet, this);
        NotificationManager.Instance.addEventListener(ShopEvent.GOODS_DISCOUNT_UPDATE, this.updateDisCount, this);
        NotificationManager.Instance.addEventListener(ShopEvent.SHOP_BUY_RESULT, this.onBuyResult, this);
    }

    /**购买返回结果 */
    __shopResult(pkg: PackageIn) {
        let msg = pkg.readBody(ShopMsg) as ShopMsg;
        if (msg.buyInfo.result == 1 || msg.buyInfo.result == 12) {
            this.updateView();
        }
    }

    /**更新购买商品 */
    updateDisCount(shopInfo: MainShopInfo) {
        this.updateView();
    }

    private renderGiftListItem(index: number, item: BaseItem) {
        item.info = this._giftsList[index];
    }

    private renderListItem(index: number, item: LimitShopItem) {
        item.info = this._goodsList[index];
    }

    private __refreshTimeBuy() {
        this.updateView();
    }

    public updateView() {
        this.setBuybtnState();
        this._countGood = 0;
        let discountList: Array<any> = (this._isVIPShop ? ShopManager.Instance.model.getTimeBuyList(1) : ShopManager.Instance.model.getTimeBuyList(0));
        discountList.sort((item1: MainShopInfo, item2: MainShopInfo) => {
            if (item1.sortId < item2.sortId) {
                return -1;
            }
            else if (item1.sortId > item2.sortId) {
                return 1;
            }
            else {
                return 0;
            }
        })
        this._goodsList = discountList;
        if (this._goodsList && this._goodsList.length) {
            this.list_shop.numItems = this._goodsList.length;
            this.addTimer();
            this.__updateTimeHandler();
            this.onTabChanged();
        }
    }

    private addTimer() {
        this.removeTimer();
        this._homepageTime = 0;
        this._homepageTime = setInterval(this.__updateTimeHandler.bind(this), 1000);
    }

    private removeTimer() {
        clearInterval(this._homepageTime);
        this._homepageTime = 0;
    }

    private __updateTimeHandler() {
        let b: boolean = false;
        if (!this._goodsList) {
            this.removeTimer();
            return;
        }
        let count = this._goodsList.length;
        for (let i: number = 0; i < count; i++) {
            if (this._goodsList[i]) {
                let remainTime: number = this._goodsList[i].remainTime;
                if (remainTime < 0) {
                    this._goodsList.splice(i, 1);
                    continue;
                }
                if (this._goodsList[i].type == 2) {
                    let endTime: number = ShopManager.Instance.timeBuyDesc;
                    let descTime: number = endTime - this.playerModel.sysCurTimeBySecond;
                    if (descTime > 0) { //倒计时时间大于0 刷新视图
                        b = true;
                    }
                    else {//倒计时时间小于等于0 则向服务端发送刷新时间的请求
                        if (b) {
                            b = false
                            ShopManager.Instance.refreshTimeGoods();
                            ShopManager.Instance.refreshGoodsCount();
                        }
                    }
                }

            }
        }
    }

    private onTabChanged() {
        if (this._goodsList && this._goodsList.length > 0 && !this.isSelected) {
            this.isSelected = true;
            this.list_shop.scrollToView(0);
            this.list_shop.selectedIndex = 0;
            let childIndex: number = this.list_shop.itemIndexToChildIndex(this.list_shop.selectedIndex);
            this.onListShopClick(this.list_shop.getChildAt(childIndex) as LimitShopItem, null);
        }
        else {
            if (this._currentSelectedItem && this._currentSelectedItemData.type == 1) {
                ShopManager.Instance.currBuyGoods = (this._currentSelectedItemData);
                ShopManager.Instance.getGoodsBuyNum(((this._currentSelectedItemData as MainShopInfo).id));
            }
            else {
                if (this._currentSelectedItem) {
                    this.updateRightView(this._currentSelectedItemData);
                }
            }
        }
    }

    private onListShopClick(item: LimitShopItem, evt: Laya.Event) {
        this._discountTempleteId = 0;
        this._discountTempleteData = null;
        this.c_discount.selectedIndex = 0;
        this.itemList.numItems = 0;
        this._currentSelectedItem = item;
        this._currentSelectedItemData = this._currentSelectedItem.info;
        this.updateRightView(this._currentSelectedItemData);
        if (item.info.type == 1) {
            ShopManager.Instance.currBuyGoods = (this._currentSelectedItemData);
            ShopManager.Instance.getGoodsBuyNum(((this._currentSelectedItemData as MainShopInfo).id));
        }
    }

    //名称多语言
    private _multiLanNames: Map<string, string> = new Map();

    public set nameLang(value: string) {
        this._multiLanNames = getMultiLangList(value, this._multiLanNames);
    }

    public get nameLang(): string {
        let value = getMultiLangValue(this._multiLanNames);
        return value;
    }

    private updateRightView(iteminfo: MainShopInfo) {
        if (!iteminfo) {
            return;
        }
        let info = iteminfo;
        this.isGift.selectedIndex = info.isGift ? 0 : 1;
        this.c_discount.selectedIndex = 0;
        if (info.isGift) {
            this.nameLang = info.names;
            this.item_gift.url = PathManager.info.REQUEST_PATH + info.url;
            this.txt_name.text = this.nameLang;
            this.txt_name.color = FilterFrameText.Colors[eFilterFrameText.ItemQuality][2];
            this.txt_describe.text = LangManager.Instance.GetTranslation("propTips.canReceive");
            //遍历礼包里边的物品
            let shopGoods: t_s_itemtemplateData;
            let goodsInfo: GoodsInfo = null;
            this._giftsList = [];
            this.itemList.numItems = 0;
            for (let i: number = 0; i < 9; i++) {
                let index = (i > 0 ? i : "");
                if (info["templateId" + index] == 0) {
                    continue;
                }
                goodsInfo = new GoodsInfo();
                shopGoods = TempleteManager.Instance.getGoodsTemplatesByTempleteId(info["templateId" + index]);
                if (!shopGoods) {
                    continue;
                }
                goodsInfo.templateId = shopGoods.TemplateId;
                if (i > 0) {
                    goodsInfo.count = info["count" + index];
                }
                else {
                    goodsInfo.count = info["counts"];
                }
                if (goodsInfo) {
                    this._giftsList.push(goodsInfo);
                }
            }
            this.itemList.numItems = this._giftsList.length;
            if (this._giftsList.length > 6) {
                this.itemList.scrollToView(0);
            }
        } else {
            this.txt_describe.text = LangManager.Instance.GetTranslation("propTips.detail");
            let goodsInfo: GoodsInfo = new GoodsInfo();
            goodsInfo.templateId = info.templateId;
            goodsInfo.count = info["counts"];
            this.item.info = goodsInfo;
            this.txt_name.text = goodsInfo.templateInfo.TemplateNameLang + "" + (goodsInfo.count > 1 ? "*" + goodsInfo.count.toString() : "");
            this.txt_name.color = FilterFrameText.Colors[eFilterFrameText.ItemQuality][goodsInfo.templateInfo.Profile - 1];
            let desc = TempleteManager.Instance.getGoodsTempleteDesc(goodsInfo.templateInfo);
            this.txt_desc.getChild('content').text = desc;
        }
        this.refreshLimitView();
        this._handler && this._handler.recover();
        this._handler = Laya.Handler.create(this, this.stepperChangeHandler, null, false);
        this.stepper.show(0, 1, 1, 999, this.showNum, 1, this._handler);
        let templateId: number = ShopManager.Instance.model.getTemplateId(info.type);
        this.tipBtn2.setInfo(templateId);
        this.txt_price.text = "" + info.price * this.stepper.value;
        let sysDiscountTemp = ShopManager.Instance.getDefaultSelectGoods(Number(this.txt_price.text));
        if (sysDiscountTemp) {
            this.onDiscountHandler(sysDiscountTemp.templateId, sysDiscountTemp);
        }
    }

    /**刷新限购展示 */
    private refreshLimitView() {
        let totalFlag: boolean = false;
        let oneFlag: boolean = false;
        let _data = this._currentSelectedItemData;

        if (_data.type == ShopGoodsInfo.PAY_BY_GIFT) {
            let num: number = _data.limitCount - _data.count;
            if (num > 0) {
                this.txt_limit.text = LangManager.Instance.GetTranslation("shop.view.GoodsItem.limited06", _data.limitCount); //每4小时限购{n}个
                oneFlag = true;
                this.btn_buy.enabled = true;
            } else {
                this.txt_limit.text = LangManager.Instance.GetTranslation("shop.view.GoodsItem.limited05");//购买量达到上限
                oneFlag = true;
                this.btn_buy.enabled = false;
            }
        } else {
            if (_data.canOneCount >= 0) {
                if (!(_data instanceof ShopGoodsInfo)) {
                    let selfCount = (_data.oneDayCount - ShopManager.Instance.count);
                   
                    if (_data.maxCount == -1) { // 全服总数不限购： 取自己剩余可购买数
                        this.showNum = selfCount
                    } else { // 全服总数限购： 取 自己剩余可购买数与总剩余数 最小值
                        this.showNum = Math.min(_data.canTotalCount, selfCount);
                    }
                    this.showNum = this.showNum > 0 ? this.showNum : 0;
                    this.txt_limit.text = (this.showNum > 0 ? "[color=#FFECC6]" : "[color=#FF0000]") + this.showNum + "[/color]/" + _data.oneDayCount;
                } else {
                    //@ts-ignore
                    this.showNum = _data.canOneCount - ShopManager.Instance.count;
                    this.showNum = this.showNum > 0 ? this.showNum : 0;
                    //@ts-ignore
                    this.txt_limit.text = (this.showNum > 0 ? "[color=#FFECC6]" : "[color=#FF0000]") + this.showNum + "[/color]/" + _data.canOneCount;
                }
                if (this.showNum <= 0) {
                    // this.txt_limit.text = LangManager.Instance.GetTranslation("shop.view.GoodsItem.limited05");//购买量达到上限
                    this.btn_buy.enabled = false;
                } else {
                    this.btn_buy.enabled = true;
                }
                oneFlag = true;
            } else if (_data.canOneCount == -1) {
                this.txt_limit_title.text = "";
                this.txt_limit.text = "";
                this.btn_buy.enabled = true;
            }
        }
    }


    protected get isFashion(): boolean {
        if (!this._currentSelectedItem) {
            return false;
        }
        if (this._currentSelectedItemData.isGift) {
            return false;
        }
        if (!TempleteManager.Instance.getGoodsTemplatesByTempleteId(this._currentSelectedItemData.templateId)) {
            return false;
        }
        switch (TempleteManager.Instance.getGoodsTemplatesByTempleteId(this._currentSelectedItemData.templateId).SonType) {
            case GoodsSonType.FASHION_CLOTHES:
                return true;
            case GoodsSonType.FASHION_HEADDRESS:
                return true;
            case GoodsSonType.FASHION_WEAPON:
                return true;
            case GoodsSonType.SONTYPE_WING:
                return true;
        }
        return false;
    }

    protected checkExist(tId: number): string {
        let goods: t_s_itemtemplateData = TempleteManager.Instance.getGoodsTemplatesByTempleteId(tId);
        if (goods.SonType != GoodsSonType.SONTYPE_MOUNT_CARD) {
            return "";
        }
        let exist: WildSoulInfo = MountsManager.Instance.avatarList.getWildSoulInfo(goods.Property1);
        if (goods.Property2 > 0) {
            exist = null;
        }
        if (exist) {
            return LangManager.Instance.GetTranslation("shop.view.frame.BuyFrameI.mopupexitst");
        } else {
            return "";
        }
    }

    private onBtnDiscount() {
        if (this._currentSelectedItem && this._currentSelectedItemData) {
            let stepCount = this.stepper.value;
            let price = this._currentSelectedItemData.price;
            let totalCost = stepCount * price;
            FrameCtrlManager.Instance.open(EmWindow.DiscountWnd, { count: totalCost, selectId: this._discountTempleteId, selectData: this._discountTempleteData, callFunc: this.onDiscountHandler.bind(this), });
        }
    }

    private onDiscountHandler(templeteId: number, templeteData: GoodsInfo) {
        this._discountTempleteId = templeteId;
        this._discountTempleteData = templeteData;
        Logger.warn("onDiscountHandler:", this._discountTempleteId, this._discountTempleteData);
        this.txt_discount.visible = false;
        this.txt_price2.visible = false;
        let totalCost = Number(this._currentSelectedItemData.price * this.stepper.value);
        if (this._discountTempleteId != 0) {
            this.c_discount.selectedIndex = 1;
            this.txt_discount.visible = true;
            this.txt_price2.visible = true;
            let discountValue = Number(this._discountTempleteData.templateInfo.Property3);
            this.txt_price.text = (totalCost - discountValue).toString();
            this.txt_price2.text = (totalCost).toString();
            this.txt_discount.text = LangManager.Instance.GetTranslation("shop.discount.discountText", discountValue);
        } else {
            this.c_discount.selectedIndex = 0;
            this.txt_price.text = (totalCost).toString();
            this.txt_price2.text = "";
        }
    }

    private onBtnBuyClick() {
        if (this._currentSelectedItem) {
            let discountValue: number = 0;
            let countValue = 0;
            let confirm: string = LangManager.Instance.GetTranslation("public.confirm");
            let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
            let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
            let content: string = "";
            if (this._discountTempleteId != 0 && this._discountTempleteData != null) {
                if (this._discountTempleteData) {
                    discountValue = this._discountTempleteData.templateInfo.Property3;
                }
                countValue = this._currentSelectedItemData.price * this.stepper.value - discountValue;
                content = LangManager.Instance.GetTranslation("ShopWnd.Alert.DiamondDiscountBuy", countValue, discountValue);
            } else {
                if (this._currentSelectedItemData.isGift) {
                    content = LangManager.Instance.GetTranslation("shop.view.limitShop.AlertContent", this._currentSelectedItem.info.names);
                } else {
                    let goodsInfo: GoodsInfo = this.item.info
                    let names = goodsInfo!.templateInfo.TemplateNameLang + "" + (goodsInfo.count > 1 ? "*" + goodsInfo.count.toString() : "");
                    content = LangManager.Instance.GetTranslation("shop.view.limitShop.AlertContent", names);
                }
            }
            SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, this._currentSelectedItem, prompt, content, confirm, cancel, this.confirmBuyCallback.bind(this));
        } else {
            let str: string = LangManager.Instance.GetTranslation("shop.view.frame.BuyFrameI.buyFailed");
            MessageTipManager.Instance.show(str);
            return;
        }
    }

    private confirmBuyCallback(b: boolean, bindCheck: boolean, data: any) {
        if (b) {
            let disCountTempId: number = 0;
            let disCountValue = 0;
            if (this._discountTempleteId != 0) {
                disCountTempId = this._discountTempleteData.id;
                let disTemplete = TempleteManager.Instance.getGoodsTemplatesByTempleteId(disCountTempId) as t_s_itemtemplateData;
                if (disTemplete) {
                    disCountValue = Number(disTemplete.Property3);
                }
            }

            let costValue = Number(this.txt_price.text) - disCountValue;
            if (costValue > this.PayMoney) {
                RechargeAlertMannager.Instance.show();
                return;
            }
            let msg: string = this.checkExist((data.info as MainShopInfo).templateId)
            if (!StringHelper.isNullOrEmpty(msg)) {
                MessageTipManager.Instance.show(msg);
                return;
            }
            ShopManager.Instance.type = (data.info as MainShopInfo).type;
            ShopManager.Instance.sendShoping((data.info as MainShopInfo).id, this.stepper.value, this.playerInfo.userId, true, C2SProtocol.U_C_SHOP_BUY, false, disCountTempId);
            this.setBuybtnState();
        }
    }

    /**
     * 获取商品购买数量返回
     */
    private buyDisCountRet() {
        let currBuyGoods = ShopManager.Instance.currBuyGoods;
        if (!currBuyGoods) {
            return;
        }
        this.updateRightView(currBuyGoods);
    }

    /**当前可购买数量 */
    private get currentCanCount(): number {
        if (this._currentSelectedItemData.discount == 0) {//如果免费,则为当天能够买的数量
            if (this._currentSelectedItemData.count >= this._currentSelectedItemData.oneDayCount) {
                return 0;
            }
            else {
                return this._currentSelectedItemData.oneDayCount - this._currentSelectedItemData.count;
            }
        }
        else {
            let pointCount: number = Math.floor(this.PayMoney / (this._currentSelectedItemData.price * this._currentSelectedItemData.discount));
            if (this._currentSelectedItemData.oneDayCount == -1) {
                return pointCount;
            }
            else if (pointCount < 1) {
                return 1;
            }
            else {
                if (this._currentSelectedItemData.count >= this._currentSelectedItemData.oneDayCount) {
                    return 0;
                }
                else {
                    return Math.min(pointCount, this._currentSelectedItemData.oneDayCount - this._currentSelectedItemData.count);
                }
            }
        }
    }

    public get PayMoney(): number {
        return this.playerInfo.point;
    }

    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    private get playerModel(): PlayerModel {
        return PlayerManager.Instance.currentPlayerModel;
    }

    private stepperChangeHandler(value: number) {
        let totalCost = Number(this._currentSelectedItemData.price * this.stepper.value);

        let sysDiscountTemp = ShopManager.Instance.getDefaultSelectGoods(totalCost);
        if (sysDiscountTemp) {
            this.onDiscountHandler(sysDiscountTemp.templateId, sysDiscountTemp);
        } else {
            this.onDiscountHandler(0, null);
        }

        if (totalCost > this.PayMoney) {
            this.txt_price.color = "#CC0000";
        } else {
            this.txt_price.color = "#FFFFFF";
        }

        //discount
        let discountReq = 0;
        if (this._discountTempleteData) {
            discountReq = Number(this._discountTempleteData.templateInfo.Property2);
            let discountValue = Number(this._discountTempleteData.templateInfo.Property3);
            this.txt_price.text = (totalCost - discountValue).toString();
            this.txt_price2.text = (totalCost).toString();
            this.c_discount.selectedIndex = 1;
        } else {
            this.txt_price.text = (totalCost).toString();
            this.txt_price2.text = "";
            this.c_discount.selectedIndex = 0;
        }
        if (totalCost < discountReq) {//清除不使用折扣卷
            this._discountTempleteId = 0;
            this._discountTempleteData = null;
            this.c_discount.selectedIndex = 0;
        }
    }

    public removeEvent() {
        this.list_shop.off(fgui.Events.CLICK_ITEM, this, this.onListShopClick);
        this._btnBuy && this._btnBuy.offClick(this, this.onBtnBuyClick.bind(this));
        this._btnDiscount && this._btnDiscount.offClick(this, this.onBtnDiscount.bind(this));
        ServerDataManager.cancel(S2CProtocol.U_C_SHOP_BUY, this, this.__shopResult);
        NotificationManager.Instance.removeEventListener(NotificationEvent.SHOPHOMEPAGE_UPDATA, this.__updateHandler, this);
        NotificationManager.Instance.removeEventListener(NotificationEvent.SHOP_TIME_BUY_REFRESH, this.__refreshTimeBuy, this);
        NotificationManager.Instance.removeEventListener(ShopEvent.BUY_DISCOUNT_RET, this.buyDisCountRet, this);
        NotificationManager.Instance.removeEventListener(ShopEvent.GOODS_DISCOUNT_UPDATE, this.updateDisCount, this);
        NotificationManager.Instance.removeEventListener(ShopEvent.SHOP_BUY_RESULT, this.onBuyResult, this);
    }

    /**购买返回结果 */
    private onBuyResult() {
        this.setBuybtnState();
        this._btnDiscount.visible = GoodsManager.Instance.hasDiscount;
        if (this._discountTempleteId > 0) {
            //重置购买数量
            this.stepper.resetStepper();
            this.txt_price.text = "" + this._currentSelectedItemData.price * this.stepper.value;
        }
        this._discountTempleteId = 0;
        this._discountTempleteData = null;
        this.c_discount.selectedIndex = 0;
    }

    private __updateHandler(event) {
        this.removeTimer();
        this.updateView();
    }

    private setBuybtnState() {
        let state = ShopManager.Instance.requestBuyState;
        this._btnBuy.enabled = !state;
        this.btn_buy.titleColor = this._btnBuy.enabled ? '#ffecc6' : '#aaaaaa';
        Utils.strokeColor(this._btnBuy.view as fgui.GButton, this._btnBuy.enabled);
    }

    dispose(destroy = true) {
        ShopManager.Instance.isTimeBuyOpen = false;
        this.removeTimer();
        this.removeEvent();
        this.isSelected = false;
        this._handler && this._handler.recover();
        this._handler = null;
        // if (this.list_shop && !this.list_shop.isDisposed) {
        //     this.list_shop.itemRenderer && this.list_shop.itemRenderer.recover();
        // }
        Utils.clearGListHandle(this.list_shop);
        // if (this.itemList && !this.itemList.isDisposed) {
        //     this.itemList.itemRenderer && this.itemList.itemRenderer.recover();
        // }
        Utils.clearGListHandle(this.itemList);
        this._goodsList = null;
        this._giftsList = null;
        this._currentSelectedItem = null;
        destroy && super.dispose();
    }
}

