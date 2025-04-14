import LoaderInfo from "../datas/LoaderInfo";

/**
 * @author:pzlricky
 * @data: 2020-11-25 16:40
 * @description ***
 */
export default class LoaderPriority {
  /**
   * 玩家自身avatar加载信息优先级 , 当加载玩家avatar的时候, 低于该优先级的加载器不能工作
   */
  public static Priority_10: number = 10;
  /**
   * 地图贴图
   */
  public static Priority_9: number = 9;

  /**
   * UI资源加载信息优先级, 低于该优先级的加载器, 停止工作
   */
  public static Priority_8: number = 8;

  /**
   * NPC, 可以与低于次优先级的加载器共同工作
   */
  public static Priority_7: number = 7;

  /**
   * 战斗资源, 可以与低于次优先级的加载器共同工作
   */
  public static Priority_6: number = 6;

  /**
   * 场景特效, 可以与低于次优先级的加载器共同工作
   */
  public static Priority_5: number = 5;

  /**
   * 其他玩家avatar, 可以与低于次优先级的加载器共同工作
   */
  public static Priority_4: number = 4;

  /**
   * 后台预加载, 当没有其他优先级的加载器工作时, 启动后台预加载
   */
  public static Priority_1: number = 1;
  /**
   * 立即加载
   */
  public static Priority_0: number = 0;

  /**
   * 指定的loader是否是立即加载的
   * @return
   *
   */
  public static isImidiatyLoader(info: LoaderInfo): boolean {
    return info.priority == LoaderPriority.Priority_0;
  }
  /**
   * 指定的loader是否是独占的
   * @param info
   * @return
   *
   */
  public static isMonopolizeLoader(info: LoaderInfo): boolean {
    return (
      info.priority == LoaderPriority.Priority_10 ||
      info.priority == LoaderPriority.Priority_9
    );
  }

  public static canRemoveList: Array<LoaderPriority> = [
    LoaderPriority.Priority_4,
    LoaderPriority.Priority_9,
  ];
  /**
   * 可以移除的 loader
   * @return
   *
   */
  public static isCanClearLoader(info: LoaderInfo): boolean {
    return info.priority != LoaderPriority.Priority_1; //canRemoveList.indexOf(info) >= 0;
  }
}
