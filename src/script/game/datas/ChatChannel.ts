import LangManager from '../../core/lang/LangManager';

/**
 * 聊天频道
 * 
 */
export class ChatChannel {
	public static ALL: number = 0;
	public static BIGBUGLE: number = 1;           // 本区大喇叭 
	public static SYSTEM: number = 2;             // 系统
	public static INFO: number = 3;               // 信息
	public static PERSONAL: number = 20;          // 私聊
	public static CONSORTIA: number = 5;          // 公会
	public static TEAM: number = 6;               // 组队
	public static ALERT: number = 7;              // 屏幕中間顯示 
	public static CURRENT: number = 8;            // 当前
	public static WORLD: number = 10;             // 小喇叭
	public static SYS_ALERT: number = 11;         // 系统广播
	public static NOTICE: number = 12;				// 公告
	public static CROSS_BIGBUGLE: number = 13;    // 跨区大喇叭
	public static channels: any[] = [1, 10, 6, 5, 8, 2, 7, 3, 11, 12];
	public static GOLD_BIGBUGLE: number = 15;//黄金神树大喇叭
	public static BATTLE_CHAT: number = 16;//战斗聊天
	//		public static channels:any[] = [13,1,10,6,5,8,2,7,3,11,12];
	public static chanel_key_set: any[] = ["d", "x", "p", "g", "a"];//本区大喇叭 小喇叭 组队 工会 当前
	//		public static chanel_key_set:any[] = ["k","d","x","p","g","a"];//跨区大喇叭 本区大喇叭 小喇叭 组队 工会 当前

	public static BOTTLE: number = 21;                    //魔罐
	public static GROUPCHAT_INFO: number = 98;			//公会聊天 公会信息
	public static GROUPCHAT_SELF: number = 99;			//公会聊天 自己说的话
	public static GROUPCHAT_SELF_NAME: number = 101;	    //公会聊天 自己的名字
	public static GROUPCHAT_OTHER: number = 100;		    //公会聊天 别人说的话
	public static GROUPCHAT_OTHER_NAME: number = 102;	    //公会聊天 别人的名字
	public static MYSTERYSHOP_LUCKYPLAYER: number = 103;	//神秘商店幸运玩家列表
	public static CHAT_POP: number = 104;				    //副本聊天泡泡
	public static BUBBLETYPE_SELF: number = 105;    // 私聊自己
	public static BUBBLETYPE_TARGET: number = 106;    // 私聊目标
	public static getChatChannelName(channel: number): string {
		switch (channel) {
			case ChatChannel.CROSS_BIGBUGLE:
				return LangManager.Instance.GetTranslation("chat.datas.getChatChannelName.CrossBUGLE");
				break;
			case ChatChannel.BIGBUGLE:
				return LangManager.Instance.GetTranslation("chat.datas.getChatChannelName.BIGBUGLE");
				break;
			case ChatChannel.WORLD:
				return LangManager.Instance.GetTranslation("chat.datas.getChatChannelName.SMALLBUGLE");
				break;
			case ChatChannel.SYSTEM:
			case ChatChannel.SYS_ALERT:
				return LangManager.Instance.GetTranslation("chat.datas.getChatChannelName.ALERT");
				break;
			case ChatChannel.INFO:
				return LangManager.Instance.GetTranslation("chat.datas.getChatChannelName.INFO");
				break;
			case ChatChannel.PERSONAL:
				return LangManager.Instance.GetTranslation("public.privateChat");
				break;
			case ChatChannel.CONSORTIA:
				return LangManager.Instance.GetTranslation("public.consortia");
				break;
			case ChatChannel.TEAM:
				return LangManager.Instance.GetTranslation("chat.datas.getChatChannelName.TEAM");
				break;
			case ChatChannel.CURRENT:
				return LangManager.Instance.GetTranslation("chat.view.ChatInputView.channel");
				break;
			case ChatChannel.NOTICE:
				return LangManager.Instance.GetTranslation("chat.view.ChatInputView.NOTICE");
				break;
			case ChatChannel.GOLD_BIGBUGLE:
				return LangManager.Instance.GetTranslation("chat.view.ChatInputView.NOTICE");
				break;
		}
		return LangManager.Instance.GetTranslation("chat.datas.getChatChannelName.UNKNOWN");
	}
	public static getChatChannelColoer(channel: number): number {
		switch (channel) {
			case ChatChannel.CROSS_BIGBUGLE:
				return 0xffba01;
				break;
			case ChatChannel.BIGBUGLE:
			case ChatChannel.GOLD_BIGBUGLE:
				return 0x00d8ff;
				break;
			case ChatChannel.WORLD:
				return 0xeb9504;
				break;
			case ChatChannel.SYSTEM:
			case ChatChannel.SYS_ALERT:
				return 0xfff600;
				break;
			case ChatChannel.INFO:
				return 0xfff600;
				break;
			case ChatChannel.PERSONAL:
				return 0xf66ffa;
				break;
			case ChatChannel.CONSORTIA:
				return 0x4cd551;
				break;
			case ChatChannel.TEAM:
				return 0x939dff;
				break;
			case ChatChannel.CURRENT:
				return 0xffffff;
				break;
			case ChatChannel.NOTICE:
				return 0xfff600;
				break;
		}
		return 0xffffff;
	}


	public static getChatChannelColor(channel: number): string {
		switch (channel) {
			case ChatChannel.CROSS_BIGBUGLE:
				return "#ffba01";
				break;
			case ChatChannel.BIGBUGLE:
			case ChatChannel.GOLD_BIGBUGLE:
				return "#00d8ff";
				break;
			case ChatChannel.WORLD:
				return "#ffecc6";
				break;
			case ChatChannel.SYSTEM:
			case ChatChannel.SYS_ALERT:
				return "#ffc68f";
				break;
			case ChatChannel.INFO:
				return "#fff600";
				break;
			case ChatChannel.PERSONAL:
				return "#ff77dd";
				break;
			case ChatChannel.CONSORTIA:
				return "#9ffb4e";
				break;
			case ChatChannel.TEAM:
				return "#a9b1ff";
				break;
			case ChatChannel.CURRENT:
				return "#ffecc6";
				break;
			case ChatChannel.NOTICE:
				return "#fff600";
				break;
		}
		return "#ffffff";
	}

	public static getChannelFormat(channel: number): any {//用户可以输入的频道: 当前, 组队, 公会, 世界, 大喇叭
		// return ComponentFactory.Instance.model.getSet("chatII.InputChannelTF_" + channel);
		return null;
	}

	/**获取表情链接地址 */
	public static getEmojiIconUrl(index: number): string {
		let faceIndex = index + 1;
		let tempIndex: string = faceIndex.toString();
		if (Number(tempIndex) < 10) {
			tempIndex = "0" + tempIndex;
		}
		// let iconUrl: string = "asset.chatII.Expression" + tempIndex;
		let iconUrl: string = 'face' + tempIndex+'.png';
		iconUrl = "<img src='res/game/face/"+iconUrl+"'" + " width='45px' height='45px'></img>";
		return iconUrl;
		// return FUIHelper.getItemURL('Base', iconUrl);;
	}

	/**获取系统频道图标 */
	public static getChatChannelIcon(channel: number): string {
		switch (channel) {
			case ChatChannel.CROSS_BIGBUGLE:
				return 'Lab_Chat1'
				break;
			case ChatChannel.BIGBUGLE:
				return 'Lab_Chat6'
				break;
			case ChatChannel.WORLD:
				return 'Lab_Chat2'
				break;
			case ChatChannel.SYSTEM:
			case ChatChannel.SYS_ALERT:
				return 'Lab_Chat1'
				break;
			case ChatChannel.INFO:
				return 'Lab_Chat1'
				break;
			case ChatChannel.PERSONAL:
				return 'Lab_Chat3'
				break;
			case ChatChannel.CONSORTIA:
				return 'Lab_Chat5'
				break;
			case ChatChannel.TEAM:
				return 'Lab_Chat4'
				break;
			case ChatChannel.CURRENT:
				return 'Lab_Chat2';
				break;
			case ChatChannel.NOTICE:
				return 'Lab_Chat1'
				break;
			case ChatChannel.GOLD_BIGBUGLE:
				return 'Lab_Chat1'
				break;
		}
		return '';
	}
}