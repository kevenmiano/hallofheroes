import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_consortialevel
*/
export default class t_s_consortialevel {
        public mDataList: t_s_consortialevelData[];

        public constructor(list: Object[]) {
                this.mDataList = [];
                for (let i in list) {
                        this.mDataList.push(new t_s_consortialevelData(list[i]));
                }
        }
}

export class t_s_consortialevelData extends t_s_baseConfigData {
        //TemplateId(编号)
        public TemplateId: number;
        //Types(类型)
        public Types: number;
        //Levels(等级)
        public Levels: number;
        //LevelName(名称)
        protected LevelName: string;
        protected LevelName_en: string = "";
        protected LevelName_es: string = "";
        protected LevelName_fr: string = "";
        protected LevelName_pt: string = "";
        protected LevelName_tr: string = "";
        protected LevelName_zhcn: string = "";
        protected LevelName_zhtw: string = "";
        //PreTemplateId(前置)
        public PreTemplateId: number;
        //NextTemplateId(后置)
        public NextTemplateId: number[];
        //NeedOffer(需要建设值)
        public NeedOffer: number;
        //CodeTime(冷却时间)
        public CodeTime: number;
        //Property1(对于祭坛代表每次祈福所需贡献, 对于公会技能代表所携带effectid)
        public Property1: number;
        //Property2(对于公会代表每周维护费, 对于祭坛代表每天最大祈福次数, 对于公会技能代表学习所需贡献)
        public Property2: number;
        //Property3(属性3)
        public Property3: number;
        //Icon(图标)
        public Icon: string;
        //Description(描述)
        protected Description: string;
        protected Description_en: string = "";
        protected Description_es: string = "";
        protected Description_fr: string = "";
        protected Description_pt: string = "";
        protected Description_tr: string = "";
        protected Description_zhcn: string = "";
        protected Description_zhtw: string = "";

        constructor(data?: Object) {
                super();
                if (data) {
                        for (let i in data) {
                                this[i] = data[i];
                        }
                }
        }

        private LevelNameKey: string = "LevelName";
        public get LevelNameLang(): string {
                let value = this.getKeyValue(this.getLangKey(this.LevelNameKey));
                if (value) {
                        return value;
                }
                return "";//return this.getKeyValue(this.LevelNameKey);
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
