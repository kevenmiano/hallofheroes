import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_powcardsuitetemplate
*/
export default class t_s_powcardsuitetemplate {
        public mDataList: t_s_powcardsuitetemplateData[];

        public constructor(list: Object[]) {
                this.mDataList = [];
                for (let i in list) {
                        this.mDataList.push(new t_s_powcardsuitetemplateData(list[i]));
                }
        }
}

export class t_s_powcardsuitetemplateData extends t_s_baseConfigData {
        //TemplateId(模板编号)
        public TemplateId: number;
        //TemplateName(名称)
        public TemplateName: string;
        //MasterType(主类型)
        public MasterType: number;
        //SonType(子类型)
        public SonType: number;
        //Template1(装备1)
        public Template1: number;
        //Template2(装备2)
        public Template2: number;
        //Template3(装备3)
        public Template3: number;
        //Template4(装备4)
        public Template4: number;
        //Template5(装备5)
        public Template5: number;
        //camptype(作用副本类型)
        public camptype: number;
        //Template6(装备6)
        public Template6: number;
        //Template7(装备7)
        public Template7: number;
        //icon(资源路径)
        public icon: string;
        //OrderId(顺序)
        public OrderId: number;
        //Template8(装备8)
        public Template8: number;
        //Template1S(史诗1)
        public Template1S: number;
        //Template2S(史诗2)
        public Template2S: number;
        //Template3S(史诗3)
        public Template3S: number;
        //Template4S(史诗4)
        public Template4S: number;
        //Template5S(史诗5)
        public Template5S: number;
        //Template6S(史诗6)
        public Template6S: number;
        //Template7S(史诗7)
        public Template7S: number;
        //Template8S(史诗8)
        public Template8S: number;
        //Property1(套装1)
        public Property1: number;
        //Property2(套装2)
        public Property2: number;
        //Property3(套装3)
        public Property3: number;
        //Property4(套装4)
        public Property4: number;
        //Property5(套装5)
        public Property5: number;
        //Property6(套装6)
        public Property6: number;
        //Property7(套装7)
        public Property7: number;
        //Property8(套装8)
        public Property8: number;
        //fixvalue(固定值)
        public fixvalue: number;
        //percent(百分比)
        public percent: number;

        constructor(data?: Object) {
                super();
                if (data) {
                        for (let i in data) {
                                this[i] = data[i];
                        }
                }
        }

}
