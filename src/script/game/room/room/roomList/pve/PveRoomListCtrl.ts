/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-04-19 19:39:07
 * @LastEditTime: 2024-01-03 10:37:48
 * @LastEditors: jeremy.xu
 * @Description: 
 */

import Logger from "../../../../../core/logger/Logger";
import { PackageIn } from "../../../../../core/net/PackageIn";
import { ServerDataManager } from "../../../../../core/net/ServerDataManager";
import { S2CProtocol } from "../../../../constant/protocol/S2CProtocol";
import { RoomSceneType, RoomType } from "../../../../constant/RoomDefine";
import { RoomState } from "../../../../constant/RoomState";
import { StateType } from "../../../../constant/StateType";
import { EmWindow } from "../../../../constant/UIDefine";
import { ThaneInfo } from "../../../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../../../manager/ArmyManager";
import { RoomListSocketOutManager } from "../../../../manager/RoomListSocketOutManager";
import { RoomManager } from "../../../../manager/RoomManager";
import { RoomSocketOuterManager } from "../../../../manager/RoomSocketOuterManager";
import { CampaignArmy } from "../../../../map/campaign/data/CampaignArmy";
import { BaseArmy } from "../../../../map/space/data/BaseArmy";
import FrameCtrlBase from "../../../../mvc/FrameCtrlBase";
import { FrameCtrlManager } from "../../../../mvc/FrameCtrlManager";
import { RoomInfo } from "../../../../mvc/model/room/RoomInfo";
import RoomMsg = com.road.yishi.proto.room.RoomMsg
import RoomListRspMsg = com.road.yishi.proto.room.RoomListRspMsg
import RoomPlayerMsg = com.road.yishi.proto.room.RoomPlayerMsg

export default class PveRoomListCtrl extends FrameCtrlBase {
    show() {
        super.show();
    }

    hide() {
        super.hide();
    }

    protected addDataListener() {
        ServerDataManager.listen(S2CProtocol.U_C_CAMPAIGN_ROOM_LIST, this, this.__onRefreshRoomList);
    }

    protected delDataListener() {
        ServerDataManager.cancel(S2CProtocol.U_C_CAMPAIGN_ROOM_LIST, this, this.__onRefreshRoomList)
    }

    protected addEventListener() {
        super.addEventListener()
        ServerDataManager.listen(S2CProtocol.U_C_ROOM_SEND, this, this.__onRefreshRoomState);
        ServerDataManager.listen(S2CProtocol.U_C_ROOM_FIND_RESULT, this, this.__onSearchRoom);
    }

    protected delEventListener() {
        super.delEventListener()
        ServerDataManager.cancel(S2CProtocol.U_C_ROOM_SEND, this, this.__onRefreshRoomState);
        ServerDataManager.cancel(S2CProtocol.U_C_ROOM_FIND_RESULT, this, this.__onSearchRoom);
    }

    protected startPreLoadData() {
        this.init()
        this.requestRoomInfo()
    }

    private init() {
        Logger.xjy("[PveRoomListCtrl]init", this._info.frameData)
        let frameData = this._info.frameData
        if (frameData && frameData.selCampaignID) {
            this.data.selCampaignID = frameData.selCampaignID
        }
    }

    private __onSearchRoom(pkg: PackageIn) {
        let msg = pkg.readBody(RoomMsg) as RoomMsg;
        Logger.xjy("[PveRoomListCtrl]__onSearchRoom", msg)
        let info: RoomInfo = this.data.getRoomInfoById(msg.roomId);
        if (info) {
            info.isLock = msg.isSetPassword;
            info.campaignId = msg.campaignId;
            info.commit();
        }
        if (msg.isSetPassword) {
            FrameCtrlManager.Instance.open(EmWindow.RoomPwd, { "roomId": msg.roomId, "roomSceneType": RoomSceneType.PVE })
        } else {
            this.sendEnterRoom(RoomType.NORMAL, msg.roomId, "", false);
        }
    }

    private __onRefreshRoomList(pkg: PackageIn) {
        this.data.roomList = []
        let msg = pkg.readBody(RoomListRspMsg) as RoomListRspMsg;
        Logger.xjy("[PveRoomListCtrl]__onRefreshRoomList", msg)
        for (let i: number = 0; i < msg.room.length; i++) {
            let roomMsg: RoomMsg = msg.room[i] as RoomMsg;
            let roomInfo: RoomInfo = new RoomInfo();
            roomInfo.id = roomMsg.roomId;
            roomInfo.campaignId = roomMsg.campaignId;
            roomInfo.mapName = roomMsg.name;
            roomInfo.curCount = roomMsg.count;
            roomInfo.capacity = roomMsg.capacity;
            roomInfo.roomState = roomMsg.roomState;
            roomInfo.roomType = roomMsg.roomType;
            roomInfo.isLock = roomMsg.isSetPassword;
            roomInfo.houseOwnerId = roomMsg.masterId;
            for (let index = 0; index < roomMsg.roomPlayer.length; index++) {
                const player = roomMsg.roomPlayer[index] as RoomPlayerMsg;
                this.readMember(player, roomInfo);
            }
            this.data.addRoom(roomInfo, i, msg.room.length);
        }

        if (this._loadDataFlag) {
            super.preLoadDataComplete();
        } else {
            this.view && this.view.refresh();
        }
    }

    private __onRefreshRoomState(pkg: PackageIn) {
        let msg = pkg.readBody(RoomMsg) as RoomMsg;
        Logger.xjy("[PveRoomListCtrl]__onRefreshRoomState", msg)
        let roomInfo: RoomInfo = this.data.getRoomInfoById(msg.roomId);
        if (roomInfo) {
            roomInfo.campaignId = msg.campaignId;
            roomInfo.mapName = msg.name;
            roomInfo.curCount = msg.count;
            roomInfo.capacity = msg.capacity;
            roomInfo.roomState = msg.roomState;
            roomInfo.roomType = msg.roomType;
            roomInfo.isLock = msg.isSetPassword;
            if(msg.masterId){
                roomInfo.houseOwnerId = msg.masterId;
            }
            for (let index = 0; index < msg.roomPlayer.length; index++) {
                const player = msg.roomPlayer[index] as RoomPlayerMsg;
                this.readMember(player, roomInfo);
            }
            roomInfo.commit();
            if (roomInfo.capacity == 0 || roomInfo.roomState == RoomState.STATE_PLAYING || roomInfo.roomState == RoomState.STATE_COMPETEING)
                this.requestRoomInfo();
        }
    }

    private readMember(player: RoomPlayerMsg, roomInfo: RoomInfo) {
        Logger.xjy("[PveRoomListCtrl]添加玩家", player)

        var aInfo: CampaignArmy = roomInfo.getPlayerByUserId(player.playerId, player.serverName);
        if (!aInfo) {
            aInfo = new CampaignArmy();
        }
        var hInfo: ThaneInfo = aInfo.baseHero;
        var userId: number = player.playerId;
        hInfo.userId = userId;
        hInfo.grades = player.grades;
        hInfo.nickName = player.nickName;
        hInfo.vipGrade = player.vipGrade;
        hInfo.job = player.job;
        hInfo.mulSportScore = player.mulSportScore;
        hInfo.segmentId = player.segmentId;

        hInfo.id = player.heroId;
        hInfo.headId = player.headId;
        hInfo.frameId = player.frameId;
        hInfo.state = player.onlineState ? StateType.ONLINE : StateType.OFFLINE;

        aInfo.userId = userId;
        aInfo.online = player.onlineState;
        roomInfo.addArmy(aInfo);
    }

    /**************************socketSend*****************************/
    //return: S2CProtocol.U_C_CAMPAIGN_ROOM_LIST
    public requestRoomInfo() {
        RoomListSocketOutManager.requestRoomList(RoomType.NORMAL, this.data.selCampaignID);
    }
    //return: S2CProtocol.U_C_CAMPAIGN_ROOM_CREATE
    public sendCreateRoom() {
        RoomListSocketOutManager.sendCreateRoom(1, RoomType.NORMAL, "");
    }
    //return: S2CProtocol.U_C_CAMPAIGN_ROOM_CREATE
    public sendEnterRoom(roomType: RoomType, roomId: number, pwd: string, isInvite: boolean) {
        RoomListSocketOutManager.addRoomById(roomType, roomId, pwd, isInvite);
    }
    //return: S2CProtocol.U_C_ROOM_SEND
    public passwordInputBack(id: number, password: string) {
        RoomSocketOuterManager.sendLockCampaignRoom(id, password);
    }
    //return: S2CProtocol.U_C_ROOM_FIND_RESULT
    public sendSearchRoomInfo(roomType: RoomType, roomId: number) {
        RoomListSocketOutManager.sendSearchRoomInfo(roomType, roomId);
    }


    private get selfArmy(): BaseArmy {
        return ArmyManager.Instance.army;
    }

    private get isOwner() {
        if (!RoomManager.Instance.roomInfo || !this.selfArmy) return
        return RoomManager.Instance.roomInfo.houseOwnerId == this.selfArmy.userId
    }
}