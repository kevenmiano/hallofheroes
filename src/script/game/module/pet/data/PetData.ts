import ConfigMgr from "../../../../core/config/ConfigMgr";
import GameEventDispatcher from "../../../../core/event/GameEventDispatcher";
import LangManager from "../../../../core/lang/LangManager";
import Logger from "../../../../core/logger/Logger";
import { ArrayConstant, ArrayUtils } from "../../../../core/utils/ArrayUtils";
import Dictionary from "../../../../core/utils/Dictionary";
import { Int64Utils } from "../../../../core/utils/Int64Utils";
import { SimpleDictionary } from "../../../../core/utils/SimpleDictionary";
import StringHelper from "../../../../core/utils/StringHelper";
import {
  FilterFrameText,
  eFilterFrameText,
} from "../../../component/FilterFrameText";
import { t_s_pettemplateData } from "../../../config/t_s_pettemplate";
import { t_s_skilltemplateData } from "../../../config/t_s_skilltemplate";
import t_s_upgradetemplate, {
  t_s_upgradetemplateData,
} from "../../../config/t_s_upgradetemplate";
import { BagType } from "../../../constant/BagDefine";
import { ConfigType } from "../../../constant/ConfigDefine";
import OpenGrades from "../../../constant/OpenGrades";
import { PetEvent } from "../../../constant/event/NotificationEvent";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { PlayerInfo } from "../../../datas/playerinfo/PlayerInfo";
import { ThaneInfo } from "../../../datas/playerinfo/ThaneInfo";
import { FarmManager } from "../../../manager/FarmManager";
import { GoodsManager } from "../../../manager/GoodsManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import ComponentSetting from "../../../utils/ComponentSetting";

//@ts-expect-error: External dependencies
import PetInfoMsg = com.road.yishi.proto.pet.PetInfoMsg;
import { UpgradeType } from "../../../constant/UpgradeType";

/**
 *  宠物的数据模型<br/>
 * 每升一级增加的自由点: 5<br/>
 宠物成长率为Rate<br/>
 每升一级增加的一级属性数量m=Rate/100, 力量、智力、体质、护甲都加<br/>

 总力量P=初始力量+（等级-1）*m+自由分配力量属性<br/>
 总智力I=初始智力+（等级-1）*m+自由分配智力属性<br/>
 总体质H=初始体质+（等级-1）*m+自由分配体质属性<br/>
 总护甲A=初始护甲+（等级-1）*m+自由分配护甲属性<br/>
 <br/>
 力量资质=a    <br/>
 智力资质=b    <br/>
 体质资质=c    <br/>
 护甲资质=d    <br/>
 资质分两部分: 初始资质和培养获得的资质    <br/>

 初始生命=InitHp    <br/>

 物理攻击=P*a/1000    <br/>
 魔法攻击=I*b/1000    <br/>
 物理防御=A*d/1000+P*a/1000    <br/>
 魔法防御=A*d/1000+I*b/1000    <br/>
 生命值=6*H*c/1000+InitHp    <br/>

 攻防公式    <br/>
 技能类型对应的抗性为r    <br/>
 属性攻击减免率=min(0.5,r/(500+r))    <br/>
 <br/>
 资质上限=模板资质上限*1.2^(当前品质-模板品质)    <br/>
 <br/>
 每次升阶提升的当前资质值=当前品质资质上限*0.02    <br/>
 *
 *      物攻    物防      魔攻    魔防    生命
 1力量      1.8         0.9
 1敏捷             0.9              0.9
 1智力                    1.8          0.9
 1体质                                6

 设n=当前品质-模板品质
 当前成长率=模板初始成长率*1.25^n
 每次升级提升的属性值=当前成长率/80
 当前资质上限=模板资质上限*1.2^n
 进阶获得资质值=模板初始资质值*(1.2^n-1)
 当前资质=模板初始资质值+培养获得资质值+进阶获得资质值
 */
export class PetData extends GameEventDispatcher {
  /** 使用技能书学习技能 */
  public static SPECIAL_SKILL: number = 1;
  /** 开英灵系统前的任务: 选择获取一个英灵 */
  public static FIRST_SELECT_PETLIST: number[] = [
    101101, 102101, 103101, 104101,
  ];
  /** */
  public static PETEQUIP_SONATTR_RANDOM_UP: number = 10;
  /** 每级增加的潜能点 （5）*/
  public static EACH_LEVEL_POINT: number = 5;
  /** 通用技能 */
  public static COMMON_SKILL_TYPE: number = 107;
  /** 英灵携带上限格子 */
  public static PET_CARRY_LIMIT: number = 6;
  /** 英灵默认开启携带格子 */
  public static CUR_OPEN_PET_NUM: number = 6;
  /** 觉醒技能格子数 */
  public static CHANGE_SKILL_NUM: number = 6;
  /** 最高品质 */
  public static MAX_TEM_QUALITY: number = 21;

  /** 神格炼化阶级
   * 1: 精英 2: 史诗 3: 传说
   * */
  public static REFINING_STAGE_1: number = 1;
  public static REFINING_STAGE_2: number = 2;
  public static REFINING_STAGE_3: number = 3;

  /** 升级模板类型 */
  public static UPGRAD_TYPE: number = 25;
  /** 阶级模板类型 */
  public static QUALITY_UPGRADE_TYPE: number = 27;
  public static QUALITY_UPGRADE_TYPE2: number = 29;
  /** 火系|水系|电系|风系|暗系|光系 */
  public static PET_TYPE_LIST: Array<number> = [
    101, 102, 103, 104, 105, 106, 107,
  ];

  public petId: number = 0;
  public name: string = "";
  public userId: number = 0;
  public thaneInfo: ThaneInfo;
  public template: t_s_pettemplateData;
  public remoteHp: number = 0;
  public isRemote: boolean = false;
  public remoteDie = false;
  public grade: number = 1;
  public curExp: number = 0;
  public totalExp: number = 0;
  public equipGoodsArr: Array<GoodsInfo> = [];
  /*** 当前品质经验*/
  public qualityGp: number = 0;
  //总资质经验值
  public totalQualityGp: number = 0;
  /** 寿命 */
  public life: number = 0;
  /** 战斗力 */
  public fightPower: number = 0;
  /** 力量 */
  public strength: number = 0;
  /** 智力 */
  public intellect: number = 0;
  /** 体质 */
  public stamina: number = 0;
  /** 护甲 */
  public armor: number = 0;
  /** 剩余潜能点 */
  public remainPoint: number = 0;
  /** 附加力量资质 */
  public addPowerApti: number = 0;
  /** 附加智力资质 */
  public addIntelApti: number = 0;
  /** 附加体质资质 */
  public addPhysiApti: number = 0;
  /** 附加护甲资质 */
  public addArmorApti: number = 0;
  /** 英灵装备加成属性 */
  public bagAttack: number = 0;
  public bagLiving: number = 0;
  public bagDefence: number = 0;
  public bagMagicattack: number = 0;
  public bagMagicdefence: number = 0;
  public potencyArr: Array<number> = []; //当前潜能
  public potencyOldArr: Array<number> = []; //当前潜能
  public potencyAtrArr: Array<number> = []; //潜能属性
  public artifactAtrArr: Array<number> = []; //祝福属性
  /** 力量资质上限 */
  public coeStrengthLimit: number = 0;
  /** 智力资质上限 */
  public coeIntellectLimit: number = 0;
  /** 体质资质上限 */
  public coeStaminaLimit: number = 0;
  /** 护甲资质上限 */
  public coeArmorLimit: number = 0;
  /** 力量资质 */
  public coeStrength: number = 0;
  /** 智力资质 */
  public coeIntellect: number = 0;
  /** 体质资质 */
  public coeStamina: number = 0;
  /** 护甲资质 */
  public coeArmor: number = 0;

  /** 火抗 */
  public resFire: number = 0;
  /** 水抗 */
  public resWater: number = 0;
  /** 电抗 */
  public resElect: number = 0;
  /** 风抗 */
  public resWind: number = 0;
  /** 暗抗 */
  public resDark: number = 0;
  /** 光抗 */
  public resLight: number = 0;

  /*****************状态 start**********************/
  /** 是否绑定 */
  public isBind: boolean = false;
  /** 是否选中为要保留的 */
  public isSave: boolean = false;
  /** 是否参战 */
  public isEnterWar: boolean = false;

  /** 是否修炼中 */
  public get isPractice(): boolean {
    return FarmManager.Instance.checkIsPartice(this.petId);
  }

  /** 是否被设置为农场守护者 */
  public get isDefenser(): boolean {
    return FarmManager.Instance.checkIsDefenser(this.petId);
  }

  /*****************状态 end**********************/

  /** 宠物模板Id */
  private _templateId: number = 0;
  public get templateId(): number {
    return this._templateId;
  }
  public set templateId(value: number) {
    if (this._templateId == value) {
      return;
    }
    this.template = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_pettemplate,
      value.toString(),
    );
    if (this.template) {
      this._templateId = value;
      this.updateCoeLimit();
    }
  }

  public get hp(): number {
    let result: number = Math.floor(
      (6 * this.stamina * this.coeStamina) / 1000,
    );
    if (this.template) {
      result += this.template.InitHp;
    }
    return result;
  }

  public get hpAdd(): number {
    return Math.ceil((this.staminaAdd * 6 * this.coeStamina) / 1000);
  }

  public get hpBase(): number {
    return this.hp - this.hpAdd;
  }

  public static QualityDesc = [
    LangManager.Instance.GetTranslation(
      "yishi.utils.GoodsHelp.getGoodQualityName01",
    ),
    LangManager.Instance.GetTranslation(
      "yishi.utils.GoodsHelp.getGoodQualityName02",
    ),
    LangManager.Instance.GetTranslation(
      "yishi.utils.GoodsHelp.getGoodQualityName03",
    ),
    LangManager.Instance.GetTranslation(
      "yishi.utils.GoodsHelp.getGoodQualityName04",
    ),
    LangManager.Instance.GetTranslation(
      "yishi.utils.GoodsHelp.getGoodQualityName05",
    ),
    LangManager.Instance.GetTranslation(
      "yishi.utils.GoodsHelp.getGoodQualityName06",
    ),
  ];

  public static getQualityColor(quality: number): string {
    return FilterFrameText.Colors[eFilterFrameText.PetQuality][quality];
  }

  public static getQualityDesc(quality: number): string {
    return PetData.QualityDesc[quality];
  }

  public static qualityStarIcons = [
    "",
    "Icon_Star_W",
    "Icon_Star_G",
    "Icon_Star_B",
    "Icon_Star_P",
    "Icon_Star_O",
  ];
  public static getQualityStarIcon(quality: number): string {
    return PetData.qualityStarIcons[quality];
  }

  public static calculatefightPower(p: PetData): number {
    let power: number = 700;
    power +=
      p.magicAttack +
      p.magicDefense +
      p.physicalAttack +
      p.physicalDefense +
      p.hp / 5;
    return power;
  }

  /** 每升一级增加的一级属性数量 */
  private get growWithGrade(): number {
    return this.growthRate / 80;
  }

  /** 基础力量 */
  public get strengthBase(): number {
    let result: number = 0;
    if (this.template) {
      result += this.template.Power;
    }
    result += Math.floor((this.grade - 1) * this.growWithGrade);
    return result;
  }

  /** 基础智力 */
  public get intellectBase(): number {
    let result: number = 0;
    if (this.template) {
      result += this.template.Intel;
    }
    result += Math.floor((this.grade - 1) * this.growWithGrade);
    return result;
  }

  /** 基础体质 */
  public get staminaBase(): number {
    let result: number = 0;
    if (this.template) {
      result += this.template.Physi;
    }
    result += Math.floor((this.grade - 1) * this.growWithGrade);
    return result;
  }

  /** 基础护甲 */
  public get armorBase(): number {
    let result: number = 0;
    if (this.template) {
      result += this.template.Armor;
    }
    result += Math.floor((this.grade - 1) * this.growWithGrade);
    return result;
  }

  /** 附加力量 */
  public get strengthAdd(): number {
    return this.strength - this.strengthBase;
  }

  /** 附加智力 */
  public get intellectAdd(): number {
    return this.intellect - this.intellectBase;
  }

  /** 附加体质 */
  public get staminaAdd(): number {
    return this.stamina - this.staminaBase;
  }

  /** 附加护甲 */
  public get armorAdd(): number {
    return this.armor - this.armorBase;
  }

  public get coeStrengthAutoAdd(): number {
    let result: number = Math.pow(1.2, this.quality - this.initQuality) - 1;
    let initTemp: t_s_pettemplateData =
      TempleteManager.Instance.getQualityGradeTemplate(
        this.template,
        this.initQuality,
      );
    if (initTemp) {
      result = initTemp.InitPowerCoeLimitMin * result;
    }
    return Number(result);
  }

  public get coeIntellectAutoAdd(): number {
    let result: number = Math.pow(1.2, this.quality - this.initQuality) - 1;
    let initTemp: t_s_pettemplateData =
      TempleteManager.Instance.getQualityGradeTemplate(
        this.template,
        this.initQuality,
      );
    if (initTemp) {
      result = initTemp.InitIntelCoeLimitMin * result;
    }
    return result;
  }

  public get coeStaminaAutoAdd(): number {
    let result: number = Math.pow(1.2, this.quality - this.initQuality) - 1;
    let initTemp: t_s_pettemplateData =
      TempleteManager.Instance.getQualityGradeTemplate(
        this.template,
        this.initQuality,
      );
    if (initTemp) {
      result = initTemp.InitPhysiCoeLimitMin * result;
    }
    return result;
  }

  public get coeArmorAutoAdd(): number {
    let result: number = Math.pow(1.2, this.quality - this.initQuality) - 1;
    let initTemp: t_s_pettemplateData =
      TempleteManager.Instance.getQualityGradeTemplate(
        this.template,
        this.initQuality,
      );
    if (initTemp) {
      result = initTemp.InitArmorCoeLimitMin * result;
    }
    return result;
  }

  /** 魔法攻击力 */
  public get magicAttack(): number {
    return Math.floor((this.intellect * 1.8 * this.coeIntellect) / 1000);
  }

  /** 基础魔法攻击力 */
  public get magicAttackBase(): number {
    return Math.floor((this.intellectBase * 1.8 * this.coeIntellect) / 1000);
  }

  /** 附加魔法攻击力 */
  public get magicAttackAdd(): number {
    return this.magicAttack - this.magicAttackBase;
  }

  /** 魔法防御 */
  public get magicDefense(): number {
    return Math.floor(
      (this.armor * 0.9 * this.coeArmor +
        this.intellect * 0.9 * this.coeIntellect) /
        1000,
    );
  }

  /** 基础魔法防御 */
  public get magicDefenseBase(): number {
    return Math.floor(
      (this.armorBase * 0.9 * this.coeArmor +
        this.intellect * 0.9 * this.coeIntellect) /
        1000,
    );
  }

  /** 附加魔法防御 */
  public get magicDefenseAdd(): number {
    return this.magicDefense - this.magicDefenseBase;
  }

  /** 物理攻击力 */
  public get physicalAttack(): number {
    return Math.floor((this.strength * 1.8 * this.coeStrength) / 1000);
  }

  /** 基础物理攻击力 */
  public get physicalAttackBase(): number {
    return Math.floor((this.strengthBase * 1.8 * this.coeStrength) / 1000);
  }

  /** 附加物理攻击力 */
  public get physicalAttackAdd(): number {
    return this.physicalAttack - this.physicalAttackBase;
  }

  /** 物理防御 */
  public get physicalDefense(): number {
    return Math.floor(
      (this.armor * 0.9 * this.coeArmor +
        this.strength * 0.9 * this.coeStrength) /
        1000,
    );
  }

  /** 基础物理防御 */
  public get physicalDefenseBase(): number {
    return Math.floor(
      (this.armorBase * 0.9 * this.coeArmor +
        this.strength * 0.9 * this.coeStrength) /
        1000,
    );
  }

  /** 附加物理防御 */
  public get physicalDefenseAdd(): number {
    return this.physicalDefense - this.physicalDefenseBase;
  }

  /** 附加火抗 */
  public get resFireAdd(): number {
    return this.resFire - this.resFireBase;
  }

  public get resFireBase(): number {
    if (this.template) {
      return this.template.FireResi;
    }
    return 0;
  }

  /** 附加水抗 */
  public get resWaterAdd(): number {
    return this.resWater - this.resWaterBase;
  }

  public get resWaterBase(): number {
    if (this.template) {
      return this.template.WaterResi;
    }
    return 0;
  }

  /** 附加电抗 */
  public get resElectAdd(): number {
    return this.resElect - this.resElectBase;
  }

  public get resElectBase(): number {
    if (this.template) {
      return this.template.ElectResi;
    }
    return 0;
  }

  /** 附加风抗 */
  public get resWindAdd(): number {
    return this.resWind - this.resWindBase;
  }

  public get resWindBase(): number {
    if (this.template) {
      return this.template.WindResi;
    }
    return 0;
  }

  /** 附加暗抗 */
  public get resDarkAdd(): number {
    return this.resDark - this.resDarkBase;
  }

  public get resDarkBase(): number {
    if (this.template) {
      return this.template.DarkResi;
    }
    return 0;
  }

  /** 附加光抗 */
  public get resLightAdd(): number {
    return this.resLight - this.resLightBase;
  }

  public get resLightBase(): number {
    if (this.template) {
      return this.template.LightResi;
    }
    return 0;
  }

  protected _changeObj: SimpleDictionary;

  public beginChanges() {
    this._changeObj.clear();
  }

  public commit() {
    this.dispatchEvent(PetEvent.PETINFO_CHANGE, this);
  }

  constructor() {
    super();
    this._changeObj = new SimpleDictionary();
    var reg: Function = Laya.ClassUtils.regClass;
    reg("PetData", this);
  }

  /** 所有的升级模板 */
  private static _upgradeTemplates: any[];
  public static get upgradeTemplates(): any[] {
    if (!PetData._upgradeTemplates) {
      PetData._upgradeTemplates = TempleteManager.Instance.getTemplatesByType(
        this.UPGRAD_TYPE,
      );
      PetData._upgradeTemplates = ArrayUtils.sortOn(
        PetData._upgradeTemplates,
        "Grades",
        ArrayConstant.NUMERIC,
      );
    }
    return PetData._upgradeTemplates;
  }

  /** 等级上限 */
  public static get maxGrade(): number {
    if (this.upgradeTemplates.length == 0) {
      return 0;
    }
    return this.upgradeTemplates[this.upgradeTemplates.length - 1].Grades;
  }

  /** 当前升级模板 */
  public get upgradeTemplte(): t_s_upgradetemplateData {
    if (ComponentSetting.PET_GRADE) {
      return PetData.upgradeTemplates[this.grade];
    } else {
      if (this.grade < OpenGrades.GOD_ARRIVE - 1) {
        return PetData.upgradeTemplates[this.grade];
      }
    }
    return null;
  }

  private static _qualityUpgradeTemplates: Dictionary;
  public static get qualityUpgradeTemplates(): Dictionary {
    if (!PetData._qualityUpgradeTemplates) {
      PetData._qualityUpgradeTemplates = new Dictionary();

      let arr: any[] = TempleteManager.Instance.getTemplatesByType(
        this.QUALITY_UPGRADE_TYPE,
      );
      arr = ArrayUtils.sortOn(arr, "Grades", ArrayConstant.NUMERIC);
      PetData._qualityUpgradeTemplates[PetData.REFINING_STAGE_1] = arr;

      arr = TempleteManager.Instance.getTemplatesByType(
        this.QUALITY_UPGRADE_TYPE2,
      );
      arr = ArrayUtils.sortOn(arr, "Grades", ArrayConstant.NUMERIC);
      PetData._qualityUpgradeTemplates[PetData.REFINING_STAGE_2] = arr;
    }
    return PetData._qualityUpgradeTemplates;
  }

  private _quality: number = 1;
  private _initQuality: number = 0;
  private _temQuality: number = 1;
  public get temQuality(): number {
    return this._temQuality;
  }

  public set temQuality(value: number) {
    this._temQuality = value;
    if (this._temQuality < 1) {
      this._temQuality = 1;
    }
    this.updateCoeLimit();
  }

  public get initQuality(): number {
    if (this._initQuality == 0 && this.template) {
      return this.template.Quality;
    }
    return this._initQuality;
  }

  public set initQuality(value: number) {
    this._initQuality = value;
  }

  public getQuaityTotalGp(): number {
    let gp: number = this.qualityGp;

    let list: any[] = PetData.qualityUpgradeTemplates[this.template.Property2];
    if (!list) return null;

    let bornQuality: number = 0;
    for (let i: number = bornQuality; i < this.quality; i++) {
      let upgradeTemp: t_s_upgradetemplateData = list[i];
      if (upgradeTemp) {
        gp += upgradeTemp.Data;
      }
    }
    return gp;
  }

  /**
   * 品质
   */
  public get quality(): number {
    return this._quality;
  }

  /** 成长率 */
  public get growthRate(): number {
    return this.getGrowthRate(this.temQuality);
  }

  public getGrowthRate(q: number): number {
    return PetData.calculateCoeLimit(this.template, q, "lateCoeLimit");
  }

  public set quality(value: number) {
    this._quality = value;
    if (this._quality < 1) {
      this._quality = 1;
    }
  }

  private updateCoeLimit() {
    if (!this.template) {
      return;
    }
    this.coeStrengthLimit = PetData.calculateCoeLimit(
      this.template,
      this.temQuality,
      "PowerCoeLimit",
    );
    this.coeIntellectLimit = PetData.calculateCoeLimit(
      this.template,
      this.temQuality,
      "IntelCoeLimit",
    );
    this.coeStaminaLimit = PetData.calculateCoeLimit(
      this.template,
      this.temQuality,
      "PhysiCoeLimit",
    );
    this.coeArmorLimit = PetData.calculateCoeLimit(
      this.template,
      this.temQuality,
      "ArmorCoeLimit",
    );
  }

  /**
   * 计算资质上限
   * @param baseCoe 基础资质上限, 模板决定
   * @param baseQuality 模板里的品质
   * @param curQuality 当前的品质
   * @return
   *
   */
  public static calculateCoeLimit(
    temp: t_s_pettemplateData,
    curQuality: number,
    type: string,
  ): number {
    let quality: number = Math.floor((curQuality - 1) / 5 + 1);
    let level: number = Math.floor(curQuality % 5 == 0 ? 5 : curQuality % 5);
    level -= 1;
    let tempId: number = temp.TemplateId + quality - temp.Quality;
    let currTemp: t_s_pettemplateData = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_pettemplate,
      tempId.toString(),
    );
    let nextTemp: t_s_pettemplateData = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_pettemplate,
      (tempId + 1).toString(),
    );
    let currNum: number = 0;
    let nextNum: number = 0;
    if (currTemp == null) {
      return 0;
    }

    switch (type) {
      case "PowerCoeLimit":
        currNum = currTemp.InitPowerCoeLimit;
        if (nextTemp == null) {
          return currNum;
        }
        nextNum = nextTemp.InitPowerCoeLimit;
        break;
      case "IntelCoeLimit":
        currNum = currTemp.InitIntelCoeLimit;
        if (nextTemp == null) {
          return currNum;
        }
        nextNum = nextTemp.InitIntelCoeLimit;
        break;
      case "PhysiCoeLimit":
        currNum = currTemp.InitPhysiCoeLimit;
        if (nextTemp == null) {
          return currNum;
        }
        nextNum = nextTemp.InitPhysiCoeLimit;
        break;
      case "ArmorCoeLimit":
        currNum = currTemp.InitArmorCoeLimit;
        if (nextTemp == null) {
          return currNum;
        }
        nextNum = nextTemp.InitArmorCoeLimit;
        break;
      case "lateCoeLimit":
        currNum = currTemp.GrowthRate;
        if (nextTemp == null) {
          return currNum;
        }
        nextNum = nextTemp.GrowthRate;
        break;
      case "CoeStrength":
        currNum = currTemp.InitPowerCoeLimitMin;
        if (nextTemp == null) {
          return currNum;
        }
        nextNum = nextTemp.InitPowerCoeLimitMin;
        break;
      case "CoeArmor":
        currNum = currTemp.InitArmorCoeLimitMin;
        if (nextTemp == null) {
          return currNum;
        }
        nextNum = nextTemp.InitArmorCoeLimitMin;
        break;
      case "CoeIntellect":
        currNum = currTemp.InitIntelCoeLimitMin;
        if (nextTemp == null) {
          return currNum;
        }
        nextNum = nextTemp.InitIntelCoeLimitMin;
        break;
      case "CoeStamina":
        currNum = currTemp.InitPhysiCoeLimitMin;
        if (nextTemp == null) {
          return currNum;
        }
        nextNum = nextTemp.InitPhysiCoeLimitMin;
        break;
    }
    return currNum + Math.floor((nextNum - currNum) / 5) * level;
  }

  public static calculateCoeLimitMin(
    serNum: number,
    temp: t_s_pettemplateData,
    curQuality: number,
    type: string,
  ): number {
    let quality: number = Math.floor((curQuality - 1) / 5 + 1);
    let level: number = Math.floor(curQuality % 5 == 0 ? 5 : curQuality % 5);
    level -= 1;
    let tempId: number = temp.TemplateId + quality - temp.Quality;
    let currTemp: t_s_pettemplateData = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_pettemplate,
      tempId.toString(),
    );
    let nextTemp: t_s_pettemplateData = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_pettemplate,
      (tempId + 1).toString(),
    );
    let nextNum: number = 0;
    let currNum: number = 0;
    let qNum: number;
    if (currTemp == null) {
      return 0;
    }
    qNum = this.calculateCoeLimit(temp, curQuality - 1, type);
    switch (type) {
      case "CoeStrength":
        currNum = currTemp.InitPowerCoeLimitMin;
        if (nextTemp == null) {
          return currNum + (serNum - qNum);
        }
        nextNum = nextTemp.InitPowerCoeLimitMin;
        break;
      case "CoeArmor":
        currNum = currTemp.InitArmorCoeLimitMin;
        if (nextTemp == null) {
          return currNum + (serNum - qNum);
        }
        nextNum = nextTemp.InitArmorCoeLimitMin;
        break;
      case "CoeIntellect":
        currNum = currTemp.InitIntelCoeLimitMin;
        if (nextTemp == null) {
          return currNum + (serNum - qNum);
        }
        nextNum = nextTemp.InitIntelCoeLimitMin;
        break;
      case "CoeStamina":
        currNum = currTemp.InitPhysiCoeLimitMin;
        if (nextTemp == null) {
          return currNum + (serNum - qNum);
        }
        nextNum = nextTemp.InitPhysiCoeLimitMin;
        break;
    }
    return (
      currNum + Math.floor((nextNum - currNum) / 5) * level + (serNum - qNum)
    );
  }

  private findQualityUpgradeTemplateInfo(
    grade: number,
  ): t_s_upgradetemplateData {
    if (!this.template) return null;
    let list: any[] = PetData.qualityUpgradeTemplates[
      this.template.Property2
    ] as Array<any>;
    if (!list) return null;

    for (let index = 0; index < list.length; index++) {
      const upgradeTemp = list[index];
      if (upgradeTemp && upgradeTemp.Grades == grade) {
        return upgradeTemp;
      }
    }
    return null;
  }

  // public get coeStrengthInit(): number {
  // 	if (this.template) {
  // 		return this.template.InitPowerCoeLimit;
  // 	}
  // 	return 0;
  // }

  // public get coeIntellectInit(): number {
  // 	if (this.template) {
  // 		return this.template.InitIntelCoeLimit;
  // 	}
  // 	return 0;
  // }

  // public get coeStaminaInit(): number {
  // 	if (this.template) {
  // 		return this.template.InitPhysiCoeLimit;
  // 	}
  // 	return 0;
  // }

  // public get coeArmorInit(): number {
  // 	if (this.template) {
  // 		return this.template.InitArmorCoeLimit;
  // 	}
  // 	return 0;
  // }

  /** 品质升级模板 下一级*/
  public get qualityUpgradeTemplateInfo(): t_s_upgradetemplateData {
    return this.findQualityUpgradeTemplateInfo(this.temQuality + 1);
  }

  /** 品质升级模板 当前级*/
  public get currentQualityUpgradeTemplateInfo(): t_s_upgradetemplateData {
    return this.findQualityUpgradeTemplateInfo(this.temQuality);
  }

  /**
   * 资质是否已满
   * @return
   *
   */
  public isFullRes(): boolean {
    let isFull: boolean = false;
    if (
      this.coeArmor >= this.coeArmorLimit &&
      this.coeIntellect >= this.coeIntellectLimit &&
      this.coeStamina >= this.coeStaminaLimit &&
      this.coeStrength >= this.coeStrengthLimit
    ) {
      isFull = true;
    }
    return isFull;
  }

  /**
   * 是否满经验, 等级与人物等级相同, 并且满了, 或者已经最高级
   * @param petData
   * @return
   *
   */
  public isFullExp(): boolean {
    if (this.thaneInfo) {
      let thaneGrade: number = this.thaneInfo.grades;
      if (this.grade == PetData.maxGrade) {
        return true;
      }
      if (
        this.grade > thaneGrade ||
        (this.grade == thaneGrade && this.curExp >= this.upgradeTemplte.Data)
      ) {
        return true;
      }
    }
    return false;
  }

  /**
   * 转换为一个物品
   * @return GoodsInfo, 并有petData属性
   *
   */
  public convertToGoods(): GoodsInfo {
    let goods: GoodsInfo = new GoodsInfo();
    goods.petData = this;
    goods.count = 1;
    goods.templateId = -900; //空的封印卡
    goods.isBinds = this.isBind;
    return goods;
  }

  ////////////////////////////// 技能 begin/////////////////////////////////////
  /** [只读] */
  public followSkillTemplates: t_s_skilltemplateData[] = [];
  /** [只读] 变身后的技能 包括被动 */
  public changeSkillTemplates: t_s_skilltemplateData[] = [];
  /** 跟随技能 */
  private _followSkills: string = "";
  /** 已学会的变身技能 */
  private _changeSkills: string = "";
  /** 英灵变身携带的技能  记录的是changeSkills下标*/
  private _petFastKeyOfString: string = "";
  /** 英灵远征携带的技能  记录的是changeSkills下标*/
  private _remotePetSkillsOfString: string = "";
  /** 英灵竞技携带的技能  记录的是技能sontype*/
  private _petChallengeSkillsOfString: string;

  /** 当前使用技能索引 */
  public skillIndex: number = 0;
  public atkpotential: number = 0; //物攻潜能
  public matpotential: number = 0; //魔攻潜能
  public defpotential: number = 0; //物防潜能
  public mdfpotential: number = 0; //魔防潜能
  public hppotential: number = 0; //生命潜能

  public atkpotentialAtr: number = 0; //物攻潜能属性
  public matpotentialAtr: number = 0; //魔攻潜能属性
  public defpotentialAtr: number = 0; //物防潜能属性
  public mdfpotentialAtr: number = 0; //魔防潜能属性
  public hppotentialAtr: number = 0; //生命潜能属性

  public atkbeneAtr: number = 0; //物攻祝福属性
  public matbeneAtr: number = 0; //魔攻祝福属性
  public defbeneAtr: number = 0; //物防祝福属性
  public mdfbeneAtr: number = 0; //魔防祝福属性
  public hpbeneAtr: number = 0; //生命祝福属性

  /** 是否激活第二套技能 */
  public isActiveSecond: boolean = false;
  // 编辑技能快捷键的缓存（变身技能、英灵竞技技能、不包括英灵远征技能）
  public static FastSkillKeyTemp: string = "";
  public static inFastSkillKeyTemp(sontype: number): boolean {
    if (!this.FastSkillKeyTemp) {
      return false;
    }

    let arr: string[] = this.FastSkillKeyTemp.split(",");
    return arr.indexOf(sontype.toString()) != -1;
  }

  public get followSkills(): string {
    return this._followSkills;
  }
  public set followSkills(value: string) {
    this._followSkills = value;
    this.followSkillTemplates =
      TempleteManager.Instance.getSkillTemplateInfoByIds(value);
  }

  public get changeSkills(): string {
    return this._changeSkills;
  }
  public set changeSkills(value: string) {
    if (this._changeSkills == value && this.changeSkillTemplates.length > 0) {
      return;
    }

    this.changeSkillTemplates =
      TempleteManager.Instance.getSkillTemplateInfoByIds(value);
    let newSkillTemp = null;
    if (this._changeSkills.length > 0 && value.length > 0) {
      if (value.length - this._changeSkills.length > 0) {
        // 新增技能 暂时只支持一个
        newSkillTemp =
          this.changeSkillTemplates[this.changeSkillTemplates.length - 1];
      }
    }
    Logger.info(
      "PetData.changeSkills",
      value,
      newSkillTemp,
      this.changeSkillTemplates,
    );
    this._changeSkills = value;
    this.dispatchEvent(PetEvent.PET_CHANGE_SKILL_CHANGE, this, newSkillTemp);
  }

  /** 所有主动技能 */
  public get activeSkillList(): any[] {
    let list: any[] = [];
    for (const sTemp of this.changeSkillTemplates) {
      if (sTemp && sTemp.UseWay == 1) {
        list.push(sTemp);
      }
    }
    return list;
  }

  /** 所有被动技能 */
  public get passiveSkillList(): any[] {
    let list: any[] = [];
    for (const sTemp of this.changeSkillTemplates) {
      if (sTemp && sTemp.UseWay == 2) {
        list.push(sTemp);
      }
    }
    return list;
  }

  public get petFastKeyOfString(): string {
    return this._petFastKeyOfString;
  }

  public set petFastKeyOfString(value: string) {
    if (this._petFastKeyOfString == value) {
      return;
    }
    this._petFastKeyOfString = value;
    this.dispatchEvent(PetEvent.PET_FAST_SKILL_CHANGE, this);
  }

  public get remotePetSkillsOfString(): string {
    return this._remotePetSkillsOfString;
  }

  public set remotePetSkillsOfString(value: string) {
    if (this._remotePetSkillsOfString == value) return;
    this._remotePetSkillsOfString = value;
    this.dispatchEvent(PetEvent.PET_REMOTE_SKILL_CHANGE, this);
  }

  public get remotePetSkillList(): t_s_skilltemplateData[] {
    let list = [null, null, null];
    if (!this._remotePetSkillsOfString) return list;
    if (!this._changeSkills) return list;
    let arr = this._remotePetSkillsOfString.split(",");
    for (var i: number = 0; i < arr.length; i++) {
      var index: number = parseInt(arr[i]);
      if (isNaN(index) || index < 0) {
        list[i] = null;
      } else {
        list[i] = this.changeSkillTemplates[index];
      }
    }
    return list;
  }

  public get petChallengeSkillsOfString(): string {
    return this._petChallengeSkillsOfString;
  }

  public set petChallengeSkillsOfString(value: string) {
    if (this._petChallengeSkillsOfString == value) {
      return;
    }
    this._petChallengeSkillsOfString = value;
    this.dispatchEvent(PetEvent.PET_CHALLENGE_SKILL_CHANGE, this);
  }

  public get petChallengeSkillList(): t_s_skilltemplateData[] {
    let list: t_s_skilltemplateData[] = [null, null, null];
    if (!this.petChallengeSkillsOfString) {
      return list;
    }
    if (!this._changeSkills) {
      return list;
    }
    let arr: string[] = this.petChallengeSkillsOfString.split(",");
    for (let i: number = 0; i < arr.length; i++) {
      let index: number = parseInt(arr[i]);
      if (isNaN(index) || index < 0) {
        list[i] = null;
      } else {
        list[i] = this.changeSkillTemplates[index];
      }
    }
    return list;
  }

  /** 切换技能 */
  public get changeSkillIndex() {
    if (this.skillIndex == 0) {
      return 1;
    } else {
      return 0;
    }
  }

  /** 检查是否已学会该技能  */
  public checkSkillIsLearned(skillTempId: number): boolean {
    for (const sTemp of this.changeSkillTemplates) {
      if (sTemp && sTemp.TemplateId == skillTempId) {
        return true;
      }
    }
    return false;
  }

  public getChangeSkillTemplate(sontype: number): t_s_skilltemplateData {
    for (const sTemp of this.changeSkillTemplates) {
      if (sTemp && sTemp.SonType == sontype) {
        return sTemp;
      }
    }
    return null;
  }
  ////////////////////////////// 技能 end/////////////////////////////////////

  public get playerInfo(): PlayerInfo {
    return PlayerManager.Instance.currentPlayerModel.playerInfo;
  }

  /**
   * 英灵技能输出类型文字
   * @return
   *
   */
  public get petSkillOutPutTypeLanguage(): string {
    let s: string = LangManager.Instance.GetTranslation(
      "pet.petSkillOutputTypeList",
    );
    let att: any[] = s.split("|");
    let index: number = this.template.PetType - 100;
    if (index > att.length) {
      return "";
    }
    return att[index - 1];
  }

  /**
   * 英灵属性对应的文字
   * @return
   *
   */
  public get petTypeLanguage(): string {
    let s: string = LangManager.Instance.GetTranslation("pet.petTypeList");
    let att: any[] = s.split("|");
    let index: number = this.template.PetType - 100;
    return att[index - 1];
  }

  public static getPetTypeLanguage(type: number): string {
    let s: string = LangManager.Instance.GetTranslation("pet.petTypeList");
    let att: any[] = s.split("|");
    let index: number = type - 100;
    return att[index - 1];
  }
  /**
   * 英灵阶对应的文字
   *
   */
  public get petStageLanguage(): string {
    let s: string = LangManager.Instance.GetTranslation("pet.petStageList");
    let att: any[] = s.split("|");
    let index: number = this.template.Property2;
    return att[index - 1];
  }

  public clone(): PetData {
    let p: PetData = new PetData();
    p.templateId = this.templateId;
    p.name = this.name;
    p.curExp = this.curExp;
    p.totalExp = this.totalExp;
    p.grade = this.grade;
    p.fightPower = this.fightPower;
    p.initQuality = this.initQuality;
    p.quality = this.quality;
    p.temQuality = this.temQuality;
    p.qualityGp = this.qualityGp;
    p.isEnterWar = this.isEnterWar;
    p.isBind = this.isBind;
    p.strength = this.strength;
    p.stamina = this.stamina;
    p.armor = this.armor;
    p.intellect = this.intellect;
    p.remainPoint = this.remainPoint;
    p.addPowerApti = this.addPowerApti;
    p.addIntelApti = this.addIntelApti;
    p.addPhysiApti = this.addPhysiApti;
    p.addArmorApti = this.addArmorApti;
    p.coeStrength = this.coeStrength;
    p.coeIntellect = this.coeIntellect;
    p.coeStamina = this.coeStamina;
    p.coeArmor = this.coeArmor;
    p.resFire = this.resFire;
    p.resWater = this.resWater;
    p.resElect = this.resElect;
    p.resWind = this.resWind;
    p.resDark = this.resDark;
    p.resLight = this.resLight;
    p.followSkills = this.followSkills;
    p.changeSkills = this.changeSkills;
    p.petChallengeSkillsOfString = this.petChallengeSkillsOfString;
    p.remotePetSkillsOfString = this.remotePetSkillsOfString;
    p.petFastKeyOfString = this.petFastKeyOfString;
    return p;
  }

  /** 读取宠物信息 */
  public static createWithMsg(
    petMsg: PetInfoMsg,
    pet: PetData = null,
  ): PetData {
    if (!pet) {
      pet = new PetData();
    }
    if (petMsg.hasOwnProperty("petId")) {
      pet.petId = petMsg.petId;
    }

    if (petMsg.hasOwnProperty("templateId")) {
      pet.templateId = petMsg.templateId;
    }
    if (petMsg.hasOwnProperty("petName")) {
      pet.name = petMsg.petName;
    }
    if (petMsg.hasOwnProperty("curGp")) {
      pet.curExp = petMsg.curGp;
    }
    if (petMsg.hasOwnProperty("totalGp")) {
      let tempTotalExp = petMsg.totalGp as any;
      if (tempTotalExp.high) {
        pet.totalExp = Int64Utils.int64ToNumber(tempTotalExp);
      } else {
        pet.totalExp = Number(petMsg.totalGp);
      }
    }
    if (petMsg.hasOwnProperty("curGrade")) {
      pet.grade = petMsg.curGrade;
    }
    if (petMsg.hasOwnProperty("fightingCapacity")) {
      pet.fightPower = petMsg.fightingCapacity;
    }
    if (petMsg.hasOwnProperty("quality")) {
      pet.quality = Math.floor((petMsg.quality - 1) / 5) + 1;
    }
    pet.temQuality = petMsg.quality;
    if (petMsg.hasOwnProperty("initQuality")) {
      pet.initQuality = petMsg.initQuality;
    }
    if (petMsg.hasOwnProperty("curQualityGp")) {
      pet.qualityGp = petMsg.curQualityGp;
    } else {
      pet.qualityGp = 0;
    }

    if (petMsg.hasOwnProperty("isFight")) {
      pet.isEnterWar = petMsg.isFight;
    } else {
      pet.isEnterWar = false;
    }
    if (petMsg.hasOwnProperty("isBind")) {
      pet.isBind = petMsg.isBind;
    }

    if (petMsg.hasOwnProperty("power")) {
      pet.strength = petMsg.power;
    }
    if (petMsg.hasOwnProperty("intel")) {
      pet.intellect = petMsg.intel;
    }
    if (petMsg.hasOwnProperty("physi")) {
      pet.stamina = petMsg.physi;
    }
    if (petMsg.hasOwnProperty("armor")) {
      pet.armor = petMsg.armor;
    }

    if (petMsg.hasOwnProperty("remainPoints")) {
      pet.remainPoint = petMsg.remainPoints;
    }
    if (petMsg.hasOwnProperty("totalQualityGp")) {
      pet.totalQualityGp = petMsg.totalQualityGp;
    }

    if (petMsg.hasOwnProperty("addPowerApti")) {
      pet.addPowerApti = petMsg.addPowerApti;
    }
    if (petMsg.hasOwnProperty("addIntelApti")) {
      pet.addIntelApti = petMsg.addIntelApti;
    }
    if (petMsg.hasOwnProperty("addPhysiApti")) {
      pet.addPhysiApti = petMsg.addPhysiApti;
    }
    if (petMsg.hasOwnProperty("addArmorApti")) {
      pet.addArmorApti = petMsg.addArmorApti;
    }

    if (petMsg.hasOwnProperty("powerApti")) {
      pet.coeStrength = petMsg.powerApti;
    }
    if (petMsg.hasOwnProperty("intelApti")) {
      pet.coeIntellect = petMsg.intelApti;
    }
    if (petMsg.hasOwnProperty("physiApti")) {
      pet.coeStamina = petMsg.physiApti;
    }
    if (petMsg.hasOwnProperty("armorApti")) {
      pet.coeArmor = petMsg.armorApti;
    }

    if (petMsg.hasOwnProperty("fireResi")) {
      pet.resFire = petMsg.fireResi;
    }
    if (petMsg.hasOwnProperty("waterResi")) {
      pet.resWater = petMsg.waterResi;
    }
    if (petMsg.hasOwnProperty("electResi")) {
      pet.resElect = petMsg.electResi;
    }
    if (petMsg.hasOwnProperty("windResi")) {
      pet.resWind = petMsg.windResi;
    }
    if (petMsg.hasOwnProperty("darkResi")) {
      pet.resDark = petMsg.darkResi;
    }
    if (petMsg.hasOwnProperty("lightResi")) {
      pet.resLight = petMsg.lightResi;
    }

    if (petMsg.hasOwnProperty("followSkills")) {
      pet.followSkills = petMsg.followSkills;
    }
    if (petMsg.hasOwnProperty("changeSkills")) {
      pet.changeSkills = petMsg.changeSkills;
    }

    if (petMsg.hasOwnProperty("chaSkillIndexs")) {
      pet.petChallengeSkillsOfString = petMsg.chaSkillIndexs;
    }
    if (petMsg.hasOwnProperty("fastKey")) {
      pet.petFastKeyOfString = petMsg.fastKey;
    }

    if (petMsg.hasOwnProperty("isLocked")) {
      pet.isLock = petMsg.isLocked;
    }
    if (petMsg.hasOwnProperty("bagAttack")) {
      pet.bagAttack = petMsg.bagAttack;
    } else {
      pet.bagAttack = 0;
    }
    if (petMsg.hasOwnProperty("bagDefence")) {
      pet.bagDefence = petMsg.bagDefence;
    } else {
      pet.bagDefence = 0;
    }
    if (petMsg.hasOwnProperty("bagMagicattack")) {
      pet.bagMagicattack = petMsg.bagMagicattack;
    } else {
      pet.bagMagicattack = 0;
    }
    if (petMsg.hasOwnProperty("bagMagicdefence")) {
      pet.bagMagicdefence = petMsg.bagMagicdefence;
    } else {
      pet.bagMagicdefence = 0;
    }
    if (petMsg.hasOwnProperty("bagLiving")) {
      pet.bagLiving = petMsg.bagLiving;
    } else {
      pet.bagLiving = 0;
    }

    if (petMsg.hasOwnProperty("remoteHp")) pet.remoteHp = petMsg.remoteHp;
    if (petMsg.hasOwnProperty("remotePetSkillIndexs")) {
      pet.remotePetSkillsOfString = petMsg.remotePetSkillIndexs;
    }
    if (petMsg.hasOwnProperty("isRemote")) pet.isRemote = petMsg.isRemote;
    else pet.isRemote = false;

    if (petMsg.hasOwnProperty("remoteDie")) pet.remoteDie = petMsg.remoteDie;
    else pet.remoteDie = false;
    if (petMsg.hasOwnProperty("skillIndex")) {
      pet.skillIndex = petMsg.skillIndex;
    } else {
      pet.skillIndex = 0;
    }
    pet.atkpotential = petMsg.atkpotential;
    pet.matpotential = petMsg.matpotential;
    pet.defpotential = petMsg.defpotential;
    pet.mdfpotential = petMsg.mdfpotential;
    pet.hppotential = petMsg.hppotential;
    pet.potencyArr = [
      pet.atkpotential,
      pet.matpotential,
      pet.defpotential,
      pet.mdfpotential,
      pet.hppotential,
    ];
    pet.atkpotentialAtr = petMsg.atkpotentialAtr;
    pet.matpotentialAtr = petMsg.matpotentialAtr;
    pet.defpotentialAtr = petMsg.defpotentialAtr;
    pet.mdfpotentialAtr = petMsg.mdfpotentialAtr;
    pet.hppotentialAtr = petMsg.hppotentialAtr;
    pet.potencyAtrArr = [
      pet.atkpotentialAtr,
      pet.matpotentialAtr,
      pet.defpotentialAtr,
      pet.mdfpotentialAtr,
      pet.hppotentialAtr,
    ];
    pet.atkbeneAtr = petMsg.atkbeneAtr;
    pet.matbeneAtr = petMsg.matbeneAtr;
    pet.defbeneAtr = petMsg.defbeneAtr;
    pet.mdfbeneAtr = petMsg.mdfbeneAtr;
    pet.hpbeneAtr = petMsg.hpbeneAtr;
    pet.artifactAtrArr = [
      pet.atkbeneAtr,
      pet.matbeneAtr,
      pet.defbeneAtr,
      pet.mdfbeneAtr,
      pet.hpbeneAtr,
    ];
    if (petMsg.hasOwnProperty("isActiveSecond"))
      pet.isActiveSecond = petMsg.isActiveSecond;
    else pet.isActiveSecond = false;

    Logger.info(
      "英灵信息",
      petMsg,
      pet,
      petMsg.skillIndex,
      petMsg.isActiveSecond,
      petMsg.changeSkills,
      petMsg.fastKey,
    );
    return pet;
  }
  /**
   *
   * @param str 宠物模板ID,宠物品质,当前品质经验,品质总经验, 当前等级,当前宠物经验,宠物总经验,|
   * 力量资质,智力资质,体质资质,护甲资质, 力量, 智力, 体质, 护甲 |
   * 火系抗性, 水系抗性 电系抗性 风系抗性 暗系抗性 光系抗性 |
   * 跟随技能 |
   * 变身技能|ddd
   * @return
   */
  public static createWidthString(str: string): PetData {
    if (StringHelper.isNullOrEmpty(str)) {
      return null;
    }
    let petData: PetData = new PetData();
    let arr: any[] = str.split("|");
    let arr01: any[] = (arr[0] as string).split(",");
    petData.templateId = parseInt(arr01[0]);
    petData.name = petData.template.TemplateNameLang;
    petData.quality = (parseInt(arr01[1]) - 1) / 5 + 1;
    petData.temQuality = parseInt(arr01[1]);
    petData.qualityGp = parseInt(arr01[2]);
    petData.grade = parseInt(arr01[4]);
    petData.curExp = parseInt(arr01[5]);
    petData.totalExp = Number(arr01[6]);
    if (arr01[7]) {
      petData.initQuality = Number(arr01[7]);
    }

    let arr02: any[] = (arr[1] as string).split(",");
    petData.coeStrength = Number(arr02[0]);
    petData.coeIntellect = Number(arr02[1]);
    petData.coeStamina = Number(arr02[2]);
    petData.coeArmor = Number(arr02[3]);
    petData.strength = Number(arr02[4]);
    petData.intellect = Number(arr02[5]);
    petData.stamina = Number(arr02[6]);
    petData.armor = Number(arr02[7]);
    petData.remainPoint =
      (petData.grade - 1) * PetData.EACH_LEVEL_POINT -
      (petData.staminaAdd +
        petData.strengthAdd +
        petData.intellectAdd +
        petData.armorAdd);

    let arr03: any[] = (arr[2] as string).split(",");
    petData.resFire = Number(arr03[0]);
    petData.resWater = Number(arr03[1]);
    petData.resElect = Number(arr03[2]);
    petData.resWind = Number(arr03[3]);
    petData.resDark = Number(arr03[4]);
    petData.resLight = Number(arr03[5]);

    petData.followSkills = arr[3] as string;
    petData.changeSkills = arr[4] as string;

    petData.fightPower = PetData.calculatefightPower(petData);

    return petData;
  }

  /**
   *  从xml中序列化
   * <PetCapabilityRankInfo IsBinding="false" FightCapacity="543"
   * ChangeSkills="717101,713001,714101,713201"
   * FollowSkills="710101,711101,712101"
   * LightResi="0" DarkResi="0" WindResi="0" ElectResi="0" WaterResi="0"
   * FireResi="0" GrowthRate="0" ArmorApt="0" PhysiApt="0" IntelApt="0"
   * PowerApt="0" InitArmorApt="720" InitPhysiApt="0" InitIntelApt="1278"
   * InitPowerApt="167" Armor="0" Physi="0" Intel="0" Power="0" TotalGp="0"
   * CurGp="0" CurGrade="1" TotalQualityGp="0" CurQualityGp="0" Quality="1"
   * TemplateId="102101" PetName="伊里斯" VipType="1" IsVip="true"
   * NickName="sam测试号1" Rank="0" UserId="29" PetId="144"/>
   * @param xml
   * @return
   *
   */
  public static createWithXML(xml): PetData {
    let petData: PetData = new PetData();
    petData.petId = parseInt(xml.PetId);
    petData.templateId = parseInt(xml.TemplateId);
    if (xml.petName) {
      petData.name = xml.PetName;
    } else {
      petData.name = petData.template.TemplateNameLang;
    }
    petData.isBind = xml.IsBinding == "true" ? true : false;
    petData.initQuality = parseInt(xml.InitQuality);
    petData.quality = (parseInt(xml.Quality) - 1) / 5 + 1;
    petData.temQuality = xml.Quality;
    petData.qualityGp = parseInt(xml.CurQualityGp);
    petData.grade = parseInt(xml.CurGrade);
    petData.curExp = parseInt(xml.CurGp);
    petData.totalExp = Number(xml.TotalGp);

    petData.coeStrength = Number(xml.PowerApt);
    petData.coeIntellect = Number(xml.IntelApt);
    petData.coeStamina = Number(xml.PhysiApt);
    petData.coeArmor = Number(xml.ArmorApt);
    petData.strength = Number(xml.Power);
    petData.intellect = Number(xml.Intel);
    petData.stamina = Number(xml.Physi);
    petData.armor = Number(xml.Armor);
    petData.remainPoint =
      (petData.grade - 1) * PetData.EACH_LEVEL_POINT -
      (petData.staminaAdd +
        petData.strengthAdd +
        petData.intellectAdd +
        petData.armorAdd);

    petData.resFire = Number(xml.FireResi);
    petData.resWater = Number(xml.WaterResi);
    petData.resElect = Number(xml.ElectResi);
    petData.resWind = Number(xml.WindResi);
    petData.resDark = Number(xml.DarkResi);
    petData.resLight = Number(xml.LightResi);

    petData.followSkills = xml.FollowSkills;
    petData.changeSkills = xml.ChangeSkills;

    petData.fightPower = Number(xml.FightCapacity);

    return petData;
  }

  /**
   * 优先使用绑定的, 背包位置靠前的物品
   * @param tempid
   * @param type 0 第一位,  1 绑定第一位 2 未绑定第一位
   */
  public static getUseSkillBook(tempid: number, type: number = 0): GoodsInfo {
    let find: GoodsInfo;
    let goodsInfoList: any[] =
      GoodsManager.Instance.getBagGoodsByTemplateId(tempid);
    if (goodsInfoList.length <= 0) {
      return null;
    }

    goodsInfoList = ArrayUtils.sortOn(
      goodsInfoList,
      ["isBinds", "pos"],
      ArrayConstant.DESCENDING | ArrayConstant.NUMERIC,
    );
    if (type == 0) {
      find = goodsInfoList[0];
    } else if (type == 1) {
      for (let index = 0; index < goodsInfoList.length; index++) {
        const info = goodsInfoList[index];
        if (info.isBinds) {
          find = info;
          break;
        }
      }
    } else if (type == 2) {
      for (let index = 0; index < goodsInfoList.length; index++) {
        const info = goodsInfoList[index];
        if (!info.isBinds) {
          find = info;
          break;
        }
      }
    }

    return find;
  }

  /**
   * 英灵身上是否已穿装备
   */
  isEquiped() {
    let equipArr = GoodsManager.Instance.getGoodsByBagType(
      BagType.PET_EQUIP_BAG,
    );
    for (let i = 0; i < equipArr.length; i++) {
      const goodsInfo = equipArr[i];
      //判断英灵是否有穿戴装备
      if (goodsInfo.objectId == this.petId) {
        return true;
      }
    }
    return false;
  }

  /**
   * 被分解英灵会根据培养数值返回对应数量的凝神珠（培养总值）和圣魂石（总经验值/12），加上英灵本身献祭所得的凝神珠
   */
  public calcResolveCornea(): number {
    return (
      this.addPowerApti +
      this.addIntelApti +
      this.addPhysiApti +
      this.addArmorApti +
      2
    );
  }
  public calcResolveSoulStone(): number {
    let result = this.totalQualityGp;
    let temps = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_upgradetemplate,
      "Types" + UpgradeType.UPGRADE_TYPE_SOUL_STONE,
    ) as t_s_upgradetemplateData[];
    if (temps) {
      for (let temp of temps) {
        if (temp && temp.Grades <= this.initQuality) {
          result += temp.Data;
        }
      }
    }
    result = Number(Math.ceil(result / 12));
    Logger.log("totalQualityGp:", this.totalQualityGp, "取整后为：", result);
    return result;
  }

  /**
   *二级密码锁 true:已上锁
   */
  public isLock: boolean = false;

  public ismind: boolean;
  /**提醒 */
  public remind: string;
  /**标题 */
  public title: string;
}
