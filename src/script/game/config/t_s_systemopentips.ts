// @ts-nocheck
/*
* t_s_systemopentips
*/

import t_s_baseConfigData from "./t_s_baseConfigData";

export default class t_s_systemopentips {
    public mDataList: t_s_systemopentipsData[];

    public constructor(list: Object[]) {
        this.mDataList = [];
        for (let i in list) {
            this.mDataList.push(new t_s_systemopentipsData(list[i]));
        }
    }
}

export class t_s_systemopentipsData extends t_s_baseConfigData {
    //开放等级
    public Grade: number;
    //Id
    public Id: number;
    //代表预览列表中的顺序, 以及达到等级之后的展示顺序
    public Order: number;
    //对应功能的图标及跳转去向的界面
    public Type: number;
    //Description(描述)
    protected Description: string;
    protected Description_en: string = "";
    protected Description_es: string = "";
    protected Description_fr: string = "";
    protected Description_pt: string = "";
    protected Description_tr: string = "";
    protected Description_zhcn: string = "";
    protected Description_zhtw: string = "";
   
    constructor(data?: Object) {
        super();
        if (data) {
            for (let i in data) {
                this[i] = data[i];
            }
        }
    }
    
    private DescriptionKey: string = "Description";
    public get DescriptionLang(): string {
        let value = this.getKeyValue(this.getLangKey(this.DescriptionKey));
        if (value) {
            return value;
        }
        return "";
    }


}
