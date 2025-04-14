//@ts-expect-error: External dependencies
/*
 * @Author: jeremy.xu
 * @Date: 2021-06-03 11:07:53
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2022-04-12 14:38:39
 * @Description:
 */
import GameEventDispatcher from "../../../../core/event/GameEventDispatcher";
import LangManager from "../../../../core/lang/LangManager";
import { WaterEvent } from "../../../constant/event/NotificationEvent";
import { ThaneInfo } from "../../../datas/playerinfo/ThaneInfo";
import { TipMessageData } from "../../../datas/TipMessageData";
import { ArmyManager } from "../../../manager/ArmyManager";
import { CampaignManager } from "../../../manager/CampaignManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { TaskTraceTipManager } from "../../../manager/TaskTraceTipManager";
import { WaterManager } from "../../../manager/WaterManager";
import { SceneManager } from "../../../map/scene/SceneManager";
import SceneType from "../../../map/scene/SceneType";
import { WorldBossHelper } from "../../../utils/WorldBossHelper";

export class TreeInfo extends GameEventDispatcher {
  public userId: number = 0; // 用户编号
  public waterCount: number = 0; // 当前浇水数量
  public fruitCount: number = 0;
  public isFirstFruit: boolean;
  public nextPickTime: Date;
  public lastWaterTime: Date;
  public property1: number = 0;
  public property2: number = 0;
  public nickName: string;
  public left_time: number = 0;
  public left_pickTime: number = 0;

  private _notHasTree: boolean = false;
  public get notHasTree(): boolean {
    return this._notHasTree;
  }

  public set notHasTree(val: boolean) {
    this._notHasTree = val;
  }

  private _timeId: any = 0;
  private _timePickId: any = 0;

  private _preRequestTime: number = 0;
  private _requestTime: number = 0;

  private _todayCanWater: boolean = true;
  public get todayCanWater(): boolean {
    return this._todayCanWater;
  }

  public set todayCanWater(val: boolean) {
    this._todayCanWater = val;
  }

  private _gp: number = 0;
  public get gp(): number {
    return this._gp;
  }

  public set gp(val: number) {
    if (this._gp == val) {
      return;
    }
    this._gp = val;

    this.dispatchEvent(WaterEvent.GP_CHANGED, null);
  }

  private _treeGrades: number = 0;
  /**
   * 用户树等级
   * @return
   *
   */
  public get treeGrades(): number {
    return this._treeGrades;
  }

  public set treeGrades(val: number) {
    if (this._treeGrades == val) {
      return;
    }
    this._treeGrades = val;
    this.dispatchEvent(WaterEvent.GRAGE_CHANGED, null);
  }

  public set requestTime(value: number) {
    if (this._requestTime == 0) {
      this._preRequestTime = value;
    } else {
      this._preRequestTime = this._requestTime;
    }
    this._requestTime = value;
  }

  public get needRequiest(): boolean {
    if (this.userId == this.thane.userId) {
      return false;
    }
    if (this.notHasTree) {
      return true;
    }
    return this._requestTime - this._preRequestTime > 1000;
  }

  public set leftpickTime(value: number) {
    this.left_pickTime = value;
    if (this.left_pickTime <= 0) {
      this.left_pickTime = 0;
      clearTimeout(this._timePickId);
      let currentScence: string = SceneManager.Instance.currentType;
      if (
        this.userId == this.thane.userId &&
        this.canPick &&
        (currentScence == SceneType.CASTLE_SCENE || this.inHoodRoom())
      ) {
        let tipData: TipMessageData = new TipMessageData();
        tipData.title = LangManager.Instance.GetTranslation("public.prompt");
        tipData.type = TipMessageData.TREE_CAN_PICK;
        TaskTraceTipManager.Instance.showView(tipData);
      }
    } else {
      clearTimeout(this._timePickId);
      this._timePickId = 0;
      this._timePickId = setTimeout(this.refreshPickTime.bind(this), 1000);
    }
  }

  /**
   * 是否在挂机房的判断
   * @return
   *
   */
  private inHoodRoom(): boolean {
    if (
      SceneManager.Instance.currentType == SceneType.CAMPAIGN_MAP_SCENE &&
      CampaignManager.Instance.mapModel &&
      WorldBossHelper.checkHoodRoom(CampaignManager.Instance.mapModel.mapId)
    ) {
      return true;
    }
    return false;
  }

  private refreshPickTime() {
    this.leftpickTime = this.left_pickTime - 1;
  }

  public set timeLeft(value: number) {
    this.left_time = value;
    if (this.left_time <= 0) {
      this.left_time = 0;
      clearTimeout(this._timeId);
    } else {
      clearTimeout(this._timeId);
      this._timeId = 0;
      this._timeId = setTimeout(this.refreshTime.bind(this), 1000);
    }
  }

  private refreshTime() {
    this.timeLeft = this.left_time - 1;
  }

  public get remainWaerTime(): number {
    if (!this.lastWaterTime) {
      return 0;
    }
    return (
      (this.lastWaterTime.getTime() +
        10 * 60 * 1000 -
        (this.serverTime.getTime() + Laya.Browser.now())) /
      1000
    );
  }

  public get remainPickTime(): number {
    let curServerTime: number = this.serverTime.getTime() + Laya.Browser.now();
    let date2: Date = new Date(
      this.serverTime.getFullYear(),
      this.serverTime.getMonth(),
      this.serverTime.getDate() + 1,
      0,
      0,
      0,
      0,
    );
    if (curServerTime - this.nextPickTime.getTime() >= 0) {
      return 0;
    }
    return (date2.getTime() - curServerTime) / 1000;
  }

  public get canPick(): boolean {
    if (this.thane.userId != this.userId) {
      return false;
    }
    if (this.fruitCount <= 0) {
      return false;
    }
    if (this.left_pickTime > 0) {
      return false;
    }
    return true;
  }

  public get canWater(): boolean {
    let isSelf = this.userId == this.thane.userId;
    // 自己的浇水状态不从这里取, 有时候还没更新
    if (!isSelf) {
      if (!WaterManager.Instance.canGivePower(this.userId)) return false;
    }

    if (isSelf && !this.todayCanWater) return false;
    if (isSelf && this.left_time > 1) return false;
    //自己有果实不能浇水。好友不判断有没有果实，也能浇水。
    if (isSelf && this.fruitCount > 0) return false;
    return true;
  }

  public get treeResource(): number {
    if (this.treeGrades <= 9) {
      return 1;
    } else if (this.treeGrades <= 19) {
      return 2;
    } else if (this.treeGrades <= 29) {
      return 3;
    }
    return 3;
  }

  private get serverTime(): Date {
    let date: Date = new Date();
    date.setTime(
      PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond * 1000,
    );
    return date;
  }

  private get thane(): ThaneInfo {
    return ArmyManager.Instance.thane;
  }
}
