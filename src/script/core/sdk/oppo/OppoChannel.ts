import BaseChannel from "../base/BaseChannel";
import { ResultCallback, ResultState } from "../SDKConfig";
import OppoRewardAd from "./OppoRewardAd";
import OppoBannerAd from "./OppoBannerAd";
import OppoInsertAd from "./OppoInsertAd";
import OppoNativeAd from "./OppoNativeAd";
import OppoSubPackage from "./OppoSubPackage";
import OppoScreenshot from "./OppoScreenshot";
import Logger from "../../logger/Logger";

export default class OppoChannel extends BaseChannel {
  constructor(id: number) {
    super(id);
    Logger.log("OppoChannel  constructor ");
    qg.onShow(() => {
      Logger.log("OppoChannel  onShow ");
    });

    qg.onHide(() => {
      Logger.log("OppoChannel  onHide ");
    });

    // this.bannerAd = new WXBanner()
    if (qg.createRewardedVideoAd) {
      this.rewardAd = new OppoRewardAd(this);
    }
    if (qg.createBannerAd) {
      this.bannerAd = new OppoBannerAd(this);
    }

    if (qg.createInsertAd) {
      this.insertAd = new OppoInsertAd(this);
    }
    if (qg.createNativeAd) {
      this.nativeAd = new OppoNativeAd(this);
    }
    Logger.log("OppoChannel  constructor  222222");
    this.subPackage = new OppoSubPackage(this);

    this.screenshot = new OppoScreenshot(this);
  }

  showToast(title: string) {
    qg.showToast({
      title: title,
      icon: "",
      image: "",
      duration: 0,
      mask: false,
      success: function (): void {
        throw new Error("Function not implemented.");
      },
      fail: function (): void {
        throw new Error("Function not implemented.");
      },
      complete: function (): void {
        throw new Error("Function not implemented.");
      },
    });
  }

  vibrateShort() {
    qg.vibrateShort({
      success: function (res) {},
      fail: function (res) {},
      complete: function (res) {},
    });
  }

  canInstallShortcut(func: ResultCallback) {
    qg.hasShortcutInstalled({
      success: function (res) {
        // 判断图标未存在时, 创建图标
        if (res == false) {
          func(ResultState.YES);
        } else {
          func(ResultState.NO);
        }
      },
      fail: function (err) {
        func(ResultState.NO);
      },
      complete: function () {
        // func(false)
      },
    });
  }

  installShortcut(result: ResultCallback) {
    qg.installShortcut({
      success: function (param) {
        // 执行用户创建图标奖励
        Logger.log(" 安装成功 ", param);
        result(ResultState.YES);
      },
      fail: function (err) {
        Logger.log(" 安装失败 ", err);
        result(ResultState.NO);
      },
      complete: function () {
        // result(false)
      },
    });
  }

  setLoadingProgress(progress: number) {
    qg.setLoadingProgress({
      progress: progress,
    });
  }

  loadingComplete() {
    qg.loadingComplete({
      complete: function (res) {},
    });
  }

  navigateToMiniGame(appID: string) {
    qg.navigateToMiniGame({
      pkgName: appID,
      success: function () {},
      fail: function (res) {
        // Logger.log(JSON.stringify(res))
      },
    });
  }

  previewImage(_tempFilePath: string) {
    qg.previewImage({
      urls: [_tempFilePath],
      success() {
        // Logger.log("预览成功");
      },
      current: "",
      fail: function (): void {
        throw new Error("Function not implemented.");
      },
      complete: function (): void {
        throw new Error("Function not implemented.");
      },
    });
  }
}
