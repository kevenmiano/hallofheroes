/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_ConsumoCalcView extends fgui.GComponent {
  public list1: fgui.GList;
  public nameTitle: fgui.GTextField;
  public describeText: fgui.GRichTextField;
  public timeTxt: fgui.GTextField;
  public timeResetTxt: fgui.GTextField;
  public static URL: string = "ui://lzu8jcp2bsk34h";

  public static createInstance(): FUI_ConsumoCalcView {
    return <FUI_ConsumoCalcView>(
      fgui.UIPackage.createObject("Funny", "ConsumoCalcView")
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
