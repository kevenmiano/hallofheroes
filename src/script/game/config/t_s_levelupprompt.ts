import t_s_baseConfigData from "./t_s_baseConfigData";

/*
 * t_s_levelupprompt
 */
export default class t_s_levelupprompt {
  public mDataList: t_s_leveluppromptData[];

  public constructor(
    list: {
      grade: number;
      item: object[];
    }[],
  ) {
    this.mDataList = [];
    for (let i in list) {
      this.mDataList.push(new t_s_leveluppromptData(list[i]));
    }
  }
}

//升级
export class t_s_leveluppromptData {
  //等级
  public grade: number = 0;
  //列表
  public item: levelUpPram[] = [];

  public constructor(data: { grade: number; item: object[] }) {
    this.item = [];

    this.grade = Number(data.grade);

    let list = data.item;
    for (let i in list) {
      this.item.push(new levelUpPram(list[i]));
    }
  }
}

//升级配置属性
export class levelUpPram extends t_s_baseConfigData {
  //类型
  public type: number = 0;
  //名称
  protected name: string = "";
  //url
  public url: string = "";
  //提示文字
  protected tip: string = "";
  //预览图片URL
  public previewUrl: string = "";

  public constructor(data: object) {
    super();
    for (let i in data) {
      this[i] = data[i];
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

  private tipKey: string = "tip";
  public get tipLang(): string {
    let value = this.getKeyValue(this.getLangKey(this.tipKey));
    if (value) {
      return value;
    }
    return ""; //return this.getKeyValue(this.tipKey);
  }
}
