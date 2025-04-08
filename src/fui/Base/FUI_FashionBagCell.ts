/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_BaseItem from "./FUI_BaseItem";

export default class FUI_FashionBagCell extends fgui.GButton {
  public c2: fgui.Controller;
  public item: FUI_BaseItem;
  public txt_desc: fgui.GTextField;
  public heroEquipIcon: fgui.GImage;
  public static URL: string = "ui://og5jeos3wpsei2y";

  public static createInstance(): FUI_FashionBagCell {
    return <FUI_FashionBagCell>(
      fgui.UIPackage.createObject("Base", "FashionBagCell")
    );
  }

  protected onConstruct(): void {
    this.c2 = this.getController("c2");
    this.item = <FUI_BaseItem>this.getChild("item");
    this.txt_desc = <fgui.GTextField>this.getChild("txt_desc");
    this.heroEquipIcon = <fgui.GImage>this.getChild("heroEquipIcon");
  }
}
