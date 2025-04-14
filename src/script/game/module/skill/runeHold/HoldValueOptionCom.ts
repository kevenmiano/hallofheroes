import FUI_HoldValueOptionCom from "../../../../../fui/Skill/FUI_HoldValueOptionCom";
import LangManager from "../../../../core/lang/LangManager";
import TemplateIDConstant from "../../../constant/TemplateIDConstant";
import { EmWindow } from "../../../constant/UIDefine";
import { RuneHoleInfo } from "../../../datas/RuneHoleInfo";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import SkillWndCtrl from "../SkillWndCtrl";
import { RuneHoldValueLock2 } from "./RuneHoldValueLock2";

export class HoldValueOptionCom extends FUI_HoldValueOptionCom {
  declare public valueItem: RuneHoldValueLock2;

  //@ts-expect-error: BaseTipItem
  public runeCarve: BaseTipItem;
  onConstruct() {
    super.onConstruct();
    this.valueBtn.onClick(this, this.onValueClick);

    this.runeCarve.setInfo(TemplateIDConstant.TEMP_ID_FUKONG);
  }

  public updateView(info: RuneHoleInfo) {
    this.valueItem.info = info;
    let nextUpgrade = info.getNextUpgrade();
    this.costTxt.text = nextUpgrade ? nextUpgrade.Data + "" : "Max";

    let opened = info.checkOpenAllRune();
    if (!opened) {
      this.levelupDetail.visible = false;
      this.lockedGroup.visible = true;
      this.valueBtn.enabled = false;
      return;
    }

    this.levelupDetail.visible = true;
    this.lockedGroup.visible = false;
    this.valueBtn.enabled = true;
    this.updateDetail(info);
  }

  private updateDetail(info: RuneHoleInfo) {
    let curUpgrade = info.getUpgrade();
    let nextUpgrade = info.getNextUpgrade();

    let maxStr = LangManager.Instance.GetTranslation(
      "consortia.view.myConsortia.skill.ConsortiaSkillItem.tip.title2",
    );

    this.costTxt.text = nextUpgrade ? nextUpgrade.Data + "" : maxStr;

    this.curLv.setVar("level", info.grade + "").flushVars();

    this.nextLv.text = nextUpgrade
      ? LangManager.Instance.GetTranslation(
          "HoldValueOptionCom.nextLevel",
          info.grade + 1,
        )
      : maxStr;

    let tips = LangManager.Instance.GetTranslation("runeHole.bonus.levelup");

    this.curDesc.text = tips.replace(
      "{0}",
      (curUpgrade ? curUpgrade.TemplateId : 0) + "",
    );

    this.nextDesc.text = nextUpgrade
      ? tips.replace("{0}", nextUpgrade.TemplateId + "")
      : maxStr;
    this.valueBtn.enabled = !!nextUpgrade;
    this.costGroup.visible = !!nextUpgrade;
  }

  private onValueClick() {
    let ctrl = FrameCtrlManager.Instance.getCtrl(
      EmWindow.Skill,
    ) as SkillWndCtrl;
    ctrl.reqRuneHoldOpton(this.valueItem.info.holeId, 2);
  }
}
