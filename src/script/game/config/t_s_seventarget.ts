import t_s_baseConfigData from "./t_s_baseConfigData";

/*
 * t_s_seventarget
 */
export default class t_s_seventarget {
  public mDataList: t_s_seventargetData[];

  public constructor(list: object[]) {
    this.mDataList = [];
    for (let i in list) {
      this.mDataList.push(new t_s_seventargetData(list[i]));
    }
  }
}

export class t_s_seventargetData extends t_s_baseConfigData {
  //Id(编号)
  public Id: number;
  //Title(任务名称)
  protected Title: string;
  protected Title_en: string = "";
  protected Title_es: string = "";
  protected Title_fr: string = "";
  protected Title_pt: string = "";
  protected Title_tr: string = "";
  protected Title_zhcn: string = "";
  protected Title_zhtw: string = "";
  //MainType(主类型)
  public MainType: number;
  //Type(任务类型)
  public Type: number;
  //Para1(参数1)
  public Para1: number;
  //Para2(参数2)
  public Para2: number;
  //Para3(参数3)
  public Para3: number;
  //Para4(参数4)
  public Para4: number;
  //Para5(参数5)
  public Para5: number;
  //Sparam1(预留参数)
  public Sparam1: number;
  //Num(任务分数)
  public Num: number;
  //Day(七日目标天数)
  public Day: number;
  //Item(奖励道具)
  public Item: string;
  //Sort(任务排序)
  public Sort: number;

  constructor(data?: object) {
    super();
    if (data) {
      for (let i in data) {
        this[i] = data[i];
      }
    }
  }

  private TitleKey: string = "Title";
  public get TitleLang(): string {
    let value = this.getKeyValue(this.getLangKey(this.TitleKey));
    if (value) {
      return value;
    }
    return ""; //return this.getKeyValue(this.TitleKey);
  }
}
