import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_outcityshop
*/
export default class t_s_outcityshop {
        public mDataList: t_s_outcityshopData[];

        public constructor(list: Object[]) {
                this.mDataList = [];
                for (let i in list) {
                        this.mDataList.push(new t_s_outcityshopData(list[i]));
                }
        }
}

export class t_s_outcityshopData extends t_s_baseConfigData {
        //MapShopId(编号)
        public MapShopId: number;
        //Type(1固定2刷新)
        public Type: number;
        //ItemId(物品)
        public ItemId: string;
        //Count(数量)
        public Count: string;
        //MinLevel(最小等级)
        public MinLevel: number;
        //MaxLevel(最大等级)
        public MaxLevel: number;
        //NeedTransJob(是否需转职)
        public NeedTransJob: number;
        //Random(几率)
        public Random: number;
        //IsDrop(精品标示)
        public IsDrop: number;
        //Sort(排序)
        public Sort: number;
        //Point(钻石)
        public Point: number;
        //Score(积分)
        public Score: number;
        //SecretStone(神秘石)
        public SecretStone: number;
        //Strategy(战魂)
        public Strategy: number;
        //Crystal(光晶)
        public Crystal: number;
        //NeedJob(职业)
        public NeedJob: number;
        //WeeklyLimit(-1为不限购)
        public WeeklyLimit: string;


        constructor(data?: Object) {
                super();
                if (data) {
                        for (let i in data) {
                                this[i] = data[i];
                        }
                }
        }
}
