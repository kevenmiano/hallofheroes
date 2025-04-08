// @ts-nocheck
import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_question
*/
export default class t_s_question {
        public mDataList: t_s_questionData[];

        public constructor(list: Object[]) {
                this.mDataList = [];
                for (let i in list) {
                        this.mDataList.push(new t_s_questionData(list[i]));
                }
        }
}

export class t_s_questionData extends t_s_baseConfigData {
        //Id(主键ID)
        public Id: number;
        //Type(题目类型)
        public Type: number;
        //Subject(题目)
        protected Subject: string;
        protected Subject_en: string = "";
        protected Subject_es: string = "";
        protected Subject_fr: string = "";
        protected Subject_pt: string = "";
        protected Subject_tr: string = "";
        protected Subject_zhcn: string = "";
        protected Subject_zhtw: string = "";
        //Options(选项)
        protected Options: string;
        protected Options_en: string = "";
        protected Options_es: string = "";
        protected Options_fr: string = "";
        protected Options_pt: string = "";
        protected Options_tr: string = "";
        protected Options_zhcn: string = "";
        protected Options_zhtw: string = "";
        //MaxChoose(最大可选择选项数)
        public MaxChoose: number;

        constructor(data?: Object) {
                super();
                if (data) {
                        for (let i in data) {
                                this[i] = data[i];
                        }
                }
        }

        private SubjectKey: string = "Subject";
        public get SubjectLang(): string {
                let value = this.getKeyValue(this.getLangKey(this.SubjectKey));
                if (value) {
                        return value;
                }
                return "";//return this.getKeyValue(this.SubjectKey);
        }

        private OptionsKey: string = "Options";
        public get OptionsLang(): string {
                let value = this.getKeyValue(this.getLangKey(this.OptionsKey));
                if (value) {
                        return value;
                }
                return "";//return this.getKeyValue(this.OptionsKey);
        }
}
