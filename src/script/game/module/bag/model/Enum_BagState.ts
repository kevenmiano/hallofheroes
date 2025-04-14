/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/3/5 12:31
 * @ver 1.0
 *
 */
export enum Enum_BagState {
  Default = 0, //默认
  Sale = 1, //出售
  Split = 2, //拆分
  BatchPut = 3, //批量放入
}

export enum Enum_BagGridState {
  Lock = -1, //未解锁
  Empty = 0, //空格子
  Item = 1, //有道具
}

/**
 * 宝箱的三种状态
 */
export enum Enum_BoxState {
  Unlock = 0, //未解锁
  Available = 1, //可领取
  Received = 2, //已领取
}
