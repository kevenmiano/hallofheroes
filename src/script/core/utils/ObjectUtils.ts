/* eslint-disable quotes */
import {
  DisplayObjectContainer,
  DisplayObject,
} from "../../game/component/DisplayObject";
import { MovieClip } from "../../game/component/MovieClip";
import ByteArray from "../net/ByteArray";
import Dictionary from "./Dictionary";
import Sprite = Laya.Sprite;
import Node = Laya.Node;

/**
 * @author:pzlricky
 * @data: 2020-11-24 20:38
 * @description ***
 */
export default class ObjectUtils {
  private static _copyAbleTypes: Array<string>;
  private static _descriptOjbXMLs: Dictionary;

  /**
   *
   * @param obj 用于复制的源对象
   * @return obj 的副本
   *
   */
  public static cloneSimpleObject(obj: object): object {
    var temp: ByteArray = new ByteArray();
    temp.writeObject(obj);
    temp.position = 0;
    return temp.readObject();
  }

  private static copyDateType(properties: object): Date {
    if (!properties) return null;
    var d: Date = new Date(
      properties["fullYear"],
      properties["month"],
      properties["date"],
      properties["hours"],
      properties["minutes"],
      properties["seconds"],
    );
    return d;
  }
  /**
   *
   * 对所有在container容器的对象执行dispose操作
   * @param container 存放需要dispose对象的容器
   *
   */
  public static disposeAllChildren(
    container: DisplayObjectContainer | fgui.GComponent | DisplayObject,
  ) {
    if (container == null) return;
    while (
      ((container instanceof fgui.GComponent && !container.isDisposed) ||
        (container instanceof Laya.Sprite && !container.destroyed)) &&
      container.numChildren > 0
    ) {
      let child = container.getChildAt(0);
      container.removeChildAt(0);
      ObjectUtils.disposeObject(child);
    }
  }
  /**
   * 对container及其所有子对象的MovieClip执行stop();
   * @param container: the container to stop
   *
   */
  public static stopAllSubClips(container: DisplayObjectContainer) {
    if (container == null) return;
    if (container instanceof MovieClip) {
      (container as MovieClip).stop();
    }
    for (var i: number = 0; i < container.numChildren; i++) {
      var movie: DisplayObjectContainer = container.getChildAt(
        i,
      ) as DisplayObjectContainer;
      if (movie != null) {
        ObjectUtils.stopAllSubClips(movie);
      }
      var moveClip: any = movie;
      if (moveClip != null) {
        moveClip.stop();
      }
    }
  }
  /**
   *
   * 清除container下的所有显示对象
   * @param container 被清除子对象的容器
   *
   */
  public static removeChildAllChildren(container: DisplayObjectContainer) {
    while (container.numChildren > 0) {
      var obj: DisplayObject = container.removeChildAt(0);
      ObjectUtils.disposeObject(obj);
    }
  }

  public static removeChildAllChildrenFromStage(
    container: DisplayObjectContainer,
  ) {
    if (!container) return;
    while (container.numChildren > 0) {
      container.removeChildAt(0);
    }
  }

  public static disposeAllGrandson(container: DisplayObjectContainer) {
    if (container) {
      while (container.numChildren > 0) {
        var odc: DisplayObject = container.removeChildAt(0);
        if (odc as DisplayObjectContainer) {
          ObjectUtils.disposeAllChildren(odc as DisplayObjectContainer);
        } else {
          ObjectUtils.disposeObject(odc);
        }
        odc = null;
      }
      ObjectUtils.disposeAllChildren(container);
    }
  }
  /**
   * 循环清除, 所有子级, 孙子级。。。
   * @param container
   *
   */
  public static disposeViolentMc(container: any) {
    if (container) {
      if (container.parent) container.parent.removeChild(container);
      if (container instanceof MovieClip) (container as MovieClip).stop();
      var count: number = container.numChildren - 1;
      for (var i: number = count; i >= 0; i--) {
        var doc: DisplayObject = container.removeChildAt(i);
        if (!doc) continue;
        if (doc.parent) doc.parent.removeChild(doc);
        if (doc as MovieClip) (doc as MovieClip).stop();
        if (doc as DisplayObjectContainer) {
          ObjectUtils.disposeViolentMc(doc as DisplayObjectContainer);
        } else {
          ObjectUtils.disposeObject(doc);
          doc = null;
        }
      }
      ObjectUtils.disposeObject(container);
    }
  }

  /**
   * 清除对象的引用以便垃圾回收
   * @param target : 目标对象
   *
   * 支持几种对象 :
   * Disposeable 只执行dispose方法。
   * Bitmap 会把bitmapData dispose 然后removeChild
   * BitmapData 会调用dispose
   * DisplayObject 会removeChild
   */
  public static disposeObject(target: {
    dispose?: Function;
    removeSelf?: Function;
    destroy?: Function;
    parent?: any;
    isDisposed?: boolean;
    displayObject?: any;
    stop?: Function;
  }) {
    if (!target) return;
    //去掉try catch,尽早暴露错误。错误统一到CatchError
    try {
      let __proto__ = (value) => {
        if (value["__proto__"]) {
          let parentType = value["__proto__"];
          if (parentType instanceof Sprite || parentType instanceof Node) {
            if (target["dispose"]) {
              target.dispose();
            }
            (target as Laya.Sprite).destroy(true);
          } else if (parentType instanceof Laya.Bitmap) {
            (target as Laya.Bitmap).destroy();
          } else if (
            parentType instanceof fgui.GComponent ||
            parentType instanceof fgui.GObject
          ) {
            if (!target["isDisposed"]) {
              target.displayObject.removeSelf();

              target.dispose();
            }
          } else if (parentType instanceof MovieClip) {
            (target as MovieClip).stop();
            if (target["dispose"]) {
              target.dispose();
            }
            (target as MovieClip).destroy(true);
          } else {
            if (target["dispose"]) {
              target.dispose();
            }
          }
        }
      };
      __proto__(target);
      target = null;
    } catch {
      target = null;
    }

    // if (target['dispose']) {
    //     if (target instanceof DisplayObject || target instanceof Laya.Sprite) {
    //         target.removeSelf();
    //     }

    //     if (target instanceof BaseWindow) {
    //         target.hide();
    //     } else {
    //
    //         target.dispose();
    //     }
    // } else if (target instanceof Laya.Bitmap) {
    //     var targetBitmapData = target;
    //     targetBitmapData.destroy();
    // } else if (target["dispose"]) {
    //     if (target instanceof DisplayObject) {
    //         var targetDisplay2: DisplayObject = target as DisplayObject;
    //         if (targetDisplay2.parent) targetDisplay2.parent.removeChild(targetDisplay2);
    //     }
    //     target["dispose"]();
    // } else if (target instanceof MovieClip) {
    //     var mc: MovieClip = target;
    //     mc.stop();
    //     if (mc.parent) mc.parent.removeChild(mc);
    // }
    // else if (target instanceof DisplayObject) {
    //     var targetDisplay1: DisplayObject = target;
    //     if (targetDisplay1.parent) targetDisplay1.parent.removeChild(targetDisplay1);
    // }
    // else if (target instanceof Sprite) {
    //     let targetDisplay1: Sprite = target as Sprite;
    //     targetDisplay1.removeSelf();
    // }
  }

  public static disposeObjectv1(target: object) {
    if (target == null) {
      return;
    }

    if (target instanceof DisplayObject) {
      let targetDisplay: DisplayObject = target as DisplayObject;
      targetDisplay.removeSelf();
      if (target.hasOwnProperty("dispose")) {
        target["dispose"]();
      }
    } else if (target instanceof Laya.Bitmap) {
      let targetBitmapData = target as Laya.Bitmap;
      targetBitmapData.destroy();
    } else if (target instanceof MovieClip) {
      let mc: MovieClip = target as MovieClip;
      mc.stop();
      mc.removeSelf();
      if (target.hasOwnProperty("dispose")) {
        target["dispose"]();
      }
    } else if (target instanceof ByteArray) {
      let data: ByteArray = target as ByteArray;
      data.clear();
    }
  }

  public static clearDictionary(dict: Dictionary): Dictionary {
    for (let key in dict) {
      delete dict[key];
    }
    return dict;
  }

  private static getCopyAbleType(): Array<string> {
    if (ObjectUtils._copyAbleTypes == null) {
      ObjectUtils._copyAbleTypes = [];
      ObjectUtils._copyAbleTypes.push("number");
      ObjectUtils._copyAbleTypes.push("uint");
      ObjectUtils._copyAbleTypes.push("string");
      ObjectUtils._copyAbleTypes.push("boolean");
      ObjectUtils._copyAbleTypes.push("Number");
      ObjectUtils._copyAbleTypes.push("Date");
    }
    return ObjectUtils._copyAbleTypes;
  }

  private static encodingProperty(name: string, value: object): string {
    if (value instanceof Array) {
      return "";
    } else {
      return ObjectUtils.escapeString(name) + '="' + value.toString() + '" ';
    }
  }

  /**
   * Escapes a string accoding to the JSON specification.
   *
   * @param str The string to be escaped
   * @return The string with escaped special characters
   * 		according to the JSON specification
   */
  private static escapeString(str: string): string {
    // create a string to store the string's jsonstring value
    var s: string = "";
    // current character in the string we're processing
    var ch: string;
    // store the length in a local variable to reduce lookups
    var len = str.length;

    // loop over all of the characters in the string
    for (var i: number = 0; i < len; i++) {
      // examine the character to determine if we have to escape it
      ch = str.charAt(i);
      switch (ch) {
        case '"':
          // quotation mark
          s += '\\"';
          break;

        case "/": // solidus
          s += "\\/";
          break;

        case "\\":
          // reverse solidus
          s += "\\\\";
          break;

        case "\b":
          // bell
          s += "\\b";
          break;

        case "\f":
          // form feed
          s += "\\f";
          break;

        case "\n":
          // newline
          s += "\\n";
          break;

        case "\r":
          // carriage return
          s += "\\r";
          break;

        case "\t":
          // horizontal tab
          s += "\\t";
          break;

        default:
          // everything else

          // check for a control character and escape as unicode
          if (ch < " ") {
            // get the hex digit(s) of the character (either 1 or 2 digits)
            var hexCode: string = ch.charCodeAt(0).toString(16);

            // ensure that there are 4 digits by adjusting
            // the # of zeros accordingly.
            var zeroPad: string = hexCode.length == 2 ? "00" : "000";

            // create the unicode escape sequence with 4 hex digits
            s += "\\u" + zeroPad + hexCode;
          } else {
            // no need to do any special encoding, just pass-through
            s += ch;
          }
      }
    }

    return s;
  }

  /**
   * 批量更改显示对象的visibility
   * @param value 布尔值, 是否要显示对象
   * @param args 显示对象集合
   *
   */
  public static modifyVisibility(
    value: boolean,
    ...args: Array<DisplayObject>
  ) {
    for (var i: number = 0; i < args.length; i++) {
      (args[i] as DisplayObject).visible = value;
      (args[i] as DisplayObject).active = value;
    }
  }

  /**
   * 对显示对象的显示区域赋值
   * @param source 显示对象
   * @param rt 区域
   *
   */
  public static copyPropertyByRectangle(
    source: Laya.Sprite,
    rt: Laya.Rectangle,
  ) {
    source.x = rt.x;
    source.y = rt.y;
    if (rt.width != 0) source.width = rt.width;
    if (rt.height != 0) source.height = rt.height;
  }

  /**
   * 需注意, date属性值不会拷贝, 会重构成Object对象
   * @param source
   * @param target
   * @returns
   */
  public static copyProperties(source: object, target?: any): any {
    if (
      source == null ||
      (typeof source === "object" && Object.keys(source).length === 0)
    ) {
      return source;
    }

    let newObject = target;
    let isArray = false;
    if ((source as any).length) {
      if (!target) {
        newObject = [];
      }
      isArray = true;
    } else {
      if (!target) {
        newObject = {};
      }
      isArray = false;
    }

    for (let key of Object.keys(source)) {
      if (null == source[key]) {
        newObject[key] = source[key];
      } else {
        let sub;
        if (source[key] instanceof Date) {
          //日期特殊处理
          sub = source[key];
        } else {
          sub =
            typeof source[key] == "object"
              ? ObjectUtils.copyProperties(source[key])
              : source[key];
        }
        if (isArray) {
          newObject.push(sub);
        } else {
          newObject[key] = sub;
        }
      }
    }
    return newObject;
  }

  /**
   *
   * @param dest 接受赋值的目标对象
   * @param orig 赋值的原始对象
   * @param descriXML 该源对象的描述XML
   */
  public static copyPropertiesTo(
    target: object,
    source: object,
    useOrigDescript: boolean = false,
  ): any {
    if (ObjectUtils._descriptOjbXMLs == null)
      ObjectUtils._descriptOjbXMLs = new Dictionary();
    var copyAbleTypes: Array<string> = ObjectUtils.getCopyAbleType();
    let copyTarget = null;
    if (useOrigDescript) {
      copyTarget = source;
    } else {
      copyTarget = target;
    }
    for (let key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        let value = source[key];
        let valueType = (typeof value).toString();
        if (copyAbleTypes.indexOf(valueType) != -1) {
          var propertyName: string = valueType;
          if (valueType == "Date") {
            target[propertyName] = ObjectUtils.copyDateType(
              source[propertyName],
            );
            continue;
          }
          if (target.hasOwnProperty(propertyName)) {
            target[propertyName] = source[propertyName];
          }
        }
      }
    }
  }

  public static isEmptyObj(obj) {
    if (!obj) return true;
    let arr = Object.keys(obj);
    return arr.length == 0;
  }

  public static getObjLength(obj) {
    if (ObjectUtils.isEmptyObj(obj)) {
      return 0;
    }

    let arr = Object.keys(obj);
    return arr.length;
  }

  static getObjectsUnderPoint(sprite, x, y, rst = null, filterFun = null) {
    rst = rst ? rst : [];
    if (filterFun != null && !filterFun(sprite)) return rst;
    if (sprite.getBounds().contains(x, y)) {
      rst.push(sprite);
      var tempP = new Laya.Point();
      tempP.setTo(x, y);
      tempP = sprite.fromParentPoint(tempP);
      x = tempP.x;
      y = tempP.y;
      for (var i = sprite._children.length - 1; i > -1; i--) {
        var child = sprite._children[i];
        if (child instanceof Laya.Sprite)
          this.getObjectsUnderPoint(child, x, y, rst, filterFun);
      }
    }
    return rst;
  }
}
