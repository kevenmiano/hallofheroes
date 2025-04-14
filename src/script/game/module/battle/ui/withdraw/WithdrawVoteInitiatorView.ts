/*
 * @Author: jeremy.xu
 * @Date: 2023-03-29 11:26:29
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-02-02 14:35:20
 * @Description: 发起撤退
 */

import FUI_WithdrawVoteInitiatorView from "../../../../../../fui/Battle/FUI_WithdrawVoteInitiatorView";
import Logger from "../../../../../core/logger/Logger";
import { BattleManager } from "../../../../battle/BattleManager";
import { BattleModel } from "../../../../battle/BattleModel";
import { BattleEvent } from "../../../../constant/event/NotificationEvent";
import { NotificationManager } from "../../../../manager/NotificationManager";

export default class WithdrawVoteInitiatorView extends FUI_WithdrawVoteInitiatorView {
  private _curPlayer: number = 0;
  private _countDown: number = 0;
  private _timerRuning: boolean = false;

  onConstruct() {
    super.onConstruct();
    this.list.itemRenderer = Laya.Handler.create(
      this,
      this.onRenderListItem,
      null,
      false,
    );
    NotificationManager.Instance.addEventListener(
      BattleEvent.REINFORCE,
      this.__reinforce,
      this,
    );
  }

  public refresh() {
    this.refreshList();
    this.show();
  }

  public refreshList() {
    if (this.battleModel) {
      let roomPlayerCnt = this.battleModel.attackSideHeroUserIds.length;
      this._curPlayer = roomPlayerCnt;
      this.list.numItems = roomPlayerCnt;
    }
  }

  public show() {
    if (this._timerRuning) return;
    this.visible = true;
    this._timerRuning = true;
    this._countDown = 0;
    Laya.timer.clear(this, this.__countDownTimerHandler);
    Laya.timer.loop(1000, this, this.__countDownTimerHandler);
    this.__countDownTimerHandler();
  }

  public hide() {
    this.visible = false;
    Laya.timer.clear(this, this.__countDownTimerHandler);
  }

  private __countDownTimerHandler() {
    let leftTime = this.battleModel.withdrawCountdown - this._countDown;
    if (leftTime < 0) {
      leftTime = 0;
    }
    // Logger.battle("撤退ComWithdrawVoteInitiator", leftTime, this._countDown, leftTime / this._voteLeftTime, (leftTime / this._voteLeftTime) * 100)
    this.progVoteCDLine.value = Math.floor(
      (leftTime / BattleModel.RetreatVoteCountDown) * 100,
    );
    this._countDown += 1;
  }

  private onRenderListItem(index: number, item: fgui.GComponent) {
    if (!item) return;

    if (this._curPlayer == 2) {
      item.getController("cItemWidth").setSelectedIndex(1);
    } else {
      item.getController("cItemWidth").setSelectedIndex(0);
    }

    let selIndex = 0;
    let info = this.battleModel.withdrawInfoList[index];
    if (info) {
      if (info.opt == 1) {
        selIndex = 1;
      } else if (info.opt == 2) {
        selIndex = 2;
      }
    }
    item.getController("cVoteRes").setSelectedIndex(selIndex);
  }

  private __reinforce() {
    this.refresh();
  }

  private get battleModel(): BattleModel {
    return BattleManager.Instance.battleModel;
  }

  dispose() {
    this._timerRuning = false;
    NotificationManager.Instance.removeEventListener(
      BattleEvent.REINFORCE,
      this.__reinforce,
      this,
    );
    this.hide();
    super.dispose();
  }
}
