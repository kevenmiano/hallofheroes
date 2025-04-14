import { BaseArmy } from "./BaseArmy";

/**
 * 系统军队
 * 服务端有一次转换SysArmy to SystemArmy, 因为list不能进行get and set
 * @author leili
 *
 */
export class SystemArmy extends BaseArmy {
  constructor() {
    super();
  }
}
