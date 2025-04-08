/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_PetSkillItem extends fgui.GButton {
  public cSuperSkill: fgui.Controller;
  public cEquiped: fgui.Controller;
  public cPassive: fgui.Controller;
  public cShowSelect: fgui.Controller;
  public defaultSkillBoxIcon: fgui.GImage;
  public imgEquiped: fgui.GImage;
  public S: fgui.GImage;
  public passiveSkillBoxIcon: fgui.GImage;
  public gPassive: fgui.GGroup;
  public imgSelect: fgui.GImage;
  public imgLock: fgui.GImage;
  public static URL: string = "ui://4x3i47txgwinirc";

  public static createInstance(): FUI_PetSkillItem {
    return <FUI_PetSkillItem>(
      fgui.UIPackage.createObject("BaseCommon", "PetSkillItem")
    );
  }

  protected onConstruct(): void {
    this.cSuperSkill = this.getController("cSuperSkill");
    this.cEquiped = this.getController("cEquiped");
    this.cPassive = this.getController("cPassive");
    this.cShowSelect = this.getController("cShowSelect");
    this.defaultSkillBoxIcon = <fgui.GImage>(
      this.getChild("defaultSkillBoxIcon")
    );
    this.imgEquiped = <fgui.GImage>this.getChild("imgEquiped");
    this.S = <fgui.GImage>this.getChild("S");
    this.passiveSkillBoxIcon = <fgui.GImage>(
      this.getChild("passiveSkillBoxIcon")
    );
    this.gPassive = <fgui.GGroup>this.getChild("gPassive");
    this.imgSelect = <fgui.GImage>this.getChild("imgSelect");
    this.imgLock = <fgui.GImage>this.getChild("imgLock");
  }
}
