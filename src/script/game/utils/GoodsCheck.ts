import { GoodsInfo } from "../datas/goods/GoodsInfo";
import { ThaneInfo } from "../datas/playerinfo/ThaneInfo";
import { GoodsType } from "../constant/GoodsType";
import GoodsSonType from "../constant/GoodsSonType";
import LangManager from "../../core/lang/LangManager";
import { GoodsManager } from "../manager/GoodsManager";
import { MessageTipManager } from "../manager/MessageTipManager";
import { ArrayConstant, ArrayUtils } from "../../core/utils/ArrayUtils";
import { ArmyManager } from "../manager/ArmyManager";
import { t_s_itemtemplateData } from "../config/t_s_itemtemplate";
import ForgeData from "../module/forge/ForgeData";

/**
 * @description 物品的各种判断
 * @author yuanzhan.yu
 * @date 2021/1/27 15:21
 * @ver 1.0
 */
export class GoodsCheck {
  constructor() {}

  public static checkGoodsByHero(
    data: GoodsInfo,
    hero: ThaneInfo,
    popMsg: boolean = true,
  ): boolean {
    if (!data) {
      return false;
    }
    if (!this.isJobFix(hero, data.templateInfo, popMsg)) {
      return false;
    } //职业是否相符
    if (!this.isSexFix(hero, data.templateInfo, popMsg)) {
      return false;
    } //性别是否相符
    return true;
  }

  public static checkGoodsCanEquip(
    data: GoodsInfo,
    hero: ThaneInfo,
    popMsg: boolean = false,
  ): boolean {
    if (!data) {
      return false;
    }
    if (!this.isGradeFix(this.thane, data.templateInfo, false)) {
      return false;
    }
    if (
      data.templateInfo.MasterType != GoodsType.EQUIP &&
      data.templateInfo.SonType != GoodsSonType.SONTYPE_RUNNES &&
      data.templateInfo.MasterType != GoodsType.HONER
    ) {
      return false;
    }
    if (!this.isJobFix(hero, data.templateInfo, popMsg)) {
      return false;
    } //职业是否相符
    if (!this.isSexFix(hero, data.templateInfo, popMsg)) {
      return false;
    } //性别是否相符
    return true;
  }

  /**
   *判断是否为装备
   * @param info
   * @return
   *
   */
  public static isEquip(info: t_s_itemtemplateData): boolean {
    if (info && info.MasterType == GoodsType.EQUIP) {
      return true;
    }
    return false;
  }

  /**
   *判断是否为可进阶的装备
   * @param info
   * @return
   *
   */
  public static isUpdateEquip(info: t_s_itemtemplateData): boolean {
    if (
      info.MasterType == GoodsType.EQUIP &&
      info.SuiteId != 0 &&
      info.NeedGrades >= 40
    ) {
      //为可进阶的装备
      return true;
    }
    return false;
  }

  public static isJobFix(
    hero: ThaneInfo,
    info: t_s_itemtemplateData,
    popMsg: boolean,
  ): boolean {
    let arr: number[] = info.Job;
    for (const key in arr) {
      if (arr.hasOwnProperty(key)) {
        let job: number = arr[key];
        if (job == 0 || job == hero.templateInfo.Job) {
          return true;
        }
      }
    }
    if (popMsg) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("bag.helper.GoodsCheck.command01"),
      );
    }
    return false;
  }

  public static isSexFix(
    hero: ThaneInfo,
    info: t_s_itemtemplateData,
    popMsg: boolean,
  ): boolean {
    if (info.Sexs == 2 || hero.templateInfo.Sexs == info.Sexs) {
      return true;
    }
    if (popMsg) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("bag.helper.GoodsCheck.command02"),
      );
    }
    return false;
  }

  public static isGradeFix(
    thane: ThaneInfo,
    info: t_s_itemtemplateData,
    popMsg: boolean,
  ): boolean {
    if (info.NeedGrades == 0 || thane.grades >= info.NeedGrades) {
      return true;
    }
    if (popMsg) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "bag.helper.GoodsCheck.command03",
          info.NeedGrades,
        ),
      );
    }
    return false;
  }

  public static checkGoodsCanEquipNotCheckGrade(
    data: GoodsInfo,
    hero: ThaneInfo,
    popMsg: boolean = false,
  ): boolean {
    if (!data) {
      return false;
    }
    if (
      data.templateInfo.MasterType != GoodsType.EQUIP &&
      data.templateInfo.SonType != GoodsSonType.SONTYPE_RUNNES &&
      data.templateInfo.MasterType != GoodsType.HONER
    ) {
      return false;
    }
    if (!this.isJobFix(hero, data.templateInfo, popMsg)) {
      return false;
    } //职业是否相符
    if (!this.isSexFix(hero, data.templateInfo, popMsg)) {
      return false;
    } //性别是否相符
    return true;
  }

  public static checkGoodsBetterNotCheckGrade(goods: GoodsInfo): boolean {
    if (
      !this.checkGoodsCanEquipNotCheckGrade(goods, this.thane) ||
      goods.templateInfo.SonType == GoodsSonType.SONTYPE_RUNNES
    ) {
      return false;
    }
    let heroBag: any[] = GoodsManager.Instance.getHeroGoodsListBySonTypeAndId(
      goods.templateInfo.SonType,
      this.thane.id,
    ).getList();
    let pos_arr: any[] = GoodsSonType.getSonTypePos(goods.templateInfo.SonType);
    heroBag = ArrayUtils.sortOn(heroBag, "pos", ArrayConstant.NUMERIC);
    if (pos_arr.length > heroBag.length) {
      return false; // 对应装备位如果是空的,服务端会自动装备(所以不需要提示)
    }
    for (const key in heroBag) {
      if (heroBag.hasOwnProperty(key)) {
        let i: GoodsInfo = heroBag[key];
        let temp1: t_s_itemtemplateData = i.templateInfo;
        let temp2: t_s_itemtemplateData = goods.templateInfo;
        let point1: number = i.getEquipBaseScore(); //temp1.MagicAttack + temp1.Attack + temp1.MagicDefence + temp1.Defence + temp1.Conat + temp1.Live;
        let point2: number = goods.getEquipBaseScore(); //temp2.MagicAttack + temp2.Attack + temp2.MagicDefence + temp2.Defence + temp2.Conat + temp2.Live;
        if (point2 > point1) {
          return true;
        } else if (point2 == point1 && temp2.Profile > temp1.Profile) {
          return true;
        }
      }
    }
    return false;
  }

  public static checkGoodsBetterThanHero(goods: GoodsInfo): boolean {
    if (
      !this.checkGoodsCanEquip(goods, this.thane) ||
      goods.templateInfo.SonType == GoodsSonType.SONTYPE_RUNNES
    ) {
      return false;
    }
    if (!this.isGradeFix(this.thane, goods.templateInfo, false)) {
      return false;
    }
    let heroBag: any[] = GoodsManager.Instance.getHeroGoodsListBySonTypeAndId(
      goods.templateInfo.SonType,
      this.thane.id,
    ).getList();
    let pos_arr: any[] = GoodsSonType.getSonTypePos(goods.templateInfo.SonType);
    heroBag = ArrayUtils.sortOn(heroBag, "pos", ArrayConstant.NUMERIC);
    if (pos_arr.length > heroBag.length) {
      return true;
    }
    for (const key in heroBag) {
      if (heroBag.hasOwnProperty(key)) {
        let i: GoodsInfo = heroBag[key];
        let temp1: t_s_itemtemplateData = i.templateInfo;
        let temp2: t_s_itemtemplateData = goods.templateInfo;
        let point1: number = i.getEquipTrueBaseScore(); //temp1.MagicAttack + temp1.Attack + temp1.MagicDefence + temp1.Defence + temp1.Conat + temp1.Live;
        let point2: number = goods.getEquipTrueBaseScore(); //temp2.MagicAttack + temp2.Attack + temp2.MagicDefence + temp2.Defence + temp2.Conat + temp2.Live;
        if (point2 > point1) {
          return true;
        } else if (point2 == point1 && temp2.Profile > temp1.Profile) {
          return true;
        }
      }
    }
    return false;
  }

  public static getBestGoodsInList(list: any[]): GoodsInfo {
    return list.sort(this.sortOnBaseProperty)[0];
  }

  /**
   * 装备按基础属性比较是否可以替换
   * @param info1
   * @param info2
   * @returns
   */
  public static sortOnBaseProperty(info1: GoodsInfo, info2: GoodsInfo): number {
    let time1: number = info1.getBasePropertyScore(); // + info1.getEquipAdditionScore();
    let time2: number = info2.getBasePropertyScore(); // + info2.getEquipAdditionScore();
    if (time1 > time2) {
      return -1;
    } else if (time1 < time2) {
      return 1;
    } else {
      if (info1.templateInfo.Profile > info2.templateInfo.Profile) {
        return -1;
      } else if (info1.templateInfo.Profile < info2.templateInfo.Profile) {
        return 1;
      } else {
        return 0;
      }
    }
  }

  public static sortOnScore(info1: GoodsInfo, info2: GoodsInfo): number {
    let time1: number = info1.getEquipBaseScore(); // + info1.getEquipAdditionScore();
    let time2: number = info2.getEquipBaseScore(); // + info2.getEquipAdditionScore();
    if (time1 > time2) {
      return -1;
    } else if (time1 < time2) {
      return 1;
    } else {
      if (info1.templateInfo.Profile > info2.templateInfo.Profile) {
        return -1;
      } else if (info1.templateInfo.Profile < info2.templateInfo.Profile) {
        return 1;
      } else {
        return 0;
      }
    }
  }

  /**
   * 计算强化装备需要的黄金
   * @param info
   * @return
   *
   */
  public static getIntensifuGold(info: GoodsInfo): number {
    let g: number = info.templateInfo.NeedGrades;
    let p: number = Math.min(info.templateInfo.Profile, 4);
    let s: number = info.strengthenGrade;
    // if (info.templateInfo.NeedGrades >= 80) {
    //     //黄金=(（number(装备所需等级/10)+1）^2)*装备品质*(（强化等级+1）^2.2)*10
    //     return Math.ceil((Math.pow(Math.floor(g / 10) + 1, 2) * p * Math.pow(s + 1, 2.1)) * 10);
    // }
    return Math.floor(
      Math.pow(1.5, Math.floor(g / 10) + 1) *
        (p + 1) *
        Math.pow(s + 1, 2.2) *
        5 +
        500,
    );
  }

  /**
   *获得物品的售价（黄金）
   * @param info
   * @return
   *
   */
  public static getSellGold(info: GoodsInfo): number {
    let count: number = 0;
    let g: number = info.templateInfo.NeedGrades;
    let p: number = Math.min(info.templateInfo.Profile, 4);
    let s: number = info.strengthenGrade;
    for (let i: number = 1; i <= s; i++) {
      count += Math.floor(
        Math.pow(1.5, Math.floor(g / 10) + 1) * (p + 1) * Math.pow(i, 2.2) * 5 +
          500,
      );
    }
    return Math.floor(info.templateInfo.SellGold + 0.7 * count);
  }

  public static isAddToChecker(
    beginData: GoodsInfo,
    endData: GoodsInfo,
  ): boolean {
    if (
      ((beginData.isBinds == false && endData.isBinds == true) ||
        (beginData.isBinds == true && endData.isBinds == false)) && //绑定状态不同
      beginData.templateInfo.SonType == endData.templateInfo.SonType && //可叠加物品
      beginData.templateId == endData.templateId && //模版ID一致
      endData.count < endData.templateInfo.MaxCount
    ) {
      //目标物品未满
      return true;
    }
    return false;
  }

  /**
   * 是否为vip体验卡
   * @param good
   * @return
   *
   */
  public static isVipExperienceCard(good: GoodsInfo): boolean {
    return good.templateId == 2031201;
    //			return true;
  }

  public static isKingCard(goods: GoodsInfo): boolean {
    return (
      goods.templateInfo.SonType == GoodsSonType.SONTYPE_USEABLE &&
      goods.templateInfo.Property1 == 13
    );
  }

  /**
   * 副本中掉落的黄金
   * @param good
   * @return
   *
   */
  public static isGoldInCampaign(good: GoodsInfo): boolean {
    return good.templateId == -100;
  }

  public static isFashion(info: t_s_itemtemplateData): boolean {
    if (!info) return false;
    if (info.MasterType != GoodsType.EQUIP) return false;
    if (info.SonType == GoodsSonType.FASHION_CLOTHES) return true; //时装衣服
    if (info.SonType == GoodsSonType.FASHION_HEADDRESS) return true; //时装帽子
    if (info.SonType == GoodsSonType.FASHION_WEAPON) return true; //时装武器
    if (info.SonType == GoodsSonType.SONTYPE_WING) return true; //时装翅膀
    return false;
  }

  public static isMount(info: t_s_itemtemplateData): boolean {
    if (!info) return false;
    if (info.SonType == GoodsSonType.SONTYPE_MOUNT_CARD) return true;
    return false;
  }

  public static isPet(info: t_s_itemtemplateData): boolean {
    if (!info) return false;
    if (info.MasterType == GoodsType.PET_CARD) return true;
    return false;
  }

  public static getMouldGold(gInfo: GoodsInfo): number {
    let gold: number;
    let targetStar: number;
    if (gInfo) {
      if (gInfo.mouldStar == 10) {
        targetStar = 1;
      } else {
        targetStar = gInfo.mouldStar + 1;
      }
      if (gInfo.mouldGrade > ForgeData.MOULD_MAX_GRADE_SENIOR) {
        gold = 2000 * Math.pow(8 + targetStar, 3);
      } else if (gInfo.mouldGrade > ForgeData.MOULD_MAX_GRADE) {
        gold = 1000 * Math.pow(8 + targetStar, 3);
      } else {
        gold = 500 * Math.pow(8 + targetStar, 3);
      }
    }
    return gold;
  }

  /**
   *
   * @param gInfo 物品是否鉴定过
   * @returns
   */
  public static hasIdentify(gInfo: GoodsInfo): boolean {
    let flag: boolean;
    if (!gInfo) return false;
    if (
      gInfo.randomSkill1 ||
      gInfo.randomSkill2 ||
      gInfo.randomSkill3 ||
      gInfo.randomSkill1 ||
      gInfo.randomSkill2 ||
      gInfo.randomSkill3
    ) {
      flag = true;
    }
    return flag;
  }

  public static hasEquipArtifact(gInfo: GoodsInfo): boolean {
    let flag: boolean;
    if (!gInfo) return false;
    if (gInfo.objectId > 0) {
      flag = true;
    }
    return flag;
  }

  /** 宠物成长石 */
  public static PET_GROWTH_STONE: number = 208023;
  /** 宠物资质丹 */
  public static PET_COE_STONE: number = 3040001;
  /** 宠物封印卡 */
  public static PET_CARD: number = 3060011;
  /** 水晶碎片 */
  public static CRYSTAL_FRAGMENT: number = 208028;

  private static get thane(): ThaneInfo {
    return ArmyManager.Instance.thane;
  }
}
