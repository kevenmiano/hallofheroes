import GameEventDispatcher from '../../../core/event/GameEventDispatcher';
import { SimpleDictionary } from '../../../core/utils/SimpleDictionary';
import { ConfigManager } from '../../manager/ConfigManager';
import { t_s_questcondictionData } from '../../config/t_s_questcondiction';
import { TaskTemplate } from './TaskTemplate';
import { TaskEvent } from '../../constant/event/NotificationEvent';
import { TaskConditionType } from '../../constant/TaskConditionType';
import { TaskType } from '../../constant/TaskType';
import { TaskManage } from '../../manager/TaskManage';
import OfferRewardManager from '../../manager/OfferRewardManager';
import RingTaskManager from '../../manager/RingTaskManager';
import LangManager from '../../../core/lang/LangManager';
import { ArrayUtils, ArrayConstant } from '../../../core/utils/ArrayUtils';
export default class TaskCategory extends GameEventDispatcher {
	private static ADD_TASK: string = "ADD_TASK";
	private static REMOVE_TASK: string = "REMOVE_TASK";
	private static MANUAL_TASK_ADDED: string = "MANUAL_TASK_ADDED";
	private static MANUAL_TASK_REMOVE: string = "MANUAL_TASK_REMOVE";

	protected _changeObj: SimpleDictionary;
	private _clientDownTemp: TaskTemplate;
	private _acceptedTaskList: any[];
	private _mainTaskList: any[];
	private _branchTaskList: any[];
	private _commonTaskList: any[];
	private _actTaskList: any[];
	private _backplayerTaskList: any[];
	private _vipTaskList: any[];
	private _manualTaskList: any[];
	private _mobileTemp: TaskTemplate;
	constructor() {
		super();
		this._acceptedTaskList = [];
		this._mainTaskList = [];
		this._branchTaskList = [];
		this._commonTaskList = [];
		this._actTaskList = [];
		this._backplayerTaskList = [];
		this._vipTaskList = [];
		this._manualTaskList = [];
		this._changeObj = new SimpleDictionary();
	}

	public addManualTask(taskTemp: TaskTemplate) {
		if (this._manualTaskList.indexOf(taskTemp) < 0) {
			this._manualTaskList.push(taskTemp);
			this._changeObj[TaskCategory.MANUAL_TASK_ADDED] = taskTemp;
		}
	}

	public removeManualTask(taskTemp: TaskTemplate) {
		this._manualTaskList.splice(this._manualTaskList.indexOf(taskTemp), 1);
		this._changeObj[TaskCategory.MANUAL_TASK_REMOVE] = taskTemp;
	}

	/**
	 * 添加已接受任务 
	 * @param taskTemp
	 */
	public addAccepted(taskTemp: TaskTemplate) {
		var con: t_s_questcondictionData;
		var clientSwitch: boolean = ConfigManager.info.CLIENT_DOWNLAND;
		if (!clientSwitch) {//登陆器任务开关
			for (let i: number = 0; i < taskTemp.conditionList.length; i++) {
				con = taskTemp.conditionList[i];
				if (con.CondictionType == TaskConditionType.CLIENT_DOWN) {
					this._clientDownTemp = taskTemp;
					return;
				}
			}
		}
		if (!ConfigManager.info.MOBILE_TASK) {//手机任务开关
			for (let i: number = 0; i < taskTemp.conditionList.length; i++) {
				con = taskTemp.conditionList[i];
				if (con.CondictionType == TaskConditionType.PHONE_CHECK) {
					this._mobileTemp = taskTemp;
					return;
				}
			}
		}
		this.addByType(taskTemp);
		if (this._manualTaskList.indexOf(taskTemp) >= 0) {
			this.removeManualTask(taskTemp);
		}
		if (this._acceptedTaskList.indexOf(taskTemp) < 0) {
			this._acceptedTaskList.push(taskTemp);
			this._changeObj[TaskCategory.ADD_TASK] = taskTemp;
		}
	}

	/**
	 * 根据任务类型分分类 
	 * @param taskTemp
	 */
	private addByType(taskTemp: TaskTemplate) {
		switch (taskTemp.TemplateType) {
			case TaskType.TASK_MAIN:
				if (this._mainTaskList.indexOf(taskTemp) < 0)
					this._mainTaskList.push(taskTemp);
				break;
			case TaskType.TASK_COMMON:
				if (this._commonTaskList.indexOf(taskTemp) < 0)
					this._commonTaskList.push(taskTemp);
				break;
			case TaskType.TASK_ACT:
				if (this._actTaskList.indexOf(taskTemp) < 0)
					this._actTaskList.push(taskTemp);
				break;
			case TaskType.BACK_PLAYER:
				if (this._backplayerTaskList.indexOf(taskTemp) < 0)
					this._backplayerTaskList.push(taskTemp);
				break;
			case TaskType.VIP_TASK:
				if (this._vipTaskList.indexOf(taskTemp) < 0)
					this._vipTaskList.push(taskTemp);
				break;
		}
	}

	/**
	 * 删除任务 
	 * @param taskTemp
	 */
	public removeTask(taskTemp: TaskTemplate) {
		this.removeByType(taskTemp);
		var index: number = this._acceptedTaskList.indexOf(taskTemp);
		if (index >= 0) {
			this._acceptedTaskList.splice(index, 1);
			if (TaskManage.Instance.isManualAvaliable(taskTemp)) {
				this.addManualTask(taskTemp);
			}
			this._changeObj[TaskCategory.REMOVE_TASK] = taskTemp;
		}
		taskTemp = null;
	}

	public addMobileTaskBySwitch() {
		if (this._mobileTemp == null) return;
		for (let i: number = 0; i < this._acceptedTaskList.length; i++) {
			let temp: TaskTemplate = this._acceptedTaskList[i];
			if (temp.conditionList[0].CondictionType == TaskConditionType.PHONE_CHECK) {
				return;
			}
		}
		this._acceptedTaskList.push(this._mobileTemp);
		this.addByType(this._mobileTemp);
	}

	public addClientDownTaskBySwitch() {
		if (this._clientDownTemp == null) return;
		for (let i: number = 0; i < this._acceptedTaskList.length; i++) {
			let temp: TaskTemplate = this._acceptedTaskList[i];
			if (temp.conditionList[0].CondictionType == TaskConditionType.CLIENT_DOWN) {
				return;
			}
		}
		this._acceptedTaskList.push(this._clientDownTemp);
		this.addByType(this._clientDownTemp);
	}

	private removeByType(taskTemp: TaskTemplate) {
		if (this._mainTaskList.indexOf(taskTemp) >= 0) {
			this._mainTaskList.splice(this._mainTaskList.indexOf(taskTemp), 1);
		}
		else if (this._branchTaskList.indexOf(taskTemp) >= 0) {
			this._branchTaskList.splice(this._branchTaskList.indexOf(taskTemp), 1);
		}
		else if (this._commonTaskList.indexOf(taskTemp) >= 0) {
			this._commonTaskList.splice(this._commonTaskList.indexOf(taskTemp), 1);
		}
		else if (this._actTaskList.indexOf(taskTemp) >= 0) {
			this._actTaskList.splice(this._actTaskList.indexOf(taskTemp), 1);
		}
		else if (this._backplayerTaskList.indexOf(taskTemp) >= 0) {
			this._backplayerTaskList.splice(this._backplayerTaskList.indexOf(taskTemp), 1);
		}
		else if (this._vipTaskList.indexOf(taskTemp) >= 0) {
			this._vipTaskList.splice(this._vipTaskList.indexOf(taskTemp), 1);
		}
	}

	public beginChanges() {
		this._changeObj.clear();
	}

	public commit() {
		if (this._changeObj[TaskCategory.MANUAL_TASK_ADDED])
			this.dispatchEvent(TaskEvent.MANUAL_TASK_ADDED, this._changeObj[TaskCategory.MANUAL_TASK_ADDED]);
		if (this._changeObj[TaskCategory.MANUAL_TASK_REMOVE])
			this.dispatchEvent(TaskEvent.MANUAL_TASK_REMOVE, this._changeObj[TaskCategory.MANUAL_TASK_REMOVE]);
		if (this._changeObj[TaskCategory.ADD_TASK])
			this.dispatchEvent(TaskEvent.TASK_ADDED, this._changeObj[TaskCategory.ADD_TASK]);
		if (this._changeObj[TaskCategory.REMOVE_TASK])
			this.dispatchEvent(TaskEvent.TASK_REMOVE, this._changeObj[TaskCategory.REMOVE_TASK]);
	}

	public get traceList(): Array<TaskTemplate> {
		var vec: Array<TaskTemplate> = new Array();
		for (let i: number = 0; i < this._acceptedTaskList.length; i++) {
			let task: TaskTemplate = this._acceptedTaskList[i];
			vec.push(task);
		}
		return vec;
	}

	public hasCompletedTask(): boolean {
		for (let i: number = 0; i < this._acceptedTaskList.length; i++) {
			let taskTemp: TaskTemplate = this._acceptedTaskList[i];
			if (taskTemp.isCompleted) {
				return true;
			}
		}
		return false;
	}

	public hasNewCompletedTask(): boolean {
		for (let i: number = 0; i < this._acceptedTaskList.length; i++) {
			let taskTemp: TaskTemplate = this._acceptedTaskList[i];
			if (taskTemp.isCompleted && !taskTemp.hasCompleted) {
				return true;
			}
		}
		return false;
	}

	public get completedList(): Array<TaskTemplate> {
		var arr: Array<TaskTemplate> = new Array();
		for (let i: number = 0; i < this._acceptedTaskList.length; i++) {
			let taskTemp: TaskTemplate = this._acceptedTaskList[i];
			if (taskTemp.isCompleted) {
				arr.push(taskTemp);
			}
		}
		return arr;
	}

	public hasTask(info: TaskTemplate): boolean {
		for (let i: number = 0; i < this._acceptedTaskList.length; i++) {
			let temp: TaskTemplate = this._acceptedTaskList[i];
			if (info.TemplateId == temp.TemplateId) {
				return true;
			}
		}
		return false;
	}

	public hasTaskAndNotCompleted(tempId: number): boolean {
		for (let i: number = 0; i < this._acceptedTaskList.length; i++) {
			let temp: TaskTemplate = this._acceptedTaskList[i];
			if (tempId == temp.TemplateId && !temp.isCompleted) {
				return true;
			}
		}
		return false;
	}

	public getTaskById(tempId: number): TaskTemplate {
		let tem: TaskTemplate;
		for (let i: number = 0; i < this._acceptedTaskList.length; i++) {
			let temp: TaskTemplate = this._acceptedTaskList[i];
			if (tempId == temp.TemplateId) {
				tem = temp;
				break;
			}
		}
		return tem;
	}

	public get acceptedList(): any[] {
		return this._acceptedTaskList;
	}

	public get mainTaskList(): any[] {
		return this._mainTaskList;
	}

	public get branchTaskList(): any[] {
		return this._branchTaskList;
	}

	public get commonTaskList(): any[] {
		return this._commonTaskList;
	}

	public get actTaskList(): any[] {
		return this._actTaskList;
	}

	public get backplayerTaskList(): any[] {
		return this._backplayerTaskList;
	}

	public get vipTaskList(): any[] {
		return this._vipTaskList;
	}

	public get manualTaskList(): any[] {
		return this._manualTaskList;
	}

	public set manualTaskList(value: any[]) {
		this._manualTaskList = value;
	}

	public getListByType(type: number): any[] {
		let taskList: any[];
		switch (type) {
			case TaskType.TASK_MAIN:
				taskList = this.mainTaskList;
				break;
			case TaskType.TASK_COMMON:
				taskList = this.commonTaskList;
				break;
			case TaskType.TASK_ACT:
				taskList = this.actTaskList.concat(this.backplayerTaskList);
				break;
			case TaskType.VIP_TASK:
				taskList = this.vipTaskList;
				break;
			case TaskType.OFFER_REWARD:
				taskList = OfferRewardManager.Instance.model.baseRewardDic.getList();
				break;
			case TaskType.RING_TASK:
				if (RingTaskManager.Instance.getRingTask()) {
					taskList = RingTaskManager.Instance.model.hasAccessList.getList();
				}
				else {
					taskList = [RingTaskManager.Instance.getOfferTemplete()];
				}
				break;
			default:
				taskList = this.manualTaskList;
		}
		if (taskList) {
			if (type != 100) {
				taskList.sort(this.sortOnIsFInish);
			}
			taskList = ArrayUtils.sortOn(taskList, ["isCompleted",'Sort'], [ArrayConstant.DESCENDING,ArrayConstant.NUMERIC]);
		}
		return taskList;
	}

	public getTitleNameByType(type: number): string {
        let str: string;
        switch (type) {
            case TaskType.TASK_MAIN:
                str = LangManager.Instance.GetTranslation("task.titleName1")//主线任务
                break;
            case TaskType.TASK_COMMON:
                str = LangManager.Instance.GetTranslation("task.titleName2")//日常任务
                break;
            case TaskType.TASK_ACT:
			case TaskType.BACK_PLAYER:
                str = LangManager.Instance.GetTranslation("task.titleName3")//活动任务
                break;
            case TaskType.VIP_TASK:
                str = LangManager.Instance.GetTranslation("task.titleName4")//VIP任务
                break;
            case 100:
                str = LangManager.Instance.GetTranslation("task.titleName5")//悬赏任务
                break;
        }
        return str;
    }

	private sortOnIsFInish(a: any, b: any): number {
		if (a.isCompleted && !b.isCompleted) {
			return -1;
		} else if (!a.isCompleted && b.isCompleted) {
			return 1;
		} else {
			return 0;
		}
	}
}