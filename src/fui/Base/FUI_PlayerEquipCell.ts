/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_BaseItem from "./FUI_BaseItem";

//@ts-expect-error: External dependencies
import FUI_RadioBtn from "./FUI_RadioBtn";

export default class FUI_PlayerEquipCell extends fgui.GButton {
  public item: FUI_BaseItem;
  public btn_upgrade: FUI_RadioBtn;
  public activeBack: fgui.GMovieClip;
  public static URL: string = "ui://og5jeos3joqd1s";

  public static createInstance(): FUI_PlayerEquipCell {
    return <FUI_PlayerEquipCell>(
      fgui.UIPackage.createObject("Base", "PlayerEquipCell")
    );
  }

  protected onConstruct(): void {
    this.item = <FUI_BaseItem>this.getChild("item");
    this.btn_upgrade = <FUI_RadioBtn>this.getChild("btn_upgrade");
    this.activeBack = <fgui.GMovieClip>this.getChild("activeBack");
  }
}
