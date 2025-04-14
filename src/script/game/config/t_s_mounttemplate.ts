import t_s_baseConfigData from "./t_s_baseConfigData";

/*
 * t_s_mounttemplate
 */
export default class t_s_mounttemplate {
  public mDataList: t_s_mounttemplateData[];

  public constructor(list: object[]) {
    this.mDataList = [];
    for (let i in list) {
      this.mDataList.push(new t_s_mounttemplateData(list[i]));
    }
  }
}

export class t_s_mounttemplateData extends t_s_baseConfigData {
  //激活展示
  public Activation: number;
  //TemplateId(ID)
  public TemplateId: number;
  //TemplateName(名字)
  protected TemplateName: string;
  protected TemplateName_en: string = "";
  protected TemplateName_es: string = "";
  protected TemplateName_fr: string = "";
  protected TemplateName_pt: string = "";
  protected TemplateName_tr: string = "";
  protected TemplateName_zhcn: string = "";
  protected TemplateName_zhtw: string = "";
  //Description(描述)
  protected Description: string;
  protected Description_en: string = "";
  protected Description_es: string = "";
  protected Description_fr: string = "";
  protected Description_pt: string = "";
  protected Description_tr: string = "";
  protected Description_zhcn: string = "";
  protected Description_zhtw: string = "";
  //NeedItemId(激活物品)
  public NeedItemId: number;
  //Property1(激活钻石)
  public Property1: number;
  //Property2(属性2)
  public Property2: number;
  //MountType(类型,0普通,1魔幻,2温顺,3猛兽,4科技,10VIP)
  public MountType: number;
  //NeedMountGrade(需要坐骑等级)
  public NeedMountGrade: number;
  //Speed(速度)
  public Speed: number;
  //SoulScore(兽魂积分)
  public SoulScore: number;
  //Sort(排序)
  public Sort: number;
  //AvatarPath(资源路径)
  public AvatarPath: string;
  //Power(力量)
  public Power: number;
  //Intellect(智力)
  public Intellect: number;
  //Physique(体质)
  public Physique: number;
  //Agility(护甲)
  public Agility: number;
  //ExpandLevel(等级上限)
  public ExpandLevel: number;
  //StarItem（升星道具）
  public StarItem: number;
  //StarSoulScore（升星兽魂值加成）
  public StarSoulScore: number;
  //StarPower（升星属性加成）
  public StarPower: number;
  //1: 站立坐骑；0: 非站立坐骑
  public IsStand: number = 0;
  //坐骑炼化时, 每次所需要消耗的道具数量；
  public StarItemNum: number = 0;
  public Limited: number = 0;
  /**
   * 众神之战奖品, 同一坐骑有不同的有效期
   */
  public validity: number = 0;

  constructor(data?: object) {
    super();
    if (data) {
      for (let i in data) {
        this[i] = data[i];
      }
    }
  }

  // TODO高版本坐骑
  public get useStandPose(): boolean {
    var flag: boolean = false;
    if (this.IsStand == 1) {
      flag = true;
    }
    return flag;
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
