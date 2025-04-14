//@ts-expect-error: External dependencies
/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-05-11 20:15:38
 * @LastEditTime: 2023-05-29 11:10:37
 * @LastEditors: jeremy.xu
 * @Description:
 */

import ConfigMgr from "../../../../core/config/ConfigMgr";
import { t_s_singlearenarewardsData } from "../../../config/t_s_singlearenarewards";
import { ConfigType } from "../../../constant/ConfigDefine";
import { PlayerManager } from "../../../manager/PlayerManager";
import { CampaignArmy } from "../../../map/campaign/data/CampaignArmy";
import FrameDataBase from "../../../mvc/FrameDataBase";

export class ColosseumEventData {
  public userId: number;
  public tarUserId: number;
  public tarNickName: string;
  public tarGrade: number;
  public tarGp: number;
  public tarOrder: number;
  public tarTemplateId: number;
  public isAttack: boolean;
  public forward: number;
  public restult: number;
  public logDate: Date;
  public curRankResult: number;
  public curScore: number = 0;
}

export default class ColosseumData extends FrameDataBase {
  public static LONG_TIME: number = 168 * 3600 * 1000;
  public static SEVRAL_DAY_TIME: number = 72 * 3600 * 1000;
  public static CURRENT_DAY_TIME: number = 12 * 3600 * 1000;
  public static SEVRAL_HOUER_TIME: number = 1 * 3600 * 1000;
  public static PlayerItemCnt = 4;

  /**
   * 总共免费挑战次数
   */
  public totalFreeCount: number;
  /**
   * 总共可购买挑战次数
   */
  public totalBuyCount: number;
  /**
   * 当前挑战次数
   */
  public currentCount: number;
  /**
   * 当前排名
   */
  public currentRank: number;
  /**
   * 持续胜利次数
   */
  public lastWinCount: number;
  /**
   * 下次领取时间
   */
  public leftDay: number;
  /**
   * 持续胜利通告
   */
  public noticMsg: string;
  /**
   * 当前积分
   */
  public curScore: number;
  /**
   * 累胜奖励领取情况,格式:  "已领取的奖励id1,id2,"
   */
  public winCountReward: string;
  /**
   * 下一次刷新对手的时间, 秒级时间戳
   */
  public nextRefreshTime: number;

  public selectedPlayer: CampaignArmy;
  public heroRankList: CampaignArmy[] = [];
  public eventsList: ColosseumEventData[] = [];
  public heroList: CampaignArmy[] = [];
  rewardCountArrs: number[];

  show() {
    super.show();
  }

  hide() {
    super.hide();
  }

  public getThaneInfoById(id: number): CampaignArmy {
    for (let index = 0; index < this.heroList.length; index++) {
      const info = this.heroList[index] as CampaignArmy;
      if (info.userId == id) return info;
    }
    return null;
  }

  /**
   * 剩余免费挑战次数
   */
  public get remainFreeCount(): number {
    let remainCount: number = this.totalFreeCount - this.currentCount;
    return remainCount > 0 ? remainCount : 0;
  }

  /**
   * 剩余可购买挑战次数
   */
  public get remainBuyCount(): number {
    if (this.remainFreeCount > 0) {
      return this.totalBuyCount;
    } else {
      return this.totalBuyCount - (this.currentCount - this.totalFreeCount);
    }
  }

  /**
   * 已购买挑战次数
   */
  public get currentBuyCount(): number {
    return this.totalBuyCount - this.remainBuyCount;
  }

  /**
   * 当前购买挑战次数需要支付钻石
   */
  public get buyCountNeedPay(): number {
    let payValue: number = (this.currentBuyCount + 1) * 2;
    return payValue > 10 ? 10 : payValue;
  }

  private getTakeCount(rank: number): number {
    let result: number = 0;
    if (!rank) {
      let playerInfo = PlayerManager.Instance.currentPlayerModel.playerInfo;
      if (!playerInfo) {
        return result;
      }
      if (playerInfo.isChallReward) {
        rank = playerInfo.challRewardLastRank;
      } else {
        rank = this.currentRank;
      }
    }

    let i: number = 0;
    if (rank == 0) {
      result = 0;
    } else if (rank == 1) {
      result = 800000;
    } else if (rank == 2) {
      result = 600000;
    } else if (rank >= 3 && rank <= 4) {
      result = 600000;
      for (i = 3; i < 5; i++) {
        result = result - 100000;
        if (rank == i) {
          break;
        }
      }
    } else if (rank >= 5 && rank <= 11) {
      result = 400000;
      for (i = 5; i < 12; i++) {
        result = result - 10000;
        if (rank == i) {
          break;
        }
      }
    } else if (rank >= 12 && rank <= 51) {
      result = 330000;
      for (i = 12; i < 52; i++) {
        result = result - 5000;
        if (rank == i) {
          break;
        }
      }
    } else {
      result = 130000;
      let temp: number = (rank - 51) * 100;
      result = result - temp;
      result = result < 1000 ? 1000 : result;
    }
    return result;
  }

  getRewardProgress(count: number) {
    // let array = [10, 20, 35, 50];  30
    let array = this.rewardCountArrs;
    if (count >= array[array.length - 1]) {
      return 1;
    }
    let index = -1;
    for (let i = 0; i < array.length; i++) {
      if (count >= array[i]) {
        index = i;
      }
    }

    let percent =
      (index + 1) / array.length +
      (count - array[index]) / (array[index + 1] - array[index]) / array.length;
    if (index == -1) {
      percent = count / array[index + 1] / array.length;
    }

    return percent;
  }

  getBoxDataList(): t_s_singlearenarewardsData[] {
    let obj = ConfigMgr.Instance.getDicSync(ConfigType.t_s_singlearenarewards);
    this.rewardCountArrs = [];
    if (obj && obj["Type2"]) {
      for (let i = 0; i < obj["Type2"].length; i++) {
        this.rewardCountArrs.push(obj["Type2"][i].Property1);
      }
      return obj["Type2"];
    }
    return [];
  }

  /**
   * 获取自动领奖的数据
   */
  getAutoData(): t_s_singlearenarewardsData {
    for (let i = 0; i < this.rewardCountArrs.length; i++) {
      if (this.lastWinCount >= this.rewardCountArrs[i]) {
        let data = this.getBoxDataList()[i];
        if (this.winCountReward.indexOf(data.Id + "") == -1) {
          return data;
        }
      }
    }
    return null;
  }
}
