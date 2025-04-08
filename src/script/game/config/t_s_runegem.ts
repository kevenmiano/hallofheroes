// @ts-nocheck
import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_runegem
*/
export default class t_s_runegem {
    public mDataList: t_s_runegemData[];

    public constructor(list: Object[]) {
        this.mDataList = [];
        for (let i in list) {
            this.mDataList.push(new t_s_runegemData(list[i]));
        }
    }
}

export class t_s_runegemData extends t_s_baseConfigData {
    public Agility: number = 0;
    public Captain: number = 0;
    public Grades: number = 0;
    public Id: number = 0;
    public Intellect: number = 0;
    public Physique: number = 0;
    public Power: number = 0;
    public RuneGemTypes: number = 0;
    public Types: number = 0;
    public Attack = 0;
    public Defence = 0;
    public MagicAttack = 0;
    public MagicDefence = 0;
    public ForceHit = 0;
    public Live = 0;
    public Parry = 0;


    constructor(data?: Object) {
        super();
        if (data) {
            for (let i in data) {
                this[i] = data[i];
            }
        }
    }

}
