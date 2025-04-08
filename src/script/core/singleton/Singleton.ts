// import IManager from '../Interface/IManager';
import GameEventDispatcher from "../event/GameEventDispatcher";
export default class Singleton extends GameEventDispatcher {
  private static _instance = null;
  static get Instance() {
    if (!this._instance) {
      this._instance = new this();
      this._instance.setup();
    }
    return this._instance;
  }

  /**
   * 初始化
   * @param t
   */
  preSetup(t?: any) {}

  /**
   * 初始化
   * @param t
   */
  setup(t?: any) {}

  static clearSingleton() {
    if (this._instance) {
      this._instance = null;
    }
  }
}
