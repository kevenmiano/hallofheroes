import FUI_ChatInputBox from "../../../../fui/Chat/FUI_ChatInputBox";
import { TempleteManager } from "../../manager/TempleteManager";
import { YTextInput } from "../common/YTextInput";
/**
 * @author:pzlricky
 * @data: 2021-04-30 10:07
 * @description 联调输入
 */
export default class ChatInput extends FUI_ChatInputBox {
  public inputmsg: YTextInput;
  /**已输入未发送的 */
  static NOT_SEND_MSG: string = "";

  constructor() {
    super();
  }

  onConstruct() {
    super.onConstruct();
    this.inputmsg.fontSize = 24;
    this.inputmsg.stroke = 1;
    this.inputmsg.strokeColor = "#000000";
    this.inputmsg.singleLine = true;
    // this.inputmsg.text = "";
    this.inputmsg.on(Laya.Event.INPUT, this, this.__onContentChange);
  }

  /**文本内容变化 */
  private contentWords: string = "";
  private __onContentChange(evt: Event) {
    let mailContent: string = this.inputmsg.text;
    // if (mailContent.length > 38) {
    //     this.inputmsg.text = this.contentWords;
    //     return;
    // }
    // this.contentWords = mailContent;
    // this.inputmsg.text = this.contentWords;
    // console.log("mailContent", mailContent);
    ChatInput.NOT_SEND_MSG = mailContent;
  }

  public getInputText(): string {
    this.contentWords = this.inputmsg.text;
    return this.contentWords;
  }

  public setInputText(value: string) {
    this.inputmsg.text = value;
    this.contentWords = this.inputmsg.text;
    this.checkLength();
    ChatInput.NOT_SEND_MSG = this.inputmsg.text;
  }

  public clearText() {
    this.inputmsg.text = "";
    this.contentWords = "";
    ChatInput.NOT_SEND_MSG = "";
  }

  private checkLength() {
    var len: number = this.contentWords.length;
    let maxCount = TempleteManager.Instance.CfgMaxWordCount;
    if (len > maxCount) {
      this.contentWords = this.inputmsg.text.substring(0, maxCount);
      this.inputmsg.text = this.contentWords;
    }
  }
}
