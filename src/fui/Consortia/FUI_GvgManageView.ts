/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_GvgManageView extends fgui.GComponent {
  public c1: fgui.Controller;
  public _manageBtn: fgui.GButton;
  public list: fgui.GList;
  public static URL: string = "ui://8w3m5duwpdrqi9i";

  public static createInstance(): FUI_GvgManageView {
    return <FUI_GvgManageView>(
      fgui.UIPackage.createObject("Consortia", "GvgManageView")
    );
  }

  protected onConstruct(): void {
    this.c1 = this.getController("c1");
    this._manageBtn = <fgui.GButton>this.getChild("_manageBtn");
    this.list = <fgui.GList>this.getChild("list");
  }
}
