import LangManager from "../../core/lang/LangManager";
import Logger from "../../core/logger/Logger";
import { PackageIn } from "../../core/net/PackageIn";
import { ServerDataManager } from "../../core/net/ServerDataManager";
import { SocketManager } from "../../core/net/SocketManager";
import { DateFormatter } from "../../core/utils/DateFormatter";
import {
  NotificationEvent,
  ShopEvent,
} from "../constant/event/NotificationEvent";
import { C2SProtocol } from "../constant/protocol/C2SProtocol";
import { S2CProtocol } from "../constant/protocol/S2CProtocol";
import { EmWindow } from "../constant/UIDefine";
import { TipMessageData } from "../datas/TipMessageData";
import { ShopControler } from "../module/shop/control/ShopControler";
import { BuyDataInfo } from "../module/shop/model/BuyDataInfo";
import { MainShopInfo } from "../module/shop/model/MainShopInfo";
import { ShopGoodsInfo } from "../module/shop/model/ShopGoodsInfo";
import { ShopModel } from "../module/shop/model/ShopModel";
import { FrameCtrlManager } from "../mvc/FrameCtrlManager";
import { ArmyManager } from "./ArmyManager";
import { MessageTipManager } from "./MessageTipManager";
import { NotificationManager } from "./NotificationManager";
import { PlayerManager } from "./PlayerManager";
import { TaskTraceTipManager } from "./TaskTraceTipManager";
import { TempleteManager } from "./TempleteManager";
//@ts-expect-error: External dependencies
import ShopMsg = com.road.yishi.proto.shop.ShopMsg;
//@ts-expect-error: External dependencies
import MainDiscountInfo = com.road.yishi.proto.shop.MainDiscountInfo;
//@ts-expect-error: External dependencies
import ShopMainRspMsg = com.road.yishi.proto.shop.ShopMainRspMsg;
//@ts-expect-error: External dependencies
import HasDataInfo = com.road.yishi.proto.shop.HasDataInfo;
//@ts-expect-error: External dependencies
import CheckNickMsg = com.road.yishi.proto.player.CheckNickMsg;
//@ts-expect-error: External dependencies
import BuyInfo = com.road.yishi.proto.shop.BuyInfo;
//@ts-expect-error: External dependencies
import FashionShopMsg = com.road.yishi.proto.shop.FashionShopMsg;
//@ts-expect-error: External dependencies
import FastUseBloodMsg = com.road.yishi.proto.item.FastUseBloodMsg;
//@ts-expect-error: External dependencies
import ChargeOrderReq = com.road.yishi.proto.mall.ChargeOrderReq;
//@ts-expect-error: External dependencies
import ChargeOrderStatus = com.road.yishi.proto.mall.ChargeOrderStatus;
//@ts-expect-error: External dependencies
import ChargeOrderRsp = com.road.yishi.proto.mall.ChargeOrderRsp;
import GoodsSonType from "../constant/GoodsSonType";
import { GoodsManager } from "./GoodsManager";
import { GoodsInfo } from "../datas/goods/GoodsInfo";
import { DisocuntInfo } from "../module/shop/model/DiscountInfo";
import ObjectUtils from "../../core/utils/ObjectUtils";
import { isOversea } from "../module/login/manager/SiteZoneCtrl";

/**
 * 商城管理类
 */
export class ShopManager {
  /** 商城的时装 */
  public static SHOPFRAME_FASHION: string = "fashion";
  /** 商城限时热购 */
  public static SHOPFRAME_TIMEBUY: string = "SHOPFRAME_TIMEBUY";
  /** 商城VIP */
  public static SHOPFRAME_VIPBUY: string = "SHOPFRAME_VIPBUY";

  /**
   * 商城促销的数据
   * */
  public currBuyGoods: any;
  public count: number = 0;
  public isHandsel: number = 0;
  /**
   * 商城限时抢购的数据
   *  */
  public timeBuyDesc: number = 0; //倒计时时间
  public isFrist: boolean = true; //是否是第一次打开
  public type: number = 1;

  private _model: ShopModel;
  private static _Instance: ShopManager;
  /** 打开商城 默认的面板*/
  public shopFrameDefaultPanel: string;
  private _controler: ShopControler;

  public isTimeBuyOpen: boolean = false;
  //上次刷新时间
  private lastRefreshDate: Date = new Date();
  //刷新状态
  private lastRefreshState: boolean = false;

  //是否请求购买物品
  private _requestBuyState: boolean = false;

  public static get Instance(): ShopManager {
    if (!ShopManager._Instance) {
      ShopManager._Instance = new ShopManager();
    }
    return ShopManager._Instance;
  }

  public get requestBuyState(): boolean {
    return this._requestBuyState;
  }

  public get controler(): ShopControler {
    return this._controler;
  }

  public setup() {
    this.initEvent();
    ShopManager.Instance.getBuyDataInfos();
  }

  public get model(): ShopModel {
    if (!this._model) {
      this._model = new ShopModel();
    }
    return this._model;
  }

  private initEvent() {
    ServerDataManager.listen(
      S2CProtocol.U_C_SHOP_MAIN,
      this,
      this.__shopHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_SHOP_DISCOUNT,
      this,
      this.__shopDiscountHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_SHOP_HASBUY,
      this,
      this.__getBuyDataInfosSuccess,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_BUY_DISCOUNT,
      this,
      this.__shopBuyDiscount,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_FLASHSALE_FRESH,
      this,
      this.__refreshTimeBuyHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_SHOP_BUY,
      this,
      this.__shoppingHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_CHARGE_ORDER,
      this,
      this.__chargeOrderRsp,
    );
  }

  /**
   * 获取当前货币字符串
   * @returns
   */
  getMoneyString(): string {
    //国内用+   其他
    if (!isOversea()) return "+";
    else return "$";
  }

  /**
   * 商城显示热购中获取当前已购买数量的返回
   * @param pak
   */
  private __shopBuyDiscount(pak: PackageIn) {
    this._requestBuyState = false;
    let msg: ShopMsg = pak.readBody(ShopMsg) as ShopMsg;
    this.count = msg.buyInfo.count; //已购买数量
    NotificationManager.Instance.dispatchEvent(ShopEvent.BUY_DISCOUNT_RET);
  }

  public getDiscountIntimeBuy(templeteId: number): number {
    let discount: number = 1;
    let itemArr: any[] = this.model.getTimeBuyList();
    let obj: MainShopInfo;
    for (let i: number = 0; i < itemArr.length; i++) {
      obj = itemArr[i] as MainShopInfo;
      if (obj.type == 1) {
        if (!obj.isGift) {
          if (obj.templateId == templeteId) {
            //							Logger.log("宝石有打折");
            discount = obj.discount;
          }
        }
      }
    }
    return discount;
  }

  /**
   * 打折区更新购买的物品
   *
   * */
  private __shopDiscountHandler(pkg: PackageIn) {
    this._requestBuyState = false;
    let msg: MainDiscountInfo = pkg.readBody(
      MainDiscountInfo,
    ) as MainDiscountInfo;
    let timeBuyList: any[] = this.model.getTimeBuyList();
    let len: number = timeBuyList.length;
    let shopInfo: MainShopInfo;
    for (let i: number = 0; i < len; i++) {
      shopInfo = timeBuyList[i];
      if (shopInfo.id == msg.id) {
        shopInfo.currentCount = msg.currentCount;
        shopInfo.oneDayCount = msg.oneDayCount;
        shopInfo.maxCount = msg.maxCount;
        shopInfo.count = msg.counts;
        shopInfo.maxCurrentDate =
          DateFormatter.parse(
            msg.maxCurrentDate,
            "YYYY-MM-DD hh:mm:ss",
          ).getTime() / 1000;
        shopInfo.beginDate =
          DateFormatter.parse(msg.beginDate, "YYYY-MM-DD hh:mm:ss").getTime() /
            1000 -
          PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond;
        shopInfo.endDate =
          DateFormatter.parse(msg.endDate, "YYYY-MM-DD hh:mm:ss").getTime() /
          1000;
        return;
      }
    }
  }

  private __shopHandler(pkg: PackageIn) {
    this._requestBuyState = false;
    this.model.randomCount = Math.random();
    let msg: ShopMainRspMsg = pkg.readBody(ShopMainRspMsg) as ShopMainRspMsg;

    let normalTimeBuyHasChange: boolean = false;
    let vipTimeBuyHasChange: boolean = false;
    let discountInfo: MainDiscountInfo;
    let mainShopInfo: MainShopInfo;

    for (let i = 0; i < msg.discountInfo.length; i++) {
      const discountInfo = msg.discountInfo[i];
      for (let j = 0; j < this.model.mainDiscountList.length; j++) {
        const mainShopInfo = this.model.mainDiscountList[j];
        if (discountInfo.id == mainShopInfo.id) {
          break;
        }
      }
      discountInfo.vip > 0
        ? (vipTimeBuyHasChange = true)
        : (normalTimeBuyHasChange = true);
    }

    this.model.mainDiscountList = msg.discountInfo;
    this.model.mainNewList = msg.goodInfo;
    this.model.mainUrlList = msg.urlInfo;
    NotificationManager.Instance.dispatchEvent(
      NotificationEvent.SHOPHOMEPAGE_UPDATA,
    );
    if (vipTimeBuyHasChange || normalTimeBuyHasChange) {
      //商城限时限购物品刷新时弹出提示
      this.showShopTimeBuyTip(vipTimeBuyHasChange);
    }
  }

  /**周限购商品 */
  private weeklyDataInfo: any;
  private __getBuyDataInfosSuccess(pkg: PackageIn) {
    this._requestBuyState = false;
    let msg: ShopMsg = pkg.readBody(ShopMsg) as ShopMsg;

    let flag: boolean = false;
    let dataInfoLen: number = msg.hasDataInfo.length;
    let weekInfoLen: number = msg.weeklyDataInfo.length;
    this.weeklyDataInfo = msg.weeklyDataInfo;
    let timeBuyList: any[] = this.model.getTimeBuyList();
    let timeBuyLen: number = timeBuyList.length;
    let shopInfo: MainShopInfo;
    let item: BuyDataInfo;
    for (let i: number = 0; i < dataInfoLen; i++) {
      item = this.readDataInfo(msg.hasDataInfo[i] as HasDataInfo);
      if (item.isDiscount) {
        for (let j: number = 0; j < timeBuyLen; j++) {
          shopInfo = timeBuyList[j];
          if (item.itemId == shopInfo.id) {
            shopInfo.oneCurrentCount = item.counts;
            shopInfo.count = item.counts;
            flag = true;
            break;
          }
        }
      } else {
        let goods: ShopGoodsInfo = this.model.getShopTempInfoById(item.itemId);
        if (goods) {
          goods.OneCurrentCount = item.counts;
          this.model.updateHasBuyList(goods);
        }
      }
    }
    if (weekInfoLen == 0) {
      this.model.resetWeekBuyList();
      NotificationManager.Instance.dispatchEvent(
        NotificationEvent.SHOP_TIME_BUY_REFRESH,
      );
    } else {
      //周限购
      for (let i = 0; i < weekInfoLen; i++) {
        const element = this.weeklyDataInfo[i];
        let goods: ShopGoodsInfo = this.model.getShopTempInfoById(
          element.itemId,
        );
        if (goods) {
          goods.weekCount = element.counts;
        }
      }
    }

    if (flag) {
      NotificationManager.Instance.dispatchEvent(
        NotificationEvent.SHOP_TIME_BUY_REFRESH,
      );
      flag = false;
    }
    this.lastRefreshDate = new Date(msg.refreshDate);
  }

  private readDataInfo($data: HasDataInfo): BuyDataInfo {
    let info: BuyDataInfo = new BuyDataInfo();
    info.userId = $data.userId;
    info.itemId = $data.itemId;
    info.counts = $data.counts;
    info.buyDate = DateFormatter.parse($data.buyDate, "YYYY-MM-DD hh:mm:ss");
    info.isDiscount = $data.isDiscount;
    return info;
  }

  /**
   * 赠送
   *
   * */
  public sendPresent() {
    ServerDataManager.listen(
      S2CProtocol.U_C_CHECK_NICK,
      this,
      this.__checkNicknameBack,
    );
    ShopManager.Instance.getUserId(this.model.giftInfo.nickname);
  }

  private __checkNicknameBack(pkg: PackageIn) {
    ServerDataManager.cancel(
      S2CProtocol.U_C_CHECK_NICK,
      this,
      this.__checkNicknameBack,
    );

    let msg: CheckNickMsg = pkg.readBody(CheckNickMsg) as CheckNickMsg;
    if (
      !this.model.giftInfo ||
      msg.nickName.toLowerCase() != this.model.giftInfo.nickname.toLowerCase()
    ) {
      return;
    }

    if (msg.playerId != -1) {
      if (
        msg.playerId ==
        PlayerManager.Instance.currentPlayerModel.playerInfo.userId
      ) {
        let str: string = LangManager.Instance.GetTranslation(
          "shop.ShopControler.command01",
        );
        MessageTipManager.Instance.show(str);
        return;
      }
      this.sendShoping(
        this.model.giftInfo.goodId,
        this.model.giftInfo.count,
        msg.playerId,
        this.model.giftInfo.isDiscount,
      );
    } else {
      let str: string = LangManager.Instance.GetTranslation(
        "consortia.view.myConsortia.chairmanPath.ConsortiaTransferFrame.command06",
      );
      MessageTipManager.Instance.show(str);
    }
    this.model.giftInfo = null;
  }

  /**
   *购买商品
   * @param goodsId 物品ID
   * @param count 物品数量
   * @param receiveId 接收物品用户（默认为0, 自己接收）
   * @param isDiscount 是否属于打折物品
   * @param code （专门用于区别时装购物车购买）
   * @param useBind   是否使用绑钻购买
   * @param discountTempId  折扣卷模板ID
   */
  public sendShoping(
    goodsId: number,
    count: number,
    receiveId: number,
    isDiscount: boolean = false,
    code: number = 0x1422,
    useBind: boolean = true,
    discountTempId: number = 0,
  ) {
    if (this.isCannotUsePoint) {
      return;
    }

    this._requestBuyState = true;
    receiveId =
      receiveId == 0
        ? PlayerManager.Instance.currentPlayerModel.playerInfo.userId
        : receiveId;
    let buyInfo: BuyInfo = new BuyInfo();
    buyInfo.goodId = goodsId;
    buyInfo.count = count;
    buyInfo.receiveId = receiveId;
    buyInfo.isDiscount = isDiscount;
    buyInfo.type = ShopManager.Instance.type;

    if (code == C2SProtocol.C_FASHION_SHOP_BUY) {
      let msg2: FashionShopMsg = new FashionShopMsg();
      msg2.buyInfos = [buyInfo];
      msg2.payType = 0;
      if (!useBind) {
        msg2.payType = 1;
      }
      SocketManager.Instance.send(C2SProtocol.C_FASHION_SHOP_BUY, msg2);
    } else {
      let msg: ShopMsg = new ShopMsg();
      msg.buyInfo = buyInfo;
      msg.payType = 0;
      msg.discountTempId = discountTempId;
      if (!useBind) {
        msg.payType = 1;
      }
      SocketManager.Instance.send(C2SProtocol.U_C_SHOP_BUY, msg);
    }
  }

  private __shoppingHandler(pkg: PackageIn) {
    this._requestBuyState = false;
    let msg: ShopMsg = pkg.readBody(ShopMsg) as ShopMsg;
    let goodsId: number = msg.buyInfo.goodId;
    let count: number = msg.buyInfo.count;
    let receiveId: number = msg.buyInfo.receiveId;
    let result: number = msg.buyInfo.result;
    this.shopingResult(result, goodsId);

    if (result == 1 || result == 12) {
      if (msg.buyInfo.isDiscount) {
        let timeBuyList: any[] = this.model.getTimeBuyList();
        let timeBuyLen: number = timeBuyList.length;
        let shopInfo: MainShopInfo;
        for (let j: number = 0; j < timeBuyLen; j++) {
          shopInfo = timeBuyList[j];
          if (goodsId == shopInfo.id) {
            shopInfo.oneCurrentCount += count;
            shopInfo.count += count;
            this.disEvent();
            return;
          }
        }
      } else {
        let temp: ShopGoodsInfo = this.model.getShopTempInfoById(goodsId);
        if (!temp) {
          Logger.log("Not Found shopGood Id :", goodsId);
          return;
        }

        if (temp.WeeklyLimit != -1) {
          temp.weekCount += count;
          ShopManager.Instance.model.dispatchEvent(ShopEvent.GOODS_INFO_UPDATE);
        } else {
          if (!temp || temp.OneDayCount == -1) {
            return;
          }
          temp.OneCurrentCount += count;
        }
        this.model.updateHasBuyList(temp);
      }
    }
  }

  /**
   * 刷新限时抢购物品的倒计时时间, 物品的数目
   * */
  public refreshTimeGoods() {
    let msg: any = null;
    SocketManager.Instance.send(C2SProtocol.C_FLASH_SALE_FRESH, msg);
  }

  /**
   * 刷新限时抢购物品的返回
   * */
  private __refreshTimeBuyHandler(pkg: PackageIn) {
    this._requestBuyState = false;
    let msg: ShopMsg = pkg.readBody(ShopMsg) as ShopMsg;
    let beginTime: number =
      DateFormatter.parse(msg.refreshDate, "YYYY-MM-DD hh:mm:ss").getTime() /
      1000;
    let str: string =
      TempleteManager.Instance.getConfigInfoByConfigName(
        "FreshSeconds",
      ).ConfigValue;
    Logger.log(str);
    this.timeBuyDesc = beginTime + parseInt(str);

    let dataInfoLen: number = msg.hasDataInfo.length;
    let weekInfoLen: number = msg.weeklyDataInfo.length;
    let timeBuyList: any[] = this.model.getTimeBuyList();
    let timeBuyLen: number = timeBuyList.length;
    let shopInfo: MainShopInfo;
    let item: BuyDataInfo;
    for (let i: number = 0; i < dataInfoLen; i++) {
      item = this.readDataInfo(msg.hasDataInfo[i] as HasDataInfo);
      for (let j: number = 0; j < timeBuyLen; j++) {
        shopInfo = timeBuyList[j];
        if (item.itemId == shopInfo.id) {
          shopInfo.count = item.counts;
          break;
        }
      }
    }

    for (let i: number = 0; i < weekInfoLen; i++) {
      item = this.readDataInfo(msg.weeklyDataInfo[i] as HasDataInfo);
      for (let j: number = 0; j < timeBuyLen; j++) {
        shopInfo = timeBuyList[j];
        if (item.itemId == shopInfo.id) {
          shopInfo.weekCount = item.counts;
          ShopManager.Instance.model.dispatchEvent(ShopEvent.GOODS_INFO_UPDATE);
          break;
        }
      }
    }

    this.disEvent();
    if (shopInfo) {
      this.shopTimeDesc(shopInfo.needVIPGrade > 0);
    }
  }

  /** 刷新限时抢购物品 购买的次数 */
  public refreshGoodsCount() {
    let timeBuyList: any[] = this.model.getTimeBuyList();
    let timeBuyLen: number = timeBuyList.length;
    let shopInfo: MainShopInfo;
    for (let i: number = 0; i < timeBuyLen; i++) {
      shopInfo = timeBuyList[i];
      if (shopInfo.type == 2) {
        shopInfo.count = 0;
      }
    }
  }

  public disEvent() {
    NotificationManager.Instance.dispatchEvent(
      NotificationEvent.SHOP_TIME_BUY_REFRESH,
      null,
    );
  }

  /**
   *快速购买血包
   * @param goodsId  1为商城, 2为公会商城,, 3为竞技商城, 4为迷宫商城, 5为神秘商城, 6为农场商城
   * @param count 购买数量
   *
   */
  public sendShopingBloo(
    goodsId: number,
    count: number = 1,
    useBind: boolean = true,
  ) {
    ServerDataManager.listen(
      S2CProtocol.U_C_FAST_USE_BLOOD,
      this,
      this.__shoppingBlooHandler,
    );

    let receiveId: number =
      PlayerManager.Instance.currentPlayerModel.playerInfo.userId;
    let msg: ShopMsg = new ShopMsg();
    msg.buyInfo = new BuyInfo();
    msg.buyInfo.goodId = goodsId;
    msg.buyInfo.count = count;
    msg.buyInfo.receiveId = receiveId;
    msg.payType = 0;
    if (!useBind) {
      msg.payType = 1;
    }
    SocketManager.Instance.send(C2SProtocol.C_FAST_USE_BLOOD, msg);
  }

  protected __shoppingBlooHandler(pkg: PackageIn) {
    ServerDataManager.cancel(
      S2CProtocol.U_C_FAST_USE_BLOOD,
      this,
      this.__shoppingBlooHandler,
    );

    let msg: FastUseBloodMsg = pkg.readBody(FastUseBloodMsg) as FastUseBloodMsg;
    let goodsId: number = msg.templateId;
    let result: number = msg.result;
    this.shopingResult(result);
    if (result == 1) {
    }
  }

  /**
   *获取用户限购商品
   *
   */
  public getBuyDataInfos() {
    SocketManager.Instance.send(C2SProtocol.U_C_SHOP_HASBUY, null);
  }

  /**
   *通过玩家昵称获得玩家ID
   * @param userName 玩家昵称
   *
   */
  public getUserId(userName: string) {
    let msg: CheckNickMsg = new CheckNickMsg();
    msg.nickName = userName;
    SocketManager.Instance.send(C2SProtocol.U_C_CHECK_NICK, msg);
  }

  /**
   * 通过物品的ID获取物品所购买的数目(限时热购中使用)
   * @param goodId
   *
   */
  public getGoodsBuyNum(goodId: number) {
    let msg: ShopMsg = new ShopMsg();
    let buy: BuyInfo = new BuyInfo();
    buy.goodId = goodId;
    buy.isDiscount = true;
    msg.buyInfo = buy;
    SocketManager.Instance.send(C2SProtocol.C_BUY_DISCOUNT, msg);
  }

  /**
   * 请求订单号
   * @param id
   * @param count
   */
  //TODO - SOLICITA ORDER ID
  public requestChargeOrderId(id: any, count: number = 1) {
    let msg: ChargeOrderReq = new ChargeOrderReq();
    msg.productId = id;
    msg.count = count;
    SocketManager.Instance.send(C2SProtocol.C_CHARGE_ORDER, msg);
  }

  /**
   * 上报订单状态
   * @param orderId   订单ID
   * @param status    订单状态: -1:玩家取消 1:已成功付款
   */
  public requestChargeOrderStatus(orderId: string, status: number) {
    let msg: ChargeOrderStatus = new ChargeOrderStatus();
    msg.orderId = orderId;
    msg.status = status;
    SocketManager.Instance.send(C2SProtocol.C_CHARGE_ORDER_STATUS, msg);
  }

  private __chargeOrderRsp(pkg: PackageIn) {
    let msg: ChargeOrderRsp = pkg.readBody(ChargeOrderRsp) as ChargeOrderRsp;
    if (msg.result == 1) {
      NotificationManager.Instance.dispatchEvent(
        NotificationEvent.CHARGE_ORDER_RSP,
        msg.orderId,
        msg.productId,
      );
    } else {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("ShopManager.tip1"),
      );
    }
  }

  public getCountById(id: number): number {
    let timeBuyList: any[] = this.model.getTimeBuyList();
    let timeBuyLen: number = timeBuyList.length;
    let shopInfo: MainShopInfo;
    for (let i: number = 0; i < timeBuyLen; i++) {
      shopInfo = timeBuyList[i];
      if (id == shopInfo.id) {
        return shopInfo.canTotalCount;
      }
    }
    return -1;
  }

  private shopingResult(value: number, buyInfoID: number = 0) {
    let str: string = "";
    switch (value) {
      case 1:
        if (this.isHandsel == 0) {
          // str = LangManager.Instance.GetTranslation("shop.utils.ShopingHelper.command01");
        } else if (this.isHandsel == 1) {
          str = LangManager.Instance.GetTranslation(
            "shop.utils.ShopingHelper.command13",
          );
        }
        break;
      case 2:
        str = LangManager.Instance.GetTranslation(
          "shop.utils.ShopingHelper.command02",
        );
        break;
      case 3:
        str = LangManager.Instance.GetTranslation(
          "shop.utils.ShopingHelper.command03",
        );
        break;
      case 4:
        //					str = LangManager.Instance.GetTranslation("shop.utils.ShopingHelper.command04");
        return;
        break;
      case 5:
        str = LangManager.Instance.GetTranslation(
          "shop.utils.ShopingHelper.command05",
        );
        break;
      case 6:
        if (this.isHandsel == 0) {
          if (this.getCountById(buyInfoID) == -1) {
            str = LangManager.Instance.GetTranslation(
              "shop.utils.ShopingHelper.command06",
            );
          } else {
            if (this.getCountById(buyInfoID) > 0) {
              str = LangManager.Instance.GetTranslation(
                "shop.utils.ShopingHelper.command06",
              );
            } else {
              str = LangManager.Instance.GetTranslation(
                "shop.view.frame.BuyFrame.sellOver",
              );
            }
          }
        } else if (this.isHandsel == 1) {
          //						str = LangManager.Instance.GetTranslation("shop.utils.ShopingHelper.command13");
          str = LangManager.Instance.GetTranslation(
            "shop.utils.ShopingHelper.command14",
          );
        }
        break;
      case 7:
        str = LangManager.Instance.GetTranslation(
          "shop.utils.ShopingHelper.command07",
        );
        break;
      case 8:
        str = LangManager.Instance.GetTranslation(
          "shop.utils.ShopingHelper.command08",
        );
        break;
      case 9:
        str = LangManager.Instance.GetTranslation(
          "shop.utils.ShopingHelper.command09",
        );
        break;
      case 10:
        str = LangManager.Instance.GetTranslation(
          "shop.utils.ShopingHelper.command10",
        );
        break;
      case 11:
        str = LangManager.Instance.GetTranslation(
          "shop.utils.ShopingHelper.command11",
        );
        break;
      case 12:
        str = LangManager.Instance.GetTranslation(
          "shop.utils.ShopingHelper.command12",
        );
        break;
      case 15:
        str = LangManager.Instance.GetTranslation(
          "shop.utils.ShopingHelper.command15",
        );
        break;
      case 17:
        str = LangManager.Instance.GetTranslation(
          "shop.utils.ShopingHelper.command17",
        );
        break;
      case 18:
        str = LangManager.Instance.GetTranslation(
          "shop.utils.ShopingHelper.command18",
        );
        break;
      case 19:
        str = LangManager.Instance.GetTranslation(
          "shop.utils.ShopingHelper.command19",
        );
        break;
      case 20:
        str = LangManager.Instance.GetTranslation(
          "shop.utils.ShopingHelper.command20",
        );
        break;
      case 21:
        str = LangManager.Instance.GetTranslation(
          "shop.utils.ShopingHelper.command21",
        );
        break;
    }
    //value 为1 表示成功
    // if (value == 1) {
    NotificationManager.Instance.dispatchEvent(ShopEvent.SHOP_BUY_RESULT);
    // }
    MessageTipManager.Instance.show(str);
  }

  public showShopTimeBuyTip($isVIPShop: boolean = false) {
    if (ArmyManager.Instance.thane.grades < 10) {
      return;
    }
    if (
      FrameCtrlManager.Instance.isOpen(EmWindow.ShopWnd) &&
      this.isTimeBuyOpen
    ) {
      return;
    }
    let str: string = $isVIPShop
      ? "tasktracetip.view.ShopTimeBuyTipView.vipContentTxt"
      : "tasktracetip.view.ShopTimeBuyTipView.contentTxt";
    let tip: TipMessageData = new TipMessageData();
    tip.title = LangManager.Instance.GetTranslation("public.prompt");
    tip.content = LangManager.Instance.GetTranslation(str);
    tip.type = TipMessageData.SHOPTIMEBUY;
    tip.data = { isVIPShop: $isVIPShop, type: tip.type };
    TaskTraceTipManager.Instance.showView(tip);
  }

  private _timerId: any = 0;

  /** 商城限时抢购倒计时 */
  public shopTimeDesc(isVIPShop: boolean = false) {
    clearInterval(this._timerId);
    this._timerId = setInterval(this.timerDesc.bind(this), 1000, isVIPShop);
  }

  private timerDesc(isVIPShop: boolean) {
    let descTime: number =
      this.timeBuyDesc -
      PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond;
    if (descTime <= 0) {
      clearInterval(this._timerId);
      this._timerId = 0;
      this.showShopTimeBuyTip(isVIPShop);
    }
  }

  /**
   * 获取单号充值次数
   * @param product_id
   * @returns
   */
  public getProductCount(product_id: string): number {
    if (!PlayerManager.Instance.productData) {
      return 0;
    }
    if (PlayerManager.Instance.productData.has(product_id)) {
      return PlayerManager.Instance.productData.get(product_id);
    }
    return 0;
  }

  /**
   * 获取单号充值次数
   * @param product_id
   * @returns
   */
  public getTodayProductCount(product_id: string): number {
    if (!PlayerManager.Instance.productTodayData) {
      return 0;
    }
    if (PlayerManager.Instance.productTodayData.has(product_id)) {
      return PlayerManager.Instance.productTodayData.get(product_id);
    }
    if (PlayerManager.Instance.productWeekData.has(product_id)) {
      return PlayerManager.Instance.productWeekData.get(product_id);
    }
    return 0;
  }

  /**
   * 非同一天,同步数据
   */
  public requestLimitData() {
    let nowServerTIme = PlayerManager.Instance.currentPlayerModel.sysCurtime;
    let lastTime = this.lastRefreshDate;
    let isSameDay = DateFormatter.checkIsSameDay(nowServerTIme, lastTime);
    Logger.info("requestLimitData:", isSameDay);
    if (!isSameDay) {
      this.getBuyDataInfos();
    }
  }

  /**
   * 获取默认选中折扣券
   * @returns
   */
  public getDefaultSelectGoods(moneyCount?: number): GoodsInfo {
    this.getDiscountData(moneyCount);
    let goodsList = this.typeList.get(0);
    if (goodsList && goodsList.length) {
      return goodsList[0];
    }
    return null;
  }

  private goodsMap: Map<string, GoodsInfo> = new Map();
  private typeList: Map<number, GoodsInfo[]> = new Map();
  /**
   * 获取折扣券信息
   * @param moneyCount 折扣券消耗钻石数量
   * @returns
   */
  public getDiscountData(moneyCount: number): any[] {
    let goods = GoodsManager.Instance.getGeneralBagGoodsBySonType(
      GoodsSonType.SONTYPE_DISCOUNT,
    );
    let listData = [];
    if (this.goodsMap) {
      this.goodsMap.clear();
    }
    if (this.typeList) {
      this.typeList.clear();
    }
    //可用
    let title0 = new DisocuntInfo();
    title0.type = 0;

    //不可用
    let title1 = new DisocuntInfo();
    title1.type = 1;

    //叠加物品相同ID,时间相同叠加
    for (let key in goods) {
      if (Object.prototype.hasOwnProperty.call(goods, key)) {
        let element: GoodsInfo = goods[key];
        if (element) {
          let elementKey = element.templateId + "_" + element.leftTime;
          let goodsitem = this.goodsMap.get(elementKey);
          if (!goodsitem || goodsitem == undefined) {
            let info = new GoodsInfo();
            ObjectUtils.copyProperties(element, info);
            this.goodsMap.set(elementKey, info);
          } else {
            goodsitem.count += element.count;
            this.goodsMap.set(elementKey, goodsitem);
          }
        }
      }
    }

    this.goodsMap.forEach((tempInfo: GoodsInfo) => {
      let canUse = this.checkUserAble(tempInfo, moneyCount);
      if (canUse) {
        title0.listGoods.push(tempInfo);
        title0.count += tempInfo.count;
      } else {
        title1.listGoods.push(tempInfo);
        title1.count += tempInfo.count;
      }
    });

    if (title0.listGoods.length) {
      listData.push(title0);
      title0.listGoods.sort(this.compareFunc);
      listData = listData.concat(title0.listGoods);
    }
    this.typeList.set(title0.type, title0.listGoods);

    if (title1.listGoods.length) {
      listData.push(title1);
      title1.listGoods.sort(this.compareFunc);
      listData = listData.concat(title1.listGoods);
    }
    this.typeList.set(title1.type, title1.listGoods);

    return listData;
  }

  /**金额大优先, 到期优先 */
  compareFunc(a: GoodsInfo, b: GoodsInfo): number {
    if (a.templateInfo.Property3 < b.templateInfo.Property3) {
      return 1;
    } else if (a.templateInfo.Property3 > b.templateInfo.Property3) {
      return -1;
    } else {
      if (a.beginDate.getTime() < b.beginDate.getTime()) {
        return -1;
      } else if (a.beginDate.getTime() > b.beginDate.getTime()) {
        return 1;
      } else {
        return 0;
      }
    }
    return 0;
  }

  public getDiscountTempId(tempId: number): GoodsInfo {
    let tempInfo = null;
    this.goodsMap.forEach((value: GoodsInfo) => {
      if (value.templateId == tempId) {
        tempInfo = value;
        return tempInfo;
      }
    });
    return null;
  }

  /**
   * 检查物品是否可用
   * @param dataInfo 物品信息
   * @param itemCount 金额数量
   * @returns
   */
  checkUserAble(dataInfo: GoodsInfo, itemCount: number): boolean {
    if (dataInfo && dataInfo.templateInfo) {
      let reqCost = dataInfo.templateInfo.Property2; //消费金额
      let leftTime = dataInfo.leftTime;
      if (itemCount >= reqCost && (leftTime == -1 || leftTime > 0)) {
        return true;
      }
    }
    return false;
  }

  get isCannotUsePoint(): boolean {
    if (PlayerManager.Instance.currentPlayerModel.playerInfo.point < 0) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("ShopManager.ConsumeError"),
      );
      return true;
    }
    return false;
  }
}
