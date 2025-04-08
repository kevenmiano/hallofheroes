import LangManager from "../../core/lang/LangManager";
import Logger from "../../core/logger/Logger";
import SDKManager from "../../core/sdk/SDKManager";
import Utils from "../../core/utils/Utils";
import SimpleAlertHelper, { AlertBtnType } from "../component/SimpleAlertHelper";
import { SharedManager } from "../manager/SharedManager";
import ComponentSetting from "../utils/ComponentSetting";

export default class VersionUtils {

    /**比较版本 */
    public static async checkVersion() {
        if (!Utils.isAndroid()) return;
        let downLoadVersions = ComponentSetting.VERSION_DOWNS;
        let nowVersion = Utils.AndroidVersion;
        let isInlist = false;
        if (downLoadVersions.indexOf(nowVersion) != -1) {
            isInlist = true;
        }
        if (!isInlist) return false;
        let needUpdate: boolean = false;
        let downLoadAppClick = SharedManager.Instance.downLoadAppClick;
        let preDate: Date = SharedManager.Instance.downLoadAppDate;
        let now: Date = new Date();
        let preDateValue = preDate.getDate();
        let nowDateValue = now.getDate();
        Logger.warn("downLoadAppClick:", downLoadAppClick, "preDate:", preDateValue, "nowDateValue:", nowDateValue);
        if (!downLoadAppClick || now.getDate() != preDate.getDate()) {
            needUpdate = true;
        }
        if (needUpdate) {
            let confirm: string = LangManager.Instance.GetTranslation("public.confirm");
            let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
            let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
            let content: string = LangManager.Instance.GetTranslation("app.newversion");
            SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, [], prompt, content, confirm, cancel, (b: boolean) => {
                let url: string = ComponentSetting.APP_DOWN_URL;
                SharedManager.Instance.downLoadAppClick = true;
                SharedManager.Instance.downLoadAppDate = new Date();
                if (b) {
                    if (!Utils.isApp()) {
                        window.open(url, '_blank');
                    } else {
                        SDKManager.Instance.getChannel().openURL(url);
                    }
                }
            }, AlertBtnType.OC);
            return true
        }
        return false
    }

}
