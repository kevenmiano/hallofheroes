import LangManager from "../../../core/lang/LangManager";
import Logger from "../../../core/logger/Logger";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import { RoomSocketOuterManager } from "../../manager/RoomSocketOuterManager";
/**跨服多人本在房间中弹出同意或者拒绝撮合界面 */
export default class CrossPvPSuccessWnd extends BaseWindow {
  public img1: fgui.GImage;
  public img2: fgui.GImage;
  public BossNameDescTxt: fgui.GTextField;
  public campaignNameTxt: fgui.GTextField;
  public cancelBtn: fgui.GButton;
  public confirmBtn: fgui.GButton;
  public leftTimeTxt: fgui.GTextField;
  private _leftCount: number = 0;
  private _totalCount: number = 0;
  private _campaignUid: string = "";
  private _roomId: string = "";
  private _timeCount: number = 50;

  public OnInitWind() {
    super.OnInitWind();
    this.setCenter();
    this.addEvent();
    this.initView();
  }

  public OnShowWind() {
    super.OnShowWind();
  }

  private initView() {
    let frameData = this.params.frameData;
    if (frameData) {
      this._leftCount = frameData.leftBoss;
      this._totalCount = frameData.totalBoss;
      this.BossNameDescTxt.text = LangManager.Instance.GetTranslation(
        "CrossPvPSuccessWnd.BossNameDescTxt",
        this._leftCount,
        this._totalCount,
      );
      this.campaignNameTxt.text = frameData.campaignName;
      this._campaignUid = frameData.campaignUid;
      this._roomId = frameData.roomId;
      this.leftTimeTxt.text = LangManager.Instance.GetTranslation(
        "CrossPvPSuccessWnd.leftTimeTxt",
        this._timeCount,
      );
      Laya.timer.loop(1000, this, this.updateLeftTimeTxt);
    }
  }

  private updateLeftTimeTxt() {
    this._timeCount--;
    this.leftTimeTxt.text = LangManager.Instance.GetTranslation(
      "CrossPvPSuccessWnd.leftTimeTxt",
      this._timeCount,
    );
    if (this._timeCount <= 0) {
      //倒计时结束了玩家还没操作, 相当于拒绝邀请
      this.cancelBtnHandler();
    }
  }

  private addEvent() {
    this.confirmBtn.onClick(this, this.confirmBtnHandler);
    this.cancelBtn.onClick(this, this.cancelBtnHandler);
  }

  private offEvent() {
    this.confirmBtn.offClick(this, this.confirmBtnHandler);
    this.cancelBtn.offClick(this, this.cancelBtnHandler);
  }

  /**同意邀请 */
  private confirmBtnHandler() {
    Laya.timer.clear(this, this.updateLeftTimeTxt);
    RoomSocketOuterManager.sendCrossAlertResult(
      1,
      this._campaignUid,
      this._roomId,
    );
    this.hide();
  }

  /**拒绝邀请 */
  private cancelBtnHandler() {
    Laya.timer.clear(this, this.updateLeftTimeTxt);
    RoomSocketOuterManager.sendCrossAlertResult(
      0,
      this._campaignUid,
      this._roomId,
    );
    this.hide();
  }

  public OnHideWind() {
    this.offEvent();
    Laya.timer.clear(this, this.updateLeftTimeTxt);
    RoomSocketOuterManager.sendCrossAlertResult(
      0,
      this._campaignUid,
      this._roomId,
    );
    super.OnHideWind();
  }

  /** 点击蒙版区域 (可重写) */
  protected OnClickModal() {}

  dispose(dispose?: boolean) {
    super.dispose(dispose);
  }
}
