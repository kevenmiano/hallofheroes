// TODO FIX
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_BattleSkillItemCircle from "./FUI_BattleSkillItemCircle";

export default class FUI_PetSkillItemListView extends fgui.GComponent {
  public itemSkill_1: FUI_BattleSkillItemCircle;
  public itemSkill_2: FUI_BattleSkillItemCircle;
  public itemSkill_3: FUI_BattleSkillItemCircle;
  public itemSkill_4: FUI_BattleSkillItemCircle;
  public itemSkill_5: FUI_BattleSkillItemCircle;
  public itemSkill_6: FUI_BattleSkillItemCircle;
  public itemSkill_7: FUI_BattleSkillItemCircle;
  public itemSkill_8: FUI_BattleSkillItemCircle;
  public itemSkill_9: FUI_BattleSkillItemCircle;
  public itemSkill_10: FUI_BattleSkillItemCircle;
  public static URL: string = "ui://tybyzkwzth2ric0";

  public static createInstance(): FUI_PetSkillItemListView {
    return <FUI_PetSkillItemListView>(
      fgui.UIPackage.createObject("Battle", "PetSkillItemListView")
    );
  }

  protected onConstruct(): void {
    this.itemSkill_1 = <FUI_BattleSkillItemCircle>this.getChild("itemSkill_1");
    this.itemSkill_2 = <FUI_BattleSkillItemCircle>this.getChild("itemSkill_2");
    this.itemSkill_3 = <FUI_BattleSkillItemCircle>this.getChild("itemSkill_3");
    this.itemSkill_4 = <FUI_BattleSkillItemCircle>this.getChild("itemSkill_4");
    this.itemSkill_5 = <FUI_BattleSkillItemCircle>this.getChild("itemSkill_5");
    this.itemSkill_6 = <FUI_BattleSkillItemCircle>this.getChild("itemSkill_6");
    this.itemSkill_7 = <FUI_BattleSkillItemCircle>this.getChild("itemSkill_7");
    this.itemSkill_8 = <FUI_BattleSkillItemCircle>this.getChild("itemSkill_8");
    this.itemSkill_9 = <FUI_BattleSkillItemCircle>this.getChild("itemSkill_9");
    this.itemSkill_10 = <FUI_BattleSkillItemCircle>(
      this.getChild("itemSkill_10")
    );
  }
}
