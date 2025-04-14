/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_EquipHoldItem from "./FUI_EquipHoldItem";

export default class FUI_EquipRuneList extends fgui.GComponent {
  public RadioGroup: fgui.Controller;
  public rr0: FUI_EquipHoldItem;
  public rr1: FUI_EquipHoldItem;
  public rr2: FUI_EquipHoldItem;
  public rr3: FUI_EquipHoldItem;
  public rr4: FUI_EquipHoldItem;
  public static URL: string = "ui://v98hah2olin8ipn";

  public static createInstance(): FUI_EquipRuneList {
    return <FUI_EquipRuneList>(
      fgui.UIPackage.createObject("Skill", "EquipRuneList")
    );
  }

  protected onConstruct(): void {
    this.RadioGroup = this.getController("RadioGroup");
    this.rr0 = <FUI_EquipHoldItem>this.getChild("rr0");
    this.rr1 = <FUI_EquipHoldItem>this.getChild("rr1");
    this.rr2 = <FUI_EquipHoldItem>this.getChild("rr2");
    this.rr3 = <FUI_EquipHoldItem>this.getChild("rr3");
    this.rr4 = <FUI_EquipHoldItem>this.getChild("rr4");
  }
}
