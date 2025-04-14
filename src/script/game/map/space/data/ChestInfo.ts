//@ts-expect-error: External dependencies
import { PhysicInfo } from "./PhysicInfo";

/**
 * 宝箱的数据模型
 * 战斗后由服务器发送下来 并添加到节点列表中
 */
export class ChestInfo extends PhysicInfo {
  public signId: string;
  public nodePosX: number = 0;
  public nodePosY: number = 0;
  constructor() {
    super();
  }
}
