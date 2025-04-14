import t_s_baseConfigData from "./t_s_baseConfigData";

/*
 * t_s_vehicleskilltemplate
 */
export default class t_s_vehicleskilltemplate {
  public mDataList: t_s_vehicleskilltemplateData[];

  public constructor(list: object[]) {
    this.mDataList = [];
    for (let i in list) {
      this.mDataList.push(new t_s_vehicleskilltemplateData(list[i]));
    }
  }
}

export class t_s_vehicleskilltemplateData extends t_s_baseConfigData {
  //Id(模板编号)
  public Id: number;
  //Name(技能名称)
  public Name: string;
  //Description(技能描述)
  public Description: string;
  //Icons(图标)
  public Icons: string;
  //SonType(子类型)
  public SonType: number;
  //ActionId(技能释放光效)
  public ActionId: number;
  //CastTime(释放时间(毫秒))
  public CastTime: number;
  //CoolDown(冷却时间(毫秒))
  public CoolDown: number;
  //Power(技能威力)
  public Power: number;
  //Power2(技能威力2)
  public Power2: number;
  //Buffs(附加buff)
  public Buffs: number[];
  //AttackRange(攻击距离(格子数))
  public AttackRange: number;
  //DamageCoverage(伤害范围(单位:圆半径))
  public DamageCoverage: number;
  //Maximum(最大使用次数)
  public Maximum: number;
  //InjuryEffect(伤害效果(0:单体1:范围))
  public InjuryEffect: number;
  //IFF(敌我识别(1 - 敌方  2 - 友军))
  public IFF: number;

  constructor(data?: object) {
    super();
    if (data) {
      for (let i in data) {
        this[i] = data[i];
      }
    }
  }
}
