import { GoodsInfo } from "../datas/goods/GoodsInfo";
import t_s_baseConfigData from "./t_s_baseConfigData";

/*
 * t_s_suitetemplate
 */
export default class t_s_suitetemplate {
  public mDataList: t_s_suitetemplateData[];

  public constructor(list: object[]) {
    this.mDataList = [];
    for (let i in list) {
      this.mDataList.push(new t_s_suitetemplateData(list[i]));
    }
  }
}

export class t_s_suitetemplateData extends t_s_baseConfigData {
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
  //Template1(装备1)
  public Template1: number;
  //Template2(装备2)
  public Template2: number;
  //Template3(装备3)
  public Template3: number;
  //Template4(装备4)
  public Template4: number;
  //Template5(装备5)
  public Template5: number;
  //Template6(装备6)
  public Template6: number;
  //Template7(装备7)
  public Template7: number;
  //Template8(装备8)
  public Template8: number;
  //Property1(1件技能)
  public Property1: number;
  //Property2(2件技能)
  public Property2: number;
  //Property3(3件技能)
  public Property3: number;
  //Property4(4件技能)
  public Property4: number;
  //Property5(5件技能)
  public Property5: number;
  //Property6(6件技能)
  public Property6: number;
  //Property7(7件技能)
  public Property7: number;
  //Property8(8件技能)
  public Property8: number;
  //Template1S(装备1s)
  public Template1S: number;
  //Template2S(装备2S)
  public Template2S: number;
  //Template3S(装备3S)
  public Template3S: number;
  //Template4S(装备4S)
  public Template4S: number;
  //Template5S(装备5S)
  public Template5S: number;
  //Template6S(装备6S)
  public Template6S: number;
  //Template7S(装备7S)
  public Template7S: number;
  //Template8S(装备8S)
  public Template8S: number;

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

  public SuiteTempInfo() {}

  public get suitCount(): number {
    let count: number = 0;
    for (let i: number = 1; i <= 8; i++) {
      if (this["Template" + i] != 0 || this["Template" + i + "S"] != 0) count++;
    }
    return count;
  }

  public existCount(list: GoodsInfo[]): number {
    let arr: number[] = [];
    if (!list) return 0;
    for (let i = 0, len = list.length; i < len; i++) {
      const info = list[i];
      arr.push(info.templateId);
    }
    let count: number = 0;
    for (let i: number = 1; i <= 8; i++) {
      if (
        arr.indexOf(this["Template" + i]) >= 0 ||
        arr.indexOf(this["Template" + i + "S"]) >= 0
      ) {
        count++;
      }
    }
    return count;
  }
}
