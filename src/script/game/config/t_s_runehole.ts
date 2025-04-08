// @ts-nocheck
import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_runehole
*/
export default class t_s_runehole {
    public mDataList: t_s_runeholeData[];

    public constructor(list: Object[]) {
        this.mDataList = [];
        for (let i in list) {
            this.mDataList.push(new t_s_runeholeData(list[i]));
        }
    }
}

export class t_s_runeholeData extends t_s_baseConfigData {
    public AttributeType1: number = 0;
    public AttributeType2: number = 0;
    public BanRuneType: string = "0";
    public Condition1: number = 0;
    public Condition2: number = 0;
    public ConditionParam1: number = 0;
    public ConditionParam2: number = 0;
    protected Description: string = "无";
    protected Description_en: string = "";
    protected Description_es: string = "";
    protected Description_fr: string = "";
    protected Description_pt: string = "";
    protected Description_tr: string = "";
    protected Description_zhcn: string = "";
    protected Description_zhtw: string = "";
    public EffectType1: number = 0;
    public EffectType2: number = 0;
    public Hole1: string = "1";
    public Hole2: string = "0";
    public Hole3: string = "0";
    public Hole4: string = "0";
    public Hole5: string = "0";
    public Id: number = 1001;
    public Length: number = 1;
    public NewRuneSkill1: number = 0;
    public NewRuneSkill2: number = 0;
    public Random: number = 10;
    public RuneType1: string = "0";
    public RuneType2: string = "0";
    public ValueParam1: string = "0";
    public ValueParam2: string = "0";
    public ValueType1: number = 0;
    public ValueType2: number = 0;

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
        return "";//return this.getKeyValue(this.DescriptionKey);
    }

}
