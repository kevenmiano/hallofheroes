/**
 * 充值回馈活动的每重奖励的礼包数据
 * 最多可以设置8个奖励物品
 * */
export default class FeedBackItemData {
  public id: string = ""; //礼包id
  public order: number = 0; //排序
  public point: number = 0; //所需钻石
  public price: number = 0; //礼包价格
  public goodsId1: number = 0; //回馈物品id
  public count1: number = 0; //物品数量
  public goodsId2: number = 0;
  public count2: number = 0;
  public goodsId3: number = 0;
  public count3: number = 0;
  public goodsId4: number = 0;
  public count4: number = 0;
  public goodsId5: number = 0;
  public count5: number = 0;
  public goodsId6: number = 0;
  public count6: number = 0;
  public goodsId7: number = 0;
  public count7: number = 0;
  public goodsId8: number = 0;
  public count8: number = 0;

  public state: boolean = false; //用户是否领取过

  /**
   * 根据奖励物品的索引获得奖励物品的Id
   * */
  public getGoodsIdByIndex(index: number = 0): number {
    switch (index) {
      case 1:
        return this.goodsId1;
        break;
      case 2:
        return this.goodsId2;
        break;
      case 3:
        return this.goodsId3;
        break;
      case 4:
        return this.goodsId4;
        break;
      case 5:
        return this.goodsId5;
        break;
      case 6:
        return this.goodsId6;
        break;
      case 7:
        return this.goodsId7;
        break;
      case 8:
        return this.goodsId8;
        break;
    }
    return 0;
  }
  /**
   * 根据奖励物品的索引获得奖励物品的数量
   * */
  public getGoodsCountByIndex(index: number = 0): number {
    switch (index) {
      case 1:
        return this.count1;
        break;
      case 2:
        return this.count2;
        break;
      case 3:
        return this.count3;
        break;
      case 4:
        return this.count4;
        break;
      case 5:
        return this.count5;
        break;
      case 6:
        return this.count6;
        break;
      case 7:
        return this.count7;
        break;
      case 8:
        return this.count8;
        break;
    }
    return 0;
  }
}
