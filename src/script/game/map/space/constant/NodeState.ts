/**
 * 节点状态的枚举
 */
export class NodeState {
  /**
   * 表示已消失
   */
  public static NONE: number = 0;

  /**
   * 表示正常,默认与其他玩家都为敌对的
   */
  public static EXIST: number = 1;

  /**
   * 友好
   */
  public static FRIENDLY: number = 2;

  /**
   * 表示正在战斗
   */
  public static FIGHTING: number = 4;

  /**
   * 销毁
   */
  public static DESTROYED: number = 8;

  public static HIDE: number = 9;

  public static STATE2: number = 16;
  public static STATE3: number = 17;

  public static getStateValue(state: number): string {
    switch (state) {
      case NodeState.STATE2:
        return "state2";
      case NodeState.STATE3:
        return "state3";
    }
    return "";
  }

  /**
   *    是否对立状态
   *
   */
  public static isOppositionState(state: number): boolean {
    switch (state) {
      case NodeState.HIDE:
      case NodeState.DESTROYED:
      case NodeState.FRIENDLY:
      case NodeState.NONE:
        return false;
    }
    return true;
  }

  public static displayState(state: number): boolean {
    switch (state) {
      case NodeState.EXIST:
      case NodeState.FRIENDLY:
      case NodeState.FIGHTING:
      case NodeState.STATE2:
      case NodeState.STATE3:
        return true;
    }
    return false;
  }
}
