import GameEventDispatcher from "../../core/event/GameEventDispatcher";
import Logger from "../../core/logger/Logger";
import ByteArray from "../../core/net/ByteArray";
import { PackageIn } from "../../core/net/PackageIn";
import { ServerDataManager } from "../../core/net/ServerDataManager";
import BitArray from "../../core/utils/BitArray";
import { DateFormatter } from "../../core/utils/DateFormatter";
import Dictionary from "../../core/utils/Dictionary";
import { S2CProtocol } from "../constant/protocol/S2CProtocol";
import { TaskType } from "../constant/TaskType";
import { PlayerInfo } from "../datas/playerinfo/PlayerInfo";
import { ThaneInfo } from "../datas/playerinfo/ThaneInfo";
import BuildingManager from "../map/castle/BuildingManager";
import { BuildInfo } from "../map/castle/data/BuildInfo";
import TaskCategory from "../module/task/TaskCategory";
import { TaskInfo } from "../module/task/TaskInfo";
import { TaskTemplate } from "../module/task/TaskTemplate";
import { ArmyManager } from "./ArmyManager";
import { GoodsManager } from "./GoodsManager";
import { PlayerManager } from "./PlayerManager";
import { TaskSocketManager } from "./TaskSocketManager";
import { TempleteManager } from "./TempleteManager";

//@ts-expect-error: External dependencies
import QuestFinishedRspMsg = com.road.yishi.proto.quest.QuestFinishedRspMsg;
//@ts-expect-error: External dependencies
import QuestInfo = com.road.yishi.proto.quest.QuestInfo;
//@ts-expect-error: External dependencies
import QuestUpdatedRspMsg = com.road.yishi.proto.quest.QuestUpdatedRspMsg;
import ModelMgr from "./ModelMgr";
import { EmModel } from "../constant/model/modelDefine";
import { UserModelAttribute } from "../constant/model/UserModelParams";
import SDKManager from "../../core/sdk/SDKManager";
import { GameEventCode } from "../constant/GameEventCode";
import { t_s_buildingtemplateData } from "../config/t_s_buildingtemplate";
export class TaskManage extends GameEventDispatcher {
  /**
   * 开放英灵系统的人物
   */
  public static PET_SYSTEM_OPEN_TASK: number = 920;
  public static PET_SYSTEM_OPEN_TASK02: number = 921;
  public static SETARMY_TASK: number = 52;
  public static TTREASURE_MAP_TASK: number = 933;
  /**
   * 突破防线
   */
  public static STUPID_TAURENS_TASK: number = 45;

  private static _instance: TaskManage;
  public static get Instance(): TaskManage {
    if (!this._instance) this._instance = new TaskManage();
    return this._instance;
  }

  private _allTasks: Dictionary = new Dictionary();
  /** 二进制保存的任务完成历史记录 */
  private _taskLog: BitArray;
  private _cate: TaskCategory;

  public setup() {
    this._cate = new TaskCategory();
    this._taskLog = new BitArray();
    this._allTasks = TempleteManager.Instance.taskTemplateDic();
    this.initEvent();
  }

  public loadData() {
    this.loadTaskLog();
  }
  /**
   * 加载标志位
   *
   */
  private loadTaskLog() {
    var player: PlayerInfo =
      PlayerManager.Instance.currentPlayerModel.playerInfo;
    var byte: ByteArray = player.questSite;
    this._taskLog.clear();
    for (var i: number = 0; i < byte.length; i++) {
      this._taskLog.writeByte(byte.readByte());
    }
  }

  private initEvent() {
    //任务更新
    ServerDataManager.listen(
      S2CProtocol.U_C_QUEST_UPDAT,
      this,
      this.__questUpdateHandler,
    );
    //任务完成
    ServerDataManager.listen(
      S2CProtocol.U_C_QUEST_FINISH,
      this,
      this.__questFinishHandler,
    );
  }

  private _isFirstLoad: boolean = true;
  /**获取个人任务信息*/
  private __questUpdateHandler(pkg: PackageIn) {
    var newTaskList: Array<TaskTemplate> = [];
    let msg: QuestUpdatedRspMsg = pkg.readBody(
      QuestUpdatedRspMsg,
    ) as QuestUpdatedRspMsg;
    var length: number = msg.quest.length; //任务列表长度

    for (var i: number = 0; i < length; i++) {
      var questInfo: QuestInfo = msg.quest[i] as QuestInfo;
      var taskTemp: TaskTemplate = this.getTaskByID(questInfo.templateId);
      var isNewAdd: boolean;
      if (!taskTemp) continue;

      if (!taskTemp.taskInfo) {
        //本地没有该任务数据
        taskTemp.taskInfo = new TaskInfo();
        this.readTaskInfo(taskTemp, questInfo);
        isNewAdd = true;
        if (!this.isAvailableTask(taskTemp)) {
          //登录是服务器推过来的日常任务,
          continue;
        }
      } else if (!this._cate.hasTask(taskTemp)) {
        //本地有任务数据, 但是该任务不在任务列表中, 也就是本次登录完成过的任务
        if (this.isAvailableTask(taskTemp)) {
          //该任务可以继续完成, 则加入任务列表
          this.readTaskInfo(taskTemp, questInfo);
          isNewAdd = true;
        }
      } else {
        //本地有任务数据, 并且在任务列表中, 则更新任务
        this.readTaskInfo(taskTemp, questInfo);
      }
      if (isNewAdd) {
        if (taskTemp.isNew && this.checkShowNewTask(taskTemp)) {
          newTaskList.push(taskTemp);
        }
        taskTemp.addConditionListener();
        this._cate.beginChanges();
        this._cate.addAccepted(taskTemp);
        this._cate.commit();
      }
    }
    this._taskLog.clear();
    this._taskLog.writeArrayBuffer(msg.states);
    if (this._isFirstLoad) {
      this.requestCanAcceptTask();
      this._isFirstLoad = false;
      return;
    }

    if (this._cate.hasCompletedTask() && !this._newComplete) {
      this._newComplete = true;
    }
    if (isNewAdd) this.newTaskHandler(newTaskList);
  }

  private _newComplete: boolean;
  private __questFinishHandler(pkg: PackageIn) {
    var msg: QuestFinishedRspMsg = pkg.readBody(
      QuestFinishedRspMsg,
    ) as QuestFinishedRspMsg;
    var taskTemp: TaskTemplate = this.getTaskByID(msg.templateId);
    if (!taskTemp) return;

    // TaskGainMovie.taskMovie(taskTemp);//滚动显示奖励
    taskTemp.taskInfo.condition1 = 0;
    taskTemp.taskInfo.condition2 = 0;
    taskTemp.taskInfo.condition3 = 0;
    taskTemp.taskInfo.condition4 = 0;
    taskTemp.taskInfo.isComplete = false;
    taskTemp.removeEvent();
    this._cate.beginChanges();
    this._cate.removeTask(taskTemp);
    this._cate.commit();
    Logger.info("完成任务: " + taskTemp.TemplateId + ":" + taskTemp.TitleLang);

    this.requestCanAcceptTask();

    //贪玩渠道上报完成任务的游戏事件
    let channelId: number = Number(
      ModelMgr.Instance.getProperty(
        EmModel.USER_MODEL,
        UserModelAttribute.channelId,
      ),
    );
    if (channelId == 20370 && taskTemp.TemplateType == TaskType.TASK_MAIN) {
      SDKManager.Instance.getChannel().postGameEvent(GameEventCode.Code_9999);
    }
  }

  /**
   * 公共更新任务进度,其他通过TaskTemplate.getProgress、RingTask.getProgress、BaseOfferReward.getProgress更新
   * @param taskTemp
   * @param questInfo
   */
  private readTaskInfo(taskTemp: TaskTemplate, questInfo: QuestInfo) {
    Logger.info(
      "[TaskManage]服务器更新任务进度",
      questInfo.templateId,
      taskTemp.TitleLang,
      questInfo,
      taskTemp,
    );
    if (taskTemp) {
      taskTemp.taskInfo.taskId = questInfo.templateId;
      taskTemp.taskInfo.isComplete = questInfo.isComplete;
      taskTemp.taskInfo.condition1 = questInfo.condition_1;
      taskTemp.taskInfo.condition2 = questInfo.condition_2;
      taskTemp.taskInfo.condition3 = questInfo.condition_3;
      taskTemp.taskInfo.condition4 = questInfo.condition_4;
      taskTemp.taskInfo.isSelect = questInfo.isSelect;
      taskTemp.taskInfo.completeDate = DateFormatter.parse(
        questInfo.completedDate,
        "YYYY-MM-DD hh:mm:ss",
      );
      taskTemp.taskInfo.acceptDate = DateFormatter.parse(
        questInfo.addDate,
        "YYYY-MM-DD hh:mm:ss",
      );
      taskTemp.taskInfo.repeatFinish = questInfo.repeatFinish;
      taskTemp.commit();
    }
  }

  /**
   * 由于开关在任务添加后才改变, 所以开关不能有效控制任务, 特此方法处置
   * **/
  public mobileSwitchHandler() {
    this._cate && this._cate.addMobileTaskBySwitch();
  }

  public clientDownSwitchHandler() {
    this._cate && this._cate.addClientDownTaskBySwitch();
  }

  /**请求可接受的任务**/
  public requestCanAcceptTask() {
    var temp: any[] = this.getAvailableTasks();
    if (temp.length != 0) {
      var arr: any[] = [];
      for (let i: number = 0; i < temp.length; i++) {
        var info: TaskTemplate = temp[i];
        arr.push(info.TemplateId);
        info.isRequired = true;
        info.isNew = true;
      }
      this.socketSendTaskAdd(arr);
    }
  }

  public requestAcceptTask(taskTemp: TaskTemplate) {
    if (this.isAvailableTask(taskTemp)) {
      taskTemp.isRequired = true;
      taskTemp.isNew = true;
      this.socketSendTaskAdd([taskTemp.TemplateId]);
    }
  }
  private socketSendTaskAdd(arr: any[]) {
    TaskSocketManager.sendRequestTask(arr);
  }
  /**
   * 判断任务是否可用
   * @param info 任务模板
   * @param checkExist 是否限定服务器已接受
   * @return 任务是否可用
   *
   */
  public isAvailableTask(info: TaskTemplate): boolean {
    if (info.TemplateId == 765) {
    }
    if (!info) return false;
    //任务是否过期
    if (this.checkIsAchieved(info)) return false;
    //任务时间是否未到
    if (this.checkIsReceivedDate(info)) return false;
    //检查是否达到领主所需等级
    if (this.checkPlayerGrades(info)) return false;
    //检查是否超过最大等级
    if (this.checkPlayerOverGrades(info)) return false;
    //当前任务在指定星期范围
    if (this.checkInWeek(info)) return false;
    //当前任务在指定小时范围
    if (this.checkInHour(info)) return false;
    //当前用户已接受了该任务
    if (this._cate.hasTask(info)) return false;
    //当前任务已完成, 但不可重复接受
    if (this.IsTaskFinish(info.TemplateId) && !info.IsRepeat) return false;
    //当前任务是否超过指定时间内可重复接受上限
    if (this.checkRepeatMax(info) && this.checkInRepeatTime(info)) return false;
    //所需前置任务
    if (!this.checkPreTask(info)) return false;
    //检查所需建筑
    if (!this.chechNeedBuilding(info)) return false;
    //检查所需物品
    if (!this.checkNeedGoods(info)) return false;
    if (!this.checkConsortia(info)) return false;
    info.isNew = true;
    return true;
  }

  private checkIsAchieved(info: TaskTemplate): boolean {
    var nowDate: number =
      PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond * 1000;
    var startDate: number = DateFormatter.parse(
      info.EndDate,
      "YYYY-MM-DD hh:mm:ss",
    ).getTime();
    if (nowDate > startDate) {
      return true;
    }
    return false;
  }

  private checkIsReceivedDate(info: TaskTemplate): boolean {
    var nowDate: number =
      PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond * 1000;
    var endDate: number = DateFormatter.parse(
      info.StartDate,
      "YYYY-MM-DD hh:mm:ss",
    ).getTime();
    if (nowDate < endDate) {
      return true;
    }
    return false;
  }

  private checkPlayerGrades(info: TaskTemplate): boolean {
    if (this.thane.grades < info.NeedMinLevel) {
      return true;
    }
    return false;
  }

  private checkPlayerOverGrades(info: TaskTemplate): boolean {
    if (this.thane.grades > info.NeedMaxLevel) {
      return true;
    }
    return false;
  }

  private checkRepeatMax(info: TaskTemplate): boolean {
    if (info.taskInfo && info.RepeatMax <= info.taskInfo.repeatFinish) {
      return true;
    }
    return false;
  }

  private checkInRepeatTime(info: TaskTemplate): boolean {
    var nowDate: Date = new Date();
    nowDate.setTime(
      PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond * 1000,
    );
    var tempNow: Date = new Date();
    tempNow.setTime(nowDate.getTime() - 5 * 3600 * 1000);
    var tempComDate: Date = new Date();
    tempComDate.setTime(info.taskInfo.completeDate.getTime() - 5 * 3600 * 1000);
    var str: string = DateFormatter.format(tempNow, "YY-MM-DD");
    var str2: string = DateFormatter.format(tempComDate, "YY-MM-DD");
    if (str != str2) return false;
    return true;
  }

  private checkPreTask(info: TaskTemplate): boolean {
    if (info.PreQuestId == "") return true;
    var arr: any[] = info.PreQuestId.split(",");
    for (var i: number = 0; i < arr.length; i++) {
      var taskId: number = arr[i];
      var preTask: TaskTemplate = this.getTaskByID(taskId);
      if (preTask && !this.IsTaskFinish(preTask.TemplateId)) {
        return false;
      }
    }
    return true;
  }

  private chechNeedBuilding(info: TaskTemplate): boolean {
    if (info.NeedBuildingTemp == 0) return true;
    var needTemp: t_s_buildingtemplateData =
      TempleteManager.Instance.getBuildTemplateByID(info.NeedBuildingTemp);
    if (needTemp) {
      var building: BuildInfo =
        BuildingManager.Instance.getBuildingInfoBySonType(needTemp.SonType);
      if (
        building &&
        needTemp.BuildingGrade > building.templeteInfo.BuildingGrade
      ) {
        return true;
      }
    }
    return false;
  }

  private checkNeedGoods(info: TaskTemplate): boolean {
    if (info.NeedItemTemp == 0) return true;
    var good: any[] = GoodsManager.Instance.getGoodsByGoodsTId(
      info.NeedItemTemp,
    );
    if (good.length == 0) {
      return true;
    }
    return false;
  }
  /**
   * 是否存在公会, 不存在则不能接公会相关任务
   * @return
   *
   */
  private checkConsortia(info: TaskTemplate): boolean {
    if (info.IsLeague && this.thane.consortiaID == 0) {
      return false;
    }
    return true;
  }

  private checkInHour(info: TaskTemplate): boolean {
    return false;
  }
  private checkInWeek(info: TaskTemplate): boolean {
    return false;
  }
  /** 从任务历史记录中查看任务是否曾经完成 */
  public IsTaskFinish(taskId: number): boolean {
    if (!this._taskLog) {
      return false;
    }
    if (taskId > this._taskLog.length * 8 || taskId < 1) {
      return false;
    }
    taskId--;
    var index: number = Math.floor(taskId / 8);
    var offset: number = taskId % 8;
    let tmp: any = this._taskLog.__get(index);
    var result: number = tmp & (0x01 << offset);
    return result != 0;
  }

  /**
   * 获取所有可接受的任务列表
   * @return 包含所有可以接受的任务模板的数组
   */
  public getAvailableTasks(isAuto: boolean = true): any[] {
    var arr: any[] = [];
    let temp = this._allTasks;
    for (let key in temp) {
      if (Object.prototype.hasOwnProperty.call(temp, key)) {
        let info = temp[key];
        if (info.IsAuto == isAuto && this.isAvailableTask(info)) {
          arr.push(info);
        } else if (this.isManualAvaliable(info)) {
          this.cate.addManualTask(info);
        }
      }
    }
    return arr;
  }

  public isManualAvaliable(taskTemp: TaskTemplate): boolean {
    if (taskTemp.IsAuto) return false;
    if (!this.isAvailableTask(taskTemp)) return false;
    if (!taskTemp.taskInfo) return true;
    if (taskTemp.taskInfo.isSelect) return false;
    var completeDate: Date = taskTemp.taskInfo.completeDate;
    var currentDate: Date = new Date();
    currentDate.setTime(
      PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond * 1000,
    );
    if (taskTemp.taskInfo.repeatFinish < taskTemp.RepeatMax) return true;
    else if (!completeDate) return true;
    else if (
      DateFormatter.format(completeDate, "YYYY-MM-DD") !=
      DateFormatter.format(currentDate, "YYYY-MM-DD")
    )
      return true;
    else if (
      parseInt(
        (completeDate.getHours() / taskTemp.RepeatInterval).toString(),
      ) !=
        parseInt(
          (currentDate.getHours() / taskTemp.RepeatInterval).toString(),
        ) &&
      taskTemp.taskInfo.repeatFinish <= taskTemp.RepeatMax
    )
      return true;
    return false;
  }
  /**
   * 是否需要新任务提示
   * @param temp
   * @return
   *
   */
  private checkShowNewTask(temp: TaskTemplate): boolean {
    if (temp.TemplateType != TaskType.TASK_MAIN) return false;
    if (temp.TemplateId == 10 || temp.TemplateId == 220) return false;
    return true;
  }
  /**
   * 新任务提示
   *
   */
  private newTaskHandler(list: Array<TaskTemplate>) {
    if (list.length == 0) return;
    // DelayActionsUtils.Instance.addAction(new NewTaskAction(list[0]));
  }

  /**由ID获取指定任务模板
   * @param id 任务ID, 与数据库中的数据一致。
   */
  public getTaskByID(id: number): TaskTemplate {
    if (!this._allTasks) return null;
    return this._allTasks[id];
  }

  /** 任务模板表 */
  public get allTasks(): Dictionary {
    return this._allTasks;
  }

  /**
   * @private
   */
  public set allTasks(value: Dictionary) {
    this._allTasks = value;
  }

  private sortOnType(a: TaskTemplate, b: TaskTemplate): number {
    if (a.TemplateType < b.TemplateType) {
      return -1;
    } else if (a.TemplateType > b.TemplateType) {
      return 1;
    } else {
      return 0;
    }
  }

  public get existTaskType(): any[] {
    var arr: any[] = [];
    for (let i: number = 0; i < this._cate.acceptedList.length; i++) {
      let taskTemp: TaskTemplate = this._cate.acceptedList[i];
      if (arr.indexOf(taskTemp.TemplateType) > -1) continue;
      arr.push(taskTemp.TemplateType);
    }
    return arr;
  }

  public getCompletedList(): any[] {
    return this._cate.completedList.sort(this.sortOnType);
  }

  public get cate(): TaskCategory {
    return this._cate;
  }

  private get thane(): ThaneInfo {
    return ArmyManager.Instance.thane;
  }

  public hasCompletedTask(): boolean {
    return this._cate && this._cate.hasCompletedTask();
  }
}
