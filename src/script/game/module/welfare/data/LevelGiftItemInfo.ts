/**
 * 等级礼包免费礼包数据
 */
export default class LevelGiftItemInfo {
  public id: number; //次序
  public grade: number; //等级
  public freeStr: string; //免费领取的物品（id,count|id,count）
  public diamondStr: string; //消耗钻石购买的礼包物品
  public packageState1: number; //礼包领取状态//礼包状态（1、可领取, 2未满足条件, 3不可领取,4已经领取）
  public packageState2: number; //礼包领取状态//礼包状态（1、可购买, 2已经购买）
  public price: number; //原价
  public discount: number; //现价
}
