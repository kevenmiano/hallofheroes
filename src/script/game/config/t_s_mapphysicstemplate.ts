import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_mapphysicstemplate
*/
export default class t_s_mapphysicstemplate {
        public mDataList: t_s_mapphysicstemplateData[];

        public constructor(list: Object[]) {
                this.mDataList = [];
                for (let i in list) {
                        this.mDataList.push(new t_s_mapphysicstemplateData(list[i]));
                }
        }
}

export class t_s_mapphysicstemplateData extends t_s_baseConfigData {
        //TemplateId(编号)
        public TemplateId: number;
        //MapPhysicsTempName(名称)
        protected MapPhysicsTempName: string;
        protected MapPhysicsTempName_en: string = "";
        protected MapPhysicsTempName_es: string = "";
        protected MapPhysicsTempName_fr: string = "";
        protected MapPhysicsTempName_pt: string = "";
        protected MapPhysicsTempName_tr: string = "";
        protected MapPhysicsTempName_zhcn: string = "";
        protected MapPhysicsTempName_zhtw: string = "";
        //SonType(子类型)
        public SonType: number;
        //Grades( 等级)
        public Grades: number;
        //Heros(英雄)
        public Heros: string;
        //Soldiers(兵力)
        public Soldiers: string;
        //Property1(功能字段1)
        public Property1: number;
        //Property2(功能字段2)
        public Property2: number;
        //Property3(功能字段3)
        public Property3: number;
        //Property4(功能字段4)
        public Property4: number;
        //Property5(功能字段5)
        public Property5: number;
        //Property6(功能字段6)
        public Property6: number;
        //Description(描述)
        protected Description: string;
        protected Description_en: string = "";
        protected Description_es: string = "";
        protected Description_fr: string = "";
        protected Description_pt: string = "";
        protected Description_tr: string = "";
        protected Description_zhcn: string = "";
        protected Description_zhtw: string = "";
        //HeroGP(经验)
        public HeroGP: number;
        //MasterType(主类型)
        public MasterType: number;
        //RefreshTime(刷新时间)
        public RefreshTime: number;
        //BattleType(战斗类型)
        public BattleType: number;

        constructor(data?: Object) {
                super();
                if (data) {
                        for (let i in data) {
                                this[i] = data[i];
                        }
                }
        }

        private MapPhysicsTempNameKey: string = "MapPhysicsTempName";
        public get MapPhysicsTempNameLang(): string {
                let value = this.getKeyValue(this.getLangKey(this.MapPhysicsTempNameKey));
                if (value) {
                        return value;
                }
                return "";//return this.getKeyValue(this.MapPhysicsTempNameKey);
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
