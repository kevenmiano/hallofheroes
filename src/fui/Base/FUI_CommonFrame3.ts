/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_CommonBtn from "./FUI_CommonBtn";

export default class FUI_CommonFrame3 extends fgui.GComponent {
  public CloseVisible: fgui.Controller;
  public showHelp: fgui.Controller;
  public showContentBg: fgui.Controller;
  public title: fgui.GTextField;
  public closeBtn: FUI_CommonBtn;
  public btnHelp: FUI_CommonBtn;
  public static URL: string = "ui://og5jeos3lxpqpz";

  public static createInstance(): FUI_CommonFrame3 {
    return <FUI_CommonFrame3>(
      fgui.UIPackage.createObject("Base", "CommonFrame3")
    );
  }

  protected onConstruct(): void {
    this.CloseVisible = this.getController("CloseVisible");
    this.showHelp = this.getController("showHelp");
    this.showContentBg = this.getController("showContentBg");
    this.title = <fgui.GTextField>this.getChild("title");
    this.closeBtn = <FUI_CommonBtn>this.getChild("closeBtn");
    this.btnHelp = <FUI_CommonBtn>this.getChild("btnHelp");
  }
}
