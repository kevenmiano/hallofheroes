import LangManager from "../../../core/lang/LangManager";
import { ArrayConstant, ArrayUtils } from "../../../core/utils/ArrayUtils";
import { DateFormatter } from "../../../core/utils/DateFormatter";
import { Int64Utils } from "../../../core/utils/Int64Utils";
import Num from "../../../core/utils/Num";
import { SimpleDictionary } from "../../../core/utils/SimpleDictionary";
import ConfigInfoManager from "../../manager/ConfigInfoManager";
import OutyardManager from "../../manager/OutyardManager";
import { PlayerManager } from "../../manager/PlayerManager";
import FrameDataBase from "../../mvc/FrameDataBase";
import OutyardGuildInfo from "./data/OutyardGuildInfo";
import OutyardUserInfo from "./data/OutyardUserInfo";

//@ts-expect-error: External dependencies
import StackHeadStateMsg = com.road.yishi.proto.stackhead.StackHeadStateMsg;

//@ts-expect-error: External dependencies
import StackHeadOpenTimeMsg = com.road.yishi.proto.stackhead.StackHeadOpenTimeMsg;
import Utils from "../../../core/utils/Utils";
export default class OutyardModel extends FrameDataBase {
  public static NOT_OPEN: number = 0; //未开放
  public static COLLECT: number = 1; //报名信息收集中
  public static READY: number = 2; //备战中
  public static FIGHTING: number = 3; //开战中
  public static CLEAR: number = 4; //结算
  public static OVER: number = 5; //结束
  private _memberList: SimpleDictionary;
  /**
   *得到指定排序的公会成员列表
   * @param field  排序字段
   */
  public getSortMemberList(
    field: string = "fightingCapacity",
    reverse: boolean = true,
  ): Array<OutyardUserInfo> {
    let arr: Array<OutyardUserInfo> = [];
    if (this._memberList) {
      let memberArr: Array<OutyardUserInfo>;
      memberArr = this._memberList.getList();
      let len: number = memberArr.length;
      for (let i: number = 0; i < len; i++) {
        arr.push(memberArr[i]);
      }
    }
    if (field == "nickName") {
      if (reverse) {
        arr = ArrayUtils.sortOn(
          arr,
          ["isOnline", field],
          [ArrayConstant.DESCENDING, ArrayConstant.DESCENDING],
        );
      } else {
        arr = ArrayUtils.sortOn(
          arr,
          ["isOnline", field],
          [ArrayConstant.DESCENDING, ArrayConstant.CASEINSENSITIVE],
        );
      }
    } else if (field == "crossGuildTeamId") {
      if (reverse) {
        arr = ArrayUtils.sortOn(
          arr,
          [field],
          [ArrayConstant.NUMERIC | ArrayConstant.DESCENDING],
        );
      } else {
        arr = ArrayUtils.sortOn(arr, [field], [ArrayConstant.NUMERIC]);
      }
    } else if (field == "grades") {
      if (reverse) {
        arr = ArrayUtils.sortOn(
          arr,
          ["isOnline", "vocationGrades", field],
          [
            ArrayConstant.DESCENDING,
            ArrayConstant.NUMERIC | ArrayConstant.DESCENDING,
            ArrayConstant.NUMERIC | ArrayConstant.DESCENDING,
          ],
        );
      } else {
        arr = ArrayUtils.sortOn(
          arr,
          ["isOnline", "vocationGrades", field],
          [
            ArrayConstant.DESCENDING,
            ArrayConstant.NUMERIC,
            ArrayConstant.NUMERIC,
          ],
        );
      }
    } else {
      if (reverse) {
        arr = ArrayUtils.sortOn(
          arr,
          ["isOnline", field],
          [
            ArrayConstant.DESCENDING,
            ArrayConstant.NUMERIC | ArrayConstant.DESCENDING,
          ],
        );
      } else {
        arr = ArrayUtils.sortOn(
          arr,
          ["isOnline", field],
          [ArrayConstant.DESCENDING, ArrayConstant.NUMERIC],
        );
      }
    }
    return arr;
  }

  public set memberList(value: SimpleDictionary) {
    this._memberList = value;
  }

  public get memberList(): SimpleDictionary {
    return this._memberList;
  }

  public getNextOpenStr(): string {
    let timeStr: string = "";
    let guildArr: Array<OutyardGuildInfo> = OutyardManager.Instance.guildArr;
    let info: OutyardGuildInfo;
    let maxInfo: OutyardGuildInfo;
    let maxScore: number = 0;
    let score: number = 0;
    for (let i: number = 0; i < guildArr.length; i++) {
      info = guildArr[i] as OutyardGuildInfo;
      if (info && info.currentScore >= maxScore) {
        maxScore = info.currentScore;
        maxInfo = info;
      }
    }
    for (let j: number = 0; j < guildArr.length; j++) {
      info = guildArr[j] as OutyardGuildInfo;
      if (info && maxInfo && maxInfo.guildUid == info.guildUid) {
        continue;
      }
      score += info.currentScore;
    }
    let config3: Array<any> =
      ConfigInfoManager.Instance.getStackHeadWeekUnion();
    let stateMsg: StackHeadStateMsg = OutyardManager.Instance.stateMsg;
    if (stateMsg.state == OutyardModel.FIGHTING) {
      //开战中
      timeStr = LangManager.Instance.GetTranslation(
        "outyard.OutyardFrame.carryOut",
      );
      if (
        maxInfo &&
        maxInfo.currentScore > score &&
        maxInfo.currentScore > parseInt(config3[0]) &&
        stateMsg &&
        stateMsg.openTime.length == stateMsg.session &&
        guildArr.length == 4
      ) {
        timeStr = LangManager.Instance.GetTranslation(
          "outyard.OutyardFrame.lastAttackTxt",
          maxInfo.guildName,
          config3[1],
        );
      }
    } else if (stateMsg.state == OutyardModel.OVER) {
      //最后一场结束
      timeStr = LangManager.Instance.GetTranslation(
        "outyard.OutyardFrame.carryOutOver",
      );
    }
    return timeStr;
  }

  /**
   *
   * @returns 本场战斗剩余时间
   */
  public getCurrentLeftStr(): string {
    let leftStr: string = "";
    let stateMsg: StackHeadStateMsg = OutyardManager.Instance.stateMsg;
    if (stateMsg.state == OutyardModel.FIGHTING) {
      let openMsg: StackHeadOpenTimeMsg = stateMsg.openTime[
        stateMsg.session - 1
      ] as StackHeadOpenTimeMsg;
      let zoneOffset = PlayerManager.Instance.currentPlayerModel.zoneId;
      let zoneTime = Utils.formatTimeZone(
        Number(openMsg.endTime),
        zoneOffset,
      ) as Date;
      let end: number =
        Number(zoneTime.getTime()) / 1000 -
        PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond;
      let time: string = DateFormatter.getStopDateString(end);
      leftStr = LangManager.Instance.GetTranslation(
        "outyard.OutyardFrame.leftTime",
        time,
      );
      if (end <= 60) {
        leftStr = LangManager.Instance.GetTranslation(
          "outyard.OutyardFrame.leftTime1",
        );
      }
    }
    return leftStr;
  }

  public getDescTxt(): string {
    let timeStr: string = "";
    let stateMsg: StackHeadStateMsg = OutyardManager.Instance.stateMsg;
    let zoneOffset = PlayerManager.Instance.currentPlayerModel.zoneId;
    if (stateMsg.state == OutyardModel.FIGHTING) {
      //在战斗中
      let openMsg: StackHeadOpenTimeMsg = stateMsg.openTime[
        stateMsg.session - 1
      ] as StackHeadOpenTimeMsg;
      let zoneTime = Utils.formatTimeZone(
        Number(openMsg.endTime),
        zoneOffset,
      ) as Date;
      let end: number =
        Number(zoneTime.getTime()) / 1000 -
        PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond;
      let time: string = DateFormatter.getStopDateString(end);
      timeStr = LangManager.Instance.GetTranslation(
        "outyard.OutyardFrame.leftTime",
        time,
      );
      if (end <= 60) {
        timeStr = LangManager.Instance.GetTranslation(
          "outyard.OutyardFrame.leftTime1",
        );
      }
    } else if (stateMsg.state == OutyardModel.READY) {
      //备战中
      let openMsg: StackHeadOpenTimeMsg = stateMsg.openTime[
        stateMsg.session - 1
      ] as StackHeadOpenTimeMsg;
      let startTime: number = 0;
      let startTime2 = openMsg.startTime as any;
      if (startTime2.high) {
        startTime = Int64Utils.int64ToNumber(startTime2);
      } else {
        startTime = Number(openMsg.startTime);
      }
      let zoneTime = Utils.formatTimeZone(
        Number(startTime),
        zoneOffset,
      ) as Date;
      let sed: number =
        zoneTime.getTime() / 1000 -
        PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond;
      let time: string = DateFormatter.getStopDateString(sed);
      timeStr = LangManager.Instance.GetTranslation(
        "outyard.OutyardFrame.intervalTime",
        time,
      );
      if (sed <= 60) {
        timeStr = LangManager.Instance.GetTranslation(
          "outyard.OutyardFrame.intervalTime1",
        );
      }
    } else if (stateMsg.state == OutyardModel.OVER) {
      //最后一场结束
      timeStr = LangManager.Instance.GetTranslation(
        "outyard.OutyardFrame.carryOutOver",
      );
    }
    return timeStr;
  }

  //是否处于比赛日四场开放时间中
  public isOpenTime(): boolean {
    let stateMsg: StackHeadStateMsg = OutyardManager.Instance.stateMsg;
    if (stateMsg.state == OutyardModel.FIGHTING) {
      return true;
    } else {
      return false;
    }
  }

  /**
   *
   * @returns 是否是比赛日
   */
  public checkIsOpenDay(): boolean {
    let currentDay: number =
      PlayerManager.Instance.currentPlayerModel.sysCurtime.getDay();
    if (currentDay == 0) {
      currentDay = 7;
    }
    let openDayArr: Array<number> =
      ConfigInfoManager.Instance.getOutyardOpenDay();
    let flag: boolean = false;
    for (let i: number = 0; i < openDayArr.length; i++) {
      if (openDayArr[i] == currentDay) {
        flag = true;
        break;
      }
    }
    return flag;
  }
}
