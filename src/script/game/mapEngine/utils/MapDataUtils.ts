/**
 * @author:pzlricky
 * @data: 2020-11-11 09:43
 * @description ***
 */
export default class MapDataUtils {
  constructor() {}

  /**
   * 获得地图中的点所在的tile（20X20）块
   * @param tileWidth
   * @param tileHeight
   * @param px
   * @param py
   * @return
   *
   */
  public static getTiles(
    tileWidth: number,
    tileHeight: number,
    px: number,
    py: number,
  ): Laya.Point {
    var cx: number,
      cy: number = 0;
    cx = Math.floor(px / tileWidth);
    cy = Math.floor(py / tileHeight);
    return new Laya.Point(cx, cy);
  }
  /**
   * 获得地图中的点所在的（1000X1000）块
   * @param tileWidth
   * @param tileHeight
   * @param px
   * @param py
   * @return
   *
   */
  public static getFileName(
    startX: number,
    startY: number,
    unitWidth: number = 1000,
    unitHeight: number = 1000,
  ): string {
    var nx: number = Math.floor(startX / unitWidth);
    var ny: number = Math.floor(startY / unitHeight);
    return nx + "," + ny;
  }
  public static getTitleFileName(
    startX: number,
    startY: number,
    unitWidth: number = 1000,
    unitHeight: number = 1000,
  ): string {
    var nx: number = Math.floor(startX / unitWidth);
    var ny: number = Math.floor(startY / unitHeight);
    return nx + "_" + ny;
  }
  /**
   * 得到起点 由字符的前两个数字组成
   * @param id 将数字按","连接起来的字符串 如: 20,30,40,50
   * @return
   *
   */
  public static getStartPoint(id: string): Laya.Point {
    var arr: Array<string> = id.split(",");
    var vx: number = Number(Number(arr[0]) * 1000);
    var vy: number = Number(Number(arr[1]) * 1000);
    var point: Laya.Point = new Laya.Point(vx, vy);
    arr = null;
    return point;
  }

  /**
   * 将字符串数组每项的 oldStr替换为newStr
   * @param arr
   * @param oldStr
   * @param newStr
   * @return
   *
   */
  public static updateSeparatorByArray(
    arr: Array<string>,
    oldStr: string = "_",
    newStr: string = ",",
  ): Array<string> {
    var reg: RegExp = new RegExp(oldStr);
    var newArr = [];
    for (var i: number = 0; i < arr.length; i++) {
      newArr[i] = arr[i].toString().replace(reg, newStr);
    }
    return newArr;
  }
  /**
   * 将 x_y 格式的字符串转换为Point对象
   * @param str x_y
   * @return
   *
   */
  public static stringToPoint(str: string): Laya.Point {
    var arr: Array<string> = str.split("_");
    var point: Laya.Point = new Laya.Point(Number(arr[0]), Number(arr[1]));
    return point;
  }

  /**
   * 计算路径的总长 像素
   * @param path tile点
   * @return
   *
   */
  public static getPathDistance(path: Array<Laya.Point>): number {
    var distance: number = 0;
    for (var i: number = 0; i < path.length - 1; i++) {
      let pointi1 = path[i + 1];
      distance += path[i].distance(pointi1.x, pointi1.y);
    }
    return distance * 20;
  }

  public static addStandPoint(path: Array<Laya.Point>): Array<Laya.Point> {
    var end: Laya.Point = new Laya.Point();
    end.x = (path[path.length - 1] as Laya.Point).x - 3;
    end.y = (path[path.length - 1] as Laya.Point).y + 2;
    path.push(end);
    var off: number = 5;
    while (off >= 0) {
      var pre1: Laya.Point = path[path.length - off - 2] as Laya.Point;
      var pre2: Laya.Point = path[path.length - off - 3] as Laya.Point;
      if (pre1 && pre2) {
        if (pre2.x - pre1.x > 0) {
          //向右走
          if (pre1.x - end.x < 0) {
            //超过
            path.splice(path.length - 2, ++off);
            continue;
          }
        } else {
          if (pre1.x - end.x > 0) {
            path.splice(path.length - 2, ++off);
            continue;
          }
        }
        if (pre2.y - pre1.y > 0) {
          if (pre1.y - end.y < 0) {
            path.splice(path.length - 2, ++off);
            continue;
          }
        } else {
          if (pre1.y - end.y > 0) {
            path.splice(path.length - 2, ++off);
            continue;
          }
        }
      }
      off--;
    }
    path.push(end);
    path.push(end);
    return path;
  }
}
