import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_campaignbuffer
*/
export default class t_s_campaignbuffer {
        public mDataList: t_s_campaignbufferData[];

        public constructor(list: Object[]) {
                this.mDataList = [];
                for (let i in list) {
                        this.mDataList.push(new t_s_campaignbufferData(list[i]));
                }
        }
}

export class t_s_campaignbufferData extends t_s_baseConfigData {
        //TemplateId(ID)
        public TemplateId: number;
        //TemplateName(名称)
        protected TemplateName: string;
        protected TemplateName_en: string = "";
        protected TemplateName_es: string = "";
        protected TemplateName_fr: string = "";
        protected TemplateName_pt: string = "";
        protected TemplateName_tr: string = "";
        protected TemplateName_zhcn: string = "";
        protected TemplateName_zhtw: string = "";
        //Description(描述)
        protected Description: string;
        protected Description_en: string = "";
        protected Description_es: string = "";
        protected Description_fr: string = "";
        protected Description_pt: string = "";
        protected Description_tr: string = "";
        protected Description_zhcn: string = "";
        protected Description_zhtw: string = "";
        //Crit(暴击)
        public Crit: number;
        //Block(格挡)
        public Block: number;
        //Icon(图标)
        public Icon: string;
        //Types(类型)
        public Types: number;
        //Grades(等级)
        public Grades: number;
        //DataType(加成类型, 0为数值, 1为百分比)
        public DataType: number;
        //Attack(物攻加成, 分正负)
        public Attack: number;
        //Defence(物防加成, 分正负)
        public Defence: number;
        //MagicAttack(魔攻加成, 分正负)
        public MagicAttack: number;
        //MagicDefence(魔防加成, 分正负)
        public MagicDefence: number;
        //Live(生命加成, 分正负)
        public Live: number;
        //LeadPawn(带兵加成, 分正负)
        public LeadPawn: number;
        //Angry(怒气加成, 分正负)
        public Angry: number;

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
