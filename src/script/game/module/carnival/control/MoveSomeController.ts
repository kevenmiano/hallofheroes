// @ts-nocheck
import ObjectUtils from "../../../../core/utils/ObjectUtils";
import { DisplayObject } from "../../../component/DisplayObject";
// import { IEnterFrame } from "../../../interfaces/IEnterFrame";
import { EnterFrameManager } from "../../../manager/EnterFrameManager";

/**
 * 运动控制器
 * $itemList 显示对象数组,
 * $itemList2 显示对象,
 * $itemSpace 间隔,
 * $way 样式,
 * $lessRun  至少运行时间 单位: 毫秒,
 * $initSpeed 起始速度,
 * $initBackSpeed 平稳速度,
 * $callBack 回调函数
 */
export default class MoveSomeController
  extends fgui.GComponent
  implements IEnterFrame
{
  private LEFT: number = 1;
  private RIGHT: number = 2;
  private UP: number = 3;
  private DOWN: number = 4;

  private _itemList: Array<any>;
  private _itemList2: Array<any>;
  private _itemLen: number = 0;
  private _itemSpace: number = 0;
  private _firstSp: Laya.Sprite;
  private _secondSp: Laya.Sprite;
  private _tempSp: Laya.Sprite;
  private _way: number = 0; //1,2,3,4
  private _lessRun: number = 0;
  private _initSpeed: number = 0;
  private _initBackSpeed: number = 0;
  private _maskRect: Laya.Sprite;
  private _callBack: Function;
  private _callParams: Array<any>;
  /**
   *
   * @param $itemList 显示对象数组
   * @param $itemList2 显示对象
   * @param $itemSpace 间隔
   * @param $way 样式
   * @param $lessRun  至少运行时间 单位: 毫秒
   * @param $initSpeed 起始速度
   * @param $initBackSpeed 平稳速度
   * @param $callBack
   */
  constructor(
    $itemList: Array<any>,
    $itemList2: Array<any>,
    $itemSpace: number = 0,
    $way: number,
    $lessRun: number,
    $initSpeed: number,
    $initBackSpeed: number,
    $callBack: Function = null
  ) {
    super();
    this._itemList = $itemList;
    this._itemLen = this._itemList ? this._itemList.length : 0;
    this._itemList2 = $itemList2;
    this._itemSpace = $itemSpace;
    this._way = $way;
    this._lessRun = $lessRun;
    this._initSpeed = $initSpeed;
    this._initBackSpeed = $initBackSpeed;
    this._callBack = $callBack;
    this.initView();
  }

  public addCallParams($callParams: Array<any>) {
    this._callParams = $callParams;
  }

  private initView() {
    this._maskRect = new Laya.Sprite();
    this._firstSp = new Laya.Sprite();
    this._secondSp = new Laya.Sprite();

    // this.displayObject.addChild(this._maskRect);
    this.displayObject.addChild(this._firstSp);
    this.displayObject.addChild(this._secondSp);

    var i: number = 0;
    var addNum: number;
    switch (this._way) {
      case this.UP:
        this._secondSp.y = this._itemSpace * this._itemLen;
        addNum = this._itemSpace;
        break;
      case this.DOWN:
        this._secondSp.y = -this._itemSpace * this._itemLen;
        addNum = -this._itemSpace;
        break;
      case this.LEFT:
        this._secondSp.x = this._itemSpace * this._itemLen;
        addNum = this._itemSpace;
        break;
      case this.RIGHT:
        this._secondSp.x = -this._itemSpace * this._itemLen;
        addNum = -this._itemSpace;
        break;
    }
    var item: any;
    var item2: any;
    for (i = 0; i < this._itemLen; i++) {
      item = this._itemList[i];
      item2 = this._itemList2[i];
      if (this._way == this.UP || this._way == this.DOWN) {
        item.y = addNum * i;
        item2.y = addNum * i;
      } else if (this._way == this.LEFT || this._way == this.RIGHT) {
        item.x = addNum * i;
        item2.x = addNum * i;
      }
      if (item instanceof Laya.Sprite) this._firstSp.addChild(item);
      else if (item instanceof fgui.GComponent)
        this._firstSp.addChild(item.displayObject);

      if (item2 instanceof Laya.Sprite) this._secondSp.addChild(item2);
      else if (item2 instanceof fgui.GComponent)
        this._secondSp.addChild(item2.displayObject);
    }
  }
  //这里会造成 bitmap size larger than 2048,cache ignored
  public initMask($ww: number, $hh: number, $x: number = 0, $y: number = 0) {
    // this._maskRect.graphics.clear();
    // this._maskRect.graphics.drawRect(0, 0, $ww, $hh, "#000000");
    // this._maskRect.width = $ww;
    // this._maskRect.height = $hh;
    // this._maskRect.x = $x;
    // this._maskRect.y = $y;
    // this.mask = this._maskRect;
    // this._maskRect.visible = this._maskRect.active = false;
  }

  public enterFrame() {
    this._runingPassTime = this.getTimer() - this._startTime;
    if (
      this._runingPassTime >= this._lessRun &&
      this._currIdx == this._targetIdx
    ) {
      this.stop();
    } else {
      this._runSpace += this._speed;
      switch (this._way) {
        case this.UP:
          this._firstSp.y -= this._speed;
          if (this._secondSp.y - this._speed <= 0) {
            this._secondSp.y -= this._speed;
            this._firstSp.y =
              this._secondSp.y + this._itemSpace * this._itemLen;
            this._tempSp = this._firstSp;
            this._firstSp = this._secondSp;
            this._secondSp = this._tempSp;
          } else {
            this._secondSp.y -= this._speed;
          }
          break;
        case this.DOWN:
          this._firstSp.y += this._speed;
          if (this._secondSp.y + this._speed >= 0) {
            this._secondSp.y += this._speed;
            this._firstSp.y =
              this._secondSp.y - this._itemSpace * this._itemLen;
            this._tempSp = this._firstSp;
            this._firstSp = this._secondSp;
            this._secondSp = this._tempSp;
          } else {
            this._secondSp.y += this._speed;
          }
          break;
        case this.LEFT:
          this._firstSp.x -= this._speed;
          if (this._secondSp.x - this._speed <= 0) {
            this._secondSp.x -= this._speed;
            this._firstSp.x =
              this._secondSp.x + this._itemSpace * this._itemLen;
            this._tempSp = this._firstSp;
            this._firstSp = this._secondSp;
            this._secondSp = this._tempSp;
          } else {
            this._secondSp.x -= this._speed;
          }
          break;
        case this.RIGHT:
          this._firstSp.x += this._speed;
          if (this._secondSp.x + this._speed >= 0) {
            this._secondSp.x += this._speed;
            this._firstSp.x =
              this._secondSp.x - this._itemSpace * this._itemLen;
            this._tempSp = this._firstSp;
            this._firstSp = this._secondSp;
            this._secondSp = this._tempSp;
          } else {
            this._secondSp.x += this._speed;
          }
          break;
      }
      if (this._runSpace >= this._itemSpace * this._enterTimes) {
        this._enterTimes++;
        this._currIdx++;
        if (this._currIdx >= this._itemLen) {
          this._currIdx = 0;
        }
      }
    }
  }

  private _targetIdx: number = 0;
  private _enterTimes: number = 0;
  private _currIdx: number = 0;
  private _runSpace: number = 0; //运行的总距离
  private _startTime: number = 0;
  private _runingPassTime: number = 0; //运行总时间

  public start(targetIdx: number) {
    this._targetIdx = targetIdx;
    this._enterTimes = 1;
    this._runSpace = 0;
    this._speed = this._initSpeed;
    this._startTime = this.getTimer();
    EnterFrameManager.Instance.registeEnterFrame(this);
    var delay: number = this._lessRun / 1000;
    Laya.Tween.to(
      this,
      { speed: this._initBackSpeed },
      0.1,
      Laya.Ease.quintInOut,
      null,
      delay
    );
    // TweenMax.to(this, delay, { speed: this._initBackSpeed, ease: Quint.easeInOut });
  }

  private stop(needInit: boolean = true) {
    if (needInit) {
      this.initIdx(this._currIdx);
      if (this._callBack != null) this._callBack(this._callParams);
    }
    EnterFrameManager.Instance.unRegisteEnterFrame(this);
    Laya.Tween.clearAll(this);
    // TweenMax.killTweensOf(this);
  }

  public initIdx(value: number) {
    this._currIdx = value;
    switch (this._way) {
      case this.UP:
        this._firstSp.y = -this._currIdx * this._itemSpace;
        this._secondSp.y = this._firstSp.y + this._itemSpace * this._itemLen;
        break;
      case this.DOWN:
        this._firstSp.y = this._currIdx * this._itemSpace;
        this._secondSp.y = this._firstSp.y - this._itemSpace * this._itemLen;
        break;
      case this.LEFT:
        this._firstSp.x = -this._currIdx * this._itemSpace;
        this._secondSp.x = this._firstSp.x + this._itemSpace * this._itemLen;
        break;
      case this.RIGHT:
        this._firstSp.x = this._currIdx * this._itemSpace;
        this._secondSp.x = this._firstSp.x - this._itemSpace * this._itemLen;
        break;
    }
  }

  private _speed: number = 0;
  public get speed(): number {
    return this._speed;
  }

  public set speed(value: number) {
    this._speed = value;
  }
  private getTimer() {
    return Laya.systemTimer.currTimer;
  }

  public dispose() {
    this.stop();
    var obj: DisplayObject;
    for (const key in this._itemList) {
      if (Object.prototype.hasOwnProperty.call(this._itemList, key)) {
        let obj = this._itemList[key];
        ObjectUtils.disposeObject(obj);
      }
    }
    this._itemList = null;

    for (const key in this._itemList2) {
      if (Object.prototype.hasOwnProperty.call(this._itemList2, key)) {
        let obj = this._itemList2[key];
        ObjectUtils.disposeObject(obj);
      }
    }
    this._itemList2 = null;
    ObjectUtils.disposeObject(this._firstSp);
    this._firstSp = null;
    ObjectUtils.disposeObject(this._secondSp);
    this._secondSp = null;
    if (parent) this.removeFromParent();
    this._callBack = null;
    this._callParams = null;
    super.dispose();
  }
}
