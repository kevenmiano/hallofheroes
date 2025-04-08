import { EmWindow } from "../../game/constant/UIDefine";
import { ProtoCheckInfo } from "../../game/manager/ProtoManager";
import { FrameCtrlManager } from "../../game/mvc/FrameCtrlManager";
import LangManager from "../lang/LangManager";
import { SocketManager } from "../net/SocketManager";
import SDKManager from "../sdk/SDKManager";

export default class NetDelayUtils {
    info: ProtoCheckInfo
    commonTip: string = ""
    private static ins: NetDelayUtils;
    static get Instance(): NetDelayUtils {
        if (!NetDelayUtils.ins) {
            NetDelayUtils.ins = new NetDelayUtils();
        }
        return NetDelayUtils.ins;
    }


    show(info: ProtoCheckInfo) {
        this.info = info
        // socket没连上直接弹提示
        if (!SocketManager.Instance.isConnected()) {
            this.hide(true);
            return;
        }

        Laya.timer.once(this.info.delayShowTime, this, this.showLoading, null, false);
    }

    hide(showAlert: boolean = false) {
        if (showAlert) {
            this.showAlert();
        }
        Laya.timer.clearAll(this);
        this.hideLoading();
    }

    showLoading() {
        if (!this.commonTip) {
            this.commonTip = LangManager.Instance.GetTranslation("network.tip")
        }
        FrameCtrlManager.Instance.open(EmWindow.Waiting, { text: (this.info.loadingTip ? this.info.loadingTip : this.commonTip) });
        Laya.timer.once(this.info.loadingTime, this, this.hide, [true]);
    }

    hideLoading() {
        FrameCtrlManager.Instance.exit(EmWindow.Waiting);
    }

    showAlert() {
        if (SocketManager.Instance.isConnected()) return;

        // if (SocketManager.Instance.isReconnecting) return  // 该值不准确
        if (SocketManager.Instance.reConnetAlert) return
 
        SDKManager.Instance.getChannel().showNetworkAlert();
    }
}