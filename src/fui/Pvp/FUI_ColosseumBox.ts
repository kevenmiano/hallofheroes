/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_ColosseumBox extends fgui.GButton {
  public effect: fgui.Controller;
  public isWeek: fgui.Controller;
  public iconBox: fgui.GLoader;
  public count: fgui.GTextField;
  public static URL: string = "ui://5ozuvi6du3kmi4b";

  public static createInstance(): FUI_ColosseumBox {
    return <FUI_ColosseumBox>fgui.UIPackage.createObject("Pvp", "ColosseumBox");
  }

  protected onConstruct(): void {
    this.effect = this.getController("effect");
    this.isWeek = this.getController("isWeek");
    this.iconBox = <fgui.GLoader>this.getChild("iconBox");
    this.count = <fgui.GTextField>this.getChild("count");
  }
}
