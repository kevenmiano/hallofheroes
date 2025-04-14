/**
 * @author:jeremy.xu
 * @data: 2020-11-30 11:00
 * @description :  技能数据
 **/
import ConfigMgr from "../../../core/config/ConfigMgr";
import Dictionary from "../../../core/utils/Dictionary";
import { t_s_skilltemplateData } from "../../config/t_s_skilltemplate";
import { ConfigType } from "../../constant/ConfigDefine";
import { AttackData } from "./AttackData";
import { BufferDamageData } from "./BufferDamageData";
import ReliveInfo from "./ReliveInfo";

export class SkillData {
  /** 变身技能 */
  public static PET_MORPH_SKILL: number = 700001;
  /** 取消变身 */
  public static PET_UNMORPH_SKILL: number = 700002;

  public battleId: string = "";
  public skillId: number = 0;
  /**
   *施法主体
   */
  public fId: number = 0; //
  /**
   * 技能的播放时间
   */
  public liftTime: number = 0;
  /**
   * type AttackData
   */
  public data: AttackData[][] = [];
  public processStrategy: number = 0;
  /**
   * 最终怒气值.
   */
  public sp: number = 0;
  /**
   * 技能本身产生或消耗的怒气值.
   */
  public spAdded: number = 0;
  /**
   * 被动(触发)的.值为true时,人物出手前会有一个闪动的效果.
   */
  public passive: boolean = false;
  /**
   * 每条攻击指令所带的BUFFER的数据.
   */
  public buffers: BufferDamageData[];
  /**
   * 该技能所所生的BUFFER的数据.该值是buffers的子集.
   */
  public skillBuffers: BufferDamageData[];
  /**
   * 召换列表
   */
  public awakens: any[];
  /**
   * 复活
   */
  public river: number = 0;
  /**
   * 时间,主要用于世界BOSS.
   */
  public attackMillis: number = 0;
  /**
   *  该技能是否会导致某个角色死亡
   */
  public willKillSomeBody: boolean = false;
  /**
   * 保存该技能对每个角色对应的伤害值
   */
  private _hurtStats: Dictionary;
  private _hurtRoleIds: any[];

  /**
   * 索引ID,同一场战斗中的技能的标识符(唯一)
   */
  private _indexId: number = 0;

  private static _globalIndexId: number = 0;

  constructor() {
    this._hurtStats = new Dictionary();
    this._indexId = SkillData._globalIndexId++;
  }

  public get indexId(): number {
    return this._indexId;
  }

  /**
   * 获得该技能对指定角色(ID)的伤害值
   * @param roleId
   * @return
   *
   */
  public getHurtValue(roleId: number): number {
    if (this._hurtStats[roleId]) {
      return this._hurtStats[roleId];
    }
    return 0;
  }

  /**
   * 记录对指定角色的伤害值.
   * @param roleId
   * @param hurt
   *
   */
  public recordHurtData(roleId: number, hurt: number) {
    if (this._hurtStats[roleId] == undefined) {
      this._hurtStats[roleId] = 0;
    }
    this._hurtStats[roleId] += hurt;
  }

  /**
   * 返回该技能伤害的角色列表
   * @return
   *
   */
  public getHurtRoles(): any[] {
    if (this._hurtRoleIds) {
      return this._hurtRoleIds;
    }
    this._hurtRoleIds = [];
    for (const key in this._hurtStats) {
      if (this._hurtStats.hasOwnProperty(key)) {
        const id = this._hurtStats[key];
        this._hurtRoleIds.push(id);
      }
    }
    return this._hurtRoleIds;
  }

  public static resetIndexId() {
    SkillData._globalIndexId = 0;
  }

  private _skillTemplate: t_s_skilltemplateData;
  public get skillTemplate() {
    if (
      !this._skillTemplate ||
      this._skillTemplate.TemplateId != this.skillId
    ) {
      this._skillTemplate = ConfigMgr.Instance.getTemplateByID(
        ConfigType.t_s_skilltemplate,
        this.skillId,
      );
    }
    return this._skillTemplate;
  }

  /** 觉醒值增加 */
  public awakenAdd: number = 0;
  /** 觉醒值 */
  public awaken: number = 0;

  public reliveList: Array<ReliveInfo> = [];
}
