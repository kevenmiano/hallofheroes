/*
 * @Author: jeremy.xu
 * @Date: 2024-01-23 14:51:37
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-01-23 15:08:49
 * @Description: 邀请弹窗不再接受此人邀请  本次登陆有效
 * 副本邀请，竞技场邀请，外城或天空之城组队邀请，查看信息中的公会邀请，切磋及英灵切磋邀请
 */
export enum EmInviteTipType {
  Room,
  Team,
  Guild, // 目前在邀请列表中不会弹ConsortiaApplyAction
  PK,
  PetPK,
}

export default class InviteTipManager {
  private dic: Map<number, any> = new Map();
  private static _instance: InviteTipManager;
  public static get Instance(): InviteTipManager {
    if (!this._instance) {
      this._instance = new this();
    }
    return this._instance;
  }

  set(type: EmInviteTipType, key: string, b: boolean) {
    let map = this.dic.get(type);
    if (!map) {
      map = new Map();
      this.dic.set(type, map);
    }
    map.set(key, b);
  }

  get(type: EmInviteTipType, key: string): boolean {
    let map = this.dic.get(type);
    if (!map) return null;

    return map.get(key);
  }
}
