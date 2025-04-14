/*
 * @Author: jeremy.xu
 * @Date: 2021-11-09 12:16:27
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2021-11-09 12:16:28
 * @Description: 英灵竞技战报数据
 */

import { PetData } from "../../pet/data/PetData";

export class PetChallengeObjectEventData {
  public userId: number;
  public tarUserId: number;
  public tarNickName: string;
  public result: number;
  public isAttack: boolean;
  public logDate: string;
  public score: number;
  public tarPets: PetData[] = [];
}
