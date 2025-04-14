import { DisplayObject } from "../../../component/DisplayObject";
// import { IEnterFrame } from "../../../interfaces/IEnterFrame";
import { EnterFrameManager } from "../../../manager/EnterFrameManager";
import { BattleBackGroundData } from "../../data/BattleBackGroundData";

export class RepeatBackGroundLayer extends Laya.Sprite implements IEnterFrame {
  private _x: number = 0;
  private _xOffset: number = 0;
  private _moveSpeed: number = 0;

  private _shape: Laya.Sprite;
  private _matrix: Laya.Matrix;
  private _bitmap: Laya.Sprite;
  protected _asset: DisplayObject;
  private _inited: boolean;
  private _transparent: boolean;

  constructor(asset: DisplayObject, transparent: boolean = true) {
    super();
    this._asset = asset;
    this._transparent = transparent;
    this.addChild(this._asset);
  }
  private init() {
    this._shape = new Laya.Sprite();
    this._shape.y = this._asset.y;
    this.addChild(this._shape);
    this._matrix = new Laya.Matrix();
    this.refreshView();
  }

  // private getBitmap(): Laya.Bitmap {
  //     return new Laya.Bitmap(this._bitmapdata, "auto", false);
  // }

  public set x(value: number) {
    if (this._x == value) return;
    this._x = value;
    this.refreshView();
  }

  public get x(): number {
    return this._x;
  }

  private refreshView() {
    var restX: number = (this.x + this._xOffset) % 1300;
    this._matrix.tx = restX;
    this._shape.graphics.clear();
    this._shape.graphics.drawRect(
      0,
      0,
      this._asset.width,
      this._asset.height,
      "#0x000000",
    );
  }

  public get moveSpeed(): number {
    return this._moveSpeed;
  }

  private timeOutId: any = 0;
  public set moveSpeed(value: number) {
    this._moveSpeed = value;
    if (value != 0) {
      EnterFrameManager.Instance.registeEnterFrame(this);
      if (!this._inited) {
        this.timeOutId = setTimeout(this.delayInitBmd.bind(this), 1750);
        this._inited = true;
      }
    } else {
      EnterFrameManager.Instance.unRegisteEnterFrame(this);
    }
  }

  private delayInitBmd() {
    clearTimeout(this.timeOutId);
    this.timeOutId = 0;
    if (this._asset) {
      this.init();
      this.removeChild(this._asset);
      this._asset = null;
    }
  }

  private _groundData: BattleBackGroundData;
  public setParaData(data: BattleBackGroundData) {
    this._groundData = data;
  }

  public getParaData(): BattleBackGroundData {
    return this._groundData;
  }

  public enterFrame() {
    this._xOffset += this.moveSpeed;
    this.refreshView();
  }

  private __enterFrame(event: Event) {
    this._xOffset += this.moveSpeed;
    this.refreshView();
  }

  public dispose() {
    this.moveSpeed = 0;

    if (this._bitmap) {
      if (this._bitmap.parent) this.removeChild(this._bitmap);
      this._bitmap.destroy();
      this._bitmap = null;
    }
    if (this._shape) {
      if (this._shape.parent) {
        this._shape.parent.removeChild(this._shape);
      }
      this._shape.graphics.clear();
      this._shape = null;
    }
    if (this._asset) {
      if (this._asset.parent) {
        this._asset.parent.removeChild(this._asset);
      }
    }
    this._asset = null;
  }
}
