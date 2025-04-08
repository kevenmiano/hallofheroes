// @ts-nocheck
import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_pettemplate
*/
export default class t_s_pettemplate {
    public mDataList: t_s_pettemplateData[];

    public constructor(list: Object[]) {
        this.mDataList = [];
        for (let i in list) {
            this.mDataList.push(new t_s_pettemplateData(list[i]));
        }
    }
}

export class t_s_pettemplateData extends t_s_baseConfigData {
    //TemplateId(编号)
    public TemplateId: number;
    //TemplateName(宠物名称)
    protected TemplateName: string;
    protected TemplateName_en: string = "";
    protected TemplateName_es: string = "";
    protected TemplateName_fr: string = "";
    protected TemplateName_pt: string = "";
    protected TemplateName_tr: string = "";
    protected TemplateName_zhcn: string = "";
    protected TemplateName_zhtw: string = "";
    //PetType(宠物类型)
    public PetType: number;
    //PetAvatar(宠物外观)
    public PetAvatar: string;
    //GrowthRate(成长)
    public GrowthRate: number;
    //Quality(品质)
    public Quality: number;
    //Power(力量)
    public Power: number;
    //Intel(智力)
    public Intel: number;
    //Physi(体质)
    public Physi: number;
    //Armor(护甲)
    public Armor: number;
    //PowerApt(力量资质)
    private _PowerApt: number[];
    //IntelApt(智力资质)
    private _IntelApt: number[];
    //PhysiApt(体质资质)
    private _PhysiApt: number[];
    //ArmorApt(护甲资质)
    private _ArmorApt: number[];
    //InitHp(初始生命)
    public InitHp: number;
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
    //LightResi(光抗)
    public LightResi: number;
    //FollowSkills(跟随技能)
    public FollowSkills: number[];
    //ChangeSkills(变身技能)
    public ChangeSkills: number[];
    //DefaultSkills(默认技能)
    public DefaultSkills: number[];
    //NeedGrade(携带等级)
    public NeedGrade: number;
    //Description(描述)
    public Description: string;
    //Property1(参数1)
    public Property1: number;
    //Property2(参数2)
    public Property2: number;
    //Property3(参数3)
    public Property3: number;
    //Property4(参数4)
    public Property4: number;
    //Property5(参数5)
    public Property5: number;
    //Property6(参数6)
    public Property6: number;

    public AtkPotential: number = 0;//物攻潜能
    public MatPotential: number = 0;//魔攻潜能
    public DefPotential: number = 0;//物防潜能
    public MdfPotential: number = 0;//魔法潜能
    public HpPotential: number = 0;//生命潜能


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

    get PowerApt(): number[] {
        return this._PowerApt;
    }

    set PowerApt(value: number[]) {
        this._PowerApt = value;
        if (!this._PowerApt) {
            return;
        }
        if (value.length == 2) {
            this.InitPowerCoeLimitMin = value[0];
            this.InitPowerCoeLimit = value[1];
        }
    }

    get IntelApt(): number[] {
        return this._IntelApt;
    }

    set IntelApt(value: number[]) {
        this._IntelApt = value;
        if (!this._IntelApt) {
            return;
        }
        if (value.length == 2) {
            this.InitIntelCoeLimitMin = value[0];
            this.InitIntelCoeLimit = value[1];
        }
    }

    get ArmorApt(): number[] {
        return this._ArmorApt;
    }

    set ArmorApt(value: number[]) {
        this._ArmorApt = value;
        if (!this._ArmorApt) {
            return;
        }
        if (value.length == 2) {
            this.InitArmorCoeLimitMin = value[0];
            this.InitArmorCoeLimit = value[1];
        }
    }

    get PhysiApt(): number[] {
        return this._PhysiApt;
    }

    set PhysiApt(value: number[]) {
        this._PhysiApt = value;
        if (!this._PhysiApt) {
            return;
        }
        if (value.length == 2) {
            this.InitPhysiCoeLimitMin = value[0];
            this.InitPhysiCoeLimit = value[1];
        }
    }

    public InitPowerCoeLimit: number = 0;
    public InitIntelCoeLimit: number = 0;
    public InitPhysiCoeLimit: number = 0;
    public InitArmorCoeLimit: number = 0;

    public InitPowerCoeLimitMin: number = 0;
    public InitIntelCoeLimitMin: number = 0;
    public InitPhysiCoeLimitMin: number = 0;
    public InitArmorCoeLimitMin: number = 0;
}
