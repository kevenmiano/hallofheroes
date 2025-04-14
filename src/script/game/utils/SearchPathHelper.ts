import { CampaignManager } from "../manager/CampaignManager";

/**
 * 寻路相关
 *
 *
 */
export class SearchPathHelper {
  constructor() {}

  public static searchPath(cur: Laya.Point, next: Laya.Point): any[] {
    return CampaignManager.Instance.controller.findPath.find(
      new Laya.Point(
        parseInt((cur.x / 20).toString()),
        parseInt((cur.y / 20).toString()),
      ),
      new Laya.Point(
        parseInt((next.x / 20).toString()),
        parseInt((next.y / 20).toString()),
      ),
    );
  }

  public static astartFindPath(cur: Laya.Point, next: Laya.Point): any[] {
    return CampaignManager.Instance.mapModel.aStarPathFinder(cur, next);
  }

  public static checkWalkable(pt: Laya.Point): boolean {
    return CampaignManager.Instance.mapModel.checkWalkable(pt);
  }
}
