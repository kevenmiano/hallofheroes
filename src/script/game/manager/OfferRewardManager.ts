import GameEventDispatcher from '../../core/event/GameEventDispatcher';
import { PackageIn } from '../../core/net/PackageIn';
import { PackageOut } from '../../core/net/PackageOut';
import { ServerDataManager } from '../../core/net/ServerDataManager';
import { SocketManager } from '../../core/net/SocketManager';
import { DateFormatter } from '../../core/utils/DateFormatter';
import { SimpleDictionary } from '../../core/utils/SimpleDictionary';
import { SLGSocketEvent, RewardEvent } from '../constant/event/NotificationEvent';
import { S2CProtocol } from '../constant/protocol/S2CProtocol';
import { ThaneInfo } from '../datas/playerinfo/ThaneInfo';
import BaseOfferReward from '../module/offerReward/BaseOfferReward';
import OfferRewardTemplate from '../module/offerReward/OfferRewardTemplate';
import { OfferRewardModel } from '../mvc/model/OfferRewardModel';
import { ArmyManager } from './ArmyManager';
import { PlayerManager } from './PlayerManager';
import RewardCountUpdateRspMsg = com.road.yishi.proto.player.RewardCountUpdateRspMsg;
import RewardAddedMsg = com.road.yishi.proto.reward.RewardAddedMsg;
import RewardArrestMsg = com.road.yishi.proto.reward.RewardArrestMsg;
import RewardFinishedReqMsg = com.road.yishi.proto.reward.RewardFinishedReqMsg;
import RewardFreshReqMsg = com.road.yishi.proto.reward.RewardFreshReqMsg;
import RewardFreshRspMsg = com.road.yishi.proto.reward.RewardFreshRspMsg;
import RewardInfo = com.road.yishi.proto.reward.RewardInfo;
import RewardRemovedMsg = com.road.yishi.proto.reward.RewardRemovedMsg;
import RewardUpdatedRspMsg = com.road.yishi.proto.reward.RewardUpdatedRspMsg;
import RewardDetails = com.road.yishi.proto.reward.RewardDetails;
import { C2SProtocol } from '../constant/protocol/C2SProtocol';
import RingTaskManager from './RingTaskManager';
import DayGuideManager from './DayGuideManager';
import UIManager from '../../core/ui/UIManager';
import { EmWindow } from '../constant/UIDefine';
import { SceneManager } from '../map/scene/SceneManager';
import { SceneScene } from '../map/outercity/path/SceneScene';
import SceneType from '../map/scene/SceneType';
export default class OfferRewardManager extends GameEventDispatcher {
	private static _instance: OfferRewardManager;
	public static get Instance(): OfferRewardManager {
		if (!OfferRewardManager._instance) OfferRewardManager._instance = new OfferRewardManager();
		return OfferRewardManager._instance;
	}

	private _model: OfferRewardModel;
	public get model(): OfferRewardModel {
		if (!this._model) this._model = new OfferRewardModel();
		return this._model;
	}

	constructor() {
		super();
	}

	public setup() {
		this.addEvent();
	}

	private addEvent() {
		ServerDataManager.listen(S2CProtocol.U_C_REWARD_UPDATE, this, this.__updateRewardHandler);
		ServerDataManager.listen(S2CProtocol.U_C_REWARD_FRESH, this, this.__refreshRewardListHandler);
		ServerDataManager.listen(S2CProtocol.U_C_REWARD_COUNT, this, this.__updateRewardCountHandler);
	}

	private __updateRewardCountHandler(pkg: PackageIn) {
		let msg: RewardCountUpdateRspMsg = pkg.readBody(RewardCountUpdateRspMsg) as RewardCountUpdateRspMsg;
		this.model.maxRewardCount = OfferRewardModel.BASE_REWARD_COUNT + msg.rewardCount;
		DayGuideManager.Instance.maxRewardCount = this.model.maxRewardCount;//改变日常活动中的悬赏总次数
	}

	private __updateRewardHandler(pkg: PackageIn) {
		let msg: RewardUpdatedRspMsg = pkg.readBody(RewardUpdatedRspMsg) as RewardUpdatedRspMsg;
		let rewardLength: number = msg.reward.length;
		for (let i: number = 0; i < rewardLength; i++) {
			let rewardInfo: RewardInfo = <RewardInfo>msg.reward[i];
			let finishReward: BaseOfferReward;
			if (rewardInfo && rewardInfo.isSelect) {
				if (this.model.baseRewardDic[rewardInfo.templateId]) {
					finishReward = this.model.baseRewardDic[rewardInfo.templateId];
					if (rewardInfo.isComplete) {
						// TaskGainMovie.taskMovie(finishReward);//滚动显示奖励
						if (finishReward) finishReward.removeConditionListener();
						this.model.baseRewardDic.del(rewardInfo.templateId);
						this.dispatchEvent(RewardEvent.REWARD_TASK_FINISH, finishReward);
					}
					else {
						finishReward.changeDate = PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond;
						this.model.baseRewardDic[rewardInfo.templateId].rewardInfo = rewardInfo;
						this.dispatchEvent(RewardEvent.REWARD_TASK_UPDATE, this.model.baseRewardDic[rewardInfo.templateId]);
					}
				}
				else {
					let baseReward: BaseOfferReward = new BaseOfferReward();
					baseReward.rewardID = rewardInfo.templateId;
					baseReward.rewardInfo = rewardInfo;
					baseReward.rewardTemp = this.getRewardTempByTempId(rewardInfo.templateId);

					this.model.baseRewardDic.add(rewardInfo.templateId, baseReward);
					baseReward.addConditionListener();
					baseReward.changeDate = PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond;
					this.dispatchEvent(RewardEvent.REWARD_TASK_ADD, baseReward);
					this.dispatchEvent(RewardEvent.REWARD_TASK_UPDATE, baseReward);
					if (!OfferRewardModel.isLogin) {
						// DelayActionsUtils.Instance.addAction(new NewTaskAction(baseReward));
					}
				}
			}
		}
		OfferRewardModel.isLogin = false;
	}

	private __refreshRewardListHandler(pkg: PackageIn) {
		let msg: RewardFreshRspMsg = pkg.readBody(RewardFreshRspMsg) as RewardFreshRspMsg;
		this.model.lastRefreshRewardListDate = DateFormatter.parse(msg.rewardLastdate, "YYYY-MM-DD hh:mm:ss");
		let tempTaskDic: SimpleDictionary = new SimpleDictionary();
		let tempStateDic: SimpleDictionary = new SimpleDictionary();
		let tempProfileDic: SimpleDictionary = new SimpleDictionary();
		let tempRewardTaskIndex: SimpleDictionary = new SimpleDictionary();
		let rewardDetails: RewardDetails = msg.additionalReward as RewardDetails;
		if (rewardDetails) {
			let offerRewardTemplate: OfferRewardTemplate = this.getRewardTempByTempId(rewardDetails.id);
			tempTaskDic.add(0, offerRewardTemplate);
			tempStateDic.add(0, rewardDetails.isValid);
			tempProfileDic.add(0, rewardDetails.quality);
			tempRewardTaskIndex.add(0,-1);
			for (let i: number = 0; i < msg.templateId.length; i++) {
				tempTaskDic.add(i+1, this.getRewardTempByTempId(msg.templateId[i]));
				tempStateDic.add(i+1, msg.isIsValid[i]);
				tempProfileDic.add(i+1, msg.qualitys[i]);
				tempRewardTaskIndex.add(i+1,i);
			}
		}
		else {
			for (let i: number = 0; i < msg.templateId.length; i++) {
				tempTaskDic.add(i, this.getRewardTempByTempId(msg.templateId[i]));
				tempStateDic.add(i, msg.isIsValid[i]);
				tempProfileDic.add(i, msg.qualitys[i]);
				tempRewardTaskIndex.add(i, i);
			}
		}
		this.model.offerRewardTaskDic = tempTaskDic;
		this.model.offerRewardTaskStateDic = tempStateDic;
		this.model.offerRewardTaskProfileDic = tempProfileDic;
		this.model.offerRewardTaskIndex = tempRewardTaskIndex;
		this.model.freeRefreshCount = msg.freeTimes;
		this.thane.rewardCount = msg.rewardTimes;
		if (this.model.isNeedReset) this.model.isNeedReset = false;
		this.dispatchEvent(RewardEvent.OFFER_REWARD_LIST_REFRESH, null);
		if(!UIManager.Instance.isShowing(EmWindow.OfferRewardWnd) && SceneManager.Instance.currentType != SceneType.BATTLE_SCENE){
			UIManager.Instance.ShowWind(EmWindow.OfferRewardWnd);
		}
	}

	private get thane(): ThaneInfo {
		return ArmyManager.Instance.thane;
	}

	/**
	 *通过模板ID取得悬赏任务模板 
	 * @param tempId
	 * @return 
	 * 
	 */
	public getRewardTempByTempId(tempId: number): OfferRewardTemplate {
		let allReward = RingTaskManager.Instance.allReward;
		for (let key in allReward) {
			if (Object.hasOwnProperty.call(allReward, key)) {
				let temp: OfferRewardTemplate = allReward[key];
				if (temp.TemplateId == tempId) return temp;
			}
		}
		return null;
	}

	/**
	 *判断悬赏任务是否存在 
	 * @param rewardId  悬赏任务ID
	 * @return 
	 */
	public checkRewardExist(rewardId: number): boolean {
		return this.model.baseRewardDic[rewardId];
	}

	public get completedRewardList(): any[] {
		let arr: any[] = [];
		for (let key in this.model.baseRewardDic) {
			if (Object.prototype.hasOwnProperty.call(this.model.baseRewardDic, key)) {
				let reward: BaseOfferReward = this.model.baseRewardDic[key];
				if (reward.isCompleted)
					arr.push(reward);
			}
		}
		return arr;
	}

	////////////////////////////////////////////////////////////////////  协议发送
	/**
	 *发送添加悬赏任务 
	 * @param rewardPos 任务位置
	 * 
	 */
	public sendAddRewardTask(rewardPos: number) {
		let msg: RewardAddedMsg = new RewardAddedMsg();
		msg.rewardId = rewardPos;
		SocketManager.Instance.send(C2SProtocol.C_REWARD_ADD, msg);
	}

	/**
	 *发送放弃悬赏任务 
	 * @param rewardTempID 任务ID
	 * 
	 */
	public sendRemoveRewardTask(rewardId: number) {
		let msg: RewardRemovedMsg = new RewardRemovedMsg();
		msg.templateId = rewardId;
		SocketManager.Instance.send(C2SProtocol.C_REWARD_REMOVE, msg);
	}

	/**
	 *发送悬赏任务完成 
	 * @param rewardId
	 * 
	 */
	public sendFinishRewardTask(rewardId: number, isQuickComplete: boolean = false) {
		let msg: RewardFinishedReqMsg = new RewardFinishedReqMsg();
		msg.templateId = rewardId;
		msg.isPass = isQuickComplete;
		SocketManager.Instance.send(C2SProtocol.C_REWARD_FINISH, msg);
	}

	/**
	 *发送刷新悬赏列表 
	 * @param isManual  是否手动点按钮刷新
	 * 
	 */
	public sendRefreshRewardList(isManual: boolean, useBind: boolean) {
		let msg: RewardFreshReqMsg = new RewardFreshReqMsg();
		msg.isButton = isManual;
		msg.payType = 0;
		if (!useBind) {
			msg.payType = 1;
		}
		SocketManager.Instance.send(C2SProtocol.C_REWARD_FRESH, msg);
	}

	/**
	 *悬赏缉捕 
	 * @param conditionType  悬赏条件类型（见RewardConditionType）
	 * @param targetId  缉捕目标ID 
	 * 
	 */
	public sendRewardArrest(conditionType: number, targetId: number) {
		let msg: RewardArrestMsg = new RewardArrestMsg();
		msg.condictionType = conditionType;
		msg.param1 = targetId;
		SocketManager.Instance.send(C2SProtocol.C_REWARD_ARREST, msg);
	}

	public clear() {
		this.model.isNeedReset = true;
		if(this.model.baseRewardDic)this.model.baseRewardDic.clear();
		if(this.model.offerRewardTaskDic)this.model.offerRewardTaskDic.clear();
		if(this.model.offerRewardTaskStateDic)this.model.offerRewardTaskStateDic.clear();
		if(this.model.offerRewardTaskProfileDic)this.model.offerRewardTaskProfileDic.clear();
		if(this.model.offerRewardTaskIndex)this.model.offerRewardTaskIndex.clear();
		this.model.freeRefreshCount = 0;
		this.thane.rewardCount = 0;
    }
}