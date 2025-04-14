//@ts-expect-error: External dependencies
/*
 * @Author: jeremy.xu
 * @Date: 2024-03-29 12:19:40
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-04-16 18:25:53
 * @Description: 公会任务
 * 星级、奖励、任务，三者分别随机，相互之间独立
 * 玩家的公会任务会由1个任务ID，若干奖励ID，1个星级组成
 * 同样任务ID，星级不同，所需数量也不同
 * 同样的奖励ID，星级不同，奖励物品的数量也不同
 */

import ConfigMgr from "../../../../core/config/ConfigMgr";
import { t_s_consortiataskData } from "../../../config/t_s_consortiatask";
import { ConfigType } from "../../../constant/ConfigDefine";
import { FinishStatus } from "../../../constant/Const";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";

export class ConsortiaTaskInfo {
  // 任务id
  private _taskId: number;
  set taskId(v: number) {
    this._taskId = v;
    this.taskTemplete = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_consortiatask,
      v,
    ) as t_s_consortiataskData;
  }
  get taskId(): number {
    return this._taskId;
  }
  taskTemplete: t_s_consortiataskData;
  // 标题：根据星级计算
  taskTitle: string = "";
  // 内容：根据星级计算
  taskContent: string = "";
  // 0未完成 1 完成未领取 2已领取
  status: FinishStatus = FinishStatus.UN_FINISHED;
  // 任务进度
  progNum: number = 0;
  // 任务星级
  starNum: number = 0;

  // 公会奖励：根据fixid、星级计算
  guildRewardInfoList: GoodsInfo[] = [];
  // 个人奖励：根据rewardId、星级计算
  selfRewardInfoList: GoodsInfo[] = [];
  // 任务总数
  get finishNeedNum() {
    return this.taskTemplete && this.taskTemplete["CountStar" + this.starNum];
  }
}
