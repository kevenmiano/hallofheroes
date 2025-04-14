import t_s_baseConfigData from "./t_s_baseConfigData";

/*
 * t_s_config
 */
export default class t_s_config {
  public mDataList: t_s_configData[];

  public constructor(list: object[]) {
    this.mDataList = [];
    for (let i in list) {
      this.mDataList.push(new t_s_configData(list[i]));
    }
  }
}

export class t_s_configData extends t_s_baseConfigData {
  //Id(编号)
  public Id: number;
  //ConfigName(名字)
  public ConfigName: string;
  //ConfigValue(值)
  public ConfigValue: string;
  //Description(描述)
  public Description: string;
  //IsClient(是否生成模板)
  public IsClient: number;

  constructor(data?: object) {
    super();
    if (data) {
      for (let i in data) {
        this[i] = data[i];
      }
    }
  }
}
