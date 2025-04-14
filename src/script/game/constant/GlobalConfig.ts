export class GlobalConfig {
  // mark 全删除
  public static NEWBIE_11300: number = 11300;
  public static NEWBIE_11400: number = 11400;
  public static NEWBIE_13500: number = 13500; //解救少女后指引提交任务
  public static NEWBIE_14000: number = 14000; //蒂娜疗伤
  public static NEWBIE_16000: number = 16000;
  public static NEWBIE_16500: number = 16500;
  public static NEWBIE_17500: number = 17500;
  public static NEWBIE_18000: number = 18000; //夺回城镇Boss战
  public static NEWBIE_19000: number = 19000;
  public static NEWBIE_20000: number = 20000;
  public static NEWBIE_22000: number = 22000;
  public static NEWBIE_22500: number = 22500; //指引外城打矿
  public static NEWBIE_22800: number = 22800; //民居介绍
  public static NEWBIE_23000: number = 23000; //指引战役
  public static NEWBIE_24000: number = 24000; //指引技能加点
  public static NEWBIE_25500: number = 25500; //外城掠夺指引
  public static NEWBIE_26200: number = 26200; //
  public static NEWBIE_27000: number = 27000;
  public static NEWBIE_32000: number = 32000;
  public static NEWBIE_33000: number = 33000;
  public static NEWBIE_34000: number = 34000;
  public static NEWBIE_35400: number = 35220; ///指引点击天空之城按钮
  public static NEWBIE_35600: number = 35600; ///挑战
  public static NEWBIE_40000: number = 40000;
  public static NEWBIE_41000: number = 41000;
  public static NEWBIE_43000: number = 43000;

  public static Common = {};

  public static Avatar = {
    battleShadowW: 80,
    battleShadowH: 64,
  };

  /**
   * 內城
   */
  public static Castle = {};

  /**
   * 天空之城
   */
  public static Space = {};

  /**
   * 副本
   */
  public static Campaign = {};

  /**
   * 外城
   */
  public static OuterCity = {
    UncontestablePhysicId: 802411,
    // 王城、南方都城、北方都城
    CastleNodeIdList: [803108, 802590, 802837],
  };

  /**
   * 战斗
   */
  public static Battle = {};

  /**
   * 翻牌相关
   */
  public static ChestFrame = {
    AgainLimitLevel: 30,
  };

  /**
   * 新手
   */
  public static Novice = {
    TaskNoviceArrow: 20,
    CampaignShowTaskLevel: 8, //低于此等级进副本则打开任务栏
    OutCityMapID: 100, //新手岛从10万开始, 新手岛模板id为100
    NewMapID: 100000,
  };

  /**
   * 铁匠铺
   */
  public static Forge = {};

  /**
   * 社交
   */
  public static Communication = {
    AddFriend: 6,
  };

  public static CampaignID = {
    AncientRuins: 3001, // 远古遗迹
    NewbieLayer1: 10001,
    NewbieLayer2: 10002,
  };

  public static CampaignNodeID = {
    Node_1000108: 1000108, // 新手第一层传送门
    Node_1000103: 1000103, //
    Node_1000104: 1000104, //
    Node_1000106: 1000106, //
    Node_1000201: 1000201, // 新手第二层出生点
    Node_1000202: 1000202,
    Node_1000203: 1000203,
    Node_1000205: 1000205, // 新手第二层残暴血蹄
    Node_1000206: 1000206, // 新手第二层传送门
    Node_1000208: 1000208,
    Node_2000149: 2000149, // 英灵岛 神秘人
  };

  /**
   * 缩略图
   */
  public static MapSmallMap = [10000, 20001, 20002, 20003, 20004, 30000];
  public static MapSmallMapRandom = [20001, 20002, 20003, 20004, 30000];
}
