import t_s_baseConfigData from "./t_s_baseConfigData";

/*
 * t_s_specialtemplate
 */
export default class t_s_specialtemplate {
  public mDataList: t_s_specialtemplateData[];

  public constructor(list: object[]) {
    this.mDataList = [];
    for (let i in list) {
      this.mDataList.push(new t_s_specialtemplateData(list[i]));
    }
  }
}

export class t_s_specialtemplateData extends t_s_baseConfigData {
  //TemplateId(编号)
  public TemplateId: number;
  //TemplateName(名称)
  protected TemplateName: string;
  protected TemplateName_en: string = "";
  protected TemplateName_es: string = "";
  protected TemplateName_fr: string = "";
  protected TemplateName_pt: string = "";
  protected TemplateName_tr: string = "";
  protected TemplateName_zhcn: string = "";
  protected TemplateName_zhtw: string = "";
  //MasterType(类型)
  public MasterType: number;
  //Grades(等级)
  public Grades: number;
  //CurProperty(原属性)
  public CurProperty: number;
  //TarProperty(目标属性)
  public TarProperty: number;
  //ChangeRandom(转换率)
  public ChangeRandom: number;
  //ChangeNumber(转换加成值)
  public ChangeNumber: number;
  //PawnMasterType(士兵类型)
  public PawnMasterType: number;
  //TakeRandom(机率)
  public TakeRandom: number;
  //ResPath(图标路径)
  public ResPath: string;
  //Description(描述)
  protected Description: string;
  protected Description_en: string = "";
  protected Description_es: string = "";
  protected Description_fr: string = "";
  protected Description_pt: string = "";
  protected Description_tr: string = "";
  protected Description_zhcn: string = "";
  protected Description_zhtw: string = "";

  constructor(data?: object) {
    super();
    if (data) {
      for (let i in data) {
        this[i] = data[i];
      }
    }
  }

  private TemplateNameKey: string = "TemplateName";
  public get TemplateNameLang(): string {
    let value = this.getKeyValue(this.getLangKey(this.TemplateNameKey));
    if (value) {
      return value;
    }
    return ""; //return this.getKeyValue(this.TemplateNameKey);
  }

  private DescriptionKey: string = "Description";
  public get DescriptionLang(): string {
    let value = this.getKeyValue(this.getLangKey(this.DescriptionKey));
    if (value) {
      return value;
    }
    return ""; //return this.getKeyValue(this.DescriptionKey);
  }
}
