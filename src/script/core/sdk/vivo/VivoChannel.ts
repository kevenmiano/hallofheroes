import BaseChannel from "../base/BaseChannel";
import { ResultCallback, ResultState } from "../SDKConfig";
import VivoRewardAd from "./VivoRewardAd";
import VivoBannerAd from "./VivoBannerAd";
import VivoInsertAd from "./VIvoInsertAd";
import VivoNativeAd from "./VivoNativeAd";
import Logger from "../../logger/Logger";
export default class VivoChannel extends BaseChannel {
  constructor(id: number) {
    super(id);

    qg.onShow(() => {
      Logger.log("VivoChannel  onShow ");
    });

    qg.onHide(() => {
      Logger.log("VivoChannel  onHide ");
    });

    Logger.log("qg ", qg);
    // this.bannerAd = new WXBanner()
    if (qg.createRewardedVideoAd) {
      this.rewardAd = new VivoRewardAd(this);
    }

    if (qg.createBannerAd) {
      this.bannerAd = new VivoBannerAd(this);
    }

    if (qg.createInsertAd) {
      this.insertAd = new VivoInsertAd(this);
    }

    if (qg.createNativeAd) {
      this.nativeAd = new VivoNativeAd(this);
    }
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
      success: function () {},
      fail: function () {},
      complete: function () {},
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

  previewImage(_tempFilePath: string) {
    qg.previewImage({
      urls: [_tempFilePath],
      current: "",
      success: () => {
        // self.label = '';
      },
      fail: function (): void {
        throw new Error("Function not implemented.");
      },
      complete: function (): void {
        throw new Error("Function not implemented.");
      },
    });
  }

  installShortcut(result: ResultCallback) {
    qg.installShortcut({
      success: function () {
        // 执行用户创建图标奖励
        Logger.log(" 安装成功 ");
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

  navigateToMiniProgram(appID: string) {
    qg.navigateToMiniGame({
      pkgName: appID,
      success: function () {},
      fail: function (res) {
        // Logger.log(JSON.stringify(res))
      },
    });
  }
}
