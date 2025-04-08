/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_BaseItem from "./FUI_BaseItem";

export default class FUI_PreviewBoxItem extends fgui.GButton {
  public goodsItem: FUI_BaseItem;
  public goodsName: fgui.GTextField;
  public img_magicCard: fgui.GImage;
  public static URL: string = "ui://og5jeos3p3rbwu8wuk";

  public static createInstance(): FUI_PreviewBoxItem {
    return <FUI_PreviewBoxItem>(
      fgui.UIPackage.createObject("Base", "PreviewBoxItem")
    );
  }

  protected onConstruct(): void {
    this.goodsItem = <FUI_BaseItem>this.getChild("goodsItem");
    this.goodsName = <fgui.GTextField>this.getChild("goodsName");
    this.img_magicCard = <fgui.GImage>this.getChild("img_magicCard");
  }
}
