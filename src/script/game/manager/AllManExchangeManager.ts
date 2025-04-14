import GameEventDispatcher from "../../core/event/GameEventDispatcher";
import { PackageIn } from "../../core/net/PackageIn";
import { ServerDataManager } from "../../core/net/ServerDataManager";
import { SocketManager } from "../../core/net/SocketManager";
import { S2CProtocol } from "../constant/protocol/S2CProtocol";

//@ts-expect-error: External dependency
import AllExchangeMsg = com.road.yishi.proto.active.AllExchangeMsg;
//@ts-expect-error: External dependency
import PropertyMsg = com.road.yishi.proto.simple.PropertyMsg;
import { C2SProtocol } from "../constant/protocol/C2SProtocol";
import AllManExchangeModel from "../module/funny/model/AllManExchangeModel";
import { NotificationEvent } from "../constant/event/NotificationEvent";
import FunnyManager from "./FunnyManager";

/**
 * 全民兑换管理类
 */
export default class AllManExchangeManager extends GameEventDispatcher {
  private _model: AllManExchangeModel = new AllManExchangeModel();
  private static _instance: AllManExchangeManager;

  public static get Instance(): AllManExchangeManager {
    if (!this._instance) this._instance = new AllManExchangeManager();
    return this._instance;
  }

  constructor() {
    super();
  }

  public setup() {
    ServerDataManager.listen(
      S2CProtocol.U_C_ALL_CHANGE,
      this,
      this.onRecvAllExchange,
    );
  }

  /**
   * 领取奖励
   * @param type 领取类型 1大箱子  2小箱子
   * @param index 索引0开始
   *
   */
  public sendGetAward(type: number, index: number) {
    let msg: PropertyMsg = new PropertyMsg();
    msg.param1 = 1;
    msg.param2 = type;
    msg.param3 = index;
    SocketManager.Instance.send(C2SProtocol.C_ALL_CHANGE_OP, msg);
  }

  /**
   * 兑换积分
   * @param index 第几个宝箱 0开始
   * @param count 兑换次数
   *
   */
  public sendExchangePoint(index: number = 0, count: number = 0) {
    let msg: PropertyMsg = new PropertyMsg();
    msg.param1 = 2;
    msg.param2 = index;
    msg.param3 = count;
    SocketManager.Instance.send(C2SProtocol.C_ALL_CHANGE_OP, msg);
  }

  /**
   * 请求全民兑换 3:打开界面
   */
  public sendOpenView() {
    let msg: PropertyMsg = new PropertyMsg();
    msg.param1 = 3;
    SocketManager.Instance.send(C2SProtocol.C_ALL_CHANGE_OP, msg);
  }

  /**全民兑换返回 */
  private onRecvAllExchange(pkg: PackageIn) {
    let msg: AllExchangeMsg = pkg.readBody(AllExchangeMsg) as AllExchangeMsg;
    if (msg) {
      this.model.update(msg);
    }
    this.dispatchEvent(NotificationEvent.AllManExchangeUpdate);
    FunnyManager.Instance.sendGetBag(1); //查询用户个人的活动信息(解决礼包状态变化不能即时同步的问题)
  }

  public get model(): AllManExchangeModel {
    return this._model;
  }

  public set model(v: AllManExchangeModel) {
    this._model = v;
  }
}
