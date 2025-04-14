/**
 * 公会事件信息
 * @author yuanzhan.yu
 */
export class ConsortiaEventInfo {
  public id: number = 0;
  /**
   * consortiaId
   */
  public consortiaId: number = 0;
  public remark: string;

  public createDate: Date;

  /**
   * types 1加入公会, 2踢人, 3退出公会, 4公会升级, 5技能升级, 6建筑升级, 7公会转让, 8公会扣取, 9公会事件, 10立即冷却, 11秘籍采集, 12宝箱分配
   */
  public types: number = 0;

  /**
   * isExist
   */
  public isExist: boolean;

  public static JOIN_CONSORTIA: number = 1;
  public static KICK: number = 2;
  public static QUIT: number = 3;
  public static CONSORTIA_UPGRADE: number = 4;
  public static SKILL_UPGRADE: number = 5;
  public static BUILDING_UPGRADE: number = 6;
  public static CHANGE: number = 7;
  public static DEDUCT: number = 8;
  public static EVENT: number = 9;
  public static SPEED: number = 10;
  public static CONSORTIA_PICK_FRUIT: number = 11;
  public static CHAIRMAN_SEND: number = 12;

  constructor() {}
}
