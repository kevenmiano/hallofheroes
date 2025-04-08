// @ts-nocheck

export default class SpaceNodeType{

/**
 * 静止不动的节点
 */		
 static  STATIC:number = 0;
/**
 *  运动的节点
 */		
static  MOVEMENT:number = 1;
/**
 *出生点
 */
static  BORN_POINT:number = 40;	
/**
 *NPC , 建筑
 */
static  TRIGGER:number = 42;	
/**
 *传送点 // 节点param1
 */
static PARAM_TRANSFER:number = 2;
/**
 * 传送点
 */		 
static  TRANSFER :number = 62;	
/**
 * * 藏宝图
 */		
static  TREASURE_MAP:number = 191;	
// 功能NPC 节点ID
		
/**
 * 悬赏
 */		
 static  ID_OFFER_REWARD:number = 1;
/**
* 英雄之门
 */		
 static  ID_PVE_ROOMLIST:number = 2;
/**
 * 英灵竞技
 */		
 static  ID_PET_CHALLENGE:number = 3;	
/**
 * 英灵岛
 */		
 static  ID_PET_LAND:number = 5;
/**
 * 多人竞技, 挑战
 */		
 static  ID_PVP:number = 6;
/**
 * 魔灵
 */		
 static  ID_VEHICLE_DAIMON_TRAIL:number = 7;
/**
 * 拍卖行, 市场
 */		
 static  ID_SUPER_MARKET:number = 8;	
/**
 * 紫晶矿场
 */		
 static  ID_AMETHYST_FIELD:number = 15;	
/**
 * 环任务
 */		
 static  ID_RING_TASK:number = 17;
/**
 * 藏宝图
 */		
 static  ID_TREASURE_MAP:number = 19;
/**
 * 天穹之径
 */		
 static  ID_SINGLE_PASS:number = 20;
/**
 * 英灵战役
 */
 static PET_CAMPAIGN:number = 70;
 /**
  * 英灵远征
  */
 static PET_REMOTE:number = 31;
 /**
	 * 泛指和2015新年礼箱节点类似的节点
	 * （300为非节日活动的宝物堆, 301-315为每月节日的宝物堆,410--三界争霸奖励）
	 */		
  public static  isYearNode($type:number):boolean
  {
      return ($type >= 300 && $type <= 315)||$type == 410;
  }
}