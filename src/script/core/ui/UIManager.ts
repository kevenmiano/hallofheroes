import {
  EmPackName,
  EmWindow,
  UICFG,
  UI_PACKAGE,
} from "../../game/constant/UIDefine";
import { CampaignManager } from "../../game/manager/CampaignManager";
import { NotificationManager } from "../../game/manager/NotificationManager";
import { SceneManager } from "../../game/map/scene/SceneManager";
import SceneType from "../../game/map/scene/SceneType";
import NewbieBaseConditionMediator from "../../game/module/guide/mediators/NewbieBaseConditionMediator";
import LoadingUIMgr from "../../game/module/loading/LoadingUIMgr";
import { FrameCtrlManager } from "../../game/mvc/FrameCtrlManager";
import { CampaignMapModel } from "../../game/mvc/model/CampaignMapModel";
import { WorldBossHelper } from "../../game/utils/WorldBossHelper";
import GameEventDispatcher from "../event/GameEventDispatcher";
import GlobalEvent from "../event/GlobalEvent";
// import IManager from '../Interface/IManager';
import LayerMgr from "../layer/LayerMgr";
import Logger from "../logger/Logger";
import ResMgr from "../res/ResMgr";
import ObjectTranslator from "../utils/ObjectTranslator";
import { EmLayer } from "./ViewInterface";

export default class UIManager extends GameEventDispatcher {
  static EVENT_POP_VIEW: string = "POP_VIEW";

  static MAX_SHOW_TIPS: number = 15;

  private windowCaches: Map<any, any>;
  private windowMaps: Map<any, any>;

  private static ins: UIManager;

  static get Instance(): UIManager {
    if (!UIManager.ins) {
      UIManager.ins = new UIManager();
    }
    return UIManager.ins;
  }

  constructor() {
    super();
    this.windowMaps = new Map();
    this.windowCaches = new Map();
    NotificationManager.Instance.addEventListener(
      GlobalEvent.POP_VIEW,
      this.onPopViewHandler,
      this
    );
  }

  /**
   * 初始化
   * @param t
   */
  preSetup(t?: any) {}

  setup(t?: any) {
    for (let key in UI_PACKAGE) {
      if (UI_PACKAGE.hasOwnProperty(key)) {
        let item = UI_PACKAGE[key];
        let arr = this.pkgWindowMaps.get(item.packName);
        if (!arr) {
          arr = [];
          this.pkgWindowMaps.set(item.packName, arr);
        }
        arr.push(item.Type);
      }
    }
  }

  /**添加至UI管理 */
  public AddToWindowMap(type, wind) {
    this.windowMaps.set(type, wind);
  }

  /**添加至Caches管理 */
  public AddToCachesMap(type, wind) {
    this.windowCaches.set(type, wind);
  }

  /**删除UI管理 */
  public DelToWindowMap(type) {
    this.windowMaps.delete(type);
  }

  /**删除 Caches管理 */
  public DelToCachesMap(type) {
    this.windowCaches.delete(type);
  }

  /**UI管理 */
  public GetToWindowMap(type) {
    this.windowMaps.get(type);
  }

  /**Caches管理 */
  public GetToCachesMap(type) {
    this.windowCaches.get(type);
  }

  /**Window管理 */
  public HasWindowMap(type): boolean {
    return this.windowMaps.has(type);
  }

  /**Caches管理 */
  public HasCachesMap(type): boolean {
    return this.windowCaches.has(type);
  }

  /**
   * 获取所有窗口
   */
  public GetAllWinds(): Map<string, any> {
    return this.windowMaps;
  }

  /**
   * 寻找窗口
   * @param type 类型
   */
  public FindWind(type: any) {
    return this.windowMaps.get(type);
  }

  /**
   * 显示界面
   * @param type 界面类型
   * @param param 界面数据
   * @param immediately   是否立即显示；有时候需要等位置和大小计算好之后再显示, 比如动态改变位置的tips
   */
  public ShowWind(
    type: EmWindow,
    param = null,
    immediately: boolean = true
  ): Promise<any> {
    return new Promise<any>((resolve) => {
      let uiInfo = this.getUIInfo(type);
      if (!uiInfo) {
        Logger.error("无相关UI信息   " + type);
        return;
      }

      //防止重复打开
      if (UIManager.Instance.isSingle(type)) {
        Logger.warn("已经创造该实例, 不重复创建...", type);
        let wind = UIManager.Instance.FindWind(type);
        if (wind) {
          wind.params = param;
          // wind.OnInitWind();
          let wndLayer = uiInfo.Layer ? uiInfo.Layer : EmLayer.GAME_UI_LAYER;
          if (param && param.emLayer) {
            wndLayer = param.emLayer;
          }
          let layer = LayerMgr.Instance.getLayer(wndLayer);
          wind.visible = immediately;
          wind.active = immediately;
          layer.pushView(wind, uiInfo.ZIndex);
          wind.OnShowWind();
        }
        resolve(wind);
        return;
      }

      // this.windowCaches.set(type, null);
      let completeFunc = async (res) => {
        if (!res || (Array.isArray(res) && res.length == 0)) {
          this.loadFailed(type, false);
          return;
        }

        FrameCtrlManager.Instance.curOpeningModuleMap.delete(type);

        let wind = null;
        let wndClass = uiInfo.Class;
        if (wndClass.Instance) {
          //若有些界面需要做成单例类,则需要实现get Instance
          wind = wndClass.Instance;
        } else {
          wind = ObjectTranslator.toInstance(null, wndClass);
        }

        let b = wind.onCreate(type, param);
        if (!b) {
          return;
        }

        let wndLayer = uiInfo.Layer ? uiInfo.Layer : EmLayer.GAME_UI_LAYER;
        let layer = LayerMgr.Instance.getLayer(wndLayer);
        layer.pushView(wind, uiInfo.ZIndex);
        UIManager.Instance.AddToCachesMap(type, wind);
        UIManager.Instance.AddToWindowMap(type, wind);

        wind.OnInitWind();
        wind.doShowAnimation();
        wind.OnShowWind();
        wind.visible = immediately;
        wind.active = immediately;
        resolve(wind);
      };

      FrameCtrlManager.Instance.curOpeningModuleMap.set(type, true);
      LoadingUIMgr.Instance.Show(
        type,
        uiInfo.packName,
        completeFunc,
        null,
        this.loadFailed(type, true),
        uiInfo.ShowLoading == false
      );
    });
  }

  protected loadFailed(type: EmWindow, cancel: boolean = false) {
    // this.windowCaches.delete(type);
    FrameCtrlManager.Instance.curOpeningModuleMap.delete(type);
  }

  /**关闭提示 */
  public HideTips(type: any, viewtype: EmWindow, target?: any) {
    let uiInfo = this.getUIInfo(viewtype);
    if (uiInfo) {
      let uiLayer = uiInfo.Layer; //所在层级
      let manager = LayerMgr.Instance.getLayer(uiLayer);
      if (manager) {
        manager.popView(target);
      }
    } else {
      target.removeSelf();
    }
  }

  /**清除对象池 */
  public clearHintTips(type) {
    Laya.Pool.clearBySign(type);
  }

  /**
   * 隐藏窗口
   * @param type 界面类型
   */
  public HideWind(type: any) {
    let wind = this.FindWind(type);
    if (wind != null) {
      wind.hide();
    }
  }

  private onPopViewHandler(target) {
    let type = target.getUIID();
    let wind = this.FindWind(type);
    let uiInfo = this.getUIInfo(type);
    if (wind != null) {
      let wndLayer = uiInfo.Layer ? uiInfo.Layer : EmLayer.GAME_UI_LAYER;
      LayerMgr.Instance.removeByLayer(wind, wndLayer);
      this.windowMaps.delete(type);
      this.windowCaches.delete(type);

      if (!this.isSingleInstanceWnd(type)) {
        let pkgList = [];
        let ctrl = FrameCtrlManager.Instance.getCtrl(type);
        if (ctrl && ctrl.packNameList.length > 0) {
          pkgList = pkgList.concat(ctrl.packNameList);
        } else {
          pkgList.push(uiInfo.packName);
        }
        // 资源释放
        Laya.timer.once(
          100,
          this,
          this.releaseModuleRes,
          [type, pkgList],
          false
        );
      }
    }
  }

  /**
   * 获取窗口
   * @param isShow 是否只找显示
   * @param containDotDel 是否包含不需要被删除的界面
   */
  public GetAllWind(isShow = false, containDotDel = true): Array<any> {
    let keys = new Array<any>();

    let array = this.GetAllWinds();

    array.forEach((value: any, key: string, map: Map<string, any>) => {
      if (value && (!isShow || value.isShowing)) {
        let wind: any = value as any;
        if (!value.dontDel || containDotDel) {
          keys.push(value);
        }
      }
    });

    return keys;
  }

  /**
   * 隐藏所有
   * @param dispose 销毁
   * @param containDotDel 是否包含不能删除的
   */
  public HideAllWind(dispose = false, containDotDel = false) {
    let winds = this.GetAllWind(true, containDotDel);
    winds.forEach((element) => {
      let type = element.getUIID();
      let wind = this.FindWind(type);
      let uiInfo = this.getUIInfo(type);
      if (wind != null && uiInfo) {
        UIManager.Instance.HideWind(type);
      }
    });
  }

  /**
   *
   * @param uiType 获取配置UI信息
   */
  getUIInfo(uiType: EmWindow): UICFG {
    for (let key in UI_PACKAGE) {
      if (UI_PACKAGE.hasOwnProperty(key)) {
        let item = UI_PACKAGE[key];
        if (item && item.Type === uiType) {
          return item;
        }
      }
    }
  }

  /**是否打开界面 */
  public isShowing(uiType: EmWindow): boolean {
    let wind = this.FindWind(uiType);
    if (wind != null) {
      return wind.isShowing;
    }
    return false;
  }

  /**
   * 除exceptType是否还有model的窗口处于打开状态
   * @param exceptType
   * @returns
   */
  public isShowingModelWin(exceptType: EmWindow) {
    let tmp: boolean = false;
    let winds = this.GetAllWind(true, true);
    winds.forEach((element) => {
      let type = element.getUIID();
      if (exceptType != type) {
        let wind = this.FindWind(type);
        let uiInfo = this.getUIInfo(type);
        if (wind != null && uiInfo && uiInfo.Model) {
          tmp = true;
        }
      }
    });
    return tmp;
  }

  public isSingle(type: EmWindow) {
    let isSingle: boolean = true;
    let uiInfo = this.getUIInfo(type);
    if (uiInfo.hasOwnProperty("Single")) {
      isSingle = uiInfo.Single;
    }
    if (isSingle && this.HasCachesMap(type)) {
      return true;
    }
    return false;
  }

  /**单例类 (需要实现get Instance 写法参考 HomeWnd)
   * 单例类不释放UI资源
   * 单例类不释放类实例
   * @param type
   * @returns
   */
  public isSingleInstanceWnd(type: EmWindow) {
    let uiInfo = this.getUIInfo(type);
    if (!uiInfo) return false;
    let wndClass = uiInfo.Class;
    if (wndClass && wndClass["Instance"]) {
      return true;
    }
    return false;
  }

  public get isShowSpaceTaskInfoWndScene() {
    if (
      SceneManager.Instance.currentType == SceneType.SPACE_SCENE ||
      SceneManager.Instance.currentType == SceneType.OUTER_CITY_SCENE ||
      SceneManager.Instance.currentType == SceneType.CASTLE_SCENE
    ) {
      return true;
    }
    if (SceneManager.Instance.currentType == SceneType.CAMPAIGN_MAP_SCENE) {
      let model: CampaignMapModel = CampaignManager.Instance.mapModel;
      if (!model) return true;
      return !(
        WorldBossHelper.checkMonopoly(model.mapId) ||
        WorldBossHelper.checkWorldBoss(model.mapId) ||
        WorldBossHelper.checkPvp(model.mapId) ||
        WorldBossHelper.checkGvg(model.mapId) ||
        WorldBossHelper.checkConsortiaDemon(model.mapId) ||
        WorldBossHelper.checkSingleBgMap(model.mapId)
      );
    }
    return false;
  }

  /////////////////////////////////资源释放////////////////////////////////
  public notReleaseList: EmPackName[] = [
    EmPackName.Font,
    EmPackName.Base,
    EmPackName.BaseInit,
    EmPackName.BaseCommon,
    EmPackName.Newbie,
    EmPackName.Space,
    EmPackName.Dialog,
    EmPackName.Home,
    EmPackName.Battle,
    EmPackName.OuterCity,
    EmPackName.BattleDynamic,
    EmPackName.CampaignCommon,
    EmPackName.Waiting,
    // 以上为不释放
  ];

  // pkg引用的所有EmWindow
  public pkgWindowMaps: Map<EmPackName, EmWindow[]> = new Map();

  public releaseModuleRes(type: EmWindow, pkgName: EmPackName | EmPackName[]) {
    let tempArr = [];
    if (Array.isArray(pkgName)) {
      tempArr = tempArr.concat(pkgName);
    } else {
      tempArr.push(pkgName);
    }
    for (let index = 0; index < tempArr.length; index++) {
      const pkgName = tempArr[index];
      if (this.checkReleaseModuleRes(pkgName)) {
        Logger.info("释放资源", pkgName);
        ResMgr.Instance.releaseFairyGui(pkgName);
      }
    }
  }

  public checkReleaseModuleRes(srcPackName: EmPackName) {
    if (!srcPackName) return false;

    let b = this.notReleaseList.indexOf(srcPackName) == -1;
    if (b) {
      let flag = false;
      for (let tempPackName of this.pkgWindowMaps.keys()) {
        if (tempPackName != srcPackName) continue;

        const emWindows = this.pkgWindowMaps.get(tempPackName);
        for (let index = 0; index < emWindows.length; index++) {
          const emWindow = emWindows[index];
          if (NewbieBaseConditionMediator.checkFrame(emWindow)) {
            flag = true;
            Logger.info(
              "释放资源" +
                srcPackName +
                "失败, 已经打开引用该资源的模块" +
                emWindow
            );
            break;
          }
          if (FrameCtrlManager.Instance.curOpeningModuleMap.get(emWindow)) {
            flag = true;
            Logger.info(
              "释放资源" +
                srcPackName +
                "失败, 正在打开引用该资源的模块" +
                emWindow
            );
            break;
          }
        }
        if (flag) {
          b = false;
          break;
        }
      }
    }
    return b;
  }
}
