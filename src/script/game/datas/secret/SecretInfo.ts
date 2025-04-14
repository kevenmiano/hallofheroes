/*
 * @Author: jeremy.xu
 * @Date: 2024-03-01 10:07:37
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-04-19 16:54:11
 * @Description: 秘境相关信息  服务器信息
 */

import GameEventDispatcher from "../../../core/event/GameEventDispatcher";
import { SecretType } from "./SecretConst";
import { SecretTresureInfo } from "./SecretTresureInfo";

export class SecretInfo extends GameEventDispatcher {
  static MaxEnterCount = 2;

  type: SecretType; //秘境类型
  secretId: number = 0; //秘境id
  maxLayer: number = 0; //通过最大层数
  curLayer: number = 0; //当前层数
  eventId: number = 0; //事件id
  curStatus: number = 0; //当前状态，1 默认 2 战斗中 3 战败  4战胜
  passSecret: string = ""; //通过的秘境id，逗号连接
  curCount: number = 0; // 进入次数
  dropItem: string = ""; //掉落秘宝 item1:num1,item2:num2
  dropType: number = 0; //掉落类型 1 掉落物品 2 掉落秘宝

  treasureInfoList: SecretTresureInfo[] = [];
  private _treasure: string = ""; //当前拥有的秘宝 item1:num1,item2:num2
  set treasure(v: string) {
    if (v != this._treasure) {
      this._treasure = v;
      this.parseTreasure();
    }
  }
  get treasure(): string {
    return this._treasure;
  }

  constructor(type: SecretType) {
    super();
    this.type = type;
  }

  get leftCount(): number {
    return SecretInfo.MaxEnterCount - this.curCount;
  }

  checkOpen(preSecret: number) {
    if (!preSecret) return true;
    return this.passSecret.indexOf(preSecret.toString()) != -1;
  }

  private parseTreasure() {
    this.treasureInfoList = [];
    if (!this._treasure) return;
    let itemStrArr = this._treasure.split(",");
    for (let index = 0; index < itemStrArr.length; index++) {
      const itemStr = itemStrArr[index];
      const tempArr = itemStr.split(":");

      let info = new SecretTresureInfo();
      info.templateId = Number(tempArr[0]);
      info.count = Number(tempArr[1]);
      this.treasureInfoList.push(info);
    }
  }
}
