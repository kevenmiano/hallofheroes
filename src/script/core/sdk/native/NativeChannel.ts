import SimpleAlertHelper, {
  AlertBtnType,
} from "../../../game/component/SimpleAlertHelper";
import {
  GameEventCode,
  GameEventString,
} from "../../../game/constant/GameEventCode";
import { EmWindow } from "../../../game/constant/UIDefine";
import {
  NativeEvent,
  WebViewEvent,
} from "../../../game/constant/event/NotificationEvent";
import { UserModelAttribute } from "../../../game/constant/model/UserModelParams";
import { EmModel } from "../../../game/constant/model/modelDefine";
import { ChatChannel } from "../../../game/datas/ChatChannel";
import { ThaneInfo } from "../../../game/datas/playerinfo/ThaneInfo";
import { UserInfo } from "../../../game/datas/userinfo/UserInfo";
import { ArmyManager } from "../../../game/manager/ArmyManager";
import { ChatManager } from "../../../game/manager/ChatManager";
import FreedomTeamManager from "../../../game/manager/FreedomTeamManager";
import IMManager from "../../../game/manager/IMManager";
import { MessageTipManager } from "../../../game/manager/MessageTipManager";
import ModelMgr from "../../../game/manager/ModelMgr";
import { NotificationManager } from "../../../game/manager/NotificationManager";
import { PlayerManager } from "../../../game/manager/PlayerManager";
import { RoomManager } from "../../../game/manager/RoomManager";
import { SharedManager } from "../../../game/manager/SharedManager";
import { VIPManager } from "../../../game/manager/VIPManager";
import { SceneManager } from "../../../game/map/scene/SceneManager";
import SceneType from "../../../game/map/scene/SceneType";
import ChatData from "../../../game/module/chat/data/ChatData";
import { HintWnd } from "../../../game/module/common/HintWnd";
import { YTextInput } from "../../../game/module/common/YTextInput";
import { LoginManager } from "../../../game/module/login/LoginManager";
import { isOversea } from "../../../game/module/login/manager/SiteZoneCtrl";
import LangManager from "../../lang/LangManager";
import LayerMgr from "../../layer/LayerMgr";
import Logger from "../../logger/Logger";
import { SocketEvent } from "../../net/SocketEvent";
import { SocketManager } from "../../net/SocketManager";
import UIManager from "../../ui/UIManager";
import Utils from "../../utils/Utils";
import { ChannelSTR } from "../SDKConfig";
import SDKManager from "../SDKManager";
import BaseChannel from "../base/BaseChannel";
import Browser = Laya.Browser;
import HTMLCanvas = Laya.HTMLCanvas;

/**
 * @description iOS和Android原生
 * @author yuanzhan.yu
 * @date 2022/3/2 23:54
 * @ver 1.0
 */
export class NativeChannel extends BaseChannel {
  private bridge: any;
  static appKey: string = "YOUME28146AC28DA9EC5939E8AA404C21FF83AFDFB055";
  /** 公司标识 */
  static IDENTIFY: string = "7ROAD";
  /** 游密账号ID */
  static YOUME_USERID: string = "7665";
  /** 接收世界频道语音的房间 */
  static WORLD_ROOM: string = "world_room";
  /** 接收公会频道语音的房间 + 公会ID */
  static CONSORTIA_ROOM: string = "consortia_room_";
  /** 接收组队频道语音的房间 + 组队房间ID */
  static TEAM_ROOM: string = "team_room_";
  /** 接收组队频道语音的房间 + 组队房间ID */
  static TEAM: string = "team_";
  private curRoomId: string = "";
  /** type =1表示私聊 type =2表示群聊 */
  private chatType: number = 0;

  public static msgHash: Map<string, ChatData> = new Map<string, ChatData>();
  public static currentRecvId: string = "";
  /**丢包率*/
  private static lost: number = 0;
  private static _weekNetHint: HintWnd;
  private static _weekNetWaitTime: number = 0;
  private static _weekNetMaxTime: number = 60;
  public static isVoiceLogin: boolean = false;
  public static language: string = "";
  public static sourceId: string = "";
  public static packageName: string = "";
  public static versionName: string = "";
  public static versionCode: number = 0;
  public static loginState: number = 0; //1：登录  0：登出
  public static appSplashClosed: boolean = false; //app的启动画面是否已关闭
  public static textinput: YTextInput;

  constructor(id: number) {
    super(id);

    if (this.isIOS) {
      this.bridge =
        Laya.Browser.window["PlatformClass"].createClass("JSBridge");
    } else if (this.isAndroid) {
      this.bridge =
        Laya.Browser.window["PlatformClass"].createClass("demo.JSBridge");
    }
    this.bridge.call("LayaLoadFinish");

    if (this.isIOS && Laya.Browser.window.conch) {
      Laya.Browser.window.conch.setNetworkEvtFunction(function (type) {
        if (type == 0) {
          Logger.yyz("监听到网络变化=====>没有网络");
          SocketManager.Instance.socket.dispose();
          SocketManager.Instance.socket.event(SocketEvent.SERVER_CLOSE);
        } else {
          Logger.yyz("监听到网络变化=====>有网络");
        }
      });
    }
  }

  /**
   * 登录界面显示完毕, 通知native端关闭启动画面
   */
  public loginSceneEnterOver() {
    this.bridge.call("loginSceneEnterOver");
  }

  /**
   * 进入游戏, 通知native端关闭启动画面
   */
  public gameEnterOver() {
    this.bridge.call("gameEnterOver");
    // this.bridge.callWithBack(function (result) {
    //     Logger.yyz("启动画面关闭返回: " + result);
    //     NativeChannel.appSplashClosed = result == 1;
    //     NotificationManager.Instance.sendNotification(NativeEvent.GAME_ENTER_OVER, result);
    //     return result;
    // }, "gameEnterOver");
  }
  /**
   * 选区完毕, 通知native端初始化sdk
   */
  public selectSiteOver(cfg: string) {
    if (this.isAndroid) {
      if (isOversea()) {
        this.bridge.callWithBack(
          function (result) {
            Logger.yyz("SDK初始化返回: " + result);
            NotificationManager.Instance.sendNotification(
              NativeEvent.SDK_INIT,
              result,
            );
            return result;
          },
          "selectSiteOver",
          cfg,
        );
      } else {
        this.bridge.call("selectSiteOver", cfg);
      }
    } else if (this.isIOS) {
      if (isOversea()) {
        // this.bridge.callWithBack(function (result) {
        // Logger.yyz("SDK初始化返回: " + result);
        // NotificationManager.Instance.sendNotification(NativeEvent.SDK_INIT, result);
        // return result},"selectSiteOver",  cfg);
        this.bridge.call("selectSiteOver:", cfg);
      } else {
        this.bridge.call("selectSiteOver:", cfg);
      }
    }
  }

  /**
   * 游戏事件
   * @param code  GameEventCode
   * @param exInfo    额外字段, 可根据情况自定义字段名称以json 串的形式传入（需提前沟通key值）。
   */
  public postGameEvent(code: number, exInfo: string = "") {
    let userInfo: UserInfo = PlayerManager.Instance.currentPlayerModel.userInfo;
    let playerInfo = PlayerManager.Instance.currentPlayerModel.playerInfo;
    let roleInfo: object = {
      serverId: userInfo.siteId,
      serverName: playerInfo.serviceName,
      roleId: userInfo.userId,
      roleName: playerInfo.nickName,
      roleLevel: ArmyManager.Instance.thane.grades,
      vipLevel: playerInfo.vipGrade, //VIPManager.Instance.model.vipInfo ? VIPManager.Instance.model.vipInfo.VipGrade : 0
    };
    if (this.isAndroid) {
      this.bridge.call(
        "postGameEvent",
        code,
        roleInfo ? JSON.stringify(roleInfo) : "",
        exInfo ? exInfo : "",
      );
    } else if (this.isIOS) {
      this.bridge.call(
        "postGameEvent:::",
        code,
        roleInfo ? JSON.stringify(roleInfo) : "",
        exInfo ? exInfo : "",
      );
    }
  }

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
    if (this.isAndroid) {
      this.bridge.call(
        "trackEvent",
        type,
        node,
        JSON.stringify(roleInfo),
        eventName,
        eventDescribe,
        pageName,
        pageDescribe,
      );
    } else if (this.isIOS) {
      this.bridge.call(
        "trackEvent:::::::",
        type,
        node,
        JSON.stringify(roleInfo),
        eventName,
        eventDescribe,
        pageName,
        pageDescribe,
      );
    }
  }

  /**
   * 渠道账户个人中心
   * @param json JSON字符串, 根据渠道特殊需要进行传, 默认传空字符串
   */
  public openPersonalCenter(json: string = "") {
    if (this.isAndroid) {
      this.bridge.call("openPersonalCenter", json);
    } else if (this.isIOS) {
      this.bridge.call("openPersonalCenter:", json);
    }
  }

  /**
   * 登出
   * @param b
   */
  logout(b: boolean = false) {
    if (NativeChannel.lost == 1) {
      //弹出检查网络提示
    } else {
      if (b) {
        this.bridge.call("logout");
      } else {
        //39渠道和贪玩渠道上报注销角色或退出游戏的游戏事件
        let channelId: number = Number(
          ModelMgr.Instance.getProperty(
            EmModel.USER_MODEL,
            UserModelAttribute.channelId,
          ),
        );
        if (channelId == 20360 || channelId == 20370) {
          SDKManager.Instance.getChannel().postGameEvent(
            GameEventCode.Code_1080,
          );
        }
        Laya.timer.callLater(this, () => {
          this.reload();
        });
      }
    }
  }

  /**
   * 退出app
   */
  exitGame() {
    if (Laya.Browser.window.conch) {
      Laya.Browser.window.conch.exit();
    }
    // if (this.isAndroid) {
    //     this.bridge.call("exitGame");
    // }
    // else if (this.isIOS) {
    //     this.bridge.call("exitGame");
    // }
  }

  /**
   * 打开链接
   * @param url
   */
  openURL(url: string) {
    if (this.isAndroid) {
      this.bridge.call("openURL", url);
    } else if (this.isIOS) {
      if (!isOversea()) this.bridge.call("openURL:", url);
      else {
        if (Laya.Browser.window.conch) {
          let l = 50;
          let t = 50;
          let w = window.innerWidth - l * 2;
          let h = window.innerHeight - t * 2;
          Laya.Browser.window.conch.setExternalLinkEx(url, l, t, w, h, true);
        }
      }
    }
  }

  /**
   * 打开QQ客服
   * @param url
   * @param qq
   */
  openQQService(url: string, qq: string) {
    super.openQQService(url, qq);
    if (this.isAndroid) {
      if (NativeChannel.versionCode >= 27) {
        this.bridge.call("openQQService", qq);
      } else {
        this.bridge.call("openURL", url);
      }
    } else if (this.isIOS) {
      this.bridge.call("openQQService:", qq);
    }
  }

  openWXOfficial(textUrl: string, s: string) {
    super.openWXOfficial(textUrl, s);
    if (this.isAndroid) {
      this.bridge.call("openWXOfficial", textUrl);
    } else if (this.isIOS) {
      this.bridge.call("openWXOfficial:", textUrl);
    }
  }

  /**
   * 跳转到App Store等应用商店进行评分
   */
  // eslint-disable-next-line quotes
  evaluateOnAppStore(json: string = '{"type":"2"}') {
    super.evaluateOnAppStore();
    if (this.isAndroid) {
      this.bridge.call("openEvaluationSystem", json);
    } else if (this.isIOS) {
      // this.bridge.call("evaluateOnAppStore");
      this.bridge.call("openEvaluationSystem");
    }
  }

  /**
   * 选择相册图片
   */
  requestPhoto() {
    if (this.isAndroid) {
      this.bridge.call("requestPhoto");
    } else if (this.isIOS) {
    }
  }

  /**
   * 展示原生端的网络异常提示框
   * 默认显示--“网络异常, 请检查您的网络是否正常或是否开启蜂窝移动数据访问”
   */
  showNetworkAlert(tip: string = "") {
    LayerMgr.Instance.clearStageTipDynamicLayer();
    if (this.isAndroid) {
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
          SDKManager.Instance.getChannel().relaunch();
        },
        AlertBtnType.O,
      );
    } else if (this.isIOS) {
      this.bridge.call("showNetworkAlert:", tip);
    }
  }

  reload() {
    if (this.isAndroid) {
      if (Laya.Browser.window.conch) {
        // NET_NO = 0;
        // NET_WIFI = 1;
        // NET_2G = 2;
        // NET_3G = 3;
        // NET_4G = 4;
        // NET_YES = 5;
        let nType = Laya.Browser.window.conch.config.getNetworkType();
        if (nType == 0) {
          let confirm: string =
            LangManager.Instance.GetTranslation("public.confirm");
          let cancel: string =
            LangManager.Instance.GetTranslation("public.cancel");
          let prompt: string =
            LangManager.Instance.GetTranslation("public.prompt");
          let msg: string = LangManager.Instance.GetTranslation(
            "login.serverclosed.lost2",
          );
          SimpleAlertHelper.Instance.Show(
            SimpleAlertHelper.SIMPLE_ALERT,
            null,
            prompt,
            msg,
            confirm,
            cancel,
            (b: boolean, flag: boolean) => {
              SDKManager.Instance.getChannel().relaunch();
            },
            AlertBtnType.O,
          );
        } else {
          // window.location.reload();
          this.bridge.call("reload");
        }
      }
    } else if (this.isIOS) {
      window.location.reload();
    }
  }

  /**
   * 检测是否有某个权限
   * @param type  权限类型
   * @param request   没有权限的话是否获取
   * @return
   */
  checkPermission(type: string, request: boolean = false): number {
    if (this.isAndroid) {
      if (!request) {
        return this.bridge.call("checkPermission", type, request);
      } else {
        this.bridge.callWithBack(
          function (result) {
            Logger.yyz("权限申请结果返回: " + result);
            NotificationManager.Instance.sendNotification(
              NativeEvent.PERMISSION_UPDATE,
              result,
            );
            return result;
          },
          "checkPermission",
          type,
          request,
        );
      }
    } else if (this.isIOS) {
      if (type == "android.permission.RECORD_AUDIO") {
        if (!request) {
          return this.bridge.call("recordPermission:", request);
        } else {
          this.bridge.callWithBack(
            function (result) {
              Logger.yyz("权限申请结果返回: " + result);
              NotificationManager.Instance.sendNotification(
                NativeEvent.PERMISSION_UPDATE,
                result,
              );
              return result;
            },
            "recordPermission:",
            request,
          );
        }
      } else if (type == "android.permission.READ_EXTERNAL_STORAGE") {
        return 1;
      }
    }
  }

  /**
   * 打开客服系统
   */
  openCustomerService() {
    let userInfo: UserInfo = PlayerManager.Instance.currentPlayerModel.userInfo;
    let thaneInfo: ThaneInfo = ArmyManager.Instance.thane;
    let playerInfo = PlayerManager.Instance.currentPlayerModel.playerInfo;
    let vipModel = VIPManager.Instance.model;
    let vipLevel = vipModel ? vipModel.vipInfo.VipGrade : 0;
    let param: object = {
      type: "0",
      publishId: "1",
      trackedChargedDiamonds: "1",
      serverId: userInfo.site,
      serverName: playerInfo.serviceName,
      roleId: userInfo.userId.toString(),
      roleName: userInfo.user,
      roleLevel: thaneInfo.grades.toString(),
      userId: thaneInfo.userId.toString(),
      vipLevel: vipLevel.toString(),
    };
    if (this.isAndroid) {
      this.bridge.call("openCustomerService", JSON.stringify(param));
    } else if (this.isIOS) {
      this.bridge.call("openCustomerService:", JSON.stringify(param));
    }
  }

  /**
   * 保存截图并分享
   * @param sp    截图的sprite
   * @param isShare   1:分享; 0:不分享
   * @param code 分享类型 0	国内
   *                      6	Facebook 图片
   *                      7	Facebook 链接
   *                      8	Facebook 邀请
   *                      4	Messenger 链接
   *                      11	Messenger 图片
   *                      13	系统分享链接
   *                      14	系统分享图片
   *                      15	Telegram 链接
   *                      16	Telegram 图片
   *                      17	Twitter 链接
   *                      18	Twitter 图片
   *                      19	WhatsApp 链接
   *                      20	WhatsApp 图片
   *                      21	Instagram 链接
   *                      22	Instagram 图片
   *                      23	Discord 链接
   *                      24	Discord 图片
   * @param title 标题
   * @param desc  描述
   * @constructor
   */
  saveScreenshot(
    sp: Laya.Sprite,
    isShare: number = 1,
    code: number = 0,
    title: string = "title",
    desc: string = "desc",
  ) {
    let htmlCanvas1: HTMLCanvas = sp.drawToCanvas(sp.width, sp.height, 0, 0); //把精灵绘制到canvas上面
    let base64Str1: string = htmlCanvas1.toBase64("image/png", 0.8);
    Logger.yyz("base64Str1:" + base64Str1);
    let fileName: string = "share_" + Browser.now() + ".png";
    if (this.isAndroid) {
      this.bridge.callWithBack(
        function (result) {
          Logger.yyz("分享结果返回: " + result);
          // MessageTipManager.Instance.show("分享结果返回: " + result);
          NotificationManager.Instance.sendNotification(
            NativeEvent.MOUNT_SHARE_RESULT,
            result,
          );
          return result;
        },
        "saveScreenshot",
        base64Str1,
        fileName,
        isShare,
        code,
        title,
        desc,
      );
    } else if (this.isIOS) {
      Utils.delay(3000).then(() => {
        NotificationManager.Instance.sendNotification(
          NativeEvent.MOUNT_SHARE_RESULT,
          1,
        );
      });
      this.bridge.callWithBack(
        function (result) {
          Logger.yyz("分享结果返回: " + result);
          // MessageTipManager.Instance.show("分享结果返回: " + result);
          // NotificationManager.Instance.sendNotification(NativeEvent.MOUNT_SHARE_RESULT, result);
          return result;
        },
        "saveScreenshot::::::",
        base64Str1,
        fileName,
        isShare,
        code,
        title,
        desc,
      );
    }
  }

  /**
   * 分享链接到各个平台
   * @param code 分享类型 0	国内
   *                      6	Facebook 图片
   *                      7	Facebook 链接
   *                      8	Facebook 邀请
   *                      4	Messenger 链接
   *                      11	Messenger 图片
   *                      13	系统分享链接
   *                      14	系统分享图片
   *                      15	Telegram 链接
   *                      16	Telegram 图片
   *                      17	Twitter 链接
   *                      18	Twitter 图片
   *                      19	WhatsApp 链接
   *                      20	WhatsApp 图片
   *                      21	Instagram 链接
   *                      22	Instagram 图片
   *                      23	Discord 链接
   *                      24	Discord 图片
   * @param title 标题
   * @param desc  描述
   * @param url 链接
   */
  shareURL(
    code: number = 0,
    title: string = "title",
    desc: string = "desc",
    url: string = "",
  ) {
    if (this.isAndroid) {
      this.bridge.call("shareURL", code, title, desc, url);
    } else if (this.isIOS) {
      this.bridge.call("shareURL::::", code, title, desc, url);
    }
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
  ) {
    // Laya.Browser.window.conch.captureScreen(function (arrayBuff, width, height) {
    //     // alert(Laya.Browser.window.conch.getCachePath());
    //     //存储文件的方式
    //     let pngURL:string = Laya.Browser.window.conch.getCachePath() + "/share_" + Browser.now() + ".png";
    //     Laya.Browser.window.conch.saveAsPng(arrayBuff, width, height, pngURL);
    //     Laya.Browser.window.globalImage = window.document.createElement("img");
    //     Laya.Browser.window.globalImage.onload = function () {
    //         // ...使用image对象
    //         Logger.yyz("src:" + Laya.Browser.window.globalImage.src);
    //         var width = Laya.Browser.window.globalImage.width;
    //         var height = Laya.Browser.window.globalImage.height;
    //         // if (width <= 1334 && height <= 750) {
    //             var bgImg = new Laya.Sprite();
    //             bgImg.loadImage("file:///" + pngURL);
    //             Laya.stage.addChild(bgImg);
    //         // } else {
    //         //     Logger.yyz("图片超标" + width + "--" + height);
    //         // }
    //     }
    //     Laya.Browser.window.globalImage.src = "file:///" + pngURL;
    //
    //
    //     // Laya.Browser.window.image = window.document.createElement("img");
    //     // Laya.Browser.window.image.putImageData(arrayBuff, width, height);
    //     //...使用image对象
    //     // data/user/0/com.simjoys.h5gameapp//LayaCache//appCache
    // });

    photoPath = Laya.Browser.window.conch.getCachePath() + "/share.png";
    let info: object = {
      code: code,
      title: title,
      desc: desc,
      photoPath: photoPath,
      url: url,
      exInfo: exInfo,
    };
    let json: string = JSON.stringify(info);
    if (this.isAndroid) {
      this.bridge.call("socialPlugin", json);
    } else if (this.isIOS) {
      this.bridge.call("socialPlugin:", json);
    }
  }

  /**
   * 注册推送
   */
  registerPush(openId: string) {
    if (this.isAndroid) {
      this.bridge.call("registerPush", openId);
    } else if (this.isIOS) {
      this.bridge.call("registerPush:", openId);
    }
  }

  /**
   * 实名认证
   */
  openVerify() {
    this.bridge.call("openVerify");
  }

  /**
   * 获取中间层关于当前渠道的配置信息
   */
  getConfigData(): string {
    if (this.isAndroid) {
      return this.bridge.call("getConfigData");
    } else if (this.isIOS) {
    }
  }

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
  ) {
    let userInfo: UserInfo = PlayerManager.Instance.currentPlayerModel.userInfo;
    let thaneInfo: ThaneInfo = ArmyManager.Instance.thane;
    let playerInfo = PlayerManager.Instance.currentPlayerModel.playerInfo;
    let serverId: string = userInfo.siteId.toString();
    let platformServerId: string = userInfo.siteId.toString();
    let serverName: string = playerInfo.serviceName;
    let roleId: string = userInfo.userId.toString();
    let roleName: string = playerInfo.nickName;
    let roleLevel: string = thaneInfo.grades.toString();
    let vipLevel: number = VIPManager.Instance.model.vipInfo.VipGrade;
    let rExInfo: string = "";
    if (this.isAndroid) {
      this.bridge.call(
        "pay",
        0,
        orderId,
        productId,
        channelProductId,
        productName,
        productDesc,
        money,
        showCoin,
        gameExInfo,
        count,
        coinType,
        virtualCoinType,
        oExInfo,
        serverId,
        platformServerId,
        serverName,
        roleId,
        roleName,
        roleLevel,
        vipLevel,
        rExInfo,
      );
    } else if (this.isIOS) {
      this.bridge.call(
        "pay:::::::::::::::::::::",
        1,
        orderId,
        productId,
        channelProductId,
        productName,
        productDesc,
        money,
        showCoin,
        gameExInfo,
        count,
        coinType,
        virtualCoinType,
        oExInfo,
        serverId,
        platformServerId,
        serverName,
        roleId,
        roleName,
        roleLevel,
        vipLevel,
        rExInfo,
      );
    }
  }

  /**
   * 支付结果
   * @param result    支付成功: 1； 支付失败: -1； 取消支付: 0
   */
  public static onPayResult(result: number) {
    if (result == 0) {
      //取消支付上报
      SDKManager.Instance.getChannel().postGameEvent(
        GameEventCode.Code_9999,
        JSON.stringify({ eventToken: GameEventString.cancel_purchase }),
      );
    } else if (result == 1) {
      //支付成功上报
      SDKManager.Instance.getChannel().postGameEvent(GameEventCode.Code_1070);
    }
  }

  /**
   * 语音登录
   * 在游戏中需要使用语音功能的地方调用voiceLogin(string userId, string password, string token)方法进行登录,
   * userId、password、token字段可由游戏自行定义, token 可传空
   * */
  voiceLogin(userId: string, password: string, token: string) {
    if (this.isAndroid) {
      this.bridge.call("voiceLogin", userId, password, token);
    } else if (this.isIOS) {
      this.bridge.call("voiceLogin:password:token:", userId, password, token);
    }
  }

  /**
   * 语音登出
   * */
  voiceLogout() {
    this.bridge.call("voiceLogout");
  }

  /**
   * 加入聊天室
   * */
  joinChatRoom(chatRoomId: string) {
    chatRoomId += NativeChannel.getMainSite();
    if (this.isAndroid) {
      this.bridge.call("joinChatRoom", chatRoomId);
    } else if (this.isIOS) {
      this.bridge.call("joinChatRoom:", chatRoomId);
    }
  }

  /**
   * 离开房间
   * */
  leaveChatRoom(chatRoomId: string) {
    chatRoomId += NativeChannel.getMainSite();
    if (this.isAndroid) {
      this.bridge.call("leaveChatRoom", chatRoomId);
    } else if (this.isIOS) {
      this.bridge.call("leaveChatRoom:", chatRoomId);
    }
  }

  /**
   * 开始录音
   * @param recvId    接收者ID（用户ID或频道ID）
   * @param chatType  消息类型  1表示私聊 2表示群聊
   * @param extraText 透传参数 安卓用
   */
  startRecordAudio(recvId: string, chatType: number, extraText: string) {
    if (chatType == 2) {
      //私聊已经在此方法的调用出加过主区号了
      recvId += NativeChannel.getMainSite();
    }
    NativeChannel.currentRecvId = recvId;
    if (this.isAndroid) {
      this.bridge.call("startRecordAudioMessage", recvId, chatType, extraText);
    } else if (this.isIOS) {
      this.bridge.call(
        "startRecordAudioMessage:chatType:extraText:",
        recvId,
        chatType,
        extraText,
      );
    }
  }

  /**
   * 停止录音并发送
   * 可在onSendAudioMessageCallBack中收到发送成功的回调
   * attachMsg iOS的透传字段, 安卓忽略(安卓的在startRecordAudio中)
   * */
  stopAndSendAudio(attachMsg?: string) {
    if (this.isAndroid) {
      this.bridge.call("stopAndSendAudioMessage");
    } else if (this.isIOS) {
      let headId = ArmyManager.Instance.thane.snsInfo.headId;
      if (headId == 0) {
        headId = ArmyManager.Instance.thane.job;
      }
      attachMsg =
        ArmyManager.Instance.thane.nickName +
        "|" +
        ArmyManager.Instance.thane.grades +
        "|" +
        headId;
      this.bridge.call("stopAndSendAudioMessage:", attachMsg);
    }
  }

  /**
   * 下载语音接口
   * msgId为接收到语音消息, 可在receiveVoiceMsg方法中获取, savePath 为语音的保存路径, 并以 .wav 为结尾
   * @param msgId
   * @param savePath
   */
  downloadVoice(msgId: string, savePath: string) {
    if (this.isAndroid) {
      this.bridge.call("downloadVoice", msgId, savePath);
    } else if (this.isIOS) {
      this.bridge.call("downloadVoice:savePath:", msgId, savePath);
    }
  }

  /**
   * 播放语音
   * audioPath为语音文件的路径
   * */
  startPlayAudio(audioPath: string) {
    if (this.isAndroid) {
      this.bridge.call("startPlayAudio", audioPath);
    } else if (this.isIOS) {
      this.bridge.call("startPlayAudio:", audioPath);
    }
  }

  /**
   * 停止播放语音
   * */
  stopPlayAudio() {
    this.bridge.call("stopPlayAudio");
  }

  /**
   * 取消发送语音
   * */
  cancelRecordAudio() {
    MessageTipManager.Instance.show(
      LangManager.Instance.GetTranslation("NativeChannel.cancelRecordAudio"),
    );
    this.bridge.call("cancelRecordAudio");
  }

  /**
   * 设置渠道悬浮框
   * @param isVisible
   */
  setFloatVisible(isVisible: boolean) {
    if (this.isAndroid) {
      this.bridge.call("setFloatVisible", isVisible);
    } else if (this.isIOS) {
      this.bridge.call("setFloatVisible:", isVisible);
    }
  }

  /**
   * 打开登录窗口重新登录
   */
  showLogin(type: number = 0) {
    if (!isOversea()) {
      this.bridge.call("showLogin");
    } else {
      if (this.isAndroid) {
        this.bridge.call("showLogin", type);
      } else if (this.isIOS) {
        this.bridge.call("showLogin:", type);
      }
    }
  }

  /**
   * 自动登录sdk
   */
  autoLogin() {
    this.bridge.call("autoLogin");
  }

  /**
   * 复制到剪切板
   * @param str
   */
  copyStr(str: string) {
    if (this.isAndroid) {
      this.bridge.call("copyStr", str);
    } else if (this.isIOS) {
      this.bridge.call("copyStr:", str);
    }
  }

  /**
   * 重启App
   */
  relaunch() {
    this.bridge.call("relaunch");
  }

  showKeyboard(text: string) {
    if (this.isAndroid) {
      this.bridge.call("showKeyboard", text);
    } else if (this.isIOS) {
      this.bridge.call("showKeyboard:", text);
    }
  }

  //===================native 调用js的方法 START============================//
  /**
   * 区分包信息配置
   * @param sourceId   0 是AppStore包 sourceId:  1 是GP包 sourceId : 2 是官网包（其他三方做协同约定）
   */
  public static nativeCallJs_sourceId(sourceId: string) {
    NativeChannel.sourceId = sourceId;
    window.sourceId = sourceId;
    Logger.yyz(`Android包体渠道信息:  sourceId: ${sourceId}`);
  }

  /**
   * 通知SDK登录状态
   * @param loginState   1：登录  0：登出
   */
  public static nativeCallJs_loginState(loginState: number) {
    NativeChannel.loginState = loginState;
    Logger.yyz(`通知SDK登录状态:  state: ${loginState}`);
    if (loginState == 0) {
      Laya.timer.callLater(this, () => {
        this.switchAccount(true);
      });
    }
  }

  public static nativeCallJs_packageInfo(
    packageName: string,
    versionName: string,
    versionCode: number,
  ) {
    NativeChannel.packageName = packageName;
    NativeChannel.versionName = versionName;
    NativeChannel.versionCode = versionCode;
    Logger.yyz(
      `Android包体信息:  packageName: ${packageName}, versionName:${versionName}, versionCode:${versionCode}`,
    );
  }

  public static nativeCallJs_language(language: string) {
    NativeChannel.language = language;
  }

  public static nativeCallJs_errorCode(errorCode: number) {
    NotificationManager.Instance.sendNotification(
      NativeEvent.ERROR_CODE,
      errorCode,
    );
  }

  public static nativeCallJs_gameEnterOverBack() {
    Logger.yyz("启动画面关闭成功返回！");
    NativeChannel.appSplashClosed = true;
    NotificationManager.Instance.sendNotification(NativeEvent.GAME_ENTER_OVER);
  }

  public static nativeCallJs(info) {
    window["__nativeInfo__"] = info;
    NotificationManager.Instance.sendNotification(
      WebViewEvent.RECEIVE_DATA,
      info,
    );
  }

  //收到相册选择图片返回
  public static nativeCallPhoto(info) {
    NotificationManager.Instance.sendNotification(
      WebViewEvent.RECEIVE_PHOTO_CALL,
      info,
    );
  }

  /**
   * 切换账户,是否需要重新登录
   * @param isLoginAfterRestart
   */
  public static switchAccount(isLoginAfterRestart: boolean) {
    Logger.yyz("切换账号--switchAccount:", isLoginAfterRestart);
    //保存切换账户是否需要重登状态
    SharedManager.Instance.setWindowItem(
      "isLoginAfterRestart",
      isLoginAfterRestart.toString(),
    );
    if (
      isLoginAfterRestart &&
      SceneManager.Instance.currentType != SceneType.LOGIN_SCENE
    ) {
      //非登陆场景, 统一reload一次
      SDKManager.Instance.getChannel().reload();
    }
  }

  /**
   * 接收安卓端的弹窗命令
   * @param msg
   * @param code
   */
  public static showAlert(msg: string, code: number) {
    let confirm: string = LangManager.Instance.GetTranslation("public.confirm");
    let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
    let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
    SimpleAlertHelper.Instance.Show(
      SimpleAlertHelper.SIMPLE_ALERT,
      null,
      prompt,
      msg,
      confirm,
      cancel,
      (b: boolean, flag: boolean) => {
        if (b) {
          switch (code) {
            case 0:
            case -1:
              //退出游戏
              SDKManager.Instance.getChannel().exitGame();
              break;
          }
        }
      },
    );
  }

  /**
   * 接收安卓端的弹提示命令
   * @param msg
   */
  public static showMsg(msg: string) {
    MessageTipManager.Instance.show(msg);
  }

  static getMainSite(): string {
    return "_" + PlayerManager.Instance.currentPlayerModel.userInfo.mainSite;
  }

  /**
   * 语音登录成功回调, native端发送过来的
   */
  public static voiceLoginSuccess() {
    Logger.yyz("语音SDK登录成功返回!!!!!!!!!!!!!!!!!");

    NativeChannel.isVoiceLogin = true;
    let channel: BaseChannel = SDKManager.Instance.getChannel();
    if (channel instanceof NativeChannel) {
      let consortiaID =
        PlayerManager.Instance.currentPlayerModel.playerInfo.consortiaID;
      if (consortiaID > 0) {
        let roomId = NativeChannel.CONSORTIA_ROOM + consortiaID;
        channel.joinChatRoom(roomId);
      }

      if (FreedomTeamManager.Instance.hasTeam) {
        let teamId = FreedomTeamManager.Instance.model.teamId;
        if (teamId > 0) {
          let roomId = NativeChannel.TEAM + teamId;
          channel.joinChatRoom(roomId);
        }
      }

      if (RoomManager.Instance.roomInfo) {
        let teamId = RoomManager.Instance.roomInfo.id;
        if (teamId > 0) {
          let roomId = NativeChannel.TEAM_ROOM + teamId;
          channel.joinChatRoom(roomId);
        }
      }
    }
  }

  /**
   * 语音发送成功回调, native端发送过来的
   */
  public static onSendAudioMessageCallBack(
    requestID: string,
    errorcode: number,
    strText: string,
    strAudioPath: string,
    audioTime: number,
    sendTime: number,
    isForbidRoom: boolean,
    reasonType: number,
    forbidEndTime: number,
  ) {
    let recvId: string = NativeChannel.currentRecvId;
    //解析为ChatData
    let chatData: ChatData = new ChatData();
    chatData.savePath = strAudioPath;
    chatData.isFromMe = true;
    //ArmyManager.Instance.thane.nickName+'|'+ ArmyManager.Instance.thane.grades+'|'+headId;
    chatData.senderName = ArmyManager.Instance.thane.nickName;
    chatData.userLevel = ArmyManager.Instance.thane.grades;
    let headId = ArmyManager.Instance.thane.snsInfo.headId;
    if (headId == 0) {
      headId = ArmyManager.Instance.thane.job;
    }
    chatData.headId = headId;
    chatData.serverId = requestID;
    chatData.curTime = sendTime * 1000;
    chatData.voiceTime = audioTime;
    chatData.fight = ArmyManager.Instance.thane.fightingCapacity;

    let arr = recvId.split("_");
    chatData.receiveId = Number(arr[arr.length - 1]); //区服_userId
    chatData.uid = PlayerManager.Instance.currentPlayerModel.playerInfo.userId;

    let isprivate: boolean = false;
    if (recvId == NativeChannel.WORLD_ROOM) {
      chatData.channel = ChatChannel.WORLD;
    } else {
      if (recvId.indexOf(NativeChannel.CONSORTIA_ROOM) >= 0) {
        chatData.channel = ChatChannel.CONSORTIA;
      } else if (recvId.indexOf(NativeChannel.TEAM_ROOM) >= 0) {
        chatData.channel = ChatChannel.TEAM;
      } else {
        IMManager.Instance.addVoice(chatData);
        isprivate = true;
      }
    }
    // 把 msgObj 存起来
    this.msgHash.set(requestID, chatData);
    if (!isprivate) {
      //私聊语音不要添加到综合里面
      ChatManager.Instance.model.addChat(chatData);
    }
  }

  /**
   * 接收语音消息回调, native端发送过来的
   * NativeChannel.receiveVoiceMsg(2, consortia_room_103, 1_3867, 724028530507201794, 0, 1647762131, 0, , 0, )
   *   .callJS_receiveVoiceMsg(chatType, receiveId, senderId, msgId, msgType,
   *   createTime, distance, savePath == null?"":savePath, isRead, messageBody.getParam());
   */
  public static receiveVoiceMsg(
    chatType: number,
    receiveId: string,
    senderId: string,
    msgId: string,
    msgType: number,
    createTime: number,
    distance: number,
    savePath: string,
    isRead: number,
    mParam: string,
  ) {
    //解析为ChatData
    let chatData: ChatData = new ChatData();
    chatData.savePath = savePath;
    chatData.isFromMe =
      senderId ==
      PlayerManager.Instance.currentPlayerModel.userInfo.mainSite +
        "_" +
        PlayerManager.Instance.currentPlayerModel.playerInfo.userId;
    let arr0 = mParam.split("|");
    chatData.senderName = arr0[0];
    chatData.userLevel = Number(arr0[1]);
    chatData.headId = Number(arr0[2]);
    chatData.serverId = msgId;
    chatData.curTime = createTime * 1000;
    chatData.voiceTime = distance;
    let senderArr = senderId.split("_");
    chatData.uid = Number(senderArr[senderArr.length - 1]); //区服_userId

    if (receiveId == NativeChannel.WORLD_ROOM) {
      chatData.receiveId = 0;
      chatData.channel = ChatChannel.WORLD;
    } else {
      if (receiveId.indexOf(NativeChannel.CONSORTIA_ROOM) >= 0) {
        chatData.receiveId = 0;
        chatData.channel = ChatChannel.CONSORTIA;
      } else if (receiveId.indexOf(NativeChannel.TEAM_ROOM) >= 0) {
        chatData.receiveId = 0;
        chatData.channel = ChatChannel.TEAM;
      } else {
        chatData.channel = ChatChannel.PERSONAL;
        let receiveIdArr = receiveId.split("_");
        chatData.receiveId = Number(receiveIdArr[receiveIdArr.length - 1]); //区服_userId
        IMManager.Instance.addVoice(chatData);
      }
    }
    // 把 msgObj 存起来
    this.msgHash.set(msgId, chatData);
    ChatManager.Instance.model.addChat(chatData);
  }

  /**
   * 语音下载成功回调 native端发送过来的
   * @param msgId
   * @param savePath
   */
  public static onDownLoadAudioMessageCallBack(
    msgId: string,
    savePath: string,
  ) {
    let msg: ChatData = this.msgHash.get(msgId);
    if (msg) {
      msg.savePath = savePath;
    }
  }

  /**
   * 获取非安全区域栏的高度 native端发送过来的
   * @param height
   * @param rotation
   */
  public static getStatusBarHeight(height: number, rotation: number) {
    // MessageTipManager.Instance.show(`非安全区域栏的高度:${height}屏幕旋转角度:${rotation}`);
    // NotificationManager.Instance.sendNotification(NativeEvent.STATUS_BAR_CHANGE, height, rotation);
  }

  /**
   * 获取非安全区域栏的高度 native端发送过来的
   * @param height1   左边的非安全区高度
   * @param height2   右边的非安全区高度
   * @param rotation  旋转角度   1 为 90度 左边 ； 3 为270度  右边
   */
  public static getNoSafeAreaHeight(
    height1: number,
    height2: number,
    rotation: number,
  ) {
    NotificationManager.Instance.sendNotification(
      NativeEvent.STATUS_BAR_CHANGE,
      height1,
      height2,
      rotation,
    );
  }

  /**
   * 获取文本输入框中的内容 native端发送过来的
   */
  public static sendTextinput(msg: string) {
    Logger.yyz("iOS键盘发过来的sendTextinput:" + msg);
    this.textinput.txt_mobile.text = msg;
    this.textinput.txt_web.text = msg;
  }

  /**
   * 获取服务器ping值 native端发送过来的
   * @param ping
   */
  public static getPing(ping: number) {
    Logger.yyz("服务器ping:" + ping);
  }

  /**
   * 获取服务器丢包率 native端发送过来的
   * @param lost
   */
  public static getLostPkg(lost: number) {
    NativeChannel.lost = lost;
    Logger.yyz("ping服务器丢包率:" + lost);
    if (lost >= 1 && LoginManager.Instance.hasLogin) {
      //丢包率大于1提示玩家网络
      // MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("network.tip"));
      // this._weekNetWaitTime = 0;
      // this.showLostHint();
      // Laya.timer.loop(1000, this, this.showLostHint);
    } else {
      // Laya.timer.clear(this, this.showLostHint);
      // if (this._weekNetHint && this._weekNetHint.isShowing) {
      //     this._weekNetHint.hide();
      //     this._weekNetHint = null;
      // }
    }
    NotificationManager.Instance.dispatchEvent(
      NativeEvent.WIFI_STATE_UPDATE,
      lost,
    );
  }

  /**
   * app切换回前台 native端发送过来的
   * app切后台时游戏中是收不到的
   */
  public static switchForeground() {
    Logger.yyz("app切换到前台");
  }

  /**
   * 获取选择的相册图片 native端发送过来的
   */
  public static getPhotoURI(uri: string) {
    Logger.yyz("图片uri:" + uri);
  }
  //===================native 调用js的方法 END============================//

  get isIOS(): boolean {
    return Utils.isIOS();
  }

  get isAndroid(): boolean {
    return Utils.isAndroid();
  }

  private static async showLostHint() {
    this._weekNetWaitTime++;
    if (this._weekNetHint == null || !this._weekNetHint.isShowing) {
      this._weekNetHint = await UIManager.Instance.ShowWind(
        EmWindow.HintWnd,
        LangManager.Instance.GetTranslation(
          "login.serverclosed.lost1",
          this._weekNetWaitTime,
        ),
      );
    } else {
      if (!SocketManager.Instance.reConnetAlert) {
        //如果有断线重连的提示就不处理
        this._weekNetHint.setHintText(
          LangManager.Instance.GetTranslation(
            "login.serverclosed.lost1",
            this._weekNetWaitTime,
          ),
        );
      } else {
        this._weekNetWaitTime--;
      }
    }

    if (this._weekNetWaitTime >= this._weekNetMaxTime) {
      Laya.timer.clear(this, this.showLostHint);
      if (this._weekNetHint && this._weekNetHint.isShowing) {
        this._weekNetHint.hide();
        this._weekNetHint = null;
      }
      SDKManager.Instance.getChannel().showNetworkAlert();
    }
  }

  createLoginReq(
    userName: string,
    pass: string,
    site: string,
    siteId: number,
    appData: any,
  ) {
    if (appData && appData.token != "") {
      this.platId = 1;
      if (Utils.isAndroid()) {
        this.platId = 1;
      } else if (Utils.isIOS()) {
        this.platId = 0;
      }
      LoginManager.Instance.c2s_createLoginReq(
        userName,
        pass,
        site,
        siteId,
        ChannelSTR.APP,
        this.platId,
        appData,
      ); //请求玩家列表
    }
  }

  /**App端  adjust上报自定义事件 */
  adjustEvent(eventType: string, value?: any) {
    if (isOversea()) {
      SDKManager.Instance.getChannel().postGameEvent(
        GameEventCode.Code_9999,
        JSON.stringify({ eventToken: eventType }),
      );
    }
  }

  /**绑定账户 */
  bindAccount(type: number): Promise<any> {
    return new Promise<any>((resolve) => {
      if (this.isAndroid) {
        this.bridge.callWithBack(
          function (result) {
            Logger.yyz("绑定账户结果返回: " + result);
            NotificationManager.Instance.dispatchEvent(
              NativeEvent.BIND_ACCOUNT_RET,
              result,
            );
            resolve(result);
          },
          "bindAccount",
          type,
        );
      } else if (this.isIOS) {
        this.bridge.callWithBack(
          function (result) {
            Logger.yyz("绑定账户结果返回: " + result);
            NotificationManager.Instance.dispatchEvent(
              NativeEvent.BIND_ACCOUNT_RET,
              result,
            );
            resolve(result);
          },
          "bindAccount:",
          type,
        );
      }
    });
  }

  checkBindState(): Promise<any> {
    return new Promise<any>((resolve) => {
      this.bridge.callWithBack(function (result) {
        Logger.yyz("查询绑定结果返回：" + result);
        let info: Array<any> = JSON.parse(result);
        NotificationManager.Instance.dispatchEvent(
          NativeEvent.CHECK_BIND_ACCOUNT,
          info,
        );
        resolve(info);
      }, "checkBindState");
    });
  }

  uploadLog() {
    super.uploadLog();
    if (this.isAndroid) {
      let userInfo: UserInfo =
        PlayerManager.Instance.currentPlayerModel.userInfo;
      this.bridge.call("uploadLog", userInfo.userId.toString());
    } else if (this.isIOS) {
    }
  }

  /**原生端打印日志 */
  nativeLog(key: string, desc: string) {
    if (this.isAndroid) {
      this.bridge.call("nativeLog", key, desc);
    } else if (this.isIOS) {
      this.bridge.call("nativeLog::::", key, desc);
    }
  }

  //Bugly日志上报
  pushUserData(key: string, forkey: string) {
    if (this.isAndroid) {
      this.bridge.call("pushUserData", key, forkey);
    } else if (this.isIOS) {
      this.bridge.call("pushUserData::::", key, forkey);
    }
  }
}

window["NativeChannel"] = NativeChannel;
