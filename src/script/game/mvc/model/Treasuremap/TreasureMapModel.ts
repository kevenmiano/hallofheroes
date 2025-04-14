import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { TempleteManager } from "../../../manager/TempleteManager";
import GameEventDispatcher from "../../../../core/event/GameEventDispatcher";
import { TreasureMapEvent } from "../../../constant/event/NotificationEvent";
import { t_s_vipprerogativetemplateData } from "../../../config/t_s_vipprerogativetemplate";
import { VipPrivilegeType } from "../../../constant/VipPrivilegeType";
import { VIPManager } from "../../../manager/VIPManager";

export class TreasureMapModel extends GameEventDispatcher {
  public static GET_TREASUREMAP: number = 1; // 领取藏宝图
  public static REFRESH: number = 2; // 刷新
  public static EXCAVATEIMM: number = 3; // 立即挖掘
  public static CONFIRM_GET_REWARD: number = 4; // 确定获得奖励
  public static USE_TREASUREMAP: number = 5; // 使用藏宝图
  public static REQUEST_TREASUREMAP: number = 6; // 请求藏宝图信息

  public static OPEN_GET_FRAME: number = 1; // 领取藏宝图
  public static OPEN_USE_FRAME: number = 2; // 使用藏宝图

  public static QUALITY_MAX: number = 3;

  public static DISTANCE1: number = 15;
  public static DISTANCE2: number = 40;
  public static DISTANCE3: number = 80;

  public static GET_TIP_DELTA: number = 60;

  public static COST_TEMPLATE_ID: number = 208050;
  public static REWARD_TEMPLATE_ID: number = 208028;

  public static COST_ITEM_TO_POINTS: number = 5;

  private _joinCount: number = 0;
  private _rewardCount: number = 0;
  private _index: number = 0;
  private _templateIds: any[];
  private _lastGetTime: number;
  private _lastTreasureMap: GoodsInfo;

  private _joinMax: number = 0;
  private _rewardMax: number = 0;
  /** 使用宝图界面是否已打开 */
  private _useFrameOpened: boolean = false;
  /** 小地图界面是否已打开 */
  private _mapFrameOpened: boolean = false;
  public reinforceTarget: any;
  private _guildFlag: boolean = false;
  private _isFirstQuest: boolean;
  private _isFirstGet: boolean;
  private _isFirstUse: boolean;

  constructor() {
    super();
    this._rewardMax = this.getConfigValue("reward_tremap_count");
    this._joinMax = this.getConfigValue("join_tremap_count");
  }
  //VIP特权可增加收益次数
  public updateVipReward(): void {
    this._rewardMax = this.getConfigValue("reward_tremap_count");
    this._joinMax = this.getConfigValue("join_tremap_count");
    let data: t_s_vipprerogativetemplateData =
      TempleteManager.Instance.getPrivilegeTempletesByTypeLevel(
        VipPrivilegeType.MYSTERY_BOX,
        VIPManager.Instance.model.vipInfo.VipGrade,
      );
    if (data) {
      this._joinMax += data.para1;
      this._rewardMax += data.para1;
    }
  }

  private getConfigValue(key: string): number {
    if (TempleteManager.Instance.getConfigInfoByConfigName(key)) {
      return parseInt(
        TempleteManager.Instance.getConfigInfoByConfigName(key).ConfigValue,
      );
    }
    return 5;
  }

  public get joinMax(): number {
    return this._joinMax;
  }

  public get rewardMax(): number {
    return this._rewardMax;
  }

  public get joinCount(): number {
    return this._joinCount;
  }

  public set joinCount(value: number) {
    if (this._joinCount != value) {
      this._joinCount = value;
    }
  }

  public get rewardCount(): number {
    return this._rewardCount;
  }

  public set rewardCount(value: number) {
    if (this._rewardCount != value) {
      this._rewardCount = value;
    }
  }

  public get index(): number {
    return this._index;
  }

  public set index(value: number) {
    if (this._index != value) {
      this._index = value;
    }
  }

  public get templateIds(): any[] {
    return this._templateIds;
  }

  public set templateIds(value: any[]) {
    if (this._templateIds != value) {
      this._templateIds = value;
    }
  }

  public get lastGetTime(): number {
    return this._lastGetTime;
  }

  public set lastGetTime(value: number) {
    if (this._lastGetTime != value) {
      this._lastGetTime = value;
    }
  }

  public get lastTreasureMap(): GoodsInfo {
    return this._lastTreasureMap;
  }

  public set lastTreasureMap(value: GoodsInfo) {
    if (this._lastTreasureMap != value) {
      this._lastTreasureMap = value;
    }
  }

  public get useFrameOpened(): boolean {
    return this._useFrameOpened;
  }

  public set useFrameOpened(value: boolean) {
    if (this._useFrameOpened != value) {
      this._useFrameOpened = value;
    }
  }

  public get mapFrameOpened(): boolean {
    return this._mapFrameOpened;
  }

  public set mapFrameOpened(value: boolean) {
    if (this._mapFrameOpened != value) {
      this._mapFrameOpened = value;
    }
  }

  public commit() {
    this.dispatchEvent(TreasureMapEvent.TREASURE_INFO_UPDATE);
  }

  public get guildFlag(): boolean {
    return this._guildFlag;
  }

  public set guildFlag(value: boolean) {
    this._guildFlag = value;
  }

  public get isFirstQuest(): boolean {
    return this._isFirstQuest;
  }

  public set isFirstQuest(value: boolean) {
    this._isFirstQuest = value;
  }

  public get isFirstGet(): boolean {
    return this._isFirstGet;
  }

  public set isFirstGet(value: boolean) {
    this._isFirstGet = value;
  }

  public get isFirstUse(): boolean {
    return this._isFirstUse;
  }

  public set isFirstUse(value: boolean) {
    this._isFirstUse = value;
  }
}
