import { StageReferance } from "../../../roadComponent/pickgliss/toplevel/StageReferance";

export class SpaceMapViewHelper {
  private static startY: number = 0;
  private static startX: number = -30;
  constructor() {}

  public static checkDistance(
    sx: number,
    sy: number,
    ex: number,
    ey: number,
  ): number {
    var dis: number = (sx - ex) * (sx - ex) + (sy - ey) * (sy - ey);
    return Math.sqrt(dis);
  }

  public static getCurrentMapRect(mapView: Laya.Sprite): Laya.Rectangle {
    var rect: Laya.Rectangle = new Laya.Rectangle();
    rect.x = -mapView.x;
    rect.y = -mapView.y;
    rect.width = StageReferance.stageWidth;
    rect.height = StageReferance.stageHeight;
    return rect;
  }
}
