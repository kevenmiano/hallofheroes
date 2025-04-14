//@ts-expect-error: External dependencies
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIButton from "../../../core/ui/UIButton";
import { PlayerManager } from "../../manager/PlayerManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { NotificationEvent } from "../../constant/event/NotificationEvent";
import RechargeAlertMannager from "../../manager/RechargeAlertMannager";
import LangManager from "../../../core/lang/LangManager";

export default class TodayNotAlertWnd extends BaseWindow {
  public totalBox: fgui.GGroup;
  public box1: fgui.GGroup;
  private content: fgui.GRichTextField; //文本内容
  private title: fgui.GTextField; //标题
  private confirmBtn: UIButton; //确定
  private cancelBtn: UIButton; //取消
  private check1Btn: UIButton; //下次不再提示
  private check2Btn: UIButton; //优先使用绑定钻石

  private controller: fgui.Controller;
  private controllState: number = 0; //

  private backFunction: Function;
  private closeFunction: Function;
  private _point: number = 0;
  private _paramArr: Array<any> = [];
  public OnInitWind() {
    super.OnInitWind();
    this.setCenter();
    if (this.params) {
      //默认文本
      this.check1Btn.view.getChild("title").text =
        LangManager.Instance.GetTranslation(
          "yishi.view.base.ThewAlertFrame.text",
        );
      this.check2Btn.view.getChild("title").text =
        LangManager.Instance.GetTranslation("BuyFrameI.useBindTxt");
      if (this.params.state) {
        //0显示所有 , 1隐藏不在提示, 2隐藏绑定钻石
        this.controllState = this.params.state;
      }
      if (this.params.content) {
        this.content.text = this.params.content;
      }
      if (this.params.backFunction) {
        this.backFunction = this.params.backFunction;
      }
      if (this.params.closeFunction) {
        this.closeFunction = this.params.closeFunction;
      }
      if (this.params.point) {
        this._point = this.params.point;
      }
      if (this.params.checkTxt) {
        this.check1Btn.view.getChild("title").text = this.params.checkTxt;
        (
          this.check1Btn.view.getChild("group") as fgui.GGroup
        ).ensureSizeCorrect();
        this.check1Btn.view.ensureSizeCorrect();
      }
      if (this.params.check2RickText) {
        this.check2Btn.view.getChild("title").text = this.params.check2RickText;
        (
          this.check2Btn.view.getChild("group") as fgui.GGroup
        ).ensureSizeCorrect();
        this.check2Btn.view.ensureSizeCorrect();
      }
      this.check2Btn.selected = true;
      if (this.params.hasOwnProperty("hidecheck1")) {
        this.check1Btn.visible = !this.params.hidecheck1;
      }
      if (this.params.hasOwnProperty("hidecheck2")) {
        this.check2Btn.visible = !this.params.hidecheck2;
      }
      if (this.params.dataArray) {
        this._paramArr = this.params.dataArray;
      }
    }
    this.controller = this.getController("c1");
    this.controller.selectedIndex = this.controllState;
    this.totalBox.ensureBoundsCorrect();
    this.addSceneEvent();
  }

  private addSceneEvent() {
    NotificationManager.Instance.addEventListener(
      NotificationEvent.SWITCH_SCENE,
      this.onSceneSwitch,
      this,
    );
  }

  private offSceneEvent() {
    NotificationManager.Instance.addEventListener(
      NotificationEvent.SWITCH_SCENE,
      this.onSceneSwitch,
      this,
    );
  }

  private onSceneSwitch() {
    this.hide();
  }

  public OnShowWind() {
    super.OnShowWind();
  }

  /**确定点击回调 */
  confirmBtnClick() {
    if (this.backFunction != null) {
      let hideBind = this.controllState == 2;
      if (!hideBind) {
        var hasMoney: number =
          PlayerManager.Instance.currentPlayerModel.playerInfo.point;
        if (this.check2Btn.selected) {
          hasMoney =
            PlayerManager.Instance.currentPlayerModel.playerInfo.point +
            PlayerManager.Instance.currentPlayerModel.playerInfo.giftToken;
          if (this._point > hasMoney) {
            this.hide();
            RechargeAlertMannager.Instance.show();
            // MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("Auction.ResultAlert11"));
            return;
          }
        } else {
          if (this._point > hasMoney) {
            this.hide();
            RechargeAlertMannager.Instance.show();
            // MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("Auction.ResultAlert11"));
            return;
          }
        }
        this.backFunction(
          this.check1Btn.selected,
          this.check2Btn.selected,
          this._paramArr,
        );
      } else {
        this.backFunction(this.check1Btn.selected);
      }
    }
    this.hide();
  }

  /**取消回调 */
  cancelBtnClick() {
    this.params && this.closeFunction && this.closeFunction();
    this.hide();
  }

  /**关闭点击 */
  protected OnBtnClose() {
    this.params && this.closeFunction && this.closeFunction();
    this.hide();
  }

  public OnHideWind(): void {
    super.OnHideWind();
    this.offSceneEvent();
  }

  dispose(dispose?: boolean) {
    this.backFunction = null;
    this.closeFunction = null;
    super.dispose(dispose);
  }
}
