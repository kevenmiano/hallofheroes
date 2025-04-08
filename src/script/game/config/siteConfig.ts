// @ts-nocheck
import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_gameconfig
*/
export default class siteConfig {
    public mDataList: siteConfigData[];

    public constructor(list: Object[]) {
        this.mDataList = [];
        for (let i in list) {
            this.mDataList.push(new siteConfigData(list[i]));
        }
    }
}

export class siteConfigData extends t_s_baseConfigData {
    //资源请求地址
    public REQUEST_PATH: string = "";
    //资源地址
    public ResourcePath: string = "";
    //客服图片上传地址
    public UPLOAD_PATH: string = "";
    //
    public PAY: string = "";

    constructor(data?: Object) {
        super();
        if (data) {
            for (let i in data) {
                this[i] = data[i];
            }
        }
    }

}
