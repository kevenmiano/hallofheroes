import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_activetemplate
*/
export default class t_s_activetemplate {
        public mDataList: t_s_activetemplateData[];

        public constructor(list: Object[]) {
                this.mDataList = [];
                for (let i in list) {
                        this.mDataList.push(new t_s_activetemplateData(list[i]));
                }
        }
}

export class t_s_activetemplateData extends t_s_baseConfigData {
        //TemplateId(ID)
        public TemplateId: number;
        //DropList(掉落列表)
        public DropList: number[];
        //Detail(详情)
        public Detail: string;
        //Strategy(战魂)
        public Strategy: number;
        //Exp(经验)
        public Exp: number;
        //Gold(黄金)
        public Gold: number;
        //Type(种类)
        public Type: number;
        //Sort(排序,越小越靠前)
        public Sort: number;
        //ActiveName(活动名字)
        public ActiveName: string;
        //ActiveTime(开放时间,与实际开放时间无关)
        public ActiveTime: string;
        //Levels(需要等级,与实际等级无关)
        public Levels: number;
        //MaxCount(最大次数,与实际最大次数无关)
        public MaxCount: number;

        constructor(data?: Object) {
                super();
                if (data) {
                        for (let i in data) {
                                this[i] = data[i];
                        }
                }
        }
}
