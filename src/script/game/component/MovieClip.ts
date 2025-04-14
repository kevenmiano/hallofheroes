import { GameLoadNeedData } from "../battle/data/GameLoadNeedData";

/**
 * 展示动画
 * 动画适配老项目 MovieClip
 * @author jeremy.xu
 */
export class MovieClip extends Laya.Animation {
  private _data: GameLoadNeedData;
  public get data(): GameLoadNeedData {
    return this._data;
  }

  public set data(value: GameLoadNeedData) {
    this._data = value;
  }

  private _funcs: Map<string, Function>;
  private _currentLabel: string;
  private _completeFunc: Function;

  //当前播放的动画缓存名称
  private _curCacheName: string;
  public get curCacheName(): string {
    return this._curCacheName;
  }

  public set curCacheName(value: string) {
    this._curCacheName = value;
  }

  private _step: number;
  get step(): number {
    return this._step;
  }

  set step(value: number) {
    this._step = value;
    super.interval = value;
  }

  shadow: any;

  //挂点 加载资源后从配置读取
  pos_head: Laya.Point;
  pos_body: Laya.Point;
  pos_leg: Laya.Point;

  /**
   * 特效挂点在人物身上  记录挂在那个部位
   * BaseRoleInfo.POS_HEAD
   * BaseRoleInfo.POS_BODY
   * BaseRoleInfo.POS_LEG
   */
  mountPt: number = 0;

  constructor(cachename?: string) {
    super();

    if (cachename) {
      this._curCacheName = cachename;
    }
    this._funcs = new Map<string, Function>();
    this.on(Laya.Event.COMPLETE, this, this.onCompelete);
    this.on(Laya.Event.LABEL, this, this.onLabel);
  }

  onDestroy() {
    this._funcs = null;
    this.off(Laya.Event.COMPLETE, this, this.onCompelete);
    this.off(Laya.Event.LABEL, this, this.onLabel);
  }

  //当前帧
  get currentFrame(): number {
    return this.index;
  }

  //总帧数
  get totalFrames(): number {
    return this.count;
  }

  //标签 正在播放的动画名称 ActionLabesType
  set currentLabel(value: string) {
    this._currentLabel = value;
  }

  get currentLabel(): string {
    return this._currentLabel;
  }

  /*
   * @param start 指定动画播放开始的索引(int)或帧标签(String)
   * @param loop 是否循环播放。
   * @param name 动画缓存名字的后部分 ActionLabesType
   */
  gotoAndPlay(start?: any, loop: boolean = false, name: string = ""): boolean {
    let cacheName;
    //先这样处理 兼容技能动画
    if (this.curCacheName) {
      cacheName = this.curCacheName;
    } else if (this.data) {
      cacheName = this.data.getCacheName(name);
      this.currentLabel = name;
    } else {
      cacheName = name;
    }

    if (!cacheName || cacheName == undefined) {
      return false;
    }

    this.play(start, loop, cacheName);
    return true;
  }

  /**
   * 动画只创建 未设置frames  需要播放一次 否则会显示不了
   * @param position  帧索引或帧标签
   * @param name  动画缓存名字的后部分
   */
  gotoAndStopEX(position: any, name: string) {
    let cacheName;
    //先这样处理 兼容技能
    if (this.curCacheName) {
      cacheName = this.curCacheName;
    } else if (this.data) {
      if (name) {
        cacheName = this.data.getCacheName(name);
        this.currentLabel = name;
      }
    } else {
      cacheName = name;
    }

    if (!cacheName) {
      return;
    }

    this.play(0, false, cacheName);
    super.gotoAndStop(position);
  }

  // 添加回调脚本
  addFrameScript(...parameters: any[]) {
    if (!parameters) {
      this._completeFunc = null;
      return;
    }

    if (parameters.length > 1) {
      let obj: any = parameters[0];
      let func: Function = parameters[1];
      let key = "";
      let index = 0;
      if (typeof obj == "number") {
        key = obj.toString();
        index = obj;
      } else {
        key = obj.key;
        index = obj.index;
      }

      this._funcs.set(key, func);
      this.addLabel(key, index);
    } else if (parameters.length == 1) {
      this._completeFunc = parameters[0];
    }
  }

  onCompelete() {
    this._completeFunc && this._completeFunc();
  }

  onLabel(label: any) {
    if (label) {
      let func = this._funcs.get(String(label));
      func && func();
      this._funcs.delete(label);
      this.removeLabel(label);
    }
  }
}
