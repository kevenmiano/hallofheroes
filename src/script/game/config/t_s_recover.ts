// @ts-nocheck
import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_recover
*/
export default class t_s_recover {
        public mDataList: t_s_recoverData[];

        public constructor(list: Object[]) {
                this.mDataList = [];
                for (let i in list) {
                        this.mDataList.push(new t_s_recoverData(list[i]));
                }
        }
}

export class t_s_recoverData extends t_s_baseConfigData {
        //TemplateId(模板ID)
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
        //MasterType(主类型)
        public MasterType: number;
        //SonType(子类型)
        public SonType: number;
        //OneDayMax(最大次数)
        public OneDayMax: number;
        //Max(最大天数)
        public Max: number;
        //Grade(等级)
        public Grade: number;
        //Gold(黄金)
        public Gold: number;
        //GoldPercent(黄金收益)
        public GoldPercent: number;
        //ItemCount(所需物品)
        public ItemCount: number;
        //ItemPercent(物品收益)
        public ItemPercent: number;
        //Order(排序)
        public Order: number;

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

}
