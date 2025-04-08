// @ts-nocheck
import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_passindex
*/
export default class t_s_passindex {
        public mDataList: t_s_passindexData[];

        public constructor(list: Object[]) {
                this.mDataList = [];
                for (let i in list) {
                        this.mDataList.push(new t_s_passindexData(list[i]));
                }
        }
}

export class t_s_passindexData extends t_s_baseConfigData {
        //主键ID
        public Id: number;
        //关闭时间
        public CloseDate: string;
        //"2023-08-22 00:00:00",
        public OpenDate: string;
        //结算时间
        public StopDate: string;

        constructor(data?: Object) {
                super();
                if (data) {
                        for (let i in data) {
                                this[i] = data[i];
                        }
                }
        }

}
