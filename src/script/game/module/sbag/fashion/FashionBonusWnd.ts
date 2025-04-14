import LangManager from "../../../../core/lang/LangManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { UpgradeType } from "../../../constant/UpgradeType";
import { ArmyManager } from "../../../manager/ArmyManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import { FashionBounsGroup } from "./FashionBounsGroup";

export class FashionBonusWnd extends BaseWindow {
  public d3: fgui.GComponent;
  public cur: FashionBounsGroup;
  public arrow: fgui.GImage;
  public next: FashionBounsGroup;
  public container: fgui.GGroup;

  public OnInitWind(): void {
    super.OnInitWind();
    this.setCenter();
    this.initView();
  }

  private initView() {
    let fashionMsg = ArmyManager.Instance.fashionInfoMsg;
    if (!fashionMsg) return;
    //当前等级数据
    let upgradeTemp = TempleteManager.Instance.getTemplateByTypeAndLevel(
      fashionMsg.grades,
      UpgradeType.UPGRADE_FASHION,
    );
    this.cur.setTitle(
      LangManager.Instance.GetTranslation("fashioncomposetip.current"),
    );
    let curAttListData: string[] = [];
    if (upgradeTemp) {
      let skillString = upgradeTemp.TemplateNameLang;
      let skillList =
        TempleteManager.Instance.getSkillTemplateInfoByIds(skillString);
      for (let skill of skillList) {
        curAttListData.push(...skill.SkillDescription.split("<br>"));
      }
    }
    this.cur.setAttributeList(curAttListData);

    //下一等级
    let nextTemp = TempleteManager.Instance.getTemplateByTypeAndLevel(
      fashionMsg.grades + 1,
      UpgradeType.UPGRADE_FASHION,
    );
    let nextAttListData: string[] = [];
    if (nextTemp) {
      this.next.setTitle(
        LangManager.Instance.GetTranslation("fashioncomposetip.next"),
      );
      let skillString = nextTemp.TemplateNameLang;
      let skillList =
        TempleteManager.Instance.getSkillTemplateInfoByIds(skillString);
      for (let skill of skillList) {
        nextAttListData.push(...skill.SkillDescription.split("<br>"));
      }
    } else {
      //最高级
      this.next.setTitle(
        LangManager.Instance.GetTranslation("fashioncomposetip.maxGrade"),
      );
    }
    this.next.setAttributeList(nextAttListData);
  }

  public OnHideWind(): void {}

  onDestroy(): void {}
}
