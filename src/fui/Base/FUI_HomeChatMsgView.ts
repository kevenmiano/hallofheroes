/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_ChatMessageCell from "./FUI_ChatMessageCell";

export default class FUI_HomeChatMsgView extends fgui.GComponent {
  public messageCell0: FUI_ChatMessageCell;
  public messageCell1: FUI_ChatMessageCell;
  public chatlist: fgui.GGroup;
  public static URL: string = "ui://og5jeos3n4cg6o";

  public static createInstance(): FUI_HomeChatMsgView {
    return <FUI_HomeChatMsgView>(
      fgui.UIPackage.createObject("Base", "HomeChatMsgView")
    );
  }

  protected onConstruct(): void {
    this.messageCell0 = <FUI_ChatMessageCell>this.getChild("messageCell0");
    this.messageCell1 = <FUI_ChatMessageCell>this.getChild("messageCell1");
    this.chatlist = <fgui.GGroup>this.getChild("chatlist");
  }
}
