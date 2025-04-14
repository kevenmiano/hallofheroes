/**
 * 聊天显示对象元素类型
 *
 */
export default class ChatCellType {
  public static NONE: number = 0;
  public static Player: number = 1;
  public static GENERAL: number = 2;
  public static PROP: number = 3;
  public static EQUIP: number = 4;
  public static HONER: number = 5;
  public static STAR: number = 6;
  public static CONSORTIA: number = 7;
  public static ROOM: number = 8;
  public static CHANNEL: number = 9;
  public static GM: number = 10;
  public static VIP: number = 11;
  public static VipLink: number = 12;
  /**
   * 世界最强领主
   */
  public static FIRST_PLAYER: number = 13;
  /**
   * 最受欢迎领主
   */
  public static POPULAR_PLAYER: number = 14;
  /**
   * 第一公会会长
   */
  public static FIRST_CONSORTIA: number = 15;
  /**
   * 游戏指导员
   */
  public static GUIDER: number = 16;
  /**
   * 表情
   */
  public static EXPRESSION: number = 17;
  /**
   * 称号
   */
  public static APPELL: number = 18;
  /**
   * 称号查询
   */
  public static APPELL_LINK: number = 19;
  /**
   * 玫瑰回赠
   */
  public static ROSE_BACK: number = 20;
  /**
   * 藏宝图增援
   */
  public static REINFORCE: number = 21;

  /**
   * 超链接至外部
   */
  public static WEB_LINK: number = 25;
  /**
   * 寻宝系统
   */
  public static SEEK_LINK: number = 26;
  /**
   * 卡牌
   */
  public static MAGIC_CARD: number = 27;
  /**
   * 捕鱼求助
   */
  public static FISH: number = 30;

  /**
   * 外城攻击BOSS, 点击链接进入外城
   */
  public static OUTERCITY_ATTACK_BOSS: number = 111;
}
