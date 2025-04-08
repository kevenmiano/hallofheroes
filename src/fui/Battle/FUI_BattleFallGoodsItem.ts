/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_BattleFallGoodsItem extends fgui.GComponent {
  public GoodsIcon: fgui.GLoader;
  public GoodsNameTxt: fgui.GTextField;
  public GoodsNumTxt: fgui.GTextField;
  public static URL: string = "ui://tybyzkwzsu6bep";

  public static createInstance(): FUI_BattleFallGoodsItem {
    return <FUI_BattleFallGoodsItem>(
      fgui.UIPackage.createObject("Battle", "BattleFallGoodsItem")
    );
  }

  protected onConstruct(): void {
    this.GoodsIcon = <fgui.GLoader>this.getChild("GoodsIcon");
    this.GoodsNameTxt = <fgui.GTextField>this.getChild("GoodsNameTxt");
    this.GoodsNumTxt = <fgui.GTextField>this.getChild("GoodsNumTxt");
  }
}
