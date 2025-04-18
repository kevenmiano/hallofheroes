export enum PlayerEvent {
  //带两个参数
  //private var _info:SimplePlayerInfo;
  //public var prevGrade:int = 0;

  CASTLE_DEFENCE_TIME = "CASTLE_DEFENCE_TIME",
  POINT_CHANGE = "POINT_CHANGE",
  WEARY_CHANGE = "WEARY_CHANGE",
  FIRSTCHARGE = "FIRSTCHARGE",
  RELOGINPROCESS_UPDATE = "RELOGINPROCESS_UPDATE",
  SYSTIME_UPGRADE_DATE = "SYSTIME_UPGRADE_DATE",
  SYSTIME_UPGRADE_SECOND = "SYSTIME_UPGRADE_SECOND",
  SYSTIME_UPGRADE_MINUTE = "SYSTIME_UPGRADE_MINUTE",
  SYSTIME_UPGRADE_HOUR = "SYSTIME_UPGRADE_HOUR",
  TIMEBOX_UPDATE = "TIMEBOX_UPDATE",
  COMPOSE_LIST_CHANGE = "COMPOSE_LIST_CHANGE",
  PLAYER_SIGNSITE_CHANGE = "PLAYER_SIGNSITE_CHANGE",
  REISSUENUM_CHANGE = "REISSUENUM_CHANGE",
  REWARDSTATE_CHANGE = "REWARDSTATE_CHANGE",
  MONTH_CARD_CHANGE = "MONTH_CARD_CHANGE",
  PLAYER_INFO_UPDATE = "PLAYER_INFO_UPDATE",
  UPDATE_EXTRABUFFER = "UPDATE_EXTRABUFFER",

  PLAYER_STATE_CHANGE = "PLAYER_STATE_CHANGE",
  THANE_LEVEL_UPDATE = "THANE_LEVEL_UPDATE",
  THANE_EXP_UPDATE = "THANE_EXP_UPDATE",
  BLOOD_UPDATE = "BLOOD_UPDATE",
  BLOOD_VISIBLE_UPDATE = "BLOOD_VISIBLE_UPDATE",
  THANE_SKILL_POINT = "THANE_SKILL_POINT",
  SKILL_INDEX = "SKILL_INDEX",
  SKILL_SCRIPTS = "SKILL_SCRIPTS",
  SKILL_FAST_KEY = "SKILL_FAST_KEY",
  ACTIVE_DOUBLE_SKILL = "ACTIVE_DOUBLE_SKILL",
  ATTACK_COUNT_CHANGE = "ATTACK_COUNT_CHANGE",
  CONSORTIA_DUTY_CHANGE = "CONSORTIA_DUTY_CHANGE",
  CONSORTIA_OFFER_CHANGE = "CONSORTIA_OFFER_CHANGE",
  CONSORTIA_JIANSE_CHANGE = "CONSORTIA_JIANSE_CHANGE",
  CONSORTIA_CHANGE = "CONSORTIA_CHANGE",
  CONSORTIA_NAME_CHANGE = "CONSORTIA_NAME_CHANGE",
  IS_AUTO_CHANGE = "IS_AUTO_CHANGE",
  PLAYER_AVATA_CHANGE = "PLAYER_AVATA_CHANGE",
  SEMINARY_EFFECT = "SEMINARY_EFFECT",

  JEWELGP_UPDATE = "JEWELGP_UPDATE",
  JEWELGRADES_UPDATE = "JEWELGRADES_UPDATE",

  THANE_INFO_UPDATE = "THANE_INFO_UPDATE",
  THANE_FASTKEY_UPDATE = "THANE_FASTKEY_UPDATE",

  TREE_INFO_UPDATE = "TREE_INFO_UPDATE",
  LOGIN_SUCCESS = "LOGIN_SUCCESS",

  BAG_CAPICITY_INCRESS = "BAG_CAPICITY_INCRESS",
  STAR_FREECOUNT_CHANGE = "STAR_FREECOUNT_CHANGE",
  STARBAG_CAPICITY_INCRESS = "STARBAG_CAPICITY_INCRESS", //星运背包格子数量增加
  STAR_POINT_UPDATE = "STAR_POINT_UPDATE", //占星积分更新
  HERO_CAPICITY_INCRESS = "HERO_CAPICITY_INCRESS",
  NICKNAME_UPDATE = "NICKNAME_UPDATE",
  PLAYER_HONOR = "PLAYER_HONOR",
  PLAYER_HONOR_DAY = "PLAYER_HONOR_DAY",
  PLAYER_HONOR_DAY_MAX = "PLAYER_HONOR_DAY_MAX",

  REFRESH_PLAYER_LIST = "REFRESH_PLAYER_LIST",
  UPDATE_TOWER_INFO = "UPDATE_TOWER_INFO", // 试炼之塔信息更新
  GET_KING_BUFF = "GET_KING_BUFF", //精灵盟约中领取专属Buff
  WORLDPROSPERITY = "WORLDPROSPERITY", //世界繁荣度
  GVGISOPEN = "GVGISOPEN", //公会战
  MINERAL = "MINERAL", //紫晶矿场活动开启/关闭
  WORLDBOSSSTATE = "WORLDBOSSSTATE", //世界boss是否开启
  ISPVPSTART = "ISPVPSTART", //竞技场是否开启
  PVP_CONUT_CHANGE = "PVP_CONUT_CHANGE", //战场进入次数
  APPELL_CHANGE = "APPELL_CHANGE", //称号id改变
  SMALL_BUGLE_FREE_COUNT = "SMALL_BUGLE_FREE_COUNT", //小喇叭免费次数改变
  CROSS_SCORE_RAWARD = "CROSS_SCORE_RAWARD", //可以领取跨服奖励
  /** 载具活动开启 */
  VEHICLESTART = "VEHICLESTART",

  VEHICLE_GP = "VEHICLE_GP",
  PLAYER_VEHICLE_CHANGE = "PLAYER_VEHICLE_CHANGE",
  PLAYER_VEHICLEINFO_CHANGE = "PLAYER_VEHICLEINFO_CHANGE",
  GLORY_CHANGE = "GLORY_CHANGE",
  PLAYER_PET_LIST_CHANGE = "PLAYER_PET_LIST_CHANGE",
  MUTICOPY_COUNT = "MUTICOPY_COUNT", // 多人本次数改变
  TAILA_COUNT = "TAILA_COUNT", // 泰拉神庙次数改变
  MUTICOPY_MAX_COUNT = "MUTICOPY_MAX_COUNT",

  DRAGON_SOUL_TYPE = "DRAGON_SOUL_TYPE",
  DRAGON_SOUL_GRADE = "DRAGON_SOUL_GRADE",
  DRAGON_SOUL_GP = "DRAGON_SOUL_GP",

  DRAGON_SOUL_TRANSFER = "DRAGON_SOUL_TRANSFER",
  GROWTHFUND = "GROWTHFUND",
  CHALLREWARD = "CHALLREWARD",
  CONSORTIA_COIN_CHANGE = "CONSORTIA_COIN_CHANGE",
  PET_BOSS = "PET_BOSS",
  RUNE_GEM_BAG_CAPICITY = "RUNE_GEM_BAG_CAPICITY",
  RUNE_GEM_ENERGY = "RUNE_GEM_ENERGY",
  PET_BAG_CAPICITY = "PET_BAG_CAPICITY",
  MICRO_APP_EVENT = "MICRO_APP_EVENT",
  LAST_FREESKILL_LEARN_TIME = "LAST_FREESKILL_LEARN_TIME",
  IS_BIND_VERTIFY_PROMPTED = "IS_BIND_VERTIFY_PROMPTED",
}
