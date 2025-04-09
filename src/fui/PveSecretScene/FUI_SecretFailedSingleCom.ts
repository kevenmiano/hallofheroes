// TODO FIX
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_SecretEventOptCom from "./FUI_SecretEventOptCom";

export default class FUI_SecretFailedSingleCom extends fgui.GComponent {
  public txtFailedTitle: fgui.GTextField;
  public btnGiveUp: FUI_SecretEventOptCom;
  public btnAgain: FUI_SecretEventOptCom;
  public static URL: string = "ui://7g1ccuufvtoej";

  public static createInstance(): FUI_SecretFailedSingleCom {
    return <FUI_SecretFailedSingleCom>(
      fgui.UIPackage.createObject("PveSecretScene", "SecretFailedSingleCom")
    );
  }

  protected onConstruct(): void {
    this.txtFailedTitle = <fgui.GTextField>this.getChild("txtFailedTitle");
    this.btnGiveUp = <FUI_SecretEventOptCom>this.getChild("btnGiveUp");
    this.btnAgain = <FUI_SecretEventOptCom>this.getChild("btnAgain");
  }
}
