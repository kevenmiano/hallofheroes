/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_OuterCityWarEnterWarSettingItem extends fgui.GComponent {
  public cType: fgui.Controller;
  public cState: fgui.Controller;
  public cJob: fgui.Controller;
  public imgBg: fgui.GImage;
  public txtNickName: fgui.GTextField;
  public txtGrade: fgui.GTextField;
  public txtCapaity: fgui.GTextField;
  public txtPetCapaity: fgui.GTextField;
  public txtDefenceCastle: fgui.GTextField;
  public imgTick: fgui.GImage;
  public btnTick: fgui.GButton;
  public imgHeroFlag: fgui.GImage;
  public imgPetFlag: fgui.GImage;
  public imgJob1: fgui.GImage;
  public imgJob2: fgui.GImage;
  public imgJob3: fgui.GImage;
  public static URL: string = "ui://flign0g5rch117";

  public static createInstance(): FUI_OuterCityWarEnterWarSettingItem {
    return <FUI_OuterCityWarEnterWarSettingItem>(
      fgui.UIPackage.createObject(
        "OuterCityWar",
        "OuterCityWarEnterWarSettingItem"
      )
    );
  }

  protected onConstruct(): void {
    this.cType = this.getController("cType");
    this.cState = this.getController("cState");
    this.cJob = this.getController("cJob");
    this.imgBg = <fgui.GImage>this.getChild("imgBg");
    this.txtNickName = <fgui.GTextField>this.getChild("txtNickName");
    this.txtGrade = <fgui.GTextField>this.getChild("txtGrade");
    this.txtCapaity = <fgui.GTextField>this.getChild("txtCapaity");
    this.txtPetCapaity = <fgui.GTextField>this.getChild("txtPetCapaity");
    this.txtDefenceCastle = <fgui.GTextField>this.getChild("txtDefenceCastle");
    this.imgTick = <fgui.GImage>this.getChild("imgTick");
    this.btnTick = <fgui.GButton>this.getChild("btnTick");
    this.imgHeroFlag = <fgui.GImage>this.getChild("imgHeroFlag");
    this.imgPetFlag = <fgui.GImage>this.getChild("imgPetFlag");
    this.imgJob1 = <fgui.GImage>this.getChild("imgJob1");
    this.imgJob2 = <fgui.GImage>this.getChild("imgJob2");
    this.imgJob3 = <fgui.GImage>this.getChild("imgJob3");
  }
}
