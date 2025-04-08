/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_ServerInfoItem extends fgui.GButton {
  public siteState1: fgui.Controller;
  public siteState2: fgui.Controller;
  public state1: fgui.GLoader;
  public serverSite: fgui.GRichTextField;
  public serverName: fgui.GRichTextField;
  public state2: fgui.GLoader;
  public static URL: string = "ui://2ydb9fb2owl043";

  public static createInstance(): FUI_ServerInfoItem {
    return <FUI_ServerInfoItem>(
      fgui.UIPackage.createObject("Login", "ServerInfoItem")
    );
  }

  protected onConstruct(): void {
    this.siteState1 = this.getController("siteState1");
    this.siteState2 = this.getController("siteState2");
    this.state1 = <fgui.GLoader>this.getChild("state1");
    this.serverSite = <fgui.GRichTextField>this.getChild("serverSite");
    this.serverName = <fgui.GRichTextField>this.getChild("serverName");
    this.state2 = <fgui.GLoader>this.getChild("state2");
  }
}
