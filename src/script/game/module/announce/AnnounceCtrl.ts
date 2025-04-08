// @ts-nocheck
import ResMgr from "../../../core/res/ResMgr";
import Singleton from "../../../core/singleton/Singleton";
import ComponentSetting from "../../utils/ComponentSetting";

/**
 * 公告请求
 */
export class AnnounceCtrl extends Singleton {

    private static ins: AnnounceCtrl;

    static get Instance(): AnnounceCtrl {
        if (!this.ins) {
            this.ins = new AnnounceCtrl();
        }
        return this.ins;
    }


    /**请求更新公告 */
    reqVersionData() {
        return ResMgr.Instance.loadResAsync(ComponentSetting.VERTION_PATH + "?v=" + new Date().getTime());
    }
}