/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_RuneHoldEffectLock from "./FUI_RuneHoldEffectLock";
import FUI_RuneHoldValueLock from "./FUI_RuneHoldValueLock";
import FUI_RuneHoldRuneItem from "./FUI_RuneHoldRuneItem";

export default class FUI_RuneHoldListItem extends fgui.GButton {
  public mbg: fgui.GImage;
  public holdName: fgui.GTextField;
  public openTips: fgui.GTextField;
  public selectedImg: fgui.GImage;
  public lingImg: fgui.GImage;
  public effectLock: FUI_RuneHoldEffectLock;
  public valueLock: FUI_RuneHoldValueLock;
  public rr0: FUI_RuneHoldRuneItem;
  public rr1: FUI_RuneHoldRuneItem;
  public rr2: FUI_RuneHoldRuneItem;
  public rr3: FUI_RuneHoldRuneItem;
  public rr4: FUI_RuneHoldRuneItem;
  public runeItemGroup: fgui.GGroup;
  public static URL: string = "ui://v98hah2olin8imn";

  public static createInstance(): FUI_RuneHoldListItem {
    return <FUI_RuneHoldListItem>(
      fgui.UIPackage.createObject("Skill", "RuneHoldListItem")
    );
  }

  protected onConstruct(): void {
    this.mbg = <fgui.GImage>this.getChild("mbg");
    this.holdName = <fgui.GTextField>this.getChild("holdName");
    this.openTips = <fgui.GTextField>this.getChild("openTips");
    this.selectedImg = <fgui.GImage>this.getChild("selectedImg");
    this.lingImg = <fgui.GImage>this.getChild("lingImg");
    this.effectLock = <FUI_RuneHoldEffectLock>this.getChild("effectLock");
    this.valueLock = <FUI_RuneHoldValueLock>this.getChild("valueLock");
    this.rr0 = <FUI_RuneHoldRuneItem>this.getChild("rr0");
    this.rr1 = <FUI_RuneHoldRuneItem>this.getChild("rr1");
    this.rr2 = <FUI_RuneHoldRuneItem>this.getChild("rr2");
    this.rr3 = <FUI_RuneHoldRuneItem>this.getChild("rr3");
    this.rr4 = <FUI_RuneHoldRuneItem>this.getChild("rr4");
    this.runeItemGroup = <fgui.GGroup>this.getChild("runeItemGroup");
  }
}
