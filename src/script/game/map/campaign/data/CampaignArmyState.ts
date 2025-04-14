/**
 * 副本军队与死亡复活相关状态
 */
export class CampaignArmyState {
  /**
   * 复活
   */
  public static STATE_LIVE: number = 0;
  /**
   * 死亡
   */
  public static STATE_DIED: number = 1;
  /**
   * 运输
   */
  public static STATE_TRAN: number = 2;
  /**
   * 死亡运输
   */
  public static STATE_DIEDTRAN: number = 3;
  /**
   * 工会战防守
   */
  public static STATE_DEFENCE: number = 4;

  /**
   * 是否为死亡状态
   * @param state
   * @return
   *
   */
  public static checkDied(state: number): boolean {
    if (
      state == CampaignArmyState.STATE_DIED ||
      state == CampaignArmyState.STATE_DIEDTRAN
    )
      return true;
    return false;
  }
  /**
   * 是否为公会战防守状态
   * @param state
   * @return
   *
   */
  public static checkIsDefence(state: number): boolean {
    return state == CampaignArmyState.STATE_DEFENCE;
  }
  constructor() {}
}
