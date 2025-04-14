import t_s_baseConfigData from "./t_s_baseConfigData";

/*
 * t_s_passchecktask
 */
export default class t_s_passchecktask {
  public mDataList: t_s_passchecktaskData[];

  public constructor(list: object[]) {
    this.mDataList = [];
    for (let i in list) {
      this.mDataList.push(new t_s_passchecktaskData(list[i]));
    }
  }
}

export class t_s_passchecktaskData extends t_s_baseConfigData {
  //主键ID
  public Id: number;
  //任务名
  protected Name: string;
  protected Name_en: string = "";
  protected Name_es: string = "";
  protected Name_fr: string = "";
  protected Name_pt: string = "";
  protected Name_tr: string = "";
  protected Name_zhcn: string = "";
  protected Name_zhtw: string = "";
  //任务分页
  public Area: number;
  //任务类型
  public TaskType: number;
  //任务所需数量
  public TaskNum: number;
  //经验
  public Experience: number;
  //刷新概率
  public Rand: number;
  //新增Index控制期数, 默认为0, 优先读取非默认配置
  public Index: number;

  constructor(data?: object) {
    super();
    if (data) {
      for (let i in data) {
        this[i] = data[i];
      }
    }
  }

  private NameKey: string = "Name";
  public get NameLang(): string {
    let value = this.getKeyValue(this.getLangKey(this.NameKey));
    if (value) {
      return value;
    }
    return ""; //return this.getKeyValue(this.NameKey);
  }
}
