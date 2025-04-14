//@ts-expect-error: External dependencies
import FUI_FashionBounsAttributeItem from "../../../../fui/PlayerInfo/FUI_FashionBounsAttributeItem";
import FUI_RolePropertyCom from "../../../../fui/PlayerInfo/FUI_RolePropertyCom";
import LangManager from "../../../core/lang/LangManager";
import UIManager from "../../../core/ui/UIManager";
import { EmWindow } from "../../constant/UIDefine";
import { UpgradeType } from "../../constant/UpgradeType";
import { ThaneInfo } from "../../datas/playerinfo/ThaneInfo";
import { TempleteManager } from "../../manager/TempleteManager";

/**
 * @description 角色属性面板
 * @author yuanzhan.yu
 * @date 2021/3/12 11:39
 * @ver 1.0
 *
 */
export class RolePropertyCom extends FUI_RolePropertyCom {
  // public frame: fgui.GLabel;
  // public list_tab: fgui.GList;
  // public attList: fgui.GList;
  // public txt_point_0: fgui.GTextField;
  // public txt_point_1: fgui.GTextField;
  // public txt_point_2: fgui.GTextField;
  // public txt_point_3: fgui.GTextField;
  // public txt_point_4: fgui.GTextField;
  // public txt_point_5: fgui.GTextField;
  // public txt_point_6: fgui.GTextField;
  // public txt_property_0: fgui.GTextField;
  // public txt_property_1: fgui.GTextField;
  // public txt_property_2: fgui.GTextField;
  // public txt_property_3: fgui.GTextField;
  // public txt_property_4: fgui.GTextField;
  // public txt_property_5: fgui.GTextField;
  // public txt_property_6: fgui.GTextField;
  // public txt_property_7: fgui.GTextField;

  private _data: ThaneInfo;
  private _propertyNameList: string[];
  private _pointNameList_0: string[];
  private _pointNameList_1: string[];
  // c1:fairygui.Controller;
  helpBtn: fairygui.GButton;

  onConstruct() {
    super.onConstruct();
    this.helpBtn = this.frame.getChild("helpBtn").asButton;
    this.helpBtn.onClick(this, this.helpBtnClick);
    this.attList.itemRenderer = Laya.Handler.create(
      this,
      this.fashionBonusRender,
      null,
      false,
    );
    this.initData();
  }

  private initData() {
    let ins = LangManager.Instance;
    this._propertyNameList = [
      ins.GetTranslation("armyII.ThaneAttributeView.Tip06"), //物理攻击
      ins.GetTranslation("armyII.ThaneAttributeView.Tip07"), //物理防御
      ins.GetTranslation("armyII.ThaneAttributeView.Tip08"), //魔法攻击
      ins.GetTranslation("armyII.ThaneAttributeView.Tip09"), //魔法防御
      ins.GetTranslation("armyII.ThaneAttributeView.Tip31"), //暴击值
      ins.GetTranslation("armyII.ThaneAttributeView.Tip32"), //格挡值
      ins.GetTranslation("pet.hp"), //生命值
      ins.GetTranslation("armyII.ThaneAttributeView.Tip12"), //带兵数
    ];

    this._pointNameList_0 = [
      ins.GetTranslation("armyII.ThaneAttributeView.Tip01"), //力量
      ins.GetTranslation("armyII.ThaneAttributeView.Tip02"), //护甲
      ins.GetTranslation("armyII.ThaneAttributeView.Tip03"), //智力
      ins.GetTranslation("armyII.ThaneAttributeView.Tip04"), //体质
      ins.GetTranslation("armyII.ThaneAttributeView.Tip05"), //统帅
      ins.GetTranslation("armyII.ThaneAttributeView.Tip23"), //强度
      ins.GetTranslation("armyII.ThaneAttributeView.Tip24"), //韧性
    ];

    this._pointNameList_1 = [
      ins.GetTranslation("pet.Reducing"), //减抗
      ins.GetTranslation("pet.fireRes"), //火炕
      ins.GetTranslation("pet.waterRes"), //水抗
      ins.GetTranslation("pet.windRes"), //风抗
      ins.GetTranslation("pet.electRes"), //电抗
      ins.GetTranslation("pet.lightRes"), //光抗
      ins.GetTranslation("pet.darkRes"), //暗抗
    ];
  }

  public OnInitWind(params) {
    // this.c1 = this.contentPane.getController('c1');
    let str =
      "[color=#ffc68f]{propertyName=力量}: [/color] [color=#ffecc6]{property=6543218}[/color]";
    // let str1 = "[color=#ffecc6]{propertyName=力量}: [/color] [color=#ffecc6]{property=6543218}[/color]";
    for (let i = 0; i <= 7; i++) {
      const element = this["txt_point_" + i];
      if (element) {
        element.text = str;
      }
      const element1 = this["txt_property_" + i];
      if (element1) {
        element1.text = str;
      }
    }
    this.txt_agility.text =
      this.txt_intellect.text =
      this.txt_physique.text =
      this.txt_power.text =
        str;

    this._data = params;

    this.updateView();
  }

  private curAttListData: string[] = [];
  /**
   * 2.属性栏上方显示时装鉴定获得属性总数: 智力、护甲、力量、体质
   * 3.属性栏下方显示时装吞噬属性加成
   */
  public setFashionProperty(grades: number, msg: any) {
    let langIns = LangManager.Instance;
    this.txt_intellect.text = `[color=#ffc68f][size=20]${langIns.GetTranslation("armyII.ThaneAttributeView.Tip03") + ":  "}[/size][/color][size=20]${msg.intellect}[/size]`;
    this.txt_agility.text = `[color=#ffc68f][size=20]${langIns.GetTranslation("armyII.ThaneAttributeView.Tip02") + ": "}[/size][/color][size=20]${msg.agility}[/size]`;
    this.txt_power.text = `[color=#ffc68f][size=20]${langIns.GetTranslation("armyII.ThaneAttributeView.Tip01") + ": "}[/size][/color][size=20]${msg.power}[/size]`;
    this.txt_physique.text = `[color=#ffc68f][size=20]${langIns.GetTranslation("armyII.ThaneAttributeView.Tip04") + ": "}[/size][/color][size=20]${msg.physique}[/size]`;
    //当前等级数据
    let upgradeTemp = TempleteManager.Instance.getTemplateByTypeAndLevel(
      grades,
      UpgradeType.UPGRADE_FASHION,
    );
    if (upgradeTemp) {
      let skillString = upgradeTemp.TemplateNameLang;
      let skillList =
        TempleteManager.Instance.getSkillTemplateInfoByIds(skillString);
      for (let skill of skillList) {
        this.curAttListData.push(...skill.SkillDescription.split("<br>"));
      }
    }
    this.attList.numItems = this.curAttListData.length;
  }

  private fashionBonusRender(
    index: number,
    item: FUI_FashionBounsAttributeItem,
  ) {
    let attributeData = this.curAttListData[index];
    item.getChild("attLab").asTextField.text = attributeData;
  }

  helpBtnClick() {
    let title = "";
    let content = "";
    title = LangManager.Instance.GetTranslation("public.help");
    content = LangManager.Instance.GetTranslation(
      "role.roleProperty.helpContent",
    );
    UIManager.Instance.ShowWind(EmWindow.Help, {
      title: title,
      content: content,
    });
  }

  changeProperty(index: number) {
    this.c1.selectedIndex = index;
  }

  private updateView() {
    this.txt_point_0
      .setVar("propertyName", `${this._pointNameList_0[0]}`)
      .setVar(
        "property",
        `${this._data.baseProperty.totalPower /*+ model.addStrength*/}`,
      )
      .flushVars();
    this.txt_point_1
      .setVar("propertyName", `${this._pointNameList_0[1]}`)
      .setVar(
        "property",
        `${this._data.baseProperty.totalAgility /*+ model.addAgility*/}`,
      )
      .flushVars();
    this.txt_point_2
      .setVar("propertyName", `${this._pointNameList_0[2]}`)
      .setVar(
        "property",
        `${this._data.baseProperty.totalIntellect /*+ model.addAbility*/}`,
      )
      .flushVars();
    this.txt_point_3
      .setVar("propertyName", `${this._pointNameList_0[3]}`)
      .setVar(
        "property",
        `${this._data.baseProperty.totalPhysique /*+ model.addPhysique*/}`,
      )
      .flushVars();
    this.txt_point_4
      .setVar("propertyName", `${this._pointNameList_0[4]}`)
      .setVar(
        "property",
        `${this._data.baseProperty.totalCaptain /*+ model.addCaptain*/}`,
      )
      .flushVars();
    this.txt_point_5
      .setVar("propertyName", `${this._pointNameList_0[5]}`)
      .setVar("property", `${this._data.attackProrerty.totalIntensity}`)
      .flushVars();
    this.txt_point_6
      .setVar("propertyName", `${this._pointNameList_0[6]}`)
      .setVar("property", `${this._data.attackProrerty.totalTenacity}`)
      .flushVars();

    this.txt_property_0
      .setVar("propertyName", `${this._propertyNameList[0]}`)
      .setVar("property", `${this._data.attackProrerty.totalPhyAttack}`)
      .flushVars();
    this.txt_property_1
      .setVar("propertyName", `${this._propertyNameList[1]}`)
      .setVar("property", `${this._data.attackProrerty.totalPhyDefence}`)
      .flushVars();
    this.txt_property_2
      .setVar("propertyName", `${this._propertyNameList[2]}`)
      .setVar("property", `${this._data.attackProrerty.totalMagicAttack}`)
      .flushVars();
    this.txt_property_3
      .setVar("propertyName", `${this._propertyNameList[3]}`)
      .setVar("property", `${this._data.attackProrerty.totalMagicDefence}`)
      .flushVars();
    this.txt_property_4
      .setVar("propertyName", `${this._propertyNameList[4]}`)
      .setVar("property", `${this._data.attackProrerty.totalForceHit}`)
      .flushVars();
    this.txt_property_5
      .setVar("propertyName", `${this._propertyNameList[5]}`)
      .setVar("property", `${this._data.attackProrerty.totalParry}`)
      .flushVars();
    this.txt_property_6
      .setVar("propertyName", `${this._propertyNameList[6]}`)
      .setVar("property", `${this._data.attackProrerty.totalLive}`)
      .flushVars();
    this.txt_property_7
      .setVar("propertyName", `${this._propertyNameList[7]}`)
      .setVar("property", `${this._data.attackProrerty.totalConatArmy}`)
      .flushVars();
  }
}
