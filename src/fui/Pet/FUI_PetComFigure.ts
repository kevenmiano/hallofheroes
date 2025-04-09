/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_PetEquipPartCom from "./FUI_PetEquipPartCom";

export default class FUI_PetComFigure extends fgui.GComponent {
  public c1: fgui.Controller;
  public imgFlag: fgui.GImage;
  public txtName: fgui.GTextField;
  public txtCapacity: fgui.GTextField;
  public gTitle: fgui.GGroup;
  public euip: FUI_PetEquipPartCom;
  public btnChangeName: fgui.GButton;
  public static URL: string = "ui://t0l2fizvn9ly20";

  public static createInstance(): FUI_PetComFigure {
    return <FUI_PetComFigure>fgui.UIPackage.createObject("Pet", "PetComFigure");
  }

  protected onConstruct(): void {
    this.c1 = this.getController("c1");
    this.imgFlag = <fgui.GImage>this.getChild("imgFlag");
    this.txtName = <fgui.GTextField>this.getChild("txtName");
    this.txtCapacity = <fgui.GTextField>this.getChild("txtCapacity");
    this.gTitle = <fgui.GGroup>this.getChild("gTitle");
    this.euip = <FUI_PetEquipPartCom>this.getChild("euip");
    this.btnChangeName = <fgui.GButton>this.getChild("btnChangeName");
  }
}
