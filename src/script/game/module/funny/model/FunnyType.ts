/**
 * 精彩活动类型
 */
export default class FunnyType {
  /**
   * 激活码ID（自定义）
   */
  public static ACTIVITY_CODE_ID: string = "ACTIVITY_CODE_ID";
  /**
   * 限时热购ID（自定义）
   */
  public static HOT_BUY_ID: string = "HOT_BUY_ID";
  /**
   * VIP限时热购ID（自定义）
   */
  public static VIP_BUY_ID: string = "VIP_BUY_ID";

  /**
   * 捕鱼活动ID（自定义）
   */
  public static FISH_TIMES_ID: string = "FISH_TIMES_ID";

  /**
   * 天穹之境ID（自定义）
   */
  public static SINGLEPASS_TIMES_ID: string = "SINGLEPASS_TIMES_ID";

  /**
   * 激活码类型（自定义）
   */
  public static ACTIVITY_CODE_TYPE: number = 1001;
  /**
   * 限时热购类型（自定义）
   */
  public static HOT_BUY_TYPE: number = 1002;
  /**
   * 游戏补偿类型（自定义）
   */
  public static REDEEMING_TYPE: number = 1003;
  /**
   * VIP限时热购类型（自定义）
   */
  public static VIP_BUY_TYPE: number = 1004;
  /**
   * 全民兑换（自定义）
   */
  public static TYPE_ALL_EXCHANGE: number = 1005;
  /**
   * 记忆翻牌（自定义）
   */
  public static TYPE_MEMORYCARD: number = 1006;
  /**
   * 幸运兑换（自定义）
   */
  public static LUCKY_EXCHANGE: number = 1007;
  /**
   * 丰收号角（自定义）
   */
  public static FOISON_HORN: number = 1008;
  /**
   * 黄金神树（自定义）
   */
  public static GOLDEN_TREE: number = 1009;
  /**
   * 充值轮盘（自定义）
   */
  public static RECHARGE_LOTTERY: number = 1010;
  /**
   * 幸运盲盒（自定义）
   */
  public static LUCK_BLIND_BOX: number = 1011;
  /**
   * 超值团购礼包(自定义)
   */
  public static SUPER_GIFTOFGROUP: number = 1012;
  /**
   * 消费
   */
  public static TYPE_CONSUM: number = 1;
  /**
   * 坐骑升级
   */
  public static TYPE_HOURSE: number = 2;
  /**
   * 玫瑰花赠送
   */
  public static TYPE_ROSE: number = 3;
  /**
   * 老玩家回归
   */
  public static TYPE_LEAVE: number = 4;
  /**
   * 装备洗练
   */
  public static TYPE_EQUIP: number = 5;
  /**
   * 宝石合成
   */
  public static TYPE_STORE: number = 6;
  /**
   * 荣誉值
   */
  public static TYPE_HONOR: number = 7;
  /**
   * 占星（占出{0}个{1}品质的星运）
   */
  public static TYPE_STAR: number = 8;
  /**
   * 一次性充值
   */
  public static TYPE_CHARGE: number = 9;
  /**
   * 物品兑换
   */
  public static TYPE_EXCHANGE: number = 10;
  /**
   * 时装合成
   */
  public static TYPE_FASHION_COMPOSE: number = 11;
  /**
   * 活跃度
   */
  public static TYPE_ACTIVE_NUM: number = 12;
  /**
   * 玩家登录
   */
  public static TYPE_LOGIN: number = 13;
  /**
   * 在线时长
   */
  public static TYPE_ONLINE: number = 14;
  /**
   * 时段性充值
   */
  public static RECHARGE_TIME: number = 15;
  /**
   * 一次性消费
   */
  public static TYPE_ONE_CONSUME: number = 16;
  /**
   * 坐骑培养（坐骑培养N次）
   */
  public static TYPE_MOUNT_CULTIVATE: number = 18;
  /**
   * 灵魂刻印（吞噬灵魂水晶N个）
   */
  public static TYPE_SOUL_STAMP: number = 19;
  /**
   * 占星（占星N次）
   */
  public static TYPE_ASTROLOGY: number = 20;
  /**
   * 炼金（炼金N次）
   */
  public static TYPE_ALCHEMY: number = 21;
  /**
   * 炼魂（炼魂N次）
   */
  public static TYPE_REFINE_SOUL: number = 22;
  /**
   * 悬赏任务（完成N次）
   */
  public static TYPE_REWARD: number = 23;
  /**
   * 神秘商店（刷新N次）
   */
  public static TYPE_MYSTERY_FRESH: number = 24;
  /**
   * 符文吞噬（吞噬N个指定符文）
   */
  public static TYPE_RUNE_SWALLOW: number = 25;
  /**
   * 单人挑战（挑战N次）
   */
  public static TYPE_CHALLENGE: number = 26;
  /**
   * 多人竞技（竞技N次）
   */
  public static TYPE_MULTI_CHALLENGE: number = 27;
  /**
   * 战场击杀（击杀N人）
   */
  public static TYPE_WAR_FIELD_KILL: number = 28;
  /**
   * “其他”类型（描述型活动）
   */
  public static TYPE_OTHERS: number = 29;
  /**
   * 英灵资质培养到N
   */
  public static PET_QUALITY: number = 30;

  /**
   * 英灵等级达到N级
   */
  public static PET_GRADE: number = 31;

  /**
   * 英灵战斗力达到N
   */
  public static PET_FIGHT_CAPACITY: number = 32;
  /**
   *英灵等级排行达到N名
   */
  public static PET_GRADE_RANK: number = 34;
  /**
   *英灵战斗力排名达到N名
   */
  public static PET_CAPACITY_RANK: number = 35;
  /**
   * 神曲新人王, 战力之王(活动期间内, 个人战斗力排名前三的玩家可获得丰厚奖励)
   */
  public static TYPE_FIGHT_CAPACITY: number = 36;

  /**
   * 神曲新人王, 冲级之王(活动期间内, 个人等级排名前三的玩家可获得丰厚奖励)
   */
  public static TYPE_GRADE_RANKING: number = 37;

  /**
   * 公会最疯狂, 大礼奖上奖(在活动时间内, 公会达到相应等级, 会长及其会员将可以获得丰厚的奖励)
   */
  public static TYPE_CONSORTIA_RANKING: number = 38;
  /**
   * 悬赏奖励 : 活动期间, 完成不同品质的悬赏任务, 活动不同积分, 积分可以兑换礼包
   */
  public static TYPE_REWARD_SCORE: number = 39;

  /**
   * 宝石数量 : 活动期间, 玩家物品背包与装备上, 大于某等级的宝石数量满足条件, 获得奖励
   */
  public static TYPE_STORE_COUNT: number = 40;

  /**
   * 迷宫首杀 : 服务器第一个通过迷宫第N关玩家获取奖励
   */
  public static TYPE_TOWER_FIRST_BLOODER: number = 41;

  /**
   * 坐骑升阶: 坐骑达到N阶领取奖励
   */
  public static TYPE_MOUNT_GREADE: number = 42;
  /**
   * 坐骑培养打折: 活动期间坐骑培养 1-N 次 Y折...
   */
  public static TYPE_MOUNT_FOSTER: number = 43;
  /**
   * 刷新藏宝图获得奖励
   * */
  public static REFRESH_TREASURE_MAP_NUM: number = 44;

  /** 升级等级(20 ,30 , 40)获得奖励 */
  public static UPGRAD_LEVEL: number = 45;

  /**
   * 合成守护水晶获得奖励
   * */
  public static COMPOSITE_GUARD_CRYSTAL: number = 46;

  /**
   * 精彩活动: 英灵晋阶
   */
  public static PET_GROWUP: number = 47;
  /**
   * 精彩活动: 英灵强化
   */
  public static PET_APTITUDE: number = 48;
  /**
   * 炼符（炼符N次）
   */
  public static TYPE_RUNE: number = 100;
  /**
   * 寻宝(寻宝N次）
   */
  public static TYPE_SEEK: number = 101;
  /**
   * 卡牌吞噬（吞噬任意卡牌N张）
   */
  public static TYPE_POWCARD_EAT: number = 102;
  /**
   * 卡牌升级(升级任意卡牌到N级）
   */
  public static TYPE_POWCARD_GRADE: number = 103;

  /**
   * 卡牌获得(获得X品质的卡牌）
   */
  public static TYPE_POWCARD_GET_SPEC: number = 104;
  /**
   *参与王者之塔
   */
  public static TYPE_KINGTOWER_JOIN: number = 105;
  /**
   * 祝福轮盘参与次数
   */
  public static TYPE_BLESS_COUNT: number = 106;
  /**
   * 祝福轮盘%机制（达到指定%）
   */
  public static TYPE_BLESS_PRECENT: number = 107;

  /**
   * 命运守护转盘次数（转动N次）
   */
  public static TYPE_FATE_TURN: number = 108;
  /**
   * 命运守护吞噬（吞噬N个）
   */
  public static TYPE_FATE_EAT: number = 109;
  /**
   *  英灵竞技（竞技N次）
   */
  public static TYPE_PET_CHALLENGE: number = 110;
  /**
   * 紫金矿战（参与N次）
   */
  public static TYPE_MINEFIELD_BATTLE: number = 111;

  /**
	 捕鱼活动
	 */
  public static FISH_TIMES_TYPE: number = 112;

  /**
	 天穹之境
	 */
  public static SINGLEPASS_TIMES_TYPE: number = 113;

  /**
   * 藏宝图参与战斗次数
   */
  public static TYPE_REASUREMAP_GET: number = 117;

  /**
   * 累计充值（特殊其他活动添加至精彩活动）
   */
  public static TYPE_CUMULATIVE_RECHARGE: number = 99999;

  /**
   * 累计充值天数
   */
  public static TYPE_CUMULATIVE_RECHARGE_DAY: number = 166;

  /**
   * 七日登录
   */
  public static TYPE_SEVEN_LOGIN_DAY: number = 131;

  /**
   * 时装等级达阶
   */
  public static FASHION_LEVEL_UPGRADE: number = 185;

  /**
   * 守卫英灵岛击杀X只愤怒的中级英灵（单次每日）
   */
  public static PETLAND_KILL_MIDDLE: number = 193;
  /**
   * 守卫英灵岛击杀X只愤怒的高级英灵（单次每日）
   */
  public static PETLAND_KILL_SENIOR: number = 194;
  /**
   * 删档充值活动
   */
  public static TYPE_DELETE_CHARGE: number = 500;

  /**
   * 时装吞噬
   */
  public static TYPE_FASHION_SWALLOW: number = 501;

  /**
   * 符石升级
   */
  public static TYPE_RUNE_UPDATE: number = 502;

  /**
   * 符孔雕刻
   */
  public static TYPE_RUNE_CARVE: number = 503;

  /**
   * 删档冲级福利
   */
  public static TYPE_DELETE_FILELEVEL: number = 504;

  /**
   * 体力消耗
   */
  public static TYPE_COST_STAMINA: number = 505;

  /**
   * 公会战消耗行动力
   */
  public static TYPE_CONSORTIA_ACTION_POINT: number = 506;

  /**
   * 英灵装备培养
   */
  public static TYPE_PET_EQUIP_CULTIVATE: number = 507;

  /**
   * 功勋培养
   */
  public static TYPE_MERITOR_CULTIVATE: number = 508;

  /**
   * 消耗龙晶进行龙纹升级
   */
  public static TYPE_TATTOO_UPGRADE: number = 509;

  public static isShowProcess(type: number): boolean {
    var b: boolean = false;
    switch (type) {
      case FunnyType.TYPE_CONSUM:
      case FunnyType.TYPE_HOURSE:
      case FunnyType.TYPE_EQUIP:
      case FunnyType.TYPE_HONOR:
      case FunnyType.TYPE_EXCHANGE:
      case FunnyType.TYPE_MOUNT_CULTIVATE:
      case FunnyType.TYPE_SOUL_STAMP:
      case FunnyType.TYPE_ASTROLOGY:
      case FunnyType.TYPE_ALCHEMY:
      case FunnyType.TYPE_REFINE_SOUL:
      case FunnyType.TYPE_REWARD:
      case FunnyType.TYPE_MYSTERY_FRESH:
      case FunnyType.TYPE_RUNE_SWALLOW:
      case FunnyType.TYPE_CHALLENGE:
      case FunnyType.TYPE_MULTI_CHALLENGE:
      case FunnyType.TYPE_WAR_FIELD_KILL:
      case FunnyType.TYPE_ACTIVE_NUM:
      case FunnyType.TYPE_REWARD_SCORE:
      case FunnyType.PET_GROWUP:
      case FunnyType.PET_APTITUDE:
      case FunnyType.TYPE_RUNE:
      case FunnyType.TYPE_SEEK:
      case FunnyType.TYPE_POWCARD_EAT:
      case FunnyType.TYPE_KINGTOWER_JOIN:
      case FunnyType.TYPE_BLESS_COUNT:
      case FunnyType.TYPE_BLESS_PRECENT:
      case FunnyType.TYPE_FATE_TURN:
      case FunnyType.TYPE_FATE_EAT:
      case FunnyType.TYPE_PET_CHALLENGE:
      case FunnyType.TYPE_MINEFIELD_BATTLE:
      case FunnyType.TYPE_REASUREMAP_GET:
      case FunnyType.TYPE_STORE_COUNT:
      case FunnyType.TYPE_FASHION_SWALLOW:
      case FunnyType.TYPE_RUNE_UPDATE:
      case FunnyType.TYPE_RUNE_CARVE:
      case FunnyType.TYPE_COST_STAMINA:
      case FunnyType.TYPE_CONSORTIA_ACTION_POINT:
      case FunnyType.TYPE_TATTOO_UPGRADE:
        b = true;
        break;
      default:
        b = false;
        break;
    }
    return b;
  }
}
