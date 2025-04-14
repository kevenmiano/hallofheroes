import FUI_RechargeLotteryView from "../../../../../fui/Funny/FUI_RechargeLotteryView";
import { ChargeLotteryManager } from "../../../manager/ChargeLotteryManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import {
  BagEvent,
  NotificationEvent,
  ShopEvent,
} from "../../../constant/event/NotificationEvent";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import AudioManager from "../../../../core/audio/AudioManager";
import { SoundIds } from "../../../constant/SoundIds";
import LangManager from "../../../../core/lang/LangManager";
import Utils from "../../../../core/utils/Utils";
import ComponentSetting from "../../../utils/ComponentSetting";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { EmWindow } from "../../../constant/UIDefine";
import { PlayerManager } from "../../../manager/PlayerManager";
import { DateFormatter } from "../../../../core/utils/DateFormatter";
import { RechargeLotteryGoodsItem } from "./RechargeLotteryGoodsItem";
import { RechargeLotteryInfoItem } from "./RechargeLotteryInfoItem";
import UIButton from "../../../../core/ui/UIButton";
import { ArrayConstant, ArrayUtils } from "../../../../core/utils/ArrayUtils";
import Logger from "../../../../core/logger/Logger";
import MainToolBar from "../../home/MainToolBar";
import { GoodsManager } from "../../../manager/GoodsManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import MaskLockOper from "../../../component/MaskLockOper";
import RechargeAlertMannager from "../../../manager/RechargeAlertMannager";
import { TaskTraceTipManager } from "../../../manager/TaskTraceTipManager";
import { ConfigManager } from "../../../manager/ConfigManager";
import { FunnyContent } from "./FunnyContent";

import LotteryItemMsg = com.road.yishi.proto.active.LotteryItemMsg;
import LotteryInfoMsg = com.road.yishi.proto.active.LotteryInfoMsg;
import ChargePointLotteryMsg = com.road.yishi.proto.active.ChargePointLotteryMsg;

/**
 * @description
 * @author yuanzhan.yu
 * @date 2023/5/22 15:11
 * @ver 1.0
 */
export class RechargeLotteryView
  extends FUI_RechargeLotteryView
  implements FunnyContent
{
  declare public item_0: RechargeLotteryGoodsItem;
  declare public item_1: RechargeLotteryGoodsItem;
  declare public item_2: RechargeLotteryGoodsItem;
  declare public item_3: RechargeLotteryGoodsItem;
  declare public item_4: RechargeLotteryGoodsItem;
  declare public item_5: RechargeLotteryGoodsItem;
  declare public item_6: RechargeLotteryGoodsItem;
  declare public item_7: RechargeLotteryGoodsItem;
  declare public item_8: RechargeLotteryGoodsItem;
  declare public item_9: RechargeLotteryGoodsItem;
  declare public item_10: RechargeLotteryGoodsItem;
  declare public item_11: RechargeLotteryGoodsItem;
  declare public item_12: RechargeLotteryGoodsItem;
  declare public item_13: RechargeLotteryGoodsItem;
  declare public item_14: RechargeLotteryGoodsItem;
  declare public item_15: RechargeLotteryGoodsItem;
  declare public item_16: RechargeLotteryGoodsItem;
  declare public item_17: RechargeLotteryGoodsItem;
  private _chargeMsg: ChargePointLotteryMsg;
  private _list: any[] = [];
  private _rechargeBtn: UIButton;
  private _award0Btn: fgui.GButton;
  private _award1Btn: fgui.GButton;
  private _resultId: number = -1; //抽奖结果
  private _resultIds: number[] = []; //抽奖结果
  private isAnimating: boolean = false; //正在抽奖动画中
  private _pauseTime: number = 0; //暂停或停止时的时间轴时间

  onShow() {
    this.initData();
    this.initView();
    this.initEvent();
  }

  onUpdate() {
    this.initData();
    this.initView();
  }

  onHide() {
    this.removeEvent();
  }

  private initData() {
    TaskTraceTipManager.Instance.showTraceTip = false;
    ChargeLotteryManager.instance.OperateChargeReq(1);
    TaskTraceTipManager.Instance.showTraceTip = false;
  }

  private initView() {
    if (ConfigManager.info.RECHARG_LOTTERY_REFRESH) {
      this.timeResetTxt.visible = false;
      this.timeResetTxt.enabled = false;
    }
    this._rechargeBtn = new UIButton(this.btn_recharge);
    this._award0Btn = this.btn_award0;
    this._award1Btn = this.btn_award1;
    this.movie.timeScale = 0.15;
    this.movie.play(null, -1);
  }

  /**
   * 剩余时间（若还没开始, 则不显示）
   * */
  public setRemainTime() {
    let checkEndTime: Date = DateFormatter.parse(
      this._chargeMsg.stopTime,
      "YYYY-MM-DD hh:mm:ss",
    );
    let remainTime: number =
      checkEndTime.getTime() / 1000 -
      PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond; //结算剩余秒数
    if (remainTime >= 60) {
      this.txt_remainTime.text = DateFormatter.getFullTimeString(remainTime);
    } else if (remainTime > 0) {
      this.txt_remainTime.text = DateFormatter.getFullDateString(remainTime);
    } else {
      this.txt_remainTime.text = LangManager.Instance.GetTranslation(
        "feedback.FeedBackItem.outDate",
      );
      Laya.timer.clear(this, this.setRemainTime);
    }

    let checkStartTime: Date = DateFormatter.parse(
      this._chargeMsg.openTime,
      "YYYY-MM-DD hh:mm:ss",
    );
    if (
      checkStartTime.getTime() >
      PlayerManager.Instance.currentPlayerModel.nowDate
    ) {
      this.txt_remainTime.text =
        LangManager.Instance.GetTranslation("public.unopen") +
        LangManager.Instance.GetTranslation(
          "funny.FunnyRightView.active.timeText",
          DateFormatter.transDate(checkStartTime.getTime()),
          DateFormatter.transDate(checkEndTime.getTime()),
        );
    }
  }

  private initEvent() {
    this.list.itemRenderer = Laya.Handler.create(
      this,
      this.onRenderListItem,
      null,
      false,
    );
    this._award0Btn.onClick(this, this.__receiveBtnHandler);
    this._award1Btn.onClick(this, this.__receiveAllBtnHandler);
    this._rechargeBtn.onClick(this, this.__rechargeBtnHandler);
    NotificationManager.Instance.addEventListener(
      NotificationEvent.CHARGELOTTERY_RESULT_UPDATE,
      this.__chargeResultHandler,
      this,
    );
    // NotificationManager.Instance.addEventListener(NotificationEvent.ARTIFACT_BOX_FLICHER, this.__alertMessage, this);
  }

  private __chargeResultHandler(): void {
    this._chargeMsg = ChargeLotteryManager.instance.chargeMsg;
    if (this._chargeMsg.op == 1) {
      this.initGoods();
      this.initList();
      this.refreshView();
      this.timeHandler();
    } else if (this._chargeMsg.op == 2) {
      this.refreshView();
      if (this._chargeMsg.resultPos.length == 0) {
        MaskLockOper.Instance.doCall(false);
        return;
      } else if (this._chargeMsg.resultPos.length == 1) {
        // this._resultId = Math.ceil(Math.random() * 10);//测试
        this._resultIds = this._chargeMsg.resultPos;
        this._resultId = this._resultIds[0];
        Logger.yyz("抽到的pos: " + this._resultId);
        this.isAnimating = true;
        // this.onTranComplete0();
        this.onTranComplete1();
      } else if (this._chargeMsg.resultPos.length > 1) {
        //一键抽奖
        this._resultIds = this._chargeMsg.resultPos;
        this.playResult();
      }
    } else if (this._chargeMsg.op == 3) {
      this.refreshView();
      MaskLockOper.Instance.doCall(false);
      // updateChatInfo();
    }
  }

  private timeHandler() {
    let checkEndTime: Date = DateFormatter.parse(
      this._chargeMsg.stopTime,
      "YYYY-MM-DD hh:mm:ss",
    );
    let remainTime =
      checkEndTime.getTime() / 1000 -
      PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond; //结算剩余秒数
    if (remainTime > 0) {
      this.setRemainTime();
      Laya.timer.loop(1000, this, this.setRemainTime);
    } else {
      Laya.timer.clear(this, this.setRemainTime);
    }
  }

  private initGoods(): void {
    let rewardArr: LotteryItemMsg[];
    let item: RechargeLotteryGoodsItem;
    let gInfo: GoodsInfo;
    rewardArr = ChargeLotteryManager.instance.normalArr;
    rewardArr = ArrayUtils.sortOn(rewardArr, "pos", ArrayConstant.NUMERIC);
    for (let i: number = 0; i < rewardArr.length; i++) {
      item = this["item_" + i] as RechargeLotteryGoodsItem;
      gInfo = new GoodsInfo();
      gInfo.templateId = rewardArr[i].templateId;
      gInfo.count = rewardArr[i].count;
      if (!item) {
        rewardArr.forEach((v, k) => {
          Logger.error(k, ":", v.templateId);
        });
        break;
      }
      item.info = gInfo;
      item.templateType = rewardArr[i].templateType;
      item.pos = rewardArr[i].pos;
      this._list.push(item);
    }
  }

  private refreshView(): void {
    // this.btn_award0.enabled = this._chargeMsg.leftCount > 0;
    this.btn_award1.enabled = this._chargeMsg.leftCount > 0;
    this.txt_leftTimes.text = this._chargeMsg.leftCount.toString();
  }

  private __receiveBtnHandler(): void {
    if (this.isAnimating) return;
    MaskLockOper.Instance.doCall(true);
    Laya.timer.clear(this, this.resetMovie);
    AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
    if (this._chargeMsg.leftCount <= 0 && !this._chargeMsg.isRare) {
      MaskLockOper.Instance.doCall(false);
      this.rechargeAlertHandler();
      return;
    }
    if (!ChargeLotteryManager.instance.openChargeLottery) {
      MaskLockOper.Instance.doCall(false);
      return;
    }
    this.btn_award0.enabled = false;
    this.btn_award1.enabled = false;
    MainToolBar.FLASH_NEW_GOODS = false;
    ChargeLotteryManager.instance.OperateChargeReq(2);
  }

  private onTranComplete0() {
    this.movie.timeScale = 1;
    if (this._pauseTime > 0) {
      this.movie.play(
        Laya.Handler.create(this, this.onTranComplete1),
        1,
        0,
        this._pauseTime,
      );
    } else {
      this.movie.play(
        Laya.Handler.create(this, this.onTranComplete1),
        2,
        0,
        this._pauseTime,
      );
    }
  }

  private onTranComplete1() {
    this.movie.timeScale = 3;
    this.movie.play(
      Laya.Handler.create(this, this.onTranComplete2),
      2,
      0,
      this._pauseTime,
    );
  }

  private onTranComplete2() {
    this.movie.timeScale = 2;
    this.movie.play(Laya.Handler.create(this, this.onTranComplete3), 1);
  }

  private onTranComplete3() {
    this.movie.timeScale = 1;
    this.movie.setHook(
      `item${this._resultId - 1}`,
      Laya.Handler.create(this, this.updateResult),
    );
    this.movie.play();
  }

  private updateResult() {
    this.movie.clearHooks();
    this.movie.setPaused(true);
    this._pauseTime = this.movie.getLabelTime(`item${this._resultId - 1}`);
    //播放结果
    this.playResult();

    this.btn_award0.enabled = this._chargeMsg.leftCount > 0;
    this.btn_award1.enabled = this._chargeMsg.leftCount > 0;

    Laya.timer.once(this._pauseTime * 1000, this, () => {
      if (this.isAnimating) {
        this.isAnimating = false;
      }
      MaskLockOper.Instance.doCall(false);
    });

    Laya.timer.once(5 * 1000, this, this.resetMovie);
  }

  private playResult() {
    MainToolBar.FLASH_NEW_GOODS = true;
    let rewardArr: LotteryItemMsg[];
    rewardArr = ChargeLotteryManager.instance.normalArr;
    rewardArr = ArrayUtils.sortOn(rewardArr, "pos", ArrayConstant.NUMERIC);
    let resultStr = "";
    let resultArray = [];
    let count = this._resultIds.length;
    for (let index = 0; index < count; index++) {
      let _resultId = this._resultIds[index];
      let resultGoodsInfo = new GoodsInfo();
      resultGoodsInfo.templateId = rewardArr[_resultId - 1].templateId;
      resultGoodsInfo.count = rewardArr[_resultId - 1].count;
      resultArray.push(resultGoodsInfo);
      resultStr =
        resultGoodsInfo.templateInfo.TemplateNameLang +
        "x" +
        resultGoodsInfo.count;
      //获得提示
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "tasktracetip.view.TreasureMapTipView.content",
          resultStr,
        ),
      );
    }
    //播放飘获得动画
    GoodsManager.Instance.dispatchEvent(BagEvent.NEW_GOODS, resultArray);
    this._resultIds = [];
    MaskLockOper.Instance.doCall(false);
  }

  private resetMovie() {
    this.movie.timeScale = 0.15;
    this.movie.play(null, -1);
    MaskLockOper.Instance.doCall(false);
  }

  private __receiveAllBtnHandler(): void {
    MaskLockOper.Instance.doCall(true);
    AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
    if (this._chargeMsg.leftCount <= 0) {
      this.rechargeAlertHandler();
      MaskLockOper.Instance.doCall(false);
      return;
    }
    if (!ChargeLotteryManager.instance.openChargeLottery) {
      MaskLockOper.Instance.doCall(false);
      return;
    }
    if (this._chargeMsg.isRare) {
      MaskLockOper.Instance.doCall(false);
      return;
    }
    this.btn_award0.enabled = false;
    this.btn_award1.enabled = false;
    ChargeLotteryManager.instance.OperateChargeReq(2, true);
  }

  private rechargeAlertHandler() {
    let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
    let confirm: string = LangManager.Instance.GetTranslation("public.confirm");
    let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
    let content: string = LangManager.Instance.GetTranslation(
      "yishi.manager.rechargeAlertHandler.content",
    );
    if (Utils.isWxMiniGame() && ComponentSetting.IOS_VERSION) {
      content = LangManager.Instance.GetTranslation(
        "godarrive.GodArriveFrame.NoLeftCount",
      );
    }
    SimpleAlertHelper.Instance.Show(
      SimpleAlertHelper.SIMPLE_ALERT,
      null,
      prompt,
      content,
      confirm,
      cancel,
      (b: boolean, flag: boolean, arr: any[]) => {
        if (b && !(Utils.isWxMiniGame() && ComponentSetting.IOS_VERSION)) {
          if (FrameCtrlManager.Instance.isOpen(EmWindow.ShopWnd)) {
            NotificationManager.Instance.dispatchEvent(
              ShopEvent.PAGE_SELECTED,
              3,
            );
          } else {
            RechargeAlertMannager.Instance.openShopRecharge();
          }
        }
      },
    );
  }

  private _rechargeInfolist: LotteryInfoMsg[] = [];
  private onRenderListItem(index: number, item: RechargeLotteryInfoItem) {
    item.info = this._rechargeInfolist[index] as LotteryInfoMsg;
  }

  private initList() {
    this._rechargeInfolist = [];
    let count = this._chargeMsg.lotteryInfo.length;
    for (let index = 0; index < count; index++) {
      let element = this._chargeMsg.lotteryInfo[index] as LotteryInfoMsg;
      if (element.maxNum > 0) {
        this._rechargeInfolist.push(element);
      }
    }
    this.list.numItems = this._rechargeInfolist.length;
  }

  private __rechargeBtnHandler() {
    FrameCtrlManager.Instance.exit(EmWindow.Funny);
    RechargeAlertMannager.Instance.openShopRecharge();
  }

  private removeEvent() {
    MaskLockOper.Instance.doCall(false);
    // this.list.itemRenderer.recover();
    Utils.clearGListHandle(this.list);
    this._award0Btn.offClick(this, this.__receiveBtnHandler);
    this._award1Btn.offClick(this, this.__receiveAllBtnHandler);
    this._rechargeBtn.offClick(this, this.__rechargeBtnHandler);
    NotificationManager.Instance.removeEventListener(
      NotificationEvent.CHARGELOTTERY_RESULT_UPDATE,
      this.__chargeResultHandler,
      this,
    );
  }

  dispose() {
    this.removeEvent();
    this.movie.clearHooks();
    this.movie.stop();
    this.movie = null;
    this._resultIds = [];
    Laya.timer.clearAll(this);
    TaskTraceTipManager.Instance.showTraceTip = true;
    super.dispose();
  }
}
