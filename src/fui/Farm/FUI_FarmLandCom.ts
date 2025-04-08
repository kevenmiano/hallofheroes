/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_FarmLandItem from "./FUI_FarmLandItem";

export default class FUI_FarmLandCom extends fgui.GComponent {
  public item_02: FUI_FarmLandItem;
  public item_01: FUI_FarmLandItem;
  public item_00: FUI_FarmLandItem;
  public item_03: FUI_FarmLandItem;
  public item_04: FUI_FarmLandItem;
  public item_05: FUI_FarmLandItem;
  public item_06: FUI_FarmLandItem;
  public item_07: FUI_FarmLandItem;
  public item_08: FUI_FarmLandItem;
  public static URL: string = "ui://rcqiz171cju83b";

  public static createInstance(): FUI_FarmLandCom {
    return <FUI_FarmLandCom>fgui.UIPackage.createObject("Farm", "FarmLandCom");
  }

  protected onConstruct(): void {
    this.item_02 = <FUI_FarmLandItem>this.getChild("item_02");
    this.item_01 = <FUI_FarmLandItem>this.getChild("item_01");
    this.item_00 = <FUI_FarmLandItem>this.getChild("item_00");
    this.item_03 = <FUI_FarmLandItem>this.getChild("item_03");
    this.item_04 = <FUI_FarmLandItem>this.getChild("item_04");
    this.item_05 = <FUI_FarmLandItem>this.getChild("item_05");
    this.item_06 = <FUI_FarmLandItem>this.getChild("item_06");
    this.item_07 = <FUI_FarmLandItem>this.getChild("item_07");
    this.item_08 = <FUI_FarmLandItem>this.getChild("item_08");
  }
}
