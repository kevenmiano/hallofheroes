import Handler = Laya.Handler;

/**
 * @author yuanzhan.yu
 */
export class CellEffectUtils {
  public static durationTime: number = 700;
  constructor() {}

  public static zoomOut(target: Laya.Sprite, complete: Function, caller: any) {
    Laya.Tween.to(
      target,
      { x: target.x + 25, y: target.y + 25, scaleX: 0, scaleY: 0 },
      CellEffectUtils.durationTime,
      Laya.Ease.backIn,
      Handler.create(this, () => {
        complete.apply(caller);
      }),
    );
  }

  public static fadeOut(target: Laya.Sprite, complete: Function, caller: any) {
    Laya.Tween.to(
      target,
      { alpha: 0 },
      CellEffectUtils.durationTime,
      Laya.Ease.backIn,
      Handler.create(this, () => {
        complete.apply(caller);
      }),
    );
  }

  public static rotate(target: Laya.Sprite, complete: Function, caller: any) {
    Laya.Tween.to(
      target,
      { alpha: 0 },
      CellEffectUtils.durationTime,
      Laya.Ease.backIn,
      Handler.create(this, () => {
        complete.apply(caller);
      }),
    );
  }

  public static shutterX1(
    target: Laya.Sprite,
    complete: Function,
    caller: any,
  ) {
    //@ts-expect-error: External dependencies
    TweenLite.to(target, CellEffectUtils.durationTime, {
      width: 0,

      //@ts-expect-error: External dependencies
      ease: Back.easeIn,
      onComplete: complete,
      onCompleteScope: caller,
    });
  }

  public static shutterX2(
    target: Laya.Sprite,
    complete: Function,
    caller: any,
  ) {
    //@ts-expect-error: External dependencies
    TweenLite.to(target, CellEffectUtils.durationTime, {
      x: target.x + target.width,
      width: 0,

      //@ts-expect-error: External dependencies
      ease: Back.easeIn,
      onComplete: complete,
      onCompleteScope: caller,
    });
  }

  public static shutterY1(
    target: Laya.Sprite,
    complete: Function,
    caller: any,
  ) {
    //@ts-expect-error: External dependencies
    TweenLite.to(target, CellEffectUtils.durationTime, {
      height: 0,

      //@ts-expect-error: External dependencies
      ease: Back.easeIn,
      onComplete: complete,
      onCompleteScope: caller,
    });
  }

  public static shutterY2(
    target: Laya.Sprite,
    complete: Function,
    caller: any,
  ) {
    //@ts-expect-error: External dependencies
    TweenLite.to(target, CellEffectUtils.durationTime, {
      y: target.y + target.height,
      height: 0,

      //@ts-expect-error: External dependencies
      ease: Back.easeIn,
      onComplete: complete,
      onCompleteScope: caller,
    });
  }
}
