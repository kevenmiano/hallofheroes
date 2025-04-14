/*
 * @Author: jeremy.xu
 * @Date: 2021-05-31 11:08:44
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2022-05-24 17:04:36
 * @Description: 称号总属性提示
 */

import LangManager from "../../core/lang/LangManager";
import Utils from "../../core/utils/Utils";
import { AppellPowerInfo } from "../module/appell/AppellModel";
import BaseTips from "./BaseTips";

export class AppellPowerTip extends BaseTips {
  public tipData: AppellPowerInfo;
  public subBox2: fgui.GGroup;
  public totalBox: fgui.GGroup;

  public OnInitWind(): void {
    super.OnInitWind();
    this.initView();
    this.subBox2.ensureBoundsCorrect();
    this.totalBox.ensureBoundsCorrect();
    this.contentPane.ensureBoundsCorrect();
  }

  protected OnClickModal() {
    super.OnClickModal();

    this.hide();
  }

  private initView() {
    this.tipData = this.params[0];
    this.clear();
    this["txt_name"].text = LangManager.Instance.GetTranslation(
      "AppellPowerTip.title",
    );
    let hasProps: boolean = false;
    if (this.tipData.Power > 0) {
      this["attr01"].visible = true;
      this["attr01"].getChild("txtValue").asLabel.text =
        "+" + this.tipData.Power;
      this["attr01"].getChild("txtName").asLabel.text = this.tipData.PowerName;
      hasProps = true;
    }
    if (this.tipData.Agility > 0) {
      this["attr02"].visible = true;
      this["attr02"].getChild("txtValue").asLabel.text =
        "+" + this.tipData.Agility;
      this["attr02"].getChild("txtName").asLabel.text =
        this.tipData.AgilityName;
      hasProps = true;
    }
    if (this.tipData.Intellect > 0) {
      this["attr03"].visible = true;
      this["attr03"].getChild("txtValue").asLabel.text =
        "+" + this.tipData.Intellect;
      this["attr03"].getChild("txtName").asLabel.text =
        this.tipData.IntellectName;
      hasProps = true;
    }
    if (this.tipData.Physique > 0) {
      this["attr04"].visible = true;
      this["attr04"].getChild("txtValue").asLabel.text =
        "+" + this.tipData.Physique;
      this["attr04"].getChild("txtName").asLabel.text =
        this.tipData.PhysiqueName;
      hasProps = true;
    }
    if (this.tipData.Captain > 0) {
      this["attr05"].visible = true;
      this["attr05"].getChild("txtValue").asLabel.text =
        "+" + this.tipData.Captain;
      this["attr05"].getChild("txtName").asLabel.text =
        this.tipData.CaptainName;
      hasProps = true;
    }
    if (this.tipData.Attack > 0) {
      this["attr06"].visible = true;
      this["attr06"].getChild("txtValue").asLabel.text =
        "+" + this.tipData.Attack;
      this["attr06"].getChild("txtName").asLabel.text = this.tipData.AttackName;
      hasProps = true;
    }
    if (this.tipData.Defence > 0) {
      this["attr07"].visible = true;
      this["attr07"].getChild("txtValue").asLabel.text =
        "+" + this.tipData.Defence;
      this["attr07"].getChild("txtName").asLabel.text =
        this.tipData.DefenceName;
      hasProps = true;
    }
    if (this.tipData.MagicAttack > 0) {
      this["attr08"].visible = true;
      this["attr08"].getChild("txtValue").asLabel.text =
        "+" + this.tipData.MagicAttack;
      this["attr08"].getChild("txtName").asLabel.text =
        this.tipData.MagicAttackName;
      hasProps = true;
    }
    if (this.tipData.MagicDefence > 0) {
      this["attr09"].visible = true;
      this["attr09"].getChild("txtValue").asLabel.text =
        "+" + this.tipData.MagicDefence;
      this["attr09"].getChild("txtName").asLabel.text =
        this.tipData.MagicDefenceName;
      hasProps = true;
    }
    if (this.tipData.ForceHit > 0) {
      this["attr10"].visible = true;
      this["attr10"].getChild("txtValue").asLabel.text =
        "+" + this.tipData.ForceHit;
      this["attr10"].getChild("txtName").asLabel.text =
        this.tipData.ForceHitName;
      hasProps = true;
    }
    if (this.tipData.Penetrate > 0) {
      this["attr11"].visible = true;
      this["attr11"].getChild("txtValue").asLabel.text =
        "+" + this.tipData.Penetrate;
      this["attr11"].getChild("txtName").asLabel.text =
        this.tipData.PenetrateName;
      hasProps = true;
    }
    if (this.tipData.Parry > 0) {
      this["attr12"].visible = true;
      this["attr12"].getChild("txtValue").asLabel.text =
        "+" + this.tipData.Parry;
      this["attr12"].getChild("txtName").asLabel.text = this.tipData.ParryName;
      hasProps = true;
    }
    if (this.tipData.Live > 0) {
      this["attr13"].visible = true;
      this["attr13"].getChild("txtValue").asLabel.text =
        "+" + this.tipData.Live;
      this["attr13"].getChild("txtName").asLabel.text = this.tipData.LiveName;
      hasProps = true;
    }
    if (this.tipData.Conat > 0) {
      this["attr14"].visible = true;
      this["attr14"].getChild("txtValue").asLabel.text =
        "+" + this.tipData.Conat;
      this["attr14"].getChild("txtName").asLabel.text = this.tipData.ConatName;
      hasProps = true;
    }
    if (!hasProps) {
      this["txt_name"].text += LangManager.Instance.GetTranslation(
        "AppellPowerTip.noneProps",
      );
    }
  }

  public clear() {
    let txt_name = this["txt_name"];
    if (txt_name) {
      txt_name.text = "";
    }
    for (let index = 1; index <= AppellPowerInfo.ATTR_NUM; index++) {
      const element = this["attr" + Utils.numFormat(index, 2)];
      if (element) {
        element.visible = false;
        element.getChild("txtName").asLabel.text = "";
        element.getChild("txtValue").asLabel.text = "";
      }
    }
  }
}
