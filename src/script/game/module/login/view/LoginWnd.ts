import Logger from "../../../../core/logger/Logger";
import ByteArray from "../../../../core/net/ByteArray";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import UIButton from "../../../../core/ui/UIButton";
import UIManager from "../../../../core/ui/UIManager";
import HttpUtils from "../../../../core/utils/HttpUtils";
import MD5Utils from "../../../../core/utils/MD5Utils";
import {
  NativeEvent,
  SelectServerEvent,
  WebViewEvent,
} from "../../../constant/event/NotificationEvent";
import { EmModel } from "../../../constant/model/modelDefine";
import { UserModelAttribute } from "../../../constant/model/UserModelParams";
import { EmWindow } from "../../../constant/UIDefine";
import { UserInfo } from "../../../datas/userinfo/UserInfo";
import { FilterWordManager } from "../../../manager/FilterWordManager";
import GameManager from "../../../manager/GameManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import ModelMgr from "../../../manager/ModelMgr";
import { NotificationManager } from "../../../manager/NotificationManager";
import { PathManager } from "../../../manager/PathManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { SharedManager } from "../../../manager/SharedManager";
import ComponentSetting from "../../../utils/ComponentSetting";
import { LoginManager } from "../LoginManager";
import ServerListData, { ServerSite, SITE_MODE } from "../model/ServerListData";
import SelectServerItem from "./SelectServerItem";
import { Main } from "../../../../../Main";
import SDKManager from "../../../../core/sdk/SDKManager";
import LangManager from "../../../../core/lang/LangManager";
import BaseChannel from "../../../../core/sdk/base/BaseChannel";
import { NativeChannel } from "../../../../core/sdk/native/NativeChannel";
import Utils from "../../../../core/utils/Utils";
import VersionUtils from "../../../version/VersionUtils";
import { GameEventCode, TrackEventNode } from "../../../constant/GameEventCode";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import { RPT_EVENT } from "../../../../core/thirdlib/RptEvent";
import WXAdapt from "../../../../core/sdk/wx/adapt/WXAdapt";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { getZoneCount, getZoneData, isOversea } from "../manager/SiteZoneCtrl";
import { ZONE_AREA } from "../model/SiteZoneData";
import LoginLoad from "../LoginLoad";
import { AnnounceCtrl } from "../../announce/AnnounceCtrl";
import { TempleteManager } from "../../../manager/TempleteManager";
import { Func } from "../../../../core/comps/Func";

/**
 * @author:pzlricky
 * @data: 2020-11-10 14:59
 * @description 登录
 */
export default class LoginWnd extends BaseWindow {
  public platformState: fgui.Controller;
  public maskLoginCtrl: fgui.Controller;
  public isOversea: fgui.Controller;
  public c_faxing: fgui.Controller;
  public loginState: fgui.Controller;
  public privacy: fgui.Controller;
  public device: fgui.Controller;
  public cIsIOS: fgui.Controller;

  private gInfoGroup: fgui.GGroup;
  private gCheckGroup: fgui.GGroup;
  private gComGroup: fgui.GGroup;

  private btnEnterGame: UIButton;
  private btnLoginGame: UIButton;
  private privacyCheck: UIButton;

  public announceBtn: UIButton; //公告按钮
  public switchAccBtn: UIButton; //切换账号
  public btnAge: UIButton; //适龄提示
  public gmBtn: UIButton; //客服按钮（玩平台App显示）
  public switchSiteBtn: UIButton; //
  public settingBtn: UIButton; //
  private txtprivacy: fgui.GRichTextField; //隐私
  private loginBackground: fgui.GComponent;
  private txtVersion: fgui.GTextField;
  private txtCompany: fgui.GTextField;
  private txtHealthAdvice: fgui.GTextField; //健康提示

  //服务器信息
  private serverInfoItem: SelectServerItem;
  private serverListData: ServerListData;

  //版本号
  private version: fgui.GRichTextField;

  private RSAKey: string = "7c4a4a5fa9be4624a90bf66da4b25c6f"; //固定Key
  private userData = null;
  private objData = null;
  private userName: string = "";
  private userSite: string = "";
  private _appData: any;

  private requestServerTimes: number = 0;
  private requestServerMaxTimes: number = 3; //次数
  private requestPID: number | string = 0;

  constructor() {
    super();
    this.resizeContent = true;
  }

  public OnInitWind() {
    super.OnInitWind();
    FrameCtrlManager.Instance.exit(EmWindow.SiteZone);
    FrameCtrlManager.Instance.exit(EmWindow.DebugLogin);
    FrameCtrlManager.Instance.exit(EmWindow.Waiting);

    this.platformState = this.getController("platformState");
    this.maskLoginCtrl = this.getController("maskLoginCtrl");
    this.isOversea = this.getController("isOversea");
    this.c_faxing = this.getController("c_faxing");
    this.loginState = this.getController("loginState");
    this.device = this.getController("device");
    this.privacy = this.getController("privacy");
    this.cIsIOS = this.getController("cIsIOS");

    LoginLoad.onLoadSpine(
      this.loginBackground.displayObject,
      LoginLoad.LOGIN_SKELETON,
    );
    if (this.version) {
      if (Utils.isApp()) {
        this.device.selectedIndex = 1;
        //App v{appVersion=1.2.0.5}   Res v{resVersion=1.2.0.5}
        let appVersion: string =
          NativeChannel.versionName + "(" + NativeChannel.versionCode + ")";
        if (Utils.isIOS()) {
          appVersion =
            Laya.Browser.window.conchConfig &&
            Laya.Browser.window.conchConfig.getAppVersion() +
              "(" +
              Laya.Browser.window.conchConfig.getAppLocalVersion() +
              ")";
        }
        this.version
          .setVar("appVersion", appVersion)
          .setVar("resVersion", Main.version)
          .flushVars();
      } else {
        this.device.selectedIndex = 0;
        //Res v{resVersion=1.2.0.5}
        this.version.setVar("resVersion", Main.version).flushVars();
      }
    }
    this.setLogoActive();
    this.btnLoginGame.btnInternal = 3000; //登陆游戏按钮限制1S连点
    this.addEvent();
    if (Utils.isWxMiniGame()) {
      WXAdapt.Instance.wxMenuAdapt(this.announceBtn);
    }
    this.userData = null;
    let userPassword = "";
    this.requestServerTimes = 0;
    let platform: any = 0;
    let pathInfo = PathManager.info;
    //1、手机端,登录成功后, 再获取服务器列表信息
    //2、非手机端,玩平台,查找玩平台对应的服务器列表数据
    //3、非手机端,Debug模式
    this.btnEnterGame.enabled = false;
    this.switchAccBtn.visible = Utils.isApp();
    this.switchSiteBtn.visible = getZoneCount() > 1;
    let openCfgs = TempleteManager.Instance.getConfigLanguages();
    this.settingBtn.visible = openCfgs.length > 1;
    this.showMaskLogin(false);
    this.loginState.selectedIndex = 0;
    this.cIsIOS.selectedIndex = Utils.isIOS() ? 1 : 0;
    this.c_faxing.selectedIndex = Utils.isQQHall() ? 1 : 0;
    this.isOversea.selectedIndex = isOversea() ? 1 : 0;
    this.announceBtn.visible = Utils.isFrom4399() ? false : true;
    this.setPrivacyState();
    let shareState = SharedManager.Instance.privacyState;
    if (Utils.isYYBApp() || Utils.isHUAWEIRY()) {
      //应用宝默认不勾选
      shareState = shareState ? "true" : "false";
    }
    this.privacyCheck.selected = shareState == "false" ? false : true;
    if (this.frameData) {
      this.objData = this.frameData;
      if (!this.objData) return;
      LoginManager.Instance.loginAccountParams = this.objData;
      if (this.objData.isWan) {
        //玩平台
        this.userData = this.frameData.user;
        if (this.userData) {
          //网页传入账户信息
          this.userName = this.userData.user;
          userPassword = "123456";
          this._appData = {
            token: this.userData.token,
          };
          if (this.userData.channel) {
            this._appData.channelId = this.userData.channel;
          }
          if (this.userData.medium) {
            this._appData.medium = this.userData.medium;
          }
        }
        let date: Date = new Date();
        SharedManager.Instance.setProperty(
          "userName",
          this.userData.user,
          "userDate",
          date,
        );
        //获取对应的玩平台服务列表
        platform = this.getUserPID("WAN");
        this.platformState.selectedIndex = 1;
        if (platform && this.userName) {
          this.requestServerList(platform, this.userName);
        }
      } else if (this.objData.isDebug || this.objData.isFCC) {
        //Debug端
        this.platformState.selectedIndex = 1;
        this.userData = this.frameData.user;
        let useSite = false;
        if (this.userData) {
          //网页传入账户信息
          this.userName = this.userData.user;
          this.userSite = this.userData.site;
          userPassword = "123456";
        }
        if (this.objData.isDebug) {
          platform = this.getUserPID("WAN");
        } else if (this.objData.isFCC) {
          if (this.userSite != "") {
            platform = this.userSite;
            useSite = true;
          }
        }
        let channelId = Utils.GetUrlQueryString("channelId");
        ModelMgr.Instance.setProperty(
          EmModel.USER_MODEL,
          UserModelAttribute.channelId,
          channelId,
        );
        this._appData = {};
        if (channelId != "" && channelId != undefined) {
          this._appData.channelId = channelId;
        }

        //请求服务器列表信息
        if (platform && this.userName) {
          this.requestServerList(platform, this.userName, useSite);
        }
      } else if (this.objData.isWxMiniGame) {
        //小游戏
        this.platformState.selectedIndex = 1;
        this.userData = this.frameData.user;
        SDKManager.Instance.getChannel()
          .initRoad_7()
          .then((res) => {
            if (!res) return;
            if (res) this._appData = res;
            if (res.channelId) platform = Number(res.channelId);
            this.userName = SDKManager.Instance.getChannel().getUserId();
            ModelMgr.Instance.setProperty(
              EmModel.USER_MODEL,
              UserModelAttribute.channelId,
              platform,
            );
            this._appData.token = res.token;
            this.requestServerList(platform, this.userName);
          });
      } else if (this.objData.isH5SDK) {
        this.userData = this.frameData.user;
        this.platformState.selectedIndex = 1;
        SDKManager.Instance.getChannel()
          .initRoad_7(this.userData)
          .then((res) => {
            if (!res) return;
            if (res) this._appData = res;
            if (res.channelId) platform = Number(res.channelId);
            this.userName = this.userData.user;
            ModelMgr.Instance.setProperty(
              EmModel.USER_MODEL,
              UserModelAttribute.channelId,
              platform,
            );
            if (
              !this._appData.token ||
              this._appData.token != this.frameData.user.token
            )
              this._appData.token = this.frameData.user.token;
            this.requestServerList(platform, this.userName);
          });
      } else {
        //手机端
        //等待App端发送数据过来
        this.platformState.selectedIndex = 1;
        let obj = window["__nativeInfo__"];
        if (obj) {
          this._appData = obj;
          let isLoginAfterRestart = SharedManager.Instance.getWindowItem(
            "isLoginAfterRestart",
          );
          if (isLoginAfterRestart == "true") {
            if (Utils.isAndroid()) {
              SDKManager.Instance.getChannel().showLogin();
            } else if (Utils.isIOS()) {
              SDKManager.Instance.getChannel().logout(true);
            }
          } else {
            if (obj) {
              this.userName = obj["userId"];
              let channelId = obj["channelId"];
              if (Utils.isIOS()) {
                platform = this.getUserPID("IOS");
              } else {
                platform = Number(channelId);
              }
              ModelMgr.Instance.setProperty(
                EmModel.USER_MODEL,
                UserModelAttribute.channelId,
                channelId,
              );
              this.setPrivacyState();
              if (
                !Number.isNaN(platform) &&
                platform > 0 &&
                this.userName &&
                this.userName != ""
              ) {
                SharedManager.Instance.setProperty(
                  "userName",
                  this.userName,
                  "userDate",
                  new Date(),
                );
                this.requestServerList(platform, this.userName);
              }
            } else {
              this.showMaskLogin(false);
            }
          }
        }
      }
    }
  }

  /**检查隐私 */
  private checkPrivacy(): boolean {
    if (
      Utils.isHUAWEIRY() ||
      Utils.isYYBApp() ||
      Utils.isFromHY() ||
      Utils.isFrom4399() ||
      Utils.isQQHall() ||
      Utils.isOppoApp() ||
      Utils.isQQZone() ||
      Utils.isQQMobile()
    ) {
      let chkState = this.privacyCheck.selected;
      return chkState;
    }
    return true;
  }

  private setLogoActive() {
    let logActive = this.getController("LogoActive");
    logActive.selectedIndex = !PathManager.info.isLogoActive ? 1 : 0;
  }

  private pidsInter = ["20370"];
  private delayTime = 5000;
  private checkUserPID(key: string = "") {
    if (this.pidsInter.indexOf(key) != -1) {
      Laya.timer.once(this.delayTime, this, this.removeMaskCtrl);
    }
  }

  private removeMaskCtrl() {
    this.showMaskLogin(false);
  }

  private clearUserPID(key: string = "") {
    if (this.pidsInter.indexOf(key) != -1) {
      Laya.timer.clear(this, this.removeMaskCtrl);
    }
  }

  //
  private getUserPID(key: string = ""): number {
    let pids = PathManager.info.PLATFORM;
    return Number(pids[key]);
  }

  //
  private getSitePID(site: string = ""): number {
    let siteValue = "";
    if (site.indexOf("_") != -1) {
      siteValue = String(site.split("_")[0]);
    }
    let pids = PathManager.info.SITES;
    return Number(pids[siteValue]);
  }

  addEvent() {
    this.btnEnterGame.onClick(this, this.onEnterGame);
    this.btnLoginGame.onClick(this, this.onLoginGame);
    this.announceBtn.onClick(this, this.onAnnounceHandler);
    this.switchAccBtn.onClick(this, this.onSwitchAccountHandler);
    this.settingBtn.onClick(this, this.onLoginSetting);
    this.btnAge.onClick(this, this.onAge);
    this.privacyCheck.onClick(this, this.onPrivacyHandler);
    this.serverInfoItem.changeServerBtn &&
      this.serverInfoItem.changeServerBtn.onClick(this, this.onSelectServer);
    this.txtprivacy.on(Laya.Event.LINK, this, this.onPrivacyLink);
    NotificationManager.Instance.addEventListener(
      SelectServerEvent.CHANGE,
      this.onChangeServer,
      this,
    );
    NotificationManager.Instance.addEventListener(
      WebViewEvent.RECEIVE_DATA,
      this.webLoginCallback,
      this,
    );
    NotificationManager.Instance.addEventListener(
      NativeEvent.AFTER_STATUS_BAR_CHANGE,
      this.onAfterStatusBarChange,
      this,
    );
    this.txtCompany.on(Laya.Event.LINK, this, this.onCompanyLink);
  }

  offEvent() {
    this.btnEnterGame.offClick(this, this.onEnterGame);
    this.btnLoginGame.offClick(this, this.onLoginGame);
    this.announceBtn.offClick(this, this.onAnnounceHandler);
    this.switchAccBtn.offClick(this, this.onSwitchAccountHandler);
    this.settingBtn.offClick(this, this.onLoginSetting);
    this.btnAge.offClick(this, this.onAge);
    this.privacyCheck.offClick(this, this.onPrivacyHandler);
    this.serverInfoItem.changeServerBtn &&
      this.serverInfoItem.changeServerBtn.offClick(this, this.onSelectServer);
    this.txtprivacy.off(Laya.Event.LINK, this, this.onPrivacyLink);
    NotificationManager.Instance.removeEventListener(
      SelectServerEvent.CHANGE,
      this.onChangeServer,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      WebViewEvent.RECEIVE_DATA,
      this.webLoginCallback,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      NativeEvent.AFTER_STATUS_BAR_CHANGE,
      this.onAfterStatusBarChange,
      this,
    );
    this.txtCompany.off(Laya.Event.LINK, this, this.onCompanyLink);
  }

  private onCompanyLink(evtData: string) {
    let urlLink = evtData;
    if (!urlLink || urlLink == "") return;
    SDKManager.Instance.getChannel().openURL(urlLink);
  }

  private onPrivacyLink(evtData: string) {
    let textData = evtData;
    if (!textData || textData == "") return;
    let clickType = textData;
    UIManager.Instance.ShowWind(EmWindow.HTMLWnd, clickType);
  }

  /**隐私协议 */
  onPrivacyHandler() {
    let privacyState = this.privacyCheck.selected;
    SharedManager.Instance.privacyState = String(privacyState);
  }

  /**适龄提示 */
  onAge() {
    UIManager.Instance.ShowWind(EmWindow.StatutoryAge);
  }

  /**切换账号 */
  onSwitchAccountHandler() {
    SimpleAlertHelper.Instance.Show(
      null,
      null,
      null,
      LangManager.Instance.GetTranslation("Login.SwitchAccountTip"),
      null,
      null,
      (b) => {
        if (b) {
          if (Utils.isAndroid()) {
            this.clearUserData();
            SDKManager.Instance.getChannel().logout(true);
          } else if (Utils.isIOS()) {
            SDKManager.Instance.getChannel().logout(true);
          }
        }
      },
    );
  }

  /**登陆设置 */
  onLoginSetting() {
    FrameCtrlManager.Instance.open(EmWindow.LoginSetting);
  }

  /**清理用户数据 */
  private clearUserData() {
    this.userName = "";
    this.userSite = "";
    this._appData = null;
    SharedManager.Instance.setProperty(
      "userName",
      this.userName,
      "userDate",
      new Date(),
    );
    ModelMgr.Instance.clear(EmModel.USER_MODEL);
    this.loginState.selectedIndex = 0;
  }

  /**APP登录回调 */
  webLoginCallback(appData) {
    // Laya.Browser.window.alert("App登录回调数据22" + appData);
    this._appData = appData;
    if (appData) {
      this.userName = appData.userId;
    }

    let platform = 0;
    let channelId = appData["channelId"];
    if (Utils.isIOS()) {
      platform = this.getUserPID("IOS");
    } else {
      platform = Number(channelId);
    }
    this.loginState.selectedIndex = 0;
    Logger.warn("webLoginCallback   ###############:", appData);
    if (
      !Number.isNaN(platform) &&
      platform > 0 &&
      this.userName &&
      this.userName != "" &&
      this.userName != "-1"
    ) {
      this.showMaskLogin(true);
      let date: Date = new Date();
      SharedManager.Instance.setProperty(
        "userName",
        this.userName,
        "userDate",
        date,
      );
      ModelMgr.Instance.setProperty(
        EmModel.USER_MODEL,
        UserModelAttribute.channelId,
        channelId,
      );
      this.setPrivacyState();
      let shareState = SharedManager.Instance.privacyState;
      if (Utils.isYYBApp()) {
        //应用宝默认不勾选
        shareState = shareState ? "true" : "false";
      }
      this.privacyCheck.selected = shareState == "false" ? false : true;
      this.requestServerList(platform, this.userName);
    } else {
      this.showMaskLogin(false);
    }
  }

  private setPrivacyState() {
    this.privacy.selectedIndex =
      Utils.isYYBApp() ||
      Utils.isOppoApp() ||
      Utils.isFromHY() ||
      Utils.isFrom4399() ||
      Utils.isQQHall() ||
      Utils.isQQZone() ||
      Utils.isQQMobile() ||
      Utils.isHUAWEIRY()
        ? 1
        : 0;
  }

  /**
   * 请求服务器列表
   * @param platformid 平台ID
   * @param username 玩家昵称
   */
  requestServerList(
    platformid: number | string,
    username?: string,
    useSite?: boolean,
  ) {
    if (Utils.isWxMiniGame()) {
      platformid = 20380;
    }
    Logger.warn("requestServerList   ###############:", platformid, username);
    let zoneData = getZoneData();
    if (isOversea() && !useSite) {
      //海外版本采用平台ID
      platformid = zoneData.platformID;
    }
    this.requestPID = platformid;
    let args = {};
    args["username"] = username;
    let params: string = "";
    if (useSite) {
      args["site"] = platformid;
      args["sign"] = MD5Utils.md5(
        String(platformid) + username + this.RSAKey,
      ).toUpperCase();
      params = `site=${platformid}&username=${username}&sign=${args["sign"]}`;
    } else {
      if (typeof platformid == "number") {
        args["channelid"] = platformid;
        args["sign"] = MD5Utils.md5(
          String(platformid) + username + this.RSAKey,
        ).toUpperCase();
        params = `channelid=${platformid}&username=${username}&sign=${args["sign"]}`;
      } else if (typeof platformid == "string") {
        args["platformid"] = platformid;
        args["sign"] = MD5Utils.md5(
          String(platformid) + username + this.RSAKey,
        ).toUpperCase();
        params = `platformid=${platformid}&username=${username}&sign=${args["sign"]}`;
      }
    }

    let sUrl = zoneData.siteOrder;
    // if (Utils.isWxMiniGame()) {
    //     sUrl = 'https://sq-h5-and0002.7road.net/order/';
    // }
    Logger.error("requestServerList:", sUrl, "--- params:", params);
    SDKManager.Instance.getChannel().trackEvent(
      0,
      TrackEventNode.Node_1007,
      "请求区服列表",
      "请求区服列表",
      "",
      "",
    );
    HttpUtils.httpRequest(
      sUrl,
      "clientsiteinfoservlet",
      params,
      "POST",
      "arraybuffer",
      () => {
        this.reRequestServerList();
      },
    ).then((data) => {
      let serverInfo: string = "";
      if (data) {
        try {
          let content: ByteArray = new ByteArray();
          content.writeArrayBuffer(data);
          if (content && content.length) {
            content.position = 0;
            content.uncompress();
            serverInfo = content.readUTFBytes(content.bytesAvailable);
            content.clear();
            this.serverListData = new ServerListData();
            this.serverListData.parse(serverInfo);
            //解析服务器列表信息
            Logger.base("服务器信息:", this.serverListData);
            if (this.serverListData.ret < 0) {
              this.serverInfoItem.changeServerBtn.enabled = false;
              MessageTipManager.Instance.show(
                LangManager.Instance.GetTranslation(
                  "login.failedReadServerList",
                ) +
                  "(" +
                  this.serverListData.ret +
                  ")",
              );
              return;
            }
            SDKManager.Instance.getChannel().trackEvent(
              0,
              TrackEventNode.Node_1008,
              "请求区服列表成功",
              "请求区服列表成功",
              "",
              "",
            );
            this.serverInfoItem.changeServerBtn.enabled = true;
            let zoneData = getZoneData();
            PlayerManager.Instance.currentPlayerModel.userInfo.user =
              this.userName;
            PlayerManager.Instance.currentPlayerModel.userInfo.isWhiteUser =
              this.serverListData.isWhiteUser;
            PlayerManager.Instance.currentPlayerModel.userInfo.platformId =
              this.serverListData.platformId;
            PlayerManager.Instance.currentPlayerModel.userInfo.area =
              zoneData.area;
            PlayerManager.Instance.currentPlayerModel.userInfo.platformName =
              this.serverListData.platformName;
            PlayerManager.Instance.currentPlayerModel.userInfo.user =
              this.userName;
            //添加默认选择服务器(优先历史登录记录,再次服务器列表第一个)
            let siteInfo = null;
            let isSwitchSite = window.localStorage.getItem("isSwitchSite");
            let localSite = window.localStorage.getItem("siteData");
            if (isSwitchSite == "true" && localSite) {
              siteInfo = JSON.parse(localSite);
            } else {
              siteInfo = this.serverListData.recentLoginServer
                ? this.serverListData.recentLoginServer
                : this.serverListData.defaultSelectServer;
            }
            this.setServerInfo(siteInfo);
            this.showMaskLogin(false);
            this.loginState.selectedIndex = 1;
            if (this.objData.isWan) {
              //wan平台时间验证
              this.btnEnterGame.enabled = !this.checkLoginOverTime;
            }
            this.gmBtn.visible =
              (Utils.isWanApp() || Utils.isWebWan() || this.objData.isDebug) &&
              !ComponentSetting.IOS_VERSION;
            this.autoEnterGame(); //自动登陆
          }
        } catch (error) {
          Logger.error(error.message);
          this.showMaskLogin(false);
          return;
        }
      } else {
        this.showMaskLogin(false);
      }
    });
  }

  /**重试请求服务器列表 */
  private reRequestServerList() {
    if (this.requestServerTimes <= this.requestServerMaxTimes) {
      this.requestServerTimes++;
      this.requestServerList(
        this.requestPID,
        this.userName,
        this.userSite != "",
      );
    } else {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("login.failedReadServerList"),
      );
      SDKManager.Instance.getChannel().showNetworkAlert();
      Logger.yyz("重试请求服务器列表失败！！");
    }
  }

  /**打开选服UI */
  onSelectServer() {
    if (this.serverListData && this.serverListData.ret >= 0) {
      SDKManager.Instance.getChannel().trackEvent(
        0,
        TrackEventNode.Node_1009,
        "点击选择区服列表",
        "点击选择区服列表",
        "",
        "",
      );
      UIManager.Instance.ShowWind(EmWindow.ServerlistWnd, this.serverListData);
    }
  }

  /**切换服务器 */
  onChangeServer(serverData: ServerSite) {
    if (serverData) {
      SDKManager.Instance.getChannel().trackEvent(
        0,
        TrackEventNode.Node_1010,
        "选择确认区服",
        "选择确认区服",
        "",
        "",
      );
      UIManager.Instance.HideWind(EmWindow.ServerlistWnd);
      this.setServerInfo(serverData);
    }
  }

  /**设置选择服务器信息 */
  private selectSite: string = "";
  private selectSiteId: number = 0;
  private selectServerData: ServerSite = null;
  setServerInfo(serverData: ServerSite) {
    if (serverData) {
      this.selectServerData = serverData;
      this.serverInfoItem.setServer(serverData);
      //存储当前选择角色信息
      ModelMgr.Instance.setProperty(
        EmModel.USER_MODEL,
        UserModelAttribute.userId,
        serverData.playinfo,
      );
      this.btnEnterGame.enabled = true;
      //贪玩渠道上报选择服务器的游戏事件
      let channelId: number = Number(
        ModelMgr.Instance.getProperty(
          EmModel.USER_MODEL,
          UserModelAttribute.channelId,
        ),
      );
      if (channelId == 20370 || Utils.isH5SDK() || Utils.isWxMiniGame()) {
        let siteDate = {
          gameZoneId: serverData.siteId,
          gameZoneName: serverData.siteName,
        };
        SDKManager.Instance.getChannel().postGameEvent(
          GameEventCode.Code_1023,
          JSON.stringify(siteDate),
        );
      }
      PathManager.info.SocktPath = serverData.loginUrl; //登录地址
      PathManager.info.REQUEST_PATH = serverData.webUrl; //web请求路径
      ComponentSetting.TEMPLATE_PATH = PathManager.info.TEMPLATE_PATH;
      this.selectSiteId = serverData.siteId;
      this.selectSite = serverData.siteName;
      ComponentSetting.VERTION_PATH =
        PathManager.info.TEMPLATE_PATH + "version.json";
      if (ComponentSetting.IS_BACK_FROM_REGISTER) {
        ComponentSetting.IS_BACK_FROM_REGISTER = false;
        this.onSelectServer();
      }
      let hasPlayer =
        this.serverListData && this.serverListData.hasPlayer ? true : false;
      if (
        PathManager.info.TEMPLATE_PATH != "" &&
        this.userName != null &&
        this.userName != "" &&
        hasPlayer &&
        !Utils.isFrom4399()
      )
        this.onAnnounceHandler();
    }
  }

  private get checkLoginOverTime() {
    let wanTamp = Number(this.userData.tamp); //玩平台时间戳na
    let curServerTamp = this.serverListData.curTime; //当前服务器时间戳
    if (Math.abs(curServerTamp - wanTamp) > 120000) {
      //超出120S,不允许登录
      return true;
    }
    return false;
  }

  async onDirtyLib() {
    await FilterWordManager.startup();
  }

  OnShowWind() {
    super.OnShowWind();
    SDKManager.Instance.getChannel().trackEvent(
      0,
      TrackEventNode.Node_1006,
      "进入登录界面",
      "进入登录界面",
      "",
      "",
    );
    let channel: BaseChannel = SDKManager.Instance.getChannel();
    if (channel instanceof NativeChannel) {
      let zoneData = getZoneData();
      if (zoneData && !isOversea() && !NativeChannel.appSplashClosed) {
        channel.loginSceneEnterOver();
      } else {
        channel.gameEnterOver();
        if (NativeChannel.appSplashClosed) {
          channel.selectSiteOver(JSON.stringify(zoneData));
        }
      }
    }
    if (ComponentSetting.VERSION_COMPARE) VersionUtils.checkVersion();
  }

  /**登陆游戏 */
  onLoginGame() {
    this.showMaskLogin();
    SDKManager.Instance.getChannel().showLogin();
  }

  private showMaskLogin(value: boolean = true) {
    this.maskLoginCtrl.selectedIndex = value ? 1 : 0;
  }

  private TimeOutID: any = 0;

  /**进入游戏 */
  onEnterGame() {
    Laya.timer.clear(this, this.onEnterGame);
    SDKManager.Instance.getChannel().trackEvent(
      0,
      TrackEventNode.Node_1011,
      "进入游戏",
      "点击登陆界面的进入游戏按钮（包括不成功）",
      "",
      "",
    );
    if (!this.checkPrivacy()) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("login.privacy"),
      );
      return;
    }
    if (!this.serverInfoItem.serverInfo) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("login.pleaseSelectServer"),
      );
      return;
    }
    //非白名单用户  并且服务器未开启
    if (!this.serverListData.isWhiteUser) {
      if (!this.serverInfoItem.serverInfo.isOpen) {
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation("login.serverNotOpen"),
        );
        return;
      }
      if (this.serverInfoItem.serverInfo.isRepair) {
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation("login.serverMaintenance"),
        );
        return;
      }
    }
    FrameCtrlManager.Instance.exit(EmWindow.Announce);
    PlayerManager.Instance.currentPlayerModel.openServerTime =
      this.serverInfoItem.serverInfo.openTime;
    /***正式服和beta测试服判断***/
    let betaSites = PathManager.info.BETA_SITES;
    let versionType: VerType =
      betaSites.indexOf(this.selectServerData.mainSite) >= 0
        ? SITE_MODE.BETA
        : SITE_MODE.RELEASE;
    let needAlert = PathManager.info.RELOAD_ALERT;
    if (
      !Utils.isWxMiniGame() &&
      checkNeedReload &&
      checkNeedReload(versionType)
    ) {
      if (needAlert) {
        var prompt: string =
          LangManager.Instance.GetTranslation("public.prompt");
        var confirm1: string =
          LangManager.Instance.GetTranslation("public.confirm");
        var cancel1: string =
          LangManager.Instance.GetTranslation("public.cancel");
        let msg = LangManager.Instance.GetTranslation("switchVersion.tip");
        SimpleAlertHelper.Instance.Show(
          SimpleAlertHelper.SIMPLE_ALERT,
          null,
          prompt,
          msg,
          confirm1,
          cancel1,
          (ok: boolean) => {
            if (ok) {
              this.reloadGame(versionType);
            } else {
              UIManager.Instance.ShowWind(
                EmWindow.ServerlistWnd,
                this.serverListData,
              );
            }
          },
        );
      } else {
        this.reloadGame(versionType);
      }
      return;
    }

    this.btnEnterGame.enabled = false;
    if (this.objData.isWan && this.checkLoginOverTime) {
      FrameCtrlManager.Instance.exit(EmWindow.Waiting);
      return;
    }
    SDKManager.Instance.getChannel().adjustEvent(RPT_EVENT.ENTER_GAME);
    this.onDirtyLib();
    this.showMaskLogin();
    GameManager.Instance.lunch(new Func(this, this.launchCallBack));
  }

  private reloadGame(versionType) {
    Utils.delay(300).then(() => {
      gotoVersionAndReload(versionType, JSON.stringify(this.selectServerData));
    });
  }

  private launchCallBack() {
    this.TimeOutID = setTimeout(() => {
      if (this.btnEnterGame) {
        this.btnEnterGame.enabled = true;
      }
      this.showMaskLogin(false);
    }, 15000);
    let tempPassword = String(Math.floor(Math.random() * 10000000));
    let userInfo: UserInfo = PlayerManager.Instance.currentPlayerModel.userInfo;
    userInfo.user = this.userName;
    userInfo.password = "123456";
    userInfo.tempPassword = tempPassword;

    //this.serverInfoItem.serverInfo  为空
    userInfo.mainSite = this.serverInfoItem.serverInfo.mainSite;
    userInfo.site = this.serverInfoItem.serverInfo.siteName;
    userInfo.siteId = this.serverInfoItem.serverInfo.siteId;
    userInfo.userId = 0;
    if (this.userData && this.userData.from) {
      let loginKey = userInfo.loginKey;
      if (Utils.isFCC()) {
        loginKey = this.userData.key;
        userInfo.loginKey = loginKey;
      } else {
        userInfo.loginKey = String(Math.floor(Math.random() * 10000000));
      }
    } else {
      userInfo.loginKey = String(Math.floor(Math.random() * 10000000));
    }
    userInfo.isActive = false;
    userInfo.noviceProcess = 0;
    let key: string = String(Math.floor(Math.random() * 10000000));
    ModelMgr.Instance.setProperty(
      EmModel.USER_MODEL,
      UserModelAttribute.userName,
      userInfo.user,
    );
    ModelMgr.Instance.setProperty(
      EmModel.USER_MODEL,
      UserModelAttribute.password,
      userInfo.password,
    );
    ModelMgr.Instance.setProperty(
      EmModel.USER_MODEL,
      UserModelAttribute.tempPassword,
      userInfo.tempPassword,
    );
    ModelMgr.Instance.setProperty(
      EmModel.USER_MODEL,
      UserModelAttribute.loginKey,
      userInfo.loginKey,
    );
    ModelMgr.Instance.setProperty(
      EmModel.USER_MODEL,
      UserModelAttribute.site,
      this.serverInfoItem.serverInfo.siteName,
    );
    ModelMgr.Instance.setProperty(
      EmModel.USER_MODEL,
      UserModelAttribute.key,
      key,
    );
    ModelMgr.Instance.setProperty(
      EmModel.USER_MODEL,
      UserModelAttribute.site,
      this.selectSite,
    );
    SDKManager.Instance.getChannel().createLoginReq(
      userInfo.user,
      userInfo.loginKey,
      this.serverInfoItem.serverInfo.siteName,
      this.serverInfoItem.serverInfo.siteId,
      this._appData,
    );
  }

  /**打开公告 */
  onAnnounceHandler() {
    AnnounceCtrl.Instance.reqVersionData().then((ret) => {
      if (ret) FrameCtrlManager.Instance.open(EmWindow.Announce, ret);
    });
  }

  /**打开客服 */
  gmBtnClick() {
    if (isOversea()) {
      SDKManager.Instance.getChannel().openCustomerService();
    } else {
      let title: string = LangManager.Instance.GetTranslation("public.prompt");
      let contentTip: string = "";
      if (isOversea()) {
        //discord
        contentTip = "CustomerService.gmtip";
      } else {
        //qq
        contentTip = "CustomerService.gmtip_QQ";
      }
      let content: string = LangManager.Instance.GetTranslation(contentTip);
      UIManager.Instance.ShowWind(EmWindow.Help, {
        title: title,
        content: content,
      });
    }
  }

  /**切换大区 */
  switchSiteBtnClick() {
    FrameCtrlManager.Instance.open(EmWindow.SiteZone);
  }

  /**自动进入游戏 */
  private autoEnterGame() {
    if (!Utils.isQQHall()) {
      return;
    }
    Laya.timer.once(30000, this, this.onEnterGame);
  }

  OnHideWind() {
    super.OnHideWind();
    clearTimeout(this.TimeOutID);
    Laya.timer.clear(this, this.onEnterGame);
    this.offEvent();
  }

  dispose(dispose?: boolean): void {
    LoginLoad.destorySpine();
    super.dispose(dispose);
  }
}
