/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-01-05 21:31:47
 * @LastEditTime: 2021-01-06 16:09:55
 * @LastEditors: jeremy.xu
 * @Description: 战斗UI数据
 */

import Logger from "../../../core/logger/Logger";
import FrameDataBase from "../../mvc/FrameDataBase";

export default class BattleData extends FrameDataBase {
  constructor() {
    super();
  }

  calculateHeroHp(num1: number, num2: number): number {
    return num1 + num2;
  }
}
