import FUI_LuckyExchangeView from "../../../../../fui/Funny/FUI_LuckyExchangeView";
import LangManager from "../../../../core/lang/LangManager";
import { DateFormatter } from "../../../../core/utils/DateFormatter";
import StringHelper from "../../../../core/utils/StringHelper";
import Utils from "../../../../core/utils/Utils";
import { BaseItem } from "../../../component/item/BaseItem";
import { BagType } from "../../../constant/BagDefine";
import {
  BagEvent,
  NotificationEvent,
} from "../../../constant/event/NotificationEvent";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { PlayerModel } from "../../../datas/playerinfo/PlayerModel";
import FunnyManager from "../../../manager/FunnyManager";
import { GoodsManager } from "../../../manager/GoodsManager";
import LuckyExchangeManager from "../../../manager/LuckyExchangeManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import LuckyExchangeItem from "./LuckyExchangeItem";
import LuckyExchangeRareItem from "./LuckyExchangeRareItem";
import LuckExchangeTempMsg = com.road.yishi.proto.active.LuckExchangeTempMsg;
import LuckExchangeItemTempMsg = com.road.yishi.proto.active.LuckExchangeItemTempMsg;
import { FunnyContent } from "./FunnyContent";

/**幸运兑换 */
export default class LuckyExchangeView
  extends FUI_LuckyExchangeView
  implements FunnyContent
{
  private _rareInfoDataList: Array<GoodsInfo> = [];
  private _exchangeDataList: Array<any> = [];
  private _infoData: LuckExchangeTempMsg = null;
  private _currentLuckValue: number = 0; //当前幸运值

  public baseItem: BaseItem;
  private _num: number = 0; //玩家拥有的数量
  private _count: number = 1;
  private _remainTime: number = 0; //剩余秒数
  private internalState: boolean = false;
  private _indexArr: Array<number> = [];

  initView() {
    this.activityTimeDescTxt.text = LangManager.Instance.GetTranslation(
      "funny.FunnyRightView.active.remainTime2",
    );
    this.countDescTxt.text = LangManager.Instance.GetTranslation(
      "MazeShopWnd.HasNumTxt",
    );
    this.rareTxt.text = LangManager.Instance.GetTranslation(
      "LuckyExchangeView.rareTxt",
    );
    this.exchangeTxt.text = LangManager.Instance.GetTranslation(
      "allmainexchange.str3",
    );
    this.luckyTxt.text = LangManager.Instance.GetTranslation(
      "LuckyExchangeView.luckyTxt",
    );
    this.luckyDescTxt.text = LangManager.Instance.GetTranslation(
      "LuckyExchangeView.luckyDescTxt",
    );
    this._indexArr = [];
    if (this._infoData) {
      this._currentLuckValue = LuckyExchangeManager.Instance.getLuckyValueById(
        this._infoData.id,
      );
      var goodInfo: GoodsInfo = new GoodsInfo();
      goodInfo.templateId = this._infoData.consumeItemId;
      this.baseItem.info = goodInfo;
      if (
        LuckyExchangeManager.Instance.getGoodsByRare(this._infoData).length > 0
      ) {
        let list: Array<LuckExchangeItemTempMsg> =
          LuckyExchangeManager.Instance.getGoodsByRare(this._infoData);
        this._rareInfoDataList = this.getDataList(list);
        this.rareInfoList.numItems = this._rareInfoDataList.length;
      }
      let count: number = 0;
      for (let i: number = 0; i < 3; i++) {
        if (this.getInfoByIndex(i).length > 0) {
          this._indexArr.push(i);
          count++;
        }
      }
      this._indexArr.sort(this.sortValue);
      if (this.getInfoByIndex(0).length > 0 && this.getInfoByIndex(2).length) {
        LuckyExchangeManager.Instance.needSpecialTxt = true; //同时配置1,4或3,4类型的兑换
      } else {
        LuckyExchangeManager.Instance.needSpecialTxt = false;
      }
      this.exchangeInfoList.numItems = count;
      this.bagItemDeleteHandler();
      this.refreshHandler();
      this.onNumTxtChange();
      this.setRemainTime(this._infoData);
    }
  }

  onShow() {
    let showID = FunnyManager.Instance.selectedId;
    this._infoData = FunnyManager.Instance.getLuckExchangeShowData(showID);
    this.initEvent();
    this.initView();
  }

  onUpdate() {
    let showID = FunnyManager.Instance.selectedId;
    this._infoData = FunnyManager.Instance.getLuckExchangeShowData(showID);
    this.initView();
  }

  onHide() {
    this.rareInfoList.numItems = 0;
    this.exchangeInfoList.numItems = 0;
    this._indexArr = [];
    this.removeEvent();
  }

  private sortValue(value1: number, value2: number): number {
    if (value1 > value2) {
      return 1;
    } else if (value1 < value2) {
      return -1;
    } else {
      return 0;
    }
  }

  private initEvent() {
    this.rareInfoList.itemRenderer = Laya.Handler.create(
      this,
      this.renderRareInfoList,
      null,
      false,
    );
    this.exchangeInfoList.itemRenderer = Laya.Handler.create(
      this,
      this.renderExchangeInfoList,
      null,
      false,
    );
    this.exchangeBtn.onClick(this, this.exchangeBtnHandler);
    this.exchangeValueTxt.on(Laya.Event.INPUT, this, this.onNumTxtChange);
    GoodsManager.Instance.addEventListener(
      BagEvent.UPDATE_BAG,
      this.bagItemDeleteHandler,
      this,
    );
    GoodsManager.Instance.addEventListener(
      BagEvent.DELETE_BAG,
      this.bagItemDeleteHandler,
      this,
    );
    NotificationManager.Instance.addEventListener(
      NotificationEvent.LUCKY_INFO_CHANGE,
      this.refreshHandler,
      this,
    );
  }

  private removeEvent() {
    Laya.timer.clearAll(this);
    // this.rareInfoList.itemRenderer.recover();
    // this.exchangeInfoList.itemRenderer.recover();
    Utils.clearGListHandle(this.rareInfoList);
    Utils.clearGListHandle(this.exchangeInfoList);
    this.exchangeBtn.offClick(this, this.exchangeBtnHandler);
    this.exchangeValueTxt.off(Laya.Event.INPUT, this, this.onNumTxtChange);
    GoodsManager.Instance.removeEventListener(
      BagEvent.UPDATE_BAG,
      this.bagItemDeleteHandler,
      this,
    );
    GoodsManager.Instance.removeEventListener(
      BagEvent.DELETE_BAG,
      this.bagItemDeleteHandler,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      NotificationEvent.LUCKY_INFO_CHANGE,
      this.refreshHandler,
      this,
    );
  }

  private refreshHandler() {
    this._currentLuckValue = LuckyExchangeManager.Instance.getLuckyValueById(
      this._infoData.id,
    );
    this.luckyValueTxt.text =
      this._currentLuckValue + "/" + this._infoData.luckValue;
    this.progress.value = Math.floor(
      (100 * this._currentLuckValue) / this._infoData.luckValue,
    );
  }

  private onNumTxtChange() {
    if (!StringHelper.isNullOrEmpty(this.exchangeValueTxt.text)) {
      this._count = parseInt(this.exchangeValueTxt.text);
      if (this._num > 0) {
        if (this._count > this._num) {
          this._count = this._num;
        }
        if (this._count > this._infoData.luckValue - this._currentLuckValue) {
          if (this._currentLuckValue == this._infoData.luckValue) {
            this._count = 1;
          } else {
            this._count = this._infoData.luckValue - this._currentLuckValue;
          }
        }
      } else {
        this._count = 1;
      }
      this.exchangeValueTxt.text = this._count.toString();
    }
  }

  private setRemainTime(data: LuckExchangeTempMsg) {
    var startTime: Date = DateFormatter.parse(
      data.startTime,
      "YYYY-MM-DD hh:mm:ss",
    );
    var endTime: Date = DateFormatter.parse(
      data.endTime,
      "YYYY-MM-DD hh:mm:ss",
    );
    if (startTime.getTime() > this.playerModel.nowDate) {
      this.activityTimeValueTxt.text = LangManager.Instance.GetTranslation(
        "feedback.FeedBackItem.outDate",
      );
    }
    this._remainTime =
      endTime.getTime() / 1000 - this.playerModel.sysCurTimeBySecond;
    this.setActivityTimeValue();
    Laya.timer.loop(1000, this, this.updateLeftTimeHandler);
  }

  private setActivityTimeValue() {
    if (this._remainTime >= 60) {
      this.activityTimeValueTxt.text = DateFormatter.getFullTimeString(
        this._remainTime,
      );
    } else if (this._remainTime > 0) {
      this.activityTimeValueTxt.text = DateFormatter.getFullDateString(
        this._remainTime,
      );
    } else {
      this.activityTimeValueTxt.text = LangManager.Instance.GetTranslation(
        "feedback.FeedBackItem.outDate",
      );
    }
  }

  private updateLeftTimeHandler() {
    this._remainTime--;
    this.setActivityTimeValue();
    if (this._remainTime <= 0) {
      Laya.timer.clear(this, this.updateLeftTimeHandler);
      this.activityTimeValueTxt.text = LangManager.Instance.GetTranslation(
        "feedback.FeedBackItem.outDate",
      );
    }
  }

  private exchangeBtnHandler() {
    if (this._remainTime <= 0) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("feedback.FeedBackItem.outDate"),
      );
      return;
    }
    if (this.internalState) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "activity.view.ActivityItem.command01",
        ),
      );
      return;
    }
    this.internalState = true;
    Utils.delay(1000).then(() => {
      this.internalState = false;
    });
    if (this._infoData) {
      if (parseInt(this.exchangeValueTxt.text) <= 0) {
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation(
            "activity.view.luckExchangeView.count",
          ),
        );
        return;
      }
      if (StringHelper.isNullOrEmpty(this.exchangeValueTxt.text)) {
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation(
            "activity.view.luckExchangeView.numTxt",
          ),
        );
        return;
      }
      LuckyExchangeManager.Instance.OperateLuckyExchange(
        this._infoData.id,
        parseInt(this.exchangeValueTxt.text),
      );
    }
  }

  private getDataList(array: Array<LuckExchangeItemTempMsg>): Array<GoodsInfo> {
    let arr: Array<GoodsInfo> = [];
    if (!array || array.length == 0) return arr;
    let len: number = array.length;
    let goodsInfo: GoodsInfo;
    let item: LuckExchangeItemTempMsg;
    for (let i: number = 0; i < len; i++) {
      item = array[i];
      if (item) {
        goodsInfo = new GoodsInfo();
        goodsInfo.templateId = item.itemId;
        goodsInfo.count = item.itemCount;
        arr.push(goodsInfo);
      }
    }
    return arr;
  }

  private bagItemDeleteHandler() {
    this._num = GoodsManager.Instance.getBagCountByTempId(
      BagType.Player,
      this._infoData.consumeItemId,
    );
    this.countValueTxt.text = this._num.toString();
    this.exchangeValueTxt.text = "1";
  }

  private renderRareInfoList(index: number, item: LuckyExchangeRareItem) {
    if (!item || item.isDisposed) return;
    item.info = this._rareInfoDataList[index];
  }

  private renderExchangeInfoList(index: number, item: LuckyExchangeItem) {
    if (!item || item.isDisposed) return;
    item.type = this._indexArr[index];
    item.info = this.getInfoByIndex(this._indexArr[index]);
  }

  private getInfoByIndex(index: number): Array<LuckExchangeItemTempMsg> {
    let value: number = 0;
    if (index == 0) {
      value = LuckyExchangeManager.SURE;
    } else if (index == 1) {
      value = LuckyExchangeManager.PERCENT;
    } else if (index == 2) {
      value = LuckyExchangeManager.RANDOM;
    }
    let arr: Array<LuckExchangeItemTempMsg> =
      LuckyExchangeManager.Instance.getGoodsByDropType(this._infoData, value);
    return arr;
  }

  private get playerModel(): PlayerModel {
    return PlayerManager.Instance.currentPlayerModel;
  }

  dispose() {
    this.removeEvent();
    super.dispose();
  }
}
