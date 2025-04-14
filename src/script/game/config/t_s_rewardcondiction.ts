import t_s_baseConfigData from "./t_s_baseConfigData";

/*
 * t_s_rewardcondiction
 */
export default class t_s_rewardcondiction {
  public mDataList: t_s_rewardcondictionData[];

  public constructor(list: object[]) {
    this.mDataList = [];
    for (let i in list) {
      this.mDataList.push(new t_s_rewardcondictionData(list[i]));
    }
  }
}

export class t_s_rewardcondictionData extends t_s_baseConfigData {
  //TemplateId(ID)
  public TemplateId: number;
  //CondictionTitle(描述)
  protected CondictionTitle: string;
  protected CondictionTitle_en: string = "";
  protected CondictionTitle_es: string = "";
  protected CondictionTitle_fr: string = "";
  protected CondictionTitle_pt: string = "";
  protected CondictionTitle_tr: string = "";
  protected CondictionTitle_zhcn: string = "";
  protected CondictionTitle_zhtw: string = "";
  //CondictionId(条件编号)
  public CondictionId: number;
  //CondictionType(条件类型)
  public CondictionType: number;
  //Para1(参数1)
  public Para1: number;
  //Para2(参数2)
  public Para2: number;
  //Para3(参数3)
  public Para3: number;
  //Para4(参数4)
  public Para4: string;
  //Para5(参数5)
  protected Para5: string;
  protected Para5_en: string = "";
  protected Para5_es: string = "";
  protected Para5_fr: string = "";
  protected Para5_pt: string = "";
  protected Para5_tr: string = "";
  protected Para5_zhcn: string = "";
  protected Para5_zhtw: string = "";

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

  private Para5Key: string = "Para5";
  public get Para5Lang(): string {
    let value = this.getKeyValue(this.getLangKey(this.Para5Key));
    if (value) {
      return value;
    }
    return ""; //return this.getKeyValue(this.Para5Key);
  }
}
