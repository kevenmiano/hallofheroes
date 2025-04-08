// @ts-nocheck
export enum S2CProtocol {
	U_C_TIME_ZONE = 0x016a, // 服务器时区

	U_L_GET_PLAYER_LIST = 0x0f03, // 返回角色列表
	U_L_PREPARE_LOGIN = 0x0f04, // 准备登录反馈
	// G_G_REGISTER_ROLE_RSP = 0x4E30,   // 创建角色返回网关
	U_L_REGISTER_ROLE_RSP = 0x0f05, //创建角色返回
	U_L_CREATE_LOGIN_RSP = 0x0f06, //创建登录信息返回

	U_G_LOGIN_GATEWAY = 0x0f01, // 登录网关返回, 返回的是空包
	U_G_LOGIN_OTHER = 0x0f02, //// 登录网关提示

	U_C_PLAYER_INFO = 0x0003, //更新领主信息

	U_C_GOLD_IMPOSERESULT = 0x1092, // 征收结果
	U_C_RATE_INFO = 0x1097, // 经验倍率

	U_C_PLAYER_TIMESTAR = 0x109a, // 新手时间保箱开始记时
	U_C_SYNCHRONIZED_TIME = 0x108a, //同步系统时间
	U_C_SEND_VERSION = 0x1089, // 发送版本
	U_C_HANGUP_ROOM_STATE = 0x106c, // 挂机房状态
	U_C_HANGUP_SYNC = 0x108b, // 挂机同步
	U_C_WORLDBOSS_REPORT = 0x106b, // 世界BOSS战结算
	U_C_DATARESET = 0x106a,
	U_C_SHOP_MAIN = 0x108e, //商城主页
	U_C_SHOP_DISCOUNT = 0x1117, // 商城打折

	U_C_ISTAKE_CHALLENGEREWARD = 0x1094, // 通知客户端能否领取挑战奖励
	U_C_TAKECHALLENGE_RESULT = 0x1093, // 领取挑战赛奖励结果
	U_C_WORLD_PROSPERITY = 0x1156, //世界繁荣度

	U_C_ALTAROVER_MSG = 0x1161, //公会魔神祭坛结束通告
	U_C_CONSORTIA_ALTAR_REPORT = 0x1155, //公会魔神祭坛报表
	U_C_OPEN_CONSORTIA__ALTAR = 0x1154, //开启公会魔神祭坛返回
	U_CONSORTIA_ALTAR_USE_SKILL = 0x1185, //魔神祭坛使用技能
	/**
	 *公会宝箱信息查看
	 */
	U_C_CONSORTIA_BOX_INFO = 0x1172,
	/**
	 *公会宝箱分配框
	 */
	U_C_CONSORTIA_TREASURE_BOX = 0x1171,
	/**
	 *武斗会全服公告
	 */
	U_C_LORDS_FINAL_TIPS = 0x11ba,
	/**
	 *请求进入决赛玩家列表返回
	 */
	U_C_LORDS_LOCAL_FIANL_ORDER = 0x11b9,
	/**
	 *武斗会关闭
	 */
	U_C_LORDS_CLOSE = 0x11b8,
	/**
	 *武斗会比赛开始
	 */
	U_C_LORDS_OPENSTATE = 0x11b7,
	/**
	 *武斗会奖励领取结果
	 */
	U_C_TAKEFINALREWARD_RESULT = 0x11b6,
	/**
	 *收到可领取武斗会奖励
	 */
	U_C_SEND_FINALRWARD_STATE = 0x11b5,
	/**
	 *请求武斗会获奖列表返回
	 */
	U_C_REQUEST_BET_LIST = 0x11b4,
	/**
	 *请求武斗会可下注列表返回
	 */
	U_C_LORDS_FINAL_ORDERLIST = 0x11b3,
	/**
	 *武斗会单场竞技结束信息返回
	 */
	U_C_LORDS_ENTER_RESULT = 0x11b2,
	/**
	 *请求武斗会主面板信息返回
	 */
	U_C_LORDS_LOAD_MAINBORAD = 0x11b1,
	/**
	 *公会秘境信息
	 */
	U_C_FAM_INFO = 0x1165,
	/**
	 *公会秘境神树信息
	 */
	U_C_FAM_TREE = 0x1150,
	/**
	 *公会秘境盗宝者信息
	 */
	U_C_SENDFAMLORDS_INFO = 0x1218,
	/**
	 *开关信息
	 */
	U_C_SWITCH = 0x1146,
	/**
	 *请求农场信息返回
	 */
	U_C_FARM_INFO = 0x1122,
	/**
	 *农场操作返回
	 */
	U_C_FARMLAND_INFO = 0x1123,

	/**
	 *查找好友返回
	 */
	U_CH_FRIEND_SEARCH = 0x10b1,
	/**
	 *请求最近联系人状态返回
	 */
	U_CH_CHAT_STATE = 0x10b0,
	/**
	 *聊天状态改变返回
	 */
	U_CH_EXCHANGE_STATE = 0x1088,
	/**
	 *请求好友基本信息和社交信息返回
	 */
	U_CH_SIMPLEUSER_INFO = 0x10a0,
	/**
	 *社交信息更新返回
	 */
	U_CH_SNS_UPDATED = 0x108f,
	/**
	 *登陆返回社交信息
	 */
	U_CH_SNS_REQ = 0x1095,
	/**
	 *分组好友移动返回
	 */
	U_CH_FRIEND_MOVE = 0x1086,
	/**
	 *重命名好友分组返回
	 */
	U_CH_RENAME_GROUP = 0x1085,
	/**
	 *删除好友分组返回
	 */
	U_CH_DEL_GROUP = 0x1084,
	/**
	 *添加好友分组返回
	 */
	U_CH_ADD_GROUP = 0x1083,
	/**
	 *发送IM信息后返回信息
	 */
	U_CH_PRIVATE_CHAT_REPLY = 0x108c,
	/**
	 *接收IM信息
	 */
	U_CH_PRIVATE_CHAT = 0x1087,

	/**
	 *更新每日最大悬赏次数
	 */
	U_C_REWARD_COUNT = 0x1108,
	/**
	 *刷新悬赏任务列表
	 */
	U_C_REWARD_FRESH = 0x1065,
	/**
	 *更新悬赏任务
	 */
	U_C_REWARD_UPDATE = 0x1066,
	// 数据重置
	U_C_HANGUP_STATE = 0x1068, // 挂机状态
	U_C_LEFT_WEARY = 0x1067, // 在线挂机剩余体力
	U_C_OFFLINE_REWARD = 0x1063, // 离线经验奖励
	U_C_ROOM_SEND = 0x10ae, // 单个房间s
	U_C_SINGLEROOM_FAIL = 0x1060, // 单人本创建失败
	U_C_ITEM_BUFFER = 0x105c, // Buffer信息
	U_C_BUILDING_ORDER_SEND = 0x105b, // 发送建筑队列信息
	U_C_ITEM_SMITH = 0x1058, // 用户铁匠铺合成公式
	U_C_PLAYER_SIGN = 0x1051, // 用户签到
	U_C_MONTH_CARD = 0x125a, //月卡相关返回协议号

	U_C_START_MOVE_UPDATE = 0x1052, // 背包移动
	U_C_STAR_PICK = 0x1053, // 占星拾取
	U_C_STAR_RAND = 0x1054, // 占星随机
	U_C_STAR_COMPOSE = 0x117f, //临时背包一键合成
	U_C_STARSHOP_BUY = 0x10a5, //占星积分商城兑换返回

	U_C_CHALLENGE_TIME = 0x1050, // 挑战冷却时间
	U_C_PLAYER_AASCHANGE = 0x104c, // 防沉迷注册
	U_C_PLAYER_AASREFRESH = 0x104d, // 防沉迷刷新

	U_C_RANK_LIST = 0x1037, // 历史副本评价列表
	U_C_TREE_FRIEND = 0x1032, //用户树信息

	U_C_BAG_EQUIPLOOK = 0x101d, //查看玩家装备
	U_C_SIMPLEUSER_INFO = 0x1020, //查看用户简单信息
	U_C_PLAYER_SEARCH = 0x104a, // 通过昵称查找用户信息

	U_C_CAMPAIGN_ARMYPOS_SEND = 0x105a, //多人副本部队站位发送
	U_C_MATCH_STATE = 0x1069, // 竞技场状态

	/******************************部队******************************/
	/**
	 * 编制部队
	 */
	U_C_SERIAL_ARMY = 0x0096, // 编制部队
	/**
	 * 更新armypawn
	 */
	U_C_ARMY_UPDATE_ARMYPAWN = 0x0064, // 更新armypawn

	/////////////////////未使用的////////////////////////////////////////
	/**
	 *增加攻击次数
	 */
	U_C_PLAYER_ADD_ATTACKCOUNT = 0x0007, //
	/**
	 * 新手进度
	 */
	U_C_PLAYER_NOVICE = 0x0001,

	U_C_QUEST_ADD = 0x0005, //用户任务记录（用户任务列表）

	C_TASK_CAMPAIGN = 0x2003, // 剧情副本

	/**
	 * 告诉服务器当前在哪个屏幕
	 */
	U_C_USER_DISPLAY = 0x0008,
	U_C_CAMPAIGN_ARRIVE = 0x0009, // 直接攻击
	U_C_CAMPAIGN_SYNCPOS = 0x000a, // 直接移动
	/**
	 * 更新房间信息
	 */
	U_C_CAMPAIGN_ROOM_MASTER_CHANGE = 0x0012,
	/**
	 *会话结束后触发战斗
	 */
	U_C_CAMPAIGN_CALLBACK = 0x001f,
	/**
	 * 领取附件
	 */
	U_C_MAILITEM_MOVE = 0x0021,
	/**
	 * 创建公会
	 */
	U_C_CONSORTIA_CREATE = 0x0022,
	/**
	 * 修改公会公告
	 */
	U_C_CONSORTIA_MODIFYBBS = 0x0026,
	/**
	 * 修改公会简介
	 */
	U_C_CONSORTIA_MODIFYDESC = 0x0027,
	/**
	 * 公会升级
	 */
	U_C_CONSORTIA_LEVEL = 0x002b,
	/**
	 * 公会职位更改
	 */
	U_C_CONSORTIA_DUTYEDIT = 0x002c,
	U_C_CONSORTIA_CHANGE = 0x002f, //公会转让
	U_C_CONSORTIA_LEARN = 0x0030, //公会学习
	U_C_CONSORTIA_RENAME = 0x0031, //公会改名
	//		  U_C_CONSORTIA_DELUSER      = 0x,//公会踢人
	U_C_CONSORTIA_OPENAPP = 0x0033, //公会开放申请
	U_C_CONSORTIAUSER_LIST = 0x1025, // 公会成员列表
	U_C_CONSORTIA_OFFER_LIST = 0x1026, // 捐献列表
	U_C_INVITEINFO_LIST = 0x1027, // 公会邀请信息列表
	U_C_EVENT_LIST = 0x1028, // 公会事件信息列表
	U_C_DUTY_LIST = 0x1029, // 公会权限列表
	U_C_CONSORTIA_INFO = 0x102a, // 公会信息
	U_C_CONSORTIA_SEARCH = 0x102b, // 公会搜索
	U_C_CONSORTIA_INVITE_LIST = 0x102c, // 公会邀请
	U_C_ARMY_ISSUPPORT = 0x0035, //自动加兵
	/**
	 * 公会事件广播
	 */
	U_C_CONSORTIA_EVENT = 0x1166, //公会事件
	/**
	 * 公会玩家VIP开通广播
	 */
	U_C_CONSORTIA_VIP = 0x1167, //公会玩家VIP开通广播
	/**
	 * 出售物品
	 */
	U_C_BAG_SELL = 0x0038, //出售物品协议
	/**
	 * 掉落物品拾取
	 */
	U_C_DROPITEM_TAKE = 0x0039,
	/**
	 * 洗点
	 */
	U_C_HERO_RESETPOINT = 0x0042, // 洗点
	/**
	 * 属性点分配
	 */
	U_C_HERO_ADDPOINT = 0x0043, // 分配点
	/**
	 * 铁匠铺强化
	 */
	U_C_ITEM_STRENGTHEN = 0x0056,
	/**
	 * 镶嵌
	 */
	U_C_ITEM_INLAY = 0x0057,
	/**
	 * 镶嵌孔操作
	 */
	U_C_ITEM_INLAYJOIN = 0x0058,
	/**
	 * 新手引导添加物品强化
	 */
	U_C_GUID_STRENGY_ADDITEM = 0x005b,
	/**
	 * 移动中的部队召回
	 */
	U_C_ARMY_RECALL = 0x0063, // 中途召回
	/**
	 * 新手进入战斗
	 */
	U_B_USR_GUIDE = 0x004a,
	U_B_QTE = 0x004c, //
	U_B_FIGHT_MODE = 0x004d, // 战斗中模式选择
	U_B_USE_ITEM_RESULT = 0x009e, //使用道具成功.

	////////////////////////////////////////////////////

	/**
	 *登录命令
	 */
	U_C_PLAYER_LOGINSTATEE = 0x0006,
	/**
	 *领取新手礼包
	 */
	U_C_PLAYER_GRADE = 0x0002,
	/**
	 *领取时间宝箱
	 */
	U_C_PLAYER_TIME = 0x0004,
	U_C_REFUSEFRIEND_REFRESH = 0x1061, // 拒绝添加好友状态刷新
	U_C_REFUSEINVITE_REFRESH = 0x1062, // 拒绝房间邀请状态刷新
	U_C_ENTER_COPY_NUM_REFRESH = 0x1090, //进入多人本次数

	/**
	 * 大厅玩家列表
	 */
	U_C_CAMPAIGN_WAITING_PLAYER_LIST = 0x000b,
	/**
	 *  邀请大厅玩家列表
	 */
	U_C_INVITE_PLAYER_LIST = 0x1041,
	/**
	 * 间查找结果 发送 PB文件
	 */
	U_C_ROOM_FIND_RESULT = 0x1112, // 房间查找结果 发送 PB文件 :  RoomMsg

	/**
	 *创建战役房间
	 */
	U_C_CAMPAIGN_ROOM_CREATE = 0x000c,
	/**
	 * 战役房间列表
	 */
	U_C_CAMPAIGN_ROOM_LIST = 0x000d,
	/**
	 * 进入战役房间
	 */
	U_C_CAMPAIGN_ROOM_ENTER = 0x000e,
	/**
	 * 退出战役房间
	 */
	U_C_CAMPAIGN_ROOM_EXIT = 0x000f,

	U_C_CAMPAIGN_ROOM_INVITE = 0x0010, // 邀请
	/**
	 *  房间位置状态
	 */
	U_C_CAMPAGIN_ROOM_PLACESTATE = 0x0011,
	/**
	 *战役迷雾更新
	 */
	U_C_CAMPAIGN_FOG_UPDATE = 0x0013, //
	/**
	 *战役部队信息
	 */
	U_C_CAMPAIGN_ENTER = 0x0015,
	/**
	 *退出战役场景
	 */
	U_C_CAMPAIGN_EXIT = 0x0016,

	U_CAMPAIGN_MOVE = 0x0017,
	/**
	 * 战役中翻牌
	 */
	U_C_CAMPAIGN_TAKE_CARD = 0x001a,
	/**
	 * 查看部队
	 */
	U_C_CAMPAIGN_ARMY = 0x001b,
	/**
	 * 房主踢人
	 */
	U_C_CAMPAIGN_ROOM_KILLPLAYER = 0x001c,
	U_C_CAMPAIGN_CONFIRM = 0x001d, // 战役确认框
	/**
	 * 申请加入公会
	 */
	U_C_CONSORTIA_USERINVITE = 0x0023,

	/**
	 * 删除用户申请
	 */
	U_C_CONSORTIA_INVITEDEL = 0x0024,
	/**
	 * 操作公会申请
	 */
	U_C_CONSORTIA_USERPASS = 0x0025,
	/**
	 * 公会通过用户申请
	 */
	U_C_CONSORTIA_PASS = 0x0028,
	/**
	 * 公会邀请用户
	 */
	U_C_CONSORTIA_INVITE = 0x0029,
	/**
	 * 公会捐献
	 */
	U_C_CONSORTIA_OFF = 0x002a,
	/**
	 * 公会祭坛祈福
	 */
	U_C_CONSORTIA_FRESHALTAR = 0x002d,
	U_C_CONSORTIA_DUTYUPDATE = 0x0032, //公会职位调整
	U_C_CONSORTIA_ALTERINFO = 0x102d, // 公会祈福信息次数
	U_C_CONSORTIA_ALTERITEM = 0x102e, // 公会祈福信息物品
	U_C_CONSORTIA_SITE = 0x1030, //公会祈福轮盘
	U_C_CONSORTIA_ADDFRESH = 0x102f, // 公会祈福信息物品

	U_C_QUEST_FINISH = 0x0034, //完成任务
	/**
	 * 物品移动
	 */
	U_C_BAG_MOVE = 0x0036, //--背包移动客户端发送协议
	/**
	 * 使用道具
	 */
	U_C_BAG_USEITEM = 0x0037, //用户使用道具
	/**
	 * 购买物品
	 */
	U_C_BAG_BUY = 0x003a,
	/**
	 * 英雄装备改变
	 */
	U_C_HERO_UPDATE_EQUIPMENT = 0x003b,

	/**
	 * 技能升级
	 */
	U_C_HERO_SKILL_UPGRADE = 0x003c,
	/**
	 * 技能重置
	 */
	U_C_HERO_SKILLPOINT_RESET = 0x003d,

	/**
	 *天赋等级升级
	 */
	U_C_TALENT_GRADE_UP = 0x114e,
	/**
	 * 英雄天赋信息
	 */
	U_C_TALENT_INFO = 0x114f,
	/**
	 * 更新英雄技能（升级）
	 */
	U_C_HERO_UPDATESKILL = 0x003f, //更新技能
	/**
	 * 设置快捷键
	 */
	U_C_HERO_SETFASTKEY = 0x0040, //设置快捷键
	/**
	 * 英雄符文操作返回结果
	 */
	U_C_RUNE_OP = 0x118f,
	/**
	 *  铁匠铺合成
	 */
	U_C_ITEM_COMPOSE = 0x0059,
	U_C_SHOP_BUY = 0x005a, // 购物

	U_C_SHOP_HASBUY = 0x1031, //用户限购信息
	U_C_CHECK_NICK = 0x1034, //通过玩家昵称获得玩家ID
	/**
	 * 招募兵种
	 */
	U_C_ARMY_RECRUITED = 0x005c,
	/**
	 * 配兵
	 */
	U_C_ARMY_EDIT = 0x005d, // 配兵
	/**
	 *  升级兵种
	 */
	U_C_ARMY_UPGRADEPAWN = 0x005f, // 升级兵种
	/**
	 * 攻打城堡
	 */
	U_C_ARMY_ATTACK_CASTLE = 0x0061,
	/**
	 *召回
	 */
	U_C_ARMY_RETURNHOME = 0x0062, // 召回
	/**
	 * 传送阵冷却
	 */
	U_C_BUIDLING_TRANS_COOL = 0x0065, // 传送阵冷却

	/**
	 *  加速建筑队列
	 */
	U_C_BUILDING_ORDER_QUICK = 0x0066, // 加速建筑队列
	/**
	 *传送阵充能
	 */
	U_C_BUILDING_UPENERGY = 0x0067, // 传送阵充能
	/**
	 * 扩展队列
	 */
	U_C_BUILDING_ORDERADD = 0x0068, // 扩展队列
	/**
	 *传送城堡、玩家回城快速定位城堡(没有占领城堡则是定位城镇，占领城堡则按照OuterCity.CastleNodeIdList顺序定位)
	 */
	U_C_BUILDING_TRANSCASTLE = 0x0069,

	U_C_TRASNBUILDING_RESULT = 0x103f, //传送结果

	U_C_ARMY_POSATION = 0x108d, // 定点传送
	U_C_ARMYPOS_FAIL = 0x10a7, // 定点传送失败
	/**
	 * 摘果实
	 */
	U_C_TREE_PICK = 0x006a, // 摘果实

	U_C_CANWATER_USERS = 0x105e, // 可以浇水的用户列表

	U_C_SEND_WATER_RESULT = 0x103e, // 发送浇水结果
	U_C_PICK_HARVEST_MSG = 0x105d, // 摘取果实收获信息

	//		  U_C_TREE_WATER   = 0x006B,// 浇水
	/**
	 *放弃野地
	 */
	U_C_UNOCCPWILDLAND = 0x006c, // 放弃野地
	U_C_CASTLE_UPDATE = 0x006d, //内城更新

	U_C_PLAYER_EFFECT = 0x006e, //科技加成
	U_C_CHANNEL_ALERT = 0x006f,
	/**
	 *英雄属性更改
	 */
	U_C_HERO_INFO = 0x0071, //英雄属性更改
	/**
	 * 附件领取结果
	 */
	U_C_MAILITEM_MOVE_RESULT = 0x0072,
	U_C_MAIL_LIST = 0x1023, // 获取邮件列表
	U_C_MAIL_INIT_LIST = 0x12f5, // 获取邮件初始化列表(分批发送所有）
	/**
	 * 物品位置更新
	 */
	U_C_BAG_MOVE_UPDATE = 0x0073, //--背包移动客户端接收协议
	U_C_PAWN_INFO = 0x0074, //兵种升级
	/**
	 * 公会状态改变
	 */
	U_C_CONSORTIA_STATIC = 0x0075,
	U_C_CASTLE_DEFENSE = 0x0076,
	U_C_CASTLE_TIME = 0x1164, // 城堡防御时间通知客户端
	/**
	 * 战役房间列表
	 */
	U_C_CAMPAIGN_ROOM_MEMBER = 0x0078,
	/**
	 * 切换房主
	 */
	U_C_CAMPAIGN_ROOM_MASTER = 0x0079, // 房主
	/**
	 *切换副本地图
	 */
	U_C_CAMPAIGN_CHANGE = 0x007a,
	/**
	 * 用户登出    (广播给房间里的所有人, 不包括登出者)
	 */
	U_C_CAMPAIGN_LOGIN_OUT = 0x007b,
	/**
	 * 用户登入    (广播给房间里的所有人, 不包括登入者)
	 */
	U_C_CAMPAIGN_LOGIN_IN = 0x007c,
	/**
	 * 创建战役
	 */
	U_C_CAMPAIGN_CREATE = 0x007d, //
	U_C_MSG = 0x007e, //系统信息提示
	/**
	 *v战役节点信息
	 */
	U_C_CAMPAIGN_NODE = 0x007f,
	/**
	 * 战役节点信息更新
	 */
	U_C_CAMPAIGN_NODE_UPDATE = 0x0080,
	/**
	 *节点战胜
	 */
	U_C_NODE_SUCCESS = 0x0081, // 节点战胜
	/**
	 *战役迷雾
	 */
	U_C_CAMPAIGN_FOG = 0x0082, //战役迷雾
	/**
	 * 战役中部队信息更新
	 */
	U_C_CAMPAIGN_ARMY_UPDATE = 0x0083, //
	/**
	 * BOSS战邀请
	 */
	U_C_CAMPAIGN_BOSS_ARMY_INVITE = 0x0084, //
	/**
	 *  BOSS 部队列表
	 */
	U_C_CAMPAIGN_BOSS_ARMY_LIST = 0x0085, //
	/**
	 * 战役完成
	 */
	U_C_CAMPAIGN_FINISH = 0x0086,
	/**
	 *  战役翻牌开始
	 */
	U_C_CAMPAIGN_CARDS = 0x0087,
	/**
	 *更新战役条件信息
	 */
	U_C_WIN_CONDITIONS = 0x0088,
	/**
	 *战役结算
	 */
	U_C_CAMPAIGN_REPORT = 0x0089, // 战役结算
	/**
	 *游戏剧情
	 */
	U_C_GAME_PLOT = 0x008a, //

	U_C_BATTLE_TALK = 0x00ab, // 战斗剧情
	/**
	 *补充兵力
	 */
	U_C_ARMY_SUPPROT = 0x008b,
	/**
	 *  服务器通知客户端更新大地图更新
	 */
	U_C_MAPDATA_SYNC = 0x008c,
	U_C_LOCK_SCREEN = 0x008d, // 锁定屏幕
	U_C_CAMERA_MOVE = 0x008e, //场景移动
	U_C_PLAY_MOVIE = 0x008f, //播放动画
	/**
	 * 更新等待列表中的血量
	 */
	U_C_BATTLE_ARMY_UPDATE = 0x0090,
	U_C_WATERLOG_SEND = 0x0091, // 发送浇水日
	U_C_HARVEST_MSG = 0x0092, // 收获信息提示
	U_C_TREEINFO_UPDATE = 0x0093, // 更新树信息
	/**
	 * 更新装备广播
	 */
	U_C_HERO_BROAD_EQUIPMENT = 0x0095,

	/**
	 *建筑列表
	 */
	U_C_BUILDINGINFO_LIST = 0x1022, // 队列信息

	/**
	 * 使用建筑队列
	 */
	U_C_BUILDING_ORDER_INFO = 0x0097, // 队列信息

	/**
	 * 内政厅数据更新
	 */
	U_C_SECURITY_INFO_UPDATE = 0x0098, // 内政厅信息更新
	/**
	 * 战斗
	 */
	U_B_FIGHT_CANCELED = 0x1046, //战斗结束
	U_B_ATTACKING = 0x0099, //战斗攻击
	U_B_PREPARE_OVER = 0x009a, //战斗结束
	U_B_START = 0x009c, //战斗开始
	U_B_PREPARE = 0x009d, //准备战斗

	U_CH_FRIEND_LOGIN = 0x00a0,
	U_CH_FRIEND_LOGOUT = 0x00a1, // 好友下线
	U_CH_CONSORTIA_USERLOGIN = 0x00a2, //公会成员上线
	U_CH_CONSORTIA_USERLOGOUT = 0x00a3, //公会成员下线
	/**
	 * 更新公会信息
	 */
	U_CH_CONSORTIA_FRESHINFO = 0x00a4,
	U_CH_FRIEND_UPDATE = 0x00a5, //好友信息更新
	U_B_GAME_OVER = 0x009f, //新手战斗完成

	/**
	 * 增援
	 */
	U_B_USER_REINFORCE = 0x0048,
	U_CH_CHANNEL_CHA = 0x0053,

	U_C_VIP_OPENTIPS = 0x1140, //是否提示vip过期
	U_C_VIP_INFO = 0x113a, // vip信息
	U_C_VIP_GIFT_RSP = 0x1139, // vip获取/Buff返回
	U_C_OPENVIPROULETTE = 0x113e, // 打开轮盘
	U_C_VIPROULETTE_RESULT = 0x113f, // 轮盘转完的结果
	U_C_SNSINFO = 0x1124, // 通知SNS

	/**
	 * 增援部队资源
	 */
	U_B_LOAD_RES = 0x1035,
	/**
	 * 更新同屏见部队列表
	 */
	U_C_ARMY_UPDATE_GRID = 0x00a9, // 更新同屏见部队列表
	/**
	 * 撮合战房间状态
	 */
	U_C_ROOM_STATE = 0x0019, //
	/**
	 *战役系统部队
	 */
	U_C_CAMPAIGN_SYSTEM_ARMY = 0x0014,
	U_CH_FRIENDADD_CONFIRM = 0x0054, // 添加好友验证
	U_CH_ADD_RELATIONSHIP = 0x004e, // 添加好友或黑名单
	U_CH_REMOVE_RELATIONSHIP = 0x004f, // 移除好友或黑名单
	U_CH_RECOMMENDLIST = 0x0055, // 推荐好友
	U_C_QUEST_UPDAT = 0x0070, //任务更新
	/**
	 * 暂停指令
	 */
	U_B_USER_STOP = 0x0045,
	/**
	 *战役房间列表
	 */
	U_C_CAMPAIGN_ROOM_EDIT = 0x0020, // 房间编辑
	U_C_PLAYER_READY_STATE = 0x0018, // 玩家准备状态
	/**
	 *chat server
	 */
	U_BATTLE_REPORT = 0x1007,
	U_B_HERO_ORDER = 0x004b,
	U_C_NPC_CHAT = 0x1043, // NPC 聊天泡泡

	U_C_ARMY_POS_UPDATE = 0x1008, // 服务器端发送至客户端
	U_C_ARMYPOS_BROAD = 0x1059, // 副本玩家移动坐标同步

	U_C_NPC_CHASE_ARMY = 0x1009, // NPC追击玩家
	U_C_NPC_MOVE = 0x101a, // NPC移动
	U_C_FAST_USE_BLOOD = 0x00aa, // 快速使用血包
	U_C_ESCORT_NPC_ADD = 0x101b, // 新增一个NPC
	U_C_ESCORT_NPC_FOLLOW = 0x101c, // NPC跟随
	U_C_SEND_STANDPOS = 0x101e, // 回退站立点位置
	U_C_SMALL_MAPFOG = 0x101f, // 小地图迷雾
	U_C_PHYSIC_LIST_UPDATE = 0x1021, // 野地列表更新,

	U_C_MAIL_DEL_RESULT = 0x1024, // 删除邮件结果

	U_C_LOAD_CASTLE = 0x1039, // 加载城堡信息
	U_C_LOAD_BUILD = 0x103a, // 加载建筑信息
	U_C_LOAD_BUILD_ORDER = 0x103b, // 加载建筑队列信息
	U_C_LOAD_FRIEND_LIST = 0x103c, // 加载建好友列表信息
	U_C_LOAD_WATER = 0x103d, // 加载树
	U_C_LEED_UPDATE = 0x1038, // 新手引导更新
	U_C_LEED_RECEIVE = 0x1036, // 每日引导完成
	U_C_SEND_SYSPROPERTY = 0x1040, // 发送系统当前属性

	U_C_PLAYER_MOVE = 0x1042, // 副本玩家移动
	U_C_ARMY_CHANGESHARP = 0x1044, // 玩家变身
	U_C_BUFFER_LIST = 0x1045, // 副本BUFFER
	U_C_PLAYER_ADDITION = 0x120a, // 用户一级属性加成
	U_C_BROAD_POS = 0x1047, // 广播移动坐标

	U_C_ARMY_REMOVE = 0x1048, // 大地图部队移除

	U_C_CHALLENGE_INFO = 0x1049, //挑战赛信息
	U_C_WORLD_BOSSINFO = 0x104b, // world boss info(服务器端下发)

	U_C_SYNC_BOSS_HP = 0x104e, // 同步BOSS血量
	U_C_PLAYER_DIE_STATE = 0x104f, // 玩家死亡状态

	U_C_CAMPAIGN_STATE = 0x1056, // 世界BOSS战状态(服务器端发给客户端协议号)

	U_C_MULTI_HPSYNC = 0x1057, // 多人BOSS副本血条同步

	U_C_ACTIVE_CHECK = 0x105f, //活动返回值
	U_C_LUCKY_REFRESH = 0x1080, // 招财刷新
	U_C_REFININGSOUL_FRFRESH = 0x1114, // 炼魂刷新
	U_C_PLAYER_HANGUPSTATE = 0x106e, // 挂机状态

	U_C_TOWERLIST = 0x1115, // 迷宫列表
	U_C_TOWERINFO = 0x106d, // 无限塔信息发送
	U_C_TOWER_DIED = 0x106f, // 无限塔死亡
	U_C_PLAYER_NODE_STATE = 0x1070, // 玩家站立状态（服务器发下）
	U_C_ARMYPOS_SEND = 0x1091, // 发送部队当前位置
	U_CH_FRIEND_ADDED = 0x1096, // 被添加为好友

	U_C_ACTIVE = 0x109b,
	U_C_WARFIELD_INFO = 0x109c, // 战场阵营
	U_C_WARFIELD_STATE = 0x1098, // 战场状态
	U_C_WARREPORT = 0x109e, // 战场结算
	U_C_ORDERREQUEST = 0x109f, // 战场排名发送
	U_C_NODEPOS_REFERSH = 0x109d, // 节点位置变更

	U_C_ITEM_REFRESHPROPERTY = 0x1110, // 洗练属性
	U_C_REFRESHFORRANDOM = 0x10a2, // 物品洗练随机结果
	U_C_REFRESHFORREPLACE = 0x10a3, // 物品洗练替换
	U_C_RESOLVE = 0x10a4, // 物品分解
	U_C_BROADBUFFER = 0x10a6, // 广播部队buffer
	U_C_CAMPAIGN_NODE_ADD = 0x10a8, // 节点添加
	U_C_TAKEDROP_FAIL = 0x10ac, // 拾取掉落箱子失败

	U_C_RELOADDIRTY = 0x10a9, // 重新加载脏字符文件
	U_C_CONSORTIA_PASS_USER = 0x10aa, // 公会通过邀请通知申请用户

	U_C_CONSORTIA_LINK = 0x10ab, // 公会招收链接
	U_C_WARMOVIE = 0x10ad, // 战场动画
	U_C_PLAYER_RENAME_RSP = 0x10af, // 改名结果
	U_C_MALL_SELL_ITEM = 0x1100, // 出售物品
	U_C_MALL_LIST_SELL = 0x1101, // 物品列表
	U_C_MALL_PLAYER_ITEMS = 0x1102, // 玩家出售的所有物品
	U_C_MALL_AUCTION = 0x1103, // 竞拍物
	U_C_MALL_LIST_AUCTION = 0x1104, // 查看自己竞拍记录
	U_C_MALL_FIX_AUCTION = 0x1105, // 一口价
	U_C_MALL_CANCEL_SELL = 0x1106, // 取消出售
	U_C_MALL_SEARCH = 0x1107, // 搜索物品

	U_B_BATTLE_NOTICE = 0x1109, // 战斗中消息提示
	C_WORLDBOSSWOUND_REWARD = 0x1111, // 世界boss伤害奖励

	U_C_TIME_JUDGE = 0x1113, // 时间容错

	U_C_WORLDBOSS_BUFFER = 0x1116, //世界BOSS 购买buffer
	U_C_WORLDBOSS_LOAD = 0x111d, // 世界boss 预加载
	U_C_PLAY_GETMOIVE = 0x111e, // 战斗结算动画

	/** 神秘商店 */
	U_C_SHOPITEM_BUY = 0x111f, // 购买返回
	U_C_SHOPITEM_FRESH = 0x1120, // 刷新神秘商店物品列表

	U_C_QUESTION_REPLAY = 0x1118, // 客服回复
	U_C_OPEN_CUSTOMER = 0x1128, //能否打开客服页面

	U_C_CONSORTIA_VOTING_LIST = 0x1125, // 公会投票用户列表
	U_C_CONSORTIA_VOTING = 0x1126, //公会投票结果

	U_C_BLESS_REFRESH = 0x1127, // 祝福轮盘查看

	U_C_DAYACTION = 0x1129, // 返回每日活动
	U_C_CLICKADD = 0x113d, //返回日常活动点击增加
	U_C_CLICKDATA = 0x113c, //日常活动完成次数

	U_C_SECURITY_CODE = 0x1132, //发送验证码
	U_C_SEND_CHECKSUCC = 0x1131, //验证码验证成功

	/** 迷宫100层 通告 来自服务器 */
	U_C_TOWER_REPORT = 0x1143,
	/** 扫荡 */
	U_C_CAMPAIGN_SWEEP = 0x1149, // 扫荡结果
	/** 返回是否发送过手机号码 */
	U_C_CHECK_SEND = 0x1144,
	U_C_REQUEST_GUILDLIST = 0x111b, // 请求公会列表
	U_C_TEAMEDIT_RESULT = 0x1134, // 公会战人员编辑结果
	/** 修行神殿PK */
	U_C_HANGUP_PVP = 0x1145,
	/** 购买替身返回 */
	U_C_OPRATE_REPLACEMENT_STATE = 0x1148,
	/** 替身状态 */
	U_C_REPLACEMENT_STATE = 0x1147,
	/** 坐骑信息更新 */
	U_C_MOUNT_UPDATE = 0x114a,
	/** 坐骑列表 */
	U_C_MOUNT_AVATARLIST = 0x114b,

	U_C_SEND_NEEDOFFER = 0x111c, // 请求挑战所需财富
	U_C_REQUEST_GUILDCHALLENGE = 0x1119, // 请求挑战赛公会排名
	/** 兑换礼包列表信息 */
	U_C_ACTIVE_EXCHANGE = 0x1151,
	/** 精灵盟约 */
	U_C_KING_CONTRACTE = 0x1152, //精灵盟约
	/** 问卷调查 */
	U_C_QUESTIONNARIE_LIST = 0x114c,
	U_C_QUESTIONNARIE_ANSWER = 0x114d,
	U_C_ADD_BOSS_HP = 0x1153, //给boss加血
	U_C_GUILDWAR_SCORE = 0x1157, // 公会战积分
	U_C_GUILDLAST_WEEK_ORDER = 0x116a, //公会战排名
	U_C_GUILDWAR_TEAM = 0x1159, // 公会战组别
	U_C_GUILDWAR_BUFFER = 0x1158, // 公会战BUFFER列表
	U_C_ALTARNPC_MOVE = 0x1160, // 魔神祭坛NPC移动
	U_C_NODE_HP = 0x1162, // 同步血量
	U_C_GUILDWAR_STATE = 0x1163, // 公会战状态
	U_C_GUILDWAR_OPEN_LEFTTIME = 0x1169, //公会战开启倒计时
	U_C_CAMPIAGN_OPEN_MV = 0x1168, //战场最后10秒时间同步动画
	U_C_MOUNT_INFO_SEND = 0x116b, //查看玩家坐骑信息
	U_C_GUILDWAR_JOIN_PLAYER_COUNT = 0x116e, //工会战参战人数
	U_C_GUILDWAR_WOUND = 0x116c, //公会战贡献同步
	U_C_REBATE_ACTIVE = 0x116d, //回馈活动普遍数据
	U_C_REBATE_DATA = 0x116f, //回馈活动个人数据

	U_BUY_TRIAL_RESULT = 0x1173, //购买试炼BUFF结果
	U_C_CROSS_USER_INFO = 0x1170, //跨服个人信息
	U_C_VEHICLE_NPC_NODE = 0x117a,
	U_C_VEHICLE_SYNC_POSITION = 0x117d, // 载具NPC节点信息
	U_C_VEHICLE_SWITCH_MONITOR = 0x117e, // 载具却换怪物监控者
	U_HERO_TRIAL_IFNO = 0x1174, //英雄试炼BUFF信息

	U_C_DAYGESTE_SEND = 0x1177, // 每日获得荣誉
	U_C_MYSTERYEVENT_LIST = 0x1176, // 神秘商店事件信息列表

	U_C_SUM_ACTIVE_TEMP = 0x117b, //精彩活动模版
	U_C_SUMACTIVE_DATA = 0x117c, //精彩活动用户数据
	U_C_ISTAKE_CROSS_SCORE_REWARD = 0x1181, //通知能否领取跨服积分奖励
	U_C_CROSS_SCORE_REWARD_RESULT = 0x1182, //跨服积分奖励领取结果
	U_WARFIELD_FORCE_QUIT = 0x1183,

	U_APPELL_DATA = 0x1184, //用户称号数据
	U_APPELL_GET = 0x118b, //用户获得称号
	U_CCC = 0x118a,
	U_C_FASHION_COMPOSE = 0x1187, // 时装合成
	U_C_FASHION_SWITCH = 0x1188, // 时装转换
	C_HERO_UPDATE_EQUIPMENT = 0x1390, // 时装更新（合成的时装）
	U_C_FASHION_SHOP_BUY = 0x1186, // 时装购物车购买返回

	U_C_GAMETIMES_INFO = 0x118c, // 神曲时报更新通知
	U_CHECK_WARFIELD_COUNT_RS = 0x118d, // 检查战场进入次数
	U_C_CROSS_ARMY_UPDATE = 0x118e, //批量军队信息更新

	U_C_VEHICLE_STATE = 0x11a0, //载具活动开放
	U_C_VEHICLE_LIST_RSP = 0x11a4, //
	U_C_VEHICLE_PROFILE_CHANGE = 0x11a3, //载具信息
	U_C_VEHICLE_ATTACK_RSP = 0x11a8, //技能攻击返回
	U_C_VEHICLE_SYNC_SKILL = 0x11a9, //同步玩家技能
	U_C_VEHICLE_SYNC_BUFF = 0x11aa, //同步玩家Buff
	U_C_VEHICLE_MOVE = 0x11a7, //载具移动同步
	U_C_VEHICLE_EXIT = 0x11ab, //玩家退出
	U_C_VEHICLE_CAMPAIGN_LIST_RSP = 0x11a5, //初始化副本 载具列表
	U_C_VEHICLE_JOIN = 0x11a1, //玩家加入载具副本
	U_C_VEHICLE_DETAILE = 0x11a6, //载具副本信息
	U_C_VEHICLE_END = 0x11a2, //载具结算
	U_C_VEHICLE_BOSS_ATTACK_TIP = 0x11ac, //boss攻击预告
	U_C_VEHICLE_ROOM_START_COUNT = 0x11ad, //快速开始倒计时
	U_C_SMALL_BUGLE_FREE_COUNT = 0x1194, //请求小喇叭免费次数的返回结果
	U_C_RUNE_RESET = 0x11af, //重置符文吞噬数量
	U_C_VEHICLE_TECH_RSP = 0x1195, //魔灵科技度
	U_C_FASHION_BOOK = 0x11be, //查看时装衣柜信息返回
	/**
	 * 神奇魔罐
	 */
	U_C_BOTTLE_PASS = 0x1191,

	U_C_BOTTLE_RESULT = 0x11ae, //魔罐首页物品
	//===================================宠物相关===================================//
	U_C_PLAYER_PETINFO = 0x11bc, //宠物信息更新
	U_C_PET_REMOVE = 0,
	//===================================宠物相关 end================================//
	U_C_REQUEST_360_REWARD = 0x11bf, //360 特权礼包领取状态
	U_C_GAME_STORY_DROP = 0x11c2, // 返回掉落彩蛋结果

	U_C_FATE_REQUEST = 0x11c0, // 命运守护信息返回
	U_C_FATE_TURNREQUEST = 0x11c1, // 命运轮盘信息返回

	U_C_CROSS_BIGBUGLE = 0x11bd, // 收到跨区大喇叭
	/**
	 * 天空之城
	 * 玩家进入场景
	 */
	U_C_PLAYER_SPACE_ENTER = 0x11f0,
	/**
	 * 天空之城
	 * 玩家离开场景
	 */
	U_C_PLAYER_SPACE_LEAVE = 0x11f1,
	/**
	 * 天空之城
	 * 移动
	 */
	U_C_PLAYER_SPACE_SYNC_POS = 0x11f2,
	/**
	 * 天空之城
	 * 玩家进入天空之城, 当服务器判断玩家不在天空之城时, 返回此协议, 通知客户端创建天空之城, 并且发送玩家自己的信息
	 */
	U_C_PLAYER_SPACE_CREATE = 0x11f3,
	/**
	 * 天空之城
	 * 玩家进入天空之城, 当服务器判断玩家在天空之城时, 返回此协议, 客户端直接切换场景
	 */
	U_C_PLAYER_RETURN_TO_SPACE = 0x11fe,
	/**
	 * 天空之城
	 * 玩家进入天空之城, 服务器发送已经存在的玩家列表
	 */
	U_C_PLAYER_SPACE_SEND_EXSIT = 0x11f5,
	/**
	 * 天空之城
	 * 登录时, 同步玩家当前所在场景ID（目前有天空之城的地图ID, 以及宠物岛的地图ID）
	 */
	U_C_PLAYER_LOGIN_SYNC_MAPID = 0x11f6,
	/**
	 * 天空之城
	 * 下行玩家在场景中的行为(依据节点判断)
	 */
	U_C_PLAYER_SPACE_EVENT = 0x11f9,
	/**
	 * 天空之城
	 * 移除视野外的玩家
	 */
	U_C_PLAYER_REMOVE_IN_SPACE = 0x11ff,

	/**
	 * 购买限时热卖的商品
	 * 返回商品限购的次数
	 */
	U_C_BUY_DISCOUNT = 0x11f7,

	/**
	 * 刷新限时抢购物品列表
	 * */
	U_C_FLASHSALE_FRESH = 0x11c3,

	/** 更新战斗觉醒值 */
	U_C_UPDATE_AWAKE = 0x11f8,
	/** 查询英灵返回 */
	U_C_RECEIVE_PET_DATA = 0x1200,
	/** 节点锁住 */
	U_C_NPC_LOCK = 0x1201, // 节点锁住
	/**
	 *  基金活动
	 */
	U_C_ACTIVE_DEPOSIT = 0x1204,
	/**
	 * VIP专属坐骑状态
	 */
	U_C_VIPMOUNT_STATE = 0x1202,
	/** 返回英灵竞技列表 */
	U_C_PET_CHALLENGE_LIST = 0x1203,
	/** 矿场玩家矿车信息同步 */
	U_C_SYNC_MINE_TRAMCAR = 0x11c4,
	/** 环任务更新 */
	U_C_REPEAT_REWARD_UPDATE = 0x1206,
	/** 环任务全部结束 */
	U_C_REPEAT_REWARD_END = 0x1207,
	/** 已完成的环任务数更新 */
	U_C_REPEAT_REWARD_FNISHED_SUM_UPDATE = 0x1208,
	/** 环任务完成 */
	U_C_REPEAT_REWARD_FINISH = 0x1209,
	/**
	 * 英灵竞技奖励信息
	 */
	U_C_PET_RANK_REWARD = 0x1205,

	U_C_PET_CHALLENGE_LOG = 0x1267, // 英灵竞技战报列表

	U_CH_FRIEND_ADDED_LIST = 0x1268, // 添加好友请求列表

	U_CH_FRIEND_REQMSG_ACT = 0x1269, // 好友请求列表操作返回
	/**
	 * 紫晶矿场活动开启/关闭
	 */
	U_C_MINE_ACTIVE_STATE = 0x11c5,
	/** 返回英灵竞技英雄榜 */
	U_C_TOP_CHALLENGE_INFO = 0x120b,
	/** 邀请组队 */
	U_C_TEAM_INVITE = 0x120c,
	/** 玩家暂时离开 */
	U_C_TEAM_LEAVE_FOR_NOW = 0x120d,
	/** 新建队伍 */
	U_C_TEAM_CREATE = 0x120e,
	/** 同步队友信息 */
	U_C_TEAM_PLAYER_INFO = 0x1210,
	/** 队伍解散 */
	U_C_TEAM_DISMISS = 0x1211,
	/** 新成员加入 */
	U_C_TEAM_ADD_MEMBER = 0x1212,
	/** 队长转移 */
	U_C_TEAM_CAPTAIN_CHANGE = 0x1213,
	/** 战斗阵型变化 */
	U_C_TEAM_FIGHT_POS_CHANGE = 0x1214,
	/** 成员离开 */
	U_C_TEAM_MEMBER_LEFT = 0x1215,
	/** 踢出队伍 */
	U_C_TEAM_KICK_MEMBER = 0x1216,

	/** 战斗守护信息 */
	U_C_BATTLEGUARD_INFO = 0x1217,

	/**
	 * 藏宝图信息
	 */
	U_C_TREASUREMAP_INFO = 0x1219,
	/**
	 * 是否确定获得奖励（当队伍中有玩家不能获得奖励时, 给予提示）
	 */
	U_C_TREASUREMAP_REWARD = 0x121a,
	/**
	 * 弹出领取老玩家免费礼包按钮
	 */
	U_C_NEW_PLAYER_GIFT = 0x11c6,
	/**
	 * 拒绝组队邀请状态刷新
	 */
	U_C_REFUSETEAMINVITE_REFRESH = 0x121b,

	/** 七日目标引导 */
	U_C_SERVEN_LEAD = 0x121e,
	/**
	 * 内部抽奖 自己抽奖信息
	 */
	U_C_LOTTERY = 0x121c,
	/**
	 * 内部抽奖 抽奖开放状态
	 */
	U_C_LOTTERY_STATE = 0x121d,
	/**
	 * 内部抽奖 幸运传递
	 */
	U_C_LOTTERY_NOTICE = 0x121f,
	/**
	 * 内部抽奖 抽奖物品列表
	 */
	U_C_LOTTERY_ITEMS = 0x1221,
	/**
	 * 内部抽奖 抽奖结果
	 */
	U_C_LOTTERY_RESULT = 0x1222,
	/**
	 * 新手矿脉
	 */
	U_C_FRESHMAN_DEPOSIT = 0x1220,

	/**诸神降临活动信息**/
	U_C_TOLLGAGEINFO = 0x1223,
	/**诸神降临活动领取奖励**/
	U_C_TOLLGAGE_GETREWARD = 0x1224,
	/**诸神降临活动开启与关闭**/
	U_C_TOLLGATE_IS_OPEN = 0x1225,
	/**诸神降临活动积分排行榜**/
	U_C_TOLLGATE_SCORE = 0x1226,
	/**诸神降临活动通关奖励结果**/
	U_C_TOLLGATE_REWARD = 0x1227,
	/**
	 * 天穹之径玩家手动升级区域
	 */
	U_C_UPDATE_AREA = 0x11c7,
	/**
	 * 返回闯关(天穹之径)信息
	 */
	U_C_RES_SINGLEPASS_INFO = 0x11c8,
	/**
	 * 请求天国号角轮盘奖励物品列表
	 */
	U_C_BUGLE_REQ = 0x11c9,
	/**
	 * 获取天国号角轮盘奖励
	 */
	U_C_BUGLE_REWARDS = 0x11ca,
	/**
	 * 推送VIP客服QQ
	 */
	U_C_VIPCUSTOM_NOTIFY = 0x1228,

	/**
	 *  返回龙魂信息
	 */
	U_C_DRAGON_REQ = 0x11cb,
	/**
	 *  更新荣誉装备等级信息
	 */
	U_C_HONOR_EQUIP = 0x11cc,
	/**
	 *  转职等级信息
	 */
	U_C_TRANS_GRADE = 0x11cd,
	/**
	 *  装备神铸结果
	 */
	U_C_MOULD_ITEM = 0x11ce,
	// ----------------------------0x1324之后的协议将留给海外使用------------------------------------//
	/**
	 *王者之塔
	 */
	U_C_KING_INFO = 0x1324, //玩家王者之塔挑战信息
	/**
	 * 拉霸活动信息返回
	 */
	U_C_SLOTINFO = 0x1325,
	/**
	 * 卡牌查看战斗力加成
	 */
	// U_C_POWCARD_Fight_ADD = 0x1326,
	/**
	 * 卡牌副本Buff
	 */
	U_C_POWCARD_BUF_ON = 0x1327,
	/**
	 * 卡牌Buff
	 */
	U_C_POWCARD_BUF = 0x1328,
	/**
	 *  套装卡牌信息
	 */
	U_C_POWCARD_ALL = 0x1329,

	U_C_FBEVENT = 0x132a, // FB分享事件
	//===============================   答题系统start       ======
	/** 玩家状态*/
	U_C_ANSWER_PLAYER_INFO = 0x132b,
	/** 单道题信息*/
	U_C_ANSWER_SINGLER_QUESTION = 0x132d,
	/** 当前系统状态*/
	U_C_ANSWER_SYSTEM_STATE = 0x132c,
	/** 排行前十*/
	U_C_ANSWER_RANK_LIST = 0x132e,
	//------------------------------  答题系统 end
	/** 激活码*/
	U_C_ACTIVE_CODE = 0x132f,
	/** 用户找回数据*/
	U_C_RECOVER = 0x1330, //用户找回数据
	/**
	 * 返回房间状态（房间 or 副本）
	 */
	U_C_MULITY_CAMPAIGN_REQUEST = 0x1331,

	/** 寻宝系统请求*/
	U_C_SEEK_LOADNODEINFO = 0x1332, // 同步寻宝系统节点信息
	/** 寻宝系统界面消息提示*/
	U_C_SEEK_MESSAGE = 0x1333, // 寻宝系统界面消息提示

	U_C_FISH_POOL = 0x1334, // 玩家鱼池信息

	U_C_FISH_CHECK = 0x1335, // 钓鱼验证结果

	U_C_FISH_INFOS = 0x1336, // 玩家鱼群信息

	U_C_FISH_HELPOVER = 0x1337, // 协助结束

	U_C_FISH_CRAZY = 0x1338, // 狂暴的鱼位子, 供协助的玩家看到当前狂暴鱼

	U_C_FBEVENT2 = 0x1339, // FB分享事件2

	/**
	 * 夺宝奇兵信息返回
	 */
	U_C_GEMMAZE_INFO = 0x133a,
	/**
	 * 夺宝奇兵移动宝石后更新协议
	 */
	U_C_GEMMAZE_UPDATE = 0x133b,
	/**
	 * 夺宝奇兵操作结果(0操作不成功 1操作成功), 邀请后锁屏, 邀请不成功就取消锁屏
	 */
	U_GEMMAZE_OPRST = 0x133c,
	/**
	 * 夺宝奇兵邀请请求至被邀请方
	 */
	U_GEMMAZE_INVIDE_NOTICE = 0x133d,
	/**
	 *夺宝奇兵购买次数返回
	 */
	U_GEMMAZE_BUYTIMES_RSP = 0x133f,

	/**
	 * 夺宝奇兵获取积分宝箱奖励返回
	 */
	U_GEMMAZE_GETBOX_RSP = 0x1340,
	/**
	 *外城BOSS状态等信息
	 */
	U_C_MAPBOSS_DATAS = 0x134a,
	/**
	 * 使用神圣之光更新迷雾散去时间
	 */
	U_C_MAPBOSS_FOG = 0x134b,
	/**
	 *外城宝箱掉落
	 */
	U_C_MAPBOSS_BOX = 0x134c,

	U_C_PVP_TIMER = 0x12a8,
	/**
	 *黄金神树踩楼活动累计奖励信息
	 */
	U_C_BOTTLE_ACTIVE = 0x12d9, // 魔罐累计奖励信息
	/**
	 * 魔罐掉落数据
	 */
	U_C_BOTTLE_DROP_DATA = 0x0127,
	/**
	 * 邮箱验证结果
	 */
	U_C_MAIL_CHECK = 0x0151,
	/**
	 *二级密码返回信息
	 */
	U_C_VICEPASSWORD = 0x1258,

	/**
	 * 英雄血量更新
	 */
	U_C_HERO_HP_UPDATE = 0x00ac,
	U_CH_FRIEND_SEARCH_NICKNAME = 0x10b2, // 返回好友搜索
	U_C_FIRST_CHARGE_AWARD = 0x00ad, //首充奖励列表
	U_C_ONLINE_REWARD = 0x1259, //在线奖励返回
	U_C_GRADE_PACKET = 0x125b, //等级奖励页面返回
	U_C_GRADE_PACKET_RECEIVE = 0x125c, //等级奖励领取返回

	U_C_ALL_CHANGE = 0x1270, // 全民兑换

	U_C_SEVEN_TARGET_INFO = 0x125d, //七日目标信息返回
	U_C_SEVEN_TARGET_TASK_RECEIVE = 0x125e, //七日目标任务奖励领取返回
	U_C_SEVEN_TARGET_GIFT_RECEIVE = 0x125f, //七日目标积分或特惠礼包领取返回
	U_C_SEVEN_SIGN_INFO = 0x1261, //七日登录信息返回
	U_C_SEVEN_SIGN_RECEIVE = 0x1260, //七日登录奖励领取返回
	U_C_GROWTH_FUND_INFO = 0x1262, //成长基金信息返回
	U_C_PET_OP_RESULT = 0x1263, //英灵操作返回

	U_C_PLAYER_SETTING = 0x1264, //玩家设置返回

	U_C_TEMPLE_INFO = 0x1265, //修行神殿信息返回

	U_C_CHARGE_ORDER = 0x1266, //请求充值订单号返回

	U_CH_FRIEND_UPDATE_PLAYINFO = 0x00ae, //好友信息更新

	U_C_FETCH_TOKEN = 0x1271, //获取游密token返回

	U_C_CHANGE_PRODUCT_COUNT = 0x1272, //到帐商品数量列表

	U_C_CHANGE_PRODUCT_TODAYCOUNT = 0x1273, //当天到帐商品数量列表

	U_C_CHARGE_ARRIVE = 0x128a, // 到帐通知

	U_C_MAPSHOPINFO = 0x1352, // 外城商店信息

	U_C_OUTER_CITY_SHOP_PASS = 0x0126, //外城商店幸运信息

	U_C_MOUNT_UPGRADESTAR = 0x1247, // 坐骑升星返回

	U_C_CROSSMULTI_MATCHSTATE = 0x012b, // 跨服多人本开放状态

	U_C_MATCH_COMFIRE = 0x1382, // 被撮合到的人会收到协议弹出是否加入现有的副本

	U_C_VOTE_KILLPLAYE = 0x1378, // 跨服多人本其余人会收到投票剔除跨服多人本成员协议

	U_C_CAMPAIGN_MATCHSTATE = 0x1383, // 副本内需要加人的撮合状态

	U_C_NEW_MEMORY_CARD_DATA = 0x10cd, // 记忆翻牌活动数据

	U_C_NEW_MEMORY_CARD_STATE = 0x10cc, // 记忆翻牌活动状态
	U_C_PASS_REWARD_INFO = 0x1275, //通行证奖励页面返回
	U_C_PASS_TASK_FRESH_INFO = 0x1277, //通行证任务领取或刷新返回
	U_C_PASS_TASK_INFO = 0x1276, //通行证任务页面信息返回
	U_C_LUCK_EXCHANGE_TEMP_MSG = 0x016b, //幸运兑换模板
	U_C_LUCK_EXCHANGE_DATA_MSG = 0x016c, //幸运兑换数据

	U_C_GET_ALL_BUBBLE = 0x1279, //返回拥有的气泡信息
	U_C_CHANGE_BUBBLE = 0x1278, //更换或购买气泡返回
	/**
	 * 英灵岛BOSS开始与结束
	 */
	U_C_PETISLAND_BOSS_START = 0x124e,
	U_C_CONSORTIA_BOSS_SKILL = 0x1280, // 公会BOSS技能切换
	U_C_CONSORTIA_BOSS_SYNC_HP = 0x1281, // 公会BOSS血量同步
	U_C_CONSORTIA_BOSS_START = 0x1282, // 公会BOSS开始与结束
	U_C_CONSORTIA_BOSS_STATE = 0x1283, // 公会BOSS任务状态
	U_C_SKILL_EDIT_INFO = 0x1284,
	U_C_TREASURE_MINE_INFO = 0x1285, // 宝矿争夺信息登录和宝矿状态变化的时候推送
	U_C_SELECT_NEW_YEAR_BOX_NODE = 0x12cb, //更新新年宝箱相关信息
	U_C_FOISON_HORN = 0x130d, //丰收号角

	U_C_LOTTERY_RUNE_INFO = 0x1286, // 符石抽奖

	/**英灵战役*/
	U_C_UIPLAY_LIST = 0x1287, // UI副本列表数据
	U_C_UIPLAY_INFO = 0x1288, // UI副本数据
	U_C_TRANSLATE = 0x1289, // 翻译返回
	U_C_SHARE_REWARD = 0x12f0, // 分享奖励数据

	/**评分系统*/
	U_C_STORE_RATINGS_NOTIFY = 0x12f1, // 商店评级通知
	U_C_STORE_RATINGS_REPORT_RESP = 0x12f2, // 商店评级上报返回

	/** 微端*/
	U_C_MICRO_TERMINAL_REWARD = 0x12f3, // 微端奖励数据

	/**打脸图 */
	U_C_FACEIMG_LIST = 0x12f4, // 打脸图数据
	/** 同步多人本房间共享boss血量*/
	U_C_SYNC_ROOM_BOSS_HP = 0x1379,
	/** 泰拉神庙周副本, 服务器通知boss控制玩家和解除控制 */
	U_BATTLE_CONTROL_BUFF_STATE = 0x1387,
	/** 好运红包返回客户端*/
	U_C_GOLDEN_SHEEP = 0x1311,
	U_C_DISCOUNT_MALL = 0x0185, // 新打折商城 信息

	U_C_TURNTABLE_REWARD = 0x11d1, // 抽奖返回
	U_C_TURNTABLE_RSP = 0x11cf, // 转盘活动返回
	U_C_TURNTABLE_SINGLE_RSP = 0x11d0, // 转盘活动返回单条活动信息
	U_C_TURNTABLE_RECEIVE_RESP = 0x11d2, // 转盘领奖返回

	/**
	 *大富翁战斗输了以后服务器发送后退
	 */
	U_C_MONOFIGHT_GOBACK = 0x1302, // 云端历险战斗失败回退
	/**
	 *大富翁掷色子返回消息协议
	 */
	U_C_ROLL_DICE = 0x12fc, // 云端历险掷色子返回消息协议
	/**
	 * 进入大富翁副本返回消息协议
	 */
	U_C_ENTER_MONOPOLY_CAMPAIGN = 0x12fd, // 进入云端副本返回消息协议
	/**
	 * 大富翁副本结算面板返回消息协议
	 */
	U_C_MONOPOLY_CAMPAIGN_OVER = 0x12fe, // 云端副本结算面板返回消息协议
	/**
	 * 大富翁掷色子战斗确认返回消息协议
	 */
	U_C_ROLL_DICE_CONFIRM = 0x12ff, // 云端历险掷色子战斗确认返回消息协议
	U_C_BUY_ROLL_DICE = 0x1300, // 云端历险副本重置
	/**
	 * 大富翁老虎机返回消息协议
	 */
	U_C_SLOT_MACHINE = 0x1301, // 云端历险老虎机返回消息协议
	U_C_BUY_MAGIC_DICE = 0x126B,// 云端历险购买魔力色子返回

	/**泰坦之战*/
	U_C_MULTI_LORDS_FIANL_ORDER = 0x12c6, // 泰坦参与决赛的玩家列表
	U_C_MULTILORDS_INFO = 0x126c, // 多人众神之战客户端信息
	U_C_MULTILORDS_OPENSTATE = 0x126f, // 多人众神之战开启
	U_C_MULTILORDS_FINALORDER = 0x12f7, // 多人众神决赛列表
	U_C_MULTILORDS_SIGN_NOTIC = 0x12f8, // 报名通知
	U_C_MULTILORDS_MAININFO = 0x12f9, // 多人众神之战主面板信息
	U_C_MULTILORDS_LOCAL_FINAL = 0x12fa, // 本服多人众神决赛请求
	U_C_REQUEST_MULTIBET_LIST = 0x12fb, // 多人众神押注获得列表

	U_C_REMOTE_PET_MSG = 0x1364, //远征英灵面板新信息
	U_CH_REMOTE_FRIEND_PETLIST = 0x1365, //远征英灵好友英灵列表
	U_C_REMOTE_FRIEND_PETINFO = 0x1366, //远征英灵好友英灵信息
	U_C_REMOTE_REWARLD = 0x1367, //远征英灵奖励信息
	U_C_TATTOO_RSP = 0x0112, // 龙纹信息
	U_C_FASHION_INFO = 0x012d, //时装等级信息

	U_C_QQ_DAWANKA_INFO = 0x1369, //QQ大厅大玩咖相关信息
	U_C_QQ_GIFT_RSP = 0x1370, // QQ大厅礼包获取返回
	U_C_QQ_GIFT_BAG = 0x1371, // QQ大厅礼包信息
	U_C_QQ_YELLOWVIP_INFO = 0x1375, //QQ空间黄钻相关信息
	U_C_QQZONE_GIFT_BAG = 0x1376, //QQ空间礼包信息

	U_C_STACK_HEAD_STATE = 0x0132, //外域状态信息
	U_C_STACK_HEAD_FULL = 0x0133, //外域完整数据
	U_C_STACK_HEAD_UPDATE = 0x0134, //外域数据更新
	U_C_STACK_HEAD_USER_LIST = 0x0135, //外域公会成员列表
	U_C_STACK_HEAD_BATTLE_DEFENCE = 0x0136, //外域战斗对手信息
	U_C_STACK_HEAD_SELF = 0x0137, //外域自身信息 SelfMsg
	U_C_MAIL_READ_RESP = 0x12f6, // 读取邮件返回更新
	U_BATTLE_WITHDRAW_RSP = 0x1372, // 战斗中投票撤退返回
	U_C_SEAL_ORDER = 0x1373, // 更新战斗中圣印顺序, 战斗中释放圣印技能后推送
	U_C_RUNE_HOLE_INFO = 0x1374, //符孔信息

	U_C_AUTO_SET_CASERN = 0x2572, //设置自动招募
	U_C_STACK_HEAD_SERVERSTATE = 0x0138, // 广播外域游戏服务状态
	U_C_STACK_HEAD_RESP = 0x0139,

	U_C_TOP_TOOL_BTN = 0x11ee, // 顶部工具栏图标
	U_C_MINI_GAME_OPEN = 0x017d, // 小游戏开始
	U_C_CARNIVAL_DATA = 0x10d0, // 嘉年华数据
	U_C_CARNIVAL_TASK_DATA = 0x10d1, // 嘉年华任务数据

	U_C_FIVE_CARD_POKER_INFO = 0x00c0, // 梭哈扑克信息
	U_C_FIVE_CARD_SCORE_REWARD = 0x00c1, // 梭哈扑克奖励
	U_C_MEMORY_CARD_INFO = 0x00c2, // 记忆翻牌信息
	U_C_MEMORY_CARD_REWARD = 0x00c3, // 记忆翻牌奖励
	U_C_LINK_GAME_INFO = 0x00c4, // 连连看信息
	/**
	 * 充值抽奖信息
	 */
	U_C_CHARGELOTTERYINFO = 0x01b0,
	/**
	 * 充值抽奖开启信息
	 */
	U_C_CHARGELOTTERY_STATE = 0x01b1,
	U_C_SUMACTIVE_ACTIVATEDATA_RESP = 0x1190,
	U_C_STACK_HEAD_REPORT = 0x0140, // 外域战报返回

	/**
	 * 幸运盲盒: 活动信息
	 */
	U_C_LUCKYBOX_INFO = 0x01B2,
	/**
	 * 幸运盲盒: 是否开启活动
	 */
	U_C_LUCHYBOX_STATE = 0x01B3,

	/**
	 * 超值团购: 活动信息
	 */
	U_C_SUPERGIFTOFGROUP_INFO = 0x01BD,

	U_C_WISH_POOL_RESP = 0x00C6, // 许愿操作结果
	U_C_WISH_POOL_ALL_INFO = 0x00C5, // 许愿池 界面信息 登录推送
	U_C_WISH_POOL_UPDATE = 0x00C7, // 许愿池信息更新 推送
	L_SYNC_TIME = 0x7008,
	U_C_PET_SUCCINCT = 0x1195, // 英灵洗炼返回
	U_C_OUTCITY_NODE_INFO = 0x01B4,// 外城金矿节点、城堡节点信息
	U_C_OUTCITY_SON_NODE_INFO = 0x01B5, //外城金矿子节点信息更新(三级节点的更新)
	U_C_OUTCITY_ONE_NODE_UPDATE_INFO = 0x01B7, //外城金矿某二级节点更新
	U_C_OUTCITY_ONE_NODE_INFO = 0x01B6, //外城金矿某二级节点下的所有节点
	U_C_SUDOKU_GAME_INFO = 0x00C8,//数独数据

	U_C_MARKET_ORDERACTION_RESP = 0x1100, // 市场订单操作返回
    U_C_MARKET_ITEM_LIST = 0x1101, // 商品列表
    U_C_MARKET_MYORDER_LIST = 0x1102, // 玩家订单列表
    U_C_MARKET_SELLITEM_INFO = 0x1104, // 出售物品信息
    U_C_MARKET_PURCHASEITEM_INFO = 0x1105, //求购物品信息

	U_C_OUTCITYWAR_NODE_STATE = 0x01B8, //外城城战城堡节点状态
	U_C_OUTCITYWAR_BUILD_STATE = 0x01BA, //外城某城堡某建筑状态信息
   	U_C_OUTCITYWAR_PLAYER = 0x01B9, //外城某城堡所有玩家
	U_C_OUT_CITY_WAR_GUILD_INFO_UPDATE = 0x01BB, //更新某城堡下 公会信息
	U_C_OUT_CITY_WAR_GUILD_NOTICE = 0x01BC, //外城 某公会公告
	U_C_OUT_CITY_WAR_SCORE_INFO = 0x01BE,// 城战 怪物积分
	U_C_CHANGE_PRODUCT_WEEKCOUNT = 0x1274,//周礼包购买数量
	U_C_UPACCOUNT_ARTIFACT_RECAST = 0x1305, // 神器重铸返回
	U_C_KF_ISREPLY_RESP = 0x1306, // 客服系统是否有回复新消息
	U_C_PET_ARTIFACT_LIST = 0x120F,// 英灵属性及神器列表
	U_CH_INBLACK_LIST = 0x01BF, // 是否在对方的黑名单列表中

	U_C_FRAME_LIST = 0x1279,	// 返回头像框信息
	U_C_CHANGE_FRAME = 0x1278, //更新/新增头像框返回
	U_C_RESET_MARKET_USE_ORDERCOUNT = 0x1106, // 订单每日使用次数重置
	U_C_OUT_CITY_VEHICLE_INFO = 0x01C0, //外城物资车信息
	U_EXTRAJOB_LIST = 0x01C1, //玩家秘典列表
	U_EXTRAJOB_EQUIP_LIST = 0x01C2, //玩家魂器列表
	U_EXTRAJOB_DETAIL = 0x01C3, //玩家专精信息列表

	U_C_SECRET_INFO = 0x01C4,//玩家秘境信息
	U_C_SECRET_LAYER_INFO= 0x01C7,//玩家未通关秘境记录信息
	U_C_SECRET_GET_TREASURE = 0x01C5,//获取秘宝事件中，损失或获得的秘宝

	U_C_ACCOUNT_BIND_RESP = 0x1303,// 帐号绑定状态
	U_C_UPACCOUNT_REWARD_RESP = 0x1304, // 升级帐号领取奖励返回
	U_C_CONSORTIA_TASK = 0x01C6, // 公会任务
}