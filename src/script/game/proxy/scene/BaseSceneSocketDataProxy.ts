import { PackageIn } from "../../../core/net/PackageIn";
import { SocketDataProxyModel } from "../data/SocketDataProxyModel";
import Logger from "../../../core/logger/Logger";
import { SocketDataProxyInfo } from "../data/SocketDataProxyInfo";

export class BaseSceneSocketDataProxy {
  private _model: SocketDataProxyModel;

  constructor($model: SocketDataProxyModel) {
    this._model = $model;
    this.proxyStart();
  }

  protected proxyStart() {}

  /**
   * proxy对数据包的处理
   * @param pkg
   */
  protected __onDataHandler(pkg: PackageIn) {
    Logger.yyz("__onDataHandler:");
    this._model &&
      this._model.addSocketData(
        new SocketDataProxyInfo(pkg, pkg.code.toString()),
        this.sceneType
      );
  }

  public get sceneType(): string {
    throw new Error("请重载该方法");
    return "";
  }

  protected proxyOver() {}

  public dispose() {
    this._model.readSceneSocketData(this.sceneType);
    this.proxyOver();
    this._model = null;
  }
}
