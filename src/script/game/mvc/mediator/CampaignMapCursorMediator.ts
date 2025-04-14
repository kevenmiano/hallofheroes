import StringHelper from "../../../core/utils/StringHelper";
import { ArmyState } from "../../constant/ArmyState";
import { PlayerInfo } from "../../datas/playerinfo/PlayerInfo";
import { PlayerModel } from "../../datas/playerinfo/PlayerModel";
import { IMediator } from "@/script/game/interfaces/Mediator";
import { CampaignManager } from "../../manager/CampaignManager";
import { ConsortiaManager } from "../../manager/ConsortiaManager";
import { CursorManagerII } from "../../manager/CursorManagerII";
import DragManager from "../../manager/DragManager";
import FreedomTeamManager from "../../manager/FreedomTeamManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { HeroAvatar } from "../../map/avatar/view/HeroAvatar";
import { CampaignArmyViewHelper } from "../../map/campaign/CampaignArmyViewHelper";
import { CampaignArmy } from "../../map/campaign/data/CampaignArmy";
import { CampaignArmyState } from "../../map/campaign/data/CampaignArmyState";
import { CampaignMapView } from "../../map/campaign/view/CampaignMapView";
import { CampaignNpcPhysics } from "../../map/campaign/view/physics/CampaignNpcPhysics";
import { MineralArmyView } from "../../map/campaign/view/physics/MineralArmyView";
import { NpcAvatarView } from "../../map/campaign/view/physics/NpcAvatarView";
import { PetLandArmyView } from "../../map/campaign/view/physics/PetLandArmyView";
import { PosType } from "../../map/space/constant/PosType";
import { CampaignNode } from "../../map/space/data/CampaignNode";
import { BagHelper } from "../../module/bag/utils/BagHelper";
import { ConsortiaSecretInfo } from "../../module/consortia/data/ConsortiaSecretInfo";
import { WorldBossHelper } from "../../utils/WorldBossHelper";
import { CampaignMapModel } from "../model/CampaignMapModel";

/**
 *副本地图的鼠标光标控制
 *
 */
export class CampaignMapCursorMediator implements IMediator {
  constructor() {}

  private _timeId: any = 0;
  private _mouseDownPoint: Laya.Point;
  private _mouseDown: boolean = false;
  private _target: any;
  public register(target: any) {
    this._target = target;
    target.on(Laya.Event.MOUSE_MOVE, this, this.__mouseMoveHandler);
    target.on(Laya.Event.ROLL_OUT, this, this.__mouseOutHandler);
    target.on(Laya.Event.MOUSE_DOWN, this, this.__mouseDownHandler);
    target.on(Laya.Event.MOUSE_UP, this, this.__mouseUpHandler);
  }
  public unregister(target: any) {
    target.off(Laya.Event.MOUSE_MOVE, this, this.__mouseMoveHandler);
    target.off(Laya.Event.ROLL_OUT, this, this.__mouseOutHandler);
    target.off(Laya.Event.MOUSE_DOWN, this, this.__mouseDownHandler);
    target.off(Laya.Event.MOUSE_UP, this, this.__mouseUpHandler);
    CursorManagerII.Instance.resetCursor();
    this._target = null;
  }
  private __mouseDownHandler(evt: Laya.Event) {
    if (BagHelper.Instance.isSelling) return;
    if (DragManager.Instance.isDraging) return;
    this._mouseDown = true;
    if (this._timeId != 0) clearInterval(this._timeId);
    this._timeId = setTimeout(this.startDragCall.bind(this), 300);
  }

  private __mouseUpHandler(evt: Laya.Event) {
    if (BagHelper.Instance.isSelling) return;
    if (DragManager.Instance.isDraging) return;
    this._mouseDown = false;
    this.startDragCall();
  }

  private __mouseOutHandler(evt: Laya.Event) {
    if (BagHelper.Instance.isSelling) return;
    if (DragManager.Instance.isDraging) return;
    this._mouseDown = false;
    if (CursorManagerII.Instance.currentState != CursorManagerII.SELL_CIRSOR)
      CursorManagerII.Instance.resetCursor();
    this.startDragCall();
  }

  private __mouseMoveHandler(evt: Laya.Event) {
    if (BagHelper.Instance.isSelling) return;
    if (DragManager.Instance.isDraging) return;
    this.refreshCursor(evt, this._target);
  }
  private startDragCall() {
    clearInterval(this._timeId);
    this._timeId = 0;
  }
  /**
   * 更新鼠标手型
   * @param evt
   * @param target
   *
   */
  private refreshCursor(evt: Laya.Event, target: object) {
    if (CursorManagerII.Instance.currentState == CursorManagerII.DRAG_CURSOR)
      return;
    var pixel: number = 0;
    var mapView: CampaignMapView = CampaignManager.Instance.mapView;
    if (!this.mapModel.mapTielsData) return;
    var attack: boolean = mapView.npcLayer.mouseMoveHandler(evt);
    var isSelling: boolean = BagHelper.Instance.isSelling;
    if (isSelling) return;
    if (attack) {
      if (
        CursorManagerII.Instance.currentState != CursorManagerII.ATTACK_CURSOR
      ) {
        CursorManagerII.Instance.showCursorByType(
          CursorManagerII.ATTACK_CURSOR,
        );
      }
      return;
    }

    var nodeInfo: CampaignNode;
    if (evt.target instanceof CampaignNpcPhysics) {
      var node: CampaignNpcPhysics = evt.target;
      nodeInfo = node.info as CampaignNode;
      if (CampaignArmyViewHelper.checkCollectionNode(nodeInfo)) {
        let mapModel = CampaignManager.Instance.mapModel;
        if (mapModel && WorldBossHelper.checkPvp(mapModel.mapId)) {
          if (node.isMouseInHandleRangle(evt)) {
            if (
              CursorManagerII.Instance.currentState !=
              CursorManagerII.COLLECT_CURSOR
            ) {
              CursorManagerII.Instance.showCursorByType(
                CursorManagerII.COLLECT_CURSOR,
              );
            }
          } else {
            CursorManagerII.Instance.showCursorByType(
              CursorManagerII.DEFAULT_CURSOR,
            );
          }
          return;
        }
        if (
          CursorManagerII.Instance.currentState !=
          CursorManagerII.COLLECT_CURSOR
        ) {
          CursorManagerII.Instance.showCursorByType(
            CursorManagerII.COLLECT_CURSOR,
          );
        }
        return;
      }
      if (CampaignArmyViewHelper.checkTreeNode(nodeInfo)) {
        switch (ConsortiaManager.Instance.model.secretInfo.treeState) {
          case ConsortiaSecretInfo.GIVE_POWER_STATE:
            if (
              CursorManagerII.Instance.currentState !=
              CursorManagerII.WATER_CURSOR
            ) {
              CursorManagerII.Instance.showCursorByType(
                CursorManagerII.WATER_CURSOR,
              );
            }
            return;
        }
      }
      if (CampaignArmyViewHelper.checkAttackNode(nodeInfo)) {
        if (
          WorldBossHelper.checkGvg(CampaignManager.Instance.mapModel.mapId) &&
          CampaignManager.Instance.mapModel.selfMemberData.teamId !=
            nodeInfo.param1
        ) {
          if (
            CursorManagerII.Instance.currentState !=
            CursorManagerII.ATTACK_CURSOR
          ) {
            CursorManagerII.Instance.showCursorByType(
              CursorManagerII.ATTACK_CURSOR,
            );
          }
          return;
        }
      }
    } else if (evt.target instanceof NpcAvatarView) {
      var npc: NpcAvatarView = evt.target as NpcAvatarView;
      if (npc.avatarView instanceof HeroAvatar) {
        pixel = (npc.avatarView as HeroAvatar).getCurrentPixels();
        if (pixel > 50) {
          nodeInfo = npc.nodeInfo as CampaignNode;
          if (CampaignArmyViewHelper.checkCollectionNode(nodeInfo)) {
            //可采集
            if (
              CursorManagerII.Instance.currentState !=
              CursorManagerII.COLLECT_CURSOR
            ) {
              CursorManagerII.Instance.showCursorByType(
                CursorManagerII.COLLECT_CURSOR,
              );
            }
            return;
          } else if (nodeInfo.info.types == PosType.COPY_HANDLER) {
            if (
              CursorManagerII.Instance.currentState !=
              CursorManagerII.SPACE_NPC_CURSOR
            ) {
              CursorManagerII.Instance.showCursorByType(
                CursorManagerII.SPACE_NPC_CURSOR,
              );
            }
            return;
          }
        }
      }
      // else if (npc.avatarView instanceof SharedAvatar) {
      // 	pixel = (npc.avatarView as SharedAvatar).getCurrentPixels();
      // 	var car: MineralCarView = <MineralCarView>npc;
      // 	if (pixel > 50 && car && !this.isSelfConsortia(car.armyInfo)) {
      // 		if (CursorManagerII.Instance.currentState != CursorManagerII.ATTACK_CURSOR) {
      // 			CursorManagerII.Instance.showCursorByType(CursorManagerII.ATTACK_CURSOR);
      // 		}
      // 		return;
      // 	}
      // }
    } else if (evt.target instanceof PetLandArmyView) {
      var armyView: PetLandArmyView = evt.target as PetLandArmyView;
      if (armyView.avatarView instanceof HeroAvatar) {
        pixel = (armyView.avatarView as HeroAvatar).getCurrentPixels();
        if (pixel > 50) {
          if (
            CursorManagerII.Instance.currentState !=
            CursorManagerII.SPACE_PLAYER_CURSOR
          ) {
            CursorManagerII.Instance.showCursorByType(
              CursorManagerII.SPACE_PLAYER_CURSOR,
            );
          }
          return;
        }
      }
    } else if (evt.target instanceof MineralArmyView) {
      var armyView1: MineralArmyView = evt.target as MineralArmyView;
      if (armyView1.avatarView instanceof HeroAvatar) {
        pixel = (armyView1.avatarView as HeroAvatar).getCurrentPixels();
        if (pixel > 50) {
          if (
            !CampaignArmyState.checkDied(armyView1.data.isDie) &&
            armyView1.data.state != ArmyState.STATE_FIGHT
          ) {
            if (
              this.isSelfConsortia(armyView1.data) ||
              this.isSelfTeam(armyView1.data)
            ) {
              CursorManagerII.Instance.showCursorByType(
                CursorManagerII.SPACE_PLAYER_CURSOR,
              );
            } else {
              CursorManagerII.Instance.showCursorByType(
                CursorManagerII.ATTACK_CURSOR,
              );
            }
          }
          return;
        }
      }
    }
    CursorManagerII.Instance.showCursorByType(CursorManagerII.DEFAULT_CURSOR);
  }
  private isSelfConsortia(army: CampaignArmy): boolean {
    if (army && army.baseHero) {
      if (StringHelper.isNullOrEmpty(army.baseHero.consortiaName)) return false;
      if (StringHelper.isNullOrEmpty(this.playerInfo.consortiaName))
        return false;
      if (this.mapModel.isCross) {
        var consortiaID: number =
          PlayerManager.Instance.currentPlayerModel.playerInfo.consortiaID;
        return (
          army.baseHero.consortiaName == this.playerInfo.consortiaName &&
          army.baseHero.consortiaID == consortiaID
        );
      } else {
        return army.baseHero.consortiaName == this.playerInfo.consortiaName;
      }
    }
    return false;
  }

  private isSelfTeam(army: CampaignArmy): boolean {
    if (army && army.baseHero) {
      if (FreedomTeamManager.Instance.inMyTeam(army.userId)) {
        return true;
      }
    }
    return false;
  }

  private get playerInfo(): PlayerInfo {
    return PlayerManager.Instance.currentPlayerModel.playerInfo;
  }

  private get mapModel(): CampaignMapModel {
    return CampaignManager.Instance.mapModel;
  }
}
