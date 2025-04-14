import t_s_baseConfigData from "./t_s_baseConfigData";

/*
 * t_s_uiplaybase
 */
export default class t_s_uiplaybase {
  public mDataList: t_s_uiplaybaseData[];

  public constructor(list: object[]) {
    this.mDataList = [];
    for (let i in list) {
      this.mDataList.push(new t_s_uiplaybaseData(list[i]));
    }
  }
}

export class t_s_uiplaybaseData extends t_s_baseConfigData {
  /**PlayId(ID)*/
  public UiPlayId: number;
  /**PlayName(玩法名称)*/
  protected UiPlayName: string;
  protected UiPlayName_en: string = "";
  protected UiPlayName_es: string = "";
  protected UiPlayName_fr: string = "";
  protected UiPlayName_pt: string = "";
  protected UiPlayName_tr: string = "";
  protected UiPlayName_zhcn: string = "";
  protected UiPlayName_zhtw: string = "";
  /**Grade(开启等级)*/
  public Grade: number;
  /**UiImage(背景图)*/
  public UiImage: string;
  /**Description(玩法描述)*/
  protected Description: string;
  protected Description_en: string = "";
  protected Description_es: string = "";
  protected Description_fr: string = "";
  protected Description_pt: string = "";
  protected Description_tr: string = "";
  protected Description_zhcn: string = "";
  protected Description_zhtw: string = "";
  /**Item(掉落预览)*/
  public Item: string;
  /**ParentType(父类)*/
  public ParentType: number;
  /**ParentName(父类名称)*/
  protected ParentName: string;
  protected ParentName_en: string = "";
  protected ParentName_es: string = "";
  protected ParentName_fr: string = "";
  protected ParentName_pt: string = "";
  protected ParentName_tr: string = "";
  protected ParentName_zhcn: string = "";
  protected ParentName_zhtw: string = "";

  constructor(data?: object) {
    super();
    if (data) {
      for (let i in data) {
        this[i] = data[i];
      }
    }
  }

  private UiPlayNameKey: string = "UiPlayName";
  public get UiPlayNameLang(): string {
    let value = this.getKeyValue(this.getLangKey(this.UiPlayNameKey));
    if (value) {
      return value;
    }
    return ""; //return this.getKeyValue(this.UiPlayNameKey);
  }

  private DescriptionKey: string = "Description";
  public get DescriptionLang(): string {
    let value = this.getKeyValue(this.getLangKey(this.DescriptionKey));
    if (value) {
      return value;
    }
    return ""; //return this.getKeyValue(this.DescriptionKey);
  }

  private ParentNameKey: string = "ParentName";
  public get ParentNameLang(): string {
    let value = this.getKeyValue(this.getLangKey(this.ParentNameKey));
    if (value) {
      return value;
    }
    return ""; //return this.getKeyValue(this.ParentNameKey);
  }
}
