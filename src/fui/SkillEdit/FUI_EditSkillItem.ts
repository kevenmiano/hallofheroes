/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_EditSkillItem extends fgui.GButton {
  public lockImg: fgui.Controller;
  public bg: fgui.GImage;
  public Img_Down: fgui.GImage;
  public iconLoader: fgui.GLoader;
  public imgMask: fgui.GImage;
  public Img_Battle_S: fgui.GImage;
  public txt_posIdx: fgui.GTextField;
  public static URL: string = "ui://tujwwvswjckki4t";

  public static createInstance(): FUI_EditSkillItem {
    return <FUI_EditSkillItem>(
      fgui.UIPackage.createObject("SkillEdit", "EditSkillItem")
    );
  }

  protected onConstruct(): void {
    this.lockImg = this.getController("lockImg");
    this.bg = <fgui.GImage>this.getChild("bg");
    this.Img_Down = <fgui.GImage>this.getChild("Img_Down");
    this.iconLoader = <fgui.GLoader>this.getChild("iconLoader");
    this.imgMask = <fgui.GImage>this.getChild("imgMask");
    this.Img_Battle_S = <fgui.GImage>this.getChild("Img_Battle_S");
    this.txt_posIdx = <fgui.GTextField>this.getChild("txt_posIdx");
  }
}
