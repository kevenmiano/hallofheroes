import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_questtemplate
*/
export default class t_s_questtemplate {
        public mDataList: t_s_questtemplateData[];

        public constructor(list: Object[]) {
                this.mDataList = [];
                for (let i in list) {
                        this.mDataList.push(new t_s_questtemplateData(list[i]));
                }
        }
}

export class t_s_questtemplateData extends t_s_baseConfigData {
        //TemplateId(编号)
        public TemplateId: number;
        //TemplateType(类型,0为成长任务, 1为日常任务, 2为活动任务)
        public TemplateType: number;
        //Title(标题)
        protected Title: string;
        protected Title_en: string = "";
        protected Title_es: string = "";
        protected Title_fr: string = "";
        protected Title_pt: string = "";
        protected Title_tr: string = "";
        protected Title_zhcn: string = "";
        protected Title_zhtw: string = "";
        //Detail(详情)
        protected Detail: string;
        protected Detail_en: string = "";
        protected Detail_es: string = "";
        protected Detail_fr: string = "";
        protected Detail_pt: string = "";
        protected Detail_tr: string = "";
        protected Detail_zhcn: string = "";
        protected Detail_zhtw: string = "";
        //RewardConsortiaOffer(奖励财富)
        public RewardConsortiaOffer: number;
        //RewardPlayerOffer(奖励贡献)
        public RewardPlayerOffer: number;
        //NeedMinLevel(最小等级)
        public NeedMinLevel: number;
        //NeedMaxLevel(最大等级)
        public NeedMaxLevel: number;
        //PreQuestId(前置任务)
        public PreQuestId: string;
        //IsAuto(是否自动接受)
        public IsAuto: number;
        //IsRepeat(是否可重复)
        public IsRepeat: number;
        //IsLeague(公会状态)
        public IsLeague: number;
        //IsLost(是否可放弃)
        public IsLost: number;
        //RepeatInterval(重复间隔)
        public RepeatInterval: number;
        //RepeatMax(重复次数)
        public RepeatMax: number;
        //RewardPlayGP(奖励声望)
        public RewardPlayGP: number;
        //RewardGold(奖励黄金)
        public RewardGold: number;
        //RewardStrategy(奖励战魂)
        public RewardStrategy: number;
        //RewardCrystal(奖励魔晶)
        public RewardCrystal: number;
        //RewardMoney(奖励点券)
        public RewardMoney: number;
        //RewardDower(奖励天赋)
        public RewardDower: string;
        //RewardHeroGP(奖励经验)
        public RewardHeroGP: number;
        //StartDate(起始时间)
        public StartDate: string;
        //EndDate(结束时间)
        public EndDate: string;
        //WeekSpace(星期设定)
        public WeekSpace: string;
        //HourSpace(小时设定)
        public HourSpace: string;
        //Objective(0在非外域显示, 1在外域显示, 2两边都显示)
        public Objective: string;
        //NeedFightId(指定副本)
        public NeedFightId: string;
        //NeedBuildingTemp(所需建筑)
        public NeedBuildingTemp: number;
        //NeedItemTemp(所需物品)
        public NeedItemTemp: number;
        //NeedPos(所需坐标)
        public NeedPos: string;
        //Sort(序号)
        public Sort: number;

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
