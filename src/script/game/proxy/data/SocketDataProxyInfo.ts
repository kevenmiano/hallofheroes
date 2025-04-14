import { PackageIn } from "../../../core/net/PackageIn";

export class SocketDataProxyInfo {
  public data: PackageIn;
  public eventType: string;
  constructor($d: PackageIn, $e: string) {
    this.data = $d;
    this.eventType = $e;
  }
}
