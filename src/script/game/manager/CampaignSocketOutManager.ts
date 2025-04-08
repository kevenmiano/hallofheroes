import { SocketManager } from "../../core/net/SocketManager";
import { C2SProtocol } from "../constant/protocol/C2SProtocol";
import { CampaignArmy } from "../map/campaign/data/CampaignArmy";
import { CampaignManager } from "./CampaignManager";
import Logger from '../../core/logger/Logger';
import CampaignReqMsg = com.road.yishi.proto.campaign.CampaignReqMsg;
import RoomExitMsg = com.road.yishi.proto.room.RoomExitMsg;
import CampaignFogDataListReqMsg = com.road.yishi.proto.campaign.CampaignFogDataListReqMsg;
import CampaignFogDataReqMsg = com.road.yishi.proto.campaign.CampaignFogDataReqMsg;
import HangupAttackMsg = com.road.yishi.proto.campaign.HangupAttackMsg;
import RoomReqMsg = com.road.yishi.proto.room.RoomReqMsg;
/**
 * 战场中  副本中与服务器通信的类  
 */
export class CampaignSocketOutManager {
	constructor() {
	}
	private static _instance: CampaignSocketOutManager
	public static get Instance(): CampaignSocketOutManager {
		if (!CampaignSocketOutManager._instance) CampaignSocketOutManager._instance = new CampaignSocketOutManager();
		return CampaignSocketOutManager._instance;
	}

	/**
	 * 战役中所有系统部队的兵种与英雄 
	 * @param mapId
	 * 
	 */
	public questCampaignAllEnemy(mapId: number) {
		var msg: CampaignReqMsg = new CampaignReqMsg();
		msg.paraInt1 = mapId;
		SocketManager.Instance.send(C2SProtocol.U_C_CAMPAIGN_SYSTEM_ARMY, msg);
	}

	/**
	 * 战役退出
	 * @param type -1新手退出 1退出 2再次挑战 
	 */
	public sendCampaignFinish(type: number) {
		var msg: CampaignReqMsg = new CampaignReqMsg();
		msg.paraInt1 = type;
		SocketManager.Instance.send(C2SProtocol.U_C_CAMPAIGN_FINISH, msg);
	}

	/**
	 * 掉落物品拾取
	 * 发送获取宝箱物品 
	 * @param signId
	 * @param posX
	 * @param posY
	 * 宝箱的数据模型 ChestInfo
	 * 战斗后由服务器发送下来 并添加到节点列表中
	 */
	public getFallChest(signId: string, paraInt1: number, paraInt2: number) {
		var msg: CampaignReqMsg = new CampaignReqMsg();
		msg.paraString1 = signId;
		msg.paraInt1 = paraInt1;
		msg.paraInt2 = paraInt2;
		SocketManager.Instance.send(C2SProtocol.U_C_DROPITEM_TAKE, msg);
	}

	/**
	 * 退出战役房间 
	 * @param armyId  部队信息
	 * @param sendMsg true:房间已没人  false: 房间还有人在
	 */
	public sendReturnCampaignRoom(armyId: number, sendMsg: boolean = false) {
		Logger.info("[CampaignSocketOutManager]sendReturnCampaignRoom 退出战役房间 armyId", armyId)
		var msg: RoomExitMsg = new RoomExitMsg();
		if (sendMsg) {
			msg.msg = "kill self";
		}
		else {
			msg.msg = "";
		}
		SocketManager.Instance.send(C2SProtocol.U_C_CAMPAIGN_ROOM_EXIT, msg);
	}

	/**
	 * 退出战役场景 
	 * @param  armyId  部队信息
	 * 
	 */
	public sendExitCampaignScene(armyId: number) {
		var exitMsg: RoomExitMsg = new RoomExitMsg();
		exitMsg.msg = "";
		SocketManager.Instance.send(C2SProtocol.U_C_CAMPAIGN_EXIT, exitMsg);
	}

	/**
	 * 战役中翻牌
	 * @param isPay  是否需要付费
	 * @param index  翻牌的问题
	 * @param armyId  部队信息
	 * 
	 */
	public sendCampaignCard(isPay: boolean, index: number, armyId: number) {
		var msg: CampaignReqMsg = new CampaignReqMsg();
		msg.paraInt1 = armyId;
		msg.paraBool1 = isPay;
		msg.paraInt2 = index;
		SocketManager.Instance.send(C2SProtocol.U_C_CAMPAIGN_TAKE_CARD, msg);
	}

	/**
	 * 更新迷雾 
	 * @param arr
	 * @param campaignId
	 * 
	 */
	public sendUpdateFogData(arr: any[], campaignId: number) {
		var msg: CampaignFogDataListReqMsg = new CampaignFogDataListReqMsg();
		for (var i: number = 0; i < arr.length; i++) {
			var fog: CampaignFogDataReqMsg = new CampaignFogDataReqMsg();
			fog.index = arr[i].index;
			fog.fogByte = arr[i].value;
			msg.dataList.push(fog);
		}
		SocketManager.Instance.send(C2SProtocol.U_C_CAMPAIGN_FOG_UPDATE, msg);
	}

	/**
	 * 玩家传送等待 
	 * 玩家节点站立状态
	 */
	public sendTranseferState(msg: com.road.yishi.proto.campaign.PlayerNodeStateMsg) {
		SocketManager.Instance.send(C2SProtocol.C_PLAYER_NODE_STATE, msg);
	}

	/**
	 * 战场排名请求 
	 */
	public requestWarFightOrderList() {
		SocketManager.Instance.send(C2SProtocol.C_WARORDER_REQUEST);
	}

	/**
	 *  战场 使用积分恢复血量
	 */
	public warMaxhp() {
		SocketManager.Instance.send(C2SProtocol.C_WAR_MAXHP);
	}

	/**
	 * 地图上切磋邀请 
	 * 修行神殿PK
	 * @param targetId 玩家Id
	 * 
	 */
	public sendMapPkInviteTo(targetId: number) {
		var self: CampaignArmy = CampaignManager.Instance.mapModel.selfMemberData;
		var msg: HangupAttackMsg = new HangupAttackMsg();
		msg.op = 1;
		msg.attackId = self.userId;
		msg.attackName = self.nickName;
		msg.defenceId = targetId;
		SocketManager.Instance.send(C2SProtocol.C_HANGUP_PVP, msg);
	}

	/**
		 * 跨服本投票踢人选择0:拒绝 ；1: 接受
		 */
	 public  sendCrossCmapignKillOutSelect(state:number,serverName:string = "")
	 {
		 var msg:RoomReqMsg = new RoomReqMsg();
		 msg.state = state;
		 msg.serverName = serverName;
		 SocketManager.Instance.send(C2SProtocol.CR_VOTEKILL_CHOOSE, msg);
	 }
}