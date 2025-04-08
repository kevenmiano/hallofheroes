// @ts-nocheck
import GameEventDispatcher from "../../core/event/GameEventDispatcher";
import { PackageIn } from "../../core/net/PackageIn";
import { ServerDataManager } from "../../core/net/ServerDataManager";
import { S2CProtocol } from "../constant/protocol/S2CProtocol";

import MarketItemListMsg = com.road.yishi.proto.market.MarketItemListMsg;

import MarketOrderListMsg = com.road.yishi.proto.market.MarketOrderListMsg;

import MarketItemSellInfoMsg = com.road.yishi.proto.market.MarketItemSellInfoMsg;

import MarketItemPurchaseInfoMsg = com.road.yishi.proto.market.MarketItemPurchaseInfoMsg;

import MarketOrderRespMsg = com.road.yishi.proto.market.MarketOrderRespMsg;

import MarketOrderReqMsg = com.road.yishi.proto.market.MarketOrderReqMsg;

import MarketInfoReqMsg = com.road.yishi.proto.market.MarketInfoReqMsg;

import IMarketOrderMsg = com.road.yishi.proto.market.IMarketOrderMsg;

import MarketItemInfoMsg = com.road.yishi.proto.market.IMarketItemInfoMsg;

import { SocketManager } from "../../core/net/SocketManager";
import { C2SProtocol } from "../constant/protocol/C2SProtocol";
import { t_s_itempricelimitData } from "../config/t_s_itempricelimit";
import MarketSellGoodsInfo from "../module/market/component/MarketSellGoodsInfo";
import { GoodsManager } from "./GoodsManager";
import { TempleteManager } from "./TempleteManager";
import ConfigInfoManager from "./ConfigInfoManager";
import { GoodsInfo } from "../datas/goods/GoodsInfo";
import { PlayerManager } from "./PlayerManager";
import OpenGrades from "../constant/OpenGrades";
import { ArmyManager } from "./ArmyManager";

//市场管理
export default class MarketManager extends GameEventDispatcher {

    public static OnMarketInfoList = "OnMarketInfoList";

    public static OnMineOrderList = "OnMineOrderList";

    public static OnMineOrderSucessList = "OnMineOrderSucessList";

    public static OnMarketSellList = "OnMarketSellList";

    public static OnMarketPurcharseList = "OnMarketPurcharseList";

    public static OnMarketOrderOption = "OnMarketOrderOption";

    private itempricelimits: t_s_itempricelimitData[];

    private sellItems: MarketSellGoodsInfo[];

    private marketOrders: IMarketOrderMsg[];

    private marketSuccessOrders: IMarketOrderMsg[];
    //可交易 物品Id
    private puchargeTemplateId: number[];

    private marketItemInfoList: MarketItemInfoMsg[];

    // 商品状态有修改。需要刷新
    private marketInfoChange = false;

    //商品上一次更新时间 秒
    private marketInfoUpdateTime = 0;

    //商品更新间隔 秒
    private marketInfoUpdateCD = 5;

    //求购次数限制
    //发布免费次数
    public freeUseMarkeOrderCount = 0;
    //发布追加次数
    public payUseMarketOrderCount = 0;
    //发布免费次数 限制
    private _freeUseMarkeOrderMax = 20;
    //发布追加次数 限制
    private _payUseMarketOrderMax = 30;
    //发布追加次数 金币
    private _payUseMarketOrderGold = 500000;

    //出售次数限制
    //发布免费次数2
    public freeUseMarkeOrderCount2 = 0;
    //发布追加次数2
    public payUseMarketOrderCount2 = 0;
    //发布免费次数 限制2
    private _freeUseMarkeOrderMax2 = 20;
    //发布追加次数 限制2
    private _payUseMarketOrderMax2 = 30;
    //发布追加次数 金币2
    private _payUseMarketOrderGold2 = 500000;

    private isInitConfig = false;

    private static _instance: MarketManager;

    public static get Instance(): MarketManager {
        if (!this._instance) this._instance = new MarketManager();
        return this._instance;
    }

    public getMarketOrders() {
        return this.marketOrders;
    }

    public get freeUseMarkeOrderMax() {
        this.initConfigInfo();
        return this._freeUseMarkeOrderMax;
    }

    public get payUseMarketOrderMax() {
        this.initConfigInfo();
        return this._payUseMarketOrderMax;
    }

    public get payUseMarketOrderGold() {
        this.initConfigInfo();
        return this._payUseMarketOrderGold;
    }


    public get freeUseMarkeOrderMax2() {
        this.initConfigInfo();
        return this._freeUseMarkeOrderMax2;
    }

    public get payUseMarketOrderMax2() {
        this.initConfigInfo();
        return this._payUseMarketOrderMax2;
    }

    public get payUseMarketOrderGold2() {
        this.initConfigInfo();
        return this._payUseMarketOrderGold2;
    }

    private initConfigInfo() {
        if (this.isInitConfig) return;
        let mc = ConfigInfoManager.Instance.getMarketOrderDayCount();
        this._freeUseMarkeOrderMax = mc[0];
        this._payUseMarketOrderMax = mc[1];
        this._payUseMarketOrderGold = mc[2];


        let mc2 = ConfigInfoManager.Instance.getMarketOrderDayCount2();
        this._freeUseMarkeOrderMax2 = mc2[0];
        this._payUseMarketOrderMax2 = mc2[1];
        this._payUseMarketOrderGold2 = mc2[2];


        this.isInitConfig = true;
    }

    public setup() {
        ServerDataManager.listen(S2CProtocol.U_C_MARKET_ITEM_LIST, this, this.OnMarketInfoList);

        ServerDataManager.listen(S2CProtocol.U_C_MARKET_MYORDER_LIST, this, this.OnMineOrderList);

        ServerDataManager.listen(S2CProtocol.U_C_MARKET_SELLITEM_INFO, this, this.OnMarketSellList);

        ServerDataManager.listen(S2CProtocol.U_C_MARKET_PURCHASEITEM_INFO, this, this.OnMarketPurcharseList);

        ServerDataManager.listen(S2CProtocol.U_C_MARKET_ORDERACTION_RESP, this, this.OnMarketOrderOption);

        ServerDataManager.listen(S2CProtocol.U_C_RESET_MARKET_USE_ORDERCOUNT, this, this.onResetUseOrderCount);
    }

    public reqData() {
        if (!this.checkCanMarket()) {
            return;
        }
        if (!this.refreshMarketInfo()) {
            this.dispatchEvent(MarketManager.OnMarketInfoList, this.marketItemInfoList);
        }

        if (!this.marketOrders) {
            this.reqMarketOpertion(2);
        } else {
            this.dispatchEvent(MarketManager.OnMineOrderList, this.marketOrders);
        }

        if (!this.marketSuccessOrders) {
            this.reqMarketOpertion(3);
        } else {
            this.marketSuccessOrders = this.sortByATime(this.marketSuccessOrders);
            this.dispatchEvent(MarketManager.OnMineOrderSucessList, this.marketSuccessOrders);
        }
    }

    //重置 发布数量
    public onResetUseOrderCount() {
        this.freeUseMarkeOrderCount = 0;
        this.payUseMarketOrderCount = 0;
        this.freeUseMarkeOrderCount2 = 0;
        this.payUseMarketOrderCount2 = 0;
    }

    private OnMarketInfoList(pkg: PackageIn) {
        this.marketInfoChange = false;
        this.marketInfoUpdateTime = PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond;
        let msg: MarketItemListMsg = pkg.readBody(MarketItemListMsg) as MarketItemListMsg;
        this.marketItemInfoList = msg.list;
        this.dispatchEvent(MarketManager.OnMarketInfoList, this.marketItemInfoList);
    }

    // 2:自已出售列表 3:成功交易记录 100://订单更新推送
    private OnMineOrderList(pkg: PackageIn) {
        let msg: MarketOrderListMsg = pkg.readBody(MarketOrderListMsg) as MarketOrderListMsg;

        //出售
        if (msg.freeUseMarkeOrderCount) {
            this.freeUseMarkeOrderCount2 = msg.freeUseMarkeOrderCount;
        }
        if (msg.payUseMarketOrderCount) {
            this.payUseMarketOrderCount2 = msg.payUseMarketOrderCount;
        }

        //求购
        if (msg.freeUsePurchaseCount ) {            
            this.freeUseMarkeOrderCount = msg.freeUsePurchaseCount;
        }

        if (msg.payUsePurchaseCount) {
            this.payUseMarketOrderCount = msg.payUsePurchaseCount;           
        }

        //3:成功交易记录
        if (msg.op == 3) {
            this.marketSuccessOrders = msg.orderList;
            this.marketSuccessOrders = this.sortByATime(this.marketSuccessOrders);
            this.dispatchEvent(MarketManager.OnMineOrderSucessList, this.marketSuccessOrders);
            return
        }

        //2:自已出售列表 
        if (msg.op == 2) {
            this.marketOrders = msg.orderList;
        }

        let isSuccessOrder = false;
        //订单更新推送
        if (msg.op == 100) {

            let uorder: IMarketOrderMsg;
            for (let o of msg.orderList) {
                uorder = this.getOrderByOrderId(o.orderId, this.marketOrders);
                if (uorder) {
                    uorder.isExist = o.isExist;
                    uorder.extract = o.extract;
                    //正在发布   =>  出售/求购中
                    if (uorder.status == 1 && o.status == 2) {
                        this.marketInfoChange = true;
                    }
                    //出售/求购中   =>  出售/求购成功
                    else if (uorder.status == 2 && o.status == 6) {
                        this.marketInfoChange = true;
                    }
                    //正在取消   =>  已取消
                    else if (uorder.status == 3 && o.status == 4) {
                        this.marketInfoChange = true;
                    }

                    uorder.status = o.status;
                    uorder.type = o.type;
                    uorder.point = o.point;
                    uorder.tradingPoint = o.tradingPoint;
                    uorder.actionTime = o.actionTime;
                    uorder.tax = o.tax;
                }

                //出售/求购成功 且不存在，就放入 成功记录表。
                if (o.status == 6) {
                    if (this.getOrderByOrderId(o.orderId, this.marketSuccessOrders) == null) {
                        this.marketSuccessOrders.push(o);
                    }
                    isSuccessOrder = true;
                }
            }
        }

        // this.sortByTime(this.marketOrders);
        this.dispatchEvent(MarketManager.OnMineOrderList, this.marketOrders);

        if (isSuccessOrder) {
            this.sortByATime(this.marketSuccessOrders);
            this.dispatchEvent(MarketManager.OnMineOrderSucessList, this.marketSuccessOrders);
        }
    }


    private getOrderByOrderId(orderId: string, marketOrders: IMarketOrderMsg[]) {

        if (!marketOrders) return null;

        for (let o of marketOrders) {
            if (o.orderId == orderId) {
                return o
            }
        }
        return null;
    }

    private removeOrderByOrderId(orderId: string, marketOrders: IMarketOrderMsg[]) {

        if (!marketOrders) return null;

        for (let i = 0; i < marketOrders.length; i++) {

            if (marketOrders[i].orderId == orderId) {
                marketOrders.splice(i, 1);
                return;
            }
        }
    }

    private OnMarketSellList(pkg: PackageIn) {
        let msg: MarketItemSellInfoMsg = pkg.readBody(MarketItemSellInfoMsg) as MarketItemSellInfoMsg;
        this.dispatchEvent(MarketManager.OnMarketSellList, msg);
        // msg.purchaseTotal;
        // msg.sellTotal;
        // msg.templateId;
    }

    private OnMarketPurcharseList(pkg: PackageIn) {
        let msg: MarketItemPurchaseInfoMsg = pkg.readBody(MarketItemPurchaseInfoMsg) as MarketItemPurchaseInfoMsg;
        this.dispatchEvent(MarketManager.OnMarketPurcharseList, msg);
    }

    private OnMarketOrderOption(pkg: PackageIn) {
        let msg: MarketOrderRespMsg = pkg.readBody(MarketOrderRespMsg) as MarketOrderRespMsg;
        //出售
        if (msg.freeUseMarkeOrderCount) {
            this.freeUseMarkeOrderCount2 = msg.freeUseMarkeOrderCount;
        }
        if (msg.payUseMarketOrderCount) {
            this.payUseMarketOrderCount2 = msg.payUseMarketOrderCount;
        }

        //求购
        if (msg.freeUsePurchaseCount ) {            
            this.freeUseMarkeOrderCount = msg.freeUsePurchaseCount;
        }

        if (msg.payUsePurchaseCount) {
            this.payUseMarketOrderCount = msg.payUsePurchaseCount;           
        }
        if (!this.marketOrders) return;
        let orders = msg.orderMsg.concat();
        let uorder: IMarketOrderMsg;
        //提取成功，需要移除。
        if (msg.op == 3) {
            while (uorder = orders.pop()) {
                this.removeOrderByOrderId(uorder.orderId, this.marketOrders);
            }
        }

        for (let o of orders) {
            uorder = this.getOrderByOrderId(o.orderId, this.marketOrders);
            if (uorder) {
                uorder.isExist = o.isExist;
                uorder.extract = o.extract;
                uorder.status = o.status;
                uorder.type = o.type;
                uorder.point = o.point;
                uorder.tradingPoint = o.tradingPoint;
                uorder.actionTime = o.actionTime;
                uorder.tax = o.tax;
                continue;
            }
            this.marketOrders.push(o);
        }

        // this.sortByTime(this.marketOrders);
        this.dispatchEvent(MarketManager.OnMarketOrderOption, msg);
        this.dispatchEvent(MarketManager.OnMineOrderList, this.marketOrders);
    }

    //操作类型 1:商品列表(最低价,出售数量) 2:自已出售列表 3:成功交易记录 4:出售物品信息 5:求购物品信息
    public reqMarketOpertion(op: number, templateId?: number) {
        let msg: MarketInfoReqMsg = new MarketInfoReqMsg();
        msg.op = op;
        if (templateId) {
            msg.templateId = templateId;
        }
        this.sendProtoBuffer(C2SProtocol.C_MARKET_INFO_REQ, msg);
    }

    //op 1:出售 求购 2:取消 3:提取
    //orderId 订单号
    //type '订单类型1:出售订单 2:求购订单'
    //templateId '道具编号'
    //count '数量'
    //point '当前价格'
    public reqMarketOrderOpertion(op: number, orderId: string, type: number, templateId: number, count: number, points: number) {
        let msg: MarketOrderReqMsg = new MarketOrderReqMsg();
        msg.op = op;
        msg.orderId = orderId;
        msg.type = type;
        msg.templateId = templateId;
        msg.count = count;
        msg.point = points;
        this.sendProtoBuffer(C2SProtocol.C_MARKET_ORDER_ACTION, msg);
    }

    public sendProtoBuffer(code: number, message) {
        SocketManager.Instance.send(code, message);
    }
    //出售物品
    public getSellsItems() {
        this.sellItems = [];
        let goodsManager = GoodsManager.Instance;
        let itempricelimits = this.getItemPriceLimit();
        for (let limt of itempricelimits) {
            let goodses = goodsManager.getBagGoodsByTemplateId(limt.ItemId);
            if (goodses.length > 0) {
                for (let g of goodses) {
                    if (this.checkNotPurchargeState(g)) continue;
                    let mg = new MarketSellGoodsInfo();
                    mg.goodsInfo = g;
                    mg.limitInfo = limt;
                    this.sellItems.push(mg);
                }
            }
        }
        return this.sellItems;
    }

    //物品是否可以交易
    public canPurchare(goods: GoodsInfo) {
        let puchargeTemplate = this.getpuchargeTemplateId();
        if (puchargeTemplate.indexOf(goods.templateId) < 0) return false;
        if (this.checkNotPurchargeState(goods)) return false;
        return true;
    }
    //交易的物品 状态
    private checkNotPurchargeState(goods: GoodsInfo) {
        //神器  
        if (goods.templateInfo.MasterType == 1 && goods.templateInfo.SonType == 120) {
            //已经鉴定 不能出售
            return goods.randomSkill1 || goods.randomSkill2 || goods.randomSkill3 || goods.randomSkill4 || goods.randomSkill5;
        }
        return false;
    }

    private getpuchargeTemplateId() {
        if (!this.puchargeTemplateId) {
            this.puchargeTemplateId = [];
            let itempricelimits = this.getItemPriceLimit();
            for (let limt of itempricelimits) {
                this.puchargeTemplateId.push(limt.ItemId);
            }
        }
        return this.puchargeTemplateId;
    }

    private getItemPriceLimit() {
        if (!this.itempricelimits) {
            this.itempricelimits = TempleteManager.Instance.getItempricelimit();
        }
        return this.itempricelimits;
    }

    public getLimitBuyTemplateId(tempId: number) {
        this.getItemPriceLimit();
        for (let limt of this.itempricelimits) {
            if (limt.ItemId == tempId) {
                return limt
            }
        }
        return null;
    }

    //发布数量
    public get marketPuchareMax() {
        return ConfigInfoManager.Instance.getMarketPuchareMax();
    }
    //税率
    public get marketTaxRare() {
        return ConfigInfoManager.Instance.getMarketTaxRare();
    }

    public get curPuchareCount() {
        if (this.marketOrders) {
            return this.marketOrders.length;
        }
        return 0;
    }

    public getOrderByTemplateId(tempId: number, type = 1) {
        this.marketOrders = this.sortByTime(this.marketOrders)
        let a: IMarketOrderMsg = null;
        if (this.marketOrders) {
            for (let o of this.marketOrders) {
                //出售/求购中 /正在发布
                if (o.templateId == tempId && o.type == type && (o.status == 2 || o.status == 1)) {
                    a = o
                    break;
                }
            }
        }
        return a;
    }
    //出售物品的最小出售价格
    public getSellOrderMinByTemplateId(tempId: number) {
        let a: IMarketOrderMsg = null;
        if (this.marketOrders) {
            for (let o of this.marketOrders) {
                //出售中 正在发布
                if (o.templateId == tempId && o.type == 1 && (o.status == 2 || o.status == 1)) {
                    if (!a || o.point < a.point) {
                        a = o
                    }
                }
            }
        }
        return a;
    }

    //求购物品的最大求购价格
    public getSellOrderMaxByTemplateId(tempId: number) {
        let a: IMarketOrderMsg = null;
        if (this.marketOrders) {
            for (let o of this.marketOrders) {
                //求购中 正在发布
                if (o.templateId == tempId && o.type == 2 && (o.status == 2 || o.status == 1)) {
                    if (!a || o.point > a.point) {
                        a = o
                    }
                }
            }
        }
        return a;
    }

    public getMarketByTemplateId(tempId: number) {
        let sellItems = this.marketItemInfoList;
        for (let item of sellItems) {
            if (item.templateId == tempId) {
                return item;
            }
        }
        return null;
    }

    private sortByTime(orders: IMarketOrderMsg[]) {
        orders = orders.sort((a, b) => {
            return this.compareString(b.createTime, a.createTime);
        })
        return orders
    }

    private sortByATime(orders: IMarketOrderMsg[]) {
        orders = orders.sort((a, b) => {
            return this.compareString(b.actionTime, a.actionTime);
        })
        return orders
    }

    public sortOrder() {
        this.marketOrders = this.sortByTime(this.marketOrders);
        let unGeted: IMarketOrderMsg[] = [];
        let others: IMarketOrderMsg[] = [];
        for (let o of this.marketOrders) {
            //未提取
            if ((o.status == 6 || o.status == 4) && !o.extract) {
                unGeted.push(o)
            } else {
                others.push(o)
            }
        }
        this.marketOrders = [];
        this.marketOrders.push(...unGeted);
        this.marketOrders.push(...others);
        return this.marketOrders;
    }

    public refreshMarketInfo() {
        let offLineTime = PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond - this.marketInfoUpdateTime;
        //状态有修改，或者超过时间。
        if (this.marketInfoChange || offLineTime > this.marketInfoUpdateCD) {
            this.reqMarketOpertion(1);
            return true;
        }

        return false;
    }

    //有无未提取
    public get haveCash() {
        //40 级开放
        if (ArmyManager.Instance.thane.grades < OpenGrades.MARKET) {
            return false;
        }
        //没有数据，需要请求数据
        if (!this.marketOrders) {
            this.reqData();
            return false;
        }

        for (let o of this.marketOrders) {
            //成功/取消  未提取
            if ((o.status == 6 || o.status == 4) && !o.extract) {
                return true;
            }
        }
        return false;
    }

    private compareString(a: string, b: string) {

        let length = Math.min(a.length, b.length);
        for (let i = 0; i < length; i++) {
            if (a[i] != b[i]) {
                return a[i].charCodeAt(0) - b[i].charCodeAt(0);
            }
        }
        if (a[length]) {
            return a[length].charCodeAt(0);
        }

        if (b[length]) {
            return b[length].charCodeAt(0);
        }

        return 0;
    }

    public reset() {
        this.marketOrders = null;
        this.marketSuccessOrders = null;
        this.marketInfoChange = true;
    }

    //能否访问市场
    public checkCanMarket() {
        return PlayerManager.Instance.currentPlayerModel.playerInfo.point >= 0;
    }

}
