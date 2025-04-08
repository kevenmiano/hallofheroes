import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_mapnodeoffset
*/
export default class t_s_mapnodeoffset {
    public mDataList: t_s_mapnodeoffsetData[];
    public mDataList2: t_s_mapnodeoffsetData[];

    public constructor(list: Object[]) {
        this.mDataList = [];
        for (let i in list) {
            let data = new t_s_mapnodeoffsetData(list[i]);
            this.mDataList.push(data);
            this.mDataList[data.getKey()] = data;

        }
    }
}

export class t_s_mapnodeoffsetData extends t_s_baseConfigData {
    //关键Key
    public key: number;
    //地编中的路径
    public path: string;
    //X轴偏移
    public offsetX: number;
    //Y轴偏移
    public offsetY: number;

    constructor(data?: Object) {
        super();
        if (data) {
           for (let i in data) {
              this[i] = data[i];
           }
        }
     }

    public getKey() {
        return this.key;
    }
}
