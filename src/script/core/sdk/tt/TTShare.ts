import Logger from "../../logger/Logger";
import { BaseShare } from "../base/BaseShare";
import { ResultCallback, SDKState, ADName, ResultState } from "../SDKConfig";

export default class TTShare extends BaseShare {
  constructor(channel) {
    super(channel);
    // GlobalEvent.Instance().addEventListener(GlobalEvent.EVENT_SHOW, this.backGame, this)
    tt.showShareMenu({
      withShareTicket: true,
      success: function (res: any): void {
        throw new Error("Function not implemented.");
      },
      fail: function (res: any): void {
        throw new Error("Function not implemented.");
      },
    });
    tt.updateShareMenu({
      withShareTicket: true,
      success: function (res: any): void {
        throw new Error("Function not implemented.");
      },
      fail: function (res: any): void {
        throw new Error("Function not implemented.");
      },
    });
    wx.onShareAppMessage(function () {
      // 用户点击了“转发”按钮
      // let visibleOrigin = Laya.Browser.clientWidth
      // let visibleSize = Laya.Browser.clientHeight

      return {
        title: this.channel.getParam(0, ADName.shareTitle),
        imageUrl: this.channel.getParam(0, ADName.shareImage),
        imageUrlId: "",
        success: () => {
          Logger.log("onShareAppMessage 分享成功");
        },
        fail: (e) => {
          Logger.log("分享失败", e);
        },
        // imageUrl: canvas.toTempFilePathSync({
        //     x: visibleOrigin.x,
        //     y: visibleOrigin.y,
        //     destWidth: visibleSize.width,
        //     destHeight: visibleSize.height
        // }),
        // success: () => {
        //     Logger.log('分享成功')
        //     this.shareSuccess();
        // },
        // fail: (e) => {
        //     Logger.log('分享失败', e)
        // }
      };
    });
  }
  protected getData(site): any {
    let data = {
      title: this.channel.getParam(site, ADName.shareTitle),
      imageUrl: this.channel.getParam(site, ADName.shareImage),
      imageUrlId: "",
    };
    return data;
  }

  share(index: number, func?: ResultCallback, isShowRecorder?: boolean) {
    // this.callback = func;
    let title = this.channel.getParam(index, ADName.shareTitle);
    let videoPath = this.channel.getRecorder().getVideoPath();
    if (isShowRecorder && videoPath) {
      tt.shareAppMessage({
        channel: "video",
        title: title,
        extra: {
          videoPath: videoPath,
        },
        success: () => {
          Logger.log("分享成功");
          if (func) {
            func(ResultState.YES);
          }
          // this.shareSuccess();
          this.channel.getRecorder().clear();
        },
        fail: (e) => {
          Logger.log("分享失败", e);
          if (e.errMsg.indexOf("short") >= 0) {
            this.share(0, func, false);
          } else {
            func(ResultState.NO);
            // ToastController.Instance().showLayerByText("分享失败")
          }
        },
        // x: visibleOrigin.x,
        // y: visibleOrigin.y,
        // imageUrl: canvas.toTempFilePathSync({
        //   destWidth: visibleSize.width,
        //   destHeight: visibleSize.height
        // })
      });
    } else {
      tt.shareAppMessage({
        desc: title,
        imageUrl: this.channel.getParam(index, ADName.shareImage),
        title: "分享有礼",
        imageUrlId: "",
        success: () => {
          Logger.log("分享成功");
          if (func) {
            func(ResultState.YES);
          }
          // this.shareSuccess();
        },
        fail: (e) => {
          Logger.log("分享失败");
          func(ResultState.NO);
          // ToastController.Instance().showLayerByText("分享失败")
        },
      });
    }
  }

  getShareInfo(shareTicket: string, func: (result) => void) {
    if (shareTicket) {
      tt.getShareInfo({
        shareTicket: shareTicket,
        success: () => {},
        fail: () => {},
      });
    }
  }
}
