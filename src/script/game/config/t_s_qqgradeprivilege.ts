import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_qqgradeprivilege
*/
export default class t_s_qqgradeprivilege {
    public mDataList: t_s_qqgradeprivilegeData[];

    public constructor(list: Object[]) {
        this.mDataList = [];
        for (let i in list) {
            this.mDataList.push(new t_s_qqgradeprivilegeData(list[i]));
        }
    }
}

export class t_s_qqgradeprivilegeData extends t_s_baseConfigData {
    //ID(ID)
    public ID: number;
    //Privilegename(名字)
    public Privilegename: string;
    //Grade(特权等级)
    public Grade: number;
    //Privilegetype(特权种类)
    public Privilegetype: number;
    //Para1(参数1)
    public Para1: number;
    //Para2(参数2)
    public Para2: number;
    //Para3(参数3)
    public Para3: number;

    public rewards: string;


    constructor(data?: Object) {
                super();
                if (data) {
                        for (let i in data) {
                                this[i] = data[i];
                        }
                }
        }
}
