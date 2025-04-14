/*
 * @Author: jeremy.xu
 * @Date: 2023-11-03 14:05:25
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-11-16 15:38:22
 * @Description: 外城城战常量
 */

/** 建筑驻防点操作类型 */
export enum EmOuterCityWarBuildSiteOptType {
  /** 你无法参加城战：不在参战列表中的玩家、被击退公会的参战玩家 */
  CANNOT_OPT,
  /** 可设置防守 */
  CAN_SETTING_DEFENCE,
  /** 同公会无法攻击：该位置防守玩家为同公会玩家 */
  CANNOT_ATTACK_SAME_GUILD,
  /** 可放弃 */
  CAN_GIVEUP,
  /** 可占领  */
  CAN_OCCUPY,
  /** 战斗中  */
  FIGHTING,
  /** 可攻击 */
  CAN_ATTACK,
}

/** 玩家、英灵状态: 1空闲 2驻防 3被击退  */
export enum EmOuterCityWarPlayerState {
  FREE = 1,
  DEFANCE,
  REPULSED,
}

/** 建筑驻防点状态: 1驻防  3无人占领 4战斗中*/
export enum EmOuterCityWarBuildSiteState {
  DEFANCE = 1,
  NOCCUPIED = 3,
  FIGHTING = 4,
}

/** 建筑大类型 */
export enum EmOuterCityWarBuildSortType {
  /** 攻击方阵营建筑 */
  AttackSite,
  /** 英雄建筑 */
  Hero,
  /** 英灵建筑 */
  Pet,
}

/** 城堡处于的时期 */
export enum EmOuterCityWarCastlePeriodType {
  None,
  Peace = 1, // 和平期: 每天23:00-7:59为和平期，无法争夺城堡
  DeclareWar, // 宣战期: 每天8:00-20:59，可随时发起宣战
  DeclaringWar, // 备战期：发起宣战后，进入1小时备战期
  Fighting, // 城战期：备战期结束，进入1小时城战期
  Protected, // 保护期：城战结束，进入4小时保护期
}

/** 英雄类型 */
export enum EmOuterCityWarHeroType {
  Hero = 1,
  Npc,
}
