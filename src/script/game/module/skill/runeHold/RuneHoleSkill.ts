import FUI_RuneHoleSkill from "../../../../../fui/Skill/FUI_RuneHoleSkill";
import { IconFactory } from "../../../../core/utils/IconFactory";
import { CommonConstant } from "../../../constant/CommonConstant";
import GoodsSonType from "../../../constant/GoodsSonType";
import { EmPackName, EmWindow } from "../../../constant/UIDefine";
import { RuneHoleInfo } from "../../../datas/RuneHoleInfo";

export class RuneHoleSkill extends FUI_RuneHoleSkill {
  onConstruct() {
    super.onConstruct();
  }

  public setInfo(info: RuneHoleInfo, isTemp = false) {
    let skillInfo = isTemp ? info.getTempSkillInfo() : info.getSkillInfo();
    this.skillName.text = skillInfo.templateInfo.SkillTemplateName;
    this.skillName.color = GoodsSonType.getColorByProfile(
      skillInfo.templateInfo.Grades,
    );
    this.skillDesc.text = skillInfo.templateInfo.SkillDescription;
    this.skillIcon.url = IconFactory.getCommonIconPath(
      skillInfo.templateInfo.Icons,
    );

    let res = CommonConstant.QUALITY_RES[skillInfo.templateInfo.Grades - 1];
    this.profile.icon = fgui.UIPackage.getItemURL(EmPackName.Base, res);

    let condition = isTemp
      ? info.getTempSkillCondition()
      : info.getSkillCondition();
    let holdProperty = info.getHoldProperty();
    let bonus = info.getBonusValue();
    let formatCondition = "";
    let nvalue = 0;
    let cvalue = 0;
    for (let p in condition) {
      if (!formatCondition) {
        formatCondition += "\n" + formatCondition;
      }
      nvalue = (holdProperty[p] * (1 + bonus)) >> 0 || 0;
      cvalue = condition[p];
      formatCondition += `[color=${nvalue >= cvalue ? "#ffecc6" : "#ff2e2e"}]${p}(${nvalue}/${cvalue})[/color]`;
    }
    this.lockedValue.text = formatCondition;
  }
}
