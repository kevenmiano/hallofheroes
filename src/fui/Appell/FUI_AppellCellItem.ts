/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_AppellPreviewBtn from "./FUI_AppellPreviewBtn";
import FUI_AppellProItem from "./FUI_AppellProItem";

export default class FUI_AppellCellItem extends fgui.GButton {
  public showDetail: fgui.Controller;
  public isEquiped: fgui.Controller;
  public bg: fgui.GImage;
  public Btn_Equipon: fgui.GButton;
  public Btn_Equipoff: fgui.GButton;
  public appellIcon: fgui.GLoader;
  public appellDes: fgui.GTextField;
  public progress: fgui.GTextField;
  public appellTitle: fgui.GTextField;
  public Btn_Preview: FUI_AppellPreviewBtn;
  public main: fgui.GGroup;
  public appellDetailLeft: FUI_AppellProItem;
  public appellDetailRight: FUI_AppellProItem;
  public detailGroup: fgui.GGroup;
  public subGroup: fgui.GGroup;
  public mainGroup: fgui.GGroup;
  public static URL: string = "ui://hr3infdvqsyf2";

  public static createInstance(): FUI_AppellCellItem {
    return <FUI_AppellCellItem>(
      fgui.UIPackage.createObject("Appell", "AppellCellItem")
    );
  }

  protected onConstruct(): void {
    this.showDetail = this.getController("showDetail");
    this.isEquiped = this.getController("isEquiped");
    this.bg = <fgui.GImage>this.getChild("bg");
    this.Btn_Equipon = <fgui.GButton>this.getChild("Btn_Equipon");
    this.Btn_Equipoff = <fgui.GButton>this.getChild("Btn_Equipoff");
    this.appellIcon = <fgui.GLoader>this.getChild("appellIcon");
    this.appellDes = <fgui.GTextField>this.getChild("appellDes");
    this.progress = <fgui.GTextField>this.getChild("progress");
    this.appellTitle = <fgui.GTextField>this.getChild("appellTitle");
    this.Btn_Preview = <FUI_AppellPreviewBtn>this.getChild("Btn_Preview");
    this.main = <fgui.GGroup>this.getChild("main");
    this.appellDetailLeft = <FUI_AppellProItem>(
      this.getChild("appellDetailLeft")
    );
    this.appellDetailRight = <FUI_AppellProItem>(
      this.getChild("appellDetailRight")
    );
    this.detailGroup = <fgui.GGroup>this.getChild("detailGroup");
    this.subGroup = <fgui.GGroup>this.getChild("subGroup");
    this.mainGroup = <fgui.GGroup>this.getChild("mainGroup");
  }
}
