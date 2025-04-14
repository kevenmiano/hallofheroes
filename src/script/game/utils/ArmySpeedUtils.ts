import { MountType } from "../module/mount/model/MountType";

export class ArmySpeedUtils {
  /**
   * 设置军队的速度
   * @param army
   * @return 计算的正常速度 默认7
   *
   */
  public static getMoveSpeed(army: any = null): number {
    var resultSpeed: number = 7;
    if (army) {
      if (army.mountTemplate) {
        if (army.mountTemplate.MountType == MountType.NORMAL) {
          resultSpeed = 8 + Math.ceil(army.mountGrade / 2);
          resultSpeed = Math.min(11, resultSpeed);
        } else {
          resultSpeed =
            8 +
            Math.ceil(army.mountGrade / 2) +
            parseInt((army.mountTemplate.Speed / 10).toString());
          resultSpeed = Math.min(11, resultSpeed);
        }
      } else {
        resultSpeed = 7;
      }
    }
    return resultSpeed;
  }
}
