/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_PlanetItem extends fgui.GButton {
  public effectCtrl: fgui.Controller;
  public txtCostGold: fgui.GTextField;
  public tipItem: fgui.GButton;
  public gCost: fgui.GGroup;
  public effect: fgui.GMovieClip;
  public static URL: string = "ui://gy6qelnhpwq0n";

  public static createInstance(): FUI_PlanetItem {
    return <FUI_PlanetItem>fgui.UIPackage.createObject("Star", "PlanetItem");
  }

  protected onConstruct(): void {
    this.effectCtrl = this.getController("effectCtrl");
    this.txtCostGold = <fgui.GTextField>this.getChild("txtCostGold");
    this.tipItem = <fgui.GButton>this.getChild("tipItem");
    this.gCost = <fgui.GGroup>this.getChild("gCost");
    this.effect = <fgui.GMovieClip>this.getChild("effect");
  }
}
