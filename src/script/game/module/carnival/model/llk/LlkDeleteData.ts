import LlkNodeData from "./LlkNodeData";

/**
 * 连连看消除数据
 */
export default class LlkDeleteData {
  public node1: LlkNodeData;
  public node2: LlkNodeData;
  public combCount: number = 0; //连击次数
  public addScore: number = 0; //积分加成
  constructor() {
    this.node1 = new LlkNodeData();
    this.node2 = new LlkNodeData();
  }
}
