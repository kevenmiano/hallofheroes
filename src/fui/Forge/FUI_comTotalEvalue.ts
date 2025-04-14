/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_comTotalEvalue extends fgui.GComponent {
  public cPromote_: fgui.Controller;
  public txtDesc: fgui.GTextField;
  public title: fgui.GTextField;
  public static URL: string = "ui://eolsofv9bposrm";

  public static createInstance(): FUI_comTotalEvalue {
    return <FUI_comTotalEvalue>(
      fgui.UIPackage.createObject("Forge", "comTotalEvalue")
    );
  }

  protected onConstruct(): void {
    this.cPromote_ = this.getController("cPromote ");
    this.txtDesc = <fgui.GTextField>this.getChild("txtDesc");
    this.title = <fgui.GTextField>this.getChild("title");
  }
}
