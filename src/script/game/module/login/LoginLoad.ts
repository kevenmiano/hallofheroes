import Logger from "../../../core/logger/Logger";
import Utils from "../../../core/utils/Utils";

export default class LoginLoad {
  public static LOGIN_SKELETON: string = "res/game/login/skeleton";
  private static skeletons: Map<string, Laya.Skeleton> = new Map();

  /**
   * 加载登陆动画
   * @param target 显示目标容器
   * @param scale 缩放比例
   * @param point 显示位置
   */
  public static onLoadSpine(
    target: any,
    skeletonURL: string,
    scale: number = 0.2,
    point: Laya.Point = new Laya.Point(10, 730),
  ) {
    //创建一个Skeleton对象
    var skeleton = null;
    if (!this.skeletons.has(skeletonURL)) {
      skeleton = new Laya.Skeleton();
      //通过加载直接创建动画
      if (Utils.useAstc) {
        skeletonURL = skeletonURL + "_ktx.sk";
      } else {
        skeletonURL = skeletonURL + "_png.sk";
      }
      skeleton.load(
        skeletonURL,
        Laya.Handler.create(this, () => {
          skeleton.scale(scale, scale);
          skeleton.pos(point.x, point.y);
        }),
      );
    } else {
      skeleton = this.skeletons.get(skeletonURL);
    }
    //添加到舞台
    target.addChild(skeleton);
  }

  /**
   * 销毁spine
   */
  public static destorySpine(skeletonURL?: string) {
    if (this.skeletons.size > 0) {
      this.skeletons.forEach((skeleton: Laya.Skeleton, key: string) => {
        if (!skeletonURL || skeletonURL == key) {
          try {
            if (skeleton.parent) {
              skeleton.removeSelf();
            }
            skeleton && skeleton.templet && skeleton.destroy();
          } catch (error) {
            Logger.error("destorySpine:", error);
          }
        }
      });
      if (!skeletonURL) {
        this.skeletons.clear();
      }
    }
  }
}
