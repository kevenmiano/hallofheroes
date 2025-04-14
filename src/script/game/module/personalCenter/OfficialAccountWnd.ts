import Logger from "../../../core/logger/Logger";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import Utils from "../../../core/utils/Utils";
import { PathManager } from "../../manager/PathManager";

/**
 * 公众号
 */

export default class OfficialAccountWnd extends BaseWindow {
  private QRCode: fgui.GLoader;

  public OnInitWind(): void {
    super.OnInitWind();
    this.setCenter();
    this.QRCode.url = PathManager.qrcodePath;
  }
}
