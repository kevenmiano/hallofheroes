//@ts-expect-error: External dependencies
import FUI_ChatBubbleTip from "../../../../fui/Base/FUI_ChatBubbleTip";
import { ChatChannel } from "../../datas/ChatChannel";

/**
 * @author:zhihua.zhou
 * @data: 2021-12-07 15:32
 * @description 聊天泡泡
 */
export default class ChatPopView extends FUI_ChatBubbleTip {
  // private TEST:string = "<img src='res/game/face/face01.png' width='45px' height='45px'></img>";

  /** 泡泡消失时的回调 */
  private _chatBack: Function;
  private _chatBackParam: any;
  /** 泡泡消失的计时器 */
  private _timeId: number = 0;
  /** 泡泡自动消失的时间 毫秒 */
  private TIME: number = 10000;
  private _contextWidth: number = 0;
  offsetX: number = 20; //文字距离背景的间隙
  byteWidth: number = 8; //每个字节所占的内容宽度
  minWidth: number = 40; //内容背景最小宽度
  maxWidth: number = 200; //内容背景最大宽度

  onConstruct() {
    super.onConstruct();
  }

  /**
   * 显示泡泡
   * @param msg 聊天内容
   * @param chatBack
   * @param type 0文字, 1语音
   * @param channel 不同频道对应不同的气泡颜色
   */
  updateContent(
    msg: string,
    encodemsg: string,
    chatBack: Function = null,
    type: number = 0,
    channel: number = ChatChannel.WORLD,
    chatBackParam?: any,
  ): void {
    this.c1.setSelectedIndex(type);
    this._chatBack = chatBack;
    this._chatBackParam = chatBackParam;
    // let byteLen = StringUtil.getbyteLength(encodemsg);
    // let hasEmoji = msg.indexOf('<img') >= 0;
    this.txt_content.text = msg;
    if (this.txt_content.width >= this.maxWidth) {
      this.txt_content.autoSize = fgui.AutoSizeType.Height;
      this.txt_content.width = this.maxWidth;
      this.txt_content.align = "left";
      this.txt_content.text = msg;
    }
    // if (hasEmoji) {
    //     //修复数字和表情混和数字靠上的bug
    //     this.txt_content.valign = "middle";
    //     let htmlText = this.txt_content.div as Laya.HTMLDivElement;
    //     let htmlStype = htmlText.getStyle();
    //
    //     htmlStype.wordWarp = true;
    //     htmlText.setStyle(htmlStype);
    //     htmlText.innerHTML = msg;
    //     let SourceW: number = htmlText.contextWidth;//单行高度
    //     let SourceH: number = htmlText.contextHeight;//单行高度
    //     let W: number = htmlText.contextWidth;
    //     if (W < this.minWidth) {
    //         W = this.minWidth;
    //     } else if (W > this.maxWidth) {
    //         W = this.maxWidth;
    //     }
    //     this.txt_content.width = W;
    //     this.txt_content.height = SourceH * (Math.ceil(SourceW / W));
    // } else {
    //     if (byteLen <= 16) {
    //         // this.txt_content.width =   (msg.length + 1)* (168/9);
    //         this.txt_content.autoSize = 1;
    //         this.txt_content.text = msg;
    //         this.txt_content.x = (this.img_bg.width - this.txt_content.width >> 1) + 4;
    //     } else {
    //         this.txt_content.autoSize = 2;
    //         this.txt_content.width = 184;
    //         this.txt_content.text = msg;
    //     }
    // }

    switch (channel) {
      case ChatChannel.WORLD:
        this.img_bg.getControllerAt(0).setSelectedIndex(0);
        this.arrow.getControllerAt(0).setSelectedIndex(0);
        break;
      case ChatChannel.BIGBUGLE:
        this.img_bg.getControllerAt(0).setSelectedIndex(1);
        this.arrow.getControllerAt(0).setSelectedIndex(1);
        break;
      case ChatChannel.TEAM:
        this.img_bg.getControllerAt(0).setSelectedIndex(2);
        this.arrow.getControllerAt(0).setSelectedIndex(2);
        break;
      case ChatChannel.CONSORTIA:
        this.img_bg.getControllerAt(0).setSelectedIndex(3);
        this.arrow.getControllerAt(0).setSelectedIndex(3);
        break;
      default:
        this.img_bg.getControllerAt(0).setSelectedIndex(0);
        this.arrow.getControllerAt(0).setSelectedIndex(0);
        break;
    }

    if (type == 1) {
      this.voiceCom.onClick(this, this.playVoice, [msg]);
    }

    if (this._timeId > 0) {
      clearTimeout(this._timeId);
    }
    this._timeId = 0;
    this._timeId = setTimeout(this.close.bind(this), this.TIME);
  }

  get contextWidth(): number {
    return this._contextWidth;
  }

  private playVoice(msg) {
    //TODO 调用播放语音的接口
  }

  private close(): void {
    if (this.isDisposed) return;
    if (this.voiceCom) {
      this.voiceCom.offClick(this, this.playVoice);
    }

    if (this._timeId > 0) {
      clearTimeout(this._timeId);
    }
    this._timeId = 0;
    if (this._chatBack != null) {
      this._chatBack(this._chatBackParam);
    } else {
      if (this.displayObject && this.displayObject.parent) {
        this.displayObject.parent.removeChild(this.displayObject);
      }
    }
    this._chatBack = null;
  }

  public dispose(): void {
    super.dispose();
    this.close();
  }
}
