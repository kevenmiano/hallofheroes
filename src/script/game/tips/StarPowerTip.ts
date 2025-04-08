/*
 * @Author: jeremy.xu
 * @Date: 2021-05-31 11:08:44
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2021-06-02 10:54:12
 * @Description: 星力提示
 */

import LangManager from "../../core/lang/LangManager";
import { SimpleDictionary } from "../../core/utils/SimpleDictionary";
import StringHelper from "../../core/utils/StringHelper";
import {
  eFilterFrameText,
  FilterFrameText,
} from "../component/FilterFrameText";
import { PlayerModel } from "../datas/playerinfo/PlayerModel";
import StarInfo from "../module/mail/StarInfo";
import { StarHelper } from "../utils/StarHelper";
import BaseTips from "./BaseTips";

export class StarPowerTip extends BaseTips {
  public tipData: any;
  public txt_totalPower: fgui.GLabel;

  public OnShowWind() {
    super.OnShowWind();

    this.initView();
    this.contentPane.ensureBoundsCorrect();
  }

  protected OnClickModal() {
    super.OnClickModal();

    this.hide();
  }

  private initView() {
    this.tipData = this.params[0];

    if (this.tipData instanceof SimpleDictionary) {
      this.txt_totalPower.text = StarHelper.getStarPowerByList(
        this.tipData as SimpleDictionary
      ).toString();
      let dataList = this.tipData.getList();
      for (let index = 1; index <= PlayerModel.EQUIP_STAR_BAG_COUNT; index++) {
        const sInfo = dataList[index - 1];
        if (sInfo) {
          let color =
            FilterFrameText.Colors[eFilterFrameText.StarQuality][
              sInfo.template.Profile - 1
            ];
          this["attr0" + index].text = this.initAttribute(sInfo, color);
        }
        this["attr0" + index].visible = Boolean(sInfo);
      }
    } else {
      this.txt_totalPower.text = "0";
    }
  }

  private initAttribute(info: StarInfo, color?: string): string {
    let gradeStr: string = LangManager.Instance.GetTranslation(
      "buildings.casern.view.RecruitPawnCell.command06",
      info.grade
    );
    let tmpStr = this.transformItem(
      info.template.TemplateNameLang + "&nbsp;&nbsp;" + gradeStr,
      color,
      20
    );

    var str: string = LangManager.Instance.GetTranslation(
      "yishi.view.tips.goods.StarPowTip.Power"
    );
    if (info.template.Power > 0)
      tmpStr += this.transformItem(
        str + String(info.template.Power * info.grade),
        color
      );
    str = LangManager.Instance.GetTranslation(
      "yishi.view.tips.goods.StarPowTip.Agility"
    );
    if (info.template.Agility > 0)
      tmpStr += this.transformItem(
        str + String(info.template.Agility * info.grade),
        color
      );
    str = LangManager.Instance.GetTranslation(
      "yishi.view.tips.goods.StarPowTip.Intellect"
    );
    if (info.template.Intellect > 0)
      tmpStr += this.transformItem(
        str + String(info.template.Intellect * info.grade),
        color
      );
    str = LangManager.Instance.GetTranslation(
      "yishi.view.tips.goods.StarPowTip.Physique"
    );
    if (info.template.Physique > 0)
      tmpStr += this.transformItem(
        str + String(info.template.Physique * info.grade),
        color
      );
    str = LangManager.Instance.GetTranslation(
      "yishi.view.tips.goods.StarPowTip.Captain"
    );
    if (info.template.Captain > 0)
      tmpStr += this.transformItem(
        str + String(info.template.Captain * info.grade),
        color
      );
    str = LangManager.Instance.GetTranslation(
      "yishi.view.tips.goods.StarPowTip.Attack"
    );
    if (info.template.Attack > 0)
      tmpStr += this.transformItem(
        str + String(info.template.Attack * info.grade),
        color
      );
    str = LangManager.Instance.GetTranslation(
      "yishi.view.tips.goods.StarPowTip.Defence"
    );
    if (info.template.Defence > 0)
      tmpStr += this.transformItem(
        str + String(info.template.Defence * info.grade),
        color
      );
    str = LangManager.Instance.GetTranslation(
      "yishi.view.tips.goods.StarPowTip.MagicAttack"
    );
    if (info.template.MagicAttack > 0)
      tmpStr += this.transformItem(
        str + String(info.template.MagicAttack * info.grade),
        color
      );
    str = LangManager.Instance.GetTranslation(
      "yishi.view.tips.goods.StarPowTip.MagicDefence"
    );
    if (info.template.MagicDefence > 0)
      tmpStr += this.transformItem(
        str + String(info.template.MagicDefence * info.grade),
        color
      );
    str = LangManager.Instance.GetTranslation(
      "yishi.view.tips.goods.StarPowTip.ForceHit"
    );
    if (info.template.ForceHit > 0)
      tmpStr += this.transformItem(
        str + String(info.template.ForceHit * info.grade),
        color
      );
    str = LangManager.Instance.GetTranslation(
      "yishi.view.tips.goods.StarPowTip.Live"
    );
    if (info.template.Live > 0)
      tmpStr += this.transformItem(
        str + String(info.template.Live * info.grade),
        color
      );
    str = LangManager.Instance.GetTranslation(
      "yishi.view.tips.goods.StarPowTip.Conat"
    );
    if (info.template.Conat > 0)
      tmpStr += this.transformItem(
        str + String(info.template.Conat * info.grade),
        color
      );
    str = LangManager.Instance.GetTranslation(
      "yishi.view.tips.goods.StarPowTip.Parry"
    );
    if (info.template.Parry > 0)
      tmpStr += this.transformItem(
        str + String(info.template.Parry * info.grade),
        color
      );
    if (!StringHelper.isNullOrEmpty(info.template.DefaultSkill.join("")))
      tmpStr += this.transformItem(StarHelper.getStarBufferName(info), color);

    return tmpStr;
  }

  private transformItem(
    value: string,
    color: string,
    fonsize: number = 18
  ): string {
    return (
      "[color=" +
      color +
      "]" +
      "[size=" +
      fonsize +
      "]" +
      value +
      "[/size][/color]<br>"
    );
  }

  public clear() {
    for (let index = 1; index <= PlayerModel.EQUIP_STAR_BAG_COUNT; index++) {
      const element = this["attr0" + index];
      element.text = "";
    }
  }
}
