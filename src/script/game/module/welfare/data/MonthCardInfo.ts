/**
 * @author:pzlricky
 * @data: 2021-06-29 14:18
 * @description 月卡信息
 */
export default class MonthCardInfo {
  public cardType: number = 1; //1普通月卡 2超级月卡
  public isPay: boolean = false; //是否已购买 false未购买 true 已购买
  public isReceive: boolean = false; //当日的奖励是否已领取 false 未领取 true 已领取
  public leftDays: number = 30; //月卡剩余天数

  constructor(data?: object) {
    for (let i in data) {
      this[i] = data[i];
    }
  }
}
