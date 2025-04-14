/*
 * @Author: jeremy.xu
 * @Date: 2024-03-29 12:19:40
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-04-02 10:50:07
 * @Description: 周任务总积分奖励信息
 */

import { GoodsInfo } from "../../../datas/goods/GoodsInfo";

export class ConsortiaTaskScoreRewardInfo {
  score: number = 0;
  itemList: GoodsInfo[] = [];
  icon: string = "";
  reachCond: boolean = false;
  recevied: boolean = false;
  get canRecevie(): boolean {
    return this.reachCond && !this.recevied;
  }
}
