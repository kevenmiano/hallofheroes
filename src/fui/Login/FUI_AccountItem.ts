/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_AccountItem extends fgui.GButton {
  public siteState: fgui.Controller;
  public userState: fgui.Controller;
  public serverState: fgui.GLoader;
  public serverSite: fgui.GRichTextField;
  public serverName: fgui.GRichTextField;
  public siteGroup: fgui.GGroup;
  public headIcon: fgui.GLoader;
  public levelbg: fgui.GImage;
  public userLevel: fgui.GTextField;
  public levelGroup: fgui.GGroup;
  public headGroup: fgui.GGroup;
  public userName: fgui.GRichTextField;
  public userSite: fgui.GRichTextField;
  public userTxtGroup: fgui.GGroup;
  public userGroup: fgui.GGroup;
  public static URL: string = "ui://2ydb9fb2owl044";

  public static createInstance(): FUI_AccountItem {
    return <FUI_AccountItem>fgui.UIPackage.createObject("Login", "AccountItem");
  }

  protected onConstruct(): void {
    this.siteState = this.getController("siteState");
    this.userState = this.getController("userState");
    this.serverState = <fgui.GLoader>this.getChild("serverState");
    this.serverSite = <fgui.GRichTextField>this.getChild("serverSite");
    this.serverName = <fgui.GRichTextField>this.getChild("serverName");
    this.siteGroup = <fgui.GGroup>this.getChild("siteGroup");
    this.headIcon = <fgui.GLoader>this.getChild("headIcon");
    this.levelbg = <fgui.GImage>this.getChild("levelbg");
    this.userLevel = <fgui.GTextField>this.getChild("userLevel");
    this.levelGroup = <fgui.GGroup>this.getChild("levelGroup");
    this.headGroup = <fgui.GGroup>this.getChild("headGroup");
    this.userName = <fgui.GRichTextField>this.getChild("userName");
    this.userSite = <fgui.GRichTextField>this.getChild("userSite");
    this.userTxtGroup = <fgui.GGroup>this.getChild("userTxtGroup");
    this.userGroup = <fgui.GGroup>this.getChild("userGroup");
  }
}
