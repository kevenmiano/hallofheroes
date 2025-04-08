import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_runetemplate
*/
export default class t_s_runetemplate {
        public mDataList: t_s_runetemplateData[];

        public constructor(list: Object[]) {
                this.mDataList = [];
                for (let i in list) {
                        this.mDataList.push(new t_s_runetemplateData(list[i]));
                }
        }
}

export class t_s_runetemplateData extends t_s_baseConfigData {
        //TemplateId(符文ID)
        public TemplateId: number;
        //RuneType(类型)
        public RuneType: number;
        //SonType(子类型)
        public SonType: number;
        //Job(职业)
        public Job: number[];
        //RuneGrade(等级)
        public RuneGrade: number;
        //RuneIndex(位置)
        public RuneIndex: number;
        //Icon(图标)
        public Icon: string;
        //SkillTemplateId(技能)
        public SkillTemplateId: number;
        //NextRuneId(下一级符文ID)
        public NextRuneId: number;
        //NeedGp(升级所需经验)
        public NeedGp: number;
        //UseCount(使用次数)
        public UseCount: number;
        //NeedGrade(所需玩家等级)
        public NeedGrade: number;
        //Description(描述)
        protected Description: string;
        protected Description_en: string = "";
        protected Description_es: string = "";
        protected Description_fr: string = "";
        protected Description_pt: string = "";
        protected Description_tr: string = "";
        protected Description_zhcn: string = "";
        protected Description_zhtw: string = "";
        //TemplateName(名称)
        protected TemplateName: string;
        protected TemplateName_en: string = "";
        protected TemplateName_es: string = "";
        protected TemplateName_fr: string = "";
        protected TemplateName_pt: string = "";
        protected TemplateName_tr: string = "";
        protected TemplateName_zhcn: string = "";
        protected TemplateName_zhtw: string = "";

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
                let value = this.getKeyValue(this.getLangKey(this.TemplateNameKey));
                if (value) {
                        return value;
                }
                return "";//return this.getKeyValue(this.TemplateNameKey);
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
