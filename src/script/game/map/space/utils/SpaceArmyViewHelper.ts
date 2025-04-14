import { CampaignManager } from "../../../manager/CampaignManager";
import { BaseArmyAiInfo } from "../../ai/BaseArmyAiInfo";
import { NodeState } from "../constant/NodeState";
import SpaceNodeType from "../constant/SpaceNodeType";
import Tiles from "../constant/Tiles";
import SpaceArmy from "../data/SpaceArmy";
import { SpaceNode } from "../data/SpaceNode";
import SpaceManager from "../SpaceManager";
import { SpaceModel } from "../SpaceModel";
import { SpaceSocketOutManager } from "../SpaceSocketOutManager";
import { SpaceNpcView } from "../view/physics/SpaceNpcView";
import UIManager from "../../../../core/ui/UIManager";
import { EmWindow } from "../../../constant/UIDefine";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import SpaceNpcAttackHelper from "./SpaceNpcAttackHelper";
import { ShopGoodsInfo } from "../../../module/shop/model/ShopGoodsInfo";
import { AvatarActions } from "../../../avatar/data/AvatarActions";
import { t_s_rewardcondictionData } from "../../../config/t_s_rewardcondiction";
import { SpaceEvent } from "../../../constant/event/NotificationEvent";
import { NotificationManager } from "../../../manager/NotificationManager";
import RingTaskManager from "../../../manager/RingTaskManager";
import { RingTask } from "../../../module/ringtask/RingTask";
import { AiStateType } from "../constant/AiStateType";
import { ConfigManager } from "../../../manager/ConfigManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import LangManager from "../../../../core/lang/LangManager";

export class SpaceArmyViewHelper {
  public static VISIBLE_RANGE: number = 1000;
  public static robotVisibleTest(posX: number, posY: number): boolean {
    let start: Laya.Point = SpaceArmyViewHelper.model.nextPoint;
    if (!start) {
      let selfInfo: SpaceArmy = SpaceArmyViewHelper.model.selfArmy;
      if (!selfInfo) {
        return false;
      }
      let armyView: any =
        CampaignManager.Instance.controller.getArmyView(selfInfo);
      if (!armyView) {
        return false;
      }
      start = new Laya.Point(armyView.x, armyView.y);
    }
    let end: Laya.Point = new Laya.Point(posX, posY);
    let dis: number = start.distance(end.x, end.y);
    if (dis <= SpaceArmyViewHelper.VISIBLE_RANGE) {
      return true;
    }
    return false;
  }

  public static visitNode(nodeInfo: SpaceNode) {
    let armyView: any = SpaceManager.Instance.controller.getArmyView(
      SpaceArmyViewHelper.model.selfArmy,
    );
    if (
      nodeInfo == SpaceArmyViewHelper.model.selectNode &&
      SpaceArmyViewHelper.getNodeInRange(armyView)
    ) {
      SpaceArmyViewHelper.nodeTrigger(nodeInfo);
    } else {
      if (SpaceArmyViewHelper.model.selectNode) {
        if (SpaceArmyViewHelper.model.selectNode.dialogue) {
          UIManager.Instance.HideWind(EmWindow.SpaceDialogWnd);
        }
        if (SpaceArmyViewHelper.model.selectNode.param3) {
          let option: any[] =
            SpaceArmyViewHelper.model.selectNode.param3.split(",");
          let type: number = parseInt(option[0]);
          SpaceArmyViewHelper.closeNodeFrame(type);
        }
        SpaceArmyViewHelper.model.checkNodeId = -1;
      }
      SpaceArmyViewHelper.model.selectNode = nodeInfo;
      let selfInfo: SpaceArmy = SpaceArmyViewHelper.model.selfArmy;
      let attackPoint: Laya.Point;
      if (nodeInfo.info.types == SpaceNodeType.MOVEMENT) {
        attackPoint = SpaceNpcAttackHelper.getAttackPoint(
          nodeInfo,
          new Laya.Point(armyView.x, armyView.y),
          new Laya.Point(nodeInfo.x, nodeInfo.y),
        );
      } else {
        attackPoint = new Laya.Point(nodeInfo.x, nodeInfo.y);
      }
      SpaceManager.Instance.controller.moveArmyByPos(
        attackPoint.x,
        attackPoint.y,
      );
    }
  }

  public static selfArmyToEnd(aiInfo: BaseArmyAiInfo, target: any): boolean {
    let nodeInfo: SpaceNode = SpaceArmyViewHelper.getNodeInRange(target);
    if (!nodeInfo) {
      nodeInfo = SpaceArmyViewHelper.model.getHandlerNode(
        SpaceArmyViewHelper.viewPosXToInfoPosX(target.x),
        SpaceArmyViewHelper.viewPosYToInfoPosY(target.y),
      );
      if (nodeInfo && nodeInfo.param1 != SpaceNodeType.PARAM_TRANSFER) {
        return false;
      }
    }
    if (!nodeInfo) {
      return false;
    }
    this.nodeTrigger(nodeInfo);
    return true;
  }

  private static nodeTrigger(node: SpaceNode) {
    let param3Arr: any[] = node.param3.split(",");
    if (node.info.types == SpaceNodeType.MOVEMENT) {
      let npc: any = SpaceManager.Instance.controller.getNpcView(node);
      let selfInfo: SpaceArmy = SpaceArmyViewHelper.model.selfArmy;
      let armyView: any =
        SpaceManager.Instance.controller.getArmyView(selfInfo);
      let p: Laya.Point = new Laya.Point(npc.x, npc.y);
      let angle: number = Math.atan2(p.y - armyView.y, p.x - armyView.x);
      let tempAngle: number = (angle * 180) / Math.PI;
      if (tempAngle < 0) tempAngle += 360;
      if (npc instanceof SpaceNpcView) {
        npc.avatarView.angle = tempAngle;
        if (npc.aiInfo.moveState != AiStateType.NPC_BEING_VISIT) {
          npc.aiInfo.moveState = AiStateType.STAND;
        }
      } else {
        npc.angle = tempAngle;
        npc.aiInfo.moveState = AiStateType.STAND;
        npc.action(AvatarActions.ACTION_STOP, npc.currentDirection);
      }
      NotificationManager.Instance.dispatchEvent(
        SpaceEvent.SELECT_NODE,
        node.info.id,
      );
    } else {
      if (param3Arr[0] == "12") {
        let ringtask: RingTask = RingTaskManager.Instance.getRingTask();
        if (!ringtask) {
          return;
        }
        let condition: t_s_rewardcondictionData = ringtask
          .conditionList[0] as t_s_rewardcondictionData;
        if (condition.CondictionType != 4) {
          //不是采集
          return;
        }
        if (condition.Para1 + "" != node.param4) {
          return;
        }
        if (ringtask.isCompleted) {
          return;
        }
      }
      SpaceSocketOutManager.Instance.nodeTrigger(node.nodeId);
    }
  }

  public static getOpenType(type: number): number | null {
    let openType: number = null;
    switch (type) {
      case 8:
        openType = ShopGoodsInfo.PET_EXCHANGE_SHOPTYPE;
        break;
      case 10:
        openType = ShopGoodsInfo.MINERAL_SHOP;
        break;
      case 9:
        // openType = PetChallengeController.PetChallengeFrame;
        break;
      case 13:
        // openType = TreasureMapModel.OPEN_GET_FRAME;
        break;
      default:
        break;
    }
    return openType;
  }

  public static openNodeFrame(type: number) {
    switch (type) {
      case 1:
        UIManager.Instance.ShowWind(EmWindow.OfferRewardWnd);
        break;
      case 2:
        // FrameCtrlManager.Instance.open(EmWindow.PveRoomList);
        FrameCtrlManager.Instance.open(EmWindow.PveMultiCampaignWnd);
        break;
      case 3:
        FrameCtrlManager.Instance.open(EmWindow.PvpGate);
        break;
      case 4:
        SimpleAlertHelper.Instance.Show(
          undefined,
          null,
          "",
          LangManager.Instance.GetTranslation("public.unopen"),
        );
        break;
      case 5:
        FrameCtrlManager.Instance.open(EmWindow.OuterCityShopWnd);
        break;
      case 8:
        UIManager.Instance.ShowWind(EmWindow.PetExchangeShopWnd);
        break;
      case 10: //紫晶商店
        FrameCtrlManager.Instance.open(EmWindow.MineralShopWnd);
        break;
      case 9:
        FrameCtrlManager.Instance.open(EmWindow.PetChallenge);
        break;
      case 13:
        SimpleAlertHelper.Instance.Show(
          undefined,
          null,
          "",
          LangManager.Instance.GetTranslation("public.unopen"),
        );
        break;
      case 14:
        FrameCtrlManager.Instance.open(EmWindow.SinglePassWnd);
        break;
      default:
        break;
    }
  }

  public static closeNodeFrame(type: number) {
    switch (type) {
      case 1:
        UIManager.Instance.HideWind(EmWindow.OfferRewardWnd);
        break;
      case 2:
        FrameCtrlManager.Instance.exit(EmWindow.PveMultiCampaignWnd);
        // frame = UIModuleTypes.PVE_ROOMLIST;
        break;
      case 3:
        FrameCtrlManager.Instance.exit(EmWindow.PvpGate);
        // frame = UIModuleTypes.PVP;
        break;
      case 4:
        // frame = UIModuleTypes.VEHICLE_DAIMON_TRAIL;
        break;
      case 5:
        // frame = UIModuleTypes.SuperMarket;
        break;
      case 8:
      case 10:
        // frame = UIModuleTypes.SHOP;
        break;
      case 9:
        // frame = UIModuleTypes.PET_CHALLENGE;
        break;
      case 13:
        // frame = UIModuleTypes.TREASURE_MAP;
        break;
      case 14:
        // frame = UIModuleTypes.SINGLEPASS;
        break;
      default:
        break;
    }
  }

  public static openNodeDialog() {
    UIManager.Instance.ShowWind(EmWindow.SpaceDialogWnd);
    // FrameControllerManager.Instance.spaceController.closeFrame();
    // FrameControllerManager.Instance.openControllerByInfo(UIModuleTypes.SPACE, SpaceController.DIALOG);
  }

  public static closeNodeDialog() {
    // FrameControllerManager.Instance.spaceController.closeFrame();
    UIManager.Instance.HideWind(EmWindow.SpaceDialogWnd);
  }

  static getNodeInRange(target: any): SpaceNode {
    let nInfo: SpaceNode = SpaceArmyViewHelper.model.selectNode;
    if (nInfo && target) {
      if (nInfo.info.state == NodeState.EXIST) {
        let start: Laya.Point = new Laya.Point(
          SpaceArmyViewHelper.viewPosXToInfoPosX(target.x),
          SpaceArmyViewHelper.viewPosYToInfoPosY(target.y),
        );
        let end: Laya.Point = new Laya.Point(
          SpaceArmyViewHelper.viewPosXToInfoPosX(nInfo.x),
          SpaceArmyViewHelper.viewPosYToInfoPosY(nInfo.y),
        );
        let dis: number = start.distance(end.x, end.y);
        if (dis < nInfo.handlerRange + 5) {
          return nInfo;
        }
      }
    }
    return null;
  }

  private static viewPosXToInfoPosX(viewPosX: number): number {
    return parseInt((viewPosX / Tiles.WIDTH).toString());
  }

  private static viewPosYToInfoPosY(viewPosY: number): number {
    return parseInt((viewPosY / Tiles.HEIGHT).toString());
  }

  private static get model(): SpaceModel {
    return SpaceManager.Instance.model;
  }
}
