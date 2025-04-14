import GameConfig from "../../../GameConfig";
import Logger from "../logger/Logger";

export default class ObjectTranslator {
  public static clsName = "ObjectTranslator";

  /**
   * @private
   */
  private static getDefinitionByNameCache = {};
  public static toInstance(object: object, clazz: any): any {
    return new clazz(object);
  }

  /**
   * @deprecated
   * @param cls 类
   */
  public static getClassName(cls: any): string {
    return cls.constructor.toString().match(/\w+/g)[1]; //获取脚本名称
  }

  /**
   * 返回对象的完全限定类名。
   * @param value 需要完全限定类名称的对象, 可以将任何 JavaScript 值传递给此方法, 包括所有可用的 JavaScript 类型、对象实例、原始类型
   * （如number)和类对象
   * @returns 包含完全限定类名称的字符串。
   * @example
   * <pre>
   *  getQualifiedClassName(DisplayObject) //返回 "DisplayObject"
   * </pre>
   * @version 2.4
   * @platform Web,Native
   * @includeExample utils/getQualifiedClassName.ts
   * @language zh_CN
   */
  public static getQualifiedClassName(value: any): string {
    let type = typeof value;
    if (!value || (type != "object" && !value.prototype)) {
      return type;
    }
    let prototype: any = value.prototype
      ? value.prototype
      : Object.getPrototypeOf(value);
    if (prototype.hasOwnProperty("__class__")) {
      return prototype["__class__"];
    }
    let constructorString: string = prototype.constructor.toString().trim();
    let index: number = constructorString.indexOf("(");
    let className: string = constructorString.substring(9, index);
    Object.defineProperty(prototype, "__class__", {
      value: className,
      enumerable: false,
      writable: true,
    });
    return className;
  }

  /**
   * 为一个类定义注册运行时类信息,用此方法往类定义上注册它自身以及所有接口对应的字符串。
   * 在运行时, 这个类的实例将可以使用 is() 方法传入一个字符串来判断实例类型。
   * 注意: 若您使用 TypeScript 命令行会自动帮您生成类信息注册代码行到最终的 Javascript 文件中。因此您不需要手动调用此方法。
   *
   * @param classDefinition 要注册的类定义。
   * @param className 要注册的类名。
   * @param interfaceNames 要注册的类所实现的接口名列表。
   * @version 2.4
   * @platform Web,Native
   * @language zh_CN
   */
  public static registerClass(
    classDefinition: any,
    className: string,
    interfaceNames?: string[],
  ) {
    if (GameConfig.debug) {
      if (!classDefinition) {
        Logger.error(1003, "classDefinition");
      }
      if (!classDefinition.prototype) {
        Logger.error(1012, "classDefinition");
      }
      if (className === void 0) {
        Logger.error(1003, "className");
      }
    }
    let prototype: any = classDefinition.prototype;
    Object.defineProperty(prototype, "__class__", {
      value: className,
      enumerable: false,
      writable: true,
    });
    let types = [className];
    if (interfaceNames) {
      types = types.concat(interfaceNames);
    }
    let superTypes = prototype.__types__;
    if (prototype.__types__) {
      let length = superTypes.length;
      for (let i = 0; i < length; i++) {
        let name = superTypes[i];
        if (types.indexOf(name) == -1) {
          types.push(name);
        }
      }
    }
    Object.defineProperty(prototype, "__types__", {
      value: types,
      enumerable: false,
      writable: true,
    });
  }

  /**
   * 返回 name 参数指定的类的类对象引用。
   * @param name 类的名称。
   * @version Egret 2.4
   * @platform Web,Native
   * @includeExample egret/utils/getDefinitionByName.ts
   * @language zh_CN
   */
  public static getDefinitionByName(name: string): any {
    if (!name) return null;
    let definition = this.getDefinitionByNameCache[name];
    if (definition) {
      return definition;
    }
    let paths = name.split(".");
    let length = paths.length;
    definition = window;

    for (let i = 0; i < length; i++) {
      let path = paths[i];
      definition = definition[path];
      if (!definition) {
        return null;
      }
    }
    this.getDefinitionByNameCache[name] = definition;
    return definition;
  }
}
