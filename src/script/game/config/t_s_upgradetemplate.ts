import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_upgradetemplate
*/
export default class t_s_upgradetemplate {
        public mDataList: t_s_upgradetemplateData[];

        public constructor(list: Object[]) {
                this.mDataList = [];
                for (let i in list) {
                        this.mDataList.push(new t_s_upgradetemplateData(list[i]));
                }
        }
}

export class t_s_upgradetemplateData extends t_s_baseConfigData {
        //Id(编号)
        public Id: number;
        //Types(类型)
        public Types: number;
        //TemplateId(模板ID)
        public TemplateId: number;
        //Grades(等级)
        public Grades: number;
        //Data(经验值)
        public Data: number;
        //TemplateName(名字)
        protected TemplateName: string;
        protected TemplateName_en: string = "";
        protected TemplateName_es: string = "";
        protected TemplateName_fr: string = "";
        protected TemplateName_pt: string = "";
        protected TemplateName_tr: string = "";
        protected TemplateName_zhcn: string = "";
        protected TemplateName_zhtw: string = "";
        //ActiveObject(作用)
        public ActiveObject: number;

        constructor(data?: Object) {
                super();
                if (data) {
                        for (let i in data) {
                                this[i] = data[i];
                        }
                }
        }

        private TemplateNameKey: string = "TemplateName";
        public get TemplateNameLang(): string {
                return this.getKeyValue(this.TemplateNameKey);
        }
}
