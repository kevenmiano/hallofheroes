/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-03-03 10:11:19
 * @LastEditTime: 2023-01-11 16:17:46
 * @LastEditors: jeremy.xu
 * @Description:
 */
import GameConfig from "./GameConfig";
import Logger from "./script/core/logger/Logger";
import FGuiFactory from "./script/game/FGuiFactory";
import { LayaClassUtils } from "./script/game/utils/LayaClassUtils";
import GameEntry from "./script/GameEntry";
import Utils from "./script/core/utils/Utils";
import ResMgr from "./script/core/res/ResMgr";
import SDKManager from "./script/core/sdk/SDKManager";
import { CatchError } from "./script/game/utils/CatchError";
import StringUtils from "./script/game/utils/StringUtils";
import DisplayLoader from "./script/game/utils/DisplayLoader";
import ConfigMgr from "./script/core/config/ConfigMgr";
import { ConfigType } from "./script/game/constant/ConfigDefine";

export class Main {
  public static version: string = "2.0.0.0";
  public static date: string = "2024.02.18——10:45";

  constructor() {
    CatchError.init();
    //根据IDE设置初始化引擎
    Config.isAntialias = true;
    Config.useWebGL2 = false;
    Config.isAlpha = true;
    if (Utils.isApp()) {
      Config.useRetinalCanvas = true;
    }

    if (Laya.Browser.onPC) {
      if (Utils.isFixAuto()) {
        GameConfig.scaleMode = Laya.Stage.SCALE_FIXED_AUTO; //Laya.Stage.SCALE_SHOWALL;
        GameConfig.screenMode = Laya.Stage.SCREEN_HORIZONTAL;
        GameConfig.alignV = Laya.Stage.ALIGN_MIDDLE;
        GameConfig.alignH = Laya.Stage.ALIGN_CENTER;
      } else {
        GameConfig.scaleMode = Laya.Stage.SCALE_SHOWALL; //"custom";
        GameConfig.screenMode = Laya.Stage.SCREEN_NONE;
        GameConfig.alignV = Laya.Stage.ALIGN_MIDDLE;
        GameConfig.alignH = Laya.Stage.ALIGN_CENTER;
      }
    } else {
      let pixel = Number(Laya.Browser.clientWidth / Laya.Browser.clientHeight); //屏幕宽高比
      let minPixel = 4 / 3; //1.333333333333333
      let maxPixel = 2.3; //(19.5)/9;//2.166666666666667
      if (pixel > maxPixel) {
        //左右留黑边
        GameConfig.scaleMode = Laya.Stage.CUSTOM_SELF;
      } else if (pixel < minPixel) {
        //上下留黑边
        GameConfig.scaleMode = Laya.Stage.SCALE_SHOWALL;
      } else {
        GameConfig.scaleMode = Laya.Stage.SCALE_FIXED_AUTO;
      }
      GameConfig.screenMode = Laya.Stage.SCREEN_HORIZONTAL;
      GameConfig.alignV = Laya.Stage.ALIGN_MIDDLE;
      GameConfig.alignH = Laya.Stage.ALIGN_CENTER;
    }
    if (window["Laya3D"]) {
      Laya3D.init(GameConfig.width, GameConfig.height);
    } else {
      Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
    }
    if (Laya["Physics"]) {
      Laya["Physics"].enable();
    }
    if (Laya["DebugPanel"]) {
      Laya["DebugPanel"].enable();
    }
    Laya.stage.scaleMode = GameConfig.scaleMode;
    Laya.stage.screenMode = GameConfig.screenMode;
    Laya.stage.alignV = GameConfig.alignV;
    Laya.stage.alignH = GameConfig.alignH;
    Laya.MouseManager.multiTouchEnabled = false;
    //兼容微信不支持加载scene后缀场景
    Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
    //打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
    if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true") {
      Laya.enableDebugPanel();
    }
    if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"]) {
      Laya["PhysicsDebugDraw"].enable();
    }
    Laya.alertGlobalError(false);
    Laya.stage.bgColor = "none"; //
    // 设置默认字体
    Laya.Stat.hide();
    //海外采用Arial,国内采用微软雅黑
    Laya.Text.defaultFont = "Microsoft YaHei";
    //激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
    if (GameConfig.stat) {
      Laya.ResourceVersion.enable(
        "version.json?v=" + new Date().getTime(),
        Laya.Handler.create(this, this.onVersionLoaded),
        Laya.ResourceVersion.FILENAME_VERSION,
      );
    } else {
      //先以二进制方式加载zip包
      if (Utils.isWxMiniGame()) {
        Laya.MiniAdpter.init();
        Laya.MiniAdpter.nativefiles.push("siteConfig.json");
        DisplayLoader.isDebug = true;
        this.onWxLoadSiteConfig();
      } else {
        this.mainLoadVersion();
      }
    }
  }

  /**加载游戏初始化配置信息 */
  onWxLoadSiteConfig() {
    ConfigMgr.Instance.load(ConfigType.siteConfig, (res) => {
      Logger.base("加载siteConfig 配置表 Finished....");
      let siteConfig = ConfigMgr.Instance.getSync(ConfigType.siteConfig);
      let data = siteConfig.mDataList[0];
      let resourcePath: string = data.ResourcePath;
      if (resourcePath != undefined && StringUtils.trim(resourcePath) != "") {
        Laya.URL.basePath = resourcePath;
        this.mainLoadVersion(data.VesionName ? data.VesionName : "version.zip");
      }
    });
  }

  mainLoadVersion(zipFile: string = "version.zip") {
    let url = zipFile + "?v=" + new Date().getTime();
    ResMgr.Instance.loadRes(
      url,
      (res) => {
        Logger.yyz("加载version.zip成功", res);
        let jsZip = new JSZip();
        jsZip
          .loadAsync(res)
          .then((data: any) => {
            for (let file in data.files) {
              if (file.endsWith("json")) {
                data
                  .file(file)
                  .async("text")
                  .then((content) => {
                    Laya.ResourceVersion.type =
                      Laya.ResourceVersion.FILENAME_VERSION;
                    Laya.ResourceVersion.manifest = JSON.parse(content);
                    Laya.URL.customFormat =
                      Laya.ResourceVersion.addVersionPrefix;
                    this.onConfigLoaded();
                  });
              }
            }
          })
          .catch(() => {
            Logger.yyz("version.zip加载失败！");
            SDKManager.Instance.getChannel().showNetworkAlert();
          });
      },
      null,
      Laya.Loader.BUFFER,
      1,
      false,
      "",
      true,
    );
  }

  onVersionLoaded() {
    //激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
    this.onConfigLoaded();
  }

  onConfigLoaded() {
    try {
      FGuiFactory.register();
      LayaClassUtils.register();
      if (Utils.isWxMiniGame()) {
        Laya.timer.once(1000, this, () => {
          GameEntry.startUp();
        });
      } else {
        GameEntry.startUp();
      }
    } catch (error) {
      Logger.error("全局捕获错误:" + error);
    }
  }
}

//激活启动类
new Main();
