import { GoodsInfo } from "../../../datas/goods/GoodsInfo";

export class DisocuntInfo {
  public type: number = 1; //0title, 1数据
  public title: string = "";
  public count: number = 0;
  public listGoods: GoodsInfo[] = [];
}
