import t_s_baseConfigData from "./t_s_baseConfigData";

export default class t_s_activityschedule {
    public mDataList: t_s_activityscheduleData[];

    public constructor(list: Object[]) {
        this.mDataList = [];
        for (let i in list) {
            this.mDataList.push(new t_s_activityscheduleData(list[i]));
        }
    }
}

export class t_s_activityscheduleData extends t_s_baseConfigData {
    public Id: number;
    public Area: number;
    public Type: number;
    protected Title_zhcn: string;
    protected Title_zhtw: string;
    protected Title_en: string = "";
    protected Title_es: string = "";
    protected Title_pt: string = "";
    protected Title_tr: string = "";
    protected Title_fr: string = "";
    protected Title_de: string = "";
    protected Description_zhcn: string;
    protected Description_zhtw: string = "";
    protected Description_en: string = "";
    protected Description_es: string = "";
    protected Description_fr: string = "";
    protected Description_pt: string = "";
    protected Description_tr: string = "";
    protected Descriptio_zhtw: string = "";

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

    private TitleKey: string = "Title";
    public get TitleLang(): string {
        let value = this.getKeyValue(this.getLangKey(this.TitleKey));
        if (value) {
            return value;
        }
        return "";
    }
}