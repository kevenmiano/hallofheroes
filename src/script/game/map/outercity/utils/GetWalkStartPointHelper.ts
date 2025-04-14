import Logger from "../../../../core/logger/Logger";
import Tiles from "../../space/constant/Tiles";
import { OuterCityModel } from "../OuterCityModel";
import Point = Laya.Point;

/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/11/19 16:05
 * @ver 1.0
 */
export class GetWalkStartPointHelper {
  constructor() {}

  public static getFirstPoint(
    $x: number,
    $y: number,
    $model: OuterCityModel,
  ): Point {
    let p: Point;
    for (let i: number = 0; i < 100; i++) {
      let b1: boolean = $model.getWalkable($x + Tiles.WIDTH * i, $y);
      let b2: boolean = $model.getWalkable($x - Tiles.WIDTH * i, $y);
      if (!b1) {
        p = new Point($x + Tiles.WIDTH * i, $y);
        break;
      }
      if (!b2) {
        p = new Point($x - Tiles.WIDTH * i, $y);
        break;
      }
    }
    return p;
  }

  /**
   *找到周围的可行走点
   *
   */
  public static getStartPoint(
    $x: number,
    $y: number,
    $model: OuterCityModel,
  ): Point {
    let p: Point;
    let b: boolean = $model.getWalkable($x, $y);
    if (!b) {
      p = new Point($x, $y);
      return p;
    }
    b = $model.getWalkable($x - Tiles.WIDTH, $y);
    if (!b) {
      p = new Point($x - Tiles.WIDTH, $y);
      return p;
    }
    b = $model.getWalkable($x - Tiles.WIDTH, $y + Tiles.HEIGHT);
    if (!b) {
      p = new Point($x - Tiles.WIDTH - Tiles.WIDTH, $y + Tiles.HEIGHT);
      return p;
    }
    b = $model.getWalkable($x - Tiles.WIDTH, $y - Tiles.HEIGHT);
    if (!b) {
      p = new Point($x - Tiles.WIDTH, $y - Tiles.HEIGHT);
      return p;
    }
    b = $model.getWalkable($x + Tiles.WIDTH, $y - Tiles.HEIGHT);
    if (!b) {
      p = new Point($x + Tiles.WIDTH, $y - Tiles.HEIGHT);
      return p;
    }
    b = $model.getWalkable($x + Tiles.WIDTH, $y + Tiles.HEIGHT);
    if (!b) {
      p = new Point($x + Tiles.WIDTH, $y + Tiles.HEIGHT);
      return p;
    }
    b = $model.getWalkable($x + Tiles.WIDTH, $y);
    if (!b) {
      p = new Point($x + Tiles.WIDTH, $y);
      return p;
    }
    b = $model.getWalkable($x, $y + Tiles.HEIGHT);
    if (!b) {
      p = new Point($x, $y + Tiles.HEIGHT);
      return p;
    }

    b = $model.getWalkable($x, $y - Tiles.HEIGHT);
    if (!b) {
      p = new Point($x, $y - Tiles.HEIGHT);
      return p;
    }
    Logger.log("::::::::::::::::::::::::::::周围都不可行走");
    return p;
  }
}
