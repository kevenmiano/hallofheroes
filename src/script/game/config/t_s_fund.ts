import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_fund
*/
export default class t_s_fund {
        public mDataList: t_s_fundData[];

        public constructor(list: Object[]) {
                this.mDataList = [];
                for (let i in list) {
                        this.mDataList.push(new t_s_fundData(list[i]));
                }
        }
}

export class t_s_fundData extends t_s_baseConfigData {
        //Grade(等级)
        public Grade: number;
        //BindDiamond(可获得绑钻数)
        public BindDiamond: number;

        constructor(data?: Object) {
                super();
                if (data) {
                        for (let i in data) {
                                this[i] = data[i];
                        }
                }
        }

}
