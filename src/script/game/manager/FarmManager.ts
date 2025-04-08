// @ts-nocheck

import LangManager from '../../core/lang/LangManager';
import Logger from '../../core/logger/Logger';
import { PackageIn } from "../../core/net/PackageIn";
import { ServerDataManager } from "../../core/net/ServerDataManager";
import { SocketManager } from "../../core/net/SocketManager";
import ResMgr from '../../core/res/ResMgr';
import { DateFormatter } from "../../core/utils/DateFormatter";
import SimpleAlertHelper from '../component/SimpleAlertHelper';
import { t_s_itemtemplateData } from "../config/t_s_itemtemplate";
import { ChatEvent, PetEvent, WaterEvent } from "../constant/event/NotificationEvent";
import { PlayerEvent } from "../constant/event/PlayerEvent";
import { FarmOperateType } from "../constant/FarmOperateType";
import OpenGrades from "../constant/OpenGrades";
import { C2SProtocol } from "../constant/protocol/C2SProtocol";
import { S2CProtocol } from '../constant/protocol/S2CProtocol';
import { EmPackName, EmWindow } from '../constant/UIDefine';
import { ChatChannel } from "../datas/ChatChannel";
import { ThaneInfo } from "../datas/playerinfo/ThaneInfo";
import { SceneManager } from "../map/scene/SceneManager";
import SceneType from "../map/scene/SceneType";
import ChatData from "../module/chat/data/ChatData";
import FarmCtrl from '../module/farm/control/FarmCtrl';
import FarmInfo from '../module/farm/data/FarmInfo';
import FarmLandInfo from '../module/farm/data/FarmLandInfo';
import { FarmModel } from '../module/farm/data/FarmModel';
import FriendFarmStateInfo from '../module/farm/data/FriendFarmStateInfo';
import PetLandInfo from '../module/farm/data/PetLandInfo';
import { TreeInfo } from '../module/farm/data/TreeInfo';
import FarmWnd from '../module/farm/view/FarmWnd';
import LoadingSceneWnd from '../module/loading/LoadingSceneWnd';
import { PetData } from '../module/pet/data/PetData';
import { FrameCtrlManager } from '../mvc/FrameCtrlManager';
import { WorldBossHelper } from "../utils/WorldBossHelper";
import { ArmyManager } from "./ArmyManager";
import { CampaignManager } from "./CampaignManager";
import { FriendManager } from "./FriendManager";
import GameManager from './GameManager';
import { MessageTipManager } from "./MessageTipManager";
import { NotificationManager } from "./NotificationManager";
import { PlayerManager } from "./PlayerManager";
import { TempleteManager } from './TempleteManager';
import { WaterManager } from "./WaterManager";

import FarmInfoRspMsg = com.road.yishi.proto.farm.FarmInfoRspMsg;
import FarmLandInfoMsg = com.road.yishi.proto.farm.FarmLandInfoMsg;
import FarmOperReqMsg = com.road.yishi.proto.farm.FarmOperReqMsg;
import FriendUserIdsMsg = com.road.yishi.proto.farm.FriendUserIdsMsg;
import HomeWnd from '../module/home/HomeWnd';
import Utils from '../../core/utils/Utils';

/**
 * 主要负责农场模块的协议处理, 提供协议发送、数据操作的API
 * 
 */
export class FarmManager {
	private _showingBag: boolean = false;
	public showFriendList: boolean = false;

	private static _instance: FarmManager;

	public static get Instance(): FarmManager {
		if (!this._instance) this._instance = new FarmManager();
		return this._instance;
	}

	private _model: FarmModel;
	public get model(): FarmModel {
		return this._model;
	}
	public get showingBag(): boolean {
		return this._showingBag;
	}

	public set showingBag(v: boolean) {
		this._showingBag = v;
	}

	public setup() {
		this._model = new FarmModel();
		this.addEvent();
	}

	private addEvent() {
		ServerDataManager.listen(S2CProtocol.U_C_FARM_INFO, this, this.__getFarmInfoHandler);
		ServerDataManager.listen(S2CProtocol.U_C_FARMLAND_INFO, this, this.__farmlandUpdateHandler);
		GameManager.Instance.addEventListener(PlayerEvent.SYSTIME_UPGRADE_SECOND, this.__timeUpdateHandler, this);
		PlayerManager.Instance.currentPlayerModel.playerInfo.addEventListener(PetEvent.PET_UPDATE, this.__petUpdateHandler, this);
	}

	/**
	 * 土地升级确认支付框
	 */
	public static sendLandUp(landGrade: number) {
		//土地升级的花费
		var cost: number = landGrade * (landGrade + 1) * (landGrade + 2) * 10; //1.6版本的土地升级价格
		var cost: number = landGrade * (landGrade + 1) * (landGrade + 2) / 2 + 15;//2.0版本的土地升级价格
		let tempValue = 1;
		let cfg = TempleteManager.Instance.getConfigInfoByConfigName("Land_Up_Mulriple");
		if (cfg) {
			tempValue = Number(cfg.ConfigValue);
		}
		var tip: string = LangManager.Instance.GetTranslation("farm.FarmManager.landUpPayTip", cost * tempValue, landGrade + 1);
		SimpleAlertHelper.Instance.Show(SimpleAlertHelper.USEBINDPOINT_ALERT, { point: cost, checkDefault: true }, null, tip, null, null, FarmManager.__sendLandUpBack.bind(this));
	}
	/**
	 * 土地升级确认或者取消支付的回调
	 * @param b: 确认/取消
	 * @param objectId
	 * @param type: 支付类型
	 */
	private static __sendLandUpBack(b: boolean, flag: boolean, objectId: number = 0, type: number = 0) {
		if (b) {
			var msg: FarmOperReqMsg = new FarmOperReqMsg();
			msg.opType = FarmOperateType.LAND_UP;
			msg.payType = 0;
			if (!flag) {
				msg.payType = 1;
			}
			SocketManager.Instance.send(C2SProtocol.CH_FARM_OPER_CHECK, msg);
		}
	}


	private __petUpdateHandler(evtData) {
		var petData: PetData = evtData;
		if (!petData) return;
		if (!this._model.myFarm) return;
		let list = this._model.myFarm.getPetLandList();
		for (const key in list) {
			if (Object.prototype.hasOwnProperty.call(list, key)) {
				const petLand = list[key];
				if (petLand.petId == petData.petId) {
					petLand.name = petData.name;
				}
			}
		}
	}

	/**
	 * 农场信息返回
	 * 1.游戏中开启农场需要保存自己的的消息 来展示主工具栏红点
	 * 2.当前选择的农场改变时, 会返回此信息, 刷新当前展示的农场
	 */
	private __getFarmInfoHandler(pkg: PackageIn) {
		var msg = pkg.readBody(FarmInfoRspMsg) as FarmInfoRspMsg;

		Logger.xjy("[FarmManager]__getFarmInfoHandler 返回农场信息", msg)

		var info: FarmInfo = this.model.getFarmInfo(msg.userId);

		if (!info && this.thane.userId == msg.userId) {
			let farmInfo = new FarmInfo();
			farmInfo.userId = msg.userId;
			farmInfo.nickName = msg.nickName;
			this._model.addFarmInfo(farmInfo);
		}
		this.readFarmInfoMsg(info, msg);

		if (info && !info.isMine) {//更新好友农场状态
			var canSteal: boolean = false;
			var canRevive: boolean = false;
			var canWorm: boolean = false;
			var canWeed: boolean = false;
			var canFeed: boolean = false;
			var fsInfo: FriendFarmStateInfo = this.model.getFarmStateInfo(info.userId);
			let landlist = info.getLandList();
			for (const key in landlist) {
				if (Object.prototype.hasOwnProperty.call(landlist, key)) {
					const land = landlist[key];
					if (this.checkHasOperNow(land, FarmOperateType.STEAL)) canSteal = true;
					if (this.checkHasOperNow(land, FarmOperateType.REVIVE)) canRevive = true;
					if (this.checkHasOperNow(land, FarmOperateType.WORM)) canWorm = true;
					if (this.checkHasOperNow(land, FarmOperateType.WEED)) canWeed = true;
				}
			}
			let petLandlist = info.getPetLandList();
			for (const key in petLandlist) {
				if (Object.prototype.hasOwnProperty.call(petLandlist, key)) {
					const petland = petLandlist[key];
					if (petland.canFeed()) canFeed = true;
				}
			}

			fsInfo.beginChanges();
			fsInfo.canSteal = canSteal;
			fsInfo.canRevive = canRevive;
			fsInfo.canWorm = canWorm;
			fsInfo.canWeed = canWeed;
			fsInfo.canFeed = canFeed;
			fsInfo.commitChanges();
		}
	}
	/**
	 * 解析农场信息 
	 * @param info: 需要被赋值的农场info
	 * @param msg: 需要被解析的消息体
	 * @return : 暂时没用
	 * 
	 */
	private readFarmInfoMsg(info: FarmInfo, msg: FarmInfoRspMsg): FarmInfo {
		if (!info || !msg) return info;
		info.userId = msg.userId;
		info.nickName = msg.nickName;
		info.grade = msg.grades;
		info.landGrade = msg.landGrades;
		info.gp = msg.gp;
		info.dayGpFromFriend = msg.todayFromFriendGp;
		info.dayStealCount = msg.todayStolenCount;
		let farmlandInfo = msg.farmLandInfo;
		for (const key in farmlandInfo) {
			if (Object.prototype.hasOwnProperty.call(farmlandInfo, key)) {
				const landMsg = farmlandInfo[key];
				var landInfo: FarmLandInfo = info.getLandInfo(landMsg.pos);
				if (!landInfo) landInfo = new FarmLandInfo();
				this.readLandInfoMsg(landInfo, landMsg);
				info.addLandInfo(landInfo);
			}
		}

		let petInfo = msg.petInfo;
		for (const key in petInfo) {
			if (Object.prototype.hasOwnProperty.call(petInfo, key)) {
				const petMsg = petInfo[key];
				var petLand: PetLandInfo = info.getPetLandInfo(petMsg.pos);
				if (!petLand) petLand = new PetLandInfo();
				petLand = this.readPetInfoMsg(petLand, petMsg);
				info.addPetLandInfo(petLand);
			}
		}

		var defender: PetLandInfo = new PetLandInfo();
		defender = this.readPetInfoMsg(defender, msg.guardPetInfo);
		if (defender.petId != 0) {
			info.defender = defender;
		} else {
			info.defender = null;
		}

		if (!msg.treeInfo) {
			return info
		}
		info.treeInfo = this.waterManager.treeList[msg.treeInfo.userId];
		if (!info.treeInfo) info.treeInfo = new TreeInfo();
		this.readTreeInfoMsg(info.treeInfo, msg.treeInfo);
		this.waterManager.treeList[msg.treeInfo.userId] = info.treeInfo;
		return info;
	}

	/**
	 * 解析农场土地信息 
	 * @param info: 需要被赋值的土地info
	 * @param msg: 需要被解析的消息体
	 * @return : 暂时没用
	 * 
	 */
	private readLandInfoMsg(info: FarmLandInfo, msg): FarmLandInfo {
		if (!info || !msg) return info;
		info.beginChanges();
		info.userId = msg.userId;
		info.pos = msg.pos;
		info.cropTempId = msg.itemTemplateId;
		info.plantTime = DateFormatter.parse(msg.plantingTime, "YYYY-MM-DD hh:mm:ss");
		info.matureTime = DateFormatter.parse(msg.matureTime, "YYYY-MM-DD hh:mm:ss");

		Logger.xjy("[]readLandInfoMsg Fmgr", info.pos, info.matureTime, PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond)
		info.accelerateCount = msg.accelerateCount;
		info.stolenCount = msg.stolenCount;
		info.stolenList = msg.stolenUsers;
		info.outputCount = msg.rewardCount;
		info.isGrassP1 = msg.isGrassParam1;
		info.isGrassP2 = msg.isGrassParam2;
		info.isWormP1 = msg.isWormParam1;
		info.isWormP2 = msg.isWormParam2;
		info.commitChanges();
		return info;
	}

	/**
	 * 读取宠物信息 
	 * @param info
	 * @param msg
	 * @return 
	 * 
	 */
	private readPetInfoMsg(info: PetLandInfo, msg): PetLandInfo {
		if (!info || !msg) return info;

		info.userId = msg.userId;
		info.petId = msg.petId;
		info.name = msg.petName;
		info.quality = (msg.quality - 1) / 5 + 1;
		info.pos = msg.pos;
		info.petTemplateId = msg.petTemplateId;
		info.beginTime = msg.beginTime;
		info.endTime = msg.endTime;
		info.lastFeedRegion = msg.state;
		Logger.xjy("[FarmManager]readPetInfoMsg读取宠物信息", info)
		return info;
	}

	/**
	 * 解析农场神树信息 
	 * @param info: 需要被赋值的神树info
	 * @param msg: 需要被解析的消息体
	 * @return : 暂时没用
	 * 
	 */
	private readTreeInfoMsg(info: TreeInfo, msg): TreeInfo {
		if (!info || !msg) return info;
		info.userId = msg.userId;
		info.nickName = msg.nickName;
		info.waterCount = msg.waterCount;
		info.fruitCount = msg.fruitCount;
		info.isFirstFruit = msg.isFirstFruit;
		info.nextPickTime = DateFormatter.parse(msg.nextPickTime, "YYYY-MM-DD hh:mm:ss");
		info.lastWaterTime = DateFormatter.parse(msg.lastWaterTime, "YYYY-MM-DD hh:mm:ss");
		info.property1 = msg.property1;
		info.property2 = msg.property2;
		info.notHasTree = false;
		if (info.userId == this.thane.userId) {
			info.todayCanWater = msg.canWater;
			info.timeLeft = msg.leftTime;
			info.leftpickTime = msg.leftPickTime;
		}

		// Logger.xjy("[FarmManager]readTreeInfoMsg", info.userId == this.thane.userId, info)
		this.waterManager.dispatchEvent(WaterEvent.TREE_UPDATE, info);
		return info;
	}

	/**
	 *对当前选择的农场操作（不包括充能）后返回更新信息 
	 * @param e
	 * 
	 */
	private __farmlandUpdateHandler(pkg: PackageIn) {
		var mainMsg = pkg.readBody(FarmInfoRspMsg);

		var curSelectedFarm: FarmInfo;
		if (mainMsg.hasUserId) {
			curSelectedFarm = this.model.getFarmInfo(mainMsg.userId);
		}
		if (!curSelectedFarm) {
			curSelectedFarm = this.model.curSelectedFarmInfo;
		}
		if (!curSelectedFarm) {
			// 农场之外也能取消英灵修炼
			this.model.curSelectedUserInfo = this.thane;
			curSelectedFarm = this.model.myFarm;
		}
		if (!curSelectedFarm) {
			return;
		}

		let farmLandInfo = mainMsg.farmLandInfo;
		for (const key in farmLandInfo) {
			if (Object.prototype.hasOwnProperty.call(farmLandInfo, key)) {
				const landMsg = farmLandInfo[key];
				if (curSelectedFarm.userId == landMsg.userId) {
					var landInfo: FarmLandInfo = curSelectedFarm.getLandInfo(landMsg.pos);
					if (!landInfo) landInfo = new FarmLandInfo();
					this.readLandOperMsg(landInfo, landMsg);
					curSelectedFarm.addLandInfo(landInfo);

					if (landMsg.hasParam1 && landMsg.hasParam2) {
						// var pMsg: PropertyMsg = new PropertyMsg();
						// pMsg.param6 = landMsg.param1;
						// // if (landMsg.param2)
						// // 	pMsg.param7 = !ApplicationDomain.currentDomain.hasDefinition(landMsg.param2);
						// SocketManager.Instance.send(C2SProtocol.CH_FARM_OPER_CHECK, pMsg);
					}
				}
			}
		}

		var petInfo: PetLandInfo;
		for (const key in mainMsg.petInfo) {
			if (Object.prototype.hasOwnProperty.call(mainMsg.petInfo, key)) {
				const petMsg = mainMsg.petInfo[key];
				if (curSelectedFarm.userId != petMsg.userId) continue;
				petInfo = curSelectedFarm.getPetLandInfo(petMsg.pos);
				if (!petInfo) petInfo = new PetLandInfo();
				petInfo = this.readPetInfoMsg(petInfo, petMsg);
				curSelectedFarm.addPetLandInfo(petInfo);
				petInfo.commit();
			}
		}

		if (mainMsg.hasGuardPetInfo) {
			var defender: PetLandInfo = new PetLandInfo();
			defender = this.readPetInfoMsg(defender, mainMsg.guardPetInfo);
			if (defender.petId != 0) {
				curSelectedFarm.defender = defender;
			} else {
				curSelectedFarm.defender = null;
			}
		}

		this.updateFriendFarmStateInfo(curSelectedFarm);
	}

	/**
	 * 解析农场土地信息 
	 * @param info: 需要被赋值的土地info
	 * @param msg: 需要被解析的消息体
	 * @return : 暂时没用
	 * 
	 */
	private readLandOperMsg(info: FarmLandInfo, msg: FarmLandInfoMsg): FarmLandInfo {
		if (!info || !msg) return info;
		info.beginChanges();
		info.userId = msg.userId;
		info.pos = msg.pos;
		info.cropTempId = msg.itemTemplateId;
		info.plantTime = DateFormatter.parse(msg.plantingTime, "YYYY-MM-DD hh:mm:ss");
		info.matureTime = DateFormatter.parse(msg.matureTime, "YYYY-MM-DD hh:mm:ss");
		info.originMatureTime = DateFormatter.parse(msg.originMatureTime, "YYYY-MM-DD hh:mm:ss");
		Logger.xjy("[FarmManager]readLandOperMsg", "pos=" + info.pos, "plantTime=" + info.plantTime, "matureTime=" + info.matureTime, "originMatureTime=" + info.originMatureTime, "sysCurTimeBySecond=" + PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond)
		info.accelerateCount = msg.accelerateCount;
		info.stolenCount = msg.stolenCount;
		info.stolenList = msg.stolenUsers;
		info.outputCount = msg.rewardCount;
		info.isGrassP1 = msg.isGrassParam1;
		info.isGrassP2 = msg.isGrassParam2;
		info.isWormP1 = msg.isWormParam1;
		info.isWormP2 = msg.isWormParam2;
		info.operBack = msg.opType;
		info.resultBack = msg.result;
		info.commitChanges();
		return info;
	}

	private updateFriendFarmStateInfo(curSelectedFarm: FarmInfo) {
		var canFeed: boolean = false;
		for (const key in curSelectedFarm.getPetLandList()) {
			if (Object.prototype.hasOwnProperty.call(curSelectedFarm.getPetLandList(), key)) {
				const petInfo = curSelectedFarm.getPetLandList()[key];
				if (petInfo.canFeed()) {
					canFeed = true;
				}
			}
		}

		var fsInfo: FriendFarmStateInfo = FarmManager.Instance.model.getFarmStateInfo(curSelectedFarm.userId);
		if (fsInfo) {
			fsInfo.beginChanges();
			fsInfo.canFeed = canFeed;
			fsInfo.commitChanges();
		}
	}

	/**
	 * 是否在挂机房的判断 
	 * @return 
	 * 
	 */
	private inSpecialCampaign(): boolean {
		if (SceneManager.Instance.currentType == SceneType.CAMPAIGN_MAP_SCENE) {
			if (CampaignManager.Instance.mapModel) {
				var mapId: number = CampaignManager.Instance.mapModel.mapId;
				if (WorldBossHelper.checkHoodRoom(mapId) || WorldBossHelper.checkPetLand(mapId) || WorldBossHelper.checkMineral(mapId)) {
					return true;
				}
			}
		}
		return false;
	}

	private inCastle(): boolean {
		return SceneManager.Instance.currentType == SceneType.CASTLE_SCENE;
	}

	private inSpace(): boolean {
		return SceneManager.Instance.currentType == SceneType.SPACE_SCENE;
	}
	private inOuterCity(): boolean {
		return SceneManager.Instance.currentType == SceneType.OUTER_CITY_SCENE;
	}

	/**
	 * 农场收获提示（右下角弹窗） 
	 * 内城和挂机房场景提示
	 */
	private __timeUpdateHandler(e: PlayerEvent) {
		// var tip: TipMessageData;

		if (this.thane.grades >= OpenGrades.FARM) {
			if (this.inCastle() ||
				this.inOuterCity() ||
				this.inSpecialCampaign() ||
				this.inSpace()) {


				let mainBar = HomeWnd.Instance.getMainToolBar()
				if (mainBar) {
					let b = this.checkHasPick || this.checkHasPickTree || this.checkExistEmptyLand(this.model.myFarm) || this.checkExistDie(this.model.myFarm);
					mainBar.updateFarmRedPoint(b);
				}


				// if (this.checkHasPick) {
				// 	if (this._needTipNext) {
				// 		tip = new TipMessageData();
				// 		tip.title = LangManager.Instance.GetTranslation("public.prompt");
				// 		tip.type = TipMessageData.FARM_CAN_PICK;
				// 		tip.content = LangManager.Instance.GetTranslation("tasktracetip.view.CanPickTipView.farmContent");
				// 		TaskTraceTipManager.Instance.showView(tip);
				// 		this._needTipNext = false;
				// 	}
				// }
				// else if (this.checkHasPickPet) {
				// if (this._needTipNext) {
				// 	tip = new TipMessageData();
				// 	tip.title = LangManager.Instance.GetTranslation("public.prompt");
				// 	tip.type = TipMessageData.FARM_CAN_PICK;
				// 	tip.content = LangManager.Instance.GetTranslation("FarmCanPickTipView.canPickupPet");
				// 	TaskTraceTipManager.Instance.showView(tip);
				// 	this._needTipNext = false;
				// }
				// }
				// else {
				// 	this._needTipNext = true;
				// }
			}
		}
	}

	private get thane(): ThaneInfo {
		return ArmyManager.Instance.thane;
	}

	private get waterManager(): WaterManager {
		return WaterManager.Instance;
	}



	////////////////////////////////////////////////////////////////////  协议发送
	/**
	 * 发送请求农场信息
	 *  @param  userId:请求农场的玩家ID
	 * return S2CProtocol.U_C_FARM_INFO
	 */
	public sendReqFarmInfo(userId: number) {
		var msg: FarmOperReqMsg = new FarmOperReqMsg();
		msg.opType = FarmOperateType.REQ_FARM;
		msg.friendId = userId;
		SocketManager.Instance.send(C2SProtocol.CH_FARM_OPER_CHECK, msg);
	}

	/**
	 * 发送农场操作 
	 * @param userId  被操作用户ID
	 * @param oper  FarmOperateType 操作类型（1:种植 2:除草 3:除虫 ）
	 * @param pos  农田位置     (宠物位置)
	 * @param bagPos 背包位置 (宠物id)
	 * @param seedId  种子模板ID
	 * return S2CProtocol.U_C_FARMLAND_INFO
	 */
	public sendFarmOper(userId: number, oper: number, pos: number, bagPos: number = 0, seedId: number = 0, useBind: boolean = true) {
		var msg: FarmOperReqMsg = new FarmOperReqMsg();
		msg.friendId = userId;
		msg.opType = oper;
		msg.pos = pos;
		msg.bagPos = bagPos;
		msg.templateId = seedId;
		msg.payType = 0;
		if (!useBind) {
			msg.payType = 1;
		}
		SocketManager.Instance.send(C2SProtocol.CH_FARM_OPER_CHECK, msg);
	}

	/**
	 * 请求好友农场状态  返回U_C_CANWATER_USERS
	 * @param list 好友ID列表（存放好友ID）
	 */
	public reqFriendFarmState(list: number[]) {
		if (!list || list.length == 0) return;
		let msg: FriendUserIdsMsg = new FriendUserIdsMsg();
		msg.friendId = list;
		SocketManager.Instance.send(C2SProtocol.C_REQ_FRIEND_FARM_STATE, msg);
	}


	public reqFriendStateInfo() {
		let infoList = this.friendThaneInfoList;
		let idArr: number[] = [];
		infoList.forEach((info: ThaneInfo) => {
			idArr.push(info.userId)
		});
		FarmManager.Instance.reqFriendFarmState(idArr);
	}

	public get friendThaneInfoList(): ThaneInfo[] {
		let tmp = FriendManager.getInstance().getListForFarmFriend();
		return this.filterByTree(tmp);
	}

	private filterByTree(list: ThaneInfo[]): ThaneInfo[] {
		var arr: ThaneInfo[] = [];
		list.forEach((thane: ThaneInfo) => {
			if (thane.grades >= 11) {
				arr.push(thane);
			}
		})
		return arr;
	}

	////////////////////////////////////////////////////////////////////  公开接口
	/**
	 * 是否有可收获
	 */
	public get checkHasPick(): boolean {
		var myFarm: FarmInfo = this.model.myFarm;
		if (!myFarm) return false;
		let landlist = myFarm.getLandList()
		for (const key in landlist) {
			if (Object.prototype.hasOwnProperty.call(landlist, key)) {
				const land = landlist[key];
				if (land.canPick) return true;
			}
		}
		return false;
	}

	public get checkHasPickPet(): boolean {
		var myFarm: FarmInfo = this.model.myFarm;
		if (!myFarm) return false;
		var list: any[] = myFarm.getPetLandList();
		for (const key in list) {
			if (Object.prototype.hasOwnProperty.call(list, key)) {
				const petland = list[key];
				if (petland.canGains()) return true;
			}
		}
		return false;
	}

	public get checkHasPickTree() {
		var treeInfo: TreeInfo = WaterManager.Instance.treeList[this.thane.userId];
		if (treeInfo && treeInfo.left_pickTime <= 0 && treeInfo.canPick) {
			return true
		}
	}

	/**
	 * 检查是否有种植特殊作物
	 */
	public checkExistSpecialCrop(fInfo: FarmInfo): boolean {
		if (!fInfo) return false;
		let list = fInfo.getLandList();
		for (const key in list) {
			if (Object.prototype.hasOwnProperty.call(list, key)) {
				const land = list[key];
				if (land.hasCrop && land.cropTemp && land.cropTemp.Property5 > 0) return true;
			}
		}
		return false;
	}

	/**
	 * 检查是否存在相同特殊作物
	 */
	public checkExistSameSpecialCrop(gtemp: t_s_itemtemplateData, fInfo: FarmInfo): boolean {
		if (!fInfo || !gtemp) return false;
		let list = fInfo.getLandList();
		for (let key in list) {
			if (Object.prototype.hasOwnProperty.call(list, key)) {
				let land = list[key];
				if (land.hasCrop && land.cropTemp && land.cropTemp.Property5 > 0 && land.cropTemp.Property5 == gtemp.Property5) return true;
			}
		}
		return false;
	}

	/**
	 * 检查是否存在空田
	 */
	public checkExistEmptyLand(fInfo: FarmInfo): boolean {
		if (!fInfo) return false;
		let list = fInfo.getLandList();
		for (let key in list) {
			if (Object.prototype.hasOwnProperty.call(list, key)) {
				let land = list[key];
				if (!land.hasCrop) return true;
			}
		}
		return false;
	}
	/**
	 * 检查是否存在枯萎
	 */
	public checkExistDie(fInfo: FarmInfo): boolean {
		if (!fInfo) return false;
		let list = fInfo.getLandList();
		for (let key in list) {
			if (Object.prototype.hasOwnProperty.call(list, key)) {
				let land = list[key];
				if (land.isDie) return true;
			}
		}
		return false;
	}

	/**
	 * 检查是否存在指定类型的可操作
	 */
	public checkHasOperNow(land: FarmLandInfo, opType: number): boolean {
		if (!land) return false;
		var b: boolean = false;
		switch (opType) {
			case FarmOperateType.STEAL:
				if (land.isMature && land.canBeStolen == "") b = true;
				break;
			case FarmOperateType.REVIVE:
				if (land.isDie) b = true;
				break;
			case FarmOperateType.WORM:
				if (land.isWormNow) b = true;
				break;
			case FarmOperateType.WEED:
				if (land.isGrassNow) b = true;
				break;
		}
		return b;
	}

	/**
	 * 更新好友列表农场状态
	 */
	public updateFarmStateByType(userId: number, type: number, value: boolean) {
		var fsInfo: FriendFarmStateInfo = this.model.getFarmStateInfo(userId);
		fsInfo.beginChanges();
		switch (type) {
			case FarmOperateType.STEAL:
				fsInfo.canSteal = value;
				break;
			case FarmOperateType.REVIVE:
				fsInfo.canRevive = value;
				break;
			case FarmOperateType.WORM:
				fsInfo.canWorm = value;
				break;
			case FarmOperateType.WEED:
				fsInfo.canWeed = value;
				break;
		}
		fsInfo.commitChanges();
	}

	/**
	 * 添加农场操作聊天栏提示
	 * @param type  1:自己对自己农场的操作, 2:自己对他人农场的操作
	 * @param othersId  他人ID
	 * @param othersName  他人昵称
	 * @param cropName  作物名
	 * @param addExp  增加经验
	 * 
	 */
	public addChatTip(type: number, oper: number, othersId: number, othersName: string, cropName: string, addExp: number) {
		var str: string = "";
		var expAddStr: string = (addExp > 0 ? LangManager.Instance.GetTranslation("farm.FarmManager.expAddTip", addExp) : "");
		switch (type) {
			case 1:
				switch (oper) {
					case FarmOperateType.WORM:
						str = LangManager.Instance.GetTranslation("farm.FarmManager.wormTip1", expAddStr);
						break;
					case FarmOperateType.WEED:
						str = LangManager.Instance.GetTranslation("farm.FarmManager.weedTip1", expAddStr);
						break;
				}
				break;
			case 2:
				var oName: string;
				var consortiaId: number = 0;
				var fInfo: ThaneInfo = FriendManager.getInstance().getFriendById(othersId);
				if (fInfo) {
					oName = fInfo.nickName;
					consortiaId = fInfo.consortiaID;
				}
				else {
					oName = "";
					consortiaId = 0;
				}
				oName = "<a t='1' id='" + othersId + "'" + " name='" + oName + "'" + " consortiaId='" + consortiaId + "'/>";
				switch (oper) {
					case FarmOperateType.WORM:
						str = LangManager.Instance.GetTranslation("farm.FarmManager.wormTip2", expAddStr);
						break;
					case FarmOperateType.WEED:
						str = LangManager.Instance.GetTranslation("farm.FarmManager.weedTip2", expAddStr);
						break;
					case FarmOperateType.REVIVE:
						str = LangManager.Instance.GetTranslation("farm.FarmManager.reviveTip2", expAddStr);
						break;
				}
				break;
		}
		if (str == "") return;
		MessageTipManager.Instance.show(str)
		//@ts-ignore
		var chatData: ChatData = new ChatData();
		chatData.channel = ChatChannel.INFO;
		chatData.msg = str;
		chatData.commit();
		NotificationManager.Instance.sendNotification(ChatEvent.ADD_CHAT, chatData);
	}

	///////////////////////////////////////////////////////////////////  窗口操作

	/**
	 * 进入农场
	 */
	public enterFarm() {
		FrameCtrlManager.Instance.open(EmWindow.Farm);
		// if (!FarmModel.OPEN) {
		// 	MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("castle.view.CastleBuildingView.command21"));
		// 	return;
		// }
		// LoadingSceneWnd.Instance.Show();
		// this.loadFarmRes();
	}

	/**
	 * 离开农场  在离开农场场景释放资源
	 */
	public exitFarm() {
		let preScene: string = SceneManager.Instance.preSceneType;
		// if (SwitchPageHelp.returnScene == SceneType.SPACE_SCENE && FarmManager.Instance.model.needReturnSpace) {
		// 	SwitchPageHelp.enterToSpace();
		// }
		// else {
		// 	SwitchPageHelp.returnToSpace();
		// }

		// if (this.returnScene == SceneType.SPACE_SCENE && SpaceManager.Instance.exit) {
		// 	return;
		// }
		SceneManager.Instance.setScene(preScene);

	}

	public loadFarmRes() {
		ResMgr.Instance.loadFairyGui(EmPackName.Farm, this.__enterFarmComplete.bind(this), this.__enterFarmProgress.bind(this));
	}

	public releaseFarmRes() {
		ResMgr.Instance.releaseFairyGui(EmPackName.Farm)
	}

	public __enterFarmComplete(res) {
		LoadingSceneWnd.Instance.Hide();
		if (res && res.length > 0) {
			SceneManager.Instance.setScene(SceneType.FARM);
		}
	}

	public __enterFarmProgress(prog: number) {
		let totalCnt = 2;
		let per = 1 / totalCnt;
		let str = Math.floor(prog / per) + "/" + totalCnt;
		LoadingSceneWnd.Instance.update(prog * 100, str, true);
	}

	/**
	 * 打开农场背包
	 */
	public openBagFrame() {
		if (this.showingBag) return;
		let ctrl = FrameCtrlManager.Instance.getCtrl(EmWindow.Farm) as FarmCtrl
		let wnd = ctrl.view as FarmWnd
		if (!wnd) return
		wnd.showBag();
		this.showingBag = true
	}

	/**
	 * 关闭农场背包
	 */
	public closeBagFrame() {
		// if (!this.showingBag) return;
		// let ctrl = FrameCtrlManager.Instance.getCtrl(EmWindow.Farm) as FarmCtrl
		// let wnd = ctrl.view as FarmWnd
		// if (!wnd) return
		// wnd.cShowBag.selectedIndex = 0
		// this.showingBag = false
	}

	/**
	 * 打开农场好友
	 */
	public openFriendListFrame() {
		let ctrl = FrameCtrlManager.Instance.getCtrl(EmWindow.Farm) as FarmCtrl
		let wnd = ctrl.view as FarmWnd
		if (!wnd) return
		// wnd.cShowFriend.selectedIndex = 1
		this.showingBag = true
	}

	/**
	 * 关闭农场好友
	 */
	public closeFriendListFrame() {
		let ctrl = FrameCtrlManager.Instance.getCtrl(EmWindow.Farm) as FarmCtrl
		let wnd = ctrl.view as FarmWnd
		if (!wnd) return
		// wnd.cShowFriend.selectedIndex = 0
		this.showingBag = false
	}


	/**
	 * 打开农场商店
	 */
	public openShopFrame() {
		FrameCtrlManager.Instance.open(EmWindow.FarmShopWnd);
	}

	public checkIsPartice(petId: number): boolean {
		var farmInfo: FarmInfo = this._model.myFarm;
		if (!farmInfo) return false;
		let list = farmInfo.getPetLandList();
		for (const key in list) {
			if (Object.prototype.hasOwnProperty.call(list, key)) {
				const petland = list[key];
				if (petland.petId == petId) {
					return true;
				}
			}
		}
		return false;
	}

	public checkIsDefenser(petId: number): boolean {
		if (!this._model.myFarm) return false;
		var petland: PetLandInfo = this._model.myFarm.defender;
		if (petland) {
			return petland.petId == petId;
		}
		return false;
	}

	/**
	 * 如果有可收获的 则弹出右下提示 
	 * 
	 */
	// public showGatherCropTip() {
	// 	var tipData: TipMessageData;
	// 	if (this.checkHasPick) {
	// 		tipData = new TipMessageData();
	// 		tipData.title = LangManager.Instance.GetTranslation("public.prompt");
	// 		tipData.type = TipMessageData.FARM_CAN_PICK;
	// 		TaskTraceTipManager.Instance.showView(tipData);
	// 	}
	// 	else if (this.checkHasPickPet) {
	// 		tipData = new TipMessageData();
	// 		tipData.title = LangManager.Instance.GetTranslation("public.prompt");
	// 		tipData.type = TipMessageData.FARM_CAN_PICK;
	// 		tipData.content = LangManager.Instance.GetTranslation("FarmCanPickTipView.canPickupPet");
	// 		TaskTraceTipManager.Instance.showView(tipData);
	// 	}
	// 	else {
	// 		var treeInfo: TreeInfo = WaterManager.Instance.treeList[this.thane.userId];
	// 		if (treeInfo && treeInfo.left_pickTime <= 0 && treeInfo.canPick) {
	// 			tipData = new TipMessageData();
	// 			tipData.title = LangManager.Instance.GetTranslation("public.prompt");
	// 			tipData.type = TipMessageData.TREE_CAN_PICK;
	// 			TaskTraceTipManager.Instance.showView(tipData);
	// 		}
	// 	}
	// }
}