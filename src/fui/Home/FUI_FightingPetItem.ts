/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_FightingPetItem extends fgui.GComponent {
  public bg: fgui.GImage;
  public typeNameTxt: fgui.GTextField;
  public descTxt: fgui.GTextField;
  public gotoBtn: fgui.GButton;
  public static URL: string = "ui://tny43dz1ejgnhuo";

  public static createInstance(): FUI_FightingPetItem {
    return <FUI_FightingPetItem>(
      fgui.UIPackage.createObject("Home", "FightingPetItem")
    );
  }

  protected onConstruct(): void {
    this.bg = <fgui.GImage>this.getChild("bg");
    this.typeNameTxt = <fgui.GTextField>this.getChild("typeNameTxt");
    this.descTxt = <fgui.GTextField>this.getChild("descTxt");
    this.gotoBtn = <fgui.GButton>this.getChild("gotoBtn");
  }
}
