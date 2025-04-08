/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_BaseItem from "./FUI_BaseItem";

export default class FUI_ConsortiaStorageCell extends fgui.GButton {
  public c1: fgui.Controller;
  public img_bg: fgui.GImage;
  public img_lock: fgui.GImage;
  public item: FUI_BaseItem;
  public static URL: string = "ui://og5jeos3dcfui7j";

  public static createInstance(): FUI_ConsortiaStorageCell {
    return <FUI_ConsortiaStorageCell>(
      fgui.UIPackage.createObject("Base", "ConsortiaStorageCell")
    );
  }

  protected onConstruct(): void {
    this.c1 = this.getController("c1");
    this.img_bg = <fgui.GImage>this.getChild("img_bg");
    this.img_lock = <fgui.GImage>this.getChild("img_lock");
    this.item = <FUI_BaseItem>this.getChild("item");
  }
}
