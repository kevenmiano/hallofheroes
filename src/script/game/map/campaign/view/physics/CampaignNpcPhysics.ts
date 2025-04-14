import Logger from "../../../../../core/logger/Logger";
import { CampaignManager } from "../../../../manager/CampaignManager";
import { NpcAttackHelper } from "../../../../utils/NpcAttackHelper";
import { WorldBossHelper } from "../../../../utils/WorldBossHelper";
import { PosType } from "../../../space/constant/PosType";
import Tiles from "../../../space/constant/Tiles";
import { CampaignNode } from "../../../space/data/CampaignNode";
import { CampaignNpcView } from "./CampaignNpcView";

/**
 *
 * 钱袋, 宝箱等, 公会战里面的神秘塔、木材
 *
 */
export class CampaignNpcPhysics extends CampaignNpcView {
  constructor() {
    super();
  }

  public mouseClickHandler(evt: Laya.Event): boolean {
    return this.attackFun();
  }

  private attackFun(): boolean {
    if (!CampaignManager.Instance.mapModel) {
      return false;
    }
    if (!CampaignManager.Instance.mapModel.mapTielsData) {
      return false;
    }
    CampaignManager.Instance.mapModel.selectNode = <CampaignNode>this.info;
    let armyView: any = CampaignManager.Instance.controller.getArmyView(
      CampaignManager.Instance.mapModel.selfMemberData,
    );
    let attackPoint: Laya.Point;
    if (WorldBossHelper.checkPvp(CampaignManager.Instance.mapId)) {
      let globalPt = new Laya.Point(this.mouseX, this.mouseY);
      // this.img.x = this.mouseX
      // this.img.y = this.mouseY
      this.localToGlobal(globalPt, false, this.parent as Laya.Sprite);
      let walkable = CampaignManager.Instance.controller.getWalkable(
        globalPt.x / Tiles.WIDTH,
        globalPt.y / Tiles.HEIGHT,
      );
      Logger.xjy(
        "[CampaignNpcPhysics]attackFun点击位置",
        this.mouseX,
        this.mouseY,
        globalPt.x,
        globalPt.y,
        walkable,
      );
      if (walkable) {
        attackPoint = globalPt;
      } else {
        // 战场采矿找随机范围内点站立
        attackPoint = NpcAttackHelper.getAttackPointImp(
          <CampaignNode>this.info,
          new Laya.Point(this.x, this.y),
          50,
        );
      }
    } else {
      attackPoint = NpcAttackHelper.getAttackPoint(
        <CampaignNode>this.info,
        new Laya.Point(armyView.x, armyView.y),
        new Laya.Point(this.x, this.y),
      );
    }
    Logger.xjy(
      "[CampaignNpcPhysics]attackFun",
      (this.info as CampaignNode).nodeId,
      "玩家位置",
      armyView.x,
      armyView.y,
      "节点位置",
      this.x,
      this.y,
      "攻击位置",
      attackPoint.x,
      attackPoint.y,
    );
    // this.walkFlag.x = attackPoint.x - this.x + this.footX
    // this.walkFlag.y = attackPoint.y - this.y + this.footY
    CampaignManager.Instance.controller.moveArmyByPos(
      attackPoint.x,
      attackPoint.y,
      false,
      true,
    );
    return true;
  }

  public mouseMoveHandler(evt: Laya.Event): boolean {
    if (!CampaignManager.Instance.mapModel) {
      return false;
    }
    let mapId: number = CampaignManager.Instance.mapModel.mapId;
    if (WorldBossHelper.checkGvg(mapId)) {
      let selfTeamId: number =
        CampaignManager.Instance.mapModel.selfMemberData.teamId;
      let nodeTeamId: number = (<CampaignNode>this.info).param1;
      if (
        this.info.info.types == PosType.COPY_START ||
        this.info.info.types == PosType.COPY_END
      ) {
        return false;
      }
      if (nodeTeamId > 0 && nodeTeamId != selfTeamId) {
        return true;
      }
    }
    return false;
  }
}
