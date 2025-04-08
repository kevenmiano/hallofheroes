/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_MailItem extends fgui.GButton {
  public redCtr: fgui.Controller;
  public select: fgui.GImage;
  public unselect: fgui.GImage;
  public mailIcon: fgui.GLoader;
  public mailTitle: fgui.GTextField;
  public mailSender: fgui.GTextField;
  public mailleaveTime: fgui.GTextField;
  public static URL: string = "ui://nh31s615eas69";

  public static createInstance(): FUI_MailItem {
    return <FUI_MailItem>fgui.UIPackage.createObject("Mail", "MailItem");
  }

  protected onConstruct(): void {
    this.redCtr = this.getController("redCtr");
    this.select = <fgui.GImage>this.getChild("select");
    this.unselect = <fgui.GImage>this.getChild("unselect");
    this.mailIcon = <fgui.GLoader>this.getChild("mailIcon");
    this.mailTitle = <fgui.GTextField>this.getChild("mailTitle");
    this.mailSender = <fgui.GTextField>this.getChild("mailSender");
    this.mailleaveTime = <fgui.GTextField>this.getChild("mailleaveTime");
  }
}
