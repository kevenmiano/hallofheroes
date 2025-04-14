import GameEventDispatcher from "../../../../core/event/GameEventDispatcher";
import Resolution from "../../../../core/comps/Resolution";

export class StageReferance {
  public static keyBoardEnable: boolean = true;
  private static _stageHeight: number = 0;
  private static _stageWidth: number = 0;
  private static _stage: Laya.Stage;
  private static widthChange: string = "widthChange";
  private static heightChange: string = "heightChange";
  private static _dict: object = new Object();
  private static eventDispatcher: GameEventDispatcher =
    new GameEventDispatcher();

  public static get stageWidth(): number {
    return this._stageWidth;
  }

  public static set stageWidth(value: number) {
    if (this._stageWidth == value) return;
    this._stageWidth = value;
    this._dict[this.widthChange] = true;
  }

  public static get stageHeight(): number {
    return this._stageHeight;
  }

  public static set stageHeight(value: number) {
    if (this._stageHeight == value) return;
    this._stageHeight = value;
    this._dict[this.heightChange] = true;
  }

  public static commit() {
    if (this._dict[this.widthChange] || this._dict[this.heightChange]) {
      this.eventDispatcher.dispatchEvent(Laya.Event.RESIZE);
      this._dict[this.widthChange] = false;
      this._dict[this.heightChange] = false;
    }
  }

  public static setup($stage: Laya.Stage) {
    if (this._stage != null) return;
    this._stage = $stage;
    this._stage.on(Laya.Event.RESIZE, this, this.__onResize);
    this.__onResize(null);
  }

  public static addEventListener(
    type: string,
    listener: (event?: any) => void,
    target?: object,
  ) {
    this.eventDispatcher.addEventListener(type, listener, target);
  }

  public static removeEventListener(
    type: string,
    listener: (event?: any) => void,
    target?: object,
  ) {
    this.eventDispatcher.removeEventListener(type, listener, target);
  }

  private static __onResize(event: Event) {
    this.stageWidth = Resolution.gameWidth;
    this.stageHeight = Resolution.gameHeight;
    this.commit();
  }

  public static get stage(): Laya.Stage {
    return this._stage;
  }
}
