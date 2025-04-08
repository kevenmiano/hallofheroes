// TODO FIX
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_CommonBtn from "./FUI_CommonBtn";

export default class FUI_NumericStepper extends fgui.GComponent {
  public type: fgui.Controller;
  public size: fgui.Controller;
  public btn_min: FUI_CommonBtn;
  public btn_reduce: FUI_CommonBtn;
  public bg_num: fgui.GImage;
  public txt_num: fgui.GTextInput;
  public g_num: fgui.GGroup;
  public btn_plus: FUI_CommonBtn;
  public btn_max: FUI_CommonBtn;
  public static URL: string = "ui://og5jeos3zcvyi7l";

  public static createInstance(): FUI_NumericStepper {
    return <FUI_NumericStepper>(
      fgui.UIPackage.createObject("Base", "NumericStepper")
    );
  }

  protected onConstruct(): void {
    this.type = this.getController("type");
    this.size = this.getController("size");
    this.btn_min = <FUI_CommonBtn>this.getChild("btn_min");
    this.btn_reduce = <FUI_CommonBtn>this.getChild("btn_reduce");
    this.bg_num = <fgui.GImage>this.getChild("bg_num");
    this.txt_num = <fgui.GTextInput>this.getChild("txt_num");
    this.g_num = <fgui.GGroup>this.getChild("g_num");
    this.btn_plus = <FUI_CommonBtn>this.getChild("btn_plus");
    this.btn_max = <FUI_CommonBtn>this.getChild("btn_max");
  }
}
