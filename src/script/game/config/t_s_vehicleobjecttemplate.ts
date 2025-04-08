import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_vehicleobjecttemplate
*/
export default class t_s_vehicleobjecttemplate {
        public mDataList: t_s_vehicleobjecttemplateData[];

        public constructor(list: Object[]) {
                this.mDataList = [];
                for (let i in list) {
                        this.mDataList.push(new t_s_vehicleobjecttemplateData(list[i]));
                }
        }
}

export class t_s_vehicleobjecttemplateData extends t_s_baseConfigData {
        //Id(载具模版id)
        public Id: number;
        //Name(载具名)
        public Name: string;
        //Hp(生命值)
        public Hp: number;
        //Avatar(载具形象)
        public Avatar: string;
        //Speed(速度)
        public Speed: number;
        //Dodge(闪避)
        public Dodge: number;
        //Description(载具描述)
        public Description: string;
        //Sort(排序)
        public Sort: number;
        //NormalSkill(普通技能)
        public NormalSkill: number;
        //GeniusSkill(天赋技能)
        public GeniusSkill: number;
        //NeedGrades(需要等级)
        public NeedGrades: number;
        //NeedDiamond(激活所需钻石)
        public NeedDiamond: number;
        //Attack(攻击力)
        public Attack: number;
        //Defence(防御力)
        public Defence: number;

        constructor(data?: Object) {
                super();
                if (data) {
                        for (let i in data) {
                                this[i] = data[i];
                        }
                }
        }

}
