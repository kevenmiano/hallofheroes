import LangManager from "../../../core/lang/LangManager";
import Logger from "../../../core/logger/Logger";
import SDKManager from "../../../core/sdk/SDKManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIButton from "../../../core/ui/UIButton";
import NewbieUtils from "../guide/utils/NewbieUtils";

/**
 * @author:pzlricky
 * @data: 2021-03-03 19:55
 * @description 帮助说明
 */
export default class HelpWnd extends BaseWindow {
  private closeBtn: UIButton;
  private contentlist: fgui.GComponent;

  private _callback: Function;
  private _callArgs: any[];

  public OnInitWind() {
    this.setCenter();
    this.addEvent();
    if (this.params.callback) {
      this._callback = this.params.callback;
    }
    if (this.params.callArgs) {
      this._callArgs = this.params.callArgs;
    }

    let title = this.params.title
      ? this.params.title
      : LangManager.Instance.GetTranslation(
          "friends.view.FriendsHelpFrame.title",
        );

    this.txtFrameTitle.text = title;
    this.closeBtn.visible = false;
    let content = this.params.content;
    if (!content) return;
    // content = StringHelper.removeHtmlTag(content);//解析转换HTML文本
    this.contentlist.getChild("content").text = content;
  }

  private addEvent() {
    this.contentlist
      .getChild("content")
      .on(Laya.Event.LINK, this, this.onClickLink);
    // ToolTipsManager.Instance.register(this);
  }

  private offEvent() {
    this.contentlist
      .getChild("content")
      .off(Laya.Event.LINK, this, this.onClickLink);
    // ToolTipsManager.Instance.unRegister(this);
  }

  //QQ|https://
  onClickLink(evtData: string) {
    /**点击文本链接 */
    Logger.warn("Click TextMessage!", evtData);
    //转换为Json数据
    let textData = evtData;
    if (!textData || textData == "") {
      return;
    }
    let linkData = textData.split("|");
    let clickType = "";
    let textUrl = "";
    if (linkData.length >= 2) {
      clickType = String(linkData[0]);
      textUrl = String(linkData[1]);
    } else {
      textUrl = String(linkData[0]);
    }

    switch (clickType) {
      case "QQ":
        SDKManager.Instance.getChannel().openQQService(textUrl, "800073277");
        break;
      case "WX":
        SDKManager.Instance.getChannel().openWXOfficial(textUrl, "800073277");
        break;
      case "Log":
        SDKManager.Instance.getChannel().uploadLog();
        break;
      default:
        SDKManager.Instance.getChannel().openURL(textUrl);
        break;
    }
  }

  confirmBtnClick() {
    super.OnBtnClose();
  }

  dispose() {
    this.offEvent();
    super.dispose();
    NewbieUtils.execFuncSimple(this._callback, this._callArgs);
  }
}
