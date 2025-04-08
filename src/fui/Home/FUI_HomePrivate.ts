/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_HomePrivate extends fgui.GComponent {
  public playerIcon: fgui.GComponent;
  public static URL: string = "ui://tny43dz1nwi0ipm";

  public static createInstance(): FUI_HomePrivate {
    return <FUI_HomePrivate>fgui.UIPackage.createObject("Home", "HomePrivate");
  }

  protected onConstruct(): void {
    this.playerIcon = <fgui.GComponent>this.getChild("playerIcon");
  }
}
