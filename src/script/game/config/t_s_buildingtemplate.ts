import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_buildingtemplate
*/
export default class t_s_buildingtemplate {
        public mDataList: t_s_buildingtemplateData[];

        public constructor(list: Object[]) {
                this.mDataList = [];
                for (let i in list) {
                        this.mDataList.push(new t_s_buildingtemplateData(list[i]));
                }
        }
}

export class t_s_buildingtemplateData extends t_s_baseConfigData {
        //TemplateId(编号)
        public TemplateId: number;
        //MasterType(主类型)
        public MasterType: number;
        //SonType(子类型)
        public SonType: number;
        //BuildingGrade(建筑等级)
        public BuildingGrade: number;
        //BuildingName(建筑名称)
        protected BuildingName: string = "";
        protected BuildingName_en: string = "";
        protected BuildingName_es: string = "";
        protected BuildingName_fr: string = "";
        protected BuildingName_pt: string = "";
        protected BuildingName_tr: string = "";
        protected BuildingName_zhcn: string = "";
        protected BuildingName_zhtw: string = "";
        //Activity(功能)
        protected Activity: string;
        protected Activity_en: string = "";
        protected Activity_es: string = "";
        protected Activity_fr: string = "";
        protected Activity_pt: string = "";
        protected Activity_tr: string = "";
        protected Activity_zhcn: string = "";
        protected Activity_zhtw: string = "";
        //PlayerGrades(需要领主等级)
        public PlayerGrades: number;
        //PreTemplateId(前置建筑)
        public PreTemplateId: number;
        //NextGradeTemplateId(下一等级建筑)
        public NextGradeTemplateId: number;
        //NextTemplateId(后继建筑)
        public NextTemplateId: number;
        //UpgradeTime(升级时间)
        public UpgradeTime: number;
        //GoldConsume(消耗黄金)
        public GoldConsume: number;
        //CrystalsConsume(消耗光晶)
        public CrystalsConsume: number;
        //Property1(功能字段1)
        public Property1: number;
        //Property2(功能字段2)
        public Property2: number;
        //PosX(建筑资源X坐标)
        public PosX: number;
        //PosY(建筑资源Y坐标)
        public PosY: number;
        //TitleX(建筑名字X坐标)
        public TitleX: number;
        //TitleY(建筑名字Y坐标)
        public TitleY: number;
        //Icon(图标路径)
        public Icon: string;
        //PicPath(图片路径)
        public PicPath: string;
        //Property3(功能字段3)
        public Property3: number;
        //Property4(功能字段4)
        public Property4: number;
        //Property5(功能字段5)
        public Property5: number;
        //Property6(功能字段6)
        public Property6: number;
        //Camp(阵营(Camp))
        public Camp: number;
        //Reputation(声望)
        public Reputation: number;
        //Description(描述)
        public Description: string;

        public view: any = null;
        public effect: any = null;

        constructor(data?: Object) {
                super();
                if (data) {
                        for (let i in data) {
                                this[i] = data[i];
                        }
                }
        }

        private BuildingNameKey: string = "BuildingName";
        public get BuildingNameLang(): string {
                let value = this.getKeyValue(this.getLangKey(this.BuildingNameKey));
                if (value) {
                        return value;
                }
                return "";//return this.getKeyValue(this.BuildingNameKey);
        }

        private ActivityKey: string = "Activity";
        public get ActivityLang(): string {
                let value = this.getKeyValue(this.getLangKey(this.ActivityKey));
                if (value) {
                        return value;
                }
                return "";//return this.getKeyValue(this.ActivityKey);
        }

}
