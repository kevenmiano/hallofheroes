import Resolution from "../../../core/comps/Resolution";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import Utils from "../../../core/utils/Utils";
import { PathManager } from "../../manager/PathManager";

/**
 * 适龄提示Wnd
 */
export default class StatutoryAgeWnd extends BaseWindow {


    public OnInitWind() {
        super.OnInitWind();
        this.setCenter();
        if (Resolution.isWebVertical() || Utils.isQQHall()) {
            this.contentPane.setPivot(0.5, 0.5, true);
        } else {
            this.contentPane.setPivot(0.5, 0.5);
        }
        let logActive = this.getController('LogoActive');
        logActive.selectedIndex = !PathManager.info.isLogoActive ? 1 : 0;
    }
}