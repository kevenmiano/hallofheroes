/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_MarketRecordCom extends fgui.GComponent {
  public tb: fgui.GImage;
  public recordList: fgui.GList;
  public static URL: string = "ui://50f8ewazdt3zi";

  public static createInstance(): FUI_MarketRecordCom {
    return <FUI_MarketRecordCom>(
      fgui.UIPackage.createObject("Market", "MarketRecordCom")
    );
  }

  protected onConstruct(): void {
    this.tb = <fgui.GImage>this.getChild("tb");
    this.recordList = <fgui.GList>this.getChild("recordList");
  }
}
