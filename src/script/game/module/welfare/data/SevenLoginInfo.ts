import { GoodsInfo } from "../../../datas/goods/GoodsInfo";

/**
 * 七日登录数据
 */
export default class SevenLoginInfo {
  public day: number = 0; //天数
  public goodsInfo: GoodsInfo = null; //奖励
  public status: number = 0; //1、已完成未领取 2、未完成  3、已领取
}
