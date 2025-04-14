import Logger from "../../logger/Logger";
import BaseAd from "../base/BaseAd";
import { SDKState } from "../SDKConfig";

export default class QQInterstitialAd extends BaseAd {
  // private interstitialAd = null;

  open(id) {
    Logger.log("BaseInterstitialAd showAd this.state ", this.state);
    // if (this.state == AdState.loading) {
    //     return;
    // }

    this.state = SDKState.loading;
    this.create(id);
    this.load();
  }

  protected onLoad() {
    Logger.log(" 插屏广告加载成功");
    this.setState(SDKState.loadSucess);
    this.show();
  }

  protected onError(err) {
    Logger.log(" 插屏广告加载失败 ", err);
    this.setState(SDKState.loadFail);
  }
  protected onClose() {
    Logger.log(" 插屏广告关闭");
  }

  protected load() {
    if (this.Instance) {
      this.Instance.load();
    }
  }

  protected show() {
    if (this.Instance) {
      this.Instance.show();
    }
  }

  protected create(id) {
    // 创建插屏广告实例, 提前初始化
    this.adUnitID = id;
    if (!this.Instance) {
      this.Instance = qq.createInterstitialAd({
        adUnitId: id,
      });
      this.Instance.onLoad(this.onLoad.bind(this));
      this.Instance.onError(this.onError.bind(this));
      this.Instance.onClose(this.onClose.bind(this));
    }
  }
}
