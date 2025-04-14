import LangManager from "../../../../core/lang/LangManager";
import { DateFormatter } from "../../../../core/utils/DateFormatter";
import GoodsSonType from "../../../constant/GoodsSonType";
import { TempleteManager } from "../../../manager/TempleteManager";
import { StarHelper } from "../../../utils/StarHelper";
import FunnyHelper from "../control/FunnyHelper";
import FunnyConditionData from "./FunnyConditionData";
import FunnyConditionType from "./FunnyConditionType";
import FunnyRewardData from "./FunnyRewardData";

/**
 * 精彩活动奖励礼包(包含奖励列表、完成条件列表)
 * @author chance.li
 *
 */
export default class FunnyBagData {
  /**
   * 礼包ID
   */
  public id: string;
  /**
   * 排序
   */
  public order: number;
  /**
   *  奖励列表
   */
  public rewardList: Array<FunnyRewardData> = [];
  /**
   *  条件列表
   */
  public conditionList: Array<FunnyConditionData> = [];
  /**
   *  领取状态(1: 可领取, 2: 已领取, 3: 不能领取)
   */
  public status: number;
  /**
   * 可领取倒计时（结束后可以领取, 针对在线时长活动）
   */
  public remainTime: number;
  /**
   * 是否需要显示当前的礼包
   */
  public isShow: boolean;

  public finishValue: number = 0;
  /**
   * 领取次数
   */
  public getCount: number;

  public param1: string = "0";

  public startTime: number; //活动开始时间
  public endTime: number; //活动结束时间

  constructor() {
    this.rewardList = [];
    this.conditionList = [];
  }

  public get title(): string {
    if (!this.conditionList) return "";
    var str: string = "";
    for (var i: number = 0; i < this.conditionList.length; i++) {
      switch (this.conditionList[i].id) {
        case FunnyConditionType.MOUNTS_GRADES: //坐骑升级
          str += LangManager.Instance.GetTranslation(
            "funny.datas.FunnyBagData.title1",
            this.conditionList[i].value,
          );
          break;
        case FunnyConditionType.ROSE: //玫瑰花赠送
          str += LangManager.Instance.GetTranslation(
            "funny.datas.FunnyBagData.title2",
            this.conditionList[i].value,
          );
          break;
        case FunnyConditionType.OFF_LINE: //老玩家回归
          if (this.conditionList[i].value <= 0) {
            str += LangManager.Instance.GetTranslation(
              "funny.datas.FunnyBagData.title17",
            );
          } else {
            str += LangManager.Instance.GetTranslation(
              "funny.datas.FunnyBagData.title18",
              this.conditionList[i].value,
            );
          }
          return str;
          break;
        case FunnyConditionType.PLAYER_GRADES: //玩家等级
          str += LangManager.Instance.GetTranslation(
            "funny.datas.FunnyBagData.title4",
            this.conditionList[i].value,
          );
          break;
        case FunnyConditionType.EQUIP_ATTRIBUTE: //装备属性
          str += LangManager.Instance.GetTranslation(
            "funny.datas.FunnyBagData.title5",
            this.conditionList[i].value,
            this.conditionList[i].bak,
          );
          break;
        case FunnyConditionType.GEMSTONE_COMPOSE: //合成宝石
          str += LangManager.Instance.GetTranslation(
            "funny.datas.FunnyBagData.title6",
            this.conditionList[i].value,
            this.conditionList[i].bak,
          );
          break;
        case FunnyConditionType.HONOR: //荣誉值
          str += LangManager.Instance.GetTranslation(
            "funny.datas.FunnyBagData.title7",
            this.conditionList[i].value,
          );
          break;
        case FunnyConditionType.STAR: //占星
          str += LangManager.Instance.GetTranslation(
            "funny.datas.FunnyBagData.title8",
            this.conditionList[i].value,
            StarHelper.getProfileNameByProfile(this.conditionList[i].bak),
          );
          break;
        case FunnyConditionType.POINT_USED: //消费
          str += LangManager.Instance.GetTranslation(
            "funny.datas.FunnyBagData.title9",
            this.conditionList[i].value,
          );
          break;
        case FunnyConditionType.RECHARGE_ONCE: //一次性充值
          str += LangManager.Instance.GetTranslation(
            "funny.datas.FunnyBagData.title10",
            this.conditionList[i].value,
            this.conditionList[i].bak,
          );
          break;
        case FunnyConditionType.EXCHANGE: //物品兑换
          if (i > 0) {
            str +=
              this.getGoodsName(this.conditionList[i].bak) +
              " x " +
              this.conditionList[i].value +
              ", ";
          } else {
            str += LangManager.Instance.GetTranslation(
              "funny.datas.FunnyBagData.title11",
              this.getGoodsName(this.conditionList[i].bak),
              this.conditionList[i].value,
            );
          }
          break;
        case FunnyConditionType.FASHION_COMPOSE: //时装合成
          str += LangManager.Instance.GetTranslation(
            "funny.datas.FunnyBagData.title12",
            GoodsSonType.getSonTypeName(this.conditionList[i].bak),
            this.conditionList[i].value,
          );
          break;
        case FunnyConditionType.ACTIVE_VALUE: //活跃值
          str += LangManager.Instance.GetTranslation(
            "funny.datas.FunnyBagData.title13",
            this.conditionList[i].value,
          );
          break;
        case FunnyConditionType.LOGIN: //登录礼包
          if (this.conditionList[i].value == 1) {
            //普通玩家
            str += LangManager.Instance.GetTranslation(
              "funny.datas.FunnyBagData.title14",
            );
          } else if (this.conditionList[i].value == 2) {
            //VIP玩家
            str += LangManager.Instance.GetTranslation(
              "funny.datas.FunnyBagData.title15",
            );
          }
          break;
        case FunnyConditionType.ON_LINE: //在线时长
          str += LangManager.Instance.GetTranslation(
            "funny.datas.FunnyBagData.title16",
            DateFormatter.getFullDateString(this.conditionList[i].value),
          );
          break;
        case FunnyConditionType.RECHARGE_TIME: //时段性充值
          str += LangManager.Instance.GetTranslation(
            "funny.datas.FunnyBagData.title19",
          );
          break;
        case FunnyConditionType.ONE_CONSUME: //一次性消费
          str += LangManager.Instance.GetTranslation(
            "funny.datas.FunnyBagData.title20",
            this.conditionList[i].value,
            this.conditionList[i].bak,
          );
          break;
        case FunnyConditionType.MOUNT_CULTIVATE: //坐骑培养
          str += LangManager.Instance.GetTranslation(
            "funny.datas.FunnyBagData.title21",
            this.conditionList[i].value,
          );
          break;
        case FunnyConditionType.SOUL_STAMP: //灵魂刻印
          str += LangManager.Instance.GetTranslation(
            "funny.datas.FunnyBagData.title22",
            this.conditionList[i].value,
          );
          break;
        case FunnyConditionType.ASTROLOGY: //占星
          str += LangManager.Instance.GetTranslation(
            "funny.datas.FunnyBagData.title23",
            this.conditionList[i].value,
          );
          break;
        case FunnyConditionType.ALCHEMY: //炼金
          str += LangManager.Instance.GetTranslation(
            "funny.datas.FunnyBagData.title24",
            this.conditionList[i].value,
          );
          break;
        case FunnyConditionType.REFINE_SOUL: //聚魂
          str += LangManager.Instance.GetTranslation(
            "funny.datas.FunnyBagData.title25",
            this.conditionList[i].value,
          );
          break;
        case FunnyConditionType.REWARD: //悬赏任务
          str += LangManager.Instance.GetTranslation(
            "funny.datas.FunnyBagData.title26",
            this.conditionList[i].value,
          );
          break;
        case FunnyConditionType.MYSTERY_FRESH: //神秘商店
          str += LangManager.Instance.GetTranslation(
            "funny.datas.FunnyBagData.title27",
            this.conditionList[i].value,
          );
          break;
        case FunnyConditionType.RUNE_SWALLOW: //符文吞噬
          str += LangManager.Instance.GetTranslation(
            "funny.datas.FunnyBagData.title28",
            this.conditionList[i].value,
            this.getGoodsName(this.conditionList[i].bak),
          );
          break;
        case FunnyConditionType.CHALLENGE: //单人挑战
          str += LangManager.Instance.GetTranslation(
            "funny.datas.FunnyBagData.title29",
            this.conditionList[i].value,
          );
          break;
        case FunnyConditionType.MULTI_CHALLENGE: //多人竞技
          str += LangManager.Instance.GetTranslation(
            "funny.datas.FunnyBagData.title30",
            this.conditionList[i].value,
          );
          break;
        case FunnyConditionType.WAR_FIELD_KILL: //战场击杀
          str += LangManager.Instance.GetTranslation(
            "funny.datas.FunnyBagData.title31",
            this.conditionList[i].value,
          );
          break;
        case FunnyConditionType.PET_QUALITY: //英灵资质培养到x色
          str += LangManager.Instance.GetTranslation(
            "funny.datas.FunnyBagData.title32",
            this.conditionList[i].bak,
            this.getPetQualityName(this.conditionList[i].value),
          );
          break;
        case FunnyConditionType.PET_GRADE: //英灵等级达到N级
          str += LangManager.Instance.GetTranslation(
            "funny.datas.FunnyBagData.title33",
            this.conditionList[i].value,
          );
          break;
        case FunnyConditionType.PET_FIGHT_CAPACITY: //英灵战斗力达到N
          str += LangManager.Instance.GetTranslation(
            "funny.datas.FunnyBagData.title34",
            this.conditionList[i].value,
          );
          break;
        case FunnyConditionType.PET_GRADE_RANK: //英灵等级在排行榜中达到第N名
          if (this.conditionList[i].value == this.conditionList[i].bak) {
            str += LangManager.Instance.GetTranslation(
              "funny.datas.FunnyBagData.title35",
              this.conditionList[i].value,
            );
          } else {
            str += LangManager.Instance.GetTranslation(
              "funny.datas.FunnyBagData.title36",
              this.conditionList[i].value,
              this.conditionList[i].bak,
            );
          }
          break;
        case FunnyConditionType.PET_CAPACITY_RANK: //英灵战斗力在排行榜中达到第N名
          if (this.conditionList[i].value == this.conditionList[i].bak) {
            str += LangManager.Instance.GetTranslation(
              "funny.datas.FunnyBagData.title37",
              this.conditionList[i].value,
            );
          } else {
            str += LangManager.Instance.GetTranslation(
              "funny.datas.FunnyBagData.title38",
              this.conditionList[i].value,
              this.conditionList[i].bak,
            );
          }
          break;
        case FunnyConditionType.FIGHT_CAPACITY_RANKING: //活动期间内, 个人战斗力排名
          if (this.conditionList[i].value == this.conditionList[i].bak) {
            str += LangManager.Instance.GetTranslation(
              "funny.datas.FunnyBagData.title39",
              this.conditionList[i].value,
            );
          } else {
            str += LangManager.Instance.GetTranslation(
              "funny.datas.FunnyBagData.title40",
              this.conditionList[i].value,
              this.conditionList[i].bak,
            );
          }
          break;
        case FunnyConditionType.GRADE_RANKING: //活动期间内, 个人等级排名
          if (this.conditionList[i].value == this.conditionList[i].bak) {
            str += LangManager.Instance.GetTranslation(
              "funny.datas.FunnyBagData.title41",
              this.conditionList[i].value,
            );
          } else {
            str += LangManager.Instance.GetTranslation(
              "funny.datas.FunnyBagData.title42",
              this.conditionList[i].value,
              this.conditionList[i].bak,
            );
          }
          break;
        case FunnyConditionType.CONSORTIA_RANKING: //活动时间内, 公会等级达到N级,
          if (this.conditionList[i].value == this.conditionList[i].bak) {
            if (this.conditionList[i].bak2 == 1) {
              //会长获得
              str += LangManager.Instance.GetTranslation(
                "funny.datas.FunnyBagData.title43",
                this.conditionList[i].value,
              );
            } else if (this.conditionList[i].bak2 == 2) {
              //公会所有人获得
              str += LangManager.Instance.GetTranslation(
                "funny.datas.FunnyBagData.title44",
                this.conditionList[i].value,
              );
            }
          } else {
            if (this.conditionList[i].bak2 == 1) {
              //会长获得
              str += LangManager.Instance.GetTranslation(
                "funny.datas.FunnyBagData.title45",
                this.conditionList[i].value,
                this.conditionList[i].bak,
              );
            } else if (this.conditionList[i].bak2 == 2) {
              //公会所有人获得
              str += LangManager.Instance.GetTranslation(
                "funny.datas.FunnyBagData.title46",
                this.conditionList[i].value,
                this.conditionList[i].bak,
              );
            }
          }
          break;
        case FunnyConditionType.CONSORTIA_REWARD_SCORE:
          str += LangManager.Instance.GetTranslation(
            "funny.datas.FunnyBagData.title47",
            this.conditionList[i].value,
          );
          break;
        case FunnyConditionType.CONSORTIA_STORE_COUNT:
          str += LangManager.Instance.GetTranslation(
            "funny.datas.FunnyBagData.title48",
            this.conditionList[i].value,
            this.conditionList[i].bak,
          );
          break;
        case FunnyConditionType.CONSORTIA_TOWER_FIRST_BLOODER:
          if (this.conditionList[i].bak == 1) {
            str += LangManager.Instance.GetTranslation(
              "funny.datas.FunnyBagData.title49_01",
              this.getJob(this.conditionList[i].bak2),
              this.conditionList[i].value,
            );
          } else {
            str += LangManager.Instance.GetTranslation(
              "funny.datas.FunnyBagData.title49_02",
              this.getJob(this.conditionList[i].bak2),
              this.conditionList[i].value,
            );
          }
          break;
        case FunnyConditionType.CONSORTIA_MOUNT_GREADE:
          str += LangManager.Instance.GetTranslation(
            "funny.datas.FunnyBagData.title50",
            this.conditionList[i].value,
          );
          break;
        case FunnyConditionType.REFRESH_TREASURE_MAP_NUM:
          str += LangManager.Instance.GetTranslation(
            "funny.datas.FunnyBagData.title51",
            this.conditionList[i].bak,
            this.getPetQualityName(this.conditionList[i].value + 2),
          );
          break;
        case FunnyConditionType.COMPOSITE_GUARD_CRYSTAL:
          str += LangManager.Instance.GetTranslation(
            "funny.datas.FunnyBagData.title52",
            this.conditionList[i].bak,
            this.conditionList[i].value,
          );
          break;
        case FunnyConditionType.UPGRADE_LEVEL:
          if (this.conditionList[i].bak == 80) {
            str += LangManager.Instance.GetTranslation(
              "funny.datas.FunnyBagData.title54",
              this.conditionList[i].value,
            );
          } else {
            str += LangManager.Instance.GetTranslation(
              "funny.datas.FunnyBagData.title53",
              this.conditionList[i].value,
              this.conditionList[i].bak,
            );
          }
          break;
        case FunnyConditionType.PET_GROWUP:
          str += LangManager.Instance.GetTranslation(
            "funny.datas.FunnyBagData.title56",
            this.conditionList[i].value,
          );
          break;
        case FunnyConditionType.PET_APTITUDE:
          str += LangManager.Instance.GetTranslation(
            "funny.datas.FunnyBagData.title57",
            this.conditionList[i].value,
          );
          break;
        case FunnyConditionType.RUNE: //炼符N次
          str += LangManager.Instance.GetTranslation(
            "funny.datas.FunnyBagData.title100",
            this.conditionList[i].value,
          );
          break;
        case FunnyConditionType.SEEK: //寻宝N次
          str += LangManager.Instance.GetTranslation(
            "funny.datas.FunnyBagData.title101",
            this.conditionList[i].value,
          );
          break;
        case FunnyConditionType.POWCARD_EAT: //吞噬卡牌N张
          str += LangManager.Instance.GetTranslation(
            "funny.datas.FunnyBagData.title102",
            this.conditionList[i].value,
          );
          break;
        case FunnyConditionType.POWCARD_GRADE: //升级任意卡牌到N级
          str += LangManager.Instance.GetTranslation(
            "funny.datas.FunnyBagData.title103",
            this.conditionList[i].value,
          );
          break;
        case FunnyConditionType.POWCARD_GET_SPEC: //获得X品质的卡牌
          str += LangManager.Instance.GetTranslation(
            "funny.datas.FunnyBagData.title104",
            this.getPetQualityName(this.conditionList[i].value),
          );
          break;
        case FunnyConditionType.KINGTOWER_JOIN: //参与王者之塔战斗
          str += LangManager.Instance.GetTranslation(
            "funny.datas.FunnyBagData.title105",
            this.conditionList[i].value,
          );
          break;
        case FunnyConditionType.BLESS_COUNT: //参与祝福轮盘转动
          str += LangManager.Instance.GetTranslation(
            "funny.datas.FunnyBagData.title106",
            this.conditionList[i].value,
          );
          break;
        case FunnyConditionType.BLESS_PRECENT: //祝福轮盘达到%
          str += LangManager.Instance.GetTranslation(
            "funny.datas.FunnyBagData.title107",
            this.conditionList[i].value,
          );
          break;
        case FunnyConditionType.FATE_TURN: //命运守护转盘转动
          str += LangManager.Instance.GetTranslation(
            "funny.datas.FunnyBagData.title108",
            this.conditionList[i].value,
          );
          break;
        case FunnyConditionType.FATE_EAT: //命运石吞噬
          str += LangManager.Instance.GetTranslation(
            "funny.datas.FunnyBagData.title109",
            this.conditionList[i].value,
          );
          break;
        case FunnyConditionType.PET_CHALLENGE: //英灵竞技
          str += LangManager.Instance.GetTranslation(
            "funny.datas.FunnyBagData.title110",
            this.conditionList[i].value,
          );
          break;
        case FunnyConditionType.MINEFIELD_BATTLE: //紫晶矿战
          str += LangManager.Instance.GetTranslation(
            "funny.datas.FunnyBagData.title111",
            this.conditionList[i].value,
          );
          break;
        case FunnyConditionType.FISH_TIMES: //捕鱼
          str += LangManager.Instance.GetTranslation(
            "funny.datas.FunnyBagData.title112",
            this.conditionList[i].value,
          );
          break;
        case FunnyConditionType.SINGLEPASS_TIMES: //天穹之境
          str += LangManager.Instance.GetTranslation(
            "funny.datas.FunnyBagData.title113",
            this.conditionList[i].value,
          );
          break;
        case FunnyConditionType.TYPE_ONLYONE_POWERCARD_PROFILE: //终身卡牌品质
          str += LangManager.Instance.GetTranslation(
            "funny.datas.FunnyBagData.title114",
            this.getPetQualityName(this.conditionList[i].value),
          );
          break;
        case FunnyConditionType.TYPE_ONLYONE_FASHION_GRADES: //终身时装合成
          str += LangManager.Instance.GetTranslation(
            "funny.datas.FunnyBagData.title115",
            GoodsSonType.getSonTypeName(this.conditionList[i].bak),
            this.conditionList[i].value,
          );
          break;
        case FunnyConditionType.TYPE_ONLYONE_HONOR: //终身荣誉
          str += LangManager.Instance.GetTranslation(
            "funny.datas.FunnyBagData.title116",
            this.conditionList[i].value,
          );
          break;
        case FunnyConditionType.REASUREMAP_GET: //参与藏宝图战斗次数
          str += LangManager.Instance.GetTranslation(
            "funny.datas.FunnyBagData.title117",
            this.conditionList[i].value,
          );
          break;
        case FunnyConditionType.PETLAND_KILL_MIDDLE: //守卫英灵岛击杀X只愤怒的中级英灵（单次每日）
          str += LangManager.Instance.GetTranslation(
            "funny.datas.FunnyBagData.title193",
            this.conditionList[i].value,
          );
          break;
        case FunnyConditionType.PETLAND_KILL_SENIOR: //守卫英灵岛击杀X只愤怒的高级英灵（单次每日）
          str += LangManager.Instance.GetTranslation(
            "funny.datas.FunnyBagData.title194",
            this.conditionList[i].value,
          );
          break;
        case FunnyConditionType.FASHION_LEVEL_UPGRADE:
          str += LangManager.Instance.GetTranslation(
            "funny.datas.FunnyBagData.title185",
            this.conditionList[i].value,
          );
          break;
        case FunnyConditionType.FASHION_SWALLOW:
          str += LangManager.Instance.GetTranslation(
            "funny.datas.FunnyBagData.title501",
            this.conditionList[i].value,
          );
          break;
        case FunnyConditionType.RUNE_UPDATE:
          str += LangManager.Instance.GetTranslation(
            "funny.datas.FunnyBagData.title502",
            this.conditionList[i].value,
          );
          break;
        case FunnyConditionType.RUNE_CARVE:
          str += LangManager.Instance.GetTranslation(
            "funny.datas.FunnyBagData.title503",
            this.conditionList[i].value,
          );
          break;
        case FunnyConditionType.TYPE_COST_STAMINA:
          str += LangManager.Instance.GetTranslation(
            "funny.datas.FunnyBagData.title505",
            this.conditionList[i].value,
          );
          break;
        case FunnyConditionType.TYPE_CONSORTIA_ACTION_POINT:
          str += LangManager.Instance.GetTranslation(
            "funny.datas.FunnyBagData.title506",
            this.conditionList[i].value,
          );
          break;
        case FunnyConditionType.TYPE_PET_EQUIP_CULTIVATE:
          str += LangManager.Instance.GetTranslation(
            "funny.datas.FunnyBagData.title507",
            this.conditionList[i].value,
            this.conditionList[i].bak,
          );
          break;
        case FunnyConditionType.TYPE_MERITOR_CULTIVATE:
          str += LangManager.Instance.GetTranslation(
            "funny.datas.FunnyBagData.title508",
            this.conditionList[i].value,
          );
          break;
        case FunnyConditionType.TYPE_TATTOO_UPGRADE:
          str += LangManager.Instance.GetTranslation(
            "funny.datas.FunnyBagData.title509",
            this.conditionList[i].value,
          );
          break;
        case FunnyConditionType.TYPE_DELETE_FILELEVEL:
          if (this.conditionList[i].value == 1) {
            str += LangManager.Instance.GetTranslation(
              "funny.datas.FunnyBagData.title58",
            );
          } else if (this.conditionList[i].value == 2) {
            str += LangManager.Instance.GetTranslation(
              "funny.datas.FunnyBagData.title59",
              this.conditionList[i].bak,
            );
          }
          break;
      }
    }
    return str;
  }

  private getMazeType(type: number): string {
    return type == 1
      ? LangManager.Instance.GetTranslation(
          "castle.view.CastleBuildingView.command11",
        )
      : LangManager.Instance.GetTranslation("maze.order.MazeOrderFrame.title2");
  }

  private getJob(type: number): string {
    var job: string = "";
    switch (type) {
      case 1:
        job = LangManager.Instance.GetTranslation(
          "yishi.datas.consant.JobType.Name02",
        );
        break;
      case 2:
        job = LangManager.Instance.GetTranslation(
          "yishi.datas.consant.JobType.Name03",
        );
        break;
      case 3:
        job = LangManager.Instance.GetTranslation(
          "yishi.datas.consant.JobType.Name04",
        );
        break;
    }
    return job;
  }

  private getPetQualityName(value: number): string {
    var name: string = "";
    switch (value) {
      case 1:
        name = LangManager.Instance.GetTranslation(
          "yishi.utils.GoodsHelp.getGoodQualityName01",
        );
        break;
      case 2:
        name = LangManager.Instance.GetTranslation(
          "yishi.utils.GoodsHelp.getGoodQualityName02",
        );
        break;
      case 3:
        name = LangManager.Instance.GetTranslation(
          "yishi.utils.GoodsHelp.getGoodQualityName03",
        );
        break;
      case 4:
        name = LangManager.Instance.GetTranslation(
          "yishi.utils.GoodsHelp.getGoodQualityName04",
        );
        break;
      case 5:
        name = LangManager.Instance.GetTranslation(
          "yishi.utils.GoodsHelp.getGoodQualityName05",
        );
        break;
    }
    return name;
  }
  private getGoodsName(tid: number): string {
    return TempleteManager.Instance.getGoodsTemplatesByTempleteId(tid)
      .TemplateNameLang;
  }

  /**是否有剩余兑换次数 */
  public get hasExchageTimes(): boolean {
    if (this.conditionList[0].bak2 <= 0) {
      return true;
    } else {
      return this.getCount > 0;
    }
  }

  /**总兑换数量 */
  public get exchangeCount(): number {
    let count = 0;
    for (var i: number = 0; i < this.conditionList.length; i++) {
      count += this.conditionList[i].value;
    }
    return count;
  }

  public get targetValue(): number {
    let count = 0;
    for (var i: number = 0; i < this.conditionList.length; i++) {
      count += this.conditionList[i].bak;
    }
    return count;
  }

  public getIsSpeacial(): boolean {
    if (!this.conditionList) return false;
    for (var i: number = 0; i < this.conditionList.length; i++) {
      switch (this.conditionList[i].id) {
        case FunnyConditionType.FASHION_COMPOSE:
        case FunnyConditionType.PET_QUALITY:
        case FunnyConditionType.REFRESH_TREASURE_MAP_NUM:
        case FunnyConditionType.COMPOSITE_GUARD_CRYSTAL:
        case FunnyConditionType.CONSORTIA_STORE_COUNT:
          return true;
      }
    }
    return false;
  }

  /**是否为每日活动 */
  public get isEveryDayActivity(): boolean {
    return false;
  }

  public get canExchage(): boolean {
    let canExchange = true;
    var len: number = this.conditionList.length;
    for (var j: number = 0; j < len; j++) {
      let conditionId = this.conditionList[j].bak;
      let count = this.conditionList[j].value;
      let ownCount = FunnyHelper.getBagCount(conditionId);
      if (ownCount < count) {
        canExchange = false;
      }
    }
    return canExchange;
  }

  public get canAward(): boolean {
    return this.canExchage && this.hasExchageTimes;
  }

  public get canAwardII(): boolean {
    return this.status == 1;
  }

  public get awardOrder(): number {
    let no: number = 0;
    switch (this.status) {
      case 1:
        no = 10;
        break;
      case 2:
        no = 30;
        break;
      case 3:
        no = 20;
        break;
    }
    return no;
  }

  public get maxExchangeCount(): number {
    let exChangeCount = 999;
    if (this.conditionList[0].bak2 > 0) {
      //有次数限制
      exChangeCount = this.getCount;
    }
    var len: number = this.conditionList.length;
    for (var j: number = 0; j < len; j++) {
      let conditionId = this.conditionList[j].bak;
      let count = this.conditionList[j].value;
      let ownCount = FunnyHelper.getBagCount(conditionId);
      if (ownCount < count) {
        return 0;
      } else {
        let itemExchangeCount = Math.floor(ownCount / count);
        if (itemExchangeCount < exChangeCount) {
          //取最小可兑换次数
          exChangeCount = itemExchangeCount;
        }
      }
    }
    return exChangeCount;
  }

  public get countActive(): boolean {
    if (!this.conditionList) return false;
    var str: boolean = true;
    for (var i: number = 0; i < this.conditionList.length; i++) {
      switch (this.conditionList[i].id) {
        case FunnyConditionType.MOUNTS_GRADES: //坐骑升级
          break;
        case FunnyConditionType.ROSE: //玫瑰花赠送
          break;
        case FunnyConditionType.OFF_LINE: //老玩家回归
          break;
        case FunnyConditionType.PLAYER_GRADES: //玩家等级
          break;
        case FunnyConditionType.EQUIP_ATTRIBUTE: //装备属性
          break;
        case FunnyConditionType.GEMSTONE_COMPOSE: //合成宝石
          break;
        case FunnyConditionType.HONOR: //荣誉值
          break;
        case FunnyConditionType.STAR: //占星
          break;
        case FunnyConditionType.POINT_USED: //消费
          break;
        case FunnyConditionType.RECHARGE_ONCE: //一次性充值
          break;
        case FunnyConditionType.EXCHANGE: //物品兑换
          break;
        case FunnyConditionType.FASHION_COMPOSE: //时装合成
          str = false;
          break;
        case FunnyConditionType.ACTIVE_VALUE: //活跃值
          break;
        case FunnyConditionType.LOGIN: //登录礼包
          str = false;
          break;
        case FunnyConditionType.ON_LINE: //在线时长
          break;
        case FunnyConditionType.RECHARGE_TIME: //时段性充值
          break;
        case FunnyConditionType.ONE_CONSUME: //一次性消费
          break;
        case FunnyConditionType.MOUNT_CULTIVATE: //坐骑培养
          break;
        case FunnyConditionType.SOUL_STAMP: //灵魂刻印
          break;
        case FunnyConditionType.ASTROLOGY: //占星
          break;
        case FunnyConditionType.ALCHEMY: //炼金
          break;
        case FunnyConditionType.REFINE_SOUL: //聚魂
          break;
        case FunnyConditionType.REWARD: //悬赏任务
          break;
        case FunnyConditionType.MYSTERY_FRESH: //神秘商店
          break;
        case FunnyConditionType.RUNE_SWALLOW: //符文吞噬
          break;
        case FunnyConditionType.CHALLENGE: //单人挑战
          break;
        case FunnyConditionType.MULTI_CHALLENGE: //多人竞技
          break;
        case FunnyConditionType.WAR_FIELD_KILL: //战场击杀
          break;
        case FunnyConditionType.PET_QUALITY: //英灵资质培养到x色
          break;
        case FunnyConditionType.PET_GRADE: //英灵等级达到N级
          break;
        case FunnyConditionType.PET_FIGHT_CAPACITY: //英灵战斗力达到N
          str = false;
          break;
        case FunnyConditionType.PET_GRADE_RANK: //英灵等级在排行榜中达到第N名
          str = false;
          break;
        case FunnyConditionType.PET_CAPACITY_RANK: //英灵战斗力在排行榜中达到第N名
          str = false;
          break;
        case FunnyConditionType.FIGHT_CAPACITY_RANKING: //活动期间内, 个人战斗力排名
          str = false;
          break;
        case FunnyConditionType.GRADE_RANKING: //活动期间内, 个人等级排名
          str = false;
          break;
        case FunnyConditionType.CONSORTIA_RANKING: //活动时间内, 公会等级达到N级,
          str = false;
          break;
        case FunnyConditionType.CONSORTIA_REWARD_SCORE:
          break;
        case FunnyConditionType.CONSORTIA_STORE_COUNT:
          break;
        case FunnyConditionType.CONSORTIA_TOWER_FIRST_BLOODER:
          break;
        case FunnyConditionType.CONSORTIA_MOUNT_GREADE:
          break;
        case FunnyConditionType.REFRESH_TREASURE_MAP_NUM:
          break;
        case FunnyConditionType.COMPOSITE_GUARD_CRYSTAL:
          break;
        case FunnyConditionType.UPGRADE_LEVEL:
          str = false;
          break;
        case FunnyConditionType.PET_GROWUP:
          break;
        case FunnyConditionType.PET_APTITUDE:
          break;
        case FunnyConditionType.RUNE: //炼符N次
          break;
        case FunnyConditionType.SEEK: //寻宝N次
          break;
        case FunnyConditionType.POWCARD_EAT: //吞噬卡牌N张
          break;
        case FunnyConditionType.POWCARD_GRADE: //升级任意卡牌到N级
          break;
        case FunnyConditionType.POWCARD_GET_SPEC: //获得X品质的卡牌
          break;
        case FunnyConditionType.KINGTOWER_JOIN: //参与王者之塔战斗
          break;
        case FunnyConditionType.BLESS_COUNT: //参与祝福轮盘转动
          break;
        case FunnyConditionType.BLESS_PRECENT: //祝福轮盘达到%
          break;
        case FunnyConditionType.FATE_TURN: //命运守护转盘转动
          break;
        case FunnyConditionType.FATE_EAT: //命运石吞噬
          break;
        case FunnyConditionType.PET_CHALLENGE: //英灵竞技
          break;
        case FunnyConditionType.MINEFIELD_BATTLE: //紫晶矿战
          break;
        case FunnyConditionType.FISH_TIMES: //捕鱼
          break;
        case FunnyConditionType.SINGLEPASS_TIMES: //天穹之境
          break;
        case FunnyConditionType.TYPE_ONLYONE_POWERCARD_PROFILE: //终身卡牌品质
          break;
        case FunnyConditionType.TYPE_ONLYONE_FASHION_GRADES: //终身时装合成
          break;
        case FunnyConditionType.TYPE_ONLYONE_HONOR: //终身荣誉
          break;
        case FunnyConditionType.REASUREMAP_GET: //参与藏宝图战斗次数
          break;
      }
    }
    return str;
  }
}
