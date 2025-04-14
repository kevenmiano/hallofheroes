export enum RPT_EVENT_LOG {
  FACEBOOK = "facebook",
  GOOGLE = "google",
}

export enum RPT_EVENT_PREFIX {
  LEVEL_UP = "LEVEL_UP_",
  TASK = "TASK_",
}

export enum RPT_KEY {
  REGISTER_PLATFORM = "REGISTER_PLATFORM",
  LOGIN_PLATFORM = "LOGIN_PLATFORM",
  GOOGLE_PLAY = "GOOGLE_PLAY",
  APP_STORE = "APP_STORE",
  ENTER_GAME = "ENTER_GAME",
  CREATE_ROLE = "CREATE_ROLE",
  CHARGE_COMPLETE = "CHARGE_COMPLETE",
  CHARGE_COUNT = "CHARGE_COUNT",
  LEVEL_UP = "LEVEL_UP",
  TASK = "TASK_COMPLETE",
  SIGN = "SIGN",
  FIRST_PURCHASE = "FIRST_PURCHASE",
  MONTHLY_CARD_PURCHASE = "MONTHLY_CARD_PURCHASE",
  GIFT_LEVEL = "GIFT_LEVEL",
  GUIDE = "GUIDE",
  LOGIN_TOURIST_CHOOSE = "login_tourist_choose",
  LOGIN_ACCOUNTS_CHOOSE = "login_accounts_choose",
  LOGIN_7ROAD_ACCOUNT = "login_7road_account",
  LOGIN_GG_ACCOUNT = "login_gg_account",
  LOGIN_FB_ACCOUNT = "login_FB_account",
  LOGIN_TOURIST_ACCOUNT = "login_tourist_account",
  CLICK_LANGUAGE_CONFIRM = "click_language_confirm",
  CLICK_AREA_CONFIRM = "click_area_confirm",
  CLICK_AD_CLOSE = "click_ad_close",
}

export enum RPT_EVENT {
  REGISTER_PLATFORM = "register_platform", //注册平台账号
  LOGIN_PLATFORM = "login_platform", //登陆平台账号
  GOOGLE_PLAY = "google_play", //点击GET IT ON GOOGLE PLAY按钮并跳转下载APP
  APP_STORE = "app_store", //点击DOWNLOAD ON THE APP STORE按钮并跳转下载APP
  ENTER_GAME = "enter_game", //每次进入区服
  CREATE_ROLE = "create_role", //游戏内创建角色
  TASK_12000 = "task_12000", //完成第一个主线任务
  CHARGE_COMPLETE = "charge_complete", //用户充值成功
  CHARGE_COUNT = "charge_count", //充值钻石数
  LEVEL_UP_5 = "level_up_5", //游戏内等级达到5
  LEVEL_UP_10 = "level_up_10", //游戏内等级达到10
  LEVEL_UP_15 = "level_up_15", //游戏内等级达到15
  LEVEL_UP_20 = "level_up_20", //游戏内等级达到20
  LEVEL_UP_25 = "level_up_25", //游戏内等级达到25
  FIRST_PURCHASE = "first_purchase", //首冲
  MONTHLY_CARD_PURCHASE = "monthly_card_purchase", //购买月卡
  FIRST_KILL = "first_kill", //消灭第1只怪
  CLICK_SKILL = "click_skill", //点击技能图标使用技能
  TASK_RESCUE_GIRL = "task_rescue_girl", //提交任务: 解救少女
  CLICK_WEAPON = "click_weapen", //装备武器
  TASK_KILL_DEMONS = "task_kill_demons", //提交任务: 清剿魔物
  TASK_GET_TOWN = "task_get_town", //提交任务: 夺回城镇
  TASK_RECRUIT_GUNMEN = "task_recruit_gunmen", //提交任务: 招募枪兵
  TASK_GET_GOLDMINE = "task_get_goldmine", //提交任务: 占领金矿
  TASK_KILL_NEST = "task_kill_nest", //提交任务: 清剿魔狼巢穴
  GIFT_LEVEL_10 = "gift_level_10", //领取10级等级礼包
  TASK_TO_GRASSLAND = "task_to_grassland", //提交任务: 前往自由草原
  CLICK_TREE = "click_tree", //农场指引点击神树
  CLICK_JOIN_CLUB = "click_join_club", //公会指引点击“申请加入”
  TASK_TO_SKYCITY = "task_to_skycity", //提交任务: 前往天空之城
  TASK_CHALLENGE = "task_challenge", //提交任务: 挑战
  TASK_GET_FOREST_UNDERWORLD = "task_get_forest_underworld", //提交任务: 通关幽冥之林
  GIFT_LEVEL_20 = "gift_level_20", //领取20级等级礼包
  CLICK_TEMPLE = "click_temple", //引导点击修行神殿
  CLICK_MAZE = "click_maze", //引导点击地下迷宫
  CLICK_ASTROLOGY = "click_astrology", //引导点击占星
  GIFT_TWO_LOGIN = "gift_two_login", //第二天签到
  GIFT_THREE_LOGIN = "gift_three_login", //第三天签到
  GIFT_SEVEN_LOGIN = "gift_seven_login", //第7天签到

  CLICK_SECOND_SKILL = "click_second_skill", //新手引导点击使用第二个技能
  GET_TRANSMIT = "get_transmit", //新手引导通过第一个传送阵
  ZGT_2 = "zgt_2", //内政厅升级至2级
  BY_2 = "by_2", //兵营升级至2级
  TASK_RECRUIT_ARCHER = "task_recruit_archer", //完成任务: 招募弓手
  TASK_EQUIP_3 = "task_equip_3", //完成任务: 任意装备强化到3级
  TASK_KILL_FILYARI = "task_kill_filyari", //完成任务: 击杀菲尔娅丽
  BY_10 = "by_10", //兵营升级至10级
  TASK_KILL_IBERIAN = "task_kill_iberian", //完成任务: 击杀伊比利斯
  TASK_LEVY = "task_levy", //完成任务: 征收
  TASK_GET_ORC_PLAIN = "task_get_orc_plain", //完成任务: 通关兽人平原
  TASK_KIL_KNOX = "task_kil_knox", //完成任务: 击杀族长克诺斯
  TASK_KIL_SHADY = "task_kil_shady", //完成任务: 击杀夏迪子爵
  TASK_RECRUIT_SWORDSMAN = "task_recruit_swordsman", //完成任务: 招募剑士
  TASK_GET_ABYSS_BREATH = "task_get_abyss_breath", //完成任务: 通关深渊气息
  TREE_CHARGE_1 = "tree_charge_1", //第二天为自己农场神树充能
  TREE_CHARGE_3 = "tree_charge_3", //第三天为自己农场神树充能
  TREE_CHARGE_7 = "tree_charge_7", //第七天为自己农场神树充能

  CLICK_US_CHOOSE = "click_US_choose", //选择美洲大区并点击“确认”按钮。
  CLICK_EU_CHOOSE = "click_EU_choose", //选择欧洲大区并点击“确认”按钮。
  CLICK_OA_CHOOSE = "click_OA_choose", //选择大洋洲大区并点击“确认”按钮。
  CLICK_US_CONFIRM = "click_US_confirm", //选择美洲大区时，在二级弹窗点击“确认”按钮并进入美洲大区。
  CLICK_EU_CONFIRM = "click_EU_confirm", //选择欧洲大区时，在二级弹窗点击“确认”按钮并进入欧洲大区。
  CLICK_OA_CONFIRM = "click_OA_confirm", //选择大洋洲大区时，在二级弹窗点击“确认”按钮并进入大洋洲大区。
  LOGIN_TOURIST_CHOOSE = "login_tourist_choose", //登录界面点击“以游客继续”按钮
  LOGIN_ACCOUNTS_CHOOSE = "login_accounts_choose", //登录界面点击“登录其他账户”按钮
  LOGIN_7ROAD_ACCOUNT = "login_7road_account", //登录界面点击七道账号登录按钮
  LOGIN_GG_ACCOUNT = "login_gg_account", //登录界面点击谷歌账号登录按钮
  LOGIN_FB_ACCOUNT = "login_FB_account", //登录界面点击Facebook账号登录按钮
  LOGIN_APPLE_ACCOUNT = "login_Apple_account", //登录界面点击苹果账号登录按钮
  LOGIN_TOURIST_ACCOUNT = "login_tourist_account", //登录界面点击游客账号登录按钮
  CLICK_LANGUAGE_CONFIRM = "click_language_confirm", //点击切换语言二级弹窗“确认”按钮
  CLICK_AREA_CONFIRM = "click_area_confirm", //点击切换大区按钮
  CLICK_AD_CLOSE = "click_ad_close", //点击关闭公告弹窗
}
