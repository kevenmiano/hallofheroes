export class ArmyType {
  /**
   *未招募部队(已生产, 但未领取)
   */
  public static ARMY_TYPE_UNRECRUIT: number = 0;
  /**
   *城堡部队（已花资源领取, 但尚未编制）
   */
  public static ARMY_TYPE_CASTLEARMY: number = 1;
  /**
   *编制部队(已编制)
   */
  public static ARMY_TYPE_SERIAL: number = 2;

  /**
   * 邀请时编制的部队
   */
  public static ARMY_INVITE: number = 4;

  /**
   *系统部队
   */
  public static ARMY_SYSTEM: number = 5;
}
