import Dictionary from "../../../core/utils/Dictionary";
import { PathManager } from "../../manager/PathManager";
import ResMgr from "../../../core/res/ResMgr";
import Logger from "../../../core/logger/Logger";

/**
 * 地图的元素数据管理
 * 地图渲染需要用到的图片, 加载完成后Laya.Texture保存在这里
 */
export class MapElmsLibrary {
  private sourceList: Dictionary = new Dictionary();
  private _useDict: Dictionary = new Dictionary();
  private funList: Dictionary = new Dictionary();
  public isLoaderQueue: boolean = false;
  /**
   * 取元素 如果没有则开始下载 完成后执行回调
   * @param $path
   * @param $callBack
   *
   */
  public getElementSource($path: string, $callBack: Function) {
    let url: string = PathManager.resourcePath + $path;
    if (url.indexOf("?") >= 0) {
      url = url.substring(0, url.indexOf("?"));
    }
    $path = url.toLowerCase();
    if (this.sourceList[$path] != null) {
      if ($callBack != null) $callBack(this.sourceList[$path]);
      return;
    }
    if (this.funList[$path] == null) {
      this.funList[$path] = [];
    }
    this.funList[$path].push($callBack);
    this.createLoad($path);
    $path = null;
  }
  /**
   * 从库中取元素
   * @param $path 元素的url
   * @return texture
   *
   */
  public getElementByPath($path: string): Laya.Texture {
    return this.sourceList[$path];
  }
  /**
   * 保存元素
   * @param key 元素的url
   * @param data Laya.Texture
   *
   */
  public saveElement(key: string, data: Laya.Texture) {
    this.sourceList[key] = data;
  }
  /**
   * 创建loader开始下载
   * @param $path 下载路径
   *
   */
  private createLoad($path: string) {
    Laya.loader.load(
      $path,
      Laya.Handler.create(this, (res) => {
        if (this.sourceList) {
          this.sourceList[$path] = res;
          let arr: Array<Function> = this.funList[$path];
          if (arr) {
            while (arr.length > 0) {
              var fun: Function = arr.pop();
              if (fun != null) fun(this.sourceList[$path]);
              fun = null;
            }
          }
          arr = null;
          delete this.funList[$path];
        }
      }),
    );
  }

  /**
   *切换场景时, 清去非当前load
   *
   */
  private _lockCount: number = 0;
  public lock() {
    this._lockCount++;
  }
  public unLock() {
    this._lockCount--;
    this._lockCount < 0 ? (this._lockCount = 0) : this._lockCount;
    this.switchSceneBackImp();
  }
  private isLock(): boolean {
    return this._lockCount > 0;
  }
  public switchSceneBack(scene: string) {
    delete this._useDict[scene];
    this.switchSceneBackImp();
  }
  /**
   * 切换场景时清理数据
   *
   */
  private switchSceneBackImp() {
    if (this.isLock()) {
      // Logger.info("释放资源失败有引用")
      return;
    }
    // Logger.info("释放资源", this.sourceList)
    for (let key in this.sourceList) {
      if (Object.prototype.hasOwnProperty.call(this.sourceList, key)) {
        let url: string = key;
        delete this.sourceList[url];
        Laya.loader.clearRes(url);
      }
    }
  }

  private static _instance: MapElmsLibrary;
  public static get Instance(): MapElmsLibrary {
    if (!MapElmsLibrary._instance)
      MapElmsLibrary._instance = new MapElmsLibrary();
    return MapElmsLibrary._instance;
  }
}
