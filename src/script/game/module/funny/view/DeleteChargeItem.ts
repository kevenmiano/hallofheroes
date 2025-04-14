import FUI_DeleteChargeItem from "../../../../../fui/Funny/FUI_DeleteChargeItem";
import LangManager from "../../../../core/lang/LangManager";
import FunnyManager from "../../../manager/FunnyManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import FunnyBagData from "../model/FunnyBagData";
import FunnyData from "../model/FunnyData";

export default class DeleteChargeItem extends FUI_DeleteChargeItem {
  private _info: FunnyBagData;
  private _flag: boolean;
  private _index: number = 0;
  private _showData: FunnyData;
  protected onConstruct() {
    super.onConstruct();
    this.initEvent();
  }

  private initEvent() {
    this.getRewardBtn.onClick(this, this.getRewardBtnHandler);
  }

  private removeEvent() {
    this.getRewardBtn.offClick(this, this.getRewardBtnHandler);
  }

  private getRewardBtnHandler() {
    if (this._showData) {
      if (
        this._showData.endTime <
        PlayerManager.Instance.currentPlayerModel.nowDate
      ) {
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation(
            "activity.ActivityManager.command02",
          ),
        );
        return;
      }
    }
    FunnyManager.Instance.deleteChargeRewardIndex = this._index;
    FunnyManager.Instance.sendGetBag(2, this._info.id, this._info.getCount);
  }

  public set showData(value: FunnyData) {
    this._showData = value;
  }

  public set flag(value: boolean) {
    this._flag = value;
  }

  public get flag(): boolean {
    return this._flag;
  }

  public set index(value: number) {
    this._index = value;
  }

  public get index(): number {
    return this._index;
  }

  public set info(value: FunnyBagData) {
    this._info = value;
    this.refreshView();
  }

  private refreshView() {
    if (this._info) {
      this.dayValueTxt.text = LangManager.Instance.GetTranslation(
        "consortia.view.myConsortia.ConsortiaMemberItem.dayTip",
        this._info.conditionList[0].value,
      );
      if (
        this._info.conditionList[0].value == 1 ||
        this._info.conditionList[0].value == 2 ||
        this._info.conditionList[0].value == 3
      ) {
        this["backPrecentTxt" + this._info.conditionList[0].value].text =
          this._info.conditionList[0].bak + " %";
        this.rankCtr.selectedIndex = this._info.conditionList[0].value - 1;
      } else {
        this.rankCtr.selectedIndex = 3;
        this.backPrecentTxt4.text = this._info.conditionList[0].bak + " %";
      }
      this.backValueTxt.text = this._info.getCount.toString();
      if (!this._flag) {
        this.chargeValueTxt.visible = false;
      } else {
        this.chargeValueTxt.visible = true;
        this.chargeValueTxt.text = this._info.conditionList[0].bak2.toString();
      }
      if (this._info.status == 1) {
        //可领取
        this.rewardStatus.selectedIndex = 1;
        this.getRewardBtn.enabled = true;
      } else if (this._info.status == 2) {
        //已经领取
        this.rewardStatus.selectedIndex = 0;
      } else if (this._info.status == 3) {
        //不可领取
        this.rewardStatus.selectedIndex = 1;
        this.getRewardBtn.enabled = false;
      }
    } else {
      this.dayValueTxt.text = "";
      this.backPrecentTxt4.text = "";
      this.rankCtr.selectedIndex = 3;
      this.chargeValueTxt.text = "";
      this.backValueTxt.text = "";
    }
  }

  dispose() {
    this.removeEvent();
    super.dispose();
  }
}
