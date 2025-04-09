/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_MarketRecordItem extends fgui.GComponent {
  public descLab: fgui.GRichTextField;
  public xLine: fgui.GImage;
  public static URL: string = "ui://50f8ewazdt3zg";

  public static createInstance(): FUI_MarketRecordItem {
    return <FUI_MarketRecordItem>(
      fgui.UIPackage.createObject("Market", "MarketRecordItem")
    );
  }

  protected onConstruct(): void {
    this.descLab = <fgui.GRichTextField>this.getChild("descLab");
    this.xLine = <fgui.GImage>this.getChild("xLine");
  }
}
