import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_pvptimerinfo
*/
export default class t_s_pvptimerinfo {
        public mDataList: t_s_pvptimerinfoData[];

        public constructor(list: Object[]) {
                this.mDataList = [];
                for (let i in list) {
                        this.mDataList.push(new t_s_pvptimerinfoData(list[i]));
                }
        }
}

export class t_s_pvptimerinfoData extends t_s_baseConfigData {
        //Id(编号)
        public Id: number;
        //Type(1: 钢铁之战, 2: 泰坦之战, 3: 混沌之战, 4: 众神之战)
        public Type: number;
        //Name(名称)
        protected Name: string;
        protected Name_en: string = "";
        protected Name_es: string = "";
        protected Name_fr: string = "";
        protected Name_pt: string = "";
        protected Name_tr: string = "";
        protected Name_zhcn: string = "";
        protected Name_zhtw: string = "";
        //Index(届数)
        public Index: number;
        //ReadyOpenDate(预赛开始时间)
        public ReadyOpenDate: string;
        //ReadyStopDate(预赛结束时间)
        public ReadyStopDate: string;
        //FinalOpenDate(决赛开始时间)
        public FinalOpenDate: string;
        //FinalStopDate(决赛结束时间)
        public FinalStopDate: string;
        //BetOrder(竞猜名次)
        public BetOrder: number;

        constructor(data?: Object) {
                super();
                if (data) {
                        for (let i in data) {
                                this[i] = data[i];
                        }
                }
        }

        private NameKey: string = "Name";
        public get NameLang(): string {
                let value = this.getKeyValue(this.getLangKey(this.NameKey));
                if (value) {
                        return value;
                }
                return "";//return this.getKeyValue(this.NameKey);
        }
}
