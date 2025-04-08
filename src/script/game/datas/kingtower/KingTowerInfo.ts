// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-04-22 12:09:50
 * @LastEditTime: 2023-07-18 20:51:04
 * @LastEditors: jeremy.xu
 * @Description: 王者之塔信息
 */

import LangManager from "../../../core/lang/LangManager";
import { KingTowerType } from "./KingTowerType";

export class KingTowerInfo {
  /**
   * 王者之塔最大进入次数(默认为1)
   */
  public maxKingCount: number = 1;

  /**
   * 王者之塔进入次数
   */
  public kingCount: number = 0;

  /**
   * 最大通过难度(0: 默认, 1: 简单, 2: 普通, 3: 困难, 4: 噩梦)
   */
  public maxIndex: number = 0;
  /**
   * 当前层数
   */
  public currentIndex: number = 0;
  /**
   * 当前难度
   */
  public currentStep: number = 0;
  /**
   * 影之魂数量
   */
  public rewardCount: number = 0;

  /**
   * 王者之塔是否达到进入的最大次数
   */
  public get isKingTowerOverMaxCount(): boolean {
    return false; //没有收益次数也可进入王者之塔
    return this.kingCount >= this.maxKingCount;
  }
  /**
   * 得到难度文本
   * @param type
   */
  public difficultyStep(type: number): string {
    var str: string;
    switch (type) {
      case KingTowerType.SIMPLE:
        str = LangManager.Instance.GetTranslation(
          "kingtower.difficulty.simple"
        );
        break;
      case KingTowerType.COMMON:
        str = LangManager.Instance.GetTranslation(
          "kingtower.difficulty.common"
        );
        break;
      case KingTowerType.HARD:
        str = LangManager.Instance.GetTranslation("kingtower.difficulty.hard");
        break;
      case KingTowerType.NIGHTMARE:
        str = LangManager.Instance.GetTranslation(
          "kingtower.difficulty.nightmare"
        );
        break;
      default:
        break;
    }
    return str;
  }
}
