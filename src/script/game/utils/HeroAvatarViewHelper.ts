import LangManager from "../../core/lang/LangManager";
import { PointDirectionHelper } from "../../core/utils/PointDirectionHelper";
import { PointUtils } from "../../core/utils/PointUtils";
import { DisplayObject } from "../component/DisplayObject";
import AIBaseInfo from "../map/ai/AIBaseInfo";
import Tiles from "../map/space/constant/Tiles";

export class HeroAvatarViewHelper {
  constructor() {}
  public static twoPointAngle(
    px: number,
    py: number,
    ex: number,
    ey: number,
  ): number {
    //计算两个点之间的角度
    var vx: number = px - ex;
    var vy: number = py - ey;
    vx = Math.abs(vx) < 10 ? 0 : vx;
    vy = Math.abs(vy) < 10 ? 0 : vy;
    var num: number = Math.atan2(vy, vx);
    num = (num * 180) / Math.PI;
    if (num < 0) num += 360;
    return num;
  }

  public static directionMove(
    direction: string,
    speed: number,
    target: DisplayObject,
  ) {
    //指定方向上的移动
    var bevelSpeed: number = Math.sqrt((speed * speed) / 2) + 1;
    switch (direction) {
      case PointDirectionHelper.B:
        target.y += speed - 1;
        break;
      case PointDirectionHelper.L:
        target.x -= speed;
        break;
      case PointDirectionHelper.R:
        target.x += speed;
        break;
      case PointDirectionHelper.T:
        target.y -= speed - 1;
        break;
      case PointDirectionHelper.L_B:
        target.x -= bevelSpeed;
        target.y += bevelSpeed;
        break;
      case PointDirectionHelper.L_T:
        target.x -= bevelSpeed;
        target.y -= bevelSpeed;
        break;
      case PointDirectionHelper.R_B:
        target.x += bevelSpeed;
        target.y += bevelSpeed;
        break;
      case PointDirectionHelper.R_T:
        target.x += bevelSpeed;
        target.y -= bevelSpeed;
        break;
      default:
        var errorTip: string = LangManager.Instance.GetTranslation(
          "map.internals.view.hero.helper.HeroAvatarViewHelper.errorTip",
        );
        throw new Error(errorTip);
    }
  }
  public static checkDirectionBySetup(
    setup: number,
    next: Laya.Point,
    info: AIBaseInfo,
  ): number {
    //按步长得出角度
    var off: number = setup - (info.walkIndex % setup);
    var index: number =
      info.pathInfo.length > info.walkIndex + off
        ? info.walkIndex + off
        : info.pathInfo.length - 1;

    index = index > setup ? index - setup : 0;
    index = info.walkIndex + 1;
    var prePoint: Laya.Point = new Laya.Point(
      info.pathInfo[index].x * 20,
      info.pathInfo[index].y * 20,
    );
    return HeroAvatarViewHelper.twoPointAngle(
      next.x,
      next.y,
      prePoint.x,
      prePoint.y,
    );
  }
  public static intervalPoint(
    setup: number,
    next: Laya.Point,
    info: AIBaseInfo,
  ): Laya.Point {
    //按步长得出角度
    var off: number = setup - (info.walkIndex % setup);
    var index: number =
      info.pathInfo.length > info.walkIndex + off
        ? info.walkIndex + off
        : info.pathInfo.length - 1;
    return new Laya.Point(
      info.pathInfo[index].x * 20,
      info.pathInfo[index].y * 20,
    );
  }

  public static getNextPoint(
    pre: Laya.Point,
    cur: Laya.Point,
    next: Laya.Point,
  ): Laya.Point {
    //下一个达到的点
    cur = PointUtils.scaleTransformII(cur, Tiles.WIDTH, Tiles.HEIGHT);
    next = PointUtils.clonePoint(cur);
    next.x = Math.abs(next.x - pre.x) < 12 ? pre.x : next.x;
    next.y = Math.abs(next.y - pre.y) < 12 ? pre.y : next.y;
    return next;
  }
}
