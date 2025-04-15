import FUI_FunnySevenLoginView from "../../../../../fui/Funny/FUI_FunnySevenLoginView";
import LangManager from "../../../../core/lang/LangManager";
import { DateFormatter } from "../../../../core/utils/DateFormatter";
import Utils from "../../../../core/utils/Utils";
import { PlayerModel } from "../../../datas/playerinfo/PlayerModel";
import FunnyManager from "../../../manager/FunnyManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import FunnyBagData from "../model/FunnyBagData";
import FunnyData from "../model/FunnyData";
// import { FunnyContent } from "@/script/game/module/funny/view/FunnyContent";
import SevenLoginItem from "./SevenLoginItem";

interface FunnyContent {
  onUpdate(): void;
  onShow(): void;
  onHide(): void;
  dispose(): void;
}

export default class FunnySevenLoginView
  extends FUI_FunnySevenLoginView
  implements FunnyContent
{
  private _infoData: FunnyData = null;
  private _remainTime: number = 0;
  private awardLists: Array<FunnyBagData> = [];

  onShow() {
    this.initEvent();
    let showID = FunnyManager.Instance.selectedId;
    let showData = FunnyManager.Instance.getShowData(showID);
    if (showID && showData) {
      this._infoData = showData;
    }
    this.initView();
  }

  onUpdate() {
    let showID = FunnyManager.Instance.selectedId;
    let showData = FunnyManager.Instance.getShowData(showID);
    if (showID && showData) {
      this._infoData = showData;
    }
    this.initView();
  }

  onHide() {
    this.removeEvent();
  }

  initView() {
    if (!this._infoData) return;
    this.timeDescTxt.text = LangManager.Instance.GetTranslation(
      "giftbag.GiftBagItem.activeTime",
    );
    this.leftTimeDescTxt.text = LangManager.Instance.GetTranslation(
      "funny.FunnyRightView.active.remainTime2",
    );
    this.dayDescTxt.text = LangManager.Instance.GetTranslation(
      "FunnySevenLoginView.dayTxt",
    );
    this._remainTime =
      this._infoData.endTime / 1000 - this.playerModel.sysCurTimeBySecond;
    if (this._remainTime > 0) {
      this.__updateTimeHandler();
      Laya.timer.loop(1000, this, this.__updateTimeHandler);
    }
    this.nameTitle.text = this._infoData.title;
    if (this._infoData.describe) this.descTxt.text = this._infoData.describe;
    this.setTimeText();
    let _itemList = [];
    for (
      var j: number = 0, b: boolean = false;
      j < this._infoData.bagList.length;
      j++
    ) {
      _itemList.push(this._infoData.bagList[j]);
      for (
        var k: number = 0;
        k < this._infoData.bagList[j].conditionList.length;
        k++
      ) {
        if (b || this._infoData.bagList[j].status == 1) {
          b = true;
          break;
        }
      }
    }

    this.awardLists = _itemList;
    this.dayValueTxt.text = LangManager.Instance.GetTranslation(
      "consortia.view.myConsortia.ConsortiaMemberItem.dayTip",
      this.awardLists[0].finishValue,
    );
    this.list1.numItems = _itemList.length;
  }

  private initEvent() {
    this.list1.itemRenderer = Laya.Handler.create(
      this,
      this.onRenderList,
      null,
      false,
    );
  }

  private removeEvent() {
    // this.list1.itemRenderer.recover();
    Utils.clearGListHandle(this.list1);
  }

  onRenderList(index: number, item: SevenLoginItem) {
    item.info = this.awardLists[index];
  }

  setRemainTime() {
    this._remainTime--;
    if (this._remainTime >= 60) {
      this.leftTimeValueTxt.text = DateFormatter.getFullTimeString(
        this._remainTime,
      );
    } else if (this._remainTime > 0) {
      this.leftTimeValueTxt.text = DateFormatter.getFullDateString(
        this._remainTime,
      );
    } else {
      this.leftTimeValueTxt.text = LangManager.Instance.GetTranslation(
        "feedback.FeedBackItem.outDate",
      );
    }
  }

  /**
   * 活动时间
   * */
  private setTimeText() {
    this.timeValueTxt.text = LangManager.Instance.GetTranslation(
      "funny.FunnyRightView.active.timeText",
      DateFormatter.getMonthDayString(this._infoData.startTime, ".", false),
      DateFormatter.getMonthDayString(this._infoData.endTime, ".", false),
    );
    this.setRemainTime();
  }

  __updateTimeHandler() {
    this.setRemainTime();
  }

  private get playerModel(): PlayerModel {
    return PlayerManager.Instance.currentPlayerModel;
  }

  dispose() {
    this.removeEvent();
    super.dispose();
  }
}
