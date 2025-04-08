import Logger from "../../../core/logger/Logger";
import { SocketManager } from "../../../core/net/SocketManager";
import { BattleManager } from "../../battle/BattleManager";
import { C2SProtocol } from "../../constant/protocol/C2SProtocol";
import AutoNewbieMgr from "./auto/AutoNewbieMgr";
import NewbieConfig from "./data/NewbieConfig";
import NewbieBaseActionMediator from "./mediators/NewbieBaseActionMediator";
import NewbieBaseConditionMediator from "./mediators/NewbieBaseConditionMediator";
import NewbieSpecialActionMediator from "./mediators/NewbieSpecialActionMediator";
import NewbieMainNode from "./nodes/NewbieMainNode";
import { SceneManager } from "../../map/scene/SceneManager";
import { MopupManager } from "../../manager/MopupManager";
import { SharedManager } from "../../manager/SharedManager";
import { NewbieNodeConfig } from "./data/NewbieNodeConfig";
import { NotificationManager } from "../../manager/NotificationManager";

import BattleReqMsg = com.road.yishi.proto.battle.BattleReqMsg;
import CallBackReqMsg = com.road.yishi.proto.campaign.CallBackReqMsg;
import NoviceReqMsgMsg = com.road.yishi.proto.novice.NoviceReqMsgMsg;
import NewbieEvent from "../../constant/event/NotificationEvent";
import { PlayerManager } from "../../manager/PlayerManager";
import { ArrayConstant, ArrayUtils } from "../../../core/utils/ArrayUtils";
import { RPT_EVENT_PREFIX } from "../../../core/thirdlib/RptEvent";
import { GameEventCode, GameEventString } from "../../constant/GameEventCode";
import SDKManager from "../../../core/sdk/SDKManager";

export class NewbieZorder {
	static DrawContainer = 10

	/**
	 * 在组件上的按钮提供点击事件, 层级要高于DrawContainer, 不会被其挡住
	 */
	static Frame4 = 20;
}

export default class NewbieModule {
	public recordLocal: boolean = false;
	public delayNum: number = 100;
	public mainNodeList: NewbieMainNode[] = []
	public curExeMainNodeId: number = 0;
	public curExeSubNodeId: number = 0;
	
	private static _instance: NewbieModule;
	public static get Instance(): NewbieModule {
		return this._instance ? this._instance : this._instance = new NewbieModule();
	}

	public get finishNodeStr(): string {
		if (this.recordLocal) {
			return SharedManager.Instance.newbieFinishNodeStr
		} else {
			return PlayerManager.Instance.newNoviceProcess
		}
	}

	public set finishNodeStr(v: string) {
		if (this.recordLocal) { 
			SharedManager.Instance.newbieFinishNodeStr = v
		} else {
			PlayerManager.Instance.newNoviceProcess = v
		}
	}


	public setup() {
		Laya.ClassUtils.regClass('NewbieBaseActionMediator', NewbieBaseActionMediator);
		Laya.ClassUtils.regClass('NewbieSpecialActionMediator', NewbieSpecialActionMediator);
		Laya.ClassUtils.regClass('NewbieBaseConditionMediator', NewbieBaseConditionMediator);
		
		NewbieConfig.init();
		AutoNewbieMgr.Instance.setup();
		this.start()
	}

	private addEvent() {
		NotificationManager.Instance.addEventListener(NewbieEvent.MANUAL_TRIGGER, this.onManualTrigger, this)
		// NotificationManager.Instance.addEventListener(NewbieEvent.MAIN_NODE_FINISH, this.onMainNodeFinish, this);
	}

	private removeEvent() {
		NotificationManager.Instance.removeEventListener(NewbieEvent.MANUAL_TRIGGER, this.onManualTrigger, this)
		// NotificationManager.Instance.removeEventListener(NewbieEvent.MAIN_NODE_FINISH, this.onMainNodeFinish, this);
	}

	private onManualTrigger(nodeId: number) {
		this.manualTrigger(nodeId)
	}

	private onMainNodeFinish(nodeId: number) {
		
	}

	public start() {
		Logger.info("###启动新手", this.finishNodeStr)
		
		this.addEvent();
		let nodeList = NewbieNodeConfig.nodelist
		nodeList = ArrayUtils.sortOn(nodeList, ["sort"], [ArrayConstant.NUMERIC | ArrayConstant.DESCENDING])
		for (let index = 0; index < nodeList.length; index++) {
			let nodeInfo = nodeList[index];
			let node = new NewbieMainNode(nodeInfo);
			nodeInfo.parse();
			this.mainNodeList.push(node);
		}
		Laya.timer.loop(this.delayNum, this, this.__timerUpdateHandler)
	}

	public end() {
		this.removeEvent();
		Laya.timer.clear(this, this.__timerUpdateHandler)
	}

	private __timerUpdateHandler() {
		if (NewbieModule.Instance.curExeMainNodeId) {
			// Logger.info("正在执行节点", NewbieModule.curExeNodeId)
			return;
		}

		//是否满足通用执行条件
		if (!this.checkCommonCons()) {
			return;
		}

		for (let index = 0; index < this.mainNodeList.length; index++) {
			let node = this.mainNodeList[index]

			if (node.data.manualTrigger) {
				continue;
			}
			// if (node.mainNodeId == 200) {
			// 	Logger.info("调试")
			// }

			if (node.isFinish()) {
				continue;
			}

			if (node.isSkip()) {
				continue;
			}

			if (node.isTrigger()) {
				node.startMainNode();
				break;
			}
		}
	}

	public manualTrigger(nodeId: number) {
		let node = this.getNodeById(nodeId)
		if (!node) {
			return;
		}

		if (node.isFinish()) {
			return;
		}

		if (node.isSkip()) {
			return;
		}

		if (node.isTrigger()) {
			Logger.info("主动触发新手节点", nodeId)
			node.startMainNode();
		}
	}

	public getNodeById(nodeId: number) {
		for (let index = 0; index < this.mainNodeList.length; index++) {
			let node = this.mainNodeList[index]

			if (node.mainNodeId == nodeId) {
				return node
			}
		}
		return null
	}

	public checkNodeFinish(nodeId: number) {
		let n = this.getNodeById(nodeId)

		if (n) {
			return n.isFinish()
		}
		
		return false;
	}

	// 新手节点控制是否可以进内城
	public checkEnterCastle() {
		return NewbieModule.Instance.checkNodeFinish(NewbieConfig.NEWBIE_150)
	}

	public checkCommonCons(): boolean {
		if (SceneManager.Instance.lock || MopupManager.Instance.model.isMopup) return false;
		return true;
	}


	///////////////////////////////////////////////////////////////////////////////////
	/**
	 * 发送保存新手记录
	 */
	public sendSaveProcess(nodeId: number) {
		if (this.finishNodeStr.indexOf(nodeId.toString()) == -1) {
			this.finishNodeStr += "_" + nodeId
			if (nodeId > 0) {
				let taskType = RPT_EVENT_PREFIX.TASK + nodeId.toString();
				SDKManager.Instance.getChannel().adjustEvent(taskType, nodeId);
				SDKManager.Instance.getChannel().postGameEvent(GameEventCode.Code_9999, JSON.stringify({ eventToken: GameEventString.complete_the_first_battle }));
			}
			if (this.recordLocal) { 
				SharedManager.Instance.saveNewbieFinishNodeStr();
			} else {
				let msg: NoviceReqMsgMsg = new NoviceReqMsgMsg();
				msg.newNoviceProcess = nodeId;
				SocketManager.Instance.send(C2SProtocol.U_C_PLAYER_NOVICE, msg);
			}
			Logger.info("###新手节点记录", nodeId, this.finishNodeStr);
		}
	}

	public sendCurProcess(nodeId: number, subNodeId?: number) {

	}

	/**
	 * 发送进入新手副本
	 * @param id  副本id
	 */
	public sendEnterCampaign(id: number) {
		var msg: NoviceReqMsgMsg = new NoviceReqMsgMsg();
		msg.type = id;
		SocketManager.Instance.send(C2SProtocol.U_C_CAMPAIGN_TRAINING, msg);
	}

	/**
	 * 发送暂停战斗
	 */
	public sendBattlePause() {
		var msg: BattleReqMsg = new BattleReqMsg();
		msg.battleId = BattleManager.Instance.battleModel.battleId;
		SocketManager.Instance.send(C2SProtocol.U_B_USR_STOP_CMD, msg);
	}

	/**
	 * 发送继续战斗
	 */
	public sendBattleContinue() {
		var msg: BattleReqMsg = new BattleReqMsg();
		msg.battleId = BattleManager.Instance.battleModel.battleId;
		SocketManager.Instance.send(C2SProtocol.B_PAUSE_FINISHED, msg);
	}

	/**
	 * 发送初始化内城建筑和队列
	 */
	public sendInitBuildAndQueue() {
		SocketManager.Instance.send(C2SProtocol.C_BUILDING_INIT, null);
	}

	/**
	 * 请求外城副本战
	 * @param mapId
	 * 
	 */
	public sendOuterCityBattle() {
		SocketManager.Instance.send(C2SProtocol.C_FIGHT_SPECIAL_BOSS, null);
	}


	/**
	 * 发送执行副本中回调
	 * @param mapId  地图id
	 * @param nodeId  节点id
	 * @param cmd  指令id
	 */
	public sendCallInCampaign(mapId: number, nodeId: number, cmd: number) {
		var msg: CallBackReqMsg = new CallBackReqMsg();
		msg.mapId = mapId;
		msg.nodeId = nodeId;
		msg.cmd = cmd;
		SocketManager.Instance.send(C2SProtocol.U_C_CAMPAIGN_CALLBACK, msg);
	}

	/**
	 * 发送进入采集战斗
	 */
	public sendEnterCollectionBattle() {
		SocketManager.Instance.send(C2SProtocol.C_NEW_GUILD_FIGHT, null);
	}
}