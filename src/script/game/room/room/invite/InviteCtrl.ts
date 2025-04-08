/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-04-19 19:39:07
 * @LastEditTime: 2021-05-20 11:12:34
 * @LastEditors: jeremy.xu
 * @Description:
 */

import Logger from "../../../../core/logger/Logger"
import { PackageIn } from "../../../../core/net/PackageIn"
import { ServerDataManager } from "../../../../core/net/ServerDataManager"
import { NotificationEvent } from "../../../constant/event/NotificationEvent"
import { S2CProtocol } from "../../../constant/protocol/S2CProtocol"
import { ThaneInfo } from "../../../datas/playerinfo/ThaneInfo"
import { NotificationManager } from "../../../manager/NotificationManager"
import { RoomSocketOuterManager } from "../../../manager/RoomSocketOuterManager"
import { SocketSendManager } from "../../../manager/SocketSendManager"
import FrameCtrlBase from "../../../mvc/FrameCtrlBase"
import InviteWnd from "./InviteWnd"


import RoomPlayerListMsg = com.road.yishi.proto.room.RoomPlayerListMsg;
import RoomPlayerMsg = com.road.yishi.proto.room.RoomPlayerMsg;

export default class InviteCtrl extends FrameCtrlBase {

    show() {
        super.show()
    }

    hide() {
        super.hide()
    }

    protected addEventListener() {
        super.addEventListener()
        ServerDataManager.listen(S2CProtocol.U_C_INVITE_PLAYER_LIST, this, this.__getHallListHandler);
        NotificationManager.Instance.addEventListener(NotificationEvent.INVITE_SUCCESS, this.__inviteSuccessHandler, this);
    }

    protected delEventListener() {
        super.delEventListener()
        ServerDataManager.cancel(S2CProtocol.U_C_INVITE_PLAYER_LIST, this, this.__getHallListHandler);
        NotificationManager.Instance.removeEventListener(NotificationEvent.INVITE_SUCCESS, this.__inviteSuccessHandler, this);
    }

    public sendRoomInvite(userId: number) {
        Logger.xjy("[InviteCtrl]sendRoomInvite", userId)
        RoomSocketOuterManager.sendRoomInvite(userId);
    }

    public sendRefreshInviteHall() {
        SocketSendManager.Instance.sendRefreshInviteHall();
    }

    private __getHallListHandler(pkg: PackageIn) {
        let arr: any[] = [];
        let msg = pkg.readBody(RoomPlayerListMsg) as RoomPlayerListMsg;
        for (let i: number = 0; i < msg.roomPlayer.length; i++) {
            let player: ThaneInfo = new ThaneInfo();
            let roomMsg: RoomPlayerMsg = msg.roomPlayer[i] as RoomPlayerMsg;
            if (roomMsg.playerId)
                player.userId = roomMsg.playerId;
            if (roomMsg.templateId)
                player.templateId = roomMsg.templateId;
            if (roomMsg.grades)
                player.grades = roomMsg.grades;
            if (roomMsg.nickName)
                player.nickName = roomMsg.nickName;
            if (roomMsg.sex)
                player.sexs = roomMsg.sex;
            if (roomMsg.consortiaId)
                player.consortiaID = roomMsg.consortiaId;
            if (roomMsg.consortiaName)
                player.consortiaName = roomMsg.consortiaName;
            if (roomMsg.fightingCapacity)
                player.fightingCapacity = roomMsg.fightingCapacity;
            if (roomMsg.playerState)
                player.state = roomMsg.playerState;
            if (roomMsg.changeShapeId)
                player.changeShapeId = roomMsg.changeShapeId;
            if (roomMsg.isVip)
                player.IsVipAndNoExpirt = roomMsg.isVip;
            if (roomMsg.vipType)
                player.vipType = roomMsg.vipType;
            if (roomMsg.headId)
                player.snsInfo.headId = roomMsg.headId;
            if (roomMsg.frameId)
                player.frameId = roomMsg.frameId;

            arr.push(player);
        }
        if (this.view && !(this.view as InviteWnd).destroyed)
            this.view.refreshList(arr);
    }

    private __inviteSuccessHandler() {
        if (this.view && !(this.view as InviteWnd).destroyed)
            this.view.refreshListView(this.data.cacheList, false);
    }
}