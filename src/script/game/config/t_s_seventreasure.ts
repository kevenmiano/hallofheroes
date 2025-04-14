import t_s_baseConfigData from "./t_s_baseConfigData";

/*
 * t_s_seventreasure
 */
export default class t_s_seventreasure {
  public mDataList: t_s_seventreasureData[];

  public constructor(list: object[]) {
    this.mDataList = [];
    for (let i in list) {
      this.mDataList.push(new t_s_seventreasureData(list[i]));
    }
  }
}

export class t_s_seventreasureData extends t_s_baseConfigData {
  //Id(编号)
  public Id: number;
  //Integral(累计积分)
  public Integral: number;
  //Item(道具数量)
  public Item: string;
  //Icon(展示图标)
  public Icon: string;

  constructor(data?: object) {
    super();
    if (data) {
      for (let i in data) {
        this[i] = data[i];
      }
    }
  }
}
