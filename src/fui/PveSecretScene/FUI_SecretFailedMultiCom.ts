/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

//@ts-expect-error: External dependencies
import FUI_SecretEventOptCom from "./FUI_SecretEventOptCom";

export default class FUI_SecretFailedMultiCom extends fgui.GComponent {
  public txtFailedTitle: fgui.GTextField;
  public btnGiveUp: FUI_SecretEventOptCom;
  public btnAgain: FUI_SecretEventOptCom;
  public static URL: string = "ui://7g1ccuufvtoem";

  public static createInstance(): FUI_SecretFailedMultiCom {
    return <FUI_SecretFailedMultiCom>(
      fgui.UIPackage.createObject("PveSecretScene", "SecretFailedMultiCom")
    );
  }

  protected onConstruct(): void {
    this.txtFailedTitle = <fgui.GTextField>this.getChild("txtFailedTitle");
    this.btnGiveUp = <FUI_SecretEventOptCom>this.getChild("btnGiveUp");
    this.btnAgain = <FUI_SecretEventOptCom>this.getChild("btnAgain");
  }
}
