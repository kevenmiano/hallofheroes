/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_MailAttachItem extends fgui.GComponent {
  public base: fgui.GButton;
  public itemIcon: fgui.GLoader;
  public txtName: fgui.GTextField;
  public starGroup: fgui.GGroup;
  public static URL: string = "ui://nh31s615wf5gu";

  public static createInstance(): FUI_MailAttachItem {
    return <FUI_MailAttachItem>(
      fgui.UIPackage.createObject("Mail", "MailAttachItem")
    );
  }

  protected onConstruct(): void {
    this.base = <fgui.GButton>this.getChild("base");
    this.itemIcon = <fgui.GLoader>this.getChild("itemIcon");
    this.txtName = <fgui.GTextField>this.getChild("txtName");
    this.starGroup = <fgui.GGroup>this.getChild("starGroup");
  }
}
