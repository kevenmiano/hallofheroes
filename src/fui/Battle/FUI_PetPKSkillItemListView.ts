/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_BattleSkillItemCircle from "./FUI_BattleSkillItemCircle";
import FUI_BattleSkillItemRect from "./FUI_BattleSkillItemRect";

export default class FUI_PetPKSkillItemListView extends fgui.GComponent {
  public cTalent: fgui.Controller;
  public petIndexCtr: fgui.Controller;
  public phBottomLeft: fgui.GGraph;
  public itemTalent: FUI_BattleSkillItemCircle;
  public itemRune_1: FUI_BattleSkillItemRect;
  public itemRune_2: FUI_BattleSkillItemRect;
  public itemRune_3: FUI_BattleSkillItemRect;
  public gPropSkills: fgui.GGroup;
  public btnOwnRoleInfoList: fgui.GButton;
  public txtOwnRoleInfoList: fgui.GTextField;
  public wifi: fgui.GComponent;
  public itemSkill1_1: FUI_BattleSkillItemCircle;
  public itemSkill1_2: FUI_BattleSkillItemCircle;
  public itemSkill1_3: FUI_BattleSkillItemCircle;
  public itemSkill1_4: FUI_BattleSkillItemCircle;
  public itemSkill1_5: FUI_BattleSkillItemCircle;
  public itemSkill1_6: FUI_BattleSkillItemCircle;
  public itemSkill2_1: FUI_BattleSkillItemCircle;
  public itemSkill2_2: FUI_BattleSkillItemCircle;
  public itemSkill2_3: FUI_BattleSkillItemCircle;
  public itemSkill2_4: FUI_BattleSkillItemCircle;
  public itemSkill2_5: FUI_BattleSkillItemCircle;
  public itemSkill2_6: FUI_BattleSkillItemCircle;
  public itemSkill3_1: FUI_BattleSkillItemCircle;
  public itemSkill3_2: FUI_BattleSkillItemCircle;
  public itemSkill3_3: FUI_BattleSkillItemCircle;
  public itemSkill3_4: FUI_BattleSkillItemCircle;
  public itemSkill3_5: FUI_BattleSkillItemCircle;
  public itemSkill3_6: FUI_BattleSkillItemCircle;
  public static URL: string = "ui://tybyzkwzhp9vmifi";

  public static createInstance(): FUI_PetPKSkillItemListView {
    return <FUI_PetPKSkillItemListView>(
      fgui.UIPackage.createObject("Battle", "PetPKSkillItemListView")
    );
  }

  protected onConstruct(): void {
    this.cTalent = this.getController("cTalent");
    this.petIndexCtr = this.getController("petIndexCtr");
    this.phBottomLeft = <fgui.GGraph>this.getChild("phBottomLeft");
    this.itemTalent = <FUI_BattleSkillItemCircle>this.getChild("itemTalent");
    this.itemRune_1 = <FUI_BattleSkillItemRect>this.getChild("itemRune_1");
    this.itemRune_2 = <FUI_BattleSkillItemRect>this.getChild("itemRune_2");
    this.itemRune_3 = <FUI_BattleSkillItemRect>this.getChild("itemRune_3");
    this.gPropSkills = <fgui.GGroup>this.getChild("gPropSkills");
    this.btnOwnRoleInfoList = <fgui.GButton>this.getChild("btnOwnRoleInfoList");
    this.txtOwnRoleInfoList = <fgui.GTextField>(
      this.getChild("txtOwnRoleInfoList")
    );
    this.wifi = <fgui.GComponent>this.getChild("wifi");
    this.itemSkill1_1 = <FUI_BattleSkillItemCircle>(
      this.getChild("itemSkill1_1")
    );
    this.itemSkill1_2 = <FUI_BattleSkillItemCircle>(
      this.getChild("itemSkill1_2")
    );
    this.itemSkill1_3 = <FUI_BattleSkillItemCircle>(
      this.getChild("itemSkill1_3")
    );
    this.itemSkill1_4 = <FUI_BattleSkillItemCircle>(
      this.getChild("itemSkill1_4")
    );
    this.itemSkill1_5 = <FUI_BattleSkillItemCircle>(
      this.getChild("itemSkill1_5")
    );
    this.itemSkill1_6 = <FUI_BattleSkillItemCircle>(
      this.getChild("itemSkill1_6")
    );
    this.itemSkill2_1 = <FUI_BattleSkillItemCircle>(
      this.getChild("itemSkill2_1")
    );
    this.itemSkill2_2 = <FUI_BattleSkillItemCircle>(
      this.getChild("itemSkill2_2")
    );
    this.itemSkill2_3 = <FUI_BattleSkillItemCircle>(
      this.getChild("itemSkill2_3")
    );
    this.itemSkill2_4 = <FUI_BattleSkillItemCircle>(
      this.getChild("itemSkill2_4")
    );
    this.itemSkill2_5 = <FUI_BattleSkillItemCircle>(
      this.getChild("itemSkill2_5")
    );
    this.itemSkill2_6 = <FUI_BattleSkillItemCircle>(
      this.getChild("itemSkill2_6")
    );
    this.itemSkill3_1 = <FUI_BattleSkillItemCircle>(
      this.getChild("itemSkill3_1")
    );
    this.itemSkill3_2 = <FUI_BattleSkillItemCircle>(
      this.getChild("itemSkill3_2")
    );
    this.itemSkill3_3 = <FUI_BattleSkillItemCircle>(
      this.getChild("itemSkill3_3")
    );
    this.itemSkill3_4 = <FUI_BattleSkillItemCircle>(
      this.getChild("itemSkill3_4")
    );
    this.itemSkill3_5 = <FUI_BattleSkillItemCircle>(
      this.getChild("itemSkill3_5")
    );
    this.itemSkill3_6 = <FUI_BattleSkillItemCircle>(
      this.getChild("itemSkill3_6")
    );
  }
}
