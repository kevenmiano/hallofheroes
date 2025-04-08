// @ts-nocheck
import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_herotemplate
*/
export default class t_s_herotemplate {
        public mDataList: t_s_herotemplateData[];

        public constructor(list: Object[]) {
                this.mDataList = [];
                for (let i in list) {
                        this.mDataList.push(new t_s_herotemplateData(list[i]));
                }
        }
}

export class t_s_herotemplateData extends t_s_baseConfigData {
        //TemplateId(编号)
        public TemplateId: number;
        //Property1(参数1)
        public Property1: number;
        //AddName(称谓)
        protected AddName: string;
        protected AddName_en: string = "";
        protected AddName_es: string = "";
        protected AddName_fr: string = "";
        protected AddName_pt: string = "";
        protected AddName_tr: string = "";
        protected AddName_zhcn: string = "";
        protected AddName_zhtw: string = "";
        //HeroType(类型,1为玩家, 2为机器人, 3为Boss, 4为众神盗宝者, 5为藏宝图精英怪, 6为藏宝图普通怪)
        public HeroType: number;
        //Job(职业, 1为战士, 2为射手, 3为法师)
        public Job: number;
        //Parry(格挡)
        public Parry: number;
        //Sexs(性别, 1为男, 2为女)
        public Sexs: number;
        //TemplateName(英雄名字)
        protected TemplateName: string;
        protected TemplateName_en: string = "";
        protected TemplateName_es: string = "";
        protected TemplateName_fr: string = "";
        protected TemplateName_pt: string = "";
        protected TemplateName_tr: string = "";
        protected TemplateName_zhcn: string = "";
        protected TemplateName_zhtw: string = "";
        //FireResi(火抗)
        public FireResi: number;
        //WaterResi(水抗)
        public WaterResi: number;
        //ElectResi(电抗)
        public ElectResi: number;
        //WindResi(风抗)
        public WindResi: number;
        //DarkResi(暗抗)
        public DarkResi: number;
        //Grades(等级)
        public Grades: number;
        //LightResi(光抗)
        public LightResi: number;
        //Icon(图标路径)
        public Icon: string;
        //ResPath(资源路径, swf下面的文件)
        public ResPath: string;
        //RejectType(免疫BUFF类型)
        public RejectType: number[];
        //SkillScript(携带技能)
        public SkillScript: number[];
        //AI(AI)
        public AI: number;
        //Live(生命)
        public Live: number;
        //Attack(物攻)
        public Attack: number;
        //MagicAttack(魔攻)
        public MagicAttack: number;
        //Defence(物防)
        public Defence: number;
        //MagicDefence(魔防)
        public MagicDefence: number;
        //ForceHit(暴力值)
        public ForceHit: number;
        //Captain(统帅)
        public Captain: number;
        //DefaultSkill(默认技能)
        public DefaultSkill: number;
        //Power(力量)
        public Power: number;
        //Agility(敏捷)
        public Agility: number;
        //Intellect(智力)
        public Intellect: number;
        //Physique(体质)
        public Physique: number;
        //conat(带兵数)
        public conat: number;
        //ArmPath(武器路径)
        public ArmPath: string;
        //ClothPath(衣服路径)
        public ClothPath: string;
        //CloakPath(披风路径)
        public CloakPath: string;
        //HairPath(头发路径)
        public HairPath: string;

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

        private AddNameKey: string = "AddName";
        public get AddNameLang(): string {
                let value = this.getKeyValue(this.getLangKey(this.AddNameKey));
                if (value != undefined) {
                        return value;
                }
                return "";
        }
}
