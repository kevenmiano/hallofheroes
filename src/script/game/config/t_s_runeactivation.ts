import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_runeactivation
*/
export default class t_s_runeactivation {
    public mDataList: t_s_runeactivationData[];

    public constructor(list: Object[]) {
        this.mDataList = [];
        for (let i in list) {
            this.mDataList.push(new t_s_runeactivationData(list[i]));
        }
    }
}

export class t_s_runeactivationData extends t_s_baseConfigData {

    public Attack = 0;
    public Defence = 0;
    public ForceHit = 0;
    public Live = 0;
    public MagicAttack = 0;
    public MagicDefence = 0;
    public Parry = 0;
    public SKillId = 0;
    public TemplateId = 0


    constructor(data?: Object) {
        super();
        if (data) {
            for (let i in data) {
                this[i] = data[i];
            }
        }
    }

}
