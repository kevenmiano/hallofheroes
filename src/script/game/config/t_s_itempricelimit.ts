// @ts-nocheck
import t_s_baseConfigData from "./t_s_baseConfigData";

export default class t_s_itempricelimit {

    public mDataList: t_s_itempricelimitData[];

    public constructor(list: Object[]) {
        this.mDataList = [];
        for (let i in list) {
            this.mDataList.push(new t_s_itempricelimitData(list[i]));
        }
    }
}

export class t_s_itempricelimitData extends t_s_baseConfigData {

    public Id: number;
    public ItemId: number;

    public MinPrice: number;
    public MaxPrice: number;

    constructor(data?: Object) {
        super();
        if (data) {
            for (let i in data) {
                this[i] = data[i];
            }
        }
    }

}