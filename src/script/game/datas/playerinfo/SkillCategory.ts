/**
 * 英雄的技能集合
 * @author alan
 *
 */
import GameEventDispatcher from "../../../core/event/GameEventDispatcher";
import Logger from "../../../core/logger/Logger";
import Dictionary from "../../../core/utils/Dictionary";
import { SimpleDictionary } from "../../../core/utils/SimpleDictionary";
import { t_s_skilltemplateData } from "../../config/t_s_skilltemplate";
import OpenGrades from "../../constant/OpenGrades";
import { ExtraJobEvent } from "../../constant/event/NotificationEvent";
import { PlayerEvent } from "../../constant/event/PlayerEvent";
import { ArmyManager } from "../../manager/ArmyManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { ResourceManager } from "../../manager/ResourceManager";
import { TempleteManager } from "../../manager/TempleteManager";
import { ExtraJobItemInfo } from "../../module/bag/model/ExtraJobItemInfo";
import ExtraJobModel from "../../module/bag/model/ExtraJobModel";
import { SkillInfo } from "../SkillInfo";

export class SkillCategory extends GameEventDispatcher {
  protected static claName: string = "SkillCategory";
  protected static SKILL_POINT: string = "SKILL_POINT";
  protected static SKILL_INDEX: string = "SKILL_INDEX";
  protected static ACTIVE_DOUBLE_SKILL: string = "ACTIVE_DOUBLE_SKILL";
  protected static SKILL_SCRIPTS: string = "SKILL_SCRIPTS";
  protected static SKILL_FAST_KEY: string = "SKILL_FAST_KEY";
  protected _changeObj: SimpleDictionary;
  /**
   * 剩余技能点
   */
  private _skillPoint: number = 0;
  public set skillPoint(value: number) {
    if (value != this._skillPoint) {
      this._changeObj[SkillCategory.SKILL_POINT] = true;
    }
    this._skillPoint = value;
  }

  public get skillPoint(): number {
    return this._skillPoint;
  }

  /**
   * 额外技能点
   */
  private _extraSkillPoint: number = 0;
  public set extraSkillPoint(value: number) {
    // if (value != this._extraSkillPoint) {
    //     this._changeObj[SkillCategory.SKILL_POINT] = true;
    // }
    this._extraSkillPoint = value;
  }

  public get extraSkillPoint(): number {
    return this._extraSkillPoint;
  }

  /**
   * 控制双技能的序号
   */
  private _skillIndex: number = 0;
  public set skillIndex(value: number) {
    if (value != this._skillIndex) {
      this._changeObj[SkillCategory.SKILL_INDEX] = true;
      if (this._job != 0) {
        this.initAllSkill(this._job);
      }
    }
    this._skillIndex = value;
  }

  public get skillIndex(): number {
    return this._skillIndex;
  }

  /**
   * 是否激活双技能
   */
  public _activeDouble: boolean = false;
  public set activeDouble(value: boolean) {
    if (value != this._activeDouble) {
      this._changeObj[SkillCategory.ACTIVE_DOUBLE_SKILL] = true;
    }
    this._activeDouble = value;
  }

  public get activeDouble(): boolean {
    return this._activeDouble;
  }

  public beginChange() {
    this._changeObj.clear();
  }

  public commit() {
    if (this._changeObj[SkillCategory.SKILL_POINT]) {
      this.dispatchEvent(PlayerEvent.THANE_SKILL_POINT, null);
      this._changeObj[SkillCategory.SKILL_POINT] = false;
    }
    if (this._changeObj[SkillCategory.SKILL_INDEX]) {
      this.dispatchEvent(PlayerEvent.SKILL_INDEX, null);
      this._changeObj[SkillCategory.SKILL_INDEX] = false;
    }
    if (this._changeObj[SkillCategory.ACTIVE_DOUBLE_SKILL]) {
      this.dispatchEvent(PlayerEvent.ACTIVE_DOUBLE_SKILL, null);
      this._changeObj[SkillCategory.ACTIVE_DOUBLE_SKILL] = false;
    }
    if (this._changeObj[SkillCategory.SKILL_SCRIPTS]) {
      this.dispatchEvent(PlayerEvent.SKILL_SCRIPTS, null);
      this._changeObj[SkillCategory.SKILL_SCRIPTS] = false;
    }
    if (this._changeObj[SkillCategory.SKILL_FAST_KEY]) {
      this.dispatchEvent(PlayerEvent.SKILL_FAST_KEY, null);
      this._changeObj[SkillCategory.SKILL_FAST_KEY] = false;
    }
  }

  /**改变之后清除状态 */
  clearChangeObj() {
    this._changeObj[SkillCategory.SKILL_POINT] = false;
    this._changeObj[SkillCategory.SKILL_INDEX] = false;
    this._changeObj[SkillCategory.ACTIVE_DOUBLE_SKILL] = false;
    this._changeObj[SkillCategory.SKILL_SCRIPTS] = false;
    this._changeObj[SkillCategory.SKILL_FAST_KEY] = false;
  }

  private _skillScript: string = "";

  /**
   * 英雄已经学的技能字段
   */
  public get skillScript(): string {
    return this._skillScript;
  }

  /**
   * @private
   */
  public set skillScript(value: string) {
    this._changeObj[SkillCategory.SKILL_INDEX] = true;
    this._skillScript = value;
  }

  public allSkillList: SimpleDictionary;
  // 某职业所有专精技能信息skillInfo
  public allExtrajobSkillList: SimpleDictionary;
  public allSkillTemp: Dictionary;
  // 某职业所有专精技能模板
  public allExtrajobSkillTemp: Dictionary;
  /**
   * 英雄技能快捷键
   */
  private _fastKey: string = "";

  private _job: number = 0;

  constructor() {
    super();
    this.allSkillList = new SimpleDictionary();
    this.allExtrajobSkillList = new SimpleDictionary();
    this.allSkillTemp = new Dictionary();
    this.allExtrajobSkillTemp = new Dictionary();
    this._changeObj = new SimpleDictionary();
  }

  /**
   * 根据职业初始化该职业的所有技能模板
   * @param job
   *
   */
  public initAllSkill(job: number) {
    this._job = job;
    this.allSkillTemp = TempleteManager.Instance.getAllSkillTemplateInfoByJob(
      this._job,
    );
    let dic: SimpleDictionary =
      TempleteManager.Instance.getMinSkillTemplateInfoByJob(this._job);
    // let info: t_s_skilltemplateData = null;
    let skillInfo: SkillInfo = null;
    let id: number = 0;
    let skillList = dic.getList() as t_s_skilltemplateData[];
    for (let info of skillList) {
      // info = dic[key];
      skillInfo = new SkillInfo();
      id = this.existSkill(info);
      if (id > 0) {
        skillInfo.templateId = id;
        skillInfo.grade = skillInfo.templateInfo.Grades;
      } else {
        skillInfo.templateId = info.TemplateId;
        skillInfo.grade = 0;
      }
      if (skillInfo.templateId)
        this.allSkillList.add(skillInfo.templateInfo.Index, skillInfo);
    }
  }

  /** 已经学过的专精技能 */
  private _studyedSkillArr: number[] = [];

  public get studyedSkillArr(): number[] {
    return this._studyedSkillArr;
  }

  /**
   * 初始化专精技能 `
   * @param job
   */
  public initExtraJobSkill() {
    Logger.info("[SkillCategory]初始化专精技能");
    this.allExtrajobSkillList.clear();
    this._studyedSkillArr.length = 0;
    this.allExtrajobSkillTemp =
      TempleteManager.Instance.getAllExtrajobSkillTemplateInfoByJob(this._job);
    let allExtrajobSkillMinTemp =
      TempleteManager.Instance.getExtrajobMinSkillTemplateInfoByJob(this._job);
    let skillInfo: SkillInfo = null;
    let tempId: number = 0;
    let minSkillTempList =
      allExtrajobSkillMinTemp.getList() as t_s_skilltemplateData[];
    for (let minSkillTemp of minSkillTempList) {
      skillInfo = new SkillInfo();
      tempId = this.existExtrajobSkill(minSkillTemp);
      if (tempId > 0) {
        skillInfo.templateId = tempId;
        skillInfo.grade = skillInfo.templateInfo.Grades;
        this._studyedSkillArr.push(tempId);
      } else {
        skillInfo.templateId = minSkillTemp.TemplateId;
        skillInfo.grade = 0;
      }

      if (skillInfo.templateId)
        this.allExtrajobSkillList.add(
          skillInfo.templateInfo.MasterType +
            "_" +
            skillInfo.templateInfo.Index,
          skillInfo,
        );
    }
  }
  /**
   * 专精技能升级后需要更新allExtrajobSkillList
   */
  updateExtraJobSkill(info: ExtraJobItemInfo) {
    this.initExtraJobSkill();
  }

  /**
   * 获取该英雄所拥有的所有技能模板集合
   * @return
   *
   */
  public getSkillTemps(): t_s_skilltemplateData[] {
    var vec: t_s_skilltemplateData[] = [];
    var skillList: any[] = this.skillScript.split(",");
    for (const key in skillList) {
      let id: number = skillList[key];
      if (id == 0) {
        continue;
      }
      var temp: t_s_skilltemplateData = this.allSkillTemp[id];
      if (temp) {
        vec.push(temp);
      }
    }
    return vec;
  }

  /**
   * 通过技能sontype取得技能信息
   * @param sontype
   * @return
   *
   */
  public getSkillBySontype(sontype: number): SkillInfo {
    var skillList: any[] = this.skillScript.split(",");
    for (const key in skillList) {
      let id: number = skillList[key];
      if (id == 0) {
        continue;
      }
      var temp: t_s_skilltemplateData = this.allSkillTemp[id];
      if (temp && sontype == temp.SonType) {
        return this.allSkillList[temp.Index];
      }
    }
    return null;
  }

  public getExtrajobSkillBySontype(sontype: number): SkillInfo {
    var skillList: any[] = this._studyedSkillArr;
    for (const key in skillList) {
      let id: number = skillList[key];
      if (id == 0) {
        continue;
      }
      var temp: t_s_skilltemplateData = this.allExtrajobSkillTemp[id];
      if (temp && sontype == temp.SonType) {
        return this.allExtrajobSkillList[temp.MasterType + "_" + temp.Index];
      }
    }
    return null;
  }

  public set fastKey(value: string) {
    this._changeObj[SkillCategory.SKILL_FAST_KEY] = true;
    this._fastKey = value;
  }

  public get fastKey(): string {
    return this._fastKey;
  }

  /**
   * 返回快捷键的数量
   * @return
   *
   */
  public get fastKeyLength(): number {
    var count: number = 0;

    let ss = this._fastKey.split(",");
    for (const key in ss) {
      let id: number = Number(ss[key]);
      if (id > 0) {
        count++;
      }
    }
    return count;
  }

  /**
   * 返回技能快捷键列表
   * @return
   *
   */
  public getFastkey(): SimpleDictionary {
    var setList: SimpleDictionary = new SimpleDictionary();
    var fastKeys: any[] = this._fastKey.split(",");
    var length: number = 0;
    for (var j: number = 1; j < fastKeys.length; j++) {
      if (fastKeys[j - 1] != -1) {
        var info: SkillInfo = this.getSkillBySontype(fastKeys[j - 1]);
        if (info) {
          setList.add("fastkey_" + j, { value: info.templateInfo.TemplateId });
          setList.add("index_" + info.templateInfo.TemplateId, { value: j });
          length++;
        }
      }
    }
    return setList;
  }

  /**
   * 判断指定技能是否是影该英雄已经拥有的技能 并返回该技能的模板id
   * @param info
   * @return
   *
   */
  public existSkill(info: t_s_skilltemplateData): number {
    var skillList: string[] = this.skillScript.split(",");
    for (const key in skillList) {
      let id: number = Number(skillList[key]);
      if (id == 0) {
        continue;
      }
      var temp: t_s_skilltemplateData = this.allSkillTemp[id];
      if (temp && info.SonType == temp.SonType && info.Grades <= temp.Grades) {
        return temp.TemplateId;
      }
    }
    return 0;
  }

  /**
   * 判断指定专精技能是否是影该英雄已经拥有的专精技能 并返回该专精技能的模板id
   * @param info
   * @return
   *
   */
  public existExtrajobSkill(info: t_s_skilltemplateData): number {
    let activeArr = ExtraJobModel.instance.activeList;
    for (let index = 0; index < activeArr.length; index++) {
      const element = activeArr[index];
      if (element) {
        var skillIdList: string[] = element.skillScript.split(",");
        for (const key in skillIdList) {
          let id: number = Number(skillIdList[key]);
          if (id == 0) {
            continue;
          }
          var temp: t_s_skilltemplateData = this.allExtrajobSkillTemp[id];
          if (
            temp &&
            info.SonType == temp.SonType &&
            info.Grades <= temp.Grades
          ) {
            return temp.TemplateId;
          }
        }
      }
    }
    return 0;
  }

  /**
   * getSkillInfoBySkillTempId
   */
  getSkillInfoBySkillTempId(skillId: number): SkillInfo {
    var temp: t_s_skilltemplateData = this.allSkillTemp[skillId];
    return this.allSkillList[temp.Index];
  }

  getExtrajobSkillInfoBySkillTempId(skillId: number): SkillInfo {
    var temp: t_s_skilltemplateData = this.allExtrajobSkillTemp[skillId];
    return this.allSkillList[temp.MasterType + "_" + temp.Index];
  }

  getExtrajobSkill(jobtype: number): SkillInfo[] {
    // let index: number;
    let skillArr = [];
    let skillInfo: SkillInfo;
    for (const key in this.allExtrajobSkillList) {
      skillInfo = this.allExtrajobSkillList[key];
      if (
        skillInfo &&
        skillInfo.templateInfo &&
        skillInfo.templateInfo.MasterType == jobtype
      ) {
        skillArr.push(skillInfo);
      }
    }
    return skillArr;
  }

  /**
   * 专精技能红点检测
   * @returns
   */
  checkExtrajobRedDot(): boolean {
    if (ArmyManager.Instance.thane.grades < OpenGrades.MASTERY) return false;
    let skillInfo: SkillInfo;
    for (const key in this.allExtrajobSkillList) {
      skillInfo = this.allExtrajobSkillList[key];
      if (skillInfo && skillInfo.templateInfo) {
        let jobtype = skillInfo.templateInfo.MasterType;
        let jobLevel = ExtraJobModel.instance.getExtrajobItemLevel(jobtype);
        if (jobLevel > 0) {
          if (skillInfo.grade == 0) {
            let canStudy = jobLevel >= skillInfo.templateInfo.NeedPlayerGrade;
            if (canStudy) return true;
          } else {
            if (!skillInfo.nextTemplateInfo) return false;
            let canUpgrade =
              jobLevel >= skillInfo.nextTemplateInfo.NeedPlayerGrade;
            let isgoldEnough =
              ResourceManager.Instance.gold.count >=
              skillInfo.templateInfo.Parameter3;
            if (canUpgrade && isgoldEnough) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }
}
