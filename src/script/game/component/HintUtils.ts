/*
 * @Author: jeremy.xu
 * @Date: 2022-06-08 18:09:29
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-12-15 17:00:02
 * @Description:
 */

import LayerMgr from "../../core/layer/LayerMgr";
import Logger from "../../core/logger/Logger";
import { EmLayer } from "../../core/ui/ViewInterface";
import HintUtilsHelper from "./HintUtilsHelper";

export enum FontType {
  NONE = "None",
  BossBarNum = "BossBarNum",
  LevelNum = "LevelNum",
  MessageLabel = "MessageLabel",
}

export enum HintType {
  HintLabel = "HintLabel",
}

/**位图字体配置 */
export class HintBMFontCfg {
  distance: number = 0; //字体间距
  url: string = ""; //字体URL
  size: number = 30; //字体大小

  constructor(
    url: string = "",
    fontdistance: number = 0,
    fontSize: number = 30,
  ) {
    this.url = url;
    this.distance = fontdistance;
    this.size = fontSize;
  }
}

/**
 * 非位图字体配置
 */
export class HintFontCfg {
  color: string = "#000000";
  fontSize: number = 24;
  constructor(
    font: string = Laya.Text.defaultFont,
    color: string = "#000000",
    fontSize: number = 24,
  ) {
    this.color = color;
    this.fontSize = fontSize;
  }
}

/**
 * 提示动画数据
 */
export class HintAniData {
  type: FontType = FontType.NONE; //展示位图字体
  point: Laya.Point = null; //展示位置
  once: boolean = false; //如果是单次使用,则循环使用
  fontCfg: HintFontCfg = null; //非位图字体配置
  bmFontCfg: HintBMFontCfg = null; //位图字体配置
  delay: number = 0; //延迟展示时间
  showAction: boolean = true; //展示动画
  constructor(
    type: FontType = FontType.NONE,
    point: Laya.Point = null,
    once: boolean = false,
    fontCfg: HintFontCfg = null,
    bmfontCfg: HintBMFontCfg = null,
    delay: number = 0,
  ) {
    this.type = type;
    this.point = point;
    this.once = once;
    this.delay = delay;
    this.bmFontCfg = bmfontCfg;
    if (type == FontType.NONE || FontType.MessageLabel) {
      this.fontCfg = fontCfg ? fontCfg : new HintFontCfg();
    }
  }
}

/**提示视图配置 */
export class HintViewData {
  icon: string;
  iconEx?: string;
  iconBg?: string;
  iconBg2ConWidth?: boolean; // 背景适配到容器大小
  bGray?: boolean = true;
}

export default class HintUtils {
  protected static isInit: boolean = false;

  public static BMFontCfgMap: Map<FontType, HintBMFontCfg> = new Map();

  private static tipsMaps: Map<string, Array<fgui.GComponent>> = new Map();

  private static hintMsgs: Array<object> = [];

  private static isShowingTips: boolean = false;

  static register() {
    if (HintUtils.isInit) return;
    HintUtils.BMFontCfgMap.set(
      FontType.BossBarNum,
      new HintBMFontCfg("ui://Font/" + FontType.BossBarNum, -15),
    );
    HintUtils.BMFontCfgMap.set(
      FontType.LevelNum,
      new HintBMFontCfg("ui://Font/" + FontType.LevelNum, -5),
    );

    //初始化申明
    HintUtils.isInit = true;
  }

  /**
   * 展示数字
   * @param valueStr 数字
   * @param viewData 视图资源数据
   */
  public static showTips(
    valueStr: string = "",
    hintType: HintType = HintType.HintLabel,
    viewData: string | HintViewData = "",
    aniData?: HintAniData,
    callback?: Function,
    delay: number = 300,
  ) {
    if (!HintUtils.isInit) {
      HintUtils.register();
    }

    if (!aniData) {
      aniData = new HintAniData();
    }
    let tipsType = hintType + "_" + aniData.type;
    let wndlist = this.tipsMaps.get(tipsType);
    if (!wndlist) {
      wndlist = [];
    }
    if (!this.hintMsgs) {
      this.hintMsgs = [];
    }
    this.hintMsgs.push({
      hintType: hintType,
      valueStr: valueStr,
      viewData: viewData,
      aniData: aniData,
      callback: callback,
    });
    this.playQueneMsg(delay);
  }

  private static playQueneMsg(delay: number) {
    if (!this.isShowingTips) {
      this.isShowingTips = true;
      Laya.timer.loop(delay > 0 ? delay : 10, this, this.__delayShowTip);
    }
  }

  private static index: number = 0;
  private static async __delayShowTip() {
    // Logger.error('showMsgTip:', this.index);
    this.index++;
    let msgData: any = this.hintMsgs.shift();
    if (!msgData) {
      this.isShowingTips = false;
      Laya.timer.clearAll(this);
      return;
    }

    let msgHintType = msgData.hintType;
    let msgValueStr = msgData.valueStr;
    let msgViewData = msgData.viewData;
    let msgAniData = msgData.aniData;
    let msgcallback = msgData.callback;
    let comp = this.create(
      msgHintType,
      msgValueStr,
      msgViewData,
      msgAniData,
      msgcallback,
    );
    if (!comp) {
      Logger.warn("[HintUtils]创建失败", msgData);
      return;
    }

    let layer = LayerMgr.Instance.getLayer(EmLayer.GAME_TOP_LAYER);
    layer.pushView(comp, 999);

    if (msgAniData.showAction) {
      HintUtilsHelper.showAction(
        comp,
        msgHintType,
        msgViewData,
        msgAniData,
        msgcallback,
      );
    }
  }

  private static create(
    msgHintType: HintType,
    content: string,
    viewData: string | HintViewData = "",
    aniData: HintAniData,
    callback?: Function,
    delay: number = 30,
  ) {
    let comp: fgui.GComponent;
    let tipsType = msgHintType + "_" + aniData.type;
    let wndlist = this.tipsMaps.get(tipsType);
    if (!wndlist) {
      wndlist = [];
      this.tipsMaps.set(tipsType, wndlist);
    }

    if (aniData.once) {
      comp = wndlist[0];
      // Logger.xjy("[HintUtils]复用单个组件", msgHintType)
    } else {
      // comp = wndlist.shift();
      // Logger.xjy("[HintUtils]复用多个组件", msgHintType)
    }

    if (!comp) {
      // Logger.xjy("[HintUtils]创建组件", msgHintType)
      comp = HintUtilsHelper.create(msgHintType, aniData.type);
      wndlist.push(comp);
    }

    Laya.Tween.clearAll(comp);
    switch (msgHintType) {
      default:
        HintUtilsHelper.refreshView(
          comp,
          msgHintType,
          content,
          viewData,
          aniData,
        );
        break;
    }

    return comp;
  }

  public static clear() {
    this.tipsMaps.forEach((winds) => {
      for (const key in winds) {
        if (Object.prototype.hasOwnProperty.call(winds, key)) {
          let comp = winds[key];
          if (comp) {
            LayerMgr.Instance.removeByLayer(comp, EmLayer.GAME_TOP_LAYER);
          }
        }
      }
    });
    this.tipsMaps.clear();
    this.hintMsgs = [];
    this.isShowingTips = false;
    Laya.timer.clearAll(this);
  }
}
