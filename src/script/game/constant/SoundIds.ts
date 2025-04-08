// @ts-nocheck
import ComponentSetting from "../utils/ComponentSetting";

export class SoundIds {
	//音效
	public static CAMPAIGN_WALK_SOUND: string = ComponentSetting.getSoundSourcePath("Sound001");  //副本行走的声音
	public static CAMPAIGN_RESULT_WIN_SOUND: string = ComponentSetting.getSoundSourcePath("Sound002");  //副本胜利后结算的声音
	public static BAG_CLICK_SOUND: string = ComponentSetting.getSoundSourcePath("Sound003");  //背包物品移动或点起
	public static BOX_OPEN_MAGICBOX_SOUND: string = ComponentSetting.getSoundSourcePath("Sound004");  //打开潘多拉魔盒
	public static CHAT_GET_PRIVATE_CHAT_SOUND: string = ComponentSetting.getSoundSourcePath("Sound005");  //被密聊时提示音
	public static CHAT_SEND_SOUND: string = ComponentSetting.getSoundSourcePath("Sound006");  //在聊天栏内回车
	public static CHEST_SOUND: string = ComponentSetting.getSoundSourcePath("Sound007");  //翻牌声音
	public static CLOSE_SOUND: string = ComponentSetting.getSoundSourcePath("Sound008");  //关闭按钮
	public static FRIENDS_ADD_SUCCEED_SOUND: string = ComponentSetting.getSoundSourcePath("Sound009");  //添加好友成功
	public static INNERCITY_BUILD_UPGRADE_SOUND: string = ComponentSetting.getSoundSourcePath("Sound010");  //建筑升级
	public static INNERCITY_CLICK_BUILD_SOUND: string = ComponentSetting.getSoundSourcePath("Sound011");  //点击内城建筑
	public static INTENSIFY_FAIL_SOUND: string = ComponentSetting.getSoundSourcePath("Sound012");  //强化失败
	public static INTENSIFY_SUCCEED_SOUND: string = ComponentSetting.getSoundSourcePath("Sound013");  //强化成功
	public static MAIL_NEW_MAIL_SOUND: string = ComponentSetting.getSoundSourcePath("Sound014");  //新邮件提示音
	public static MAINTOOLBAR_CLICK_SOUND: string = ComponentSetting.getSoundSourcePath("Sound015");  //主工具条按钮
	public static CAMPAIGN_READY_SOUND: string = ComponentSetting.getSoundSourcePath("Sound016");  //副本准备或开始
	public static CAMPAIGN_CLICK_SOUND: string = ComponentSetting.getSoundSourcePath("Sound018");  //副本战役按钮
	public static RETURN_SOUND: string = ComponentSetting.getSoundSourcePath("Sound019");  //返回按钮
	public static BOX_OPEN_TIMEBOX_SOUND: string = ComponentSetting.getSoundSourcePath("Sound020");  //打开时间宝箱
	public static WATER_TREE_GIVEPOW_SOUND: string = ComponentSetting.getSoundSourcePath("Sound021");  //神树充能
	public static CONFIRM_SOUND: string = ComponentSetting.getSoundSourcePath("Sound022");  //确定按钮
	public static JEWEL_MOUNT_SOUND: string = ComponentSetting.getSoundSourcePath("Sound023");  //宝石镶嵌
	public static BAG_EQUIP_SOUND: string = ComponentSetting.getSoundSourcePath("Sound024");  //穿戴装备
	public static THANE_LEVEL_UP_SOUND: string = ComponentSetting.getSoundSourcePath("Sound025");  //领主升级
	public static STAR_SOUND: string = ComponentSetting.getSoundSourcePath("Sound026");  //占星
	public static STAR_COMPOSE_SOUND: string = ComponentSetting.getSoundSourcePath("Sound027");  //星运合成
	public static STAR_EQUIP_SOUND: string = ComponentSetting.getSoundSourcePath("Sound028");  //装备星运
	public static USE_HPSTORE_SOUND: string = ComponentSetting.getSoundSourcePath("Sound029");  //血包使用
	public static GET_GOODS_SOUND: string = ComponentSetting.getSoundSourcePath("Sound030");  //获得物品
	public static STORE_CLICK_SOUND: string = ComponentSetting.getSoundSourcePath("Sound031");  //点击铁匠铺
	public static TASK_SUCCEED_SOUND: string = ComponentSetting.getSoundSourcePath("Sound032");  //任务完成
	public static BATTLE_RESULT_WIN: string = ComponentSetting.getSoundSourcePath("Sound033");  //战斗胜利
	public static CAMPAIGN_OUTERCITY_STAR_SOUND: string = ComponentSetting.getSoundSourcePath("Sound035");  //战役外城占星按钮
	public static UNCOVER_ALERT_SOUND: string = ComponentSetting.getSoundSourcePath("Sound036");  //怪物头上出现感叹号
	public static GET_GOLD_SOUND: string = ComponentSetting.getSoundSourcePath("Sound037");  //获得黄金

	public static COLLECTION_AMETHYST: string = ComponentSetting.getSoundSourcePath("Sound039");//采集紫晶
	public static COLLECTION_TIMBER: string = ComponentSetting.getSoundSourcePath("Sound040");//采集木材
	public static COLLECTION_COPER: string = ComponentSetting.getSoundSourcePath("Sound041");//采集黄铜

	public static VEHICLE_DIE: string = ComponentSetting.getSoundSourcePath("Sound047");
	public static VEHICLE_WILL_DIE: string = ComponentSetting.getSoundSourcePath("Sound048");
	public static VEHICLE_WALK: string = ComponentSetting.getSoundSourcePath("Sound049");
	public static VEHICLE_BEATK: string = ComponentSetting.getSoundSourcePath("Sound050");

	public static CASTLE: string = ComponentSetting.getSoundMusicPath("bgminnercity");
	public static OUTER_CITY: string = ComponentSetting.getSoundMusicPath("outercity");
	public static FARM: string = ComponentSetting.getSoundMusicPath("farm");
	public static CAMPAIGN_SUCCEED: string = ComponentSetting.getSoundMusicPath("campaign03");
	public static VEHICLE: string = ComponentSetting.getSoundMusicPath("bgm3001");
	public static SPACE: string = ComponentSetting.getSoundMusicPath("bgm_space");
	public static PETLAND: string = ComponentSetting.getSoundMusicPath("bgm_pet");

	/**战斗背景音效 */
	public static BattleMapMusics: string[] = [
		ComponentSetting.getSoundMusicPath("battle01"),
		ComponentSetting.getSoundMusicPath("battle02"),
		ComponentSetting.getSoundMusicPath("battle03"),
		ComponentSetting.getSoundMusicPath("battle04"),
		ComponentSetting.getSoundMusicPath("battle05"),
		ComponentSetting.getSoundMusicPath("battle06"),
		ComponentSetting.getSoundMusicPath("battle07"),
		ComponentSetting.getSoundMusicPath("battle08"),
		ComponentSetting.getSoundMusicPath("battle09"),
		ComponentSetting.getSoundMusicPath("battle1001"),
	];


	/**战场音效 */
	public static getBattleSound(index: number = 0): string {
		return ComponentSetting.getSoundMusicPath("battle" + (index >= 10 ? index : '0' + index));
	}
}