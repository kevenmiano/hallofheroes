import GameEventDispatcher from "../../core/event/GameEventDispatcher";
import { PackageIn } from "../../core/net/PackageIn";
import { ServerDataManager } from "../../core/net/ServerDataManager";
import { SocketManager } from "../../core/net/SocketManager";
import { C2SProtocol } from "../constant/protocol/C2SProtocol";
import { S2CProtocol } from "../constant/protocol/S2CProtocol";
import QuestionnaireModel from "../module/questionnaire/QuestionnaireModel";
import { PlayerManager } from "./PlayerManager";

//@ts-expect-error: External dependencies
import QuestionDataRspMsg = com.road.yishi.proto.questionnarie.QuestionDataRspMsg;
//@ts-expect-error: External dependencies
import QuestionnarieInfoMsg = com.road.yishi.proto.questionnarie.QuestionnarieInfoMsg;

export default class QuestionnaireManager extends GameEventDispatcher {
  private static GOODS_ID: string = "GOODS_ID";
  private static GOODS_COUNT: string = "GOODS_COUNT";

  private static _instance: QuestionnaireManager;
  public static get Instance(): QuestionnaireManager {
    if (!this._instance) this._instance = new QuestionnaireManager();

    return this._instance;
  }
  private _model: QuestionnaireModel = new QuestionnaireModel();
  public get model(): QuestionnaireModel {
    return this._model;
  }

  public setup() {
    this.addEvent();
  }

  private addEvent() {
    ServerDataManager.listen(
      S2CProtocol.U_C_QUESTIONNARIE_LIST,
      this,
      this.__getQuestionnaireHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_QUESTIONNARIE_ANSWER,
      this,
      this.__getAnswerHandler,
    );
  }

  private __getQuestionnaireHandler(pkg: PackageIn) {
    this.model.questionnaireVisible = true;

    var msg: QuestionnarieInfoMsg = pkg.readBody(
      QuestionnarieInfoMsg,
    ) as QuestionnarieInfoMsg;
    this.model.questionId = msg.id;
    let serverNowTime = PlayerManager.Instance.currentPlayerModel.nowDate;
    if (msg.id && Number(msg.endTime) > serverNowTime)
      this.model.questionnaireVisible = true;
    else this.model.questionnaireVisible = false;
    // var goodsItem1: Object = { itemId: msg.itemId1, itemCount: msg.count1 };
    // var goodsItem2: Object = { itemId: msg.itemId2, itemCount: msg.count2 };
    // var goodsItem3: Object = { itemId: msg.itemId3, itemCount: msg.count3 };
    // var goodsItem4: Object = { itemId: msg.itemId4, itemCount: msg.count4 };
    QuestionnaireManager.Instance.model.questionNaireRedpoint =
      this.model.questionnaireVisible;
    this.model.questionGoodList = [];
    // this.model.questionList = msg.questiones;
    this.model.questionStartTime = Number(msg.starTime);
    this.model.questionEndTime = Number(msg.endTime);
    this.model.questionTitle = msg.title;
    this.model.questionContent = msg.content;
    //			model.questionList = model.questionList.sortOn("id");
    //			model.questionList = model.questionList.sortOn("contenType");
    // this.model.questionGoodList.push(goodsItem1, goodsItem2, goodsItem3, goodsItem4);
  }

  private __getAnswerHandler(pkg: PackageIn) {
    var msg: QuestionDataRspMsg = pkg.readBody(
      QuestionDataRspMsg,
    ) as QuestionDataRspMsg;
    this.model.answerList = msg.infolist;
    this.model.questionnaireVisible = false;
  }

  /**
   * @description发送问卷答案
   * @param 	isFirst:请求类型 0: 请求答案 1: 提交答案 2: 完成问卷
   * @param	id:问卷ID
   * @param	infoList:题号和答案 QuestionDataRspInfo
   */
  public sendQuestionAnswer(
    isFirst: number,
    id: number = 0,
    infoList: Array<any> = null,
  ) {
    var msg: QuestionDataRspMsg = new QuestionDataRspMsg();
    msg.isFirst = isFirst;
    msg.id = id;
    msg.infolist = infoList;
    SocketManager.Instance.send(C2SProtocol.C_QUESTIONNARIE_ANSWER, msg);
  }
}
