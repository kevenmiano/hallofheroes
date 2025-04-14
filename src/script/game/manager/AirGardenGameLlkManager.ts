import LangManager from "../../core/lang/LangManager";
import { PackageIn } from "../../core/net/PackageIn";
import { PackageOut } from "../../core/net/PackageOut";
import { ServerDataManager } from "../../core/net/ServerDataManager";
import { SocketManager } from "../../core/net/SocketManager";
import { S2CProtocol } from "../constant/protocol/S2CProtocol";
import LlkDeleteData from "../module/carnival/model/llk/LlkDeleteData";
import LlkModel from "../module/carnival/model/llk/LlkModel";
import LlkNodeData from "../module/carnival/model/llk/LlkNodeData";
import { MsgMan } from "./MsgMan";
import { C2SProtocol } from "../constant/protocol/C2SProtocol";
import { FrameCtrlManager } from "../mvc/FrameCtrlManager";
import { EmWindow } from "../constant/UIDefine";
import Logger from "../../core/logger/Logger";
import GameEventDispatcher from "../../core/event/GameEventDispatcher";

//@ts-expect-error: External dependencies
import LinkGameMsg = com.road.yishi.proto.carnival.LinkGameMsg;
import SimpleAlertHelper, {
  AlertBtnType,
} from "../component/SimpleAlertHelper";

export default class AirGardenGameLlkManager extends GameEventDispatcher {
  private static _instance: AirGardenGameLlkManager;

  public static get Instance(): AirGardenGameLlkManager {
    if (!this._instance) {
      this._instance = new AirGardenGameLlkManager();
    }
    return this._instance;
  }

  private _model: LlkModel;
  public get model(): LlkModel {
    if (!this._model) {
      this._model = new LlkModel();
    }
    return this._model;
  }

  public setup() {
    this._model = new LlkModel();
    ServerDataManager.listen(
      S2CProtocol.U_C_LINK_GAME_INFO,
      this,
      this.__llkInfoHandler,
    );
  }

  /**
   * 收到连连看信息
   */
  private __llkInfoHandler(pkg: PackageIn) {
    var msg: LinkGameMsg = pkg.readBody(LinkGameMsg) as LinkGameMsg;

    if (this.model.info.time <= 0) {
      this.model.info.time = msg.time;
    }
    this.model.info.score = msg.score;
    this.model.info.strength = msg.strength;
    this.model.info.bombCount = msg.bombCount;
    this.model.info.resetCount = msg.resetCount;
    this.model.info.points = msg.points;
    this.model.info.gate = msg.tollgate;
    if (this.model.info.gate <= 0) this.model.info.gate = 1;

    let arr = [];
    if (msg.reward) {
      arr = msg.reward.split(",");
      var count: number = Number(arr[0]);
      var id: number = Number(arr[1]);

      var str: string = LangManager.Instance.GetTranslation(
        "AirGardenGame.hint3",
        msg.score,
        count,
      );
      var prompt: string = LangManager.Instance.GetTranslation("public.prompt");
      var confirm1: string =
        LangManager.Instance.GetTranslation("public.confirm");
      SimpleAlertHelper.Instance.Show(
        SimpleAlertHelper.SIMPLE_ALERT,
        null,
        prompt,
        str,
        confirm1,
        "",
        null,
        AlertBtnType.OC,
      );
    }

    if (msg.aX > 0 && msg.aY > 0 && msg.bX > 0 && msg.bY > 0) {
      var deleteData: LlkDeleteData = new LlkDeleteData();
      deleteData.node1.row = msg.aX;
      deleteData.node1.col = msg.aY;
      deleteData.node1.val = msg.pointValue;
      deleteData.node2.row = msg.bX;
      deleteData.node2.col = msg.bY;
      deleteData.node2.val = msg.pointValue;
      deleteData.combCount = msg.combCount;
      deleteData.addScore = msg.addScore;
      this.model.info.deleteList.push(deleteData);
    }
    arr = [];
    if (this.model.info.points) arr = this.model.info.points.split(",");
    if (arr.length == LlkModel.ROW * LlkModel.COLUMN) {
      this.updateList(arr);
    } else if (arr.length > 0) {
      Logger.info(
        LangManager.Instance.GetTranslation("llk.view.LlkFrame.title") +
          msg.points,
      );
    }
    MsgMan.notifyObserver(LlkModel.LLK_INFO, null);
  }

  private updateList(arr: Array<string>) {
    for (var i: number = 0; i < LlkModel.ROW * LlkModel.COLUMN; i++) {
      this.model.list[i].val = Number(arr[i]);
    }
  }

  /**
   *打开连连看主面板
   */
  public opLlkFrame() {
    FrameCtrlManager.Instance.open(EmWindow.AirGardenGameLLK);
  }

  public static LLK_FRAME: string = "LLK_FRAME"; //打开主界面
  /*************************发送到服务器的操作类型******************************/
  public static START: number = 1; //开始游戏
  public static DELETE: number = 2; //删除两点
  public static USE_BOMB: number = 3; //使用炸弹
  public static RESET: number = 4; //重置
  public static CLOSE: number = 5; //关闭界面（暂停倒计时）
  /*************************************************************************/
  /**
   * 连连看操作（无需参数的操作）
   */
  public llkOp(opType: number) {
    var pkg: PackageOut = new PackageOut(C2SProtocol.C_LINKGAME_OP);
    var msg: LinkGameMsg = new LinkGameMsg();
    msg.opType = opType;
    this.sendProtoBuffer(C2SProtocol.C_LINKGAME_OP, msg);
  }
  /**
   * 连连看购买道具
   * @param opType
   */
  public llkBuy(opType: number, useBind: boolean = true) {
    var pkg: PackageOut = new PackageOut(C2SProtocol.C_LINKGAME_OP);
    var msg: LinkGameMsg = new LinkGameMsg();
    msg.opType = opType;
    msg.param1 = useBind ? 0 : 1;
    this.sendProtoBuffer(C2SProtocol.C_LINKGAME_OP, msg);
  }
  /**
   * 连连看删除两点
   */
  public llkDelete(node1: LlkNodeData, node2: LlkNodeData) {
    var msg: LinkGameMsg = new LinkGameMsg();
    msg.opType = AirGardenGameLlkManager.DELETE;
    msg.aX = node1.row;
    msg.aY = node1.col;
    msg.bX = node2.row;
    msg.bY = node2.col;
    this.sendProtoBuffer(C2SProtocol.C_LINKGAME_OP, msg);
  }

  public sendProtoBuffer(code: number, message) {
    SocketManager.Instance.send(code, message);
  }
}
