import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_vippackage
*/
export default class t_s_vippackage {
        public mDataList: t_s_vippackageData[];

        public constructor(list: Object[]) {
                this.mDataList = [];
                for (let i in list) {
                        this.mDataList.push(new t_s_vippackageData(list[i]));
                }
        }
}

export class t_s_vippackageData extends t_s_baseConfigData {
        //Id(主键ID)
        public Id: number;
        //Grade（对应的VIP等级）
        public Grade: number;
        //Name（礼包名（自己看的））
        protected Name: string;
        protected Name_en: string = "";
        protected Name_es: string = "";
        protected Name_fr: string = "";
        protected Name_pt: string = "";
        protected Name_tr: string = "";
        protected Name_zhcn: string = "VIP1福利礼包";
        protected Name_zhtw: string = "";
        //Item（礼包道具）
        public Item: string;
        //OriginalPrice（礼包原价）
        public OriginalPrice: number;
        //Price（礼包价格）
        public Price: number;
        //PayQuality（礼包品质）（-1每日礼包, 0免费福利, 1付费）
        public PayQuality: number;

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
