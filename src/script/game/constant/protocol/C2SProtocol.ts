/* eslint-disable @typescript-eslint/no-duplicate-enum-values */
export enum C2SProtocol {
  L_GET_PLAYER_LIST = 0x7000, // 获取角色列表
  L_PREPARE_LOGIN = 0x7002, // 准备登录
  L_REGISTER_ROLE = 0x7004, // 创建角色
  L_CREATE_LOGIN = 0x7006, //初始化登录流程

  G_LOGIN_GATEWAY = 0x4e21, // 登录

  B_BATTLE_CHAT = 0x290d, // 战斗内聊天
  CR_CHANNEL_CHAT = 0x61c0, // 跨服战斗聊天
  C_CASTLE_TIME_CANCEL = 0x2172, // 取消城堡防御时间

  C_SYNCHRONIZED_TIME = 0x4e28, //同步系统时间
  G_ACCELERATOR = 0x4e29, // 使用了加速器

  C_GOLD_IMPOSE = 0x2087, // 黄金征收
  C_HANGUP_ROOM_STATE = 0x2067, // 挂机房状态请求
  C_QUICK_HANGUP_TIME = 0x2065, // 挂机加速

  CH_SNSINFO_RESET = 0x3abc, // 社交信息重置

  C_CONSORTIA_QUICK = 0x2161, // 公会冷却时间加速
  /**
   *查看公会宝箱信息
   */
  C_CONSORTIA_BOX_CHECK = 0x2181,
  /**
   *打开公会宝箱分配框
   */
  C_CONSORTIA_BOX_SEND_INFO = 0x2183,
  /**
   *宝箱分配确认
   */
  C_CONSORTIA_BOX_SEND_CONFIRM = 0x2182,

  /**
   *新手触发采集战斗
   */
  C_NEW_GUILD_FIGHT = 0x21fb,
  /**
   *请求进入决赛玩家列表
   */
  C_REQUEST_LOCAL_FINAL_ORDER = 0x2211,
  /**
   *武斗会领取奖励
   */
  C_TAKE_FINAL_REWARD = 0x2210,
  /**
   *请求获奖列表
   */
  C_REQUEST_BET_LIST = 0x220e,
  /**
   *武斗会下注
   */
  C_BET_ADDLORDS = 0x220c,
  /**
   *请求可下注列表
   */
  C_REQUEST_FINAL_ORDERLIST = 0x220b,
  /**
   *武斗会取消撮合
   */
  C_LEAVE_LORDS = 0x220d,
  /**
   *武斗会请求撮合
   */
  C_ENTER_REQUEST = 0x2206,
  /**
   *请求进入武斗会房间
   */
  C_REQUEST_START = 0x220a,
  /**
   *请求武斗会主面板信息
   */
  C_LOAD_LORDS_MAINBORAD = 0x2207,

  /**
   *公会魔神祭坛领取buff
   */
  C_CONSORTIA_ALTAR_GETBUFF = 0x2166,
  /**
   *公会魔神祭坛使用技能
   */
  C_CONSORTIA_ALTAR_BUY_SCENE = 0x2191,
  /**
   *开启公会魔神祭坛
   */
  C_OPEN_CONSORTIA__ALTAR = 0x215d,
  /**
   *进入公会魔神祭坛
   */
  C_ENTER_CONSORTIA_ALTAR = 0x215e,
  /**
   *召唤公会秘境盗宝者
   */
  C_CONSORTIAFARM_OPEN_LORDSNODE = 0x2227,
  /**
   *获取公会秘境Buff
   */
  C_FAM_BUFFER = 0x2176,
  /**
   *召唤公会秘境神树
   */
  C_CALL_TREE = 0x2175,
  /**
   *进入公会秘境
   */
  C_ENTER_CONSORTIA_FAM = 0x2159,
  /**
   * 请求好友农场状态
   */
  C_REQ_FRIEND_FARM_STATE = 0x2027,
  /**
   *农场操作
   */
  CH_FARM_OPER_CHECK = 0x3ac4,

  /**
   * 领悟兵种特性
   */
  C_COMPREHEND = 0x2107,
  /**
   * 保存兵种特性
   */
  C_SAVESPECIAL = 0x2108,
  /**
   *查找好友
   */
  CH_FRIEND_SEARCH = 0x3ac2,
  /**
   *请求最近联系人状态
   */
  CH_CHAT_STATE = 0x3ac3,

  /**
   * 好友请求列表操作
   */
  CH_FRIEND_REQMSG_ACT = 0x3aca,
  /**
   *切换聊天状态
   */
  CH_EXCHANGE_STATE = 0x3ab5,
  /**
   *请求好友基本信息和社交信息
   */
  CH_SIMPLEUSER_INFO = 0x3abe,
  /**
   *更新社交信息
   */
  CH_SNS_UPDATE = 0x3ab9,
  /**
   *添加好友分组
   */
  CH_ADD_GROUP = 0x3ab1,
  /**
   *删除好友分组
   */
  CH_DEL_GROUP = 0x3ab2,
  /**
   *重命名好友分组
   */
  CH_RENAME_GROUP = 0x3ab3,
  /**
   *移动分组好友
   */
  CH_FRIEND_MOVE = 0x3ab4,
  /**
   *IM私聊
   */
  CH_PRIVATE_CHAT = 0x3aaf,

  /**
   *添加悬赏任务
   */
  C_REWARD_ADD = 0x2060,
  /**
   *放弃悬赏任务
   */
  C_REWARD_REMOVE = 0x2061,
  /**
   *刷新悬赏任务
   */
  C_REWARD_FRESH = 0x2062,
  /**
   * 悬赏缉捕
   */
  C_REWARD_ARREST = 0x206a,
  /**
   *悬赏任务完成
   */
  C_REWARD_FINISH = 0x2063,
  /**
   * 手机任务发送验证码
   ** **/
  C_USER_PIN_CHECK = 0x20a0, // 验证用户手机验证码

  C_CAPTAIN_SPEAK = 0x20a1, // 副本队长世界邀请

  C_CANCEL_HANGUP = 0x2064, // 取消挂机
  C_TAKE_OFFLINE_REWARD = 0x205f, // 领取离线奖励

  C_EFFECT_STOP = 0x205b, // 停止效果

  C_LOAD_BUILD_ORDER = 0x2057, // 加载建筑队列
  C_PLAYER_SIGN_CMD = 0x204a, // 每日签到

  C_STAR_MOVE = 0x204b, // 占星移动
  C_STAR_PICK = 0x204c, // 占星拾取
  C_STAR_RAND = 0x204d, // 占星随机
  C_STAR_BUY = 0x204e, // 占星格子购买
  C_STAR_DATA_RESET = 0x2085, //占星数据重置
  C_STAR_COMPOSE = 0x208b, //占星一键合成
  C_STAR_LOCK = 0x208a, //占星合成锁定
  C_STARSHOP_BUY = 0x2095, //占星积分商城兑换
  C_STAR_BATCH_OP = 0x225a, //批量星运操作

  C_QUICKCOOL_CHALLENGE_TIME = 0x2049, // 冷却挑战时间
  C_BAG_EQUIPLOOK = 0x2007, // 查看用户装备
  C_SIMPLEUSER_INFO = 0x2008, // 查看用户简要信息
  C_PLAYER_SEARCH = 0x2041, // 查询Player昵称

  C_PLAYER_AASCHANGE = 0x2044, // 防沉迷注册
  C_PLAYER_AASREFRESH = 0x2045, // 防沉迷刷新

  C_ARMYPOS_EDIT = 0x2054, //玩家部队站位编制
  C_CAMPIAGN_ARMYPOS_REQ = 0x2056, //多人副本部队站位请求
  C_CAMPIAGN_ARMYPOS_EDIT = 0x2055, //多人副本部队站位编制

  ARRIVE_ALTAR = 0x2165, //NPC到达
  C_NODE_LOCKSTATE = 0x2004, // 节点锁定状态

  U_CH_CHANNEL_CHA = 0x3a9d,
  /**
   * 更新同屏见部队列表
   */
  U_C_ARMY_UPDATE_GRID = 0x143d, // 更新同屏见部队列表
  /**
   * 撮合战房间状态
   */
  U_C_ROOM_STATE = 0x13ad, //
  /**
   *战役系统部队
   */
  U_C_CAMPAIGN_SYSTEM_ARMY = 0x13ae,
  U_CH_FRIENDADD_CONFIRM = 0x3aa4, // 添加好友验证

  U_CH_ADD_RELATIONSHIP = 0x3a9b, // 添加好友或黑名单
  U_CH_REMOVE_RELATIONSHIP = 0x3a9c, // 移除好友或黑名单
  U_CH_RECOMMENDLIST = 0x3aa5, // 推荐好友
  CH_BATCHADD_RELATIONSHIP = 0x3ab0, // 批量处理

  /**
   * 触发特殊BOSS战斗
   */
  C_FIGHT_SPECIAL_BOSS = 0x203b, // 触发特殊BOSS战斗
  /**
   *战役房间列表
   */
  U_C_CAMPAIGN_ROOM_EDIT = 0x13aa, // 房间编辑
  C_ROOM_PWDCHANGE = 0x2098, // 房间密码修改
  U_C_PLAYER_READY_STATE = 0x13ac, // 玩家准备状态

  //////////////////////////////////////////////////////////////
  /**
   * 請求登陸時進入的場景
   */
  U_C_PLAYER_LOGINSTATE = 0x139c,
  /**
   *增加攻击次数
   */
  U_C_PLAYER_ADD_ATTACKCOUNT = 0x139d, //
  /**
   * 新手进度
   */
  U_C_PLAYER_NOVICE = 0x1399,
  // 新手引导进入内城初始化建筑及队列
  C_BUILDING_INIT = 0x2059,
  /**
   *领取新手礼包
   */
  U_C_PLAYER_GRADE = 0x139a,

  /**
   *领取时间宝箱
   */
  U_C_PLAYER_TIME = 0x139b,
  U_C_PLAYER_INFO = 0x1398, //更新领主信息
  U_C_QUEST_ADD = 0x1394, //用户任务记录（用户任务列表）
  /**
   * 告诉服务器当前在哪个屏幕
   */
  U_C_USER_DISPLAY = 0x138c,

  U_C_CAMPAIGN_ARRIVE = 0x1405, // 直接攻击
  U_C_CAMPAIGN_SYNCPOS = 0x1404, // 直接移动
  /**
   * 邀请大厅玩家列表
   */
  U_C_CAMPAIGN_INVITE_PLAYER_LIST = 0x13a3,
  /**
   *创建战役房间
   */
  U_C_CAMPAIGN_ROOM_CREATE = 0x139f,
  /**
   * 战役房间列表
   */
  U_C_CAMPAIGN_ROOM_LIST = 0x13a2,
  /**
   * 进入战役房间
   */
  U_C_CAMPAIGN_ROOM_ENTER = 0x13a0,
  /**
   *房间查找
   */
  U_C_ROOM_FIND = 0x2111, //房间查找
  /**
   * 退出战役房间
   */
  U_C_CAMPAIGN_ROOM_EXIT = 0x13a1,
  U_C_CAMPAIGN_ROOM_INVITE = 0x13a4, // 邀请
  /**
   *  房间位置状态
   */
  U_C_CAMPAGIN_ROOM_PLACESTATE = 0x13a5,
  /**
   * 更新房间信息
   */
  U_C_CAMPAIGN_ROOM_MASTER_CHANGE = 0x13a6,
  /**
   *战役迷雾更新
   */
  U_C_CAMPAIGN_FOG_UPDATE = 0x1406, //
  /**
   *战役部队信息
   */
  U_C_CAMPAIGN_ENTER = 0x13af,
  /**
   *退出战役场景
   */
  U_C_CAMPAIGN_EXIT = 0x1400,
  /**
   *
   */
  U_CAMPAIGN_MOVE = 0x1403,
  /**
   * 战役中翻牌
   */
  U_C_CAMPAIGN_TAKE_CARD = 0x1402,
  /**
   * 查看部队
   */
  U_C_CAMPAIGN_ARMY = 0x1401,
  /**
   * 房主踢人
   */
  U_C_CAMPAIGN_ROOM_KILLPLAYER = 0x13a7,
  U_C_CAMPAIGN_CONFIRM = 0x13a9, // 战役确认框
  /**
   *会话结束后触发战斗
   */
  U_C_CAMPAIGN_CALLBACK = 0x13a8,
  /**
   * 领取附件
   */
  U_C_MAILITEM_MOVE = 0x139e,
  U_C_MAIL_LIST = 0x200c, // 获取收件箱邮件列表
  U_C_MAIL_DEL = 0x200e, // 删除邮件
  U_C_MAIL_SEND = 0x200d, // 发送普通邮件
  C_CONSORTIA_SPEAK = 0x208f, // 全服邀请消息
  //
  C_MAIL_LIST = 0x200c, // 获取收件箱邮件列表
  /**
   * 创建公会
   */
  U_C_CONSORTIA_CREATE = 0x140a,
  /**
   * 申请加入公会
   */
  U_C_CONSORTIA_USERINVITE = 0x140f,
  /**
   * 删除用户申请
   */
  U_C_CONSORTIA_INVITEDEL = 0x1415,
  /**
   * 操作公会邀请
   */
  U_C_CONSORTIA_USERPASS = 0x1417,
  /**
   * 修改公会公告
   */
  U_C_CONSORTIA_MODIFYBBS = 0x1413,
  /**
   * 修改公会群公告
   */
  U_C_CONSORTIA_GROUP_PLACARD = 0x2160,
  /**
   * 修改公会简介
   */
  U_C_CONSORTIA_MODIFYDESC = 0x1414,
  /**
   * 操作用户申请
   */
  U_C_CONSORTIA_PASS = 0x140e,
  /**
   * 公会邀请用户
   */
  U_C_CONSORTIA_INVITE = 0x1416,
  /**
   * 公会捐献
   */
  U_C_CONSORTIA_OFF = 0x1418,
  /**
   * 公会升级
   */
  U_C_CONSORTIA_LEVEL = 0x140d,
  /**
   * 公会祭坛祈福
   */
  U_C_CONSORTIA_FRESHALTAR = 0x1419,
  /**
   * 退出公会
   */
  U_C_CONSORTIA_QUIT = 0x141a,
  /**
   * 公会转让
   */
  U_C_CONSORTIA_CHANGE = 0x140b,
  /**
   * 公会技能学习
   */
  U_C_CONSORTIA_LEARN = 0x141b,
  /**
   * 公会改名
   */
  U_C_CONSORTIA_RENAME = 0x141c,
  /**
   * 公会职位调整
   */
  U_C_CONSORTIA_DUTYUPDATE = 0x1411,
  /**
   * 公会踢人
   */
  U_C_CONSORTIA_DELUSER = 0x140c,
  /**
   * 公会开放申请
   */
  U_C_CONSORTIA_OPENAPP = 0x141d,
  /**
   * 公会机器人邀请
   */
  U_C_CONSORTIA_ROBOTJOIN = 0x2005,
  /**
   * 公会成员列表
   */
  U_C_CONSORTIAUSER_LIST = 0x200f,
  /**
   * 完成任务
   */
  U_C_QUEST_FINISH = 0x1396,
  /**
   * 捐献列表
   */
  U_C_CONSORTIA_OFFER_LIST = 0x2010,
  /**
   * 公会邀请信息列表
   */
  U_C_INVITEINFO_LIST = 0x2011,
  /**
   * 公会事件信息列表
   */
  U_C_EVENT_LIST = 0x2012,
  /**
   * 公会权限列表
   */
  U_C_DUTY_LIST = 0x2013,
  /**
   * 公会信息
   */
  U_C_CONSORTIA_INFO = 0x2014,
  /**
   * 公会搜索
   */
  U_C_CONSORTIA_SEARCH = 0x2015,
  /**
   * 公会招收
   */
  U_C_CONSORTIA_INVITE_LIST = 0x2016,
  U_C_CONSORTIA_ALTERINFO = 0x2017, // 获取公会祈福信息
  U_C_CONSORTIA_SITE = 0x2019, // 公会祈福位置
  C_CONSORTIA_ADDFRESH = 0x2018, // 提取公会祈福物品到背包
  U_C_ARMY_ISSUPPORT = 0x1408, //自动加兵

  /**
   * 物品移动
   */
  U_C_BAG_MOVE = 0x138d, //--背包移动客户端发送协议
  /**
   *背包整理
   */
  C_BAG_ARRANGE = 0x201c, //背包整理
  /**
   * 使用道具
   */
  U_C_BAG_USEITEM = 0x138e, //用户使用道具
  /**
   * 出售物品
   */
  U_C_BAG_SELL = 0x138f, //出售物品协议
  /**
   *删除物品
   */
  C_BAG_REMOVE = 0x209a, //删除物品
  /**
   * 掉落物品拾取
   */
  U_C_DROPITEM_TAKE = 0x1409,
  /**
   * 购买物品  背包格子购买  符文背包格子购买的时候加个参数type==1
   */
  U_C_BAG_BUY = 0x1392,
  /**
   * 英雄装备改变
   */
  U_C_HERO_UPDATE_EQUIPMENT = 0x1390, // 装备更新(或者隐藏时装)
  /**
   * 洗点
   */
  C_HERO_SKILLPOINT_RESET = 0x1440,
  /**
   *  技能重置
   */
  C_HERO_SKILL_LIST = 0x1442,

  /**
   * 保存技能
   */
  C_HERO_SKILL_UPGRADE = 0x1441, //
  /**
   * 设置快捷键
   */
  U_C_HERO_SETFASTKEY = 0x142f, //设置快捷键
  /**
   * 符文操作(学习、升级、携带)
   */
  U_C_HERO_RUNE_OP = 0x219d,

  /**

     /**
     * 属性点洗点
     */
  U_C_HERO_RESETPOINT = 0x1432, // 洗点
  /**
   * 属性点分配
   */
  U_C_HERO_ADDPOINT = 0x1433, // 分配点
  /**
   * 进入新手训练战役
   */
  U_C_CAMPAIGN_TRAINING = 0x1407,

  /**
   * 洗练请求
   */
  C_ITEM_REFRESHPROPERTY = 0x2110 /**
   * 铁匠铺转换
   */,
  C_ITEM_TRANSFORM = 0x215a,
  /**
   * 铁匠铺强化
   */
  U_C_ITEM_STRENGTHEN = 0x141e,
  /**
   * 镶嵌
   */
  U_C_ITEM_INLAY = 0x141f,
  /**
   * 镶嵌孔操作
   */
  U_C_ITEM_INLAYJOIN = 0x1420,
  /**
   *  铁匠铺合成
   */
  U_C_ITEM_COMPOSE = 0x1421,

  U_C_SHOP_BUY = 0x1422, // 购物
  U_C_SHOP_HASBUY = 0x201a, // 用户限购商品
  U_C_CHECK_NICK = 0x201f, //通过玩家昵称获得玩家ID

  /**
   * 新手引导添加物品强化
   */
  U_C_GUID_STRENGY_ADDITEM = 0x1391,
  /**
   * 招募兵种
   */
  U_C_ARMY_RECRUITED = 0x1423,
  /**
   * 配兵
   */
  U_C_ARMY_EDIT = 0x1424, // 配兵
  /**
   *遣散兵种
   */
  U_C_ARMY_DEMOBPAWN = 0x1425, // 遣散兵种
  /**
   *  升级兵种
   */
  U_C_ARMY_UPGRADEPAWN = 0x1426, // 升级兵种
  /**
   * 攻打城堡与野地
   */
  U_C_ARMY_ATTACK = 0x1428, //
  /**
   * 攻打城堡
   */
  U_C_ARMY_ATTACK_CASTLE = 0x1427,
  /**
   *召回
   */
  U_C_ARMY_RETURNHOME = 0x1429, // 召回
  /**
   * 移动中的部队召回
   */
  U_C_ARMY_RECALL = 0x142a, // 中途召回
  /**
   * 生产士兵
   */
  U_C_ARMY_UPDATE_ARMYPAWN = 0x142b,
  /**
   * 传送阵冷却
   */
  U_C_BUIDLING_TRANS_COOL = 0x1435, // 传送阵冷却

  //
  C_BUILDING_CREATE = 0x200a, // 建筑建造
  C_BUILDING_UPGRADE = 0x200b, // 建筑升级
  /**
   *  加速建筑队列
   */
  U_C_BUILDING_ORDER_QUICK = 0x1434, // 加速建筑队列
  /**
   *传送阵充能
   */
  U_C_BUILDING_UPENERGY = 0x1436, // 传送阵充能
  /**
   * 扩展队列
   */
  U_C_BUILDING_ORDERADD = 0x1437, // 扩展队列
  /**
   *传送城堡
   */
  U_C_BUILDING_TRANSCASTLE = 0x1438, // 传送城堡
  /**
   * 摘果实
   */
  U_C_TREE_PICK = 0x143a, // 摘果实

  C_TREE_FRIEND = 0x201b, // 自己树信息

  CH_TREE_WATER = 0x3aa9, // 浇水
  /**
   *放弃野地
   */
  U_C_UNOCCPWILDLAND = 0x143b, // 放弃野地
  U_C_CASTLE_UPDATE = 0x1397, //内城更新

  /**
   * 战役完成
   */
  U_C_CAMPAIGN_FINISH = 0x143c,

  C_BAG_USEBIGBUGLE = 0x1393, //使用大喇叭
  C_BAG_USESMALLBUGLE = 0x2006, //使用小喇叭
  U_G_LOGIN_GATEWAY = 0x4e21, //socket登錄命令
  U_PLAYER_CLIENT_STATE = 0x13ab, // 玩家客户端状态

  C_ARMY_POS_UPDATE = 0x2002, // 客户端发送至服务器端
  C_FAST_USE_BLOOD = 0x1601, // 快速购买血量
  C_PHYSICLIST_BYGRID = 0x2009, // 请求相关屏所在的地图对象列表

  C_LONIG_LOAD_REQ = 0x2020, // 加载请求

  C_LEED_CLIENT = 0x2082, //每日引导客户端更新
  C_LEED_FINISH = 0x202b, // 每日引导完成
  C_LEED_ADD = 0x202a, // 每日引导添加
  C_CLICKDATALIST = 0x2146, //日常活动次数

  C_CHALLENGE = 0x203d, // 挑战

  C_MOVE_POS = 0x203e, // 移动

  C_CHALLENGEINFO_REQUEST = 0x2040, // 挑战赛信息

  C_PLAYER_REINFORCE = 0x203f, // 玩家发起增援

  C_WORLD_BOSS_CMD = 0x2042, // 世界BOSS
  C_WORLD_BOSS_REQ = 0x2043, // 世界信息请求（客户端上发）

  C_WORLDBOSS_PLAYER_LIVE = 0x2048, // 立即复活

  C_WORLDBOSS_BUFFER = 0x2116, //世界boss购买buff请求协议

  C_WORLDBOSS_STATE = 0x204f, // 世界BOSS状态(客户端请求服务器协议号)

  C_BATTER_COUNT = 0x205a, // 更新玩家连击数

  C_PLAYER_SETTING = 0x2259, //请求玩家功能设置
  C_FRIEND_REFUSE = 0x205d, // 拒绝添加好友
  C_ROOM_REFUSE = 0x205e, // 拒绝房间邀请
  C_MATCH_REQUEST = 0x2066, // 竞技场状态请求

  C_LUCKY_FRFRESH = 0x2080, // 招财刷新
  C_LUCKY_SWAP = 0x2081, // 兑换
  C_REFININGSOUL_FRFRESH = 0x2112, // 炼魂刷新
  C_REFININGSOUL_SWAP = 0x2113, // 炼魂兑换
  C_TAKE_CHALLENGEREWARD = 0x2089, // 领取挑战赛奖励

  C_TOWER_INFO = 0x2069, // 无限塔信息请求
  C_ENTER_TOWER = 0x2068, // 进入无限塔
  C_TOWER_RESET = 0x206b, // 无限塔重置
  C_TOWER_LIVE = 0x206c, // 玩家复活
  C_PLAYER_NODE_STATE = 0x206d, // 玩家节点站立状态(客户端发上)
  C_ARMYPOS_REQUEST = 0x2088, // 请求部队位置
  C_ARMY_POSATION = 0x2086, // 英雄定点传送
  C_ENTER_WARFIELD = 0x208c, // 进入战场
  C_LEAVE_WARFIELD = 0x208d, // 离开战场
  C_WARFIELD_ATTACK = 0x208e, // 战场发起攻击
  C_GUIDE_FINISHED = 0x206e, // 引导QTE完成
  C_WARORDER_REQUEST = 0x2091, // 战场排名请求
  C_WAR_MAXHP = 0x2092, // 恢复血量

  C_VIP_OPEN = 0x2141, // 开通VIP
  C_VIP_OPEN_GIFT = 0x2138, // VIP获取礼包/Buff
  C_VIP_BOX_DROP = 0x2139, // VIP宝箱掉落
  C_VIPROULETTE = 0x2147, // 轮盘开始转动

  C_ITEM_REFRESHFORREPLACE = 0x2093, // 物品洗练替换
  C_ITEM_REFRESHFORRANDOM = 0x2090, // 物品洗练随机
  C_ITEM_RESOLVE = 0x2094, // 物品分解
  C_CONSORTIA_LINK = 0x2097, // 公会招收链接
  C_PLAYER_RENAME_REQ = 0x2099, // 修改昵称
  C_MALL_SELL_ITEM = 0x2100, // 出售物品
  C_MALL_LIST_SELL = 0x2101, // 列出玩家出售列表
  C_MALL_PLAYER_ITEMS = 0x2102, // 玩家出售的所有物品
  C_MALL_AUCTION = 0x2103, // 竞拍物品
  C_MALL_LIST_AUCTION = 0x2104, // 查看自己竞拍记录
  C_MALL_FIX_AUCTION = 0x2105, // 一口价
  C_MALL_CANCEL_SELL = 0x2106, // 取消出售
  C_MALL_SEARCH = 0x2109, // 搜索物品

  C_BAG_USESTORE = 0x2124, // 使用灵魂宝石

  C_CHANGE_SKILL = 0x2120, // 两套技能切换
  C_ACTIVE_SECONDSKILL = 0x211f, // 激活第二套技能
  C_WORLDMAP_PVPFIGHT = 0x2128, // 大地图挑战

  C_CONSORTIA_VOTING_LIST = 0x2031, // 公会投票信息
  C_CONSORTIA_VOTING = 0x2121, // 公会投票

  /**
   * 神秘商店
   */
  C_SHOPITEM_BUY = 0x2122, // 购买
  C_SHOPITEM_FRESH = 0x2123, // 刷新

  C_BLESSING_ALTER = 0x2129, // 祝福轮盘启动
  C_BLESSING_WATCH = 0x2125, // 祝福轮盘查看
  C_PLAYER_RELOGIN_CMD = 0x2130, // 累计登录领取奖励
  C_CHECK_CODE = 0x2142, //请求验证验证码
  C_CHECK_SHOW_CODE = 0x2144, //初次登陆请求是否需要显示验证码
  C_VIP_COIN_OPEN = 0x2149, //使用VIP币
  /**
   *扫荡
   */
  C_CAMPAIGN_SWEEP = 0x2150, // 扫荡请求
  /**
   * 是否发送过手机号码
   */
  C_CHECK_SEND = 0x214c,

  C_ATTACK_CONSTIA = 0x2114, // 挑战公会

  C_REQUEST_GUILDLIST = 0x211d, // 请求公会列表(客户端请求的协议号)

  /** 修行神殿PK j拒绝切磋邀请 */
  C_HANGUP_PVP = 0x214d,
  /** 购买替身 */
  C_OPRATE_REPLACEMENTS = 0x214e,

  /**
   *天赋等级升级
   */
  C_TALENT_GRADE_UP = 0x1443,
  /** 驯养 */
  C_MOUNT_EDIT = 0x2151,
  /** 请求坐骑avatar */
  C_MOUNT_AVATARLIST = 0x2152,
  /** 坐骑变更 */
  C_MOUNT_CHANGE = 0x2154,
  /** 上马/下马 */
  C_ARMYMOUNT_AVATARCHANGE = 0x2155,
  C_REQUEST_CHALLENGE_NEEDOFFER = 0x211e, // 请求挑战所需财富
  C_REQUEST_GUILDCHALLENGE = 0x2118, // 工会战排名列表
  C_GUILDTEAM_PLAYER_EDIT = 0x2119, // 加入公会战参与人员

  /** 坐骑avatar激活 */
  C_MOUNTAVATAR_ACTIVE = 0x2158,
  /** 兑换礼包 */
  C_ACTIVE_EXCHANGE = 0x215b,
  /** 精灵盟约 */
  C_KING_CONTRACT = 0x215c, //精灵盟约
  /** 问卷调查 */
  C_QUESTIONNARIE_ANSWER = 0x2156,
  /** 取消拉矿 */
  C_CANCEL_TRANS = 0x2157, // 取消拉矿
  C_PLAYER_REFAIRE = 0x2164, // 公会战玩家增援
  C_GUILD_GROUP = 0x2162, // 公会战分组
  C_GUILD_BUYBUFFER = 0x2163, // 公会战BUFFER购买
  C_ENTER_GUILDCAMPAIGN = 0x2117, // 进入工会战

  C_CONSORTIA_FAM_BATTLE = 0x2167, //  公会秘境切磋
  C_MOUNT_INFO_SEND = 0x2177, //查看玩家坐骑信息

  /**********************************战斗*************************************/
  DEBUG_BATTLE = 0x2713, //战斗调试器
  /**
   * 战斗加载完成
   */
  U_B_USER_LOADOVER = 0x2717,
  /**
   *玩家输入英雄指令
   */
  U_B_HERO_ORDER = 0x2718,
  /**
   * 进入战斗(判断战斗类型)
   */
  U_B_JOIN = 0x2714,
  /**
   * 暂停指令
   */
  U_B_USR_STOP_CMD = 0x271a,
  /**
   * 新手进入战斗
   */
  U_B_USR_GUIDE = 0x2719,
  /**
   *多人战斗QTE
   */
  U_B_QTE = 0x271f, //
  /**
   *战斗中模式选择(攻击防御)
   */
  U_B_FIGHT_MODE = 0x2720, // 战斗中模式选择
  /**
   *客户端增援加载完成
   */
  B_REINFORCE_LOADOVER = 0x2722, // 客户端增援加载完成
  /**
   *设置自动攻击模式 战斗服
   */
  B_SET_ATUO_ATTACK = 0x2724,
  /**
   *设置自动攻击模式 逻辑服
   */
  C_SET_ATUO_ATTACK = 0x2028,
  /**
   *物品使用
   */
  B_USE_ITEM = 0x2903, // 物品使用
  B_USE_TRIAL = 0x290b, // 使用试炼技能

  /**
   *暂停完成继续战斗
   */
  B_PAUSE_FINISHED = 0x2726, // 暂停完成继续战斗
  /**
   * 退出战斗
   */
  B_REMOVE_BATTLE = 0x2901,
  /**
   * 战斗撤退
   */
  B_WITHDRAW_BATTLE = 0x2916,
  C_REBATE_DATA = 0x217e, //领取充值回馈礼包、请求用户充值回馈信息

  C_BUY_TRIAL = 0x2186, // 购买试炼BUFF

  CR_WARFIELD_CHAT = 0x6208, //跨服战场聊天
  CR_WARFIELD_USER_INFO = 0x6209, //跨服查询人物信息
  /**
   * 兵种特性等级转换
   * */
  C_PAWN_CHANGE = 0x2184, //兵种特性等级转换
  /**
   * 领取精彩活动礼包
   * */
  C_SUMACTIVE_GATE = 0x218a, //领取精彩活动礼包

  /**
   * // 载具副本开始
   */
  C_CAR_CAMPAIGN_START = 0x2187,
  C_VEHICLE_SYNC_POSITION = 0x218b, // 载具同步怪物位置
  C_VEHICLE_SWITCH_MONITOR = 0x218c, // 载具却换怪物监控者

  C_TAKE_CROSS_SCORE_REWARD = 0x218e,

  C_APPELL_EXCHANGE = 0x2195, //称号装备
  C_CC = 0x2196,
  C_FASHION_COMPOSE = 0x2192, // 时装合成
  C_FASHION_SWITCH = 0x2193, // 时装 图鉴
  C_FASHION_SHOP_BUY = 0x2190, // 时装购物车购买
  C_CHECK_WARFIELD_COUNT = 0x2197, // 检查战场进入次数

  C_VEHICLE_LIST_REQ = 0x21aa, //查询玩家载具列表
  C_VEHICLE_CHOOSE_VEHICLE = 0x21a3, //更换载具
  C_VEHICLE_QUICK_PLAY = 0x21a0, //快速游戏
  C_VEHICLE_QUICK_PLAY_CANCEL = 0x21a1, //取消快速游戏
  C_VEHICLE_MOVE = 0x21a7, // 载具移动
  C_VEHICLE_ATTACK = 0x21a8, // 载具攻击
  C_VEHICLE_PICK_PROP = 0x21a9, //拾取道具箱
  C_VEHICLE_LEAVE_CAMPAIGN = 0x21a2, //	 * 离开副本
  C_ACTIVE_VEHICLE = 0x21ab, //	 激活载具
  /**
   * 请求小喇叭免费次数
   */
  C_SMALL_BUGLE_FREE_COUNT = 0x2201,
  /***开心网防沉迷信息**/
  C_PLAYER_AAS_SWITCH_CHANGE = 0x21ac,
  C_BOTTLE_OP = 0x219c, // 开启魔罐
  C_BAG_BATCH_SELL = 0x21b0, // 批量出售物品
  C_FASHION_INFO = 0x21b1, // 打开时装图鉴请求
  C_PLAYER_PET_OP = 0x21ad, //宠物相关操作
  C_TAKE_360_REWARD = 0x2212, //领取360特权礼包
  C_REQUEST_360_REWARD = 0x2213, //请求360特权礼包领取状态
  C_GAME_STORY_REQUEST = 0x21b5, // 欢乐时报随机刷彩蛋
  C_GAME_STORY_REWARD = 0x21b6, // 领取彩蛋
  C_SEND_CROSS_BIGBUGLE = 0x21af, // 跨区喇叭
  C_FASHION_SPECIAL = 0x21b7, // 移除时装图鉴特殊标志
  /**
   * 天空之城
   * 玩家请求进入天空之城
   */
  C_PLAYER_SPACE_ENTER = 0x21f0,
  /**
   * 天空之城
   * 玩家通知服务器离开天空之城
   */
  C_PLAYER_SPACE_LEAVE = 0x21f1,
  /**
   * 天空之城
   * 玩家移动
   */
  C_PLAYER_SPACE_MOVE = 0x21f2,
  /**
   * 天空之城
   * 玩家触发节点
   */
  C_PLAYER_SPACE_NODE_TRIGGER = 0x21f4,
  /**
   * 天空之城
   * 请求玩家信息列表（暂时废弃）
   */
  C_GET_SPACE_PLAYER_ARMY_INFO = 0x21fd,
  C_FATE_REQUEST = 0x21b4, // 命运守护信息请求
  U_C_FATE_REQUEST = 0x11c0, // 命运守护信息返回
  U_C_FATE_TRAIN = 0x21b2, //培养命运守护技能
  C_FATE_TURN = 0x21b3, //运行命运轮盘
  /**
   * 玩家点击活动图标进入紫晶矿场
   */
  C_ENTER_MINE_FIELD = 0x21b9,
  /**
   * 购买限时热卖商品
   */
  C_BUY_DISCOUNT = 0x21f5,

  /**
   * 限时抢购物品刷新
   * */
  C_FLASH_SALE_FRESH = 0x21b8,
  /** 进入宠物岛 */
  C_ENTER_PETISLAND = 0x21f6,
  /**
   * 进入副本后, 当玩家在天空之城使用飞行坐骑, 停留在障碍点时, 需要通知服务器端重置玩家在天空之城坐标（返回出生点）
   */
  C_CHECK_MOVEABLE = 0x21fc,
  /** 查询单个英灵信息 */
  C_GET_PLAYER_PET_INFO = 0x21fe,
  /** 发起英灵挑战 ChallengeMsg */
  C_CHALLENGE_PET = 0x2214,
  /** 英灵挑战阵型 */
  C_PET_CHALLENGE_FORMATION = 0x2215,
  /** 英灵挑战技能 */
  C_PET_CHALLENGE_SKILL = 0x2216,
  /** 英灵挑战立即结束 */
  C_PET_CHALLENGE_END_BATTLE = 0x2217,

  /** 基金活动 */
  C_U_ACTIVE_DEPOSIT = 0x21ff,
  /**
   * 英灵竞技奖励领取
   */
  C_PET_RANK_REWARD = 0x2218,
  /** 环任务完成 */
  C_REPEAT_REWARD_FINISH = 0x2219,
  /** 环任务立即完成 */
  C_REPEAT_REWARD_FINISH_IMMEDIATELY = 0x221a,
  /** 上行当前环任务(打地鼠,  对话 ,  qte) 已经完成 */
  C_REPEAT_REWARD_UPDATE_FINISH = 0x221b,
  /** 领取环任务 */
  C_TAKE_REPEAT_REWARD = 0x221c,

  C_SPACE_COLLECTION_FINISHED = 0x221d,

  /**
   * 龙魂培养
   */
  C_DRAGON_FEED = 0x21c1,
  /**
   * 龙魂信息查看
   */
  C_DRAGON_REQUEST = 0x21c2,

  /**
   * 战斗守护操作
   */
  C_BATTLEGUARD_OP = 0x2226,

  /** 答复组队邀请 */
  C_APPLY_INVITE_TEAM = 0x221e,
  /** 转移队长 */
  C_CHANGE_CAPTAIN = 0x2220,
  /** 修改战斗阵型 */
  C_EDIT_TEAM_FIGHT_POS = 0x2221,
  /** 邀请组队 */
  C_INVITE_TEAM = 0x2222,
  /** 踢出队友 */
  C_KICK_TEAM_MEMBER = 0x2223,
  /** 暂时离开, 进入单人场景 */
  C_LEAVE_TEAM_FOR_NOW = 0x2224,
  /** 离开队伍 */
  C_QUIT_TEAM = 0x2225,

  /**
   * 藏宝图操作
   */
  C_TREASUREMAP_OP = 0x2228,
  /**
   * 藏宝图增援
   */
  C_TREASUREMAP_BATTLE_REINFORCE = 0x2229,
  /**
   * 请求藏宝图信息
   */
  C_TREASUREMAP_REQUEST = 0x222a,

  /**
   * 勇士回归领取礼包
   */
  C_BACK_PLAYER_REWARD = 0x21ba,
  /*挑战镜像*/
  C_CHALLENGE_SELF = 0x21bb,
  /**
   * 拒绝玩家组队邀请
   */
  C_TEAM_REFUSE = 0x222a,
  /**
   * 进入内城/退出内城
   */
  C_ENTER_CASTLE = 0x222b,
  /** 七日目标引导 */
  C_SERVEN_LEAD = 0x222d,
  /**
   * 内部抽奖 抽奖
   */
  C_LOTTERY_REWARD = 0x222c,
  /**
   * 内部抽奖 客户端请求抽奖信息
   */
  C_LOTTERY_REQUEST = 0x222e,
  /**
   * 新手矿脉
   */
  C_FRESHMAN_DEPOSIT = 0x222f,

  C_CHECK_ACCELERATOR = 0x4e2a,

  /** 诸神降临活动领取奖励 */
  C_TOLLGATE_GET_REWARD = 0x2230,
  /** 诸神降临活动请求信息 */
  C_TOLLGATE_REQUEST = 0x2231,
  /** 诸神降临活动请求积分排行榜 */
  C_TOLLGATE_SCORE = 0x2232,
  /** 诸神降临活动请求挑战*/
  C_TOLLGATE_REQUEST_ATTACK = 0x2233,
  /**
   * 天穹之径升级区域
   */
  C_UPDATE_AREA = 0x21bc,
  /**
   * 天穹之径手动领取区域奖励
   */
  C_GET_AREA_REWARD = 0x21bd,
  /**
   * 天穹之径手动领取天国号角道具
   */
  C_GET_BUGLE = 0x21be,
  /**
   * 天穹之径许愿墙转盘
   */
  C_BUGLE_ROULETTE = 0x21bf,
  /**
   * 天穹之径许愿墙洗牌
   */
  C_BUGLE_OPEN = 0x21c0,
  /**
   * VIP客服QQ面板添加状态
   */
  C_VIPCUSTOM_ADD = 0x2234,
  /**
   * 转职
   */
  C_DRAGON_TRANSFER = 0x21c3,
  /**
   * 铁匠铺神铸
   */
  C_MOULD_ITEM = 0x21c4,
  /**
   * 鉴定时装
   */
  C_FASHION_APPLRAISAL = 0x224d,
  /**
   * 月卡
   */
  C_MONTH_CARD = 0x224f,
  // -----------------------------0x251C之后的协议留给海外服务器使用----------------------------------//
  C_SLOT_ACTIVE_REQ = 0x251c, // 拉霸活动请求
  //==============================   答题系统 start    ======================================
  /** 向服务器请求信息*/
  C_ANSWER_REQUEST_OPTION = 0x251d,
  //------------------------------  答题系统 end
  /**
   * 增加城堡掠夺次数
   */
  C_CASTLE_ATTACK = 0x2522,
  /** 寻宝系统请求*/
  C_SEEK_REQ = 0x251e, //寻宝系统请求
  /** 找回系统相关请求*/
  C_RECOVER = 0x251f, // 找回系统相关请求
  /**
   * 请求房间状态（房间 or 副本）
   */
  C_MULITY_CAMPAIGN_REQUEST = 0x2520,
  /**
   * 卡牌协议
   */
  // C_POWCARD_REQ = 0x2521,

  C_FISH_POOL = 0x2523, //鱼池相关信息

  /**
   * 请求夺宝奇兵初始信息
   */
  C_GET_GEMMAZE_INFO = 0x2524,
  /**
   * 夺宝奇兵移动宝石
   */
  C_GEMMAZE_GEMMOVE = 0x2525,
  /**
   *邀请夺宝奇兵协助
   */
  C_GEMMAZE_INVITE = 0x2526,
  /**
   *同意夺宝奇兵协助
   */
  C_GEMMAZE_INVITE_OP = 0x252b, //协助操作
  /**
   *夺宝奇兵购买次数
   */
  C_GEMMAZE_BUYTIMES = 0x252c, //次数购买
  /**
   * 领取积分宝箱奖励
   */
  C_GEMMAZE_GETREWARDBOX = 0x2529,
  /**
   *藏宝箱全部拾取
   */
  C_GEMMAZE_GETALL = 0x252d, //全部拾取
  /**
   *  外城请求BOSS信息
   */
  C_MAPBOSS_DATAS = 0x2535,
  /**
   *外城拾取宝箱
   */
  C_MAPBOX_PICK = 0x2536,
  /**
   * 邮箱验证 op=1 发送验证码  op=2 验证邮箱
   */
  C_MAIL_CHECK = 0x2577,
  /**
   * 手机邮箱,状态, 奖励领取  VertifyReqMsg
   */
  C_CHECK_PHONE_MAIN_INFO = 0x2573,
  /**
   *二级密码操作 （1 验证密码  2 设置密码  3 修改密码   4 重置密码）
   */
  C_VICEPASSWORD = 0x2266,
  /**
   *加锁解锁操作
   */
  C_LOCK_OR_UNLOCK = 0x2269,
  /**
   * 微端信息
   */
  C_MICRO_CLIENT_INFO = 0x13b1,

  CH_FRIEND_SEARCH_NICKNAME = 0x3ac9, // 用昵称搜索玩家

  C_TAKE_FIRST_CHARGE_REWARD = 0x2200, // 领取首充奖励

  C_ONLINE_REWARD = 0x224e, //在线时长奖励
  C_ONLINE_REWARD_ENSURE = 0x2254, //确认收到的物品

  C_GRADE_PACKET = 0x2250, //等级礼包

  C_ALL_CHANGE_OP = 0x2260, // 全民兑换操作

  C_SEVEN_TARGET_INFO = 0x2251, //七日目标信息

  C_SEVEN_TARGET_TASK_RECEIVE = 0x2252, //七日目标任务奖励领取

  C_SEVEN_TARGET_GIFT_RECEIVE = 0x2253, //七日目标积分或特惠礼包领取

  C_SEVEN_SIGN_RECEIVE = 0x2255, //七日登录领取奖励

  C_DEGREE_ACTIVITY_DATA_REFRESH = 0x202c, //主动请求刷新活跃度数据

  C_SEVEN_SIGN_INFO = 0x2256, //七日登录信息

  C_GROWTH_FUND_INFO = 0x2257, //请求成长基金信息(备用)

  C_GROWTH_FUND_RECEIVE = 0x2258, //成长基金领取

  C_TEMPLE_INFO = 0x225b, //修行神殿
  C_TEMPLE_RECEIVE = 0x225c, //玩家收取体力

  C_CHARGE_ORDER = 0x225d, //玩家请求订单号
  C_CHARGE_ORDER_STATUS = 0x225e, //客户端上报订单状态, 只上报不返回
  C_FETCH_TOKEN = 0x2261, //web 获取游密token

  C_MAPSHOPINFO = 0x2538, //外城商店请求操作

  C_BAG_BATCH_MOVE = 0x21c3, //批量移动到公会宝箱

  C_MOUNT_UPSTAR = 0x2262, // 坐骑炼化升星

  C_SPACEMAP_ATTACK = 0x254b, //天空之城切磋

  C_CAMPAIGN_START = 0x13af, // 跨服多人本进入战役

  CR_MULTI_MATCH_CHOOSE = 0x6245, // 被撮合到的人同意或拒绝加入到现有副本

  C_CROSSMULTI_ROOMSTATE = 0x2554, // 请求跨服多人本房间状态

  B_ROOM_UPDATE_STATE = 0x6201, // 跨服房间取消撮合

  CR_FIGHTPOS_EDIT = 0x6248, // 跨服房间站位编辑

  CR_MULTICAMPAIGN_MATCH = 0x6244, // 房主选择本副本需要加人其他人

  C_CROSS_INVITE_CHOOSE = 0x2555, // 是否接受跨服多人本的邀请

  CR_VOTEKILL_CHOOSE = 0x6240, // 跨服多人本投票踢人选择

  C_CAMPAIGN_ROOM_KILLPLAYER = 0x13a7, // 跨服多人本房主踢人

  CR_FIGHTPOS_REQ = 0x6247, // 跨服房间站位请求

  C_NEW_MEMORY_CARD_OP = 0x21ea, // 记忆翻牌活动客户端操作

  C_PASS_REWARD_INFO = 0x2263, // 获取通行证奖励页面信息
  C_PASS_BUY = 0x2267, //通行证相关购买
  C_PASS_TASK_FRESH = 0x2265, //通行证任务奖励领取或刷新
  C_PASS_Task_INFO = 0x2264, //通行证任务信息
  C_LUCK_EXCHANGE = 0x258a, //幸运兑换

  C_BUBBLE_CHANGE = 0x2268, // 气泡切换或购买

  C_CONSORTIA_BOSS_CALL = 0x228f, //召唤（进入）公会BOSS
  C_CONSORTIA_BOSS_UPGRADE = 0x228e, //公会BOSS升级
  C_SKILL_EDIT = 0x2293, //技能编辑
  C_TREASURE_MINE_LIVE = 0x2294, //宝矿争夺重置cd请求参数结构 PayTypeMsg
  C_NEW_YEAR_BOX_ACTIVE = 0x2322, //新年宝箱操作
  C_CCCACTIVE_CLIENTOP = 0x25ad, //关于使用活动的客户端操作
  C_TREASURE_MINE_UNOCCP = 0x229b, ///放弃宝矿

  C_EQUIP_RUNE_STOME = 0x2295, //符文石装备或替换 镶嵌符文石
  C_RUNE_RESOLVE = 0x2296, //符文石分解
  C_RUNE_UP = 0x2297, //符文石升级
  C_RUNE_UNLOAD = 0x2298, //符文石卸载
  C_LOTTERY_RUNE = 0x2299, //符石抽奖

  C_TELENT_SORT = 0x1444, //调整圣印顺序
  C_TELENT_TREE = 0x1445, //选择天赋技能树

  C_UIPLAY_CHALLENGE = 0x2235, //挑战UI副本关卡
  C_STAR_ARRANGE = 0x229a, //星运整理
  C_TRANSLATE_TEXT = 0x229d, //聊天翻译
  C_PET_EQUIP_STRENTH = 0x229c, //英灵强化
  C_PET_EQUIP_SUCCINCT = 0x22a2, //英灵洗炼
  C_PET_EQUIP_RESOLVE = 0x229e, // 英灵装备分解
  C_SHARE_REWARD = 0x229f, // 分享奖励请求, 无参数

  C_STORE_RATINGS_REPORT = 0x22a0, // 商店评级上报

  C_MICRO_TERMINAL_REWARD = 0x22a1, // 领取微端奖励请求, 无参数, 领取成功后推送0x12F3消息
  C_TATTOO_REQ = 0x2560, //纹身客户端请求

  C_DISCOUNT_MALL_OP = 0x259c, // 新打折商城 操作

  C_MONOPOLY_CAMPAIGN_ENTER = 0x226b, // 云端历险副本进入
  C_MONOPOLY_CAMPAIGN_ROLL_DICE = 0x226c, // 云端历险摇色子
  C_MONOPOLY_CAMPAIGN_TRIGGER_EVENT = 0x226d, // 云端历险触发事件
  C_MONOPOLY_CAMPAIGN_BUY_EVENT = 0x226e, // 云端历险购买色子和战争旗帜
  C_MONOPOLY_CAMPAIGN_LEAVE = 0x226f, // 云端历险结束副本
  C_MONOPOLY_SLOT_MACHINE = 0x2270, // 云端历险老虎机请求协议
  C_MONOPOLY_CAMPAIGN_BUY_MAGIC_DICE = 0x2271, // 云端历险购买魔力色子
  C_TURNTABLE_REQ = 0x21c9, // 转盘活动请求

  U_C_PLAYER_TOKENINFO = 0x126a, // 玩家代币信息

  /**泰坦之战 */
  C_MULTILORDS_MAININFO = 0x21c6, // 多人众神之战主面板信息
  U_C_MULTILORDS_MAININFO = 0x12f9, // 多人众神之战主面板信息

  C_MUTIL_LORDS_SIGNUP = 0x2286, // 多人众神之战报名
  U_C_MULTILORDS_SIGN_NOTIC = 0x12f8, // 报名通知
  C_MULTILORDS_SIGN_RECIVE = 0x2280, // 客户端接受或取消报名

  C_MUTIL_LORDS_ROOMCREATE = 0x2291, // 多人众神之战进入比赛房间

  C_MULTILORDS_INSPIRE = 0x21c5, // 多人众神之战鼓舞操作

  C_MULTILORDS_LOCAL_FINAL = 0x21c7, // 多人众神之战本服决赛玩家列表
  U_C_MULTILORDS_LOCAL_FINAL = 0x12fa, // 本服多人众神决赛请求

  C_MULTILORDS_BETWIN_REQ = 0x21c8, // 多人众神之战押注赢家列表请求
  U_C_REQUEST_MULTIBET_LIST = 0x12fb, // 多人众神押注获得列表

  C_MULTILORDS_WORSHIP = 0x2281, // 膜拜

  C_MUTIL_LORDS_FINALORDER_REQUEST = 0x2284, // 多人众神之战决赛名单请求
  U_C_MULTILORDS_FINALORDER = 0x12f7, // 多人众神决赛列表

  C_MUTIL_LORDS_BET = 0x2285, // 多人众神之战押注

  C_REMOTE_PET_OP = 0x2548, // 远征英灵操作
  CH_REMOTE_FRIEND_PET = 0x3ad1, // 查询好友远征英灵列表
  B_REMOTE_PET_ORDER = 0x36b1, // 使用英灵远征或者守卫通缉技能
  C_FASHION_EXCHANGE = 0x256e, //时装形象修改
  C_HONOR_EQUIP_LEVELUP = 0x22ad, //升级/升阶荣誉装备

  C_STAR_SPECIAL = 0x22ac, //VIP一键特权占星

  U_C_QQ_DAWANKA_INFO = 0x1369, //QQ大厅大玩咖相关信息
  C_QQ_DAWANKA_REQ = 0x22ae, // 大玩咖请求
  C_STACK_HEAD_REQUEST = 0x257f, //外域操作请求

  C_CHALLENGE_REQUEST = 0x22af, // 领取单人竞技奖励

  C_RUNE_HOLE_INFO = 0x2570, //获取符孔信息
  C_RUNE_HOLE_OP = 0x2571, //符孔操作

  C_CASERN_AUTO_SETTING = 0x2572, //自动招募

  C_CARNIVAL_OP = 0x233b, // 嘉年华客户端操作
  C_LINKGAME_OP = 0x1542, // 连连看操作
  C_FIVE_CARD_POKER_OP = 0x1543, // 梭哈扑克操作
  C_MEMORY_CARD_OP = 0x1544, // 记忆翻牌操作
  C_ACTIVE_SECONDTALENT = 0x1446, // 激活第二套技能
  C_HERO_TALENT_CHANGE = 0x1447, // 两套天赋切换
  C_WISH_POOL_OP = 0x233c, // 许愿池客户端操作
  C_OUT_CITY_GOLDN_LIST = 0x2574, //外城某节点金矿列表 op==1 全部节点
  C_OUT_CITY_FIGHT = 0x2575, //外城攻击某玩家
  C_SUDOKU_OP = 0x1545, //数独操作

  C_MARKET_ORDER_ACTION = 0x2100, // 市场订单操作请求
  C_MARKET_INFO_REQ = 0x2102, // 市场数据请求

  C_OUT_CITY_DECLEAR_WAR = 0x2576, //外城对某城堡节点宣战
  C_OUT_CITY_WAR_GIVE_UP_CASTLE = 0x2583, //外城放弃城堡
  C_OUT_CITY_WAR_All_NODE = 0x2578, //外城所有城堡节点状态
  C_OUT_CITY_WAR_All_PLARER = 0x2579, //外城某城堡所有玩家
  C_OUT_CITY_WAR_NODE_STATE = 0x2582, //外城某城堡某建筑节点状态
  C_OUT_CITY_WAR_ARRANGE_GARRISON = 0x2584, //外城安排某一玩家驻守某一个建筑
  C_OUT_CITY_WAR_OCCUPY_BUILD = 0x2585, //外城占领某一个建筑
  C_OUT_CITY_WAR_ATTACK = 0x2586, //外城攻打进攻公会阵营 服务器随机一个玩家
  C_OUT_CITY_WAR_BUY_ACTION_POINT = 0x2587, //外城 城战购买行动点
  C_OUT_CITY_WAR_EDIT_GUILD_NOTICE = 0x2588, //外城 编辑公会通知
  C_OUT_CITY_WAR_OBSERVE_LEFT = 0x25cf, // 观看的人离开城战页面
  C_OUT_CITY_WAR_CANCEL_OCCUPY = 0x25d0, // 取消占领
  C_OUT_CITY_WAR_ONE_PLAYER_STATUS = 0x25d1, // 获取某个城堡下玩家信息
  C_ARTIFACT_APPLRAISAL = 0x2589, //神器鉴定
  C_ARTIFACT_RECAST = 0x258b, //神器重铸
  C_KF_REPLY_QUERY = 0x2236, //客服系是否有回复最新消息请求
  C_GET_PET_ARTIFACT_LIST = 0x21fd, // 请求玩家英灵神器列表
  CH_INBLACK_LIST = 0x3ace, //是否在对方的黑名单列表中

  C_GET_ALL_FRAME = 0x226a, // 拥有的所有头像框
  C_FRAME_CHANGE = 0x2268, //头像框切换
  C_OUT_CITY_VEHICLE_INFO = 0x25d2, //外城物资车信息
  C_OUT_CITY_VEHICLE_CHANGE_PLAYER = 0x25d3, //外城物资车增减玩家
  C_OUT_CITY_VEHICLE_ATTACK = 0x25d4, //攻打物资车
  C_OUT_CITY_VEHICLE_FIXPOS = 0x25d5, //外城玩家修正坐标
  C_EXTRAJOB_REQ = 0x21a0, // 秘典请求
  C_EXTRAJOBEQUIP_REQ = 0x21a1, // 魂器请求
  C_USER_EXTRAJOB_REQ = 0x21a2, // 玩家专精信息请求(个人资料)

  C_SECRET_INFO = 0x25d6, //玩家秘境信息
  C_SECRET_CHOOSE = 0x25d7, //秘境选择选项
  C_SECRET_OP = 0x25d8, //秘境前进，放弃，复活

  C_USER_BIND_QUERY = 0x209b, // 查询帐号绑定关系 消息体为空
  C_USER_UPACCOUNT_REWARD = 0x209c, // 帐号升级奖励 消息体为空
  C_CONSORTIA_TASK_INFO = 0x25d9, //公会任务信息
  C_CONSORTIA_TASK_REWARD = 0x25da, // 公会任务奖励
  C_CONSORTIA_TASK_REFRESH = 0x25db, // 公会任务刷新
  C_CONSORTIA_TASK_UPGRADESTAR = 0x25dc, // 公会任务升星
  C_SECRET_LAYER_INFO = 0x25dd, //秘境通过的最大层数信息
}
