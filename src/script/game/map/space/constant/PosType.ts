/**
 * 地图上点的类型, 命名跟服务器同步
 * 
 */
export class PosType {
	/**
	 * 城堡类型--乡村
	 */
	static VILLAGE: number = 0;

	/**
	 * 城堡类型--主城
	 */
	static CASTLE: number = 1;

	/**
	 * 城堡类型--要塞
	 */
	static STRONGHOLD: number = 2;

	/**
	 * 资源类类型
	 */
	static RESOURCE: number = 20;

	/**
	 * NPC节点类型
	 */
	static NPC: number = 21;
	/**
	* 外城城池节点节点
	 */
	static OUTERCITY_CITY = 1;
	/**
	* 外城宝藏矿脉节点
	 */
	static OUTERCITY_TREASURE = 2;
	/**
	 * 外城金矿节点
	 */
	static OUTERCITY_MINE = 3;
	/**
	 * 外城BOSS节点
	 */
	static OUTERCITY_BOSS_NPC = 4;
	/**
	 * 外城精英怪节点
	 */
	static OUTERCITY_COMMON_JINGYING = 5;
	/**
	 * 外城普通小怪节点
	 */
	static OUTERCITY_COMMON_NPC = 6;
	/**
	 * 外城物资车节点
	 */
	static OUTERCITY_VEHICLE = 7;
	/**
	 * 金矿
	 */
	static TREASURE: number = 3;
	/**
	 * 宝矿
	 */
	static TREASURE_MINERAL: number = 2;
	/**
	 * 战役中的起点
	 */
	static COPY_START: number = 40;

	/**
	 * 战役中的终点 
	 */
	static COPY_END: number = 41;

	/**
	 * 战役中的npc 
	 */
	static COPY_NPC: number = 42;

	static SUBMIT_GOODS: number = 51;
	static PASS_CARD: number = 52;

	/**
	 *事件 但有鼠标手型
	 */
	static COPY_NPC_HANDLER: number = 161;

	/**
	 *事件 
	 */
	static COPY_HANDLER: number = 61;//
	/**
	 *跨地图传送 
	 */
	static COPY_MAP_SEND: number = 62;//
	/**
	 *地图内传送 
	 */
	static COPY_NODE_SEND: number = 63;
	static checkSendType(types: number): boolean {
		if (types == PosType.COPY_MAP_SEND || types == PosType.COPY_NODE_SEND) return true;
		return false;
	}
	/**
	 *带ai的npc 
	 */
	static COPY_AI: number = 64;
	/**
	 *标识 
	 */
	static COPY_LOGO: number = 71;
	/**
	 *静态对象 
	 */
	static STATIC: number = 81;
	/**
	 *动画对象 
	 */
	static MOVIE: number = 201;
	static COLLECTION: number = 91;
	/**
	 *掉落宝箱 
	 */
	static FALL_CHEST: number = 92;
	/**
	 * 未知类型
	 */
	static UNKNOW: number = 100;

	/**
	 *采集本机器人 
	 */
	static ROBOT: number = 101;

	/**
	 * 消灭怪物
	 */
	static ATTACK_HANDLER: number = 53;
	/**
	 * 死亡阻挡
	 * 
	 */
	static DIE_CROSSING: number = 121;
	/**
	 *敌方关卡 
	 * 
	 */
	static ENEMY_CROSSING: number = 131;
	/**
	 *塔防 
	 */
	static TOWER_DEFENCE: number = 141;
	/**
	 *炸弹人 公会秘境入侵者
	 */
	static BOMBER_MAN: number = 151;
	/**
	 *  公会秘境盗宝者  steal the treasure
	 */
	static TREASURE_HUNTER: number = 181;

	/**
	 * 传送点 双向 
	 */
	static COPY_NODE_SEND2: number = 171;
	/**
	 * 战场资源采集车
	 */
	static TRANSPORT_CAR: number = 1101;
	/**
	 *英灵岛boss中小怪类型 
		*/
	public static PET_BOSS_MONSTER: number = 1003;
	/**
	 * 紫晶矿场资源采集车
	 */
	static MINERAL_CAR: number = 1102;
	/** 挂机点 */
	static HOOK_NODE: number = 111;
	public static checkNeutralState(state: number): boolean {//是否是中立状态节点
		switch (state) {
			case PosType.COPY_HANDLER:
			case PosType.COPY_MAP_SEND:
			case PosType.FALL_CHEST:
			case PosType.STRONGHOLD:
			case PosType.ATTACK_HANDLER:
			case PosType.COPY_START:
			case PosType.COLLECTION://采集
				return true;
				break;
			default:
				return false;
		}
		return false;
	}

}
