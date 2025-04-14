import Logger from "../../../core/logger/Logger";
import { PackageIn } from "../../../core/net/PackageIn";
import { ServerDataManager } from "../../../core/net/ServerDataManager";
import { SocketManager } from "../../../core/net/SocketManager";
import { ArrayConstant, ArrayUtils } from "../../../core/utils/ArrayUtils";
import StringHelper from "../../../core/utils/StringHelper";
import { NotificationEvent } from "../../constant/event/NotificationEvent";
import { C2SProtocol } from "../../constant/protocol/C2SProtocol";
import { S2CProtocol } from "../../constant/protocol/S2CProtocol";
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import { ArmyManager } from "../../manager/ArmyManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { PlayerManager } from "../../manager/PlayerManager";
import FrameCtrlBase from "../../mvc/FrameCtrlBase";
import LevelGiftItemInfo from "./data/LevelGiftItemInfo";
import SevenLoginInfo from "./data/SevenLoginInfo";
import SevenTaskInfo from "./data/SevenTaskInfo";
import WelfareData from "./WelfareData";
import { WelfareManager } from "./WelfareManager";
//@ts-expect-error: External dependencies

import MonthCardReqMsg = com.road.yishi.proto.active.MonthCardReqMsg;
//@ts-expect-error: External dependencies

import PlayerSignReqMsg = com.road.yishi.proto.player.PlayerSignReqMsg;

//@ts-expect-error: External dependencies

import GradePacketMsg = com.road.yishi.proto.active.GradePacketMsg;
//@ts-expect-error: External dependencies

import GradePacketRsp = com.road.yishi.proto.active.GradePacketRsp;
//@ts-expect-error: External dependencies

import GradeReceiveRsp = com.road.yishi.proto.active.GradeReceiveRsp;
//@ts-expect-error: External dependencies

import GradePacketReq = com.road.yishi.proto.active.GradePacketReq;
//@ts-expect-error: External dependencies

import SevenTargetInfoRsp = com.road.yishi.proto.active.SevenTargetInfoRsp;
//@ts-expect-error: External dependencies

import SevenTaskMsg = com.road.yishi.proto.active.SevenTaskMsg;
//@ts-expect-error: External dependencies

import TaskReceiveRsp = com.road.yishi.proto.active.TaskReceiveRsp;
//@ts-expect-error: External dependencies

import GiftReceiveRsp = com.road.yishi.proto.active.GiftReceiveRsp;
//@ts-expect-error: External dependencies

import AddItemReq = com.road.yishi.proto.active.AddItemReq;
//@ts-expect-error: External dependencies

import OnlineRewardMsg = com.road.yishi.proto.active.OnlineRewardMsg;
//@ts-expect-error: External dependencies

import SevenSignReceiveReq = com.road.yishi.proto.active.SevenSignReceiveReq;
//@ts-expect-error: External dependencies

import SevenSignReceiveRsp = com.road.yishi.proto.active.SevenSignReceiveRsp;
//@ts-expect-error: External dependencies

import GrowthFundRecReq = com.road.yishi.proto.fund.GrowthFundRecReq;
import Utils from "../../../core/utils/Utils";
/**
 * @author:pzlricky
 * @data: 2021-06-23 15:48
 * @description 福利任务控制器
 */
export default class WelfareCtrl extends FrameCtrlBase {
  /*
   *签到领取奖励
   * optType  操作类型  1 签到页面  2 签到   3补签
   * prizeSite  领奖位置下标, 2 , 5 , 10, 17, 26 累计签到奖励领取
   * index  第几天签到 1 为第一天
   */
  public sendSignReward(
    optType: number = 1,
    prizeSite: number = 0,
    payType: number = 0,
    index: number = 0,
  ) {
    let msg: PlayerSignReqMsg = new PlayerSignReqMsg();
    msg.optType = optType;
    msg.prizeSite = prizeSite;
    msg.payType = payType;
    msg.index = index;
    SocketManager.Instance.send(C2SProtocol.C_PLAYER_SIGN_CMD, msg);
  }

  /**
   * 等级礼包免费礼包领取和特惠礼包购买
   * @param optType 1、打开界面 2 免费礼包 3付费礼包
   * @param grade 等级
   */
  public sendLevelGiftReward(optType: number = 1, id: number = 0) {
    let msg: GradePacketReq = new GradePacketReq();
    msg.op = optType;
    msg.grade = id;
    SocketManager.Instance.send(C2SProtocol.C_GRADE_PACKET, msg);
  }

  protected addDataListener() {
    super.addDataListener();
    ServerDataManager.listen(
      S2CProtocol.U_C_GRADE_PACKET_RECEIVE,
      this,
      this.levelBackInfo,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_SEVEN_SIGN_RECEIVE,
      this,
      this.sevenLoginRewardInfo,
    );
  }

  protected delDataListener() {
    super.delDataListener();
    ServerDataManager.cancel(
      S2CProtocol.U_C_GRADE_PACKET_RECEIVE,
      this,
      this.levelBackInfo,
    );
    ServerDataManager.cancel(
      S2CProtocol.U_C_SEVEN_SIGN_RECEIVE,
      this,
      this.sevenLoginRewardInfo,
    );
  }

  /**
   *
   * @param pkg 领取或购买返回
   */
  private levelBackInfo(pkg: PackageIn) {
    let msg: GradeReceiveRsp = pkg.readBody(GradeReceiveRsp) as GradeReceiveRsp;
    let len: number = this.data.levelPackageArr.length;
    let item: LevelGiftItemInfo;
    for (let i = 0; i < len; i++) {
      item = this.data.levelPackageArr[i];
      if (item) {
        item.packageState1 = this.updateFreePackageState(item, msg.receiveSite);
        item.packageState2 = this.updateDiamondPackageState(item, msg.buySite);
      }
    }
    this.data.levelPackageArr = ArrayUtils.sortOn(
      this.data.levelPackageArr,
      ["packageState1", "id"],
      [ArrayConstant.DESCENDING | ArrayConstant.CASEINSENSITIVE],
    );
  }

  private updateFreePackageState(
    item: LevelGiftItemInfo,
    value: number,
  ): number {
    let state: number = 0;
    if ((value >> item.id) & 0x01) {
      //已经领取
      state = WelfareData.HAS_GET;
      this.data.currentGetPackageId =
        this.data.currentGetPackageId > item.id
          ? this.data.currentGetPackageId
          : item.id;
    } else {
      if (ArmyManager.Instance.thane.grades >= item.grade) {
        //玩家等级大于礼包要求的等级
        if (this.data.currentGetPackageId == item.id - 1) {
          //可领取
          state = WelfareData.CAN_GET;
        } else {
          state = WelfareData.DISSATISIFY_CONDITION; //未满足条件, 请领取上一等级礼包
        }
      } else {
        state = WelfareData.ENABLE_GET; //不可领取
      }
    }
    return state;
  }

  private updateDiamondPackageState(
    item: LevelGiftItemInfo,
    value: number,
  ): number {
    let state: number = 0;
    if ((value >> item.id) & 0x01) {
      //已经购买
      state = 2;
    } else {
      state = 1; //可购买
    }
    return state;
  }

  private getState1(item1: GradePacketMsg, item2: GradePacketRsp): number {
    let state: number = 0;
    if ((item2.receiveSite >> item1.id) & 0x01) {
      //已经领取
      state = WelfareData.HAS_GET;
      this.data.currentGetPackageId =
        this.data.currentGetPackageId > item1.id
          ? this.data.currentGetPackageId
          : item1.id;
    } else {
      if (ArmyManager.Instance.thane.grades >= item1.grade) {
        //玩家等级大于礼包要求的等级
        if (this.data.currentGetPackageId == item1.id - 1) {
          //可领取
          state = WelfareData.CAN_GET;
        } else {
          state = WelfareData.DISSATISIFY_CONDITION; //未满足条件, 请领取上一等级礼包
        }
      } else {
        state = WelfareData.ENABLE_GET; //不可领取
      }
    }
    return state;
  }

  private getState2(item1: GradePacketMsg, item2: GradePacketRsp): number {
    let state: number = 0;
    if ((item2.buySite >> item1.id) & 0x01) {
      //已经购买
      state = 2;
    } else {
      state = 1; //可购买
    }
    return state;
  }

  private readLevelPacketData(item: GradePacketMsg): LevelGiftItemInfo {
    let levelGiftItemInfo: LevelGiftItemInfo = new LevelGiftItemInfo();
    if (item) {
      levelGiftItemInfo.grade = item.grade;
      levelGiftItemInfo.id = item.id;
      levelGiftItemInfo.freeStr = item.packet;
      levelGiftItemInfo.diamondStr = item.preferPacket;
      levelGiftItemInfo.price = item.price;
      levelGiftItemInfo.discount = item.discount;
    }
    return levelGiftItemInfo;
  }

  /*
   *月卡
   * optType   1 打开活动页面  2 领取普通月卡奖励 3 领取超级月卡奖励
   */
  public sendMonthCardReward(op: number = 1) {
    let msg: MonthCardReqMsg = new MonthCardReqMsg();
    msg.op = op;
    SocketManager.Instance.send(C2SProtocol.C_MONTH_CARD, msg);
  }

  /**
   *在线礼包
   * @param op    操作类型  1打开活动界面 2抽奖
   */
  public sendOnlineRewardReq(op: number) {
    WelfareManager.Instance.sendOnlineRewardReq(op);
  }

  /**
   *确认收到的物品
   * @param reward
   */
  public sendAddItemReq(reward: OnlineRewardMsg) {
    let msg: AddItemReq = new AddItemReq();
    msg.reward = [reward];
    SocketManager.Instance.send(C2SProtocol.C_ONLINE_REWARD_ENSURE, msg);
  }

  /**七日目标信息返回 */
  private sevenGoalsInfo(pkg: PackageIn) {
    let msg: SevenTargetInfoRsp = pkg.readBody(
      SevenTargetInfoRsp,
    ) as SevenTargetInfoRsp;
    if (msg) {
      let item: SevenTaskInfo;
      let sevenTaskMsg: SevenTaskMsg;
      let taskArr: Array<SevenTaskInfo> = [];
      this.data.startTime = msg.startTime;
      this.data.sevenCurrentDay = msg.day;
      this.data.rewardSite = msg.rewardSite;
      this.data.giftSite = msg.giftSite;
      this.data.starNum = msg.starNum;
      this.data.getSevenTreasureArr(); //七日目标积分礼包
      this.data.getSevenGiftBagArr(); //七日目标特惠礼包

      for (let i = 0; i < msg.sevenTask.length; i++) {
        sevenTaskMsg = msg.sevenTask[i] as SevenTaskMsg;
        item = this.readSevenTaskInfo(sevenTaskMsg);
        taskArr.push(item);
      }
      taskArr = ArrayUtils.sortOn(taskArr, ["status"], [ArrayConstant.NUMERIC]);
      this.data.sevenTask = taskArr;
    }
    NotificationManager.Instance.dispatchEvent(
      NotificationEvent.SEVEN_GOALS_TASK_UPDATE,
    );
  }

  /**七日目标任务奖励领取返回  */
  private sevenGoalsTaskRewardInfo(pkg: PackageIn) {
    let msg: TaskReceiveRsp = pkg.readBody(TaskReceiveRsp) as TaskReceiveRsp;
    if (msg) {
      this.data.starNum = msg.starNum;
      let len = this.data.sevenTask.length;
      let sevenTaskInfo: SevenTaskInfo;
      for (let i = 0; i < len; i++) {
        sevenTaskInfo = this.data.sevenTask[i];
        if (sevenTaskInfo && sevenTaskInfo.taskId == msg.status.taskId) {
          sevenTaskInfo.status = msg.status.status;
          break;
        }
      }
      this.data.sevenTask = ArrayUtils.sortOn(
        this.data.sevenTask,
        ["status"],
        [ArrayConstant.NUMERIC],
      );
      Logger.xjy(
        "[WelfareCtrl] sevenGoalsTaskRewardInfo sevenTask=" +
          this.data.sevenTask,
      );
    }
    NotificationManager.Instance.dispatchEvent(
      NotificationEvent.SEVEN_GOALS_TASKGET_UPDATE,
    );
  }

  /**七日目标积分或特惠礼包领取返回 */
  private sevenGoalsBagRewardInfo(pkg: PackageIn) {
    let msg: GiftReceiveRsp = pkg.readBody(GiftReceiveRsp) as GiftReceiveRsp;
    if (msg) {
      this.data.rewardSite = msg.rewardSite;
      this.data.giftSite = msg.giftSite;
    }
  }

  /**七日登录奖励领取返回 */
  private sevenLoginRewardInfo(pkg: PackageIn) {
    let msg: SevenSignReceiveRsp = pkg.readBody(
      SevenSignReceiveRsp,
    ) as SevenSignReceiveRsp;
    if (msg) {
      let sevenLogingInfo: SevenLoginInfo;
      let len = this.data.sevenLoginRewardArr.length;
      for (let i = 0; i < len; i++) {
        sevenLogingInfo = this.data.sevenLoginRewardArr[i];
        sevenLogingInfo.status = this.data.getSevenLoginRewardStatus(
          sevenLogingInfo.day,
          msg.rewardSite,
          this.data.sevenLoginTotalDays,
        );
      }
    }
    this.data.sevenLoginRewardArr = ArrayUtils.sortOn(
      this.data.sevenLoginRewardArr,
      ["day"],
      [ArrayConstant.NUMERIC],
    );
    NotificationManager.Instance.dispatchEvent(
      NotificationEvent.SEVEN_LOGIN_REWARD_UPDATE,
    );
  }

  /**
   *
   * @param str 得到七日登录活动奖励物品
   */
  getSevenRewardInfo(str: string): GoodsInfo {
    let goods: GoodsInfo;
    if (!StringHelper.isNullOrEmpty(str)) {
      let strArr: Array<string> = str.split(",");
      if (strArr && strArr.length == 2) {
        goods = new GoodsInfo();
        goods.templateId = parseInt(strArr[0]);
        goods.count = parseInt(strArr[1]);
      }
    }
    return goods;
  }

  /**得到当前是七日目标活动的第几天 */
  private getCurrentDay(time: number): number {
    let day: number = 0;
    let timeValue = time * 1000;
    let startDate: Date = Utils.formatTimeZone(
      timeValue,
      PlayerManager.Instance.currentPlayerModel.zoneId,
    );
    let nowDate: Date = PlayerManager.Instance.currentPlayerModel.sysCurtime;
    let hours: number = startDate.getHours();
    let minutes: number = startDate.getMinutes();
    let seconds: number = startDate.getSeconds();
    let sp: number =
      (23 - hours) * 1000 * 60 * 60 +
      (59 - minutes) * 1000 * 60 +
      (59 - seconds) * 1000;
    let totalAdd: number = sp + 5 * 1000 * 60 * 60; //开始时间跟第一天重置时间相差的毫秒数
    let countValue: number = nowDate.getTime() - startDate.getTime(); //当前时间跟开始时间相差的毫秒数
    let dayMin: number = 24 * 60 * 60 * 1000;
    this.data.endTime =
      startDate.getTime() + totalAdd + 6 * 24 * 60 * 60 * 1000;

    if (countValue <= totalAdd) {
      day = 1;
    } else {
      day = Math.ceil((countValue - totalAdd) / dayMin) + 1;
    }
    return day;
  }

  private readSevenTaskInfo(msg: SevenTaskMsg): SevenTaskInfo {
    let sevenTaskInfo: SevenTaskInfo = new SevenTaskInfo();
    if (msg) {
      sevenTaskInfo.taskId = msg.taskId;
      sevenTaskInfo.taskType = msg.taskType;
      sevenTaskInfo.status = msg.status;
      sevenTaskInfo.finishNum = msg.finishNum;
      sevenTaskInfo.day = this.data.getDayValue(sevenTaskInfo.taskId);
    }
    return sevenTaskInfo;
  }

  /**
   * 领取七日登录奖励
   * @param day 天数
   */
  public getSevenLoginReward(day: number) {
    let msg: SevenSignReceiveReq = new SevenSignReceiveReq();
    msg.site = day;
    SocketManager.Instance.send(C2SProtocol.C_SEVEN_SIGN_RECEIVE, msg);
  }

  /**
   * 到了重置时间节点, 主动请求刷新活跃度数据
   */
  public requestRefreshActivity() {
    SocketManager.Instance.send(C2SProtocol.C_DEGREE_ACTIVITY_DATA_REFRESH);
  }

  /**
   * 由七日目标自然过渡到七日登录的时候请求七日登录活动信息
   */
  public requestSevenLoginInfo() {
    SocketManager.Instance.send(C2SProtocol.C_SEVEN_SIGN_INFO);
  }

  public getRewardFundViewByGrade(grade: number) {
    let msg: GrowthFundRecReq = new GrowthFundRecReq();
    msg.grade = grade;
    SocketManager.Instance.send(C2SProtocol.C_GROWTH_FUND_RECEIVE, msg);
  }

  public clickFundViewTab() {
    SocketManager.Instance.send(C2SProtocol.C_GROWTH_FUND_INFO);
  }
}
