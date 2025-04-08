/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_FunnyExchangeView extends fgui.GComponent {
  public list1: fgui.GList;
  public nameTitle: fgui.GTextField;
  public describeText: fgui.GRichTextField;
  public timeTxt: fgui.GTextField;
  public timeResetTxt: fgui.GTextField;
  public static URL: string = "ui://lzu8jcp2th2c50";

  public static createInstance(): FUI_FunnyExchangeView {
    return <FUI_FunnyExchangeView>(
      fgui.UIPackage.createObject("Funny", "FunnyExchangeView")
    );
  }

  protected onConstruct(): void {
    this.list1 = <fgui.GList>this.getChild("list1");
    this.nameTitle = <fgui.GTextField>this.getChild("nameTitle");
    this.describeText = <fgui.GRichTextField>this.getChild("describeText");
    this.timeTxt = <fgui.GTextField>this.getChild("timeTxt");
    this.timeResetTxt = <fgui.GTextField>this.getChild("timeResetTxt");
  }
}
