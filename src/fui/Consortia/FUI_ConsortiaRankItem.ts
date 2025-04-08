/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_ConsortiaRankItem extends fgui.GComponent {
  public c1: fgui.Controller;
  public rankIcon: fgui.GLoader;
  public txt_rank: fgui.GTextField;
  public txt_name: fgui.GTextField;
  public txt_power: fgui.GTextField;
  public static URL: string = "ui://8w3m5duwp9fui93";

  public static createInstance(): FUI_ConsortiaRankItem {
    return <FUI_ConsortiaRankItem>(
      fgui.UIPackage.createObject("Consortia", "ConsortiaRankItem")
    );
  }

  protected onConstruct(): void {
    this.c1 = this.getController("c1");
    this.rankIcon = <fgui.GLoader>this.getChild("rankIcon");
    this.txt_rank = <fgui.GTextField>this.getChild("txt_rank");
    this.txt_name = <fgui.GTextField>this.getChild("txt_name");
    this.txt_power = <fgui.GTextField>this.getChild("txt_power");
  }
}
