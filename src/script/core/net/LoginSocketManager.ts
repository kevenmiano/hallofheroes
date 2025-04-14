import GameEventDispatcher from "../event/GameEventDispatcher";
// import IManager from '../Interface/IManager';
import Logger from "../logger/Logger";
import { GameSocket } from "./GameSocket";
import { PackageIn } from "./PackageIn";
import { ServerDataManager } from "./ServerDataManager";
import { SocketEvent } from "./SocketEvent";
// import { SocketManager } from "./SocketManager";
import SDKManager from "../sdk/SDKManager";
import { MessageTipManager } from "../../game/manager/MessageTipManager";
import LangManager from "../lang/LangManager";
import { FrameCtrlManager } from "../../game/mvc/FrameCtrlManager";
import { EmWindow } from "../../game/constant/UIDefine";
import WeakNetCheckModel from "../check/WeakNetCheckModel";
import { LoginManager } from "../../game/module/login/LoginManager";
import { IManager } from "@/script/game/interfaces/Manager";

/**
 * 登录Socket
 */
export class LoginSocketManager
  extends GameEventDispatcher
  implements IManager
{
  private _ip: string;
  private _port: number;
  private _isRelease: boolean = false;
  private _socket: GameSocket;
  public acceptData: boolean = false;

  private static _Instance: LoginSocketManager;

  public static get Instance(): LoginSocketManager {
    if (!this._Instance) {
      this._Instance = new LoginSocketManager();
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
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;

    if (self._socket) {
      self._socket.off(SocketEvent.SERVER_SUCCESS, this, this.onSuccess);
      self._socket.off(SocketEvent.SERVER_DATA, this, this.onSocketData);
      self._socket.off(SocketEvent.SERVER_ERROR, this, this.onError);
      self._socket.off(SocketEvent.SERVER_CLOSE, this, this.onClose);
      self._socket.close();
      if (self._socket) {
        this._socket.dispose();
      }
      self._socket = null;
    }
    self._socket = new GameSocket(true);
    if (!self._socket.hasListener(SocketEvent.SERVER_SUCCESS)) {
      self._socket.on(SocketEvent.SERVER_SUCCESS, self, self.onSuccess);
      self._socket.on(SocketEvent.SERVER_DATA, self, self.onSocketData);
      self._socket.on(SocketEvent.SERVER_ERROR, self, self.onError);
      self._socket.on(SocketEvent.SERVER_CLOSE, self, self.onClose);
    }
  }

  public send(code: number, msg?: any) {
    if (this._socket && this._socket.connected) {
      this._socket.send(code, msg);
    } else {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("login.serverclosed.noneConnected"),
      );
    }
  }

  private onClose() {
    Logger.base("登录服务器已关闭");
    this.dispatchEvent(Laya.Event.CLOSE);
    this.disconnect();
  }

  private onError() {
    Logger.base("连接登录服失败");
    this.dispatchEvent(Laya.Event.ERROR);
    this.disconnect();
  }

  private onSuccess() {
    Logger.base("连接登录服成功");
    LoginSocketManager.Instance.acceptData = true; //暂时先放在这里用于接收服务器发过来的数据
    this.dispatchEvent(Laya.Event.COMPLETE);
  }

  private onSocketData(pkg: PackageIn) {
    ServerDataManager.Instance.add(pkg.code, pkg);
    FrameCtrlManager.Instance.exit(EmWindow.Waiting);
  }

  onShowAlert() {
    FrameCtrlManager.Instance.exit(EmWindow.Waiting);
    SDKManager.Instance.getChannel().showNetworkAlert();
  }

  public crateWeak() {
    if (this._socket) {
      this._socket
        .createWeakNet()
        .model.on(WeakNetCheckModel.WeakNetClose, this.onClose, this);
    }
  }

  /**
   *  主动关闭
   */
  public close() {
    Logger.yyz("关闭登录Socket!");
    let socket = this._socket;
    if (socket) {
      LoginManager.Instance.clearCheckAccelerator();
      socket
        .createWeakNet()
        .model.off(WeakNetCheckModel.WeakNetClose, this.onClose, this);
      socket.createWeakNet().model.reset();
      socket.off(SocketEvent.SERVER_SUCCESS, this, this.onSuccess);
      socket.off(SocketEvent.SERVER_DATA, this, this.onSocketData);
      socket.off(SocketEvent.SERVER_ERROR, this, this.onError);
      socket.off(SocketEvent.SERVER_CLOSE, this, this.onClose);
      socket.close();
    }
    if (this._socket) {
      this._socket.dispose();
    }
    this._socket = null;
  }

  /**
   * 断开连接
   */
  public disconnect() {
    SDKManager.Instance.getChannel().showNetworkAlert();
    Logger.yyz("断开连接！！");
    this.close();
  }
}
