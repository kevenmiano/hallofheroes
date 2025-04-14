import LangManager from "../../../core/lang/LangManager";
import { PackageIn } from "../../../core/net/PackageIn";
import { ServerDataManager } from "../../../core/net/ServerDataManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIButton from "../../../core/ui/UIButton";
import UIManager from "../../../core/ui/UIManager";
import LTextInput from "../../component/laya/LTextInput";
import { C2SProtocol } from "../../constant/protocol/C2SProtocol";
import { S2CProtocol } from "../../constant/protocol/S2CProtocol";
import { EmWindow } from "../../constant/UIDefine";
import { ThaneInfo } from "../../datas/playerinfo/ThaneInfo";
import { ConfigManager } from "../../manager/ConfigManager";
import EmailSocketOutManager from "../../manager/EmailSocketOutManager";
import { FilterWordManager } from "../../manager/FilterWordManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import ChatHelper from "../../utils/ChatHelper";
import StringUtils from "../../utils/StringUtils";
import MailCtrl from "./MailCtrl";
import MailModel from "./MailModel";
//@ts-expect-error: External dependencies
import SimplePlayerSearchReqMsg = com.road.yishi.proto.simple.SimplePlayerSearchReqMsg;
//@ts-expect-error: External dependencies
import SimplePlayerSearchRspMsg = com.road.yishi.proto.simple.SimplePlayerSearchRspMsg;
import StringHelper from "../../../core/utils/StringHelper";
import { PlayerManager } from "../../manager/PlayerManager";
/**
 * @author:pzlricky
 * @data: 2021-04-12 19:45
 * @description 写邮件
 */
export default class WriteMailWnd extends BaseWindow {
  private frame: fgui.GComponent;
  private receiveInput: fgui.GComponent;
  private themeInput: fgui.GComponent;
  private btnAddFriend: UIButton;
  private btnSendMail: UIButton;
  private btnShelter: UIButton;
  private txtCost: fgui.GTextField;
  private receiveList: Array<string> = [];

  private inputTips: fgui.GTextField; //提示点击输入邮件内容
  // private mailContent: fgui.GTextInput;//邮件内容输入框
  private mailContent: LTextInput;

  private _target: string;
  private _subject: string;
  private _contentValue: string;

  private selectTabIndex: number = 0; //选择发送好友Tab
  private selectItemIndex: number = -1; //选择发送好友ItemIndex
  private _currentSelected: ThaneInfo;

  public OnInitWind() {
    super.OnInitWind();
    this.receiveList = [];
    this.frame.getChild("title").text = LangManager.Instance.GetTranslation(
      "emailII.view.WriteEmailFrame.title",
    );
    this.txtCost.text = LangManager.Instance.GetTranslation(
      "emailII.view.WriteEmailFrame.cost",
      MailModel.WRITE_MAIL_NEEDED_GOLD,
    );
    this.inputTips.visible = true;

    this.mailContent = LTextInput.create(
      this.contentPane.displayObject,
      "",
      24,
      "#FFECC6",
      706,
      319,
      320,
      245,
      30,
    );
    if (PlayerManager.Instance.currentPlayerModel.checkChatForbidIsOpen()) {
      this.mailContent.setForbiddenFunc(this.btnShelterClick.bind(this));
    }
    this.btnShelter.visible =
      PlayerManager.Instance.currentPlayerModel.checkChatForbidIsOpen();

    if (this.frameData) {
      let userlist = this.frameData.users;
      if (userlist && userlist.length) this.receiveList = userlist;
    }
    this.setCenter();
    this.addEvent();
    this.setThemeContent("");
    this.setReceiveUsers();
  }

  private addEvent() {
    this.mailContent.register(
      this,
      this.__onContentChange,
      this.onMailContentFocusIn,
      this.onMailContentFocusOut,
    );
    this.receiveInput.asCom
      .getChild("userName")
      .on(Laya.Event.INPUT, this, this.__onUserChange);
    this.themeInput.asCom
      .getChild("userName")
      .on(Laya.Event.INPUT, this, this.__onThemeChange);
    this.themeInput.asCom
      .getChild("userName")
      .on(Laya.Event.BLUR, this, this.onThemeFocusOut);
    this.btnAddFriend.onClick(this, this.onAddFriendHandler.bind(this));
    this.btnSendMail.onClick(this, this.onSendMailHandler.bind(this));
    ServerDataManager.listen(
      S2CProtocol.U_C_PLAYER_SEARCH,
      this,
      this.__getUserInfoHandler,
    );
  }

  private offEvent() {
    this.mailContent.unRegister();
    this.receiveInput.asCom
      .getChild("userName")
      .off(Laya.Event.INPUT, this, this.__onUserChange);
    this.themeInput.asCom
      .getChild("userName")
      .off(Laya.Event.INPUT, this, this.__onThemeChange);
    this.themeInput.asCom
      .getChild("userName")
      .off(Laya.Event.BLUR, this, this.onThemeFocusOut);
    this.btnAddFriend.onClick(this, this.onAddFriendHandler.bind(this));
    this.btnSendMail.onClick(this, this.onSendMailHandler.bind(this));
    ServerDataManager.cancel(
      S2CProtocol.U_C_PLAYER_SEARCH,
      this,
      this.__getUserInfoHandler,
    );
  }

  onThemeFocusOut() {
    let themeString: string = this.themeInput.asCom.getChild("userName").text;
    themeString = ChatHelper.parasMsgs(themeString);
    this.setThemeContent(themeString);
  }

  private setThemeContent(text: string) {
    this.themeInput.asCom.getChild("userName").text = text;
  }

  /**设置回复用户 */
  setReceiveUsers() {
    this.receiveInput.asCom.getChild("userName").text = "";
    for (let index = 0; index < this.receiveList.length; index++) {
      let receiveUser = this.receiveList[index];
      if (index < this.receiveList.length - 1)
        this.receiveInput.asCom.getChild("userName").text += receiveUser + ",";
      else this.receiveInput.asCom.getChild("userName").text += receiveUser;
    }
  }

  private themeText: string = "";
  private __onThemeChange(evt: Event) {
    let themeString: string = this.themeInput.asCom.getChild("userName").text;
    var vStr: string = themeString.replace(/(^\s*)|(\s*$)/g, "");
    if (StringHelper.getStringLength(vStr) > 12) {
      this.themeInput.asCom.getChild("userName").text = this.themeText;
      return;
    }
    this.themeText = vStr;
    this.setThemeContent(this.themeText);
  }

  private userText: string = "";
  private __onUserChange(evt: Event) {
    let userString: string = this.themeInput.asCom.getChild("userName").text;
    var vStr: string = userString.replace(/(^\s*)|(\s*$)/g, "");
    if (StringHelper.getStringLength(vStr) > 12) {
      this.themeInput.asCom.getChild("userName").text = this.userText;
      return;
    }
    this.userText = vStr;
  }

  /**文本内容变化 */
  private contentWords: string = "";
  private __onContentChange(evt: Event) {
    let mailContent: string = this.mailContent.text;
    if (mailContent.length >= 200) {
      this.mailContent.text = this.contentWords;
      return;
    }
    this.contentWords = mailContent;
    this.inputTips.visible = this.contentWords == "";
    this.btnSendMail.enabled = this.contentWords != "";
  }

  private onMailContentFocusIn() {
    this.mailContent.y = 240;
    this.inputTips.visible = false;
  }

  private onMailContentFocusOut() {
    this.mailContent.y = 255;
    let mailContent: string = this.mailContent.text;
    this.inputTips.visible = mailContent == "";
    this.mailContent.text = ChatHelper.parasMsgs(this.mailContent.text);
  }

  /**
   * 添加好友
   */
  private onAddFriendHandler() {
    let tabIndex = this.selectTabIndex;
    let itemIndex = this._currentSelected != null ? this.selectItemIndex : -1;
    UIManager.Instance.ShowWind(EmWindow.AddFriendWnd, {
      callback: this.onConfirmAddFriend.bind(this),
      itemIndex: itemIndex,
      index: tabIndex,
    });
  }

  /**确定选择发送对象 */
  private onConfirmAddFriend(
    selectTarget: any,
    selectTabIndex: number = 0,
    itemIndex: number = 0,
  ) {
    if (selectTarget) {
      this.receiveList = [];
      this.receiveInput.asCom.getChild("userName").text = "";
      this._currentSelected = selectTarget;
      this.selectTabIndex = selectTabIndex;
      this.selectItemIndex = itemIndex;
      let sendUserName = selectTarget.nickName;
      this.receiveList.push(sendUserName);
      this.setReceiveUsers();
    }
  }

  private __getUserInfoHandler(pkg: PackageIn) {
    let msg = pkg.readBody(
      SimplePlayerSearchRspMsg,
    ) as SimplePlayerSearchRspMsg;
    if (
      msg &&
      msg.info &&
      msg.info.nickName.toLowerCase() == this._target.toLowerCase()
    ) {
      var userIdList: Array<number> = [];
      userIdList.push(msg.info.userId);
      this.sendEmail(userIdList);
    } else {
      var str: string = LangManager.Instance.GetTranslation(
        "emailII.view.WriteEmailFrame.content01",
        this.receiveInput.asCom.getChild("userName").text,
      );
      MessageTipManager.Instance.show(str);
    }
  }

  /**
   * 发送邮件
   */
  private onSendMailHandler() {
    var str: string = "";
    if (ConfigManager.info.FILTER_TRIM) {
      this._target = StringUtils.remove(
        this.receiveInput.asCom.getChild("userName").text,
        " ",
      );
      this._subject = StringUtils.remove(
        FilterWordManager.filterWrod(
          this.themeInput.asCom.getChild("userName").text,
        ),
        " ",
      );
      this._contentValue = StringUtils.remove(
        FilterWordManager.filterWrod(this.mailContent.text),
        " ",
      );
    } else {
      this._target = this.receiveInput.asCom.getChild("userName").text;
      this._subject = FilterWordManager.filterWrod(
        this.themeInput.asCom.getChild("userName").text,
      );
      this._contentValue = FilterWordManager.filterWrod(this.mailContent.text);
    }
    if (StringUtils.checkEspicalWorld(this._subject)) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("special.words"),
      );
      return;
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
      if (
        this._currentSelected &&
        this._currentSelected.nickName ==
          this.receiveInput.asCom.getChild("userName").text
      ) {
        var userIdList: Array<number> = [];
        userIdList.push(this._currentSelected.userId);
        this.sendEmail(userIdList);
      } else if (this._target) {
        var msg: SimplePlayerSearchReqMsg = new SimplePlayerSearchReqMsg();
        msg.otherNickname = this._target;
        EmailSocketOutManager.sendProtoBuffer(C2SProtocol.C_PLAYER_SEARCH, msg);
      }
    }
    if (str) MessageTipManager.Instance.show(str);
  }

  private sendEmail(userIdList: Array<number>) {
    this.control.sendEmail(userIdList, this._subject, this._contentValue);
    this.OnBtnClose();
  }

  private btnShelterClick() {
    MessageTipManager.Instance.show(
      LangManager.Instance.GetTranslation("chat_forbiden_text"),
    );
  }

  private get control(): MailCtrl {
    return FrameCtrlManager.Instance.getCtrl(EmWindow.MailWnd) as MailCtrl;
  }

  OnHideWind() {
    super.OnHideWind();
    this.offEvent();
  }
}
