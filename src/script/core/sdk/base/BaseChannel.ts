import SimpleAlertHelper, {
  AlertBtnType,
} from "../../../game/component/SimpleAlertHelper";
import { UserInfo } from "../../../game/datas/userinfo/UserInfo";
import { ArmyManager } from "../../../game/manager/ArmyManager";
import { PlayerManager } from "../../../game/manager/PlayerManager";
import LangManager from "../../lang/LangManager";
import Logger from "../../logger/Logger";
import {
  ADName,
  ChannelID,
  DataCallback,
  NativeAdCallback,
  ResultCallback,
  ResultState,
  SDKConfig,
  isNull,
} from "../SDKConfig";
import BaseAd from "./BaseAd";
import BaseLogin from "./BaseLogin";
import BaseRecorder from "./BaseRecorder";
import BaseScrennshot from "./BaseScreenshot";
import { BaseShare } from "./BaseShare";
import BaseSubPackage from "./BaseSubPackage";
import HTMLCanvas = Laya.HTMLCanvas;
import LayerMgr from "../../layer/LayerMgr";
import Base64 from "../../utils/Base64";
import { PathManager } from "../../../game/manager/PathManager";
import { getdefaultLangageCfg } from "../../lang/LanguageDefine";
import SDKManager from "../SDKManager";
import Utils from "../../utils/Utils";
import HttpUtils from "../../utils/HttpUtils";
import { MessageTipManager } from "../../../game/manager/MessageTipManager";
import { SharedManager } from "../../../game/manager/SharedManager";

export default class BaseChannel {
  protected platId: number = 0;

  //渠道号
  protected _channelID: number = 0;
  //激励视频
  protected rewardAd: BaseAd = null;
  //banner广告实例
  protected bannerAd: BaseAd = null;
  //插屏广告
  protected insertAd: BaseAd = null;
  //分享实例
  protected share: BaseShare = null;
  //小游戏分包
  protected subPackage: BaseSubPackage = null;
  //原生广告
  protected nativeAd: BaseAd = null;
  //盒子广告
  protected appBoxAd: BaseAd = null;
  //登陆
  protected loginMgr: BaseLogin = null;
  //录屏功能
  protected recorder: BaseRecorder = null;
  //截屏功能
  protected screenshot: BaseScrennshot = null;

  protected rptLogType: string = "";

  //渠道配置数据
  protected configData: any;

  constructor(cID: number) {
    this._channelID = cID;
    this.configData = SDKConfig[this._channelID];
  }

  get channleID(): ChannelID {
    return this._channelID;
  }

  hasParam(name: string) {
    let param = this.configData[name];
    if (param == undefined || param == null) {
      return false;
    }
    if (Array.isArray(param)) {
      return param.length > 0;
    }
    return true;
  }

  getParam(site: number, adName: string) {
    let list: string[] = this.configData[adName];
    if (list.length > 0) {
      if (list.length > site) {
        return list[site];
      } else {
        return list[0];
      }
    } else {
      return null;
    }
  }

  /**
   * 是否有banner广告
   */
  hasBanner() {
    return this.hasParam(ADName.banner) && this.bannerAd != null;
  }
  /**
   * 显示banner广告
   * @param site 广告位索引
   */
  showBanner(site: number) {
    if (this.hasBanner()) {
      let ad = this.getParam(site, ADName.banner);
      if (ad) {
        this.bannerAd.open(ad);
      }
    }
  }
  //隐藏banner广告
  hideBanner() {
    if (this.hasBanner()) {
      this.bannerAd.close();
    }
  }

  /**
   * 是否有插屏广告
   */
  hasInsertAd() {
    return this.hasParam(ADName.insert) && this.insertAd != null;
  }

  /**
   * 展示插屏广告
   */
  showInsertAd(site: number) {
    if (this.hasInsertAd()) {
      let adId = this.getParam(site, ADName.insert);
      if (adId) {
        this.insertAd.open(adId);
      }
    }
  }

  //是否有激励视频广告
  hasRewardAd() {
    return this.hasParam(ADName.reward) && this.rewardAd != null;
  }
  //展示激励视频广告
  showRewardAd(site: number, callback: ResultCallback) {
    if (this.hasRewardAd()) {
      let adID = this.getParam(site, ADName.reward);
      if (adID) {
        this.rewardAd.open(adID, callback);
      }
    }
  }

  //是否有分享能力
  hasShare() {
    return this.share != null;
  }

  /**
   * 分享
   * @param site
   * @param callback
   */
  showShare(site: number, callback: ResultCallback, isShowRecorder?: boolean) {
    if (this.hasShare()) {
      this.share.share(site, callback, isShowRecorder);
    }
  }

  //短震动
  vibrateShort() {}
  //展示网络图片
  previewImage(imgUrl: string) {}
  //跳转能力
  navigateToMiniProgram(appID: string) {}

  hasLogin() {
    return !isNull(this.loginMgr);
  }

  /**
   * 登陆游戏
   * @param account
   * @param func
   */
  login(account: string, func: ResultCallback) {
    if (this.hasLogin()) {
      this.loginMgr.login(account, func);
    } else {
      func(ResultState.YES);
    }
  }

  /**
   * 获取用户信息
   * @param withCredentials
   * @param lang
   * @param func
   */
  getUserInfo(withCredentials: string, lang: string, func: DataCallback) {
    if (this.hasLogin()) {
      this.loginMgr.getUserInfo(withCredentials, lang, func);
    }
  }
  /**
   * 检查登陆状态
   * @param callback
   */
  checkSession(callback: ResultCallback) {
    if (this.hasLogin()) {
      this.loginMgr.checkSession(callback);
    } else {
      callback(ResultState.YES);
    }
  }

  postMessage(msg: any) {}

  hasSubPackage() {
    return this.subPackage != null;
  }

  loadSubPackage(subNames: string[], callback: DataCallback) {
    if (this.hasSubPackage()) {
      this.subPackage.loadList(subNames, callback);
    } else {
      callback(ResultState.YES, null);
    }
  }

  hasScreenshot() {
    return this.screenshot != null;
  }

  showScreenshot() {
    if (this.hasScreenshot()) {
      this.screenshot.capture();
    }
  }

  hasNativeAd() {
    return this.hasParam(ADName.native) && this.nativeAd != null;
  }

  showNativeAd(index: number, callback: NativeAdCallback) {
    if (this.hasNativeAd()) {
      let ad = this.getParam(index, ADName.native);
      if (ad) {
        this.nativeAd.open(ad, callback);
      }
    }
  }

  hideNativeAd() {
    if (this.hasNativeAd()) {
      this.nativeAd.close();
    }
  }
  reportAdClick(adId) {
    if (this.hasNativeAd()) {
      this.nativeAd.reportAdClick(adId);
    }
  }

  reportAdShow(adId) {
    if (this.hasNativeAd()) {
      this.nativeAd.reportAdShow(adId);
    }
  }

  hasRecorder() {
    return this.recorder != null;
  }

  recorderStart(obj?) {
    if (this.hasRecorder()) {
      this.recorder.start(obj);
    }
  }

  getRecorder() {
    return this.recorder;
  }

  recorderStop(isSave: boolean = true) {
    if (this.hasRecorder()) {
      this.recorder.stop(isSave);
    }
  }

  hasAppBox() {
    return this.hasParam(ADName.appbox) && this.appBoxAd != null;
  }

  showAppBoxAd(index: number) {
    if (this.hasAppBox()) {
      let ad = this.getParam(index, ADName.appbox);
      if (ad) {
        this.appBoxAd.open(ad);
      }
    }
  }

  showToast(title: string) {}
  canInstallShortcut(func: ResultCallback) {
    func(ResultState.NO);
  }

  /**
   * 安装图标到桌面
   * @param result
   */
  installShortcut(result: ResultCallback) {
    result(ResultState.NO);
  }

  //==================================以下是7road sdk==================================//
  /**
   * 游戏事件
   * @param code  GameEventCode
   * @param exInfo    额外字段, 可根据情况自定义字段名称以json 串的形式传入（需提前沟通key值）。
   */
  public postGameEvent(code: number, exInfo: string = "", userName?: string) {}

  /**
   * 事件统计（埋点）
   * @param type  事件类型 (0:漏斗模型 1:页面曝光 2:点击)
   * @param node  漏斗模型的nodeid 对应TrackEventNode枚举
   * @param eventName 事件信息
   * @param eventDescribe 事件描述
   * @param pageName  页面信息
   * @param pageDescribe  页面描述
   */
  public trackEvent(
    type: number,
    node: number,
    eventName: string,
    eventDescribe: string,
    pageName: string,
    pageDescribe: string,
  ) {
    let userInfo: UserInfo = PlayerManager.Instance.currentPlayerModel.userInfo;
    let playerInfo = PlayerManager.Instance.currentPlayerModel.playerInfo;
    let roleInfo: object = {
      // "platformServerId" : userInfo.siteId,
      serverId: userInfo.siteId,
      serverName: playerInfo.serviceName,
      roleId: userInfo.userId,
      roleName: playerInfo.nickName,
      roleLevel: ArmyManager.Instance.thane.grades,
      vipLevel: playerInfo.vipGrade, //VIPManager.Instance.model.vipInfo ? VIPManager.Instance.model.vipInfo.VipGrade : 0
    };
    Logger.yyz(
      "trackEvent:" +
        `type:${type}, node:${node}, roleInfo:${JSON.stringify(roleInfo)},
        eventName:${eventName}, eventDescribe:${eventDescribe}, pageName:${pageName}, pageDescribe:${pageDescribe}`,
    );
  }

  /**
   * 渠道账户个人中心
   * @param json JSON字符串, 根据渠道特殊需要进行传, 默认传空字符串
   */
  public openPersonalCenter(json: string = "") {}

  /**
   * 登出
   * @param b
   */
  logout(b: boolean = false) {}

  exitGame() {}
  /**
   * 打开链接
   * @param url
   */
  openURL(url: string) {
    Laya.Browser.window.open(url);
  }

  /**
   * 检测是否有某个权限
   * @param type  权限类型
   * @param request   没有权限的话是否获取
   * @return
   */
  checkPermission(type: string, request: boolean = false): number {
    return 0;
  }

  /**
   * 打开客服系统
   */
  openCustomerService() {
    let userInfo: UserInfo = PlayerManager.Instance.currentPlayerModel.userInfo;
    let playerInfo = PlayerManager.Instance.currentPlayerModel.playerInfo;
    let langCfg = getdefaultLangageCfg();
    let param: object = {
      appId: PathManager.info.serviceAppID,
      userId: userInfo.user, //对应的是平台登陆的name 60000
      roleId: ArmyManager.Instance.thane.userId
        ? ArmyManager.Instance.thane.userId.toString()
        : "",
      roleName: "",
      level: ArmyManager.Instance.thane.grades,
      vipLevel: playerInfo.vipGrade,
      gameZoneId: userInfo.siteId,
      language: langCfg.key == "zhcn" ? "zh-Hans" : langCfg.key,
      source: 2, //2表示web端
      deviceNo: "",
      gameUserId: userInfo.user,
    };
    let str = JSON.stringify(param);
    var paramString = Base64.encode(str);
    if (PathManager.info.serviceURL != "")
      Laya.Browser.window.open(
        PathManager.info.serviceURL + "?param=" + paramString,
      );
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
    let htmlCanvas1: HTMLCanvas = sp.drawToCanvas(
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
    ).then((data) => {
      let retData = JSON.parse(data);
      Logger.log("FB分享返回: ", retData);
      switch (retData.code) {
        case 200:
          let shareurl = retData.data;
          let shareUrl = `https://www.facebook.com/dialog/share?app_id=445717077248729&display=popup&href=${encodeURIComponent(shareurl)}&redirect_uri=${encodeURIComponent("https://wartunelite.wan.com/")}`;
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

  /**
   * 打开社会化分享
   */
  socialPlugin(
    code: number,
    title: string,
    desc: string,
    photoPath: string,
    url: string,
    exInfo: string,
  ) {}

  /**
   * 注册推送
   */
  registerPush(openId: string) {}

  /**
   * 实名认证
   */
  openVerify() {}

  /**
   * 获取中间层关于当前渠道的配置信息
   */
  getConfigData(): string {
    return "";
  }

  showLogin(type: number = 0) {}

  /**
   * 自动登录sdk
   */
  autoLogin() {}
  /**
   * 支付
   * @param type  支付类型（默认0时可不传）
   * @param orderId   游戏订单id
   * @param productId 游戏商品id
   * @param channelProductId  渠道商品id
   * @param productName   商品名
   * @param productDesc   商品描述
   * @param money 金额
   * @param showCoin  显示钻石数
   * @param gameExInfo    游戏透传字段
   * @param count 购买数量
   * @param coinType  币种
   * @param virtualCoinType   虚拟币币种
   * @param oExInfo   订单额外信息
   */
  pay(
    type: number,
    orderId: string,
    productId: string,
    channelProductId: string,
    productName: string,
    productDesc: string,
    money: string,
    showCoin: number,
    gameExInfo: string,
    count: number,
    coinType: string,
    virtualCoinType: string,
    oExInfo: string = "",
  ) {}

  /**
   * 语音登录
   * 在游戏中需要使用语音功能的地方调用voiceLogin(string userId, string password, string token)方法进行登录,
   * userId、password、token字段可由游戏自行定义, token 可传空
   * */
  voiceLogin(userId: string, password: string, token: string) {}

  /**
   * 语音登出
   * */
  voiceLogout() {}

  /**
   * 开始录音
   * chatRoomId 传游戏自定义的id,type =1表示私聊 type =2表示群聊
   * */
  startRecordAudio(chatRoomId: string, type: number, extraText?: string) {}

  /**
   * 停止录音并发送
   * 可在onSendAudioMessageCallBack中收到发送成功的回调
   * */
  stopAndSendAudio(extraText: string) {}

  /**
   * 播放语音
   * audioPath为语音文件的路径
   * */
  startPlayAudio(audioPath: string) {}

  /**
   * 停止播放语音
   * */
  stopPlayAudio() {}

  /**
   * 取消发送语音
   * */
  cancelRecordAudio() {}

  setFloatVisible(isVisible: boolean) {}

  copyStr(str: string) {}

  showKeyboard(text: string) {}
  //==================================以上是7road sdk==================================//

  /**震动 */
  shake() {}

  showNetworkAlert(tip: string = "") {
    LayerMgr.Instance.clearStageTipDynamicLayer();
    let prmit = LangManager.Instance.GetTranslation("public.prompt");
    let content =
      tip != ""
        ? tip
        : LangManager.Instance.GetTranslation("login.serverclosed.lost2");
    let exit = LangManager.Instance.GetTranslation("public.exit");
    let calcel = LangManager.Instance.GetTranslation("public.cancel");
    SimpleAlertHelper.Instance.Show(
      SimpleAlertHelper.SIMPLE_ALERT,
      null,
      prmit,
      content,
      exit,
      calcel,
      () => {
        this.reload();
      },
      AlertBtnType.O,
    );
  }

  relaunch() {}

  reload() {
    window.location.reload();
  }

  /**日志上报 */
  postInfo(type: string = "", logStr: string = "") {}

  getAdparams() {}

  getChannelId() {
    return 0;
  }

  getUserId() {
    return "";
  }

  initRoad_7(param?: any) {
    return new Promise<any>((resolve, reject) => {});
  }

  getConfigItem(name?: string) {
    return new Promise<any>((resolve, reject) => {});
  }

  openQQService(url: string = "", qq: string) {}

  evaluateOnAppStore() {}

  openWXOfficial(textUrl: string, s: string) {}

  createLoginReq(
    userName: string,
    pass: string,
    site: string,
    siteId: number,
    appData: any = null,
  ) {}

  refresh() {}

  adjustEvent(eventType: string, value?: any) {}

  setRptTag(value: string = "") {
    this.rptLogType = value;
  }

  /**跳转大玩咖特权（渠道方跳转）*/
  jumpPrivilege(code: number) {}

  // report
  reportData(...params) {}

  /**账号绑定 */
  bindAccount(type: number): Promise<any> {
    return new Promise<any>((resolve) => {
      resolve(null);
    });
  }

  checkBindState(): Promise<any> {
    return new Promise<any>((resolve) => {
      resolve(null);
    });
  }

  uploadLog() {
    Laya.timer.once(2000, this, () => {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("uploadLog.result"),
      );
    });
  }

  /**原生端打印日志 */
  nativeLog(key: string, desc: string) {}

  //Bugly日志上报
  pushUserData(key: string, forkey: string) {}
}
