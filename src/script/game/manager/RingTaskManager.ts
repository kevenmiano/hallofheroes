import GameEventDispatcher from "../../core/event/GameEventDispatcher";
import { PackageIn } from "../../core/net/PackageIn";
import { SocketManager } from "../../core/net/SocketManager";
import Dictionary from "../../core/utils/Dictionary";
import { SimpleDictionary } from "../../core/utils/SimpleDictionary";
import {
  RingTaskEvent,
  SLGSocketEvent,
} from "../constant/event/NotificationEvent";
import { RewardConditionType } from "../constant/RewardConditionType";
import { GoodsInfo } from "../datas/goods/GoodsInfo";
import OfferRewardTemplate from "../module/offerReward/OfferRewardTemplate";
import { RingTask } from "../module/ringtask/RingTask";
import RingTaskModel from "../mvc/RingTaskModel";
import { ArmyManager } from "./ArmyManager";
import { PlayerManager } from "./PlayerManager";
import { TempleteManager } from "./TempleteManager";
import { S2CProtocol } from "../constant/protocol/S2CProtocol";
import { ServerDataManager } from "../../core/net/ServerDataManager";
//@ts-expect-error: External dependencies
import RewardInfo = com.road.yishi.proto.reward.RewardInfo;
//@ts-expect-error: External dependencies
import RewardUpdatedRspMsg = com.road.yishi.proto.reward.RewardUpdatedRspMsg;
//@ts-expect-error: External dependencies
import PropertyMsg = com.road.yishi.proto.simple.PropertyMsg;
import LangManager from "../../core/lang/LangManager";
import { C2SProtocol } from "../constant/protocol/C2SProtocol";
import { t_s_rewardgoodData } from "../config/t_s_rewardgood";
import { t_s_rewardcondictionData } from "../config/t_s_rewardcondiction";
export default class RingTaskManager extends GameEventDispatcher {
  private _model: RingTaskModel;
  private _unfinishedTaskArr: Array<OfferRewardTemplate>;

  public _defaultList: SimpleDictionary;

  public get model(): RingTaskModel {
    return this._model;
  }
  public static isTask: boolean = false;
  private _allReward: Dictionary = new Dictionary();
  private static _instance: RingTaskManager;
  public setup() {
    if (!this._model) this._model = new RingTaskModel();
    this.initUnfinishedTask();
    this._defaultList = new SimpleDictionary();
    this.initEvent();
  }

  public get allReward(): Dictionary {
    if (!this._allReward) this._allReward = new Dictionary();
    return this._allReward;
  }

  private initUnfinishedTask() {
    this._unfinishedTaskArr = [];
    for (let key in this._allReward) {
      if (Object.hasOwnProperty.call(this._allReward, key)) {
        let info: OfferRewardTemplate = this._allReward[key];
        if (info && info.Type == 3) {
          this._unfinishedTaskArr.push(info);
        }
      }
    }
  }

  public getOfferTemplete(): RingTask {
    let task: RingTask;
    let temp: OfferRewardTemplate;
    let level: number = ArmyManager.Instance.thane.grades;
    for (let i: number = 0; i < this._unfinishedTaskArr.length; i++) {
      temp = this._unfinishedTaskArr[i] as OfferRewardTemplate;
      if (level >= temp.NeedMinLevel && level < temp.NeedMaxLevel) {
        task = new RingTask();
        task.ringTaskTemp = temp;
        task.currTaskId = temp.TemplateId;
        task.rewardGoodsList = this.getRewardGoods(200);
        return task;
      }
    }
    return task;
  }

  private initEvent() {
    ServerDataManager.listen(
      S2CProtocol.U_C_REPEAT_REWARD_FINISH,
      this,
      this.__finishTaskHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_REPEAT_REWARD_UPDATE,
      this,
      this.__refreshTaskHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_REPEAT_REWARD_END,
      this,
      this.__finishAllTaskHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_REPEAT_REWARD_FNISHED_SUM_UPDATE,
      this,
      this.__refreshRingNumHandler,
    );
  }

  /** S_C 完成本次环任务的 */
  private __finishTaskHandler(e: SLGSocketEvent) {
    //派发完成任务可以提交的消息
  }

  /** S_C 刷新环任务 */
  private __refreshTaskHandler(pkg: PackageIn) {
    let msg: RewardUpdatedRspMsg = pkg.readBody(
      RewardUpdatedRspMsg,
    ) as RewardUpdatedRspMsg;
    let len: number = msg.reward.length;
    let ringTask: RingTask;
    for (let i: number = 0; i < len; i++) {
      let rewardInfo: RewardInfo = <RewardInfo>msg.reward[i];
      if (this.model.hasAccessList[rewardInfo.templateId]) {
        //判断在已经接取的任务列表中是否存在rewardInfo
        //存在
        ringTask = this.model.hasAccessList[rewardInfo.templateId];
        ringTask.isNew = false;
        if (rewardInfo.isComplete) {
          //判断是否完成
          if (ringTask) ringTask.removeConditionListener();
          this.model.hasAccessList.del(rewardInfo.templateId);
          this.dispatchEvent(RingTaskEvent.COMPLETETASK, ringTask);
        } else {
          ringTask.changeDate =
            PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond;
          this.model.hasAccessList[rewardInfo.templateId].currTask = rewardInfo;
        }
      } else {
        ringTask = new RingTask(); //创建一个新的任务对象 添加监听
        ringTask.currTaskId = rewardInfo.templateId;
        ringTask.ringTaskTemp = this.getRewardTempByTempId(
          rewardInfo.templateId,
        );
        ringTask.changeDate =
          PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond;
        ringTask.currTask = rewardInfo;
        this.model.hasAccessList.add(rewardInfo.templateId, ringTask);
        ringTask.addConditionListener();
        ringTask.isNew = true;
        if (this.model.rewardNum % 10 == 0) {
          //整数环
          ringTask.rewardGoodsList = this.getRewardGoods(this.model.rewardNum);
        }
        this.dispatchEvent(RingTaskEvent.ADDRINGTASK, ringTask);
        //通知任务追踪列表添加任务
      }
    }
    this.dispatchEvent(RingTaskEvent.REFRESHRING, ringTask);
  }

  /** S_C 本周环任务全完成 */
  private __finishAllTaskHandler(e: SLGSocketEvent) {}

  /** S_C 完成环任务数目的更新 */
  private __refreshRingNumHandler(pkg: PackageIn) {
    let msg: PropertyMsg = pkg.readBody(PropertyMsg) as PropertyMsg;
    this.model.rewardNum = msg.param1; //已经完成了多少环
    if (this.model.rewardNum > 200) {
      let task: RingTask = this.getOfferTemplete();
      this._defaultList.del(task.ringTaskTemp.TemplateId);
    } else {
      this._defaultList.clear();
      let grade: number = ArmyManager.Instance.thane.grades;
      if (grade < 35) return;
      let t: RingTask = this.getOfferTemplete();
      if (!t) return;
      t.ringTaskTemp.TitleLang = LangManager.Instance.GetTranslation(
        "managers.RingTaskManager.taskTitle",
      );

      if (grade >= 35 && grade < 45) {
        t.ringTaskTemp.RewardGold = 2000 * 200;
        // t.ringTaskTemp.RewardStrategy = 10000 * 200;
        t.ringTaskTemp.RewardPlayGP = 5000 * 200;
      } else if (grade >= 45 && grade < 55) {
        t.ringTaskTemp.RewardGold = 2400 * 200;
        // t.ringTaskTemp.RewardStrategy = 12000 * 200;
        t.ringTaskTemp.RewardPlayGP = 10000 * 200;
      } else if (grade >= 55 && grade < 65) {
        t.ringTaskTemp.RewardGold = 3000 * 200;
        // t.ringTaskTemp.RewardStrategy = 15000 * 200;
        t.ringTaskTemp.RewardPlayGP = 15000 * 200;
      } else if (grade >= 65 && grade < 100) {
        t.ringTaskTemp.RewardGold = 4000 * 200;
        // t.ringTaskTemp.RewardStrategy = 20000 * 200;
        t.ringTaskTemp.RewardPlayGP = 20000 * 200;
      }
      t.rewardGoodsList = this.getRewardGoods(10);
      this._defaultList.add(t.ringTaskTemp.TemplateId, t);
      this.dispatchEvent(RingTaskEvent.REFRESHRING, t);
    }
    if (this.model.rewardNum % 10 == 0) {
      //整数环
      let ringTask: RingTask = this.getRingTask();
      if (ringTask) {
        ringTask.rewardGoodsList = this.getRewardGoods(this.model.rewardNum);
      }
    }
  }

  /** C_S 接取环任务 */
  public accessRingTask() {
    SocketManager.Instance.send(C2SProtocol.C_TAKE_REPEAT_REWARD);
  }

  /** C_S 提交环任务 */
  public submitRingTask() {
    SocketManager.Instance.send(C2SProtocol.C_REPEAT_REWARD_FINISH);
  }

  /** C_S 立即完成环任务 */
  public CompletedImmediately(useBind: boolean = false) {
    let msg: PropertyMsg = new PropertyMsg();
    msg.param1 = useBind ? 0 : 1;
    SocketManager.Instance.send(
      C2SProtocol.C_REPEAT_REWARD_FINISH_IMMEDIATELY,
      msg,
    );
  }

  /** C_S通知服务端当前环任务(QTE,对话,打地鼠)变为可完成状态 */
  public updataState() {
    SocketManager.Instance.send(C2SProtocol.C_REPEAT_REWARD_UPDATE_FINISH);
  }

  /** 获取当前任务环的物品奖励  taskTemplateId 任务ID ringNum 环数 */
  public getRewardGoods(ringNum: number): any[] {
    let goodsList = TempleteManager.Instance.offerRewardGoodsTemplateList();
    let goodsArr: any[] = [];
    let grade: number = ArmyManager.Instance.thane.grades;
    for (let dicKey in goodsList) {
      if (goodsList.hasOwnProperty(dicKey)) {
        let offerRewardGoodsTemp: t_s_rewardgoodData = goodsList[dicKey];
        let ringArr: any[] =
          offerRewardGoodsTemp.RepeatStep.toString().split(",");
        if (this.getFlag(ringArr, ringNum)) {
          if (
            grade >= offerRewardGoodsTemp.RepeatMinLevel &&
            grade < offerRewardGoodsTemp.RepeatMaxLevel
          ) {
            let goods: GoodsInfo = new GoodsInfo();
            goods.templateId = offerRewardGoodsTemp.RewardItemID;
            goods.count = offerRewardGoodsTemp.RewardItemCount;
            goodsArr.push(goods);
          }
        }
      }
    }
    return goodsArr;
  }

  public getRewardGoodsTemp(ringTask: RingTask): any[] {
    let arr: any[] = [];
    if (ringTask) {
      let offerRewardGoods =
        TempleteManager.Instance.offerRewardGoodsTemplateList();
      let grade: number = ArmyManager.Instance.thane.grades;
      let task: RingTask = this.getRingTask();
      let num: number = task ? this.model.rewardNum : 200;
      for (let dicKey in offerRewardGoods) {
        if (offerRewardGoods.hasOwnProperty(dicKey)) {
          let offerRewardGoodsTemp: t_s_rewardgoodData =
            offerRewardGoods[dicKey];
          let ringArr: any[] =
            offerRewardGoodsTemp.RepeatStep.toString().split(",");
          if (this.getFlag(ringArr, num)) {
            if (
              grade >= offerRewardGoodsTemp.RepeatMinLevel &&
              grade < offerRewardGoodsTemp.RepeatMaxLevel
            ) {
              arr.push(offerRewardGoodsTemp);
            }
          }
        }
      }
    }
    return arr;
  }

  public getAllRingTaskGoodsReward(): any[] {
    let arr: any[] = [];
    let goodsList = TempleteManager.Instance.offerRewardGoodsTemplateList();
    let grade: number = ArmyManager.Instance.thane.grades;
    for (let dicKey in goodsList) {
      if (goodsList.hasOwnProperty(dicKey)) {
        let offerRewardGoodsTemp: t_s_rewardgoodData = goodsList[dicKey];
        let ringArr: any[] =
          offerRewardGoodsTemp.RepeatStep.toString().split(",");
        if (this.getFlag(ringArr, 10)) {
          if (
            grade >= offerRewardGoodsTemp.RepeatMinLevel &&
            grade < offerRewardGoodsTemp.RepeatMaxLevel
          ) {
            arr.push(offerRewardGoodsTemp);
          }
        }
        if (this.getFlag(ringArr, 50)) {
          if (
            grade >= offerRewardGoodsTemp.RepeatMinLevel &&
            grade < offerRewardGoodsTemp.RepeatMaxLevel
          ) {
            arr.push(offerRewardGoodsTemp);
          }
        }
        if (this.getFlag(ringArr, 200)) {
          if (
            grade >= offerRewardGoodsTemp.RepeatMinLevel &&
            grade < offerRewardGoodsTemp.RepeatMaxLevel
          ) {
            arr.push(offerRewardGoodsTemp);
          }
        }
      }
    }
    return arr;
  }

  /**
   *通过模板ID取得悬赏任务模板
   * @param tempId
   * @return
   *
   */
  public getRewardTempByTempId(tempId: number): OfferRewardTemplate {
    return this._allReward[tempId];
  }

  private getFlag(arr: any[], num: number): boolean {
    for (let i: number = 0; i < arr.length; i++) {
      if (arr[i] == num) {
        return true;
      }
    }
    return false;
  }

  /** 获取当前的环任务 */
  public getRingTask(): RingTask {
    let dic: SimpleDictionary = this.model.hasAccessList;
    for (let index = 0; index < dic.keys.length; index++) {
      let key = dic.keys[index];
      let p: RingTask = dic[key];
      return p;
    }
    return null;
  }

  public getRingTaskType(): number {
    let condition: t_s_rewardcondictionData = this.getCurrCondition();
    if (!condition) return -10;
    return condition.CondictionType;
  }

  public getCurrCondition(): t_s_rewardcondictionData {
    let task: RingTask = this.getRingTask();
    if (!task) return null;
    let arr: any[] = task.conditionList;
    let condition: t_s_rewardcondictionData = arr[0];
    return condition;
  }

  /** 获取对话任务的NPC节点 */
  public getTalkTaskNPCNode(): number {
    let ringTask: RingTask = this.getRingTask();
    if (!ringTask) {
      return -100;
    }
    let arr: any[] = ringTask.ringTaskTemp.conditionList;
    let condition: t_s_rewardcondictionData = arr[0];
    if (condition.CondictionType == RewardConditionType.TALKTASK) {
      //对话任务
      return condition.Para1;
    }
    return -100;
  }

  public hasTaskAndNotCompleted(id: number): boolean {
    let ringTask: RingTask = this.getRingTask();
    if (!ringTask) return false;
    if (id == ringTask.ringTaskTemp.TemplateId) {
      return !ringTask.isCompleted;
    }
    return false;
  }

  public static get Instance(): RingTaskManager {
    if (!RingTaskManager._instance)
      RingTaskManager._instance = new RingTaskManager();
    return RingTaskManager._instance;
  }
}
