import t_s_baseConfigData from "./t_s_baseConfigData";

/*
 * t_s_simpletask
 */
export default class t_s_simpletask {
  public mDataList: t_s_simpletaskData[];

  public constructor(list: object[]) {
    this.mDataList = [];
    for (let i in list) {
      this.mDataList.push(new t_s_simpletaskData(list[i]));
    }
  }
}

export class t_s_simpletaskData extends t_s_baseConfigData {
  //TaskId(目标编号)
  public TaskId: number;
  //Detail(描述详情)
  public Detail: string;
  //Type(类型)
  public Type: number;
  //IParam1(参数1)
  public IParam1: number;
  //IParam2(参数2)
  public IParam2: number;
  //IParam3(参数3)
  public IParam3: number;
  //IParam4(参数4)
  public IParam4: number;
  //IParam5(参数5)
  public IParam5: number;
  //Sparam1(预留参数)
  public Sparam1: number;

  constructor(data?: object) {
    super();
    if (data) {
      for (let i in data) {
        this[i] = data[i];
      }
    }
  }
}
