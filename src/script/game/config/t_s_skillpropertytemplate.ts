// @ts-nocheck
import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_skillpropertytemplate
*/
export default class t_s_skillpropertytemplate {
        public mDataList: t_s_skillpropertytemplateData[];

        public constructor(list: Object[]) {
                this.mDataList = [];
                for (let i in list) {
                        this.mDataList.push(new t_s_skillpropertytemplateData(list[i]));
                }
        }
}

export class t_s_skillpropertytemplateData extends t_s_baseConfigData {
        //TemplateId(ID)
        public TemplateId: number;
        //AddType(类型,0百分比, 1数值)
        public AddType: number;
        //Power(力量)
        public Power: number;
        //Parry(格挡)
        public Parry: number;
        //Agility(敏捷)
        public Agility: number;
        //Intellect(智力)
        public Intellect: number;
        //Physique(体质)
        public Physique: number;
        //Captain(统帅)
        public Captain: number;
        //Conat(带兵数)
        public Conat: number;
        //Live(生命)
        public Live: number;
        //Attack(物理攻击)
        public Attack: number;
        //Defence(物理防御)
        public Defence: number;
        //MagicAttack(魔法攻击)
        public MagicAttack: number;
        //MagicDefence(魔法防御)
        public MagicDefence: number;
        //ForceHit(暴击值)
        public ForceHit: number;
        //Penetrate(穿透值)
        public Penetrate: number;

        constructor(data?: Object) {
                super();
                if (data) {
                        for (let i in data) {
                                this[i] = data[i];
                        }
                }
        }

}
