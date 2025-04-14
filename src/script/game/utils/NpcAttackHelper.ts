import { CampaignManager } from "../manager/CampaignManager";
import { CampaignArmyView } from "../map/campaign/view/physics/CampaignArmyView";
import Tiles from "../map/space/constant/Tiles";
import { CampaignNode } from "../map/space/data/CampaignNode";
import StringHelper from "../../core/utils/StringHelper";
import { NpcAvatarView } from "../map/campaign/view/physics/NpcAvatarView";
import Logger from "../../core/logger/Logger";

/**
 *
 * 攻击NPC帮助类
 *
 */
export class NpcAttackHelper {
  constructor() {}
  public static npcAttackMove(npc: NpcAvatarView, player: CampaignArmyView) {}

  public static getAttackPointImp(
    info: any,
    attackPoint: Laya.Point,
    findCnt: number = 20,
  ): Laya.Point {
    // Logger.xjy("[NpcAttackHelper]getAttackPointImp attackPoint", attackPoint.x, attackPoint.y)
    if (info instanceof CampaignNode) {
      var attack: number = (<CampaignNode>info).handlerRange;
      var count: number = 0;
      var isWalk: boolean = false;
      if (attack > 0) {
        while (!isWalk && count < findCnt) {
          count++;
          var offX: number = NpcAttackHelper.getRandomByValue(attack);
          var offY: number = NpcAttackHelper.getRandomByValue(attack);

          let gridX = parseInt((attackPoint.x / 20).toString());
          let gridY = parseInt((attackPoint.y / 20).toString());
          var b: boolean = CampaignManager.Instance.mapModel.getWalkable(
            gridX,
            gridY,
          );
          var b2: boolean = CampaignManager.Instance.mapModel.getWalkable(
            gridX + offX,
            gridY + offY,
          );
          var bNotOutRange =
            Math.ceil(Math.sqrt(offX * offX + offY * offY)) <= attack;
          // Logger.xjy("[NpcAttackHelper]getAttackPointImp 偏移宽度", offX * Tiles.WIDTH, offY * Tiles.HEIGHT, b, b2, bNotOutRange);
          if (b && b2 && bNotOutRange) {
            attackPoint.x += offX * Tiles.WIDTH;
            attackPoint.y += offY * Tiles.HEIGHT;

            isWalk = true;
          }
        }
      }
    }
    // Logger.xjy("[NpcAttackHelper]getAttackPointImp 调整attackPoint", attackPoint.x, attackPoint.y)
    return attackPoint;
  }
  private static getRandomByValue(value: number): number {
    var off: number = Math.round(Math.random() * value);
    return parseInt((Math.random() * 1000).toString()) % 2 == 0 ? -off : off;
  }

  /**
   * 得到节点的攻击站位点 人物移动到此点
   * @param info
   * @param star
   * @param end
   * @return
   *
   */
  public static getAttackPoint(
    info: CampaignNode,
    star: Laya.Point,
    end: Laya.Point,
  ): Laya.Point {
    var attack: number = info.handlerRange;
    attack = attack * Tiles.WIDTH;
    var leng: number = star.distance(end.x, end.y);
    var tar: Laya.Point;
    for (var i: number = attack; i >= 0; i) {
      tar = StringHelper.interpolate(star, end, i / leng);
      var b: boolean = CampaignManager.Instance.mapModel.getWalkable(
        parseInt((tar.x / 20).toString()),
        parseInt((tar.y / 20).toString()),
      );
      if (b) {
        break;
      }
      i -= Tiles.WIDTH;
      if (i < 0) {
        tar = null;
        break;
      }
    }
    // Logger.xjy("[NpcAttackHelper]getAttackPoint", end.x, end.y, tar)
    if (tar) return tar;
    return NpcAttackHelper.getAttackPointImp(info, end);
  }
}
