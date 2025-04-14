import Point = Laya.Point;

export class Geometry {
  public static getAngle4(
    p1x: number,
    p1y: number,
    p2x: number,
    p2y: number,
  ): number {
    return Math.atan2(p2y - p1y, p2x - p1x);
  }

  public static getAngle(p1: Point, p2: Point): number {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x);
  }

  public static nextPoint2(
    px: number,
    py: number,
    angle: number,
    distance: number,
  ): Point {
    return new Point(
      px + Math.cos(angle) * distance,
      py + Math.sin(angle) * distance,
    );
  }

  public static nextPoint(p: Point, angle: number, distance: number): Point {
    return new Point(
      p.x + Math.cos(angle) * distance,
      p.y + Math.sin(angle) * distance,
    );
  }

  private static standardAngle(angle: number): number {
    angle = angle % (2 * Math.PI);
    if (angle > Math.PI) {
      angle = angle - 2 * Math.PI;
    } else if (angle < -Math.PI) {
      angle = angle + 2 * Math.PI;
    }
    return angle;
  }

  public static crossAngle(firstAngle: number, secondAngle: number): number {
    return Geometry.standardAngle(
      Geometry.standardAngle(firstAngle) - Geometry.standardAngle(secondAngle),
    );
  }

  public static isClockwish(firstAngle: number, secondAngle: number): boolean {
    return Geometry.crossAngle(firstAngle, secondAngle) < 0;
  }

  public static cross_x(
    x11: number,
    y11: number,
    x12: number,
    y12: number,
    x21: number,
    y21: number,
    x22: number,
    y22: number,
  ): number {
    let _local10: number = (y11 - y12) / (x12 * y11 - x11 * y12);
    let _local11: number = (x12 - x11) / (x12 * y11 - x11 * y12);
    let _local12: number = (y21 - y22) / (x22 * y21 - x21 * y22);
    let _local13: number = (x22 - x21) / (x22 * y21 - x21 * y22);
    let _local14: number =
      (_local11 - _local13) / (_local12 * _local11 - _local10 * _local13);
    return _local14;
  }

  public static cross_y(
    x11: number,
    y11: number,
    x12: number,
    y12: number,
    x21: number,
    y21: number,
    x22: number,
    y22: number,
  ): number {
    let _local10: number = (y11 - y12) / (x12 * y11 - x11 * y12);
    let _local11: number = (x12 - x11) / (x12 * y11 - x11 * y12);
    let _local12: number = (y21 - y22) / (x22 * y21 - x21 * y22);
    let _local13: number = (x22 - x21) / (x22 * y21 - x21 * y22);
    let _local14: number =
      (_local10 - _local12) / (_local13 * _local10 - _local11 * _local12);
    return _local14;
  }

  public static crossPoint2D(
    x11: number,
    y11: number,
    x12: number,
    y12: number,
    x21: number,
    y21: number,
    x22: number,
    y22: number,
  ): Point {
    let _local10: number = (y11 - y12) / (x12 * y11 - x11 * y12);
    let _local11: number = (x12 - x11) / (x12 * y11 - x11 * y12);
    let _local12: number = (y21 - y22) / (x22 * y21 - x21 * y22);
    let _local13: number = (x22 - x21) / (x22 * y21 - x21 * y22);
    let _local14: number =
      (_local11 - _local13) / (_local12 * _local11 - _local10 * _local13);
    let _local15: number =
      (_local10 - _local12) / (_local13 * _local10 - _local11 * _local12);
    return new Point(_local14, _local15);
  }

  public static distance(d1: Point, d2: Point): number {
    return Math.sqrt(Geometry.distanceSq(d1, d2));
  }

  public static distanceSq(d1: Point, d2: Point): number {
    return (d1.x - d2.x) * (d1.x - d2.x) + (d1.y - d2.y) * (d1.y - d2.y);
  }
}
