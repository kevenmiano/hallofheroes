// @ts-nocheck
import t_s_baseConfigData from "./t_s_baseConfigData";


export default class t_s_wishingpool {
    public mDataList: t_s_wishingpoolData[];

    public constructor(list: Object[]) {
            this.mDataList = [];
            for (let i in list) {
                    this.mDataList.push(new t_s_wishingpoolData(list[i]));
            }
    }
}

export class t_s_wishingpoolData extends t_s_baseConfigData {
    //id(编号)许愿池ID
    public Id: number;
    //name(名称)许愿池对应的名字
    protected Name: string;
    protected Name_en: string = "";
    protected Name_es: string = "";
    protected Name_fr: string = "";
    protected Name_pt: string = "";
    protected Name_tr: string = "";
    protected Name_zhcn: string = "";
    protected Name_zhtw: string = "";
    //Type(类型)1为时装, 2为坐骑, 不同类型的许愿池显示与随机的规则会不同
    public Type: number;
    //单次许愿需要消耗道具的ID
    public CostItemId: number;
    //单次许愿消耗道具的数量
    public CostItemNum: number;
    //道具不足时, 替代1个道具需要的钻石（不支持用绑钻）, 为0代表不能用钻石替代
    public UnitPrice: number;
    //每周限购次数, 周一早5点重置
    public WeeklyLimit: number;
    //触发高级许愿的许愿次数 如为5, 则代表5次许愿之后会触发高级许愿, 高级许愿之后次数清零（高级许愿本身不会计算次数）
    public MaxLuckValue:number;
    //许愿概率, 格式为“X,概率X|X,概率X|X,概率X|X,概率X
    public Rare1:string;
    //许愿概率, 格式为“X,概率X|X,概率X|X,概率X|X,概率X
    public Rare2:string;
    //触发高级许愿时的Rare1
    public LuckRare1:string;
    //触发高级许愿时的Rare2
    public LuckRare2:string;
    //随到上限值时是否需要全服公告
    public IsLog:number;
    constructor(data?: Object) {
            super();
            if (data) {
                    for (let i in data) {
                            this[i] = data[i];
                    }
            }
    }

    private nameKey: string = "Name";
    public get nameLang(): string {
            let value = this.getKeyValue(this.getLangKey(this.nameKey));
            if (value) {
                    return value;
            }
            return "";//return this.getKeyValue(this.nameKey);
    }

}