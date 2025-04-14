//@ts-expect-error: External dependencies
/**
 * Vip特权数据
 */

import { GoodsInfo } from "../../datas/goods/GoodsInfo";

export default class PrivilegeItemData {
  //特权说明
  public des: string = "";
  //type(类型)
  public type: number = 0;
  //grade(等级)
  public grade: number = 0;
  //尊享特权数量
  public count: number = 0;

  //每日礼包上次领取时间
  public dayGiftTime: number | Long = 0;

  public dayAwardlist: GoodsInfo[] = [];
  public dayGiftState: number = 0; //每日礼包状态 0:不可领取 1:可领取 2:当天已领取过了

  public freeAwardlist: GoodsInfo[] = [];
  public isFreeGift: boolean = false; //能否领取福利礼包

  public payAwardlist: GoodsInfo[] = [];
  public isPayGift: boolean = false; //能否领取特权礼包
}
