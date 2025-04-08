import Logger from "../../core/logger/Logger";

/**
 * @author:pzlricky
 * @data: 2021-01-08 17:09
 * @description 判断像素点击
 */
export default class HitTestUtils {
  /**判断点击是否在对象范围内 */
  static isInArea(
    target: Laya.Sprite | Laya.Animation,
    point: Laya.Point
  ): boolean {
    if (!target) return false;
    let targetGraphicBounds = target.getBounds();
    let stagePos: Laya.Point;
    if (target.parent) {
      //@ts-ignore
      stagePos = target.parent.localToGlobal(
        new Laya.Point(target.x, target.y),
        true
      );
    } else {
      stagePos = new Laya.Point(target.x, target.y);
    }
    let rect = new Laya.Rectangle(
      stagePos.x,
      stagePos.y,
      targetGraphicBounds.width,
      targetGraphicBounds.height
    );
    if (
      point.x >= rect.x &&
      point.x <= rect.x + rect.width &&
      point.y <= rect.y &&
      point.y >= rect.y - rect.height
    ) {
      return true;
    }
    return false;
  }

  /**
   * 判断像素点击,当前点是否在目前对象非透明像素区域内
   * @param target 目标对象
   * @param point 鼠标点
   */
  static hitTest(target: Laya.Sprite | any, point: Laya.Point): boolean {
    if (!target) {
      return true;
    }
    try {
      let texture: Laya.Texture = null;
      if (target.texture) {
        texture = target.texture;
      } else {
        let one = target.graphics["_one"];
        if (one) {
          texture = one.texture;
        }
      }

      if (!texture || !texture.getIsReady()) {
        return true;
      }

      let s: Uint8Array = texture.getPixels(
        Math.floor(point.x),
        Math.floor(point.y),
        1,
        1
      );

      // Logger.xjy("[HitTestUtils]hitTest", target, point, s)

      if (!s || (s.join("").slice(0, 3) == "000" && s[3] < 10)) {
        return false;
      }
    } catch (error) {
      return true;
    }

    return true;
  }

  static hitTestAlpha(
    target: Laya.Sprite | Laya.Texture,
    point: Laya.Point
  ): number {
    if (!target) {
      return 0;
    }
    try {
      let texture: Laya.Texture;

      if (target instanceof Laya.Sprite) {
        if (target.texture) {
          texture = target.texture;
        } else {
          let one = target.graphics["_one"];
          if (one) {
            texture = one.texture;
          }
        }
        point = point || new Laya.Point(target.mouseX, target.mouseY);
      } else {
        texture = target;
        point = point || new Laya.Point(0, 0);
      }

      if (!texture || !texture.getIsReady()) {
        return 0;
      }

      let s: Uint8Array = texture.getPixels(
        Math.floor(point.x),
        Math.floor(point.y),
        1,
        1
      );
      if (s && s[3]) {
        // Logger.yyz("像素级检测透明度判断: ", target, point, s);
        return s[3];
      }
    } catch (error) {
      return 0;
    }
    return 0;
  }
}
