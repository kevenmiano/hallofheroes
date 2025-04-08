
import { ResultCallback, SDKState } from "../SDKConfig";
import BaseAd from "../base/BaseAd";
import Logger from "../../logger/Logger";
/**
 * https://minigame.vivo.com.cn/documents/#/api/da/interstitial-da
 * 插屏广告实例不能复用, 每次需要重新加载时要重新create
 */
export default class VivoInsertAd extends BaseAd {
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
        this.adUnitID = id;
        Logger.log(' show insert ad ')
        // if (!this.Instance) {
        this.Instance = qg.createInsertAd({
            posId: id
        });
        this.Instance.onLoad(this.onLoad.bind(this))
        this.Instance.onError(this.onError.bind(this))
        this.Instance.onError(err => {
            Logger.log("插屏广告加载失败", err);
        });

        this.Instance.show().then(() => {
            Logger.log('插屏广告展示完成');
            this.state = SDKState.open;
        }).catch((err) => {
            this.state = SDKState.close;
            Logger.log('插屏广告展示失败', JSON.stringify(err));
        })
        // }
    }
    
    open(ad: string, func: ResultCallback) {
        Logger.log('BaseInterstitialAd showAd this.state ', this.state)
        // if (this.state == AdState.loading) {
        //     return;
        // }

        this.state = SDKState.loading;
        this.create(ad)
        // this.load()
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