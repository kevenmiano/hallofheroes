import t_s_baseConfigData from "./t_s_baseConfigData";

/*
 * t_s_petequipsuit 英灵装备部位套装表
 */
export default class t_s_petequipsuit {
  public mDataList: t_s_petequipsuitData[];

  public constructor(list: object[]) {
    this.mDataList = [];
    for (let i in list) {
      this.mDataList.push(new t_s_petequipsuitData(list[i]));
    }
  }
}

export class t_s_petequipsuitData extends t_s_baseConfigData {
  //(套装ID)
  public SuitId: number = 0;
  //(激活需求)
  public Amount: number = 0;
  //(属性类型)
  public AttributeId: number = 0;
  //(属性加成)
  public ValueParam: number = 0;
  //(套装技能)
  public SuitSkill: number = 0;
  //(套装图标)
  public SuitIcon: string = "";
  //(套装名称)
  public SuitName: string = "";
  //(套装描述)
  protected Description: string = "";
  protected Description_en: string = "";
  protected Description_es: string = "";
  protected Description_fr: string = "";
  protected Description_pt: string = "";
  protected Description_tr: string = "";
  protected Description_zhcn: string = "";
  protected Description_zhtw: string = "";
  //(套装解锁强化等级)
  public StrengthenGrow: number = 0;

  constructor(data?: object) {
    super();
    if (data) {
      for (let i in data) {
        this[i] = data[i];
      }
    }
  }

  private DescriptionKey: string = "Description";
  public get DescriptionLang(): string {
    let value = this.getKeyValue(this.getLangKey(this.DescriptionKey));
    if (value) {
      return value;
    }
    return ""; //return this.getKeyValue(this.DescriptionKey);
  }

  private SuitNameKey: string = "SuitName";
  public get SuitNameLang(): string {
    let value = this.getKeyValue(this.getLangKey(this.SuitNameKey));
    if (value) {
      return value;
    }
    return ""; //return this.getKeyValue(this.SuitNameKey);
  }
}
