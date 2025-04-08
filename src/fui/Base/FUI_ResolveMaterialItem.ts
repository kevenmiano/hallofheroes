/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_BaseItem from "./FUI_BaseItem";

export default class FUI_ResolveMaterialItem extends fgui.GButton {
  public item: FUI_BaseItem;
  public txt: fgui.GTextField;
  public static URL: string = "ui://og5jeos3fw4ci5t";

  public static createInstance(): FUI_ResolveMaterialItem {
    return <FUI_ResolveMaterialItem>(
      fgui.UIPackage.createObject("Base", "ResolveMaterialItem")
    );
  }

  protected onConstruct(): void {
    this.item = <FUI_BaseItem>this.getChild("item");
    this.txt = <fgui.GTextField>this.getChild("txt");
  }
}
