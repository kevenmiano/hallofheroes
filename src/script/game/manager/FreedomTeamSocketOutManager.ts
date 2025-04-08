import { SocketManager } from '../../core/net/SocketManager';
import { C2SProtocol } from '../constant/protocol/C2SProtocol';
import PropertyMsg = com.road.yishi.proto.simple.PropertyMsg;
import MemberFightPos = com.road.yishi.proto.team.MemberFightPos;
import MemberFightPosListMsg = com.road.yishi.proto.team.MemberFightPosListMsg;


/**
* @author:pzlricky
* @data: 2021-04-29 16:42
* @description *** 
*/
export default class FreedomTeamSocketOutManager {

    /**
     * 答复邀请组队
     * 
     */
    public static sendApplyInvite(targetId: number, apply: boolean) {
        var msg: PropertyMsg = new PropertyMsg();
        msg.param1 = targetId;
        msg.param7 = apply;
        FreedomTeamSocketOutManager.sendProtoBuffer(C2SProtocol.C_APPLY_INVITE_TEAM, msg);
    }

    /**
     * 转移队长
     * 
     */
    public static sendChangeCaptain(targetId: number) {
        var msg: PropertyMsg = new PropertyMsg();
        msg.param1 = targetId;
        FreedomTeamSocketOutManager.sendProtoBuffer(C2SProtocol.C_CHANGE_CAPTAIN, msg);
    }

    /**
     * 邀请组队
     * 
     */
    public static sendInvite(targetId: number) {
        var msg: PropertyMsg = new PropertyMsg();
        msg.param1 = targetId;
        FreedomTeamSocketOutManager.sendProtoBuffer(C2SProtocol.C_INVITE_TEAM, msg);
    }

    /**
     * 踢出队伍
     * 
     */
    public static sendKickMember(targetId: number) {
        var msg: PropertyMsg = new PropertyMsg();
        msg.param1 = targetId;
        FreedomTeamSocketOutManager.sendProtoBuffer(C2SProtocol.C_KICK_TEAM_MEMBER, msg);
    }

    /**
     * 暂离
     * 
     */
    public static sendAFK() {
        FreedomTeamSocketOutManager.sendProtoBuffer(C2SProtocol.C_LEAVE_TEAM_FOR_NOW, null);
    }

    /**
     * 退出队伍
     * 
     */
    public static sendQuik() {
        FreedomTeamSocketOutManager.sendProtoBuffer(C2SProtocol.C_QUIT_TEAM, null);
    }

    /**
     * 修改战斗阵型
     * 
     */
    public static sendEditTeamFightPos(isGet: boolean = true, list: Array<any> = null) {
        var msgList = [];
        if (!isGet) {
            for (const key in list) {
                if (Object.prototype.hasOwnProperty.call(list, key)) {
                    var item = list[key];
                    var mfpMsg: MemberFightPos = new MemberFightPos();
                    mfpMsg.memberId = item.userId;
                    mfpMsg.pos = item.heroPos;
                    msgList.push(mfpMsg);
                }
            }
        }

        var msg: MemberFightPosListMsg = new MemberFightPosListMsg();
        //@ts-ignore
        msg.isGet = isGet;
        msg.memberPos = msgList;
        FreedomTeamSocketOutManager.sendProtoBuffer(C2SProtocol.C_EDIT_TEAM_FIGHT_POS, msg);
    }

    public static sendProtoBuffer(code: number, message = null) {
        SocketManager.Instance.send(code, message);
    }

}