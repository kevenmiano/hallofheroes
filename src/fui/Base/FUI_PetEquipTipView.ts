// TODO FIX
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_PetEquipCell from "./FUI_PetEquipCell";
import FUI_PetEquipAttriItem from "./FUI_PetEquipAttriItem";
import FUI_Btn_Oth_3 from "./FUI_Btn_Oth_3";

export default class FUI_PetEquipTipView extends fgui.GComponent {
  public cEquiped: fgui.Controller;
  public cShowSuit: fgui.Controller;
  public cShowSkillIcon: fgui.Controller;
  public bg: fgui.GLoader;
  public item: FUI_PetEquipCell;
  public txt_name: fgui.GTextField;
  public txt_part_val: fgui.GTextField;
  public txt_maxlv: fgui.GTextField;
  public txt_master_attr: fgui.GTextField;
  public txt_master_attr_val: fgui.GTextField;
  public subBox1: fgui.GGroup;
  public attr1: FUI_PetEquipAttriItem;
  public attr2: FUI_PetEquipAttriItem;
  public attr3: FUI_PetEquipAttriItem;
  public attr4: FUI_PetEquipAttriItem;
  public txt_sonattr_up_tip: fgui.GTextField;
  public group2: fgui.GGroup;
  public txt_suit_name: fgui.GTextField;
  public comp_skillItem: fgui.GButton;
  public comb_skillIcon: fgui.GGroup;
  public txt_suit_active_cond: fgui.GTextField;
  public txt_suit_desc: fgui.GRichTextField;
  public txt_suit_active_cond2: fgui.GTextField;
  public txt_suit_active_cond_val: fgui.GTextField;
  public gSuitActiveCond: fgui.GGroup;
  public phSuit: fgui.GGraph;
  public txt_gradeCount: fgui.GRichTextField;
  public txt_contrast: fgui.GRichTextField;
  public img_arrow: fgui.GImage;
  public gGradeCount: fgui.GGroup;
  public group3: fgui.GGroup;
  public btn_stren: FUI_Btn_Oth_3;
  public btn_putoff: FUI_Btn_Oth_3;
  public btn_equip: FUI_Btn_Oth_3;
  public btn_replace: FUI_Btn_Oth_3;
  public btn_succinct: FUI_Btn_Oth_3;
  public btn_resolve: FUI_Btn_Oth_3;
  public optBox2: fgui.GGroup;
  public optBox: fgui.GGroup;
  public group1: fgui.GGroup;
  public totalBox: fgui.GGroup;
  public img_equiped: fgui.GImage;
  public static URL: string = "ui://og5jeos3jvvtih4";

  public static createInstance(): FUI_PetEquipTipView {
    return <FUI_PetEquipTipView>(
      fgui.UIPackage.createObject("Base", "PetEquipTipView")
    );
  }

  protected onConstruct(): void {
    this.cEquiped = this.getController("cEquiped");
    this.cShowSuit = this.getController("cShowSuit");
    this.cShowSkillIcon = this.getController("cShowSkillIcon");
    this.bg = <fgui.GLoader>this.getChild("bg");
    this.item = <FUI_PetEquipCell>this.getChild("item");
    this.txt_name = <fgui.GTextField>this.getChild("txt_name");
    this.txt_part_val = <fgui.GTextField>this.getChild("txt_part_val");
    this.txt_maxlv = <fgui.GTextField>this.getChild("txt_maxlv");
    this.txt_master_attr = <fgui.GTextField>this.getChild("txt_master_attr");
    this.txt_master_attr_val = <fgui.GTextField>(
      this.getChild("txt_master_attr_val")
    );
    this.subBox1 = <fgui.GGroup>this.getChild("subBox1");
    this.attr1 = <FUI_PetEquipAttriItem>this.getChild("attr1");
    this.attr2 = <FUI_PetEquipAttriItem>this.getChild("attr2");
    this.attr3 = <FUI_PetEquipAttriItem>this.getChild("attr3");
    this.attr4 = <FUI_PetEquipAttriItem>this.getChild("attr4");
    this.txt_sonattr_up_tip = <fgui.GTextField>(
      this.getChild("txt_sonattr_up_tip")
    );
    this.group2 = <fgui.GGroup>this.getChild("group2");
    this.txt_suit_name = <fgui.GTextField>this.getChild("txt_suit_name");
    this.comp_skillItem = <fgui.GButton>this.getChild("comp_skillItem");
    this.comb_skillIcon = <fgui.GGroup>this.getChild("comb_skillIcon");
    this.txt_suit_active_cond = <fgui.GTextField>(
      this.getChild("txt_suit_active_cond")
    );
    this.txt_suit_desc = <fgui.GRichTextField>this.getChild("txt_suit_desc");
    this.txt_suit_active_cond2 = <fgui.GTextField>(
      this.getChild("txt_suit_active_cond2")
    );
    this.txt_suit_active_cond_val = <fgui.GTextField>(
      this.getChild("txt_suit_active_cond_val")
    );
    this.gSuitActiveCond = <fgui.GGroup>this.getChild("gSuitActiveCond");
    this.phSuit = <fgui.GGraph>this.getChild("phSuit");
    this.txt_gradeCount = <fgui.GRichTextField>this.getChild("txt_gradeCount");
    this.txt_contrast = <fgui.GRichTextField>this.getChild("txt_contrast");
    this.img_arrow = <fgui.GImage>this.getChild("img_arrow");
    this.gGradeCount = <fgui.GGroup>this.getChild("gGradeCount");
    this.group3 = <fgui.GGroup>this.getChild("group3");
    this.btn_stren = <FUI_Btn_Oth_3>this.getChild("btn_stren");
    this.btn_putoff = <FUI_Btn_Oth_3>this.getChild("btn_putoff");
    this.btn_equip = <FUI_Btn_Oth_3>this.getChild("btn_equip");
    this.btn_replace = <FUI_Btn_Oth_3>this.getChild("btn_replace");
    this.btn_succinct = <FUI_Btn_Oth_3>this.getChild("btn_succinct");
    this.btn_resolve = <FUI_Btn_Oth_3>this.getChild("btn_resolve");
    this.optBox2 = <fgui.GGroup>this.getChild("optBox2");
    this.optBox = <fgui.GGroup>this.getChild("optBox");
    this.group1 = <fgui.GGroup>this.getChild("group1");
    this.totalBox = <fgui.GGroup>this.getChild("totalBox");
    this.img_equiped = <fgui.GImage>this.getChild("img_equiped");
  }
}
