/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_WarlordsPrelimReportItem extends fgui.GComponent {
  public c1: fgui.Controller;
  public itemBg: fgui.GImage;
  public jobIcon: fgui.GLoader;
  public rankTxt: fgui.GTextField;
  public nickNameTxt: fgui.GTextField;
  public static URL: string = "ui://6fsn69didw9z1e";

  public static createInstance(): FUI_WarlordsPrelimReportItem {
    return <FUI_WarlordsPrelimReportItem>(
      fgui.UIPackage.createObject("Warlords", "WarlordsPrelimReportItem")
    );
  }

  protected onConstruct(): void {
    this.c1 = this.getController("c1");
    this.itemBg = <fgui.GImage>this.getChild("itemBg");
    this.jobIcon = <fgui.GLoader>this.getChild("jobIcon");
    this.rankTxt = <fgui.GTextField>this.getChild("rankTxt");
    this.nickNameTxt = <fgui.GTextField>this.getChild("nickNameTxt");
  }
}
