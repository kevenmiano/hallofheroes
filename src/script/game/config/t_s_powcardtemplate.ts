// @ts-nocheck
import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_powcardtemplate
*/
export default class t_s_powcardtemplate {
        public mDataList: t_s_powcardtemplateData[];

        public constructor(list: Object[]) {
                this.mDataList = [];
                for (let i in list) {
                        this.mDataList.push(new t_s_powcardtemplateData(list[i]));
                }
        }
}

export class t_s_powcardtemplateData extends t_s_baseConfigData {
        //TemplateId(ID)
        public TemplateId: number;
        //TemplateName(名称)
        public TemplateName: string;
        //MasterType(主类)
        public MasterType: number;
        //SonType(子类)
        public SonType: number;
        //Profile(品质)
        public Profile: number;
        //Pos(位置)
        public Pos: number;
        //Icon(资源路径)
        public Icon: string;
        //Description1(描述)
        public Description1: string;
        //Description2(描述)
        public Description2: string;
        //Description3(描述)
        public Description3: string;
        //SuiteId(套装)
        public SuiteId: number;
        //BufId(BUFF)
        public BufId: number;
        //fixvalue(固定加成)
        public fixvalue: number;
        //percent(百分比加成)
        public percent: number;
        //add(加成效果)
        public add: number;
        //para1(功能字段)
        public para1: number;

        constructor(data?: Object) {
                super();
                if (data) {
                        for (let i in data) {
                                this[i] = data[i];
                        }
                }
        }
}
