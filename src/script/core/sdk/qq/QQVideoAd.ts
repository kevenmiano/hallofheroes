import Logger from "../../logger/Logger";
import BaseAd from "../base/BaseAd";
import { SDKState, ResultCallback, ResultState, USE_SHARE } from "../SDKConfig";

export default class QQVideoAd extends BaseAd {
  protected Instance: qq.RewardedVideoAd;
  protected loadCount: number = 0;
  protected callback: ResultCallback;
  onError(err) {
    Logger.log("QQVideoAd error ", err);
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

  onLoad() {
    Logger.log("视频加载成功 ", this.loadCount);
    if (this.loadCount == 0) {
      this.Instance.show();
      this.setState(SDKState.loadSucess);
    }
    this.loadCount++;
    // sel
  }

  onClose(res) {
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
        // ToastController.Instance().intoLayer('ui.not_finish');
      }
    }
  }
  create(id: string) {
    this.loadCount = 0;
    this.adUnitID = id;
    Logger.log(" 不支持多例");
    if (this.Instance == null) {
      this.Instance = qq.createRewardedVideoAd({ adUnitId: id });
      this.Instance.onLoad(this.onLoad.bind(this));
      this.Instance.onError(this.onError.bind(this));
      this.Instance.onClose(this.onClose.bind(this));
    } else {
      this.Instance.load();
    }
  }

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
      this.show();
    }
  }

  protected show() {
    if (!this.Instance) {
      this.callback(ResultState.NO);
      return;
    }
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
            this.Instance.show();
            this.setState(SDKState.open);
          })
          .catch((err) => {
            Logger.log(" 激励视频重试失败 err ", err);
            this.setState(SDKState.loadFail);
            // callback(false)
            this.channel.showShare(0, this.callback);
          });
      });
  }
}
