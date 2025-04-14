import {
  EmPackName,
  EmWindow,
  UICFG,
  UI_PACKAGE,
} from "../../game/constant/UIDefine";
import { MessageTipManager } from "../../game/manager/MessageTipManager";
import ComponentSetting from "../../game/utils/ComponentSetting";
import FUIHelper from "../../game/utils/FUIHelper";
// import IManager from '../Interface/IManager';
import LangManager from "../lang/LangManager";
import Logger from "../logger/Logger";
import Utils from "../utils/Utils";
import UnExistRes from "./UnExistRes";

export default class ResMgr {
  public static MaxPriority: number = 4;

  private static instance: ResMgr;
  public static get Instance(): ResMgr {
    return this.instance ? this.instance : (this.instance = new ResMgr());
  }

  preSetup(t?: any) {}

  setup(t?: any) {
    Laya.loader.maxLoader = 10;
    // 无加载失败重试
    Laya.loader.retryNum = 3; //加载出错后的重试次数
    this.startIntervalClear();
  }

  public loadRes(
    url: string,
    complete: Function = null,
    progress: Function = null,
    type?: string,
    priority?: number,
    cache?: boolean,
    group?: string | null,
    ignoreCache?: boolean,
    useWorkerLoader?: boolean,
    args?: any,
  ) {
    if (!type && url && url.indexOf(".json") != -1) {
      type = Laya.Loader.ATLAS;
    }

    let res: any = Laya.loader.getRes(url);
    if (res) {
      if (progress) {
        progress(1);
      }
      if (complete) {
        complete(res, args);
      }
      return;
    }

    //判断是否是不存在资源
    if (UnExistRes.isExist(url)) {
      url = UnExistRes.BlankURL;
    }
    Laya.loader.load(
      url,
      Laya.Handler.create(this, (res) => {
        if (complete) {
          complete(res, args);
        }
      }),
      Laya.Handler.create(this, (prog) => {
        if (progress) {
          progress(prog);
        }
      }),
      type,
      priority,
      cache,
      group,
      ignoreCache,
      useWorkerLoader,
    );
  }

  /**加载传类型资源 */
  public loadResItem(
    loadItem: { url: string; type: string },
    complete: Function = null,
    progress: Function = null,
    type?: string,
  ) {
    if (UnExistRes.isExist(loadItem.url)) {
      if (progress) {
        progress(1);
      }
      if (complete) {
        complete(true);
      }
      return;
    }

    let temp = [];
    temp = temp.concat(loadItem);

    Laya.loader.load(
      temp,
      Laya.Handler.create(this, (res) => {
        if (complete) {
          complete(res);
        }
      }),
      Laya.Handler.create(this, (prog) => {
        if (progress) {
          progress(prog);
        }
      }),
      type,
    );
  }

  private static s_BitmapFont: Map<string, Laya.BitmapFont> = new Map<
    string,
    Laya.BitmapFont
  >();

  /**
   * 加载位图字体
   * @param font 位图字体名称
   * @param callback 加载完成回调
   * @param thisObject
   */
  public LoadBitmapFont(font: string[], callback: () => void, thisObject: any) {
    if (font == null || font.length <= 0) {
      callback.call(thisObject);
      return;
    }
    let loadNum: number = 0;
    let mapBitmapFont = ResMgr.s_BitmapFont;
    for (let i = 0; i < font.length; ++i) {
      let fontName = font[i];
      if (mapBitmapFont.get(fontName) != null) {
        continue;
      }

      let bitmapFont = new Laya.BitmapFont();
      ++loadNum;
      bitmapFont.loadFont(
        fontName + ".fnt",
        new Laya.Handler(
          this,
          (fontName: string, bitmapFont: Laya.BitmapFont) => {
            mapBitmapFont.set(fontName, bitmapFont);
            Laya.Text.registerBitmapFont(fontName, bitmapFont);
            --loadNum;
            if (loadNum <= 0) {
              callback.call(thisObject);
            }
          },
          [fontName, bitmapFont],
        ),
      );
    }

    if (loadNum <= 0) {
      callback.call(thisObject);
    }
  }

  /**
   * 加载游戏字体
   * @param font 字体名称
   * @returns
   */
  public loadFont(font: string): Promise<Laya.TTFLoader> {
    const loadFunc = new Promise<Laya.TTFLoader>((resolve) => {
      Laya.loader.load(
        font,
        Laya.Handler.create(this, (res) => {
          resolve(res);
        }),
        null,
        Laya.Loader.TTF,
        0,
        true,
      );
    });
    return loadFunc;
  }

  /**
   * await方式加载资源, 方便写逻辑
   * @param url
   */
  public async loadResAsync(url: string): Promise<any> {
    const loadFunc = new Promise<any>((resolve) => {
      //判断是否是不存在资源
      if (UnExistRes.isExist(url)) {
        url = UnExistRes.BlankURL;
      }
      Laya.loader.load(
        url,
        Laya.Handler.create(this, (res) => {
          resolve(res);
        }),
      );
    });
    return loadFunc;
  }

  /**
   * 加载资源组
   * [{url:"a.png",type:Loader.IMAGE,size:100,priority:1},{url:"b.json",type:Loader.JSON,size:50,priority:1}]
   * @param resArr 资源
   */
  public loadGroup(
    resArr: string[] | Laya.loadItem[],
    complete: Function = null,
    progress: Function = null,
    type?: string,
    priority?: number,
    cache?: boolean,
    group?: string | null,
    ignoreCache?: boolean,
    useWorkerLoader?: boolean,
    args?: any,
  ) {
    let count = resArr.length;
    for (let index = 0; index < count; index++) {
      let element = resArr[index];

      if (typeof element == "object") {
        if (UnExistRes.isExist(element.url)) {
          element.url = UnExistRes.BlankURL;
        }
      } else if (typeof element == "string") {
        if (UnExistRes.isExist(element)) {
          element = UnExistRes.BlankURL;
        }
      }
    }
    Laya.loader.load(
      resArr,
      Laya.Handler.create(this, (res) => {
        if (complete) {
          complete(res);
        }
      }),
      Laya.Handler.create(
        this,
        (prog) => {
          if (progress) {
            progress(prog);
          }
        },
        null,
        false,
      ),
      type,
      priority,
      cache,
      group,
      ignoreCache,
      useWorkerLoader,
    );
  }

  /**
   * 异步加载资源组
   * @param group [{url:"a.png",type:Loader.IMAGE,size:100,priority:1},{url:"b.json",type:Loader.JSON,size:50,priority:1}]
   * @param groupKey 资源组Key
   */
  public async loadGroupAsync(
    group: string[] | Laya.loadItem[],
    groupKey: string,
  ): Promise<boolean> {
    const loadFunc = new Promise<boolean>((resolve) => {
      Laya.loader.load(
        group,
        Laya.Handler.create(this, (res) => {
          resolve(res);
        }),
      );
    });
    return loadFunc;
  }

  /**
   * 动画资源加载
   * @param anim 动画
   * @param animAddress 资源地址
   */
  public async loadAnimAsync(
    anim: Laya.Animation,
    animAddress: string,
  ): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      anim.loadAnimation(
        animAddress,
        Laya.Handler.create(this, () => {
          resolve(true);
        }),
      );
    });
  }

  public onLoadBytes(url: string, callFunc?: Function) {
    if (UnExistRes.isExist(url)) {
      url = UnExistRes.BlankURL;
    }
    Laya.loader.load(
      url,
      Laya.Handler.create(this, (res) => {
        if (callFunc) {
          callFunc(res);
        }
      }),
      null,
      Laya.Loader.BUFFER,
    );
  }

  public setGroup(url: string, group: string) {
    Laya.loader.setGroup(url, group);
  }

  public getRes(url: string): any {
    let res = null;
    if (Utils.useAstc) {
      let ktxurl = url;
      res = Laya.loader.getRes(ktxurl);
      if (ktxurl.includes(".png")) {
        ktxurl = ktxurl.replace(".png", ".ktx");
      } else if (ktxurl.includes(".jpg")) {
        ktxurl = ktxurl.replace(".jpg", ".ktx");
      }
      if (!res) res = Laya.loader.getRes(ktxurl);
    } else {
      res = Laya.loader.getRes(url);
    }
    return res;
  }

  public clearTextureRes(url: string) {
    Laya.loader.clearTextureRes(url);
  }

  public cancelLoadByUrl(url: string) {
    Laya.loader.cancelLoadByUrl(url);
  }

  public cancelLoadByUrls(urls: any[]) {
    Laya.loader.cancelLoadByUrls(urls);
  }

  public clearUnLoaded() {
    Laya.loader.clearUnLoaded();
  }

  /**
   * 清理组资源
   * @param groupKey 组键
   */
  public releaseGroupRes(groupKey: string) {
    Laya.loader.clearResByGroup(groupKey);
  }

  /**
   * 清理单个资源
   * @param url
   * @param type
   */
  public releaseRes(url: string) {
    Laya.loader.clearRes(url);
  }

  /**
   *
   * @param uiType 获取配置UI信息
   */
  public getUIInfo(uiType: EmWindow): UICFG {
    for (let key in UI_PACKAGE) {
      if (UI_PACKAGE.hasOwnProperty(key)) {
        let item = UI_PACKAGE[key];
        if (item && item.Type === uiType) {
          return item;
        }
      }
    }
  }

  /**
   *
   * @param packName EmPackName|EmPackName[]
   * @param callFunc
   */
  public loadFairyGui(
    packName: EmPackName | EmPackName[],
    callFunc: Function = undefined,
    progressFunc: Function = undefined,
    type: string = undefined,
    priority: number = 0,
    cache?: boolean,
  ) {
    let temp: any;
    if (Array.isArray(packName)) {
      temp = [];
      packName.forEach((ele) => {
        temp.push(ComponentSetting.UI_PREFIX + ele);
      });
    } else {
      temp = ComponentSetting.UI_PREFIX + packName;
    }
    fgui.UIPackage.loadPackage(
      temp,
      Laya.Handler.create(this, (res) => {
        //加载完成
        if (callFunc) {
          callFunc(res);
        }
        if (!res || (Array.isArray(res) && res.length == 0)) {
          if (fgui.UIPackage.getByName(temp)) {
            fgui.UIPackage.removePackage(temp); //加载失败, 移除对应包
          }
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation("ResMgr.loadPackage"),
          );
        }
      }),
      //TODO
      // Laya.Handler.create(
      //   this,
      //   (res) => {
      //     //加载进度
      //     // Logger.xjy('loadFairyGui :', uiType, '---', res);
      //     progressFunc && progressFunc(res);
      //   },
      //   null,
      //   false
      // ),
      // undefined,
      // priority

      Laya.Handler.create(
        this,
        (prog) => {
          //加载进度
          // Logger.xjy('loadFairyGui :', uiType, '---', res);
          if (progressFunc) {
            progressFunc(prog);
          }
        },
        null,
        false,
      ),
    );
  }

  public releaseFairyGui(packName: EmPackName | EmPackName[]) {
    let resKeyArr = FUIHelper.getFUIPackPathByName(packName);

    for (let index = 0; index < resKeyArr.length; index++) {
      const resKey = resKeyArr[index];
      const url = resKey + "." + fgui.UIConfig.packageFileExtension;

      let descData = ResMgr.Instance.getRes(url);
      if (descData && descData.byteLength > 0) {
        let pkg = fgui.UIPackage.getById(resKey);
        if (pkg) {
          let cnt: number = pkg["_items"].length;
          for (let i: number = 0; i < cnt; i++) {
            let pi: fgui.PackageItem = pkg["_items"][i];
            if (pi.type == fgui.PackageItemType.Atlas) {
              ResMgr.Instance.releaseRes(pi.file);
              // Logger.info("[ResMgr]释放FUI纹理资源", pi.file)
            }
          }
          fgui.UIPackage.removePackage(resKey);
          ResMgr.Instance.releaseRes(url);
          // Logger.info("[ResMgr]释放.fui", url)
        }
      }
    }
  }

  public cancelUnloadFairyGui(packName: EmPackName | EmPackName[]) {
    if (!packName) return;

    let resKeyArr = FUIHelper.getFUIPackPathByName(packName);

    for (let index = 0; index < resKeyArr.length; index++) {
      const resKey = resKeyArr[index];
      const fuiUrl = resKey + "." + fgui.UIConfig.packageFileExtension;

      let descData = ResMgr.Instance.getRes(fuiUrl);
      // 还没加载好.fui
      if (!descData || descData.byteLength == 0) {
        let resInfo = Laya.LoaderManager["_resMap"][fuiUrl];
        if (resInfo) {
          resInfo.offAll();
        }
        ResMgr.Instance.cancelLoadByUrl(fuiUrl);
        // Logger.info("[ResMgr]取消.fui加载", fuiUrl)
      } else {
        fgui.UIPackage.addPackage(resKey);

        // 资源列表
        let pkg = fgui.UIPackage.getById(resKey);
        if (pkg) {
          let cnt: number = pkg["_items"].length;
          for (let i: number = 0; i < cnt; i++) {
            let pi: fgui.PackageItem = pkg["_items"][i];
            if (pi.type == fgui.PackageItemType.Atlas) {
              let url = pi.file;
              let resInfo = Laya.LoaderManager["_resMap"][url];
              if (resInfo) {
                resInfo.offAll();
              }
              ResMgr.Instance.cancelLoadByUrl(url);
              // Logger.info("[ResMgr]取消FUI纹理资源加载", url, resInfo)
            }
          }
        }
        fgui.UIPackage.removePackage(resKey);
      }
    }
  }

  /**
   *
   * @param resKey fui绝对路径
   */
  public addFUIPackageByResKey(resKey: string | string[]) {
    if (Array.isArray(resKey)) {
      for (let i = 0; i < resKey.length; i++) {
        const fuiUrl = resKey[i] + "." + fgui.UIConfig.packageFileExtension;
        let descData = ResMgr.Instance.getRes(fuiUrl);
        if (!descData || descData.byteLength == 0) {
          Logger.warn("未加载1" + resKey[i]);
        } else {
          fgui.UIPackage.addPackage(resKey[i]);
        }
      }
    } else {
      const fuiUrl = resKey + "." + fgui.UIConfig.packageFileExtension;
      let descData = ResMgr.Instance.getRes(fuiUrl);
      if (!descData || descData.byteLength == 0) {
        Logger.warn("未加载2" + resKey);
      } else {
        fgui.UIPackage.addPackage(resKey);
      }
    }
  }

  public removeFUIPackageByResKey(resKey: string | string[]) {
    if (Array.isArray(resKey)) {
      for (let i = 0; i < resKey.length; i++) {
        fgui.UIPackage.removePackage(resKey[i]);
      }
    } else {
      fgui.UIPackage.removePackage(resKey);
    }
  }

  public GetRes(url) {
    return Laya.loader.getRes(url);
  }

  /**
   * 清理未使用资源
   */
  public onClearRes() {
    this.clearUnusedRes();
  }

  /**
   * 定时清理未使用资源
   */
  public startIntervalClear() {
    Laya.stage.timerLoop(3 * 60 * 1000, this, this.clearUnusedRes);
  }

  /**
   * 取消定时清理
   */
  public stopIntervalClear() {
    Laya.stage.clearTimer(this, this.clearUnusedRes);
  }

  public clearUnusedRes() {
    let gpuMem = Laya.Resource.gpuMemory;
    let gpuPerM = 1024 * 1024;
    let value = gpuMem / gpuPerM;
    if (value >= 500) {
      Logger.warn("----------------强制内存释放----------------");
      Laya.Resource.destroyUnusedResources();
    }
  }
}
