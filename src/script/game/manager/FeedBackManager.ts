import GameEventDispatcher from "../../core/event/GameEventDispatcher";
import { PackageIn } from "../../core/net/PackageIn";
import { ServerDataManager } from "../../core/net/ServerDataManager";
import { ArrayUtils } from "../../core/utils/ArrayUtils";
import { DateFormatter } from "../../core/utils/DateFormatter";
import { t_s_itemtemplateData } from "../config/t_s_itemtemplate";
import { FeedBackEvent } from "../constant/event/NotificationEvent";
import { S2CProtocol } from "../constant/protocol/S2CProtocol";
import FeedBackData from "../datas/feedback/FeedBackData";
import FeedBackItemData from "../datas/feedback/FeedBackItemData";
import { PlayerManager } from "./PlayerManager";
import { SocketSendManager } from "./SocketSendManager";
import { TempleteManager } from "./TempleteManager";

//@ts-expect-error: External dependencies
import PackageInfoMsg = com.road.yishi.proto.rebate.PackageInfoMsg;
//@ts-expect-error: External dependencies
import PackageStateMsg = com.road.yishi.proto.rebate.PackageStateMsg;
//@ts-expect-error: External dependencies
import RebateInfoMsg = com.road.yishi.proto.rebate.RebateInfoMsg;
//@ts-expect-error: External dependencies
import UserRebateMsg = com.road.yishi.proto.rebate.UserRebateMsg;
import { ArrayConstant } from "../../core/utils/ArrayUtils";
import { PlayerModel } from "../datas/playerinfo/PlayerModel";

/**
 * 充值回馈的管理类
 * */
export default class FeedBackManager extends GameEventDispatcher {
  private static _instance: FeedBackManager;
  public static get Instance(): FeedBackManager {
    if (!this._instance) this._instance = new FeedBackManager();
    return this._instance;
  }
  private _data: FeedBackData;
  private _itemList: Array<FeedBackItemData> = [];
  /**
   * 充值回馈开关
   * */
  public switchBtn1: boolean;
  /**
   * 接收完成
   * */
  public allReceived: boolean;

  public setup() {
    this._data = new FeedBackData();
    this.initEvent();
  }

  private initEvent() {
    ServerDataManager.listen(
      S2CProtocol.U_C_REBATE_ACTIVE,
      this,
      this.__rebateActiveHandler,
    ); //总回馈活动
    ServerDataManager.listen(
      S2CProtocol.U_C_REBATE_DATA,
      this,
      this.__rebateDataHandler,
    ); //用户个人的回馈信息
  }
  /**
   * 充值回馈活动的模版信息
   * */
  private __rebateActiveHandler(pkg: PackageIn) {
    let msg = pkg.readBody(RebateInfoMsg) as RebateInfoMsg;
    if (msg.id == null || msg.id + "" == "undefined" || msg.id == "") {
      //中控删除物品
      this.switchBtn1 = false;
      this.dispatchEvent(FeedBackEvent.FEEDBACK_DELETE_ACTIVE);
      return;
    }
    this._data.id = msg.id;
    this._data.startTime =
      DateFormatter.parse(msg.beginDate, "YYYY-MM-DD hh:mm:ss").getTime() /
      1000;
    this._data.endTime =
      DateFormatter.parse(msg.endDate, "YYYY-MM-DD hh:mm:ss").getTime() / 1000;
    if (
      this._data.startTime * 1000 > this.playerModel.nowDate ||
      this._data.endTime * 1000 < this.playerModel.nowDate
    ) {
      //时间选择活动
      this.switchBtn1 = false;
      this.dispatchEvent(FeedBackEvent.FEEDBACK_DELETE_ACTIVE);
      return;
    }
    this._data.type = msg.type; //活动类型（1: 充值）
    this._itemList = [];
    for (var i: number = 0; i < msg.packages.length; i++) {
      var itemData: FeedBackItemData = this.readFeedBackItemData(
        msg.packages[i],
      );
      this._itemList.push(itemData);
    }
    this.switchBtn1 = true;
    SocketSendManager.Instance.sendGetFeedBack(this._data.id, null, 1); //查询用户个人的回馈活动信息
  }

  private get playerModel(): PlayerModel {
    return PlayerManager.Instance.currentPlayerModel;
  }

  private readFeedBackItemData(pkg: any): FeedBackItemData {
    var itemData: FeedBackItemData = new FeedBackItemData();
    var i: number = 0;
    var items: Array<any> = [];
    var item: object;

    for (i = 1; i <= 8; i++) {
      item = new Object();
      item["temId"] = pkg["itemid" + i];
      item["count"] = pkg["count" + i];
      if (item["temId"] == 0) {
        continue;
      }
      items.push(item);
    }
    items.sort(this.sortMasterType);

    itemData.id = pkg.packageId;
    itemData.order = pkg.order;
    itemData.point = pkg.point;
    itemData.price = pkg.price;
    for (i = 1; i <= 8; i++) {
      if (i <= items.length) {
        itemData["goodsId" + i] = items[i - 1]["temId"];
        itemData["count" + i] = items[i - 1]["count"];
      } else {
        itemData["goodsId" + i] = 0;
        itemData["count" + i] = 0;
      }
    }
    return itemData;
  }

  private sortMasterType(info1: any, info2: any): number {
    var temp1: t_s_itemtemplateData =
      TempleteManager.Instance.getGoodsTemplatesByTempleteId(info1.temId);
    var temp2: t_s_itemtemplateData =
      TempleteManager.Instance.getGoodsTemplatesByTempleteId(info2.temId);
    var sortFlag: number = 0;
    if (temp1 && !temp2) {
      sortFlag = -1;
    } else if (!temp1 && temp2) {
      sortFlag = 1;
    } else if (!temp1 && !temp2) {
      sortFlag = 0;
    } else {
      if (temp1.Profile > temp2.Profile) {
        sortFlag = -1;
      } else if (temp1.Profile < temp2.Profile) {
        sortFlag = 1;
      } else {
        if (temp1.MasterType > temp2.MasterType) {
          sortFlag = 1;
        } else if (temp1.MasterType < temp2.MasterType) {
          sortFlag = -1;
        }
      }
    }
    temp1 = null;
    temp2 = null;
    return sortFlag;
  }

  public needShine: boolean = false;
  /**
   * 充值回馈活动的用户充值信息
   * */
  private __rebateDataHandler(pkg: PackageIn) {
    let msg = pkg.readBody(UserRebateMsg) as UserRebateMsg;
    if (
      msg.id != this._data.id ||
      msg.userid != PlayerManager.Instance.currentPlayerModel.userInfo.userId ||
      msg.type != this._data.type
    ) {
      return; //下列情形: 活动id、或者用户id、或者活动类型----不对应
    }
    this._data.userPoint = msg.point;
    for (var i: number = 0; i < msg.packagestates.length; i++) {
      for (const key in this._itemList) {
        if (Object.prototype.hasOwnProperty.call(this._itemList, key)) {
          var itemData: FeedBackItemData = this._itemList[key];
          if (itemData.id == (msg.packagestates[i] as PackageStateMsg).id) {
            itemData.state = (msg.packagestates[i] as PackageStateMsg).isget;
            if (!itemData.state && this._data.userPoint >= itemData.point) {
              this.needShine = true;
            }
          }
        }
      }
    }
    this.allReceived = true;
    this.dispatchEvent(FeedBackEvent.FEEDBACK_RECEIVE_USERINFO);
  }
  /**
   * 获得此次充值回馈的用户数据
   * */
  public get data(): FeedBackData {
    return this._data;
  }
  /**
   * 获得此次充值回馈的模版数据
   * */
  public get list(): Array<FeedBackItemData> {
    this._itemList = ArrayUtils.sortOn(
      this._itemList,
      ["order"],
      [ArrayConstant.NUMERIC],
    );
    return this._itemList;
  }
}
