import FUI_scollText from "../../../fui/Skill/FUI_scollText";
import LangManager from "../../core/lang/LangManager";
import { FormularySets } from "../../core/utils/FormularySets";
import { IconFactory } from "../../core/utils/IconFactory";
import { BaseIcon } from "../component/BaseIcon";
import BaseTipItem from "../component/item/BaseTipItem";
import { t_s_skilltemplateData } from "../config/t_s_skilltemplate";
import { t_s_upgradetemplateData } from "../config/t_s_upgradetemplate";
import { TalentEvent } from "../constant/event/NotificationEvent";
import OpenGrades from "../constant/OpenGrades";
import TemplateIDConstant from "../constant/TemplateIDConstant";
import { ThaneInfo } from "../datas/playerinfo/ThaneInfo";
import { SkillInfo } from "../datas/SkillInfo";
import { ArmyManager } from "../manager/ArmyManager";
import { ArmySocketOutManager } from "../manager/ArmySocketOutManager";
import { MessageTipManager } from "../manager/MessageTipManager";
import { NotificationManager } from "../manager/NotificationManager";
import { ResourceManager } from "../manager/ResourceManager";
import { TempleteManager } from "../manager/TempleteManager";
import ScrollTextField from "../module/common/ScrollTextField";
import GeniusPanel from "../module/skill/content/GeniusPanel";
import BaseTips from "./BaseTips";

/**
 * 天赋技能TIP
 */
export class TalentItemTips extends BaseTips {
  private desc: fgui.GComponent;
  private skillEffectRichText: ScrollTextField; //当前技能效果
  private txt_cold: fgui.GTextField; //当前技能冷却时间
  private nextSkillCold: fgui.GTextField; //当前技能冷却时间
  private nextSkillCost: fgui.GTextField; //当前技能消耗怒气
  public nextSkillEffect: FUI_scollText;
  //下一级技能效果
  private nextSkillEffectRichText: ScrollTextField; //下一级技能效果
  private txt_name: fgui.GTextField; //技能名称z
  private skillName2: fgui.GTextField; //技能名称
  private txt_level: fgui.GTextField; //技能等级
  private selectSkillItem: BaseIcon; //当前右侧选中技能
  private item2: BaseIcon; //当前右侧选中技能
  private txt_lv1: fgui.GTextField;
  private txt_lv2: fgui.GTextField;
  private nextBox: fgui.GGroup;
  private curBox: fgui.GGroup;
  private subox: fgui.GGroup;
  private totalBox: fgui.GGroup;
  private box1: fgui.GGroup;
  private box0: fgui.GGroup;
  private levelupBox: fgui.GGroup;
  private maxbox: fgui.GGroup;
  img_bg: fgui.GComponent;
  private studyBtn: fgui.GButton; //学习
  private upgradeBtn: fgui.GButton;
  // private selectSkillData: SkillInfo = null;
  public selectRuneItem: BaseIcon;
  public studyBox: fgui.GGroup; //所需物品Group

  private _nextLevelNeedCoin: number = 0;
  private _nextLevelExp: number = 0;
  private upCostGoldNumber: fgui.GTextField; //升级所需金币
  private upCostExpNumber: fgui.GTextField; //升级所需经验
  private txt1: fgui.GTextField;
  private txt_cost: fgui.GTextField;
  //升级条件
  private upgradeLimit: fgui.GTextField; //升级所需条件
  private selectTalentItem: fgui.GComponent; //当前右侧选中天赋
  private selectTalentData = null; //当前选择天赋
  private tipItem1: BaseTipItem; //经验
  private tipItem2: BaseTipItem; //黄金
  constructor() {
    super();
  }

  protected onConstruct() {}

  public OnInitWind() {
    super.OnInitWind();
    this.studyBtn.title = LangManager.Instance.GetTranslation(
      "armyII.viewII.skill.btnStudy",
    );
    this.upgradeBtn.title = LangManager.Instance.GetTranslation(
      "armyII.viewII.skill.btnUpgrade",
    );
    this.txt_cost.text = LangManager.Instance.GetTranslation(
      "talent.gradeCondition2",
      1,
    );
    this.skillEffectRichText = new ScrollTextField(this.desc);
    this.nextSkillEffectRichText = new ScrollTextField(this.nextSkillEffect);
    this.addEvent();
    this.showSelectItemInfo(this.params[0]);
    this.totalBox.ensureBoundsCorrect();
    this.tipItem1.setInfo(TemplateIDConstant.TEMP_ID_EXP);
    this.tipItem2.setInfo(TemplateIDConstant.TEMP_ID_GOLD);
  }

  /**
   * 天赋等级
   */
  private showTalentGrade() {
    this.selectTalentItem.getChild("imgBg").visible = this.txt_cold.visible =
      false;
    this.contentPane.getController("c1").selectedIndex = 1;
    this.txt_name.text = LangManager.Instance.GetTranslation(
      "FightSkillEdit.txt9",
    );
    this.txt_name.color = this.skillName2.color = "#ffdc57";
    this.skillEffectRichText.text =
      LangManager.Instance.GetTranslation("talent.levelupDesc");
    this.txt_level.text = LangManager.Instance.GetTranslation(
      "public.level3",
      this.thane.talentData.talentGrade,
    );

    let gradeInfo: t_s_upgradetemplateData =
      TempleteManager.Instance.getTemplateByTypeAndLevel(
        this.thane.talentData.talentGrade + 1,
        21,
      );
    let ismax: boolean = false;
    if (gradeInfo) {
      ismax = gradeInfo.ActiveObject > OpenGrades.MAX_GRADE;
    }
    if (gradeInfo && !ismax) {
      this._nextLevelNeedCoin = gradeInfo.TemplateId;
      this._nextLevelExp = gradeInfo.Data;
      this.nextSkillEffectRichText.text =
        LangManager.Instance.GetTranslation("talent.levelupDesc");
      this.item2.getChild("imgBg").visible = false;
      this.skillName2.text = LangManager.Instance.GetTranslation(
        "FightSkillEdit.txt9",
      );
      this.txt_lv1.text = LangManager.Instance.GetTranslation(
        "public.level3",
        this.thane.talentData.talentGrade,
      );
      this.txt_lv2.text = LangManager.Instance.GetTranslation(
        "public.level3",
        this.thane.talentData.talentGrade + 1,
      );

      this.upCostGoldNumber.text = FormularySets.toStringSelf(
        this._nextLevelNeedCoin,
        GeniusPanel.STEP,
      );
      this.upCostExpNumber.text = FormularySets.toStringSelf(
        this._nextLevelExp,
        GeniusPanel.STEP,
      );
      if (ResourceManager.Instance.gold.count >= this._nextLevelNeedCoin) {
        this.upCostGoldNumber.color = "#FFECC6";
      } else {
        this.upCostGoldNumber.color = "#FF2E2E";
      }

      if (this.thane.gp >= this._nextLevelExp) {
        this.upCostExpNumber.color = "#FFECC6";
      } else {
        this.upCostExpNumber.color = "#FF2E2E";
      }

      if (
        ResourceManager.Instance.gold.count < this._nextLevelNeedCoin ||
        this.thane.gp < this._nextLevelExp
      )
        this.upgradeBtn.enabled = false;
      else this.upgradeBtn.enabled = true;
      var limitGrade: number = 50;
      if (ArmyManager.Instance.thane.grades < limitGrade) {
        this.upgradeBtn.enabled = false;
      }
      this.nextBox.visible = true;
      this.studyBox.visible = false;
      this.levelupBox.visible = true;
    } else {
      this.upCostGoldNumber.text = LangManager.Instance.GetTranslation(
        "public.defaultnumber",
      );
      this.upCostExpNumber.text = LangManager.Instance.GetTranslation(
        "public.defaultnumber",
      );
      this.upCostGoldNumber.color = "#FF2E2E";
      this.upCostExpNumber.color = "#FF2E2E";
      this.upgradeBtn.enabled = false;
      this.studyBox.visible = false;
      this.levelupBox.visible = false;
      this.maxbox.visible = true;
      this.nextBox.visible = false;
    }
    this.box0.ensureBoundsCorrect();
    this.box1.ensureBoundsCorrect();
    this.subox.ensureBoundsCorrect();
    this.curBox.ensureBoundsCorrect();
  }

  /**
   * 当前等级的技能信息
   * @param info
   */
  private showCurSkillInfo(info: SkillInfo) {
    this.selectTalentItem.icon = IconFactory.getTecIconByIcon(
      info.templateInfo.Icons,
    );
    this.txt_name.text = info.templateInfo.SkillTemplateName;
    this.txt_level.text = LangManager.Instance.GetTranslation(
      "public.level3",
      info.templateInfo.Grades,
    );
    this.skillEffectRichText.text = info.templateInfo.SkillDescription;
    if (info.templateInfo.PropCoolDown > 0) {
      this.txt_cold.text = LangManager.Instance.GetTranslation(
        "yishi.view.tips.goods.SkillTips.cooldown01",
        info.templateInfo.PropCoolDown * 0.001,
      );
    }
  }

  /**
   * 当前下一等级的技能信息
   * @param info
   */
  private showNextSkillInfo(next: t_s_skilltemplateData) {
    this.skillName2.text = next.SkillTemplateName;
    this.item2.icon = IconFactory.getTecIconByIcon(next.Icons);
    this.txt_lv2.text = LangManager.Instance.GetTranslation(
      "public.level3",
      next.Grades,
    );
    if (next.PropCoolDown > 0) {
      this.nextSkillCold.text = LangManager.Instance.GetTranslation(
        "yishi.view.tips.goods.SkillTips.cooldown01",
        next.PropCoolDown * 0.001,
      );
    }
    if (Number(next.Cost) < 0) {
      this.nextSkillCost.text = LangManager.Instance.GetTranslation(
        "yishi.view.tips.goods.SkillTips.cooldown02",
        Math.abs(Number(next.Cost)),
      );
    }
    this.nextSkillEffectRichText.text = next.SkillDescription;
  }

  /**展示天赋详细信息 */
  private showSelectItemInfo(targetData) {
    if (targetData == 1) {
      this.showTalentGrade();
      return;
    }
    // this.clearItemInfo();
    this.selectTalentData = targetData;
    //展示单个天赋详细信息
    if (targetData instanceof SkillInfo) {
      var condition: Array<string> = [];
      var info: SkillInfo = targetData as SkillInfo;
      var nextTemp: t_s_skilltemplateData = info.nextTemplateInfo;
      this.showCurSkillInfo(info);
      if (info.grade == 0) {
        if (nextTemp.PropCoolDown > 0) {
          this.txt_cold.text = LangManager.Instance.GetTranslation(
            "yishi.view.tips.goods.SkillTips.cooldown01",
            nextTemp.PropCoolDown * 0.001,
          );
        }
        this.txt_level.text = "";
        // if (Number(nextTemp.Cost) < 0) {
        //     var num: number = Math.abs(Number(nextTemp.Cost));
        //     this.skillCost.text = LangManager.Instance.GetTranslation("yishi.view.tips.goods.SkillTips.cooldown02", num);
        // }
        this.skillEffectRichText.text = nextTemp.SkillDescription;
        condition = info.checkTalentUpgradeCondition(nextTemp);
        condition.forEach((str) => {
          this.upgradeLimit.text += str + "<br>";
        });
        if (condition.length) {
          this.upgradeLimit.visible = true;
          this.studyBox.visible = true;
          this.studyBtn.enabled = false;
          this.levelupBox.visible = false;
        } else {
          //条件达到了显示消耗
          this.studyBox.visible = false;
          this.levelupBox.visible = true;
          this.upgradeBtn.title = LangManager.Instance.GetTranslation(
            "armyII.viewII.skill.btnStudy",
          );
          this.studyBtn.enabled = true;
        }
        this.txt1.text = LangManager.Instance.GetTranslation(
          "ConsortiaSkillTowerWnd.n70",
        );
        this.nextBox.visible = false;
      } else if (nextTemp) {
        this.txt_lv1.text = LangManager.Instance.GetTranslation(
          "public.level3",
          info.templateInfo.Grades,
        );
        this.showNextSkillInfo(nextTemp);
        condition = info.checkTalentUpgradeCondition(nextTemp);
        condition.forEach((str) => {
          this.upgradeLimit.text += str + "<br>";
        });
        if (condition.length) {
          //升级条件不足的是时候用studybox
          //升级条件
          this.txt1.text =
            LangManager.Instance.GetTranslation(
              "yishi.view.tips.TechnologyTip.nextGrade.text",
            ) + ":";
          this.studyBtn.title = LangManager.Instance.GetTranslation(
            "armyII.viewII.skill.btnUpgrade",
          );
          this.studyBtn.enabled = false;
          this.upgradeLimit.visible = true;
          this.studyBox.visible = true;
          this.txt_cost.visible = false;
          this.levelupBox.visible = false;
        }
        if (
          this.upgradeBtn.title ==
          LangManager.Instance.GetTranslation("armyII.viewII.skill.btnStudy")
        ) {
          this.upgradeBtn.title = LangManager.Instance.GetTranslation(
            "armyII.viewII.skill.btnUpgrade",
          );
          this.x -= this.contentPane.width / 2;
        }
        this.nextBox.visible = true;
        this.curBox.ensureBoundsCorrect();
        this.nextBox.ensureBoundsCorrect();
        this.totalBox.ensureBoundsCorrect();
      } else {
        this.nextBox.visible = false;
        this.studyBox.visible = false;
        this.levelupBox.visible = false;
        this.maxbox.visible = true;
      }
      if (this.thane.talentData.talentPoint <= 0) {
        this.txt_cost.text =
          LangManager.Instance.GetTranslation("talent.talentPoint");
        this.txt_cost.color = "#FF2E2E";
      }

      this.upgradeBtn.enabled =
        this.checkCondition(targetData) && condition.length == 0;
    } else if (targetData instanceof t_s_skilltemplateData) {
      var temp: t_s_skilltemplateData = targetData as t_s_skilltemplateData;
      this.selectTalentItem.icon = IconFactory.getTecIconByIcon(temp.Icons);
      this.txt_level.text = LangManager.Instance.GetTranslation(
        "public.level3",
        temp.Grades,
      );
      this.txt_name.text = temp.SkillTemplateName;
      // this.talentMethod.text = this.getSkillType(temp);
      if (temp.PropCoolDown > 0) {
        this.txt_cold.text = LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.cooldown01",
          temp.PropCoolDown * 0.001,
        );
      }
      // if (Number(temp.Cost) < 0) {
      //     this.skillCost.text = LangManager.Instance.GetTranslation("yishi.view.tips.goods.SkillTips.cooldown02", Math.abs(Number(temp.Cost)));
      // }
      this.skillEffectRichText.text = temp.SkillDescription;
      this.upgradeBtn.enabled = this.checkCondition(targetData);
    }
  }

  /**检查是否可加点 */
  public checkCondition(talentdata): boolean {
    if (!talentdata) return;
    let _canAdd = false;
    if (this.checkCanAdd(talentdata)) {
      _canAdd = true;
    } else {
      _canAdd = false;
    }

    if (_canAdd && talentdata.grade > 0) {
      //已经激活的
      _canAdd = true;
    }
    return _canAdd;
  }

  private checkCanAdd(talentdata): boolean {
    if (!talentdata.nextTemplateInfo) return false;
    if (this.thane.talentData.talentPoint <= 0) return false;
    if (
      talentdata.checkTalentUpgradeCondition(talentdata.nextTemplateInfo)
        .length > 0
    )
      return false;
    return true;
  }

  /**
   *刷新数据
   */
  private refreshData() {
    //upgrade模板, types为21, 对应grade的data为所需经验, templateid为所需黄金
    var gradeInfo: t_s_upgradetemplateData =
      TempleteManager.Instance.getTemplateByTypeAndLevel(
        this.thane.talentData.talentGrade + 1,
        21,
      );
    if (gradeInfo) {
      this._nextLevelNeedCoin = gradeInfo.TemplateId;
      this._nextLevelExp = gradeInfo.Data;

      this.upCostGoldNumber.text = FormularySets.toStringSelf(
        this._nextLevelNeedCoin,
        GeniusPanel.STEP,
      );
      this.upCostExpNumber.text = FormularySets.toStringSelf(
        this._nextLevelExp,
        GeniusPanel.STEP,
      );
      if (ResourceManager.Instance.gold.count >= this._nextLevelNeedCoin) {
        this.upCostGoldNumber.color = "#FFECC6";
      } else {
        this.upCostGoldNumber.color = "#FF2E2E";
      }
      if (this.thane.gp >= this._nextLevelExp) {
        this.upCostExpNumber.color = "#FFECC6";
      } else {
        this.upCostExpNumber.color = "#FF2E2E";
      }
      if (
        ResourceManager.Instance.gold.count < this._nextLevelNeedCoin ||
        this.thane.gp < this._nextLevelExp
      )
        this.upgradeBtn.enabled = false;
      else this.upgradeBtn.enabled = true;

      var limitGrade: number = 50;
      if (ArmyManager.Instance.thane.grades < limitGrade) {
        this.upgradeBtn.enabled = false;
      }
    } else {
      this.upCostGoldNumber.text = LangManager.Instance.GetTranslation(
        "public.defaultnumber",
      );
      this.upCostExpNumber.text = LangManager.Instance.GetTranslation(
        "public.defaultnumber",
      );
      this.upCostGoldNumber.color = "#FF2E2E";
      this.upCostExpNumber.color = "#FF2E2E";
      this.upgradeBtn.enabled = false;
    }

    this.txt_level.text = this.thane.talentData.talentGrade.toString(); //当前天赋等级
    if (gradeInfo)
      this.txt_lv2.text = (this.thane.talentData.talentGrade + 1).toString();
    //下一天赋等级
    else
      this.txt_lv1.text = LangManager.Instance.GetTranslation(
        "public.defaultnumber",
      );
  }

  private addEvent() {
    // this.studyBtn.onClick(this, this._onStudySkill);
    this.upgradeBtn.onClick(this, this.__upUpgradeTalent);

    // this.list.on(fairygui.Events.CLICK_ITEM, this, this.__onGoodsItemSelect);
    NotificationManager.Instance.addEventListener(
      TalentEvent.TALENT_UPGRADE,
      this.__talenChangeHanler,
      this,
    );
    // NotificationManager.Instance.addEventListener(TalentEvent.SELECT_TALENT, this.__talenSelectHanler, this);
  }

  removeEvent() {
    // this.studyBtn.offClick(this, this._onStudySkill);
    this.upgradeBtn.offClick(this, this.__upUpgradeTalent);
    NotificationManager.Instance.removeEventListener(
      TalentEvent.TALENT_UPGRADE,
      this.__talenChangeHanler,
      this,
    );
    // NotificationManager.Instance.removeEventListener(TalentEvent.SELECT_TALENT, this.__talenSelectHanler, this);
  }

  private levelupGrade() {
    var limitGrade: number = 50;
    if (ArmyManager.Instance.thane.grades < limitGrade) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "armyII.SkillFrame.AlertMsg",
          limitGrade,
        ),
      );
      return;
    }
    if (ResourceManager.Instance.gold.count < this._nextLevelNeedCoin) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "armyII.viewII.talent.TalentGradeUpFailed01",
        ),
      );
      return;
    }

    if (this.thane.gp < this._nextLevelExp) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "armyII.viewII.talent.TalentGradeUpFailed02",
        ),
      );
      return;
    }

    ArmyManager.Instance.addEventListener(
      TalentEvent.TALENT_GRADUP_SUCC,
      this.__talentGradeUpSucc,
      this,
    );
    ArmySocketOutManager.sendUpTalentGrade();
  }

  /**升级天赋技能 */
  private __upUpgradeTalent() {
    if (this.params[0] == 1) {
      this.levelupGrade();
    } else {
      var limitGrade: number = 50;
      if (ArmyManager.Instance.thane.grades < limitGrade) {
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation(
            "armyII.SkillFrame.AlertMsg",
            limitGrade,
          ),
        );
        return;
      }
      if (this.selectTalentData && this.selectTalentData.nextTemplateInfo) {
        ArmySocketOutManager.sendAddSkillpoint(
          this.selectTalentData.nextTemplateInfo.TemplateId,
          1,
        );
      }
    }
  }

  /**
   * 升级圣印
   * @param evt
   */
  protected __upGrade(evt) {
    var limitGrade: number = 50;
    if (ArmyManager.Instance.thane.grades < limitGrade) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "armyII.SkillFrame.AlertMsg",
          limitGrade,
        ),
      );
    }
    if (ResourceManager.Instance.gold.count < this._nextLevelNeedCoin) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "armyII.viewII.talent.TalentGradeUpFailed01",
        ),
      );
      return;
    }

    if (this.thane.gp < this._nextLevelExp) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "armyII.viewII.talent.TalentGradeUpFailed02",
        ),
      );
      return;
    }

    ArmyManager.Instance.addEventListener(
      TalentEvent.TALENT_GRADUP_SUCC,
      this.__talentGradeUpSucc,
      this,
    );
    ArmySocketOutManager.sendUpTalentGrade();
  }

  /**
   *天赋等级升级成功
   * @param event
   *
   */
  protected __talentGradeUpSucc(event: TalentEvent) {
    ArmyManager.Instance.removeEventListener(
      TalentEvent.TALENT_GRADUP_SUCC,
      this.__talentGradeUpSucc,
      this,
    );
    this.showTalentGrade();
  }

  protected __talenChangeHanler(info: SkillInfo) {
    this.showSelectItemInfo(info);
    // this.refreshTalentSkill();
    // this.refreshData();
    // if (this.selectTalentItemCell) {
    //     this.showSelectItemInfo(this.selectTalentItemCell);
    // }
  }

  private get thane(): ThaneInfo {
    return ArmyManager.Instance.thane;
  }

  public OnHideWind() {
    this.removeEvent();
    super.OnHideWind();
  }
}
