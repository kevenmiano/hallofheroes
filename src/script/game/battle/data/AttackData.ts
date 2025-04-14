/**
 * @author:jeremy.xu
 * @data: 2020-11-23 10:00
 * @description
 **/

import { BattleManager } from "../BattleManager";

export class AttackData {
  constructor() {}
  /**
   * 施法者
   */
  public fId: number = 0;
  /**
   * 抗性伤害类型
   */
  public resistType: number = 0;
  /**
   * 抗性减伤
   */
  public resistValue: number = 0;
  /**
   * 抗性减免百分比
   */
  public resitPercent: number = 0;
  /**
   * 伤害类型, 参见BloodType
   */
  public bloodType: number = 0;
  /**
   * 伤害值
   */
  public damageValue: number = 0;
  /**
   * 要显示出来的更新的血量
   */
  public displayBlood: number = 0;
  /**
   * 剩余生命值
   */
  public leftHp: number = 0;
  /**
   * 是否是暴击.
   */
  public extraData: number = 0;
  /**
   * 是否是格档
   */
  public parry: boolean = false;
  /**
   * 被禁用的技能列表
   */
  public skillIds: any[];
  /**
   * 掉落列表
   */
  public dropList: any[] = [];
  /**被攻击者*/
  private _roleId: number = 0;
  /**
   *_roleInfo BaseRoleInfo
   **/
  private _roleInfo: any;
  //护盾值
  public hp2 = 0;
  //护盾(次数)
  public hp3 = 0;

  public clone(): AttackData {
    let c_attackData: AttackData = new AttackData();
    c_attackData.damageValue = this.damageValue;
    c_attackData.leftHp = this.leftHp;
    c_attackData.extraData = this.extraData;
    c_attackData.roleId = this.roleId;
    c_attackData.hpMaxAdd = this.hpMaxAdd;
    c_attackData.hp2 = this.hp2;
    c_attackData.hp3 = this.hp3;
    return c_attackData;
  }

  public get roleInfo(): any {
    if (!this._roleInfo) {
      this._roleInfo = BattleManager.Instance.battleModel.getRoleById(
        this._roleId,
      );
    }
    return this._roleInfo;
  }

  public set roleId(value: number) {
    this._roleId = value;
    this._roleInfo = BattleManager.Instance.battleModel.getRoleById(
      this._roleId,
    );
  }

  public get roleId(): number {
    return this._roleId;
  }

  /** 增加的生命上限 */
  public hpMaxAdd: number = 0;
}
