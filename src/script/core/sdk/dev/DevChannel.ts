import { GameEventCode } from "../../../game/constant/GameEventCode";
import { EmWindow } from "../../../game/constant/UIDefine";
import { UserInfo } from "../../../game/datas/userinfo/UserInfo";
import { MessageTipManager } from "../../../game/manager/MessageTipManager";
import { PathManager } from "../../../game/manager/PathManager";
import { PlayerManager } from "../../../game/manager/PlayerManager";
import YMWebManager from "../../../game/manager/YMWebManager";
import { LoginManager } from "../../../game/module/login/LoginManager";
import { isOversea } from "../../../game/module/login/manager/SiteZoneCtrl";
import { FrameCtrlManager } from "../../../game/mvc/FrameCtrlManager";
import LangManager from "../../lang/LangManager";
import Logger from "../../logger/Logger";
import HttpUtils from "../../utils/HttpUtils";
import Utils from "../../utils/Utils";
import BaseChannel from "../base/BaseChannel";
import { ChannelSTR } from "../SDKConfig";
import SDKManager from "../SDKManager";

export default class DevChannel extends BaseChannel {
  constructor(id: number) {
    super(id);
  }

  /**
   * 语音登录
   * 在游戏中需要使用语音功能的地方调用voiceLogin(string userId, string password, string token)方法进行登录,
   * userId、token字段可由游戏自行定义, password 可传空
   */
  voiceLogin(userId: string, password: string, token: string) {
    YMWebManager.Instance.voiceLogin(userId, password, token);
  }

  joinConsortiaRoom(roomid: string) {
    YMWebManager.Instance.joinConsortiaRoom(roomid);
  }

  exitConsortiaRoom(roomid: string) {
    YMWebManager.Instance.exitConsortiaRoom(roomid);
  }

  joinTeamRoom(roomid: string, isteam: boolean = false) {
    YMWebManager.Instance.joinTeamRoom(roomid, isteam);
  }

  exitTeamRoom(roomid: string, isteam: boolean = false) {
    YMWebManager.Instance.exitTeamRoom(roomid, isteam);
  }

  /**
   * 开始录音
   * chatRoomId 传游戏自定义的id,type =1表示私聊 type =2表示群聊
   * */
  startRecord(
    chatRoomId: string,
    type: number,
    extraText: string,
    cb: Function,
  ) {
    YMWebManager.Instance.startRecord(chatRoomId, type, extraText, cb);
  }

  /**
   * 停止录音并发送
   * 可在onSendAudioMessageCallBack中收到发送成功的回调
   * */
  stopAndSendAudio(receiverId: string) {
    YMWebManager.Instance.stopAndSendAudio(receiverId);
  }

  /**
   * 播放语音
   * audioPath为语音文件的路径
   * */
  startPlayAudio(serverId: any) {
    YMWebManager.Instance.startPlayAudio(serverId);
  }

  /**
   * 停止播放语音
   * */
  stopPlayAudio() {
    YMWebManager.Instance.stopPlayAudio();
  }

  /**
   * 取消发送语音
   * */
  cancelRecordAudio() {
    YMWebManager.Instance.cancelRecordAudio();
  }

  logout(b: boolean = false) {
    YMWebManager.Instance.logout();
    SDKManager.Instance.getChannel().reload();
  }

  /**
   * 打开链接
   * @param url
   */
  openURL(url: string) {
    Laya.Browser.window.open(url);
  }

  openQQService(url: string, qq: string): void {
    Laya.Browser.window.open(url);
  }

  openWXOfficial(textUrl: string, s: string): void {
    Laya.Browser.window.open(textUrl);
  }

  copyStr(str: string) {
    let input: any = document.createElement("input");
    input.value = str;
    document.body.appendChild(input);
    input.select();
    let success: boolean = false;
    try {
      success = document.execCommand("copy");
    } catch (err) {}
    document.body.removeChild(input);
    return success;
  }

  createLoginReq(
    userName: string,
    pass: string,
    site: string,
    siteId: number,
    appData: any = null,
  ) {
    let platId = 5;
    if (Utils.isFromMicroApp()) {
      this.platId = 6;
    }
    LoginManager.Instance.c2s_createLoginReq(
      userName,
      pass,
      site,
      siteId,
      ChannelSTR.DEV,
      platId,
      appData,
    ); //请求玩家列表
  }

  adjustEvent(eventType: string, value?: any) {
    if (isOversea()) {
      SDKManager.Instance.getChannel().postGameEvent(
        GameEventCode.Code_9999,
        JSON.stringify({ eventToken: eventType }),
      );
    }
  }

  saveScreenshot(
    sp: Laya.Sprite,
    isShare: number = 1,
    code: number = 0,
    title: string = "title",
    desc: string = "desc",
  ) {
    if (code != 6) {
      return;
    }
    //600x600 或者  600x314
    FrameCtrlManager.Instance.open(EmWindow.Waiting);
    Utils.delay(5000).then(() => {
      FrameCtrlManager.Instance.exit(EmWindow.Waiting);
    });
    let htmlCanvas1: Laya.HTMLCanvas = sp.drawToCanvas(
      sp.width * sp.scaleX,
      sp.height * sp.scaleY,
      0,
      0,
    ); //把精灵绘制到canvas上面
    let base64Str1: string = htmlCanvas1.toBase64("image/png", 0.8);
    let fileStream = Utils.dataURLtoFile(base64Str1);
    let userInfo: UserInfo = PlayerManager.Instance.currentPlayerModel.userInfo;
    let userId = userInfo.userId;
    let key = userInfo.key;
    let appurl = "https://wartunelite.wan.com/";
    let param: string = `uid=${userId}&key=${key}&title=${title}&desc=${desc}&appid=${445717077248729}&appurl=${appurl}`;
    HttpUtils.httpRequest(
      PathManager.info.REQUEST_PATH,
      "fbshareservlet?" + param,
      fileStream,
      "POST",
      "text",
      null,
      ["Content-Type", "text/plain"],
    ).then((data) => {
      let retData = JSON.parse(data);
      Logger.log("FB分享返回: ", retData);
      FrameCtrlManager.Instance.exit(EmWindow.Waiting);
      switch (retData.code) {
        case 200:
          let shareurl = retData.data;
          let shareUrl = `https://www.facebook.com/dialog/share?app_id=445717077248729&display=popup&href=${encodeURIComponent(
            shareurl,
          )}&redirect_uri=${encodeURIComponent(
            "https://wartunelite.wan.com/",
          )}`;
          SDKManager.Instance.getChannel().openURL(shareUrl);
          break;
        default:
          let codeStr = "mountShareWnd.FB.share_" + retData.code;
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation(codeStr),
          );
          break;
      }
    });
  }
}
