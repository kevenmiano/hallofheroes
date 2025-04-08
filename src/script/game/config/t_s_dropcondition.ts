import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_dropcondition
*/
export default class t_s_dropcondition {
        public mDataList: t_s_dropconditionData[];

        public constructor(list: Object[]) {
                this.mDataList = [];
                for (let i in list) {
                        this.mDataList.push(new t_s_dropconditionData(list[i]));
                }
        }
}

export class t_s_dropconditionData extends t_s_baseConfigData {
        //DropId(ID)
        public DropId: number;
        //CondictionType(条件编号)
        public CondictionType: number;
        //Para1(参数1)
        public Para1: number[];
        //Para2(参数2)
        public Para2: number[];

        constructor(data?: Object) {
                super();
                if (data) {
                        for (let i in data) {
                                this[i] = data[i];
                        }
                }
        }
}
