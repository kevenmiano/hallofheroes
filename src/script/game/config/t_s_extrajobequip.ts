import t_s_baseConfigData from "./t_s_baseConfigData";

/*
 * t_s_extrajobequip——魂器进阶表
 */
export default class t_s_extrajobequip {
  public mDataList: t_s_extrajobequipData[];
  public constructor(list: object[]) {
    this.mDataList = [];
    for (let i in list) {
      this.mDataList.push(new t_s_extrajobequipData(list[i]));
    }
  }
}

export class t_s_extrajobequipData extends t_s_baseConfigData {
  public Id: number; //ID，索引用
  public EquipLevel: number = 0; //阶数，未激活时不存在，激活后等级为1，以下均为“此阶的属性”及“升到此阶的条件”（阶数1的对应激活条件）
  public EquipType: number = 0; //类型（对应编号1~6，右上开始顺时针）

  public CostGold: number = 0; //进阶消耗黄金
  public CostItemCount: number = 0; //进阶消耗物品数量
  public CostItemId: number = 0; //进阶消耗物品

  public Attack: number; //物攻
  public Defence: number = 0; //物防
  public Live: number = 0; //生命
  public MagicAttack: number = 0; //魔攻
  public MagicDefence: number = 0; //魔防
  public NeedTotalJobLevel: number = 0; //进阶所需秘典总等级

  public strenLevel: number = 0; //强化等级

  constructor(data?: object) {
    super();
    if (data) {
      for (let i in data) {
        this[i] = data[i];
      }
    }
  }
}
