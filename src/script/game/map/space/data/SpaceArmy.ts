import { BaseArmy } from "./BaseArmy";
/**
 * 天空之城部队信息
 */
export default class SpaceArmy extends BaseArmy {
  /**
   * 视野状态
   * 0: 进入视野
   * 1: 离开视野
   * 2: 视野内移动
   */
  public viewState: number = -1;
  /**
   * Avatar角度
   */
  public angle: number = -1;
  /**
   * 是否是机器人
   */
  public isRobot: boolean = false;
  /**
   * 是否已经添加（机器人专用）
   */
  public isAdded: boolean = false;
  constructor() {
    super();
  }
}
