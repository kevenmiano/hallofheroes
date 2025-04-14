import t_s_baseConfigData from "./t_s_baseConfigData";

/*
 * t_s_petequipattr 英灵装备部位属性表
 */
export default class t_s_petequipattr {
  public mDataList: t_s_petequipattrData[];

  public constructor(list: object[]) {
    this.mDataList = [];
    for (let i in list) {
      this.mDataList.push(new t_s_petequipattrData(list[i]));
    }
  }
}

export class t_s_petequipattrData extends t_s_baseConfigData {
  //唯一Id
  public TemplateId: number = 0;
  //属性类型)
  public StarAttrType: number = 0;
  //星级池Id)
  public StarRandomId: number = 0;
  //属性Id
  public AttributeId: number = 0;
  //装备部位1
  public Part1: number = 0;
  //装备部位1权重)
  public Random1: number = 0;
  public Part2: number = 0;
  public Random2: number = 0;
  public Part3: number = 0;
  public Random3: number = 0;
  public Part4: number = 0;
  public Random4: number = 0;
  public Part5: number = 0;
  public Random5: number = 0;
  public Part6: number = 0;
  public Random6: number = 0;
  //(初始属性值范围)
  public BaseValue: number = 0;
  //强化增幅
  public StrengthenGrow: number = 0;

  constructor(data?: object) {
    super();
    if (data) {
      for (let i in data) {
        this[i] = data[i];
      }
    }
  }
}
