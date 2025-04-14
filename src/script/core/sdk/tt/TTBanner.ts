import Logger from "../../logger/Logger";
import BaseAd from "../base/BaseAd";
import { SDKState } from "../SDKConfig";
/**
 * https://microapp.bytedance.com/dev/cn/mini-game/develop/open-capacity/ads/tt.createbannerad
 */
export default class TTBanner extends BaseAd {
  // protected Instance: any;
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
  onResize(size) {
    let winSize = tt.getSystemInfoSync();
    Logger.log(size.width, size.height);
    if (size.width != 0 && size.height != 0) {
      this.Instance.style.top = winSize.windowHeight - size.height;
      this.Instance.style.left = (winSize.windowWidth - size.width) / 2;
    }
  }

  protected create(adId: string) {
    this.adUnitID = adId;
    let winSize = tt.getSystemInfoSync();

    // Logger.log(winSize);
    // let bannerHeight = 200;
    let bannerWidth = 200;

    this.Instance = tt.createBannerAd({
      adUnitId: this.adUnitID,
      style: {
        left: (winSize.windowWidth - bannerWidth) / 2,
        top: winSize.windowHeight - (bannerWidth / 16) * 9, // 根据系统约定尺寸计算出广告高度
        width: bannerWidth,
      },
    });
    this.Instance.onLoad(this.onLoad.bind(this));
    this.Instance.onError(this.onError.bind(this));
    this.Instance.onResize(this.onResize.bind(this));
  }

  protected show() {
    if (this.Instance) {
      this.state = SDKState.open;
      this.Instance.show();
    }
  }

  protected hide() {
    if (this.Instance) {
      this.state = SDKState.close;
      this.Instance.hide();
    }
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

  protected destroy() {
    if (this.Instance) {
      this.Instance.offLoad(this.onLoad.bind(this));
      this.Instance.offError(this.onError.bind(this));
      this.Instance.offResize(this.onResize.bind(this));
      this.Instance.destroy();
    }
  }
}
