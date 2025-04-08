
	/**
	 *  ui方面的常量
	 */	
	export class GameUIConfig
	{
		constructor()
		{
		}
		public static smallWidth  : number = 130;
		public static smallHeight : number = 130;
		
		public static FRAME_MENU 	 : number = 0;
		public static FRAME_CITY 	 : number = 1;
		public static FRAME_FIELD	 : number = 2;
		public static FRAME_NPC  	 : number = 3;
		public static FRAME_TREASURE : number = 4;
		
		public static ATTACK_RANGE   : number = 430; //攻击范围
		
		public static CASTLE_GAP   : number = 25;      //FRAME对齐位置
		public static HORSE_GAP    : number = 15;
		public static WILD_GAP     : number = 25;
		
		public static SMALL_MAP_SCALE    : number  =16    //小地图缩放比例   
		public static MAP_BORDER       : number  = 0x8B9886;//小地图矩形框颜色
		
		public static MOTION_ARMY_HEIGHT : number = 100;   //MENUFRAME弹出菜单高度
		public static MOTION_CASTLE_HEIGHT : number = 100;   
		public static MOTION_WILD_HEIGHT : number = 80;  
		
		
		
		public static TOP_LAYER : number = 2;
		public static CENTER_LAYER : number = 1;
		public static BUTTOM_LAYER : number = 0;
		
		public static UNIT_TILES_WIDTH : number = 20;
		public static UNIT_TILES_HEIGHT : number = 20;
	}