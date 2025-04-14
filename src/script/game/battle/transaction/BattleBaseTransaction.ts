import { PackageIn } from "../../../core/net/PackageIn";
// import { ISocketTransaction } from "../../interfaces/ISocketTransaction";

interface ISocketTransaction {
  disposeWhenComplete(): boolean;
  isHandleInQueue(): boolean;
  getCode(): number;
  handlePackage(): void;
  execute(param?: object): void;
  configure(param: object): void;
  finish(): void;
  isFinished: boolean;
  dispose(): void;
}

export class BattleBaseTransaction implements ISocketTransaction {
  protected _pkg: PackageIn;

  constructor() {}

  public disposeWhenComplete(): boolean {
    return false;
  }

  public isHandleInQueue(): boolean {
    return false;
  }

  public getCode(): number {
    throw new Error("getCode()");
    return 0;
  }

  public handlePackage() {}

  public execute(param: object = null) {}

  public configure(param: object) {
    if (this._pkg) {
      this._pkg = null;
    }
    this._pkg = <PackageIn>param;
  }

  public finish() {}

  public get isFinished(): boolean {
    return false;
  }

  public dispose() {}
}
