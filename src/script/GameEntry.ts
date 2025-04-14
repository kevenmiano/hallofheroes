import GameConfig from "../GameConfig";
import AudioManager from "./core/audio/AudioManager";
import Resolution from "./core/comps/Resolution";
import ConfigMgr from "./core/config/ConfigMgr";
import MouseMgr from "./core/Input/MouseMgr";
import LangManager from "./core/lang/LangManager";
import LanguageAnalyzer from "./core/lang/LanguageAnalyzer";
import LayerMgr from "./core/layer/LayerMgr";
import Logger from "./core/logger/Logger";
import { SocketManager } from "./core/net/SocketManager";
import ResMgr from "./core/res/ResMgr";
import SDKManager from "./core/sdk/SDKManager";
import StorageHelper from "./core/storage/StorageHelper";
import Utils from "./core/utils/Utils";
import { ConfigType } from "./game/constant/ConfigDefine";
import { EmPackName, EmWindow } from "./game/constant/UIDefine";
import { CursorManagerII } from "./game/manager/CursorManagerII";
import { EnterFrameManager } from "./game/manager/EnterFrameManager";
import GameManager from "./game/manager/GameManager";
import { GoodsManager } from "./game/manager/GoodsManager";
import ModelMgr from "./game/manager/ModelMgr";
import { SceneManager } from "./game/map/scene/SceneManager";
import SceneType from "./game/map/scene/SceneType";
import { StageReferance } from "./game/roadComponent/pickgliss/toplevel/StageReferance";
import ComponentSetting from "./game/utils/ComponentSetting";
import { FrameCtrlManager } from "./game/mvc/FrameCtrlManager";
import UIManager from "./core/ui/UIManager";
import WXAdapt from "./core/sdk/wx/adapt/WXAdapt";
import { PathManager } from "./game/manager/PathManager";
import {
  GAME_LIMIT,
  getdefaultLangageCfg,
  getLanguage,
  hasLanguage,
  setCfgDefaultLang,
  setDefaultLang,
} from "./core/lang/LanguageDefine";
import ShaderMgr from "./core/shader/ShaderMgr";
import { SharedManager } from "./game/manager/SharedManager";
import ProtoManager from "./game/manager/ProtoManager";
import YMWebManager from "./game/manager/YMWebManager";
import { TrackEventNode } from "./game/constant/GameEventCode";
import { NativeChannel } from "./core/sdk/native/NativeChannel";
import { t_s_configData } from "./game/config/t_s_config";
import ConfigInfosTempInfo from "./game/datas/ConfigInfosTempInfo";

const ManagerMap = [
  FrameCtrlManager,
  ResMgr,
  EnterFrameManager,
  SDKManager,
  AudioManager,
  SocketManager,
  LangManager,
  StorageHelper,
  ModelMgr,
  LayerMgr,
  MouseMgr,
  GoodsManager,
  SceneManager,
  ShaderMgr,
  ProtoManager,
];

/**
 * @author:pzlricky
 * @email:346970513@qq.com
 * @data: 2020-11-04 14:26
 * @description 游戏入口类
 */
export default class GameEntry {
  public static async startUp() {
    if (Utils.isWxMiniGame()) {
      fgui.GRoot.inst.setSize(Resolution.gameWidth, Resolution.gameHeight);
      WXAdapt.Instance.init();
    }

    Logger.base("Game StartUp!");
    Resolution.init(); //适配
    CursorManagerII.Instance.resetCursor();
    let gameConfig = await this.onLoadGameConfig();
    let config = await this.onLoadConfig();
    this.initialized(); //初始化管理器
    let siteConfig: any;
    if (Utils.isWxMiniGame()) {
      let siteConfigLoad = ConfigMgr.Instance.getSync(ConfigType.siteConfig);
      siteConfig = siteConfigLoad.mDataList[0];
      SDKManager.Instance.getChannel().trackEvent(
        0,
        TrackEventNode.Node_1001,
        "加载选大区配置",
        "加载选大区配置",
        "",
        "",
      );
    } else {
      siteConfig = await this.onLoadSiteConfig();
    }

    //解析配置表数据
    GameManager.Instance.parseConfig(gameConfig, siteConfig);

    fgui.UIConfig.defaultFont = Laya.Text.defaultFont;
    StageReferance.setup(Laya.stage);

    await this.onLoadLang();
    this.setLanguage();
    let langCfg = getdefaultLangageCfg();
    fgui.UIPackage.branch = langCfg.key;
    let uiLang = ComponentSetting.getUILanguage(langCfg.key);
    await this.onLoadBranchLang(uiLang);

    this.onLoadCommonRes().then(() => {
      let userObject: any = Utils.getUrlParams();
      if (userObject) {
        SDKManager.Instance.getChannel().setRptTag(userObject.logTag);
      }
      SceneManager.Instance.setScene(SceneType.LOGIN_SCENE, {
        user: userObject,
      });
    });

    if (GameConfig.stat) {
      window.showMemTool = () => {
        UIManager.Instance.ShowWind(EmWindow.MemToolWnd);
      };
    }
  }

  public static setLanguage() {
    let systemLanguage = "";
    if (Utils.isApp()) {
      systemLanguage = NativeChannel.language; //手机端语言
    } else {
      systemLanguage = Laya.Browser.window.navigator.language; //浏览器端语言
    }
    let shareLang = SharedManager.Instance.getWindowItem("GAME_LANGUAGE");
    let settingLanguage: string;
    if (shareLang) {
      settingLanguage = getLanguage(Number(shareLang)).key; //游戏内设置的语言
    }
    let defaultLanguage: string = PathManager.info.LANGUAGE; //配置的默认语言
    setCfgDefaultLang(defaultLanguage);
    Logger.yyz(
      `系统语言:browserLanguage: ${systemLanguage}, 游戏内设置的语言:settingLanguage: ${settingLanguage}, 配置的默认语言:defaultLanguage: ${defaultLanguage}`,
    );
    if (hasLanguage(settingLanguage, true)) {
      setDefaultLang(settingLanguage);
    } else if (hasLanguage(systemLanguage, false)) {
      setDefaultLang(systemLanguage);
    } else {
      setDefaultLang(defaultLanguage);
    }
  }

  /**初始化游戏管理器 */
  static initialized() {
    for (const key in ManagerMap) {
      let mgr: any = ManagerMap[key];
      mgr.Instance.preSetup();
    }
    UIManager.Instance.setup();
    YMWebManager.Instance.setup();
  }

  /**加载公用资源 */
  static onLoadCommonRes(): Promise<boolean> {
    let groupRes: string[] = [EmPackName.BaseInit, EmPackName.LoadingScene]; //队列资源
    let groupLoadIndex = 0;
    return new Promise((resolve) => {
      let loadFunc = () => {
        let resKey = groupRes[groupLoadIndex] as EmPackName;
        fgui.UIPackage.loadPackage(
          ComponentSetting.UI_PREFIX + resKey,
          Laya.Handler.create(this, () => {
            if (groupLoadIndex >= groupRes.length - 1) {
              Logger.base("加载公用资源 Finished....");
              SDKManager.Instance.getChannel().trackEvent(
                0,
                TrackEventNode.Node_1003,
                "加载基础资源",
                "加载基础资源",
                "",
                "",
              );
              resolve(true);
            } else {
              groupLoadIndex++;
              loadFunc();
            }
          }),
        );
      };
      loadFunc();
    });
  }

  /**加载配置信息 */
  static onLoadConfig() {
    return new Promise((resolve) => {
      ConfigMgr.Instance.load(ConfigType.t_s_config, async (res) => {
        Logger.base("加载Config 配置表 Finished....");
        let gameConfig = ConfigMgr.Instance.getSync(ConfigType.t_s_config);
        let data = gameConfig.mDataList[0];

        let temp = ConfigMgr.Instance.getTemplateByID(
          ConfigType.t_s_config,
          "Language",
        ) as t_s_configData;
        if (!temp) {
          temp = ConfigInfosTempInfo.temp as t_s_configData;
        }
        if (temp) {
          let configValue = String(temp.ConfigValue);
          let keyMaps = configValue.split(",");
          let count = keyMaps.length;
          for (let index = 0; index < count; index++) {
            let element = keyMaps[index];
            GAME_LIMIT.push(element);
          }
        }
        resolve(data);
      });
    });
  }

  /**加载游戏初始化配置信息 */
  static onLoadGameConfig() {
    return new Promise((resolve) => {
      ConfigMgr.Instance.load(ConfigType.t_s_gameconfig, async (res) => {
        Logger.base("加载gameConfig 配置表 Finished....");
        let gameConfig = ConfigMgr.Instance.getSync(ConfigType.t_s_gameconfig);
        let data = gameConfig.mDataList[0];
        resolve(data);
      });
    });
  }

  /**加载游戏初始化配置信息 */
  static onLoadSiteConfig() {
    return new Promise((resolve) => {
      ConfigMgr.Instance.load(ConfigType.siteConfig, async (res) => {
        Logger.base("加载siteConfig 配置表 Finished....");
        SDKManager.Instance.getChannel().trackEvent(
          0,
          TrackEventNode.Node_1001,
          "加载选大区配置",
          "加载选大区配置",
          "",
          "",
        );
        let siteConfig = ConfigMgr.Instance.getSync(ConfigType.siteConfig);
        let data = siteConfig.mDataList[0];
        resolve(data);
      });
    });
  }

  /**加载游戏初始化语言配置表  登录时候用到的  还未加载进入游戏*/
  static onLoadLang() {
    return new Promise<void>((resolve) => {
      ConfigMgr.Instance.load(ConfigType.languageLogin, async (res) => {
        SDKManager.Instance.getChannel().trackEvent(
          0,
          TrackEventNode.Node_1002,
          "加载语言",
          "加载语言",
          "",
          "",
        );
        let gameConfig = ConfigMgr.Instance.getSync(ConfigType.languageLogin);
        Logger.base("加载languageLogin 配置表 Finished....", gameConfig);
        let analyzer = new LanguageAnalyzer(() => {
          LangManager.Instance.setup(analyzer);
        });
        analyzer.analyze(gameConfig);
        resolve();
      });
    });
  }

  /**
   * 多语言文件
   * @param uiLang
   * @returns
   */
  static onLoadBranchLang(uiLang: string) {
    return new Promise<void>((resolve) => {
      ResMgr.Instance.loadRes(
        uiLang,
        (res) => {
          if (res) {
            fgui.UIPackage.setStringsSource(res);
          }
          resolve();
        },
        null,
        Laya.Loader.TEXT,
      );
    });
  }
}
