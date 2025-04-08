// @ts-nocheck
import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_chattranslateset
*/
export default class t_s_chattranslateset {
        public mDataList: translateParam[];
        public constructor(list: Object[]) {
                this.mDataList = [];
                for (let i in list) {
                        this.mDataList.push(new translateParam(list[i]));
                }
        }
}


//目标语言项
export class translateParam extends t_s_baseConfigData {
        //类型
        public key: string = "";
        //名称
        public value: string = "";

        constructor(data?: Object) {
                super();
                if (data) {
                        for (let i in data) {
                                this[i] = data[i];
                        }
                }
        }

}
