import ConfigMgr from "../../../core/config/ConfigMgr";
import { SimpleDictionary } from "../../../core/utils/SimpleDictionary";
import { AvatarPosition } from "../../avatar/data/AvatarPosition";
import { t_s_appellData } from "../../config/t_s_appell";
import { t_s_herotemplateData } from "../../config/t_s_herotemplate";
import { t_s_pettemplateData } from "../../config/t_s_pettemplate";
import { t_s_skilltemplateData } from "../../config/t_s_skilltemplate";
import { ConfigType } from "../../constant/ConfigDefine";
import { PlayerEvent } from "../../constant/event/PlayerEvent";
import { ArmyManager } from "../../manager/ArmyManager";
import { GoodsManager } from "../../manager/GoodsManager";
import { TaskManage } from "../../manager/TaskManage";
import { ThaneInfoHelper } from "../../utils/ThaneInfoHelper";
import { BaseSnsInfo } from "../BaseSnsInfo";
import { FateRotarySkillInfo } from "../FateRotarySkillInfo";
import { RuneInfo } from "../RuneInfo";
import { SkillInfo } from "../SkillInfo";
import { AttackProrertyInfo } from "./AttackProrertyInfo";
import { BasePropertyInfo } from "./BasePropertyInfo";
import { RuneCategory } from "./RuneCategory";
import { SimplePlayerInfo } from "./SimplePlayerInfo";
import { SkillCategory } from "./SkillCategory";
import { TalentData } from "./TalentData";
import SDKManager from "../../../core/sdk/SDKManager";
import { GameEventCode } from "../../constant/GameEventCode";
import { PlayerManager } from "../../manager/PlayerManager";
import { UserInfo } from "../userinfo/UserInfo";
import AppellManager from "../../manager/AppellManager";
import ModelMgr from "../../manager/ModelMgr";
import { EmModel } from "../../constant/model/modelDefine";
import { UserModelAttribute } from "../../constant/model/UserModelParams";

/**
 * 领主信息
 */
export class ThaneInfo extends SimplePlayerInfo {
  protected static TEMPLATEID: string = "TEMPLATEID";
  protected static GRADE: string = "GRADE";
  protected static GP: string = "GP";
  private static HIDE_FASHION: string = "HIDE_FASHION";
  // private static HIDE_FASHION1: string = "HIDE_FASHION1";
  // private static HIDE_FASHION2: string = "HIDE_FASHION2";
  // private static HIDE_FASHION3: string = "HIDE_FASHION3";
  // private static HIDE_FASHION4: string = "HIDE_FASHION4";
  private static BODY_AVATAR: string = "BODY_AVATAR";
  private static ARMS_AVATAR: string = "ARMS_AVATAR";
  private static HAIR_AVATAR: string = "BODY_AVATAR";
  private static CLOAK_AVATAR: string = "BODY_AVATAR";
  private static WING_AVATAR: string = "WING_AVATAR";
  private static MOUNT_AVATR: string = "MOUNT_AVATR";
  private static PET_AVATAR: string = "PET_AVATAR";
  private static BLOOD: string = "BLOOD";
  private static BLOOD_VISIBLE_UPDATE: string = "BLOOD_VISIBLE_UPDATE";
  private static JEWELGP: string = "JEWELGP";
  private static JEWELGRADES: string = "JEWELGRADES";

  private static CHANGE_SHAPE_ID: string = "changeShapeId";

  private static APPELL_CHANGE: string = "APPELL_CHANGE";
  private static SMALL_BUGLE_FREE_COUNT: string = "SMALL_BUGLE_FREE_COUNT";

  private static IS_VICE_HERO: string = "IS_VICE_HERO";

  /**
   * 本周是否分配过宝箱
   */
  public received: boolean = false;
  /**
   * 本周分配宝箱数量
   */
  public receivedCount: number = 0;
  /**
   * 快速邀请内容
   */
  public inviteContent: string;
  /**
   * 正在升级的符文
   */
  public runeInfo: RuneInfo;
  /**
   * 是否是机器人
   */
  public isRobot: boolean = false;
  /**
   * 玩家剩余的小喇叭免费次数
   */
  private _smallBugleFreeCount: number = 1;

  private _templateInfo: t_s_herotemplateData;

  public get templateId(): number {
    return this._templateId;
  }

  public set templateId(value: number) {
    this._templateInfo = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_herotemplate,
      value.toString(),
    );
    if (this._templateId == value) {
      return;
    }
    this._first = false;
    if (this.snsInfo.headId == this._templateId) {
      this.snsInfo.headId = value;
    }
    this._templateId = value;
    this._changeObj[ThaneInfo.TEMPLATEID] = true;
    if (!this._templateInfo) {
      this._templateInfo = new t_s_herotemplateData(null);
    }
  }

  public get smallBugleFreeCount(): number {
    return this._smallBugleFreeCount;
  }

  public set smallBugleFreeCount(value: number) {
    this._smallBugleFreeCount = value;
    this._changeObj[ThaneInfo.SMALL_BUGLE_FREE_COUNT] = true;
  }

  constructor() {
    super();

    this.baseProperty = new BasePropertyInfo();
    this.attackProrerty = new AttackProrertyInfo();
    this.skillCate = new SkillCategory();
    this.runeCate = new RuneCategory();
    this.talentData = new TalentData();
    this.equipDic = new SimpleDictionary();
    this.fateRotarySkillList = [];
  }

  private _first: boolean = false;

  /**
   * 第一次收到服务器的领主信息时初始化
   *
   */
  public checkFirst() {
    if (this._first) {
      return;
    }
    this._first = true;
    this.skillCate.initAllSkill(this.templateInfo.Job);
    this.runeCate.initAllRune(this.templateInfo.Job);
    this.talentData.initAllSkill(this.templateInfo.Job);
  }

  public relation: number = 0; //我与对方的关系
  public tarRelation: number = 0; //对方与我的关系
  public friendGp: number = 0; //好感度值
  private _friendGrade: number = 1; //好感度等级
  public get friendGrade(): number {
    return this._friendGrade;
  }

  public set friendGrade(value: number) {
    this._friendGrade = value;
  }

  public id: number = 0;
  private _templateId: number = 100; //英雄模板id
  public get headId(): number {
    if (this._headId == 0) {
      return this._templateId;
    }
    return this._headId;
  }

  public set headId(value: number) {
    this._headId = value;
  }

  private _headId: number = 0; //社交头像ID

  public hp: number = 0; //当前血量
  public fightPos: number = 0; //战斗中的站位
  public isTeamPlayer: boolean = false;
  public role: number = 0; //0   1,有管理公会战成员权限
  public isInwar: number = 0; //公会战0 代表没有参战,  1 代表参战

  /**
   * 命运守护技能
   */
  public fateSkill: string;

  private _snsInfo: BaseSnsInfo;
  /**
   * 社交信息
   */
  public get snsInfo(): BaseSnsInfo {
    if (!this._snsInfo) {
      this._snsInfo = new BaseSnsInfo();
      this._snsInfo.userId = this.userId;
      this._snsInfo.headId = this._templateId;
      this._snsInfo.nickName = this.nickName;
      this._snsInfo.sign = "";
      this._snsInfo.sex = 0;
      this._snsInfo.birthdayType = 0;
      this._snsInfo.birthYear = 0;
      this._snsInfo.birthMonth = 0;
      this._snsInfo.birthDay = 0;
      this._snsInfo.horoscope = 0;
      this._snsInfo.bloodType = 0;
      this._snsInfo.country = 0;
      this._snsInfo.province = 0;
      this._snsInfo.city = 0;
    }
    return this._snsInfo;
  }

  public set snsInfo(info: BaseSnsInfo) {
    if (this._snsInfo == info) {
      return;
    }
    this._snsInfo = info;
  }

  /**
   * 英雄身上装备
   */
  public equipDic: SimpleDictionary;
  /**
   * 基础属性
   */
  public baseProperty: BasePropertyInfo;
  /**
   * 攻击属性
   */
  public attackProrerty: AttackProrertyInfo;
  /**
   * 技能
   */
  public skillCate: SkillCategory;
  /**
   * 天赋
   */
  public talentData: TalentData;
  /**
   * 符文
   */
  public runeCate: RuneCategory;

  public fateRotarySkillList: FateRotarySkillInfo[];
  public fateTotalGp: number = 0;
  public fateGrades: string;
  /**
   *变身
   */
  private _changeShapeId: number = 0;
  public get changeShapeId(): number {
    return this._changeShapeId;
  }

  public set changeShapeId(value: number) {
    if (this._changeShapeId == value) {
      return;
    }
    this._changeShapeId = value;
    this._changeObj[ThaneInfo.CHANGE_SHAPE_ID] = true;
  }

  private _preGrade: number = 0;
  public get preGrade(): number {
    return this._preGrade;
  }

  /**
   * 等级
   */
  private _grades: number = 0;
  public get grades(): number {
    return this._grades;
  }

  public set grades(value: number) {
    if (this._grades != value) {
      this._changeObj[ThaneInfo.GRADE] = true;
      this._preGrade = this._grades;
      this._grades = value;
    }
  }

  /**
   * 经验
   */
  private _gp: number = 0;
  public get gp(): number {
    return this._gp;
  }

  public set gp(value: number) {
    if (this._gp != value) {
      this._changeObj[ThaneInfo.GP] = true;
      this._gp = value;
    }
  }

  /**
   * 离线经验
   */
  private _offlineGp: number = 0;
  public get offlineGp(): number {
    return this._offlineGp;
  }

  public set offlineGp(value: number) {
    if (this._offlineGp == value) {
      return;
    }
    this._offlineGp = value < 0 ? 0 : value;
  }

  /**
   * 累计在线时长
   */
  private _onlineTime: number = 0;
  public get onlineTime(): number {
    return this._onlineTime;
  }

  public set onlineTime(value: number) {
    if (this._onlineTime != value) {
      this._onlineTime = value;

      let channelId: number = Number(
        ModelMgr.Instance.getProperty(
          EmModel.USER_MODEL,
          UserModelAttribute.channelId,
        ),
      );
      if (channelId == 20360) {
        //39渠道埋点 在线30分钟  →  玩家从创角开始累计玩了30分钟
        let postEventTime: number = 30 * 60; //在线30分钟
        if (value <= postEventTime) {
          Laya.timer.once(postEventTime - value, this, () => {
            SDKManager.Instance.getChannel().postGameEvent(
              GameEventCode.Code_2020,
            );
          });
        }
      }
    }
  }

  /**
   * 身上宝石加成系数
   */
  /**
   * 等级
   */
  private _jewelGrades: number = 0;
  public get jewelGrades(): number {
    return this._jewelGrades;
  }

  public set jewelGrades(value: number) {
    if (this._jewelGrades != value) {
      this._changeObj[ThaneInfo.JEWELGRADES] = true;
      this._jewelGrades = value;
    }
  }

  /**
   * 其他玩家天赋等级
   */
  private _talentGrade: number = 0;
  public set talentGrade(value: number) {
    this._talentGrade = value;
  }
  public get talentGrade(): number {
    return this._talentGrade;
  }

  /**
   * 其他玩家功勋等级
   */
  private _meritorGrade: number = 0;
  public set meritorGrade(value: number) {
    this._meritorGrade = value;
  }
  public get meritorGrade(): number {
    return this._meritorGrade;
  }

  /**
   * 其他玩家荣誉等级
   */
  private _honorGrade: number = 0;
  public set honorGrade(value: number) {
    this._honorGrade = value;
  }
  public get honorGrade(): number {
    return this._honorGrade;
  }

  /**
   * 其他玩家时装吞噬等级
   */
  private _devourGrade: number = 0;
  public set devourGrade(value: number) {
    this._devourGrade = value;
  }
  public get devourGrade(): number {
    return this._devourGrade;
  }

  /**
   * 灵魂刻印经验
   */
  private _jewelGp: number = 0;
  public get jewelGp(): number {
    return this._jewelGp;
  }

  public set jewelGp(value: number) {
    if (this._jewelGp != value) {
      this._changeObj[ThaneInfo.JEWELGP] = true;
      this._jewelGp = value;
    }
  }

  /**
   * 普通装备衣服avatar
   */
  private _bodyEquipAvata: string = "";
  /**
   * 时装衣服 avatar
   */
  private _bodyFashionAvata: string = "";
  /**是否隐藏时装, 应逐步废弃*/
  private _hideFashion: boolean = false; //是否隐藏时装
  // private _hideFashion1: boolean = false;//是否隐藏时装-头饰
  // private _hideFashion2: boolean = false;//是否隐藏时装-衣服
  // private _hideFashion3: boolean = false;//是否隐藏时装-武器
  // private _hideFashion4: boolean = false;//是否隐藏时装-翅膀
  public get hideFashion(): boolean {
    return this._hideFashion;
  }

  public set hideFashion(value: boolean) {
    //设置隐藏时装
    if (this._hideFashion != value) {
      this._hideFashion = value;
      this._changeObj[ThaneInfo.HIDE_FASHION] = true;
    }
  }

  public get bodyAvata(): string {
    // if (!this._hideFashion && this._bodyFashionAvata != "") {
    //     return this._bodyFashionAvata;
    // }
    return this._bodyFashionAvata || this._bodyEquipAvata;
  }

  public set bodyEquipAvata(value: string) {
    if (this._bodyEquipAvata != value) {
      this._changeObj[ThaneInfo.BODY_AVATAR] = true;
      this._bodyEquipAvata = value;
    }
  }

  public get bodyFashionAvata(): string {
    return this._bodyFashionAvata;
  }

  public get bodyEquipAvata(): string {
    return this._bodyEquipAvata;
  }

  public set bodyFashionAvata(value: string) {
    if (this._bodyFashionAvata != value) {
      this._changeObj[ThaneInfo.BODY_AVATAR] = true;
      this._bodyFashionAvata = value;
    }
  }

  private _armsEquipAvata: string = "";
  private _armsFashionAvata: string = ""; //时装武器
  public get armsAvata(): string {
    // if (!this._hideFashion && this._armsFashionAvata != "") {
    //     return this._armsFashionAvata;
    // }
    return this._armsFashionAvata || this._armsEquipAvata;
  }

  public set armsEquipAvata(value: string) {
    if (this._armsEquipAvata != value) {
      this._changeObj[ThaneInfo.ARMS_AVATAR] = true;
      this._armsEquipAvata = value;
    }
  }

  public get armsFashionAvata(): string {
    return this._armsFashionAvata;
  }

  public get armsEquipAvata(): string {
    return this._armsEquipAvata;
  }

  public set armsFashionAvata(value: string) {
    if (this._armsFashionAvata != value) {
      this._changeObj[ThaneInfo.ARMS_AVATAR] = true;
      this._armsFashionAvata = value;
    }
  }

  private _hairEquipAvata: string = "";
  private _hairFashionAvata: string = ""; //时装帽子
  public get hairAvata(): string {
    // if (!this._hideFashion && this._hairFashionAvata != "") {
    //     return this._hairFashionAvata;
    // }
    return this._hairFashionAvata || this._hairEquipAvata;
  }

  public set hairEquipAvata(value: string) {
    if (this._hairEquipAvata != value) {
      this._changeObj[ThaneInfo.HAIR_AVATAR] = true;
      this._hairEquipAvata = value;
    }
  }

  public get hairFashionAvata(): string {
    return this._hairFashionAvata;
  }

  public get hairEquipAvata(): string {
    return this._hairEquipAvata;
  }

  public set hairFashionAvata(value: string) {
    if (this._hairFashionAvata != value) {
      this._changeObj[ThaneInfo.HAIR_AVATAR] = true;
      this._hairFashionAvata = value;
    }
  }

  private _cloakAvata: string = "";
  public get cloakAvata(): string {
    return this._cloakAvata;
  }

  public set cloakAvata(value: string) {
    if (this._cloakAvata != value) {
      this._changeObj[ThaneInfo.CLOAK_AVATAR] = true;
      this._cloakAvata = value;
    }
  }

  private _wingAvata: string = ""; //时装翅膀
  public get wingAvata(): string {
    // if (this._hideFashion) {
    //     return "";
    // }
    return this._wingAvata;
  }

  public set wingAvata(value: string) {
    if (this._wingAvata != value) {
      this._changeObj[ThaneInfo.WING_AVATAR] = true;
      this._wingAvata = value;
    }
  }

  public get wingEquipAvata(): string {
    return this._wingAvata;
  }

  private _mountAvata: string = null;
  public get mountAvata(): string {
    return this._mountAvata;
  }

  public set mountAvata(value: string) {
    if (this._mountAvata != value) {
      this._changeObj[ThaneInfo.MOUNT_AVATR] = true;
      this._mountAvata = value;
    }
  }

  public petTemplate: t_s_pettemplateData;
  private _petTemplateId: number = 0;

  /**
   * 当前携带的宠物模板id
   * @return
   *
   */
  public get petTemplateId(): number {
    return this._petTemplateId;
  }

  public set petTemplateId(value: number) {
    if (value == this._petTemplateId) {
      return;
    }
    this._petTemplateId = value;
    this.petTemplate = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_pettemplate,
      value.toString(),
    );
    this._changeObj[ThaneInfo.PET_AVATAR] = true;
  }

  private _petName: string = "";

  public get petName(): string {
    if (this._petName == "" && this._petTemplateId != 0) {
      this._petName = this.petTemplate.TemplateNameLang;
    }
    return this._petName;
  }

  public set petName(value: string) {
    if (this._petName == value || value == "") {
      return;
    }
    this._petName = value;
  }

  private _petQuaity: number = 1;
  public get petQuaity(): number {
    return this._petQuaity;
  }

  public set petQuaity(value: number) {
    this._petQuaity = Math.floor(value);
  }
  private _temQuality: number = 1;
  public get temQuality(): number {
    return this._temQuality;
  }

  public set temQuality(value: number) {
    this._temQuality = Math.floor(value);
  }

  public get petTemQuality(): number {
    return this._temQuality;
  }

  private _blood: number = 0; //血袋剩余血量
  public get blood(): number {
    return this._blood;
  }

  public set blood(value: number) {
    if ((this._blood == 0 && value > 0) || (this._blood > 0 && value == 0)) {
      this._changeObj[ThaneInfo.BLOOD_VISIBLE_UPDATE] = true;
    }
    if (this._blood != value) {
      this._changeObj[ThaneInfo.BLOOD] = true;
      this._blood = value;
    }
  }

  public bloodId: number = 0;

  private _appellId: number = 0; //称号id
  /**
   * 称号id
   **/
  public get appellId(): number {
    return this._appellId;
  }

  public set appellId(value: number) {
    if (this._appellId != value) {
      this._appellId = value;
      this._changeObj[ThaneInfo.APPELL_CHANGE] = true;
    }
  }

  public get appellInfo(): t_s_appellData {
    return AppellManager.Instance.model.getAppellInfo(this._appellId);
  }

  public get templateInfo(): t_s_herotemplateData {
    return this._templateInfo;
  }

  /**
   * 根据职业取得天赋技能模板id, 写死
   * @return
   *
   */
  public getSpecialSkillIdByJob(): number {
    switch (ThaneInfoHelper.getJob(this.job)) {
      case 1:
        return 10011;
      case 2:
        return 20011;
      case 3:
        return 30011;
    }
    return 0;
  }

  /**
   * 是否存在指定技能
   * @param info
   * @return
   *
   */
  public existSkill(info: t_s_skilltemplateData): number {
    return this.skillCate.existSkill(info);
  }

  /**
   * 是否存在指定天赋
   * @param info
   * @return
   *
   */
  public existTalent(info: t_s_skilltemplateData): number {
    return this.talentData.existSkill(info);
  }

  /**
   * 获取英雄所有技能模板
   * @return
   *
   */
  public getSkillTemps(): t_s_skilltemplateData[] {
    return this.skillCate.getSkillTemps();
  }

  /**
   * 根据技能sontype获得技能信息
   * @param sontype
   * @return
   *
   */
  public getSkillBySontype(sontype: number): SkillInfo {
    return this.skillCate.getSkillBySontype(sontype);
  }

  public getExtrajobSkillBySontype(sontype: number): SkillInfo {
    return this.skillCate.getExtrajobSkillBySontype(sontype);
  }

  /**
   * 快捷技能数量
   * @return
   *
   */
  public get fastKeyLength(): number {
    return this.skillCate.fastKeyLength;
  }

  /**
   * 通过模板id取得命运守护技能
   * @param tid
   *
   */
  public getFateGuardSkill(fateTypes: number): FateRotarySkillInfo {
    for (var info of this.fateRotarySkillList) {
      if (info.fateTypes == fateTypes) {
        return info;
      }
    }
    return null;
  }

  /**
   * 获得对应属性的基础属性加成
   * @param property
   * @return
   *
   */
  public hasEffectBaseProperty(property: string): number {
    return this.baseProperty.hasEffect(property);
  }

  /**
   * 获得对应属性的攻击属性加成
   * @param property
   * @return
   *
   */
  public hasEffectAttackProperty(property: string): number {
    return this.attackProrerty.hasEffect(property);
  }

  /**
   * 获取英雄身上的装备列表
   * @return
   *
   */
  public getEquipList(): SimpleDictionary {
    if (this.id != ArmyManager.Instance.thane.id) {
      return this.equipDic;
    }
    return GoodsManager.Instance.getHeroEquipListById(this.id);
  }

  private get userInfo(): UserInfo {
    return PlayerManager.Instance.currentPlayerModel.userInfo;
  }

  private checkAvatarChange() {
    this.avatarChange.clear();
    if (this._changeObj[ThaneInfo.CHANGE_SHAPE_ID]) {
      this.avatarChange[AvatarPosition.HAIR_UP] = true;
      this.avatarChange[AvatarPosition.HAIR_DOWN] = true;
      this.avatarChange[AvatarPosition.BODY] = true;
      this.avatarChange[AvatarPosition.ARMY] = true;
      this.avatarChange[AvatarPosition.CLOAK] = true;
      this.avatarChange[AvatarPosition.WING] = true;
      this.avatarChange[AvatarPosition.MOUNT] = true;
    }
    if (this._changeObj[ThaneInfo.HIDE_FASHION]) {
      this.avatarChange[AvatarPosition.HAIR_UP] = true;
      this.avatarChange[AvatarPosition.HAIR_DOWN] = true;
      this.avatarChange[AvatarPosition.BODY] = true;
      this.avatarChange[AvatarPosition.ARMY] = true;
      this.avatarChange[AvatarPosition.CLOAK] = true;
      this.avatarChange[AvatarPosition.WING] = true;
    }
    if (this._changeObj[ThaneInfo.HAIR_AVATAR]) {
      this.avatarChange[AvatarPosition.HAIR_UP] = true;
      this.avatarChange[AvatarPosition.HAIR_DOWN] = true;
    }
    if (this._changeObj[ThaneInfo.BODY_AVATAR]) {
      this.avatarChange[AvatarPosition.BODY] = true;
    }
    if (this._changeObj[ThaneInfo.ARMS_AVATAR]) {
      this.avatarChange[AvatarPosition.ARMY] = true;
    }
    if (this._changeObj[ThaneInfo.CLOAK_AVATAR]) {
      this.avatarChange[AvatarPosition.CLOAK] = true;
    }
    if (this._changeObj[ThaneInfo.WING_AVATAR]) {
      this.avatarChange[AvatarPosition.WING] = true;
    }
    if (this._changeObj[ThaneInfo.MOUNT_AVATR]) {
      this.avatarChange[AvatarPosition.MOUNT] = true;
    }
    if (this._changeObj[ThaneInfo.PET_AVATAR]) {
      this.avatarChange[AvatarPosition.PET] = true;
    }
  }

  public commit() {
    if (this._changeObj[ThaneInfo.GRADE] && this._preGrade != 0) {
      // var siteArr:any[] = this.userInfo.site.split("_");
      // if(siteArr[0] == "duowan")
      // {//多玩接口需求, 玩家注册时, 调用平台接口, type=1为玩家升级
      //     CallInterfaceUtil.cannDuowanPlayerNotify(this.userInfo.user, this.userInfo.site, 1, number(siteArr[1]));
      //     CallInterfaceUtil.reportGameProfile(this.userInfo.site, parseInt(this.userInfo.user), this.nickName, this.grades);
      // }
      SDKManager.Instance.getChannel().postGameEvent(GameEventCode.Code_1042);
      let channelId: number = Number(
        ModelMgr.Instance.getProperty(
          EmModel.USER_MODEL,
          UserModelAttribute.channelId,
        ),
      );
      if (channelId == 20360 && this._grades == 5) {
        //39渠道 新手流程结束  →  玩家达到5级
        SDKManager.Instance.getChannel().postGameEvent(GameEventCode.Code_1061);
      }
      TaskManage.Instance.requestCanAcceptTask();
      if (this._preGrade != 55 && this._grades >= 55) {
        ArmyManager.Instance.getFateRotarySkillList();
      }
      this.dispatchEvent(PlayerEvent.THANE_LEVEL_UPDATE, this);
    }
    if (this._changeObj[ThaneInfo.GP]) {
      this.dispatchEvent(PlayerEvent.THANE_EXP_UPDATE, this);
    }
    if (this._changeObj[ThaneInfo.BLOOD]) {
      this.dispatchEvent(PlayerEvent.BLOOD_UPDATE, this);
    }
    if (this._changeObj[ThaneInfo.BLOOD_VISIBLE_UPDATE]) {
      this.dispatchEvent(PlayerEvent.BLOOD_VISIBLE_UPDATE, this);
    }
    if (this._changeObj[ThaneInfo.JEWELGP]) {
      this.dispatchEvent(PlayerEvent.JEWELGP_UPDATE, this);
    }
    if (this._changeObj[ThaneInfo.JEWELGRADES]) {
      this.dispatchEvent(PlayerEvent.JEWELGRADES_UPDATE, this);
    }
    if (
      this._changeObj[ThaneInfo.BODY_AVATAR] ||
      this._changeObj[ThaneInfo.ARMS_AVATAR] ||
      this._changeObj[ThaneInfo.HAIR_AVATAR] ||
      this._changeObj[ThaneInfo.CLOAK_AVATAR] ||
      this._changeObj[ThaneInfo.CHANGE_SHAPE_ID] ||
      this._changeObj[ThaneInfo.WING_AVATAR] ||
      this._changeObj[ThaneInfo.MOUNT_AVATR] ||
      this._changeObj[ThaneInfo.HIDE_FASHION] ||
      this._changeObj[ThaneInfo.PET_AVATAR] ||
      this._changeObj[ThaneInfo.TEMPLATEID]
    ) {
      this.checkAvatarChange();
      this.dispatchEvent(PlayerEvent.PLAYER_AVATA_CHANGE, this);
    }
    if (this._changeObj[ThaneInfo.APPELL_CHANGE]) {
      this.dispatchEvent(PlayerEvent.APPELL_CHANGE, this);
    }
    if (this._changeObj[ThaneInfo.SMALL_BUGLE_FREE_COUNT]) {
      this.dispatchEvent(PlayerEvent.SMALL_BUGLE_FREE_COUNT, this);
    }
    this.dispatchEvent(PlayerEvent.THANE_INFO_UPDATE, this);
    super.commit();
  }

  /**
   * 装备凝练等级
   */
  private _conciseGrades: number;
  public get conciseGrades(): number {
    return this._conciseGrades;
  }
  public set conciseGrades(value: number) {
    if (this._conciseGrades != value) {
      this._changeObj["CONCISE_GRADES"] = true;
      this._conciseGrades = value;
    }
  }
  /**
   * 装备凝练经验值
   */
  private _conciseGp: number;
  public get conciseGp(): number {
    return this._conciseGp;
  }

  public set conciseGp(value: number) {
    if (this._conciseGp != value) {
      this._changeObj["CONCISE_GP"] = true;
      this._conciseGp = value;
    }
  }

  /**
   * 是否副职业
   */
  private _isViceHero: boolean;
  public get isViceHero(): boolean {
    return this._isViceHero;
  }

  public set isViceHero(value: boolean) {
    if (this._isViceHero == value) return;
    this._isViceHero = value;
    this._changeObj[ThaneInfo.IS_VICE_HERO] = true;
  }
}
