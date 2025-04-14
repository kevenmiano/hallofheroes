//@ts-expect-error: External dependencies
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
export class SinglePassAreaRewardData {
  public DropId: number;
  public ItemId: number;
  public Area: number;
  public Count: number;
  public goodsInfoArr: Array<GoodsInfo>;
}
