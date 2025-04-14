import t_s_baseConfigData from "./t_s_baseConfigData";

/*
 * t_s_seektemplate
 */
export default class t_s_seektemplate {
  public mDataList: t_s_seektemplateData[];

  public constructor(list: object[]) {
    this.mDataList = [];
    for (let i in list) {
      this.mDataList.push(new t_s_seektemplateData(list[i]));
    }
  }
}

export class t_s_seektemplateData extends t_s_baseConfigData {
  //ID(id)
  public ID: number;
  //Condition(描述)
  public Condition: string;

  constructor(data?: object) {
    super();
    if (data) {
      for (let i in data) {
        this[i] = data[i];
      }
    }
  }
}
