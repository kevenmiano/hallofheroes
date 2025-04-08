import StringHelper from "../../core/utils/StringHelper";
import { VIPManager } from "../manager/VIPManager";
import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_leedtemplate
*/
export default class t_s_leedtemplate {
        public mDataList: t_s_leedtemplateData[];

        public constructor(list: Object[]) {
                this.mDataList = [];
                for (let i in list) {
                        this.mDataList.push(new t_s_leedtemplateData(list[i]));
                }
        }
}

export class t_s_leedtemplateData extends t_s_baseConfigData {
        //TemplateId(编号, 用于程序识别)
        public TemplateId: number;
        //Title(名称)
        protected Title: string;
        protected Title_en: string = "";
        protected Title_es: string = "";
        protected Title_fr: string = "";
        protected Title_pt: string = "";
        protected Title_tr: string = "";
        protected Title_zhcn: string = "";
        protected Title_zhtw: string = "";
        public Detail_zhcn: string = "";
        protected Detail_zhtw: string = "";
        protected Detail_en: string = "";
        protected Detail_es: string = "";
        protected Detail_pt: string = "";
        protected Detail_tr: string = "";
        protected Detail_fr: string = "";
        protected Detail_de: string = "";
        //PassCount(次数)
        public PassCount: number;
        //Num(分数)
        public Num: number;
        //Level（大于等于该等级）
        public Level: number;
        //Time（时间）
        public Time: string;
        //sort(排序)
        public sort: number;
        
        public Type: number;
        
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

        public get Detail(): string {
                var descript: string;
                descript = StringHelper.replaceStr(this.DetailLang, "{PassCount}", String(this.PassCount));
                return descript;
        }
}
