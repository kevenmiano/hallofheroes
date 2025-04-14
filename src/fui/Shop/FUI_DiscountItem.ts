/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_DiscountItem extends fgui.GButton {
  public item: fgui.GButton;
  public checkBtn: fgui.GButton;
  public txt_name: fgui.GRichTextField;
  public txt_des: fgui.GRichTextField;
  public txt_validDate: fgui.GTextField;
  public static URL: string = "ui://qcwdul6njhob1q";

  public static createInstance(): FUI_DiscountItem {
    return <FUI_DiscountItem>(
      fgui.UIPackage.createObject("Shop", "DiscountItem")
    );
  }

  protected onConstruct(): void {
    this.item = <fgui.GButton>this.getChild("item");
    this.checkBtn = <fgui.GButton>this.getChild("checkBtn");
    this.txt_name = <fgui.GRichTextField>this.getChild("txt_name");
    this.txt_des = <fgui.GRichTextField>this.getChild("txt_des");
    this.txt_validDate = <fgui.GTextField>this.getChild("txt_validDate");
  }
}
