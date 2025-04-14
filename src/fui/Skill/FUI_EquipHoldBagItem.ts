/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_RuneHoldRuneItem2 from "./FUI_RuneHoldRuneItem2";

export default class FUI_EquipHoldBagItem extends fgui.GComponent {
  public c1: fgui.Controller;
  public c2: fgui.Controller;
  public mbg: fgui.GImage;
  public mbg0: fgui.GImage;
  public cb: fgui.GImage;
  public lockImg: fgui.GImage;
  public txt_lock: fgui.GTextField;
  public lock_state: fgui.GGroup;
  public runeItem: FUI_RuneHoldRuneItem2;
  public runeName: fgui.GTextField;
  public addDesc: fgui.GTextField;
  public ab: fgui.GImage;
  public haveValue: fgui.GTextField;
  public equipValue: fgui.GTextField;
  public haveFlag: fgui.GGroup;
  public selImg: fgui.GImage;
  public static URL: string = "ui://v98hah2olin8ipl";

  public static createInstance(): FUI_EquipHoldBagItem {
    return <FUI_EquipHoldBagItem>(
      fgui.UIPackage.createObject("Skill", "EquipHoldBagItem")
    );
  }

  protected onConstruct(): void {
    this.c1 = this.getController("c1");
    this.c2 = this.getController("c2");
    this.mbg = <fgui.GImage>this.getChild("mbg");
    this.mbg0 = <fgui.GImage>this.getChild("mbg0");
    this.cb = <fgui.GImage>this.getChild("cb");
    this.lockImg = <fgui.GImage>this.getChild("lockImg");
    this.txt_lock = <fgui.GTextField>this.getChild("txt_lock");
    this.lock_state = <fgui.GGroup>this.getChild("lock_state");
    this.runeItem = <FUI_RuneHoldRuneItem2>this.getChild("runeItem");
    this.runeName = <fgui.GTextField>this.getChild("runeName");
    this.addDesc = <fgui.GTextField>this.getChild("addDesc");
    this.ab = <fgui.GImage>this.getChild("ab");
    this.haveValue = <fgui.GTextField>this.getChild("haveValue");
    this.equipValue = <fgui.GTextField>this.getChild("equipValue");
    this.haveFlag = <fgui.GGroup>this.getChild("haveFlag");
    this.selImg = <fgui.GImage>this.getChild("selImg");
  }
}
