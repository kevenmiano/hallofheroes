//@ts-expect-error: External dependencies
import LangManager from "../../../../core/lang/LangManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import UIButton from "../../../../core/ui/UIButton";
import UIManager from "../../../../core/ui/UIManager";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import { MonopolyEvent } from "../../../constant/event/NotificationEvent";
import { EmWindow } from "../../../constant/UIDefine";
import { CampaignManager } from "../../../manager/CampaignManager";
import { GoodsManager } from "../../../manager/GoodsManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { MonopolyManager } from "../../../manager/MonopolyManager";
import { MountsManager } from "../../../manager/MountsManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import RechargeAlertMannager from "../../../manager/RechargeAlertMannager";
import { SharedManager } from "../../../manager/SharedManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import MonopolyModel from "../model/MonopolyModel";

/**
 * @author:zhihua.zhou
 * @data: 2022-12-19
 * @description 云端历险的筛子界面
 */
export default class MonopolyDiceWnd extends BaseWindow {
  protected resizeContent = true;
  btn_dice0: UIButton;
  btn_dice1: UIButton;
  closeBtn: fairygui.GButton;
  mc: fairygui.GComponent;
  diceMask: fairygui.GComponent;

  private _model: MonopolyModel;

  public OnInitWind() {
    super.OnInitWind();
    this._model = MonopolyManager.Instance.model;
    this.addEvent();
    this.refreshView();
    this.initLanguage();
    this.mc.visible = this.diceMask.visible = false;
  }

  OnShowWind() {
    super.OnShowWind();
    this.mc.visible = this.diceMask.visible = false;
  }

  initLanguage() {
    this.btn_dice0.title =
      LangManager.Instance.GetTranslation("monopoly.dice0");
    this.btn_dice1.title =
      LangManager.Instance.GetTranslation("monopoly.dice1");
  }

  public refreshView(): void {
    let count = GoodsManager.Instance.getGoodsNumByTempId(
      MonopolyModel.DICE_TEMPID,
    );
    this.setBtnState(this.btn_dice0, true, this._model.normalPoint);
    this.setBtnState(this.btn_dice1, true, count);
  }

  /**
   * 设置Tab按钮红点状态
   * @param tabIndex Tab索引
   * @param redPointState 是否展示红点
   */
  private setBtnState(
    btn: UIButton,
    redPointState: boolean,
    count: number = 0,
  ) {
    let btnView = btn;
    if (btnView) {
      let view = btnView.getView();
      let dot = view.getChild("redDot");
      let newDot = view.getChild("newRedDot");
      let redDotLabel = view.getChild("redDotLabel");
      dot.visible = false;
      newDot.visible = true;
      redDotLabel.text = count.toString();
    }
  }

  rollDice(type: number) {
    if (type == 0) {
      let point = this._model.resultPoint;
      this.mc.getChild("img_result").asLoader.url = fgui.UIPackage.getItemURL(
        "Monopoly",
        "Icon_Dice_" + point,
      );
      this.mc.visible = true;
      this.diceMask.visible = true;
      this.mc
        .getTransition("tranDise")
        .play(Laya.Handler.create(this, this.showDicePoint), 1);
    } else {
      this.diceRollCallBack();
    }
  }

  showDicePoint() {
    Laya.timer.once(1000, this, this.diceRollCallBack);
  }

  private diceRollCallBack(): void {
    this.isRequesting = false;
    this.mc.visible = this.diceMask.visible = false;
    if (CampaignManager.Instance.controller) {
      MonopolyManager.Instance.iswalking = true;
      let path: any = this._model.getPath();
      CampaignManager.Instance.controller.moveArmyByPath(path);
    }
  }

  private __infoChangeHandler(): void {
    this.refreshView();
  }

  OnBtnClose() {
    this.hide();
    MonopolyManager.Instance.sendLeaveCampaign();
  }

  private addEvent(): void {
    this.btn_dice0.onClick(this, this.onDice0);
    this.btn_dice1.onClick(this, this.onDice1);
    this._model.addEventListener(
      MonopolyEvent.MONOPOLY_INFO_CHANGE,
      this.__infoChangeHandler,
      this,
    );
    NotificationManager.Instance.addEventListener(
      MonopolyEvent.ROLL_DICE,
      this.rollDice,
      this,
    );
  }

  private removeEvent(): void {
    this.btn_dice0.offClick(this, this.onDice0);
    this.btn_dice1.offClick(this, this.onDice1);
    this._model.removeEventListener(
      MonopolyEvent.MONOPOLY_INFO_CHANGE,
      this.__infoChangeHandler,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      MonopolyEvent.ROLL_DICE,
      this.rollDice,
      this,
    );
  }
  /** 如果服务器还没返回结果或者移动还未完成, 避免频繁多次请求 */
  private isRequesting: boolean = false;

  /**
   *
   * @returns 普通筛子
   */
  private onDice0(): void {
    if (MonopolyManager.Instance.iswalking) {
      let str = LangManager.Instance.GetTranslation("monopoly.dice2");
      MessageTipManager.Instance.show(str);
      return;
    }

    if (this.mc.visible || this.isRequesting) {
      return;
    }
    //移动过程中不能点骰子

    let str: string;
    // if(this._model.gameIsOver)
    // {
    //     MonopolyManager.Instance.sendLeaveCampaign();
    //     return;
    // }
    if (this._model.normalPoint == 0) {
      str = LangManager.Instance.GetTranslation(
        "MonopolyBottomView.normalBtnClickTip",
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    if (!this.isRequesting) {
      this.isRequesting = true;
      MonopolyManager.Instance.sendRollDice();
    }
  }

  /**
   *
   * @returns 魔力筛子
   */
  private onDice1(): void {
    if (MonopolyManager.Instance.iswalking) {
      let str = LangManager.Instance.GetTranslation("monopoly.dice2");
      MessageTipManager.Instance.show(str);
      return;
    }

    if (this.mc.visible || this.isRequesting) {
      return;
    }
    let count = GoodsManager.Instance.getGoodsNumByTempId(
      MonopolyModel.DICE_TEMPID,
    );
    if (count == 0) {
      //若已达到最大购买上限，且魔力骰子数量为0，则点击时提示“魔力骰子不足”
      if (this._model.leftBuyTimes == 0) {
        let str = LangManager.Instance.GetTranslation(
          "MonopolyBottomView.magicBtnClickTip3",
        );
        MessageTipManager.Instance.show(str);
        return;
      }
      let count = GoodsManager.Instance.getGoodsNumByTempId(
        MonopolyModel.DICE_TEMPID,
      );
      if (count == 0) {
        //点击右下角魔力骰子、以及点击开始抽奖时，若魔力骰子数量为0，则弹出提示 ——“是否消耗X钻石购买1个魔力骰子？\n（本日还可购买X次）”
        let confirm: string =
          LangManager.Instance.GetTranslation("public.confirm");
        let cancel: string =
          LangManager.Instance.GetTranslation("public.cancel");
        let prompt: string =
          LangManager.Instance.GetTranslation("public.prompt");
        let content: string = LangManager.Instance.GetTranslation(
          "monopoly.buyTimes",
          this._model.needDiamond,
          this._model.leftBuyTimes,
        );
        SimpleAlertHelper.Instance.Show(
          SimpleAlertHelper.USEBINDPOINT_ALERT,
          { point: this._model.needDiamond, checkDefault: true },
          prompt,
          content,
          confirm,
          cancel,
          this.callback.bind(this),
        );
      }
    } else {
      FrameCtrlManager.Instance.open(EmWindow.ChooseDiceWnd);
    }
  }

  private callback(b: boolean, usebind: boolean) {
    if (b) {
      MonopolyManager.Instance.sendMonopolyBuy(1, usebind);
    }
  }

  private helpBtnClick() {
    let title: string = LangManager.Instance.GetTranslation("public.help");
    let content: string = LangManager.Instance.GetTranslation(
      "Monopoly.helpContent",
    );
    UIManager.Instance.ShowWind(EmWindow.Help, {
      title: title,
      content: content,
    });
  }

  OnHideWind() {
    this.removeEvent();
    super.OnHideWind();
  }
}
