//@ts-expect-error: External dependencies
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";

export default class SinglePassBossRewardData {
  public DropId: number;
  public ItemId: number;
  public Floor: number;
  public Type: number;
  public Count: number;
  public goodsInfoArr: Array<GoodsInfo>;
}
