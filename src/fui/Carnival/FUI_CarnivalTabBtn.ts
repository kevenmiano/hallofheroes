/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_CarnivalTabBtn extends fgui.GButton {
  public redPointState: fgui.Controller;
  public iconNor: fgui.GLoader;
  public iconSel: fgui.GLoader;
  public redDot: fgui.GLoader;
  public redDotLabel: fgui.GTextField;
  public static URL: string = "ui://qvbm8hnztnvrdc";

  public static createInstance(): FUI_CarnivalTabBtn {
    return <FUI_CarnivalTabBtn>(
      fgui.UIPackage.createObject("Carnival", "CarnivalTabBtn")
    );
  }

  protected onConstruct(): void {
    this.redPointState = this.getController("redPointState");
    this.iconNor = <fgui.GLoader>this.getChild("iconNor");
    this.iconSel = <fgui.GLoader>this.getChild("iconSel");
    this.redDot = <fgui.GLoader>this.getChild("redDot");
    this.redDotLabel = <fgui.GTextField>this.getChild("redDotLabel");
  }
}
