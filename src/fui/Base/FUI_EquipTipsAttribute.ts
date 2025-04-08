/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_GoodAttributeItem from "./FUI_GoodAttributeItem";
import FUI_InlayItem from "./FUI_InlayItem";

export default class FUI_EquipTipsAttribute extends fgui.GComponent {
  public txt_intensify: fgui.GRichTextField;
  public power: FUI_GoodAttributeItem;
  public agility: FUI_GoodAttributeItem;
  public ability: FUI_GoodAttributeItem;
  public physique: FUI_GoodAttributeItem;
  public captain: FUI_GoodAttributeItem;
  public attack: FUI_GoodAttributeItem;
  public magicAttack: FUI_GoodAttributeItem;
  public defence: FUI_GoodAttributeItem;
  public parry: FUI_GoodAttributeItem;
  public magicDefence: FUI_GoodAttributeItem;
  public live: FUI_GoodAttributeItem;
  public forceHit: FUI_GoodAttributeItem;
  public conat: FUI_GoodAttributeItem;
  public subBox2: fgui.GGroup;
  public inlayItem1: FUI_InlayItem;
  public inlayItem2: FUI_InlayItem;
  public inlayItem3: FUI_InlayItem;
  public inlayItem4: FUI_InlayItem;
  public ph_skill: fgui.GLoader;
  public txt_skill: fgui.GRichTextField;
  public txt_suitTitle: fgui.GRichTextField;
  public txt_suit1: fgui.GTextField;
  public txt_suit2: fgui.GTextField;
  public txt_suit3: fgui.GTextField;
  public txt_suit4: fgui.GTextField;
  public txt_suit5: fgui.GTextField;
  public txt_suit6: fgui.GTextField;
  public txt_suit7: fgui.GTextField;
  public txt_suit8: fgui.GTextField;
  public txt_suitSkill1: fgui.GTextField;
  public txt_suitSkill2: fgui.GTextField;
  public txt_suitSkill3: fgui.GTextField;
  public txt_suitSkill4: fgui.GTextField;
  public txt_suitSkill5: fgui.GTextField;
  public txt_suitSkill6: fgui.GTextField;
  public txt_suitSkill7: fgui.GTextField;
  public txt_suitSkill8: fgui.GTextField;
  public txt_describe: fgui.GTextField;
  public subBox3: fgui.GGroup;
  public totalGroup: fgui.GGroup;
  public static URL: string = "ui://og5jeos3fd0riff";

  public static createInstance(): FUI_EquipTipsAttribute {
    return <FUI_EquipTipsAttribute>(
      fgui.UIPackage.createObject("Base", "EquipTipsAttribute")
    );
  }

  protected onConstruct(): void {
    this.txt_intensify = <fgui.GRichTextField>this.getChild("txt_intensify");
    this.power = <FUI_GoodAttributeItem>this.getChild("power");
    this.agility = <FUI_GoodAttributeItem>this.getChild("agility");
    this.ability = <FUI_GoodAttributeItem>this.getChild("ability");
    this.physique = <FUI_GoodAttributeItem>this.getChild("physique");
    this.captain = <FUI_GoodAttributeItem>this.getChild("captain");
    this.attack = <FUI_GoodAttributeItem>this.getChild("attack");
    this.magicAttack = <FUI_GoodAttributeItem>this.getChild("magicAttack");
    this.defence = <FUI_GoodAttributeItem>this.getChild("defence");
    this.parry = <FUI_GoodAttributeItem>this.getChild("parry");
    this.magicDefence = <FUI_GoodAttributeItem>this.getChild("magicDefence");
    this.live = <FUI_GoodAttributeItem>this.getChild("live");
    this.forceHit = <FUI_GoodAttributeItem>this.getChild("forceHit");
    this.conat = <FUI_GoodAttributeItem>this.getChild("conat");
    this.subBox2 = <fgui.GGroup>this.getChild("subBox2");
    this.inlayItem1 = <FUI_InlayItem>this.getChild("inlayItem1");
    this.inlayItem2 = <FUI_InlayItem>this.getChild("inlayItem2");
    this.inlayItem3 = <FUI_InlayItem>this.getChild("inlayItem3");
    this.inlayItem4 = <FUI_InlayItem>this.getChild("inlayItem4");
    this.ph_skill = <fgui.GLoader>this.getChild("ph_skill");
    this.txt_skill = <fgui.GRichTextField>this.getChild("txt_skill");
    this.txt_suitTitle = <fgui.GRichTextField>this.getChild("txt_suitTitle");
    this.txt_suit1 = <fgui.GTextField>this.getChild("txt_suit1");
    this.txt_suit2 = <fgui.GTextField>this.getChild("txt_suit2");
    this.txt_suit3 = <fgui.GTextField>this.getChild("txt_suit3");
    this.txt_suit4 = <fgui.GTextField>this.getChild("txt_suit4");
    this.txt_suit5 = <fgui.GTextField>this.getChild("txt_suit5");
    this.txt_suit6 = <fgui.GTextField>this.getChild("txt_suit6");
    this.txt_suit7 = <fgui.GTextField>this.getChild("txt_suit7");
    this.txt_suit8 = <fgui.GTextField>this.getChild("txt_suit8");
    this.txt_suitSkill1 = <fgui.GTextField>this.getChild("txt_suitSkill1");
    this.txt_suitSkill2 = <fgui.GTextField>this.getChild("txt_suitSkill2");
    this.txt_suitSkill3 = <fgui.GTextField>this.getChild("txt_suitSkill3");
    this.txt_suitSkill4 = <fgui.GTextField>this.getChild("txt_suitSkill4");
    this.txt_suitSkill5 = <fgui.GTextField>this.getChild("txt_suitSkill5");
    this.txt_suitSkill6 = <fgui.GTextField>this.getChild("txt_suitSkill6");
    this.txt_suitSkill7 = <fgui.GTextField>this.getChild("txt_suitSkill7");
    this.txt_suitSkill8 = <fgui.GTextField>this.getChild("txt_suitSkill8");
    this.txt_describe = <fgui.GTextField>this.getChild("txt_describe");
    this.subBox3 = <fgui.GGroup>this.getChild("subBox3");
    this.totalGroup = <fgui.GGroup>this.getChild("totalGroup");
  }
}
