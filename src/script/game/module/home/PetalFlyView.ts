import LayerMgr from "../../../core/layer/LayerMgr";
import { EmLayer } from "../../../core/ui/ViewInterface";
import FlyPetal from "./FlyPetal";

/**
 * 花瓣飘落效果
 */
export default class PetalFlyView extends Laya.Sprite {
  public INTERVALTIME: number = 150;
  public FADEOUT_TIME: number = 2000; //淡出时间

  private _timerId: number;
  private _petalNum: number;
  // private _popNum : number;
  private _showTime: number;

  // private _popProbability : number;  //每次update()出现爆开效果的机率, [0,100)
  private _type: number; //1: 粉红花瓣, 2: 红色花瓣, 3: 颁奖礼花, 5: 烟花
  private _petalList: Array<FlyPetal> = []; //花瓣列表
  // private _popList : Array< fgui.GMovieClip>;  //爆开效果列表

  private _tempPetal: FlyPetal;
  // private  _tempPop :  fgui.GMovieClip;
  // private  _tempPetalII : FlyPetal;
  // private  _tempPopII :  fgui.GMovieClip;
  // private  _curPopIndex:number = 1;  //爆开效果当前样式索引
  // private  _maxPopIndex:number = 3;  //爆开效果最大样式索引
  private _isDisposing: boolean = false; //是否销毁中

  /**
   *花瓣飘落效果
   * @param petalNum  花瓣数量
   * @param showTime  持续时间（秒）
   * @param popNum  爆开效果最多同时显示数量
   * @param popProbability  爆开效果出现机率
   */
  constructor(
    petalNum: number,
    showTime: number,
    type: number = 1,
    popNum: number = 3,
    popProbability: number = 5,
  ) {
    super();

    this.mouseEnabled = false;
    this._type = type;
    this._petalNum = petalNum;
    this._showTime = showTime * 1000;
    // this._popNum = popNum;
    // this._popProbability = popProbability;
    // this._petalList = []
    // this._popList = [];
    this._timerId = setInterval(this.update.bind(this), this.INTERVALTIME);
    this.addEvent();
  }

  private addEvent(): void {
    Laya.timer.frameLoop(1, this, this.onLoop);
  }

  private removeEvent(): void {
    Laya.timer.clear(this, this.onLoop);
  }

  private onLoop(): void {
    for (let i = 0; i < this._petalList.length; i++) {
      const element = this._petalList[i];
      if (!element.parent) {
        continue;
      }
      if (
        element.x > -50 &&
        element.x < Laya.stage.width + 50 &&
        element.y < Laya.stage.height + 50
      ) {
        element.drop();
      } else {
        element.stop();
        if (element.parent) element.parent.removeChild(element);
      }
    }

    //    this._popList.forEach(element => {
    //         if (!element.parent) continue;
    //         if (element.frame >= 90)
    //         {
    //             element.playing = false;
    //             if (element.parent) element.parent.removeChild(element);
    //         }
    //    });
  }

  private update(): void {
    if (this._showTime <= 0 && !this._isDisposing) {
      this.dispose();
      return;
    }
    this._showTime -= this.INTERVALTIME;
    this._tempPetal = null;
    if (this._petalList) {
      if (this._petalList.length < this._petalNum) {
        this._tempPetal = this.createPetal();
        this._petalList.push(this._tempPetal);
      } else {
        for (let i = 0; i < this._petalList.length; i++) {
          let element = this._petalList[i];
          if (!element.parent) {
            break;
          } else {
            element = null;
          }
        }
      }
    }

    if (this._tempPetal) {
      this._tempPetal.x = Math.random() * Laya.stage.width;
      this._tempPetal.y = 0;
      this._tempPetal.play();
      this.addChild(this._tempPetal);
    }
    // if (Math.random() * 100 <= this._popProbability)
    // {
    //     if (this._popList.length < this._popNum)
    //     {
    //         this._tempPop = this.createPopEffect();
    //         this._popList.push(this._tempPop);
    //     }
    //     else
    //     {
    //         this._popList.forEach(element => {
    //             if (!element.parent)
    //                 break;
    //         else
    //             element = null;
    //         });
    //     }
    //     if (this._tempPop)
    //     {
    //         switch(this._type)
    //         {
    //             case 1:
    //             case 2:
    //                 this._tempPop.x = Math.random()*300 + Laya.stage.width/2 - 150;
    //                 this._tempPop.y = Math.random()*250;
    //                 break;
    //             default:
    //                 this._tempPop.x = Math.random()*700 +Laya.stage.width/2 - 500;
    //                 this._tempPop.y = Math.random()*300;
    //         }
    //         this._tempPop.gotoAndPlay(1);
    //         this.addChild(this._tempPop);
    //     }
    // }
  }

  private createPetal(): FlyPetal {
    var petal: FlyPetal = new FlyPetal(this._type);
    return petal;
  }

  // private createPopEffect(): fgui.GMovieClip
  // {
  //     if(this._curPopIndex > this._maxPopIndex)
  //     {
  //         this._curPopIndex = 1;
  //     }
  //     var effect: fgui.GMovieClip;
  //     switch(this._type)
  //     {
  //         case 1:
  //             effect = ClassUtils.CreatInstance("asset.core.PetalPinkPopEffect") as  fgui.GMovieClip;
  //             break;
  //         case 2:
  //             effect = ClassUtils.CreatInstance("asset.core.PetalPopEffect") as  fgui.GMovieClip;
  //             break;
  //         case 3:
  //             this._maxPopIndex = 3;
  //             effect = ClassUtils.CreatInstance("asset.warlords.FireworkStyle"+_curPopIndex) as  fgui.GMovieClip;
  //             break;
  //         case 5:
  //             effect = ClassUtils.CreatInstance("asset.warlords.FireworkStyle4") as  fgui.GMovieClip;
  //             break;
  //         default:
  //             effect = new  fgui.GMovieClip();
  //     }
  //     effect.stop();
  //     this._curPopIndex++;
  //     return effect;
  // }

  public show(container: Laya.Sprite = null): void {
    if (container) container.addChild(this);
    else LayerMgr.Instance.addToLayer(this, EmLayer.GAME_TOP_LAYER);
  }

  public dispose(): void {
    if (this._isDisposing) return;
    this._isDisposing = true;
    TweenLite.to(this, this.FADEOUT_TIME / 1000, {
      alpha: 0,
      onComplete: this.disposeCall.bind(this),
    });
  }

  private disposeCall(): void {
    TweenLite.killTweensOf(this);
    clearInterval(this._timerId);
    this.removeEvent();
    this._petalList.forEach((element) => {
      element.dispose();
    });
    // this._popList.forEach(element => {
    //     element.stop();
    //     if (element.parent) element.parent.removeChild(element);
    // });

    if (this._petalList) this._petalList.length = 0;
    this._petalList = null;
    // if(this._popList) this._popList.length = 0; this._popList = null;
    this._tempPetal = null;
    // this._tempPop = this._tempPopII = null;
    if (this.parent) this.parent.removeChild(this);
  }
}
