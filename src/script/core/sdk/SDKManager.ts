import BaseChannel from "./base/BaseChannel";
import { ChannelID } from "./SDKConfig";
import WXChannel from "./wx/WXChannel";
import OppoChannel from "./oppo/OppoChannel";
import QQChannel from "./qq/QQChannel";
import VivoChannel from "./vivo/VivoChannel";
import TTChannel from "./tt/TTChannel";
import BDChannel from "./bd/BDChannel";
import GameEventDispatcher from "../event/GameEventDispatcher";
// // import IManager from '../Interface/IManager';
import { NativeChannel } from "./native/NativeChannel";
import Utils from "../utils/Utils";
import { AndroidWebviewChannel } from "./android_webview/AndroidWebviewChannel";
import WanChannel from "./wan/WanChannel";
import H5SDKChannel from "./h5sdk/H5SDKChannel";
import DevChannel from "./dev/DevChannel";
import FccChannel from "./fcc/FccChannel";

export default class SDKManager extends GameEventDispatcher {
  protected channel: BaseChannel = null;

  private static _instance: SDKManager;

  public static get Instance(): SDKManager {
    if (!this._instance) {
      this._instance = new SDKManager();
    }
    return this._instance;
  }

  preSetup(t?: any) {
    if (Utils.isIOS() || Utils.isAndroid()) {
      SDKManager.Instance.init(ChannelID.NATIVE);
    } else if (Utils.isWebView()) {
      SDKManager.Instance.init(ChannelID.WEBVIEW);
    } else if (Utils.isWebWan()) {
      SDKManager.Instance.init(ChannelID.WEB_WAN);
    } else if (Utils.isH5SDK()) {
      SDKManager.Instance.init(ChannelID.WEB_H5SDK);
    } else if (Utils.isWxMiniGame()) {
      SDKManager.Instance.init(ChannelID.WX);
    } else if (Utils.isFCC()) {
      SDKManager.Instance.init(ChannelID.FCC);
    } else {
      SDKManager.Instance.init(ChannelID.DEV);
    }
  }

  setup(t?: any) {}

  getChannel() {
    return this.channel;
  }

  init(id: ChannelID) {
    let channelID: number = id;
    switch (channelID) {
      case ChannelID.WX:
        this.channel = new WXChannel(channelID);
        break;
      case ChannelID.BD:
        this.channel = new BDChannel(channelID);
        break;
      case ChannelID.TT:
        this.channel = new TTChannel(channelID);
        break;
      case ChannelID.VIVO:
        this.channel = new VivoChannel(channelID);
        break;
      case ChannelID.OPPO:
        this.channel = new OppoChannel(channelID);
        break;
      case ChannelID.QQ:
        this.channel = new QQChannel(channelID);
        break;
      case ChannelID.NATIVE:
        this.channel = new NativeChannel(channelID);
        break;
      case ChannelID.WEBVIEW:
        this.channel = new AndroidWebviewChannel(channelID);
        break;
      case ChannelID.WEB_WAN:
        this.channel = new WanChannel(channelID);
        break;
      case ChannelID.FCC:
        this.channel = new FccChannel(channelID);
        break;
      case ChannelID.WEB_H5SDK:
        this.channel = new H5SDKChannel(channelID);
        break;
      default:
        this.channel = new DevChannel(channelID);
        break;
    }
  }
}
