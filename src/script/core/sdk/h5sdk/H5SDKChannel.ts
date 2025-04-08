import { ChannelID, ChannelSTR, H5SDK_CHANNEL_ID } from "../SDKConfig";
import { UserInfo } from "../../../game/datas/userinfo/UserInfo";
import { ArmyManager } from "../../../game/manager/ArmyManager";
import { PlayerManager } from "../../../game/manager/PlayerManager";
import { t_s_rechargeData } from "../../../game/config/t_s_recharge";
import { TempleteManager } from "../../../game/manager/TempleteManager";
import { VIPManager } from "../../../game/manager/VIPManager";
import Utils from "../../utils/Utils";
import { GameEventCode } from "../../../game/constant/GameEventCode";
import Logger from "../../logger/Logger";
import { LoginManager } from "../../../game/module/login/LoginManager";
import YMWebManager from "../../../game/manager/YMWebManager";
import BaseChannel from "../base/BaseChannel";

export default class H5SDKChannel extends BaseChannel {
  /**token具有时效性 */
  private token: string = "";
  /**用户唯一标识 */
  private userId: string = "";
  /**扩展字段 */
  private exInfo: string = "";
  private appId: number = 0;
  private channelId: number = 0;
  private packageId: number = 0;
  private sdkVersion: string = "1.0.0";

  constructor(id: ChannelID) {
    super(id);
  }

  initRoad_7(param?: any) {
    return new Promise<any>((resolve, reject) => {
      let urlChannelID = Utils.GetUrlQueryString("channelId");
      let dateStr = "?v=" + new Date().getTime();
      let libUrl = "libs/h5sdk/7RoadWXgame.js" + dateStr;
      if (Utils.isWxMiniGame()) {
        libUrl = "libs/h5sdk/7RoadWXgame.js" + dateStr;
      } else if (
        urlChannelID == H5SDK_CHANNEL_ID.HY ||
        urlChannelID == H5SDK_CHANNEL_ID.HY_S
      ) {
        libUrl = "libs/h5sdk/hy7RoadGame.js" + dateStr;
      } else if (
        urlChannelID == H5SDK_CHANNEL_ID.DY ||
        urlChannelID == H5SDK_CHANNEL_ID.DY_S
      ) {
        libUrl = "libs/h5sdk/dy7RoadGame.js" + dateStr;
      } else if (urlChannelID == H5SDK_CHANNEL_ID.C_4399) {
        libUrl = "libs/h5sdk/4399_7RoadGame.js" + dateStr;
      } else if (urlChannelID == H5SDK_CHANNEL_ID.C_360) {
        libUrl = "libs/h5sdk/360_7RoadGame.js" + dateStr;
      } else if (urlChannelID == H5SDK_CHANNEL_ID.QQHall) {
        libUrl = "libs/h5sdk/QQ_7RoadGame.js" + dateStr;
      } else if (urlChannelID == H5SDK_CHANNEL_ID.LABA) {
        libUrl = "libs/h5sdk/labah5_7RoadGame.js" + dateStr;
      } else if (urlChannelID == H5SDK_CHANNEL_ID.QQMobile) {
        libUrl = "libs/h5sdk/QQmoblie_7RoadGame.js" + dateStr;
      } else if (urlChannelID == H5SDK_CHANNEL_ID.QQZone) {
        libUrl = "libs/h5sdk/QQzone_7RoadGame.js" + dateStr;
      }
      //@ts-ignore
      window.Road_7 = window.loadLib(libUrl, () => {
        let initData = null;
        if (param) {
          initData = {
            userId: param.user,
            deviceNo: param.deviceNo,
            channelParam: param.channelParam,
          };
        }
        //@ts-ignore
        window.Road_7.init(initData)
          .then(async (res) => {
            // 初始化成功回调
            Logger.log("ROAD7SDK", res);
            let configInfo = null;
            if (res && res.code == 200) {
              configInfo = res.data.configInfo;
              for (let i in configInfo) {
                this[i] = configInfo[i];
              }
            }
            this.appId = await this.getConfigItem("appId");
            this.channelId = await this.getConfigItem("channelId");
            this.packageId = await this.getConfigItem("packageId");
            let objData = {
              appId: this.appId,
              channelId: this.channelId.toString(),
              packageId: this.packageId,
            };
            resolve(objData);
          })
          .catch((err) => {
            // 初始化失败回调
            Logger.log("ROAD7err", err);
            reject(err);
          });
      });
    });
  }

  getUserId() {
    return this.userId;
  }

  getToken() {
    return this.token;
  }

  getExInfo() {
    return this.exInfo;
  }

  getChannelId() {
    return this.channelId;
  }

  /**
   * 支付
   * @param data 数据
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
    gameExInfo: any,
    count: number,
    coinType: string,
    virtualCoinType: string,
    oExInfo?: string
  ): void {
    // let rechargeData: t_s_rechargeData = TempleteManager.Instance.getRechargeTempleteByProductID('sqh5.gem.pay6');
    let rechargeData: t_s_rechargeData =
      TempleteManager.Instance.getRechargeTempleteByProductID(productId);

    let userInfo: UserInfo = PlayerManager.Instance.currentPlayerModel.userInfo;
    let playerInfo = PlayerManager.Instance.currentPlayerModel.playerInfo;
    let productType = rechargeData.ProductType;
    let productImg =
      "https://ts2-h5.7road.net/res/charge/Img_Top_up_" + productType + ".png";
    if (!gameExInfo) {
      gameExInfo = {
        productImg: productImg,
      };
    } else {
      gameExInfo["productImg"] = productImg;
    }
    let data = {
      //充值表数据
      gameOrderId: orderId,
      productId: rechargeData.ProductId,
      productName: rechargeData.ProductName,
      productDesc: rechargeData.ProductDesc,
      currency: rechargeData.MoneyType,
      gameCoin: parseInt(rechargeData.Para2),
      showCoin: parseInt(rechargeData.Para3),
      amount: rechargeData.MoneyNum,
      gameCoinCurrency: "钻石",

      gameZoneId: userInfo.siteId.toString(),
      roleId: userInfo.userId.toString(),
      roleName: playerInfo.nickName,
      roleLevel: ArmyManager.Instance.thane.grades,
      vipLevel: playerInfo.vipGrade,
      gameExInfo: JSON.stringify(gameExInfo), //QQ大厅需要添加productImg
      exInfo: "",
    };

    Logger.log("testRecharge", rechargeData, data);
    //@ts-ignore
    window.Road_7.order(data)
      .then((res) => {
        // 支付成功回调
        Logger.log("ROAD7Order", res);
      })
      .catch((err) => {
        // 支付失败回调
        Logger.log("ROAD7err", err);
      });
  }

  /**
   * 游戏事件
   * @param code  GameEventCode
   * @param exInfo    额外字段, 可根据情况自定义字段名称以json 串的形式传入（需提前沟通key值）。
   */
  public postGameEvent(code: number, exInfo: string = "") {
    let userInfo: UserInfo = PlayerManager.Instance.currentPlayerModel.userInfo;
    let playerInfo = PlayerManager.Instance.currentPlayerModel.playerInfo;
    let siteId: string = userInfo.siteId.toString();
    let gameZoneName: string = playerInfo.serviceName;
    let jsonData = null;
    let eventName: string = "";
    if (exInfo != "") {
      jsonData = JSON.parse(exInfo);
      eventName = jsonData.eventToken ? jsonData.eventToken : "";
    }

    if (code == GameEventCode.Code_1023) {
      siteId = jsonData.gameZoneId;
      gameZoneName = jsonData.gameZoneName;
    }
    let vipGrade: number = 0;
    if (VIPManager.Instance.model && VIPManager.Instance.model.vipInfo) {
      vipGrade = VIPManager.Instance.model.vipInfo.VipGrade;
    }
    let data = {
      gameZoneId: siteId,
      roleId: userInfo.userId.toString(),
      roleName: playerInfo.nickName,
      level: ArmyManager.Instance.thane.grades,
      gameZoneName: gameZoneName, //区服名称
      vipLevel: vipGrade, //vip等级
      eventName: eventName, //事件名称
    };
    Logger.log("WXPost", code, data);
    try {
      //@ts-ignore
      window.Road_7.reportLog(code, data);
    } catch (error) {
      Logger.error(error);
    }
  }

  /**
   * 获取广告参数
   */
  public getAdparams() {
    //@ts-ignore
    window.Road_7.getAdparams().then((res) => {
      // res为上报tlog的广告参数
      // 返回数据格式为JSON对象
      // {
      //	 key: value
      // }
      Logger.log("DYAdparams", res);
    });
  }

  /**
   * 获取项目配置
   * @param name
   * @returns
   */
  getConfigItem(name?: string) {
    return new Promise<any>((resolve, reject) => {
      //@ts-ignore
      window.Road_7.getConfigItem(name).then((res) => {
        // res为上报tlog的广告参数
        // 返回数据格式为JSON对象
        // {
        //	 key: value
        // }
        Logger.log("DY getConfigItem", res);
        resolve(res);
      });
    });
  }

  logout(b: boolean = false) {
    //平台回退
    try {
      //@ts-ignore
      window.Road_7.logout();
      YMWebManager.Instance.logout();
    } catch (error) {
      Logger.error("logout:", error);
    }
    window.location.reload();
  }

  /**
   * 打开QQ客服
   * @param url
   * @param qq
   */
  openQQService(url: string, qq: string) {
    Laya.Browser.window.open(url);
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
    cb: Function
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
    appData: any = null
  ) {
    this.platId = 5;
    if (Utils.isFromMicroApp()) {
      this.platId = 6;
    }
    LoginManager.Instance.c2s_createLoginReq(
      userName,
      pass,
      site,
      siteId,
      ChannelSTR.APP,
      this.platId,
      appData
    ); //请求玩家列表
  }

  /**
   * 跳转大玩咖特权（渠道方跳转）  QQ_HALL_PRIVILEGE
   * 1001	游券礼包特权
   * 1002	高阶玩咖特权
   * 1003	生日专属特权
   * 1004	专属服务特权
   * 1005	充值共享特权
   * 1006	特权获取说明
   * */
  jumpPrivilege(code: number) {
    //@ts-ignore
    window.Road_7.jumpPrivilege(code);
  }

  /**
   * 刷新页面（渠道方同步页面）
   */
  refresh() {
    //@ts-ignore
    window.Road_7.refresh();
  }

  /**
   * 获取用户信息
   * Road_7.getUserInfo().then((res) => {
   *      res为用户的基本信息
   *      返回数据格式为JSON对象
   *      {
   *       key: value
   *      }
   *  })
   */
  getUserInfo(): Promise<any> {
    //@ts-ignore
    return window.Road_7.getUserInfo();
  }
}
