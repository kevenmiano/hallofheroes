import { SimpleDictionary } from "../../../core/utils/SimpleDictionary";
import LangManager from "../../../core/lang/LangManager";
import GameEventDispatcher from "../../../core/event/GameEventDispatcher";
import { PlayerOrderInfo } from "./PlayerOrderInfo";
import { ClassFactory } from "../../../core/utils/ClassFactory";
import { PetEvent } from "../../constant/event/NotificationEvent";
import { PlayerEvent } from "../../constant/event/PlayerEvent";
import { BattleGuardInfo } from "./BattleGuardInfo";
import { SimpleMountInfo } from "./SimpleMountInfo";
import { StateType } from "../../constant/StateType";
import { t_s_upgradetemplateData } from "../../config/t_s_upgradetemplate";
import { TempleteManager } from "../../manager/TempleteManager";
import { UpgradeType } from "../../constant/UpgradeType";
import { ArrayConstant, ArrayUtils } from "../../../core/utils/ArrayUtils";
import { PetData } from "../../module/pet/data/PetData";
import { BattleGuardSocketInfo } from "./BattleGuardSocketInfo";
import { ArmyManager } from "../../manager/ArmyManager";
import ComponentSetting from "../../utils/ComponentSetting";

/**
 * @description 玩家信息基类  一系列get set方法和属性变更后的事件派发
 * @author yuanzhan.yu
 * @date 2021/1/12 12:21
 * @ver 1.0
 */
export class SimplePlayerInfo extends GameEventDispatcher {
  protected static ATTACK_COUNT: string = "ATTACK_COUNT";
  protected static CONSORTIA_DUTY: string = "CONSORTIA_DUTY";
  protected static CONSORTIA_OFFER: string = "CONSORTIA_OFFER";
  protected static CONSORTIA: string = "CONSORTIA";
  protected static CONSORTIA_NAME: string = "CONSORTIA_NAME";
  protected static IS_AUTO: string = "IS_AUTO";
  protected static STATE: string = "STATE";
  protected static NICKNAME: string = "NICKNAME";
  protected static PLAYER_HONOR: string = "PLAYER_HONOR";
  protected static PLAYER_HONOR_DAY: string = "PLAYER_HONOR_DAY";
  protected static PLAYER_HONOR_DAY_MAX: string = "PLAYER_HONOR_DAY_MAX";
  protected static VEHICLEID_CHANGE: string = "VEHICLEID_CHANGE";
  protected static GLORY_CHANGE: string = "GLORY_CHANGE";
  protected static PET_DATA: string = "PET_DATA";
  protected static PET_ADD: string = "PET_ADD";
  protected static PET_REMOVE: string = "PET_REMOVE";
  protected static PLAYER_PET_LIST_CHANGE: string = "PLAYER_PET_LIST_CHANGE";
  protected static MUTICOPY_COUNT: string = "MUTICOPY_COUNT";
  protected static MUTICOPY_MAX_COUNT: string = "MUTICOPY_MAX_COUNT";
  protected static TAILA_COUNT: string = "TAILA_COUNT";
  // protected static TAILA_MAX_COUNT: string = "TAILA_MAX_COUNT";
  protected static DRAGON_SOUL_TYPE: string = "DRAGON_SOUL_TYPE";
  protected static DRAGON_SOUL_GRADE: string = "DRAGON_SOUL_GRADE";
  protected static DRAGON_SOUL_GP: string = "DRAGON_SOUL_GP";
  protected static VOCATION_GP: string = "VOCATION_GP";
  protected static VOCATION_GRADES: string = "VOCATION_GRADES";
  protected static CONSORTIA_COIN: string = "CONSORTIA_COIN";
  protected static IS_BIND_VERTIFY_PROMPTED: string =
    "IS_BIND_VERTIFY_PROMPTED";
  public playerOrdeInfo: PlayerOrderInfo;
  protected _changeObj: SimpleDictionary;
  protected static CONSORTIA_JIANSE: string = "CONSORTIA_JIANSE";
  protected static CONSORTIA_TOTAL_JIANSE: string = "CONSORTIA_TOTAL_JIANSE";
  /** 跨服的需要以 userid+serverName */
  public get key(): string {
    let str = this._userId.toString();
    if (this.serviceName) {
      str += "_" + this.serviceName;
    }
    return str;
  }

  /**
   * 进入多人本的次数
   */
  private _multiCopyCount: number = 0;
  public get multiCopyCount(): number {
    return this._multiCopyCount;
  }

  public set multiCopyCount(value: number) {
    if (this._multiCopyCount != value) {
      this._changeObj[SimplePlayerInfo.MUTICOPY_COUNT] = true;
      this._multiCopyCount = value;
    }
  }

  /**
   * 是否vip
   * @constructor
   */
  get IsVipAndNoExpirt(): boolean {
    return this._IsVipAndNoExpirt;
  }

  set IsVipAndNoExpirt(value: boolean) {
    this._IsVipAndNoExpirt = value;
  }
  /**
   * 进入多人副本最大次数
   */
  private _multiCopyMaxCount: number = 1;
  public get multiCopyMaxCount(): number {
    let cfg = TempleteManager.Instance.getConfigInfoByConfigName(
      "MultiCampaign_MaxCount",
    );
    if (cfg) {
      this._multiCopyMaxCount = Number(cfg.ConfigValue);
    }
    return this._multiCopyMaxCount;
  }

  public set multiCopyMaxCount(value: number) {
    // if (this._multiCopyMaxCount != value) {
    // 	this._changeObj[SimplePlayerInfo.MUTICOPY_MAX_COUNT] = true;
    // 	this._multiCopyMaxCount = value;
    // }
  }

  public get nickName(): string {
    return this._nickName == String(this._userId + "$")
      ? LangManager.Instance.GetTranslation("public.nickName")
      : this._nickName;
  }

  public set nickName(value: string) {
    if (this._nickName != value && value != "") {
      this._changeObj[SimplePlayerInfo.NICKNAME] = true;
      this._nickName = value;
    }
  }

  public frameId: number = 0;
  public get consortiaID(): number {
    return this._consortiaID;
  }

  public set consortiaID(value: number) {
    if (this._consortiaID != value) {
      this._changeObj[SimplePlayerInfo.CONSORTIA] = true;
      this._consortiaID = value;
    }
  }

  public get consortiaName(): string {
    return this._consortiaName;
  }

  public set consortiaName(value: string) {
    if (this._consortiaName != value) {
      this._consortiaName = value;
      this._changeObj[SimplePlayerInfo.CONSORTIA_NAME] = true;
    }
  }

  /**
   * 用户id
   */
  private _userId: number = 0;
  public get userId(): number {
    return this._userId;
  }

  public set userId(value: number) {
    this._userId = value;
  }

  /**
   * 1:男战
   * 2:男弓
   * 3:男法
   * 4:女战
   * 5:女弓
   * 6:女法
   */
  public job: number = 0;

  private _state: number = 0;
  public get state(): number {
    return this._state;
  }

  public set state(value: number) {
    if (this._state == value) {
      return;
    }
    this._state = value;
    this._changeObj[SimplePlayerInfo.STATE] = true;
  }

  /**
   * 是否在线（包括忙碌、离开、请勿打扰等状态）
   */
  public get isOnline(): boolean {
    return this._state != StateType.OFFLINE;
  }

  /**
   * 攻击次数
   */
  private _attackCount: number = 0;
  public get attackCount(): number {
    return this._attackCount;
  }

  public set attackCount(value: number) {
    if (this._attackCount != value) {
      this._changeObj[SimplePlayerInfo.ATTACK_COUNT] = true;
      this._attackCount = value;
    }
  }

  /**
   *  工会职位
   */
  private _dutyId: number = 0;
  public get dutyId(): number {
    return this._dutyId;
  }

  public set dutyId(value: number) {
    if (value && value != this._dutyId) {
      this._changeObj[SimplePlayerInfo.CONSORTIA_DUTY] = true;
      this._dutyId = value;
    }
  }

  /**
   * 公会贡献
   */
  private _consortiaOffer: number = 0;

  public get consortiaOffer(): number {
    return this._consortiaOffer;
  }

  public set consortiaOffer(value: number) {
    if (this._consortiaOffer != value) {
      this._changeObj[SimplePlayerInfo.CONSORTIA_OFFER] = true;
      this._consortiaOffer = value;
    }
  }

  //公会建设
  private _consortiaJianse: number = 0;
  public set consortiaJianse(value: number) {
    if (this._consortiaJianse != value) {
      this._changeObj[SimplePlayerInfo.CONSORTIA_JIANSE] = true;
      this._consortiaJianse = value;
    }
  }

  public get consortiaJianse(): number {
    return this._consortiaJianse;
  }

  private _consortiaTotalJianse: number = 0; //总建设
  public set consortiaTotalJianse(value: number) {
    if (this._consortiaTotalJianse != value) {
      this._changeObj[SimplePlayerInfo.CONSORTIA_TOTAL_JIANSE] = true;
      this._consortiaTotalJianse = value;
    }
  }

  public get consortiaTotalJianse(): number {
    return this._consortiaTotalJianse;
  }

  private _consortiaCoin: number = 0; //恐惧之牙数量
  public get consortiaCoin(): number {
    return this._consortiaCoin;
  }

  public set consortiaCoin(value: number) {
    if (this._consortiaCoin != value) {
      this._changeObj[SimplePlayerInfo.CONSORTIA_COIN] = true;
      this._consortiaCoin = value;
    }
  }

  /**
   * 公会总贡献
   */
  private _consortiaTotalOffer: number = 0;
  public get consortiaTotalOffer(): number {
    return this._consortiaTotalOffer;
  }

  public set consortiaTotalOffer(value: number) {
    if (this._consortiaTotalOffer != value) {
      this._consortiaTotalOffer = value;
    }
  }

  /**
   * 魅力值
   */
  private _charms: number = 0;
  public get charms(): number {
    return this._charms;
  }

  public set charms(value: number) {
    if (this._charms == value) {
      return;
    }
    this._charms = value;
  }

  /**
   * 荣耀点（武斗会）
   */
  private _gloryPoint: number = 0;
  public get gloryPoint(): number {
    return this._gloryPoint;
  }

  public set gloryPoint(value: number) {
    if (this._gloryPoint == value) {
      return;
    }
    this._gloryPoint = value;
    this._changeObj[SimplePlayerInfo.GLORY_CHANGE] = true;
  }

  /**已完成悬赏次数*/
  private _rewardCount: number = 0;
  public get rewardCount(): number {
    return this._rewardCount;
  }

  public set rewardCount(value: number) {
    if (this._rewardCount == value) {
      return;
    }
    this._rewardCount = value;
  }

  private _soulScore: number = 0;
  public get soulScore(): number {
    return this._soulScore;
  }

  public set soulScore(value: number) {
    if (this._soulScore == value) {
      return;
    }
    this._soulScore = value;
  }

  private _honer: number = 0;
  public set honer(value: number) {
    if (this._honer != value) {
      this._changeObj[SimplePlayerInfo.PLAYER_HONOR] = true;
      this._honer = value;
    }
  }

  public get honer(): number {
    return this._honer;
  }

  private _honerDay: number = 0;
  public set honerDay(value: number) {
    if (this._honerDay != value) {
      this._changeObj[SimplePlayerInfo.PLAYER_HONOR_DAY] = true;
      this._honerDay = value;
    }
  }

  public get honerDay(): number {
    return this._honerDay;
  }

  private _honerDayMax: number = 0;
  public set honerDayMax(value: number) {
    if (this._honerDayMax != value) {
      this._changeObj[SimplePlayerInfo.PLAYER_HONOR_DAY_MAX] = true;
      this._honerDayMax = value;
    }
  }

  public get honerDayMax(): number {
    return this._honerDayMax;
  }

  public get firstHonerTemp(): t_s_upgradetemplateData {
    let tempList: t_s_upgradetemplateData[] =
      TempleteManager.Instance.getTemplatesByType(
        UpgradeType.UPGRADE_TYPE_HONER,
      );
    tempList = ArrayUtils.sortOn(tempList, "Data", ArrayConstant.NUMERIC);
    return tempList[1] as t_s_upgradetemplateData;
  }

  public get honerTemp(): t_s_upgradetemplateData {
    let tempList: t_s_upgradetemplateData[] =
      TempleteManager.Instance.getTemplatesByType(
        UpgradeType.UPGRADE_TYPE_HONER,
      );
    tempList = ArrayUtils.sortOn(
      tempList,
      "Data",
      ArrayConstant.NUMERIC | ArrayConstant.DESCENDING,
    );
    for (let i: number = 0; i < tempList.length; i++) {
      let temp: t_s_upgradetemplateData = tempList[i];
      if (this._honer >= temp.Data) {
        return temp;
      }
    }
    return null;
  }

  public get nextHonerTemp(): t_s_upgradetemplateData {
    let tempList: t_s_upgradetemplateData[] =
      TempleteManager.Instance.getTemplatesByType(
        UpgradeType.UPGRADE_TYPE_HONER,
      );
    tempList = ArrayUtils.sortOn(
      tempList,
      "Data",
      ArrayConstant.NUMERIC | ArrayConstant.DESCENDING,
    );
    for (let i: number = 0; i < tempList.length; i++) {
      let temp: t_s_upgradetemplateData = tempList[i];
      if (this._honer >= temp.Data) {
        if (tempList[i - 1]) {
          return tempList[i - 1];
        } else {
          return temp;
        }
      }
    }
    return null;
  }

  /**
   * 用户类型
   */
  public right: number = 0;
  private _nickName: string = "";
  public isExist: number = 0;
  public sexs: number = 0;
  public pics: number = 0;
  public camp: number = 0; //阵营
  private _consortiaID: number = 0;
  private _consortiaName: string = "";
  public claimId: number = 0; //头衔id
  public claimName: string = ""; //头衔name
  public repute: number = 0;
  private _IsVipAndNoExpirt: boolean = false;
  public vipType: number = 0;
  public storeGrade: number = 0;
  public parameter1: number = 0;
  // public strategy: Num = new Num(0);
  public ownHeros: number = 0;
  public ownWildlands: number = 0;
  public fightingCapacity: number = 0;
  public matchFailed: number = 0; //竞技场失败次数
  public matchWin: number = 0; //竞技场胜利次数
  public lastOutConsortia: number = 0; //退出公会时间
  private _isAuto: boolean; //是否自动退出公会
  public challengeRank: number = 0; //角斗场排名
  public invited: boolean = false;
  public serviceName: string = ""; //服务器name
  public mainSite: string = ""; //主区ID
  public vipGrade: number = 0; //
  private _logOutTime: object; // 下线时间
  public JJCcount: number = 0; //进入竞技场次数
  public honorEquipLevel: number = 0; //荣誉装备等级
  public honorEquipStage: number = 0; //荣誉装备阶级
  private _JJCMaxCount: number = 0; //进入竞技场最大次数
  public challengeScore: number = 0; //挑战积分
  public get JJCMaxCount(): number {
    if (!this._JJCMaxCount) {
      if (
        TempleteManager.Instance.getConfigInfoByConfigName("MatchRoom_MaxCount")
      )
        this._JJCMaxCount = Number(
          TempleteManager.Instance.getConfigInfoByConfigName(
            "MatchRoom_MaxCount",
          ).ConfigValue,
        );
    }
    return this._JJCMaxCount;
  }

  public qteGuide: number = 0;

  constructor() {
    super();

    this._changeObj = new SimpleDictionary();
    this.playerOrdeInfo = new PlayerOrderInfo();
    this.avatarChange = new SimpleDictionary();
  }

  public get logOutTime(): object {
    return this._logOutTime || new Date();
  }

  public set logOutTime(value: object) {
    if (!value) {
      return;
    }
    if (value instanceof Date) {
      this._logOutTime = value;
    } else {
      this._logOutTime = ClassFactory.copyDateType(value);
    }
  }

  public get LogOutTimeMs(): number {
    if (this.isOnline) {
      return Number.MAX_VALUE;
    } else {
      return (this._logOutTime as Date).getTime();
    }
  }

  public get isAuto(): boolean {
    return this._isAuto;
  }

  public set isAuto(value: boolean) {
    if (this._isAuto == value) {
      return;
    }
    this._isAuto = value;
    this._changeObj[SimplePlayerInfo.IS_AUTO] = true;
  }

  /**
   * 载具模板id
   */
  private _vehicleTempId: number = 1;
  public get vehicleTempId(): number {
    return this._vehicleTempId;
  }

  public set vehicleTempId(value: number) {
    if (this._vehicleTempId != value) {
      this._changeObj[SimplePlayerInfo.VEHICLEID_CHANGE] = true;
      this._vehicleTempId = value;
    }
  }

  // public get vehicleTemplate():VehicleObjectTempInfo {
  //     return TempleteManager.Instance.vehicleObjectTempInfoCate.getTemplateByIndex(this.vehicleTempId);
  // }

  /**
   * 英雄Avatar更新
   */
  public avatarChange: SimpleDictionary;

  /******************宠物 ******************/
  private _petMaxCount: number = 6;
  public get petMaxCount(): number {
    return this._petMaxCount;
  }

  private _dragonSoulType: number = 0;
  public get dragonSoulType(): number {
    return this._dragonSoulType;
  }

  public set dragonSoulType(value: number) {
    if (this._dragonSoulType != value) {
      this._changeObj[SimplePlayerInfo.DRAGON_SOUL_TYPE] = true;
      this._dragonSoulType = value;
    }
  }

  private _dragonSoulGrade: number = 0;
  public get dragonSoulGrade(): number {
    return this._dragonSoulGrade;
  }

  public set dragonSoulGrade(value: number) {
    if (this._dragonSoulGrade != value) {
      this._changeObj[SimplePlayerInfo.DRAGON_SOUL_GRADE] = true;
      this._dragonSoulGrade = value;
    }
  }

  private _dragonSoulGp: number = 0;
  public get dragonSoulGp(): number {
    return this._dragonSoulGp;
  }

  public set dragonSoulGp(value: number) {
    if (this._dragonSoulGp != value) {
      this._changeObj[SimplePlayerInfo.DRAGON_SOUL_GP] = true;
      this._dragonSoulGp = value;
    }
  }

  public set petMaxCount(value: number) {
    if (this._petMaxCount == value) {
      return;
    }
    this._petMaxCount = value;
    this.dispatchEvent(PetEvent.PET_MAXCOUNT_CHANGE, value);
  }

  private _petFormation: any[];
  private _petList: any[] = [];

  /** 所有宠物 */
  public get petList(): any[] {
    return this._petList;
  }

  public get petNum(): number {
    return this._petList.length;
  }

  /**
   * 战斗力最高的宠物
   */
  public get powerMaxPetData(): PetData {
    let p: PetData;
    for (const petData of this.petList) {
      if (!p || petData.fightPower > p.fightPower) {
        p = petData;
      }
    }
    return p;
  }

  /** 增加宠物 */
  public addPet($petData: PetData) {
    let find: PetData = this.getPet($petData.petId);
    if ($petData.isEnterWar) {
      this.enterWarPet = $petData;
    } else if ($petData == this.enterWarPet) {
      this.enterWarPet = null;
    }
    if (!find) {
      // this.removePet($petData.petId, false);
      this._petList.push($petData);
    }
    this._petList = ArrayUtils.sortOn(
      this._petList,
      ["fightPower"],
      [ArrayConstant.NUMERIC | ArrayConstant.DESCENDING],
    );
    if (find) {
      this.dispatchEvent(PetEvent.PET_UPDATE, $petData);
    } else {
      this.dispatchEvent(PetEvent.PET_ADD, $petData);
    }
  }

  /** 移除宠物 */
  public removePet(petId: number, isDispatch: boolean = true): PetData {
    let index: number = 0;
    for (const pet of this.petList) {
      if (pet.petId == petId) {
        this._petList.splice(index, 1);
        if (isDispatch) this.dispatchEvent(PetEvent.PET_REMOVE, pet);
        if (pet.isEnterWar || pet == this.enterWarPet) {
          this.enterWarPet = null;
        }
        return pet;
      }
      index++;
    }
    return null;
  }

  /** 查找宠物 */
  public getPet(petId: number): PetData {
    for (const pet of this.petList) {
      if (pet.petId == petId) {
        return pet;
      }
    }
    return null;
  }

  private _enterWarPet: PetData;

  /** 当前出战宠物数据 */
  public get enterWarPet(): PetData {
    return this._enterWarPet;
  }

  /**
   * @private
   */
  public set enterWarPet(value: PetData) {
    if (this._enterWarPet == value) {
      return;
    }
    this._enterWarPet = value;
    this.dispatchEvent(PetEvent.ENTERWAR_PET_CHANGE, value);
  }

  private _petChallengeIndexFormation: string = "-1,-1,-1";
  public petChallengeIndexFormationOfArray: any[] = [];
  /**
   * 英灵竞技出战顺序
   */
  public get petChallengeIndexFormation(): string {
    return this._petChallengeIndexFormation;
  }

  public set petChallengeIndexFormation(value: string) {
    if (this._petChallengeIndexFormation == value) {
      return;
    }
    this._petChallengeIndexFormation = value;
    if (value) {
      this.petChallengeIndexFormationOfArray = value.split(",");
    } else {
      this.petChallengeIndexFormationOfArray = [];
    }
    if (this.petChallengeIndexFormationOfArray.length > 0) {
      let len: number = this.petChallengeIndexFormationOfArray.length;
      for (let i: number = 0; i < len; i++) {
        if (this.petChallengeIndexFormationOfArray[i] > 0) {
          this.firstCtrPetTemplateId =
            this.petChallengeIndexFormationOfArray[i];
          break;
        }
      }
    } else {
      this.firstCtrPetTemplateId = 0;
    }
  }

  private _petChallengeFormation: string;
  public firstCtrPetTemplateId: number;
  /**
   * 英灵竞技的阵型 (1, 4, 7, 3, 6, 9)
   */
  public get petChallengeFormation(): string {
    return this._petChallengeFormation;
  }

  /**
   * @private
   */
  public set petChallengeFormation(value: string) {
    if (this._petChallengeFormation == value) {
      return;
    }
    this._petChallengeFormation = value;
    if (value) {
      this.petChallengeFormationOfArray = value.split(",");
    } else {
      this.petChallengeFormationOfArray = [];
    }

    this._changeObj[SimplePlayerInfo.PLAYER_PET_LIST_CHANGE] = true;
  }

  public petChallengeFormationOfArray: any[] = [];

  /**
   * 参与英灵竞技的英灵数量
   * @return
   *
   */
  public get petChallengeCount(): number {
    let count: number = 0;
    for (const id of this.petChallengeFormationOfArray) {
      if (id > 0) {
        count++;
        break;
      }
    }

    for (const id of this.petChallengeFormationOfArray) {
      if (id > 0) {
        count++;
        break;
      }
    }
    return count;
  }

  /******************宠物 end******************/

  private _battleGuardInfo: BattleGuardInfo = new BattleGuardInfo();
  private _selectGuardSocketInfo: BattleGuardSocketInfo = null; //当前选择项

  public get selectGuardSocketInfo(): BattleGuardSocketInfo {
    return this._selectGuardSocketInfo;
  }

  public set selectGuardSocketInfo(value: BattleGuardSocketInfo) {
    this._selectGuardSocketInfo = value;
  }

  /**
   * 战斗守护信息
   */
  public get battleGuardInfo(): BattleGuardInfo {
    return this._battleGuardInfo;
  }

  /**
   * @private
   */
  public set battleGuardInfo(value: BattleGuardInfo) {
    this._battleGuardInfo = value;
  }

  public mountInfo: SimpleMountInfo;

  public beginChanges() {
    this._changeObj && this._changeObj.clear();
  }

  public commit() {
    if (this._changeObj[SimplePlayerInfo.ATTACK_COUNT]) {
      this.dispatchEvent(PlayerEvent.ATTACK_COUNT_CHANGE, this);
    }
    if (this._changeObj[SimplePlayerInfo.CONSORTIA_DUTY]) {
      this.dispatchEvent(PlayerEvent.CONSORTIA_DUTY_CHANGE, this);
    }
    if (this._changeObj[SimplePlayerInfo.CONSORTIA_OFFER]) {
      this.dispatchEvent(PlayerEvent.CONSORTIA_OFFER_CHANGE, this);
    }
    if (this._changeObj[SimplePlayerInfo.CONSORTIA_JIANSE]) {
      this.dispatchEvent(PlayerEvent.CONSORTIA_JIANSE_CHANGE, this);
    }
    if (this._changeObj[SimplePlayerInfo.CONSORTIA]) {
      this.dispatchEvent(PlayerEvent.CONSORTIA_CHANGE, this);
    }
    if (this._changeObj[SimplePlayerInfo.CONSORTIA_NAME]) {
      this.dispatchEvent(PlayerEvent.CONSORTIA_NAME_CHANGE, this);
    }
    if (this._changeObj[SimplePlayerInfo.IS_AUTO]) {
      this.dispatchEvent(PlayerEvent.IS_AUTO_CHANGE, this);
    }
    if (this._changeObj[SimplePlayerInfo.NICKNAME]) {
      this.dispatchEvent(PlayerEvent.NICKNAME_UPDATE, this);
    }
    if (this._changeObj[SimplePlayerInfo.PLAYER_HONOR]) {
      this.dispatchEvent(PlayerEvent.PLAYER_HONOR, this);
    }
    if (this._changeObj[SimplePlayerInfo.PLAYER_HONOR_DAY]) {
      this.dispatchEvent(PlayerEvent.PLAYER_HONOR_DAY, this);
    }
    if (this._changeObj[SimplePlayerInfo.PLAYER_HONOR_DAY_MAX]) {
      this.dispatchEvent(PlayerEvent.PLAYER_HONOR_DAY_MAX, this);
    }
    if (this._changeObj[SimplePlayerInfo.STATE]) {
      this.dispatchEvent(PlayerEvent.PLAYER_STATE_CHANGE, this);
    }
    if (this._changeObj[SimplePlayerInfo.VEHICLEID_CHANGE]) {
      this.dispatchEvent(PlayerEvent.PLAYER_VEHICLE_CHANGE, this);
    }
    if (this._changeObj[SimplePlayerInfo.GLORY_CHANGE]) {
      this.dispatchEvent(PlayerEvent.GLORY_CHANGE, this);
    }
    if (this._changeObj[SimplePlayerInfo.PLAYER_PET_LIST_CHANGE]) {
      this.dispatchEvent(PlayerEvent.PLAYER_PET_LIST_CHANGE, this);
    }
    if (this._changeObj[SimplePlayerInfo.MUTICOPY_COUNT]) {
      this.dispatchEvent(PlayerEvent.MUTICOPY_COUNT, this);
    }
    if (this._changeObj[SimplePlayerInfo.MUTICOPY_MAX_COUNT]) {
      this.dispatchEvent(PlayerEvent.MUTICOPY_MAX_COUNT, this);
    }
    if (this._changeObj[SimplePlayerInfo.TAILA_COUNT]) {
      this.dispatchEvent(PlayerEvent.TAILA_COUNT, this);
    }
    if (this._changeObj[SimplePlayerInfo.DRAGON_SOUL_TYPE]) {
      this.dispatchEvent(PlayerEvent.DRAGON_SOUL_TYPE, this);
    }
    if (this._changeObj[SimplePlayerInfo.DRAGON_SOUL_GRADE]) {
      this.dispatchEvent(PlayerEvent.DRAGON_SOUL_GRADE, this);
    }
    if (this._changeObj[SimplePlayerInfo.DRAGON_SOUL_GP]) {
      this.dispatchEvent(PlayerEvent.DRAGON_SOUL_GP, this);
    }
    if (this._changeObj[SimplePlayerInfo.CONSORTIA_COIN]) {
      this.dispatchEvent(PlayerEvent.CONSORTIA_COIN_CHANGE, this);
    }
    if (this._changeObj[SimplePlayerInfo.IS_BIND_VERTIFY_PROMPTED]) {
      this.dispatchEvent(PlayerEvent.IS_BIND_VERTIFY_PROMPTED, this);
    }
    this.dispatchEvent(PlayerEvent.PLAYER_INFO_UPDATE, this);
    if (ArmyManager.Instance.thane.grades >= 50) {
      ComponentSetting.GENIUS = true;
    }
  }

  private _vocationGrades: number = 0;
  private _vocationLevel: number = 0;
  private _vocationStep: number = 0;

  /**
   * 职业等级（1-80）
   *
   */
  public get vocationGrades(): number {
    return this._vocationGrades;
  }

  public set vocationGrades(value: number) {
    if (this._vocationGrades != value) {
      this._changeObj[SimplePlayerInfo.VOCATION_GRADES] = true;
      this._vocationGrades = value;
      if (this._vocationGrades > 0) {
        this._vocationLevel = (this._vocationGrades - 1) / 10 + 1;
        this._vocationStep = this._vocationGrades % 10;
        if (this._vocationStep == 0) {
          this._vocationStep = 10;
        }
      } else {
        this._vocationLevel = 0;
        this._vocationStep = 0;
      }
    }
  }

  private _vocationGp: number = 0;
  public get vocationGp(): number {
    return this._vocationGp;
  }

  public set vocationGp(value: number) {
    if (this._vocationGp != value) {
      this._changeObj[SimplePlayerInfo.VOCATION_GP] = true;
      this._vocationGp = value;
    }
  }

  /**
   * 职业称号（1-8）
   *
   */
  public get vocationLevel(): number {
    return this._vocationLevel;
  }

  /**
   * 职业阶段(1-10)
   *
   */
  public get vocationStep(): number {
    return this._vocationStep;
  }

  private _mulSportChange: number = 0;
  public get mulSportChange(): number {
    return this._mulSportChange;
  }
  /**
   * 多人竞技积分
   */
  private _mulSportScore: number = 0;
  public get mulSportScore(): number {
    return this._mulSportScore;
  }

  public set mulSportScore(value: number) {
    if (this._mulSportScore != value) {
      this._mulSportChange = value - this._mulSportScore;
      this._mulSportScore = value;
    }
  }

  /**
   * 多人竞技段位
   */
  private _segmentId: number;
  public get segmentId(): number {
    return this._segmentId;
  }

  public set segmentId(value: number) {
    if (this._segmentId != value) {
      this._segmentId = value;
    }
  }

  /**
   * 符石碎片数量
   */
  private _runeNum: number = 0;
  public get runeNum(): number {
    return this._runeNum;
  }

  public set runeNum(value: number) {
    if (this._runeNum != value) {
      this._runeNum = value;
    }
  }

  private _autoRecruit: boolean = false;
  public get autoRecruit(): boolean {
    return this._autoRecruit;
  }

  public set autoRecruit(value: boolean) {
    if (this._autoRecruit != value) {
      this._autoRecruit = value;
    }
  }

  /**
   * 提醒用户绑定手机的弹窗, 只弹一次
   */
  private _isBindVertifyPrompted: boolean = false;
  public get isBindVertifyPrompted(): boolean {
    return this._isBindVertifyPrompted;
  }

  public set isBindVertifyPrompted(value: boolean) {
    if (this._isBindVertifyPrompted != value) {
      this._isBindVertifyPrompted = value;
      this._changeObj[SimplePlayerInfo.IS_BIND_VERTIFY_PROMPTED] = true;
    }
  }
}
