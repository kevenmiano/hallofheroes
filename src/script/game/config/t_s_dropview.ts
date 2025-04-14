import t_s_baseConfigData from "./t_s_baseConfigData";

/*
 * t_s_dropview
 */
export default class t_s_dropview {
  public mDataList: t_s_dropviewData[];

  public constructor(list: object[]) {
    this.mDataList = [];
    for (let i in list) {
      this.mDataList.push(new t_s_dropviewData(list[i]));
    }
  }
}

export class t_s_dropviewData extends t_s_baseConfigData {
  //CondictionType(掉落类型)
  public CondictionType: number;
  //Site(位置)
  public Site: number;
  //Names(名字)
  protected Names: string;
  protected Names_en: string = "";
  protected Names_es: string = "";
  protected Names_fr: string = "";
  protected Names_pt: string = "";
  protected Names_tr: string = "";
  protected Names_zhcn: string = "";
  protected Names_zhtw: string = "";
  //Res(图标)
  public Res: string;

  constructor(data?: object) {
    super();
    if (data) {
      for (let i in data) {
        this[i] = data[i];
      }
    }
  }

  private NamesKey: string = "Names";
  public get NamesLang(): string {
    let value = this.getKeyValue(this.getLangKey(this.NamesKey));
    if (value) {
      return value;
    }
    return ""; //return this.getKeyValue(this.NamesKey);
  }
}
