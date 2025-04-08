



import Logger from "../../logger/Logger";
import BaseAd from "../base/BaseAd";
import { SDKState } from "../SDKConfig";

/**
 * https://open.oppomobile.com/wiki/doc#id=10538
 */
export default class OppoInsertAd extends BaseAd {
    open(adId) {
        Logger.log('BaseInterstitialAd showAd this.state ', this.state)
        // if (this.state == AdState.loading) {
        //     return;
        // }

        this.state = SDKState.loading;
        this.create(adId)
        this.load()
    }

    protected onLoad() {
        Logger.log(' 插屏广告加载成功')
        this.setState(SDKState.loadSucess)
        this.show()
    }

    protected onError(err) {
        Logger.log(' 插屏广告加载失败 ', err)
        this.setState(SDKState.loadFail)
    }
    protected create(id: string) {
        Logger.log(' show insert ad ')
        this.adUnitID = id;
        if (!this.Instance) {
            this.Instance = qg.createInsertAd({
                adUnitId: id
            });
            this.Instance.onLoad(this.onLoad.bind(this))
            this.Instance.onError(this.onError.bind(this))
        }
    }

    protected load() {
        Logger.log(' load ad ')
        this.Instance.load();
    }

    protected show() {
        Logger.log(' show ad ')
        this.Instance.show()
    }
}
