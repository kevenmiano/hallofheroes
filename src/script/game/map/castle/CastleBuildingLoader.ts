import { Func } from "../../../core/comps/Func";
import Logger from "../../../core/logger/Logger";
import ResMgr from "../../../core/res/ResMgr";
import { AnimationManager } from "../../manager/AnimationManager";
import { BuildInfo } from "./data/BuildInfo";
import { MovieClip } from "../../component/MovieClip";
import BuildingManager from "./BuildingManager";
import { Sequence } from "../../../core/task/Sequence";
import {
  ActionsExecutionMode,
  SequenceList,
} from "../../../core/task/SequenceList";
import Utils from "../../../core/utils/Utils";
import BuildingType from "./consant/BuildingType";

/**内城建筑加载任务 */
export class CastleBuildingLoaderTask extends Sequence {
  private resName: string = "";
  private loadIndex: number = 0;

  constructor(resName: string, index: number = 0) {
    super();
    this.resName = resName;
    this.loadIndex = index;
  }

  protected onExecute() {
    super.onExecute();
    let loadUrl = this.resName;
    if (this.loadIndex == 0) {
      ResMgr.Instance.loadRes(loadUrl, (res: Laya.Texture) => {
        if (!res) {
          this.endAction(false);
        } else {
          this.endAction(true);
        }
      });
    } else {
      ResMgr.Instance.loadRes(
        loadUrl,
        (res) => {
          Logger.log("加载完成:", loadUrl);
          if (!res) {
            this.endAction(false);
          } else {
            this.endAction(true);
          }
        },
        null,
        Laya.Loader.ATLAS,
      );
    }
  }

  protected onForcedStop() {
    let loadUrl = this.resName;
    ResMgr.Instance.cancelLoadByUrl(loadUrl);
    this.resName = "";
  }
}

/**
 * @author:shujin.ou
 * @email:1009865728@qq.com
 * @data: 2020-11-23 19:45
 */
export default class CastleBuildingLoader {
  private _info: BuildInfo;
  private _callback: Func;
  private _pathArray: string[];
  public static path: string = "res/animation/images/";
  private _pnghasLoad: boolean = false;
  private _effectHasLoad: boolean = true;
  private _cacheName: string; //动画缓存名称
  private _preUrl: string; //动画json中该动画的前缀路径

  private downLoadList: SequenceList;

  constructor(info: BuildInfo, callback: Func) {
    this._info = info;
    this._callback = callback;
    this.isNotMoling();
  }

  private isNotMoling() {
    this._pathArray = this._info.templeteInfo.PicPath.split("|");
    let path: string = "";
    this._pnghasLoad = false;
    this._effectHasLoad = false;
    let parallel = new SequenceList(ActionsExecutionMode.RunInSequence);
    this.downLoadList = parallel;
    for (let index = 0; index < this._pathArray.length; index++) {
      let resName = CastleBuildingLoader.path + this._pathArray[index]; //图集地址
      parallel = parallel.addTask(new CastleBuildingLoaderTask(resName, index));
      BuildingManager.Instance.model._resUrlNameMap.set(
        this._pathArray[index],
        true,
      );
    }
    new SequenceList(ActionsExecutionMode.RunInParallel)
      .addTask(parallel)
      .setComplete(
        Laya.Handler.create(this, () => {
          Logger.log("任务完成");
          this._effectComplete();
        }),
      )
      .execute(null);
  }

  completePic() {
    this._pnghasLoad = true;
    if (this._pnghasLoad && this._effectHasLoad) {
      this._callback.Invoke(this._info.templeteInfo.TemplateId);
    }
  }

  /**所有资源加载完成 */
  private _effectComplete() {
    for (let index = 0; index < this._pathArray.length; index++) {
      let resName = this._pathArray[index];
      let path = "";
      // 原生iOS上getRes获取的单张图片, 需要改后缀 主城的传送阵 地下迷宫 农村神树 精炼炉
      if (Utils.useAstc) {
        if (resName.includes(".png")) {
          resName = resName.replace(".png", ".ktx");
        } else if (resName.includes(".jpg")) {
          resName = resName.replace(".jpg", ".ktx");
        }
      }
      if (index == 0) {
        let path = CastleBuildingLoader.path + resName;
        this._info.templeteInfo.view = new Laya.Sprite();
        this._info.templeteInfo.view.autoSize = true;
        this._info.templeteInfo.view.graphics.clear();
        this._info.templeteInfo.view.graphics.loadImage(
          path,
          0,
          0,
          0,
          0,
          this.completePic.bind(this),
        );
      } else {
        let prefixUrl = CastleBuildingLoader.path + resName;
        let res = ResMgr.Instance.getRes(prefixUrl);
        if (res) {
          this._preUrl = res.meta.prefix;
          this._cacheName = this._preUrl;
          AnimationManager.Instance.createAnimation(
            this._preUrl,
            "",
            0,
            "",
            AnimationManager.MapPhysicsFormatLen,
          );
          let tl = new MovieClip(this._cacheName);
          BuildingManager.Instance.model._cacheNameMap.set(
            this._cacheName,
            true,
          );
          if (
            !this._info.templeteInfo.effect &&
            this._info.templeteInfo.SonType != BuildingType.TREE
          ) {
            this._info.templeteInfo.effect = new Map();
          }
          if (this._info.templeteInfo.effect) {
            this._info.templeteInfo.effect.set(this._cacheName, tl);
          }
        }
      }
    }
    this._effectHasLoad = true;
    if (this._pnghasLoad && this._effectHasLoad) {
      this._callback.Invoke(this._info.templeteInfo.TemplateId);
    }
    Logger.log("[CastleBuildingLoader]__onResComplete");
  }

  dispose() {
    this.downLoadList && this.downLoadList.clear();
  }
}
