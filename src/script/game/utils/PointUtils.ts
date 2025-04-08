/**
 * @author:pzlricky
 * @data: 2021-01-12 11:17
 * @description ***
 */
export default class PointUtils {
  /**
   * 把本地坐标转换为相对stage的全局坐标。
   * @param point				本地坐标点。
   * @param createNewPoint	（可选）是否创建一个新的Point对象作为返回值, 默认为false, 使用输入的point对象返回, 减少对象创建开销。
   * @return 转换后的坐标的点。
   */
  public static localToGlobal(
    target: any,
    point: Laya.Point,
    createNewPoint: boolean = false
  ): Laya.Point {
    //if (!_displayedInStage || !point) return point;
    if (createNewPoint === true) {
      point = new Laya.Point(point.x, point.y);
    }
    //此处的this指的是调用此API的对象
    var ele: Laya.Sprite = target;
    while (ele) {
      if (ele == Laya.stage) break;
      point = ele.localToGlobal(point);
      ele = ele.parent as Laya.Sprite;
    }

    return point;
  }

  /**
   * 把stage的全局坐标转换为本地坐标。
   * @param point				全局坐标点。
   * @param createNewPoint	（可选）是否创建一个新的Point对象作为返回值, 默认为false, 使用输入的point对象返回, 减少对象创建开销。
   * @return 转换后的坐标的点。
   */
  public static globalToLocal(
    target: any,
    point: Laya.Point,
    createNewPoint: boolean = false
  ): Laya.Point {
    //if (!_displayedInStage || !point) return point;
    if (createNewPoint) {
      point = new Laya.Point(point.x, point.y);
    }
    //此处的this指的是调用此API的对象
    var ele = target;
    var list: Array<any> = [];
    while (ele) {
      if (ele == Laya.stage) break;
      list.push(ele);
      ele = ele.parent as Laya.Sprite;
    }
    var i: number = list.length - 1;
    while (i >= 0) {
      ele = list[i];
      point = ele.fromParentPoint(point);
      i--;
    }
    return point;
  }

  /**
   * 将本地坐标系坐标转转换到父容器坐标系。
   * @param point 本地坐标点。
   * @return  转换后的点。
   */
  public static toParentPoint(target: any, point: Laya.Point): Laya.Point {
    if (!point) return point;
    point.x -= target.pivotX;
    point.y -= target.pivotY;

    if (target.transform) {
      target._transform.transformPoint(point);
    }
    point.x += target._x;
    point.y += target._y;
    var scroll: Laya.Rectangle = target._style.scrollRect;
    if (scroll) {
      point.x -= scroll.x;
      point.y -= scroll.y;
    }
    return point;
  }

  /**
   * 将父容器坐标系坐标转换到本地坐标系。
   * @param point 父容器坐标点。
   * @return  转换后的点。
   */
  public static fromParentPoint(target: any, point: Laya.Point): Laya.Point {
    if (!point) return point;
    point.x -= target._x;
    point.y -= target._y;
    var scroll: Laya.Rectangle = target._style.scrollRect;
    if (scroll) {
      point.x += scroll.x;
      point.y += scroll.y;
    }
    if (target.transform) {
      //_transform.setTranslate(0,0);
      target._transform.invertTransformPoint(point);
    }
    point.x += target.pivotX;
    point.y += target.pivotY;
    return point;
  }
}
