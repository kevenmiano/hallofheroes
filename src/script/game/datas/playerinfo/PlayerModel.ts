import GameEventDispatcher from "../../../core/event/GameEventDispatcher";
import Logger from "../../../core/logger/Logger";
import { DateFormatter } from "../../../core/utils/DateFormatter";
import Utils from "../../../core/utils/Utils";
import HeroFightingUpdateAction from "../../action/hero/HeroFightingUpdateAction";
import { ArmyState } from "../../constant/ArmyState";
import { ConsortiaUpgradeType } from "../../constant/ConsortiaUpgradeType";
import {
  CampaignEvent,
  NotificationEvent,
  SpaceEvent,
} from "../../constant/event/NotificationEvent";
import { ArmyManager } from "../../manager/ArmyManager";
import { CampaignManager } from "../../manager/CampaignManager";
import { ConfigManager } from "../../manager/ConfigManager";
import FreedomTeamManager from "../../manager/FreedomTeamManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { PlayerManager } from "../../manager/PlayerManager";
import TreasureMapManager from "../../manager/TreasureMapManager";
import { CampaignArmy } from "../../map/campaign/data/CampaignArmy";
import { MapInitData } from "../../map/data/MapInitData";
import TreasureInfo from "../../map/data/TreasureInfo";
import { BaseArmy } from "../../map/space/data/BaseArmy";
import SpaceArmy from "../../map/space/data/SpaceArmy";
import SpaceManager from "../../map/space/SpaceManager";
import { DelayActionsUtils } from "../../utils/DelayActionsUtils";
import { GoodsInfo } from "../goods/GoodsInfo";
import { BaseCastle } from "../template/BaseCastle";
import { UserInfo } from "../userinfo/UserInfo";
import { PlayerEffectInfo } from "./PlayerEffectInfo";
import { PlayerInfo } from "./PlayerInfo";
import { TowerInfo } from "./TowerInfo";

export class PlayerModel extends GameEventDispatcher {
  public static OPEN_DRAGON_SOUL_SYSTEM_GRADE: number = 40;
  public static OPEN_PET_SYSTEM_GRADE: number = 50;
  public static OPEN_CELL_NEEDED_POINT: number = 100;
  public static BAG_PAGE_CELL_NUM: number = 56;

  public static PLAYER_STAR_BAG_COUNT: number = 16;
  public static ORIGINAL_OPEN_BAG_COUNT: number = 8;
  public static EQUIP_STAR_BAG_COUNT: number = 8; //45之后解锁
  /**
   * 玩家信息
   */
  public userInfo: UserInfo = new UserInfo();
  private _playerInfo: PlayerInfo;

  public towerInfo: TowerInfo;
  public towerInfo1: TowerInfo;
  public towerInfo2: TowerInfo;
  public hasShowPrelimReportWnd: boolean = false;

  public createConsortiaFlag: boolean = false; //是否创建了公会
  public sRoleBagIsOpen: boolean = false; //背包界面当前是否打开的
  public forgeWndIsOpen: boolean = false; //铁匠铺界面当前是否打开的
  public openBagTipFlag: boolean = false;
  public forgeHeChengIsOpen: boolean = false; //铁匠铺合成界面打开
  public mailWndIsOpen: boolean = false; //邮件界面打开
  public currentSelectArtifact: GoodsInfo; //选中的神器
  public bagWndIsOpen: boolean = false;

  /**
   * 加成
   */
  public playerEffect: PlayerEffectInfo;

  public mapNodeInfo: BaseCastle = new BaseCastle();

  public mInfo: MapInitData;
  /**
   * 战场id
   */
  public currntBattleId: string;
  /**
   *   防沉迷在线累计时间
   */
  public indulgeTime: number = 0;
  private _isInAAS: boolean = false;
  /**
   * 离线挂机时间
   */
  public hookTime: number = 0;
  /**
   *离线挂机经验
   */
  public hookGp: number = 0;
  public currentTower: number = 0;

  private _isFirstSyncTime: boolean = true;

  public sysStartTime: Date;

  /** 开服时间 */
  public _openServerTime: number;

  private _vehicleTech: number = 0;
  /**
   * 选择的目标
   */
  private _selectTarget: BaseArmy;
  /**
   * 天空之城寻路的NPC
   */
  public spaceNodeId: number = 0;
  /**
   * 是否进入过天空之城
   */
  public spaceMapId: number = 0;
  /**
   * 是否从内城进入副本
   */
  public inCastle: boolean = false;
  /**
   * 是否从外城进入副本
   */
  public inOutCity: boolean = false;
  /**
   * 是否在障碍点上
   */
  public isOnObstacle: boolean = false;
  /**
   * 增援的目标
   */
  private _reinforceTarget: BaseArmy;
  /**
   * 命运轮盘次数
   */
  public faterotaryCount: number = 0;

  public treasureState: number = 0;
  public stateEndTime: number = 0;
  public failCount: number = 0;
  public skipCount: number = 0;
  public sumCD: number = 0;
  public isDeath: boolean = false;
  private _currentMinerals: Array<TreasureInfo> = []; //玩家所在外城地图的宝矿简要信息
  private _conosrtMinerals: Array<TreasureInfo> = []; //玩家所在的公会占领的宝矿信息
  constructor() {
    super();
    this.init();
  }

  /**
   * 玩家数据初始化, 返回登录或切换角色后都会调用清空重置玩家数据
   */
  init() {
    this._playerInfo = new PlayerInfo();
    this.playerEffect = new PlayerEffectInfo();
    this.towerInfo1 = new TowerInfo();
    this.towerInfo2 = new TowerInfo();
    this.towerInfo = new TowerInfo();
  }

  /**
   * 英灵系统是否开放
   * @return
   */
  public get petSystemIsOpened(): boolean {
    // TODO 英灵开放
    // if(TaskManage.Instance.IsTaskFinish(TaskManage.PET_SYSTEM_OPEN_TASK))
    // {
    //     return true;
    // }
    // return false;
    return true;
  }

  public showBattleGuardBtnShine: boolean = false;
  public showDragonSoulBtnShine: boolean = false;

  public get selectTarget(): BaseArmy {
    return this._selectTarget;
  }

  public set selectTarget(value: BaseArmy) {
    var armyView: object;
    if (!value) {
      this.reinforce = null;
    }
    if (this._selectTarget == value) {
      return;
    }
    if (this._selectTarget) {
      armyView = this.getTargetView(this._selectTarget);
      if (
        this._selectTarget &&
        armyView &&
        armyView.hasOwnProperty("unlockTargetAndShowFate")
      ) {
        armyView["unlockTargetAndShowFate"]();
        this._selectTarget = null;
      }
    }

    this._selectTarget = value;
    if (this._selectTarget) {
      armyView = this.getTargetView(this._selectTarget);
    }
    if (
      this._selectTarget &&
      armyView &&
      armyView.hasOwnProperty("lockTargetAndHideFate")
    ) {
      armyView["lockTargetAndHideFate"]();
    }
    this.dispatchEvent(SpaceEvent.TARGET_CHANGE, this._selectTarget);
  }

  public get reinforce(): BaseArmy {
    return this._reinforceTarget;
  }

  public set reinforce(value: BaseArmy) {
    this._reinforceTarget = value;
    if (!value) {
      TreasureMapManager.Instance.model.reinforceTarget = null;
    }
    if (
      this._reinforceTarget &&
      FreedomTeamManager.Instance.inMyTeam(this._reinforceTarget.userId) &&
      this.targetIsFighting(this._reinforceTarget)
    ) {
      this.dispatchEvent(SpaceEvent.TARGET_CHANGE, this._reinforceTarget);
    }
  }

  private _wolrdBossAutoFightFlag: number = 2;
  public static WORLDBOSS_AUTO_FIGHT: number = 1; //世界BOSS自动寻路
  public static WORLDBOSS_CANCAL_AUTO_FIGHT: number = 2; //世界BOSS取消自动寻路

  public static WORLDBOSS_AUTO_LIVE: number = 1; //世界BOSS自动复活
  public static WORLDBOSS_CANCEL_AUTO_LIVE: number = 2; //世界BOSS取消自动复活
  private _wolrdBossAutoLiveFlag: number = 2;

  public wolrdBossAutoLiveCostType: boolean = false; //false 优先使用绑定钻石 true 只使用钻石
  public riverStartTime: number = 0;
  public riverTime: number = 0;
  public lookTargetUserId: number = 0;
  public getWolrdBossAutoFightFlag(): number {
    return this._wolrdBossAutoFightFlag;
  }

  /**世界BOSS是否是自动寻路状态 */
  public get worldBossIsAutoFight(): boolean {
    return this._wolrdBossAutoFightFlag == PlayerModel.WORLDBOSS_AUTO_FIGHT
      ? true
      : false;
  }

  public setWorldBossAutoFight(value: number) {
    if (this._wolrdBossAutoFightFlag == value) {
      return;
    }
    this._wolrdBossAutoFightFlag = value;
    this.dispatchEvent(CampaignEvent.WORLDBOSS_AUTO_WALK_CHANGED);
  }

  public setWorldBossAutoLive(value: number) {
    if (this._wolrdBossAutoLiveFlag == value) {
      return;
    }
    this._wolrdBossAutoLiveFlag = value;
    this.dispatchEvent(CampaignEvent.WORLDBOSS_AUTO_WALK_CHANGED);
  }

  public getWolrdBossAutoLiveFlag(): number {
    return this._wolrdBossAutoLiveFlag;
  }

  /**世界BOSS是否是自动复活状态 */
  public get worldBossIsAutoLive(): boolean {
    return this._wolrdBossAutoLiveFlag == PlayerModel.WORLDBOSS_AUTO_LIVE
      ? true
      : false;
  }

  private _autoWalkFlag: number = 2;
  public static AUTO_WALK: number = 1; //自动寻路
  public static CANCAL_AUTO_WALK: number = 2; //取消自动寻路

  public getAutoWalkFlag(): number {
    return this._autoWalkFlag;
  }

  public get isAutoWalk(): boolean {
    return this._autoWalkFlag == PlayerModel.AUTO_WALK ? true : false;
  }

  public setAutoWalk(value: number) {
    if (this._autoWalkFlag == value) {
      return;
    }
    this._autoWalkFlag = value;
    this.dispatchEvent(CampaignEvent.AUTO_WALK_CHANGED);
  }

  private targetIsFighting(target: BaseArmy): boolean {
    if (target.state == ArmyState.STATE_FIGHT) {
      return true;
    }
    return false;
  }

  private getTargetView(value: object): object {
    var controler: any;
    if (value instanceof SpaceArmy) {
      controler = SpaceManager.Instance.controller;
    } else if (value instanceof CampaignArmy) {
      controler = CampaignManager.Instance.controller;
    }
    if (controler) {
      return controler.getArmyView(value);
    }
    return null;
  }

  /** 魔灵科技度 */
  public get vehicleTech(): number {
    return this._vehicleTech;
  }

  /**
   * @private
   */
  public set vehicleTech(value: number) {
    if (value == this._vehicleTech) {
      return;
    }
    this._vehicleTech = value;
    NotificationManager.Instance.dispatchEvent(
      NotificationEvent.VEHICLE_TECH_CHANGE,
      this._vehicleTech,
    );
  }

  /**
   * 玩家是否被纳入防沉迷系统
   */
  public get isInAAS(): boolean {
    return this._isInAAS;
  }

  /**
   * @private
   */
  public set isInAAS(value: boolean) {
    this._isInAAS = value;
  }

  /**
   * 玩家领主信息
   */
  public get playerInfo(): PlayerInfo {
    return this._playerInfo;
  }

  public get nowDate(): number {
    return this.sysCurtime.getTime();
  }

  private _currentSysSecond: number = 0;

  public get sysCurTimeBySecond(): number {
    return this._currentSysSecond;
  }

  public set sysCurTimeBySecond(value) {
    this._currentSysSecond = value;
  }

  private _zoneId: string = "";

  public get zoneId(): string {
    return this._zoneId;
  }

  public set zoneId(value: string) {
    this._zoneId = value;
  }

  private _zoneOffset: number = 0;

  public get zoneOffset(): number {
    return this._zoneOffset;
  }

  public set zoneOffset(value) {
    this._zoneOffset = value;
  }

  public set openServerTime(value: number) {
    this._openServerTime = value;
  }

  /**
   * 开服第几天数
   */
  public get openServerDay(): number {
    const offsetTime: number = 5 * 60 * 60 * 1000;
    const dayMin: number = 24 * 60 * 60 * 1000;

    let zoneOffset = PlayerManager.Instance.currentPlayerModel.zoneId;
    let startDate: Date = Utils.formatTimeZone(
      this._openServerTime,
      zoneOffset,
    );
    let hours: number = startDate.getHours();
    let minutes: number = startDate.getMinutes();
    let seconds: number = startDate.getSeconds();
    let differenceTime: number =
      (23 - hours) * 1000 * 60 * 60 +
      (59 - minutes) * 1000 * 60 +
      (59 - seconds) * 1000;
    let firstDayRefreshDifferenceTime: number = differenceTime + offsetTime; //开始时间跟第一天重置时间相差的毫秒数

    let currentTime: number = this.sysCurtime.getTime();
    let intervalMillisecond: number = currentTime - startDate.getTime(); //当前时间跟开始时间相差的毫秒数

    let day: number = 0;
    if (intervalMillisecond <= firstDayRefreshDifferenceTime) {
      day = 1;
    } else {
      day =
        Math.ceil(
          (intervalMillisecond - firstDayRefreshDifferenceTime) / dayMin,
        ) + 1;
    }

    return day;
  }

  /**
   * 登录时发过来的服务器时间
   */
  private _sysCurtime: Date;
  public set sysCurtime(value: Date) {
    this._sysCurtime = value;
    this._currentSysSecond = Math.floor(this._sysCurtime.getTime() / 1000);
    this.dispatchEvent(NotificationEvent.UPDATE_SYSTEM_TIME);
    if (this._isFirstSyncTime) {
      this._isFirstSyncTime = false; //  以下执行第一次同步服务器时间需要做的
      // ExternalInterfaceManager.Instance.syncDesktopTime(this._sysCurtime.getHours() * 3600 + this._sysCurtime.getMinutes() * 60 + this._sysCurtime.getSeconds());
    }
    Logger.yyz(
      "当前服务器时间: ",
      DateFormatter.format(value, "YYYY-MM-DD hh:mm:ss"),
    );
  }

  public get sysCurtime(): Date {
    var date: Date = new Date();
    date.setTime(this._currentSysSecond * 1000);
    return date;
  }

  public fightingCapacityRecord: number = -1;

  /**
   * 此函数用于弹出提示框提示玩家战斗力的提升。
   * <br>1. 如果flag为“start”, 则表示此次操作开始, 记录玩家某次操作之前的战斗力,
   * <br>2. 如果flag为“end”, 则表示此次操作结束, 发出弹出提示的通知。
   */
  public setFightingCapacityRecord(flag: string) {
    if (flag == "start") {
      this.fightingCapacityRecord = this._playerInfo.fightingCapacity;
    } else if (flag == "end") {
      // if (-1 != this.fightingCapacityRecord && this.fightingCapacityRecord < this._playerInfo.fightingCapacity) {
      DelayActionsUtils.Instance.addAction(
        new HeroFightingUpdateAction(
          this.fightingCapacityRecord,
          ArmyManager.Instance.thane,
        ),
      );
      //this.fightingCapacityRecord = -1;
      // }
    } else {
      throw new Error("argument error.");
    }
  }

  /**
   * 获取玩家自身的公会技能等级
   * @param type
   */
  public getConsortiaSkillLevel(type: number): number {
    let level: number = 0;
    switch (type) {
      case ConsortiaUpgradeType.ATTACK:
        level = this.playerInfo.consortiaPower;
        break;
      case ConsortiaUpgradeType.AGILITY:
        level = this.playerInfo.consortiaAgility;
        break;
      case ConsortiaUpgradeType.ABILITY:
        level = this.playerInfo.consortiaIntellect;
        break;
      case ConsortiaUpgradeType.CAPTAIN:
        level = this.playerInfo.consortiaCaptain;
        break;
      case ConsortiaUpgradeType.PHYSIQUE:
        level = this.playerInfo.consortiaPhysique;
        break;
      case ConsortiaUpgradeType.GOLD:
        level = this.playerInfo.consortiaGold;
        break;
    }
    return level;
  }

  public getConsortiaHighSkillLevel(type: number): number {
    if (this.playerInfo.selfConsortiaSkillTypeDic.has(type)) {
      return this.playerInfo.selfConsortiaSkillTypeDic.get(type);
    } else {
      return 0;
    }
  }

  public get currentMinerals(): Array<TreasureInfo> {
    return this._currentMinerals;
  }

  public set currentMinerals(value: Array<TreasureInfo>) {
    this._currentMinerals = value;
  }

  public get conosrtMinerals(): Array<TreasureInfo> {
    return this._conosrtMinerals;
  }

  public set conosrtMinerals(value: Array<TreasureInfo>) {
    this._conosrtMinerals = value;
  }

  public checkChatForbidIsOpen(): boolean {
    if (
      ConfigManager.info.CHAT_FORBID &&
      this.nowDate &&
      ConfigManager.info.CHAT_FORBID_BEGIN_DATE.getTime() &&
      ConfigManager.info.CHAT_FORBID_END_DATE.getTime() &&
      ConfigManager.info.CHAT_FORBID_BEGIN_DATE.getTime() <= this.nowDate &&
      this.nowDate < ConfigManager.info.CHAT_FORBID_END_DATE.getTime()
    ) {
      return true; //开关开
    }
    return false;
  }
}
