import AudioManager from "../../../core/audio/AudioManager";
import Logger from "../../../core/logger/Logger";
import Dictionary from "../../../core/utils/Dictionary";
import { InheritIActionType } from "../../constant/BattleDefine";
import ComponentSetting from "../../utils/ComponentSetting";
import { BattleManager } from "../BattleManager";
import { BattleModel } from "../BattleModel";
import { SkillQueue } from "./control/SkillQueue";
import { SkillWaitInfo } from "./mode/SkillWaitInfo";
import { BaseSkill } from "./skills/BaseSkill";

/**
 * @author:jeremy.xu
 * @data: 2020-11-30 11:00
 * @description   技能系统类.
 * 该类为整个技能系统提供对外接口.
 *  通过调用addSkill方法,将技能添加进技能系统.技能就会被自动地处理.
 **/
export class SkillSystem {
  private _skillQueue: SkillQueue;

  private _waitSkillDic: Dictionary;

  private _battleModel: BattleModel;

  constructor() {
    this._skillQueue = new SkillQueue();
    this._waitSkillDic = new Dictionary();
    this._skillQueue.start();

    this._battleModel = BattleManager.Instance.battleModel;
  }

  /**
   * 添加技能.
   * 将技能添加到技能系统中.
   * @param skill
   *
   */
  public addSkill(skill: BaseSkill) {
    let target: any = this.getSingleAttackSkillTarget(skill);
    if (target) {
      let waitInfo: SkillWaitInfo = this._waitSkillDic[target.livingId];
      if (waitInfo) {
        // BattleLogSystem.realExecuteTime(skill, skill.liftTime);
      }
    }
    this._skillQueue.addAction(skill);
  }

  /**
   * 获得在等待执行的技能队列.
   * @return
   *
   */
  public getSkillQueue(): SkillQueue {
    return this._skillQueue;
  }

  public isNeedWait(role: any): boolean {
    let target: any;
    let roleId: number;
    let skill: BaseSkill = role.getSkillQueue().getActions()[0];
    let waitInfo: SkillWaitInfo;
    if (this.isSingleAttackSkill(skill)) {
      roleId = skill.getSkillData().data[0][0].roleId;
      target = this._battleModel.getRoleById(roleId);
      if (target && target.getSkillQueue().current) {
        if (
          target.getSkillQueue().current.inheritType ==
          InheritIActionType.CommonActionSkill
        ) {
          this.resetWaitSkill(target);

          if (this._waitSkillDic[target.livingId] == null) {
            this._waitSkillDic[target.livingId] = new SkillWaitInfo();
          }
          waitInfo = this._waitSkillDic[target.livingId];
          waitInfo.roleId = target.livingId;
          waitInfo.count++;
          waitInfo.countDown(this.waitCountDownComplete.bind(this));

          return true;
        }
      }
    }
    return false;
  }

  /**
   * 获得单体攻击技能的攻击对象.
   * @param skill
   * @return
   *
   */
  private getSingleAttackSkillTarget(skill: BaseSkill): any {
    let target: any;
    let roleId: number;
    if (skill.getSkillData().data && skill.getSkillData().data.length > 0) {
      if (skill.getSkillData().data[0].length == 1) {
        roleId = skill.getSkillData().data[0][0].roleId;
        target = this._battleModel.getRoleById(roleId);
      }
    }
    return target;
  }

  /**
   * 是否是单体攻击技能.
   * @param skill
   * @return
   *
   */
  private isSingleAttackSkill(skill: BaseSkill): boolean {
    if (skill.getSkillData().data && skill.getSkillData().data.length > 0) {
      if (skill.getSkillData().data[0].length == 1) {
        return true;
      }
    }
    return false;
  }

  /**
   * 重新设置由于effactRole导致其他需要等待的技能的生效时间.
   * @param effactRole
   *
   */
  public resetWaitSkill(effactRole: any) {
    let role: any;

    let roles: Map<number, any> = this._battleModel.roleList;
    let skill: BaseSkill;
    let targetRole: any;
    let targetRoleId: number;
    for (const key in roles) {
      const role = roles[key];
      if (role.getSkillQueue().getActions().length > 0) {
        skill = role.getSkillQueue().getActions()[0] as BaseSkill;
        if (this.isSingleAttackSkill(skill)) {
          targetRoleId = skill.getSkillData().data[0][0].roleId;
          targetRole = this._battleModel.getRoleById(targetRoleId);
          if (targetRole == effactRole) {
            skill.liftTime++;
            // BattleLogSystem.realExecuteTime(skill, skill.liftTime);
          }
        }
      }
    }
    for (const key in roles) {
      const role = roles[key];
      if (role.getSkillQueue().getActions().length > 0) {
        skill = role.getSkillQueue().getActions()[0] as BaseSkill;
        if (this.isSingleAttackSkill(skill)) {
          targetRoleId = skill.getSkillData().data[0][0].roleId;
          targetRole = this._battleModel.getRoleById(targetRoleId);
          if (targetRole == effactRole) {
            skill.liftTime++;
            // BattleLogSystem.realExecuteTime(skill, skill.liftTime);
          }
        }
      }
    }
    for (const key in this._skillQueue.getActions()) {
      const skill = this._skillQueue.getActions()[key];
      if (this.isSingleAttackSkill(skill)) {
        targetRoleId = skill.getSkillData().data[0][0].roleId;
        targetRole = this._battleModel.getRoleById(targetRoleId);
        if (targetRole == effactRole) {
          skill.liftTime++;
          // BattleLogSystem.realExecuteTime(skill, skill.liftTime);
        }
      }
    }
  }

  private waitCountDownComplete(info: SkillWaitInfo) {
    delete this._waitSkillDic[info.roleId];
  }

  public static playSound(soundName: string, tag: string = "") {
    if (soundName) {
      let soundPath = ComponentSetting.getSkillSoundSourcePath(soundName);
      Logger.battle("播放音效", tag, soundPath);
      AudioManager.Instance.playSound(soundPath);
    }
  }

  /**
   * 销毁.
   *
   */
  public dispose() {
    if (this._skillQueue) {
      this._skillQueue.cleanActions();
      this._skillQueue.stop();
    }
    this._skillQueue = null;
  }
}
