export class PointDirectionHelper {
  constructor() {}
  public static L_T: string = "L_T";
  public static T: string = "T";
  public static R_T: string = "R_T";
  public static R: string = "R";
  public static R_B: string = "R_B";
  public static B: string = "B";
  public static L_B: string = "L_B";
  public static L: string = "L";
  private static _pointDic: Map<string, Array<Laya.Point>>;

  public static getPointsBy(
    cur: Laya.Point,
    next: Laya.Point,
  ): Array<Laya.Point> {
    var type: string = PointDirectionHelper.getDirectionType(cur, next);
    return PointDirectionHelper.getPointsByType(type);
  }
  public static getPointBy8Dier(): any[] {
    if (!PointDirectionHelper._pointDic) PointDirectionHelper.initPoint();
    var arr: Array<Laya.Point> = [];
    PointDirectionHelper._pointDic.forEach((element) => {
      arr = arr.concat(element);
    });
    return arr;
  }
  public static getDirectionType(cur: Laya.Point, next: Laya.Point): string {
    if (cur.x > next.x) {
      if (cur.y < next.y) return PointDirectionHelper.L_B;
      else if (cur.y == next.y) return PointDirectionHelper.L;
      else return PointDirectionHelper.L_T;
    } else if (cur.x < next.x) {
      if (cur.y < next.y) return PointDirectionHelper.R_B;
      else if (cur.y == next.y) return PointDirectionHelper.R;
      return PointDirectionHelper.R_T;
    } else {
      if (cur.y < next.y) return PointDirectionHelper.B;
      else if (cur.y > next.y) return PointDirectionHelper.T;
    }
    return "";
  }

  private static getPointsByType(type: string): Array<Laya.Point> {
    if (!PointDirectionHelper._pointDic) PointDirectionHelper.initPoint();
    return PointDirectionHelper._pointDic.get(type);
  }

  private static initPoint() {
    PointDirectionHelper._pointDic = new Map();
    var p: Laya.Point;
    var arr: Array<Laya.Point> = [];
    p = new Laya.Point(-2, -2);
    arr.push(p);
    p = new Laya.Point(-2, -1);
    arr.push(p);
    p = new Laya.Point(-1, -2);
    arr.push(p);
    PointDirectionHelper._pointDic.set(PointDirectionHelper.L_T, arr);

    arr = [];
    p = new Laya.Point(0, -2);
    arr.push(p);
    PointDirectionHelper._pointDic.set(PointDirectionHelper.T, arr);

    arr = [];
    p = new Laya.Point(1, -2);
    arr.push(p);
    p = new Laya.Point(2, -2);
    arr.push(p);
    p = new Laya.Point(2, -1);
    arr.push(p);
    PointDirectionHelper._pointDic.set(PointDirectionHelper.R_T, arr);

    arr = [];
    p = new Laya.Point(-2, 0);
    arr.push(p);
    PointDirectionHelper._pointDic.set(PointDirectionHelper.L, arr);

    arr = [];
    p = new Laya.Point(-2, 1);
    arr.push(p);
    p = new Laya.Point(-2, 2);
    arr.push(p);
    p = new Laya.Point(-1, 2);
    arr.push(p);
    PointDirectionHelper._pointDic.set(PointDirectionHelper.L_B, arr);

    arr = [];
    p = new Laya.Point(0, 2);
    arr.push(p);
    PointDirectionHelper._pointDic.set(PointDirectionHelper.B, arr);

    arr = [];
    p = new Laya.Point(1, 2);
    arr.push(p);
    p = new Laya.Point(2, 2);
    arr.push(p);
    p = new Laya.Point(2, 1);
    arr.push(p);
    PointDirectionHelper._pointDic.set(PointDirectionHelper.R_B, arr);

    arr = [];
    p = new Laya.Point(2, 0);
    arr.push(p);
    PointDirectionHelper._pointDic.set(PointDirectionHelper.R, arr);
  }
}
