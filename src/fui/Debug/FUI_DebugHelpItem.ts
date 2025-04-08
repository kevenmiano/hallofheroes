/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_DebugHelpItem extends fgui.GButton {
  public cIsTitle: fgui.Controller;
  public txt1: fgui.GTextField;
  public txt2: fgui.GTextField;
  public txt3: fgui.GTextField;
  public txt4: fgui.GTextField;
  public static URL: string = "ui://035sra8nwkpi1";

  public static createInstance(): FUI_DebugHelpItem {
    return <FUI_DebugHelpItem>(
      fgui.UIPackage.createObject("Debug", "DebugHelpItem")
    );
  }

  protected onConstruct(): void {
    this.cIsTitle = this.getController("cIsTitle");
    this.txt1 = <fgui.GTextField>this.getChild("txt1");
    this.txt2 = <fgui.GTextField>this.getChild("txt2");
    this.txt3 = <fgui.GTextField>this.getChild("txt3");
    this.txt4 = <fgui.GTextField>this.getChild("txt4");
  }
}
