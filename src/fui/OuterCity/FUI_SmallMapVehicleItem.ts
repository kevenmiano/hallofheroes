/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_SmallMapVehicleItem extends fgui.GComponent {
  public btn: fgui.GButton;
  public static URL: string = "ui://xcvl5694siyxmj25";

  public static createInstance(): FUI_SmallMapVehicleItem {
    return <FUI_SmallMapVehicleItem>(
      fgui.UIPackage.createObject("OuterCity", "SmallMapVehicleItem")
    );
  }

  protected onConstruct(): void {
    this.btn = <fgui.GButton>this.getChild("btn");
  }
}
