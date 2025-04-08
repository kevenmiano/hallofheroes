/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_BaseItem from "./FUI_BaseItem";

export default class FUI_RuneBagCell extends fgui.GButton {
  public cSelectState: fgui.Controller;
  public c2: fgui.Controller;
  public bg: fgui.GImage;
  public item: FUI_BaseItem;
  public stopper: fgui.GGraph;
  public heroEquipIcon: fgui.GImage;
  public img_lock: fgui.GImage;
  public static URL: string = "ui://og5jeos3s7q5ige";

  public static createInstance(): FUI_RuneBagCell {
    return <FUI_RuneBagCell>fgui.UIPackage.createObject("Base", "RuneBagCell");
  }

  protected onConstruct(): void {
    this.cSelectState = this.getController("cSelectState");
    this.c2 = this.getController("c2");
    this.bg = <fgui.GImage>this.getChild("bg");
    this.item = <FUI_BaseItem>this.getChild("item");
    this.stopper = <fgui.GGraph>this.getChild("stopper");
    this.heroEquipIcon = <fgui.GImage>this.getChild("heroEquipIcon");
    this.img_lock = <fgui.GImage>this.getChild("img_lock");
  }
}
