/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_SelectItem extends fgui.GComponent {
  public siteState: fgui.Controller;
  public siteMode: fgui.Controller;
  public serverbg: fgui.GImage;
  public serverState: fgui.GLoader;
  public serverSite: fgui.GRichTextField;
  public serverName: fgui.GRichTextField;
  public serverMode: fgui.GLoader;
  public changeServerBtn: fgui.GRichTextField;
  public static URL: string = "ui://2ydb9fb2hdht45";

  public static createInstance(): FUI_SelectItem {
    return <FUI_SelectItem>fgui.UIPackage.createObject("Login", "SelectItem");
  }

  protected onConstruct(): void {
    this.siteState = this.getController("siteState");
    this.siteMode = this.getController("siteMode");
    this.serverbg = <fgui.GImage>this.getChild("serverbg");
    this.serverState = <fgui.GLoader>this.getChild("serverState");
    this.serverSite = <fgui.GRichTextField>this.getChild("serverSite");
    this.serverName = <fgui.GRichTextField>this.getChild("serverName");
    this.serverMode = <fgui.GLoader>this.getChild("serverMode");
    this.changeServerBtn = <fgui.GRichTextField>(
      this.getChild("changeServerBtn")
    );
  }
}
