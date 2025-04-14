import { LoginManager } from "../../../game/module/login/LoginManager";
import { ChannelSTR } from "../SDKConfig";
import WanChannel from "../wan/WanChannel";

/**
 * 中控
 */
export default class FccChannel extends WanChannel {
  constructor(id: number) {
    super(id);
  }

  createLoginReq(
    userName: string,
    pass: string,
    site: string,
    siteId: number,
    appData: any = null,
  ) {
    this.platId = 5;
    LoginManager.Instance.c2s_createLoginReq(
      userName,
      pass,
      site,
      siteId,
      ChannelSTR.FCC,
      this.platId,
      appData,
    ); //请求玩家列表
  }

  adjustEvent(eventType: string, value?: any) {}
}
