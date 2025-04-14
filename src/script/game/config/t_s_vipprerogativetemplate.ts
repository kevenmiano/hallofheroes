import t_s_baseConfigData from "./t_s_baseConfigData";

/*
 * t_s_vipprerogativetemplate
 */
export default class t_s_vipprerogativetemplate {
  public mDataList: t_s_vipprerogativetemplateData[];

  public constructor(list: object[]) {
    this.mDataList = [];
    for (let i in list) {
      this.mDataList.push(new t_s_vipprerogativetemplateData(list[i]));
    }
  }
}

export class t_s_vipprerogativetemplateData extends t_s_baseConfigData {
  //id(编号)
  public id: number;
  //name(名称)
  protected name: string;
  protected name_en: string = "";
  protected name_es: string = "";
  protected name_fr: string = "";
  protected name_pt: string = "";
  protected name_tr: string = "";
  protected name_zhcn: string = "";
  protected name_zhtw: string = "";
  //type(类型)
  public type: number;
  //grade(等级)
  public grade: number;
  //para1(参数1)
  public para1: number;
  //para2(参数2)
  public para2: number;
  //para3(参数3)
  public para3: string;

  constructor(data?: object) {
    super();
    if (data) {
      for (let i in data) {
        this[i] = data[i];
      }
    }
  }

  private nameKey: string = "name";
  public get nameLang(): string {
    let value = this.getKeyValue(this.getLangKey(this.nameKey));
    if (value) {
      return value;
    }
    return ""; //return this.getKeyValue(this.nameKey);
  }
}
