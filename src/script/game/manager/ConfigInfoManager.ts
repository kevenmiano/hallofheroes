import ConfigMgr from "../../core/config/ConfigMgr";
import { t_s_configData } from "../config/t_s_config";
import { ConfigType } from "../constant/ConfigDefine";
import { PlayerModel } from "../datas/playerinfo/PlayerModel";
import { PlayerManager } from "./PlayerManager";
import { TempleteManager } from "./TempleteManager";

export default class ConfigInfoManager {
  private static _instance: ConfigInfoManager;
  private static START: number = 0;
  private static END: number = 1;
  public static get Instance(): ConfigInfoManager {
    if (!this._instance) this._instance = new ConfigInfoManager();
    return ConfigInfoManager._instance;
  }

  constructor() {}

  //跨服多人本开放时间
  public getMultiMatchTime(): Array<any> {
    return this.getKeyToArr2("Multi_Match");
  }

  //得到飞行坐骑列表
  public getFlyMountArr(): Array<number> {
    return this.getKeyToArr("Fly_Mount");
  }

  //【宝藏矿脉争夺】和平期时间
  public getPeaceTime(): Array<string> {
    return this.getKeyToArr2("mapphysicstreasure_peace_time");
  }

  //【宝藏矿脉争夺】争夺期时间
  public getWarfareTime(): Array<string> {
    return this.getKeyToArr2("mapphysicstreasure_Warfare_time");
  }

  //【宝藏矿脉争夺】重置时间（清除所有宝藏矿脉的占领）
  public geResetTime() {
    return this.getKeyToArr2("mapphysicstreasure_Reset_time");
  }

  //【宝藏矿脉争夺】挑战失败CD（累计达到此配置分钟数, 玩家将不可挑战）
  public getTreasureCd(): number {
    return this.getKeyToInt("mapphysicstreasure_cd");
  }

  //【宝藏矿脉争夺】挑战失败CD（第几次失败后增加的CD）, 配置格式: 【第1次失败增加的CD,第2次失败增加的CD…】
  public getTreasureCdEverytime(): Array<number> {
    return this.getKeyToArr("mapphysicstreasure_cd_everytime");
  }

  //【宝藏矿脉争夺】挑战失败CD加速所消耗的钻石及可加速的次数, 配置格式【第1次加速消耗的钻石,第2次加速消耗的钻石…】,配置了几条就代表最大可刷新几次
  public getTreasureCdAccelerateSpend(): Array<number> {
    return this.getKeyToArr("mapphysicstreasure_cd_accelerate_spend");
  }

  //【公会BOSS】公会BOSS开放日期
  public getConsortiabossOpeningdate(): Array<number> {
    return this.getKeyToArr("consortiaboss_openingdate");
  }

  //紫金矿场活动时间
  public getMineOfActiveTime() {
    return this.getKeyToString("MineOfActiveTime");
  }

  //公会战开始时间
  public getGuildWarTime() {
    return this.getKeyToString("stack_head_open_time");
  }

  //公会战开始日期
  public getGuildWarDay() {
    return this.getKeyToString("stack_head_open_week_day");
  }

  public getKeyToArr2(key: string, splitChar: string = "|"): Array<any> {
    var configInfo: t_s_configData =
      TempleteManager.Instance.getConfigInfoByConfigName(key);
    if (!configInfo || !configInfo.ConfigValue) {
      return [];
    }
    return configInfo.ConfigValue.split(splitChar);
  }

  public getKeyToArr(key: string, splitChar: string = ","): Array<any> {
    var configInfo: t_s_configData =
      TempleteManager.Instance.getConfigInfoByConfigName(key);
    if (!configInfo || !configInfo.ConfigValue) {
      return [];
    }
    return configInfo.ConfigValue.split(splitChar);
  }

  public checkIsConfigExist(key: string): boolean {
    if (TempleteManager.Instance.getConfigInfoByConfigName(key)) return true;
    return false;
  }

  public getKeyToInt(key: string): number {
    return parseInt(
      TempleteManager.Instance.getConfigInfoByConfigName(key).ConfigValue,
    );
  }

  public getKeyToString(key: string): string {
    return TempleteManager.Instance.getConfigInfoByConfigName(key).ConfigValue;
  }

  public getMountShareReward(): Array<any> {
    return this.getKeyToArr2("Share_Reward");
  }

  /**
   * 根据配置格式返回所需格式数组, 并排序
   * @param configArr ["15:00,15:30","21:00,21:30"]
   * @return 对应时间段的秒数 [[seconds1,seconds2],[seconds3,seconds4]]
   */
  public getTimeArr(configArr: Array<string>): Array<number> {
    var resultArr: Array<any> = [];
    var tDate: Date = new Date(
      this.playerModel.sysCurtime.getFullYear(),
      this.playerModel.sysCurtime.getMonth(),
      this.playerModel.sysCurtime.getDay(),
    );
    for (var i: number = 0; i < configArr.length; i++) {
      var tempArr: Array<number> = [];
      var timeArr: Array<string> = configArr[i].split(",");
      for (var j: number = 0; j < timeArr.length; j++) {
        tDate.setHours(parseInt(timeArr[j].split(":")[0]));
        tDate.setMinutes(parseInt(timeArr[j].split(":")[1]));
        tempArr.push(tDate.getTime() / 1000);
      }
      resultArr.push(tempArr);
    }
    resultArr.sort(this.sortByStartTime);
    return resultArr;
  }

  /**
   *  根据开始时间和结束时间排序
   */
  private sortByStartTime(
    timeArr1: Array<number>,
    timeArr2: Array<number>,
  ): number {
    var startTime1: number = timeArr1[ConfigInfoManager.START];
    var startTime2: number = timeArr2[ConfigInfoManager.START];
    var endTime1: number = timeArr1[ConfigInfoManager.END];
    var endTime2: number = timeArr2[ConfigInfoManager.END];
    if (startTime1 < startTime2) {
      return -1;
    } else if (startTime1 > startTime2) {
      return 1;
    } else {
      if (endTime1 < endTime2) {
        return -1;
      } else {
        return 1;
      }
    }
  }

  public getEquipAdvPoint(): Array<any> {
    if (this.checkIsConfigExist("EquipAdv_Points")) {
      return this.getKeyToArr2("EquipAdv_Points", ",");
    } else {
      return [30, 10, 90, 30];
    }
  }

  public getOutyardOpenDay(): Array<number> {
    if (this.checkIsConfigExist("stack_head_open_week_day")) {
      return this.getKeyToArr2("stack_head_open_week_day", ",");
    } else {
      return [2, 4, 6, 7];
    }
  }

  private get playerModel(): PlayerModel {
    return PlayerManager.Instance.currentPlayerModel;
  }

  public getStackHeadAttackBuff(): Array<any> {
    return this.getKeyToArr("stack_head_attack_buff", ",");
  }

  public getStackHeadDefenceBuff(): Array<any> {
    return this.getKeyToArr("stack_head_defence_buff", ",");
  }

  public getStackHeadWeekUnion(): Array<any> {
    return this.getKeyToArr("stack_head_week_union", ",");
  }

  public getStackHeadJoinFee(): number {
    return this.getKeyToInt("stack_head_join_fee");
  }

  public getStackHeadSeniorGeneralBuff(): Array<any> {
    return this.getKeyToArr("stack_head_senior_general_buff", ",");
  }

  public getStackHeadActionPoint(): Array<any> {
    return this.getKeyToArr("stack_head_action_point", "|");
  }

  public getStackHeadChargePoint(): number {
    return this.getKeyToInt("stack_head_charge_point");
  }
  /**英灵远征体力消耗**/
  public getPetRemoteWeary() {
    return this.getKeyToString("Remotepet_Weary");
  }

  public getStackHeadDefenceDebuff(): Array<any> {
    return this.getKeyToArr("stack_head_defence_debuff", ",");
  }

  public getStackHeadAttackActionPoint(): number {
    return this.getKeyToInt("stack_head_attack_action_point");
  }

  public getOuterCityMineUpperLimit(): Array<any> {
    return this.getKeyToArr("Mine_UpperLimit", "|");
  }

  public getRecoverPoint(): number {
    return this.getKeyToInt("RECOVER_POINT");
  }

  public getMarketPuchareMax(): number {
    return this.getKeyToInt("Market_MaxOrder");
  }

  public getMarketTaxRare(): number {
    return this.getKeyToInt("Market_TaxRare");
  }

  public getMarketOrderDayCount(): Array<number> {
    if (this.checkIsConfigExist("Market_PurchaseRelease")) {
      return this.getKeyToArr2("Market_PurchaseRelease", ",");
    } else {
      return [20, 30, 500000];
    }
  }

  public getMarketOrderDayCount2(): Array<number> {
    if (this.checkIsConfigExist("Market_OrderDayCount")) {
      return this.getKeyToArr2("Market_OrderDayCount", ",");
    } else {
      return [20, 30, 500000];
    }
  }

  //祈福消耗，10个数字，半角逗号分隔
  public getConsortiaPrayCost(): Array<number> {
    if (this.checkIsConfigExist("Consortia_Altar_Consume")) {
      return this.getKeyToArr2("Consortia_Altar_Consume", ",");
    } else {
      return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    }
  }

  //祈福重置次数及消耗，2个数字，半角逗号分割
  public getConsortiaAltarRefresh(): Array<number> {
    if (this.checkIsConfigExist("Consortia_Altar_Refresh")) {
      return this.getKeyToArr2("Consortia_Altar_Refresh", ",");
    } else {
      return [1, 2];
    }
  }

  //默认开启的背包格子数量
  public playerBagCount(): number {
    return this.getKeyToInt("Player_BagCount");
  }
}
