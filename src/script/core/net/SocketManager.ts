// @ts-nocheck
import GameEventDispatcher from "../event/GameEventDispatcher";
// import IManager from '../Interface/IManager';
import Logger from "../logger/Logger";
import { GameSocket } from "./GameSocket";
import { PackageIn } from "./PackageIn";
import { ServerDataManager } from "./ServerDataManager";
import { SocketEvent } from "./SocketEvent";
import { LoginManager } from "../../game/module/login/LoginManager";
import UIManager from "../ui/UIManager";
import { EmWindow } from "../../game/constant/UIDefine";
import { HintWnd } from "../../game/module/common/HintWnd";
import { SceneManager } from "../../game/map/scene/SceneManager";
import SceneType from "../../game/map/scene/SceneType";
import LangManager from "../lang/LangManager";
import SDKManager from "../sdk/SDKManager";
import { NotificationManager } from "../../game/manager/NotificationManager";
import NewbieBaseActionMediator from "../../game/module/guide/mediators/NewbieBaseActionMediator";
import Utils from "../utils/Utils";
import { FrameCtrlManager } from "../../game/mvc/FrameCtrlManager";
import WeakNetCheckModel from "../check/WeakNetCheckModel";
import ProtoManager from "../../game/manager/ProtoManager";
import UIHelper from "../../game/utils/UIHelper";
import SimpleAlertHelper from "../../game/component/SimpleAlertHelper";

/**
 * 网关Socket
 */
export class SocketManager extends GameEventDispatcher {
  private _ip: string;
  private _port: number;
  private _isRelease: boolean = false;
  private _socket: GameSocket;
  public acceptData: boolean = false;

  private disconnect: boolean = false;
  public isReconnecting: boolean = false; //是否正在重连
  public isReconnected: boolean = false;

  /**重连最大次数**/
  private reconnectMacCount = 5;
  /***重连计数器***/
  private reconnectCounter = 1;
  /***每次重连CD时间 秒***/
  private reconnectTimeCoolDown = 3;
  /**重连时间计数器 秒**/
  private reconnectTimeCounter = 0;
  /**首次断开**/
  private firstDisconnect = true;
  /**接收协议超时时间*/
  private _protoTimeout: number = 5000;

  private static _Instance: SocketManager;

  public static get Instance(): SocketManager {
    if (!this._Instance) {
      this._Instance = new SocketManager();
    }
    return this._Instance;
  }

  constructor() {
    super();
  }

  preSetup(t?: any) {}

  setup(t?: any) {}

  get socket(): GameSocket {
    return this._socket;
  }

  public connect(ip?: string, port?: number, release: boolean = false) {
    this._ip = ip;
    this._port = port;
    this._isRelease = release;
    this.regEvent();
    this._socket.connect(ip, port, release);
  }

  public regEvent() {
    const self = this;
    if (!self._socket) {
      self._socket = new GameSocket(true);
    }

    if (!self._socket.hasListener(SocketEvent.SERVER_SUCCESS)) {
      self._socket.on(SocketEvent.SERVER_SUCCESS, self, self.onSuccess);
      self._socket.on(SocketEvent.SERVER_DATA, self, self.onSocketData);
      self._socket.on(SocketEvent.SERVER_ERROR, self, self.onError);
      self._socket.on(SocketEvent.SERVER_CLOSE, self, self.onClose);
    }
    NotificationManager.Instance.on(
      SocketEvent.SERVER_DATA,
      self.onSocketDataRecord,
      self
    );
  }

  public send(code: number, msg?: any, extendId?: number) {
    if (this._socket && this._socket.connected) {
      this._socket.send(code, msg, extendId);
      ProtoManager.Instance.checkC2SCode(code);
    } else {
      // MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("login.serverclosed.noneConnected"));
    }
  }

  public onClose(evt) {
    Logger.base("网关服务器已关闭", evt);
    SDKManager.Instance.getChannel().nativeLog(
      "socketManager:onClose",
      "网关服务器已关闭"
    );
    this.dispatchEvent(Laya.Event.CLOSE);
    if (SceneManager.Instance.currentType == SceneType.BATTLE_SCENE) {
      SDKManager.Instance.getChannel().showNetworkAlert();
      this.close();
    } else {
      this.tryReconnect();
    }
    this.firstDisconnect = false;
    this.disconnect = true;
  }

  private onError(evt) {
    Logger.base("连接网关服务器失败", evt);
    SDKManager.Instance.getChannel().nativeLog(
      "socketManager:onError",
      "连接网关服务器失败"
    );
    this.dispatchEvent(Laya.Event.ERROR);
    // this.reconnect();
    this.tryReconnect();
    this.firstDisconnect = false;
    this.disconnect = true;
  }

  private onSuccess() {
    Logger.base("连接网关服务器成功");
    SDKManager.Instance.getChannel().nativeLog(
      "socketManager:onSuccess",
      "连接网关服务器成功"
    );
    //开启弱网检测
    this._socket
      .createWeakNet()
      .model.on(WeakNetCheckModel.WeakNetClose, this.onClose, this);
    SocketManager.Instance.acceptData = true; //暂时先放在这里用于接收服务器发过来的数据
    this.dispatchEvent(Laya.Event.COMPLETE);
    LoginManager.Instance.loginOther = false;
    if (this.disconnect) {
      this.isReconnected = true;
    }
    //重置重连
    this.resetReconnection();
  }

  private onSocketDataRecord(pkg: PackageIn) {
    ServerDataManager.Instance.add(pkg.code, pkg);
  }

  private onSocketData(pkg: PackageIn) {
    SDKManager.Instance.getChannel().nativeLog(
      "socketManager:onSocketData:",
      "" + pkg.code
    );
    ProtoManager.Instance.checkS2CCode(pkg.code);
    ServerDataManager.Instance.add(pkg.code, pkg);
    FrameCtrlManager.Instance.exit(EmWindow.Waiting);
  }

  //清理作用,和名字不一样；不会触发 close事件, 不会触发断线重连。调用 onClose, 可以触发断线重连。
  public close() {
    Laya.timer.clear(this, this.tick);

    const socket = this._socket;
    this._socket
      .createWeakNet()
      .model.off(WeakNetCheckModel.WeakNetClose, this.onClose, this);
    if (socket) {
      socket.off(SocketEvent.SERVER_SUCCESS, this, this.onSuccess);
      socket.off(SocketEvent.SERVER_DATA, this, this.onSocketData);
      socket.off(SocketEvent.SERVER_ERROR, this, this.onError);
      socket.off(SocketEvent.SERVER_CLOSE, this, this.onClose);
      socket.close();
    }
    this._socket = null;
    SDKManager.Instance.getChannel().nativeLog(
      "socketManager:close",
      "关闭socket"
    );
    NotificationManager.Instance.off(
      SocketEvent.SERVER_DATA,
      this.onSocketDataRecord,
      this
    );
  }

  public tryReconnect() {
    FrameCtrlManager.Instance.exit(EmWindow.Waiting);
    UIHelper.closeWindows([
      EmWindow.SpaceTaskInfoWnd,
      EmWindow.Home,
      EmWindow.LevelUp,
      EmWindow.LogWnd,
      EmWindow.AutoWalkWnd,
      EmWindow.RoomHall,
      EmWindow.PveSecretSceneWnd,
    ]);

    if (LoginManager.Instance.loginOther) return;
    if (this.isReconnecting) return;
    //清理, 避免原生端可能出现的问题
    this.close();
    //已经达到最大重连数量, 交给SDK处理
    if (this.isMaxReconnected()) {
      SDKManager.Instance.getChannel().nativeLog(
        "socketManager:tryReconnect",
        "已达到最大重连次数"
      );
      // 清理新手, 避免遮住 网络异常消息框, 不能点击
      NewbieBaseActionMediator.cleanAll();
      SDKManager.Instance.getChannel().showNetworkAlert();
      this.resetReconnection();
      return;
    }
    this.isReconnecting = true;
    //首次断开连接且是火狐浏览器, 立即连接一次
    if (this.firstDisconnect && Utils.isFirfox()) {
      this.goToReconnect();
      return;
    }
    Laya.timer.loop(1000, this, this.tick);
  }

  public tick() {
    this.showReconnectHint(
      this.reconnectTimeCoolDown - this.reconnectTimeCounter,
      this.reconnectCounter
    );
    this.reconnectTimeCounter++;
    SDKManager.Instance.getChannel().nativeLog(
      "socketManager:tryReconnect",
      "重新链接:+" + this.reconnectCounter
    );
    if (this.reconnectTimeCounter >= this.reconnectTimeCoolDown) {
      Laya.timer.clear(this, this.tick);
      this.goToReconnect();
    }
  }

  public goToReconnect() {
    this.reconnectTimeCounter = 0;
    this.reconnectCounter++;
    this.isReconnecting = false;
    this.connect(this._ip, this._port, this._isRelease);
  }

  public resetReconnection() {
    SDKManager.Instance.getChannel().nativeLog(
      "socketManager:resetReconnection",
      "重置链接"
    );
    this.firstDisconnect = true;
    this.reconnectTimeCounter = 0;
    this.reconnectCounter = 1;
    this.hideReconnectHint();
  }

  public isConnected() {
    return this._socket && this.socket.connected;
  }

  public isMaxReconnected() {
    return this.reconnectCounter > this.reconnectMacCount;
  }

  public async showReconnectHint(cd: number, recounter: number) {
    FrameCtrlManager.Instance.exit(EmWindow.Waiting);
    SimpleAlertHelper.Instance.Hide();
    if (!this.reConnetAlert) {
      //这个异步有可能未加载完成, 就已经连接成功了, 或者已经达到最大重连数了。
      this.reConnetAlert = await UIManager.Instance.ShowWind(
        EmWindow.HintWnd,
        LangManager.Instance.GetTranslation(
          "reconnection.tip",
          recounter + "/" + this.reconnectMacCount
        )
      );
      //这里需要重新判断一次, 是否已经连接成功, 或者已经达到最大重连数了, 隐藏。
      if (this.isConnected() || this.isMaxReconnected())
        this.hideReconnectHint();
    } else {
      this.reConnetAlert.visible = true;
      this.reConnetAlert.active = true;
      this.reConnetAlert.setHintText(
        LangManager.Instance.GetTranslation(
          "reconnection.tip",
          recounter + "/" + this.reconnectMacCount
        )
      );
    }
  }

  public hideReconnectHint() {
    if (this.reConnetAlert) {
      this.reConnetAlert.hide();
      this.reConnetAlert = null;
    }
  }

  reConnetAlert: HintWnd = null;
}
