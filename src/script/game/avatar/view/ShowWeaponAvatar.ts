/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-01-12 15:26:41
 * @LastEditTime: 2021-07-14 18:10:05
 * @LastEditors: jeremy.xu
 * @Description: UI面板上的武器展示形象
 */
import { MovieClip } from "../../component/MovieClip";
import { NotificationEvent } from "../../constant/event/NotificationEvent";
import { ThaneInfo } from "../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../manager/ArmyManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { AvatarActionType } from "../data/AvatarActionType";
import { ShowAvatarLoader } from "../load/ShowAvatarLoader";

export class ShowWeaponAvatar extends ShowAvatarLoader {
  private showEffect: boolean = false;

  constructor(callBack: Function) {
    super(callBack);
    this.stop();
    this.initEvent();
  }

  private initEvent() {
    NotificationManager.Instance.addEventListener(
      NotificationEvent.WEAPON_CHANGE,
      this.__infoUpdateHandler,
      this,
    );
  }

  private removeEvent() {
    NotificationManager.Instance.removeEventListener(
      NotificationEvent.WEAPON_CHANGE,
      this.__infoUpdateHandler,
      this,
    );
  }

  private __infoUpdateHandler(e: NotificationEvent) {
    this.showEffect = true;
  }

  protected __onResComplete(res: any) {
    if (!res) {
      return;
    }
    super.__onResComplete(res);

    // this._content.gotoAndStop(1);
    if (this.showEffect) {
      this.showEffect = false;
      this._content.gotoAndPlay(1, true, "");
      this.play();
    }
    this.stop();
  }

  private play() {
    // TweenMax.to(this._content, 0.5, {dropShadowFilter:{angle:45, blurX:5, blurY:5, strength:5, quality : 2, distance:5, color:0xffffff},
    //     glowFilter:{color:0xCC0000, blurX:18, blurY:18, strength:0.8, quality : 1},
    //     glowFilter:{color:0xffffff, blurX:18, blurY:18, strength:10, quality : 2},
    //     colorMatrixFilter:{contrast:1, brightness:2.2, saturation:1, hue:0},
    //     onComplete : this.onFlowComplete});
  }

  private onFlowComplete() {
    TweenMax.to(this._content, 0.4, {
      dropShadowFilter: {
        angle: 45,
        blurX: 6,
        blurY: 6,
        strength: 0.1,
        quality: 1,
        distance: 0,
        color: 0xffffff,
      },
      glowFilter: {
        color: 0x67d118,
        alpha: 1,
        blurX: 15,
        blurY: 15,
        strength: 0.1,
        quality: 1,
      },
      colorMatrixFilter: { contrast: 1, brightness: 1, saturation: 1, hue: 0 },
      onComplete: this.stop,
      delay: 0.3,
    });
  }

  private stop() {
    if (!this._content || this._content.destroyed) {
      return;
    }
    TweenMax.killTweensOf(this._content);
    this._content.filters = null;
  }

  private get thane(): ThaneInfo {
    return ArmyManager.Instance.thane;
  }

  public dispose() {
    this.removeEvent();
    this._content && TweenMax.killTweensOf(this._content);
    super.dispose();
  }
}
