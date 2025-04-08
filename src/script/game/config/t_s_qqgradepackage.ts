import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_qqgradepackage
*/
export default class t_s_qqgradepackage {
    public mDataList: t_s_qqgradepackageData[];

    public constructor(list: Object[]) {
        this.mDataList = [];
        for (let i in list) {
            this.mDataList.push(new t_s_qqgradepackageData(list[i]));
        }
    }
}

export class t_s_qqgradepackageData extends t_s_baseConfigData {
    //ID(ID)
    public ID: number;
    //Giftbag(礼包)
    public Giftbag: string;
    //Grade(等级)
    public Grade: number;
    //Gifttype  1为QQ大厅等级礼包, 2为QQ空间等级礼包, 3为黄钻等级每日礼包
    public Gifttype: number;


    constructor(data?: Object) {
        super();
        if (data) {
            for (let i in data) {
                this[i] = data[i];
            }
        }
    }
}
