import ConfigMgr from "../../core/config/ConfigMgr";
import GameEventDispatcher from "../../core/event/GameEventDispatcher";
import { PackageIn } from "../../core/net/PackageIn";
import { ServerDataManager } from "../../core/net/ServerDataManager";
import { SocketManager } from "../../core/net/SocketManager";
import { ConfigType } from "../constant/ConfigDefine";
import { C2SProtocol } from "../constant/protocol/C2SProtocol";
import { S2CProtocol } from "../constant/protocol/S2CProtocol";
import QQGiftModel from "../module/qqGift/QQGiftModel";

//@ts-expect-error: External dependencies
import DaWanKaReq = com.road.yishi.proto.qq.DaWanKaReq;
//@ts-expect-error: External dependencies
import QQGiftBagState = com.road.yishi.proto.qq.QQGiftBagState;

export default class QQGiftManager extends GameEventDispatcher {
  private static _instance: QQGiftManager;
  public static get Instance(): QQGiftManager {
    if (!this._instance) this._instance = new QQGiftManager();

    return this._instance;
  }
  private _model: QQGiftModel = new QQGiftModel();
  public get model(): QQGiftModel {
    return this._model;
  }

  public setup() {
    // this.addEvent();
    this.model.setLevelGiftDic(
      ConfigMgr.Instance.getDicSync(ConfigType.t_s_qqgradepackage),
    );
  }

  public addEvent() {
    ServerDataManager.listen(
      S2CProtocol.U_C_QQ_GIFT_BAG,
      this,
      this.__onGiftBag,
    );
  }

  /**
   * 领取礼包
   * @param type 请求类型 0:周礼包【每周可领取当前等级, 首次升级可领取等级以下】, 1:绝版专属礼包【终身只可购买一次】2:新手礼包 3: 每日礼包 4: 等级礼包
   * @param grade 领取等级
   */
  public getGift(type: number, grade: number) {
    var msg: DaWanKaReq = new DaWanKaReq();
    msg.type = type;
    msg.grade = grade;
    this.sendProtoBuffer(C2SProtocol.C_QQ_DAWANKA_REQ, msg);
  }

  __onGiftBag(pkg: PackageIn): void {
    var msg: QQGiftBagState = pkg.readBody(QQGiftBagState) as QQGiftBagState;
    this._model.setInfo(msg);
  }

  public sendProtoBuffer(code: number, message): void {
    SocketManager.Instance.send(code, message);
  }
}
