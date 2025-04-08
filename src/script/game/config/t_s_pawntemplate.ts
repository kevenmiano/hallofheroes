import ConfigMgr from "../../core/config/ConfigMgr";
import { ConfigType } from "../constant/ConfigDefine";
import t_s_baseConfigData from "./t_s_baseConfigData";
import { t_s_skilltemplateData } from "./t_s_skilltemplate";

/*
* t_s_pawntemplate
*/
export default class t_s_pawntemplate {
    public mDataList: t_s_pawntemplateData[];

    public constructor(list: Object[]) {
        this.mDataList = [];
        for (let i in list) {
            this.mDataList.push(new t_s_pawntemplateData(list[i]));
        }
    }
}

export class t_s_pawntemplateData extends t_s_baseConfigData {
    //TemplateId(编号)
    public TemplateId: number;
    //PawnName(名称)
    protected PawnName: string;
    protected PawnName_en: string = "";
    protected PawnName_es: string = "";
    protected PawnName_fr: string = "";
    protected PawnName_pt: string = "";
    protected PawnName_tr: string = "";
    protected PawnName_zhcn: string = "";
    protected PawnName_zhtw: string = "";
    //MasterType(主类型)
    public MasterType: number;
    //SonType(子类型)
    public SonType: number;
    //Parry(格挡)
    public Parry: number;
    //Level(等级)
    public Level: number;
    //RejectType(免疫BUFF)
    public RejectType: string;
    //FireResi(火抗)
    public FireResi: number;
    //WaterResi(水抗)
    public WaterResi: number;
    //ElectResi(电抗)
    public ElectResi: number;
    //Swf(资源路径)
    public Swf: string;
    //WindResi(风抗)
    public WindResi: number;
    //DarkResi(暗抗)
    public DarkResi: number;
    //LightResi(光抗)
    public LightResi: number;
    //DefaultSpecialTemps(默认特性)
    public DefaultSpecialTemps: string;
    //Icon(图标路径)
    public Icon: string;
    //NextLevelTemplateId(下一级兵种)
    public NextLevelTemplateId: number;
    //GoldConsume(所需金币)
    public GoldConsume: number;
    //NeedBuilding(需要建筑)
    public NeedBuilding: number;
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
    //DefaultSkill(默认技能)
    public DefaultSkill: number;
    //Camp(阵营)
    public Camp: number;
    //HighSkill(升级技能)
    public HighSkill: string;
    //CrystalsConsume(消耗魔晶)
    public CrystalsConsume: number;
    //NeedTime(招募时间)
    public NeedTime: number;
    //NeedPopulation(所需人口)
    public NeedPopulation: number;
    //AttackType(攻击类型)
    public AttackType: number;
    //HeroSkill(特性)
    public HeroSkill: string;
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

    private PawnNameKey: string = "PawnName";
    public get PawnNameLang(): string {
        let value = this.getKeyValue(this.getLangKey(this.PawnNameKey));
        if (value) {
            return value;
        }
        return "";//return this.getKeyValue(this.PawnNameKey);
    }

    private DescriptionKey: string = "Description";
    public get DescriptionLang(): string {
        let value = this.getKeyValue(this.getLangKey(this.DescriptionKey));
        if (value) {
            return value;
        }
        return "";//return this.getKeyValue(this.DescriptionKey);
    }

    // public get neenBuildings():any[]
    // {
    //  return this.NeedBuilding.split(",")
    // }

    public get DefaultSkillTemplateInfo(): t_s_skilltemplateData {
        return ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_skilltemplate, this.DefaultSkill)
    }

}
