import t_s_baseConfigData from "./t_s_baseConfigData";

/*
 * t_s_castlebattlebuilding
 */
export default class t_s_castlebattlebuilding {
  public mDataList: t_s_castlebattlebuildingData[];

  public constructor(list: object[]) {
    this.mDataList = [];
    for (let i in list) {
      this.mDataList.push(new t_s_castlebattlebuildingData(list[i]));
    }
  }
}

export class t_s_castlebattlebuildingData extends t_s_baseConfigData {
  //主键，对应building表的sontype
  public Id: number = 0;
  // 驻点占领积分
  public SingleOwnPoint: number = 0;
  // 建筑完全占领额外积分
  public CompleteOwnExtraPoint: string;
  //英雄战斗为1，英灵战斗为2
  public BattleType: number = 0;
  //激活buff判断目标：101士兵、102职业、201英灵类型，目标决定了判断值（士兵为等级和，职业为战力和，英灵为战力和）
  public BattleBuffCondition: number = 0;
  //参数，“|”为随机库分割，同样随机库建筑，相互之间随到的不能在同一库里
  public BattleBuffConditionParam: string;
  //攻击方需要攻打的前置建筑Id，可多个（满足其一即可），用逗号分割
  public AttackPreBattleBuilding: string;
  //防守方方需要攻打的前置建筑Id，可多个（满足其一即可），用逗号分割
  public DefendPreBattleBuilding: string;

  constructor(data?: object) {
    super();
    if (data) {
      for (let i in data) {
        this[i] = data[i];
      }
    }
  }
}
