// @ts-nocheck
import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_transformtemplate
*/
export default class t_s_transformtemplate {
        public mDataList: t_s_transformtemplateData[];

        public constructor(list: Object[]) {
                this.mDataList = [];
                for (let i in list) {
                        this.mDataList.push(new t_s_transformtemplateData(list[i]));
                }
        }
}

export class t_s_transformtemplateData extends t_s_baseConfigData {
        //TransformId(ID)
        public TransformId: number;
        //Material1(物品1)
        public Material1: number;
        //Material2(物品2)
        public Material2: number;
        //Material3(物品3)
        public Material3: number;
        //Material4(物品4)
        public Material4: number;
        //Material5(物品5)
        public Material5: number;
        //Material6(物品6)
        public Material6: number;
        //Material7(物品7)
        public Material7: number;
        //Material8(物品8)
        public Material8: number;
        //CostGold(消耗黄金)
        public CostGold: number;

        constructor(data?: Object) {
                super();
                if (data) {
                        for (let i in data) {
                                this[i] = data[i];
                        }
                }
        }


}
