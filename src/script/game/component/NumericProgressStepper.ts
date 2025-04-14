import FUI_NumericProgressStepper from "../../../fui/Base/FUI_NumericProgressStepper";

/**
 * @description 数字步进器,支持长按持续加减,支持进度条
 * @author yuanzhan.yu
 * @date 2023/2/14 10:40
 * @ver 1.0
 */
export class NumericProgressStepper extends FUI_NumericProgressStepper {
  private _type: number = 0;
  private _initValue: number = 1;
  private _min: number = 0;
  private _max: number = 0;
  private _limit: number = 0;
  private _step: number = 1;
  private _changeHandler: Laya.Handler;
  private _stepHandler: Laya.Handler;
  private _inputHandler: Laya.Handler;

  private _value: number = 0;
  private _plusDown: boolean = false;
  private _reduceDown: boolean = false;

  constructor() {
    super();
  }

  protected onConstruct() {
    super.onConstruct();

    this.initEvent();
  }

  /**
   * @param type  样式 0: 有最大最小和递增递减按钮；1: 无最大最小按钮  2: 无加减按钮
   * @param initValue 输入框显示的初始值
   * @param min   最小值
   * @param max   最大值
   * @param limit 限制值
   * @param step  步进
   * @param changeHandler 变化回调
   */
  public show(
    type: number = 0,
    initValue: number = 1,
    min: number = 1,
    max: number = 1,
    limit: number = 1,
    step: number = 1,
    changeHandler: Laya.Handler,
    stepHandler?: Laya.Handler,
    inputHandler?: Laya.Handler,
  ) {
    this._type = type;
    // this.type.selectedIndex = type;
    this._initValue = initValue;
    this._value = initValue;
    this._min = min; //修改最小值为1
    this._limit = limit ? limit : max;
    this._max = Math.min(this._limit, max);
    this._step = step;
    this._changeHandler = changeHandler;
    this._stepHandler = stepHandler;
    this._inputHandler = inputHandler;

    this.txt_num.text = this._value + "";
    this.progress.value = (100 * this.value) / this._max;
    this.updateBtnState();
  }

  public resetStepper() {
    this._value = this._initValue;
    this.txt_num.text = this._value + "";
  }

  private initEvent() {
    this.btn_plus.onClick(this, this.__plusHandler);
    this.btn_reduce.onClick(this, this.__reduceHandler);
    // this.btn_plus.onClick(this, this.onBtnPlusDown);
    // this.btn_reduce.onClick(this, this.onBtnReduceDown);
    // this.btn_min.onClick(this, this.__minHandler);
    // this.btn_max.onClick(this, this.__maxHandler);
    this.txt_num.on(Laya.Event.INPUT, this, this.__buyNumChange);
    this.txt_num.on(Laya.Event.BLUR, this, this.__buyNumBlur);
    this.progress.on(
      fairygui.Events.STATE_CHANGED,
      this,
      this.__onSilderchange,
    );
  }

  private __plusHandler() {
    this._value += this._step;
    this.numChangeHandler();
    this._stepHandler && this._stepHandler.runWith([this, this._step]);
  }

  private __maxHandler() {
    this._value = this._max;
    this.numChangeHandler();
  }

  private __minHandler() {
    this._value = this._min;
    this.numChangeHandler();
  }

  private __reduceHandler() {
    this._value -= this._step;
    this.numChangeHandler();
    this._stepHandler && this._stepHandler.runWith([this, -this._step]);
  }

  private __buyNumChange(event: Laya.Event) {
    let offset = parseInt(this.txt_num.text) - this._value;
    this._value = parseInt(this.txt_num.text);
    this.numChangeHandler();
    this._inputHandler && this._inputHandler.runWith([this, offset]);
  }

  private __buyNumBlur(event: Laya.Event) {
    this._value = isNaN(this._value) ? this._min : this._value;
    this.txt_num.text = this._value + "";

    this.updateBtnState();
  }

  protected numChangeHandler() {
    if (this._limit < this._value) {
      this._value = this._limit;
    }
    // this._value = this._value < this._min ? this._min : this._value;
    // this._value = this._value > this._max ? this._max : this._value;

    this._value = Math.min(Math.max(this.value, this._min), this._max);
    this.txt_num.text = isNaN(this._value) ? "" : this._value.toString();
    this._value = isNaN(this._value) ? this._min : this._value;

    this.updateBtnState();
    this.progress.value = (100 * this.value) / this._max;
    if (this._changeHandler) {
      this._changeHandler.runWith(this._value);
    }
  }

  private updateBtnState() {
    this._value <= this._min
      ? (this.btn_reduce.enabled = false)
      : (this.btn_reduce.enabled = true);
    this._value >= this._max
      ? (this.btn_plus.enabled = false)
      : (this.btn_plus.enabled = true);
    if (this._value >= this._limit) {
      this.btn_plus.enabled = false;
    }
  }

  get value(): number {
    return this._value;
  }

  private onBtnPlusDown() {
    this._plusDown = true;
    this.displayObject.stage.on(Laya.Event.MOUSE_UP, this, this.onBtnPlusUp);
    this.btn_plus.on(Laya.Event.MOUSE_OUT, this, this.onBtnPlusUp);
    Laya.timer.loop(200, this, this.onPlusTimer);
    this.onPlusTimer();
  }

  private onPlusTimer() {
    if (this._plusDown) {
      this.__plusHandler();
    }
  }

  private onBtnPlusUp() {
    this._plusDown = false;
    Laya.timer.clear(this, this.onPlusTimer);
    this.displayObject.stage.off(Laya.Event.MOUSE_UP, this, this.onBtnPlusUp);
    this.btn_plus.off(Laya.Event.MOUSE_OUT, this, this.onBtnPlusUp);
  }

  private onBtnReduceDown() {
    this._reduceDown = true;
    this.displayObject.stage.on(Laya.Event.MOUSE_UP, this, this.onBtnReduceUp);
    this.btn_reduce.on(Laya.Event.MOUSE_OUT, this, this.onBtnReduceUp);
    Laya.timer.loop(200, this, this.onReduceTimer);
    this.onReduceTimer();
  }

  private onReduceTimer() {
    if (this._reduceDown) {
      this.__reduceHandler();
    }
  }

  private onBtnReduceUp() {
    this._reduceDown = false;
    Laya.timer.clear(this, this.onReduceTimer);
    this.displayObject.stage.off(Laya.Event.MOUSE_UP, this, this.onBtnReduceUp);
    this.btn_reduce.off(Laya.Event.MOUSE_OUT, this, this.onBtnReduceUp);
  }

  private __onSilderchange() {
    this._value = Math.floor(this.progress.value * 0.01 * this._max);
    this.numChangeHandler();
  }

  private removeEvent() {
    this.btn_plus.offClick(this, this.__plusHandler);
    this.btn_reduce.offClick(this, this.__reduceHandler);
    // this.btn_plus.offClick(this, this.onBtnPlusDown);
    // this.btn_reduce.offClick(this, this.onBtnReduceDown);
    // this.btn_min.offClick(this, this.__minHandler);
    // this.btn_max.offClick(this, this.__maxHandler);
    this.txt_num.off(Laya.Event.INPUT, this, this.__buyNumChange);
    this.txt_num.off(Laya.Event.BLUR, this, this.__buyNumBlur);
    this.progress.off(
      fairygui.Events.STATE_CHANGED,
      this,
      this.__onSilderchange,
    );
  }

  dispose() {
    this.removeEvent();
    Laya.timer.clear(this, this.onReduceTimer);
    Laya.timer.clear(this, this.onPlusTimer);
    this._changeHandler && this._changeHandler.recover();
    this._changeHandler = null;
    super.dispose();
  }
}
