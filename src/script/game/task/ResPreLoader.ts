/**
 * 预加载任务
 */

import { Func } from "../../core/comps/Func";
import Logger from "../../core/logger/Logger";
import ResMgr from "../../core/res/ResMgr";
import { Sequence } from "../../core/task/Sequence";
import {
  ActionsExecutionMode,
  SequenceList,
} from "../../core/task/SequenceList";

export class PreLoadTask extends Sequence {
  private resName: string = "";
  private resType: string = "";

  constructor(resName: string, resType: string) {
    super();
    this.resName = resName;
    this.resType = resType;
  }

  protected onExecute() {
    super.onExecute();
    let loadUrl = this.resName;
    if (this.resType == Laya.Loader.IMAGE) {
      ResMgr.Instance.loadRes(
        loadUrl,
        (res: Laya.Texture) => {
          if (!res) {
            this.endAction(false);
          } else {
            this.endAction(true);
          }
        },
        null,
        Laya.Loader.IMAGE,
      );
    } else if (this.resType == Laya.Loader.ATLAS) {
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
 * @author:pzl
 * @description 资源预加载
 */
export default class ResPreLoader {
  private _resources: Array<any> = [];
  private _callback: Func = null;
  private _pathArray: any[];
  private _hasLoad: boolean = true;
  private _loadMode: ActionsExecutionMode;

  private downLoadList: SequenceList;

  /**
   * 预加载资源
   * @param res 加载资源数组[{resUrl:"",resType:Laya.Loader.ATLAS|laya.Loader.IMAGE}]
   * @param model 加载资源模式, ActionsExecutionMode  RunInSequence,//顺序执行 || RunInParallel//并行执行
   * @param callback 加载完成回调 Func
   */
  constructor(
    res: Array<any>,
    model: ActionsExecutionMode = ActionsExecutionMode.RunInParallel,
    callback: Func = null,
  ) {
    this._pathArray = this._resources;
    this._loadMode = model;
    this._callback = callback;
  }

  public startLoad() {
    this._hasLoad = false;
    let parallel = new SequenceList(this._loadMode);
    this.downLoadList = parallel;
    for (let index = 0; index < this._pathArray.length; index++) {
      let resName = this._pathArray[index].resUrl; //资源地址
      let resType = this._pathArray[index].resType; //资源类型
      parallel.addTask(new PreLoadTask(resName, resType));
    }
    new SequenceList(this._loadMode)
      .addTask(parallel)
      .setComplete(
        Laya.Handler.create(this, () => {
          Logger.log("任务完成");
          if (this._callback) {
            this._callback.Invoke();
          }
        }),
      )
      .execute(null);
  }

  dispose() {
    if (this.downLoadList) {
      this.downLoadList.clear();
    }
  }
}
