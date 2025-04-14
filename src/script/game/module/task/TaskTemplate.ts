//@ts-expect-error: External dependencies
import GameEventDispatcher from "../../../core/event/GameEventDispatcher";
import { SimpleDictionary } from "../../../core/utils/SimpleDictionary";
import {
  ServiceReceiveEvent,
  FriendUpdateEvent,
  NotificationEvent,
  ArmyEvent,
  RuneEvent,
  TaskEvent,
  DictionaryEvent,
  ConsortiaEvent,
} from "../../constant/event/NotificationEvent";
import { PlayerEvent } from "../../constant/event/PlayerEvent";
import { ArmyPawn } from "../../datas/ArmyPawn";
import { PlayerInfo } from "../../datas/playerinfo/PlayerInfo";
import { PlayerModel } from "../../datas/playerinfo/PlayerModel";
import { ThaneInfo } from "../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../manager/ArmyManager";
import { FriendManager } from "../../manager/FriendManager";
import { GoodsManager } from "../../manager/GoodsManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { TempleteManager } from "../../manager/TempleteManager";
import BuildingManager from "../../map/castle/BuildingManager";
import { BuildInfo } from "../../map/castle/data/BuildInfo";
import { BuildingEvent } from "../../map/castle/event/BuildingEvent";
import { TaskInfo } from "./TaskInfo";
import LangManager from "../../../core/lang/LangManager";
import { t_s_questcondictionData } from "../../config/t_s_questcondiction";
import { t_s_questgoodData } from "../../config/t_s_questgood";
import { TaskManage } from "../../manager/TaskManage";
import { ConsortiaManager } from "../../manager/ConsortiaManager";
import { ConsortiaInfo } from "../consortia/data/ConsortiaInfo";
import { ConsortiaModel } from "../consortia/model/ConsortiaModel";
import Logger from "../../../core/logger/Logger";
export class TaskTemplate extends GameEventDispatcher {
  public TemplateId: number = 0;
  public TemplateType: number = 0;
  public TitleLang: string = "";
  public DetailLang: string = "";
  public Objective: string = "";
  public NeedFightId: number = 0;
  public NeedBuildingTemp: number = 0;
  public NeedItemTemp: number = 0;
  public NeedPos: number = 0;
  public NeedMinLevel: number = 0;
  public NeedMaxLevel: number = 0;
  public PreQuestId: string = "";
  public IsLeague: boolean = false; //是否有公会
  public IsAuto: boolean = false;
  public IsRepeat: boolean = false;
  public IsLost: boolean = false;
  public RepeatInterval: number = 0;
  public RepeatMax: number = 0;
  public RewardPlayGP: number = 0;
  public RewardHeroGP: number = 0;
  public RewardGold: number = 0;
  public RewardCrystal: number = 0;
  public RewardDower: number = 0;
  public RewardMoney: number = 0;
  public RewardStrategy: number = 0;
  public RewardConsortiaOffer: number = 0;
  public RewardPlayerOffer: number = 0;
  public StartDate: string = "";
  public EndDate: string = "";
  public WeekSpace: string = "";
  public HourSpace: string = "";
  public Sort: number = 0;
  public changeDate: number = 0;
  public ShowType: number = 0;
  public finishStory: boolean = false;
  private _rewardItemList: any[];
  private _conditionList: any[];
  public isRequired: boolean = false;
  public isNew: boolean = false;
  public hasCompleted: boolean = false;
  /**
   * 服务器同步过来的任务完成进度数据
   */
  public taskInfo: TaskInfo;
  public sortFlag: boolean = false;

  constructor(data?: object) {
    super();
    for (let i in data) {
      this[i] = data[i];
    }
    this.TitleLang = data["TitleLang"];
    this.DetailLang = data["DetailLang"];
  }

  public initTask() {
    this.addGoodList();
    this.addConditionList();
  }

  private addGoodList() {
    var goodList = TempleteManager.Instance.taskGoodTemplateList();
    for (let dicKey in goodList) {
      if (goodList.hasOwnProperty(dicKey)) {
        let temp: t_s_questgoodData = goodList[dicKey];
        if (temp.TemplateId == this.TemplateId) {
          this.addRewardItem(temp);
        }
      }
    }
  }

  private addConditionList() {
    var conditionList = TempleteManager.Instance.taskCondictionInfoList();
    for (let dicKey in conditionList) {
      if (conditionList.hasOwnProperty(dicKey)) {
        let condition: t_s_questcondictionData = conditionList[dicKey];
        if (condition.TemplateId == this.TemplateId) {
          this.addCondition(condition);
        }
      }
    }
  }

  /**
   * 添加任务奖励的物品
   * @param reward
   *
   */
  private addRewardItem(reward: t_s_questgoodData) {
    if (!this._rewardItemList) this._rewardItemList = [];
    this._rewardItemList.push(reward);
  }

  /**
   * 添加任务条件
   * @param condition
   *
   */
  private addCondition(condition: t_s_questcondictionData) {
    if (!this._conditionList) this._conditionList = [];
    this._conditionList.push(condition);
  }

  /**
   * 任务进度本地监听
   *
   */
  public addConditionListener() {
    for (let key in this._conditionList) {
      if (Object.prototype.hasOwnProperty.call(this._conditionList, key)) {
        let condition = this._conditionList[key];
        this.addListenerTo(condition);
      }
    }
  }

  public removeEvent() {
    this.thane.removeEventListener(
      PlayerEvent.THANE_LEVEL_UPDATE,
      this.__taskChangeHandler,
      this,
    );
    this.consortiaInfo.removeEventListener(
      ConsortiaEvent.CONSORTIA_OFFER_CHANGE,
      this.__taskChangeHandler,
      this,
    );
    this.playerInfo.removeEventListener(
      PlayerEvent.PLAYER_INFO_UPDATE,
      this.__taskChangeHandler,
      this,
    );
    BuildingManager.Instance.removeEventListener(
      BuildingEvent.BUILDING_UPGRADE_RECEIVE,
      this.__taskChangeHandler,
      this,
    );
    ArmyManager.Instance.removeEventListener(
      ServiceReceiveEvent.UPGRADE_PAWN_SUCCESS,
      this.__taskChangeHandler,
      this,
    );
    FriendManager.getInstance().removeEventListener(
      FriendUpdateEvent.ADD_FRIEND,
      this.__taskChangeHandler,
      this,
    );
    FriendManager.getInstance().removeEventListener(
      FriendUpdateEvent.REMOVE_FRIEND,
      this.__taskChangeHandler,
      this,
    );
    this.goodsCountByTempId.removeEventListener(
      DictionaryEvent.ADD,
      this.__goodsCountChangeEvent,
      this,
    );
    this.goodsCountByTempId.removeEventListener(
      DictionaryEvent.DELETE,
      this.__goodsCountChangeEvent,
      this,
    );
    this.goodsCountByTempId.removeEventListener(
      DictionaryEvent.UPDATE,
      this.__goodsCountChangeEvent,
      this,
    );
    ArmyManager.Instance.removeEventListener(
      ArmyEvent.SORT_PAWN,
      this.__taskChangeHandler,
      this,
    );
    PlayerManager.Instance.removeEventListener(
      ServiceReceiveEvent.TRANSEFER_CASTLE_SUCCESS,
      this.__taskChangeHandler,
      this,
    );
    this.playerModel.towerInfo1.removeEventListener(
      PlayerEvent.UPDATE_TOWER_INFO,
      this.__taskChangeHandler,
      this,
    );
    this.playerModel.removeEventListener(
      PlayerEvent.SYSTIME_UPGRADE_DATE,
      this.__taskChangeHandler,
      this,
    );
    this.consortiaModel.removeEventListener(
      ConsortiaEvent.UPDA_CONSORTIA_INFO,
      this.__taskChangeHandler,
      this,
    );
  }

  /**
   * 客户端监听改变任务的事件
   * @param condition
   *
   */
  private addListenerTo(condition: t_s_questcondictionData) {
    switch (condition.CondictionType) {
      case 1: //领主等级
        this.thane.addEventListener(
          PlayerEvent.THANE_LEVEL_UPDATE,
          this.__taskChangeHandler,
          this,
        );
        break;
      case 2: //建筑/科技等级
        BuildingManager.Instance.addEventListener(
          BuildingEvent.BUILDING_UPGRADE_RECEIVE,
          this.__taskChangeHandler,
          this,
        );
        break;
      case 10: //兵种升级
        ArmyManager.Instance.addEventListener(
          ServiceReceiveEvent.UPGRADE_PAWN_SUCCESS,
          this.__taskChangeHandler,
          this,
        );
        break;
      case 21: //添加好友
        FriendManager.getInstance().addEventListener(
          FriendUpdateEvent.ADD_FRIEND,
          this.__taskChangeHandler,
          this,
        );
        FriendManager.getInstance().addEventListener(
          FriendUpdateEvent.REMOVE_FRIEND,
          this.__taskChangeHandler,
          this,
        );
        break;
      case 22: //加入工会, 退出工会,检测是否还能完成
        this.playerInfo.addEventListener(
          PlayerEvent.PLAYER_INFO_UPDATE,
          this.__taskChangeHandler,
          this,
        );
        break;
      case 23: //新手进度
        break;
      case 27: //收集士兵掉落物品
        this.goodsCountByTempId.addEventListener(
          DictionaryEvent.ADD,
          this.__goodsCountChangeEvent,
          this,
        );
        this.goodsCountByTempId.addEventListener(
          DictionaryEvent.DELETE,
          this.__goodsCountChangeEvent,
          this,
        );
        this.goodsCountByTempId.addEventListener(
          DictionaryEvent.UPDATE,
          this.__goodsCountChangeEvent,
          this,
        );
        break;
      case 28: //收集英雄掉落物品
        this.goodsCountByTempId.addEventListener(
          DictionaryEvent.ADD,
          this.__goodsCountChangeEvent,
          this,
        );
        this.goodsCountByTempId.addEventListener(
          DictionaryEvent.DELETE,
          this.__goodsCountChangeEvent,
          this,
        );
        this.goodsCountByTempId.addEventListener(
          DictionaryEvent.UPDATE,
          this.__goodsCountChangeEvent,
          this,
        );
        break;
      case 29: //工会贡献
        this.consortiaInfo.addEventListener(
          ConsortiaEvent.CONSORTIA_OFFER_CHANGE,
          this.__taskChangeHandler,
          this,
        );
        break;
      case 32: //采集物品
        this.goodsCountByTempId.addEventListener(
          DictionaryEvent.ADD,
          this.__goodsCountChangeEvent,
          this,
        );
        this.goodsCountByTempId.addEventListener(
          DictionaryEvent.DELETE,
          this.__goodsCountChangeEvent,
          this,
        );
        this.goodsCountByTempId.addEventListener(
          DictionaryEvent.UPDATE,
          this.__goodsCountChangeEvent,
          this,
        );
        break;
      case 34: //队形调整
        ArmyManager.Instance.addEventListener(
          ArmyEvent.SORT_PAWN,
          this.__taskChangeHandler,
          this,
        );
        break;
      case 37: //地图传送
        PlayerManager.Instance.addEventListener(
          ServiceReceiveEvent.TRANSEFER_CASTLE_SUCCESS,
          this.__taskChangeHandler,
          this,
        );
      case 38: //地下迷宫
        this.playerModel.towerInfo1.addEventListener(
          PlayerEvent.UPDATE_TOWER_INFO,
          this.__taskChangeHandler,
          this,
        );
        break;
      case 39: //二次登录
        this.playerModel.addEventListener(
          PlayerEvent.SYSTIME_UPGRADE_DATE,
          this.__taskChangeHandler,
          this,
        );
        break;
      case 49: //采集物品
        this.goodsCountByTempId.addEventListener(
          DictionaryEvent.ADD,
          this.__goodsCountChangeEvent,
          this,
        );
        this.goodsCountByTempId.addEventListener(
          DictionaryEvent.DELETE,
          this.__goodsCountChangeEvent,
          this,
        );
        this.goodsCountByTempId.addEventListener(
          DictionaryEvent.UPDATE,
          this.__goodsCountChangeEvent,
          this,
        );
        break;
      case 51: //公会养成任务
        this.consortiaModel.addEventListener(
          ConsortiaEvent.UPDA_CONSORTIA_INFO,
          this.__taskChangeHandler,
          this,
        );
        break;
      case 76: //符文学习
        NotificationManager.Instance.addEventListener(
          RuneEvent.RUNE_UPGRADE,
          this.__taskChangeHandler,
          this,
        );
        break;
      case 78: //符文升级
        NotificationManager.Instance.addEventListener(
          RuneEvent.RUNE_UPGRADE,
          this.__taskChangeHandler,
          this,
        );
        break;
    }
  }

  private get consortiaModel(): ConsortiaModel {
    return ConsortiaManager.Instance.model;
  }
  private get consortiaInfo(): ConsortiaInfo {
    return this.consortiaModel.consortiaInfo;
  }

  private __goodsCountChangeEvent(arr: any[]) {
    var len: number = this._conditionList.length;
    for (var i: number = 0; i < len; i++) {
      var cond: t_s_questcondictionData = this._conditionList[i];
      var str: string;
      switch (cond.CondictionType) {
        case 27: //收集士兵掉落物品
        case 28: //收集boss掉落物品
        case 32: //收集boss掉落物品
        case 49: //收集boss掉落物品
          if (arr && cond.Para1 == arr[2]) {
            this.commit();
            return;
          }
      }
    }
  }

  private __taskChangeHandler(e: Event) {
    this.commit();
  }

  public commit() {
    this.changeDate =
      PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond;
    if (!this.taskInfo.isComplete && !this.hasCompleted) {
      this.hasCompleted = this.isCompleted;
      //对事件进行分帧处理,测试方案
      // TaskManage.Instance.dispatchEvent(TaskEvent.TASK_DETAIL_CHANGE, this);
      Laya.timer.callLater(
        TaskManage.Instance,
        TaskManage.Instance.dispatchEvent,
        [TaskEvent.TASK_DETAIL_CHANGE, this],
      );
    }
    if (!this.isCompleted && this.hasCompleted) {
      this.hasCompleted = false;
      // TaskManage.Instance.dispatchEvent(TaskEvent.TASK_DETAIL_CHANGE, this);
      Laya.timer.callLater(
        TaskManage.Instance,
        TaskManage.Instance.dispatchEvent,
        [TaskEvent.TASK_DETAIL_CHANGE, this],
      );
    }
    // this.dispatchEvent(TaskEvent.TASK_DETAIL_CHANGE, this);
    Laya.timer.callLater(this, this.dispatchEvent, [
      TaskEvent.TASK_DETAIL_CHANGE,
      this,
    ]);
  }

  /**
   * 任务ID
   */
  public get taskId(): number {
    return this.taskInfo ? this.taskInfo.taskId : -1;
  }

  /**
   * 是否完成
   * @return
   *
   */
  public get isCompleted(): boolean {
    if (this.isAchieved) {
      return false;
    }
    var progress: any[] = this.getProgress();
    for (var i: number = 0; this._conditionList[i] != null; i++) {
      if (
        progress[i] !=
        LangManager.Instance.GetTranslation(
          "buildings.offerreward.data.BaseOfferReward.progress",
        )
      ) {
        return false;
      }
    }
    return true;
  }
  /**
   * 是否过期
   * @return
   *
   */
  public get isAchieved(): boolean {
    if (!this.taskInfo || !this.taskInfo.isAchieved) {
      return false;
    }
    return true;
  }
  /**
   * 是否可用
   * @return
   *
   */
  public get isAvailable(): boolean {
    if (!this.isAchieved) {
      //从未完成->true
      return true;
    }
    if (!this.IsRepeat) {
      //不可重复完成->false
      return false;
    }
    return true;
  }
  /**
   * 任务进度
   * @return
   *
   */
  public getProgress(): any[] {
    var tempArr: any[] = [];
    var len: number = this._conditionList.length;
    for (var i: number = 0; i < len; i++) {
      var cond: t_s_questcondictionData = this._conditionList[i];
      var str: string;
      switch (cond.CondictionType) {
        case 1: //领主等级级
          str = this.checkPlayerGrades(cond);
          break;
        case 2: //建筑/科技等级（参数1是sontype, 参数2是所需等级）
          str = this.checkBuildingOrTecGrades(cond);
          break;
        case 3: //招募兵种 兵种ID	数量
          str = this.checkCount(cond, i);
          break;
        case 4: //招募英雄 最小品质	数量
          str = this.checkCount(cond, i);
          break;
        case 5: //英雄等级(参数1是所拥有的最高等级:0表示所有英雄最高等级 1表示战士最高等级 2表示弓手最高等级 3表示法师最高等级, 参数2是需要达到的最高等级)
          str = this.checkHeroGrades(cond);
          break;
        case 6: //拥有英雄(参数1是最小品质, 参数2是数量)
          break;
        case 7: //占领野矿(参数1野矿sontype	参数2数量)
          str = this.checkWilanCount(cond, i);
          break;
        case 8: //对玩家战斗   0表示不限输赢 1表示需要胜利	场数
          str = this.checkCount(cond, i);
          break;
        case 9:
          str = this.checkCount(cond, i);
          break;
        case 10: //兵种升级  (参数1兵种ID	 参数2:等级）
          str = this.checkPawnGrades(cond);
          break;
        case 11:
          str = this.checkCount(cond, i);
          break;
        case 12:
          str = this.checkCount(cond, i);
          break;
        case 13:
          str = this.checkCount(cond, i);
          break;
        case 14:
          str = this.checkCount(cond, i);
          break;
        case 15: //击杀大地图特定怪物
          str = this.checkCount(cond, i);
          break;
        case 16: //竞技场战斗（人数次数）
          str = this.checkCount(cond, i);
          break;
        case 17: //强化指定装备（songtype 等级）
          str = this.checkCount(cond, i);
          break;
        case 18: //镶嵌指定品级宝石（品级次数）
          str = this.checkCount(cond, i);
          break;
        case 19: //合成指定物品, （模板id, 次数）
          str = this.checkCount(cond, i);
          break;
        case 20: //浇水（次数）
          str = this.checkCount(cond, i);
          break;
        case 21: //好友达到指定人数（次数）
          str = this.checkFriendsCount(cond);
          break;
        case 22: //加入工会(次数)
          str = this.checkJoinConsortia();
          break;
        case 23: //新手进度（次数） 废弃, 新手改版, 不通过新手进度来判断任务是否完成
          str = this.checkAttack(cond);
          break;
        case 24: //通过指定副本节点（副本节点id）
          str = this.checkCount(cond, i);
          break;
        case 25: //杀死兵种
          str = this.checkCount(cond, i);
          break;
        case 26: //杀死英雄
          str = this.checkCount(cond, i);
          break;
        case 27: //收集士兵掉落物品
          str = this.checkGoodsCount(cond);
          break;
        case 28: //收集boss掉落物品
          str = this.checkGoodsCount(cond);
          break;
        case 29: //工会贡献
          str = this.checkConsortiaOffer(cond);
          break;
        case 30: //工会祈福
          str = this.checkCount(cond, i);
          break;
        case 31: //通关战役
          str = this.checkCount(cond, i);
          break;
        case 32: //采集物品
          str = this.checkGoodsCount(cond);
          break;
        case 33: //登陆器登陆
          str = this.checkClientLogin();
          break;
        case 34: //阵型调整
          str = this.checkSortPawn();
          break;
        case 35: //离线挑战
          str = this.checkCount(cond, i);
          break;
        case 36: //占星
          str = this.checkCount(cond, i);
          break;
        case 37: //大地图传送
          str = this.checkMapId(cond);
          break;
        case 38: //地下迷宫
          str = this.checkMazeRecord(cond);
          break;
        case 39: //二次登录
          str = this.checkSencondLogin(cond);
          break;
        case 40: //攻击世界boss
          str = this.checkCount(cond, i);
          break;
        case 41: //征收
          str = this.checkCount(cond, i);
          break;
        case 42: //攻击世界boss
          str = this.checkCount(cond, i);
          break;
        case 43: //充值
          str = this.checkCount(cond, i);
          break;
        case 44: //阵营战
          str = this.checkCount(cond, i);
          break;
        case 45: //阵营战击杀人数
          str = this.checkCount(cond, i);
          break;
        case 46: //装备分解
          str = this.checkCount(cond, i);
          break;
        case 47: //装备洗练
          str = this.checkCount(cond, i);
          break;
        case 48: //手机验证
          str = this.checkCount(cond, i);
          break;
        case 49: //采集物品
          str = this.checkGoodsCount(cond);
          break;
        case 50: //阵营战胜利次数
          str = this.checkCount(cond, i);
          break;
        case 51: //公会养成任务
          str = this.checkConsortuaGrade(cond);
          break;
        case 52: //兵种特性领悟
          str = this.checkCount(cond, i);
          break;
        case 53: //星运锁定
          str = this.checkCount(cond, i);
          break;
        case 54: //悬赏任务完成次数
          str = this.checkCount(cond, i);
          break;
        case 55: //用户活跃度
          str = this.checkCount(cond, i);
          break;
        case 56: //拍卖物品
          str = this.checkCount(cond, i);
          break;
        case 57: //科技轮盘操作
          str = this.checkCount(cond, i);
          break;
        case 58: //使用宝石（灵魂刻印）
          str = this.checkCount(cond, i);
          break;
        case 59: //农场种植
          str = this.checkCount(cond, i);
          break;
        case 60: //农场收获（0 别人 1 自己）
          str = this.checkCount(cond, i);
          break;
        case 61: //农场驱虫除草（1驱虫2除草）
          str = this.checkCount(cond, i);
          break;
        case 62: //野外PK （0参与,1胜利）
          str = this.checkCount(cond, i);
          break;
        case 63: //类型63: VIP用户活跃度
          str = this.checkCount(cond, i);
          break;
        case 64: //类型64: 炼金
          str = this.checkCount(cond, i);
          break;
        case 65: //类型65: VIP用户活跃度
          str = this.checkCount(cond, i);
          break;
        case 66: //类型66: 世界BOSS复活
          str = this.checkCount(cond, i);
          break;
        case 67: //类型67: 世界BOSS替身
          str = this.checkCount(cond, i);
          break;
        case 68: //类型68: 农场加速
          str = this.checkCount(cond, i);
          break;
        case 69: //类型69: 悬赏手动刷新
          str = this.checkCount(cond, i);
          break;
        case 70: //类型70: 神秘商店手动刷新
          str = this.checkCount(cond, i);
          break;
        case 71: //类型71: 坐骑培养
          str = this.checkCount(cond, i);
          break;
        case 72: //类型72: 购买掠夺
          str = this.checkCount(cond, i);
          break;
        case 74: //类型74: 试炼之塔
          str = this.checkCount(cond, i);
          break;
        case 75: //消耗一定数量的灵魂水晶
          str = this.checkCount(cond, i);
          break;
        case 76: //类型76: 符文学习
          str = this.checkRuneStudy(cond, i);
          break;
        case 77: //类型77: 符文书吞噬
          str = this.checkCount(cond, i);
          break;
        case 78: //类型78: 符文升级
          str = this.checkRuneGrade(cond, i);
          break;
        case 79: //参与载具
          str = this.checkCount(cond, i);
          break;
        case 80: //载具胜利
          str = this.checkCount(cond, i);
          break;
        case 81: //载具数量
          str = this.checkCount(cond, i);
          break;
        case 82: //钻石消费(不含拍卖场)
          str = this.checkCount(cond, i);
          break;
        case 85: //了解英灵
          str = this.checkFinishPetStory();
          break;
        case 86: //紫晶矿场
          str = this.checkCount(cond, i);
        case 87: //英灵竞技
          str = this.checkCount(cond, i);
          break;
        case 88: //获得一只英灵
          str = this.checkCount(cond, i);
          break;
        case 89: //参与藏宝图战斗
          str = this.checkCount(cond, i);
          break;
        case 90: //镶嵌守护水晶
          str = this.checkCount(cond, i);
          break;
        case 91: //寻宝之轮
          str = this.checkCount(cond, i);
          break;
        case 92: //挑战之路
          str = this.checkChallengeSelf(cond, i);
          break;
        case 93: //天穹之径
          str = this.checkCount(cond, i);
          break;
        case 94: //拥有某件宝石
          str = this.checkCount(cond, i);
          break;
        case 95: //任意装备强化到某个等级
          str = this.checkCount(cond, i);
          break;
        case 96: //任意装备强化到某个等级
          str = this.checkCount(cond, i);
          break;
        default:
          str = LangManager.Instance.GetTranslation(
            "buildings.offerreward.data.BaseOfferReward.progress",
          );
          break;
      }
      tempArr[i] = str;
    }
    return tempArr;
  }

  private checkChallengeSelf(
    condition: t_s_questcondictionData,
    index: number,
  ): string {
    if (this.taskInfo) {
      if (this.taskInfo["condition" + (index + 1)] >= condition.Para2) {
        return LangManager.Instance.GetTranslation(
          "buildings.offerreward.data.BaseOfferReward.progress",
        );
      }
      return LangManager.Instance.GetTranslation(
        "buildings.offerreward.data.BaseOfferReward.progress01",
      );
    }
    return "";
  }

  private checkFinishPetStory(): string {
    if (this.finishStory) {
      return LangManager.Instance.GetTranslation(
        "buildings.offerreward.data.BaseOfferReward.progress",
      );
    }
    return LangManager.Instance.GetTranslation(
      "buildings.offerreward.data.BaseOfferReward.progress01",
    );
  }

  private checkSencondLogin(condition: t_s_questcondictionData): string {
    var nowDate: number = new Date(
      this.playerModel.sysCurTimeBySecond * 1000,
    ).getDate();
    var accepteDate: number = this.taskInfo.acceptDate.getDate();
    if (accepteDate != nowDate)
      return LangManager.Instance.GetTranslation(
        "buildings.offerreward.data.BaseOfferReward.progress",
      );
    return LangManager.Instance.GetTranslation(
      "buildings.offerreward.data.BaseOfferReward.progress01",
    );
  }

  private checkConsortuaGrade(condition: t_s_questcondictionData): string {
    let value: number = parseInt(condition.Para1);
    Logger.xjy("TaskTemplate value = " + value);
    switch (value) {
      case 1: //.公会
        if (condition.Para2 > this.consortiaInfo.levels)
          return LangManager.Instance.GetTranslation(
            "buildings.offerreward.data.BaseOfferReward.progress01",
          );
        else
          return LangManager.Instance.GetTranslation(
            "buildings.offerreward.data.BaseOfferReward.progress",
          );
        break;
      case 2: //.公会商店
        if (condition.Para2 > this.consortiaInfo.shopLevel)
          return LangManager.Instance.GetTranslation(
            "buildings.offerreward.data.BaseOfferReward.progress01",
          );
        else
          return LangManager.Instance.GetTranslation(
            "buildings.offerreward.data.BaseOfferReward.progress",
          );
        break;
      case 3: //.祭坛
        if (condition.Para2 > this.consortiaInfo.altarLevel)
          return LangManager.Instance.GetTranslation(
            "buildings.offerreward.data.BaseOfferReward.progress01",
          );
        else
          return LangManager.Instance.GetTranslation(
            "buildings.offerreward.data.BaseOfferReward.progress",
          );
        break;
      case 4: //.技能研究所
        if (condition.Para2 > this.consortiaInfo.schoolLevel)
          return LangManager.Instance.GetTranslation(
            "buildings.offerreward.data.BaseOfferReward.progress01",
          );
        else
          return LangManager.Instance.GetTranslation(
            "buildings.offerreward.data.BaseOfferReward.progress",
          );
        break;
      case 5: //.保管箱
        if (condition.Para2 > this.consortiaInfo.storeLevel)
          return LangManager.Instance.GetTranslation(
            "buildings.offerreward.data.BaseOfferReward.progress01",
          );
        else
          return LangManager.Instance.GetTranslation(
            "buildings.offerreward.data.BaseOfferReward.progress",
          );
        break;
    }
    return LangManager.Instance.GetTranslation(
      "buildings.offerreward.data.BaseOfferReward.progress01",
    );
  }

  private checkMazeRecord(condition: t_s_questcondictionData): string {
    if (this.playerModel.towerInfo1.maxIndex >= condition.Para2) {
      return LangManager.Instance.GetTranslation(
        "buildings.offerreward.data.BaseOfferReward.progress",
      );
    }
    return LangManager.Instance.GetTranslation(
      "buildings.offerreward.data.BaseOfferReward.progress01",
    );
  }

  private checkMapId(condition: t_s_questcondictionData): string {
    if (this.playerModel.mapNodeInfo.info.mapId == condition.Para2)
      return LangManager.Instance.GetTranslation(
        "buildings.offerreward.data.BaseOfferReward.progress",
      );
    return LangManager.Instance.GetTranslation(
      "buildings.offerreward.data.BaseOfferReward.progress01",
    );
  }

  private checkSortPawn(): string {
    if (ArmyManager.Instance.isSorted)
      return LangManager.Instance.GetTranslation(
        "buildings.offerreward.data.BaseOfferReward.progress",
      );
    return LangManager.Instance.GetTranslation(
      "buildings.offerreward.data.BaseOfferReward.progress01",
    );
  }

  private checkAttack(condition: t_s_questcondictionData): string {
    return "";
    // if (PlayerManager.Instance.newbieProcess > parseInt(condition.Para1)) return LangManager.Instance.GetTranslation("buildings.offerreward.data.BaseOfferReward.progress")
    // return LangManager.Instance.GetTranslation("buildings.offerreward.data.BaseOfferReward.progress01");
  }

  private checkGoodsCount(condition: t_s_questcondictionData): string {
    var count: number = GoodsManager.Instance.getGoodsNumByTempId(
      parseInt(condition.Para1),
    );
    if (count >= condition.Para2)
      return LangManager.Instance.GetTranslation(
        "buildings.offerreward.data.BaseOfferReward.progress",
      );
    return " (" + count + "/" + condition.Para2 + ")";
  }

  private checkConsortiaOffer(condition: t_s_questcondictionData): string {
    if (this.playerInfo.consortiaID <= 0) return " (0/" + condition.Para2 + ")";
    if (this.playerInfo.consortiaTotalOffer >= condition.Para2)
      return LangManager.Instance.GetTranslation(
        "buildings.offerreward.data.BaseOfferReward.progress",
      );
    return (
      " (" + this.playerInfo.consortiaTotalOffer + "/" + condition.Para2 + ")"
    );
  }

  private checkClientLogin(): string {
    return LangManager.Instance.GetTranslation(
      "buildings.offerreward.data.BaseOfferReward.progress01",
    );
  }
  private get playerModel(): PlayerModel {
    return PlayerManager.Instance.currentPlayerModel;
  }
  private get playerInfo(): PlayerInfo {
    return this.playerModel.playerInfo;
  }
  private get thane(): ThaneInfo {
    return ArmyManager.Instance.thane;
  }
  private get goodsCountByTempId(): SimpleDictionary {
    return GoodsManager.Instance.goodsCountByTempId;
  }
  /**
   * 加入工会
   *
   */
  private checkJoinConsortia(): string {
    if (this.playerInfo.consortiaID > 0)
      return LangManager.Instance.GetTranslation(
        "buildings.offerreward.data.BaseOfferReward.progress",
      );
    else
      return LangManager.Instance.GetTranslation(
        "buildings.offerreward.data.BaseOfferReward.progress01",
      );
  }
  /**
   * 好友达到指定人数
   * @param condition
   * @return
   *
   */
  private checkFriendsCount(condition: t_s_questcondictionData): string {
    var count: number = FriendManager.getInstance().friendList.getList().length;
    if (count >= condition.Para2) {
      return LangManager.Instance.GetTranslation(
        "buildings.offerreward.data.BaseOfferReward.progress",
      );
    } else {
      return " (" + count + "/" + condition.Para2 + ")";
    }
  }

  private checkPlayerGrades(condition: t_s_questcondictionData): string {
    if (this.thane.grades >= condition.Para2) {
      return LangManager.Instance.GetTranslation(
        "buildings.offerreward.data.BaseOfferReward.progress",
      );
    }
    return " (" + this.thane.grades + "/" + condition.Para2 + ")";
  }
  private checkBuildingOrTecGrades(condition: t_s_questcondictionData): string {
    var building: BuildInfo = BuildingManager.Instance.getBuildingInfoBySonType(
      parseInt(condition.Para1),
    );
    if (building && building.templeteInfo.BuildingGrade >= condition.Para2) {
      return LangManager.Instance.GetTranslation(
        "buildings.offerreward.data.BaseOfferReward.progress",
      );
    }
    if (!building) {
      return " (0/" + condition.Para2 + ")";
    }
    return (
      "(" + building.templeteInfo.BuildingGrade + "/" + condition.Para2 + ")"
    );
  }
  private checkHeroGrades(condition: t_s_questcondictionData): string {
    var grade: number = condition.Para2;
    var current: number = 0;
    if (
      parseInt(condition.Para1) == 0 ||
      this.thane.templateInfo.Job == parseInt(condition.Para1)
    ) {
      if (this.thane.grades >= grade) {
        return LangManager.Instance.GetTranslation(
          "buildings.offerreward.data.BaseOfferReward.progress",
        );
      } else if (this.thane.grades > current) {
        current = this.thane.grades;
      }
    }
    return " (" + current + "/" + grade + ")";
  }
  private checkWilanCount(
    condition: t_s_questcondictionData,
    index: number,
  ): string {
    if (parseInt(this.taskInfo["condition" + (index + 1)]) >= condition.Para2) {
      return LangManager.Instance.GetTranslation(
        "buildings.offerreward.data.BaseOfferReward.progress",
      );
    } else
      return (
        " (" +
        this.taskInfo["condition" + (index + 1)] +
        "/" +
        condition.Para2 +
        ")"
      );
  }
  private checkPawnGrades(condition: t_s_questcondictionData): string {
    var list: any[] = ArmyManager.Instance.casernPawnList.getList();
    var current: number = 0;
    for (let i: number = 0; i < list.length; i++) {
      let basePawn: ArmyPawn = list[i];
      if (basePawn.templateInfo.MasterType == parseInt(condition.Para1)) {
        if (basePawn.templateInfo.Level >= condition.Para2) {
          return LangManager.Instance.GetTranslation(
            "buildings.offerreward.data.BaseOfferReward.progress",
          );
        } else if (basePawn.templateInfo.Level > current) {
          current = basePawn.templateInfo.Level;
        }
      }
    }
    return " (" + current + "/" + condition.Para2 + ")";
  }
  /**
   * 与taskInfo对比任务完成情况
   * @param condition
   * @param index
   * @return
   *
   */
  private checkCount(
    condition: t_s_questcondictionData,
    index: number,
  ): string {
    if (this.taskInfo) {
      if (this.taskInfo["condition" + (index + 1)] >= condition.Para2) {
        return LangManager.Instance.GetTranslation(
          "buildings.offerreward.data.BaseOfferReward.progress",
        );
      }
      return (
        " (" +
        this.taskInfo["condition" + (index + 1)] +
        "/" +
        condition.Para2 +
        ")"
      );
    }
    return "";
  }

  /**
   * 检查是否学习指定的符文, 或者学习指定数量的符文
   * @param condition
   * @param index
   * @return
   *
   */
  private checkRuneStudy(
    condition: t_s_questcondictionData,
    index: number,
  ): string {
    var currentCount: number = 0;
    if (this.taskInfo) {
      if (parseInt(condition.Para1) == 0) {
        //已经学习的符文数量
        currentCount = this.thane.runeCate.getCurrentStudyCount();
      } else {
        //根据类型condition.Para1取得对应符文的等级；
        currentCount = this.thane.runeCate.getRuneInfoByRuneType(
          parseInt(condition.Para1),
        ).grade;
      }
      if (currentCount >= condition.Para2) {
        return LangManager.Instance.GetTranslation(
          "buildings.offerreward.data.BaseOfferReward.progress",
        );
      } else {
        return " (" + currentCount + "/" + condition.Para2 + ")";
      }
    }
    return "";
  }

  /**
   *检查是否有符文达到要求的等级
   * @param condition
   * @param index
   * @return
   *
   */
  private checkRuneGrade(
    condition: t_s_questcondictionData,
    index: number,
  ): string {
    var currentMaxGrade: number = 0;
    if (this.taskInfo) {
      if (parseInt(condition.Para1) == 0) {
        //任意符文达到要求的等级
        if (this.thane.runeCate.getMaxGradeRuneInfo()) {
          currentMaxGrade = this.thane.runeCate.getMaxGradeRuneInfo().grade;
        }
      } else {
        //根据类型condition.Para1取得对应符文的等级；
        currentMaxGrade = this.thane.runeCate.getRuneInfoByRuneType(
          parseInt(condition.Para1),
        ).grade;
      }
      if (currentMaxGrade >= condition.Para2) {
        return LangManager.Instance.GetTranslation(
          "buildings.offerreward.data.BaseOfferReward.progress",
        );
      } else {
        return " (" + currentMaxGrade + "/" + condition.Para2 + ")";
      }
    }
    return "";
  }

  public get rewardItemList(): any[] {
    return this._rewardItemList;
  }

  public get conditionList(): any[] {
    return this._conditionList;
  }
}
