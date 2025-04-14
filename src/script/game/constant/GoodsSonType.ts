import LangManager from "../../core/lang/LangManager";
import { t_s_itemtemplateData } from "../config/t_s_itemtemplate";
import { GoodsInfo } from "../datas/goods/GoodsInfo";
import { ThaneInfo } from "../datas/playerinfo/ThaneInfo";
import { GoodsType } from "./GoodsType";

export default class GoodsSonType {
  /**
   * 武器
   */
  public static SONTYPE_WEAPON: number = 101;
  /**
   * 武器时装
   */
  public static FASHION_WEAPON: number = 111;
  /**
   * 副手
   */
  public static SONTYPE_ASSISTANT: number = 102;
  /**
   * 头饰
   */
  public static SONTYPE_HEADDRESS: number = 103;
  /**
   * 头饰时装
   */
  public static FASHION_HEADDRESS: number = 110;
  /**
   * 衣服
   */
  public static SONTYPE_CLOTHES: number = 104;
  /**
   * 衣服时装
   */
  public static FASHION_CLOTHES: number = 112;
  /**
   * 披风
   */
  public static SONTYPE_MANTEAU: number = 105;
  /**
   * 项链
   */
  public static SONTYPE_NECKLACE: number = 106;
  /**
   * 戒指
   */
  public static SONTYPE_RING: number = 107;
  /**
   * 饰品
   */
  public static SONTYPE_TRINKET: number = 108;
  /**
   * 翅膀
   */
  public static SONTYPE_WING: number = 109;
  /**
   * 纹章
   * */
  public static SONTYPE_HERALDRY: number = 117;
  /**
   * 圣物
   * */
  public static SONTYPE_RELIC: number = 118;
  /**
   *  buffer类道具
   */
  public static SONTYPE_BUFFER: number = 201;
  /**
   * 加速类道具
   */
  public static SONTYPE_SPEED: number = 202;
  /**
   * 消耗类道具
   */
  public static SONTYPE_USEABLE: number = 203;
  /**
   * 强化石
   */
  public static SONTYPE_INTENSIFY: number = 204;
  /**
   * 镶嵌宝珠
   */
  public static SONTYPE_MOUNT: number = 205;
  /**
   * 宝箱
   */
  public static SONTYPE_OPENBOX: number = 206;
  /**
   * 升级类道具, 没有使用菜单   （多选宝箱）
   */
  public static SONTYPE_USELESS: number = 207;
  /**
   * 勋章、喇叭等特殊道具
   */
  public static SONTYPE_MEDAL: number = 208;
  /**
   * 血包
   */
  public static SONTYPE_BLOOD: number = 209;
  /**
   * 任务道具
   */
  public static SONTYPE_TASK: number = 210;
  /**
   * 合成公式
   */
  public static SONTYPE_COMPOSE: number = 211;
  /**
   *  合成材料
   */
  public static SONTYPE_COMPOSE_MATERIAL: number = 212;
  /**
   *悬赏令
   */
  public static SONTYPE_REWARD_CARD: number = 213;
  /**
   * 符文
   */
  public static SONTYPE_RUNNES: number = 214;
  /**
   * 洗练石
   */
  public static SONTYPE_REFRESH: number = 215;
  /**
   *种子
   */
  public static SONTYPE_SEED: number = 216;
  /**
   *玫瑰
   */
  public static SONTYPE_ROSE: number = 217;
  /**
   *称号卡
   */
  public static SONTYPE_APPELL: number = 221;

  /**
   *头像框
   */
  public static SONTYPE_HEADFRAME: number = 223;
  /**
   *试练之心
   */
  public static TRIAL_HAERT: number = 288;
  /**
   * 灵魂水晶
   */
  public static SONTYPE_SOUL_CRYSTAL: number = 293;
  /**
   * 迷宫硬币
   */
  public static SONTYPE_MAZE_GOLD: number = 296;
  /**
   * 迷宫钥匙
   */
  public static SONTYPE_MAZE: number = 297;
  /**
   * 公会 清除倒计时道具
   */
  public static SONTYPE_CONSORTIATIME_CARD: number = 294;
  /**
   * 公会卡
   */
  public static SONTYPE_CONSORTIA_CARD: number = 295;
  /**
   * 金刚钻
   */
  public static SONTYPE_MOUNT_PORP: number = 299;
  /**
   *新手礼包
   */
  public static SONTYPE_NOVICE_BOX: number = 298;
  /**
   *vip币
   */
  public static SONTYPE_VIP_BOX: number = 292;
  /**
   * 主动技能
   */
  public static SONTYPE_HONER: number = 301;
  /**
   * 被动技能
   */
  public static SONTYPE_PASSIVE_SKILL: number = 302;

  /**
   * 用于激活特殊坐骑的物品
   */
  public static SONTYPE_MOUNT_CARD: number = 218;
  /**
   * 用于激活宠物的物品
   */
  public static SONTYPE_PET_CARD: number = 306;

  /** 英灵经验书 */
  public static SONTYPE_PET_EXP_BOOK: number = 308;

  /**
   *改名卡
   */
  public static SONTYPE_RENAME_CARD: number = 289;

  /**
   * 兽灵石
   */
  public static SONTYPE_MOUNT_FOOD: number = 290;

  /**
   * 激活精灵契约道具
   */
  public static SONTYPE_KINGCONTRACT_CARD: number = 203;

  /**
   * 宠物技能书
   */
  public static SONTYPE_PET_SKILL_BOOK: number = 303;
  /**
   * 命运石
   */
  public static SONTYPE_FATE_STONE: number = 307;
  /**
   * 宠物资质丹
   */
  public static SONTYPE_PET_APT: number = 304;
  /**
   * 宠物资质丹
   */
  public static SONTYPE_PET_ESSENCE: number = 310;

  /** 消耗道具使用宝箱 */
  public static SONTYPE_BOX: number = 311;

  /** 抗性宝石 意志水晶  */
  public static RESIST_GEM: number = 312;

  /**
   * 英灵岛传送符
   */
  public static SONTYPE_PET_LAND_TRANSFER: number = 313;
  /**
   * 龙魂道具
   */
  public static SONTYPE_DRAGON_SOUL: number = 319;
  /**
   * 烟花
   */
  public static SONTYPE_FIREWORK: number = 316;
  /**
   * 折扣卷
   */
  public static SONTYPE_DISCOUNT: number = 317;
  /**
   * 藏宝图
   */
  public static SONTYPE_TREASURE_MAP: number = 219;
  /**
   * 天穹之径天阶石
   */
  public static SONTYPE_SINGLE_PASS_PROP: number = 314;
  /**
   * 天穹之径天国号角
   */
  public static SONTYPE_SINGLE_PASS_BUGLE: number = 315;
  /**
   * 夺宝奇兵-失落的宝图
   */
  public static SONTYPE_GEMMAZE_TREASURE_MAP: number = 331;
  /**
   * 变性卡
   */
  public static SONTYPE_SEX_CHANGE_CARD: number = 340;
  /**
   * 卡牌
   */
  // public static SONTYPE_MAGIC_CARD: number = 600;
  /**
   *外城传输阵充能道具
   */
  public static OUTER_CITY_MAP_GOODS: number = 602;

  /**
   * 英灵凝神珠
   */
  public static SONTYPE_PET_COST: number = 304;

  /**
   * 阶段性宝箱
   */
  public static SONTYPE_LEVEL_BOX: number = 333;

  /**
   * 多选宝箱
   */
  public static SONTYPE_MULTI_BOX: number = 416;

  /**
   * 积分卡
   */
  public static SONTYPE_POINT_CARD: number = 603;
  /**
   * 圣杯
   */
  public static SONTYPE_POINT_CUP: number = 222;

  /** 神器  */
  public static ARTIFACT: number = 120;
  /**
   *背包的显示条件
   */
  public static BAGSHOWTYPE_ALL: number = 0;
  public static BAGSHOWTYPE_JOB: number = 1;
  public static BAGSHOWTYPE_SEX: number = 2;
  public static BAGSHOWTYPE_GRADE: number = 3;

  public static EQUIP_SONTYPE_LIST: Array<number> = [
    101, 102, 103, 104, 105, 106, 107, 108, 109,
  ];

  public static getSonTypeName(type: number): string {
    switch (type) {
      case GoodsSonType.SONTYPE_WEAPON:
        return LangManager.Instance.GetTranslation(
          "bag.datas.GoodsSonType.WEAPON",
        );
      case GoodsSonType.SONTYPE_ASSISTANT:
        return LangManager.Instance.GetTranslation(
          "bag.datas.GoodsSonType.ASSISTANT",
        );
      case GoodsSonType.SONTYPE_HEADDRESS:
        return LangManager.Instance.GetTranslation(
          "bag.datas.GoodsSonType.HEADDRESS",
        );
      case GoodsSonType.SONTYPE_CLOTHES:
        return LangManager.Instance.GetTranslation(
          "bag.datas.GoodsSonType.CLOTHES",
        );
      case GoodsSonType.SONTYPE_MANTEAU:
        return LangManager.Instance.GetTranslation(
          "bag.datas.GoodsSonType.MANTEAU",
        );
      case GoodsSonType.SONTYPE_NECKLACE:
        return LangManager.Instance.GetTranslation(
          "bag.datas.GoodsSonType.NECKLACE",
        );
      case GoodsSonType.SONTYPE_RING:
        return LangManager.Instance.GetTranslation(
          "bag.datas.GoodsSonType.RING",
        );
      case GoodsSonType.SONTYPE_TRINKET:
        return LangManager.Instance.GetTranslation(
          "bag.datas.GoodsSonType.TRINKET",
        );
      case GoodsSonType.SONTYPE_HONER:
        return LangManager.Instance.GetTranslation(
          "bag.datas.GoodsSonType.HONOR",
        );
      case GoodsSonType.SONTYPE_RUNNES:
        return LangManager.Instance.GetTranslation(
          "bag.datas.GoodsSonType.RUNNES",
        );
      case GoodsSonType.SONTYPE_WING:
        return LangManager.Instance.GetTranslation(
          "bag.datas.GoodsSonType.WING",
        );
      case GoodsSonType.FASHION_CLOTHES:
        return LangManager.Instance.GetTranslation(
          "bag.datas.GoodsSonType.FashionClothes",
        );
      case GoodsSonType.FASHION_HEADDRESS:
        return LangManager.Instance.GetTranslation(
          "bag.datas.GoodsSonType.FahsionHat",
        );
      case GoodsSonType.FASHION_WEAPON:
        return LangManager.Instance.GetTranslation(
          "bag.datas.GoodsSonType.FashionWeapon",
        );
      case GoodsSonType.SONTYPE_HERALDRY:
        return LangManager.Instance.GetTranslation(
          "bag.datas.GoodsSonType.heraldry",
        );
      case GoodsSonType.SONTYPE_RELIC:
        return LangManager.Instance.GetTranslation(
          "bag.datas.GoodsSonType.relic",
        );
    }

    return "";
  }

  public static getSonTypePos(type: number): Array<number> {
    switch (type) {
      case GoodsSonType.SONTYPE_WEAPON:
        return [0];
      //				case SONTYPE_ASSISTANT:
      //					return [1];
      case GoodsSonType.SONTYPE_HEADDRESS:
        return [1];
      case GoodsSonType.SONTYPE_CLOTHES:
        return [2];
      //				case SONTYPE_MANTEAU:
      //					return [4];
      case GoodsSonType.SONTYPE_NECKLACE:
        return [3];
      case GoodsSonType.SONTYPE_RING:
        return [4, 5];
      case GoodsSonType.SONTYPE_TRINKET:
        return [6, 7];
      case GoodsSonType.SONTYPE_RUNNES:
        return [0, 1, 2];
      case GoodsSonType.SONTYPE_HONER:
        return [0];
      case GoodsSonType.SONTYPE_WING:
        return [8];
      case GoodsSonType.FASHION_HEADDRESS:
        return [9];
      case GoodsSonType.FASHION_CLOTHES:
        return [10];
      case GoodsSonType.FASHION_WEAPON:
        return [11];
      case GoodsSonType.SONTYPE_HERALDRY:
        return [12];
      case GoodsSonType.SONTYPE_RELIC:
        return [13];
    }
    return [-1];
  }

  public static isJobFix(hero: ThaneInfo, info: t_s_itemtemplateData): boolean {
    let arr: Array<number> = info.Job;
    arr.forEach((value) => {
      let job: number = Number(value);
      if (hero && info && (job == 0 || job == hero.templateInfo.Job))
        return true;
    });
    return false;
  }

  public static isSexFix(hero: ThaneInfo, info: t_s_itemtemplateData): boolean {
    if (hero && info && (info.Sexs == 2 || hero.templateInfo.Sexs == info.Sexs))
      return true;
    return false;
  }

  public static isGradeFix(
    hero: ThaneInfo,
    info: t_s_itemtemplateData,
  ): boolean {
    if (
      hero &&
      info &&
      (info.NeedGrades == 0 || hero.grades >= info.NeedGrades)
    )
      return true;
    return false;
  }

  public static getColorByProfile(profile: number): string {
    switch (profile) {
      case 1:
        return "#ffffff";
      case 2:
        return "#59cd41";
      case 3:
        return "#32a2f8";
      case 4:
        return "#a838f7";
      case 5:
        return "#ff8000";
      case 6:
        return "#ce0f0f";
    }
    return "";
  }

  public static isPreciousGoods(info: GoodsInfo): boolean {
    // if (FrameControllerManager.instance.fashionCodeController.model.isFashion(info)) return true;
    if (info.templateInfo.SonType == GoodsSonType.SONTYPE_MOUNT) return true;
    if (
      info.templateInfo.MasterType == GoodsType.PET_CARD &&
      info.templateInfo.Profile >= 4
    )
      return true;
    if (
      info.templateInfo.MasterType == GoodsType.PROP &&
      info.templateInfo.Profile >= 4
    )
      return true;
    if (
      info.templateInfo.MasterType == GoodsType.HONER &&
      info.templateInfo.Profile >= 4
    )
      return true;
    if (
      info.templateInfo.MasterType == GoodsType.EQUIP &&
      info.templateInfo.SuiteId != 0
    )
      return true;
    if (info.templateInfo.SonType == GoodsSonType.RESIST_GEM) return true;
    return false;
  }
}
