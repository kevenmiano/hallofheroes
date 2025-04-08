/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_QuickOpenFrameItem extends fgui.GButton {
  public cIsTitle: fgui.Controller;
  public txt1: fgui.GTextField;
  public static URL: string = "ui://035sra8nwkpiwu8wyd";

  public static createInstance(): FUI_QuickOpenFrameItem {
    return <FUI_QuickOpenFrameItem>(
      fgui.UIPackage.createObject("Debug", "QuickOpenFrameItem")
    );
  }

  protected onConstruct(): void {
    this.cIsTitle = this.getController("cIsTitle");
    this.txt1 = <fgui.GTextField>this.getChild("txt1");
  }
}
