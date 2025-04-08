/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_DeleteChargeView extends fgui.GComponent {
  public descTxt: fgui.GRichTextField;
  public Btn_help: fgui.GButton;
  public timeTxt: fgui.GRichTextField;
  public timeValueTxt: fgui.GRichTextField;
  public btn_join: fgui.GButton;
  public list: fgui.GList;
  public totalTxt: fgui.GRichTextField;
  public dayTxt: fgui.GRichTextField;
  public valueTxt3: fgui.GRichTextField;
  public valueTxt2: fgui.GRichTextField;
  public valueTxt: fgui.GRichTextField;
  public titleGroup: fgui.GGroup;
  public noteTxt: fgui.GRichTextField;
  public totalBackTxt: fgui.GRichTextField;
  public totalBackValueTxt: fgui.GRichTextField;
  public static URL: string = "ui://lzu8jcp2h9d8ica";

  public static createInstance(): FUI_DeleteChargeView {
    return <FUI_DeleteChargeView>(
      fgui.UIPackage.createObject("Funny", "DeleteChargeView")
    );
  }

  protected onConstruct(): void {
    this.descTxt = <fgui.GRichTextField>this.getChild("descTxt");
    this.Btn_help = <fgui.GButton>this.getChild("Btn_help");
    this.timeTxt = <fgui.GRichTextField>this.getChild("timeTxt");
    this.timeValueTxt = <fgui.GRichTextField>this.getChild("timeValueTxt");
    this.btn_join = <fgui.GButton>this.getChild("btn_join");
    this.list = <fgui.GList>this.getChild("list");
    this.totalTxt = <fgui.GRichTextField>this.getChild("totalTxt");
    this.dayTxt = <fgui.GRichTextField>this.getChild("dayTxt");
    this.valueTxt3 = <fgui.GRichTextField>this.getChild("valueTxt3");
    this.valueTxt2 = <fgui.GRichTextField>this.getChild("valueTxt2");
    this.valueTxt = <fgui.GRichTextField>this.getChild("valueTxt");
    this.titleGroup = <fgui.GGroup>this.getChild("titleGroup");
    this.noteTxt = <fgui.GRichTextField>this.getChild("noteTxt");
    this.totalBackTxt = <fgui.GRichTextField>this.getChild("totalBackTxt");
    this.totalBackValueTxt = <fgui.GRichTextField>(
      this.getChild("totalBackValueTxt")
    );
  }
}
