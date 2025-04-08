/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_Btn_3red extends fgui.GButton {
  public bg2: fgui.GImage;
  public bg1: fgui.GImage;
  public titleTxt: fgui.GTextField;
  public static URL: string = "ui://ulm55jf7t604i7i";

  public static createInstance(): FUI_Btn_3red {
    return <FUI_Btn_3red>fgui.UIPackage.createObject("Dialog", "Btn_3red");
  }

  protected onConstruct(): void {
    this.bg2 = <fgui.GImage>this.getChild("bg2");
    this.bg1 = <fgui.GImage>this.getChild("bg1");
    this.titleTxt = <fgui.GTextField>this.getChild("titleTxt");
  }
}
