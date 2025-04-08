
import { ResultCallback, SDKState, ResultState } from "../SDKConfig";
import BaseAd from "../base/BaseAd";
import Logger from "../../logger/Logger";

// import SDKManager from "../SDKManager";
// import ToastController from "../../logic/toast/ToastController";
//https://open.oppomobile.com/wiki/doc#id=10537
export default class OppoRewardAd extends BaseAd {
    protected callback: ResultCallback;
    protected loadCount: number = 0;




    onError(err) {
        Logger.log('QQVideoAd error ', err)

        this.setState(SDKState.loadFail)
        if (this.callback) {
            // SDKManager.getChannel().showShare(this.rewardCallback)
            this.callback(ResultState.NO)
        }
    }

    protected show() {
        this.Instance.show();
    }

    //oppo渠道需要自己主动加载视频
    onLoad() {
        Logger.log('视频加载成功 ', this.loadCount)
        // if (this.loadCount == 0) {
        this.setState(SDKState.loadSucess)
        this.show()

        // }
        this.loadCount++;
        // sel
    }

    onClose(res) {
        this.setState(SDKState.close)
        if (res && res.isEnded || res === undefined) {
            Logger.log('视频结束关闭 ')
            // 正常播放结束, 可以下发游戏奖励
            if (this.callback) {
                this.callback(ResultState.YES)
            }

        } else {
            // 播放中途退出, 不下发游戏奖励
            Logger.log('视频中途关闭 ')
            if (this.callback) {
                this.callback(ResultState.NO);
                // ToastController.Instance().intoLayer('ui.not_finish');
            }

        }
    }

    create(id: string) {
        this.loadCount = 0;
        this.adUnitID = id;
        Logger.log(' 不支持多例')
        if (this.Instance == null) {
            this.Instance = qg.createRewardedVideoAd({ adUnitId: id })
            this.Instance.onLoad(this.onLoad.bind(this))
            this.Instance.onError(this.onError.bind(this))
            this.Instance.onClose(this.onClose.bind(this))
            Logger.log(' 创建成功')
        } else {
            // this.Instance.load();
            Logger.log(' 主动加载')
        }

        this.Instance.load();

    }
    open(adID: string, callback: ResultCallback) {
        // if (this.state == AdState.loading) {
        //     return;
        // }
        this.callback = callback;
        this.setState(SDKState.loading)
        // if (this.adUnitID != adID) {
        //     this.adUnitID = adID
        this.create(adID)
        // } else {
        //     this.show()
        // }


    }
}