import { DisplayObject } from "../../../component/DisplayObject";
// import IFilterFormat from "../../space/interfaces/IFilterFormat";

interface IFilterFormat {
  setLightingFilter(display: DisplayObject): void;
  setGrayFilter(display: DisplayObject): void;
  setNormalFilter(display: DisplayObject): void;
  setRedFilter(display: DisplayObject): void;
}

/**
 *  作用于显示对线上的滤镜
 */
export class MapPhysicsFilter implements IFilterFormat {
  constructor() {}

  public setLightingFilter(display: DisplayObject) {}

  public setGrayFilter(display: DisplayObject) {}
  /**
   *  返回正常
   */
  public setNormalFilter(display: DisplayObject) {
    TweenLite.killTweensOf(display, false);
    display.filters = null;
  }
  /**
   *  设置红色滤镜
   */
  public setRedFilter(display: DisplayObject) {
    TweenMax.to(display, 0.5, {
      glowFilter: { color: 0xff0000, alpha: 1, blurX: 17, blurY: 17 },
      repeat: -1,
      yoyo: true,
    });
  }
}
