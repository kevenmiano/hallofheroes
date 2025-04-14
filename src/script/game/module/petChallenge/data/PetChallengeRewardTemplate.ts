/*
 * @Author: jeremy.xu
 * @Date: 2021-11-10 10:23:37
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-06-09 11:43:09
 * @Description:
 */

import { GoodsInfo } from "../../../datas/goods/GoodsInfo";

export class PetChallengeRewardTemplate {
  /**
   * 1-日奖励 2-周奖励
   */
  public Type: number;
  public RewardType: number;
  public isExtraReward: boolean;
  public minScore: number = 0;
  public maxScore: number = 0;
  public rankIdx: number = 0;
  public scoreScope: string = "";
  public rewardName: string = "";
  public goodList: GoodsInfo[] = [];
}
