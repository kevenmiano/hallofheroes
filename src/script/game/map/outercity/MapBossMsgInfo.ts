import { TempleteManager } from "../../manager/TempleteManager";
import { WildLand } from "../data/WildLand";

/**
 * @description    外城BOSS信息数据类
 * @author yuanzhan.yu
 * @date 2021/11/16 15:05
 * @ver 1.0
 */
export class MapBossMsgInfo {
  /**
   *普通怪数量
   */
  public count1: number;
  public canKillCount1: number;
  /**
   * 精英怪数量
   */
  public count2: number;
  public canKillCount2: number;
  /**
   * BOSS怪数量
   */
  public count3: number;
  public canKillCount3: number;
  /**
   * BOSS列表 [WildLand]
   */
  public bosslist: Array<WildLand> = [];
  /**
   * BOSS剩余刷新时间
   */
  // public leftBossTime: number;
  private _leftFogTime: number;
  /**
   *怪物掉落宝箱, 只给出当前屏幕该显示的宝箱  [BoxMsgInfo]
   */
  public bossBoxList: any[];

  constructor() {
    try {
      var str: string =
        TempleteManager.Instance.getConfigInfoByConfigName(
          "WorldMapKill",
        ).ConfigValue;
      var arr: any[] = str.split(",");
      this.canKillCount1 = arr[0];
      this.canKillCount2 = arr[1];
      this.canKillCount3 = arr[2];
    } catch (e) {}
  }

  /**
   * 迷雾剩余刷新时间
   */
  public get leftFogTime(): number {
    return this._leftFogTime;
  }

  /**
   * @private
   */
  public set leftFogTime(value: number) {
    this._leftFogTime = value;
  }
}
