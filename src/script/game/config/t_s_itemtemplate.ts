// @ts-nocheck
/*
* t_s_itemtemplate
*/
import { CommonConstant } from "../constant/CommonConstant";
import GoodsSonType from "../constant/GoodsSonType";
import { GoodsType } from "../constant/GoodsType";
import { JobType } from "../constant/JobType";
import SexType from "../constant/SexType";
import { EmPackName } from "../constant/UIDefine";
import GoodsProfile from "../datas/goods/GoodsProfile";
import { PathManager } from "../manager/PathManager";
import FUIHelper from "../utils/FUIHelper";
import { GoodsCheck } from "../utils/GoodsCheck";
import t_s_baseConfigData from "./t_s_baseConfigData";

export default class t_s_itemtemplate {
    public mDataList: t_s_itemtemplateData[];

    public constructor(list: Object[]) {
        this.mDataList = [];
        for (let i in list) {
            this.mDataList.push(new t_s_itemtemplateData(list[i]));
        }
    }
}

export class t_s_itemtemplateData extends t_s_baseConfigData {
    //激活展示
    public Activation: number;
    //TemplateId(编号)
    public TemplateId: number;
    //TemplateName(名称)
    protected TemplateName: string;
    protected TemplateName_en: string = "";
    protected TemplateName_es: string = "";
    protected TemplateName_fr: string = "";
    protected TemplateName_pt: string = "";
    protected TemplateName_tr: string = "";
    protected TemplateName_zhcn: string = "";
    protected TemplateName_zhtw: string = "";
    //Description(描述)
    protected Description: string;
    protected Description_en: string = "";
    protected Description_es: string = "";
    protected Description_fr: string = "";
    protected Description_pt: string = "";
    protected Description_tr: string = "";
    protected Description_zhcn: string = "";
    protected Description_zhtw: string = "";
    //DarkResi(暗抗)
    public DarkResi: number;
    //WindResi(风抗)
    public WindResi: number;
    //ElectResi(电抗)
    public ElectResi: number;
    //WaterResi(水抗)
    public WaterResi: number;
    //FireResi(火抗)
    public FireResi: number;
    //ReduceResi(减抗)
    public ReduceResi: number;
    //Tenacity(韧性)
    public Tenacity: number;
    //Strength(强度)
    public Strength: number;
    //LightResi(光抗)
    public LightResi: number;
    //Parry(格挡)
    public Parry: number;
    //Refresh(洗炼分解对应物品)
    public Refresh: number;
    //TransformId(转换)
    public TransformId: number;
    //StartingPrice(起拍价)
    public StartingPrice: number;
    //IsCanBatch(能否批量使用)
    public IsCanBatch: number;
    //controlled(是否可额外掉落)
    public controlled: number;
    //Property1(功能字段1)
    public Property1: number;
    //Property2(功能字段2)
    public Property2: number;
    //MasterType(主类)
    public MasterType: number;
    //SonType(子类)
    public SonType: number;
    //Icon(图标)
    public Icon: string;
    //Property3(功能字段3)
    public Property3: number;
    //Property4(功能字段4)
    public Property4: number;
    //Property5(功能字段5)
    public Property5: number;
    //Property6(功能字段6)
    public Property6: number;
    //Avata(形象)
    public Avata: string;
    //NeedGrades(所需等级)
    public NeedGrades: number;
    //Job(职业)
    public Job: number[];
    //Profile(品质)
    public Profile: number;
    //Sexs(性别)
    public Sexs: number;
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
    //Conat(带兵数)
    public Conat: number;
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
    //RandomSkillCount(随即技能数)
    public RandomSkillCount: number;
    //StrengthenMax(最大强化)
    public StrengthenMax: number;
    //DefaultSkill(魔法属性)
    public DefaultSkill: string;
    //SuiteId(套装ID)
    public SuiteId: number;
    //MaxCount(叠加最大数量)
    public MaxCount: number;
    //SellGold(售价)
    public SellGold: number;
    //获得途径
    public ObtainId: string;
    public Limited: number;
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
        return "";
    }

    private DescriptionKey: string = "Description";
    public get DescriptionLang(): string {
        let value = this.getKeyValue(this.getLangKey(this.DescriptionKey));
        if (value) {
            return value;
        }
        return "";
    }

    public get iconPath(): string {
        return PathManager.resourcePath + "icon" + this.Icon.toLocaleLowerCase();
    }

    public get sonTypeName(): string {
        return GoodsSonType.getSonTypeName(this.SonType);
    }

    public get profileColor(): string {
        return GoodsProfile.getGoodsProfileColor(this.Profile);
    }

    public get profileLetter(): string {
        return GoodsProfile.getGoodsProfileLetter(this.Profile);
    }

    public get profileDescript(): string {
        return GoodsProfile.getGoodsProfileDescript(this.Profile);
    }
    
    public get profilePath(): string {
        let profileNum = this.Profile - 1
        let url = FUIHelper.getItemURL(EmPackName.Base, CommonConstant.QUALITY_RES[profileNum])
        return url
    }
    
    public get sexName(): string {
        return SexType.getSexDescript(this.Sexs);
    }

    public get jobName(): string {
        let str: string = "";
        let arr: number[] = this.Job;
        let index = 0;
        let count = arr.length;
        for (const key in arr) {
            let job = Number(arr[key]);
            if (index < count - 1) {
                str += (JobType.getJobName(job) + ", ");
            } else {
                str += (JobType.getJobName(job));
            }
            index++;
        }
        return str;
    }

    public get totalAttribute(): number {
        return this.Attack + this.Defence + this.MagicAttack + this.MagicDefence + this.ForceHit + this.Live + this.Captain + this.Parry;
    }

    private _isCanbeUpgrade: boolean;//是否能升级为橙色装备
    public get isCanbeUpgrade(): boolean {
        if (this.MasterType == GoodsType.EQUIP && this.SuiteId > 0 && this.NeedGrades >= 40 && this.Profile == 4 && this.NeedGrades % 10 == 0) {
            return true;
        }
        return false;
    }

    public get isViceEquip(): boolean {
        if (this.MasterType == GoodsType.EQUIP) {
            if (GoodsCheck.isFashion(this)) {
                if (this.Job.indexOf(99) != -1) {
                    return true;
                }
            } else {
                if (this.Job.indexOf(99) != -1) {
                    return true;
                }
            }
        }
        return false;
    }

}
