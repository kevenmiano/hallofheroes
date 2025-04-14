import t_s_baseConfigData from "./t_s_baseConfigData";

/*
 * t_s_questcondiction
 */
export default class t_s_questcondiction {
  public mDataList: t_s_questcondictionData[];

  public constructor(list: object[]) {
    this.mDataList = [];
    for (let i in list) {
      this.mDataList.push(new t_s_questcondictionData(list[i]));
    }
  }
}

export class t_s_questcondictionData extends t_s_baseConfigData {
  //TemplateId(任务编号)
  public TemplateId: number;
  //CondictionTitle(条件描述)
  protected CondictionTitle: string;
  protected CondictionTitle_en: string = "";
  protected CondictionTitle_es: string = "";
  protected CondictionTitle_fr: string = "";
  protected CondictionTitle_pt: string = "";
  protected CondictionTitle_tr: string = "";
  protected CondictionTitle_zhcn: string = "";
  protected CondictionTitle_zhtw: string = "";
  //CondictionID(条件编号)
  public CondictionID: number;
  //CondictionType(条件类型)
  public CondictionType: number;
  //Para3(参数3)
  public Para3: number;
  //Para4(参数4)
  public Para4: string;
  //Para1(参数1)
  public Para1: string;
  //Para2(参数2)
  public Para2: number;

  constructor(data?: object) {
    super();
    if (data) {
      for (let i in data) {
        this[i] = data[i];
      }
    }
  }

  private CondictionTitleKey: string = "CondictionTitle";
  public get CondictionTitleLang(): string {
    let value = this.getKeyValue(this.getLangKey(this.CondictionTitleKey));
    if (value) {
      return value;
    }
    return ""; //return this.getKeyValue(this.CondictionTitleKey);
  }
}
