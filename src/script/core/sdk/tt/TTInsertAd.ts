// @ts-nocheck
import Logger from "../../logger/Logger";
import BaseAd from "../base/BaseAd";
import { SDKState } from "../SDKConfig";

/**
 * auth 游子陈
 * https://microapp.bytedance.com/dev/cn/mini-game/develop/open-capacity/ads/tt.createinterstitialad
 */
export default class TTInsertAd extends BaseAd {

  open(adID: string) {
    Logger.log('BaseInterstitialAd showAd this.state ', this.state)
    // if (this.state == AdState.loading) {
    //     return;
    // }

    this.state = SDKState.loading;
    this.create(adID)
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

  protected onClose() {
    Logger.log(' 插屏广告关闭')
  }

  protected load() {
    // if (this.Instance) {
    //     Logger.log(' Insert load ')
    //     this.Instance.load()
    // }
  }

  protected show() {
    // if (this.Instance) {
    //     this.Instance.show()
    // }
  }

  destroy() {
    // if (this.Instance != null) {
    //     this.Instance.offLoad(this.onLoad.bind(this))
    //     this.Instance.offError(this.onError.bind(this))
    //     this.Instance.offClose(this.onClose.bind(this))
    //     this.Instance.destroy();
    //     this.Instance = null;
    // }
  }

  protected create(id) {
    this.adUnitID = id;
    // 创建插屏广告实例, 提前初始化

    const isToutiaio = tt.getSystemInfoSync().appName === "Toutiao";
    // 插屏广告仅今日头条安卓客户端支持
    Logger.log(" isToutiaio ", isToutiaio)
    if (isToutiaio) {
      const interstitialAd = tt.createInterstitialAd({
        adUnitId: this.adUnitID
      });
      interstitialAd
        .load()
        .then(() => {
          Logger.log("interstitialAd  show ")
          interstitialAd.show();
        })
        .catch(err => {
          Logger.log(err);
        });
    }
  }

}
