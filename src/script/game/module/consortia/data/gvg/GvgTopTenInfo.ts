import GameEventDispatcher from "../../../../../core/event/GameEventDispatcher";
import { GvgContributionInfo } from "./GvgContributionInfo";
/**
 * 公会战贡献榜信息 <br/>
 * 相关类: GvgContributionInfo
 *
 */

export class GvgTopTenInfo extends GameEventDispatcher {
  public inWarNum: number = 0;
  public reward_honor: number = 0;
  public reward_medal: number = 0;
  public contribution: number = 0;
  public contribution_precent: number = 0;
  public list: GvgContributionInfo[] = [];

  constructor() {
    super();
  }
}
