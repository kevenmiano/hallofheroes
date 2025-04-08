// @ts-nocheck
import Logger from "../../../../core/logger/Logger";
import { PackageIn } from "../../../../core/net/PackageIn";
import { ServerDataManager } from "../../../../core/net/ServerDataManager";
import { SocketManager } from "../../../../core/net/SocketManager";
import { ShopEvent } from "../../../constant/event/NotificationEvent";
import { C2SProtocol } from "../../../constant/protocol/C2SProtocol";
import { S2CProtocol } from "../../../constant/protocol/S2CProtocol";
import { NotificationManager } from "../../../manager/NotificationManager";
import { DiscountShopGoodInfo, DiscountShopModel, DiscountShopScoreInfo } from "../model/DiscountShopModel";

import DiscountMallItemInfo = com.road.yishi.proto.active.DiscountMallItemInfo;
import DiscountMallMsg = com.road.yishi.proto.active.DiscountMallMsg;
import DiscountMallRequestMsg = com.road.yishi.proto.active.DiscountMallRequestMsg;
import DiscountMallScoreInfo = com.road.yishi.proto.active.DiscountMallScoreInfo;

export class DiscountShopManager {
    private static _instance: DiscountShopManager;
    public static get Instance(): DiscountShopManager {
        if (!DiscountShopManager._instance) {
            DiscountShopManager._instance = new DiscountShopManager();
        }
        return DiscountShopManager._instance;
    }

    private _model: DiscountShopModel = new DiscountShopModel();
    public get model(): DiscountShopModel {
        return this._model;
    }

    public setup() {
        this.initEvent();
        DiscountShopManager.Instance.operationDiscountShop(1);
    }

    private initEvent() {
        ServerDataManager.listen(S2CProtocol.U_C_DISCOUNT_MALL, this, this.onDiscountMall);
    }

    private onDiscountMall(pkg: PackageIn) {
        let msg: DiscountMallMsg = new DiscountMallMsg();
        msg = pkg.readBody(DiscountMallMsg) as DiscountMallMsg;

        Logger.info("打折商城", msg)

        let discountShopItemMsg: DiscountMallItemInfo;
        this._model.discountShopGoodInfoList = [];
        this._model.discountShopScoreInfoList = [];
        for (let i: number = 0; i < msg.items.length; i++) {
            let discountShopItem: DiscountShopGoodInfo = new DiscountShopGoodInfo();
            discountShopItemMsg = msg.items[i] as DiscountMallItemInfo;
            discountShopItem.buycount = discountShopItemMsg.buycount;
            discountShopItem.index = discountShopItemMsg.index;
            discountShopItem.itemId = discountShopItemMsg.itemId;
            discountShopItem.limit = discountShopItemMsg.limit;
            discountShopItem.price = discountShopItemMsg.price;
            discountShopItem.count = discountShopItemMsg.count;
            this._model.discountShopGoodInfoList.push(discountShopItem);
        }
        let discountScoreMsg: DiscountMallScoreInfo;
        for (let i = 0; i < msg.scores.length; i++) {
            let scoreInfo: DiscountShopScoreInfo = new DiscountShopScoreInfo();
            discountScoreMsg = msg.scores[i] as DiscountMallScoreInfo;
            scoreInfo.isTake = discountScoreMsg.isTake;
            scoreInfo.itemId = discountScoreMsg.itemId;
            scoreInfo.score = discountScoreMsg.score;
            scoreInfo.count = discountScoreMsg.count;
            this._model.discountShopScoreInfoList.push(scoreInfo);
        }
        this._model.discountShopScoreInfoList.sort(this.sortFun);
        this._model.beginTime = msg.begin;
        this._model.endTime = msg.end;
        this._model.id = msg.id;
        this._model.logo = msg.logo;
        this._model.myDiscount = msg.myDisc;
        this._model.myScore = msg.myscore;
        if (!msg.begin) {
            this._model.open = false;
            NotificationManager.Instance.sendNotification(ShopEvent.DISCOUNTSHOP_OPENSTATE);
            return;
        }
        if (!this._model.open) {
            this._model.open = true;
        }
        NotificationManager.Instance.sendNotification(ShopEvent.DISCOUNTSHOP_OPENSTATE);

        NotificationManager.Instance.dispatchEvent(ShopEvent.DISCOUNTSHOP_UPDATE);
    }
    
    protected sortFun(a: DiscountShopScoreInfo, b: DiscountShopScoreInfo): number {
        let index_a: number = a.score;
        let index_b: number = b.score;
        if (index_a < index_b) {
            return -1;
        }
        else if (index_a > index_b) {
            return 1;
        }
        return 0;
    }

    /**
     * @param op （1: 请求信息, 2: 抽取折扣, 3: 购买道具, 4: 领取积分奖励）
     * @param param1 （op=3时 , 标识购买位子index , op=4时, 标识积分阶段score）
     * @param param2 （op=3时, 表示购买数量）
     */
    public operationDiscountShop(op: number = 0, param1: number = 0, param2: number = 0) {
        let msg: DiscountMallRequestMsg = new DiscountMallRequestMsg();
        msg.op = op;
        msg.param1 = param1;
        msg.param2 = param2;
        SocketManager.Instance.send(C2SProtocol.C_DISCOUNT_MALL_OP, msg);
    }
}
