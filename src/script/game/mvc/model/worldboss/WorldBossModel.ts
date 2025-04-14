import StringHelper from "../../../../core/utils/StringHelper";
import { PlayerManager } from "../../../manager/PlayerManager";
import { ThaneInfoHelper } from "../../../utils/ThaneInfoHelper";
import { WoundInfo } from "./WoundInfo";
import { ArrayConstant, ArrayUtils } from "../../../../core/utils/ArrayUtils";
import { WorldBossEvent } from "../../../constant/event/NotificationEvent";
import FrameDataBase from "../../FrameDataBase";
/**
 * @author:shujin.ou
 * @email:1009865728@qq.com
 * @data: 2020-12-02 20:20
 */
export default class WorldBossModel extends FrameDataBase {
  private _woundInfoList: any[];
  private _allWoundInfoList: any[];
  private _jobWoundInfoList: any[];
  public curHp: number = 0;
  public totalHp: number = 0;
  public campaignId: number = 0;
  public selfWoundInfo: WoundInfo;
  public myWound: number = 0;
  public totalNum: number = 0;
  public bossGrades: number = 0;
  public buffGrade: number = 0;
  public rewards: any[];
  public woundAll: boolean;

  public consortiaBossCurHp: number = 0;
  public consortiaBosstotalHp: number = 0;
  constructor() {
    super();
    this.selfWoundInfo = new WoundInfo(-1);
    this._woundInfoList = [];
    this._allWoundInfoList = [];
    this._jobWoundInfoList = [];
    var i: number = 0;
    for (i = 0; i < 30; i++) {
      this._woundInfoList.push(new WoundInfo(i));
    }
    for (i = 0; i < 10; i++) {
      this._allWoundInfoList.push(new WoundInfo(i));
      this._jobWoundInfoList.push(new WoundInfo(i));
    }
  }

  public getWoundInfoByIndex(i: number): WoundInfo {
    if (this.woundAll) {
      return this._allWoundInfoList[i] as WoundInfo;
    } else {
      return this._jobWoundInfoList[i] as WoundInfo;
    }
  }

  public getWoundInfoByNickname(name: string): WoundInfo {
    for (const key in this._woundInfoList) {
      let info: WoundInfo = this._woundInfoList[key];
      if (info.nickName == name) return info;
    }
    return null;
  }

  public addWoundInfo(info: WoundInfo) {
    var index: number = 0;
    for (const key in this._woundInfoList) {
      let info2: WoundInfo = this._woundInfoList[key];
      if (info2.nickName == info.nickName) {
        this._woundInfoList[index] = info;
        return;
      }
      index++;
    }
    this._woundInfoList.push(info);
  }

  public clear() {
    this._woundInfoList = [];
  }

  public get woundInfoList(): Array<any> {
    if (this.woundAll) {
      return this._allWoundInfoList;
    } else {
      return this._jobWoundInfoList;
    }
  }
  public resetAll() {
    for (const key in this._woundInfoList) {
      if (Object.prototype.hasOwnProperty.call(this._woundInfoList, key)) {
        var temp: WoundInfo = this._woundInfoList[key];
        temp.reset();
      }
    }
  }

  public commit() {
    var b: boolean = false;
    var userId: number =
      PlayerManager.Instance.currentPlayerModel.playerInfo.userId;
    for (const key in this._woundInfoList) {
      if (Object.prototype.hasOwnProperty.call(this._woundInfoList, key)) {
        var temp: WoundInfo = this._woundInfoList[key];
        if (StringHelper.isNullOrEmpty(temp.nickName)) {
          temp.reset();
        } else {
          if (temp.userId == userId) {
            if (b) {
              temp.reset();
            } else {
              b = true;
              temp.totalHp = this.selfWoundInfo.totalHp;
              temp.wound = this.selfWoundInfo.wound;
              temp.job = this.selfWoundInfo.job;
            }
          }
        }
      }
    }

    if (!b && !StringHelper.isNullOrEmpty(this.selfWoundInfo.nickName)) {
      var newInfo: WoundInfo = new WoundInfo(1);
      newInfo.nickName = this.selfWoundInfo.nickName;
      newInfo.totalHp = this.selfWoundInfo.totalHp;
      newInfo.wound = this.selfWoundInfo.wound;
      newInfo.job = this.selfWoundInfo.job;
      newInfo.userId = userId;
      this._woundInfoList.push(newInfo);
    }
    this._woundInfoList = ArrayUtils.sortOn(
      this._woundInfoList,
      ["wound"],
      [ArrayConstant.DESCENDING | ArrayConstant.NUMERIC],
    );
    this._allWoundInfoList = [];
    this._jobWoundInfoList = [];
    var job: number = ThaneInfoHelper.getJob(
      PlayerManager.Instance.currentPlayerModel.playerInfo.job,
    );
    var i: number = 0;
    var indexAll: number = 0;
    var indexJob: number = 0;
    var tempInfo: WoundInfo;
    for (i = 0; i < 10; i++) {
      this._allWoundInfoList.push(new WoundInfo(i));
      this._jobWoundInfoList.push(new WoundInfo(i));
    }
    for (i = 0; i < this._woundInfoList.length; i++) {
      this._woundInfoList[i].index = i;
      if (indexAll < 10) {
        tempInfo = new WoundInfo(indexAll);
        tempInfo.nickName = (this._woundInfoList[i] as WoundInfo).nickName;
        tempInfo.totalHp = (this._woundInfoList[i] as WoundInfo).totalHp;
        tempInfo.wound = (this._woundInfoList[i] as WoundInfo).wound;
        tempInfo.job = (this._woundInfoList[i] as WoundInfo).job;
        tempInfo.userId = (this._woundInfoList[i] as WoundInfo).userId;
        this._allWoundInfoList[indexAll] = tempInfo;
        indexAll++;
      }
      if (
        ThaneInfoHelper.getJob(this._woundInfoList[i].job) == job &&
        indexJob < 10
      ) {
        tempInfo = new WoundInfo(indexJob);
        tempInfo.nickName = (this._woundInfoList[i] as WoundInfo).nickName;
        tempInfo.totalHp = (this._woundInfoList[i] as WoundInfo).totalHp;
        tempInfo.wound = (this._woundInfoList[i] as WoundInfo).wound;
        tempInfo.job = (this._woundInfoList[i] as WoundInfo).job;
        tempInfo.userId = (this._woundInfoList[i] as WoundInfo).userId;
        this._jobWoundInfoList[indexJob] = tempInfo;
        indexJob++;
      }
    }
    while (this._woundInfoList.length > 30) this._woundInfoList.pop();
    this.dispatchEvent(WorldBossEvent.UPDATE_WOUND_LIST, this._woundInfoList);
  }

  public commitConosrtiaBossHp() {
    this.dispatchEvent(WorldBossEvent.UPDATE_CONSORTIA_BOSS_HP);
  }
}
