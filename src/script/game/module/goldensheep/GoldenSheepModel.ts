import GameEventDispatcher from "../../../core/event/GameEventDispatcher";
import { DateFormatter } from "../../../core/utils/DateFormatter";
import { GoldenSheepEvent } from "../../constant/event/NotificationEvent";
import { PlayerModel } from "../../datas/playerinfo/PlayerModel";
import { PlayerManager } from "../../manager/PlayerManager";
import GoldenSheepRecordInfo from "./GoldenSheepRecordInfo";

export default class GoldenSheepModel extends GameEventDispatcher {
  public index: number = 0; //第几轮红包
  public count: number = 0; //红包总轮数
  public nextTime: number = 0; //下轮红包倒计时
  public isOver: boolean = false; //红包是否抢完
  public myCount: number = 0;
  public isReward: number = 0;
  public rewardId: number = 0;
  public totalCount: number = 0;
  public curCount: number = 0;
  public state: number = 0;
  public isOpen: number = 0;
  public openTime: Date;
  public endTime: Date;
  public recordList: Array<GoldenSheepRecordInfo>;
  public luckyGoldenSheepRecordInfo: GoldenSheepRecordInfo;
  constructor() {
    super();
    this.recordList = [];
  }

  public updateAnimation() {
    this.dispatchEvent(GoldenSheepEvent.ANIMATION_UPDATE);
  }

  public updateState() {
    this.dispatchEvent(GoldenSheepEvent.STATE_UPDATE);
  }

  public commit() {
    this.dispatchEvent(GoldenSheepEvent.INFO_UPDATE);
  }

  public get hasGotReward(): boolean {
    let flag: boolean = false;
    if (this.isReward == 1) {
      flag = true;
    }
    return flag;
  }

  /**
   * 活动是否开启中
   * @return
   */
  public get needShow(): boolean {
    var flag: boolean = false;
    if (this.isOpen == 1) {
      flag = true;
    }
    return flag;
  }

  /**
   *获取上方图标是否显示
   * @return
   * 规则要求: 开启时间之前的当天都可以显示
   */
  public getTopBtnShow(): boolean {
    if (this.isOver) return false;
    if (this.needShow) return true;
    if (
      this.openTime &&
      DateFormatter.checkIsSameDay(
        this.openTime,
        this.playerModel.sysCurtime,
      ) &&
      this.playerModel.sysCurtime.getTime() <= this.openTime.getTime()
    )
      return true;
    if (
      this.endTime &&
      this.openTime &&
      this.playerModel.sysCurtime.getTime() >= this.openTime.getTime() &&
      this.playerModel.sysCurtime.getTime() < this.endTime.getTime()
    )
      return true;
    return false;
  }

  public get needShine(): boolean {
    var flag: boolean = false;
    if (this.state == 1) {
      flag = true;
    }
    return flag;
  }

  private get playerModel(): PlayerModel {
    return PlayerManager.Instance.currentPlayerModel;
  }
}
