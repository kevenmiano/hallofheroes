/**
 * 军队的兵种信息
 * @author Administrator
 *
 */
import GameEventDispatcher from "../../core/event/GameEventDispatcher";
import Dictionary from "../../core/utils/Dictionary";
import { SimpleDictionary } from "../../core/utils/SimpleDictionary";
import { PawnProperty } from "./PawnProperty";
import ConfigMgr from "../../core/config/ConfigMgr";
import { ConfigType } from "../constant/ConfigDefine";
import { t_s_pawntemplateData } from "../config/t_s_pawntemplate";
import { PawnEvent } from "../constant/event/NotificationEvent";

export class ArmyPawn extends GameEventDispatcher {
  private static PROPERTY_CHANGE: string = "PROPERTY_CHANGE";
  private static SPECIAL_ALIBITY: string = "SPECIAL_ALIBITY";
  public static SPECIAL_BLESS: string = "SPECIAL_BLESS";
  public static ATTACK: number = 0;
  public static DEFENCE: number = 1;
  public static MAGIC_ATTACK: number = 2;
  public static MAGIC_DEFENCE: number = 3;
  public static LIVE: number = 4;
  public static FORCEHIT: number = 5;

  private _templeteInfo: t_s_pawntemplateData = null;
  private _nexttempleteInfo: t_s_pawntemplateData = null;

  public attributeDic: Dictionary;
  /**
   * 该兵种是否能够在兵营里面招募
   */
  public canRecruit: boolean;
  private _changeObj: SimpleDictionary;

  constructor() {
    super();

    this._changeObj = new SimpleDictionary();
    this.attributeDic = new Dictionary();
    this.attributeDic[ArmyPawn.ATTACK] = new PawnProperty();
    this.attributeDic[ArmyPawn.DEFENCE] = new PawnProperty();
    this.attributeDic[ArmyPawn.MAGIC_ATTACK] = new PawnProperty();
    this.attributeDic[ArmyPawn.MAGIC_DEFENCE] = new PawnProperty();
    this.attributeDic[ArmyPawn.LIVE] = new PawnProperty();
    this.attributeDic[ArmyPawn.FORCEHIT] = new PawnProperty();
  }

  public id: number = 0;
  public userId: number = 0;
  public armyId: number = 0;
  /**
   * 士兵在部队里面的位置
   */
  public sites: number = 0;
  public icon: string;
  /**
   * 战斗中的站位
   */
  public fightPos: number = 0;

  /**
   * 士兵生命
   * @return
   *
   */
  public get live(): number {
    return this.attributeDic[ArmyPawn.LIVE].getTotalJoin(
      this.templateInfo.Live,
    );
  }

  /**
   * 士兵物理攻击力
   * @return
   *
   */
  public get attack(): number {
    return (this.attributeDic[ArmyPawn.ATTACK] as PawnProperty).getTotalJoin(
      this.templateInfo.Attack,
    );
  }

  /**
   * 士兵物理防御
   * @return
   *
   */
  public get defence(): number {
    return (this.attributeDic[ArmyPawn.DEFENCE] as PawnProperty).getTotalJoin(
      this.templateInfo.Defence,
    );
  }

  /**
   * 士兵魔法攻击
   * @return
   *
   */
  public get magicAttack(): number {
    return (
      this.attributeDic[ArmyPawn.MAGIC_ATTACK] as PawnProperty
    ).getTotalJoin(this.templateInfo.MagicAttack);
  }

  /**
   * 士兵魔法防御
   * @return
   *
   */
  public get magicDefence(): number {
    return (
      this.attributeDic[ArmyPawn.MAGIC_DEFENCE] as PawnProperty
    ).getTotalJoin(this.templateInfo.MagicDefence);
  }

  /**
   * 士兵暴击
   * @return
   *
   */
  public get forceHit(): number {
    return (this.attributeDic[ArmyPawn.FORCEHIT] as PawnProperty).getTotalJoin(
      this.templateInfo.ForceHit,
    );
  }

  /**
   * 根据属性取得士兵该属性的加成集合
   * 比如物理攻击的加成集合, 包括背包加成, 天赋加成, 科技加成等
   * @param type
   * @return
   *
   */
  public getPropertyByType(type: number): PawnProperty {
    return this.attributeDic[type] as PawnProperty;
  }

  /**
   * 该士兵的数量
   */
  private _ownPawns: number = 0;
  public get ownPawns(): number {
    return this._ownPawns;
  }

  public set ownPawns(value: number) {
    this._ownPawns = value;
    if (this._ownPawns < 0) {
      this._ownPawns = 0;
    }
    this._changeObj[ArmyPawn.PROPERTY_CHANGE] = true;
  }

  private _templateId: number = 0;
  public get templateId(): number {
    return this._templateId;
  }

  public set templateId(value: number) {
    if (value != this._templateId) {
      this._templateId = value;
      this._templeteInfo = ConfigMgr.Instance.getTemplateByID(
        ConfigType.t_s_pawntemplate,
        this._templateId.toString(),
      );
      if (this.templateInfo)
        this._nexttempleteInfo = ConfigMgr.Instance.getTemplateByID(
          ConfigType.t_s_pawntemplate,
          this.templateInfo.NextLevelTemplateId.toString(),
        );
      this._changeObj[ArmyPawn.PROPERTY_CHANGE] = true;
    }
  }

  /**
   * 士兵的特技
   */
  private _specialAbility: string;
  public get specialAbility(): string {
    return this._specialAbility;
  }

  public set specialAbility(value: string) {
    if (value != this._specialAbility) {
      this._specialAbility = value;
      this._changeObj[ArmyPawn.SPECIAL_ALIBITY] = true;
    }
  }

  private _tempSpecial: string;
  public get tempSpecial(): string {
    return this._tempSpecial;
  }

  public set tempSpecial(value: string) {
    if (value != this._tempSpecial) {
      this._tempSpecial = value;
      this._changeObj[ArmyPawn.SPECIAL_ALIBITY] = true;
    }
  }

  /**
   * 士兵特性领悟的特性值
   */
  private _blessNum: number = 0;
  public get blessNum(): number {
    return this._blessNum;
  }

  public set blessNum(value: number) {
    if (value != this._blessNum) {
      this._blessNum = value;
      this._changeObj[ArmyPawn.SPECIAL_BLESS] = true;
    }
  }

  /**
   * 士兵的评价
   * @return
   *
   */
  public get pawnEvaluate(): number {
    return Number(
      Math.pow(
        this.live *
          (this.attack + this.defence + this.magicDefence * 1.5) *
          (1 + this.magicAttack / 500),
        0.45,
      ),
    );
  }

  public synchronization(ap: ArmyPawn) {
    this.templateId = ap.templateId;
    this.sites = ap.sites;
    this.icon = ap.icon;
    this.specialAbility = ap.specialAbility;
    this.tempSpecial = ap.tempSpecial;
    this.blessNum = ap.blessNum;
  }

  public get templateInfo(): t_s_pawntemplateData {
    return this._templeteInfo;
  }

  public get nextTemplate(): t_s_pawntemplateData {
    return this._nexttempleteInfo;
  }

  public commit() {
    if (this._changeObj[ArmyPawn.PROPERTY_CHANGE]) {
      this.dispatchEvent(PawnEvent.PAWN_PROPERTY_CHAGER, this);
    }
    if (this._changeObj[ArmyPawn.SPECIAL_ALIBITY]) {
      this.dispatchEvent(PawnEvent.SPECIAL_ALIBITY, this);
    }
    if (this._changeObj[ArmyPawn.SPECIAL_BLESS]) {
      this.dispatchEvent(PawnEvent.SPECIAL_BLESS, this);
    }
    this._changeObj.clear();
  }

  public copy(): ArmyPawn {
    let copyData = new ArmyPawn();
    copyData.synchronization(this);
    return copyData;
  }
}
