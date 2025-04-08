/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-02-19 19:42:42
 * @LastEditTime: 2021-03-09 10:47:38
 * @LastEditors: jeremy.xu
 * @Description: 铁匠铺的各种操作与服务器的请求 
 */

import { SocketManager } from "../../../core/net/SocketManager";
import { C2SProtocol } from "../../constant/protocol/C2SProtocol";
import StoreReqMsg = com.road.yishi.proto.store.StoreReqMsg;
import SmithFreshReqMsg = com.road.yishi.proto.store.SmithFreshReqMsg;
import RefreshPropertyReqMsg = com.road.yishi.proto.store.RefreshPropertyReqMsg;

export class ForgeSocketOutManager {
    /**
     * 镶嵌操作
     * @joinPos   装备孔位置
     * @gInfoPos  物品所在背包中的位置
     * @gInfoType 背包类型
     */
    public static sendItemMount(joinPos: number, gInfoPos: number, gInfoType: number) {
        let msg: StoreReqMsg = new StoreReqMsg();
        msg.mountPos = joinPos;
        msg.bagType = gInfoType;
        msg.bagPos = gInfoPos;
        SocketManager.Instance.send(C2SProtocol.U_C_ITEM_INLAY, msg);
    }

    /**
     *
     * 铁匠铺强化
     */
    public static sendItemIntensify() {
        SocketManager.Instance.send(C2SProtocol.U_C_ITEM_STRENGTHEN);
    }
    /**
     *
     * 铁匠铺神铸
     */
    public static sendItemMould() {
        SocketManager.Instance.send(C2SProtocol.C_MOULD_ITEM);
    }

    /**
     * 铁匠铺合成
     * @composeId 合成类型
     * @num   合成数量
     * @autoBuy 是否选中自动购买
     */
    public static sendCompose(composeId: number, num: number, autoBuy: boolean = false, useBind: boolean = true) {
        let msg: StoreReqMsg = new StoreReqMsg();
        msg.composeId = composeId;
        msg.composeNum = num;
        msg.autoBuy = autoBuy;
        msg.payType = 0;
        if (!useBind) {
            msg.payType = 1;
        }
        SocketManager.Instance.send(C2SProtocol.U_C_ITEM_COMPOSE, msg);
    }

    /**
     * 时装合成=>时装吞噬
     * @useLucky  是否使用幸运符
     */
    public static sendFashionCompose(useLucky: boolean = false, count = 0) {
        let msg: StoreReqMsg = new StoreReqMsg();
        msg.count = count;
        SocketManager.Instance.send(C2SProtocol.C_FASHION_COMPOSE, msg);
    }

    /**
     * 时装转换
     */
    public static sendFashionSwitch() {
        let msg: StoreReqMsg = new StoreReqMsg();
        SocketManager.Instance.send(C2SProtocol.C_FASHION_SWITCH, msg);
    }


    /**
     * 进阶
     * @param composeId 合成类型
     * @param num
     * @param useBind
     */
    public static sendUpdateEquip(composeId: number, num: number, useBind: boolean = true, extendsMould: boolean = false) {
        let msg: StoreReqMsg = new StoreReqMsg();
        msg.composeId = composeId;
        msg.composeNum = num;
        msg.payType = 1;
        //神铸过的物品进阶的时候, 这个字段传true, 继承神铸的等级
        msg.operate = extendsMould;
        if (!useBind) {
            msg.payType = 1;
        }
        SocketManager.Instance.send(C2SProtocol.U_C_ITEM_COMPOSE, msg);
    }

    /**
     * 洗练随机属性
     * @param  ary      选中的洗练列表
     * @param  bindType  绑定类型
     */
    public static sendRefreshforRandom(ary: any[], bindType: number, useBind: boolean = true) {
        let msg: SmithFreshReqMsg = new SmithFreshReqMsg();
        msg.lock = ary;
        msg.bindType = bindType;
        msg.payType = 0;
        if (!useBind) {
            msg.payType = 1;
        }
        SocketManager.Instance.send(C2SProtocol.C_ITEM_REFRESHFORRANDOM, msg);
    }

    /**
     *
     * 洗练物品属性请求
     * @id   物品ID
     */
    public static sendRefreshProperty(id: number) {
        let msg: RefreshPropertyReqMsg = new RefreshPropertyReqMsg();
        msg.itemId = id
        SocketManager.Instance.send(C2SProtocol.C_ITEM_REFRESHPROPERTY, msg);
    }

    /**
     * 替换
     */
    public static sendRefreshforReplace() {
        SocketManager.Instance.send(C2SProtocol.C_ITEM_REFRESHFORREPLACE);
    }

    /**
     * 分解
     */
    public static sendResolve() {
        SocketManager.Instance.send(C2SProtocol.C_ITEM_RESOLVE);
    }

    /**
     * 转换
     * @param srcItemid   当前类型
     * @param desItemid   转换模板类型
     * @count  转换数量
     */
    public static sendSwitch(srcItemid: number, desItemid: number, count: number) {
        let msg: StoreReqMsg = new StoreReqMsg();
        msg.desItemid = desItemid;
        msg.srcItemid = srcItemid;
        msg.count = count;
        SocketManager.Instance.send(C2SProtocol.C_ITEM_TRANSFORM, msg);
    }
}