/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_BaseItem from "./FUI_BaseItem";

export default class FUI_ItemWithSelectEffect extends fgui.GButton {
  public item: FUI_BaseItem;
  public effect: fgui.GLoader;
  public txtName: fgui.GTextField;
  public static URL: string = "ui://og5jeos3tbczi5o";

  public static createInstance(): FUI_ItemWithSelectEffect {
    return <FUI_ItemWithSelectEffect>(
      fgui.UIPackage.createObject("Base", "ItemWithSelectEffect")
    );
  }

  protected onConstruct(): void {
    this.item = <FUI_BaseItem>this.getChild("item");
    this.effect = <fgui.GLoader>this.getChild("effect");
    this.txtName = <fgui.GTextField>this.getChild("txtName");
  }
}
