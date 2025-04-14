//@ts-expect-error: External dependencies
import GameEventDispatcher from "../../../../core/event/GameEventDispatcher";
import { DateFormatter } from "../../../../core/utils/DateFormatter";
import Dictionary from "../../../../core/utils/Dictionary";
import { SimpleDictionary } from "../../../../core/utils/SimpleDictionary";
import { t_s_leedtemplateData } from "../../../config/t_s_leedtemplate";
import { DayGuideEvent } from "../../../constant/event/NotificationEvent";
import { PlayerInfo } from "../../../datas/playerinfo/PlayerInfo";
import { PlayerManager } from "../../../manager/PlayerManager";
import { VIPManager } from "../../../manager/VIPManager";
import LeedInfo from "./LeedInfo";
/**
 * 每日引导的部分逻辑, 每日引导任务的枚举说明
 * */
export default class DayGuideCatecory extends GameEventDispatcher {
  public static ACTIVE_CHANGE: string = "ACTIVE_CHANGE";
  public static WEEK_ACTIVE_CHANGE: string = "WEEK_ACTIVE_CHANGE";
  public static PROGRESS_CHANGE: string = "PROGRESS_CHANGE";
  private _changeObj: SimpleDictionary;

  public static WATER_SELF_TREE: number = 2; //给自己树浇水
  public static WATER_FRIENDS_TREE: number = 3; //给好友树浇水
  public static PASS_SINGLE_CAMPAIGN: number = 4; //通单人副本
  public static PASS_MUL_CAMPAIGN: number = 5; //通多人副本
  public static INTENSIFY: number = 6; //强化
  public static GET_FRIUT: number = 7; //神树收获
  public static CONTRIBUTE: number = 8; //捐献
  public static OCCUPY_FAILED: number = 9; //占领野矿
  public static PLUNDER: number = 10; //掠夺
  public static BLESS: number = 12; //祈福
  public static PVP: number = 13; //竞技场
  public static CRUSADE: number = 14; //讨伐野怪
  public static CONSUME_GIFT_POINT: number = 15; //消费礼金/钻石
  public static CONSUME_SMALL_BUGLE: number = 16; //消耗一个小喇叭
  public static STAR: number = 17; //占星
  public static WORLDBOSS: number = 18; //世界boss
  public static COLOSSEUM: number = 19; //挑战玩家
  public static COMMOMTASK: number = 20; //日常任务（打开对应任务）
  public static DESKTOPLOGIN: number = 21; //登录器

  public static HOOKROOM: number = 22; //挂机房
  public static MAZEROOM: number = 23; //无线塔
  public static OFFERREWARD: number = 24; //悬赏
  public static FARM_HARVEST: number = 25; //农场收获
  public static FARM_VISIT: number = 26; //农场访问
  public static WAR_FIGHT: number = 27; //战场
  public static TRIAL: number = 28; //试练之塔

  public static OFFER_REWARD: number = 29; //悬赏任务
  public static AMETHYST_FIELD: number = 30; //紫晶矿场
  public static RING_TASK: number = 32; //环任务
  public static SEMINARYBLESS: number = 33; //启动祝福轮盘
  public static CONSORTIA_SHOP: number = 34; //公会商城购买
  public static PET_JINGJI: number = 35; //参与英灵竞技
  public static MYSTER_SHOP: number = 36; //神秘商店购买
  public static WANGZHE: number = 37; //参与王者之塔
  public static OUTER_GUAIWU: number = 39; //击杀外城怪物
  public static OUTER_JINYING: number = 40; //击杀外城精英
  public static OUTER_BOSS: number = 41; //击杀外城boss
  public static EQUIP_XILIAN: number = 42; //装备洗炼
  public static FUSHI_FENJIE: number = 43; //符石分解
  public static PET_EQUIP_FENJIE: number = 44; //英灵装备分解
  public static SIGN_VIEW: number = 45; //签到
  public static PETLAND: number = 46; //英灵岛杀怪
  public static COST_POWER: number = 47; //体力消耗
  public static ENTER_PETCAMPAIGN: number = 48; //参与英灵战役
  public static ENTER_SECRET_CAMPAIGN: number = 49; //秘境
  /**
   * 一天包含的毫秒值
   * */
  public static MS_of_Day: number = 86400000;

  public allList: Dictionary;

  private _active: number = 0; //日活跃度
  private _weekActive: number = 0; //周活跃度
  private _leedProcess: number = 0;
  constructor() {
    super();
    this.allList = new Dictionary();
    this._changeObj = new SimpleDictionary();
  }

  /**
   * 获得未完成的日常活动任务
   * */
  public get unfinishList(): Array<LeedInfo> {
    var list: Array<LeedInfo> = [];
    for (const key in this.allList) {
      if (Object.prototype.hasOwnProperty.call(this.allList, key)) {
        var item: LeedInfo = this.allList[key];
        if (!item.isComplete) list.push(item);
      }
    }
    list.sort(this.sortCompare.bind(this));
    return list;
  }

  private sortCompare(a: LeedInfo, b: LeedInfo): number {
    if (a.sort > b.sort) return 1;
    return -1;
  }
  /**
   * 获得已完成的每日引导任务
   * */
  public get finishList(): Array<LeedInfo> {
    var list: Array<LeedInfo> = new Array<LeedInfo>();
    for (const key in this.allList) {
      if (Object.prototype.hasOwnProperty.call(this.allList, key)) {
        var item: LeedInfo = this.allList[key];
        if (item.isComplete) list.push(item);
      }
    }
    if (
      VIPManager.Instance.model.vipInfo.IsVipAndNoExpirt &&
      VIPManager.Instance.model.vipInfo.VipGrade >= 3
    ) {
      //如果是vip用户,创建完成条目
      var vipItem: LeedInfo = new LeedInfo();
      vipItem.isComplete = true;
      vipItem.templateId = -1;
      list.push(vipItem);
    }
    return list;
  }

  public get active(): number {
    return this._active;
  }

  public set active(value: number) {
    if (value != this._active) {
      this._active = value;
      this._changeObj[DayGuideCatecory.ACTIVE_CHANGE] = true;
    }
  }

  public get weekActive(): number {
    return this._weekActive;
  }

  public set weekActive(value: number) {
    if (value != this._weekActive) {
      this._weekActive = value;
      this._changeObj[DayGuideCatecory.WEEK_ACTIVE_CHANGE] = true;
    }
  }

  public get leedProcess(): number {
    return this._leedProcess;
  }

  public set leedProcess(value: number) {
    if (value != this._leedProcess) {
      this._leedProcess = value;
      this._changeObj[DayGuideCatecory.PROGRESS_CHANGE] = true;
    }
  }
  /**
   * 指定的奖励是否可以领取
   * */
  public canPick(point: number = 0): boolean {
    if (this._active >= point) return true;
    return false;
  }

  /**
   * 指定的周活跃奖励是否可以领取
   * */
  public canPickWeek(point: number = 0): boolean {
    if (this._weekActive >= point) return true;
    return false;
  }

  /**
   * 是否已领取(根据leedProcess向右位移index, 再取最后一位来判断)
   * leedProcess其中一些合法的值: 2(10),6(110),14(1110),30(11110)
   * */
  public hasPick(index: number): boolean {
    if ((this.leedProcess >> index) & 0x01) {
      return true;
    } else {
      return false;
    }
  }

  private _canResignCount: number = 0; //可补签次数
  /**
   * 是否已签到
   * */
  public hasSigned(index: number): boolean {
    if (index > 24) return true;
    let signStatus = this.signSite & (1 << (24 - index));
    if (signStatus != 0) {
      return true;
    }
    return false;
  }

  private _dateItemList: Array<Date>;

  /**
   * 刷新日期格子
   * */
  public initDate() {
    var last: Date =
      PlayerManager.Instance.currentPlayerModel.playerInfo.signDate; //第一天签到日期
    // if (last.getDay() != 0) {
    //     if (last.getMonth() > 0) {
    //         last.setMonth(this.today.getMonth() - 1, DateFormatter.getMonthMaxDay(this.today.getMonth() - 1, this.today.getFullYear()) - last.getDay() + 1)
    //     }
    //     else {
    //         last.setFullYear(this.today.getFullYear() - 1, 11, 31 - last.getDay() + 1);
    //     }
    // }
    var date: Date;
    this._dateItemList = [];
    for (var i: number = 0; i < 24; i++) {
      date = new Date();
      date.setTime(last.getTime() + i * DayGuideCatecory.MS_of_Day);
      this._dateItemList.push(date);
    }

    date = new Date();
    date.setTime(
      PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond * 1000,
    );
  }

  public get dateItemList(): Array<Date> {
    return this._dateItemList;
  }

  /**是否存在未签到的天数 */
  public hasNotSignDay(): boolean {
    let flag: boolean = false;
    let len: number = this._dateItemList.length;
    let item: Date;
    for (let i: number = 0; i < len; i++) {
      item = this._dateItemList[i];
      if (!this.hasSigned(i + 1)) {
        flag = true;
        break;
      }
    }
    return flag;
  }

  /**
   * 可补签天数
   */
  public get canResignCount(): number {
    return this._canResignCount;
  }

  private get today(): Date {
    return PlayerManager.Instance.currentPlayerModel.sysCurtime;
  }

  public get signSite(): number {
    return this.playerInfo.signSite;
  }

  private get playerInfo(): PlayerInfo {
    return PlayerManager.Instance.currentPlayerModel.playerInfo;
  }

  public beginChange() {
    this._changeObj.clear();
  }

  public conmmitChange() {
    if (this._changeObj[DayGuideCatecory.ACTIVE_CHANGE]) {
      this.dispatchEvent(DayGuideEvent.ACTIVE_CHANGE);
    }
    if (this._changeObj[DayGuideCatecory.WEEK_ACTIVE_CHANGE]) {
      this.dispatchEvent(DayGuideEvent.WEEK_ACTIVE_CHANGE);
    }
    if (this._changeObj[DayGuideCatecory.PROGRESS_CHANGE]) {
      this.dispatchEvent(DayGuideEvent.LEED_PROGRESS_CHANGE);
    }
  }
}
