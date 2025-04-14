/*
 * @Author: jeremy.xu
 * @Date: 2021-11-09 12:15:38
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2021-11-09 14:21:50
 * @Description: 战对象数据
 */

import { PetData } from "../../pet/data/PetData";

export class PetChallengeObjectData {
  public petList: PetData[] = [];
  public userName: string;
  public userId: number;
  public ranking: number;
  public score: number;
  public isSelf: boolean = false;

  /**
   * 总战斗力
   */
  public get totalFightPower(): number {
    var fightPower: number = 0;
    this.petList.forEach((petdata: PetData) => {
      fightPower += petdata.fightPower;
    });
    return fightPower;
  }

  public get petData(): PetData {
    var p: PetData;
    this.petList.forEach((petdata: PetData) => {
      if (!p || petdata.fightPower > p.fightPower) {
        p = petdata;
      }
    });
    return p;
  }
}
