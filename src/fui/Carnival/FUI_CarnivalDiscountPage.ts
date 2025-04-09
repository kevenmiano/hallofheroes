/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_CarnivalDiscountPageItem from "./FUI_CarnivalDiscountPageItem";
import FUI_CarnivalInfoItem from "./FUI_CarnivalInfoItem";

export default class FUI_CarnivalDiscountPage extends fgui.GComponent {
  public isSummer: fgui.Controller;
  public item_0: FUI_CarnivalDiscountPageItem;
  public item_1: FUI_CarnivalDiscountPageItem;
  public item_2: FUI_CarnivalDiscountPageItem;
  public item_3: FUI_CarnivalDiscountPageItem;
  public items: fgui.GGroup;
  public snow: fgui.GImage;
  public snow1: fgui.GImage;
  public snow2: fgui.GImage;
  public snowGroup: fgui.GGroup;
  public carnival_recharge: FUI_CarnivalInfoItem;
  public carnival_reset: FUI_CarnivalInfoItem;
  public static URL: string = "ui://qvbm8hnzpf9kgj";

  public static createInstance(): FUI_CarnivalDiscountPage {
    return <FUI_CarnivalDiscountPage>(
      fgui.UIPackage.createObject("Carnival", "CarnivalDiscountPage")
    );
  }

  protected onConstruct(): void {
    this.isSummer = this.getController("isSummer");
    this.item_0 = <FUI_CarnivalDiscountPageItem>this.getChild("item_0");
    this.item_1 = <FUI_CarnivalDiscountPageItem>this.getChild("item_1");
    this.item_2 = <FUI_CarnivalDiscountPageItem>this.getChild("item_2");
    this.item_3 = <FUI_CarnivalDiscountPageItem>this.getChild("item_3");
    this.items = <fgui.GGroup>this.getChild("items");
    this.snow = <fgui.GImage>this.getChild("snow");
    this.snow1 = <fgui.GImage>this.getChild("snow1");
    this.snow2 = <fgui.GImage>this.getChild("snow2");
    this.snowGroup = <fgui.GGroup>this.getChild("snowGroup");
    this.carnival_recharge = <FUI_CarnivalInfoItem>(
      this.getChild("carnival_recharge")
    );
    this.carnival_reset = <FUI_CarnivalInfoItem>this.getChild("carnival_reset");
  }
}
