import { t_s_skilltemplateData } from "../config/t_s_skilltemplate";
import LangManager from "../../core/lang/LangManager";
import StringUtils from "../utils/StringUtils";
import BaseTips from "./BaseTips";
import SimpleAlertHelper from "../component/SimpleAlertHelper";
import TemplateIDConstant from "../constant/TemplateIDConstant";
import { EmWindow } from "../constant/UIDefine";
import { GoodsManager } from "../manager/GoodsManager";
import { TempleteManager } from "../manager/TempleteManager";
import PetCtrl from "../module/pet/control/PetCtrl";
import { PetData } from "../module/pet/data/PetData";
import { ShopGoodsInfo } from "../module/shop/model/ShopGoodsInfo";
import { FrameCtrlManager } from "../mvc/FrameCtrlManager";
import Logger from "../../core/logger/Logger";
import { IconFactory } from "../../core/utils/IconFactory";
import BaseTipItem from "../component/item/BaseTipItem";

/**
 * 英灵技能提示
 */
export default class PetSkillTips extends BaseTips {
  private txt_name: fgui.GTextField;
  private txt_cd: fgui.GRichTextField;
  private txt_gp: fgui.GRichTextField;
  private txt_skillType: fgui.GTextField;
  private txt_defSkill: fgui.GTextField;
  private txt_cost: fgui.GTextField;
  private iconSkillItem: fgui.GButton;
  private iconConsumeItem: BaseTipItem;

  private tipData: any;
  private extData: any;
  private canOperate: boolean;
  private petData: PetData;
  private cShowOpt: fgui.Controller;
  private cPassive: fgui.Controller;
  private cLearned: fgui.Controller;

  public OnInitWind() {
    super.OnInitWind();
    this.tipData = this.params[0];
    this.canOperate = this.params[1];
    this.petData = this.params[2];
    this.initView();
    this.autoSize = true;
  }

  private btnStudyClick() {
    let skillTemp = this.tipData as t_s_skilltemplateData;

    /**道具不足时快捷购买 */
    if (
      GoodsManager.Instance.getGoodsNumByTempId(
        TemplateIDConstant.TEMP_ID_PET_SKILL_SCROLL,
      ) < skillTemp.Parameter3
    ) {
      var data: ShopGoodsInfo =
        TempleteManager.Instance.getShopTempInfoByItemId(
          TemplateIDConstant.TEMP_ID_PET_SKILL_SCROLL,
        );
      FrameCtrlManager.Instance.open(EmWindow.BuyFrameI, {
        info: data,
        count: 1,
      });
      this.hide();
      return;
    }

    let content = LangManager.Instance.GetTranslation(
      "PetLearnSkillView.usePointTip5",
      skillTemp.Parameter3,
      skillTemp.TemplateNameLang,
    );
    SimpleAlertHelper.Instance.Show(
      SimpleAlertHelper.SIMPLE_ALERT,
      null,
      null,
      content,
      null,
      null,
      (b: boolean) => {
        if (b) {
          PetCtrl.learnSkill(
            this.petData && this.petData.petId,
            undefined,
            skillTemp.TemplateId,
            PetData.SPECIAL_SKILL,
            false,
          );
        }
      },
    );
    this.hide();
  }

  private initView() {
    let skillTemp = this.tipData as t_s_skilltemplateData;
    if (!skillTemp) return;

    this.cShowOpt = this.getController("cShowOpt");
    this.cLearned = this.getController("cLearned");
    this.cPassive = this.getController("cPassive");

    let learned =
      this.petData && this.petData.checkSkillIsLearned(skillTemp.TemplateId);
    this.cLearned.setSelectedIndex(learned ? 1 : 0);
    this.cShowOpt.setSelectedIndex(this.canOperate ? 1 : 0);
    this.cPassive.setSelectedIndex(skillTemp.UseWay == 2 ? 1 : 0);

    this.txt_cost.text = skillTemp.Parameter3.toString();
    this.iconConsumeItem.setInfo(TemplateIDConstant.TEMP_ID_PET_SKILL_SCROLL);
    this.iconSkillItem.icon = IconFactory.getCommonIconPath(skillTemp.Icons);

    this.txt_name.text = skillTemp.SkillTemplateName;
    this.txt_skillType.text = this.getSkillType(skillTemp);
    if (skillTemp.CoolDown > 0) {
      this.txt_cd.text = LangManager.Instance.GetTranslation(
        "yishi.view.tips.goods.SkillTips.cooldown01",
        Math.ceil(skillTemp.CoolDown * 0.001),
      );
    }
    if (skillTemp.Cost > 0) {
      let isPetSkill = PetData.PET_TYPE_LIST.indexOf(skillTemp.MasterType) >= 0;
      this.txt_gp.text = this.getCostString(isPetSkill, skillTemp.Cost);
    } else {
      this.txt_gp.text = "";
    }
    let effectDes: string = StringUtils.stringFormat2(
      skillTemp.SkillDescription,
      { key: "Parameter1", value: skillTemp.Parameter1 },
      { key: "Parameter2", value: skillTemp.Parameter2 },
      { key: "Parameter3", value: skillTemp.Parameter3 },
    );
    this.txt_defSkill.text = effectDes;
  }

  private getCostString(isPetSkill: boolean, num: number): string {
    var str: string = "";
    num = Math.abs(num);
    if (isPetSkill) {
      //英灵技能觉醒值消耗
      str = LangManager.Instance.GetTranslation(
        "yishi.view.tips.goods.SkillTips.cooldown03",
        num,
      );
    } else {
      str = LangManager.Instance.GetTranslation(
        "yishi.view.tips.goods.SkillTips.cooldown02",
        num,
      );
    }
    return str;
  }

  private getSkillType(temp: t_s_skilltemplateData): string {
    if (temp.UseWay == 2)
      return (
        "[" +
        LangManager.Instance.GetTranslation(
          "yishi.datas.templates.SkillTempInfo.UseWay02",
        ) +
        "]"
      );
    switch (temp.AcceptObject) {
      case 1:
        return LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.Type01",
        );
      case 2:
        return LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.Type02",
        );
      case 3:
        return LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.Type03",
        );
      case 4:
        return LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.Type04",
        );
      case 5:
        return LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.Type05",
        );
      case 6:
        return LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.Type06",
        );
      case 7:
        return LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.Type07",
        );
      case 8:
        return LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.Type08",
        );
      case 9:
        return LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.Type09",
        );
      case 10:
        return LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.Type10",
        );
      case 11:
        return LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.Type11",
        );
      case 12:
        return LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.Type12",
        );
      case 13:
        return LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.Type13",
        );
      case 14:
        return LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.Type14",
        );
      case 15:
        return LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.Type15",
        );
      case 16:
        return LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.Type16",
        );
      case 17:
        return LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.Type17",
        );
      case 18:
        return LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.Type18",
        );
      case 19:
        return LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.Type19",
        );
      case 20:
        return LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.Type20",
        );
      case 21:
        return LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.Type21",
        );
    }
    return "";
  }
}
