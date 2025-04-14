import { PackageIn } from "../../../core/net/PackageIn";

export class PkgBuffer {
  public pkg: PackageIn;
  public time: number = 0;
  public callBack: Function;
  public leftTime: number = 0;
  constructor(
    $pkg: PackageIn,
    $time: number,
    $call: Function,
    $leftTime: number,
  ) {
    this.pkg = $pkg;
    this.time = $time;
    this.callBack = $call;
    this.leftTime = $leftTime;
  }
}
