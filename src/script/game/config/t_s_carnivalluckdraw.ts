import t_s_baseConfigData from "./t_s_baseConfigData";

/*
 * t_s_carnivalluckdraw
 */
export default class t_s_carnivalluckdraw {
  public mDataList: t_s_carnivalluckdrawData[];

  public constructor(list: object[]) {
    this.mDataList = [];
    for (let i in list) {
      this.mDataList.push(new t_s_carnivalluckdrawData(list[i]));
    }
  }
}

export class t_s_carnivalluckdrawData extends t_s_baseConfigData {
  public Id: number = 0;
  public Item: number = 0;
  public ItemNum: number = 0;
  public MasterType: number = 0;
  public Random: number = 0;
  public SonType: number = 0;

  constructor(data?: object) {
    super();
    if (data) {
      for (let i in data) {
        this[i] = data[i];
      }
    }
  }
}
