import FUI_DeleteChargeView from "../../../../../fui/Funny/FUI_DeleteChargeView";
import LangManager from "../../../../core/lang/LangManager";
import UIManager from "../../../../core/ui/UIManager";
import { DateFormatter } from "../../../../core/utils/DateFormatter";
import { EmWindow } from "../../../constant/UIDefine";
import FunnyManager from "../../../manager/FunnyManager";
import FunnyBagData from "../model/FunnyBagData";
import FunnyData from "../model/FunnyData";
import DeleteChargeItem from "./DeleteChargeItem";
import { PlayerManager } from "../../../manager/PlayerManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import { FunnyContent } from "./FunnyContent";
import Utils from "../../../../core/utils/Utils";

export default class DeleteChargeView
  extends FUI_DeleteChargeView
  implements FunnyContent
{
  private _infoData: FunnyData = null;
  private _itemListData: Array<FunnyBagData> = [];
  private _chargeValue: Array<number> = [1, 6, 100, 1000, 3000];

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
    if (this._infoData) {
      this.btn_join.enabled = this._infoData.state != 0;
      this.timeValueTxt.text = LangManager.Instance.GetTranslation(
        "funny.FunnyRightView.active.timeText",
        DateFormatter.transDate(this._infoData.startTime / 1000),
        DateFormatter.transDate(this._infoData.endTime / 1000),
      );
      this.totalTxt.text = LangManager.Instance.GetTranslation(
        "DeleteChargeView.totalTxt",
        this._infoData.finishNum,
      );
      this._itemListData = this._infoData.bagList;
      this.totalBackValueTxt.text = this.getTotalValue().toString();
      this.list.numItems = this._itemListData.length;
      this.descTxt.text = this._infoData.describe;
      this.list.scrollToView(FunnyManager.Instance.deleteChargeRewardIndex);
      this.setNoteTxt();
      if (!this.checkNeedShowCharge()) {
        this.valueTxt2.visible = false;
      }
    }
  }

  private initEvent() {
    this.Btn_help.onClick(this, this.onHelp);
    this.btn_join.onClick(this, this.onJoin);
    this.list.itemRenderer = Laya.Handler.create(
      this,
      this.onRenderList,
      null,
      false,
    );
  }

  private removeEvent() {
    this.Btn_help.offClick(this, this.onHelp);
    this.btn_join.offClick(this, this.onJoin);
    // this.list.itemRenderer.recover();
    Utils.clearGListHandle(this.list);
  }

  /**渲染Tab单元格 */
  onRenderList(index: number, item: DeleteChargeItem) {
    item.flag = this.checkNeedShowCharge();
    item.index = index;
    item.showData = this._infoData;
    item.info = this._itemListData[index];
  }

  onHelp() {
    let title: string = LangManager.Instance.GetTranslation("public.prompt");
    let content: string = LangManager.Instance.GetTranslation(
      "DeleteChargeView.str",
    );
    UIManager.Instance.ShowWind(EmWindow.Help, {
      title: title,
      content: content,
    });
  }

  onJoin() {
    if (
      FunnyManager.Instance.selectedFunnyData.endTime <=
      PlayerManager.Instance.currentPlayerModel.nowDate
    ) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("feedback.FeedBackItem.outDate"),
      );
      return;
    }
    // state:number = 0;//活动状态 0: 正常、激活 -1:未激活 -2: 不可激活 -3:不可参与
    if (this._infoData.state == -3) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "funny.datas.FunnyBagData.joinfailed5",
        ),
      );
      return;
    }
    if (this._infoData.state == -2) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "funny.datas.FunnyBagData.joinfailed6",
        ),
      );
      return;
    }
    let content: string = LangManager.Instance.GetTranslation(
      "managers.TreasureMapManager.proTxt1",
      this._infoData.finishNum,
    );
    let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
    let confirm: string = LangManager.Instance.GetTranslation("public.confirm");
    let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
    SimpleAlertHelper.Instance.Show(
      SimpleAlertHelper.SIMPLE_ALERT,
      null,
      prompt,
      content,
      confirm,
      cancel,
      (b: boolean) => {
        if (b) {
          FunnyManager.Instance.sendGetBag(3);
        }
      },
    );
  }

  private getTotalValue(): number {
    let count: number = 0;
    for (let i: number = 0; i < this._itemListData.length; i++) {
      count += this._itemListData[i].getCount;
    }
    return count;
  }

  private checkNeedShowCharge(): boolean {
    let flag: boolean = false;
    for (let i: number = 0; i < this._itemListData.length; i++) {
      if (this._itemListData[i].conditionList[0].bak2 != 0) {
        flag = true;
        break;
      }
    }
    return flag;
  }

  private setNoteTxt() {
    let value: number = this._infoData.finishNum;
    if (this._infoData.finishNum > this._chargeValue[4]) {
      this.noteTxt.text = LangManager.Instance.GetTranslation(
        "DeleteChargeView.noteTxt5",
        value,
        this.getTotalValue(),
      );
    } else if (
      this._infoData.finishNum <= this._chargeValue[4] &&
      this._infoData.finishNum > this._chargeValue[3]
    ) {
      this.noteTxt.text = LangManager.Instance.GetTranslation(
        "DeleteChargeView.noteTxt4",
        value,
        this.getTotalValue(),
      );
    } else if (
      this._infoData.finishNum <= this._chargeValue[3] &&
      this._infoData.finishNum > this._chargeValue[2]
    ) {
      this.noteTxt.text = LangManager.Instance.GetTranslation(
        "DeleteChargeView.noteTxt3",
        value,
        this.getTotalValue(),
      );
    } else if (
      this._infoData.finishNum <= this._chargeValue[2] &&
      this._infoData.finishNum > this._chargeValue[1]
    ) {
      this.noteTxt.text = LangManager.Instance.GetTranslation(
        "DeleteChargeView.noteTxt2",
        value,
        this.getTotalValue(),
      );
    } else if (
      this._infoData.finishNum <= this._chargeValue[1] &&
      this._infoData.finishNum >= this._chargeValue[0]
    ) {
      this.noteTxt.text = LangManager.Instance.GetTranslation(
        "DeleteChargeView.noteTxt1",
        value,
        this.getTotalValue(),
      );
    }
  }

  dispose() {
    this.removeEvent();
    super.dispose();
  }
}
