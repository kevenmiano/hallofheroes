import t_s_baseConfigData from "./t_s_baseConfigData";

/*
 * t_s_effecttemplate
 */
export default class t_s_effecttemplate {
  public mDataList: t_s_effecttemplateData[];

  public constructor(list: object[]) {
    this.mDataList = [];
    for (let i in list) {
      this.mDataList.push(new t_s_effecttemplateData(list[i]));
    }
  }
}

export class t_s_effecttemplateData extends t_s_baseConfigData {
  //TemplateId(编号)
  public TemplateId: number;
  //EffectName(名称)
  protected EffectName: string;
  protected EffectName_en: string = "";
  protected EffectName_es: string = "";
  protected EffectName_fr: string = "";
  protected EffectName_pt: string = "";
  protected EffectName_tr: string = "";
  protected EffectName_zhcn: string = "";
  protected EffectName_zhtw: string = "";
  //Description(描述)
  protected Description: string;
  protected Description_en: string = "";
  protected Description_es: string = "";
  protected Description_fr: string = "";
  protected Description_pt: string = "";
  protected Description_tr: string = "";
  protected Descriptio_zhtw: string = "";
  protected Description_zhcn: string = "";
  //Icon(图标路径)
  public Icon: string;
  //OwnTypes(1为科技（对应科技数据的property1）, 2为物品效果（对应物品的）, 3为公会科技, 4为婚礼拾取蛋糕香槟获得BUFF)
  public OwnTypes: number;
  //PropertyType1(效果类型, 具体参见见当前所配置数据)
  public PropertyType1: number;
  //Property1(效果基础值, 实际值需要乘以效果等级)
  public Property1: number;
  //Camp(阵营)
  public Camp: number;
  //MaxGrade(最大等级)
  public MaxGrade: number;
  //PlayerGrade(领主级别)
  public PlayerGrade: number;
  //PreBuildingtemplateId(前置建筑)
  public PreBuildingtemplateId: number;
  //PreTemplateId(前置天赋)
  public PreTemplateId: number;
  //UseType(效果类型（加成/开关） )
  public UseType: number;
  //PropertyType2(效果2编号)
  public PropertyType2: number;
  //Property2(效果2数值)
  public Property2: number;
  //PropertyType3(效果3编号)
  public PropertyType3: number;
  //Property3(效果3数值)
  public Property3: number;

  constructor(data?: object) {
    super();
    if (data) {
      for (let i in data) {
        this[i] = data[i];
      }
    }
  }

  private EffectNameKey: string = "EffectName";
  public get EffectNameLang(): string {
    let value = this.getKeyValue(this.getLangKey(this.EffectNameKey));
    if (value) {
      return value;
    }
    return ""; //return this.getKeyValue(this.EffectNameKey);
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
