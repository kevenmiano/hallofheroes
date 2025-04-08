import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_extrajob秘典表
*/
export default class t_s_extrajob {
    public mDataList: t_s_extrajobData[];
    public constructor(list: Object[]) {
        this.mDataList = [];
        for (let i in list) {
            this.mDataList.push(new t_s_extrajobData(list[i]));
        }
    }
}

export class t_s_extrajobData extends t_s_baseConfigData {
    public Id: number;//ID，索引用
    public CostGold: number;//升级消耗黄金
    public CostItemCount: number = 0;//升级消耗物品数量
    public CostItemId: number = 0;//升级消耗物品
    public JobLevel: number = 0;//等级，未激活时不存在，激活后等级为1，以下均为“升到此级的条件”（等级1的对应激活条件）
    public JobType: number = 0;//类型
    public NeedPlayerLevel: number = 0;//升级所需玩家等级
    public NeedTotalJobLevel: number = 0;//升级所需秘典总等级
    

    constructor(data?: Object) {
                super();
                if (data) {
                        for (let i in data) {
                                this[i] = data[i];
                        }
                }
        }
}
