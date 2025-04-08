/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_MarketListCom extends fgui.GComponent {
  public igt: fgui.GImage;
  public goodsNameLab: fgui.GTextField;
  public onlineCountLab: fgui.GTextField;
  public priceLab: fgui.GTextField;
  public goodsList: fgui.GList;
  public static URL: string = "ui://50f8ewazdt3z9";

  public static createInstance(): FUI_MarketListCom {
    return <FUI_MarketListCom>(
      fgui.UIPackage.createObject("Market", "MarketListCom")
    );
  }

  protected onConstruct(): void {
    this.igt = <fgui.GImage>this.getChild("igt");
    this.goodsNameLab = <fgui.GTextField>this.getChild("goodsNameLab");
    this.onlineCountLab = <fgui.GTextField>this.getChild("onlineCountLab");
    this.priceLab = <fgui.GTextField>this.getChild("priceLab");
    this.goodsList = <fgui.GList>this.getChild("goodsList");
  }
}
