/**
 * @author:jeremy.xu
 * @data: 2020-11-30 11:00
 * @description  技能队列.
 * 该类继承自BattleActionQueue,所以将技能通过addAction添加进队列中后,
 * 只需按帧频不断调用, 即可实现技能的自动施放。
 * 通过调用start和stop方法,可以启动或停止帧频事件.
 **/
import Logger from "../../../../core/logger/Logger";
// import { IEnterFrame } from "../../../interfaces/IEnterFrame";
import { EnterFrameManager } from "../../../manager/EnterFrameManager";
import { BattleManager } from "../../BattleManager";
import { BattleActionQueue } from "../../queue/BattleActionQueue";
import { BaseSkill } from "../skills/BaseSkill";

export class SkillQueue extends BattleActionQueue implements IEnterFrame {
  private _running: boolean;
  constructor() {
    super();
  }

  public enterFrame() {
    if (this._actions.length > 0) {
      let temp: BaseSkill = this._actions[0] as BaseSkill;
      //是否到达技能的执行时间
      if (!temp.ready(BattleManager.Instance.BattleFrameCount)) {
        return;
      }
      this._actions.shift();

      if (!temp.getCurrentRole()) {
        temp.skipFun();
        return;
      }
      temp.getCurrentRole().addSkill(temp);
    }
  }

  /**
   * 开始事件侦听.
   *
   */
  public start() {
    if (!this._running) {
      EnterFrameManager.Instance.registeEnterFrame(this);
      this._running = true;
    }
  }

  /**
   * 停止事件侦听.
   *
   */
  public stop() {
    if (this._running) {
      EnterFrameManager.Instance.unRegisteEnterFrame(this);
    }
    this._running = false;
  }
  /**
   * 是否正在动行.
   * @return
   *
   */
  public get running(): boolean {
    return this._running;
  }

  /**
   * 检测该技能是否是可以导致某角色死亡.
   * @param skill
   * @return
   *
   */
  private isKillableSkill(skill: BaseSkill): boolean {
    if (skill.getSkillData().willKillSomeBody) {
      return true;
    }
    let hurts: any[] = skill.getSkillData().getHurtRoles();
    let currentBlood: number;
    let willHurt: number = 0;
    let unstartHurt: number;
    let unstartAdd: number = 0;
    let count: number = 0;

    // let undStartSkills :any[] = BattleManager.Instance.battleModel.getUnstartSkills();
    // let hurtRole : RoleInfo;
    // for (let index = 0; index < hurts.length; index++) {
    //     const id = hurts[index];
    //     hurtRole = BattleManager.Instance.battleModel.getRoleById(id)
    //     if(!hurtRole){
    //         continue;
    //     }
    //     currentBlood = hurtRole.bloodA;
    //     if(hurtRole.readyFlag){
    //         return true;
    //     }
    //     willHurt = skill.getSkillData().getHurtValue(id);

    //     unstartHurt = 0;//伤血
    //     unstartAdd = 0//加血
    //     undStartSkills.forEach((mem: BaseSkill) => {
    //         count = mem.getSkillData().getHurtValue(id)
    //         if(count < 0){
    //             unstartAdd -= count
    //         }else{
    //             unstartHurt += count
    //         }
    //     });
    //     if(unstartAdd > 0 && currentBlood - willHurt - unstartHurt < 1000){
    //         return true;
    //     }
    // }

    return false;
  }

  /**
   * 检测该技能之前的技能是否都已经开始执行了.
   * @param skill
   * @return
   *
   */
  private isPreviousSkillsStarded(skill: BaseSkill): boolean {
    // return BattleManager.Instance.battleModel.isAllSkillStarted();
    return false;
  }

  /**
   * 清除技能列表.
   *
   */
  public clear() {
    this.cleanActions();
  }
}
