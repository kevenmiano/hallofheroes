/* eslint-disable @typescript-eslint/no-duplicate-enum-values */
/**
 * 公会升级类型
 *
 */
export enum ConsortiaUpgradeType {
  CONSORTIA = 1, //公会升级
  CONSORTIA_SHOP = 2, // 公会商店
  CONSORTIA_ALTAR = 3, // 升级祭司
  LING_SHI = 4, // 升级技能塔
  SAFE_DEPOSIT_BOX = 20, // 公会任务
  HIGH_SKILL = 15, // 进阶技能

  ATTACK = 6, // 升级攻击, 高级技能, 可学习
  DEFENCE = 7, // 升级防御, 高级技能, 可学习
  AGILITY = 8, // 护甲, 高级技能, 可学习
  ABILITY = 9, // 精神, 高级技能, 可学习
  CAPTAIN = 10, // 统帅, 高级技能, 可学习

  GOLD = 11, // 金币, 基本技能
  PHYSIQUE = 12, // 体质技能
  MAX_LEVEL = 10,
}
