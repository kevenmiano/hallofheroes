/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_PetChallengeAdjustPetItem extends fgui.GButton {
  public _petIcon: fgui.GLoader;
  public nameLab: fgui.GTextField;
  public powerLab: fgui.GRichTextField;
  public resetBtn: fgui.GButton;
  public fightBtn: fgui.GButton;
  public colorFlag: fgui.GLoader;
  public selectedFlag: fgui.GImage;
  public static URL: string = "ui://qwu5t408h4lg2p";

  public static createInstance(): FUI_PetChallengeAdjustPetItem {
    return <FUI_PetChallengeAdjustPetItem>(
      fgui.UIPackage.createObject("PetChallenge", "PetChallengeAdjustPetItem")
    );
  }

  protected onConstruct(): void {
    this._petIcon = <fgui.GLoader>this.getChild("_petIcon");
    this.nameLab = <fgui.GTextField>this.getChild("nameLab");
    this.powerLab = <fgui.GRichTextField>this.getChild("powerLab");
    this.resetBtn = <fgui.GButton>this.getChild("resetBtn");
    this.fightBtn = <fgui.GButton>this.getChild("fightBtn");
    this.colorFlag = <fgui.GLoader>this.getChild("colorFlag");
    this.selectedFlag = <fgui.GImage>this.getChild("selectedFlag");
  }
}
