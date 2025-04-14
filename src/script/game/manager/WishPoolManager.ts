import { PackageIn } from "../../core/net/PackageIn";
import { ServerDataManager } from "../../core/net/ServerDataManager";
import { S2CProtocol } from "../constant/protocol/S2CProtocol";
import { MessageTipManager } from "./MessageTipManager";
import LangManager from "../../core/lang/LangManager";
import WishPoolModel from "../module/shop/model/WishPoolModel";
import { GoodsInfo } from "../datas/goods/GoodsInfo";
import { ArrayConstant, ArrayUtils } from "../../core/utils/ArrayUtils";
import { EmWindow } from "../constant/UIDefine";
import { FrameCtrlManager } from "../mvc/FrameCtrlManager";
import Dictionary from "../../core/utils/Dictionary";
import WishPoolInfo from "../module/shop/model/WishPoolInfo";
import { NotificationManager } from "./NotificationManager";
import { NotificationEvent } from "../constant/event/NotificationEvent";
import { SocketManager } from "../../core/net/SocketManager";
import { C2SProtocol } from "../constant/protocol/C2SProtocol";
//@ts-expect-error: External dependencies
import WishPoolRespMsg = com.road.yishi.proto.active.WishPoolRespMsg;
//@ts-expect-error: External dependencies
import WishPoolAllMsg = com.road.yishi.proto.active.WishPoolAllMsg;
//@ts-expect-error: External dependencies
import WishPoolInfoMsg = com.road.yishi.proto.active.WishPoolInfoMsg;
//@ts-expect-error: External dependencies
import WishPoolItemInfoMsg = com.road.yishi.proto.active.WishPoolItemInfoMsg;
//@ts-expect-error: External dependencies
import WishPoolReqMsg = com.road.yishi.proto.active.WishPoolReqMsg;
export default class WishPoolManager {
  private static _Instance: WishPoolManager;
  private _wishPoolModel: WishPoolModel;
  private _goodsArr: Array<GoodsInfo>;
  public static get Instance(): WishPoolManager {
    if (!WishPoolManager._Instance) {
      WishPoolManager._Instance = new WishPoolManager();
    }
    return WishPoolManager._Instance;
  }

  public get wishPoolModel(): WishPoolModel {
    return this._wishPoolModel;
  }

  public setup() {
    this._wishPoolModel = new WishPoolModel();
    this.initEvent();
  }

  private initEvent() {
    ServerDataManager.listen(
      S2CProtocol.U_C_WISH_POOL_RESP,
      this,
      this.__wishRespHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_WISH_POOL_ALL_INFO,
      this,
      this.__wishAllInfoHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_WISH_POOL_UPDATE,
      this,
      this.__wishUpdateHandler,
    );
  }

  //许愿操作结果
  private __wishRespHandler(pkg: PackageIn) {
    let msg: WishPoolRespMsg = pkg.readBody(WishPoolRespMsg) as WishPoolRespMsg;
    if (msg) {
      if (!msg.wishResult) {
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation("wishpool.result"),
        );
        return;
      }
      this._goodsArr = [];
      let len: number = msg.items.length;
      let item: WishPoolItemInfoMsg;
      let goodsItem: GoodsInfo;
      for (let i: number = 0; i < len; i++) {
        item = msg.items[i] as WishPoolItemInfoMsg;
        goodsItem = new GoodsInfo();
        if (item) {
          goodsItem.templateId = item.itemId;
          goodsItem.count = item.count;
          this._goodsArr.push(goodsItem);
        }
      }
      this._goodsArr = ArrayUtils.sortOn(
        this._goodsArr,
        "templateId",
        ArrayConstant.DESCENDING,
      );
      FrameCtrlManager.Instance.open(EmWindow.WishPoolResultWnd, {
        arr: this._goodsArr,
        type: 2,
      });
    }
  }

  //许愿池 界面信息 登录推送
  private __wishAllInfoHandler(pkg: PackageIn) {
    let msg: WishPoolAllMsg = pkg.readBody(WishPoolAllMsg) as WishPoolAllMsg;
    if (msg) {
      let dic: Dictionary = new Dictionary();
      let len: number = msg.allWishes.length;
      let item: WishPoolInfoMsg;
      let wishPoolInfo: WishPoolInfo;
      for (let i: number = 0; i < len; i++) {
        item = msg.allWishes[i] as WishPoolInfoMsg;
        wishPoolInfo = new WishPoolInfo();
        if (item) {
          wishPoolInfo.Id = item.Id;
          wishPoolInfo.buyCount = item.buyCount;
          wishPoolInfo.WeekBuyCount = item.WeekBuyCount;
          dic.set(wishPoolInfo.Id, wishPoolInfo);
        }
      }
      this._wishPoolModel.allDic = dic;
    }
  }

  //许愿池信息更新 推送
  private __wishUpdateHandler(pkg: PackageIn) {
    let msg: WishPoolInfoMsg = pkg.readBody(WishPoolInfoMsg) as WishPoolInfoMsg;
    if (msg) {
      let wishPoolInfo: WishPoolInfo = this._wishPoolModel.allDic.get(msg.Id);
      if (wishPoolInfo) {
        wishPoolInfo.buyCount = msg.buyCount;
        wishPoolInfo.WeekBuyCount = msg.WeekBuyCount;
        NotificationManager.Instance.dispatchEvent(
          NotificationEvent.UPDATE_WISHDATA,
        );
      }
    }
  }

  //许愿操作
  public sendWishPool(poolId: number = 0, optype: number = 1) {
    let msg: WishPoolReqMsg = new WishPoolReqMsg();
    msg.poolId = poolId;
    msg.optype = optype;
    SocketManager.Instance.send(C2SProtocol.C_WISH_POOL_OP, msg);
  }
}
