import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_extrajobequipstrengthen——魂器强化表，强化不区分部位，只区分强化等级
*/
export default class t_s_extrajobequipstrengthen {
    public mDataList: t_s_extrajobequipstrengthenData[];
    public constructor(list: Object[]) {
        this.mDataList = [];
        for (let i in list) {
            this.mDataList.push(new t_s_extrajobequipstrengthenData(list[i]));
        }
    }
}

export class t_s_extrajobequipstrengthenData extends t_s_baseConfigData {
    public Id: number;//ID，索引用
    public CostGold: number;//升级消耗黄金
    public CostItemCount: number = 0;//升级消耗物品数量
    public CostItemId: number = 0;//升级消耗物品
    public NeedEquipLevel: number = 0;//强化所需魂器阶数
    public ExtraPropertyPercent: number = 0;//额外属性加成百分比
    public StrengthenLevel: number = 0;//强化等级（以下均为强化到此级的条件）
    

    constructor(data?: Object) {
                super();
                if (data) {
                        for (let i in data) {
                                this[i] = data[i];
                        }
                }
        }
}
