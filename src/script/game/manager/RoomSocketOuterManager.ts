// @ts-nocheck

import { SocketManager } from "../../core/net/SocketManager";
import { C2SProtocol } from "../constant/protocol/C2SProtocol";
import { MessageTipManager } from "./MessageTipManager";
import LangManager from '../../core/lang/LangManager';

import ArmyFightPosEditListMsg = com.road.yishi.proto.army.ArmyFightPosEditListMsg;
import CampaignReqMsg = com.road.yishi.proto.campaign.CampaignReqMsg;
import EnterTowerInfoMsg = com.road.yishi.proto.campaign.EnterTowerInfoMsg;
import TowerInfoReqMsg = com.road.yishi.proto.campaign.TowerInfoReqMsg;
import RoomEditMsg = com.road.yishi.proto.room.RoomEditMsg;
import RoomReqMsg = com.road.yishi.proto.room.RoomReqMsg;
import PropertyMsg = com.road.yishi.proto.simple.PropertyMsg;
import Utils from "../../core/utils/Utils";

/**
 *房间信息更新, 房间状态, 玩家状态相关操作 
 * @author xiaobin.chen
 * 
 */
export class RoomSocketOuterManager {
    constructor() {
    }
    /**
     * 房间密码
     * @param roomId  房间Id  RoomManager.instance.roomInfo.id
     * @param password  密码
     * 
     */
    public static sendLockCampaignRoom(roomId: number, password: string) {
        var msg: RoomEditMsg = new RoomEditMsg();
        msg.roomId = roomId;
        msg.roomPwd = password;
        SocketManager.Instance.send(C2SProtocol.C_ROOM_PWDCHANGE, msg);
    }

    /**
     * 地下迷宫深渊迷宫重置
     * @param index  当前层数
     * 
     */
    public static resetTowerInfo(index: number) {
        var msg: TowerInfoReqMsg = new TowerInfoReqMsg();
        msg.index = index;
        SocketManager.Instance.send(C2SProtocol.C_TOWER_RESET, msg);
    }
    private static _intervalTime: number = 0;
    /**
     * 进入地下迷宫深渊迷宫
     * @param campaignId  副本编号  PlayerManager.instance.currentPlayerModel.towerInfo.campaignId
     * @param chooseIndex  第几层
     * @param isDouble  是否是双倍收益
     * 
     */
    public static enterTowerInfo(campaignId: number, chooseIndex: number = 1, isDouble: number = 1) {
        if (new Date().getTime() - RoomSocketOuterManager._intervalTime < 5000) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("activity.view.ActivityItem.command01"));
            return;
        }
        RoomSocketOuterManager._intervalTime = new Date().getTime();
        var msg: EnterTowerInfoMsg = new EnterTowerInfoMsg();
        msg.chooseIndex = chooseIndex;
        msg.campaignId = campaignId;
        msg.isDouble = isDouble;
        SocketManager.Instance.send(C2SProtocol.C_ENTER_TOWER, msg);
    }
    ////////////////////////////////////////

    /**
     * 房间信息更新
     * @param roomId  房间号  RoomManager.instance.roomInfo.id
     * @param DungeonId  章节ID  RoomInfo.selectedMapTemplate.DungeonId 
     * @param campaignId   副本编号 RoomInfo.selectedMapTemplate.CampaignId
     * 
     */
    public static updateRoomInfo(roomId: number, DungeonId: number, campaignId: number) {
        var msg: RoomReqMsg = new RoomReqMsg();
        msg.roomId = roomId;
        msg.dungeonId = DungeonId;
        msg.campaignId = campaignId;
        SocketManager.Instance.send(C2SProtocol.U_C_CAMPAIGN_ROOM_EDIT, msg);
    }

    private static _time: number;

    /**
     *  进入战役场景 
     * @param campaignId  副本编号 RoomInfo.CampaignId
     * @param capicity
     * @param callBack  回调函数 
     * @param isNoGet 不使用收益次数
     * 
     */
    public static sendStartCampaignScene(campaignId: number = 0, capicity: number = 0, callBack: Function = null, isNoGet: boolean = false, isCross: boolean = false) {
        var msg: CampaignReqMsg = new CampaignReqMsg();
        if (capicity == 1)
            msg.paraInt1 = capicity;
        msg.paraBool1 = isNoGet;
        msg.paraInt2 = campaignId;
        msg.isCross = isCross;
        SocketManager.Instance.send(C2SProtocol.U_C_CAMPAIGN_ENTER, msg);
    }

    /**
     * 房间玩家状态更新 
     * @param state: 玩家准备状态  （ 0:等待, 1: 准备, 2: 房主）
     * 
     */
    public static sendPlayerState(state: number, income: boolean = false) {
        var msg: RoomReqMsg = new RoomReqMsg();
        msg.state = state;
        msg.isGet = income
        SocketManager.Instance.send(C2SProtocol.U_C_PLAYER_READY_STATE, msg);
    }
    /**
     * 撮合战房间状态
     *  
     * @param state: 房间状态（0;未使用  1;  使用中    2; 撮合中    3; 游戏中）
     * 
     */
    public static sendRoomState(state: number) {
        var msg: RoomReqMsg = new RoomReqMsg();
        msg.state = state;
        SocketManager.Instance.send(C2SProtocol.U_C_ROOM_STATE, msg);
    }
    /**
     * 房间邀请 
     * @param userId:玩家ID      ThaneInfo.userId
     * 
     */
    public static sendRoomInvite(userId: number) {
        let msg: RoomReqMsg = new RoomReqMsg();
        msg.userId = userId;
        SocketManager.Instance.send(C2SProtocol.U_C_CAMPAIGN_ROOM_INVITE, msg);
    }

    /**
         *跨服副本撮合成功接受进入或者拒绝进入 
         */
    public static sendCrossAlertResult(state: number, campaignUid: string,roomId:string) {
        let msg: PropertyMsg = new PropertyMsg();
        msg.param1 = state;
        msg.param5 = campaignUid;
        msg.param6 = roomId;
        SocketManager.Instance.send(C2SProtocol.CR_MULTI_MATCH_CHOOSE, msg);
    }
}