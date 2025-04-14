/*
 * @Author: jeremy.xu
 * @Date: 2021-06-04 11:17:59
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2021-06-04 14:25:19
 * @Description: 动画工具类
 */

import ResMgr from "../../core/res/ResMgr";
import { PathManager } from "./PathManager";
import Logger from "../../core/logger/Logger";
import StringHelper from "../../core/utils/StringHelper";
import { AnimationManager } from "./AnimationManager";

// TODO by jeremy.xu 与 GameLoadNeedData合并 抽出接口
export class AnimationBaseData {
  constructor(
    effectName?: string,
    cacheName?: string,
    fullUrl?: string,
    prefix?: string,
  ) {
    this._effectName = effectName;
    this._cacheName = cacheName;
    this._fullUrl = fullUrl;
    this._prefix = prefix;
  }
  /**
   * 原始文件的文件名 配置表里面配置此名称
   */
  private _effectName: string = "";
  get effectName(): string {
    return this._effectName;
  }
  set effectName(value: string) {
    this._effectName = value;
  }
  /**
   * 前缀路径 对应josn的prefix
   */
  private _prefix: string = "";
  get prefix(): string {
    return this._prefix;
  }
  set prefix(value: string) {
    this._prefix = value;
  }
  /**
   * 全路径 加载用
   */
  private _fullUrl: string = "";
  get fullUrl(): string {
    return this._fullUrl;
  }
  set fullUrl(value: string) {
    this._fullUrl = value;
  }
  /**
   * 缓存名称 播动画用  有的一个文件里面多个动画需要(prefix + effectName)组合成动画缓存名称
   */
  private _cacheName: string = "";
  getCacheName(effectName: string): string {
    return this._cacheName;
  }
  setCacheName(value: string) {
    this._cacheName = value;
  }
  //
  get cacheName(): string {
    return this._cacheName;
  }
  set cacheName(value: string) {
    this._cacheName = value;
  }

  /**
   * 释放动画缓存
   * @param releaseTexure 释放动画纹理资源
   */
  public dispose(releaseTexure: boolean = true) {
    AnimationManager.Instance.clearAnimationByName(this.cacheName);
    if (releaseTexure) {
      ResMgr.Instance.releaseRes(this.fullUrl);
    }
  }

  /**
   * 定位点脚下 一般用作锚点
   */
  posLeg: Laya.Point = new Laya.Point();
  /**
   * 定位点身体
   */
  posBody: Laya.Point = new Laya.Point();
  /**
   * 定位点头部
   */
  posHead: Laya.Point = new Laya.Point();
}

/**
 * 动画名字枚举
 */
export class AnimationEffectName {
  public static BUFF_ACTION_CURE = "buff.action.cure.01"; // 治疗
}

export class AnimationHelper {
  private static ins: AnimationHelper;
  static get Instance(): AnimationHelper {
    if (!AnimationHelper.ins) {
      AnimationHelper.ins = new AnimationHelper();
    }
    return AnimationHelper.ins;
  }

  public static Skill_Effect = "skilleffect/";

  /**
   * 获得技能动画数据
   * @param effectName
   * @param transition
   * @param toLowerCase
   * @returns
   */
  public static getSkillEffectAniData(
    effectName: string,
    transition: boolean = true,
    toLowerCase: boolean = true,
  ): AnimationBaseData {
    let aniData = new AnimationBaseData(effectName); // TODO 对象池

    aniData.fullUrl = PathManager.solveSkillResPath(
      effectName,
      transition,
      toLowerCase,
    );
    let prefix = StringHelper.replaceStr(effectName, ".", "_") + "/";
    prefix = AnimationHelper.Skill_Effect + prefix.toLocaleLowerCase();
    aniData.prefix = prefix;
    aniData.cacheName = prefix;

    let resJson = ResMgr.Instance.getRes(aniData.fullUrl);
    if (resJson) {
      // if(resJson.meta.prefix){
      //     aniData.prefix = resJson.meta.prefix
      // }
      if (resJson.offset && resJson.offset.footX && resJson.offset.footY) {
        aniData.posLeg.x = resJson.offset.footX;
        aniData.posLeg.y = resJson.offset.footY;
      }
    } else {
      Logger.warn(
        "[AnimationHelper]getSkillEffectAniData资源未加载 部分数据获取失败",
      );
    }

    return aniData;
  }

  /**
   * 看是否有动画数据缓存 没有缓存一下
   * @param aniData
   * @returns
   */
  public static getAniCache(aniData: AnimationBaseData): boolean {
    let prefix = aniData.prefix;
    let cacheJson = AnimationManager.Instance.getCache(prefix);
    let success = false;
    if (!cacheJson) {
      success = AnimationManager.Instance.createAnimation(
        prefix,
        "",
        0,
        "",
        AnimationManager.BattleEffectFormatLen,
      );
    } else {
      success = true;
    }
    return success;
  }

  /**
   * 清理动画数据
   * @param aniData
   * @param releaseTexure 是否清理动画纹理资源
   */
  public static clearAniCache(
    aniData: AnimationBaseData,
    releaseTexure: boolean = true,
  ) {
    aniData.dispose(releaseTexure);
  }
}
