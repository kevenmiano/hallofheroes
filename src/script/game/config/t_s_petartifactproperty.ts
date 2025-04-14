import t_s_baseConfigData from "./t_s_baseConfigData";

/*
 * t_s_pettemplate
 */
export default class t_s_petartifactproperty {
  public mDataList: t_s_petartifactpropertyData[];
  public constructor(list: object[]) {
    this.mDataList = [];
    for (let i in list) {
      this.mDataList.push(new t_s_petartifactpropertyData(list[i]));
    }
  }
}

export class t_s_petartifactpropertyData extends t_s_baseConfigData {
  //道具模板ID(编号)
  public ItemId: number;
  public Level: number; //等级
  public MinAtk: number = 0; //最小物攻
  public MaxAtk: number = 0; //最大物攻
  public MinMat: number = 0; //最小魔攻
  public MaxMat: number = 0; //最大魔攻
  public MinDef: number = 0; //最小物防
  public MaxDef: number = 0; //最大物防
  public MinMdf: number = 0; //最小魔防
  public MaxMdf: number = 0; //最大魔防
  public MinHp: number = 0; //最小血量
  public MaxHp: number = 0; //最大血量
  public ActiveGold: number = 0; //鉴定消耗黄金
  public ReforgeDiamond: number = 0; //重铸需要消耗钻石
  public UpgradeRandom1: number = 0; //等级相同升级机率
  public UpgradeRandom2: number = 0; //等级不同升级机率
  public ReforgeObtainWeight: number = 0; //获得新神器权重

  constructor(data?: object) {
    super();
    if (data) {
      for (let i in data) {
        this[i] = data[i];
      }
    }
  }
}
