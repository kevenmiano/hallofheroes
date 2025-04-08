// @ts-nocheck
import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_novicedialogue
*/
export default class t_s_novicedialogue {
    public mDataList: t_s_novicedialogueData[];

    public constructor(list: Object[]) {
        this.mDataList = [];
        for (let i in list) {
            this.mDataList.push(new t_s_novicedialogueData(list[i]));
        }
    }
}

//升级
export class t_s_novicedialogueData extends t_s_baseConfigData {

    public sceneType: number = 0;
    public nameId: string = "";
    //
    public leftIco: any[] = [];
    //
    public rightIco: any[] = [];
    //
    public txts:any[] = [];

    constructor(data?: Object) {
        super();
        if (data) {
            for (let i in data) {
                this[i] = data[i];
            }
        }
    }
}
