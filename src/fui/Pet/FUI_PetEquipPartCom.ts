/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

//@ts-expect-error: External dependencies
import FUI_AddAttriTip from "./FUI_AddAttriTip";

export default class FUI_PetEquipPartCom extends fgui.GComponent {
  public img_select: fgui.GImage;
  public part0: fgui.GButton;
  public part1: fgui.GButton;
  public part2: fgui.GButton;
  public part3: fgui.GButton;
  public part4: fgui.GButton;
  public part5: fgui.GButton;
  public btn_suit_attri: fgui.GButton;
  public btn_suit1: fgui.GButton;
  public btn_suit2: fgui.GButton;
  public btn_suit3: fgui.GButton;
  public suit_tip: fgui.GComponent;
  public add_attri_tip: FUI_AddAttriTip;
  public static URL: string = "ui://t0l2fizvejpcigp";

  public static createInstance(): FUI_PetEquipPartCom {
    return <FUI_PetEquipPartCom>(
      fgui.UIPackage.createObject("Pet", "PetEquipPartCom")
    );
  }

  protected onConstruct(): void {
    this.img_select = <fgui.GImage>this.getChild("img_select");
    this.part0 = <fgui.GButton>this.getChild("part0");
    this.part1 = <fgui.GButton>this.getChild("part1");
    this.part2 = <fgui.GButton>this.getChild("part2");
    this.part3 = <fgui.GButton>this.getChild("part3");
    this.part4 = <fgui.GButton>this.getChild("part4");
    this.part5 = <fgui.GButton>this.getChild("part5");
    this.btn_suit_attri = <fgui.GButton>this.getChild("btn_suit_attri");
    this.btn_suit1 = <fgui.GButton>this.getChild("btn_suit1");
    this.btn_suit2 = <fgui.GButton>this.getChild("btn_suit2");
    this.btn_suit3 = <fgui.GButton>this.getChild("btn_suit3");
    this.suit_tip = <fgui.GComponent>this.getChild("suit_tip");
    this.add_attri_tip = <FUI_AddAttriTip>this.getChild("add_attri_tip");
  }
}
