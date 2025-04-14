import Logger from "../../logger/Logger";
import BaseAd from "../base/BaseAd";
import { SDKState } from "../SDKConfig";
export default class QQBanner extends BaseAd {
  protected Instance: qq.BannerAd;

  open(adID) {
    //逻辑要求开
    this.logicState = SDKState.open;

    //如果banner已经已经显示 则返回。
    // if (this.state == AdState.loading) {
    //     return;
    // }
    // this.state = AdState.loading;
    if (this.adUnitID != adID) {
      this.destroy();
      this.create(adID);
    } else {
      this.showCount++;
      if (this.showCount > 3) {
        //展示超过3次 从新加载
        this.showCount = 0;
        this.destroy();
        this.create(adID);
      } else {
        this.show();
      }
    }
  }

  close() {
    this.logicState = SDKState.close;

    // if (this.state == AdState.close) {
    //     return;
    // }

    if (!this.Instance) {
      return;
    }
    this.hide();
  }
  onError(err) {
    Logger.log("banner onError", err);
    this.setState(SDKState.loadFail);
  }

  onLoad() {
    Logger.log("banner onLoad");
    this.setState(SDKState.loadSucess);
    if (this.logicState == SDKState.open) {
      this.show();
    } else {
      this.hide();
    }
  }
  onResize(data) {
    Logger.log("banner onResize", data);
  }

  protected create(adID) {
    let winSize = qq.getSystemInfoSync();
    this.adUnitID = adID;
    // Logger.log(winSize);
    let bannerHeight = 130;
    let bannerWidth = 350;

    this.Instance = qq.createBannerAd({
      adUnitId: this.adUnitID,
      style: {
        left: (winSize.windowWidth - bannerWidth) / 2,
        top: winSize.windowHeight - bannerHeight,
        width: bannerWidth,
      },
    });

    this.Instance.onLoad(this.onLoad.bind(this));
    this.Instance.onError(this.onError.bind(this));
    this.Instance.onResize(this.onResize.bind(this));
  }

  protected show() {
    this.state = SDKState.open;
    if (this.Instance) this.Instance.show();
  }

  protected hide() {
    this.state = SDKState.close;
    if (this.Instance) this.Instance.hide();
  }

  protected destroy() {
    if (this.Instance) {
      this.Instance.offLoad(this.onLoad.bind(this));
      this.Instance.offError(this.onError.bind(this));
      this.Instance.offResize(this.onResize.bind(this));
      this.Instance.destroy();
    }
  }
}
