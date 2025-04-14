// import { IEnterFrame } from "@/script/game/interfaces/EnterFrame";

import { IEnterFrame } from "@/script/game/interfaces/EnterFrame";

export class EnterFrameManager {
  public static FPS: number = 24;
  private static _instance: EnterFrameManager;
  public static get Instance(): EnterFrameManager {
    if (!EnterFrameManager._instance) {
      EnterFrameManager._instance = new EnterFrameManager();
    }
    return EnterFrameManager._instance;
  }

  private _items: Map<any, IEnterFrame>;

  public preSetup() {
    if (this._items) {
      return;
    }
    this._items = new Map<any, IEnterFrame>();
    // Laya.timer.frameLoop(1, this, this.__enterFrameHandler);
    // flash 页神 24fps
    Laya.stage.timerLoop(
      1000 / EnterFrameManager.FPS,
      this,
      this.__enterFrameHandler,
    );
  }

  public setup() {}

  public enterFrameCount: number = 0;

  private __enterFrameHandler(evt: Event) {
    this.enterFrameCount++;
    this._items.forEach((item, key) => {
      if (item) {
        const time = Date.now(); // Example: Use current timestamp as the time argument
        item.enterFrame(time);
      }
    });
  }

  public registeEnterFrame(mc: IEnterFrame) {
    for (var key in this._items) {
      if (!this._items.get(key)) {
        this._items.delete(key);
      }
    }
    this._items.set(mc, mc);
  }

  public getMessage(): string {
    var mssage: string = "";
    var count: number = 0;
    for (const itemsKey in this._items) {
      let item: IEnterFrame = this._items.get(itemsKey);
      count++;
      mssage += count + " : " + item + "\n";
    }
    return mssage;
  }

  public unRegisteEnterFrame(mc: IEnterFrame) {
    this._items.delete(mc);
  }
}
