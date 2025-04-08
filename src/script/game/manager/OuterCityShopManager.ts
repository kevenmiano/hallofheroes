// @ts-nocheck


import { PackageIn } from "../../core/net/PackageIn";
import { ServerDataManager } from "../../core/net/ServerDataManager";
import { SocketManager } from "../../core/net/SocketManager";
import { DateFormatter } from "../../core/utils/DateFormatter";
import { C2SProtocol } from "../constant/protocol/C2SProtocol";
import { S2CProtocol } from "../constant/protocol/S2CProtocol";
import { OuterCityShopItemInfo } from "../module/outercityshop/data/OuterCityShopItemInfo";
import { OuterCityShopModel } from "../module/outercityshop/OuterCityShopModel";
import BottlePassMsg = com.road.yishi.proto.item.BottlePassMsg;
import MapShopInfoMsg = com.road.yishi.proto.mapshop.MapShopInfoMsg;
import MapShopquestMsg = com.road.yishi.proto.mapshop.MapShopquestMsg;
import MapshopIteminfoMsg = com.road.yishi.proto.mapshop.MapshopIteminfoMsg;
import ShopFreshReqMsg = com.road.yishi.proto.mall.ShopFreshReqMsg;
import ShopFreshRspMsg = com.road.yishi.proto.mall.ShopFreshRspMsg;
import { TempleteManager } from "./TempleteManager";

export class OuterCityShopManager {
    private static _instance: OuterCityShopManager;
    private _model: OuterCityShopModel;
    public static get instance(): OuterCityShopManager {
        if (!OuterCityShopManager._instance) OuterCityShopManager._instance = new OuterCityShopManager();
        return OuterCityShopManager._instance;
    }

    public get model(): OuterCityShopModel {
        return this._model;
    }

    public setup() {
        this.addEvent();
        if (!this._model) this._model = new OuterCityShopModel();
    }

    private addEvent() {
        ServerDataManager.listen(S2CProtocol.U_C_MAPSHOPINFO, this, this.__mapShopInfoHandler);
        ServerDataManager.listen(S2CProtocol.U_C_OUTER_CITY_SHOP_PASS, this, this.__updateShopInfoHandler);
        ServerDataManager.listen(S2CProtocol.U_C_SHOPITEM_FRESH, this, this.__refreshGoodsListHandler);
    }
    /**
     * 更新外城商店信息
     * @param e
     * @param passType:魔罐传递类型 **已废弃**(1: 自身获得物品, 2: 幸运传递 3:外城商店幸运传递)
     * 外城商店幸运传递
     * @param infos:信息
     */
    private __updateShopInfoHandler(pkg: PackageIn) {
        let msg: BottlePassMsg = pkg.readBody(BottlePassMsg) as BottlePassMsg;
        this.model.shopLuckShowInfo = msg.infos;
    }

    private __mapShopInfoHandler(pkg: PackageIn) {
        let msg: MapShopInfoMsg = pkg.readBody(MapShopInfoMsg) as MapShopInfoMsg;
        this.model.fresh_time = DateFormatter.parse(msg.freshTime, "YYYY-MM-DD hh:mm:ss");
        this.model.bless = msg.bless;//幸运值, 已取消
        this.model.fresh_count = msg.freshCount;//已经购买的次数
        this.model.consumePoints = msg.score;
        this.model.goodsList = [];
        this.model.weeklyLimitItems = msg.weeklyLimitItems;
        for (let i: number = 0; i < msg.items.length; i++) {
            let temp: MapshopIteminfoMsg = msg.items[i] as MapshopIteminfoMsg;
            if (temp) {
                //数据错误，增加容错处理。
                let _itemTemInfo = TempleteManager.Instance.getouterCityShopRandomByMapShopId(temp.mapshopitemid);
                if (!_itemTemInfo) continue;
                var _goodsItemInfo: OuterCityShopItemInfo = new OuterCityShopItemInfo();
                _goodsItemInfo.index = temp.index;
                _goodsItemInfo.itemId = temp.mapshopitemid;
                _goodsItemInfo.isBuy = temp.isbuy;
                _goodsItemInfo.count = temp.count;
                this.model.goodsList.push(_goodsItemInfo);
            }
        }
        this.model.commit();
    }
    /**
     *向服务器发送协议 
     * @param op 操作类型（1: 查看, 2: 购买, 3: 刷新）
     * @param para 参数
     * @param count 数量
     */
    public sendAction(op: number, para1: number = 0, para2: number = 0, para3: number = -1, count: number = 1) {
        var msg: MapShopquestMsg = new MapShopquestMsg();
        msg.op = op;
        msg.para1 = para1;
        msg.para2 = para2;
        if (para3 != -1)
            msg.payType = para3;
        msg.count = count;
        SocketManager.Instance.send(C2SProtocol.C_MAPSHOPINFO, msg);
    }

    private __refreshGoodsListHandler(pkg: PackageIn) {
        let msg = pkg.readBody(ShopFreshRspMsg) as ShopFreshRspMsg;
        this.model.lastRefreshTime = DateFormatter.parse(msg.freshLastdate, "YYYY-MM-DD hh:mm:ss");
        this.model.buyCount = msg.buyCount;
        this.model.maxBuyCount = msg.maxBuyCount;
    }

    /**
        *发送刷新物品列表 
        * @param isManual  是否手动点按钮刷新
        * 
        */
    public sendRefreshGoodsList(isManual: boolean, useBind: boolean = true) {
        var msg: ShopFreshReqMsg = new ShopFreshReqMsg();
        msg.isButton = isManual;
        msg.payType = 0;
        if (!useBind) {
            msg.payType = 1;
        }
        SocketManager.Instance.send(C2SProtocol.C_MAPSHOPINFO, msg);
    }
}