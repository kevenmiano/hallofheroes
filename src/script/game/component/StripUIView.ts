/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-01-08 10:10:34
 * @LastEditTime: 2022-02-21 16:43:05
 * @LastEditors: jeremy.xu
 * @Description: 战斗中进度条显示类  可以实现多血条效果  _maxValue要被_stripNum整除要不然显示会有问题
 */

import Logger from "../../core/logger/Logger";
import { UIFilter } from "../../core/ui/UIFilter";
import { EmPackName, EmWindow } from "../constant/UIDefine";
// import { IStrip } from "../interfaces/IStrip";

interface IStrip {
  maxValue: number;
  currentValue: number;
  bloodShield: number;
  bloodLoseValue: number;
  currentIndex: number;
  avgValue: number;
  maskWidth: number;
  maskHeight: number;
  asset: fgui.GImage[];
  curStripGImg: fgui.GImage;
  getView(): fgui.GComponent;
}

import FUIHelper from "../utils/FUIHelper";

export class StripUIView implements IStrip {
  public static FadeTime = 0.5;
  public static DelayTime = 0.25;

  private _maxValue: number = 0;

  private _currentValue: number = 0;
  private _bloodShieldValue: number = 0; //护盾伤害值
  private _bloodLoseValue: number = 0; //流血伤害值
  private _currentIndex: number = 0;
  private _avgValue: number = 0;
  private _stripNum: number = 0; //进度条的数目
  private _txtStripNum: fgui.GLabel;

  private _tansitionAttr: object = { prog: 1, alpha: 1 }; //缓动用的

  private _colorOffset: Laya.Filter;
  private _twoWayTween: boolean; //是否是双向缓动.即减小和增加都有缓动效果.
  private _changeFlag: number = 0; //标记当前更改是增加还是减小. -1表示减小,1表示增加.

  private _dispose: boolean = false;
  private _asset: fgui.GImage[]; //所有进度的对象
  private _parent: fgui.GComponent;
  private _curStripGImg: fgui.GImage;
  private _transitionGImg: fgui.GImage;
  private _maskWidth: number = 0; //记录进度条的原始宽度
  private _maskHeight: number = 0; //记录进度条的原始高度
  private _multStrip: boolean; //是否多进度条
  private _bUseCurStripTransition: boolean; //是否使用当前进度图片做过度

  private _bloodShieldBar: fgui.GImage; //护盾

  private _bloodLoseBar: fgui.GImage; //流血

  constructor(
    asset: fgui.GImage[],
    maxValue: number = -1,
    currentValue: number = -1,
    transitionGImg: fgui.GImage = null,
    colorOffset: Laya.Filter = UIFilter.normalFilter,
    twoWayTween: boolean = false,
  ) {
    this._asset = asset;
    this._curStripGImg = this._asset[this._asset.length - 1];
    this._stripNum = this._asset.length;
    this._multStrip = this._stripNum > 1;
    this._parent = this._curStripGImg.parent;
    this._maskWidth = this._curStripGImg.width;
    this._maskHeight = this._curStripGImg.height;
    this._colorOffset = colorOffset;
    this._twoWayTween = twoWayTween;
    this._transitionGImg = transitionGImg;
    this.initView();

    if (maxValue > 0) {
      this.maxValue = maxValue;
    }

    if (currentValue > 0) {
      this.currentValue = currentValue;
    }

    this._bloodShieldBar = FUIHelper.createFUIInstance(
      EmPackName.Battle,
      "Img_Blood_Shield",
    ).asImage;
    this._bloodShieldBar.x = this._curStripGImg.x;
    this._bloodShieldBar.y = this._curStripGImg.y;
    this._bloodShieldBar.visible = false;
    this._bloodShieldBar.fillOrigin = fgui.FillOrigin.Left;
    this._bloodShieldBar.fillMethod = fgui.FillMethod.Horizontal;

    this._bloodLoseBar = FUIHelper.createFUIInstance(
      EmPackName.Battle,
      "Img_Blood_Shield",
    ).asImage;
    this._bloodLoseBar.x = this._curStripGImg.x;
    this._bloodLoseBar.y = this._curStripGImg.y;
    this._bloodLoseBar.visible = false;
    this._bloodLoseBar.fillOrigin = fgui.FillOrigin.Right;
    this._bloodLoseBar.fillMethod = fgui.FillMethod.Horizontal;
    this._bloodLoseBar.alpha = 0.5;
    this._bloodLoseBar.blendMode = "Add";
    this._bloodLoseBar.color = "#000000";
  }

  private initView() {
    if (!this._transitionGImg) {
      this._bUseCurStripTransition = true;
    } else {
      this._transitionGImg.visible = true;
    }

    this.resetStripImg();

    this._txtStripNum = this._parent.getChild("txtStripNum") as fgui.GLabel;
    this.showStripNum(this._stripNum);
  }

  /**
   * 切换并刷新进度条
   * @param value
   */
  public refresh(value?: number, tween: boolean = false) {
    let index = this.calCurrentStrip(value);
    // Logger.xjy("[StripUIView]:refresh value=" + value, "tween", tween, "index=" + index, "currentIndex=" + this._currentIndex)

    // 处理跨进度条的动画
    let bSecond = false;
    if (index != this._currentIndex) {
      let stripsValue = this._currentIndex * this._avgValue;
      this.refreshProgress(stripsValue, tween, undefined, true);
      bSecond = value != stripsValue;
      // Logger.xjy("[StripUIView]:refresh stripsValue", stripsValue, bSecond)
    }

    let totalTime = (StripUIView.FadeTime + StripUIView.DelayTime) * 1000;
    Laya.timer.once(bSecond ? totalTime : 0, this, () => {
      if (this._dispose) return;
      this.switchToIndex(index);
      this.refreshProgress(value, tween, bSecond || tween ? 0 : undefined);
    });
  }

  /**
   * 切换进度条
   * @param index
   */
  public switchToIndex(index: number) {
    if (index < 0 || index > this._stripNum || index == this._currentIndex)
      return;

    // Logger.xjy("[StripUIView]:switchToIndex", index)

    this._currentIndex = index;

    this._asset.forEach((element, idx) => {
      element.visible = idx == index;
      element.fillAmount = idx == index ? 1 : 0;
    });

    let bgStrip = this._asset[index - 1];
    if (bgStrip) {
      bgStrip.visible = true;
      bgStrip.fillAmount = 1;
    }

    this._curStripGImg = this._asset[index];
    this.showStripNum(this._currentIndex + 1);
    this.refreshTransitionGImg();
  }

  /**
   * 刷新进度条 TODO: 频繁调用过渡条显示会有问题, 给每个进度条添加一个过渡条
   * @param value
   * @param tween
   */
  public refreshProgress(
    value?: number,
    tween: boolean = false,
    delay: number = StripUIView.DelayTime,
    updateToZero: boolean = false,
  ) {
    // Logger.xjy("[StripUIView]:refreshProgress value=" + value, "tween=", tween, "updateToZero=", updateToZero)
    this._changeFlag = this._currentValue > value ? -1 : 1;
    this._currentValue = value;

    if (this._maxValue <= 0) {
      this.setCurStripValue(0);
      this.setTransitionValue(0);
    } else {
      let prog = this.calCurrentProg(value);
      let tempProg = updateToZero ? 0 : prog;
      this.setCurStripValue(tempProg);

      // Logger.xjy("[StripUIView]:refreshProgress tempProg", tempProg)

      if (this._transitionGImg) {
        if (tween) {
          //@ts-expect-error: External dependencies
          TweenLite.to(this._tansitionAttr, StripUIView.FadeTime, {
            prog: tempProg,
            delay: delay,
            onUpdate: () => {
              this.setTransitionValue(this._tansitionAttr["prog"]);
            },
            onComplete: () => {
              this._tansitionAttr["prog"] = prog;
              // Logger.xjy("[StripUIView]:refreshProgress onComplete prog", prog)
            },
          });
        } else {
          this.setTransitionValue(prog);
        }
      }
    }
  }

  public calCurrentStrip(value: number): number {
    if (value <= 0) {
      return 0;
    }
    if (this._multStrip) {
      return Math.ceil(value / this._avgValue) - 1;
    } else {
      return 0;
    }
  }

  public static calCurrentStrip(
    curValue: number,
    maxValue: number,
    stripNum: number,
  ): number {
    if (curValue <= 0) {
      return 0;
    }

    let avgValue = maxValue / stripNum;

    if (stripNum > 1) {
      return Math.ceil(curValue / avgValue) - 1;
    } else {
      return 0;
    }
  }

  public calCurrentProg(value: number): number {
    if (value == 0) {
      return 0;
    }
    let modValue = value % this._avgValue;
    if (value >= this._avgValue && modValue == 0) {
      return 1;
    }
    return modValue / this._avgValue;
  }

  private setTransitionValue(value: number) {
    if (!this._transitionGImg) return;
    this._transitionGImg.fillAmount = value;
  }

  private setCurStripValue(value: number) {
    if (this._curStripGImg) this._curStripGImg.fillAmount = value;
  }

  private showTransitionGImg(value: boolean) {
    if (!this._transitionGImg) return;
    this._transitionGImg.visible = value;
  }

  private showCurStripGImg(value: boolean) {
    if (this._curStripGImg) this._curStripGImg.visible = value;
  }

  /**
   * 刷新过度条
   * @param transitionGImg
   */
  private refreshTransitionGImg() {
    if (!this._transitionGImg) {
      // TODO:
      return;
      // this._transitionGImg = new fgui.GImage()
      // this._transitionGImg.alpha = 0.2;
      // this._parent.addChildAt(this._transitionGImg, 0);
    }
    // if (this._bUseCurStripTransition) {
    //     this._transitionGImg.image.texture = this._curStripGImg.image.texture
    // }
    if (this._multStrip) {
      // 重新排列层级 保证过度条在显示的血条与背景血条之间
      if (this._parent.numChildren >= 3 || this._currentIndex - 1 > 0) {
        let bottomStripGImg = this._asset[this._currentIndex - 1];
        if (bottomStripGImg) {
          this._parent.setChildIndex(bottomStripGImg, 0);
        }
        if (this._curStripGImg)
          this._parent.setChildIndex(this._transitionGImg, 1);
        if (this._curStripGImg)
          this._parent.setChildIndex(this._curStripGImg, 2);
      }
    }
    this.showTransitionGImg(true);
    this._transitionGImg.filters = [this._colorOffset];
  }

  public showStripNum(value: number, flag: boolean = false) {
    if (!this._txtStripNum) return;

    this._txtStripNum.visible = value > 1;
    if (flag) {
      this._txtStripNum.visible = true;
    }
    this._txtStripNum.text = value.toString();
  }

  public resetStripImg() {
    for (let index = 0; index < this._asset.length; index++) {
      const element = this._asset[index];
      element.visible = true;
      element.fillAmount = 1;
    }
  }

  public get maxValue(): number {
    return this._maxValue;
  }
  public set maxValue(value: number) {
    if (this._maxValue == value) return;
    this._maxValue = value;
    this._avgValue = value / this._stripNum;
    this._currentIndex = this.calCurrentStrip(value);
    this.resetStripImg();
  }

  public get currentValue(): number {
    return this._currentValue;
  }
  public set currentValue(value: number) {
    if (this._currentValue > 0 && this._currentValue == value) return;
    this.refresh(value, true);
    this.bloodLoseValue = this._bloodLoseValue;
  }

  //护盾进度
  public set bloodShield(v: number) {
    if (!this._bloodShieldBar) return;
    this._bloodShieldValue = v;
    if (this._bloodShieldValue <= 0) {
      this.resetBloodShield();
      return;
    }
    if (!this._bloodShieldBar.parent) {
      let index = this._parent.getChildIndex(this._curStripGImg);
      this._parent.addChildAt(this._bloodShieldBar, index);
      this._bloodShieldBar.visible = true;
    }

    let prog = (this._bloodShieldValue + this._currentValue) / this._avgValue;
    //护盾+当前血值超过最大血值
    if (this._bloodShieldValue + this._currentValue > this._avgValue) {
      //血值百分比
      let bloodProg =
        this._currentValue / (this._avgValue + this._bloodShieldValue);
      this.setCurStripValue(bloodProg);
      prog = 1;
    }

    this._bloodShieldBar.fillAmount = prog;
    this.bloodLoseValue = this._bloodLoseValue;
  }

  public get bloodShield() {
    return this._bloodShieldValue;
  }
  //重置护盾
  public resetBloodShield() {
    if (!this._bloodShieldBar) return;
    if (this._bloodShieldValue == 0) return;
    this._parent.removeChild(this._bloodShieldBar);
    this._bloodShieldValue = 0;
    this._bloodShieldBar.visible = false;
    //重新设置血值百分比
    let bloodProg = this._currentValue / this._avgValue;
    this.setCurStripValue(bloodProg);
  }

  //流血
  public set bloodLoseValue(v: number) {
    if (v <= 0) {
      this.resetBloodLose();
      return;
    }
    this._bloodLoseValue = v;
    if (!this._bloodLoseBar.parent) {
      this._parent.addChild(this._bloodLoseBar);
      this._bloodLoseBar.visible = true;
    }

    let curValue = this._currentValue + this._bloodShieldValue;
    let totalBlood = curValue > this._maxValue ? curValue : this._maxValue;
    //失去的值
    let loseBlood = totalBlood - curValue + this._bloodLoseValue;

    let prog = loseBlood / totalBlood;

    if (prog < 0) prog = 0;
    if (prog > 1) prog = 1;

    this._bloodLoseBar.fillAmount = prog;
  }

  public get bloodLoseValue() {
    return this._bloodLoseValue;
  }

  //重置流血
  public resetBloodLose() {
    if (!this._bloodLoseBar) return;
    this._bloodLoseBar.parent && this._parent.removeChild(this._bloodLoseBar);
    this._bloodLoseValue = 0;
  }

  public set currentIndex(value: number) {
    this._currentIndex = value;
  }
  public get currentIndex(): number {
    return this._currentIndex;
  }
  public set avgValue(value: number) {
    this._avgValue = value;
  }
  public get avgValue(): number {
    return this._avgValue;
  }
  public get maskWidth(): number {
    return this._maskWidth;
  }
  public get maskHeight(): number {
    return this._maskHeight;
  }
  public get asset(): fgui.GImage[] {
    return this._asset;
  }
  public set curStripGImg(value: fgui.GImage) {
    this._curStripGImg = value;
  }
  public get curStripGImg(): fgui.GImage {
    return this._curStripGImg;
  }

  public getView(): fgui.GComponent {
    return this._parent;
  }

  public dispose() {
    this._dispose = true;
  }
}
