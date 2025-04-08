export class PathPointUtils {
  constructor() {}

  /**
   *  找出两点之间的所有点
   *  误差项初始值 d = 0, 斜率为k；
   *  x坐标每增加1, 则: d = d + k, 一旦d>=1, 则: d = d - 1;
   *  令 e = d - 0.5;
   *  e < 0, y不递增
   *  e > 0, y递增1
   *  e = 0, 任取
   *  x方向每次递增, e = e + k
   *  当y递增时, 须 e = e - 1
   */
  public static findPoints(
    from: Laya.Point,
    to: Laya.Point
  ): Array<Laya.Point> {
    var path: Array<Laya.Point> = [];
    var nextCol: number = from.x;
    var nextRow: number = from.y;
    var endCol: number = to.x;
    var endRow: number = to.y;
    var deltaCol: number = to.x - from.x;
    var deltaRow: number = to.y - from.y;
    var stepCol: number;
    var stepRow: number;
    var currentStep: number = 0;
    var fraction: number;
    //路径方向计算
    if (deltaCol < 0) stepCol = -1;
    else stepCol = 1;
    if (deltaRow < 0) stepRow = -1;
    else stepRow = 1;
    deltaCol = Math.abs(deltaCol * 2);
    deltaRow = Math.abs(deltaRow * 2);

    path.push(new Laya.Point(nextCol, nextRow));

    //bresenham算法,令 fraction = 2*e*dx
    if (deltaCol > deltaRow) {
      fraction = deltaRow - deltaCol / 2; // e = dy/dx - 0.5
      while (nextCol != endCol) {
        if (fraction >= 0) {
          nextRow += stepRow;
          fraction -= deltaCol; // e = e - 1
        }
        nextCol += stepCol;
        fraction += deltaRow; // e = e + k
        path.push(new Laya.Point(nextCol, nextRow));
        currentStep++;
      }
    } else {
      fraction = deltaCol - deltaRow / 2;
      while (nextRow != endRow) {
        if (fraction >= 0) {
          nextCol += stepCol;
          fraction -= deltaRow;
        }
        nextRow += stepRow;
        fraction += deltaCol;
        path.push(new Laya.Point(nextCol, nextRow));
        currentStep++;
      }
    }

    return path;
  }

  /**
   * 优化路径, 用于优化玩家广播的路径
   * 除去路径中在一条直线上的点
   * @param path
   * @return
   *
   */
  public static optimizePath(path: any[]): any[] {
    if (path.length <= 2) return path.concat();
    var newPath: any[] = [path[0]];
    var prePoint: Laya.Point;
    var curPoint: Laya.Point;
    for (var i: number = 1; i < path.length; i++) {
      prePoint = <Laya.Point>path[i - 1];
      curPoint = <Laya.Point>path[i];

      if (
        (curPoint.x - prePoint.x) * (curPoint.y - prePoint.y) != 0 ||
        i == path.length - 1
      ) {
        //不在横线或竖线上
        newPath.push(curPoint);
      }
    }

    var path2: any[] = [path[0]];
    var tempK: number = Number.POSITIVE_INFINITY;
    for (i = 1; i < newPath.length; i++) {
      prePoint = <Laya.Point>newPath[i - 1];
      curPoint = <Laya.Point>newPath[i];
      var k: number;
      if (prePoint.x == curPoint.x) {
        k = Number.POSITIVE_INFINITY;
      } else {
        k = (curPoint.y - prePoint.y) / (curPoint.x - prePoint.x);
      }
      if (tempK != k || i == newPath.length - 1) {
        //斜率不同
        tempK = k;
        path2.push(curPoint);
      }
    }
    return path2;
  }
}
