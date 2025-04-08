
import Logger from "../../logger/Logger";
import BaseAd from "../base/BaseAd";
import { SDKState } from "../SDKConfig";

export default class OppoBannerAd extends BaseAd {


    open(adID) {
        //逻辑要求开
        this.destroy()
        this.create(adID)
        this.show()

    }
    onError(err) {
        this.channel.showToast('banner onError' + err)
        this.setState(SDKState.loadFail)
    }
    onLoad() {
        this.setState(SDKState.loadSucess)
        this.channel.showToast('banner onLoad')
    }


    close() {
        if (!this.Instance) {
            return
        }
        this.hide()
    }

    onResize(data) {
        Logger.log('banner onResize', data)
    }

    protected create(id) {
        this.adUnitID = id;
        let winSize = qg.getSystemInfoSync();
        this.Instance = qg.createBannerAd({
            adUnitId: this.adUnitID,
            style: {}
        })
        this.Instance.onLoad(this.onLoad.bind(this))
        this.Instance.onError(this.onError.bind(this))
        this.Instance.onResize(this.onResize.bind(this))
    }



    protected show() {
        this.state = SDKState.open
        if (this.Instance)
            this.Instance.show();
        Logger.log(' banner show ')
    }

    protected hide() {
        Logger.log(' banner hide ')
        this.state = SDKState.close;
        if (this.Instance)
            this.Instance.hide();
    }

    protected destroy() {
        if (this.Instance) {
            this.Instance.offLoad(this.onLoad.bind(this))
            this.Instance.offError(this.onError.bind(this))
            this.Instance.offResize(this.onResize.bind(this))
            this.Instance.destroy()
            this.Instance = null;
        }
    }
}