import t_s_baseConfigData from "./t_s_baseConfigData";

/*
 * t_s_robottemplate
 */
export default class t_s_robottemplate {
  public mDataList: t_s_robottemplateData[];

  public constructor(list: object[]) {
    this.mDataList = [];
    for (let i in list) {
      this.mDataList.push(new t_s_robottemplateData(list[i]));
    }
  }
}

export class t_s_robottemplateData extends t_s_baseConfigData {
  //TemplateId(编号)
  public TemplateId: number;
  //NickName(昵称)
  protected NickName: string;
  protected NickName_en: string = "";
  protected NickName_es: string = "";
  protected NickName_fr: string = "";
  protected NickName_pt: string = "";
  protected NickName_tr: string = "";
  protected NickName_zhcn: string = "";
  protected NickName_zhtw: string = "";
  //Sexs(性别)
  public Sexs: number;
  //Grades(等级)
  public Grades: number;
  //Heros(英雄模板)
  public Heros: number[];
  //Soldiers(士兵)
  public Soldiers: number[];
  //Pets(携带英灵)
  public Pets: string;
  //Type(机器人类型)
  public Type: number;

  constructor(data?: object) {
    super();
    if (data) {
      for (let i in data) {
        this[i] = data[i];
      }
    }
  }

  private NickNameKey: string = "NickName";
  public get NickNameLang(): string {
    let value = this.getKeyValue(this.getLangKey(this.NickNameKey));
    if (value) {
      return value;
    }
    return ""; //return this.getKeyValue(this.NickNameKey);
  }
}
