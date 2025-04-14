//@ts-expect-error: External dependencies
/**
 * 日常活动节点数据
 * */
export default class DailyItemInfo {
  public TemplateId: string = "";
  public Levels: number = 0; //所需等级
  public ActiveTime: string = ""; //活动时间描述
  public ActiveName: string = ""; //活动名称
  public MaxCount: number = 0; //总次数
  public Sort: number = 0; //排序字段
  public Type: number = 1; //活动类型 0 时段活动 1全天活动
  public currentFinsh: number = 0; //当前完成次数
  public condition: string = ""; //活动条件
  public reward: string = ""; //活动奖励
  public starCount: number = 0; //星级
  public state: number = 0; //状态  0 未完成 1完成 2等级不足

  public Gold: number = 0; //黄金星级
  public Exp: number = 0; //经验星级
  public Strategy: number = 0; //战魂星级
  public Detail: string = ""; //描述
  public DropList: string = ""; //掉落列表（123,123,123）
}
