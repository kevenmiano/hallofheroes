import FUI_HoldEffectOptionlCom from "../../../../../fui/Skill/FUI_HoldEffectOptionlCom";
import BaseTipItem from "../../../component/item/BaseTipItem";
import TemplateIDConstant from "../../../constant/TemplateIDConstant";
import { EmWindow } from "../../../constant/UIDefine";
import { RuneHoleInfo } from "../../../datas/RuneHoleInfo";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import SkillWndCtrl from "../SkillWndCtrl";
import { RuneHoldEffectLock2 } from "./RuneHoldEffectLock2";
import { RuneHoleSkill } from "./RuneHoleSkill";

export class HoldEffectOptionlCom extends FUI_HoldEffectOptionlCom {
  declare public effectItem: RuneHoldEffectLock2;
  declare public curSkill: RuneHoleSkill;
  declare public saveSkill: RuneHoleSkill;

  public runeCarve: BaseTipItem;
  onConstruct() {
    super.onConstruct();
    this.valueBtn.onClick(this, this.onEffectClick);
    this.saveBtn.onClick(this, this.onSaveClick);
    this.runeCarve.setInfo(TemplateIDConstant.TEMP_ID_FUKONG);
  }

  public updateView(info: RuneHoleInfo) {
    this.costTxt.text = RuneHoleInfo.EffectEngravingCost;
    this.effectItem.info = info;
    let opened = info.checkOpenAllRune();
    this.saveBtn.visible = false;
    this.costPos.selectedIndex = 0;
    //未开启
    if (!opened) {
      this.levelupDetail.visible = false;
      this.lockedGroup.visible = true;
      this.optionBtns.visible = true;
      this.noEffectTips.visible = false;
      this.openTips.visible = true;
      this.costGroup.visible = this.optionBtns.visible;
      this.valueBtn.enabled = false;
      return;
    }
    this.valueBtn.enabled = true;
    //未雕刻
    if (info.skill == 0) {
      this.levelupDetail.visible = false;
      this.lockedGroup.visible = true;
      this.optionBtns.visible = true;
      this.noEffectTips.visible = true;
      this.openTips.visible = false;
      this.costGroup.visible = this.optionBtns.visible;
      return;
    }

    this.saveSkill.visible = !!info.tempSkillId;
    this.saveBtn.visible = this.saveSkill.visible;
    this.costPos.selectedIndex = this.saveBtn.visible ? 1 : 0;
    this.levelupDetail.visible = true;
    this.lockedGroup.visible = false;
    this.optionBtns.visible = true;
    this.costGroup.visible = this.optionBtns.visible;
    this.curSkill.setInfo(info, false);
    this.nextFlag.visible = !!info.tempSkillId;
    if (info.tempSkillId) {
      this.saveSkill.setInfo(info, true);
    }
  }

  private onEffectClick() {
    let ctrl = FrameCtrlManager.Instance.getCtrl(
      EmWindow.Skill,
    ) as SkillWndCtrl;
    ctrl.reqRuneHoldOpton(this.effectItem.info.holeId, 1);
  }

  private onSaveClick() {
    let ctrl = FrameCtrlManager.Instance.getCtrl(
      EmWindow.Skill,
    ) as SkillWndCtrl;
    ctrl.reqRuneHoldOpton(this.effectItem.info.holeId, 4);
  }
}
