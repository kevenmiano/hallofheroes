/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_BaseItem from "./FUI_BaseItem";

export default class FUI_PlayerBagCell extends fgui.GButton {
  public c1: fgui.Controller;
  public c2: fgui.Controller;
  public c3: fgui.Controller;
  public img_bg: fgui.GImage;
  public img_lock: fgui.GImage;
  public item: FUI_BaseItem;
  public stopper: fgui.GGraph;
  public img_unselected: fgui.GImage;
  public img_selected: fgui.GImage;
  public currentTreasureMap: fgui.GImage;
  public img_gray: fgui.GGraph;
  public static URL: string = "ui://og5jeos3joqd1p";

  public static createInstance(): FUI_PlayerBagCell {
    return <FUI_PlayerBagCell>(
      fgui.UIPackage.createObject("Base", "PlayerBagCell")
    );
  }

  protected onConstruct(): void {
    this.c1 = this.getController("c1");
    this.c2 = this.getController("c2");
    this.c3 = this.getController("c3");
    this.img_bg = <fgui.GImage>this.getChild("img_bg");
    this.img_lock = <fgui.GImage>this.getChild("img_lock");
    this.item = <FUI_BaseItem>this.getChild("item");
    this.stopper = <fgui.GGraph>this.getChild("stopper");
    this.img_unselected = <fgui.GImage>this.getChild("img_unselected");
    this.img_selected = <fgui.GImage>this.getChild("img_selected");
    this.currentTreasureMap = <fgui.GImage>this.getChild("currentTreasureMap");
    this.img_gray = <fgui.GGraph>this.getChild("img_gray");
  }
}
