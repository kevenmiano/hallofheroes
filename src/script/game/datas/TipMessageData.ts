// @ts-nocheck
import { GoodsInfo } from "./goods/GoodsInfo";

export class TipMessageData {


	public static CAMPAIGN_ADD_PAWN: number = 1;
	public static BETTER_GOODS: number = 2;
	public static BUY_BLOOD: number = 3;//购买血包
	public static INTENSIFY: number = 4;  //强化装备
	public static MOUNT: number = 5;//镶嵌宝石
	public static UPGRADE_PAWN: number = 6;  //升级兵种
	public static HASUNEQUIP: number = 7;//背包有未穿戴装备
	public static STAR: number = 8;//星云未满
	public static MILITARYTEC: number = 9;//军事科技
	public static GRADEBOX: number = 10;// 等级宝箱
	public static HOOKREWARD: number = 11;//挂机奖励提示
	public static OPEN_BAG: number = 13;
	public static TREE_CAN_PICK: number = 14;//神树可收获
	public static USE_WEARY: number = 16;//使用体力药水
	public static BUFFER: number = 17;//buffer消失提示
	public static TASK: number = 18;  //任务提示
	public static FARM_CAN_PICK: number = 19;  //农场可收获
	public static VIP_CARD: number = 20;  //vip体验卡
	public static VIP_GRADE: number = 21;  //vip升级
	public static VIP_GIFT: number = 22;  //vip礼包
	public static VIP_OPEN: number = 23;  //vip续费
	public static KINGCONTRACT: number = 24;  //魔王契约
	public static CALL_SECRET_TREE: number = 25; //召唤秘境神树
	public static DEMON_OPEN: number = 26; //魔神祭坛开启 
	public static PAWN_CHARACTERISTICS_TIP_VIEW: number = 27;
	public static MOUNT_OPEN_TIP_VIEW: number = 28;


	/**
	 * 老玩家回归活动提示
	 */
	public static REGRESSION_TIP_VIEW: number = 29;
	public static WARLORDS_BET: number = 30;  //武斗会下注
	public static FATE_GUARD: number = 31;  //命运守护
	public static PET_ADD_POINT: number = 32;  //出战英灵可加点
	public static SHOPTIMEBUY: number = 33;  //商城有限时物品购买
	public static VIP_MOUNT_ACTIVITY: number = 34;  //VIP专属坐骑激活
	public static VIP_MOUNT_LOSE: number = 35;  //VIP专属坐骑失效
	public static TREASURE_MAP: number = 36;
	public static EXP_BACK: number = 1000;//经验找回

	/** 战斗力提示 */
	public static FIGHTINGPROMPT: number = 37;
	/**
	 * 增加副本次数（新手宝箱）
	 */
	public static CAMPAIGN_CARD: number = 38;
	/**
	 * 推送VIP客服QQ
	 */
	public static VIP_CUSTOM: number = 39;
	public static DRAGON_SOUL_OPEN: number = 40;  //龙魂功能开启

	/** 天穹之路有剩余号角可领取 */
	public static SINGLEPASS_HAS_BUGLE: number = 41;
	public static PET_BOSS:number = 42;  //英灵岛boss
	public static OPENBOX_INTO_BAG: number = 43; //带快捷使用的宝箱进入背包
	public static MULTILORDS_BET : number = 45;  //多人武斗会下注





	public title: string = "";
	public name: string = "";
	public content: string = "";
	public type: number = 0;
	public icon: string = "";
	public btnTxt: string = "";
	public goods: GoodsInfo;
	public data: Object;
	
	public useCount: number = 0;

}