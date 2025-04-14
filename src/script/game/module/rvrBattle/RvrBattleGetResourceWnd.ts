import BaseWindow from "../../../core/ui/Base/BaseWindow";
import { MapSocketOuterManager } from "../../manager/MapSocketOuterManager";
import LangManager from "../../../core/lang/LangManager";
/**
 * 战场提交资源
 */
export default class RvrBattleGetResourceWnd extends BaseWindow {
  public frame: fgui.GLabel;
  public descTxt: fgui.GTextField;
  public submitBtn: fgui.GButton;
  private mapId: number = 0;
  private nodeId: number = 0;

  constructor() {
    super();
  }

  public OnInitWind() {
    super.OnInitWind();
    this.setCenter();
    if (this.frameData) {
      if (this.frameData.mapId) {
        this.mapId = this.frameData.mapId;
      }
      if (this.frameData.nodeId) {
        this.nodeId = this.frameData.nodeId;
      }
    }
    this.descTxt.text = LangManager.Instance.GetTranslation(
      "map.campaign.view.frame.SubmitResourcesFrame.textText",
    );
    this.initEvent();
  }

  OnShowWind() {
    super.OnShowWind();
  }

  /** 点击蒙版区域 (可重写) */
  protected OnClickModal() {}

  private initEvent() {
    this.submitBtn.onClick(this, this.submitBtnHandler);
  }

  private removeEvent() {
    this.submitBtn.offClick(this, this.submitBtnHandler);
  }

  submitBtnHandler() {
    MapSocketOuterManager.sendFrameCallBack(this.mapId, this.nodeId, true);
    this.hide();
  }

  public OnHideWind() {
    this.removeEvent();
    super.OnHideWind();
  }

  dispose(dispose?: boolean) {
    super.dispose(dispose);
  }
}
