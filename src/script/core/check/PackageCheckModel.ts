import GameEventDispatcher from "../event/GameEventDispatcher";
import Logger from "../logger/Logger";
import { PackageOut } from "../net/PackageOut";
import { SocketEvent } from "../net/SocketEvent";
import Dictionary from "../utils/Dictionary";

/**
 * 检测一秒内相同数据包发送次数, 防止脚本for 发送, 以及连点外挂
 *
 */
export default class PackageCheckModel extends GameEventDispatcher {
  private _packageNotes: Dictionary;
  private _count: number = 0;
  //记录上一次检测时间
  private _preClearTime: number = 0;
  //两次比较相差的时间
  private _offTime: number = 0;
  //异常时, 相同包一秒内出现的次数
  private static ERROR_MAX_COUNT: number = 20;
  constructor(target = null) {
    super();
    this._packageNotes = new Dictionary();
  }

  public addPackage(pkg: PackageOut) {
    if (this._packageNotes[pkg.code]) {
      this._packageNotes[pkg.code] = parseInt(this._packageNotes[pkg.code]) + 1;
    } else {
      this._packageNotes[pkg.code] = 1;
    }
    this._count++;
    if (this._count % 20 == 0) {
      var cur: number = new Date().getTime();
      this._offTime = cur - this._preClearTime;
      this._offTime = Math.floor(this._offTime / 1000);
      if (this._offTime > 1) {
        this.check();
        this._preClearTime = cur;
        this._count = 0;
      }
    }
  }

  private check() {
    for (const key in this._packageNotes) {
      if (Object.prototype.hasOwnProperty.call(this._packageNotes, key)) {
        var count: number = Number(this._packageNotes[key]) / this._offTime;
        if (count > PackageCheckModel.ERROR_MAX_COUNT) {
          this.dispatchEvent(SocketEvent.CHECK_ERROR, null);
          // throw new Error("7 Road Socket Close: " + key);
          break;
        }
      }
    }
    this.clearAllPackageNotes();
  }

  private clearAllPackageNotes() {
    for (const key in this._packageNotes) {
      if (Object.prototype.hasOwnProperty.call(this._packageNotes, key)) {
        this._packageNotes[key] = 0;
      }
    }
  }
}
