import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_rewardtemplate
*/
export default class t_s_rewardtemplate {
        public mDataList: t_s_rewardtemplateData[];

        public constructor(list: Object[]) {
                this.mDataList = [];
                for (let i in list) {
                        this.mDataList.push(new t_s_rewardtemplateData(list[i]));
                }
        }
}

export class t_s_rewardtemplateData extends t_s_baseConfigData {
        //TemplateId(编号)
        public TemplateId: number;
        //Title(标题)
        protected Title: string;
        protected Title_en: string = "";
        protected Title_es: string = "";
        protected Title_fr: string = "";
        protected Title_pt: string = "";
        protected Title_tr: string = "";
        protected Title_zhcn: string = "";
        protected Title_zhtw: string = "";
        //Type(类型)
        public Type: number;
        //ShowType(显示类型)
        public ShowType: number;
        //StartDate(起始时间)
        public StartDate: string;
        //EndDate(结束时间)
        public EndDate: string;
        //Detail(详情)
        protected Detail: string;
        protected Detail_en: string = "";
        protected Detail_es: string = "";
        protected Detail_fr: string = "";
        protected Detail_pt: string = "";
        protected Detail_tr: string = "";
        protected Detail_zhcn: string = "";
        protected Detail_zhtw: string = "";
        //NeedFightId(指定副本)
        public NeedFightId: number;
        //NeedMinLevel(最小等级)
        public NeedMinLevel: number;
        //NeedMaxLevel(最大等级)
        public NeedMaxLevel: number;
        //IsLeague(公会状态)
        public IsLeague: number;
        //RewardPlayGP(奖励经验)
        public RewardPlayGP: number;
        //RewardGold(奖励黄金)
        public RewardGold: number;
        //RewardStrategy(奖励战魂)
        public RewardStrategy: number;
        //Rands(机率)
        public Rands: number;

        constructor(data?: Object) {
                super();
                if (data) {
                        for (let i in data) {
                                this[i] = data[i];
                        }
                }
        }

        private TitleKey: string = "Title";
        public get TitleLang(): string {
                let value = this.getKeyValue(this.getLangKey(this.TitleKey));
                if (value) {
                        return value;
                }
                return "";//return this.getKeyValue(this.TitleKey);
        }

        private DetailKey: string = "Detail";
        public get DetailLang(): string {
                let value = this.getKeyValue(this.getLangKey(this.DetailKey));
                if (value) {
                        return value;
                }
                return "";//return this.getKeyValue(this.DetailKey);
        }
}
