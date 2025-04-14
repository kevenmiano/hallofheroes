import { GameSocket } from "../net/GameSocket.js";
import { PackageIn } from "../net/PackageIn.js";
import { PackageOut } from "../net/PackageOut.js";
import WeakNetCheckModel from "./WeakNetCheckModel.js";

/**
 * 弱网检查
 */
export default class WeakNetCheckController {
  private _model: WeakNetCheckModel;
  constructor(bs: GameSocket) {
    this._model = WeakNetCheckModel.Instance;
    this._model.start();
  }

  public addPackage(pkg: PackageOut) {
    this._model.addPackage(pkg);
  }

  public revPackage(pkg: PackageIn) {
    this._model.revPackage(pkg);
  }

  public get model() {
    return this._model;
  }
}
