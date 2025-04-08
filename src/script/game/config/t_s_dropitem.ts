import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_dropitem
*/
export default class t_s_dropitem {
        public mDataList: t_s_dropitemData[];

        public constructor(list: Object[]) {
                this.mDataList = [];
                for (let i in list) {
                        this.mDataList.push(new t_s_dropitemData(list[i]));
                }
        }
}

export class t_s_dropitemData extends t_s_baseConfigData {
        //Id(编号)
        public Id: number;
        //DropId(掉落ID)
        public DropId: number;
        //ValidDate(有效分钟)
        public ValidDate: number;
        //ItemId(物品)
        public ItemId: number;
        //Data(数量)
        public Data: number;
        //IsNewItems(IsNewItems(新物品))
        public IsNewItems: number;
        //IsShow(IsShow(展示))
        public IsShow: number;
        //AppearType(出现类型, 1为必掉, 2为概率随机, 3为单独概率, 几率为数值 除以100万, 4为求和随机)
        public AppearType: number;
        //Random(机率)
        public Random: number;
        //IsBind(绑定类型, 0为不绑定, 1为绑定)
        public IsBind: number;
        //IsTips(是否全服公告, 0为不公告, 1为公告)
        public IsTips: number;
        //IsLogs(记录)
        public IsLogs: number;

        constructor(data?: Object) {
                super();
                if (data) {
                        for (let i in data) {
                                this[i] = data[i];
                        }
                }
        }
}
