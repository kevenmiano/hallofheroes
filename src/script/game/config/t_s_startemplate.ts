import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_startemplate
*/
export default class t_s_startemplate {
        public mDataList: t_s_startemplateData[];

        public constructor(list: Object[]) {
                this.mDataList = [];
                for (let i in list) {
                        this.mDataList.push(new t_s_startemplateData(list[i]));
                }
        }
}

export class t_s_startemplateData extends t_s_baseConfigData {
        //TemplateId(ID)
        public TemplateId: number;
        //TemplateName(名字)
        protected TemplateName: string;
        protected TemplateName_en: string = "";
        protected TemplateName_es: string = "";
        protected TemplateName_fr: string = "";
        protected TemplateName_pt: string = "";
        protected TemplateName_tr: string = "";
        protected TemplateName_zhcn: string = "";
        protected TemplateName_zhtw: string = "";
        //Description(描述)
        public Description: string;
        //MasterType(主类型)
        public MasterType: number;
        //SonType(子类型)
        public SonType: number;
        //StarPoint(出售积分)
        public StarPoint: number;
        //NeedGrades(需要等级)
        public NeedGrades: number;
        //Parry(格挡)
        public Parry: number;
        //Job(职业)
        public Job: number[];
        //Icon(图标)
        public Icon: string;
        //Profile(品质)
        public Profile: number;
        //SellGold(售价)
        public SellGold: number;
        //SellGp(基础经验)
        public SellGp: number;
        //Power(力量)
        public Power: number;
        //Agility(敏捷)
        public Agility: number;
        //Intellect(智力)
        public Intellect: number;
        //Physique(体质)
        public Physique: number;
        //Captain(统帅)
        public Captain: number;
        //Attack(物攻)
        public Attack: number;
        //Defence(物防)
        public Defence: number;
        //MagicAttack(魔攻)
        public MagicAttack: number;
        //MagicDefence(魔防)
        public MagicDefence: number;
        //ForceHit(暴力值)
        public ForceHit: number;
        //Live(生命)
        public Live: number;
        //Conat(带兵)
        public Conat: number;
        //DefaultSkill(技能)
        public DefaultSkill: number[];

        constructor(data?: Object) {
                super();
                if (data) {
                        for (let i in data) {
                                this[i] = data[i];
                        }
                }
        }

        private TemplateNameKey: string = "TemplateName";
        public get TemplateNameLang(): string {
                let value = this.getKeyValue(this.getLangKey(this.TemplateNameKey));
                if (value) {
                        return value;
                }
                return "";//return this.getKeyValue(this.TemplateNameKey);
        }

}
