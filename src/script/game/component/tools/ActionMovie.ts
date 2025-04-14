/**
 * @author:jeremy.xu
 * @data: 2020-11-23 12:00
 * @description 管理动画之间的状态转换
 **/
import AudioManager from "../../../core/audio/AudioManager";
import Logger from "../../../core/logger/Logger";
import ResMgr from "../../../core/res/ResMgr";
import { RoleActionSimplifyData } from "../../battle/data/RoleActionSimplifyData";
import { ActionLabesType } from "../../constant/BattleDefine";
import { AnimationManager } from "../../manager/AnimationManager";
import { EnterFrameManager } from "../../manager/EnterFrameManager";
import { PathManager } from "../../manager/PathManager";
import { MovieClip } from "../MovieClip";

export class ActionMovie extends Laya.Sprite {
  /** 动作完停止 */
  public static STOP: string = "STOP";
  /** 动作完再重复当前动作 */
  public static REPEAT: string = "REPEAT";
  /** 动作完跳转至某动作 */
  public static GOTO: string = "GOTO";
  /** 动作完在最后停一定帧数在跳转至某动作(默认值, 且默认跳至Stand)*/
  public static WAIT_AND_GOTO: string = "WAIT_AND_GOTO";

  private _movie: MovieClip;
  private _defaultAction: string;
  private _currentType: string;
  private _hasWeakBreatheAction: boolean = false;

  public get currentLabel(): string {
    return this._movie ? this._movie.currentLabel : "";
  }

  public set defaultAction(value: string) {
    this._defaultAction = value;
  }

  public get movie(): MovieClip {
    return this._movie;
  }

  public set movie(mc: MovieClip) {
    if (this._movie) {
      this.clearFrameScript(this._movie); //更换avatar的时候清理帧脚本, 否则影响当前动作
      this._movie.removeSelf();
    }
    if (mc) {
      this._movie = mc;
      this.addChild(this._movie);
    }
  }

  /**
   * 执行动作
   * @param type
   * @param repeatType
   * @param nextType 下个动作
   * @param waitFrame 动作完成后等待帧数
   */
  public actionAndPlay(
    type: string,
    repeatType: string = null,
    nextType: string = null,
    waitFrame: number = 5,
  ) {
    this._currentType = type;
    Laya.timer.clear(this, this.actionAndPlay);

    repeatType = repeatType || this.getDefaultRepeatType(type);
    nextType = nextType || ActionLabesType.STAND;

    if (!this._movie || !this._movie.data) {
      Logger.info("[ActionMovie]动画或数据不存在");
      return;
    }

    // Logger.log("[ActionMovie]actionAndPlay 执行动作 type=" + type + ", repeatType=" + repeatType + ", nextType=" + nextType)

    type = this.checkSimplifyData(type);
    this.checkWeakBreatheAction(type);

    this._movie.gotoAndPlay(0, false, type);

    switch (repeatType) {
      case ActionMovie.STOP:
        this._movie.addFrameScript(() => {
          this._movie.stop();
        });
        break;
      case ActionMovie.GOTO:
        this._movie.addFrameScript(() => {
          this.actionAndPlay(nextType);
        });
        break;
      case ActionMovie.REPEAT:
        this._movie.addFrameScript(() => {
          this.actionAndPlay(type, ActionMovie.REPEAT);
        });
        break;
      case ActionMovie.WAIT_AND_GOTO:
        this._movie.addFrameScript(() => {
          if (RoleActionSimplifyData.isSimplify(this._movie.data.urlPath)) {
            let delay = (1000 / EnterFrameManager.FPS) * waitFrame;
            Laya.timer.once(delay, this, this.actionAndPlay, [nextType]);
          } else {
            Laya.timer.frameOnce(waitFrame, this, this.actionAndPlay, [
              nextType,
            ]);
          }
        });
        break;
    }
  }

  private checkSimplifyData(type: string): string {
    if (RoleActionSimplifyData.isSimplify(this._movie.data.urlPath)) {
      // Logger.info("[ActionMovie]" +this._movie.data.urlPath + "使用动作" + type)

      // 减少战斗怪物动作资源, 无动作使用站立代替
      let cacheName = this._movie.data.getCacheName(type);
      if (!AnimationManager.Instance.getCache(cacheName)) {
        // Logger.info("[ActionMovie]不存在动作" + cacheName + ", 使用stand动作代替")
        type = ActionLabesType.STAND;
      }
    }
    return type;
  }

  private checkWeakBreatheAction(type: string) {
    if (
      type == ActionLabesType.DANNY ||
      type == ActionLabesType.DIE ||
      type == ActionLabesType.FAILED
    ) {
      this.removeWeakBreatheAction();
    } else {
      if (!this._hasWeakBreatheAction) {
        this.addWeakBreatheAction();
      }
    }
  }

  private addWeakBreatheAction() {
    if (!this._movie || this._movie.destroyed) return;

    this._hasWeakBreatheAction = true;
    // Logger.info("[ActionMovie]" + this._movie.data.urlPath + "添加弱呼吸" )
    this._movie.scale(1, 1);
    Laya.Tween.to(
      this._movie,
      { scaleX: 1.01, scaleY: 1.04 },
      800,
      Laya.Ease.linearInOut,
      Laya.Handler.create(this, () => {
        if (!this._movie || this._movie.destroyed) return;
        Laya.Tween.to(
          this._movie,
          { scaleX: 1, scaleY: 1 },
          800,
          Laya.Ease.linearInOut,
          Laya.Handler.create(this, () => {
            this.addWeakBreatheAction();
          }),
        );
      }),
    );
  }

  private removeWeakBreatheAction() {
    if (!this._movie) return;

    // Logger.info("[ActionMovie]" + this._movie.data.urlPath + "移除弱呼吸" )
    this._hasWeakBreatheAction = false;
    Laya.Tween.clearAll(this._movie);
    if (this._movie && !this._movie.destroyed) {
      this._movie.scale(1, 1);
    }
  }

  private clearFrameScript(mc: MovieClip) {
    for (var i: number = 1; i <= mc.totalFrames; i++) {
      mc.addFrameScript(i, null);
    }
    mc.addFrameScript(null);
  }

  private getDefaultRepeatType(type: string): string {
    switch (type) {
      case ActionLabesType.STAND:
      case ActionLabesType.WALK:
      case ActionLabesType.READY:
        return ActionMovie.REPEAT;
      case ActionLabesType.VICTORY:
      case ActionLabesType.FAILED:
        return ActionMovie.STOP;
      default:
        return ActionMovie.WAIT_AND_GOTO;
    }
  }

  /**
   * 获得某一帧标签的长度(帧数),即从帧标签开始到结束的总帧数. TODO
   */
  public getLabelFrameNum(label: string): number {
    return this._movie.frames.length;
  }

  public dispose() {
    this.removeWeakBreatheAction();
    this._movie && this._movie.stop();
    this._movie = null;
  }
}
