/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

//@ts-expect-error: External dependencies
import FUI_Com_Awakening501 from "./FUI_Com_Awakening501";

//@ts-expect-error: External dependencies
import FUI_Com_AwakeningLine501 from "./FUI_Com_AwakeningLine501";

export default class FUI_petAwakeingBtn extends fgui.GButton {
  public job: fgui.Controller;
  public cAwakenState: fgui.Controller;
  public job_bg: fgui.GLoader;
  public mc501: FUI_Com_Awakening501;
  public line501: FUI_Com_AwakeningLine501;
  public txtAwaken: fgui.GTextField;
  public gAwaken: fgui.GGroup;
  public txtAwakenNormalTip: fgui.GTextField;
  public txtCancelAwaken: fgui.GTextField;
  public txtCurAwaken: fgui.GTextField;
  public static URL: string = "ui://85gc5kvsfo55141";

  public static createInstance(): FUI_petAwakeingBtn {
    return <FUI_petAwakeingBtn>(
      fgui.UIPackage.createObject("BattleDynamic", "petAwakeingBtn")
    );
  }

  protected onConstruct(): void {
    this.job = this.getController("job");
    this.cAwakenState = this.getController("cAwakenState");
    this.job_bg = <fgui.GLoader>this.getChild("job_bg");
    this.mc501 = <FUI_Com_Awakening501>this.getChild("mc501");
    this.line501 = <FUI_Com_AwakeningLine501>this.getChild("line501");
    this.txtAwaken = <fgui.GTextField>this.getChild("txtAwaken");
    this.gAwaken = <fgui.GGroup>this.getChild("gAwaken");
    this.txtAwakenNormalTip = <fgui.GTextField>(
      this.getChild("txtAwakenNormalTip")
    );
    this.txtCancelAwaken = <fgui.GTextField>this.getChild("txtCancelAwaken");
    this.txtCurAwaken = <fgui.GTextField>this.getChild("txtCurAwaken");
  }
}
