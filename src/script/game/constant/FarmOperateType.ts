/**
 * 农场操作类型的枚举
 */
export enum FarmOperateType {
  /**
   *请求农场信息
   */
  REQ_FARM = 0,
  /**
   *种植
   */
  PLANT = 1,
  /**
   *除虫
   */
  WORM = 2,
  /**
   *除草
   */
  WEED = 3,
  /**
   *收获
   */
  PICK = 4,
  /**
   *偷取
   */
  STEAL = 5,
  /**
   *复活
   */
  REVIVE = 6,
  /**
   *加速
   */
  ACCELERATE = 7,
  /**
   *铲除
   */
  CLEAR = 8,
  /**
   *土地升级
   */
  LAND_UP = 9,
  /**
   *充能
   */
  GIVE_POWER = 10,
  /**
   *神树收获
   */
  TREE_PICK = 11,

  /** 修炼 Practice*/
  PET_PRACTICE_START = 12,
  /** 不修炼,  */
  PET_PRACTICE_CANCEL = 13,
  /** 收获 */
  PET_PRACTICE_COMPLETE = 14,
  /** 喂养 */
  PET_FEED = 15,
  /** 守护 */
  PET_DEFENSE = 16,

  /**
   *无操作
   */
  NO_OPER = 21,
  /**
   *弹出菜单
   */
  SHOW_MENU = 22,
}
