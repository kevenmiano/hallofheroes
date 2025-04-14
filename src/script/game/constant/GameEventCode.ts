/**
 * @description 游戏事件code值
 * @author yuanzhan.yu
 * @date 2021/8/5 9:39
 * @ver 1.0
 */
export enum GameEventCode {
  Code_1000 = 1000, //启动游戏
  Code_1010 = 1010, //检查更新
  Code_1012 = 1012, //更新结果返回
  Code_1013 = 1013, //开始更新
  Code_1014 = 1014, //更新完成
  Code_1020 = 1020, //SDK请求登录
  Code_1021 = 1021, //SDK登录token返回
  Code_1022 = 1022, //请求服务器列表
  Code_1023 = 1023, //选择服务器
  Code_1024 = 1024, //进入游戏（得到角色信息且开始载入游戏时）
  Code_1025 = 1025, //向服务器请求登录验证token
  Code_1026 = 1026, //返回登录结果
  Code_1040 = 1040, //创建角色
  Code_1041 = 1041, //返回创角结果
  Code_1042 = 1042, //角色升级
  Code_1050 = 1050, //进入主界面（主场景）
  Code_1060 = 1060, //开始新手引导
  Code_1061 = 1061, //结束新手引导
  Code_1062 = 1062, //通过主线第1章的最后一关
  Code_1063 = 1063, //通过主线第2章的最后一关
  Code_1064 = 1064, //通过主线第3章的最后一关
  Code_1065 = 1065, //热更进度打点
  Code_1066 = 1066, //角色退出游戏。（包括用户退出游戏(默认SDK自己打点)、用户注销角色帐号（由游戏触发打点））
  Code_1067 = 1067, //加入公会（或创建公会）
  Code_1068 = 1068, //领取首充礼包
  Code_1069 = 1069, //登录天数（"exInfo"传 {"customInfo":"Login1"},具体customInfo的value值可根据实际传递）
  Code_1070 = 1070, //档位充值成功
  Code_1080 = 1080, //注销角色或退出游戏
  Code_1081 = 1081, //游戏时长（当退出游戏时, 游戏计算好当前游玩时长, 通过exInfo字段传递, 示例: "exInfo":"{"playTime":"60"}", playTime的时间单位为秒）
  Code_1082 = 1082, //起名 ——玩家完成“长按指纹, 签订契约”动作
  Code_2020 = 2020, //在线30分钟

  Code_9999 = 9999, //自定义事件（主任务必接)
}

export enum GameEventString {
  complete_the_first_battle = "complete_the_first_battle", //  完成第1场战斗	完成第1场战斗
  view_purchase_ui = "view_purchase_ui", //  点击查看购买界面	发起结账界面
  cancel_purchase = "cancel_purchase", //  取消购买	取消付款
  first_purchase = "first_purchase", //  首冲	首冲
  monthly_card_purchase = "monthly_card_purchase", //  购买月卡	购买月卡
  first_kill = "first_kill", //  消灭第1只怪	消灭第1只怪
  click_skill = "click_skill", //  点击技能图标使用技能	点击技能图标使用技能
  task_rescue_girl = "task_rescue_girl", //  提交任务：解救少女	提交任务：解救少女
  click_weapen = "click_weapen", //  装备武器	装备武器
  task_kill_demons = "task_kill_demons", //  提交任务：清剿魔物	提交任务：清剿魔物
  task_get_town = "task_get_town", //  提交任务：夺回城镇	提交任务：夺回城镇
  task_recruit_gunmen = "task_recruit_gunmen", //  提交任务：招募枪兵	提交任务：招募枪兵
  task_get_goldmine = "task_get_goldmine", //  提交任务：占领金矿	提交任务：占领金矿
  task_kill_nest = "task_kill_nest", //  提交任务：清剿魔狼巢穴	提交任务：清剿魔狼巢穴
  gift_level_10 = "gift_level_10", //  领取10级等级礼包	领取10级等级礼包
  task_to_grassland = "task_to_grassland", //  提交任务：前往自由草原	提交任务：前往自由草原
  click_tree = "click_tree", //  农场指引点击神树	农场指引点击神树
  click_join_club = "click_join_club", //  公会指引点击“申请加入”	公会指引点击“申请加入”
  task_to_skycity = "task_to_skycity", //  提交任务：前往天空之城	提交任务：前往天空之城
  task_challenge = "task_challenge", //  提交任务：挑战	提交任务：挑战
  task_get_forest_underworld = "task_get_forest_underworld", //  提交任务：通关幽冥之林	提交任务：通关幽冥之林
  gift_level_20 = "gift_level_20", //  领取20级等级礼包	领取20级等级礼包
  click_temple = "click_temple", //  引导点击修行神殿	引导点击修行神殿
  click_maze = "click_maze", //  引导点击地下迷宫	引导点击地下迷宫
  click_astrology = "click_astrology", //  引导点击占星	引导点击占星
  gift_two_login = "gift_two_login", //  第二天签到	第二天签到
  gift_three_login = "gift_three_login", //  第三天签到	第三天签到
  gift_seven_login = "gift_seven_login", //  第七天签到	第七天签到
  click_second_skill = "click_second_skill", //  新手引导点击使用第二个技能	新手引导点击使用第二个技能
  get_transmit = "get_transmit", //  新手引导通过第一个传送阵	新手引导通过第一个传送阵
  zgt_2 = "zgt_2", //  内政厅升级至2级	内政厅升级至2级
  by_2 = "by_2", //  兵营升级至2级	兵营升级至2级
  task_recruit_archer = "task_recruit_archer", //  完成任务：招募弓手	完成任务：招募弓手
  task_equip_3 = "task_equip_3", //  完成任务：任意装备强化到3级	完成任务：任意装备强化到3级
  task_kill_filyari = "task_kill_filyari", //  完成任务：击杀菲尔娅丽	完成任务：击杀菲尔娅丽
  by_10 = "by_10", //  兵营升级至10级	兵营升级至10级
  task_kill_iberian = "task_kill_iberian", //  完成任务：击杀伊比利斯	完成任务：击杀伊比利斯
  task_levy = "task_levy", //  完成任务：征收	完成任务：征收
  task_get_orc_plain = "task_get_orc_plain", //  完成任务：通关兽人平原	完成任务：通关兽人平原
  task_kil_knox = "task_kil_knox", //  完成任务：击杀族长克诺斯	完成任务：击杀族长克诺斯
  task_kil_shady = "task_kil_shady", //  完成任务：击杀夏迪子爵	完成任务：击杀夏迪子爵
  task_recruit_swordsman = "task_recruit_swordsman", //  完成任务：招募剑士	完成任务：招募剑士
  task_get_abyss_breath = "task_get_abyss_breath", //  完成任务：通关深渊气息	完成任务：通关深渊气息
  tree_charge_1 = "tree_charge_1", //  第二天为自己农场神树充能	第二天为自己农场神树充能
  tree_charge_3 = "tree_charge_3", //  第三天为自己农场神树充能	第三天为自己农场神树充能
  tree_charge_7 = "tree_charge_7", //  第七天为自己农场神树充能	第七天为自己农场神树充能
}

export enum TrackEventNode {
  Node_1001 = 30 + 1001, //加载选大区配置
  Node_1002 = 30 + 1002, //加载语言
  Node_1003 = 30 + 1003, //加载基础资源
  Node_1004 = 30 + 1004, //进入选大区界面
  Node_1005 = 30 + 1005, //选择大区
  Node_1006 = 39250 + 90 + 10, //进入登录界面
  Node_1007 = 39250 + 90 + 20, //请求区服列表
  Node_1008 = 39250 + 90 + 30, //请求区服列表成功
  Node_1009 = 39250 + 90 + 40, //点击选择区服列表
  Node_1010 = 39250 + 90 + 50, //选择确认区服
  Node_1011 = 39250 + 90 + 60, //确认登录

  Node_30001 = 39250 + 90 + 70, //看到登陆界面/服务器列表
  Node_30002 = 39250 + 90 + 80, //点击登陆界面的进入游戏按钮（包括不成功）
  Node_30003 = 39250 + 90 + 90, //看到创角界面
  Node_30004 = 39250 + 90 + 100, //点击创角界面的进入游戏按钮（包括不成功）

  CLICK_REGISTER_BACK = 39250 + 90 + 101, //点击创角界面的返回按钮
  CLICK_US_CHOOSE = 30 + 1005 + 1, //选择美洲大区并点击“确认”按钮。
  CLICK_EU_CHOOSE = 30 + 1005 + 2, //选择欧洲大区并点击“确认”按钮。
  CLICK_OA_CHOOSE = 30 + 1005 + 3, //选择大洋洲大区并点击“确认”按钮。
  CLICK_US_CONFIRM = 30 + 1005 + 4, //选择美洲大区时，在二级弹窗点击“确认”按钮并进入美洲大区。
  CLICK_EU_CONFIRM = 30 + 1005 + 5, //选择欧洲大区时，在二级弹窗点击“确认”按钮并进入欧洲大区。
  CLICK_OA_CONFIRM = 30 + 1005 + 6, //选择大洋洲大区时，在二级弹窗点击“确认”按钮并进入大洋洲大区。
  LOGIN_TOURIST_CHOOSE = 39250 + 90 + 70 + 1, //登录界面点击“以游客继续”按钮
  LOGIN_ACCOUNTS_CHOOSE = 39250 + 90 + 70 + 2, //登录界面点击“登录其他账户”按钮
  LOGIN_7ROAD_ACCOUNT = 39250 + 90 + 70 + 3, //登录界面点击七道账号登录按钮
  LOGIN_GG_ACCOUNT = 39250 + 90 + 70 + 4, //登录界面点击谷歌账号登录按钮
  LOGIN_FB_ACCOUNT = 39250 + 90 + 70 + 5, //登录界面点击Facebook账号登录按钮
  LOGIN_TOURIST_ACCOUNT = 39250 + 90 + 70 + 6, //登录界面点击游客账号登录按钮
  LOGIN_APPLE_ACCOUNT = 39250 + 90 + 70 + 7, //登录界面点击游客苹果登录按钮
  CLICK_AD_CLOSE = 39250 + 90 + 70 + 8, //点击关闭公告弹窗
  CLICK_LANGUAGE_CONFIRM = 39250 + 90 + 80 + 1, //点击切换语言二级弹窗“确认”按钮
  CLICK_AREA_CONFIRM = 39250 + 90 + 80 + 2, //点击切换大区按钮
}
