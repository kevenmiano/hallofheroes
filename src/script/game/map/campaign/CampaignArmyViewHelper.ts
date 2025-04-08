// @ts-nocheck
import LangManager from "../../../core/lang/LangManager";
import { PointDirectionHelper } from "../../../core/utils/PointDirectionHelper";
import { PointUtils } from "../../../core/utils/PointUtils";
import { NotificationEvent } from "../../constant/event/NotificationEvent";
import { ArmyManager } from "../../manager/ArmyManager";
import { CampaignManager } from "../../manager/CampaignManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { AStarPathFinder } from "../../mapEngine/AStarPathFinder";
import { CampaignMapModel } from "../../mvc/model/CampaignMapModel";
import { CampaignMapScene } from "../../scene/CampaignMapScene";
import { WorldBossHelper } from "../../utils/WorldBossHelper";
import AIBaseInfo from "../ai/AIBaseInfo";
import { BaseArmyAiInfo } from "../ai/BaseArmyAiInfo";
import { NodeState } from "../space/constant/NodeState";
import { PosType } from "../space/constant/PosType";
import Tiles from "../space/constant/Tiles";
import { CampaignNode } from "../space/data/CampaignNode";
import Logger from '../../../core/logger/Logger';
import { CampaignArmyState } from "./data/CampaignArmyState";
import { CampaignArmy } from "./data/CampaignArmy";
import BuildSonType from '../../constant/BuildSonType';
import { MessageTipManager } from "../../manager/MessageTipManager";
import { BaseArmy } from "../space/data/BaseArmy";
import FreedomTeamManager from "../../manager/FreedomTeamManager";

/**
 * 副本军队帮助类 <br/>
 * 军队行走 停下时的逻辑 
 */
export class CampaignArmyViewHelper {
	/**
	 *  检测节点事件 <br/>
	 *  触发节点返回true
	 */
	public static selfArmyEvent(userId: number, aiInfo: BaseArmyAiInfo, target: Object, p: Laya.Point, isCollection: boolean = false, idDie: number = 0): boolean {
		return CampaignArmyViewHelper.launchFight(aiInfo, target, p, idDie);
	}

	public static selfArmyToEnd(aiInfo: BaseArmyAiInfo, target: any): boolean {//自已部队停下来以后的事件检测
		var node: CampaignNode = CampaignArmyViewHelper.mapModel.getHandlerNode(target.x / 20, target.y / 20);
		if (!node) node = CampaignArmyViewHelper.goSelectPoint(target);
		if (!node) {
			return false;
		}
		var p: Laya.Point = CampaignArmyViewHelper.getResetPoint(node, target, new Laya.Point(parseInt((target.x / 20).toString()), parseInt((target.y / 20).toString())));
		if (node.info.types == PosType.FALL_CHEST) {
			node.info.state = NodeState.HIDE;
			node.commit();
			return true;
		}

		let disX = Math.abs(target.x - node.fixX)
		let disY = Math.abs(target.y - node.fixY)
		let dis = Math.sqrt(disX * disX + disY * disY)
		Logger.xjy("[CampaignArmyViewHelper]selfArmyToEnd 玩家位置", target.x, target.y, "触发节点位置", node.fixX, node.fixY, "距离", dis)
		return CampaignArmyViewHelper.sendMessage(p, node);
	}


	private static _preTime: number;
	private static launchFight(aiInfo: BaseArmyAiInfo, target: any, nextPoint: Laya.Point, idDie: number = 0): boolean {//找出节点, 发起移动与到达指令
		if (CampaignArmyViewHelper.selfarmy) {
			var node: CampaignNode = CampaignArmyViewHelper.mapModel.getNotHandlerNodeByXY(nextPoint.x, nextPoint.y);///找出事件点
			if (!node) return false;

			var p: Laya.Point = CampaignArmyViewHelper.getResetPoint(node, target, nextPoint);
			aiInfo.road = null;

			target.x = p.x * Tiles.WIDTH;
			target.y = p.y * Tiles.HEIGHT;
			aiInfo.pathInfo = [];
			var curTime: number = new Date().getTime();
			if (curTime - CampaignArmyViewHelper._preTime < 700) {
				return true;
			}
			CampaignArmyViewHelper._preTime = curTime;
			return CampaignArmyViewHelper.sendMessage(p, node);
		}
		return false;
	}
	private static sendMessage(p: Laya.Point, node: CampaignNode): boolean {
		Logger.xjy("[CampaignArmyViewHelper]sendMessage", node)
		NotificationManager.Instance.dispatchEvent(NotificationEvent.SEND_CAMPAIGN_ARRIVE, null);
		if (node.info.state == NodeState.FIGHTING) {
			if (WorldBossHelper.checkConsortiaSecretLand(CampaignArmyViewHelper.mapModel.mapId)) return false;
			var msg: string;
			if (WorldBossHelper.checkPvp(CampaignArmyViewHelper.mapModel.mapId)) {
				CampaignManager.Instance.controller.sendCampaignArrive(CampaignArmyViewHelper.selfarmy.id, node.nodeId);
				return true;
			}
			if(WorldBossHelper.checkConsortiaBoss(CampaignArmyViewHelper.mapModel.mapId)) {
				CampaignManager.Instance.controller.sendCampaignArrive(this.selfarmy.id,node.nodeId);
				return true;
			}
			if(WorldBossHelper.checkInPetBossFloor(CampaignArmyViewHelper.mapModel.mapId) && FreedomTeamManager.Instance.hasTeam) 
			{
				CampaignManager.Instance.controller.sendCampaignArrive(CampaignArmyViewHelper.selfarmy.id,node.nodeId);
				return true;
			}
			if (WorldBossHelper.checkPetLand(CampaignArmyViewHelper.mapModel.mapId)) {
				msg = LangManager.Instance.GetTranslation("map.outercity.view.mapphysics.MapPhysicsCastle.command05");
				(<CampaignMapScene>CampaignManager.Instance.controller).alertMsg(msg);
				return true;
			}
			if (CampaignManager.Instance.mapModel.campaignTemplate
				&& CampaignManager.Instance.mapModel.campaignTemplate.Capacity <= 1) return true;

			CampaignManager.Instance.controller.sendReinforce(node.nodeId);
		}
		else {
			if (WorldBossHelper.checkPvp(CampaignManager.Instance.mapId)) {
				let selfMemberData: CampaignArmy = CampaignManager.Instance.mapModel.selfMemberData;
				let transportState = selfMemberData.isDie;
				if (selfMemberData && node.sonType == BuildSonType.SONTYPE_2380 && (transportState == CampaignArmyState.STATE_DIEDTRAN || transportState == CampaignArmyState.STATE_TRAN)) {
					Logger.xjy("[CampaignArmyViewHelper]战场运输中 不发送军队到达某个矿节点")
					// MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("CampaignArmyViewHelper.pleaseHandleupResource"));
					return false;
				}
			}
			//通知服务器
			if (CampaignManager.Instance.controller) {
				CampaignManager.Instance.controller.sendCampaignArrive(CampaignArmyViewHelper.selfarmy.id, node.nodeId);
			}
		}
		return true;
	}

	private static getResetPoint(node: CampaignNode, target: any, nextPoint: Laya.Point): Laya.Point {
		//停留在事件点附近的停留点, 
		var p: Laya.Point;
		if (node.resetPosX > 0 && node.resetPosY > 0) {
			p = new Laya.Point(node.resetPosX, node.resetPosY);
		}
		else {
			if (PosType.checkSendType(node.info.types)) {
				p = new Laya.Point(nextPoint.x, nextPoint.y);
			}
			else {
				p = new Laya.Point(parseInt((target.x / 20).toString()), parseInt((target.y / 20).toString()));
			}
		}
		return p;
	}

	public static getNodeStationPoint(info: AIBaseInfo, node: CampaignNode): Laya.Point {//从当前点后退三个点
		var index: number = (info.walkIndex - 3 > 0 ? info.walkIndex - 3 : 0);
		if (index == 0) return CampaignArmyViewHelper.getNodeStationPointImp(node);
		return info.pathInfo[index] as Laya.Point;
	}
	public static getNodeStationPointImp(node: CampaignNode): Laya.Point {
		//找出事件点附近的停留点
		var p: Laya.Point = new Laya.Point();
		var arr: any[] = PointDirectionHelper.getPointBy8Dier();
		arr = arr.reverse();
		var p1: Laya.Point;
		for (let point of arr) {
			if (CampaignManager.Instance.controller.getWalkable(node.posX + point.x, node.posY + point.y)) {
				p.x = node.posX + point.x;
				p.y = node.posY + point.y;
				break;
			}
		}
		return p;
	}
	private static goSelectPoint(target: any): CampaignNode {
		var nInfo: CampaignNode = CampaignManager.Instance.mapModel.selectNode;
		if (nInfo) {
			if (CampaignManager.Instance.mapModel.onCollectionId == nInfo.nodeId) return null;
			if (nInfo.info.state == NodeState.EXIST) {
				var start: Laya.Point = new Laya.Point(target.x, target.y);
				var end: Laya.Point = new Laya.Point(nInfo.x, nInfo.y);
				if (nInfo.nodeView) {
					end.x = nInfo.nodeView.x;
					end.y = nInfo.nodeView.y;
				}
				var dis: number = start.distance(end.x, end.y);
				var range: number = nInfo.handlerRange;
				if (range == 0) {
					range = 2;
				}
				if (dis < (range + 1) * Tiles.WIDTH) return nInfo;
			}else if(nInfo.info.state == NodeState.FIGHTING){
				if(WorldBossHelper.checkInPetBossFloor(CampaignArmyViewHelper.mapModel.mapId)) 
				{
					return nInfo;
				}
			}
		}

		return null;
	}
	public static searchPath($start: Laya.Point, $end: Laya.Point, unitWidth: number = 20, unitHeight: number = 20): any[] {//搜路线
		var startPoint: Laya.Point = PointUtils.scaleTransform($start, unitWidth, unitHeight);
		var endPoint: Laya.Point = PointUtils.scaleTransform($end, unitWidth, unitHeight);
		var path: Object = CampaignManager.Instance.mapModel.mapTielsData;
		var pathFinder: AStarPathFinder = new AStarPathFinder(path);
		var arr: any[];
		if (startPoint.x < endPoint.x) {
			arr = pathFinder.find(endPoint, startPoint);
			arr = arr.reverse();
		}
		else {
			arr = pathFinder.find(startPoint, endPoint);
		}
		return arr;
	}

	//检查是否正在当前点采集
	public static checkCollection(node: CampaignNode): boolean {
		if (node) if (CampaignArmyViewHelper.mapModel.onCollectionId == node.nodeId) return true;
		return false;
	}
	/**
	 * 是否为采集节点 
	 * @param nodeInfo
	 * @return 
	 * 
	 */
	public static checkCollectionNode(nodeInfo: CampaignNode): boolean {
		if (!nodeInfo) return false;
		if (nodeInfo.info)
			return nodeInfo.info.types == PosType.COLLECTION;
		else {
			switch (nodeInfo.nodeId) {
				case 600104: case 600105: case 600106: case 600107: case 600108:
				case 600109: case 600110: case 600111: case 600112: case 600113:
				case 600114: case 600115: case 600116: case 400105: case 400106:
				case 400107: case 400108: case 400109: case 400110: case 400205:
				case 400206: case 400207: case 400208: case 400209: case 400210:
					return true;
					break;
			}
		}
		return false;
	}

	/**
	 * 检查是否公会秘境神树
	 */
	public static checkTreeNode(nodeInfo: CampaignNode): boolean {
		if (!nodeInfo) return false;
		return nodeInfo.nodeId == 750102;
	}

	/**
	 * 检查是否公会魔神祭坛主祭坛
	 */
	public static checkDemonAltarNode(nodeInfo: CampaignNode): boolean {
		if (!nodeInfo) return false;
		return nodeInfo.nodeId == 760102;
	}

	private static get selfarmy(): any {
		return ArmyManager.Instance.army;
	}
	private static get mapModel(): CampaignMapModel {
		return CampaignManager.Instance.mapModel;
	}
	private static get mapControler(): CampaignMapScene {
		return CampaignManager.Instance.controller;
	}
	/**
	 * 是否为塔防节点 如果是对面的, 鼠标变为攻击图标 
	 * @param nodeInfo
	 * @return 
	 * 
	 */
	public static checkAttackNode(nodeInfo: CampaignNode): boolean {
		if (!nodeInfo) return false;
		return nodeInfo.info.types == PosType.TOWER_DEFENCE;
	}

	/**
	 *  公会战中找出周围可攻击的部队进行攻击
	 *  在部队停下来的时候检测
	 */
	public static checkGvgArmy() {
		var enemyArmy = CampaignArmyViewHelper.mapControler.armyGvgFight;
		if (enemyArmy) {
			CampaignManager.Instance.controller.gvgPlayerFight(enemyArmy.userId);
		}
	}

	/**
		 * 角度 单位：度 
		 * @param num
		 * @return 
		 * 
		 */		
	 public static calcFrameY(num:number):Array<number> {
		var frameY:number = 1;
		var mirror:number = 1;
		if (num >= 270 && num < 280){
			frameY=4;
		} else if (num >= 260 && num < 270) {
			frameY=4;
		} else if (num >= 280 && num < 350) {
			frameY=3;
		} else if (num >= 350 || num < 10) {
			frameY=2;
		} else if (num >= 10 && num < 80) {
			frameY=1;
		} else if (num >= 80 && num <= 90) {
			frameY=0;
		} else if (num > 90 && num < 100) {
			frameY=0;
		} else if (num < 170 && num >= 100) {
			frameY = 1;
			mirror = -1;
		} else if (num < 190 && num >= 170) {
			frameY=2;
			mirror = -1;
		} else if (num < 260 && num >= 190) {
			frameY=3;
			mirror = -1;
		}
		return [frameY,mirror];
	}
	
	/**
	 * 计算时候翻转 
	 * @param num
	 * @return 
	 * 
	 */		
	 public  static calcMirror(num:number):number {
		var mirror:number = 1;
		if (num >= 270 && num < 280)
		{
			mirror=1;
		}
		else if (num >= 260 && num < 270) {
			mirror=-1;
		}
		else if (num >= 280 && num < 350)
		{
			mirror=1;
		}
		else if (num >= 350 || num < 10)
		{
			mirror=1;
		}
		else if (num >= 10 && num < 80)
		{
			mirror=1;
		}
		else if (num >= 80 && num <= 90)
		{
			mirror=1;
		}
		else if (num > 90 && num < 100)
		{
			mirror=-1;
		}
		else if (num < 170 && num >= 100)
		{
			mirror=-1;
		}
		else if (num < 190 && num >= 170)
		{
			mirror=-1;
		}
		else if (num < 260 && num >= 190)
		{
			mirror=-1;
		}
		return mirror;
	}

}