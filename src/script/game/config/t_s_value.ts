import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_value
*/
export default class t_s_value {
        public mDataList: t_s_valueData[];

        public constructor(list: Object[]) {
                this.mDataList = [];
                for (let i in list) {
                        this.mDataList.push(new t_s_valueData(list[i]));
                }
        }
}

export class t_s_valueData extends t_s_baseConfigData {
        //Id(编号)
        public Id: number;
        //Type(评分类型)
        public Type: number;
        //MinLv(等级下限)
        public MinLv: number;
        //MaxLv(等级下限)
        public MaxLv: number;
        //Parameter1(参数1)
        public Parameter1: number;
        //Parameter2(参数2)
        public Parameter2: number;
        //Parameter3(参数3)
        public Parameter3: number;
        //Parameter4(参数4)
        public Parameter4: number;
        //Parameter5(参数5)
        public Parameter5: number;

        constructor(data?: Object) {
                super();
                if (data) {
                        for (let i in data) {
                                this[i] = data[i];
                        }
                }
        }

}
