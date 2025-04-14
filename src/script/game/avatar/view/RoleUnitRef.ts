/**
 * @author:jeremy.xu
 * @data: 2020-11-20 18:00
 * @description 形象部位加载  使用战斗模型资源
 * 不要直接用，用HeroMovieClipRef替代
 **/

import ResMgr from "../../../core/res/ResMgr";
import { MovieClip } from "../../component/MovieClip";
import { NotificationManager } from "../../manager/NotificationManager";
import {
  ActionLabesType,
  HeroMovieClipRefType,
} from "../../constant/BattleDefine";
import { AnimationManager } from "../../manager/AnimationManager";
import { ResRefCountManager } from "../../managerRes/ResRefCountManager";
import Logger from "../../../core/logger/Logger";

export class RoleUnitRef extends Laya.Sprite {
  public static LOAD_RES_COMPLETE = "LOAD_RES_COMPLETE";

  public type: HeroMovieClipRefType;
  public completeFunc: Function;
  public externalTriggerLoad: boolean;
  public content: MovieClip = new MovieClip();
  protected _data: any;

  constructor(type: HeroMovieClipRefType = HeroMovieClipRefType.UI_PANEL) {
    super();
    this.type = type;
    this.addChild(this.content);
    this.addEvent();
  }

  protected addEvent() {
    NotificationManager.Instance.addEventListener(
      RoleUnitRef.LOAD_RES_COMPLETE,
      this.__loadResComplete,
      this,
    );
  }

  protected removeEvent() {
    NotificationManager.Instance.removeEventListener(
      RoleUnitRef.LOAD_RES_COMPLETE,
      this.__loadResComplete,
      this,
    );
  }

  public set data(val: any) {
    if (!val || !val.urlPath) {
      this.content.visible = false;
      return;
    }

    this.content.visible = true;

    if (this.externalTriggerLoad) {
      this._data = val;
      if (ResMgr.Instance.getRes(this._data.urlPath)) {
        this.loadResComplete();
      }
    } else {
      this._data = val;
      ResRefCountManager.loadRes(
        this._data.urlPath,
        (res) => {
          this.loadResComplete();
        },
        null,
        Laya.Loader.ATLAS,
      );
    }
  }

  public get data(): any {
    return this._data;
  }

  public gotoAndPlay(start?: any, loop?: boolean, aniType?: string) {
    this.content.gotoAndPlay(start, loop, aniType);
  }

  public gotoAndStop(position: any) {
    this.content.gotoAndStop(position);
  }

  protected loadResComplete() {
    if (!this._data) return;

    let res = ResMgr.Instance.getRes(this._data.urlPath);
    if (!res) {
      this.loadComplete();
      return;
    }

    ResRefCountManager.clearRes(this._data && this._data.url);
    ResRefCountManager.getRes(this._data.urlPath);

    this._data.preUrl = res.meta.prefix;
    this.content.data = this._data;

    if (res.offset) {
      this.content.pos_head = new Laya.Point(
        res.offset.headX,
        res.offset.headY,
      );
      this.content.pos_body = new Laya.Point(
        res.offset.bodyX,
        res.offset.bodyY,
      );
      this.content.pos_leg = new Laya.Point(res.offset.footX, res.offset.footY);
      this.content.shadow = res.offset.shadow;
      this.content.pivot(this.content.pos_leg.x, this.content.pos_leg.y);
    }

    this.loadAnimation();
    this.loadComplete();
  }

  protected loadComplete() {
    this.completeFunc && this.completeFunc(this);
  }

  protected loadAnimation() {
    switch (this.type) {
      case HeroMovieClipRefType.OUTERCITY_VEHICLE:
        for (const key in ActionLabesType) {
          let aniType = ActionLabesType[key];
          let cacheName = this._data.getCacheName(aniType);
          let success = AnimationManager.Instance.createAnimation(
            cacheName,
            "",
            undefined,
            undefined,
            AnimationManager.BattleFormatLen,
          );
          if (success) {
            ResRefCountManager.setAniCacheName(this._data.urlPath, cacheName);
          }
        }
        break;
      case HeroMovieClipRefType.UI_PANEL:
      case HeroMovieClipRefType.SINGLEBG_CAMPAIGN_SCENE:
        let cacheName = this._data.getCacheName(ActionLabesType.STAND);
        let success = AnimationManager.Instance.createAnimation(
          cacheName,
          "",
          undefined,
          undefined,
          AnimationManager.BattleFormatLen,
        );
        if (success) {
          ResRefCountManager.setAniCacheName(this._data.urlPath, cacheName);
        }
        break;
      default:
        break;
    }
  }

  private __loadResComplete(data: any) {
    if (!this._data || !data) return;
    if (data.url == this._data.urlPath) {
      this.loadResComplete();
    }
  }

  public dispose() {
    ResRefCountManager.clearRes(this._data.urlPath);
    this.removeEvent();
    this.content.stop();
    this.completeFunc = null;
  }
}
