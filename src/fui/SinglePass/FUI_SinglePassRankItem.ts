/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_SinglePassRankItem extends fgui.GComponent {
  public itemBg: fgui.GImage;
  public rankTxt: fgui.GTextField;
  public nickNameTxt: fgui.GTextField;
  public layerDescTxt: fgui.GTextField;
  public static URL: string = "ui://udjm963kdyght";

  public static createInstance(): FUI_SinglePassRankItem {
    return <FUI_SinglePassRankItem>(
      fgui.UIPackage.createObject("SinglePass", "SinglePassRankItem")
    );
  }

  protected onConstruct(): void {
    this.itemBg = <fgui.GImage>this.getChild("itemBg");
    this.rankTxt = <fgui.GTextField>this.getChild("rankTxt");
    this.nickNameTxt = <fgui.GTextField>this.getChild("nickNameTxt");
    this.layerDescTxt = <fgui.GTextField>this.getChild("layerDescTxt");
  }
}
