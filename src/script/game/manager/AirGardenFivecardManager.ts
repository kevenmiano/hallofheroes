import { FivecardModel } from "../module/carnival/games/FivecardModel";
import { PackageIn } from "../../core/net/PackageIn";
import { SocketManager } from "../../core/net/SocketManager";
import SimpleAlertHelper from "../component/SimpleAlertHelper";
//@ts-expect-error: External dependencies
import FiveCardPokerMsg = com.road.yishi.proto.carnival.FiveCardPokerMsg;
//@ts-expect-error: External dependencies
import FiveCardPokerRewardMsg = com.road.yishi.proto.carnival.FiveCardPokerRewardMsg;
import { C2SProtocol } from "../constant/protocol/C2SProtocol";
import LangManager from "../../core/lang/LangManager";
import { AirGardenGameEvent } from "../module/carnival/games/AirGardenGameEvent";
import GameEventDispatcher from "../../core/event/GameEventDispatcher";
import { S2CProtocol } from "../constant/protocol/S2CProtocol";
import { ServerDataManager } from "../../core/net/ServerDataManager";

export class AirGardenFivecardManager extends GameEventDispatcher {
  /**开始游戏*/
  public static OP_START = 1;
  /**下一轮*/
  public static OP_NEXT = 2;
  /**开牌*/
  public static OP_SHOW = 3;
  /**关闭界面*/
  public static OP_CLOSE = 4;

  /**最大玩的次数*/
  public static MAX_PLAY_TIME = 5;

  private static _instance: AirGardenFivecardManager;

  public static get Instance(): AirGardenFivecardManager {
    if (!this._instance) this._instance = new AirGardenFivecardManager();
    return this._instance;
  }

  private constructor() {
    super();
  }

  private _model: FivecardModel;
  public get model(): FivecardModel {
    return this._model;
  }

  public setup() {
    this._model = new FivecardModel();
    ServerDataManager.listen(
      S2CProtocol.U_C_FIVE_CARD_POKER_INFO,
      this,
      this.infoHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_FIVE_CARD_SCORE_REWARD,
      this,
      this.scoreAwardHandler,
    );
  }

  /**
   * 梭哈扑克信息
   */
  private infoHandler(pkg: PackageIn) {
    let msg = pkg.readBody(FiveCardPokerMsg) as FiveCardPokerMsg;

    this.model.curTurn = msg.curTurn;
    if (msg.addScore != 0) {
      this.model.addScore = msg.addScore;
      this.sendEvent(AirGardenGameEvent.FIVE_CARD_ADD_SCORE);
    }

    this.model.score = msg.score;

    if (msg.pokers && msg.pokers.length) {
      this.model.updatePokers(msg.pokers);
    }
    if (msg.holdList && msg.holdList.length) {
      this.model.holdList = msg.holdList;
    }

    if (msg.op == AirGardenFivecardManager.OP_SHOW) {
      this.sendEvent(AirGardenGameEvent.SHOW_FIVE_CARD);
    } else {
      this.sendEvent(AirGardenGameEvent.INIT_FIVE_CARD);
    }
  }

  /**
   * 梭哈扑克奖励
   */
  private scoreAwardHandler(pkg: PackageIn) {
    let msg = pkg.readBody(FiveCardPokerRewardMsg) as FiveCardPokerRewardMsg;
    let str = LangManager.Instance.GetTranslation(
      "AirGardenGame.hint3",
      msg.score,
      msg.count,
    );
    let prompt = LangManager.Instance.GetTranslation("public.prompt");
    let confirm1 = LangManager.Instance.GetTranslation("public.confirm");
    SimpleAlertHelper.Instance.popAlerFrame(prompt, str, confirm1, "");
  }

  /**
   * 开始
   */
  public sendStart() {
    let msg: FiveCardPokerMsg = new FiveCardPokerMsg();
    msg.op = AirGardenFivecardManager.OP_START;
    this.sendProtobuffer(C2SProtocol.C_FIVE_CARD_POKER_OP, msg);
  }

  /**
   * 下一轮
   */
  public sendNext() {
    let msg: FiveCardPokerMsg = new FiveCardPokerMsg();
    msg.op = AirGardenFivecardManager.OP_NEXT;
    this.sendProtobuffer(C2SProtocol.C_FIVE_CARD_POKER_OP, msg);
  }

  /**
   * 开牌
   */
  public sendShow(arr: Array<number>) {
    let msg: FiveCardPokerMsg = new FiveCardPokerMsg();
    msg.op = AirGardenFivecardManager.OP_SHOW;
    msg.holdList = arr;
    this.sendProtobuffer(C2SProtocol.C_FIVE_CARD_POKER_OP, msg);
  }

  /**
   * 关闭界面
   */
  public sendClose() {
    let msg: FiveCardPokerMsg = new FiveCardPokerMsg();
    msg.op = AirGardenFivecardManager.OP_CLOSE;
    this.sendProtobuffer(C2SProtocol.C_FIVE_CARD_POKER_OP, msg);
  }

  public sendProtobuffer(code: number, message) {
    SocketManager.Instance.send(code, message);
  }
}
