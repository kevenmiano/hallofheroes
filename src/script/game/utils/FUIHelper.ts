/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-04-21 11:16:16
 * @LastEditTime: 2023-07-19 14:38:54
 * @LastEditors: jeremy.xu
 * @Description: fgui工具类 封装一些常用接口
 */

import Logger from "../../core/logger/Logger";
import ResMgr from "../../core/res/ResMgr";
import CommonTipItem from "../component/item/CommonTipItem";
import { EmPackName, EmWindow } from "../constant/UIDefine";
import { TipsShowType } from "../tips/ITipedDisplay";
import ComponentSetting from "./ComponentSetting";

export default class FUIHelper {
  /**获取Fgui包中图片资源 */
  public static getItemAsset(pkgName: string, resName: string): any {
    let url = fgui.UIPackage.getItemURL(pkgName, resName);
    return fgui.UIPackage.getItemAssetByURL(url);
  }

  /**FUI创建实例对象 */
  public static createFUIInstance(pkgName: string, objectName: string): any {
    return <fgui.GObject>fgui.UIPackage.createObject(pkgName, objectName);
  }

  /**获取Fgui包中图片资源url */
  public static getItemURL(packageName: string, resName: string) {
    return fgui.UIPackage.getItemURL(packageName, resName);
  }

  /**通过URL创建实例对象 */
  public static createFUIByURL(url: string, userClass?: any): any {
    return fgui.UIPackage.createObjectFromURL(url, userClass);
  }

  public static getFUIPackPathByName(packName: EmPackName | EmPackName[]) {
    let resKeyArr = [];
    if (Array.isArray(packName)) {
      for (let i = 0; i < packName.length; i++) {
        resKeyArr.push(ComponentSetting.UI_PREFIX + packName[i]);
      }
    } else {
      resKeyArr.push(ComponentSetting.UI_PREFIX + packName);
    }

    return resKeyArr;
  }

  public static getOneFUIPackPathByName(packName: EmPackName) {
    return ComponentSetting.UI_PREFIX + packName;
  }

  public static getFUIPackResCountByResKey(resKey: string | string[]): number {
    let count = 0;
    if (Array.isArray(resKey)) {
      for (let i = 0; i < resKey.length; i++) {
        count += this.getOneFUIPackResCountByResKey(resKey[i]);
      }
    } else {
      count = this.getOneFUIPackResCountByResKey(resKey);
    }
    return count;
  }

  public static getOneFUIPackResCountByResKey(resKey: string): number {
    let count = 0;
    let pkg = fgui.UIPackage.getById(resKey);
    if (!pkg) {
      Logger.warn(resKey + ".fui 获取失败");
      return count;
    }
    // @ts-ignore
    let cnt: number = pkg._items.length;
    for (let j: number = 0; j < cnt; j++) {
      // @ts-ignore
      let pi: fgui.PackageItem = pkg._items[j];
      if (
        pi.type == fgui.PackageItemType.Atlas ||
        pi.type == fgui.PackageItemType.Sound
      ) {
        count++;
      }
    }
    return count;
  }

  /**
   * 自动缩放文字, 设置锚点在中心, 设置自动大小为: 宽度高度
   * @param gText
   * @param str
   */
  public static textAutoSize(textField: fgui.GTextField, maxLen: number) {
    let scale = maxLen / textField.textWidth;
    if (scale < 1) {
      textField.scaleX = textField.scaleY = scale;
    }
  }

  public static createGLoader(url?: string) {
    let tmp = new fgui.GLoader();
    if (url) {
      tmp.url = url;
    }
    return tmp;
  }

  public static createGLabel(text?: string) {
    let tmp = new fgui.GLabel();
    if (text) {
      tmp.text = text;
    }
    return tmp;
  }

  public static createGButton(icon: string, selIcon?: string) {
    let tmp = new fgui.GButton();
    if (icon) {
      tmp.icon = icon;
      tmp.selectedIcon = selIcon ? selIcon : icon;
    }
    return tmp;
  }

  /**
   * 给FGUI组件加提示
   */
  static setTipData(
    target: fgui.GComponent,
    tipType: EmWindow,
    tipData: any,
    startPoint: Laya.Point = new Laya.Point(0, 0),
    showType: TipsShowType = TipsShowType.onClick,
    extData?: any,
    tipDirctions?: string
  ) {
    let tipItem = target.getChild("CommonTipItem") as CommonTipItem;
    //取消提示
    if (tipData == null || tipData == undefined) {
      tipItem && tipItem.removeFromParent();
      return;
    }
    if (!tipItem) {
      tipItem = FUIHelper.createFUIInstance(EmPackName.Base, "CommonTipItem");
      tipItem.name = "CommonTipItem";
      tipItem.width = target.width;
      tipItem.height = target.height;
      target.addChild(tipItem);
      tipItem.setXY(0, 0);
    }
    tipItem.tipType = tipType;
    tipItem.showType = showType;
    tipItem.startPoint = startPoint;
    tipItem.info = tipData;
    tipItem.extData = extData;
    tipItem.tipDirctions = tipDirctions;
  }

  /**
   * 给FGUI组件加提示
   */
  static setTipData1(
    target: fgui.GComponent,
    tipType: EmWindow,
    tipData: any,
    startPoint: Laya.Point = new Laya.Point(0, 0),
    showType: TipsShowType = TipsShowType.onClick,
    extData: any = null,
    w: number = 0,
    h: number = 0
  ) {
    let tipItem = target.getChild("CommonTipItem") as CommonTipItem;
    if (!tipItem) {
      tipItem = FUIHelper.createFUIInstance(EmPackName.Base, "CommonTipItem");
      tipItem.name = "CommonTipItem";
      if (w > 0) {
        tipItem.width = w;
      } else {
        tipItem.width = target.width;
      }
      if (h > 0) {
        tipItem.height = h;
      } else {
        tipItem.height = target.height;
      }
      target.addChild(tipItem);
      tipItem.setXY(0, 0);
    }
    tipItem.tipType = tipType;
    tipItem.showType = showType;
    tipItem.startPoint = startPoint;
    tipItem.info = tipData;
    tipItem.extData = extData;
  }
}
