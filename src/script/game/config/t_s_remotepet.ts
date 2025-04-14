import t_s_baseConfigData from "./t_s_baseConfigData";

/*
 * t_s_remotepettemplate
 */
export default class t_s_remotepet {
  public mDataList: t_s_remotepettemplateData[];

  public constructor(list: object[]) {
    this.mDataList = [];
    for (let i in list) {
      this.mDataList.push(new t_s_remotepettemplateData(list[i]));
    }
  }
}

export class t_s_remotepettemplateData extends t_s_baseConfigData {
  public IndexID: number;

  public Type: number;

  public SweepIndex: number;

  public Icon: string;

  public Icon2: string;

  protected Name: string;
  protected Name_en: string = "";
  protected Name_es: string = "";
  protected Name_fr: string = "";
  protected Name_pt: string = "";
  protected Name_tr: string = "";
  protected Name_zhcn: string = "";
  protected Name_zhtw: string = "";

  public Fight: number;

  public Property: number;

  public Skill: number;

  public FirstDropItems: string;

  public DropItems: string;

  public Count: number;

  public Sweep: number;

  constructor(data?: object) {
    super();
    if (data) {
      for (let i in data) {
        this[i] = data[i];
      }
    }
  }

  public get Index() {
    return this.Count;
  }

  public set Index(v: number) {}

  private NameKey: string = "Name";
  public get NameLang(): string {
    let value = this.getKeyValue(this.getLangKey(this.NameKey));
    if (value) {
      return value;
    }
    return ""; //return this.getKeyValue(this.NameKey);
  }
}
