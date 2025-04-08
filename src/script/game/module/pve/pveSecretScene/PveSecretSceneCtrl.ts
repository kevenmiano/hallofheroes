/*
 * @Author: jeremy.xu
 * @Date: 2024-02-28 12:22:13
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-03-20 09:47:13
 * @Description: 
 */

import { SecretEvent } from "../../../constant/event/NotificationEvent";
import { NotificationManager } from "../../../manager/NotificationManager";
import FrameCtrlBase from "../../../mvc/FrameCtrlBase";
import PveSecretSceneWnd from "./PveSecretSceneWnd";

export default class PveSecretSceneCtrl extends FrameCtrlBase {
    show() {
        super.show();
    }

    hide() {
        super.hide();
    }

    protected addEventListener() {
        super.addEventListener();
        NotificationManager.Instance.on(SecretEvent.SECRET_INFO, this.__secretInfo, this)
        NotificationManager.Instance.on(SecretEvent.UPDATE_TRESURE, this.__updateTresure, this)
        NotificationManager.Instance.on(SecretEvent.GAIN_TRESURE, this.__gainTresure, this)
        NotificationManager.Instance.on(SecretEvent.LOSE_TRESURE, this.__loseTresure, this)
    }
    
    protected delEventListener() {
        super.delEventListener();
        NotificationManager.Instance.off(SecretEvent.SECRET_INFO, this.__secretInfo, this)
        NotificationManager.Instance.off(SecretEvent.UPDATE_TRESURE, this.__updateTresure, this)
        NotificationManager.Instance.off(SecretEvent.GAIN_TRESURE, this.__gainTresure, this)
        NotificationManager.Instance.off(SecretEvent.LOSE_TRESURE, this.__loseTresure, this)
    }
    private __secretInfo() {
        this.viewProxy.updateView()
    }

    private __updateTresure() {
        this.viewProxy.updateTresure()
    }

    private __gainTresure() {
        this.viewProxy.showGainTresureTip()
    }

    private __loseTresure() {
        this.viewProxy.showLoseTresureTip()
    }

    private get viewProxy() {
        return this.view as PveSecretSceneWnd
    }

    dispose() {
        super.dispose();
    }
}