/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-04-26 11:32:04
 * @LastEditTime: 2021-04-26 11:37:36
 * @LastEditors: jeremy.xu
 * @Description: 房间信息与服务器相关socket请求 
 */

import LangManager from "../../core/lang/LangManager";
import Logger from "../../core/logger/Logger";
import { SocketManager } from "../../core/net/SocketManager";
import SimpleAlertHelper from "../component/SimpleAlertHelper";
import { C2SProtocol } from "../constant/protocol/C2SProtocol";
import { RoomInfo } from "../mvc/model/room/RoomInfo";
import { RoomManager } from "./RoomManager";

import CampaignReqMsg = com.road.yishi.proto.campaign.CampaignReqMsg
import RoomReqMsg = com.road.yishi.proto.room.RoomReqMsg
import MemberFightPos = com.road.yishi.proto.team.MemberFightPos;
import MemberFightPosListMsg = com.road.yishi.proto.team.MemberFightPosListMsg;
export class RoomSocketOutManager {
    /**
     * 提升队长 
     * @param targetId 选中的玩家ID
     */
    public static sendChangeRoomOwner(targetId: number,serverName:string="") {
        var msg: CampaignReqMsg = new CampaignReqMsg();
        msg.paraInt1 = targetId;
        msg.paraString1 = serverName;
        SocketManager.Instance.send(C2SProtocol.U_C_CAMPAIGN_ROOM_MASTER_CHANGE, msg);
    }

    /**
     *跨服房间 踢人（弹窗提示是否要踢） 
     * @param targetUserId
     */
    public static crossSendKickPlayerAlert(targetUserId: number,nameKey:string="") {
        var content: string = LangManager.Instance.GetTranslation("room.manager.RoomSocketOutManager.content");
        SimpleAlertHelper.Instance.Show(null, [targetUserId,nameKey], null, content, null, null, RoomSocketOutManager.crossKickPlayerAlertCallBack);
    }

    private static crossKickPlayerAlertCallBack(b: boolean, flag: boolean, data: any) {
        if (b) {
            RoomSocketOutManager.crossSendKickingInfo(data[0],data[1]);
        }
    }

    /**
     * 跨服房间 踢人 
     * @param targetUserId 当前选中的玩家ID
     */
     public static crossSendKickingInfo(targetUserId: number,nameKey:string) {
        var msg: RoomReqMsg = new RoomReqMsg();
        msg.userId = targetUserId;
        msg.nameKey = nameKey;
        Logger.xjy("RoomSocketOutManager crossSendKickingInfo " + msg);
        SocketManager.Instance.send(C2SProtocol.U_C_CAMPAIGN_ROOM_KILLPLAYER, msg);
    }

    /**
     *房间 踢人（弹窗提示是否要踢） 
     * @param targetUserId
     */
    public static sendKickPlayerAlert(targetUserId: number) {
        var content: string = LangManager.Instance.GetTranslation("room.manager.RoomSocketOutManager.content");
        SimpleAlertHelper.Instance.Show(null, targetUserId, null, content, null, null, RoomSocketOutManager.kickPlayerAlertCallBack);
    }
    private static kickPlayerAlertCallBack(b: boolean, flag: boolean, targetUserId: number) {
        if (b) {
            RoomSocketOutManager.sendKickingInfo(targetUserId);
        }
    }
    /**
     * 房间 踢人 
     * @param targetUserId 当前选中的玩家ID
     */
    public static sendKickingInfo(targetUserId: number) {
        var msg: RoomReqMsg = new RoomReqMsg();
        msg.userId = targetUserId;
        SocketManager.Instance.send(C2SProtocol.U_C_CAMPAIGN_ROOM_KILLPLAYER, msg);
    }

    public static roomInfo(): RoomInfo {
        return RoomManager.Instance.roomInfo;
    }
    
    /**
     *  发送队伍阵型, 多人副本部队站位请求
    */
    public static sendRequestTeamPos() {
        SocketManager.Instance.send(C2SProtocol.C_CAMPIAGN_ARMYPOS_REQ);
    }

    /**
     *  发送队伍阵型, 跨服多人副本部队站位请求
    */
     public static crossSendRequestTeamPos(serverName:string) {
        var msg: RoomReqMsg = new RoomReqMsg();
        msg.serverName = serverName;
        SocketManager.Instance.send(C2SProtocol.CR_FIGHTPOS_REQ,msg);
    }

    public static sendRequestTeamPosInSpace(isGet: boolean = true, list: Array<any> = []) {

        var msgList: Array<any> = new Array();
        if (!isGet) {
            for (let i: number = 0; i < list.length; i++)
            {
                var item: any = list[i];
                var mfpMsg: MemberFightPos = new MemberFightPos();
                mfpMsg.memberId = item.userId;
                mfpMsg.pos = item.heroPos;
                msgList.push(mfpMsg);
            }
        }
        var msg: MemberFightPosListMsg = new MemberFightPosListMsg();
        msg.isGet = isGet;
        msg.memberPos = msgList;
        SocketManager.Instance.send(C2SProtocol.C_EDIT_TEAM_FIGHT_POS,msg);
    }

    /**
     *  请求房间状态
     *  @param  index 当前队伍item的标示
     *  @param  op  开放状态
    */
    public static sendClose(index: number, op: boolean) {
        var msg: RoomReqMsg = new RoomReqMsg();
        msg.index = index;
        msg.open = op;
        SocketManager.Instance.send(C2SProtocol.U_C_CAMPAGIN_ROOM_PLACESTATE, msg);
    }

    /**
		 *跨副本继续撮合 
		 * 0:取消撮合 1: 继续撮合
		 */		
		public static  sendCrossGoOn(state:number,userId:number,serverName:string)
		{
			var msg:RoomReqMsg = new RoomReqMsg();
			msg.state = state;
			msg.userId = userId;
			msg.serverName = serverName;
            SocketManager.Instance.send(C2SProtocol.CR_MULTICAMPAIGN_MATCH, msg);
		}
		
		/**
		 *跨副本邀请玩家 
		 */		
		public static  sendInviteOther(roomId:number,isGet:boolean)
		{
			var msg:RoomReqMsg = new RoomReqMsg();
			msg.roomId = roomId;
			msg.isGet = isGet;
            SocketManager.Instance.send(C2SProtocol.C_CROSS_INVITE_CHOOSE, msg);
		}
		
}
