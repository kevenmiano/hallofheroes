/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_BaseItem from "./FUI_BaseItem";
import FUI_BaseTipItem from "./FUI_BaseTipItem";

export default class FUI_ShopItem extends fgui.GButton {
  public item: FUI_BaseItem;
  public txt_name: fgui.GTextField;
  public txt_openDescible: fgui.GTextField;
  public tipBtn: FUI_BaseTipItem;
  public moneyTxt: fgui.GTextField;
  public txt_price: fgui.GTextField;
  public group1: fgui.GGroup;
  public group2: fgui.GGroup;
  public runeDescTxt: fgui.GTextField;
  public runeGroup: fgui.GGroup;
  public static URL: string = "ui://og5jeos3fgera";

  public static createInstance(): FUI_ShopItem {
    return <FUI_ShopItem>fgui.UIPackage.createObject("Base", "ShopItem");
  }

  protected onConstruct(): void {
    this.item = <FUI_BaseItem>this.getChild("item");
    this.txt_name = <fgui.GTextField>this.getChild("txt_name");
    this.txt_openDescible = <fgui.GTextField>this.getChild("txt_openDescible");
    this.tipBtn = <FUI_BaseTipItem>this.getChild("tipBtn");
    this.moneyTxt = <fgui.GTextField>this.getChild("moneyTxt");
    this.txt_price = <fgui.GTextField>this.getChild("txt_price");
    this.group1 = <fgui.GGroup>this.getChild("group1");
    this.group2 = <fgui.GGroup>this.getChild("group2");
    this.runeDescTxt = <fgui.GTextField>this.getChild("runeDescTxt");
    this.runeGroup = <fgui.GGroup>this.getChild("runeGroup");
  }
}
