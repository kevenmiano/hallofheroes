import { PackageIn } from "../../core/net/PackageIn";
import { ServerDataManager } from "../../core/net/ServerDataManager";
import { SocketManager } from "../../core/net/SocketManager";
import Num from "../../core/utils/Num";
import CCCActiveType from "../constant/CCCActiveType";
import { NotificationEvent } from "../constant/event/NotificationEvent";
import { C2SProtocol } from "../constant/protocol/C2SProtocol";
import { S2CProtocol } from "../constant/protocol/S2CProtocol";
import { GoodsInfo } from "../datas/goods/GoodsInfo";
import FoisonHornModel from "../mvc/model/FoisonHornModel";
import { GoodsManager } from "./GoodsManager";
import { NotificationManager } from "./NotificationManager";
//@ts-expect-error: External dependencies
import FoisonHornMsg = com.road.yishi.proto.cccactive.FoisonHornMsg;
export default class FoisonHornManager {
  private static _Instance: FoisonHornManager;
  private _model: FoisonHornModel = new FoisonHornModel();
  public static OPEN_FRAME: number = 1;
  public static ACTIVATING: number = 2;
  public static get Instance(): FoisonHornManager {
    if (!FoisonHornManager._Instance) {
      FoisonHornManager._Instance = new FoisonHornManager();
    }
    return FoisonHornManager._Instance;
  }

  public get model(): FoisonHornModel {
    return this._model;
  }

  public setup() {
    this.initEvent();
  }

  private initEvent() {
    ServerDataManager.listen(
      S2CProtocol.U_C_FOISON_HORN,
      this,
      this.__updateFoisonHornMsg,
    );
  }

  private __updateFoisonHornMsg(pkg: PackageIn) {
    var msg: FoisonHornMsg = pkg.readBody(FoisonHornMsg) as FoisonHornMsg;
    if (!this.model.isOpen && msg.isOpen) {
      this.model.openChange = true;
    } else {
      this.model.openChange = false;
    }
    this.model.isOpen = msg.isOpen;
    this.model.openTime = msg.openTime;
    this.model.stopTime = msg.stopTime;
    this.model.totalCount = msg.count;
    this.model.rewardInfo = msg.rewardInfo;
    this.model.endTime = new Num(Number(msg.stopTimeStamp));
    this.model.goodsList = [];
    this.model.activatingList = [];
    this.model.activeCount = 0;
    this.model.hasActiveCount = 0;
    if (msg.activation) {
      let goodsStr: string = msg.activation;
      let goodsArr: Array<any> = goodsStr.split("|");
      let arr: Array<any>;
      for (let i: number = 0; i < goodsArr.length; i++) {
        arr = goodsArr[i].split(",");
        if (arr.length == 3) {
          let info: GoodsInfo = new GoodsInfo();
          info.templateId = parseInt(arr[0]);
          info.count = parseInt(arr[1]);
          this.model.goodsList.push(info);
          this.model.activatingList.push(arr[2]);
          if (arr[2] == 1) {
            this.model.hasActiveCount++;
          }
          let hasCount: number = GoodsManager.Instance.getGoodsNumByTempId(
            info.templateId,
          );
          if (hasCount >= info.count) {
            this.model.activeCount++;
          }
        }
      }
    }
    NotificationManager.Instance.dispatchEvent(
      NotificationEvent.FOISONHORN_INFO_CHANGE,
    );
  }

  public sendRequest(opType: number, tempId: number = 0) {
    var msg: FoisonHornMsg = new FoisonHornMsg();
    let extendsId: number = CCCActiveType.FOISONHORN;
    msg.op = opType;
    msg.itemId = tempId;
    SocketManager.Instance.send(
      C2SProtocol.C_CCCACTIVE_CLIENTOP,
      msg,
      extendsId,
    );
  }
}
