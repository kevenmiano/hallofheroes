/*
 * @Author: jeremy.xu
 * @Date: 2022-07-05 20:20:19
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-02-02 11:44:51
 * @Description: 战斗回放
 */

import LangManager from "../../../core/lang/LangManager";
import Logger from "../../../core/logger/Logger";
import ByteArray from "../../../core/net/ByteArray";
import { PackageIn } from "../../../core/net/PackageIn";
import { SocketEvent } from "../../../core/net/SocketEvent";
import ResMgr from "../../../core/res/ResMgr";
import StringHelper from "../../../core/utils/StringHelper";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { SceneManager } from "../../map/scene/SceneManager";
import NewbieBaseConditionMediator from "../../module/guide/mediators/NewbieBaseConditionMediator";
import { BattleManager } from "../BattleManager";

export class BattleRecordData {
  recordLen: number = 0;
  time: number = 0;
  pkg: PackageIn = new PackageIn();
  handled: boolean = false;
  constructor(_recordLen: number, _time: number, _pkg: PackageIn) {
    this.recordLen = _recordLen;
    this.time = _time;
    this.pkg = _pkg;
  }
}

export class BattleRecordReader extends Laya.EventDispatcher {
  public static HEAD_LEN: number = 8;
  public static LOOP_TIME: number = 25;
  public static recordList: BattleRecordData[] = [];
  public static time: number = 0;
  public static handledCnt: number = 0;
  public static inRecordMode: boolean = false;
  public static curUrl: string =
    "http://10.10.4.164/web/record/20220707/3e46d6a5-bee1-4894-b982-410e546e0cab";
  public static urlList: string[] = [];

  private static _readBuffer: ByteArray = new ByteArray();
  private static _readOffset: number;
  private static _headerTemp: ByteArray = new ByteArray();

  public static loadData(url: string, callFunc: Function) {
    if (this.urlList.indexOf(url) == -1) {
      this.urlList.push(url);
    }
    this.curUrl = url;
    ResMgr.Instance.loadRes(
      url,
      (res) => {
        let buff = Laya.loader.getRes(url);
        this.paseData(buff);
        callFunc && callFunc();
      },
      null,
      Laya.Loader.BUFFER,
    );
  }

  // 4pkg长度+4时间点+pkg
  public static paseData(arraybuffer: ArrayBuffer) {
    if (!arraybuffer) return;
    let stopperFlag: number = 0;
    this.recordList = [];
    this._readOffset = 0;
    this._headerTemp.clear();
    this._readBuffer.clear();
    this._readBuffer.writeArrayBuffer(arraybuffer, 0, arraybuffer.byteLength);
    do {
      this._headerTemp.position = 0;
      this._headerTemp.writeByte(
        this._readBuffer._byteAt_(this._readOffset + 0),
      );
      this._headerTemp.writeByte(
        this._readBuffer._byteAt_(this._readOffset + 1),
      );
      this._headerTemp.writeByte(
        this._readBuffer._byteAt_(this._readOffset + 2),
      );
      this._headerTemp.writeByte(
        this._readBuffer._byteAt_(this._readOffset + 3),
      );
      this._headerTemp.position = 0;
      let pkgLen = this._headerTemp.readInt();
      stopperFlag = pkgLen;

      if (pkgLen > 0) {
        this._headerTemp.writeByte(
          this._readBuffer._byteAt_(this._readOffset + 4),
        );
        this._headerTemp.writeByte(
          this._readBuffer._byteAt_(this._readOffset + 5),
        );
        this._headerTemp.writeByte(
          this._readBuffer._byteAt_(this._readOffset + 6),
        );
        this._headerTemp.writeByte(
          this._readBuffer._byteAt_(this._readOffset + 7),
        );
        this._headerTemp.position = 4;
        let time = this._headerTemp.readInt();
        this._readOffset += BattleRecordReader.HEAD_LEN;
        this._readBuffer.position = this._readOffset;

        let buff: PackageIn = new PackageIn();
        buff.load(this._readBuffer, pkgLen);
        let code: string = StringHelper.pad(
          buff.code.toString(16),
          4,
        ).toUpperCase();
        this._readOffset += pkgLen;

        let record = new BattleRecordData(pkgLen, time, buff);
        this.recordList.push(record);
      }
    } while (stopperFlag > 0);
  }

  public static play() {
    if (this.recordList.length <= 0) {
      Logger.warn("[BattleRecordReader]请先下载并解析数据");
      return;
    }

    if (
      NewbieBaseConditionMediator.checkInScene(1) ||
      NewbieBaseConditionMediator.checkInScene(10)
    ) {
      this.reset();
      this.inRecordMode = true;
      BattleManager.preScene = SceneManager.Instance.currentType;
      Laya.timer.loop(
        BattleRecordReader.LOOP_TIME,
        this,
        this.__enterFrameHandler,
      );
    } else {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "battle.record.cannotPlayInCurrentScene",
        ),
      );
    }
  }

  private static __enterFrameHandler(evt: any) {
    this.time += BattleRecordReader.LOOP_TIME;
    for (let index = 0; index < this.recordList.length; index++) {
      const recordData = this.recordList[index];
      if (this.time >= recordData.time && !recordData.handled) {
        this.handledCnt++;
        recordData.handled = true;
        recordData.pkg.position = PackageIn.HEADER_SIZE;
        let code: string = StringHelper.pad(
          recordData.pkg.code.toString(16),
          4,
        ).toUpperCase();
        NotificationManager.Instance.dispatchEvent(
          SocketEvent.SERVER_DATA,
          recordData.pkg,
        );
      }
    }
  }

  public static stop(clearRes: boolean = true) {
    BattleManager.onFightCanceled();
    this.reset();
    if (clearRes) {
      this.clearRes();
    }
  }

  public static reset() {
    this.time = 0;
    this.handledCnt = 0;
    this.inRecordMode = false;
    Laya.timer.clear(this, this.__enterFrameHandler);
  }

  public static clearRes() {
    if (!this.curUrl) return;
    ResMgr.Instance.releaseRes(this.curUrl);
    this.curUrl = "";
    this.recordList = [];
  }
}
