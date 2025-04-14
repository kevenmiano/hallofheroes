import SceneType from "../map/scene/SceneType";

/**
 *  用来决定登录后进入什么场景
 *  副本中下线上线应该进入副本等
 */
export default class LoginState {
  public static INCASTLE: number = 0x0;
  public static CASTLE_SCENE: number = 0x2;
  public static OUTERCITY_SCENE: number = 0x3;
  public static CAMPAIGN: number = 0x4;
  public static BATTLE: number = 0x5;

  /**
   * 根据值取得进入的场景名称
   * @param stateId LoginState
   * @return 场景名称SceneType
   */
  public static getState(stateId: number): string {
    if (stateId == LoginState.INCASTLE) {
      return SceneType.CASTLE_SCENE;
    } else if (stateId == LoginState.CAMPAIGN) {
      return SceneType.CAMPAIGN_MAP_SCENE;
    } else if (stateId == LoginState.BATTLE) {
      return SceneType.BATTLE_SCENE;
    }
    return "";
  }
}
