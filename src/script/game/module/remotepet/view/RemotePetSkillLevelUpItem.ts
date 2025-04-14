import FUI_RemotePetSkillLevelUpItem from "../../../../../fui/RemotePet/FUI_RemotePetSkillLevelUpItem";
import SoundManager from "../../../../core/audio/SoundManager";
import LangManager from "../../../../core/lang/LangManager";
import { UIFilter } from "../../../../core/ui/UIFilter";
import { IconFactory } from "../../../../core/utils/IconFactory";
import { SoundIds } from "../../../constant/SoundIds";
import { SkillInfo } from "../../../datas/SkillInfo";
import { GoodsManager } from "../../../manager/GoodsManager";
import { RemotePetManager } from "../../../manager/RemotePetManager";
import { TempleteManager } from "../../../manager/TempleteManager";

export class RemotePetSkillLevelUpItem extends FUI_RemotePetSkillLevelUpItem {
  private skillInfo: SkillInfo;

  public setSub() {
    this.getController("main").selectedIndex = 1;
  }

  public set info(v: SkillInfo) {
    this.skillInfo = v;
    this.updateView();
  }
  private updateView() {
    if (!this.skillInfo) return;
    this._icon.url = IconFactory.getCommonIconPath(
      this.skillInfo.templateInfo.Icons,
    );
    this._skillName.text = this.skillInfo.templateInfo.SkillTemplateName;
    this._skillCD.text =
      this.skillInfo.templateInfo.CoolDown / 1000 +
      LangManager.Instance.GetTranslation("public.time.second");
    this._cost.text = LangManager.Instance.GetTranslation(
      "remotepet.skill.point",
      this.skillInfo.templateInfo.Cost,
    );
    this._skillDesc.text = this.skillInfo.templateInfo.SkillDescription;
    // this._skillLv.text = LangManager.Instance.GetTranslation("fish.FishFrame.levelText", this.skillInfo.grade);

    this._skillType.text = this.skillInfo.templateInfo.skillTypeDesc;
    let remotePetSkillStatus =
      RemotePetManager.Instance.model.remotePetSkillStatus;
    // if (!this.isSub) {
    //     this.addEvent();
    // }
    //可加点
    // if (this.checkCanAdd()) {
    //     this.costNum.text = this.skillInfo.nextTemplateInfo.UpgradeNeedCount + "";
    //     this.upgradeBtn.enabled = true;
    // } else {
    //     this.upgradeBtn.enabled = false;
    //     this.costNum.color = "#FF0000";
    // }

    //未解锁
    if (this.skillInfo.grade == 0) {
      this._unlockedTxt.visible = true;
      this._unlockTxt.visible = true;
      this._getSkillCountTipTxt.visible = false;
      this._skillCountTxt.visible = false;
      // this.costNum.visible = false;
      // this._sylph2.visible = false;

      this._icon.filters = [UIFilter.grayFilter];
      this.talent.filters = [UIFilter.grayFilter];
      let turnInfo = TempleteManager.Instance.getRemotePetTurnBySkill(
        this.skillInfo.templateId,
      );
      this._unlockTxt.text = LangManager.Instance.GetTranslation(
        "remotepet.RemotePetLevelUp.unlock",
        turnInfo.IndexID,
      );
    } else {
      this._unlockedTxt.visible = false;
      this._unlockTxt.visible = false;
      this._getSkillCountTipTxt.visible = true;
      this._skillCountTxt.visible = true;
      let skillCount = remotePetSkillStatus[this.skillInfo.templateId];
      this._skillCountTxt.setVar("count", skillCount + "").flushVars();
      let petTurns = TempleteManager.Instance.getRemotePetTurnsBySkill(
        this.skillInfo.templateId,
      );
      let currTurn = RemotePetManager.Instance.model.turnInfo.maxTurn;
      let nextAddSkillTurn = 0;
      for (let turn of petTurns) {
        if (turn.Count >= currTurn) {
          nextAddSkillTurn = turn.Count;
          break;
        }
      }
      this._getSkillCountTipTxt
        .setVar("level", nextAddSkillTurn + "")
        .flushVars();
      this._getSkillCountTipTxt.visible = !!nextAddSkillTurn;
    }
  }

  private checkCanAdd(): boolean {
    if (this.skillInfo.grade == 0) return false;
    if (!this.skillInfo.nextTemplateInfo) return false;
    if (
      GoodsManager.Instance.getGoodsNumByTempId(
        this.skillInfo.nextTemplateInfo.UpgradeNeedItem,
      ) < this.skillInfo.nextTemplateInfo.UpgradeNeedCount
    )
      return false;
    return true;
  }

  // private addEvent() {
  //     this.upgradeBtn.onClick(this, this.addHandler);
  // }

  // private removeEvent() {
  //     this.upgradeBtn.offClick(this, this.addHandler);
  // }

  protected addHandler(e: MouseEvent): void {
    SoundManager.Instance.play(SoundIds.CONFIRM_SOUND);
    RemotePetManager.sendUpdateSkill(this.skillInfo.templateId);
  }

  public dispose(dispose?: boolean): void {
    // this.removeEvent();
    super.dispose();
  }
}
