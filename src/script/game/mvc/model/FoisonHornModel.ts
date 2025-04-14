import Num from "../../../core/utils/Num";

export default class FoisonHornModel {
  public isOpen: boolean = false; //是否显示图标
  public openTime: string = ""; // 开启时间
  public stopTime: string = ""; // 结束时间
  public rewardInfo: string = ""; //奖励物品信息
  public goodsList: Array<any> = []; //物品列表
  public activatingList: Array<any> = []; //物品激活情况
  public totalCount: number = 0; //当前已集齐玩家总人数
  public openChange: boolean = false; //是否是新开放活动
  public endTime: Num = new Num(0); // 结束时间(时间戳)
  public activeCount: number = 0;
  public hasActiveCount: number = 0;

  constructor() {
    this.goodsList = [];
    this.activatingList = [];
  }
}
