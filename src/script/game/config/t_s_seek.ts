// @ts-nocheck
import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_seek
*/
export default class t_s_seek {
        public mDataList: t_s_seekData[];

        public constructor(list: Object[]) {
                this.mDataList = [];
                for (let i in list) {
                        this.mDataList.push(new t_s_seekData(list[i]));
                }
        }
}

export class t_s_seekData extends t_s_baseConfigData {
        //ID(ID)
        public ID: number;
        //Name(名称)
        public Name: string;
        //Coordinates(坐标)
        public Coordinates: number[];
        //Deplete(消耗物品)
        public Deplete: string;
        //Reward1(奖励1)
        public Reward1: string;
        //Reward2(奖励2)
        public Reward2: string;

        constructor(data?: Object) {
                super();
                if (data) {
                        for (let i in data) {
                                this[i] = data[i];
                        }
                }
        }

}
