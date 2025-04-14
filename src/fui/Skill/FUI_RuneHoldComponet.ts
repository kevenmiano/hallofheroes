/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_RuneHoldList from "./FUI_RuneHoldList";
import FUI_RuneHoldRune from "./FUI_RuneHoldRune";
import FUI_RuneHoldOption from "./FUI_RuneHoldOption";
import FUI_RuneHoldEffectLock2 from "./FUI_RuneHoldEffectLock2";
import FUI_RuneHoldValueLock2 from "./FUI_RuneHoldValueLock2";

export default class FUI_RuneHoldComponet extends fgui.GComponent {
  public RadioGroup: fgui.Controller;
  public holdListComp: FUI_RuneHoldList;
  public holdRuneComp: FUI_RuneHoldRune;
  public optionComp: FUI_RuneHoldOption;
  public hel: FUI_RuneHoldEffectLock2;
  public hvl: FUI_RuneHoldValueLock2;
  public static URL: string = "ui://v98hah2olin8imm";

  public static createInstance(): FUI_RuneHoldComponet {
    return <FUI_RuneHoldComponet>(
      fgui.UIPackage.createObject("Skill", "RuneHoldComponet")
    );
  }

  protected onConstruct(): void {
    this.RadioGroup = this.getController("RadioGroup");
    this.holdListComp = <FUI_RuneHoldList>this.getChild("holdListComp");
    this.holdRuneComp = <FUI_RuneHoldRune>this.getChild("holdRuneComp");
    this.optionComp = <FUI_RuneHoldOption>this.getChild("optionComp");
    this.hel = <FUI_RuneHoldEffectLock2>this.getChild("hel");
    this.hvl = <FUI_RuneHoldValueLock2>this.getChild("hvl");
  }
}
