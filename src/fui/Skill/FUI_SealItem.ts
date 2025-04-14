/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_DragSealIcon from "./FUI_DragSealIcon";

export default class FUI_SealItem extends fgui.GComponent {
  public c1: fgui.Controller;
  public indexTxt: fgui.GTextField;
  public dragcom: FUI_DragSealIcon;
  public img_select: fgui.GImage;
  public static URL: string = "ui://v98hah2of7eoim8";

  public static createInstance(): FUI_SealItem {
    return <FUI_SealItem>fgui.UIPackage.createObject("Skill", "SealItem");
  }

  protected onConstruct(): void {
    this.c1 = this.getController("c1");
    this.indexTxt = <fgui.GTextField>this.getChild("indexTxt");
    this.dragcom = <FUI_DragSealIcon>this.getChild("dragcom");
    this.img_select = <fgui.GImage>this.getChild("img_select");
  }
}
