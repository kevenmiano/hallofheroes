/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_BaseItem from "./FUI_BaseItem";

//@ts-expect-error: External dependencies
import FUI_Btn_Common from "./FUI_Btn_Common";

export default class FUI_OuterCityShopItem extends fgui.GButton {
  public isBest: fgui.Controller;
  public hasBuy: fgui.Controller;
  public isOwn: fgui.Controller;
  public item: FUI_BaseItem;
  public txt_best: fgui.GTextField;
  public txt_own: fgui.GTextField;
  public txt_name: fgui.GTextField;
  public btn1: FUI_Btn_Common;
  public txt_price1: fgui.GTextField;
  public btn2: FUI_Btn_Common;
  public txt_price2: fgui.GTextField;
  public txt_limit: fgui.GTextField;
  public txt_openDescible: fgui.GTextField;
  public static URL: string = "ui://og5jeos3pvdvifm";

  public static createInstance(): FUI_OuterCityShopItem {
    return <FUI_OuterCityShopItem>(
      fgui.UIPackage.createObject("Base", "OuterCityShopItem")
    );
  }

  protected onConstruct(): void {
    this.isBest = this.getController("isBest");
    this.hasBuy = this.getController("hasBuy");
    this.isOwn = this.getController("isOwn");
    this.item = <FUI_BaseItem>this.getChild("item");
    this.txt_best = <fgui.GTextField>this.getChild("txt_best");
    this.txt_own = <fgui.GTextField>this.getChild("txt_own");
    this.txt_name = <fgui.GTextField>this.getChild("txt_name");
    this.btn1 = <FUI_Btn_Common>this.getChild("btn1");
    this.txt_price1 = <fgui.GTextField>this.getChild("txt_price1");
    this.btn2 = <FUI_Btn_Common>this.getChild("btn2");
    this.txt_price2 = <fgui.GTextField>this.getChild("txt_price2");
    this.txt_limit = <fgui.GTextField>this.getChild("txt_limit");
    this.txt_openDescible = <fgui.GTextField>this.getChild("txt_openDescible");
  }
}
