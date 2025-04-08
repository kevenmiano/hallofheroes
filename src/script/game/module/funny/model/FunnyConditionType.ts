// @ts-nocheck
/**
 * 精彩活动条件类型 
 * @author chance.li
 */
export default class FunnyConditionType {
	/**
	 * 坐骑升级
	 */
	public static MOUNTS_GRADES: number = 1;
	/**
	 * 玫瑰花赠送
	 */
	public static ROSE: number = 2;
	/**
	 * 老玩家回归
	 */
	public static OFF_LINE: number = 3;
	/**
	 * 玩家等级
	 */
	public static PLAYER_GRADES: number = 4;
	/**
	 * 装备属性
	 */
	public static EQUIP_ATTRIBUTE: number = 5;
	/**
	 * 合成宝石
	 */
	public static GEMSTONE_COMPOSE: number = 6;
	/**
	 * 荣誉值
	 */
	public static HONOR: number = 7;
	/**
	 * 占星
	 */
	public static STAR: number = 8;
	/**
	 * 消费
	 */
	public static POINT_USED: number = 9;
	/**
	 * 一次性充值
	 */
	public static RECHARGE_ONCE: number = 10;
	/**
	 * 物品兑换
	 */
	public static EXCHANGE: number = 11;
	/**
	 * 时装合成 
	 */
	public static FASHION_COMPOSE: number = 12;
	/**
	 * 活跃度
	 */
	public static ACTIVE_VALUE: number = 13;
	/**
	 * 登录礼包
	 */
	public static LOGIN: number = 14;
	/**
	 * 在线时长
	 */
	public static ON_LINE: number = 15;
	/**
	 * 时段性充值
	 */
	public static RECHARGE_TIME: number = 16;
	/**
	 * 一次性消费
	 */
	public static ONE_CONSUME: number = 17;
	/**
	 * 坐骑培养（坐骑培养N次）
	 */
	public static MOUNT_CULTIVATE: number = 18;

	/**
	 * 灵魂刻印（吞噬灵魂水晶N个）
	 */
	public static SOUL_STAMP: number = 19;

	/**
	 * 占星（占星N次）
	 */
	public static ASTROLOGY: number = 20;

	/**
	 * 炼金（炼金N次）
	 */
	public static ALCHEMY: number = 21;

	/**
	 * 炼魂（炼魂N次）
	 */
	public static REFINE_SOUL: number = 22;

	/**
	 * 悬赏任务（完成N次）
	 */
	public static REWARD: number = 23;

	/**
	 * 神秘商店（刷新N次）
	 */
	public static MYSTERY_FRESH: number = 24;

	/**
	 * 符文吞噬（吞噬N个指定符文）
	 */
	public static RUNE_SWALLOW: number = 25;

	/**
	 * 单人挑战（挑战N次）
	 */
	public static CHALLENGE: number = 26;

	/**
	 * 多人竞技（竞技N次）
	 */
	public static MULTI_CHALLENGE: number = 27;

	/**
	 * 战场击杀（击杀N人）
	 */
	public static WAR_FIELD_KILL: number = 28;
	/**
	 * ”其他”类型(描述型活动)
	 */
	public static OTHERS: number = 29;
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
	 *英灵等级排行达到N-N名
	 */
	public static PET_GRADE_RANK: number = 34;

	/**
	 *英灵战斗力排名达到N-N名
	 */
	public static PET_CAPACITY_RANK: number = 35;
	/**
	 * 神曲新人王, 战力之王(活动期间内, 个人战斗力排名前三的玩家可获得丰厚奖励)
	 */
	public static FIGHT_CAPACITY_RANKING: number = 36;

	/**
	 * 神曲新人王, 冲级之王(活动期间内, 个人等级排名前三的玩家可获得丰厚奖励)
	 */
	public static GRADE_RANKING: number = 37;

	/**
	 * 公会最疯狂, 大礼奖上奖(活动时间内, 公会达到N等级, 会长及其会员将可以获得丰厚的奖励)
	 */
	public static CONSORTIA_RANKING: number = 38;

	/**
	 * 悬赏奖励 : 活动期间, 完成不同品质的悬赏任务, 活动不同积分, 积分可以兑换礼包
	 */
	public static CONSORTIA_REWARD_SCORE: number = 39;

	/**
	 * 宝石数量 : 活动期间, 玩家物品背包与装备上, 大于某等级的宝石数量满足条件, 获得奖励
	 */
	public static CONSORTIA_STORE_COUNT: number = 40;

	/**
	 * 迷宫首杀 : 服务器第一个通过迷宫第N关玩家获取奖励
	 */
	public static CONSORTIA_TOWER_FIRST_BLOODER: number = 41;

	/**
	 * 坐骑升阶: 坐骑达到N阶领取奖励
	 */
	public static CONSORTIA_MOUNT_GREADE: number = 42;
	/**
	 * 坐骑培养打折: 活动期间坐骑培养 1-N 次 Y折...
	 */
	public static CONSORTIA_MOUNT_FOSTER: number = 43;

	/** 
	 * 刷新藏宝图获得奖励 
	 * */
	public static REFRESH_TREASURE_MAP_NUM: number = 44;

	/**
	 * 等级提升(20, 30, 40)获取奖励
	 * */
	public static UPGRADE_LEVEL: number = 45;

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
	  * 删档充值活动
	  */
	public static DELETE_CHARGE: number = 500;
	/**
	   * 炼符（炼符N次）
	   */
	public static RUNE: number = 100;
	/**
	 * 寻宝(寻宝N次）
	 */
	public static SEEK: number = 101;
	/**
	 * 卡牌吞噬（吞噬任意卡牌N张）
	 */
	public static POWCARD_EAT: number = 102;
	/**
	 * 卡牌升级(升级任意卡牌到N级）
	 */
	public static POWCARD_GRADE: number = 103;

	/**
	 * 卡牌获得(获得X品质的卡牌）
	 */
	public static POWCARD_GET_SPEC: number = 104;
	/**
	 *参与王者之塔 
	 */
	public static KINGTOWER_JOIN: number = 105;
	/**
	 * 祝福轮盘参与次数
	 */
	public static BLESS_COUNT: number = 106;
	/**
	 * 祝福轮盘%机制（达到指定%）
	 */
	public static BLESS_PRECENT: number = 107;

	/**
	 * 命运守护转盘次数（转动N次）
	 */
	public static FATE_TURN: number = 108;
	/**
	 * 命运守护吞噬（吞噬N个）
	 */
	public static FATE_EAT: number = 109;
	/**
	 *  英灵竞技（竞技N次）
	 */
	public static PET_CHALLENGE: number = 110;
	/**
	 * 紫金矿战（参与N次）
	 */
	public static MINEFIELD_BATTLE: number = 111;

	/**
	 捕鱼活动
	 */
	public static FISH_TIMES: number = 112;

	/**
	 天穹之境
	 */
	public static SINGLEPASS_TIMES: number = 113;


	/**
	 * 终身卡牌品质
	 */
	public static TYPE_ONLYONE_POWERCARD_PROFILE: number = 114;

	/**
	 * 终身时装合成
	 */
	public static TYPE_ONLYONE_FASHION_GRADES: number = 115;

	/**
	 * 终身荣誉
	 */
	public static TYPE_ONLYONE_HONOR: number = 116;

	/**
	 * 藏宝图参与战斗次数
	 */
	public static REASUREMAP_GET: number = 117;

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
	 * 时装吞噬
	 */
	public static FASHION_SWALLOW: number = 501;

	/**
	 * 符石升级
	 */
	public static RUNE_UPDATE: number = 502;

	/**
	 * 符孔雕刻
	 */
	public static RUNE_CARVE: number = 503;
	/**
	 * 删档冲级福利
	 */
	public static TYPE_DELETE_FILELEVEL: number = 504;

	/**
	 * 消耗体力
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
}