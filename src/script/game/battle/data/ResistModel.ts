/**
 * @author:jeremy.xu
 * @data: 2020-11-30 11:00
 * @description :  记录抗性
 **/

import { BattleNotic } from "../../constant/event/NotificationEvent";
import { GameBaseQueueManager } from "../../manager/GameBaseQueueManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { ResistDelayAction } from "../actions/ResistDelayAction";

export class ResistModel {
  private _resistTotal: number = 0;

  private _currentResistSide: number = -1;
  private _curSide: number;
  private _attackOver: boolean = false;

  constructor() {}

  public get resistTotal(): number {
    return this._resistTotal;
  }

  public set resistTotal(value: number) {
    this._resistTotal = value;
    // NotificationManager.Instance.sendNotification(BattleNotic.SET_RESIST_TOTAL_DAMAGE, this._resistTotal, this._currentResistSide);
  }

  public get currentResistSide(): number {
    return this._currentResistSide;
  }

  /**
   * 设定当前被攻击对象
   */
  public set currentResistSide(value: number) {
    this._currentResistSide = value;
    // NotificationManager.Instance.sendNotification(BattleNotic.SET_RESIST_VISIBLE,true);
  }

  public get attackOver(): boolean {
    return this._attackOver;
  }

  /**
   * 技能对所有被攻击对象造成伤害后设置为true
   * 并且发出通知显示抗性UI
   */
  public set attackOver(value: boolean) {
    this._attackOver = value;
    if (this._attackOver) {
      if (this._curSide != this._currentResistSide) {
        NotificationManager.Instance.sendNotification(
          BattleNotic.SET_RESIST_TOTAL_DAMAGE,
          this._resistTotal,
          this._currentResistSide,
        );
        NotificationManager.Instance.sendNotification(
          BattleNotic.SET_RESIST_VISIBLE,
          true,
          this._currentResistSide,
        );
      } else {
        GameBaseQueueManager.Instance.addAction(
          new ResistDelayAction(
            this._attackOver,
            this._resistTotal,
            this._currentResistSide,
            15,
          ),
        );
      }
      this._curSide = this._currentResistSide;
      NotificationManager.Instance.sendNotification(
        BattleNotic.SET_RESIST_VISIBLE,
        true,
        this._currentResistSide,
      );
    } else {
      NotificationManager.Instance.sendNotification(
        BattleNotic.SET_RESIST_VISIBLE,
        false,
        this._currentResistSide,
      );
      this._resistTotal = 0;
    }
  }
}
