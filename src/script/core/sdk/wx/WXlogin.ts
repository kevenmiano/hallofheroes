import Logger from "../../logger/Logger";
import BaseLogin from "../base/BaseLogin";
import { ResultCallback, ResultState, DataCallback } from "../SDKConfig";

/**
 * https://developers.weixin.qq.com/minigame/dev/api/open-api/login/wx.login.html
 */
export default class WXLogin extends BaseLogin {
  checkSession(callback: ResultCallback) {
    wx.checkSession({
      success() {
        Logger.log("session未过期");
        callback(ResultState.YES);
      },
      fail() {
        Logger.log("session已过期, 需要重新登录");
        callback(ResultState.NO);
      },
      complete: function (): void {
        Logger.log("checkSession complete");
      },
    });
  }

  login(account: string, func: ResultCallback) {
    let isForce: boolean = false;
    wx.login({
      force: isForce,
      success(res) {
        Logger.log(`login调用成功${res.code}`);
        func(ResultState.YES);
      },
      fail() {
        // Logger.log(`login调用失败`);
        if (isForce) {
          func(ResultState.NO);
        } else {
          func(ResultState.YES);
        }
      },
      complete: function (): void {
        throw new Error("Function not implemented.");
      },
      pkgName: "",
    });
  }

  getUserInfo(withCredentials: string, lang: string, func: DataCallback) {
    wx.getUserInfo({
      withCredentials: withCredentials === "true",
      lang: lang,
      success(res) {
        Logger.log(`getUserInfo调用成功${res.userInfo}`);
        func(ResultState.YES, res);
      },
      fail() {
        Logger.log("getUserInfo调用失败");
        func(ResultState.NO, null);
      },
      complete: function (): void {
        throw new Error("Function not implemented.");
      },
    });
  }

  logout(b: boolean = false) {}
}
