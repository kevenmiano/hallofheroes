import Base64 from "../utils/Base64";
import GameEventDispatcher from "../event/GameEventDispatcher";
import { IManager } from "../../game/interfaces/Manager";
import Logger from "../logger/Logger";

export default class StorageHelper
  extends GameEventDispatcher
  implements IManager
{
  private static _instance: StorageHelper;

  public static get Instance(): StorageHelper {
    if (!this._instance) {
      this._instance = new StorageHelper();
    }
    return this._instance;
  }

  public preSetup() {}

  setup(t?: any) {}

  get(key) {
    // if (Laya.Browser.onBDMiniGame) {
    //     let res = swan.getStorageSync(key);
    //     if (res) {
    //         if ((res instanceof Error)) {
    //             return null;
    //         }
    //     }
    //     return res;
    // } else {
    return Laya.LocalStorage.getItem(key);
    // }
  }
  set(key, value) {
    // if (Laya.Browser.onBDMiniGame) {
    //     swan.setStorageSync(key, value)
    // } else {
    Laya.LocalStorage.setItem(key, value);
    // }
  }
  // clear() {
  //     Laya.LocalStorage.clear();
  // }
  // remove(key) {
  //     Laya.LocalStorage.removeItem(key);
  // }
  setJson(key, value) {
    this.set(key, JSON.stringify(value));
  }
  getJson(key) {
    let value = this.get(key);
    if (!value) {
      return null;
    }
    return JSON.parse(value);
  }
  getJsonBase64(key) {
    let localValue = this.get(key);
    if (!localValue) {
      return null;
    }
    let string = Base64.decode(localValue);
    if (string) {
      try {
        let value = JSON.parse(string);
        return value;
      } catch {
        Logger.error(" getJsonBase64");
      }
    }
    return {};
  }
  setJsonBase64(key, value) {
    this.set(key, Base64.encode(JSON.stringify(value)));
  }
  setBase64(key, value) {
    this.set(key, Base64.encode(value));
  }
  getBase64(key) {
    let localValue = this.get(key);
    if (!localValue) {
      return "";
    }
    let value = Base64.decode(localValue);
    return value;
  }
}
