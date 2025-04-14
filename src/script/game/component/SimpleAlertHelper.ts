import BaseWindow from "../../core/ui/Base/BaseWindow";
import UIManager from "../../core/ui/UIManager";
import { EmWindow } from "../constant/UIDefine";
import UIButton from "../../core/ui/UIButton";
import LangManager from "../../core/lang/LangManager";
import { PlayerManager } from "../manager/PlayerManager";
import { MessageTipManager } from "../manager/MessageTipManager";
import { EmLayer } from "../../core/ui/ViewInterface";
import RechargeAlertMannager from "../manager/RechargeAlertMannager";
import Utils from "../../core/utils/Utils";
import ComponentSetting from "../utils/ComponentSetting";
import { FrameCtrlManager } from "../mvc/FrameCtrlManager";
import { NotificationManager } from "../manager/NotificationManager";
import { NotificationEvent } from "../constant/event/NotificationEvent";

export enum AlertBtnType {
  OC, //确定取消
  O, //确定
  C, //取消
  NULL, //无
}

export class SimpleAlertWnd extends BaseWindow {
  public content: fgui.GRichTextField; //文本内容
  public title: fgui.GTextField; //标题
  public checkRickText: fgui.GRichTextField; //checkBox文本

  public group1: fgui.GGroup;
  public gTotal: fgui.GGroup;
  public checkContainer: fgui.GGroup;

  public cancelBtn: UIButton;
  public confirmBtn: UIButton;
  public checkBtn: UIButton;
  public closeBtn: UIButton;

  OnShowWind() {
    super.OnShowWind();
    this.setCenter();
    this.title.text = this.params.title;
    this.content.text = this.params.text;
    //设置默认文本
    this.checkRickText.text = LangManager.Instance.GetTranslation(
      "BuyFrameI.useBindTxt",
    ); //checkbox，UI里面不能使用默认值，否则底层的宽度计算会有问题
    this.confirmBtn.view.text = this.params.confirmText;
    this.cancelBtn.view.text = this.params.cancelText;
    if (this.params.data) {
      if (this.params.data.checkRickText) {
        this.checkRickText
          .setVar("text1", this.params.data.checkRickText)
          .flushVars();
      }
      if (this.params.data.checkRickText2) {
        this.checkRickText
          .setVar("text2", this.params.data.checkRickText2)
          .flushVars();
      }
      if (!this.params.data.checkDefault) {
        this.checkBtn.selected = false;
      } else {
        this.checkBtn.selected = true;
      }
    }
    switch (this.params.type) {
      case SimpleAlertHelper.SIMPLE_ALERT:
        this.checkContainer.visible = false;
        break;
      case SimpleAlertHelper.FUNCTION_ALERT:
        this.checkContainer.visible = false;
        break;
      case SimpleAlertHelper.USEBINDPOINT_ALERT:
        this.checkContainer.visible = true;
        break;
      case SimpleAlertHelper.CHATINVIE_ALERT:
        this.checkContainer.visible = true;
        break;
      case SimpleAlertHelper.PK_ALERT:
        this.checkContainer.visible = false;
        break;
    }

    if (this.params.btnType == AlertBtnType.NULL) {
      this.confirmBtn.visible = false;
      this.cancelBtn.visible = false;
    } else {
      this.confirmBtn.visible = this.params.btnType != AlertBtnType.C;
      this.cancelBtn.visible = this.params.btnType != AlertBtnType.O;
    }

    if (this.params.hideBtnClose) {
      this.closeBtn.visible = false;
    }

    // this.group1.ensureSizeCorrect();
    // this.gTotal.ensureSizeCorrect();
    this.setCenter();
  }

  /**确定点击回调 */
  confirmBtnClick() {
    switch (this.params.type) {
      case SimpleAlertHelper.SIMPLE_ALERT:
        break;
      case SimpleAlertHelper.FUNCTION_ALERT:
        break;
      case SimpleAlertHelper.USEBINDPOINT_ALERT:
        if (this.params.data && this.params.data.point) {
          let toPayPoint: number = Number(this.params.data.point);
          let selfPoint: number =
            PlayerManager.Instance.currentPlayerModel.playerInfo.point;
          let bindPoint: number =
            PlayerManager.Instance.currentPlayerModel.playerInfo.giftToken;
          let totalPoint: number = this.checked
            ? selfPoint + bindPoint
            : selfPoint;
          if (totalPoint < toPayPoint) {
            SimpleAlertHelper.Instance.Hide();
            NotificationManager.Instance.dispatchEvent(
              NotificationEvent.SHOW_RECHARGE,
            );
            return;
          }
        }
        break;
      case SimpleAlertHelper.CHATINVIE_ALERT:
        break;
    }

    let check = this.checked;
    let paramData = this.params && this.params.data ? this.params.data : null;
    let callFunc: Function =
      this.params && this.params.callback && this.params.callback;
    if (this.params.autoClose) {
      SimpleAlertHelper.Instance.Hide();
    }
    callFunc && callFunc(true, check, paramData);
    check = null;
    paramData = null;
    callFunc = null;
  }

  /**取消回调 */
  cancelBtnClick() {
    let check = this.checked;
    let paramData = this.params && this.params.data ? this.params.data : null;
    let callFunc: Function =
      this.params && this.params.callback && this.params.callback;
    SimpleAlertHelper.Instance.Hide();
    callFunc && callFunc(false, check, paramData);
    check = null;
    paramData = null;
    callFunc = null;
  }

  /**关闭点击 */
  protected OnBtnClose() {
    let check = this.checked;
    let paramData = this.params && this.params.data ? this.params.data : null;
    let callFunc: Function =
      this.params && this.params.callback && this.params.callback;
    if (this.params.autoClose) {
      SimpleAlertHelper.Instance.Hide();
    }
    if (paramData && paramData.onlyClose) {
      //仅关闭Alert， 不做任何回调
      return;
    }
    callFunc && callFunc(false, check, paramData);
    check = null;
    paramData = null;
    callFunc = null;
  }

  private get checked(): boolean {
    return this.checkBtn.selected;
  }

  protected OnClickModal() {}
}

/**
 * @author:pzlricky
 * @data: 2021-02-25 11:39
 * @description 单例弹窗提示类
 */
export default class SimpleAlertHelper extends BaseWindow {
  public static SIMPLE_ALERT = "SIMPLE_ALERT"; //简单无checkBox弹窗确认,仅有取消确认
  public static FUNCTION_ALERT = "FUNCTION_ALERT";
  public static USEBINDPOINT_ALERT = "USEBINDPOINT_ALERT"; //带checkBox弹窗确认
  public static CHATINVIE_ALERT = "CHATINVIE_ALERT"; //聊天邀请弹窗
  public static PK_ALERT = "PK_ALERT"; //PK弹窗

  private windowMaps: Array<SimpleAlertWnd> = []; //存储弹窗窗口

  private static inst: SimpleAlertHelper;

  public static get Instance(): SimpleAlertHelper {
    if (!this.inst) {
      this.inst = new SimpleAlertHelper();
      this.inst.windowMaps = [];
    }
    return this.inst;
  }

  private _data: Array<any>;
  /**
   *
   * 数组参数:
   * 0: 回调方法
   * 后面均为回调参数
   */
  public set data(value: Array<any>) {
    this._data = value;
  }

  /**
   * 弹窗
   * @param type 类型
   * @param dataObj 其他数据
   * @param title 标题
   * @param text 文本内容
   * @param confirmTxt 确定文本
   * @param cancelTxt 取消文本
   * @param callback 关闭回调
   * @param btnType 下面的按钮
   * @param autoClose 自动关闭
   * @param hideBtnClose 隐藏关闭按钮
   */
  async Show(
    type: string,
    dataObj: any,
    title: string,
    text: string,
    confirmTxt?: string,
    cancelTxt?: string,
    callback?: Function,
    btnType: AlertBtnType = AlertBtnType.OC,
    autoClose: boolean = true,
    hideBtnClose: boolean = false,
    emLayer: EmLayer = EmLayer.STAGE_TOP_LAYER,
  ): Promise<SimpleAlertHelper> {
    if (!type) {
      type = SimpleAlertHelper.SIMPLE_ALERT;
    }
    if (!dataObj) {
      dataObj = null;
    }
    if (!title) {
      title = LangManager.Instance.GetTranslation("public.prompt");
    }
    if (!text) {
      text = "";
    }
    if (!confirmTxt) {
      confirmTxt = LangManager.Instance.GetTranslation("public.confirm");
    }
    if (!cancelTxt) {
      cancelTxt = LangManager.Instance.GetTranslation("public.cancel");
    }

    let alertwnd = await UIManager.Instance.ShowWind(EmWindow.Alert, {
      type: type,
      title: title,
      text: text,
      confirmText: confirmTxt,
      cancelText: cancelTxt,
      callback: callback,
      data: dataObj,
      btnType: btnType,
      autoClose: autoClose,
      hideBtnClose: hideBtnClose,
      emLayer: emLayer,
    });
    if (alertwnd) {
      this.windowMaps.push(alertwnd);
    }
    return alertwnd;
  }

  /** 简化写法 */
  async ShowSimple(
    type: string,
    dataObj: any,
    text: string,
    callback?: Function,
    title?: string,
    confirmTxt?: string,
    cancelTxt?: string,
    btnType: AlertBtnType = AlertBtnType.OC,
    autoClose: boolean = true,
    hideBtnClose: boolean = false,
    emLayer: EmLayer = EmLayer.STAGE_TOP_LAYER,
  ): Promise<SimpleAlertHelper> {
    return this.Show(
      type,
      dataObj,
      title,
      text,
      confirmTxt,
      cancelTxt,
      callback,
      btnType,
      autoClose,
      hideBtnClose,
      emLayer,
    );
  }

  /**
   * 弹窗
   * @param title 标题
   * @param msg 内容
   * @param submitLabel 确定按钮文本
   * @param cancelLabel 取消按钮文本
   * @param autoDispose  自动销毁
   * @param enableHtml 禁用HTML富文本
   * @param multiLine  多行
   * @param blockBackgound 背景
   * @param alertType 弹窗类型
   * @param height 高度
   * @param smallTip
   * @param smallTipCall
   * @param frameStyle
   * @param data
   * @param $width
   */
  popAlerFrame(
    title: string,
    msg: string,
    submitLabel: string = "",
    cancelLabel: string = "",
    data = null,
    alertType: string = SimpleAlertHelper.SIMPLE_ALERT,
  ) {
    switch (alertType) {
      case SimpleAlertHelper.SIMPLE_ALERT:
        this.Show(
          alertType,
          data,
          title,
          msg,
          submitLabel,
          cancelLabel,
          data && data.callback,
        );
        break;
      case SimpleAlertHelper.FUNCTION_ALERT:
        this.Show(
          alertType,
          data,
          title,
          msg,
          submitLabel,
          cancelLabel,
          data && data.callback,
        );
        break;
      case SimpleAlertHelper.USEBINDPOINT_ALERT:
        this.Show(
          alertType,
          data,
          title,
          msg,
          submitLabel,
          cancelLabel,
          data && data.callback,
        );
        break;
      case SimpleAlertHelper.CHATINVIE_ALERT:
        this.Show(
          alertType,
          data,
          title,
          msg,
          submitLabel,
          cancelLabel,
          data && data.callback,
        );
        break;
      case SimpleAlertHelper.PK_ALERT:
        this.Show(
          alertType,
          data,
          title,
          msg,
          submitLabel,
          cancelLabel,
          data && data.callback,
        );
        break;
    }
  }

  Hide() {
    if (this.windowMaps) {
      let alertWnd = this.windowMaps.shift();
      if (alertWnd) {
        alertWnd.hide();
      }
    }
  }

  /**
   * 通过类型隐藏
   * @param type
   */
  HideByType(type: string) {
    for (let index = 0; index < this.windowMaps.length; index++) {
      let alertWnd = this.windowMaps[index];
      if (alertWnd && alertWnd.params && alertWnd.params.type == type) {
        alertWnd.hide();
      }
    }
  }

  HideAll() {
    for (let index = 0; index < this.windowMaps.length; index++) {
      let alertWnd = this.windowMaps[index];
      alertWnd.hide();
    }
    this.windowMaps = [];
  }
}
