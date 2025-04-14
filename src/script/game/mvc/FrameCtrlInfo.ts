import { EmWindow } from "../constant/UIDefine";

/**
 * @author:pzlricky
 * @data: 2020-11-26 15:43
 * @description ***
 */
export default class FrameCtrlInfo {
  /**
   * 需要加载的资源列表
   */
  public resList: any[];
  /**
   * 需要打开的弹窗名称
   */
  public moduleName: EmWindow;
  /**
   * 打开模块需要注入的数据
   */
  public frameData: Record<string, any>;
  /**
   * 该模块需要加载的资源总大小
   */
  public get totalSize(): number {
    return this.resList.length;
  }
  public progress: number = 0;
  public currentLoaded: number = 0;
}
