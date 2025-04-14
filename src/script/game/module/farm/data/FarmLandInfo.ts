/*
 * @Author: jeremy.xu
 * @Date: 2021-04-21 09:57:36
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-10-19 17:12:08
 * @Description:
 */

import GameEventDispatcher from "../../../../core/event/GameEventDispatcher";
import LangManager from "../../../../core/lang/LangManager";
import { t_s_itemtemplateData } from "../../../config/t_s_itemtemplate";
import { CropPhase } from "../../../constant/CropPhase";
import { CropState } from "../../../constant/CropState";
import { FarmEvent } from "../../../constant/event/NotificationEvent";
import { FarmOperateType } from "../../../constant/FarmOperateType";
import { ThaneInfo } from "../../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../../manager/ArmyManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import ConfigMgr from "../../../../core/config/ConfigMgr";
import { ConfigType } from "../../../constant/ConfigDefine";
import { FarmModel } from "./FarmModel";

export default class FarmLandInfo extends GameEventDispatcher {
  public userId: number = 0;
  /**
   *土地位置
   */
  public pos: number = 0;
  public plantTime: Date;
  public matureTime: Date;
  /**
   * 未加速前的成熟时间
   */
  public originMatureTime: Date;
  /**
   *加速次数
   */
  public accelerateCount: number = 0;
  /**
   *被偷次数
   */
  public stolenCount: number = 0;
  /**
   *偷取列表
   */
  public stolenList: Array<number>;
  /**
   *剩余产量
   */
  public outputCount: number = 0;

  private _cropTempId: number = 0;
  private _cropTemp: t_s_itemtemplateData;
  private _isWormP1: boolean; //阶段一是否长虫
  private _isWormP2: boolean; //阶段二是否长虫
  private _isGrassP1: boolean; //阶段一是否长草
  private _isGrassP2: boolean; //阶段二是否长草
  private _resultBack: number = 0; //土地操作返回结果
  private _operBack: number = 0; //土地操作返回类型

  /**
   * 作物模板（Property1:成熟时间, Property2:收获物品模板ID, Property3:收获数量, Property4:是否长虫草(1有,0无), Property5:是否特殊作物(>0是)）
   */
  public get cropTemp(): t_s_itemtemplateData {
    return this._cropTemp;
  }

  /**
   * 作物模板ID
   */
  public get cropTempId(): number {
    return this._cropTempId;
  }

  public set cropTempId(value: number) {
    if (this._cropTempId == value) return;
    this._cropTempId = value;
    this._cropTemp = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_itemtemplate,
      this._cropTempId,
    );
  }

  /**
   * 作物阶段
   */
  public get cropPhase(): number {
    if (!this.hasCrop) return CropPhase.NONE;
    if (this.isDie) return CropPhase.DIE;
    if (this.isMature) return CropPhase.MATURE;
    return CropPhase.GROW;
  }

  /**
   * 作物阶段
   */
  public get cropPhaseString(): string {
    switch (this.cropPhase) {
      case CropPhase.DIE:
        return LangManager.Instance.GetTranslation(
          "farm.data.FarmLandInfo.canRevive",
        );
      case CropPhase.MATURE:
        return LangManager.Instance.GetTranslation(
          "farm.data.FarmLandInfo.mature",
        );
    }
    return LangManager.Instance.GetTranslation("farm.data.FarmLandInfo.grow");
  }

  /**
   * 作物状态
   */
  public get cropState(): number {
    if (!this.hasCrop) return CropState.NONE;
    if (this.isWormNow) return CropState.WORM;
    if (this.isGrassNow) return CropState.GRASS;
    return CropState.HEALTHY;
  }

  /**
   * 作物状态
   */
  public get cropStateString(): string {
    switch (this.cropState) {
      case CropState.WORM:
        return LangManager.Instance.GetTranslation(
          "farm.data.FarmLandInfo.canWorm",
        );
      case CropState.GRASS:
        return LangManager.Instance.GetTranslation(
          "farm.data.FarmLandInfo.canWeed",
        );
    }
    return LangManager.Instance.GetTranslation(
      "farm.data.FarmLandInfo.healthy",
    );
  }

  /**
   * 当前操作
   */
  public get curOper(): number {
    if (!this.hasCrop) {
      if (this.isSelfLand) return FarmOperateType.PLANT;
      else return FarmOperateType.NO_OPER;
    }
    if (this.isMature) {
      if (this.isSelfLand) return FarmOperateType.PICK;
      else return FarmOperateType.STEAL;
    }
    if (this.isDie) {
      if (this.isSelfLand) return FarmOperateType.CLEAR;
      else return FarmOperateType.REVIVE;
    }
    if (this.isWormNow) return FarmOperateType.WORM;
    if (this.isGrassNow) return FarmOperateType.WEED;
    if (this.isSelfLand) return FarmOperateType.SHOW_MENU;
    return FarmOperateType.NO_OPER;
  }

  /**
   * 是否有种植作物
   */
  public get hasCrop(): boolean {
    return this.cropTempId > 0;
  }

  /**
   * 是否已加速
   */
  public get hasAccelerate(): boolean {
    return this.accelerateCount > 0;
  }

  /**
   * 作物是否成熟
   */
  public get isMature(): boolean {
    return this.hasCrop && this.remainMatureTime <= 0 && !this.isDie;
  }

  /**
   * 剩余成熟时间（秒）
   */
  public get remainMatureTime(): number {
    let time: number =
      this.matureTime.getTime() / 1000 - this.sysCurTimeBySecond;
    // Logger.xjy("[FarmLandInfo]remainMatureTime s:", time, this.matureTime.getTime() / 1000, this.sysCurTimeBySecond)
    return time > 0 ? time : 0;
  }

  /**
   * 总共成熟时间（秒）
   */
  public get totalMatureTime(): number {
    let time: number =
      this.matureTime.getTime() / 1000 - this.plantTime.getTime() / 1000;
    return time > 0 ? time : 0;
  }
  /**
   * 总共成熟时间 未加速前（秒）
   */
  public get totalMatureTimeUnAccelerate(): number {
    let time: number =
      this.originMatureTime.getTime() / 1000 - this.plantTime.getTime() / 1000;
    return time > 0 ? time : 0;
  }

  /**
   * 剩余成熟时间（分钟）
   */
  public get remainMatureMinutes(): number {
    return Math.ceil(this.remainMatureTime / 60);
  }

  /**
   * 总共成熟时间（分钟）
   */
  public get totalMatureMinutes(): number {
    return Math.ceil(this.totalMatureTime / 60);
  }

  /**
   * 已成长时间（秒）
   */
  public get growTime(): number {
    let time: number =
      this.sysCurTimeBySecond - this.plantTime.getTime() / 1000;

    time = time > 0 ? time : 0;

    // 如果已加速, 需要算上加速的时间
    time = time + (this.totalMatureTimeUnAccelerate - this.totalMatureTime);
    return time;
  }

  /**
   * 已成长时间（分钟）
   */
  public get growMinutes(): number {
    return Math.floor(this.growTime / 60);
  }

  /**
   * 作物是否枯萎
   */
  public get isDie(): boolean {
    if (!this._cropTemp) return false;
    let dieTime: number =
      this.matureTime.getTime() / 1000 + this._cropTemp.Property1 * 60;
    return this.sysCurTimeBySecond > dieTime;
  }

  /**
   * 当前是否长虫
   */
  public get isWormNow(): boolean {
    if (
      !this._cropTemp ||
      this._cropTemp.Property4 == 0 ||
      this.isMature ||
      this.isDie
    )
      return false;
    let ptime: number = this.plantTime.getTime() / 1000;
    let mtime: number = this.matureTime.getTime() / 1000;
    let wormTimeP1: number = ptime + (mtime - ptime) * 0.4;
    let wormTimeP2: number = ptime + (mtime - ptime) * 0.6;

    let bTmp =
      (this.sysCurTimeBySecond > wormTimeP1 && this._isWormP1) ||
      (this.sysCurTimeBySecond > wormTimeP2 && this._isWormP2);
    // Logger.xjy("[FarmLandInfo]remainMatureTime s:", bTmp, "ptime=" + ptime, "mtime=" + mtime, "wormTimeP1=" + wormTimeP1, "wormTimeP2=" + wormTimeP2)
    return bTmp;
  }

  /**
   * 当前是否长草
   */
  public get isGrassNow(): boolean {
    if (
      !this._cropTemp ||
      this._cropTemp.Property4 == 0 ||
      this.isMature ||
      this.isDie
    )
      return false;
    let ptime: number = this.plantTime.getTime() / 1000;
    let mtime: number = this.matureTime.getTime() / 1000;
    let grassTimeP1: number = ptime + (mtime - ptime) * 0.3;
    let grassTimeP2: number = ptime + (mtime - ptime) * 0.5;

    let bTmp =
      (this.sysCurTimeBySecond > grassTimeP1 && this._isGrassP1) ||
      (this.sysCurTimeBySecond > grassTimeP2 && this._isGrassP2);
    // Logger.xjy("[FarmLandInfo]remainMatureTime s:", bTmp, "ptime=" + ptime, "mtime=" + mtime, "grassTimeP1=" + grassTimeP1, "grassTimeP2=" + grassTimeP2)
    return bTmp;
  }

  /**
   * 能否被偷
   */
  public get canBeStolen(): string {
    for (let index = 0; index < this.stolenList.length; index++) {
      const id = this.stolenList[index];
      if (id == this.thane.userId)
        return LangManager.Instance.GetTranslation(
          "farm.data.FarmLandInfo.hasStolen",
        );
    }
    if (this.stolenCount >= FarmModel.MAX_STOLEN_COUNT)
      return LangManager.Instance.GetTranslation(
        "farm.data.FarmLandInfo.notMuchLeft",
      );
    if (this.outputCount < 10)
      return LangManager.Instance.GetTranslation(
        "farm.data.FarmLandInfo.notMuchLeft",
      );
    return "";
  }

  /**
   * 是否可收获
   */
  public get canPick(): boolean {
    if (this.hasCrop && this.isMature) return true;
    return false;
  }

  public get isSelfLand(): boolean {
    return this.userId == this.thane.userId;
  }

  public set isWormP1(value: boolean) {
    if (this._isWormP1 == value) return;
    this._isWormP1 = value;
  }

  public set isWormP2(value: boolean) {
    if (this._isWormP2 == value) return;
    this._isWormP2 = value;
  }

  public set isGrassP1(value: boolean) {
    if (this._isGrassP1 == value) return;
    this._isGrassP1 = value;
  }

  public set isGrassP2(value: boolean) {
    if (this._isGrassP2 == value) return;
    this._isGrassP2 = value;
  }

  /**
   * 土地操作返回类型
   */
  public get operBack(): number {
    return this._operBack;
  }
  public set operBack(value: number) {
    this._operBack = value;
  }

  /**
   * 土地操作返回结果（0: 成功, 1: 失败, 2: 非操作更新）
   */
  public get resultBack(): number {
    return this._resultBack;
  }

  public set resultBack(value: number) {
    this._resultBack = value;
    this.dispatchEvent(FarmEvent.OPER_BACK);
  }

  public beginChanges() {}
  /**
   *状态更新完成, 发出事件
   *
   */
  public commitChanges() {
    this.dispatchEvent(FarmEvent.LANDINFO_UPDATE);
  }

  // 一键处理不包括铲除
  public get canHandleOneKey(): boolean {
    let curOper = this.curOper;
    if (
      (curOper == FarmOperateType.STEAL && !this.canBeStolen) ||
      curOper == FarmOperateType.WORM ||
      curOper == FarmOperateType.WEED ||
      curOper == FarmOperateType.REVIVE ||
      curOper == FarmOperateType.PICK
    ) {
      return true;
    }
    return false;
  }

  private get sysCurTimeBySecond(): number {
    return PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond;
  }

  private get thane(): ThaneInfo {
    return ArmyManager.Instance.thane;
  }
}
