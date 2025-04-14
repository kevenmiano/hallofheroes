import BaseWindow from "../../../core/ui/Base/BaseWindow";
import StringHelper from "../../../core/utils/StringHelper";
import { NotificationEvent } from "../../constant/event/NotificationEvent";
import { EmWindow } from "../../constant/UIDefine";
import { NotificationManager } from "../../manager/NotificationManager";
import OutyardManager from "../../manager/OutyardManager";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import OutyardModel from "./OutyardModel";
import OutyardOpenTimeItem from "./view/OutyardOpenTimeItem";
import StackHeadStateMsg = com.road.yishi.proto.stackhead.StackHeadStateMsg;
import LangManager from "../../../core/lang/LangManager";
import UIManager from "../../../core/ui/UIManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import Utils from "../../../core/utils/Utils";
/**
 * 开放时间界面
 */
export default class OutyardOpenWnd extends BaseWindow {
  public timeList: fgui.GList;
  public leftTimeTxt: fgui.GRichTextField;
  public enterBtn: fgui.GButton;
  public lookRewardBtn: fgui.GButton;
  private _listData: Array<any> = [];
  public frame: fgui.GLabel;
  public OnInitWind() {
    this.setCenter();
    this.addEvent();
    this.initView();
  }

  private initView() {
    this.__refreshOpeningHandler();
    this.timerHandler();
  }

  OnShowWind() {
    super.OnShowWind();
    OutyardManager.Instance.OperateOutyard(OutyardManager.OPEN_FRAME);
  }

  private addEvent() {
    NotificationManager.Instance.addEventListener(
      NotificationEvent.OUTYARD_STATE_INFO,
      this.__refreshOpeningHandler,
      this,
    );
    this.timeList.itemRenderer = Laya.Handler.create(
      this,
      this.renderTimeListItem,
      null,
      false,
    );
    NotificationManager.Instance.addEventListener(
      NotificationEvent.OUTYARD_FULL_INFO,
      this.refreshState,
      this,
    );
    NotificationManager.Instance.addEventListener(
      NotificationEvent.OUTYARD_UPDATE_INFO,
      this.refreshState,
      this,
    );
    Laya.timer.loop(60000, this, this.timerHandler);
    this.enterBtn.onClick(this, this.enterBtnHandler);
    this.lookRewardBtn.onClick(this, this.lookRewardBtnHandler);
    this.frame.getChild("helpBtn").onClick(this, this.helpBtnHandler);
  }

  private removeEvent() {
    NotificationManager.Instance.removeEventListener(
      NotificationEvent.OUTYARD_STATE_INFO,
      this.__refreshOpeningHandler,
      this,
    );
    this.timeList.itemRenderer.recover();
    Utils.clearGListHandle(this.timeList);
    NotificationManager.Instance.removeEventListener(
      NotificationEvent.OUTYARD_FULL_INFO,
      this.refreshState,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      NotificationEvent.OUTYARD_UPDATE_INFO,
      this.refreshState,
      this,
    );
    Laya.timer.clearAll(this);
    this.enterBtn.offClick(this, this.enterBtnHandler);
    this.lookRewardBtn.offClick(this, this.lookRewardBtnHandler);
    this.frame.getChild("helpBtn").offClick(this, this.helpBtnHandler);
  }

  private helpBtnHandler() {
    let title: string = LangManager.Instance.GetTranslation("public.help");
    let content: string = LangManager.Instance.GetTranslation(
      "OutyardFigureWnd.helpContent",
    );
    UIManager.Instance.ShowWind(EmWindow.Help, {
      title: title,
      content: content,
    });
  }

  private renderTimeListItem(index: number, item: OutyardOpenTimeItem) {
    if (!item || item.isDisposed) return;
    item.index = index + 1;
    item.info = this._listData[index];
  }

  private enterBtnHandler() {
    if (PlayerManager.Instance.currentPlayerModel.playerInfo.consortiaID == 0) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "friends.im.IMFrame.consortia.TipTxt",
        ),
      );
      return;
    }
    let stateMsg: StackHeadStateMsg = OutyardManager.Instance.stateMsg;
    if (
      stateMsg.state == OutyardModel.OVER ||
      stateMsg.state == OutyardModel.CLEAR
    ) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "OutyardOpenWnd.enterBtnHandler.tips",
        ),
      );
      return;
    }
    FrameCtrlManager.Instance.exit(EmWindow.OutyardOpenWnd);
    FrameCtrlManager.Instance.open(EmWindow.OutyardFigureWnd);
  }

  private lookRewardBtnHandler() {
    FrameCtrlManager.Instance.open(EmWindow.OutyardRewardWnd);
  }

  private __refreshOpeningHandler() {
    var msg: StackHeadStateMsg = OutyardManager.Instance.stateMsg;
    if (!msg) {
      this._listData = [];
      this.timeList.numItems = 0;
      return;
    }
    this._listData = msg.openTime;
    this.timeList.numItems = this._listData.length;
  }

  private timerHandler() {
    OutyardManager.Instance.OperateOutyard(OutyardManager.HEART);
    this.refreshState();
  }

  private refreshState() {
    let str: string = this.outYardModel.getNextOpenStr();
    if (StringHelper.isNullOrEmpty(str)) {
      this.leftTimeTxt.visible = false;
    } else {
      this.leftTimeTxt.text = str;
      this.leftTimeTxt.visible = true;
    }
    let stateMsg: StackHeadStateMsg = OutyardManager.Instance.stateMsg;
    if (
      stateMsg.state == OutyardModel.FIGHTING ||
      stateMsg.state == OutyardModel.READY ||
      stateMsg.state == OutyardModel.CLEAR ||
      stateMsg.state == OutyardModel.OVER
    ) {
      this.enterBtn.enabled = true;
    } else {
      this.enterBtn.enabled = false;
    }
  }

  private get outYardModel(): OutyardModel {
    return OutyardManager.Instance.model;
  }

  public OnHideWind() {
    super.OnHideWind();
    this.removeEvent();
  }

  dispose() {
    super.dispose();
  }
}
