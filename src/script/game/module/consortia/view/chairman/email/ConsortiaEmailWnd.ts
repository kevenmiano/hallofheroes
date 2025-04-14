/*
 * @Author: jeremy.xu
 * @Date: 2021-07-20 20:31:46
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2022-11-02 14:45:46
 * @Description: 公会邮件 v2.46 ConsortiaEmailView  已调试
 */

import BaseWindow from "../../../../../../core/ui/Base/BaseWindow";
import { NotificationEvent } from "../../../../../constant/event/NotificationEvent";
import { EmWindow } from "../../../../../constant/UIDefine";
import { NotificationManager } from "../../../../../manager/NotificationManager";
import { FrameCtrlManager } from "../../../../../mvc/FrameCtrlManager";
import { ConsortiaControler } from "../../../control/ConsortiaControler";
import { ConsortiaModel } from "../../../model/ConsortiaModel";
import ConsortiaEmailMemberItem from "./ConsortiaEmailMemberItem";
import { ThaneInfo } from "../../../../../datas/playerinfo/ThaneInfo";
import { ConfigManager } from "../../../../../manager/ConfigManager";
import { ConsortiaManager } from "../../../../../manager/ConsortiaManager";
import { FilterWordManager } from "../../../../../manager/FilterWordManager";
import { MessageTipManager } from "../../../../../manager/MessageTipManager";
import { StringUtil } from "../../../../../utils/StringUtil";
import LangManager from "../../../../../../core/lang/LangManager";
import SimpleAlertHelper from "../../../../../component/SimpleAlertHelper";
import ChatHelper from "../../../../../utils/ChatHelper";
import StringUtils from "../../../../../utils/StringUtils";
import UIButton from "../../../../../../core/ui/UIButton";
import { TempleteManager } from "../../../../../manager/TempleteManager";
import StringHelper from "../../../../../../core/utils/StringHelper";
import { PlayerManager } from "../../../../../manager/PlayerManager";

export class ConsortiaEmailWnd extends BaseWindow {
  private _contorller: ConsortiaControler;
  private _data: ConsortiaModel;
  public btnShlter: UIButton;
  public mailContentbg: fgui.GImage;
  public line: fgui.GGroup;
  public themeInput: fgui.GComponent;
  public btnAddFriend: fgui.GButton;
  public receiveInput: fgui.GComponent;
  public inputTips: fgui.GTextField;
  public txt_diamond: fgui.GTextField;
  public btnSendMail: fgui.GButton;
  private _memberItemList: Array<ConsortiaEmailMemberItem> = [];
  public static SPLIT_STR: string = ","; //输入框的昵称分隔符
  private themeTxt: fgui.GTextInput;
  private receivetxt: fgui.GTextInput;
  private _target: string;
  private _subject: string;
  private _contentValue: string;
  public OnInitWind() {
    super.OnInitWind();
    this.initData();
    this.initView();
    this.initEvent();
    this.setCenter();
  }

  private initEvent() {
    this.btnAddFriend.onClick(this, this.btnAddFriendHandler);
    NotificationManager.Instance.addEventListener(
      NotificationEvent.UPDATA_CONSORTIAEMAIL_MEMBERLIST,
      this.updateHandler,
      this,
    );
    this.btnSendMail.onClick(this, this.btnSendMailHandler);
    this.inputTips.on(Laya.Event.INPUT, this, this.__onTxtChange);
    this.themeInput.asCom
      .getChild("userName")
      .on(Laya.Event.INPUT, this, this.__onThemeChange);
  }

  private removeEvent() {
    this.btnAddFriend.offClick(this, this.btnAddFriendHandler);
    this.btnSendMail.offClick(this, this.btnSendMailHandler);
    NotificationManager.Instance.removeEventListener(
      NotificationEvent.UPDATA_CONSORTIAEMAIL_MEMBERLIST,
      this.updateHandler,
      this,
    );
    this.inputTips.off(Laya.Event.INPUT, this, this.__onTxtChange);
    this.themeInput.asCom
      .getChild("userName")
      .off(Laya.Event.INPUT, this, this.__onThemeChange);
  }

  private __onTxtChange() {
    this.inputTips.text = ChatHelper.parasMsgs(this.inputTips.text);
  }

  private themeText: string = "";
  private __onThemeChange(evt: Event) {
    let themeString: string = ChatHelper.parasMsgs(
      this.themeInput.asCom.getChild("userName").text,
    );
    var vStr: string = themeString.replace(/(^\s*)|(\s*$)/g, "");
    if (StringHelper.getStringLength(vStr) > 12) {
      this.themeInput.asCom.getChild("userName").text = this.themeText;
      return;
    }
    this.themeText = vStr;
    this.setThemeContent(this.themeText);
  }

  private setThemeContent(text: string) {
    this.themeInput.asCom.getChild("userName").text = text;
  }

  btnSendMailHandler() {
    var str: string = "";
    if (ConfigManager.info.FILTER_TRIM) {
      this._target = StringUtil.remove(this.receivetxt.text, " ");
      this._subject = StringUtil.remove(
        FilterWordManager.filterWrod(this.themeTxt.text),
        " ",
      );
      this._contentValue = StringUtil.remove(
        FilterWordManager.filterWrod(this.inputTips.text),
        " ",
      );
    } else {
      this._target = this.receivetxt.text;
      this._subject = FilterWordManager.filterWrod(this.themeTxt.text);
      this._contentValue = FilterWordManager.filterWrod(this.inputTips.text);
    }
    if (!this._target)
      str = LangManager.Instance.GetTranslation(
        "emailII.view.WriteEmailFrame.target",
      );
    else if (!this._subject)
      str = LangManager.Instance.GetTranslation(
        "emailII.view.WriteEmailFrame.subject",
      );
    else if (!this._contentValue)
      str = LangManager.Instance.GetTranslation(
        "emailII.view.WriteEmailFrame.content",
      );
    else {
      var strArr: Array<string> = this._target.split(
        ConsortiaEmailWnd.SPLIT_STR,
      ); //输入框字符串按分隔符截取后的数组
      var membreInfoList: any[] =
        ConsortiaManager.Instance.model.consortiaMemberList.getList(); //公会成员信息数组
      var memberNickNameList: Array<string> = []; //公会成员昵称数组
      var userIdList: Array<number> = []; //发送的用户id数组
      var infoLen: number = membreInfoList.length;
      for (var i: number = 0; i < infoLen; i++) {
        memberNickNameList.push((membreInfoList[i] as ThaneInfo).nickName);
      }
      for (let i: number = 0; i < strArr.length; i++) {
        let nameStr: string = strArr[i];
        if (memberNickNameList.indexOf(nameStr) == -1) {
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation(
              "consortia.view.myConsortia.chairmanPath.consortiaEmail.ConsortiaEmailGroupSendView.noCurrentMember",
            ),
          );
          return;
        } else {
          for (var j: number = 0; j < infoLen; j++) {
            if ((membreInfoList[j] as ThaneInfo).nickName == nameStr) {
              userIdList.push((membreInfoList[j] as ThaneInfo).userId);
            }
          }
        }
      }
      this.sendEmail(userIdList);
    }
    if (str) MessageTipManager.Instance.show(str);
  }

  private sendEmail(idList: Array<any>) {
    var confirm: string = LangManager.Instance.GetTranslation("public.confirm");
    var cancel: string = LangManager.Instance.GetTranslation("public.cancel");
    var prompt: string = LangManager.Instance.GetTranslation("public.prompt");
    var content: string = LangManager.Instance.GetTranslation(
      "consortia.view.myConsortia.chairmanPath.consortiaEmail.ConsortiaEmailGroupSendView.sendMail",
      this.costDiamond,
    );
    SimpleAlertHelper.Instance.Show(
      SimpleAlertHelper.USEBINDPOINT_ALERT,
      { point: 50, id: idList, checkDefault: true },
      prompt,
      content,
      confirm,
      cancel,
      this.sendMailCall.bind(this),
    );
  }

  private get costDiamond(): number {
    let cfgValue = 50;
    let cfgItem =
      TempleteManager.Instance.getConfigInfoByConfigName("Mail_NeedPoint");
    if (cfgItem) {
      cfgValue = Number(cfgItem.ConfigValue);
    }
    return cfgValue;
  }

  private sendMailCall(b: boolean, flag: boolean, values: any) {
    if (b) {
      let idList = values.id;
      this._contorller.sendEmail(
        idList,
        this._subject,
        this._contentValue,
        flag,
      );
    }
    this.OnBtnClose();
  }

  updateHandler(data: Array<ConsortiaEmailMemberItem>) {
    this._memberItemList = data;
    if (this._memberItemList.length > 0) {
      this.receivetxt.text = "";
      for (var i: number = 0; i < this._memberItemList.length; i++) {
        if (i != this._memberItemList.length - 1) {
          this.receivetxt.text +=
            this._memberItemList[i].info.nickName + ConsortiaEmailWnd.SPLIT_STR;
        } else {
          this.receivetxt.text += this._memberItemList[i].info.nickName;
        }
      }
    }
  }

  private btnAddFriendHandler() {
    FrameCtrlManager.Instance.open(EmWindow.ConsortiaEmailMember);
  }

  private initData() {
    this._contorller = FrameCtrlManager.Instance.getCtrl(
      EmWindow.Consortia,
    ) as ConsortiaControler;
    this._data = this._contorller.model;
    this.txt_diamond.text = this.costDiamond.toString();
  }

  private initView() {
    this.receivetxt = this.receiveInput.getChild("userName") as fgui.GTextInput;
    this.themeTxt = this.themeInput.getChild("userName") as fgui.GTextInput;
    (this.inputTips.displayObject as Laya.Input).wordWrap = true;
    this.btnShlter.visible =
      PlayerManager.Instance.currentPlayerModel.checkChatForbidIsOpen();
  }

  private btnShlterClick() {
    MessageTipManager.Instance.show(
      LangManager.Instance.GetTranslation("chat_forbiden_text"),
    );
  }

  public OnShowWind() {
    super.OnShowWind();
  }

  public OnHideWind() {
    super.OnHideWind();
    this.removeEvent();
  }

  dispose(dispose?: boolean) {
    super.dispose(dispose);
  }
}
