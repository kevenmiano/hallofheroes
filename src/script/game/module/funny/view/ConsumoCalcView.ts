import FUI_ConsumoCalcView from "../../../../../fui/Funny/FUI_ConsumoCalcView";
import LangManager from "../../../../core/lang/LangManager";
import { DateFormatter } from "../../../../core/utils/DateFormatter";
import { PlayerModel } from "../../../datas/playerinfo/PlayerModel";
import FunnyManager from "../../../manager/FunnyManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import FunnyBagData from "../model/FunnyBagData";
import FunnyConditionType from "../model/FunnyConditionType";
import FunnyData from "../model/FunnyData";
import FunnyType from "../model/FunnyType";
import ConsumoCalcItem from "./ConsumoCalcItem";
import { ArrayConstant, ArrayUtils } from "../../../../core/utils/ArrayUtils";
// import { FunnyContent } from "@/script/game/module/funny/view/FunnyContent";
import Utils from "../../../../core/utils/Utils";

interface FunnyContent {
  onUpdate(): void;
  onShow(): void;
  onHide(): void;
  dispose(): void;
}

/**
 * @author:pzlricky
 * @data: 2021-09-27 15:30
 * @description 通用精彩活动面板
 */
export default class ConsumoCalcView
  extends FUI_ConsumoCalcView
  implements FunnyContent
{
  private _infoData: FunnyData = null;
  private _remainTime: number = 0;
  private awardLists: Array<any> = [];

  onConstruct() {
    super.onConstruct();
  }

  onShow() {
    let showID = FunnyManager.Instance.selectedId;
    let showData = FunnyManager.Instance.getShowData(showID);
    if (showID && showData) {
      this._infoData = showData;
    }
    this.initEvent();
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
    if (
      !this._infoData ||
      this._infoData.type == FunnyType.REDEEMING_TYPE ||
      this._infoData.type == FunnyType.ACTIVITY_CODE_TYPE
    )
      return;
    this._remainTime =
      this._infoData.endTime / 1000 - this.playerModel.sysCurTimeBySecond;
    if (this._remainTime > 0) {
      this.__updateTimeHandler();
      Laya.timer.loop(1000, this, this.__updateTimeHandler);
    }
    this.nameTitle.text = this._infoData.title;
    if (this._infoData.describe)
      this.describeText.text = this._infoData.describe;
    else this.describeText.text = "";
    this.setTimeText();
    let _itemList = [];
    for (
      var j: number = 0, b: boolean = false;
      j < this._infoData.bagList.length;
      j++
    ) {
      if (this._infoData.type == FunnyType.TYPE_LEAVE) {
        if (!this._infoData.bagList[j].isShow) {
          continue;
        }
        if (
          this.currentBag(this._infoData) != this._infoData.bagList[j] &&
          this._infoData.bagList[j].status != 2
        ) {
          continue;
        }
      }
      this._infoData.bagList[j].startTime = this._infoData.startTime;
      this._infoData.bagList[j].endTime = this._infoData.endTime;
      _itemList.push(this._infoData.bagList[j]);
      if (
        this._infoData.bagList[j].conditionList[0].id !=
        FunnyConditionType.ON_LINE
      )
        continue;
      for (
        var k: number = 0;
        k < this._infoData.bagList[j].conditionList.length;
        k++
      ) {
        if (b || this._infoData.bagList[j].status == 1) {
          b = true;
          break;
        }
        if (
          this._infoData.bagList[j].conditionList[k].id ==
            FunnyConditionType.ON_LINE &&
          this._infoData.bagList[j].status == 3
        ) {
          b = true;
        }
      }
    }
    _itemList = ArrayUtils.sortOn(
      _itemList,
      ["awardOrder", "order"],
      [ArrayConstant.NUMERIC, ArrayConstant.NUMERIC],
    );
    this.awardLists = _itemList;
    this.list1.numItems = _itemList.length;
    this.timeResetTxt.visible = this._infoData.getWay == 3;
  }

  /**
   * 第一个状态不为2（不是已领取）的礼包数据
   */
  private currentBag(value: FunnyData): FunnyBagData {
    for (var i: number = 0; i < value.bagList.length; i++) {
      if (value.bagList[i].status != 2 && value.bagList[i].isShow) {
        return value.bagList[i];
      }
    }
    return null;
  }

  initEvent() {
    this.list1.itemRenderer = Laya.Handler.create(
      this,
      this.renderBoxList,
      null,
      false,
    );
  }

  removeEvent() {
    // this.list1 && this.list1.itemRenderer.recover();
    Utils.clearGListHandle(this.list1);
  }

  renderBoxList(index: number, item: ConsumoCalcItem) {
    if (!item || item.isDisposed) return;
    item.info = this.awardLists[index] as FunnyBagData;
  }

  __updateTimeHandler() {
    this.setRemainTime();
  }

  /**
   * 活动时间
   * */
  private setTimeText() {
    this.timeTxt.text = LangManager.Instance.GetTranslation(
      "funny.FunnyRightView.active.timeText",
      DateFormatter.getMonthDayString(this._infoData.startTime),
      DateFormatter.getMonthDayString(this._infoData.endTime),
    );
    this.setRemainTime();
  }

  /**
   * 剩余时间（若还没开始, 则不显示）
   * */
  public setRemainTime() {
    if (!this._infoData || this._infoData.type == FunnyType.REDEEMING_TYPE)
      return;
    var remainTime: number =
      this._infoData.endTime / 1000 - this.playerModel.sysCurTimeBySecond;
    if (remainTime >= 60) {
      this.timeTxt.text = LangManager.Instance.GetTranslation(
        "funny.FunnyRightView.active.remainTime",
        DateFormatter.getFullTimeString(remainTime),
      );
    } else if (remainTime > 0) {
      this.timeTxt.text = LangManager.Instance.GetTranslation(
        "funny.FunnyRightView.active.remainTime",
        DateFormatter.getFullDateString(remainTime),
      );
    } else {
      this.timeTxt.text = LangManager.Instance.GetTranslation(
        "feedback.FeedBackItem.outDate",
      );
    }

    if (this._infoData.startTime > this.playerModel.nowDate) {
      if (this._infoData.type == FunnyType.UPGRAD_LEVEL) {
        this.timeTxt.text =
          LangManager.Instance.GetTranslation("public.unopen");
      } else {
        this.timeTxt.text =
          LangManager.Instance.GetTranslation("public.unopen") +
          "  " +
          LangManager.Instance.GetTranslation(
            "funny.FunnyRightView.active.timeText",
            DateFormatter.getMonthDayString(this._infoData.startTime),
            DateFormatter.getMonthDayString(this._infoData.endTime),
          );
      }
    }
  }

  private get playerModel(): PlayerModel {
    return PlayerManager.Instance.currentPlayerModel;
  }

  dispose() {
    super.dispose();
  }
}
