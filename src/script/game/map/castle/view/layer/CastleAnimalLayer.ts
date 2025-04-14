//@ts-expect-error: External dependencies
import ResMgr from "../../../../../core/res/ResMgr";
import { Sequence } from "../../../../../core/task/Sequence";
import {
  ActionsExecutionMode,
  SequenceList,
} from "../../../../../core/task/SequenceList";
import { MovieClip } from "../../../../component/MovieClip";
import { NotificationEvent } from "../../../../constant/event/NotificationEvent";
import { NotificationManager } from "../../../../manager/NotificationManager";
import IStopEffect from "../../interfaces/IStopEffect";
import Logger from "../../../../../core/logger/Logger";
import { AnimationManager } from "../../../../manager/AnimationManager";
import ObjectUtils from "../../../../../core/utils/ObjectUtils";
import CastleConfigUtil, { EmCastlePos } from "../../utils/CastleConfigUtil";
import { WorldBossHelper } from "../../../../utils/WorldBossHelper";

/**内城建筑加载任务 */
export class CastleEffectLoadTask extends Sequence {
  private resName: string = "";

  static path = "res/animation/images/effect/";

  constructor(resName: string) {
    super();
    this.resName = resName;
  }

  protected onExecute() {
    super.onExecute();
    let loadUrl =
      CastleEffectLoadTask.path + this.resName + "/" + this.resName + ".json";
    ResMgr.Instance.loadRes(
      loadUrl,
      (res) => {
        Logger.ricky("加载完成:", loadUrl);
        this.endAction(true);
      },
      null,
      Laya.Loader.ATLAS,
    );
  }

  protected onForcedStop() {
    let loadUrl =
      CastleEffectLoadTask.path + this.resName + "/" + this.resName + ".json";
    ResMgr.Instance.cancelLoadByUrl(loadUrl);
  }
}

/**
 * 内城动画层
 * 新动画
 */
export default class CastleAnimalLayer
  extends Laya.Sprite
  implements IStopEffect
{
  /**特效名称 */
  private anis: string[] = [
    "bird_effect",
    // "bonfire_effect",
    "cloud_effect_0",
    "cloud_effect_1",
    "cloud_effect_2",
    "cloud_effect_3",
  ];

  /**移动动画索引 */
  private moveAnis: string[] = [
    "cloud_effect_0",
    "cloud_effect_1",
    "cloud_effect_2",
    "cloud_effect_3",
  ];

  private animationMaps: Map<string, MovieClip> = new Map();

  private downLoadList: SequenceList;

  constructor() {
    super();
    this.mouseEnabled = false;
    this.animationMaps = new Map();
    this.initView();
    this.initEvent();
  }

  private initView() {
    let parallel = new SequenceList(ActionsExecutionMode.RunInSequence);
    for (let index = 0; index < this.anis.length; index++) {
      let resName = this.anis[index];
      parallel = parallel.addTask(new CastleEffectLoadTask(resName));
    }
    this.downLoadList = parallel;
    parallel
      .setComplete(
        Laya.Handler.create(this, () => {
          Logger.ricky("任务完成");
          this.createAnimation();
        }),
      )
      .execute(null);

    // new SequenceList(ActionsExecutionMode.RunInParallel)
    //   .addTask(parallel)
    //   .setComplete(Laya.Handler.create(this, () => {
    //     Logger.ricky("任务完成");
    //     this.createAnimation();
    //   })).execute(null);
  }

  /**创建内城动画 */
  private createAnimation() {
    for (let index = 0; index < this.anis.length; index++) {
      let resName = this.anis[index];
      let prefixUrl = "images/effect/";
      let aniName = resName + "/";
      AnimationManager.Instance.createAnimation(
        prefixUrl,
        aniName,
        0,
        "",
        AnimationManager.MapPhysicsFormatLen,
      );
      let pos = CastleConfigUtil.Instance.getAniPos(
        index,
        WorldBossHelper.checkInOuterCityWarMap()
          ? EmCastlePos.OuterCityWar
          : EmCastlePos.Castle,
      );
      let tl = new MovieClip(prefixUrl + aniName);
      tl.x = pos.x;
      tl.y = pos.y;
      tl.gotoAndPlay(0, true);
      this.addChild(tl);
      if (!this.animationMaps) {
        this.animationMaps = new Map();
      }
      this.animationMaps.set(resName, tl);
      if (this.moveAnis.indexOf(resName) != -1) {
        //移动动画
        this.doCircleAnimation(tl, pos.x);
      }
    }
  }

  doCircleAnimation(target: MovieClip, defalultX: number = 0) {
    let self = this;
    target.x = defalultX;
    target.alpha = 0.5;
    let targetPos: number = target.x - 1934 - Math.floor(Math.random() * 500);
    Laya.Tween.to(
      target,
      { alpha: 1 },
      1000,
      null,
      Laya.Handler.create(this, () => {
        Laya.Tween.to(
          target,
          { x: targetPos },
          Math.floor(Math.random() * 2000) + 50000,
          null,
          Laya.Handler.create(this, () => {
            Laya.Tween.to(
              target,
              { alpha: 0 },
              200,
              undefined,
              Laya.Handler.create(this, () => {
                self.doCircleAnimation(target, defalultX);
              }),
              100,
            );
          }),
        );
      }),
    );
  }

  private initEvent() {
    NotificationManager.Instance.addEventListener(
      NotificationEvent.STOP_EFFECT,
      this.__notificationHandler,
      this,
    );
  }

  private removeEvent() {
    NotificationManager.Instance.removeEventListener(
      NotificationEvent.STOP_EFFECT,
      this.__notificationHandler,
      this,
    );
  }

  private __notificationHandler(target: any, data: any) {
    if (data) {
      this.startEffet();
    } else {
      this.stopEffect();
    }
  }

  public stopEffect() {
    this.animationMaps &&
      this.animationMaps.forEach((value: MovieClip, key: string) => {
        value.stop();
      });
  }

  public startEffet() {
    this.animationMaps &&
      this.animationMaps.forEach((value: MovieClip, key: string) => {
        value.play();
      });
  }

  public dispose() {
    this.removeEvent();
    this.removeSelf();
    this.downLoadList && this.downLoadList.clear();
    this.animationMaps &&
      this.animationMaps.forEach((value: MovieClip, key: string) => {
        ObjectUtils.disposeObject(value);
      });
    Laya.Tween.clearAll(this);
    this.animationMaps.clear();
    this.animationMaps = null;
    this.downLoadList = null;
  }
}
