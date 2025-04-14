/**
 * @description    野外怪物掉落宝箱数据类
 * @author yuanzhan.yu
 * @date 2021/11/16 15:05
 * @ver 1.0
 */
export class BoxMsgInfo {
  /**
   *宝箱ID
   */
  public boxId: string;
  /**
   *玩家ID
   */
  public userId: number;
  /**
   *宝箱等级
   */
  public grade: number;
  /**
   *地图ID
   */
  public mapId: number;
  /**
   *X坐标
   */
  public x: number;
  /**
   * Y坐标
   */
  public y: number;
  /**
   * 宝箱类型  1、普通怪宝箱, 2、精英怪宝箱, 3、BOSS宝箱
   */
  public type: number;

  constructor() {}
}
