import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_vehiclebufftemplate
*/
export default class t_s_vehiclebufftemplate {
        public mDataList: t_s_vehiclebufftemplateData[];

        public constructor(list: Object[]) {
                this.mDataList = [];
                for (let i in list) {
                        this.mDataList.push(new t_s_vehiclebufftemplateData(list[i]));
                }
        }
}

export class t_s_vehiclebufftemplateData extends t_s_baseConfigData {
        //Id(buff模版Id)
        public Id: number;
        //SonType(子类型)
        public SonType: number;
        //Name(名称)
        public Name: string;
        //Icon(图标)
        public Icon: string;
        //EffectType(效果类型)
        public EffectType: number;
        //EffectValue(效果威力)
        public EffectValue: number;
        //EffectPercent(效果威力(百分比))
        public EffectPercent: number;
        //TogglePercent(触发几率(有一定的几率触发效果))
        public TogglePercent: number;
        //Duration(持续时间)
        public Duration: number;
        //PrepareTime(准备时间)
        public PrepareTime: number;
        //Interval(间隔时间)
        public Interval: number;
        //LastEffect(特效)
        public LastEffect: string;
        //Description(描述)
        public Description: string;

        constructor(data?: Object) {
                super();
                if (data) {
                        for (let i in data) {
                                this[i] = data[i];
                        }
                }
        }

}
