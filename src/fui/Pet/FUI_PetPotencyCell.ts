/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_PetPotencyCell extends fgui.GButton {
  public c1: fgui.Controller;
  public bg: fgui.GImage;
  public goodsIcon: fgui.GLoader;
  public selectImg: fgui.GLoader;
  public countTxt: fgui.GTextField;
  public static URL: string = "ui://t0l2fizvor0birx";

  public static createInstance(): FUI_PetPotencyCell {
    return <FUI_PetPotencyCell>(
      fgui.UIPackage.createObject("Pet", "PetPotencyCell")
    );
  }

  protected onConstruct(): void {
    this.c1 = this.getController("c1");
    this.bg = <fgui.GImage>this.getChild("bg");
    this.goodsIcon = <fgui.GLoader>this.getChild("goodsIcon");
    this.selectImg = <fgui.GLoader>this.getChild("selectImg");
    this.countTxt = <fgui.GTextField>this.getChild("countTxt");
  }
}
