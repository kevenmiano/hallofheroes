//@ts-expect-error: External dependencies
import FUI_HoldOptionlCom from "../../../../../fui/Skill/FUI_HoldOptionlCom";
import FUI_HolePropertyItem from "../../../../../fui/Skill/FUI_HolePropertyItem";
import LangManager from "../../../../core/lang/LangManager";

import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { RuneHoleInfo } from "../../../datas/RuneHoleInfo";

import { RuneHoleSkill } from "./RuneHoleSkill";

export class HoldOptionCom extends FUI_HoldOptionlCom {
  private propertys: FUI_HolePropertyItem[];
  declare public holdSkill: RuneHoleSkill;
  onConstruct() {
    super.onConstruct();
    this.propertys = [
      this.s1,
      this.s2,
      this.s3,
      this.s4,
      this.s5,
      this.s6,
      this.s7,
    ];
  }

  public updateView(info: RuneHoleInfo) {
    this.openTips.visible = !info.opened;
    if (!info.opened) {
      this.detailGroup.visible = false;
      this.equipTipGroup.visible = false;
      this.moreBg.visible = false;
      this.openTips
        .setVar("level", RuneHoleInfo.RuneHoleOpenLevel[info.holeId - 1])
        .flushVars();
      return;
    }
    let isEquip = this.checkEquipTips(info);
    if (isEquip) {
      this.detailGroup.visible = false;
      this.moreBg.visible = true;
      this.equipTipGroup.visible = true;
      this.openTips.visible = false;
      return;
    }

    //详情
    this.detailGroup.visible = true;
    this.moreBg.visible = true;
    this.equipTipGroup.visible = false;
    this.openTips.visible = false;

    this.updateProperty(info);
    this.updateSkill(info);
  }

  //更新属性和属性加成
  private updateProperty(info: RuneHoleInfo) {
    let theSameProperty = info.getHoldProperty();
    let i = 0;
    let bonus = info.getBonusValue();
    for (let s of this.propertys) {
      s.visible = false;
    }

    for (let p in theSameProperty) {
      this.setPropertyValue(this.propertys[i], p, theSameProperty[p], bonus);
      i++;
    }
  }

  private updateSkill(info: RuneHoleInfo) {
    let curUpgrade = info.getUpgrade();
    let percent = curUpgrade ? curUpgrade.TemplateId : 0;
    this.txt_desc.text = LangManager.Instance.GetTranslation(
      "runeGem.property",
      percent,
    );

    let tipTxt: string = "";
    //属性雕刻状态分为: 未解锁、无、具体百分比
    this.skillLocked.visible = !info.skill;
    if (!info.checkOpenAllRune()) {
      tipTxt = LangManager.Instance.GetTranslation(
        "runeGem.carveAtrri",
        LangManager.Instance.GetTranslation("runeGem.lock"),
      );
      tipTxt +=
        "<br>" +
        LangManager.Instance.GetTranslation(
          "runeGem.carveSkill",
          LangManager.Instance.GetTranslation("runeGem.lock"),
        );
    } else {
      if (percent == 0) {
        tipTxt = LangManager.Instance.GetTranslation(
          "runeGem.carveAtrri",
          LangManager.Instance.GetTranslation("public.notHave"),
        );
      } else {
        tipTxt = LangManager.Instance.GetTranslation(
          "runeGem.property",
          percent,
        );
      }
      if (info.skill == 0) {
        tipTxt +=
          "<br>" +
          LangManager.Instance.GetTranslation(
            "runeGem.carveSkill",
            LangManager.Instance.GetTranslation("public.notHave"),
          );
      }
    }
    this.skillLocked.text = tipTxt;
    //技能雕刻状态分为: 未解锁、无、具体雕刻效果
    this.holdSkill.visible = !!info.skill;
    this.txt_desc.visible = !!info.skill;
    if (!info.skill) return;
    this.holdSkill.setInfo(info);
  }

  private setPropertyValue(
    s: FUI_HolePropertyItem,
    property: string,
    value: number,
    bonus: number,
  ) {
    if (!s) return;
    s.visible = true;
    bonus = (bonus * value) >> 0;
    let bonusValue = bonus ? "+" + bonus : "";
    let addValue = value;
    s.s1.text = property;
    s.v1.text = addValue + "";
    s.a1.text = bonusValue;
  }

  private checkEquipTips(info: RuneHoleInfo) {
    let equipTip = false;
    for (let i = 0; i < 5; i++) {
      let rune = info.getRuneByPos(i);
      if (rune instanceof GoodsInfo) {
        equipTip = false;
        break;
      }

      if (rune == -1) {
        equipTip = true;
      }
    }

    return equipTip;
  }
}
