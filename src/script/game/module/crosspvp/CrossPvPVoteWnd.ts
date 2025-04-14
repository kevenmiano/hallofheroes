import LangManager from "../../../core/lang/LangManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import { PlayerInfo } from "../../datas/playerinfo/PlayerInfo";
import { CampaignSocketOutManager } from "../../manager/CampaignSocketOutManager";
import { PlayerManager } from "../../manager/PlayerManager";
/**副本中弹出跨服踢人投票界面 */
export default class CrossPvPVoteWnd extends BaseWindow {
  public AlertTxt: fgui.GTextField;
  public leftTimeTxt: fgui.GRichTextField;
  public Btn_confirm: fgui.GButton;
  public Btn_cancel: fgui.GButton;
  private totalTimeCount: number = 50; //倒计时总秒数
  public OnInitWind() {
    super.OnInitWind();
    this.setCenter();
    let frameData = this.params.frameData;
    if (frameData && frameData.descStr) {
      this.AlertTxt.text = frameData.descStr;
    }
    this.addEvent();
    this.initView();
  }

  public OnShowWind() {
    super.OnShowWind();
  }

  private initView() {
    this.leftTimeTxt.text = LangManager.Instance.GetTranslation(
      "CrossPvPSuccessWnd.leftTimeTxt",
      this.totalTimeCount,
    );
    Laya.timer.loop(1000, this, this.updateLeftTimeTxt);
  }

  private addEvent() {
    this.Btn_confirm.onClick(this, this.confirmBtnHandler);
    this.Btn_cancel.onClick(this, this.cancelBtnHandler);
  }

  private offEvent() {
    this.Btn_confirm.offClick(this, this.confirmBtnHandler);
    this.Btn_cancel.offClick(this, this.cancelBtnHandler);
  }

  updateLeftTimeTxt() {
    this.totalTimeCount--;
    this.leftTimeTxt.text = LangManager.Instance.GetTranslation(
      "CrossPvPSuccessWnd.leftTimeTxt",
      this.totalTimeCount,
    );
    if (this.totalTimeCount <= 0) {
      this.cancelBtnHandler();
    }
  }

  /**同意踢人 */
  private confirmBtnHandler() {
    Laya.timer.clear(this, this.updateLeftTimeTxt);
    CampaignSocketOutManager.Instance.sendCrossCmapignKillOutSelect(
      1,
      this.playInfo.serviceName,
    );
    this.hide();
  }

  /**拒绝踢人 */
  private cancelBtnHandler() {
    Laya.timer.clear(this, this.updateLeftTimeTxt);
    CampaignSocketOutManager.Instance.sendCrossCmapignKillOutSelect(
      0,
      this.playInfo.serviceName,
    );
    this.hide();
  }

  private get playInfo(): PlayerInfo {
    return PlayerManager.Instance.currentPlayerModel.playerInfo;
  }

  public OnHideWind() {
    this.offEvent();
    Laya.timer.clear(this, this.updateLeftTimeTxt);
    CampaignSocketOutManager.Instance.sendCrossCmapignKillOutSelect(
      0,
      this.playInfo.serviceName,
    );
    super.OnHideWind();
  }

  /** 点击蒙版区域 (可重写) */
  protected OnClickModal() {}

  dispose(dispose?: boolean) {
    super.dispose(dispose);
  }
}
