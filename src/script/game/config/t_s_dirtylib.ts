import t_s_baseConfigData from "./t_s_baseConfigData";

/*
 * t_s_dirtylib
 */
export default class t_s_dirtylib {
  public mDataList: t_s_dirtylibData[];

  public constructor(list: object[]) {
    this.mDataList = [];
    for (let i in list) {
      this.mDataList.push(new t_s_dirtylibData(list[i]));
    }
  }
}

export class t_s_dirtylibData extends t_s_baseConfigData {
  //Id(序号)
  public Id: number;
  //Value(组合关键词（注: OR表示“或者”的意思；AND表示“而且”的意思）)
  public Value: string;

  constructor(data?: object) {
    super();
    if (data) {
      for (let i in data) {
        this[i] = data[i];
      }
    }
  }
}
