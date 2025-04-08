/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_MailAddFriendCell extends fgui.GButton {
  public check: fgui.Controller;
  public userName: fgui.GTextField;
  public select: fgui.GButton;
  public headIcon: fgui.GComponent;
  public static URL: string = "ui://nh31s615rznid";

  public static createInstance(): FUI_MailAddFriendCell {
    return <FUI_MailAddFriendCell>(
      fgui.UIPackage.createObject("Mail", "MailAddFriendCell")
    );
  }

  protected onConstruct(): void {
    this.check = this.getController("check");
    this.userName = <fgui.GTextField>this.getChild("userName");
    this.select = <fgui.GButton>this.getChild("select");
    this.headIcon = <fgui.GComponent>this.getChild("headIcon");
  }
}
