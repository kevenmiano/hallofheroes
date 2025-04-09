/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_OuterCityVehicleItem extends fgui.GComponent {
  public type: fgui.Controller;
  public statusCtr: fgui.Controller;
  public titleDescTxt: fgui.GTextField;
  public countTxt: fgui.GTextField;
  public list: fgui.GList;
  public escortBtn: fgui.GButton;
  public advanceBtn: fgui.GButton;
  public exitBtn: fgui.GButton;
  public static URL: string = "ui://xcvl5694siyxmj1z";

  public static createInstance(): FUI_OuterCityVehicleItem {
    return <FUI_OuterCityVehicleItem>(
      fgui.UIPackage.createObject("OuterCity", "OuterCityVehicleItem")
    );
  }

  protected onConstruct(): void {
    this.type = this.getController("type");
    this.statusCtr = this.getController("statusCtr");
    this.titleDescTxt = <fgui.GTextField>this.getChild("titleDescTxt");
    this.countTxt = <fgui.GTextField>this.getChild("countTxt");
    this.list = <fgui.GList>this.getChild("list");
    this.escortBtn = <fgui.GButton>this.getChild("escortBtn");
    this.advanceBtn = <fgui.GButton>this.getChild("advanceBtn");
    this.exitBtn = <fgui.GButton>this.getChild("exitBtn");
  }
}
