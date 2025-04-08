/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_HTMLContent extends fgui.GComponent {
  public titleText: fgui.GRichTextField;
  public dateText: fgui.GRichTextField;
  public contentText: fgui.GRichTextField;
  public static URL: string = "ui://wkkd21u48zr2ig4";

  public static createInstance(): FUI_HTMLContent {
    return <FUI_HTMLContent>(
      fgui.UIPackage.createObject("Announce", "HTMLContent")
    );
  }

  protected onConstruct(): void {
    this.titleText = <fgui.GRichTextField>this.getChild("titleText");
    this.dateText = <fgui.GRichTextField>this.getChild("dateText");
    this.contentText = <fgui.GRichTextField>this.getChild("contentText");
  }
}
