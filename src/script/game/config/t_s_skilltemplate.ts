/*
 * t_s_skilltemplate
 */
import ConfigMgr from "../../core/config/ConfigMgr";
import { ConfigType } from "../constant/ConfigDefine";
import LangManager from "../../core/lang/LangManager";
import { t_s_actionData } from "./t_s_action";
import { t_s_talenteffecttemplateData } from "./t_s_talenteffecttemplate";
import { BattleManager } from "../battle/BattleManager";
import { BufferDamageData } from "../battle/data/BufferDamageData";
import { ArmyManager } from "../manager/ArmyManager";
import { t_s_skillbuffertemplateData } from "./t_s_skillbuffertemplate";
import StringHelper from "../../core/utils/StringHelper";
import t_s_baseConfigData from "./t_s_baseConfigData";
import SkillWndData from "../module/skill/SkillWndData";
import { EmWindow } from "../constant/UIDefine";
import SkillWndCtrl from "../module/skill/SkillWndCtrl";
import { FrameCtrlManager } from "../mvc/FrameCtrlManager";
import Logger from "../../core/logger/Logger";
import { ThaneInfo } from "../datas/playerinfo/ThaneInfo";
import { GoodsManager } from "../manager/GoodsManager";
import { t_s_suitetemplateData } from "./t_s_suitetemplate";
import { GoodsInfo } from "../datas/goods/GoodsInfo";
import PetCtrl from "../module/pet/control/PetCtrl";
import PetWnd from "../module/pet/view/PetWnd";
import { PetData } from "../module/pet/data/PetData";
import { PlayerInfo } from "../datas/playerinfo/PlayerInfo";
import { PlayerManager } from "../manager/PlayerManager";
import { BagType } from "../constant/BagDefine";
import { t_s_petequipsuitData } from "./t_s_petequipsuit";
import { TempleteManager } from "../manager/TempleteManager";
import { t_s_itemtemplateData } from "./t_s_itemtemplate";
import { HeroRoleInfo } from "../battle/data/objects/HeroRoleInfo";
import { BattleModel } from "../battle/BattleModel";
import { TalentData } from "../datas/playerinfo/TalentData";
import { BaseRoleInfo } from "../battle/data/objects/BaseRoleInfo";
import {
  InheritRoleType,
  FaceType,
  BattleType,
} from "../constant/BattleDefine";
import { SecretManager } from "../manager/SecretManager";
import SecretModel from "../datas/secret/SecretModel";
import { CampaignManager } from "../manager/CampaignManager";

export default class t_s_skilltemplate {
  public mDataList: t_s_skilltemplateData[];

  public constructor(list: object[]) {
    this.mDataList = [];
    for (let i in list) {
      this.mDataList.push(new t_s_skilltemplateData(list[i]));
    }
  }
}

export class t_s_skilltemplateData extends t_s_baseConfigData {
  //
  public propSontypeArr = [
    9001, 9002, 9003, 9004, 9005, 9006, 9007, 9008, 9009, 9010,
  ];
  //TemplateId(编号)
  public TemplateId: number;
  //TemplateName(名称)
  protected TemplateName: string = "";
  protected TemplateName_en: string = "";
  protected TemplateName_es: string = "";
  protected TemplateName_fr: string = "";
  protected TemplateName_pt: string = "";
  protected TemplateName_tr: string = "";
  protected TemplateName_zhcn: string = "";
  protected TemplateName_zhtw: string = "";
  //MasterType(主类型, 101火102水103电104风105暗106光)
  public MasterType: number;
  //SonType(子类型, 玩家不同等级的同一技能的sontype需相同, 另外, 也决定施放技能时显示技能名字的文件名, 在/skillname目录下)
  public SonType: number;
  //IsResistDead(致命伤害)
  public IsResistDead: number;
  //IsUseOnDead(死亡可用)
  public IsUseOnDead: number;
  //ProperType(属性类型0全1P2E)
  public ProperType: number;
  //AppearCD(出场cd)
  public AppearCD: number;
  //Icons(图标)
  public Icons: string;
  //Grades(等级)
  public Grades: number;
  //BufferIds(BUFF效果)
  public BufferIds: string;
  //Index(位置)
  public Index: number;
  //UseWay(类型, 1主动技, 2常驻技, 3默认技, 4触发技)
  public UseWay: number;
  //AppearTime(技能方向, 1友方2敌方)
  public AppearTime: number;
  //CountWay(计算方式, 1英雄物理, 2英雄魔法, 3士兵物理, 4士兵魔法, 5突击反击, 7加血,8区分职业计算,9宠物物攻, 10宠物魔攻)
  public CountWay: number;
  //Parameter1(技能伤害百分比)
  public Parameter1: number;
  //Parameter2(技能伤害数值)
  public Parameter2: number;
  //Parameter3(QTE成功后施放的技能)
  public Parameter3: number;
  //ActionId(动作)
  public ActionId: number;
  //CastTime(施法时间, 毫秒)
  public CastTime: number;
  //QteTime(QTE时间)
  public QteTime: number;
  //SkillRandom(技能触发机率)
  public SkillRandom: number;
  //Crucial(暴击)
  public Crucial: number;
  //Priority(优先级)
  public Priority: number;
  //DefaultTarget(默认对象)
  public DefaultTarget: number;
  //NeedPlayerGrade(需要等级)
  public NeedPlayerGrade: number;
  //PreTemplateId(前置技能)
  public PreTemplateId: string;
  //NextTemplateId(下一个技能)
  public NextTemplateId: number;
  //OwnRequirements(己方要求)
  public OwnRequirements: string;
  //EnemyRequirements(敌方要求)
  public EnemyRequirements: string;
  //CoolDown(冷却时间)
  private _CoolDown: number;
  //升级需要的物品
  public UpgradeNeedItem: number;
  //升级需要物品的数量
  public UpgradeNeedCount: number;
  protected Description: string = "";
  protected Description_en: string = "";
  protected Description_es: string = "";
  protected Description_fr: string = "";
  protected Description_pt: string = "";
  protected Description_tr: string = "";
  protected Description_zhcn: string = "";
  protected Description_zhtw: string = "";
  // 对应的itemTemplate
  public itemTemplate: t_s_itemtemplateData;

  constructor(data?: object) {
    super();
    if (data) {
      for (let i in data) {
        this[i] = data[i];
      }
    }
  }

  public set CoolDown(value: number) {
    this._CoolDown = value;
  }
  public get CoolDown(): number {
    if (this.isProp) {
      return this.PropCoolDown;
    }
    if (this._skillBeforeRunCdTime) {
      return this._skillBeforeRunCdTime;
    }
    return this.getTalentEffectCdTime();
  }
  //符文技能不受到天赋特效影响
  public get PropCoolDown(): number {
    return this._CoolDown;
  }
  //Cost(消耗)
  private _Cost: number;
  public set Cost(value: number) {
    this._Cost = value;
  }
  public get Cost(): number {
    return this.getTalentEffectSp();
  }
  //AcceptObject(作用对象, 1随机单体, 2随机两次, 3全体, 4自身, 5血量百分比最低, 6前排单体, 7后排单体, 8前排, 9后排, 10随机列, 11十字, 12随机两个, 13士兵, 14随机一排, 15范围溅射, 16随机2~4个, 17优先攻击玩家,18阵亡玩家, 19随机1~2个,20随机2~3个,21随机3~4个,22英灵主人, 23特殊十字, 24配偶, 25随机玩家, 26随机小怪,27除自己以外其余友方)
  public _AcceptObject: number;
  public set AcceptObject(value: number) {
    this._AcceptObject = value;
  }
  public get AcceptObject(): number {
    return this.getTalentEffectAttackObject();
  }

  //Description(描述)
  private DescriptionKey: string = "Description";
  public get DescriptionLang(): string {
    let value = this.getKeyValue(this.getLangKey(this.DescriptionKey));
    if (value) {
      return value;
    }
    return ""; //return this.getKeyValue(this.DescriptionKey);
  }

  public get SkillDescription(): string {
    return this.getDealDescript();
  }

  public get SkillTemplateName(): string {
    return this.getSkillTempleteName();
  }

  private TemplateNameKey: string = "TemplateName";
  public get TemplateNameLang(): string {
    let value = this.getKeyValue(this.getLangKey(this.TemplateNameKey));
    if (value) {
      return value;
    }
    return ""; //return this.getKeyValue(this.TemplateNameKey);
  }

  public get actionTemplateInfo(): t_s_actionData {
    return ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_action,
      this.ActionId,
    );
  }

  /**
   *   获取前置技能列表
   * @return
   *
   */
  public get preTempList(): any[] {
    var list: any[] = [];
    var arr: any[] = this.PreTemplateId.split(",");
    var temp: t_s_skilltemplateData;
    for (const key in arr) {
      let id: number = arr[key];
      if (id > 0) {
        temp = ConfigMgr.Instance.getTemplateByID(
          ConfigType.t_s_skilltemplate,
          id,
        );
        list.push(temp);
      }
    }
    return list;
  }

  public get curTemp(): t_s_skilltemplateData {
    return ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_skilltemplate,
      this.TemplateId,
    );
  }

  public get nextTemp(): t_s_skilltemplateData {
    return ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_skilltemplate,
      this.NextTemplateId,
    );
  }

  public get useWayString(): string {
    switch (this.UseWay) {
      case 1:
        return LangManager.Instance.GetTranslation(
          "yishi.datas.templates.SkillTempInfo.UseWay01",
        );
        break;
      case 2:
        return LangManager.Instance.GetTranslation(
          "yishi.datas.templates.SkillTempInfo.UseWay02",
        );
        break;
    }
    return "";
  }

  public get skillTypeDesc(): string {
    if (this.curTemp.UseWay == 2)
      return (
        "[" +
        LangManager.Instance.GetTranslation(
          "yishi.datas.templates.SkillTempInfo.UseWay02",
        ) +
        "]"
      );
    switch (this.curTemp.AcceptObject) {
      case 1:
        return LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.Type01",
        );
        break;
      case 2:
        return LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.Type02",
        );
        break;
      case 3:
        return LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.Type03",
        );
        break;
      case 4:
        return LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.Type04",
        );
        break;
      case 5:
        return LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.Type05",
        );
        break;
      case 6:
        return LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.Type06",
        );
        break;
      case 7:
        return LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.Type07",
        );
        break;
      case 8:
        return LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.Type08",
        );
        break;
      case 9:
        return LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.Type09",
        );
        break;
      case 10:
        return LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.Type10",
        );
        break;
      case 11:
        return LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.Type11",
        );
        break;
      case 12:
        return LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.Type12",
        );
        break;
      case 13:
        return LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.Type13",
        );
        break;
      case 14:
        return LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.Type14",
        );
        break;
      case 15:
        return LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.Type15",
        );
        break;
      case 16:
        return LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.Type16",
        );
        break;
      case 17:
        return LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.Type17",
        );
        break;
      case 18:
        return LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.Type18",
        );
        break;
      case 19:
        return LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.Type19",
        );
        break;
      case 20:
        return LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.Type20",
        );
        break;
      case 21:
        return LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.Type21",
        );
        break;
    }
    return "";
  }

  /**
   * 执行技能前就该记录天赋影响技能CD
   * 有些buff该技能执行时就会移除
   */
  private _skillBeforeRunCdTime: number = 0;
  public addSkillBeforeRunCdTime() {
    this._skillBeforeRunCdTime = this.getTalentEffectCdTime();
  }
  public removeSkillBeforeRunCdTime() {
    this._skillBeforeRunCdTime = 0;
  }

  /**
   *获取天赋影响的CD时间
   * @return
   *
   */
  private getTalentEffectCdTime(): number {
    var talentEffectArr: any[] = this.getTalentEffectIds();
    if (!talentEffectArr.length) {
      // Logger.info("[t_s_skilltemplate]正常冷却时间", this.TemplateName, this.TemplateId, this._CoolDown)
      return this._CoolDown;
    }

    var cdTime: number = this._CoolDown;
    var cdTimePercent: number = 0;
    var cdTimeAdd: number = 0;
    for (const key in talentEffectArr) {
      let effectId: number = talentEffectArr[key];
      var tempTalentEffect: t_s_talenteffecttemplateData =
        ConfigMgr.Instance.getTemplateByID(
          ConfigType.t_s_talenteffecttemplate,
          effectId.toString(),
        );
      if (tempTalentEffect.EffCdPercent) {
        cdTimePercent += tempTalentEffect.EffCdPercent;
      }
      if (tempTalentEffect.EffCdValue) {
        cdTimeAdd += tempTalentEffect.EffCdValue;
      }
    }
    if (cdTimeAdd != 0) {
      cdTime += cdTimeAdd;
    }
    if (cdTimePercent != 0) {
      cdTime += cdTime * cdTimePercent * 0.01;
    }
    // Logger.info("[t_s_skilltemplate]天赋影响后冷却时间", this.TemplateName, this.TemplateId, Number(cdTime * 0.001) * 1000)
    //转换成秒
    return cdTime >> 0;
  }

  /**
   *获取天赋影响的怒气
   * @return
   *
   */
  private getTalentEffectSp(): number {
    var effectArr: any[] = this.getTalentEffectIds();
    if (!effectArr.length) {
      // Logger.info("[t_s_skilltemplate]正常技能消耗怒气", this.TemplateName, this.TemplateId, this._Cost)
      return this._Cost;
    }
    var spCost: number = this._Cost;
    var percent: number = 0;
    var add: number = 0;
    for (const key in effectArr) {
      var effectId: number = effectArr[key];
      var tempTalentEffect: t_s_talenteffecttemplateData =
        ConfigMgr.Instance.getTemplateByID(
          ConfigType.t_s_talenteffecttemplate,
          effectId.toString(),
        );
      if (tempTalentEffect.EffSpPercent && spCost <= 0) {
        //talent中的EffSpPercent（怒气百分比影响）对怒气为正的技能无效
        percent += tempTalentEffect.EffSpPercent;
      }
      // spCost += spCost*tempTalentEffect.EffSpPercent*0.01;
      if (tempTalentEffect.EffSpValue) {
        add += tempTalentEffect.EffSpValue;
      }
      // spCost+=tempTalentEffect.EffSpValue;
    }
    if (percent != 0) {
      spCost += spCost * percent * 0.01;
    }
    if (add != 0) {
      spCost += add;
    }
    // Logger.info("[t_s_skilltemplate]天赋影响后技能消耗怒气", this.TemplateName, this.TemplateId, spCost, percent, add)
    return spCost >> 0;
  }

  /**
   *获取天赋影响的攻击对象
   * @return
   *
   */
  private getTalentEffectAttackObject(): number {
    var effectArr: any[] = this.getTalentEffectIds();
    if (!effectArr.length) {
      // Logger.info("[t_s_skilltemplate]正常技能攻击对象", this.TemplateName, this.TemplateId, this._AcceptObject)
      return this._AcceptObject;
    }

    var acceptObj: number = this._AcceptObject;

    for (const key in effectArr) {
      var effectId: number = effectArr[key];
      var tempTalentEffect: t_s_talenteffecttemplateData =
        ConfigMgr.Instance.getTemplateByID(
          ConfigType.t_s_talenteffecttemplate,
          effectId.toString(),
        );
      if (tempTalentEffect.EffAttackObject) {
        acceptObj = tempTalentEffect.EffAttackObject;
      }
    }
    // Logger.info("[t_s_skilltemplate]天赋影响后技能攻击对象", this.TemplateName, this.TemplateId, acceptObj)
    return acceptObj;
  }

  private get selfHero(): HeroRoleInfo {
    return BattleManager.Instance.battleModel.selfHero;
  }

  private get battleMode(): BattleModel {
    return BattleManager.Instance.model;
  }
  /**
   *获取天赋、符孔、英雄装备、英灵装备套装技能效果ids
   * @return 结合buffer的天赋效果的ids
   *
   */
  private getTalentEffectIds() {
    let talentEffectArr: number[] = [];
    let baseHero: ThaneInfo = ArmyManager.Instance.thane;
    let talentData: TalentData;
    //符孔技能
    let skillWndData = (
      FrameCtrlManager.Instance.getCtrl(EmWindow.Skill) as SkillWndCtrl
    ).data as SkillWndData;
    //天赋技能
    let existTalentList = [];
    if (this.battleMode && this.battleMode.isAllPetPKBattle()) {
      talentData = this.selfHero.talentData;
      if (talentData) {
        existTalentList.concat(talentData.lookTalentSkill);
      }
    } else {
      talentData = baseHero.talentData;
      if (talentData && talentData.talentSkill) {
        existTalentList.push(...talentData.talentSkill.split(","));
      }
    }

    /**
     * 英雄装备
     * 套装改版, 一个装备一个套装效果, 一个套装只有一个技能了
     * 套装技能所携带的常驻buff（ValidCount为-1, 且CountWay为-1）的talent效果
     */
    let list = GoodsManager.Instance.getHeroEquipListById(
      baseHero.id,
    ).getList() as GoodsInfo[];
    for (let i = 0, len = list.length; i < len; i++) {
      const info = list[i];
      let suitTemp: t_s_suitetemplateData = ConfigMgr.Instance.getTemplateByID(
        ConfigType.t_s_suitetemplate,
        info.templateInfo.SuiteId,
      ); //取得套装模板
      if (suitTemp) {
        let skillTemp: t_s_skilltemplateData =
          ConfigMgr.Instance.getTemplateByID(
            ConfigType.t_s_skilltemplate,
            suitTemp.Property1,
          );
        if (skillTemp && !StringHelper.isNullOrEmpty(skillTemp.BufferIds)) {
          let bufferIds: any[] = skillTemp.BufferIds.split(",");
          for (let j: number = 0; j < bufferIds.length; j++) {
            let bufferId: number = bufferIds[j];
            let bufferTemp: t_s_skillbuffertemplateData =
              ConfigMgr.Instance.getTemplateByID(
                ConfigType.t_s_skillbuffertemplate,
                bufferId,
              );
            if (bufferTemp.ValidCount == -1 && bufferTemp.CountWay == -1) {
              existTalentList.push(skillTemp.TemplateId.toString());
              // Logger.info("[t_s_skilltemplate]携带装备产生的常驻buff", skillTemp.TemplateId)
            }
          }
        }
      }
    }

    existTalentList.push(...skillWndData.runeHoleSkills);

    /**
     * 英灵装备v1.7
     * 套装改版, 一个装备一个套装效果, 一个套装只有一个技能了
     */
    let tarPetData: PetData;
    if (FrameCtrlManager.Instance.isOpen(EmWindow.Pet)) {
      let petCtrl = FrameCtrlManager.Instance.getCtrl(EmWindow.Pet) as PetCtrl;
      if (petCtrl.selectedPet) {
        tarPetData = petCtrl.selectedPet;
      }
    } else if (FrameCtrlManager.Instance.isOpen(EmWindow.Battle)) {
      let selfHero = BattleManager.Instance.model.selfHero;
      if (selfHero && selfHero.isPetState) {
        tarPetData = this.playerInfo.enterWarPet;
      }
    }

    // 只计算改版后的装备；改版后的英灵装备套装效果对技能冷却, 攻击有影响, 以前的只加英雄的属性: 如防御、生命；
    if (tarPetData) {
      let bagArr0 = GoodsManager.Instance.getGoodsByBagType(
        BagType.PET_EQUIP_BAG,
      );
      for (let i = 0; i < bagArr0.length; i++) {
        let info = bagArr0[i];
        let suitTemp = TempleteManager.Instance.getPetEquipSuitData(
          info.suitId,
        ) as t_s_petequipsuitData;
        if (suitTemp) {
          let _equipedCond = tarPetData.petId == info.objectId;
          if (!_equipedCond) {
            continue;
          }

          let _amountCond = suitTemp.Amount == 1;
          if (!_amountCond) {
            continue;
          }
          let _strengthenCond = info.strengthenGrade >= suitTemp.StrengthenGrow;
          if (!_strengthenCond) {
            continue;
          }
          let skillTemp: t_s_skilltemplateData =
            ConfigMgr.Instance.getTemplateByID(
              ConfigType.t_s_skilltemplate,
              suitTemp.SuitSkill,
            );
          if (skillTemp && !StringHelper.isNullOrEmpty(skillTemp.BufferIds)) {
            let bufferIds: any[] = skillTemp.BufferIds.split(",");
            for (let j: number = 0; j < bufferIds.length; j++) {
              let bufferId: number = bufferIds[j];
              let bufferTemp: t_s_skillbuffertemplateData =
                ConfigMgr.Instance.getTemplateByID(
                  ConfigType.t_s_skillbuffertemplate,
                  bufferId,
                );
              if (bufferTemp.ValidCount == -1 && bufferTemp.CountWay == -1) {
                existTalentList.push(skillTemp.TemplateId.toString());
                // Logger.info("[t_s_skilltemplate]携带英灵装备产生的常驻buff", skillTemp.TemplateId)
              }
            }
          }
        }
      }
    }

    for (const key in existTalentList) {
      let id = +existTalentList[key];
      if (id == 0) {
        continue;
      }
      let temp: t_s_skilltemplateData = ConfigMgr.Instance.getTemplateByID(
        ConfigType.t_s_skilltemplate,
        id + "",
      );
      if (
        temp.SonType == 1001 ||
        temp.SonType == 1002 ||
        temp.SonType == 1003
      ) {
        //以前圣印是一个特殊的被动 现在圣印是主动了, 所以就不能算进去了
        continue;
      }
      let buffers = temp.BufferIds.split(",");
      for (let bufferId of buffers) {
        if (+bufferId == 0) {
          continue;
        }
        let buffer: t_s_skillbuffertemplateData =
          ConfigMgr.Instance.getTemplateByID(
            ConfigType.t_s_skillbuffertemplate,
            bufferId,
          );
        let talentEffects = buffer.TalentEffIds.split(",");
        for (let effectId of talentEffects) {
          if (+effectId == 0) {
            continue;
          }
          let effect: t_s_talenteffecttemplateData =
            ConfigMgr.Instance.getTemplateByID(
              ConfigType.t_s_talenteffecttemplate,
              effectId,
            );
          if (
            effect.EffSkillType == -1 ||
            effect.EffSkillType == this.SonType
          ) {
            talentEffectArr.push(effect.TemplateId);
          }
        }
      }
    }
    return this.getBattleTalentEffect(talentEffectArr);
  }

  /**
   *结合战斗中buffer的天赋效果
   * @param effectIds        天赋技能的天赋效果ids
   * @return 总天赋效果ids
   *
   */
  private getBattleTalentEffect(effectIds: number[]) {
    let battleEffectIds = effectIds;
    let bmodel = BattleManager.Instance.battleModel;

    if (!BattleManager.Instance.started || !bmodel) {
      return battleEffectIds;
    }
    if (bmodel.isAllPetPKBattle()) {
      let roleList = bmodel.roleList;
      roleList.forEach((role: BaseRoleInfo) => {
        if (role.side == bmodel.selfSide) {
          let buffers: BufferDamageData[] = role.getBuffers();
          if (buffers && buffers.length) {
            let buffer: BufferDamageData;
            let tempInfo: t_s_skillbuffertemplateData;
            for (let i: number = 0; i < buffers.length; i++) {
              buffer = buffers[i];
              tempInfo = ConfigMgr.Instance.getTemplateByID(
                ConfigType.t_s_skillbuffertemplate,
                buffer.templateId,
              );
              if (tempInfo.TalentEffIds) {
                let talentEffects = tempInfo.TalentEffIds.split(",");
                for (let effectId of talentEffects) {
                  if (+effectId == 0) {
                    continue;
                  }
                  let effect: t_s_talenteffecttemplateData =
                    ConfigMgr.Instance.getTemplateByID(
                      ConfigType.t_s_talenteffecttemplate,
                      effectId,
                    );
                  if (
                    effect &&
                    (effect.EffSkillType == -1 ||
                      effect.EffSkillType == this.SonType)
                  ) {
                    if (battleEffectIds.indexOf(effect.TemplateId) < 0) {
                      battleEffectIds.push(effect.TemplateId);
                    }
                  }
                }
              }
            }
          }
        }
      });
    } else {
      let buffers: BufferDamageData[] = bmodel.selfHero.getBuffers();
      if (buffers && buffers.length) {
        // Logger.info("[t_s_skilltemplate]getBattleTalentEffect", buffers)
        let buffer: BufferDamageData;
        let tempInfo: t_s_skillbuffertemplateData;
        for (let i: number = 0; i < buffers.length; i++) {
          buffer = buffers[i];
          tempInfo = ConfigMgr.Instance.getTemplateByID(
            ConfigType.t_s_skillbuffertemplate,
            buffer.templateId,
          );
          if (tempInfo.TalentEffIds) {
            let talentEffects = tempInfo.TalentEffIds.split(",");
            for (let effectId of talentEffects) {
              if (+effectId == 0) {
                continue;
              }
              let effect: t_s_talenteffecttemplateData =
                ConfigMgr.Instance.getTemplateByID(
                  ConfigType.t_s_talenteffecttemplate,
                  effectId,
                );
              if (
                effect &&
                (effect.EffSkillType == -1 ||
                  effect.EffSkillType == this.SonType)
              ) {
                if (battleEffectIds.indexOf(effect.TemplateId) < 0) {
                  battleEffectIds.push(effect.TemplateId);
                  // Logger.info("[t_s_skilltemplate]角色buff中存在天赋技能", effect.TemplateId)
                }
              }
            }
          }
        }
      }
    }

    /** 秘境常驻秘宝 */
    if (bmodel.battleType == BattleType.BATTLE_SECRET) {
      let secretId = CampaignManager.Instance.mapId;
      let sceretType = SecretModel.getScereType(secretId);
      let scereInfo = SecretManager.Instance.model.getSecretInfo(sceretType);
      if (scereInfo) {
        for (
          let index = 0;
          index < scereInfo.treasureInfoList.length;
          index++
        ) {
          const element = scereInfo.treasureInfoList[index];
          if (element.template.Type == 1) {
            let skillTemp: t_s_skilltemplateData =
              ConfigMgr.Instance.getTemplateByID(
                ConfigType.t_s_skilltemplate,
                element.template.OwnSkill,
              );
            if (!skillTemp) {
              continue;
            }

            let buffers = skillTemp.BufferIds.split(",");
            for (let bufferId of buffers) {
              if (+bufferId == 0) {
                continue;
              }
              let buffTemp: t_s_skillbuffertemplateData =
                ConfigMgr.Instance.getTemplateByID(
                  ConfigType.t_s_skillbuffertemplate,
                  bufferId,
                );
              let talentEffects = buffTemp.TalentEffIds.split(",");
              for (let id of talentEffects) {
                let effectId = Number(id);
                if (+effectId == 0) {
                  continue;
                }
                let effectTemp: t_s_talenteffecttemplateData =
                  ConfigMgr.Instance.getTemplateByID(
                    ConfigType.t_s_talenteffecttemplate,
                    effectId,
                  );
                if (effectTemp.EffSkillType == -1) {
                  if (battleEffectIds.indexOf(Number(effectId)) < 0) {
                    battleEffectIds.push(effectId);
                    Logger.info(
                      "[t_s_skilltemplate]角色秘境常驻buff中存在天赋技能",
                      effectId,
                    );
                  }
                }
              }
            }
          }
        }
      } else {
        Logger.warn("秘境信息获取失败", secretId);
      }
    }

    return battleEffectIds;
  }

  private getTalentEffectParameter1(): number {
    var effectArr: any[] = this.getTalentEffectIds();
    if (!effectArr.length) {
      return Math.abs(this.Parameter1);
    }

    var parameter: number = this.Parameter1;
    var percent: number = 0;

    for (const key in effectArr) {
      var effectId: number = effectArr[key];
      var tempTalentEffect: t_s_talenteffecttemplateData =
        ConfigMgr.Instance.getTemplateByID(
          ConfigType.t_s_talenteffecttemplate,
          effectId.toString(),
        );
      if (tempTalentEffect.EffDamPercent) {
        percent += tempTalentEffect.EffDamPercent;
      }
      //					parameter+=parameter* tempTalentEffect.EffDamPercent * 0.01;
    }

    if (percent != 0) {
      parameter += parameter * percent * 0.01;
    }

    return Math.abs(Math.floor(parameter));
  }

  private getTalentEffectParameter2(): number {
    var effectArr: any[] = this.getTalentEffectIds();
    if (!effectArr.length) {
      return Math.abs(this.Parameter2);
    }

    var parameter: number = this.Parameter2;
    var percent: number = 0;
    var add: number = 0;

    for (const key in effectArr) {
      var effectId: number = effectArr[key];
      var tempTalentEffect: t_s_talenteffecttemplateData =
        ConfigMgr.Instance.getTemplateByID(
          ConfigType.t_s_talenteffecttemplate,
          effectId.toString(),
        );
      if (tempTalentEffect.EffDamPercent) {
        percent += tempTalentEffect.EffDamPercent;
      }
      //					parameter+= parameter*tempTalentEffect.EffDamPercent * 0.01;
      if (tempTalentEffect.EffDamValue) {
        add += tempTalentEffect.EffDamValue;
      }
      //					parameter+=tempTalentEffect.EffDamValue;
    }
    if (add) {
      parameter += add;
    }
    if (percent != 0) {
      parameter += parameter * percent * 0.01;
    }

    return Math.abs(parameter >> 0);
  }

  private getDealDescript(): string {
    var descript: string;
    descript = StringHelper.replaceStr(
      this.DescriptionLang,
      "{Parameter1}",
      String(this.getTalentEffectParameter1()),
    );
    descript = StringHelper.replaceStr(
      descript,
      "{Parameter2}",
      String(this.getTalentEffectParameter2()),
    );
    descript = StringHelper.replaceStr(
      descript,
      "{Cost}",
      String(this.getTalentEffectSp()),
    );
    return descript;
  }

  private getSkillTempleteName(): string {
    return this.TemplateNameLang;
  }

  private get playerInfo(): PlayerInfo {
    return PlayerManager.Instance.currentPlayerModel.playerInfo;
  }

  public get isProp() {
    return this.propSontypeArr.indexOf(this.SonType) != -1;
  }
}
