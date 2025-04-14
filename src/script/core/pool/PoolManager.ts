import FUI_SignInDayBtn from "../../../fui/Welfare/FUI_SignInDayBtn";

export default class PoolManager {
  private static _instance: PoolManager;
  pool: fairygui.GObjectPool;
  list: any[] = [];
  private _total: number;
  private _curSplitIndex: number;
  url: string;
  callback: any;
  timeLimit: number = 4; //执行时间 ms

  public static get instance(): PoolManager {
    if (!PoolManager._instance) PoolManager._instance = new PoolManager();
    return PoolManager._instance;
  }

  init() {
    if (!this.pool || this.pool.count == 0) {
      this.initPool(FUI_SignInDayBtn.URL, 42);
    }
  }

  getPool() {
    return this.pool;
    return this.clonePool(this.pool);
  }

  split(callback) {
    this.initSplit();
    this._total = 42;
    this._curSplitIndex = 0;
    this.pool = new fgui.GObjectPool();
    this.url = fgui.UIPackage.normalizeURL(FUI_SignInDayBtn.URL);
    this.callback = callback;
    Laya.timer.frameLoop(1, this, this.onSplitFrame);
  }

  onSplitFrame() {
    if (this._total > 0) {
      // let pool = new fgui.GObjectPool();
      let startTime = Date.now();
      for (let i = this._curSplitIndex; i < this._total; i++) {
        if (Date.now() - startTime > this.timeLimit) {
          this._curSplitIndex = i;
          // console.log('分帧', i);
          return;
        }

        let obj = fgui.UIPackage.createObjectFromURL(this.url);
        this.pool.returnObject(obj);
      }
    }
    if (this.callback) this.callback();
    this.initSplit();
  }

  initSplit() {
    Laya.timer.clear(this, this.onSplitFrame);
    this._total = 0;
    this._curSplitIndex = 0;
  }

  private initPool(url: string, count: number) {
    let pool = new fgui.GObjectPool();
    url = fgui.UIPackage.normalizeURL(url);
    if (url == null) return null;
    for (let i = 0; i < count; i++) {
      let obj = fgui.UIPackage.createObjectFromURL(url);
      pool.returnObject(obj);
    }
    this.pool = pool;
  }

  initItemList(url: string, count: number) {
    this.list = [];
    url = fgui.UIPackage.normalizeURL(url);
    if (url == null) return null;
    for (let i = 0; i < count; i++) {
      let obj = fgui.UIPackage.createObjectFromURL(url);
      obj.dispose = () => {};
      obj.displayObject.destroy = () => {};
      this.list.push(obj);
    }
  }

  getPoolFromList() {
    let pool = new fgui.GObjectPool();
    for (let i = 0; i < this.list.length; i++) {
      pool.returnObject(this.list[i]);
    }
    return pool;
  }

  private clonePool(pool: fairygui.GObjectPool) {
    return this.deepClone(pool, null);

    // let newPool = new fgui.GObjectPool();
    // pool = pool._pool;
    // for (const key in pool) {
    //   if (Object.prototype.hasOwnProperty.call(pool, key)) {
    //     const arr = pool[key];
    //     var cnt = arr.length;
    //     for (var i = 0; i < cnt; i++) newPool.returnObject(arr[i]);
    //   }
    // }
    // return newPool;
  }

  deepClone(source, cache) {
    if (!cache) {
      cache = new Map();
    }
    if (source instanceof Object) {
      // 不考虑跨 iframe
      if (cache.get(source)) {
        return cache.get(source);
      }
      let result;
      if (source instanceof Function) {
        if (source.prototype) {
          // 有 prototype 就是普通函数
          result = function () {
            return source.apply(this, arguments);
          };
        } else {
          result = (...args) => {
            return source.call(undefined, ...args);
          };
        }
      } else if (source instanceof Array) {
        result = [];
        //   } else if(source instanceof Date) {
        //     result = new Date(source - 0)
      } else if (source instanceof RegExp) {
        result = new RegExp(source.source, source.flags);
      } else {
        result = {};
      }
      cache.set(source, result);
      for (let key in source) {
        if (source.hasOwnProperty(key)) {
          result[key] = this.deepClone(source[key], cache);
        }
      }
      return result;
    } else {
      return source;
    }
  }
}
