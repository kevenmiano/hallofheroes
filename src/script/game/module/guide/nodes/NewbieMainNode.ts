import NewbieUtils from "../utils/NewbieUtils";
import Logger from '../../../../core/logger/Logger';
import SpaceTaskInfoWnd from "../../home/SpaceTaskInfoWnd";
import NewbieSubNodeInfo from "../data/NewbieSubNodeInfo";
import NewbieModule from "../NewbieModule";
import { NewbieMainNodeInfo } from "../data/NewbieMainNodeInfo";
import { NotificationManager } from "../../../manager/NotificationManager";
import NewbieEvent from "../../../constant/event/NotificationEvent";

/**
 * 基本新手节点类 
 */
export default class NewbieMainNode {
	constructor(data: NewbieMainNodeInfo) {
		this._data = data;
	}

	private delayNum: number = 100;
	private _data: NewbieMainNodeInfo;
	public get data(): NewbieMainNodeInfo {
		return this._data;
	}
	public get curSubNodeIdx(): number {
		return this._data && this._data.curSubNodeIdx as number;
	}

	public get curSubNodeInfo(): NewbieSubNodeInfo {
		return this._data && this._data.curSubNodeInfo as NewbieSubNodeInfo;
	}
	public get curSubNodeId(): number {
		return this.curSubNodeInfo && this.curSubNodeInfo.nodeId;
	}
	public get mainNodeId(): number {
		return this._data && this._data.mainNodeId as number;
	}


	private _isFinish: boolean = false;
	public isFinish() {
		if (this._isFinish) return true;
		this._isFinish = NewbieModule.Instance.finishNodeStr.indexOf(this.mainNodeId.toString()) != -1;
		if (this._isFinish) {
			Logger.info("新手节点已经完成", this.mainNodeId);
		}
		return this._isFinish;
	}

	public isSkip() {
		if (!this._data) {
			return;
		}

		let headNodeInfo = this._data.subNodeInfoArr[0]
		let isSkip = this.checkConditions(headNodeInfo.skipConditions, headNodeInfo.skipConditionParams, headNodeInfo.skipConditionInverted, headNodeInfo.skipConditionSymbol, false);
		if (isSkip) {
			Logger.info("新手节点已跳过", this.mainNodeId);
			this.completeMainNode(true)
		}
		return isSkip;
	}

	public isTrigger() {
		if (!this._data) {
			return;
		}
		let headNodeInfo = this._data.subNodeInfoArr[0]
		let isTrigger = this.checkConditions(headNodeInfo.conditions, headNodeInfo.conditionParams, headNodeInfo.conditionInverted, headNodeInfo.conditionSymbol, false);
		return isTrigger
	}

	public startMainNode() {
		if (!this._data) {
			Logger.info("请先设置新手数据", this.mainNodeId)
			return;
		};
		Logger.info("新手主节点开始", this.mainNodeId)
		NewbieModule.Instance.curExeMainNodeId = this.mainNodeId;
		this._data.curSubNodeIdx = 1;
		this.startTimer();
	}

	public completeMainNode(isSkip: Boolean = false) {
		this.stopTimer();
		NewbieModule.Instance.sendSaveProcess(this.mainNodeId);
		NotificationManager.Instance.dispatchEvent(NewbieEvent.MAIN_NODE_FINISH, this.mainNodeId);
		NewbieModule.Instance.curExeMainNodeId = 0;
		Logger.info("新手主节点完成 >>>>", this.mainNodeId, isSkip);
	}

	public startSubNode() {
		// Logger.info("新手子节点开始", this.mainNodeId, this.curSubNodeId);
		NewbieModule.Instance.curExeSubNodeId = this.curSubNodeId;
		this._data.startSubNode();
	}

	public completeSubNode() {
		NewbieModule.Instance.sendCurProcess(this.mainNodeId, this.curSubNodeId);
		if (this.curSubNodeInfo.recordFinish == 1) {
			NewbieModule.Instance.sendSaveProcess(this.mainNodeId);
		}
		
		// Logger.info("新手子节点完成 >>", this.mainNodeId, this.curSubNodeId);
		this._data.completeSubNode();
		if (this._data.isComplete) {
			this.completeMainNode()
		}
		NewbieModule.Instance.curExeSubNodeId = 0;
	}

	private __timerUpdateHandler(e) {
		if (!this.curSubNodeInfo) {
			Logger.info("新手子数据不存在", this.mainNodeId, this.curSubNodeIdx)
			return;
		};

		//是否满足所有跳过条件
		let isReachAllSkipCons: boolean = this.checkConditions(this.curSubNodeInfo.skipConditions, this.curSubNodeInfo.skipConditionParams, this.curSubNodeInfo.skipConditionInverted, this.curSubNodeInfo.skipConditionSymbol, false);
		if (isReachAllSkipCons) {
			this.completeSubNode();
			return;
		}

		//是否满足回退条件  暂时不支持
		// if (this.checkBackToNode()) {
		// 	return
		// }

		if (!this.checkSpaceTaskInfoWndInit()) {
			return
		}

		if (NewbieModule.Instance.curExeSubNodeId > 0) {
			// Logger.info("新手正在执行子节点", this.mainNodeId, this.curSubNodeId)
			return;
		}

		//是否满足所有执行条件
		let isReachAllExecCons: boolean = this.checkConditions(this.curSubNodeInfo.conditions, this.curSubNodeInfo.conditionParams, this.curSubNodeInfo.conditionInverted, this.curSubNodeInfo.conditionSymbol, true);
		if (isReachAllExecCons) {
			this.startSubNode();
			// if (this.curSubNodeInfo.delayTime > 0) {
			// 	this.curSubNodeInfo.delayTime -= this.delayNum;
			// 	return;
			// }
			if (this.curSubNodeInfo.needWaitForComplete) {
				NewbieUtils.execFunc(this.curSubNodeInfo.actionFunc, this.curSubNodeInfo.actionParams, this.completeSubNode.bind(this), [this.curSubNodeInfo]);
			}
			else {
				NewbieUtils.execFunc(this.curSubNodeInfo.actionFunc, this.curSubNodeInfo.actionParams);
				this.completeSubNode();
			}
		}
	}

	public checkConditions(conditions, conditionParams, conditionInverted, conditionSymbol: number, isPassWhenEmpty: boolean): boolean {
		// if(isPassWhenEmpty){
		// 	Logger.xjy("[NewbieBaseNode]checkConditions conditions:", conditions, "conditionParams:", conditionParams, "conditionInverted:", 
		// 		conditionInverted, "conditionSymbol:", conditionSymbol, "isPassWhenEmpty:", isPassWhenEmpty)
		// }
		var len: number = conditions ? conditions.length : 0;
		if (len == 0) {
			return isPassWhenEmpty;
		}
		var isReachAllCons: boolean;
		var singleConValue: boolean;
		var invertedLen: number = conditionInverted ? conditionInverted.length : 0;
		switch (conditionSymbol) {
			case 1:
				isReachAllCons = false;
				for (var j: number = 0; j < len; j++) {
					singleConValue = NewbieUtils.execFunc(conditions[j], conditionParams[j]);
					if (invertedLen > 0 && conditionInverted[j] == "1") {//如有配置条件取反, 则检查是否需要取反, 1取反
						singleConValue = !singleConValue;
					}
					if (singleConValue) {
						isReachAllCons = true;
						break;
					}
				}
				break;
			default:
				isReachAllCons = true;
				for (var i: number = 0; i < len; i++) {
					singleConValue = NewbieUtils.execFunc(conditions[i], conditionParams[i]);
					if (invertedLen > 0 && conditionInverted[i] == "1") {//如有配置条件取反, 则检查是否需要取反, 1取反
						singleConValue = !singleConValue;
					}
					if (!singleConValue) {
						isReachAllCons = false;
						break;
					}
				}
		}
		return isReachAllCons;
	}

	public checkSpaceTaskInfoWndInit() {
		// TODO 先这样做
		if (this.curSubNodeInfo.actionType == "a11" || this.curSubNodeInfo.actionType == "a10") {
			if (!SpaceTaskInfoWnd.ISINIT) {
				Logger.xjy("等待任务工具栏初始化完成！")
				return false
			}
		}
		return true
	}

	public checkBackToNode($nInfo: NewbieMainNodeInfo = null): boolean {
		if (this.curSubNodeInfo.backConditions.length <= 0) return false

		// var nInfo: NewbieMainNodeInfo = $nInfo;
		// if (!nInfo) nInfo = this.curSubNodeInfo;
		// if (nInfo) {
		// 	NewbieController.sendSaveProcess(this.curSubNodeInfo.saveId);
		// 	var backId: number = nInfo.backId;
		// 	if (backId <= 0) {
		// 		Logger.error("[NewbieBaseNode]checkBackToNode backId<=0");
		// 		return false;
		// 	}
		// 	//是否满足所有回退条件
		// 	if (this.checkConditions(this.curSubNodeInfo.backConditions, this.curSubNodeInfo.backConditionParams, this.curSubNodeInfo.backConditionInverted, this.curSubNodeInfo.backConditionSymbol, true)) {
		// 		this._model.curNodeId = backId;
		// 		NewbieController.sendCurProcess(this._model.curNodeId);
		// 		this._model.curNode.prepare();
		// 		Logger.error("[NewbieBaseNode]checkBackToNode 回退节点", backId);
		// 		return true;
		// 	};
		// }
		// else {
		// 	Logger.error("[NewbieBaseNode]checkBackToNode subData为空");
		// 	return false;
		// }
		return false;
	}

	private startTimer() {
		Laya.timer.loop(this.delayNum, this, this.__timerUpdateHandler)
	}

	private stopTimer() {
		Laya.timer.clear(this, this.__timerUpdateHandler);
	}

	public reset() {
		this.stopTimer();
		this.curSubNodeInfo.clear();
		NewbieModule.Instance.curExeSubNodeId = 0;
	}

	public dispose() {
		this.reset();
	}
}