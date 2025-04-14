/*
 * @Author: jeremy.xu
 * @Date: 2023-03-29 11:26:29
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-02-02 14:35:09
 * @Description: 撤退
 */

import FUI_WithdrawVoteView from "../../../../../../fui/Battle/FUI_WithdrawVoteView";
import UIButton, { UIButtonChangeType } from "../../../../../core/ui/UIButton";
import { BattleManager } from "../../../../battle/BattleManager";
import { BattleModel } from "../../../../battle/BattleModel";
import { BattleEvent } from "../../../../constant/event/NotificationEvent";
import { NotificationManager } from "../../../../manager/NotificationManager";
import { SocketSendManager } from "../../../../manager/SocketSendManager";

export default class WithdrawVoteView extends FUI_WithdrawVoteView {
  private _curPlayer: number = 0;
  private _countDown: number = 0;
  private _timerRuning: boolean = false;
  private uibtnAgree: UIButton;
  private uibtnDisagree: UIButton;

  onConstruct() {
    super.onConstruct();

    this.uibtnAgree = new UIButton(this.btnAgree);
    this.uibtnAgree.changeType = UIButtonChangeType.Light;
    this.uibtnDisagree = new UIButton(this.btnDisagree);
    this.uibtnDisagree.changeType = UIButtonChangeType.Light;

    this.btnAgree.onClick(this, this.btnAgreeClick);
    this.btnDisagree.onClick(this, this.btnDisagreeClick);

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
    this.visible = true;
    this._countDown = 0;
    Laya.timer.clear(this, this.__countDownTimerHandler);
    Laya.timer.loop(1000, this, this.__countDownTimerHandler);
    this.__countDownTimerHandler();
  }

  public hide() {
    this.visible = false;
    Laya.timer.clear(this, this.__countDownTimerHandler);
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

  private __countDownTimerHandler() {
    let leftTime = this.battleModel.withdrawCountdown - this._countDown;
    if (leftTime < 0) {
      leftTime = 0;
    }
    this.progVoteCDLine.value = Math.floor(
      (leftTime / BattleModel.RetreatVoteCountDown) * 100,
    );
    this._countDown++;
    if (leftTime == 0) {
      this.btnDisagreeClick();
      return;
    }
  }

  private __reinforce() {
    this.refresh();
  }

  private btnAgreeClick() {
    SocketSendManager.Instance.sendWithDrawBattle(1);
  }

  private btnDisagreeClick() {
    SocketSendManager.Instance.sendWithDrawBattle(2);
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
