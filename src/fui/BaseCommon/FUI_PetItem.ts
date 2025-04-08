/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_PetItem extends fgui.GComponent {
  public cSelected: fgui.Controller;
  public cSelectBgType: fgui.Controller;
  public cState: fgui.Controller;
  public cStarNum: fgui.Controller;
  public cPetType: fgui.Controller;
  public isInPK: fgui.Controller;
  public imgSelected1: fgui.GImage;
  public bg: fgui.GImage;
  public item: fgui.GButton;
  public imgStarBg: fgui.GImage;
  public imgLock: fgui.GImage;
  public imgEnterWar: fgui.GImage;
  public txtPractice: fgui.GTextField;
  public imgstar1: fgui.GLoader;
  public imgstar2: fgui.GLoader;
  public imgstar3: fgui.GLoader;
  public imgstar4: fgui.GLoader;
  public imgstar5: fgui.GLoader;
  public gStar: fgui.GGroup;
  public icon_petType: fgui.GLoader;
  public static URL: string = "ui://4x3i47txn9ly1h";

  public static createInstance(): FUI_PetItem {
    return <FUI_PetItem>fgui.UIPackage.createObject("BaseCommon", "PetItem");
  }

  protected onConstruct(): void {
    this.cSelected = this.getController("cSelected");
    this.cSelectBgType = this.getController("cSelectBgType");
    this.cState = this.getController("cState");
    this.cStarNum = this.getController("cStarNum");
    this.cPetType = this.getController("cPetType");
    this.isInPK = this.getController("isInPK");
    this.imgSelected1 = <fgui.GImage>this.getChild("imgSelected1");
    this.bg = <fgui.GImage>this.getChild("bg");
    this.item = <fgui.GButton>this.getChild("item");
    this.imgStarBg = <fgui.GImage>this.getChild("imgStarBg");
    this.imgLock = <fgui.GImage>this.getChild("imgLock");
    this.imgEnterWar = <fgui.GImage>this.getChild("imgEnterWar");
    this.txtPractice = <fgui.GTextField>this.getChild("txtPractice");
    this.imgstar1 = <fgui.GLoader>this.getChild("imgstar1");
    this.imgstar2 = <fgui.GLoader>this.getChild("imgstar2");
    this.imgstar3 = <fgui.GLoader>this.getChild("imgstar3");
    this.imgstar4 = <fgui.GLoader>this.getChild("imgstar4");
    this.imgstar5 = <fgui.GLoader>this.getChild("imgstar5");
    this.gStar = <fgui.GGroup>this.getChild("gStar");
    this.icon_petType = <fgui.GLoader>this.getChild("icon_petType");
  }
}
