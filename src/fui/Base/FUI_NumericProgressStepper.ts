/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

//@ts-expect-error: External dependencies
import FUI_CommonBtn from "./FUI_CommonBtn";

export default class FUI_NumericProgressStepper extends fgui.GComponent {
  public progress: fgui.GSlider;
  public btn_reduce: FUI_CommonBtn;
  public txt_num: fgui.GTextInput;
  public btn_plus: FUI_CommonBtn;
  public static URL: string = "ui://og5jeos3gp16hicq";

  public static createInstance(): FUI_NumericProgressStepper {
    return <FUI_NumericProgressStepper>(
      fgui.UIPackage.createObject("Base", "NumericProgressStepper")
    );
  }

  protected onConstruct(): void {
    this.progress = <fgui.GSlider>this.getChild("progress");
    this.btn_reduce = <FUI_CommonBtn>this.getChild("btn_reduce");
    this.txt_num = <fgui.GTextInput>this.getChild("txt_num");
    this.btn_plus = <FUI_CommonBtn>this.getChild("btn_plus");
  }
}
