/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_HoldOptionlCom from "./FUI_HoldOptionlCom";
import FUI_HoldValueOptionCom from "./FUI_HoldValueOptionCom";
import FUI_RuneOptionCom from "./FUI_RuneOptionCom";
import FUI_HoldEffectOptionlCom from "./FUI_HoldEffectOptionlCom";

export default class FUI_RuneHoldOption extends fgui.GComponent {
  public hoc: FUI_HoldOptionlCom;
  public hvoc: FUI_HoldValueOptionCom;
  public roc: FUI_RuneOptionCom;
  public heoc: FUI_HoldEffectOptionlCom;
  public backBtn: fgui.GButton;
  public static URL: string = "ui://v98hah2olin8imu";

  public static createInstance(): FUI_RuneHoldOption {
    return <FUI_RuneHoldOption>(
      fgui.UIPackage.createObject("Skill", "RuneHoldOption")
    );
  }

  protected onConstruct(): void {
    this.hoc = <FUI_HoldOptionlCom>this.getChild("hoc");
    this.hvoc = <FUI_HoldValueOptionCom>this.getChild("hvoc");
    this.roc = <FUI_RuneOptionCom>this.getChild("roc");
    this.heoc = <FUI_HoldEffectOptionlCom>this.getChild("heoc");
    this.backBtn = <fgui.GButton>this.getChild("backBtn");
  }
}
