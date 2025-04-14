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

export class TransactionBase implements ISocketTransaction {
  protected _pkg: PackageIn;

  constructor() {}

  public disposeWhenComplete(): boolean {
    return false;
  }

  public isHandleInQueue(): boolean {
    return false;
  }

  public getCode(): number {
    return 0;
  }

  public handlePackage() {}

  public execute(param: object = null) {}

  public configure(param: object) {
    this._pkg = param as PackageIn;
  }

  public finish() {}

  public get isFinished(): boolean {
    return false;
  }

  public dispose() {}
}
