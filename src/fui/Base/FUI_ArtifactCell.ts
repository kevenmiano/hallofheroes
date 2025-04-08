/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_ArtifactCell extends fgui.GButton {
  public c1: fgui.Controller;
  public isEquip: fgui.Controller;
  public isSelect: fgui.Controller;
  public isIdentify: fgui.Controller;
  public bg: fgui.GImage;
  public descTxt: fgui.GRichTextField;
  public goodsIcon: fgui.GLoader;
  public profile: fgui.GLoader;
  public levelTxt: fgui.GTextField;
  public static URL: string = "ui://og5jeos3l20eis2";

  public static createInstance(): FUI_ArtifactCell {
    return <FUI_ArtifactCell>(
      fgui.UIPackage.createObject("Base", "ArtifactCell")
    );
  }

  protected onConstruct(): void {
    this.c1 = this.getController("c1");
    this.isEquip = this.getController("isEquip");
    this.isSelect = this.getController("isSelect");
    this.isIdentify = this.getController("isIdentify");
    this.bg = <fgui.GImage>this.getChild("bg");
    this.descTxt = <fgui.GRichTextField>this.getChild("descTxt");
    this.goodsIcon = <fgui.GLoader>this.getChild("goodsIcon");
    this.profile = <fgui.GLoader>this.getChild("profile");
    this.levelTxt = <fgui.GTextField>this.getChild("levelTxt");
  }
}
