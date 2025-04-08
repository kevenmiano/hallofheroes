/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_TeamFormationPetFigureItem extends fgui.GComponent {
  public cTitleType: fgui.Controller;
  public imgBg: fgui.GLoader;
  public container: fgui.GComponent;
  public btnBg: fgui.GButton;
  public txtName: fgui.GTextField;
  public txtCapacity: fgui.GTextField;
  public imgFlag: fgui.GImage;
  public txtDesc: fgui.GTextField;
  public typeIcon: fgui.GLoader;
  public txtName2: fgui.GTextField;
  public static URL: string = "ui://4x3i47txysufm";

  public static createInstance(): FUI_TeamFormationPetFigureItem {
    return <FUI_TeamFormationPetFigureItem>(
      fgui.UIPackage.createObject("BaseCommon", "TeamFormationPetFigureItem")
    );
  }

  protected onConstruct(): void {
    this.cTitleType = this.getController("cTitleType");
    this.imgBg = <fgui.GLoader>this.getChild("imgBg");
    this.container = <fgui.GComponent>this.getChild("container");
    this.btnBg = <fgui.GButton>this.getChild("btnBg");
    this.txtName = <fgui.GTextField>this.getChild("txtName");
    this.txtCapacity = <fgui.GTextField>this.getChild("txtCapacity");
    this.imgFlag = <fgui.GImage>this.getChild("imgFlag");
    this.txtDesc = <fgui.GTextField>this.getChild("txtDesc");
    this.typeIcon = <fgui.GLoader>this.getChild("typeIcon");
    this.txtName2 = <fgui.GTextField>this.getChild("txtName2");
  }
}
