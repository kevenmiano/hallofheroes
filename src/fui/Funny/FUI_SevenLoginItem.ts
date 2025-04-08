/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_SevenLoginItem extends fgui.GComponent {
  public c1: fgui.Controller;
  public exchangeList1: fgui.GList;
  public dayTxt: fgui.GTextField;
  public getRewardBtn: fgui.GButton;
  public openrationBtn: fgui.GButton;
  public overBtn: fgui.GButton;
  public static URL: string = "ui://lzu8jcp2r70i6e";

  public static createInstance(): FUI_SevenLoginItem {
    return <FUI_SevenLoginItem>(
      fgui.UIPackage.createObject("Funny", "SevenLoginItem")
    );
  }

  protected onConstruct(): void {
    this.c1 = this.getController("c1");
    this.exchangeList1 = <fgui.GList>this.getChild("exchangeList1");
    this.dayTxt = <fgui.GTextField>this.getChild("dayTxt");
    this.getRewardBtn = <fgui.GButton>this.getChild("getRewardBtn");
    this.openrationBtn = <fgui.GButton>this.getChild("openrationBtn");
    this.overBtn = <fgui.GButton>this.getChild("overBtn");
  }
}
