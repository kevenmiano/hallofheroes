import t_s_baseConfigData from "./t_s_baseConfigData";

/*
 * t_s_qqgrade
 */
export default class t_s_qqgrade {
  public mDataList: t_s_qqgradeData[];

  public constructor(list: object[]) {
    this.mDataList = [];
    for (let i in list) {
      this.mDataList.push(new t_s_qqgradeData(list[i]));
    }
  }
}

export class t_s_qqgradeData extends t_s_baseConfigData {
  //Grade(特权等级)
  public Grade: number;
  //Name(名字)
  public Name: string;
  //Privilegereward(特权奖励)
  public Privilegereward: string;
  //Weekgiftbag(周礼包)
  public Weekgiftbag: string;

  constructor(data?: object) {
    super();
    if (data) {
      for (let i in data) {
        this[i] = data[i];
      }
    }
  }
}
