/*
 * @Author: jeremy.xu
 * @Date: 2022-05-27 11:37:41
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2022-06-06 19:54:43
 * @Description: 记忆翻牌 
 */

import GameEventDispatcher from "../../../../core/event/GameEventDispatcher";
import { PackageIn } from "../../../../core/net/PackageIn";
import { ServerDataManager } from "../../../../core/net/ServerDataManager";
import { SocketManager } from "../../../../core/net/SocketManager";
import { NotificationEvent } from "../../../constant/event/NotificationEvent";
import { C2SProtocol } from "../../../constant/protocol/C2SProtocol";
import { S2CProtocol } from "../../../constant/protocol/S2CProtocol";
import { NotificationManager } from "../../../manager/NotificationManager";
import { MemoryCardData } from "../model/MemoryCardData";
import Logger from '../../../../core/logger/Logger';

import NewMemoryCardMsg = com.road.yishi.proto.NewMemoryCardMsg;
import NewMemoryCardMsgReq = com.road.yishi.proto.NewMemoryCardMsgReq;
import NewMemoryCardState = com.road.yishi.proto.NewMemoryCardState;
import { DateFormatter } from "../../../../core/utils/DateFormatter";
import { PlayerManager } from "../../../manager/PlayerManager";

export class MemoryCardManager extends GameEventDispatcher {
    public memoryCardData: MemoryCardData = new MemoryCardData();
    public get model(): MemoryCardData { return this.memoryCardData };

    private static _instance: MemoryCardManager;
    public static get Instance(): MemoryCardManager {
        if (!MemoryCardManager._instance) MemoryCardManager._instance = new MemoryCardManager();
        return MemoryCardManager._instance;
    }

    public setup() {
        this.initEvent();
    }

    private initEvent() {
        ServerDataManager.listen(S2CProtocol.U_C_NEW_MEMORY_CARD_STATE, this, this.__memoryCardOpenState);
        ServerDataManager.listen(S2CProtocol.U_C_NEW_MEMORY_CARD_DATA, this, this.__memoryCardData);
    }

    private removeEvent() {
        ServerDataManager.cancel(S2CProtocol.U_C_NEW_MEMORY_CARD_STATE, this, this.__memoryCardOpenState);
        ServerDataManager.cancel(S2CProtocol.U_C_NEW_MEMORY_CARD_DATA, this, this.__memoryCardData);
    }

    private __memoryCardOpenState(pkg: PackageIn) {
        let msg: NewMemoryCardState = new NewMemoryCardState();
        msg = pkg.readBody(NewMemoryCardState) as NewMemoryCardState;
        let model = this.memoryCardData
        model.isOpen = msg.isOpen;
        model.openTime = msg.beginDate;
        model.stopTime = msg.endDate;
        Logger.xjy("[MemoryCardManager]__memoryCardOpenState", msg)
        NotificationManager.Instance.sendNotification(NotificationEvent.MEMORYCARD_STATE_UPDATE);
    }

    private __memoryCardData(pkg: PackageIn) {
        let model = this.memoryCardData
        if (!model.isOpen) {
            Logger.xjy("[MemoryCardManager]__memoryCardData活动已关闭",)
            return
        }
        let msg = pkg.readBody(NewMemoryCardMsg) as NewMemoryCardMsg;
        model.canOperate = true;
        model.opType = msg.opType;
        model.freeStep = msg.freeStep;
        model.buyStep = msg.buyStep;
        model.buyCount = msg.buyCount;
        model.dropInfo = msg.dropInfo;
        model.posInfo = msg.posInfo;
        model.specialInfo = msg.specialInfo;
        model.canRefresh = msg.canRefresh;
        model.isMatch = msg.isMatch;
        model.result = msg.result;
        Logger.xjy("[MemoryCardManager]__memoryCardData", msg)
        NotificationManager.Instance.sendNotification(NotificationEvent.MEMORYCARD_DATA_UPDATE);
    }

    public memoryCardSendChoose() {
        let model = this.memoryCardData
        let msg: NewMemoryCardMsgReq = new NewMemoryCardMsgReq();
        msg.opType = MemoryCardData.OP_CHOOSE;
        msg.value1 = model.clickIndexArr[0];
        msg.value2 = model.clickIndexArr[1];
        SocketManager.Instance.send(C2SProtocol.C_NEW_MEMORY_CARD_OP, msg);
    }

    public memoryCardSendOp(op: number) {
        var msg: NewMemoryCardMsgReq = new NewMemoryCardMsgReq();
        msg.opType = op;
        SocketManager.Instance.send(C2SProtocol.C_NEW_MEMORY_CARD_OP, msg);
    }

    public clearMemoryCardData() {
        this.memoryCardData.clear();
    }
}