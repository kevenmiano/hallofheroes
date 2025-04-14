import t_s_baseConfigData from "./t_s_baseConfigData";

/*
 * t_s_sevengiftbag
 */
export default class t_s_sevengiftbag {
  public mDataList: t_s_sevengiftbagData[];

  public constructor(list: object[]) {
    this.mDataList = [];
    for (let i in list) {
      this.mDataList.push(new t_s_sevengiftbagData(list[i]));
    }
  }
}

export class t_s_sevengiftbagData extends t_s_baseConfigData {
  //Id(编号)
  public Id: number;
  //Day(天数)
  public Day: number;
  //Name(礼包名称)
  protected Name: string;
  protected Name_en: string = "";
  protected Name_es: string = "";
  protected Name_fr: string = "";
  protected Name_pt: string = "";
  protected Name_tr: string = "";
  protected Name_zhcn: string = "";
  protected Name_zhtw: string = "";
  //Discount(折扣)
  public Discount: number;
  //Currency(礼包价格)
  public Currency: number;
  //Item(礼包道具)
  public Item: string;

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
