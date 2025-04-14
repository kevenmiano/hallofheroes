/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_ShopDiscountScoreItem extends fgui.GButton {
  public cState: fgui.Controller;
  public txtIntegral: fgui.GTextField;
  public item: fgui.GButton;
  public effect: fgui.GMovieClip;
  public static URL: string = "ui://qcwdul6nzeof1u";

  public static createInstance(): FUI_ShopDiscountScoreItem {
    return <FUI_ShopDiscountScoreItem>(
      fgui.UIPackage.createObject("Shop", "ShopDiscountScoreItem")
    );
  }

  protected onConstruct(): void {
    this.cState = this.getController("cState");
    this.txtIntegral = <fgui.GTextField>this.getChild("txtIntegral");
    this.item = <fgui.GButton>this.getChild("item");
    this.effect = <fgui.GMovieClip>this.getChild("effect");
  }
}
