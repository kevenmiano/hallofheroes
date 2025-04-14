/*
 * @Author: jeremy.xu
 * @Date: 2024-03-01 16:29:33
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-04-01 17:13:57
 * @Description:
 */
import t_s_baseConfigData from "./t_s_baseConfigData";

/*
 * t_s_consortiataskreward
 */
export default class t_s_consortiataskreward {
  public mDataList: t_s_consortiataskrewardData[];

  public constructor(list: object[]) {
    this.mDataList = [];
    for (let i in list) {
      this.mDataList.push(new t_s_consortiataskrewardData(list[i]));
    }
  }
}

export class t_s_consortiataskrewardData extends t_s_baseConfigData {
  // 任务编号
  public Id: number = 0;
  // 位置，0为固定的公会奖励，1~5为任务奖励，11~15为下方进度条的固定积分奖励
  public Site: number = 0;
  // 奖励物品ID
  public RewardItemId: number = 0;

  // 所需玩家等级
  public NeedGrade: number = 0;
  // 所需公会任务建筑等级
  public NeedTaskLevel: number = 0;
  // 权重
  public Weight: number = 0;
  // 1星奖励数量
  public RewardNumStar1: number = 0;
  // 2星奖励数量
  public RewardNumStar2: number = 0;
  // 3星奖励数量
  public RewardNumStar3: number = 0;
  // 4星奖励数量
  public RewardNumStar4: number = 0;
  // 5星奖励数量
  public RewardNumStar5: number = 0;

  constructor(data?: object) {
    super();
    if (data) {
      for (let i in data) {
        this[i] = data[i];
      }
    }
  }
}
