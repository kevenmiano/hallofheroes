import GameEventDispatcher from "../../../core/event/GameEventDispatcher";
import { SimpleDictionary } from "../../../core/utils/SimpleDictionary";
import Dictionary from "../../../core/utils/Dictionary";
import { TempleteManager } from "../../manager/TempleteManager";
import { t_s_skilltemplateData } from "../../config/t_s_skilltemplate";
import { SkillInfo } from "../SkillInfo";
import ConfigMgr from "../../../core/config/ConfigMgr";
import { ConfigType } from "../../constant/ConfigDefine";
import { TalentEvent } from "../../constant/event/NotificationEvent";
import Logger from "../../../core/logger/Logger";
import { t_s_upgradetemplateData } from "../../config/t_s_upgradetemplate";
import { ResourceManager } from "../../manager/ResourceManager";
import { ArmyManager } from "../../manager/ArmyManager";

/**
 * 当前英雄天赋数据
 **/
export class TalentData extends GameEventDispatcher {
  protected _changeObj: SimpleDictionary;
  /**
   * 天赋剩余技能点
   */
  private _talentPoint: number = 0;
  private _talentGrade: number = 0;
  private _talentSkill: string = ""; //天赋技能
  private _sealOrder: number[] = []; //圣印顺序 id,id,id
  private _currentBranch: number = 0; //当前选中的分支(圣印技能id)
  private _curUsedTalentPoint: number = 0; //当前已投入的天赋点

  public is_activeSecond = false; // 是否激活二套技能

  public talent_index = 0; //当前使用的哪套天赋0、1
  public lookTalentSkill: Array<number>; //天赋技能。英灵竞技用
  /**
   * 拥有的天赋模板列表
   */
  // private _talentScript: string = '';
  public allTalentList: SimpleDictionary;
  public allTaletTemp: Dictionary = new Dictionary();

  private _job: number = 0;

  constructor() {
    super();
    this.allTalentList = new SimpleDictionary();
  }

  public get sealOrder(): number[] {
    return this._sealOrder;
  }

  public set sealOrder(value: number[]) {
    this._sealOrder = value;
  }

  public get talentSkill(): string {
    return this._talentSkill;
  }

  public set talentSkill(value: string) {
    this._talentSkill = value;
  }

  // public get talentScript(): string {
  //     return this._talentScript;
  // }

  // public set talentScript(value: string) {
  //     this._talentScript = value;
  // }

  public get currentBranch(): number {
    return this._currentBranch;
  }

  public set currentBranch(value: number) {
    this._currentBranch = value;
  }
  public get talentGrade(): number {
    return this._talentGrade;
  }

  public set talentGrade(value: number) {
    this._talentGrade = value;
  }

  public get talentPoint(): number {
    return this._talentPoint;
  }

  public set talentPoint(value: number) {
    this._talentPoint = value;
  }

  public get curUsedTalentPoint(): number {
    return this._curUsedTalentPoint;
  }

  public set curUsedTalentPoint(value: number) {
    this._curUsedTalentPoint = value;
  }

  /**
   * 根据职业初始化所有天赋技能
   * @param job
   *
   */
  public initAllSkill(job: number) {
    if (job == -1) {
      //技能重置
      this.allTalentList.clear();
    } else {
      this._job = job;
    }
    this.allTaletTemp = TempleteManager.Instance.getAllTalentTemplateInfoByJob(
      this._job * 10,
    );
    this.resetUserTalentSkill();
  }

  public resetUserTalentSkill() {
    let info: t_s_skilltemplateData;
    let skillInfo: SkillInfo;
    let id: number;
    // let dic: SimpleDictionary = TempleteManager.Instance.getMinTalentTemplateInfoByJob(this._job * 10); // 由于天赋的masterType是10 20 30
    for (const key in this.allTaletTemp) {
      info = this.allTaletTemp[key];
      if (!info.TemplateId) continue;
      skillInfo = new SkillInfo();
      id = this.existSkill(info);
      if (id > 0) {
        skillInfo.templateId = id;
        skillInfo.grade = skillInfo.templateInfo.Grades;
      } else {
        skillInfo.templateId = info.TemplateId;
        skillInfo.grade = 0;
      }
      // Logger.log('Index', skillInfo.templateInfo.Index);
      this.allTalentList.add(skillInfo.templateInfo.Index, skillInfo);
    }
  }

  /**
   * 判断是否存在该天赋, 并且返回该天赋的模板id
   * @param info
   * @return
   *
   */
  public existSkill(info: t_s_skilltemplateData): number {
    if (!this.talentSkill) {
      return 0;
    }
    // if(this.talentScript.indexOf(info.TemplateId.toString()) >=0){
    //     return info.TemplateId;
    // }
    var talentList: any[] = this.talentSkill.split(",");
    for (var id of talentList) {
      if (id == 0) {
        continue;
      }
      //sonType被策划改成一样的了, 所以这里的判断没有用了
      var temp: t_s_skilltemplateData = ConfigMgr.Instance.getTemplateByID(
        ConfigType.t_s_skilltemplate,
        id.toString(),
      );
      if (temp && info.Index == temp.Index && info.Grades <= temp.Grades) {
        return temp.TemplateId;
      }
    }
    return 0;
  }

  /**
   * 获取身上所有的天赋模板
   * @return
   *
   */
  public getSkillTemps(): t_s_skilltemplateData[] {
    var vec: t_s_skilltemplateData[] = [];
    var skillList: any[] = this.talentSkill.split(",");
    for (var id of skillList) {
      if (id == 0 || id == "") {
        continue;
      }
      var temp: t_s_skilltemplateData = this.allTaletTemp[id];
      if (temp) {
        vec.push(temp);
      }
    }
    return vec;
  }

  /**
   * 根据sontype取得天赋信息
   * @param sontype
   * @return
   *
   */
  public getSkillBySontype(sontype: number): SkillInfo {
    var skillList: any[] = this.talentSkill.split(",");
    for (var id of skillList) {
      if (id == 0) {
        continue;
      }
      var temp: t_s_skilltemplateData = this.allTaletTemp[id];
      if (sontype == temp.SonType) {
        return this.allTalentList[temp.Index];
      }
    }
    return null;
  }

  /**
   * 天赋是否可以升级
   * @returns
   */
  public checkUpgrade(): boolean {
    var gradeInfo: t_s_upgradetemplateData =
      TempleteManager.Instance.getTemplateByTypeAndLevel(
        this.talentGrade + 1,
        21,
      );
    if (gradeInfo) {
      if (
        ResourceManager.Instance.gold.count >= gradeInfo.TemplateId &&
        ArmyManager.Instance.thane.gp >= gradeInfo.Data &&
        ArmyManager.Instance.thane.grades >= 50
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  public beginChange() {}

  public commit() {
    this.dispatchEvent(TalentEvent.UPDATE_TALENT, null);
  }
}
