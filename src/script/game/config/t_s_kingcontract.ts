import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_kingcontract
*/
export default class t_s_kingcontract {
        public mDataList: t_s_kingcontractData[];

        public constructor(list: Object[]) {
                this.mDataList = [];
                for (let i in list) {
                        this.mDataList.push(new t_s_kingcontractData(list[i]));
                }
        }
}

export class t_s_kingcontractData extends t_s_baseConfigData {
        //Id(编号)
        public Id: number;
        //Name(名字)
        protected Name: string;
        protected Name_en: string = "";
        protected Name_es: string = "";
        protected Name_fr: string = "";
        protected Name_pt: string = "";
        protected Name_tr: string = "";
        protected Name_zhcn: string = "";
        protected Name_zhtw: string = "";
        //Description(描述)
        protected Description: string;
        protected Description_en: string = "";
        protected Description_es: string = "";
        protected Description_fr: string = "";
        protected Description_pt: string = "";
        protected Description_tr: string = "";
        protected Description_zhcn: string = "";
        protected Description_zhtw: string = "";
        //Duration(有效时间)
        public Duration: number;
        //NeedPoint(购买钻石)
        public NeedPoint: number;
        //CanAdd(是否可叠加)
        public CanAdd: number;

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

        private DescriptionKey: string = "Description";
        public get DescriptionLang(): string {
                let value = this.getKeyValue(this.getLangKey(this.DescriptionKey));
                if (value) {
                        return value;
                }
                return "";//return this.getKeyValue(this.DescriptionKey);
        }

}
