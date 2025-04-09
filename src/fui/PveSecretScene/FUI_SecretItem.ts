/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_SecretItem extends fgui.GButton {
  public cType: fgui.Controller;
  public back: fgui.GLoader;
  public profile: fgui.GLoader;
  public txtTitle: fgui.GTextField;
  public txtName: fgui.GTextField;
  public baseItem: fgui.GButton;
  public secretItem: fgui.GButton;
  public static URL: string = "ui://7g1ccuufmebawu8wyq";

  public static createInstance(): FUI_SecretItem {
    return <FUI_SecretItem>(
      fgui.UIPackage.createObject("PveSecretScene", "SecretItem")
    );
  }

  protected onConstruct(): void {
    this.cType = this.getController("cType");
    this.back = <fgui.GLoader>this.getChild("back");
    this.profile = <fgui.GLoader>this.getChild("profile");
    this.txtTitle = <fgui.GTextField>this.getChild("txtTitle");
    this.txtName = <fgui.GTextField>this.getChild("txtName");
    this.baseItem = <fgui.GButton>this.getChild("baseItem");
    this.secretItem = <fgui.GButton>this.getChild("secretItem");
  }
}
