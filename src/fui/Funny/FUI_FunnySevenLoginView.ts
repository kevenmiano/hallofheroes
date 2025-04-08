/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_FunnySevenLoginView extends fgui.GComponent {
  public list1: fgui.GList;
  public descTxt: fgui.GTextField;
  public nameTitle: fgui.GTextField;
  public timeDescTxt: fgui.GTextField;
  public timeValueTxt: fgui.GTextField;
  public leftTimeDescTxt: fgui.GTextField;
  public leftTimeValueTxt: fgui.GTextField;
  public dayDescTxt: fgui.GTextField;
  public dayValueTxt: fgui.GTextField;
  public static URL: string = "ui://lzu8jcp2r70i6d";

  public static createInstance(): FUI_FunnySevenLoginView {
    return <FUI_FunnySevenLoginView>(
      fgui.UIPackage.createObject("Funny", "FunnySevenLoginView")
    );
  }

  protected onConstruct(): void {
    this.list1 = <fgui.GList>this.getChild("list1");
    this.descTxt = <fgui.GTextField>this.getChild("descTxt");
    this.nameTitle = <fgui.GTextField>this.getChild("nameTitle");
    this.timeDescTxt = <fgui.GTextField>this.getChild("timeDescTxt");
    this.timeValueTxt = <fgui.GTextField>this.getChild("timeValueTxt");
    this.leftTimeDescTxt = <fgui.GTextField>this.getChild("leftTimeDescTxt");
    this.leftTimeValueTxt = <fgui.GTextField>this.getChild("leftTimeValueTxt");
    this.dayDescTxt = <fgui.GTextField>this.getChild("dayDescTxt");
    this.dayValueTxt = <fgui.GTextField>this.getChild("dayValueTxt");
  }
}
