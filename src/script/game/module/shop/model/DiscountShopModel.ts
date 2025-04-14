//@ts-expect-error: External dependencies
/*
 * @Author: jeremy.xu
 * @Date: 2022-12-08 19:37:57
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2022-12-20 10:41:47
 * @Description:
 */
export class DiscountShopModel {
  /**
   * 物品信息
   */
  private _id: string = "";
  /**
   * 活动开始时间
   */
  private _beginTime: string = "";
  /**
   * 活动结束时间
   */
  private _endTime: string = "";
  /**
   * 获得物品信息
   */
  private _logo: string = "";
  /**
   * 我的积分
   */
  private _myScore: number = 0;
  /**
   * 我的折扣
   */
  private _myDiscount: number = 0;
  /**
   * 折扣商店物品
   */
  public discountShopGoodInfoList: DiscountShopGoodInfo[] = [];
  /**
   * 积分奖励
   */
  public discountShopScoreInfoList: DiscountShopScoreInfo[] = [];
  public open: boolean = false;

  public set id(value: string) {
    this._id = value;
  }
  public get id(): string {
    return this._id;
  }
  public set beginTime(value: string) {
    this._beginTime = value;
  }
  public get beginTime(): string {
    return this._beginTime;
  }
  public set endTime(value: string) {
    this._endTime = value;
  }
  public get endTime(): string {
    return this._endTime;
  }
  public set logo(value: string) {
    this._logo = value;
  }
  public get logo(): string {
    return this._logo;
  }
  public set myScore(value: number) {
    this._myScore = value;
  }
  public get myScore(): number {
    return this._myScore;
  }
  public set myDiscount(value: number) {
    this._myDiscount = value;
  }
  public get myDiscount(): number {
    return this._myDiscount;
  }
}

export class DiscountShopScoreInfo {
  /**
   * 积分
   */
  public score: number;
  /**
   * 物品id
   */
  public itemId: number;
  /**
   * 是否领取
   */
  public isTake: boolean; //是否已经领取(0: 未领取, 1: 已领取)
  /**
   * 数量
   */
  public count: number;
}

export class DiscountShopGoodInfo {
  /**
   * 物品ID
   */
  public itemId: number;
  /**
   * 数量
   */
  public buycount: number; //个人已经购买数量
  /**
   * 价格
   */
  public price: number;
  /**
   * 限购
   */
  public limit: number;
  /**
   * 下标
   */
  public index: number;
  /**
   * 数量
   */
  public count: number;

  public PayType: number = 1;
}
