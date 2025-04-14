/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

//@ts-expect-error: External dependencies
import FUI_border from "./FUI_border";

export default class FUI_MapItem extends fgui.GComponent {
  public c1: fgui.Controller;
  public border: FUI_border;
  public t0: fgui.GTextField;
  public txt_name: fgui.GTextField;
  public txt_count: fgui.GTextField;
  public static URL: string = "ui://lwaby9o0s8sjf";

  public static createInstance(): FUI_MapItem {
    return <FUI_MapItem>fgui.UIPackage.createObject("TreasureMap", "MapItem");
  }

  protected onConstruct(): void {
    this.c1 = this.getController("c1");
    this.border = <FUI_border>this.getChild("border");
    this.t0 = <fgui.GTextField>this.getChild("t0");
    this.txt_name = <fgui.GTextField>this.getChild("txt_name");
    this.txt_count = <fgui.GTextField>this.getChild("txt_count");
  }
}
