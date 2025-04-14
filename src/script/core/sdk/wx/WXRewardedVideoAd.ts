import Logger from "../../logger/Logger";
import BaseAd from "../base/BaseAd";
import {
  ResultCallback,
  SDKState,
  ResultState,
  compareVersion,
  USE_SHARE,
} from "../SDKConfig";
/**
 * https://developers.weixin.qq.com/minigame/dev/api/ad/wx.createRewardedVideoAd.html
 * 调用该方法创建的激励视频广告是一个单例
 * 默认是隐藏的, 需要调用 RewardedVideoAd.show() 将其显示。
 * 每次创建自动加载
 */
export default class WXRewardedVideoAd extends BaseAd {
  protected Instance: wx.RewardedVideoAd;
  //第几次load, 第一次默认load
  protected loadCount: number = 0;

  open(adID: string, callback: ResultCallback) {
    Logger.log(" showReward adID ", adID);
    if (this.state == SDKState.loading) {
      return;
    }
    this.callback = callback;
    this.setState(SDKState.loading);
    if (this.adUnitID != adID) {
      this.create(adID);
    } else {
      //由于关闭后微信会自动加载, 所以这里不需要手动load。
      this.show();
    }
  }

  protected onError(err) {
    Logger.log("WXVideoAd error ", err);
    // ToastController.Instance().show('视频加载失败, 无法获得奖励')
    this.setState(SDKState.loadFail);
    if (USE_SHARE && this.channel.hasShare()) {
      this.channel.showShare(0, this.callback);
    } else {
      if (this.callback) {
        this.callback(ResultState.NO);
        // ToastController.Instance().intoLayer('ui.not_finish');
      }
    }
  }

  protected onLoad() {
    Logger.log("视频加载成功 ", this.loadCount);
    if (this.loadCount == 0) {
      this.Instance.show();
      this.setState(SDKState.loadSucess);
    }
    this.loadCount++;
    // sel
  }

  protected onClose(res) {
    this.setState(SDKState.close);
    if ((res && res.isEnded) || res === undefined) {
      Logger.log("视频结束关闭 ");
      // 正常播放结束, 可以下发游戏奖励
      if (this.callback) {
        this.callback(ResultState.YES);
      }
    } else {
      // 播放中途退出, 不下发游戏奖励
      Logger.log("视频中途关闭 ");
      if (this.callback) {
        this.callback(ResultState.NO);
      }
    }
  }

  protected destroy() {
    if (this.Instance) {
      // Logger.log('清理开始 ')
      this.Instance.offLoad(this.onLoad.bind(this));
      this.Instance.offError(this.onError.bind(this));
      this.Instance.offClose(this.onClose.bind(this));

      this.Instance.destroy();
      this.instanceMap[this.adUnitID] = null;
      this.Instance = null;
      // this.Instance = null;
    }
  }
  protected create(adID: string) {
    this.adUnitID = adID;
    this.loadCount = 0;
    let sdkVersion = wx.getSystemInfoSync().SDKVersion;
    if (!this.instanceMap[adID]) {
      if (compareVersion(sdkVersion, "2.8.0")) {
        this.Instance = wx.createRewardedVideoAd({
          adUnitId: adID,
          multiton: true,
        });
      } else {
        Logger.log(" 不支持多例");
        this.Instance = wx.createRewardedVideoAd({ adUnitId: adID });
      }

      this.Instance.onLoad(this.onLoad.bind(this));
      this.Instance.onError(this.onError.bind(this));
      this.Instance.onClose(this.onClose.bind(this));
      this.instanceMap[adID] = this.Instance;
    } else {
      //微信会在第一次创建的时候默认load一次。
      this.Instance.load();
    }
  }
  protected show() {
    this.Instance.show()
      .then(() => {
        this.setState(SDKState.open);
        Logger.log(" 激励视频展示成功 ");
      })
      .catch(() => {
        // 失败重试
        Logger.log(" show  激励视频 播放失败重试");
        this.Instance.load()
          .then(() => {
            this.setState(SDKState.open);
            this.Instance.show();
          })
          .catch((err) => {
            Logger.log(" 激励视频重试失败 err ", err);
            this.setState(SDKState.loadFail);
          });
      });
  }
}
