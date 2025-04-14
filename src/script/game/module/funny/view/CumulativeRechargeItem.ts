import FUI_CumulativeRechargeItem from "../../../../../fui/Funny/FUI_CumulativeRechargeItem";
import LangManager from "../../../../core/lang/LangManager";
import FeedBackItemData from "../../../datas/feedback/FeedBackItemData";
import FeedBackManager from "../../../manager/FeedBackManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { SocketSendManager } from "../../../manager/SocketSendManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { EmWindow } from "../../../constant/UIDefine";
import FUIHelper from "../../../utils/FUIHelper";
import UIButton from "../../../../core/ui/UIButton";
import TemplateIDConstant from "../../../constant/TemplateIDConstant";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";

/**
 * @author:pzlricky
 * @data: 2022-03-04 11:17
 * @description 累计充值Item
 */
export default class CumulativeRechargeItem extends FUI_CumulativeRechargeItem {
  private _info: FeedBackItemData;
  private _canGet: boolean = false;
  private _index: number = 0;
  public _diamondBtn1: UIButton;
  public _diamondBtn2: UIButton;
  protected onConstruct() {
    super.onConstruct();
    this.initEvent();
    this._diamondBtn1 = new UIButton(this.diamondBtn1);
    this._diamondBtn2 = new UIButton(this.diamondBtn2);
    this._diamondBtn1.scaleParas.paraScale =
      this._diamondBtn2.scaleParas.paraScale = 1;
    let goodsInfo: GoodsInfo = new GoodsInfo();
    goodsInfo.templateId = TemplateIDConstant.TEMP_ID_DIAMOND;
    FUIHelper.setTipData(
      this._diamondBtn1.view,
      EmWindow.NewPropTips,
      goodsInfo,
    );
    FUIHelper.setTipData(
      this._diamondBtn2.view,
      EmWindow.NewPropTips,
      goodsInfo,
    );
  }

  private initEvent() {
    this.confirmBtn.onClick(this, this.confirmBtnHandler);
    this.boxIcon.onClick(this, this.boxIconHandler);
  }

  private removeEvent() {
    this.confirmBtn.offClick(this, this.confirmBtnHandler);
    this.boxIcon.offClick(this, this.boxIconHandler);
  }

  private boxIconHandler() {
    FrameCtrlManager.Instance.open(
      EmWindow.CumulativeRechargeItemInfoWnd,
      this._info,
    );
  }

  private confirmBtnHandler() {
    if (this._canGet && this._info) {
      var currentTime: number =
        PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond;
      var endTime: number = FeedBackManager.Instance.data.endTime;
      var startTime: number = FeedBackManager.Instance.data.startTime;
      if (currentTime >= startTime && currentTime <= endTime) {
        SocketSendManager.Instance.sendGetFeedBack(
          FeedBackManager.Instance.data.id,
          this._info.id,
          2,
        );
      } else {
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation("feedback.FeedBackItem.outDate"),
        );
      }
    }
  }

  public set index(index: number) {
    this._index = index;
    if (this._index > 3 && this._index <= 6) {
      this._index = this._index - 3;
    } else if (this._index > 6) {
      this._index = this._index - 6;
    }
    let str: string = "Img_box" + this._index;
    this.boxIcon.url = FUIHelper.getItemURL(EmWindow.Funny, str);
  }

  public set info(value: FeedBackItemData) {
    this._info = value;
    this._canGet = false;
    this.refreshView();
  }

  private refreshView() {
    if (this._info) {
      this.title1.text = LangManager.Instance.GetTranslation(
        "CumulativeRechargeItem.title1",
        this._info.point,
      );
      this.title2.text = LangManager.Instance.GetTranslation(
        "CumulativeRechargeItem.title2",
        this._info.price,
      );
      this.descTitle1.text = LangManager.Instance.GetTranslation(
        "CumulativeRechargeItem.descTitle1",
      );
      this.descTitle2.text = LangManager.Instance.GetTranslation(
        "CumulativeRechargeItem.descTitle2",
      );
      this.confirmBtn.title = LangManager.Instance.GetTranslation(
        "map.campaign.view.fall.BattleFallGoodsView.recive",
      );
      if (FeedBackManager.Instance.data.userPoint < this._info.point) {
        this.confirmBtn.enabled = false;
      } else {
        this.confirmBtn.enabled = true;
        this._canGet = true;
      }
      if (this._info.state) {
        //已领取
        this.confirmBtn.title = LangManager.Instance.GetTranslation(
          "dayGuide.view.FetchItem.alreadyGet",
        );
        this.confirmBtn.enabled = false;
        this._canGet = false;
      }
    } else {
      this.title1.text = "";
      this.title2.text = "";
      this.descTitle1.text = "";
      this.descTitle2.text = "";
    }
  }

  dispose() {
    this.removeEvent();
    super.dispose();
  }
}
