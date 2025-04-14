import LlkDeleteData from "./LlkDeleteData";

export default class LlkInfo {
  public score: number = 0; //积分
  public fullScore: number = 0; //进度条填满所需积分
  public time: number = 0; //剩余时间（秒）
  public strength: number = 0; //体力
  public bombCount: number = 0; //剩余炸弹次数
  public resetCount: number = 0; //剩余洗牌次数
  public gate: number = 0; //关卡数
  private _points: string = ""; //点的排列（1,5,26,0,14,2,3...）
  public selfOrder: number = 0; //自己排名
  public deleteList: LlkDeleteData[]; //需要消除的列表
  public boxList: Array<any>; //奖励箱子的数据列表
  public sortList: Array<any>; //排行榜数据
  constructor() {
    this.deleteList = [];
    this.boxList = [];
    this.sortList = [];
  }

  public get points(): string {
    return this._points;
  }

  public set points(value: string) {
    this._points = value;
  }
}
