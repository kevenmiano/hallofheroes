import { MapInfo } from "../space/data/MapInfo";

/**
 *  地图预加载的基类
 *  加载完成后回调
 */
export class PreLoadMapData {
  private _backCall: Function;
  protected _model: MapInfo;

  constructor(model: MapInfo) {
    this._model = model;
  }

  public syncBackCall(call: Function) {
    this._backCall = call;
    this.loadData();
  }

  protected loadData() {}

  protected backCall() {
    if (this._backCall != null) {
      this._backCall();
    }
    this._backCall = null;
    this._model = null;
  }
}
