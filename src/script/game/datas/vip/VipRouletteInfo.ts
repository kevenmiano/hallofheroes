
	export class VipRouletteInfo
	{
		public LeftCount:number	// 剩余开启次数
		public NeedVipItem:number	// 所需VIP币
		public OpenIndex:any[];		// 获得位置
		public BoxTempIdList:any[];		// 剩余物品列表
		public TakedTempList:any[];	// 获得物品列表
		public IsStart:boolean;//是否开始
		public startType:number;  //启动类型, 0为普通开启, 1为一键开启
	}