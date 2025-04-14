import ResMgr from "../../../core/res/ResMgr";
import SDKManager from "../../../core/sdk/SDKManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import FaceSlapManager from "../../manager/FaceSlapManager";
import { SharedManager } from "../../manager/SharedManager";
import FUIHelper from "../../utils/FUIHelper";

/**
 * 打脸图
 */

export default class FaceSlappingWnd extends BaseWindow {
  public check1Btn: fgui.GButton;
  private imgLoader: fgui.GLoader;
  private btnCom: fgui.GComponent;

  public OnInitWind(): void {
    super.OnInitWind();
    this.check1Btn.selected = false;
    this.setCenter();
    this.initView();
  }

  public OnShowWind(): void {}

  protected OnClickModal(): void {}

  /** */
  private initView() {
    let faceAtyData = FaceSlapManager.Instance.getAtyData();
    if (faceAtyData) {
      FaceSlapManager.Instance.faceSlapAtyId = faceAtyData.activeId;
      let bgURL = faceAtyData.images[0].url; //背景图
      ResMgr.Instance.loadRes(bgURL, () => {
        this.imgLoader.url = bgURL;
        let count = faceAtyData.images.length;
        for (let index = 1; index < count; index++) {
          let btnData = faceAtyData.images[index];
          let btnElement: fgui.GButton = FUIHelper.createFUIInstance(
            "FaceSlapping",
            "jumpBtn",
          );
          this.btnCom.addChild(btnElement);
          btnElement.icon = btnData.url;
          btnElement.x = btnData.offsetX;
          btnElement.y = btnData.offsetY;
          btnElement.onClick(
            this,
            (linkURL: string) => {
              SDKManager.Instance.getChannel().openURL(linkURL);
            },
            [btnData.jumpUrl],
          );
        }
      });
      FaceSlapManager.Instance.setShowAtyId(faceAtyData.activeId, true);
    }
  }

  private onSaveState() {
    if (this.check1Btn.selected)
      SharedManager.Instance.saveFaceSlaping(
        FaceSlapManager.Instance.faceSlapAtyId,
      );
  }

  public OnHideWind(): void {
    super.OnHideWind();
    this.onSaveState();
  }

  /**检查下一个 */
  private checkNext() {
    Laya.timer.callLater(this, () => {
      Laya.timer.clearAll(this);
      FaceSlapManager.Instance.showNext();
    });
  }

  dispose(dispose?: boolean): void {
    this.onSaveState();
    super.dispose();
    this.checkNext();
  }
}
