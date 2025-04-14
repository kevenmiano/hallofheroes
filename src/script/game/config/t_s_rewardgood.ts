import t_s_baseConfigData from "./t_s_baseConfigData";

/*
 * t_s_rewardgood
 */
export default class t_s_rewardgood {
  public mDataList: t_s_rewardgoodData[];

  public constructor(list: object[]) {
    this.mDataList = [];
    for (let i in list) {
      this.mDataList.push(new t_s_rewardgoodData(list[i]));
    }
  }
}

export class t_s_rewardgoodData extends t_s_baseConfigData {
  //TemplateId(任务编号)
  public TemplateId: number;
  //RepeatStep(整环数)
  public RepeatStep: number;
  //RewardItemID(奖励物品编号)
  public RewardItemID: number;
  //RewardItemCount(数量)
  public RewardItemCount: number;
  //RepeatMinLevel(等级下限)
  public RepeatMinLevel: number;
  //RepeatMaxLevel(等级上限)
  public RepeatMaxLevel: number;

  constructor(data?: object) {
    super();
    if (data) {
      for (let i in data) {
        this[i] = data[i];
      }
    }
  }
}
