/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_NumericStepper from "./FUI_NumericStepper";
import FUI_BaseItem from "./FUI_BaseItem";

export default class FUI_MultiBoxSelectItem extends fgui.GComponent {
  public boxbg: fgui.GImage;
  public stepper: FUI_NumericStepper;
  public item: FUI_BaseItem;
  public txt_name: fgui.GTextField;
  public static URL: string = "ui://og5jeos3kiz4wu8wwm";

  public static createInstance(): FUI_MultiBoxSelectItem {
    return <FUI_MultiBoxSelectItem>(
      fgui.UIPackage.createObject("Base", "MultiBoxSelectItem")
    );
  }

  protected onConstruct(): void {
    this.boxbg = <fgui.GImage>this.getChild("boxbg");
    this.stepper = <FUI_NumericStepper>this.getChild("stepper");
    this.item = <FUI_BaseItem>this.getChild("item");
    this.txt_name = <fgui.GTextField>this.getChild("txt_name");
  }
}
