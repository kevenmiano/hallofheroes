// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-04-26 10:03:15
 * @LastEditTime: 2023-08-01 11:49:00
 * @LastEditors: jeremy.xu
 * @Description:
 */

import { SocketManager } from "../../../../core/net/SocketManager";
import { FreedomTeamEvent } from "../../../constant/event/NotificationEvent";
import { C2SProtocol } from "../../../constant/protocol/C2SProtocol";
import { RoomEvent } from "../../../constant/RoomDefine";
import { NotificationManager } from "../../../manager/NotificationManager";
import { RoomManager } from "../../../manager/RoomManager";
import { RoomSocketOutManager } from "../../../manager/RoomSocketOutManager";
import FrameCtrlBase from "../../../mvc/FrameCtrlBase"
import { RoomInfo } from "../../../mvc/model/room/RoomInfo";

import ArmyFightPosEditMsg = com.road.yishi.proto.army.ArmyFightPosEditMsg;
import ArmyFightPosEditListMsg = com.road.yishi.proto.army.ArmyFightPosEditListMsg;

export default class TeamFormationCtrl extends FrameCtrlBase {

    protected addEventListener() {
        super.addEventListener();
        if (this.roomInfo) {
            this.roomInfo.addEventListener(RoomEvent.UPDATE_TEAM_FIGHT_POS, this.__updateView, this);
        }
        NotificationManager.Instance.addEventListener(FreedomTeamEvent.TEAM_INFO_UPDATE, this.__teamInfoUpdateHandler, this);
        NotificationManager.Instance.addEventListener(FreedomTeamEvent.TEAM_INFO_SYNC, this.__teamInfoUpdateHandler, this);
    }

    protected delEventListener(){
        if (this.roomInfo) {
            this.roomInfo.removeEventListener(RoomEvent.UPDATE_TEAM_FIGHT_POS, this.__updateView, this);
        }
        NotificationManager.Instance.removeEventListener(FreedomTeamEvent.TEAM_INFO_UPDATE, this.__teamInfoUpdateHandler, this);
        NotificationManager.Instance.removeEventListener(FreedomTeamEvent.TEAM_INFO_SYNC, this.__teamInfoUpdateHandler, this);
    }

    private __updateView(armyFightPosList: ArmyFightPosEditMsg[]) {
        this.view.__updateView(armyFightPosList)
    }

    private __teamInfoUpdateHandler() {
        this.view.__teamInfoUpdateHandler();
    }

    /**
     * 多人副本部队站位编制 
     * @param list 这是房间里面玩家列表
     * userid为玩家id
     * heroPos为站位pos
     */
    public sendEditTeamPos(list: any[], serverName: string = "") {
        var msgList: any[] = new Array();
        list.forEach(item => {
            var msg1: ArmyFightPosEditMsg = new ArmyFightPosEditMsg();
            msg1.userId = item.userId;
            msg1.heroPos = item.heroPos;
            msg1.serverName = item.serverName;
            msgList.push(msg1);
        });

        var msg: ArmyFightPosEditListMsg = new ArmyFightPosEditListMsg();
        msg.armyFightPos = msgList;
        msg.serverName = serverName;
        if (this.roomInfo && this.roomInfo.isCross) {
            SocketManager.Instance.send(C2SProtocol.CR_FIGHTPOS_EDIT, msg);
        }
        else {
            SocketManager.Instance.send(C2SProtocol.C_CAMPIAGN_ARMYPOS_EDIT, msg);
        }
    }

    public sendRequestTeamPos() {
        RoomSocketOutManager.sendRequestTeamPos()
    }

    public sendRequestTeamPosInSpace(isGet: boolean = true, list: Array<any> = []) {
        RoomSocketOutManager.sendRequestTeamPosInSpace(isGet, list);
    }

    public crossSendRequestTeamPos(serverName:string){
        RoomSocketOutManager.crossSendRequestTeamPos(serverName);
    }

    private get roomInfo(): RoomInfo {
        return RoomManager.Instance.roomInfo
    }
}