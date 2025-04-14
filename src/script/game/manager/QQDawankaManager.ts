import ConfigMgr from "../../core/config/ConfigMgr";
import GameEventDispatcher from "../../core/event/GameEventDispatcher";
import { PackageIn } from "../../core/net/PackageIn";
import { ServerDataManager } from "../../core/net/ServerDataManager";
import { SocketManager } from "../../core/net/SocketManager";
import { ConfigType } from "../constant/ConfigDefine";
import { C2SProtocol } from "../constant/protocol/C2SProtocol";
import { S2CProtocol } from "../constant/protocol/S2CProtocol";
import QQDawankaModel from "../module/qqDawanka/QQDawankaModel";

//@ts-expect-error: External dependencies
import UserQQDaWanKaMsg = com.road.yishi.proto.qq.UserQQDaWanKaMsg;
//@ts-expect-error: External dependencies
import DaWanKaReq = com.road.yishi.proto.qq.DaWanKaReq;
//@ts-expect-error: External dependencies
import OpenGiftRsp = com.road.yishi.proto.qq.OpenGiftRsp;

export default class QQDawankaManager extends GameEventDispatcher {
  private static GOODS_ID: string = "GOODS_ID";
  private static GOODS_COUNT: string = "GOODS_COUNT";

  private static _instance: QQDawankaManager;
  public static get Instance(): QQDawankaManager {
    if (!this._instance) this._instance = new QQDawankaManager();

    return this._instance;
  }
  private _model: QQDawankaModel = new QQDawankaModel();
  public get model(): QQDawankaModel {
    return this._model;
  }

  public setup() {
    // this.addEvent();
    this.model.setQQGradeDic(
      ConfigMgr.Instance.getDicSync(ConfigType.t_s_qqgrade),
    );
    this.model.setQQGradePrivilegeDic(
      ConfigMgr.Instance.getDicSync(ConfigType.t_s_qqgradeprivilege),
    );
  }

  public addEvent() {
    // ServerDataManager.listen(S2CProtocol.U_C_QUESTIONNARIE_LIST, this, this.__getQuestionnaireHandler);
    // ServerDataManager.listen(S2CProtocol.U_C_QUESTIONNARIE_ANSWER, this, this.__getAnswerHandler);
    ServerDataManager.listen(
      S2CProtocol.U_C_QQ_DAWANKA_INFO,
      this,
      this.__onDawankaInfo,
    );

    ServerDataManager.listen(
      S2CProtocol.U_C_QQ_GIFT_RSP,
      this,
      this.__onDawankaGift,
    );
  }

  public getInfo(): void {
    this.sendProtoBuffer(C2SProtocol.U_C_QQ_DAWANKA_INFO, null);
  }

  /**
   * 领取礼包
   * @param type 请求类型 0:周礼包【每周可领取当前等级, 首次升级可领取等级以下】, 1:绝版专属礼包【终身只可购买一次】
   * @param grade 领取等级
   */
  public getGift(type: number, grade: number) {
    var msg: DaWanKaReq = new DaWanKaReq();
    msg.type = type;
    msg.grade = grade;
    this.sendProtoBuffer(C2SProtocol.C_QQ_DAWANKA_REQ, msg);
  }

  __onDawankaInfo(pkg: PackageIn): void {
    var msg: UserQQDaWanKaMsg = pkg.readBody(
      UserQQDaWanKaMsg,
    ) as UserQQDaWanKaMsg;
    // console.log('__onDawankaInfo',msg);
    this._model.setInfo(msg);
  }

  __onDawankaGift(pkg: PackageIn): void {
    var msg: OpenGiftRsp = pkg.readBody(OpenGiftRsp) as OpenGiftRsp;
    // console.log('__onDawankaGift',msg);
  }

  public sendProtoBuffer(code: number, message): void {
    SocketManager.Instance.send(code, message);
  }

  public get isDWK(): boolean {
    let playerGrade = this.model.getPlayerGarde();
    if (playerGrade == 1) {
      return true;
    }
    return false;
  }

  public get isSuperDWK(): boolean {
    let playerGrade = this.model.getPlayerGarde();
    if (playerGrade == 2) {
      return true;
    }
    return false;
  }
}
