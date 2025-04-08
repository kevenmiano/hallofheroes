/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_ConsortiaEmailMemberItem extends fgui.GButton {
  public check: fgui.Controller;
  public headIcon: fgui.GLoader;
  public txtUserName: fgui.GTextField;
  public select: fgui.GButton;
  public txtTitle: fgui.GTextField;
  public static URL: string = "ui://8w3m5duwfdfvr";

  public static createInstance(): FUI_ConsortiaEmailMemberItem {
    return <FUI_ConsortiaEmailMemberItem>(
      fgui.UIPackage.createObject("Consortia", "ConsortiaEmailMemberItem")
    );
  }

  protected onConstruct(): void {
    this.check = this.getController("check");
    this.headIcon = <fgui.GLoader>this.getChild("headIcon");
    this.txtUserName = <fgui.GTextField>this.getChild("txtUserName");
    this.select = <fgui.GButton>this.getChild("select");
    this.txtTitle = <fgui.GTextField>this.getChild("txtTitle");
  }
}
