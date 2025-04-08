// @ts-nocheck
import GameEventDispatcher from '../../core/event/GameEventDispatcher';
import Logger from '../../core/logger/Logger';
import { PackageIn } from '../../core/net/PackageIn';
import { PackageOut } from '../../core/net/PackageOut';
import { ServerDataManager } from '../../core/net/ServerDataManager';
import { SocketManager } from '../../core/net/SocketManager';
import { DateFormatter } from '../../core/utils/DateFormatter';
import Dictionary from '../../core/utils/Dictionary';
import StringHelper from '../../core/utils/StringHelper';
import { WaterEvent } from '../constant/event/NotificationEvent';
import { PlayerEvent } from '../constant/event/PlayerEvent';
import { C2SProtocol } from '../constant/protocol/C2SProtocol';
import { S2CProtocol } from '../constant/protocol/S2CProtocol';
import { ThaneInfo } from '../datas/playerinfo/ThaneInfo';
import { FarmModel } from '../module/farm/data/FarmModel';
import FriendFarmStateInfo from '../module/farm/data/FriendFarmStateInfo';
import { TreeInfo } from '../module/farm/data/TreeInfo';
import { WaterLogInfo } from '../module/farm/data/WaterLogInfo';
import { WaterTreeModel } from '../module/farm/data/WaterTreeModel';
import { ArmyManager } from './ArmyManager';
import { FarmManager } from './FarmManager';
import { FriendManager } from './FriendManager';

import FriendTreeRsp = com.road.yishi.proto.farm.FriendTreeRsp;
import FarmLogRsp = com.road.yishi.proto.farm.FarmLogRsp;
import TreeUpdateRsp = com.road.yishi.proto.farm.TreeUpdateRsp;
import TreeInfoMsg = com.road.yishi.proto.farm.TreeInfoMsg;
import FriendTreeReq = com.road.yishi.proto.farm.FriendTreeReq;

export class WaterManager extends GameEventDispatcher {

	private static _Instance: WaterManager;

	public static get Instance(): WaterManager {
		if (!this._Instance) this._Instance = new WaterManager();
		return this._Instance;
	}

	private _model: WaterTreeModel;
	public get model(): WaterTreeModel {
		return this._model;
	}

	private _logList: WaterLogInfo[];
	public get logList(): WaterLogInfo[] {
		return this._logList;
	}

	public treeList: Dictionary;

	public setup() {
		if (!this._model) this._model = new WaterTreeModel();
		this.treeList = new Dictionary();
		this._logList = [];
		this.initEvent();
	}

	public setupList(list: WaterLogInfo[]) {
		if (list) this._logList = list;
		this._logList.sort((a, b) => { return b.time.getTime() - a.time.getTime() });
	}

	public get thane(): ThaneInfo {
		return ArmyManager.Instance.thane;
	}

	private initEvent() {
		ServerDataManager.listen(S2CProtocol.U_C_TREE_FRIEND, this, this.__getTreeInfoHandler);
		ServerDataManager.listen(S2CProtocol.U_C_WATERLOG_SEND, this, this.__logUpdateHandler);
		ServerDataManager.listen(S2CProtocol.U_C_TREEINFO_UPDATE, this, this.__treeInfoUpdateHandler);
		ServerDataManager.listen(S2CProtocol.U_C_SEND_WATER_RESULT, this, this.__waterStateHandler);
		this.thane.on(PlayerEvent.THANE_LEVEL_UPDATE, this.__levelUpgradeHandler, this);
	}

	private __levelUpgradeHandler(evt: PlayerEvent) {
		if (this.thane.preGrade < 11 && this.thane.grades >= 11) {
			this.sendGetTreeInfoById(this.thane.userId);

		}
	}
	/**
	 * 获取指定玩家的树的信息 
	 * @param e
	 * 
	 */
	private __getTreeInfoHandler(pkg: PackageIn) {
		var msg = pkg.readBody(FriendTreeRsp) as FriendTreeRsp;
		if (msg.treeInfo.length > 0) {
			for (const key in msg.treeInfo) {
				let tinfo = msg.treeInfo[key];
				var info: TreeInfo = this.treeList[tinfo.userId];
				if (!info) {
					info = new TreeInfo();
					this.treeList[tinfo.userId] = info;
				}
				info.userId = tinfo.userId;
				info.nickName = tinfo.nickName;
				info.waterCount = tinfo.waterCount;
				info.fruitCount = tinfo.fruitCount;
				info.isFirstFruit = tinfo.isFirstFruit;
				info.nextPickTime = DateFormatter.parse(tinfo.nextPickTime, "YYYY-MM-DD hh:mm:ss");
				info.lastWaterTime = DateFormatter.parse(tinfo.lastWaterTime, "YYYY-MM-DD hh:mm:ss");
				info.property1 = tinfo.property1;
				info.property2 = tinfo.property2;
				info.notHasTree = false;
				if (StringHelper.isNullOrEmpty(info.nickName)) {
					var thaneInfo: ThaneInfo = FriendManager.getInstance().getFriendById(info.userId);
					if (thaneInfo)
						info.nickName = thaneInfo.nickName;
					else
						info.nickName = "";
				}
				if (info.userId == this.thane.userId) {
					info.todayCanWater = tinfo.canWater;
					info.timeLeft = tinfo.leftTime;
					info.leftpickTime = tinfo.leftPickTime;
					this.dispatchEvent(WaterEvent.CREATE_TREE, null);
				}
				// Logger.xjy("[WaterManager]readTreeInfoMsg", info.userId == this.thane.userId, info)
				this.dispatchEvent(WaterEvent.TREE_UPDATE, info);
			}
		}
	}
	/**
	 * 浇水日志 
	 * @param e
	 * 
	 */
	private __logUpdateHandler(pkg: PackageIn) {//0x0091
		let msg = pkg.readBody(FarmLogRsp) as FarmLogRsp;
		var info: WaterLogInfo = new WaterLogInfo();
		info.type = msg.type;
		info.userId = msg.playerId;
		info.waterUserId = msg.operUserId;
		info.nickName = msg.operNickName;
		info.actionDes = msg.desc;
		info.time = DateFormatter.parse(msg.operDate, "YYYY-MM-DD hh:mm:ss");
		this.addLog(info);
	}
	/**
	 * 更新树的信息 
	 * @param e
	 * 
	 */
	private __treeInfoUpdateHandler(pkg: PackageIn) {//0x0093
		var msg = pkg.readBody(TreeUpdateRsp) as TreeUpdateRsp;
		for (var i: number = 0; i < msg.tree.length; i++) {
			var treeInfo: TreeInfoMsg = msg.tree[i] as TreeInfoMsg;
			var info: TreeInfo = this.treeList[treeInfo.userId] as TreeInfo;
			if (!info) {
				info = new TreeInfo();
				this.treeList[treeInfo.userId] = info;
			}
			info.userId = treeInfo.userId;
			info.nickName = treeInfo.nickName;
			info.waterCount = treeInfo.waterCount;
			info.fruitCount = treeInfo.fruitCount;
			info.isFirstFruit = treeInfo.isFirstFruit;
			info.nextPickTime = DateFormatter.parse(treeInfo.nextPickTime, "YYYY-MM-DD hh:mm:ss");
			info.lastWaterTime = DateFormatter.parse(treeInfo.lastWaterTime, "YYYY-MM-DD hh:mm:ss");
			info.property1 = treeInfo.property1;
			info.property2 = treeInfo.property2;
			if (info.userId == this.thane.userId) {
				info.todayCanWater = treeInfo.canWater;
				info.timeLeft = treeInfo.leftTime;
				info.leftpickTime = treeInfo.leftPickTime;
				Logger.xjy("[FarmManager]__treeInfoUpdateHandler", info.timeLeft, info.leftpickTime, info)
			}
			this.dispatchEvent(WaterEvent.TREE_UPDATE, info);
		}
	}

	// 超过今日浇水次数派发
	private __waterStateHandler(pkg: PackageIn) {
		let msg = pkg.readBody(FarmLogRsp) as FarmLogRsp;
		Logger.xjy("[WaterManager]__waterStateHandler", msg)
		var userId: number = msg.playerId;
		var waterId: number = msg.operUserId;
		if (userId == this.thane.userId) {
			Logger.xjy("[WaterManager]__waterStateHandler 更新自己神树状态 canGivePower=false", waterId)
			var fsInfo: FriendFarmStateInfo = this.farmModel.getFarmStateInfo(waterId);
			fsInfo.beginChanges();
			fsInfo.canGivePower = false;
			fsInfo.commitChanges();
			this.dispatchEvent(WaterEvent.UPDATA_WATER_STATE, waterId);
		}
	}

	public addLog(info: WaterLogInfo) {
		this._logList.push(info);
		// this._logList.sort((a, b) => {
		// 	return 0;
		// })
		this._logList.sort((a, b) => { return b.time.getTime() - a.time.getTime() });
		this.dispatchEvent(WaterEvent.WATER_LOG_UPDATE, null);
	}

	/**
	 * 领主11级出现农场
	 * @param id: 领主ID
	 */
	public sendGetTreeInfoById(id: number) {
		var pkg: PackageOut = new PackageOut(C2SProtocol.C_TREE_FRIEND);
		var msg: FriendTreeReq = new FriendTreeReq();
		msg.friendId = [id];
		SocketManager.Instance.send(C2SProtocol.C_TREE_FRIEND, msg);
	}

	////////////////////////////////////////////////////////////
	// 超过今日浇水次数则不能浇水
	public canGivePower(userId: number): boolean {
		return this.farmModel.getFarmStateInfo(userId).canGivePower;
	}

	private get farmModel(): FarmModel {
		return FarmManager.Instance.model;
	}

}