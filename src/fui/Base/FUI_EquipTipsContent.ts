// TODO FIX
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_BaseItem from "./FUI_BaseItem";
import FUI_Btn_1r from "./FUI_Btn_1r";
import FUI_EquipTipsAttribute from "./FUI_EquipTipsAttribute";

export default class FUI_EquipTipsContent extends fgui.GComponent {
  public item: FUI_BaseItem;
  public txt_name: fgui.GTextField;
  public txt_fashionLevel: fgui.GTextField;
  public txt_vocation: fgui.GTextField;
  public txt_type: fgui.GTextField;
  public txt_grade: fgui.GTextField;
  public txt_bind: fgui.GTextField;
  public btn_obtain: FUI_Btn_1r;
  public subBox1: fgui.GGroup;
  public attributeInfo: FUI_EquipTipsAttribute;
  public totalBox: fgui.GGroup;
  public static URL: string = "ui://og5jeos3e0t0i40";

  public static createInstance(): FUI_EquipTipsContent {
    return <FUI_EquipTipsContent>(
      fgui.UIPackage.createObject("Base", "EquipTipsContent")
    );
  }

  protected onConstruct(): void {
    this.item = <FUI_BaseItem>this.getChild("item");
    this.txt_name = <fgui.GTextField>this.getChild("txt_name");
    this.txt_fashionLevel = <fgui.GTextField>this.getChild("txt_fashionLevel");
    this.txt_vocation = <fgui.GTextField>this.getChild("txt_vocation");
    this.txt_type = <fgui.GTextField>this.getChild("txt_type");
    this.txt_grade = <fgui.GTextField>this.getChild("txt_grade");
    this.txt_bind = <fgui.GTextField>this.getChild("txt_bind");
    this.btn_obtain = <FUI_Btn_1r>this.getChild("btn_obtain");
    this.subBox1 = <fgui.GGroup>this.getChild("subBox1");
    this.attributeInfo = <FUI_EquipTipsAttribute>this.getChild("attributeInfo");
    this.totalBox = <fgui.GGroup>this.getChild("totalBox");
  }
}
