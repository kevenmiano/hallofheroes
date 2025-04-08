/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_SiteZoneItem extends fgui.GButton {
  public siteName: fgui.GRichTextField;
  public static URL: string = "ui://2ydb9fb2m0g1mhieo";

  public static createInstance(): FUI_SiteZoneItem {
    return <FUI_SiteZoneItem>(
      fgui.UIPackage.createObject("Login", "SiteZoneItem")
    );
  }

  protected onConstruct(): void {
    this.siteName = <fgui.GRichTextField>this.getChild("siteName");
  }
}
