import Logger from "../../core/logger/Logger";
import ResMgr from "../../core/res/ResMgr";
import Utils from "../../core/utils/Utils";

/**
 * @author:jeremy.xu
 * @data: 2020-11-18 10:52
 * @description 动画管理  资源要先被加载才能使用
 */
export class AnimationManager {
  static BattleFormatLen: number = 3;
  static BattleEffectFormatLen: number = 4;
  static MapPhysicsFormatLen: number = 4;
  static MaxFrame: number = 1000;
  static MaxEmptyFrame: number = 5; //读取时候最多允许空多少帧 超出则读取结束

  private static ins: AnimationManager;
  static get Instance(): AnimationManager {
    if (!AnimationManager.ins) {
      AnimationManager.ins = new AnimationManager();
    }
    return AnimationManager.ins;
  }

  /**
   * 创建动画 小图路径拼接
   * @param preUrl
   * @param aniName
   * @param startIdx
   * @param sepSymbol
   * @param formatLen
   */
  createAnimation(
    preUrl: string,
    aniName: string,
    startIdx: number = 1,
    sepSymbol: string = "_",
    formatLen = 0,
  ): boolean {
    let path = preUrl + aniName;

    if (AnimationManager.Instance.getCache(path)) {
      // Logger.xjy("[AnimationManager]动画已存在")
      return true;
    }

    let arr = [];
    let count = 0;
    for (let index = startIdx; index < AnimationManager.MaxFrame; index++) {
      let fPath = `${path}${sepSymbol}${Utils.numFormat(index, formatLen)}.png`;
      // Logger.xjy("[AnimationManager]createAnimation fPath", fPath, ResMgr.Instance.getRes(fPath))
      if (ResMgr.Instance.getRes(fPath)) {
        count = 0;
        arr.push(fPath);
      } else {
        if (++count > AnimationManager.MaxEmptyFrame) {
          // Logger.xjy("[AnimationManager] 空帧太多后面的不做处理", count)
          break;
        }
      }
    }

    if (arr.length > 0) {
      let cachName = path;
      // Logger.xjy("[AnimationManager]createAnimation success:", aniName, arr, cachName);
      Laya.Animation.createFrames(arr, cachName);
      return true;
    }
    return false;
  }

  /**
   * 副本, 天空之城角色动画
   * @param preUrl
   * @param pkgName
   * @param actionName
   * @param frameY
   * @param startIdx
   * @param formatLen
   */
  createAnimationAvater(
    preUrl: string,
    pkgName: string = "",
    actionName: string,
    frameY: number = 0,
    startIdx: number = 0,
    formatLen = 0,
  ): boolean {
    let path = preUrl + pkgName;
    let arr = [];
    let count = 0;
    for (let index = startIdx; index < AnimationManager.MaxFrame; index++) {
      let fPath = `${path}${actionName}_${Utils.numFormat(index, formatLen)}_${frameY}.png`;
      if (ResMgr.Instance.getRes(fPath)) {
        count = 0;
        arr.push(fPath);
      } else {
        if (++count > AnimationManager.MaxEmptyFrame) {
          // Logger.warn("[AnimationManager] 空帧太多后面的不做处理", count)
          break;
        }
      }
    }

    if (arr.length > 0) {
      let cachName = preUrl + pkgName + actionName + frameY;
      Logger.log(
        "[AnimationManager]createAnimationAvater success:",
        arr,
        cachName,
      );
      Laya.Animation.createFrames(arr, cachName);
      return true;
    }
    return false;
  }

  /**
   * 创建动画 一张合图中指定行列
   * @param url
   * @param cacheName
   * @param frameX
   * @param frameY
   * @param itemWidth
   * @param itemHeight
   */
  createAnimationWithTexture(
    url: string,
    cacheName: string,
    frameX: number = 8,
    frameY: number = 1,
    itemWidth: number = 0,
    itemHeight: number = 0,
  ): boolean {
    let curFrameX = 0;
    let curFrameY = 0;

    let size = frameX * frameY;
    let graphics: Laya.Graphics[] = [];

    let texture = ResMgr.Instance.getRes(url);
    if (texture) {
      for (let index = 0; index < size; index++) {
        if (curFrameX >= frameX) {
          curFrameX = 0;
          curFrameY++;
        }
        if (curFrameY >= frameY) {
          curFrameY = 0;
        }
        let offsetX = curFrameX * itemWidth;
        let offsetY = curFrameY * itemHeight;
        let g = new Laya.Graphics();
        g.fillTexture(
          texture,
          0,
          0,
          itemWidth,
          itemHeight,
          undefined,
          new Laya.Point(-offsetX, -offsetY),
        );
        graphics.push(g);

        Logger.log(
          "[AnimationManager] offsetX=" +
            offsetX +
            ", offsetY=" +
            offsetY +
            ", itemWidth=" +
            itemWidth +
            ", itemHeight=" +
            itemHeight +
            ", curFrameX=" +
            curFrameX,
        );

        curFrameX++;
      }
    }

    if (graphics.length > 0) {
      Laya.Animation.framesMap[cacheName] = graphics;
      return true;
    } else {
      Logger.log("[AnimationManager] texture is null!", url);
      return false;
    }
  }

  clearAnimation(preUrl: string, aniName: string) {
    let cachName = preUrl + aniName;
    Laya.Animation.clearCache(cachName);
  }

  clearAnimationByName(cachName: string) {
    Laya.Animation.clearCache(cachName);
  }

  getCache(cachName: string) {
    return Laya.Animation.framesMap[cachName];
  }
}

// 使用示例:
// ResMgr.Instance.loadRes("res/animation/equip/hunter_default_hair/0/0.json", (res)=>{
//     Logger.log("test", res)
//     let roleAni = new Laya.Animation();
//     Laya.stage.addChild(roleAni);
//     roleAni.pos(500,500)
//     roleAni.zOrder = 100

//     let preUrl = "equip/hunter_default_hair/0/"
//     let aniName = "level1_"+ ActionLabesType.STAND
//     AnimationManager.Instance.createAnimation(preUrl, aniName, undefined, undefined, AnimationManager.BattleFormatLen)
//     roleAni.play(0, true, preUrl+aniName);
//     Logger.log(Laya.Animation.framesMap)
// }, null, Laya.Loader.ATLAS)
