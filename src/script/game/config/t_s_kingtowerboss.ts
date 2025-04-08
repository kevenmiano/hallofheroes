// @ts-nocheck
import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_kingtowerboss
*/
export default class t_s_kingtowerboss {
        public mDataList: t_s_kingtowerbossData[];

        public constructor(list: Object[]) {
                this.mDataList = [];
                for (let i in list) {
                        this.mDataList.push(new t_s_kingtowerbossData(list[i]));
                }
        }
}

export class t_s_kingtowerbossData extends t_s_baseConfigData {
        //Id(编号)
        public Id: number;
        //OrderId(战斗力排名)
        public OrderId: number;
        //UserId(用户编号)
        public UserId: number;
        //NickName(用户昵称)
        protected NickName: string;
        protected NickName_en: string = "";
        protected NickName_es: string = "";
        protected NickName_fr: string = "";
        protected NickName_pt: string = "";
        protected NickName_tr: string = "";
        protected NickName_zhcn: string = "";
        protected NickName_zhtw: string = "";
        //Grades(等级)
        public Grades: number;
        //Job(职业)
        public Job: number;
        //FightCapacity(战斗力)
        public FightCapacity: number;
        //TotalPhyAttack(物攻)
        public TotalPhyAttack: number;
        //TotalPhyDefence(物防)
        public TotalPhyDefence: number;
        //TotalMagicAttack(魔攻)
        public TotalMagicAttack: number;
        //TotalMagicDefence(魔防)
        public TotalMagicDefence: number;
        //TotalForceHit(暴击)
        public TotalForceHit: number;
        //TotalConatArmy(带兵数)
        public TotalConatArmy: number;
        //Parry(格挡)
        public Parry: number;
        //Live(生命)
        public Live: number;
        //HideFashion(隐藏时装)
        public HideFashion: number;
        //ItemTemplateId(物品模板编号列表)
        public ItemTemplateId: string;
        //ItemPos(物品位置列表)
        public ItemPos: string;
        //ItemBagType(物品背包)
        public ItemBagType: string;
        //SuiteSkill(套装技能)
        public SuiteSkill: string;
        //Avata(形象)
        public Avata: string;
        //StarTemplateId(星运ID)
        public StarTemplateId: string;
        //StarGrade(星运等级)
        public StarGrade: string;
        //StarDefaultSkill(星运技能)
        public StarDefaultSkill: string;

        constructor(data?: Object) {
                super();
                if (data) {
                        for (let i in data) {
                                this[i] = data[i];
                        }
                }
        }

        private NickNameKey: string = "NickName";
        public get NickNameLang(): string {
                let value = this.getKeyValue(this.getLangKey(this.NickNameKey));
                if (value) {
                        return value;
                }
                return "";//return this.getKeyValue(this.NickNameKey);
        }
}
