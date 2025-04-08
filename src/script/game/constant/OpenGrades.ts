/**
 * 各功能开放等级的枚举 同步t_s_levelupprompt
 */
export default class OpenGrades {
	public static INVALID: number = 999;
	/**
	 * 4级 顶部工具条 
	*/
	public static TOPTOOL_BAR: number = 4;
	/**
	 * 5级 
	 */
	public static BAG: number = 5;
	/**
	 * 5级 兵营
	 */
	public static ARMY: number = 5;
	/**
	 * 5级 单人挑战
	 */
	public static PVE_CAMPAIGN: number = 5;
	public static RETURN: number = 5;
	/**
	 * 6级 新手矿脉
	 */
	public static NEWBIE_MINE: number = 6;
	/**
	 * 6级 战斗聊天
	 */
	public static BATTLE_CHAT: number = 6;
	/**
	 * 6级 技能
	 */
	public static SKILL: number = 6;
	/**
	 * 8级 精彩活动
	 */
	public static FUNNY: number = 8;
	/**
	 * 8级 福利
	 */
	public static WELFARE: number = 8;
	/**
	 * 9级 商城、幸运轮盘
	 */
	public static SHOP: number = 9;
	/**
	 * 9级 首充、充值回馈礼包
	 */
	public static FIRST_PAY: number = 9;
	/**
	 * 9级 仓库
	 */
	public static CANGKU: number = 9;
	/**
	 * 9级 强化
	 */
	public static INTENSIFY: number = 9;
	/**
	 * 11级 传送阵
	 */
	public static TRANSFER: number = 11;
	/**
	 * 12级 社交
	 */
	public static FRIEND: number = 12;
	/**
	 * 12级 农场
	 */
	public static FARM: number = 12;
	/**
	 * 13级 公会
	 */
	public static CONSORTIA: number = 13;
	/**
	 * 14级 炼金
	 */
	public static ALCHEMY: number = 14;
	/**
	 * 15级 镶嵌、合成
	 */
	public static INSERT: number = 15;
	/**
	 * 15级 进入天空之城
	 */
	public static ENTER_SPACE: number = 15;
	/**
	 * 15级 主界面排行榜
	 */
	public static RANK: number = 15;
	/**
	 * 15级 战斗撤退
	 */
	public static BATTLE_WITHDRAW: number = 15;
	/**
	 * 16级 挑战
	 */
	public static PVP_COLOSSEUM: number = 16;
	/**
	 * 17级 悬赏
	*/
	public static OFFER_REWARD: number = 17;
	/**
	 * 18级 神学院
	*/
	public static SEMINARY: number = 18;
	/**
	 * 19级 洗练、分解、转换
	*/
	public static REFRESH: number = 19;
	/**
	 * 20级 英雄之门
	 */
	public static PVE_MUlTI_CAMPAIGN: number = 20;
	/**
	 * 20级 世界boss、多人副本
	 */
	public static WORLD_BOSS: number = 20;
	/**
	 * 21级 修行神殿
	 */
	public static HOOK: number = 21;
	/**
	 * 问卷调查
	 */
	public static QUESTION_NAIRE: number = 20;

	/**
	 * 20级 紫金矿产双倍
	 */
	public static MINERAL_DOUBLE: number = 20;
	/**
	 * 32级 多人竞技
	 */
	public static CHALLENGE: number = 32;
	/**
	 * 23级 地下迷宫
	 */
	public static MAZE: number = 23;
	/**
	 *24级  聚魂
	 */
	public static SOULMAKE: number = 24;
	/**
	 * 25级 占星、紫晶矿场
	 */
	public static STAR: number = 25;
	/**
	 * 26级 神秘商店
	 */
	public static MYSTERIOUS: number = 26;
	/**
	 * 28级 捕鱼 
	 */
	public static FISH: number = 28;
	/**
	 * 30级 战场、称号
	 */
	public static RVR: number = 30;
	/**
	 * 35级 灵魂刻印、魔灵、众神竞猜、符文、天赋、符石
	 */
	public static VEHICEL: number = 35;
	/**
	 * 35级 坐骑
	*/
	public static MOUNT: number = 35;
	/**
	 * 37级 符孔
	 */
	public static RUNE_OPEN: number = 37;
	/**
	 * 38级 双技能
	 */
	public static DOUBLE_SKILL: number = 38;
	/**
	 * 40级 铁匠铺-神铸
	 */
	public static STORE_FOUND: number = 40;
	/**
	 * 40级 英灵
	 */
	public static PET: number = 40;
	/**
	 * 40级 泰坦之战
	 */
	public static MULTILORD: number = 40;
	/**
	 * 41级 神学院祈福
	 */
	public static SEMINARY_ALTAR: number = 41;
	/**
	 * 45级 夺宝奇兵
	 */
	public static GEM_MAZE: number = 45;
	/**
	 * 46级 试练之塔
	 */
	public static TRIAL: number = 46;
	/**
	 * 50级 天赋  config里面的不准确
	 */
	public static TALENT: number = 50;
	/**
	 * 55级 秘境
	 */
	public static PVE_SECRET: number = 55;
	/**
	 * 55级 藏宝图
	 */
	public static TREASURE_MAP: number = 55;
	/**
	 * 60级 诸神降临
	 */
	public static GOD_ARRIVE: number = 60;

	public static SPACE_COLLECT: number = 35;//天空之城礼物堆采集等级要求

	/**
	 * 玩家最大等级
	 */
	public static MAX_GRADE: number = 80;

	/**
	* 英灵远征
	*/
	public static REMOTEPET: number = 45;

	/**
	 * 自动占星
	 */
	public static AUTO_STAR: number = 35;

	/**
	 * 一键占星
	 */
	public static ONEKEY_STAR: number = 35;

	//英灵战役
	public static PET_CAMPAIGN: number = 40;

	//英灵竞技
	public static PET_PVP: number = 50;
	//命运守护
	public static FORTUNE_GUARD: number = 55;
	//龙纹
	public static TATTOO: number = 55;
	//功能开放提示10级出现
	public static SHOW_FUNOPEN_TIP: number = 10;

	/**
	* 内城市场
	*/
	public static MARKET: number = 40;
	/**
	* 专精
	*/
	public static MASTERY: number = 55;


	//活动日程
	public static ACTIVITY_TIME: number = 15;
}
