/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

//@ts-expect-error: External dependencies
import FUI_RuneHole_s from "./FUI_RuneHole_s";

export default class FUI_GemAttriItem extends fgui.GComponent {
  public c1: fgui.Controller;
  public loader: fgui.GLoader;
  public txt_attributeName: fgui.GTextField;
  public txt_attributeValue: fgui.GTextField;
  public holeType: FUI_RuneHole_s;
  public txt_name: fgui.GTextField;
  public static URL: string = "ui://v98hah2okhkmigh";

  public static createInstance(): FUI_GemAttriItem {
    return <FUI_GemAttriItem>(
      fgui.UIPackage.createObject("Skill", "GemAttriItem")
    );
  }

  protected onConstruct(): void {
    this.c1 = this.getController("c1");
    this.loader = <fgui.GLoader>this.getChild("loader");
    this.txt_attributeName = <fgui.GTextField>(
      this.getChild("txt_attributeName")
    );
    this.txt_attributeValue = <fgui.GTextField>(
      this.getChild("txt_attributeValue")
    );
    this.holeType = <FUI_RuneHole_s>this.getChild("holeType");
    this.txt_name = <fgui.GTextField>this.getChild("txt_name");
  }
}
