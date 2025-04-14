import FrameDataBase from "@/script/game/mvc/FrameDataBase";

export class WorldBossBuyBuffModel extends FrameDataBase {
  public buyBuff: number = 0; //购买buff次数
  public buyBuffMax: number = 0; //购买buff最大次数
  public buyBuffCost: number = 0; //购买buff消耗
  public buyBuffCostType: number = 0; //购买buff消耗类型
  public buyBuffCostTypeName: string = ""; //购买buff消耗类型名称
  public buffGrade: number = 0; //buff等级

  constructor() {
    super();
  }
}
