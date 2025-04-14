import GameEventDispatcher from "../../core/event/GameEventDispatcher";
import { TempleteManager } from "../manager/TempleteManager";
import { t_s_skilltemplateData } from "../config/t_s_skilltemplate";
import ConfigMgr from "../../core/config/ConfigMgr";
import { ConfigType } from "../constant/ConfigDefine";
import LangManager from "../../core/lang/LangManager";
import { ThaneInfo } from "./playerinfo/ThaneInfo";
import { ArmyManager } from "../manager/ArmyManager";
import { SkillEvent, TalentEvent } from "../constant/event/NotificationEvent";

export class SkillInfo extends GameEventDispatcher {
  private _templateId: number;
  public grade: number;
  //技能使用次数
  public useCount = 0;
  /**
   * 该技能的最小等级模板
   */
  public minGradeTemplateInfo: t_s_skilltemplateData;

  constructor() {
    super();
  }

  public get templateId(): number {
    return this._templateId;
  }

  public set templateId(value: number) {
    if (this._templateId != value) {
      this._templateId = value;
      this.minGradeTemplateInfo =
        TempleteManager.Instance.getMinSkillTemplateInfoBySonType(
          this.templateInfo.SonType,
        );
    }
  }

  ///////////////////////////////////////////////////////////////////

  public get templateInfo(): t_s_skilltemplateData {
    return ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_skilltemplate,
      this.templateId.toString(),
    );
  }

  /**
   * 返回该技能下一个等级的技能模板
   * @return
   *
   */
  public get nextTemplateInfo(): t_s_skilltemplateData {
    if (this.grade == 0) {
      return this.templateInfo;
    }

    return this.templateInfo.nextTemp;
  }

  /**
   * 返回该技能下一个模板的前置技能模板列表
   * @return
   *
   */
  public get nextTempPreTempList(): any[] {
    if (this.nextTemplateInfo) {
      return this.nextTemplateInfo.preTempList;
    }
    return null;
  }

  /**
   * 返回该技能或天赋的最大等级
   * @return
   *
   */
  public get maxGrade(): number {
    var grade: number = 0;
    let allSkill = this.thane.skillCate.allSkillTemp;
    for (const key in allSkill) {
      var temp: t_s_skilltemplateData = allSkill[key];
      if (temp.SonType == this.templateInfo.SonType) {
        if (grade < temp.Grades) {
          grade = temp.Grades;
        }
      }
    }
    if (grade == 0) {
      let allSkill = this.thane.skillCate.allExtrajobSkillTemp;
      for (const key in allSkill) {
        var temp: t_s_skilltemplateData = allSkill[key];
        if (temp.SonType == this.templateInfo.SonType) {
          if (grade < temp.Grades) {
            grade = temp.Grades;
          }
        }
      }
    }
    return grade;
  }

  /**
   * 返回天赋的最大等级
   * @return
   *
   */
  public get talentMaxGrade(): number {
    var grade: number = 0;
    let allTalent = this.thane.talentData.allTaletTemp;
    for (const key in allTalent) {
      let temp: t_s_skilltemplateData = allTalent[key];
      if (temp.SonType == this.templateInfo.SonType) {
        if (grade < temp.Grades) {
          grade = temp.Grades;
        }
      }
    }
    return grade;
  }

  /**
   * 返回指定技能升级条件列表
   * @param info
   * @return
   *
   */
  public checkUpgradeCondition(info: t_s_skilltemplateData): any[] {
    var arr: any[] = [];
    var preTempList: any[] = info.preTempList;
    if (info.NeedPlayerGrade > this.thane.grades) {
      arr.push(
        LangManager.Instance.GetTranslation(
          "buildings.BaseBuildFrame.gradeValue",
          info.NeedPlayerGrade,
        ),
      );
    }
    for (var temp of preTempList) {
      if (!this.thane.existSkill(temp)) {
        let str: string = LangManager.Instance.GetTranslation(
          "public.level.name",
          temp.TemplateName,
          temp.Grades,
        );
        arr.push(str);
      }
    }
    return arr;
  }

  /**
   * 返回指定技能升级条件列表
   * @param info
   * @return
   *
   */
  public getUpgradeCondition(info: t_s_skilltemplateData): any[] {
    var arr: any[] = [];
    var preTempList: any[] = info.preTempList;
    if (info.NeedPlayerGrade) {
      arr.push(info.NeedPlayerGrade);
    }
    for (var temp of preTempList) {
      // if (!this.thane.existSkill(temp)) {
      arr.push(temp);
      // }
    }
    return arr;
  }

  /**
   * 返回指定天赋升级条件列表
   * @param info
   * @return
   *
   */
  public checkTalentUpgradeCondition(info: t_s_skilltemplateData): any[] {
    var arr: any[] = [];
    var preTempList: any[] = info.preTempList;
    if (info.NeedPlayerGrade > this.thane.talentData.talentGrade) {
      arr.push(
        LangManager.Instance.GetTranslation(
          "talent.gradeCondition",
          info.NeedPlayerGrade,
        ),
      );
    }
    for (var temp of preTempList) {
      if (!this.thane.existTalent(temp)) {
        var str: string = LangManager.Instance.GetTranslation(
          "public.level.name",
          temp.TemplateNameLang,
          temp.Grades,
        );
        arr.push(str);
      }
    }
    return arr;
  }

  /**
   * 检查该技能或天赋是否未达到最大等级
   * @return
   *
   */
  public checkGrade(): boolean {
    if (this.grade < this.maxGrade) {
      return true;
    }
    return false;
  }

  /**
   * 重置技能信息
   *
   */
  public reset() {
    this.grade = 0;
    this.templateId = this.minGradeTemplateInfo.TemplateId;
  }

  private get thane(): ThaneInfo {
    return ArmyManager.Instance.thane;
  }

  /**
   *通知更新
   *
   */
  public commit(type: number = 0) {
    if (type == 0) {
      this.dispatchEvent(SkillEvent.SKILL_UPGRADE, this);
    } else {
      this.dispatchEvent(TalentEvent.TALENT_UPGRADE, this);
    }
  }

  /**
   * 返回英灵远征技能最大等级
   * @return
   *
   */
  public get remotePetMaxGrade() {
    let grade: number = 0;
    let remoteSkill = TempleteManager.Instance.getAllRemotePetSkill();
    for (let temp of remoteSkill) {
      if (temp.SonType == this.templateInfo.SonType) {
        if (grade < temp.Grades) grade = temp.Grades;
      }
    }
    return grade;
  }
}
