/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_EquipTipsContent from "./FUI_EquipTipsContent";
//@ts-expect-error: External dependencies
import FUI_Btn_1r from "./FUI_Btn_1r";

export default class FUI_EquipTipView extends fgui.GComponent {
  public cHideBg: fgui.Controller;
  public cHideOpt: fgui.Controller;
  public bg: fgui.GLoader;
  public equipTipsContent: FUI_EquipTipsContent;
  public txt_time: fgui.GTextField;
  public txt_fashionIdentity: fgui.GRichTextField;
  public img_star: fgui.GImage;
  public group_star: fgui.GGroup;
  public txt_fashionProfile: fgui.GRichTextField;
  public animationCom: fgui.GComponent;
  public dot: fgui.GImage;
  public txt_gradeCount: fgui.GRichTextField;
  public grade_group: fgui.GGroup;
  public txt_price: fgui.GTextField;
  public group_price: fgui.GGroup;
  public btn_use: FUI_Btn_1r;
  public totalBox: fgui.GGroup;
  public img_equiped: fgui.GImage;
  public leftBox: fgui.GGroup;
  public bg1: fgui.GLoader;
  public list: fgui.GList;
  public rightBox: fgui.GGroup;
  public container: fgui.GGroup;
  public static URL: string = "ui://og5jeos3su51i46";

  public static createInstance(): FUI_EquipTipView {
    return <FUI_EquipTipView>(
      fgui.UIPackage.createObject("Base", "EquipTipView")
    );
  }

  protected onConstruct(): void {
    this.cHideBg = this.getController("cHideBg");
    this.cHideOpt = this.getController("cHideOpt");
    this.bg = <fgui.GLoader>this.getChild("bg");
    this.equipTipsContent = <FUI_EquipTipsContent>(
      this.getChild("equipTipsContent")
    );
    this.txt_time = <fgui.GTextField>this.getChild("txt_time");
    this.txt_fashionIdentity = <fgui.GRichTextField>(
      this.getChild("txt_fashionIdentity")
    );
    this.img_star = <fgui.GImage>this.getChild("img_star");
    this.group_star = <fgui.GGroup>this.getChild("group_star");
    this.txt_fashionProfile = <fgui.GRichTextField>(
      this.getChild("txt_fashionProfile")
    );
    this.animationCom = <fgui.GComponent>this.getChild("animationCom");
    this.dot = <fgui.GImage>this.getChild("dot");
    this.txt_gradeCount = <fgui.GRichTextField>this.getChild("txt_gradeCount");
    this.grade_group = <fgui.GGroup>this.getChild("grade_group");
    this.txt_price = <fgui.GTextField>this.getChild("txt_price");
    this.group_price = <fgui.GGroup>this.getChild("group_price");
    this.btn_use = <FUI_Btn_1r>this.getChild("btn_use");
    this.totalBox = <fgui.GGroup>this.getChild("totalBox");
    this.img_equiped = <fgui.GImage>this.getChild("img_equiped");
    this.leftBox = <fgui.GGroup>this.getChild("leftBox");
    this.bg1 = <fgui.GLoader>this.getChild("bg1");
    this.list = <fgui.GList>this.getChild("list");
    this.rightBox = <fgui.GGroup>this.getChild("rightBox");
    this.container = <fgui.GGroup>this.getChild("container");
  }
}
