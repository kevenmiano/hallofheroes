import GameEventDispatcher from "../../../../core/event/GameEventDispatcher";
import Dictionary from "../../../../core/utils/Dictionary";
/**
 * @author:pzlricky
 * @data: 2021-07-19 20:56
 * @description 世界boss替身
 */
export default class WorldBossStuntmanInfo extends GameEventDispatcher {
  private dict: Dictionary = new Dictionary();
  constructor() {
    super();
  }

  /**
   * 是否已购买
   * @param campaignId 副本id
   * @return
   *
   */
  public hasBuyFor(campaignId: number): boolean {
    return this.dict[campaignId] == 1;
  }

  /**
   * 解析
   * @param info e.g. 5001,1|5002,0
   *
   */
  public parseFromString(info: string) {
    for (var key in this.dict) delete this.dict[key];

    var arr: Array<string> = info.split("|");
    var temp: Array<string>;
    for (const key in arr) {
      if (Object.prototype.hasOwnProperty.call(arr, key)) {
        var keyvalue: string = arr[key];
        temp = keyvalue.split(",");
        if (temp.length == 2) this.dict[temp[0]] = parseInt(temp[1]);
      }
    }

    this.dispatchEvent(Laya.Event.CHANGE);
  }

  /**
   * 购买
   * @param campaignId
   * @return
   *
   */
  public buyFor(campaignId: number, result: number = 1) {
    this.dict[campaignId] = result;
    this.dispatchEvent(Laya.Event.CHANGE);
  }

  /**
   * 取消购买 (手动进入取消)
   * @param campaignId
   *
   */
  public cancelBuyFor(campaignId: number) {
    delete this.dict[campaignId];
    this.dispatchEvent(Laya.Event.CHANGE);
  }
}
