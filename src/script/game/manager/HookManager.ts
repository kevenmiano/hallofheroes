import GameEventDispatcher from "../../core/event/GameEventDispatcher";
import { PackageIn } from "../../core/net/PackageIn";
import { ServerDataManager } from "../../core/net/ServerDataManager";
import { SocketManager } from "../../core/net/SocketManager";
import { HookEvent } from "../constant/event/NotificationEvent";
import { C2SProtocol } from "../constant/protocol/C2SProtocol";
import { S2CProtocol } from "../constant/protocol/S2CProtocol";
import HookInfo from "../module/hook/data/HookInfo";
import { NotificationManager } from "./NotificationManager";
import { PlayerManager } from "./PlayerManager";
import { TempleteManager } from "./TempleteManager";

//@ts-expect-error: External dependencies
import TempleInfoRsp = com.road.yishi.proto.temple.TempleInfoRsp;
//@ts-expect-error: External dependencies
import TempleReceiveReq = com.road.yishi.proto.temple.TempleReceiveReq;
//@ts-expect-error: External dependencies
import TempleInfoReq = com.road.yishi.proto.temple.TempleInfoReq;

/**
 * 修行神殿管理器
 */
export class HookManager extends GameEventDispatcher {
  private static _instance: HookManager;

  private _hookStates: Array<string> = [];

  private _hookInfolist: Array<HookInfo> = [];

  private _timeInterval: ReturnType<typeof setInterval> = null;

  public static get Instance(): HookManager {
    if (!this._instance) {
      this._instance = new HookManager();
      this._instance.initEvent();
    }
    return this._instance;
  }

  public setup() {
    this._hookStates = ["1", "1", "1"];
    this._hookInfolist = [];
    let config =
      TempleteManager.Instance.getConfigInfoByConfigName("temple_open");
    let info: HookInfo = null;
    if (config) {
      //"12:00-14:00,20|15:00-16:00,20|19:00-21:00,20"
      let value = config.ConfigValue;
      if (!value) return;
      let itemValue = value.split("|");
      let count = itemValue.length;
      if (count > 0) {
        for (let index = 0; index < count; index++) {
          info = new HookInfo();
          let item = itemValue[index];
          let params = item.split(",");
          let time = params[0];
          let value = params[1];
          info.time = time;
          info.hookValue = Number(value);
          info.pos = index + 1;
          info.state = this.getHookStateByPos(index);
          this._hookInfolist.push(info);
        }
      }
    }
    this._timeInterval = setInterval(this.enterFrame.bind(this), 60000); //1分钟
  }

  public get hookInfolist(): Array<HookInfo> {
    return this._hookInfolist;
  }

  private initEvent() {
    ServerDataManager.listen(
      S2CProtocol.U_C_TEMPLE_INFO,
      this,
      this.__hookUpdateHandler,
    );
  }

  private offEvent() {
    clearInterval(this._timeInterval);
    this._timeInterval = null;
  }

  /**定时请求 */
  public enterFrame() {
    if (!this._hookInfolist || this._hookInfolist.length == 0) return;
    let systemTime = PlayerManager.Instance.currentPlayerModel.sysCurtime; //当前系统时间
    for (let index = 0; index < this._hookInfolist.length; index++) {
      let item = this._hookInfolist[index];
      let time = item.time; //"12:00-14:00,20|15:00-16:00,20|19:00-21:00,20"
      let startHour = time.split("-")[0].split(":")[0];
      let startMinutes = time.split("-")[0].split(":")[1];
      let endHour = time.split("-")[1].split(":")[0];
      let endMinutes = time.split("-")[1].split(":")[1];
      let startDate = new Date();
      startDate.setHours(Number(startHour));
      startDate.setMinutes(Number(startMinutes));
      let endDate = new Date();
      endDate.setHours(Number(endHour));
      endDate.setMinutes(Number(endMinutes));
      if (
        (systemTime.getHours() == startDate.getHours() &&
          systemTime.getMinutes() == startDate.getMinutes()) ||
        (systemTime.getHours() == endDate.getHours() &&
          systemTime.getMinutes() == endDate.getMinutes())
      ) {
        //请求体力状态
        this.requestHookInfo();
        break;
      }
    }
  }

  /**
   * 获取修行神殿位置领取体力状态
   */
  public getHookStateByPos(pos: number): string {
    if (this._hookStates.length && pos < this._hookStates.length) {
      return this._hookStates[pos];
    }
    return "1";
  }

  private __hookUpdateHandler(pkg: PackageIn) {
    let msg: TempleInfoRsp = pkg.readBody(TempleInfoRsp) as TempleInfoRsp;
    let status = msg.status;
    this._hookStates = status.split(",");
    for (let index = 0; index < this._hookInfolist.length; index++) {
      let item = this._hookInfolist[index];
      let _state = this._hookStates[index];
      item.state = _state;
    }
    NotificationManager.Instance.dispatchEvent(HookEvent.UPDATE_HOOK);
  }

  /**是否能领取体力 */
  public get canReceiveHook(): boolean {
    for (let index = 0; index < this._hookInfolist.length; index++) {
      let item = this._hookInfolist[index];
      if (Number(item.state) == 2 || Number(item.state) == 5) {
        return true;
      }
    }
    return false;
  }

  /**
   * 领取体力
   * @param pos
   */
  public receiveHookByIndex(pos: number) {
    let msg: TempleReceiveReq = new TempleReceiveReq();
    msg.pos = pos;
    SocketManager.Instance.send(C2SProtocol.C_TEMPLE_RECEIVE, msg);
  }

  /**请求修行神殿数据 */
  public requestHookInfo() {
    let msg: TempleInfoReq = new TempleInfoReq();
    SocketManager.Instance.send(C2SProtocol.C_TEMPLE_INFO, msg);
  }
}
