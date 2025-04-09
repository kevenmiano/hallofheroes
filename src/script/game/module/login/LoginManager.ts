// TODO FIX
import GameEventDispatcher from "../../../core/event/GameEventDispatcher";
import LangManager from "../../../core/lang/LangManager";
import Logger from "../../../core/logger/Logger";
import { GameSocket } from "../../../core/net/GameSocket";
import { LoginSocketManager } from "../../../core/net/LoginSocketManager";
import { PackageIn } from "../../../core/net/PackageIn";
import { PackageOut } from "../../../core/net/PackageOut";
import { ServerDataManager } from "../../../core/net/ServerDataManager";
import { SocketManager } from "../../../core/net/SocketManager";
import SDKManager from "../../../core/sdk/SDKManager";
import UIManager from "../../../core/ui/UIManager";
import MD5Utils from "../../../core/utils/MD5Utils";
import SimpleAlertHelper, {
  AlertBtnType,
} from "../../component/SimpleAlertHelper";
import { PlayerEvent } from "../../constant/event/PlayerEvent";
import { GameEventCode } from "../../constant/GameEventCode";
import LoginResult, { PREPARE_LOGIN_RESULT } from "../../constant/LoginResult";
import { EmModel } from "../../constant/model/modelDefine";
import { UserModelAttribute } from "../../constant/model/UserModelParams";
import { C2SProtocol } from "../../constant/protocol/C2SProtocol";
import { S2CProtocol } from "../../constant/protocol/S2CProtocol";
import { EmWindow } from "../../constant/UIDefine";
import { UserInfo } from "../../datas/userinfo/UserInfo";
import GameManager from "../../manager/GameManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import ModelMgr from "../../manager/ModelMgr";
import { PlayerManager } from "../../manager/PlayerManager";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import Utils from "../../../core/utils/Utils";
import { HintWnd } from "../common/HintWnd";
import { SceneManager } from "../../map/scene/SceneManager";
import { SharedManager } from "../../manager/SharedManager";

import NoviceReqMsgMsg = com.road.yishi.proto.novice.NoviceReqMsgMsg;
import createLoginReq = com.road.yishi.proto.login.createLoginReq;
import createLoginRsp = com.road.yishi.proto.login.createLoginRsp;
import GetPlayerListReq = com.road.yishi.proto.login.GetPlayerListReq;
import GetPlayerListRsp = com.road.yishi.proto.login.GetPlayerListRsp;
import playerLoginReq = com.road.yishi.proto.login.playerLoginReq;
import playerLoginRsp = com.road.yishi.proto.login.playerLoginRsp;
import LoginReqMsg = com.road.yishi.proto.player.LoginReqMsg;
import SimpleUserInfo = com.road.yishi.proto.login.SimpleUserInfo;
import registerRoleReq = com.road.yishi.proto.login.registerRoleReq;
import registerRoleRsp = com.road.yishi.proto.login.registerRoleRsp;
import GatewayMsg = com.road.yishi.proto.gateway.GatewayMsg;
import PlayerDataMsg = com.road.yishi.proto.player.PlayerDataMsg;
import SynchronizedTimeReq = com.road.yishi.proto.login.SynchronizedTimeReq;
import { EmLayer } from "../../../core/ui/ViewInterface";
import { getdefaultLangageCfg } from "../../../core/lang/LanguageDefine";
import WeakNetCheckModel from "../../../core/check/WeakNetCheckModel";
import { GoodsManager } from "../../manager/GoodsManager";
import { ResourceManager } from "../../manager/ResourceManager";
import { ShopManager } from "../../manager/ShopManager";
import LayerMgr from "../../../core/layer/LayerMgr";
import { StarManager } from "../../manager/StarManager";
import { ArmyManager } from "../../manager/ArmyManager";
import { getZoneData } from "./manager/SiteZoneCtrl";
import MarketManager from "../../manager/MarketManager";
import EmailSocketOutManager from "../../manager/EmailSocketOutManager";
import EmailManager from "../../manager/EmailManager";
import OfferRewardManager from "../../manager/OfferRewardManager";
import { WorldBossHelper } from "../../utils/WorldBossHelper";
import { CampaignManager } from "../../manager/CampaignManager";
import { PlayerBufferManager } from "../../manager/PlayerBufferManager";
import WorldBossManager from "../../manager/WorldBossManager";

export class LoginManager extends GameEventDispatcher {
  private static _instance: LoginManager;
  public loginOther: boolean = false;

  public loginAccountParams: any;

  private _waitLoginAlert: HintWnd; //弹窗等待

  private loginWaitTime: number = 0; //登录等待时间

  private loginWaitUsers: number = 0; //登录等待人数

  public hasLogin: boolean = false;

  public static get Instance(): LoginManager {
    if (!this._instance) {
      this._instance = new LoginManager();
    }
    return this._instance;
  }

  public setup() {
    ServerDataManager.listen(
      S2CProtocol.U_L_GET_PLAYER_LIST,
      this,
      this.s2c_get_player_list
    );
    ServerDataManager.listen(
      S2CProtocol.U_L_PREPARE_LOGIN,
      this,
      this.s2c_prepare_login
    );
    ServerDataManager.listen(
      S2CProtocol.U_L_REGISTER_ROLE_RSP,
      this,
      this.s2c_register_role
    );
    ServerDataManager.listen(
      S2CProtocol.U_G_LOGIN_OTHER,
      this,
      this.s2c_login_other
    );
    ServerDataManager.listen(
      S2CProtocol.U_L_CREATE_LOGIN_RSP,
      this,
      this.s2c_createLoginRsp
    );
    ServerDataManager.listen(
      S2CProtocol.U_G_LOGIN_GATEWAY,
      this,
      this.s2c_LoginRsp
    );
  }

  public removeEvent() {
    ServerDataManager.cancel(
      S2CProtocol.U_L_GET_PLAYER_LIST,
      this,
      this.s2c_get_player_list
    );
    ServerDataManager.cancel(
      S2CProtocol.U_L_PREPARE_LOGIN,
      this,
      this.s2c_prepare_login
    );
    ServerDataManager.cancel(
      S2CProtocol.U_L_REGISTER_ROLE_RSP,
      this,
      this.s2c_register_role
    );
    ServerDataManager.cancel(
      S2CProtocol.U_G_LOGIN_OTHER,
      this,
      this.s2c_login_other
    );
    ServerDataManager.cancel(
      S2CProtocol.U_L_CREATE_LOGIN_RSP,
      this,
      this.s2c_createLoginRsp
    );
    ServerDataManager.cancel(
      S2CProtocol.U_G_LOGIN_GATEWAY,
      this,
      this.s2c_LoginRsp
    );
  }

  /**
   * 同步系统时间
   */
  public synchronizedSystime() {
    Laya.stage.clearTimer(this, this.__timeUpdateHandler);
    Laya.stage.timerLoop(1000, this, this.__timeUpdateHandler);
    this.__timeUpdateHandler();
  }

  public clearCheckAccelerator() {
    this.count = 0;
    Laya.stage.clearTimer(this, this.__timeUpdateHandler);
  }

  private count: number = 0;

  private __timeUpdateHandler() {
    this.count++;
    PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond++;
    this.dispatchEvent(PlayerEvent.SYSTIME_UPGRADE_SECOND, null);
    let leftTime: number =
      PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond % 3600;
    if (leftTime % WeakNetCheckModel.heatbeatTime == 0) {
      LoginManager.Instance.sendSysTime();
      let curTime: Date = PlayerManager.Instance.currentPlayerModel.sysCurtime;
      this.dispatchEvent(PlayerEvent.SYSTIME_UPGRADE_MINUTE, null);
    }
    if (leftTime == 0) {
      if (
        PlayerManager.Instance.currentPlayerModel.sysCurtime.getDate() !=
        PlayerManager.Instance.currentPlayerModel.sysCurtime.getDate()
      ) {
        this.dispatchEvent(PlayerEvent.SYSTIME_UPGRADE_DATE, null);
      }
    }
  }

  private sendSysTime() {
    Logger.base(
      "请求同步============================= :  " + Laya.Browser.now()
    );

    let userName = ModelMgr.Instance.getProperty(
      EmModel.USER_MODEL,
      UserModelAttribute.userName
    );
    let site = ModelMgr.Instance.getProperty(
      EmModel.USER_MODEL,
      UserModelAttribute.site
    );
    let msg: SynchronizedTimeReq = new SynchronizedTimeReq();
    msg.userName = userName;
    msg.site = site;
    LoginSocketManager.Instance.send(S2CProtocol.L_SYNC_TIME, msg);
  }

  /**
   * 加速检测
   *
   */
  public checkAccelerator() {
    LoginSocketManager.Instance.send(C2SProtocol.C_CHECK_ACCELERATOR);
  }

  /**
   * 初始化登录流程
   */
  public c2s_createLoginReq(
    userName: string,
    pass: string,
    site: string,
    siteId: number,
    from: string,
    platId: number,
    appData: any = null
  ) {
    Logger.yyz("初始化登录流程, key:" + pass);
    let msg: createLoginReq = new createLoginReq();
    msg.userName = userName;
    msg.pass = pass;
    msg.site = site;
    msg.from = from;
    msg.siteId = siteId;
    msg.platId = platId;
    // Laya.Browser.window.alert("appData:" + appData);
    if (appData) {
      for (const key in appData) {
        if (Object.prototype.hasOwnProperty.call(appData, key)) {
          let element = appData[key];
          if (element && element != "" && element != undefined)
            msg[key] = element;
        }
      }

      if (appData.sdkVersion) msg.clientVersion = appData.sdkVersion; // 11;//客户端版本

      if (appData.deviceInfo) {
        let deviceInfo: any = appData.deviceInfo;
        msg.deviceId = deviceInfo.deviceNo; // 10;// 设备id
        msg.systemSoftware = deviceInfo.operatorOs; //12;//移动终端操作系统版本
        msg.systemHardware = deviceInfo.model; // 13;//移动终端机型
      }
    }
    let langCfg = getdefaultLangageCfg();
    msg.clientLan = langCfg.index;
    let zoneData = getZoneData();
    if (zoneData) {
      msg.area = zoneData.area;
    }
    Logger.yyz("登录参数: ", appData);
    LoginSocketManager.Instance.send(C2SProtocol.L_CREATE_LOGIN, msg);
  }

  /**
   * 创建登录信息返回
   * @param pkg
   */
  private s2c_createLoginRsp(pkg: PackageIn) {
    let data: createLoginRsp = pkg.readBody(createLoginRsp);
    Logger.yyz("创建登录信息返回:" + data.result);
    switch (data.result) {
      case LoginResult.SUCCEED:
        let loginKey = ModelMgr.Instance.getProperty(
          EmModel.USER_MODEL,
          UserModelAttribute.loginKey
        );
        LoginManager.Instance.c2s_get_player_list(
          data.userName,
          loginKey,
          data.site
        ); //请求玩家列表
        //开启检测心跳
        LoginSocketManager.Instance.crateWeak();
        //开始发心跳包
        this.synchronizedSystime();
        break;
      case LoginResult.OTHER_ERROR:
        //其他错误
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation("login.otherError")
        );
        this.nativeReLogin();
        break;
      case LoginResult.CONTENT_ERROR:
        //地址栏参数个数不对
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation("login.addressParaCountError")
        );
        this.nativeReLogin();
        break;
      case LoginResult.IP_ERROR:
        //无效IP
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation("login.invalidIP")
        );
        this.nativeReLogin();
        break;
      case LoginResult.SITE_ERROR:
        //代理商错误
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation("login.agentError")
        );
        this.nativeReLogin();
        break;
      case LoginResult.LOGIN_ERROR:
        //加密不正确
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation("login.incorrectEncryption")
        );
        this.nativeReLogin();
        break;
      case LoginResult.WEBCASTLE_ERROR:
        //注册服务不正确
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation(
            "login.registrationServiceIncorrect"
          )
        );
        this.nativeReLogin();
        break;
      case LoginResult.VERIFY_ERROR:
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation("login.verityError")
        );
        this.nativeReLogin();
        break;
      case LoginResult.SITE_CLOSE:
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation("site.close")
        );
        break;
      default:
        break;
    }
  }

  private nativeReLogin() {
    Logger.yyz("创建登录信息返回错误, 准备重新登录SDK");
    if (Utils.isApp()) {
      let userInfo: UserInfo =
        PlayerManager.Instance.currentPlayerModel.userInfo;
      userInfo.loginKey = String(Math.floor(Math.random() * 10000000));
      ModelMgr.Instance.setProperty(
        EmModel.USER_MODEL,
        UserModelAttribute.loginKey,
        userInfo.loginKey
      );
      SDKManager.Instance.getChannel().autoLogin();
    }
  }

  /**
   * 获取角色列表
   * @param userName
   * @param key
   * @param site
   */
  public c2s_get_player_list(userName: string, key: string, site: string) {
    Logger.yyz("获取角色列表, key:" + key);
    let msg: GetPlayerListReq = new GetPlayerListReq();
    msg.userName = userName;
    msg.key = key;
    msg.site = site;
    LoginSocketManager.Instance.send(C2SProtocol.L_GET_PLAYER_LIST, msg);
  }

  /**
   * 返回角色列表
   * @param pkg
   * @private
   */
  private s2c_get_player_list(pkg: PackageIn) {
    let data: GetPlayerListRsp = pkg.readBody(GetPlayerListRsp);
    if (data.loginState >= 0) {
      ModelMgr.Instance.setProperty(
        EmModel.USER_MODEL,
        UserModelAttribute.userInfoList,
        data.infoList
      );
      ModelMgr.Instance.setProperty(
        EmModel.USER_MODEL,
        UserModelAttribute.userName,
        data.userName
      );
      ModelMgr.Instance.setProperty(
        EmModel.USER_MODEL,
        UserModelAttribute.site,
        data.site
      );
      ModelMgr.Instance.setProperty(
        EmModel.USER_MODEL,
        UserModelAttribute.loginState,
        data.loginState
      );

      let loginKey = ModelMgr.Instance.getProperty(
        EmModel.USER_MODEL,
        UserModelAttribute.loginKey
      );
      let userinfo: SimpleUserInfo = ModelMgr.Instance.getProperty(
        EmModel.USER_MODEL,
        UserModelAttribute.userInfoList
      )[0] as SimpleUserInfo;

      let userInfo: UserInfo =
        PlayerManager.Instance.currentPlayerModel.userInfo;
      let playerInfo = PlayerManager.Instance.currentPlayerModel.playerInfo;
      playerInfo.site = ModelMgr.Instance.getProperty(
        EmModel.USER_MODEL,
        UserModelAttribute.site
      );
      userInfo.isActive = true;
      let newPassword = String(Math.floor(Math.random() * 10000000));
      userInfo.loginKey = newPassword;
      ModelMgr.Instance.setProperty(
        EmModel.USER_MODEL,
        UserModelAttribute.password,
        newPassword
      );
      let userId = 0;
      if (userinfo && userinfo.userId) {
        userId = userinfo.userId;
      }
      ModelMgr.Instance.setProperty(
        EmModel.USER_MODEL,
        UserModelAttribute.userId,
        userId
      );
      LoginManager.Instance.c2s_prepare_login(
        data.userName,
        loginKey,
        newPassword,
        data.site,
        userId
      );
    } else {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("login.otherError")
      );
    }
  }

  /**
   * 排队等待重新连接服务器
   */
  private reLoginServer() {
    let userName = ModelMgr.Instance.getProperty(
      EmModel.USER_MODEL,
      UserModelAttribute.userName
    );
    let site = ModelMgr.Instance.getProperty(
      EmModel.USER_MODEL,
      UserModelAttribute.site
    );

    let loginKey = ModelMgr.Instance.getProperty(
      EmModel.USER_MODEL,
      UserModelAttribute.loginKey
    );
    let userinfo: SimpleUserInfo = ModelMgr.Instance.getProperty(
      EmModel.USER_MODEL,
      UserModelAttribute.userInfoList
    )[0] as SimpleUserInfo;

    let userInfo: UserInfo = PlayerManager.Instance.currentPlayerModel.userInfo;
    let playerInfo = PlayerManager.Instance.currentPlayerModel.playerInfo;
    playerInfo.site = ModelMgr.Instance.getProperty(
      EmModel.USER_MODEL,
      UserModelAttribute.site
    );
    userInfo.isActive = true;
    let newPassword = String(Math.floor(Math.random() * 10000000));
    userInfo.loginKey = newPassword;
    ModelMgr.Instance.setProperty(
      EmModel.USER_MODEL,
      UserModelAttribute.password,
      newPassword
    );
    let userId = ModelMgr.Instance.getProperty(
      EmModel.USER_MODEL,
      UserModelAttribute.userId
    );
    LoginManager.Instance.c2s_prepare_login(
      userName,
      loginKey,
      newPassword,
      site,
      userId
    );
  }

  /**
   * 准备登录
   * @param userName
   * @param loginKey
   * @param password
   * @param site
   * @param userId
   */
  public c2s_prepare_login(
    userName: string,
    loginKey: string,
    password: string,
    site: string,
    userId: number
  ) {
    Logger.yyz("准备登录, key:" + loginKey);
    let msg: playerLoginReq = new playerLoginReq();
    msg.userName = userName;
    msg.loginKey = loginKey;
    msg.password = password;
    msg.site = site;
    msg.userId = userId;
    LoginSocketManager.Instance.send(C2SProtocol.L_PREPARE_LOGIN, msg);
  }

  /**
   * 准备登录反馈
   * @param pkg
   * @private
   */
  private s2c_prepare_login(pkg: PackageIn) {
    let data: playerLoginRsp = pkg.readBody(playerLoginRsp) as playerLoginRsp;
    if (data.result) {
      ModelMgr.Instance.setProperty(
        EmModel.USER_MODEL,
        UserModelAttribute.userName,
        data.userName
      );
      ModelMgr.Instance.setProperty(
        EmModel.USER_MODEL,
        UserModelAttribute.site,
        data.site
      );
      ModelMgr.Instance.setProperty(
        EmModel.USER_MODEL,
        UserModelAttribute.userId,
        data.userId
      );
      ModelMgr.Instance.setProperty(
        EmModel.USER_MODEL,
        UserModelAttribute.gateIp,
        data.gateIp
      ); // 准备登录的网关IP
      ModelMgr.Instance.setProperty(
        EmModel.USER_MODEL,
        UserModelAttribute.port,
        data.port
      ); // 准备登录的网关端口
      SocketManager.Instance.setup();

      Logger.base("登录反馈:" + data.message + "=====" + data.userId);
      SharedManager.Instance.setWindowItem("bindAccountRet", "false");

      let userInfo: UserInfo =
        PlayerManager.Instance.currentPlayerModel.userInfo;
      userInfo.userId = data.userId;
      userInfo.todayFirstLogin = data.todayFirstLogin;
      if (userInfo.todayFirstLogin) {
        //如果是首次登录, 清掉丰收号角的点击缓存数据
        SharedManager.Instance.foisonHornClick = false;
        SharedManager.Instance.saveFoisonHornClick();
      }
      //注册推送
      SDKManager.Instance.getChannel().registerPush(userInfo.user);
      if (data.message == PREPARE_LOGIN_RESULT.SUCCEED_NOVISUALIZE) {
        //进入创角界面
        FrameCtrlManager.Instance.exit(EmWindow.Login);
        FrameCtrlManager.Instance.open(EmWindow.RegisterS);
      } else {
        PackageOut.clientId = data.userId;
        let callFunc = () => {
          // GameManager.Instance.checkAccelerator();
          LoginManager.Instance.c2s_login_gateway();
        };
        //关闭登录Socket
        LoginSocketManager.Instance.close();
        GameManager.Instance.onGameSocketConnect(
          data.gateIp,
          data.port,
          callFunc
        ); //登录网关服
      }
    } else {
      Logger.base("登录异常:" + data.message + "=====" + data.userId);
      if (data.message.indexOf("|") != -1) {
        let retDatas = data.message.split("|");
        let beforeWaitCount = Number(retDatas[0]);
        let waitSeconds = Number(retDatas[1]);
        this.loginWaitTime = waitSeconds / 1000;
        let waitUserCount = Number(retDatas[2]);
        if (waitSeconds == -2) {
          //关闭登录Socket
          LoginSocketManager.Instance.close();
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation("login.server.full")
          );
        } else {
          this.waitLoginServer();
          Laya.timer.loop(1000, this, this.waitLoginServer);
        }
      } else {
        FrameCtrlManager.Instance.exit(EmWindow.Waiting);
        LoginSocketManager.Instance.close();
        MessageTipManager.Instance.show(data.message);
      }
    }
  }

  private async waitLoginServer() {
    this.loginWaitTime--;
    if (this.loginWaitTime <= 0) {
      Laya.timer.clear(this, this.waitLoginServer);
      if (this._waitLoginAlert && this._waitLoginAlert.isShowing) {
        this._waitLoginAlert.hide();
      }
      this.reLoginServer();
      return;
    }
    if (this._waitLoginAlert == null || !this._waitLoginAlert.isShowing) {
      this._waitLoginAlert = await UIManager.Instance.ShowWind(
        EmWindow.HintWnd,
        LangManager.Instance.GetTranslation(
          "login.server.loginwait",
          this.loginWaitTime
        )
      );
    } else {
      this._waitLoginAlert.setHintText(
        LangManager.Instance.GetTranslation(
          "login.server.loginwait",
          this.loginWaitTime
        )
      );
    }
  }

  /**
   * 创建角色
   * @param userId
   * @param userName
   * @param nickName
   * @param sex
   * @param camp
   * @param icon
   * @param site
   * @param password
   */
  private registerTime: number = 0;
  public c2s_register_role(
    userId: number,
    userName: string,
    nickName: string,
    sex: number,
    camp: number,
    icon: number,
    site: string,
    password: string
  ) {
    Logger.yyz("创建角色   c2s_register_role: ");
    let msg: registerRoleReq = new registerRoleReq();
    msg.userId = userId;
    msg.userName = userName;
    msg.nickName = nickName;
    msg.sex = sex;
    msg.camp = camp;
    msg.icon = icon;
    msg.site = site;
    msg.md5Password = MD5Utils.md5(password);
    LoginSocketManager.Instance.send(C2SProtocol.L_REGISTER_ROLE, msg);
    this.registerTime = setTimeout(() => {
      Logger.log("创角超时:返回登陆.");
      this.clearRegisterTime();
      FrameCtrlManager.Instance.exit(EmWindow.Waiting);
      let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
      let confirm: string =
        LangManager.Instance.GetTranslation("public.logout");
      let content: string = LangManager.Instance.GetTranslation(
        "login.serverclosed.lost2"
      );
      SimpleAlertHelper.Instance.Show(
        SimpleAlertHelper.SIMPLE_ALERT,
        null,
        prompt,
        content,
        confirm,
        "",
        () => {
          SDKManager.Instance.getChannel().reload();
        },
        AlertBtnType.O,
        false,
        true,
        EmLayer.STAGE_TIP_LAYER
      );
      SceneManager.Instance.lock = true;
      return;
    }, 5000);
    FrameCtrlManager.Instance.open(EmWindow.Waiting);
  }

  public clearRegisterTime() {
    SimpleAlertHelper.Instance.Hide();
    clearTimeout(this.registerTime);
    this.registerTime = 0;
  }

  /**
   * 创建角色返回
   * @param pkg
   * @private
   */
  private s2c_register_role(pkg: PackageIn) {
    let data: registerRoleRsp = pkg.readBody(
      registerRoleRsp
    ) as registerRoleRsp;
    if (data.value) {
      FrameCtrlManager.Instance.open(EmWindow.Waiting);
      Logger.yyz("创建角色成功: " + data.message);
      Laya.timer.once(3000, this, () => {
        if (PlayerManager.Instance.currentPlayerModel.playerInfo.nickName) {
          SDKManager.Instance.getChannel().postGameEvent(
            GameEventCode.Code_1041
          );
        }
      });

      PackageOut.clientId = ModelMgr.Instance.getProperty(
        EmModel.USER_MODEL,
        UserModelAttribute.userId
      );
      ModelMgr.Instance.setProperty(
        EmModel.USER_MODEL,
        UserModelAttribute.gateIp,
        data.gateIp
      ); // 准备登录的网关IP
      ModelMgr.Instance.setProperty(
        EmModel.USER_MODEL,
        UserModelAttribute.port,
        data.port
      ); // 准备登录的网关端口
      //关闭登录Socket
      let callFunc = () => {
        // GameManager.Instance.checkAccelerator();
        LoginManager.Instance.c2s_login_gateway();
      };
      LoginSocketManager.Instance.close();
      if (data.gateIp == "" || data.gateIp == undefined) {
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation("login.gatewayServerError")
        );
      } else {
        GameManager.Instance.onGameSocketConnect(
          data.gateIp,
          data.port,
          callFunc
        ); //登录网关服
      }
    } else {
      Logger.base("创建角色失败: " + data.message);
      FrameCtrlManager.Instance.exit(EmWindow.Waiting);
      MessageTipManager.Instance.show(data.message);
    }
  }

  /**
   * socket登陆命令
   */
  public c2s_login_gateway() {
    Logger.yyz("socket登陆命令: " + "c2s_login_gateway");
    LoginManager.Instance.hasLogin = true;
    let msg: LoginReqMsg = new LoginReqMsg();
    msg.key = MD5Utils.md5(
      ModelMgr.Instance.getProperty(
        EmModel.USER_MODEL,
        UserModelAttribute.password
      )
    );
    let key: Array<number> = [
      Math.ceil(Math.random() * 255),
      Math.ceil(Math.random() * 255),
      Math.ceil(Math.random() * 255),
      Math.ceil(Math.random() * 255),
      Math.ceil(Math.random() * 255),
      Math.ceil(Math.random() * 255),
      Math.ceil(Math.random() * 255),
      Math.ceil(Math.random() * 255),
    ];
    msg.ekeys = key;
    msg.playerId = ModelMgr.Instance.getProperty(
      EmModel.USER_MODEL,
      UserModelAttribute.userId
    );
    SocketManager.Instance.send(C2SProtocol.G_LOGIN_GATEWAY, msg);
    SocketManager.Instance.socket.setKey(key);
    GameSocket.NEW_KEY = key;
    Utils.delay(10).then(() => {
      FrameCtrlManager.Instance.exit(EmWindow.Waiting);
    });
    FrameCtrlManager.Instance.open(EmWindow.Waiting);
  }

  private s2c_login_other(pkg: PackageIn) {
    let data: GatewayMsg = pkg.readBody(GatewayMsg) as GatewayMsg;
    Logger.error(data.notifyMsg);
    this.loginOther = true;
    let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
    let confirm: string = LangManager.Instance.GetTranslation("public.logout");
    SimpleAlertHelper.Instance.Show(
      SimpleAlertHelper.SIMPLE_ALERT,
      null,
      prompt,
      data.notifyMsg,
      confirm,
      "",
      () => {
        SharedManager.Instance.setWindowItem("isLoginAfterRestart", "true");
        SDKManager.Instance.getChannel().logout();
      },
      AlertBtnType.O,
      false,
      false,
      EmLayer.STAGE_TIP_LAYER
    );
  }

  private s2c_LoginRsp(pkg: PackageIn) {
    Logger.yyz("登录网关返回！！！！！");
    GameManager.Instance.checkAccelerator();
    let reConnetAlert = SocketManager.Instance.reConnetAlert;
    if (reConnetAlert && reConnetAlert.isShowing) {
      reConnetAlert.hide();
      reConnetAlert = null;
    }

    if (SocketManager.Instance.isReconnected) {
      this.reconnectDataRequest();
    }
  }

  public reconnectDataRequest() {
    LayerMgr.Instance.clearnStageTips();
    LayerMgr.Instance.clearStageTipDynamicLayer();
    GoodsManager.Instance.clear();
    StarManager.Instance.clear();
    ArmyManager.Instance.thane.runeCate.clear();
    MarketManager.Instance.reset();
    EmailManager.Instance.clear();
    OfferRewardManager.Instance.clear();
    PlayerBufferManager.Instance.clear();
    this.loginStateReq();
    this.loginReConnectDataReq();
    this.loginDataOverReq();
    ResourceManager.Instance.sendSyncResources();
    ShopManager.Instance.getBuyDataInfos();
    EmailSocketOutManager.getEmailList();
    WorldBossManager.Instance.reqWorldBossStates();
    if (
      CampaignManager.Instance.mapModel &&
      WorldBossHelper.checkConsortiaSecretLand(
        CampaignManager.Instance.mapModel.mapId
      )
    ) {
      SocketManager.Instance.send(C2SProtocol.C_ENTER_CONSORTIA_FAM, null);
    }
    SceneManager.Instance.refreshScene(); //强制刷新当前场景
  }

  /**
   * 重连加载请求
   * @param msg
   */
  public loginReConnectDataReq() {
    let msg: PlayerDataMsg = new PlayerDataMsg();
    msg.army = true; //部队
    msg.castle = true; //内城
    msg.build = true; //建筑
    msg.friend = true; //好友
    msg.snsReq = true; //社交
    msg.tree = true; //农场
    msg.aas = true; //防沉迷
    msg.bag = true; //背包
    msg.leed = true; //每日引导
    msg.reward = true; //悬赏
    msg.smith = true; //合成公式
    msg.star = true; //占星
    msg.effect = true; //buff
    msg.tower = true; //地下迷宫
    msg.sys = true;
    msg.offline = true;
    msg.sweep = true; //扫荡
    msg.questionnarie = true; //问卷调查
    msg.kingContract = true; //魔王契约
    msg.rebateCharge = true; //充值回馈
    msg.sumActive = true; //精彩活动
    msg.appell = true; //称号数据
    msg.bottle = true; //神奇魔罐
    msg.petChallengeReward = true; //英灵竞技
    // msg.powcardInfo = true;//卡牌系统
    SocketManager.Instance.send(C2SProtocol.C_LONIG_LOAD_REQ, msg);
  }

  /**
   * 登陆时加载请求
   * @param msg
   */
  public loginInitDataReq() {
    let msg: PlayerDataMsg = new PlayerDataMsg();
    msg.army = true; //部队
    msg.castle = true; //内城
    msg.build = true; //建筑
    msg.friend = true; //好友
    msg.snsReq = true; //社交
    msg.tree = true; //农场
    msg.aas = true; //防沉迷
    msg.bag = true; //背包
    msg.leed = true; //每日引导
    msg.reward = true; //悬赏
    msg.smith = true; //合成公式
    msg.star = true; //占星
    msg.effect = true; //buff
    msg.tower = true; //地下迷宫
    msg.sys = true;
    msg.offline = true;
    msg.sweep = true; //扫荡
    msg.questionnarie = true; //问卷调查
    msg.kingContract = true; //魔王契约
    msg.rebateCharge = true; //充值回馈
    msg.sumActive = true; //精彩活动
    msg.appell = true; //称号数据
    msg.bottle = true; //神奇魔罐
    msg.petChallengeReward = true; //英灵竞技
    // msg.powcardInfo = true;//卡牌系统
    SocketManager.Instance.send(C2SProtocol.C_LONIG_LOAD_REQ, msg);
  }

  /**
   * 充值回馈请求
   */
  public loginRebateChargeReq() {
    let msg: PlayerDataMsg = new PlayerDataMsg();
    msg.rebateCharge = true; //充值回馈
    SocketManager.Instance.send(C2SProtocol.C_LONIG_LOAD_REQ, msg);
  }

  /**
   * 登陆时加载请求
   * @param msg
   *
   */
  public loginStateReq() {
    var msg: PlayerDataMsg = new PlayerDataMsg();
    msg.user = true;
    SocketManager.Instance.send(C2SProtocol.C_LONIG_LOAD_REQ, msg);
  }

  public loginDataOverReq() {
    let msg: PlayerDataMsg = new PlayerDataMsg();
    msg.quest = true; //任务
    msg.shop = true;
    msg.active = true;
    msg.challReward = true;
    msg.switches = true;
    msg.crossScoreReward = true; //跨服积分
    SocketManager.Instance.send(C2SProtocol.C_LONIG_LOAD_REQ, msg);
  }
}
