import { TaskConditionType } from "../../constant/TaskConditionType";
import { TaskSocketManager } from "../../manager/TaskSocketManager";
import { TaskTemplate } from "./TaskTemplate";
import UIButton from "../../../core/ui/UIButton";
import { ServerDataManager } from "../../../core/net/ServerDataManager";
import { S2CProtocol } from "../../constant/protocol/S2CProtocol";
import { PackageIn } from "../../../core/net/PackageIn";
import { PlayerManager } from "../../manager/PlayerManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import LangManager from "../../../core/lang/LangManager";
import HttpUtils from "../../../core/utils/HttpUtils";
import { PathManager } from "../../manager/PathManager";
import { SocketManager } from "../../../core/net/SocketManager";
import { C2SProtocol } from "../../constant/protocol/C2SProtocol";

import StringHelper from "../../../core/utils/StringHelper";
import FUI_TaskPhoneView from "../../../../fui/Task/FUI_TaskPhoneView";

//@ts-expect-error: External dependencies
import UserPin = com.road.yishi.proto.player.UserPin;

//@ts-expect-error: External dependencies
import CheckSend = com.road.yishi.proto.player.CheckSend;

export default class TaskPhoneView extends FUI_TaskPhoneView {
  private _temp: TaskTemplate;
  private _isSended: boolean; //是否已发送手机号码
  private sendUIBtn: UIButton;
  private sendTimeUIBtn: UIButton;
  private checkUIBtn: UIButton;
  private checkBackUIBtn: UIButton;
  public checkedTimeUIBtn: UIButton;
  private _userId: number = 0;
  private _key: string = "";
  private _regExp: RegExp;
  constructor() {
    super();
  }

  onConstruct() {
    super.onConstruct();
    this.tab = this.getController("tab");
    this.sendUIBtn = new UIButton(this.sendBtn);
    this.sendTimeUIBtn = new UIButton(this.sendTimeBtn);
    this.checkUIBtn = new UIButton(this.checkBtn);
    this.checkBackUIBtn = new UIButton(this.checkBackBtn);
    this.checkedTimeUIBtn = new UIButton(this.checkedTimeBtn);
    this.tab.selectedIndex = 2; //发送区域
    this.phoneDescTxt.visible = false;
    this._userId = PlayerManager.Instance.currentPlayerModel.playerInfo.userId;
    this._key = PlayerManager.Instance.currentPlayerModel.userInfo.key;
    this._regExp = /^(13[0-9]{2}|147[0-9]|15[0-9]{2}|18[0-9]{2})[0-9]{7}$/;
    this.phoneNumber.restrict = "0-9";
    this.checkNumber.restrict = "0-9";
    this.initEvent();
  }

  public set taskTemp(value: TaskTemplate) {
    if (
      !value ||
      value.conditionList[0].CondictionType != TaskConditionType.PHONE_CHECK
    )
      return;
    this._temp = value;
    if (this._temp) {
      if (this._temp.taskInfo.checkNumber == 0) {
        TaskSocketManager.sendCheckMobileNumber();
      } else if (this._temp.taskInfo.checkNumber == -1) {
        //发送区域
        this.setAreaView(false);
      } else if (this._temp.taskInfo.checkNumber == 1) {
        //验证区域
        this.setAreaView(true);
      }
      this._temp.taskInfo.addEventListener(
        Laya.Event.CHANGE,
        this.refresh,
        this,
      );
      if (this._temp.taskInfo.phoneStr && this._temp.taskInfo.phoneStr != "") {
        this.phoneNumber.text = this._temp.taskInfo.phoneStr;
      }
    }
    this.refresh();
    this.phoneDescTxt.text = StringHelper.repHtmlTextToFguiText(
      this._temp.DetailLang,
    );
    this.phoneDescTxt.visible = true;
  }

  private refresh() {
    if (this.isDisposed) return;
    if (this._temp) {
      this.sendUIBtn.enabled = true;
      this.checkUIBtn.enabled = true;
      if (this.sendTimeUIBtn) {
        this.sendTimeUIBtn.title =
          "" +
          this._temp.taskInfo.sendTime +
          LangManager.Instance.GetTranslation(
            "task.view.TaskMobilePhoneView.Text1",
          );
        this.sendTimeUIBtn.enabled = false;
      }
      if (this._temp.taskInfo.sendTime > 0) {
        this.setSendedView(true);
      } else {
        this.setSendedView(false);
      }
      if (this.checkedTimeBtn) {
        this.checkedTimeBtn.title =
          "" +
          this._temp.taskInfo.checkTime +
          LangManager.Instance.GetTranslation(
            "task.view.TaskMobilePhoneView.Text1",
          );
        this.checkedTimeBtn.enabled = false;
      }
      if (this._temp.taskInfo.checkTime > 0) {
        this.setCheckedView(true);
      } else {
        this.setCheckedView(false);
      }
    } else {
      this.sendUIBtn.enabled = false;
      this.checkUIBtn.enabled = false;
    }
  }

  private setCheckedView(visible1: boolean) {
    if (this.checkedTimeBtn)
      this.checkedTimeBtn.visible = visible1 && this._isSended;
    this.checkUIBtn.enabled = !visible1;
  }

  private setSendedView(visible2: boolean) {
    if (this.sendTimeUIBtn)
      this.sendTimeUIBtn.visible = visible2 && !this._isSended;
    this.sendUIBtn.enabled = !visible2;
  }

  private initEvent() {
    ServerDataManager.listen(
      S2CProtocol.U_C_CHECK_SEND,
      this,
      this.__setFirstView,
    );
    this.sendUIBtn.onClick(this, this.sendBtnClick);
    this.checkBackUIBtn.onClick(this, this.checkBackBtnClick);
    this.checkUIBtn.onClick(this, this.checkBtnClick);
  }

  private removeEvent() {
    ServerDataManager.cancel(
      S2CProtocol.U_C_CHECK_SEND,
      this,
      this.__setFirstView,
    );
    this.sendUIBtn.offClick(this, this.sendBtnClick);
    this.checkBackUIBtn.offClick(this, this.checkBackBtnClick);
    this.checkUIBtn.offClick(this, this.checkBtnClick);
    if (this._temp && this._temp.taskInfo) {
      this._temp.taskInfo.removeEventListener(
        Laya.Event.CHANGE,
        this.refresh,
        this,
      );
    }
  }

  private __setFirstView(pkg: PackageIn) {
    var msg: CheckSend = new CheckSend();
    var msg: CheckSend = pkg.readBody(CheckSend) as CheckSend;
    this._temp.taskInfo.checkNumber = msg.canSend;
    if (this._temp.taskInfo.checkNumber == -1) {
      //未发送号码
      this._isSended = false;
    } else if (this._temp.taskInfo.checkNumber == 1) {
      //已发送
      this._isSended = true;
    }
    if (this.visible == false) return;
    this.setAreaView(this._isSended);
  }
  /**
   * 发送
   */
  private sendBtnClick() {
    if (this.phoneNumber.text == "") {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "task.view.TaskMobilePhoneView.Text6",
        ),
      );
    } else if (this.phoneNumber.text.length < 11) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "task.view.TaskMobilePhoneView.Text7",
        ),
      );
    } else if (!this._regExp.test(this.phoneNumber.text)) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "task.view.TaskMobilePhoneView.Text7",
        ),
      );
    } else {
      this._temp.taskInfo.phoneStr = this.phoneNumber.text;
      this.setAreaView(true);
      this._temp.taskInfo.sendTime = 30;
      this.sendPhone(this.phoneNumber.text);
    }
  }

  private sendPhone(phoneNum: string) {
    var args: object = new Object();
    args["userId"] = this._userId;
    args["phone"] = phoneNum;
    args["key"] = this._key;

    let params: string = `userId=${args["userId"]}&phone=${args["phone"]}&key=${args["key"]}`;
    return HttpUtils.httpRequest(
      PathManager.info.REQUEST_PATH,
      "getphone",
      params,
      "POST",
    ).then((data) => {
      var result: number = parseInt(data);
      switch (result) {
        case 1:
          this.rightPhoneNum();
          break;
        case -1:
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation(
              "task.view.TaskMobilePhoneView.Text9",
            ),
          );
          break;
        case -2:
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation(
              "task.view.TaskMobilePhoneView.Text17",
            ),
          );
          break;
        case -3:
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation(
              "task.view.TaskMobilePhoneView.Text10",
            ),
          );
          break;
        case -4:
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation(
              "task.view.TaskMobilePhoneView.Text11",
            ),
          );
          break;
        case -5:
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation(
              "task.view.TaskMobilePhoneView.Text7",
            ),
          );
          break;
        case -6:
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation(
              "task.view.TaskMobilePhoneView.Text18",
            ),
          );
          break;
        default:
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation(
              "task.view.TaskMobilePhoneView.Text11",
            ),
          );
          break;
      }
    });
  }

  private rightPhoneNum() {
    this._temp.taskInfo.checkNumber = 1;
    MessageTipManager.Instance.show(
      LangManager.Instance.GetTranslation(
        "task.view.TaskMobilePhoneView.Text13",
      ),
    );
  }

  /**
   * 验证
   */
  private checkBtnClick() {
    if (this.checkNumber.text == "") {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "task.view.TaskMobilePhoneView.Text3",
        ),
      );
    } else if (this.checkNumber.text.length < 6) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "task.view.TaskMobilePhoneView.Text15",
        ),
      );
    } else {
      this._temp.taskInfo.checkTime = 10;
      this.socketOutNum(this.checkNumber.text);
    }
  }

  private socketOutNum(text: string) {
    var code: number = parseInt(text);
    let msg: UserPin = new UserPin();
    msg.pin = code;
    SocketManager.Instance.send(C2SProtocol.C_USER_PIN_CHECK, msg);
  }

  /**
   * 返回
   */
  private checkBackBtnClick() {
    this.setAreaView(false);
  }
  /**
   * 设置显示区域
   * para:true  显示验证区域
   * para:false  显示发送区域
   * */
  private setAreaView(para: boolean) {
    this._isSended = para;
    this.sendUIBtn.visible = !para;
    this.checkBackUIBtn.visible = para;
    this.checkUIBtn.visible = para;
    if (!para) {
      this.tab.selectedIndex = 0; //发送区域
      if (this._temp && this._temp.taskInfo.sendTime > 0) {
        this.sendTimeUIBtn.visible = true;
      } else {
        this.sendTimeUIBtn.visible = false;
      }
    } else {
      //验证区域
      this.tab.selectedIndex = 1;
      if (this._temp && this._temp.taskInfo.checkTime > 0) {
        this.checkedTimeBtn.visible = true;
      } else {
        this.checkedTimeBtn.visible = false;
      }
    }
  }

  public dispose() {
    this.removeEvent();
    this.sendUIBtn.dispose();
    this.sendTimeUIBtn.dispose();
    this.checkUIBtn.dispose();
    this.checkBackUIBtn.dispose();
    this.checkedTimeUIBtn.dispose();
    this.sendUIBtn = null;
    this.sendTimeUIBtn = null;
    this.checkUIBtn = null;
    this.checkBackUIBtn = null;
    this.checkedTimeUIBtn = null;
    super.dispose();
  }
}
