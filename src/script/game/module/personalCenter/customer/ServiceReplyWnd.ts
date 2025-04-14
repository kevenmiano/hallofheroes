//@ts-expect-error: External dependencies
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { ServiceReplyInfo } from "../../../../core/utils/ServiceReplyInfo";
import CustomerServiceManager from "../../../manager/CustomerServiceManager";
import CustomerServiceModel from "../mailcheck/CustomerServiceModel";
import EvaluationCom from "./EvaluationCom";
import LookReplyCom from "./LookReplyCom";
import ReplyCom from "./ReplyCom";

/**
 * @author:zhihua.zhou
 * @data: 2022-3-30
 * @description 客服回复界面
 */
export default class ServiceReplyWnd extends BaseWindow {
  private evaluationCom: EvaluationCom;
  private replyCom: ReplyCom;
  private lookReplyCom: LookReplyCom;

  private c1: fairygui.Controller;
  private btn_submit: fairygui.GButton;
  private btn_back: fairygui.GButton;
  private btn_reply: fairygui.GButton;
  private btn_evaluation: fairygui.GButton;
  private second: number = 0;

  public OnInitWind() {
    super.OnInitWind();
    this.setCenter();
    this.addEvent();
    this.c1 = this.getController("c1");

    let message: ServiceReplyInfo = this.model.getMessage();
    if (message) {
      // model.viewType = CustomerServiceViewType.SERVICE_REPLY;
      // _serviceReplyView = new ServiceReplyView(model);
      // currentView = _serviceReplyView;
      CustomerServiceManager.Instance.sendRead();
    } else {
      // addToContent(_viewTypeComboxContain);
      // changeViewWith(CustomerServiceViewType.CONSULTING_GAMES);
    }

    if (this.model.stopReply > 0) {
      this.btn_reply.enabled = false;
    }

    this.replyCom.init();
    this.evaluationCom.init();
    this.lookReplyCom.init();
    this.timer.loop(1000, this, this.onTimer);
  }

  onTimer() {
    this.second++;
    if (this.second > 3) {
      this.timer.clear(this, this.onTimer);
    }
  }

  private addEvent(): void {
    this.btn_submit.onClick(this, this.onSubmit);
    this.btn_back.onClick(this, this.onBack);
    this.btn_reply.onClick(this, this.onReply);
    this.btn_evaluation.onClick(this, this.onEvaluation);
  }

  private removeEvent(): void {
    this.btn_submit.offClick(this, this.onSubmit);
    this.btn_back.offClick(this, this.onBack);
    this.btn_reply.offClick(this, this.onReply);
    this.btn_evaluation.offClick(this, this.onEvaluation);
  }

  onEvaluation() {
    this.c1.setSelectedIndex(2);
  }

  onReply() {
    this.c1.setSelectedIndex(1);
  }

  onBack() {
    this.c1.setSelectedIndex(0);
  }

  onSubmit() {
    if (this.c1.selectedIndex == 1) {
      this.model.sendData.question_content = this.replyCom.txt_desc.text;
      CustomerServiceManager.Instance.sendServiceReply();
    } else if (this.c1.selectedIndex == 2) {
      this.model.sendData.appraisal_grade = this.evaluationCom.evaluateGrade;
      this.model.sendData.question_content = this.evaluationCom.txt_desc.text;
      CustomerServiceManager.Instance.sendEvaluate();
    }
  }

  public get model(): CustomerServiceModel {
    return CustomerServiceManager.Instance.model;
  }

  OnHideWind() {
    super.OnHideWind();
    this.removeEvent();
    this.evaluationCom.removeEvent();
    this.replyCom.removeEvent();
    if (this.second > 3) {
      //防不小心关闭
      CustomerServiceManager.Instance.dispatchEvent(
        CustomerServiceManager.NEW_REPLY,
      );
    }
    this.timer.clear(this, this.onTimer);
  }
}
