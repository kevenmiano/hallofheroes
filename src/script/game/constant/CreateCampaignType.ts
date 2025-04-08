
	/**
	 *  各种创建副本的类型
	 */	
	export class CreateCampaignType
	{
		public static CREATE_TYPE_CREATE : number = 1;//战役创建军
		public static CREATE_TYPE_ENTER  : number = 2;//战役掉线进入
		public static CREATE_TYPE_TRANS  : number = 3;//战役切换
		public static CREATE_TYPE_INVENT : number = 4;//邀请进入
		public static CAMPAIGN_GAME      : number = -1;//副本游戏中
		
		
		public static checkGoToTeamChat(type : number) : boolean
		{
			switch(type)
			{
				case CreateCampaignType.CREATE_TYPE_CREATE:
				case CreateCampaignType.CREATE_TYPE_INVENT:
					return true;
			}
			return false;
		}
	}