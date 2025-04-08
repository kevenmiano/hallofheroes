/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_AirGardenGameSuDuItem extends fgui.GButton {
  public cellTypeCtrl: fgui.Controller;
  public valueColorCtrl: fgui.Controller;
  public emptyCtrl: fgui.Controller;
  public tb: fgui.GImage;
  public tf: fgui.GImage;
  public ts: fgui.GImage;
  public valueText: fgui.GTextField;
  public countText: fgui.GTextField;
  public static URL: string = "ui://qvbm8hnzohnemies";

  public static createInstance(): FUI_AirGardenGameSuDuItem {
    return <FUI_AirGardenGameSuDuItem>(
      fgui.UIPackage.createObject("Carnival", "AirGardenGameSuDuItem")
    );
  }

  protected onConstruct(): void {
    this.cellTypeCtrl = this.getController("cellTypeCtrl");
    this.valueColorCtrl = this.getController("valueColorCtrl");
    this.emptyCtrl = this.getController("emptyCtrl");
    this.tb = <fgui.GImage>this.getChild("tb");
    this.tf = <fgui.GImage>this.getChild("tf");
    this.ts = <fgui.GImage>this.getChild("ts");
    this.valueText = <fgui.GTextField>this.getChild("valueText");
    this.countText = <fgui.GTextField>this.getChild("countText");
  }
}
