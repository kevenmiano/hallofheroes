import Logger from "../../logger/Logger";
import BaseLogin from "../base/BaseLogin";
import { ResultCallback, DataCallback, ResultState } from "../SDKConfig";

/**
 * https://microapp.bytedance.com/dev/cn/mini-game/develop/multi-server-support/using-restriction
 */
export default class TTLogin extends BaseLogin {
  checkSession(callback: ResultCallback) {
    tt.checkSession({
      success(res) {
        Logger.log("session未过期");
        callback(ResultState.YES);
      },
      fail(res) {
        Logger.log("session已过期, 需要重新登录");
        callback(ResultState.NO);
      },
    });
  }

  login(account: string, func: DataCallback) {
    let isForce: boolean = false;
    let info = tt.getSystemInfoSync();
    Logger.log(" login == info ", info);
    if (info.appName == "Douyin") {
      isForce = true;
    }
    tt.login({
      force: isForce,
      success(res) {
        Logger.log(`login调用成功${res.code} ${res.anonymousCode}`);
        func(ResultState.YES, res);
      },
      fail(res) {
        // Logger.log(`login调用失败`);
        if (isForce) {
          func(ResultState.NO, null);
        } else {
          func(ResultState.YES, null);
        }
      },
    });
  }

  getUserInfo(withCredentials: string, lang: string, func: DataCallback) {
    tt.getUserInfo({
      withCredentials: withCredentials,
      lang: lang,
      success(res) {
        Logger.log(`getUserInfo调用成功${res.userInfo}`);
        func(ResultState.YES, res);
      },
      fail(res) {
        Logger.log("getUserInfo调用失败", res);
        func(ResultState.NO, null);
      },
    });
  }

  logout(b: boolean = false) {}
}
