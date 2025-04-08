/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_LoginMethodItem extends fgui.GButton {
  public method: fgui.Controller;
  public method_bg: fgui.GGraph;
  public logo: fgui.GLoader;
  public static URL: string = "ui://2ydb9fb2inojsmhihk";

  public static createInstance(): FUI_LoginMethodItem {
    return <FUI_LoginMethodItem>(
      fgui.UIPackage.createObject("Login", "LoginMethodItem")
    );
  }

  protected onConstruct(): void {
    this.method = this.getController("method");
    this.method_bg = <fgui.GGraph>this.getChild("method_bg");
    this.logo = <fgui.GLoader>this.getChild("logo");
  }
}
