import ConfigMgr from "../../../core/config/ConfigMgr";
import GameEventDispatcher from "../../../core/event/GameEventDispatcher";
import LangManager from "../../../core/lang/LangManager";
import { ArrayUtils, ArrayConstant } from "../../../core/utils/ArrayUtils";
import StringHelper from "../../../core/utils/StringHelper";
import { t_s_sevengiftbagData } from "../../config/t_s_sevengiftbag";
import { t_s_seventargetData } from "../../config/t_s_seventarget";
import { t_s_seventreasureData } from "../../config/t_s_seventreasure";
import { ConfigType } from "../../constant/ConfigDefine";
import { NotificationEvent } from "../../constant/event/NotificationEvent";
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import { NotificationManager } from "../../manager/NotificationManager";
import { TempleteManager } from "../../manager/TempleteManager";
import SevenDayInfo from "../welfare/data/SevenDayInfo";
import SevenGiftBagInfo from "../welfare/data/SevenGiftBagInfo";
import SevenTaskInfo from "../welfare/data/SevenTaskInfo";
import SevenTreasureInfo from "../welfare/data/SevenTreasureInfo";

export default class SevenGoalsModel extends GameEventDispatcher {
  public startTime: number = 0; //七日目标开始的时间戳(秒)
  private _rewardSite: number = 0; //积分奖励领取状态
  private _giftSite: number = 0; //特惠礼包购买状态(七天的)
  public starNum: number = 0; //积分值
  public sevenCurrentDay: number = 0; //当前是七日活动的第几天
  public currentSelectedDay: number = 0; //当前选中的天数
  public tabValue: number = 0; //当前选中的tab页签
  public leftTime: number = 0; //七日目标剩余时间（秒）
  private _sevenTask: Array<SevenTaskInfo> = []; //七日目标任务
  private _sevenTreasureArr: Array<SevenTreasureInfo> = []; //七日目标积分礼包
  private _sevenGiftBagArr: Array<SevenGiftBagInfo> = []; //七日目标特惠礼包
  public sevenNotNeedProgressTypeArr: Array<number> = [
    5, 11, 13, 14, 19, 45, 58, 82,
  ]; //七日目标不需要显示的任务进度的类别数组

  constructor() {
    super();
    this.getSevenTreasureArr(); //七日目标积分礼包
    this.getSevenGiftBagArr(); //七日目标特惠礼包
  }

  public set sevenTask(value: Array<SevenTaskInfo>) {
    this._sevenTask = value;
  }

  public get sevenTask(): Array<SevenTaskInfo> {
    return this._sevenTask;
  }

  public set rewardSite(value: number) {
    this._rewardSite = value;
    NotificationManager.Instance.dispatchEvent(
      NotificationEvent.SEVEN_GOALS_REWARDSITE_UPDATE,
    );
  }

  public get rewardSite(): number {
    return this._rewardSite;
  }

  public set giftSite(value: number) {
    this._giftSite = value;
    NotificationManager.Instance.dispatchEvent(
      NotificationEvent.SEVEN_GOALS_GIFTSITE_UPDATE,
    );
  }

  public get giftSite(): number {
    return this._giftSite;
  }

  /** 获取七日目标积分礼包数据 */
  public getSevenTreasureArr() {
    let goodsList = ConfigMgr.Instance.getDicSync(ConfigType.t_s_seventreasure);
    this._sevenTreasureArr = [];
    let sevenTreasureInfo: SevenTreasureInfo;
    for (let dicKey in goodsList) {
      if (goodsList.hasOwnProperty(dicKey)) {
        let seventreasureData: t_s_seventreasureData = goodsList[dicKey];
        sevenTreasureInfo = new SevenTreasureInfo();
        sevenTreasureInfo.id = seventreasureData.Id;
        sevenTreasureInfo.integral = seventreasureData.Integral;
        sevenTreasureInfo.item = seventreasureData.Item;
        sevenTreasureInfo.icon = seventreasureData.Icon;
        this._sevenTreasureArr.push(sevenTreasureInfo);
      }
    }
    this._sevenTreasureArr = ArrayUtils.sortOn(
      this._sevenTreasureArr,
      ["id"],
      [ArrayConstant.NUMERIC],
    );
  }

  public get sevenTreasureArr(): Array<SevenTreasureInfo> {
    return this._sevenTreasureArr;
  }

  /** 获取七日目标特惠礼包数据 */
  public getSevenGiftBagArr() {
    let goodsList = ConfigMgr.Instance.getDicSync(ConfigType.t_s_sevengiftbag);
    this._sevenGiftBagArr = [];
    let sevenGiftBagInfo: SevenGiftBagInfo;
    for (let dicKey in goodsList) {
      if (goodsList.hasOwnProperty(dicKey)) {
        let sevengiftbagData: t_s_sevengiftbagData = goodsList[dicKey];
        if (sevengiftbagData) {
          sevenGiftBagInfo = new SevenGiftBagInfo();
          sevenGiftBagInfo.day = sevengiftbagData.Day;
          sevenGiftBagInfo.name = sevengiftbagData.NameLang;
          sevenGiftBagInfo.dicount = sevengiftbagData.Discount;
          sevenGiftBagInfo.price = sevengiftbagData.Currency;
          sevenGiftBagInfo.item = sevengiftbagData.Item;
          this._sevenGiftBagArr.push(sevenGiftBagInfo);
        }
      }
    }
    this._sevenGiftBagArr = ArrayUtils.sortOn(
      this._sevenGiftBagArr,
      ["day"],
      [ArrayConstant.NUMERIC],
    );
  }

  public get sevenGiftBagArr(): Array<SevenGiftBagInfo> {
    return this._sevenGiftBagArr;
  }

  public getDayValue(taskId: number): number {
    let taskList = ConfigMgr.Instance.getDicSync(ConfigType.t_s_seventarget);
    let dayValue: number = 0;
    for (let dicKey in taskList) {
      if (taskList.hasOwnProperty(dicKey)) {
        let seventargetData: t_s_seventargetData = taskList[dicKey];
        if (seventargetData && seventargetData.Id == taskId) {
          dayValue = seventargetData.Day;
          break;
        }
      }
    }
    return dayValue;
  }

  /**
   * 得到某一天 某个类型的任务列表
   * @param dayValue  天数
   * @param tabValue  类别（0 成长任务 1今日挑战）
   * @returns
   */
  public getTaskArray(
    dayValue: number,
    tabValue: number,
  ): Array<SevenTaskInfo> {
    let sevenTaskArr: Array<SevenTaskInfo> = [];
    let len: number = this._sevenTask.length;
    let item: SevenTaskInfo;
    for (let i = 0; i < len; i++) {
      item = this._sevenTask[i];
      if (item && item.day == dayValue && item.taskType == tabValue) {
        sevenTaskArr.push(item);
      }
    }
    return sevenTaskArr;
  }

  public getDayArray(): Array<SevenDayInfo> {
    let valueStr: string =
      TempleteManager.Instance.getConfigInfoByConfigName(
        "seventarget_Time",
      ).ConfigValue;
    let dayArr: Array<SevenDayInfo> = [];
    if (!StringHelper.isNullOrEmpty(valueStr)) {
      let arr: Array<string> = valueStr.split("|");
      if (arr && arr.length == 2) {
        let totalDay: number = parseInt(arr[1].split(",")[1]);
        let dayItem: SevenDayInfo;
        for (let i = 1; i <= totalDay; i++) {
          dayItem = new SevenDayInfo();
          dayItem.day = i;
          dayItem.isOpen = i <= this.sevenCurrentDay ? true : false;
          dayArr.push(dayItem);
        }
      }
    }
    return dayArr;
  }

  public getTabArray(): Array<any> {
    let strArr: Array<any> = [];
    for (let i = 1; i <= 3; i++) {
      let titleName: string = LangManager.Instance.GetTranslation(
        "SevenGoalsTab.title" + i,
      );
      strArr.push({ name: titleName, index: i });
    }
    return strArr;
  }

  /**
   * 七日目标检测成长任务tab页签是否红点
   * @param day 天数
   * @returns
   */
  public checkTabIndex1(day: number): boolean {
    return this.checkHasTaskReward(day);
  }

  /**
   * 七日目标检测当日有完成的未领奖的挑战任务
   * @param day 天数
   * @returns
   */
  public checkTabIndex2(): boolean {
    return this.hasReciveTaskComplete(); //当日有完成的未领奖的挑战任务
  }

  public checkTabIndex3(): boolean {
    return this.checkhasNotCompleteTask();
  }
  /**
   * 某天是否有未领取的成长奖励
   * @param day 天数
   * @returns
   */
  private checkHasTaskReward(day: number): boolean {
    let flag: boolean = false;
    let len: number = this._sevenTask.length;
    let item: SevenTaskInfo;
    for (let i = 0; i < len; i++) {
      item = this._sevenTask[i];
      if (item && item.day == day && item.status == 1 && item.taskType == 0) {
        flag = true;
        break;
      }
    }
    return flag;
  }

  /**活动最新日有未完成的挑战任务*/
  private checkhasNotCompleteTask(): boolean {
    let len: number = this._sevenTask.length;
    let flag: boolean = false;
    let item: SevenTaskInfo;
    for (let i = 0; i < len; i++) {
      item = this._sevenTask[i];
      if (
        item &&
        item.day == this.sevenCurrentDay &&
        item.taskType == 1 &&
        item.status == 2
      ) {
        flag = true;
        break;
      }
    }
    return flag;
  }

  /**
   * 检测某一天的特惠礼包是否已经购买
   * @param day 天数
   */
  public checkBagHasBuy(day: number): boolean {
    if ((this.giftSite >> day) & 0x01) {
      return true;
    } else {
      return false;
    }
  }

  /**检测七日目标某一档宝箱的领取状态 */
  public checkGoalsBox(day: number, integral: number): number {
    let status: number = 0;
    if ((this.rewardSite >> day) & 0x01) {
      //已经领取
      status = 3;
    } else {
      if (integral <= this.starNum) {
        //可领取
        status = 1;
      } //不能领取
      else {
        status = 2;
      }
    }
    return status;
  }

  /**
   * 七日目标当日有未领取的奖励任务
   */
  private hasReciveTaskComplete(): boolean {
    let len: number = this._sevenTask.length;
    let flag: boolean = false;
    let item: SevenTaskInfo;
    for (let i = 0; i < len; i++) {
      item = this._sevenTask[i];
      if (
        item &&
        item.day == this.sevenCurrentDay &&
        item.taskType == 1 &&
        item.status == 1
      ) {
        flag = true;
        break;
      }
    }
    return flag;
  }

  /**
   * 七日目标检测某天是否显示红点
   * @param day 天数
   * @returns
   */
  public checkDayRed(day: number): boolean {
    let hasTaskReward: boolean = this.checkHasTaskReward(day); //选中的天数有成长任务奖励还未领取
    if (day == this.sevenCurrentDay) {
      let hasNotCompleteTask: boolean = this.hasReciveTaskComplete(); //七日目标检测今日挑战tab页签是否有完成的未领取奖励的挑战任务
      return hasTaskReward || hasNotCompleteTask;
    } else {
      return hasTaskReward;
    }
  }

  /**
   *
   * @param currentValue 奖励预览
   */
  public getNextLookInfo(): GoodsInfo {
    let goodsInfo: GoodsInfo;
    for (let i: number = 0; i < this.sevenTreasureArr.length; i++) {
      let info: SevenTreasureInfo = this.sevenTreasureArr[i];
      let status = this.checkGoalsBox(info.id, info.integral);
      if (status == 2) {
        goodsInfo = new GoodsInfo();
        let strArr: Array<string> = info.item.split(",");
        if (strArr && strArr.length == 2) {
          goodsInfo.templateId = Number(strArr[0]);
          goodsInfo.count = Number(strArr[1]);
        }
        break;
      }
    }
    if (!goodsInfo) {
      let len = this.sevenTreasureArr.length;
      let info: SevenTreasureInfo = this.sevenTreasureArr[len - 1];
      goodsInfo = new GoodsInfo();
      let strArr: Array<string> = info.item.split(",");
      if (strArr && strArr.length == 2) {
        goodsInfo.templateId = Number(strArr[0]);
        goodsInfo.count = Number(strArr[1]);
      }
    }
    return goodsInfo;
  }

  public getProgress(): number {
    let currentValue: number = 0;
    for (let i: number = 0; i < this.sevenTreasureArr.length; i++) {
      let info: SevenTreasureInfo = this.sevenTreasureArr[i];
      let status = this.checkGoalsBox(info.id, info.integral);
      if (status == 3) {
        currentValue++;
      } else if (info.integral <= this.starNum) {
        //可领取
        currentValue++;
      }
    }
    return currentValue + 1;
  }
}
