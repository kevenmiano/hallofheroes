// TODO FIX
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_tabcom from "./FUI_tabcom";

export default class FUI_EvaluationCom extends fgui.GComponent {
  public img3: fgui.GImage;
  public img4: fgui.GImage;
  public img5: fgui.GImage;
  public t1: fgui.GTextField;
  public txt_desc: fgui.GTextInput;
  public txt_num: fgui.GTextField;
  public tab: FUI_tabcom;
  public static URL: string = "ui://6watmcoik5t124";

  public static createInstance(): FUI_EvaluationCom {
    return <FUI_EvaluationCom>(
      fgui.UIPackage.createObject("PersonalCenter", "EvaluationCom")
    );
  }

  protected onConstruct(): void {
    this.img3 = <fgui.GImage>this.getChild("img3");
    this.img4 = <fgui.GImage>this.getChild("img4");
    this.img5 = <fgui.GImage>this.getChild("img5");
    this.t1 = <fgui.GTextField>this.getChild("t1");
    this.txt_desc = <fgui.GTextInput>this.getChild("txt_desc");
    this.txt_num = <fgui.GTextField>this.getChild("txt_num");
    this.tab = <FUI_tabcom>this.getChild("tab");
  }
}
