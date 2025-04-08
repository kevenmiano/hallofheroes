/*
 * @Author: jeremy.xu
 * @Date: 2021-05-25 17:18:33
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-07-10 14:22:10
 * @Description: 英灵tips
 */

import LangManager from "../../core/lang/LangManager";
import UIButton from "../../core/ui/UIButton";
import { IconFactory } from "../../core/utils/IconFactory";
import { t_s_skilltemplateData } from "../config/t_s_skilltemplate";
import { CommonConstant } from "../constant/CommonConstant";
import {
  PetChallengeEvent,
  PetChallengeState,
  PetTipType,
} from "../constant/PetDefine";
import { EmPackName, EmWindow } from "../constant/UIDefine";
import { MessageTipManager } from "../manager/MessageTipManager";
import { NotificationManager } from "../manager/NotificationManager";
import { PlayerManager } from "../manager/PlayerManager";
import { PetData } from "../module/pet/data/PetData";
import PetChallengeCtrl from "../module/petChallenge/PetChallengeCtrl";
import { FrameCtrlManager } from "../mvc/FrameCtrlManager";
import FUIHelper from "../utils/FUIHelper";
import BaseTips from "./BaseTips";
import { GoodAttributeItem } from "./GoodAttributeItem";

export class PetTip extends BaseTips {
  public tipData: PetData;
  public extData: any;

  private txt_name: fgui.GLabel;
  private txt_level: fgui.GLabel;
  private txt_useLevel: fgui.GLabel;
  private txt_capacity: fgui.GLabel;
  private imgHead: fgui.GLoader;
  private imgProfile: fgui.GLoader;
  private imgPetType: fgui.GLoader;

  private qualification0: GoodAttributeItem;
  private qualification1: GoodAttributeItem;
  private qualification2: GoodAttributeItem;
  private qualification3: GoodAttributeItem;
  private qualification4: GoodAttributeItem;

  private btnOpt: UIButton;
  private tipType: PetTipType = PetTipType.Bag;
  private _challengeState: PetChallengeState = PetChallengeState.UnEquiped;
  private get challengeState(): PetChallengeState {
    const arr =
      PlayerManager.Instance.currentPlayerModel.playerInfo
        .petChallengeFormationOfArray;
    if (this.tipData && arr) {
      let bInTeam = arr.indexOf(this.tipData.petId.toString()) > -1;
      this._challengeState = bInTeam
        ? PetChallengeState.Equiped
        : PetChallengeState.UnEquiped;
    }
    return this._challengeState;
  }

  public OnInitWind() {
    super.OnInitWind();

    this.tipData = this.params[0];
    this.extData = this.params[2];
    this.initView();
    this.initAttribute(this.tipData);
    this.contentPane.ensureBoundsCorrect();
  }

  public OnShowWind() {
    super.OnShowWind();
  }

  protected OnClickModal() {
    super.OnClickModal();
    NotificationManager.Instance.dispatchEvent(
      PetChallengeEvent.RESET_SELECTED_STATE
    );
    this.hide();
  }

  private initView() {
    if (this.extData && this.extData.tipType) {
      this.tipType = this.extData.tipType;
    }

    switch (this.tipType) {
      case PetTipType.PetChallenge:
        this.btnOpt.visible = true;
        this.btnOpt.title = LangManager.Instance.GetTranslation(
          this.challengeState == PetChallengeState.UnEquiped
            ? "public.onFormation"
            : "public.unEquip"
        );
        break;
      default:
        this.btnOpt.visible = false;
        break;
    }

    let petData = this.tipData;
    let template = petData.template;
    this.imgHead.icon = IconFactory.getPetHeadSmallIcon(petData.templateId);
    let res = CommonConstant.QUALITY_RES[petData.quality - 1];
    this.imgProfile.icon = fgui.UIPackage.getItemURL(EmPackName.Base, res);

    this.txt_level.text = LangManager.Instance.GetTranslation(
      "public.level2",
      petData.grade
    );
    this.txt_capacity.text = petData.fightPower.toString();
    if (template) {
      this.txt_name.text = template.TemplateNameLang;
      this.txt_name.color = PetData.getQualityColor(petData.quality - 1);
      // this.txt_useLevel.text = LangManager.Instance.GetTranslation("pet.PetFrame.carryGrade") + template.NeedGrade;
      this.imgPetType.icon = FUIHelper.getItemURL(
        EmPackName.Base,
        "Icon_PetType" + template.PetType
      );
    }
    for (let index = 0; index < 8; index++) {
      const skill = petData.changeSkillTemplates[
        index
      ] as t_s_skilltemplateData;
      let com = this["awaken" + index] as GoodAttributeItem;
      if (skill) {
        com.visible = true;
        com.txt_attributeName.text = skill.SkillTemplateName;
        // com.txt_attributeValue.text = skill.Grades.toString();
      } else {
        com.visible = false;
      }
    }
  }

  private initAttribute(info: PetData) {
    this.qualification0.txt_attributeName.text =
      LangManager.Instance.GetTranslation("pet.growthRate");
    this.qualification1.txt_attributeName.text =
      LangManager.Instance.GetTranslation("pet.strengthCoe");
    this.qualification2.txt_attributeName.text =
      LangManager.Instance.GetTranslation("pet.armorCoe");
    this.qualification3.txt_attributeName.text =
      LangManager.Instance.GetTranslation("pet.intellectCoe");
    this.qualification4.txt_attributeName.text =
      LangManager.Instance.GetTranslation("pet.staminaCoe");

    this.qualification0.txt_attributeValue.text = info.growthRate.toString();
    this.qualification1.txt_attributeValue.text =
      info.coeStrength + " / " + info.coeStrengthLimit;
    this.qualification2.txt_attributeValue.text =
      info.coeArmor + " / " + info.coeArmorLimit;
    this.qualification3.txt_attributeValue.text =
      info.coeIntellect + " / " + info.coeIntellectLimit;
    this.qualification4.txt_attributeValue.text =
      info.coeStamina + " / " + info.coeStaminaLimit;
  }

  private btnOptClick() {
    if (!this.tipData || !this.tipData.template) return;

    switch (this.tipType) {
      case PetTipType.PetChallenge:
        // 检查是否上阵中
        if (this.challengeState == PetChallengeState.Equiped) {
          NotificationManager.Instance.dispatchEvent(
            PetChallengeEvent.RESET_SELECTED_STATE
          );
          const arr =
            PlayerManager.Instance.currentPlayerModel.playerInfo
              .petChallengeFormationOfArray;
          let count = 0;
          arr.forEach((petId) => {
            if (petId > 0) {
              count++;
            }
          });
          if (count == 1) {
            MessageTipManager.Instance.show(
              LangManager.Instance.GetTranslation("PetChallenge.unEquipPetTip")
            );
          } else {
            NotificationManager.Instance.dispatchEvent(
              PetChallengeEvent.READY_ON_FORMATION_STATE,
              { state: false, petId: this.tipData.petId }
            );
          }
        } else {
          PetChallengeCtrl.bReadyOnFormation = true;
          PetChallengeCtrl.curOptPetId = this.tipData.petId;
          NotificationManager.Instance.dispatchEvent(
            PetChallengeEvent.READY_ON_FORMATION_STATE,
            { state: true, petId: this.tipData.petId }
          );
        }
        break;
    }
    this.hide();
  }

  private get petChallengeCtrl(): PetChallengeCtrl {
    return FrameCtrlManager.Instance.getCtrl(
      EmWindow.PetChallenge
    ) as PetChallengeCtrl;
  }

  dispose(dispose?: boolean) {
    super.dispose(dispose);
  }
}
