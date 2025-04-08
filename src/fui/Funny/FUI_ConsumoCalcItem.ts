/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_ConsumoCalcItem extends fgui.GComponent {
  public c1: fgui.Controller;
  public DescTxt: fgui.GTextField;
  public txt_Count: fgui.GTextField;
  public goodsList: fgui.GList;
  public getRewardBtn: fgui.GButton;
  public openrationBtn: fgui.GButton;
  public overBtn: fgui.GButton;
  public static URL: string = "ui://lzu8jcp2bsk34i";

  public static createInstance(): FUI_ConsumoCalcItem {
    return <FUI_ConsumoCalcItem>(
      fgui.UIPackage.createObject("Funny", "ConsumoCalcItem")
    );
  }

  protected onConstruct(): void {
    this.c1 = this.getController("c1");
    this.DescTxt = <fgui.GTextField>this.getChild("DescTxt");
    this.txt_Count = <fgui.GTextField>this.getChild("txt_Count");
    this.goodsList = <fgui.GList>this.getChild("goodsList");
    this.getRewardBtn = <fgui.GButton>this.getChild("getRewardBtn");
    this.openrationBtn = <fgui.GButton>this.getChild("openrationBtn");
    this.overBtn = <fgui.GButton>this.getChild("overBtn");
  }
}
