//@ts-expect-error: External dependencies
import { SinglePassEvent } from "../../constant/event/NotificationEvent";
import { RankInfo } from "../../datas/playerinfo/RankInfo";
import { TempleteManager } from "../../manager/TempleteManager";
import FrameDataBase from "../../mvc/FrameDataBase";
import SinglePassBugleInfo from "./model/SinglePassBugleInfo";
import SinglePassCardInfo from "./model/SinglePassCardInfo";
import SinglePassOrderInfo from "./model/SinglePassOrderInfo";

export default class SinglePassModel extends FrameDataBase {
  public static CAMPAIGN_TEMPLATE_ID: number = 40001;
  public static PROP_TEMPLATE_ID: number = 3140001;
  public static BUGLE_TEMPLATE_ID: number = 3150001;
  public static MIN_FLOOR: number = 1;
  public static MAX_FLOOR: number = 10;
  public static TOLLGATE_PER_FLOOR: number = 10;
  public static FLOOR_STR: Array<string> = [
    "",
    "Ⅰ",
    "Ⅱ",
    "Ⅲ",
    "Ⅳ",
    "Ⅴ",
    "Ⅵ",
    "Ⅶ",
    "Ⅷ",
    "Ⅸ",
    "Ⅹ",
  ];
  public static JUDGE_MAX: number = 5;
  public static REWARD_LIMIT: number = 5;

  public static FIGHT_FRAME: number = 1;
  public static BUGLE_FRAME: number = 2;

  public selectArea: number = 1;
  public selectIndex: number = 1;
  public lastIndex: number = 0;

  private _area: number = 0; //当前所在的层数
  private _maxIndex: number = 0; // 最大通关层数
  private _areaReward: string = ""; // 已获得奖励的区域(格式: area,area,area...)
  private _count: number = 0; // 当天已经挑战的次数
  private _itemCount: number = 0; // 当天已经领取的道具数量
  private _areaRewardArray: Array<string>;
  private _rankInfos: Array<RankInfo>;
  private _orderList: Array<SinglePassOrderInfo>;
  private _cardInfos: Array<SinglePassCardInfo>;
  private _maxCount: number = 10;
  private _bugleCount: number = 0;
  private _floors: Array<number>;
  public static TEST_VALUE: number = 999999;

  constructor() {
    super();
    this._rankInfos = [];
    this._orderList = [];
    this._cardInfos = [];
    let cfgItem =
      TempleteManager.Instance.getConfigInfoByConfigName("SinglePass_Count");
    if (cfgItem) {
      this._maxCount = Number(cfgItem.ConfigValue);
    }
    this._bugleCount = 2;
    var cardInfo: SinglePassCardInfo;
    for (
      var i: number = 1;
      i <= SinglePassModel.MAX_FLOOR * SinglePassModel.TOLLGATE_PER_FLOOR;
      i++
    ) {
      cardInfo = new SinglePassCardInfo();
      cardInfo.tollgate = i;
      this._cardInfos.push(cardInfo);
    }
    this.initFloors();
  }

  public getCardInfoByIndex(index: number): SinglePassCardInfo {
    return this._cardInfos[index - 1];
  }

  public getCardInfoByFloor(floor: number): Array<SinglePassCardInfo> {
    if (floor < SinglePassModel.MIN_FLOOR) {
      floor = SinglePassModel.MIN_FLOOR;
    }
    var len: number = floor * SinglePassModel.TOLLGATE_PER_FLOOR;
    var cardInfos: Array<SinglePassCardInfo> = [];
    for (
      var i: number = len - SinglePassModel.TOLLGATE_PER_FLOOR;
      i < len;
      i++
    ) {
      cardInfos.push(this._cardInfos[i]);
    }
    return cardInfos;
  }

  public get cardInfos(): Array<SinglePassCardInfo> {
    return this._cardInfos;
  }

  public get maxCount(): number {
    return this._maxCount;
  }

  public get bugleCount(): number {
    return this._bugleCount;
  }

  public get areaRewardArray(): Array<string> {
    return this._areaRewardArray;
  }

  public get area(): number {
    return this._area;
  }

  public set area(value: number) {
    if (this._area != value) {
      this._area = value;
    }
  }

  public get maxIndex(): number {
    return this._maxIndex;
  }

  public set maxIndex(value: number) {
    if (this._maxIndex != value) {
      this._maxIndex = value;
    }
  }

  public get areaReward(): string {
    return this._areaReward;
  }

  public set areaReward(value: string) {
    if (this._areaReward != value) {
      this._areaReward = value;
      this._areaRewardArray = this._areaReward.split(",");
    }
  }

  public get count(): number {
    return this._count;
  }

  public set count(value: number) {
    if (this._count != value) {
      this._count = value;
    }
  }

  public get itemCount(): number {
    return this._itemCount;
  }

  public set itemCount(value: number) {
    if (this._itemCount != value) {
      this._itemCount = value;
    }
  }

  public get floors(): Array<number> {
    return this._floors;
  }

  public initFloors() {
    this._floors = [];
    for (var i: number = 1; i < this.area; i++) {
      if (this.areaReward && this.areaReward.indexOf(i.toString()) != -1) {
        if (this.isAllMaxJudgeByFloor(i)) {
          continue;
        }
      }
      this._floors.push(i);
    }
    this._floors.push(this.area);
  }

  public isAllMaxJudgeByFloor(floor: number): boolean {
    var endIndex: number = floor * SinglePassModel.TOLLGATE_PER_FLOOR;
    var startIndex: number = endIndex - SinglePassModel.TOLLGATE_PER_FLOOR + 1;
    for (const key in this._cardInfos) {
      if (Object.prototype.hasOwnProperty.call(this._cardInfos, key)) {
        var cardInfo: SinglePassCardInfo = this._cardInfos[key];
        if (cardInfo.tollgate >= startIndex && cardInfo.tollgate <= endIndex) {
          if (cardInfo.judge != SinglePassModel.JUDGE_MAX) {
            return false;
          }
        }
      }
    }
    return true;
  }

  public isMaxJudge(targetIndex: number): boolean {
    for (const key in this._cardInfos) {
      if (Object.prototype.hasOwnProperty.call(this._cardInfos, key)) {
        var cardInfo: SinglePassCardInfo = this._cardInfos[key];
        if (
          cardInfo.tollgate == targetIndex &&
          cardInfo.judge == SinglePassModel.JUDGE_MAX
        ) {
          return true;
        }
      }
    }
    return false;
  }

  public get orderList(): Array<SinglePassOrderInfo> {
    return this._orderList;
  }

  public updateOrderList() {
    this.dispatchEvent(SinglePassEvent.ORDERDATA_LOAD_COMPLETE, this);
  }

  public updateBugleInfo(info: SinglePassBugleInfo) {
    this.dispatchEvent(SinglePassEvent.UPDATE_BUGLE_INFO, info);
  }

  public updateBugleRewards(info: SinglePassBugleInfo) {
    this.dispatchEvent(SinglePassEvent.UPDATE_BUGLE_REWARDS, info);
  }

  public commit() {
    this.dispatchEvent(SinglePassEvent.SINGLEPASS_INFO_UPDATE, this);
  }

  public updateRewardStatus() {
    this.dispatchEvent(SinglePassEvent.SINGLEPASS_UPDATE_REWARD, this);
  }
}
