import { BattleManager } from "../../../battle/BattleManager";
import { BattleModel } from "../../../battle/BattleModel";
import { JobType } from "../../../constant/JobType";
import { PlayerModel } from "../../../datas/playerinfo/PlayerModel";
import { SwitchInfo } from "../../../datas/SwitchInfo";
import { ArmyManager } from "../../../manager/ArmyManager";
import { CampaignManager } from "../../../manager/CampaignManager";
import { ConfigManager } from "../../../manager/ConfigManager";
import { GameBaseQueueManager } from "../../../manager/GameBaseQueueManager";
import { GoodsManager } from "../../../manager/GoodsManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { TaskManage } from "../../../manager/TaskManage";
import { SceneManager } from "../../../map/scene/SceneManager";
import SceneType from "../../../map/scene/SceneType";
import { CampaignNode } from "../../../map/space/data/CampaignNode";
import { CampaignMapModel } from "../../../mvc/model/CampaignMapModel";
import MainToolBar from "../../home/MainToolBar";
import { TaskTemplate } from "../../task/TaskTemplate";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { EmWindow } from "../../../constant/UIDefine";
import UIManager from "../../../../core/ui/UIManager";
import Logger from "../../../../core/logger/Logger";
import NewbieUtils from "../utils/NewbieUtils";
import SpaceTaskInfoWnd from "../../home/SpaceTaskInfoWnd";
import { DisplayObject } from "../../../component/DisplayObject";
import NewbieModule from "../NewbieModule";
import NewbieConfig from "../data/NewbieConfig";
import BuildingManager from "../../../map/castle/BuildingManager";
import { BuildInfo } from "../../../map/castle/data/BuildInfo";
import CastleScene from "../../../scene/CastleScene";
import CastleBuildingView from "../../../map/castle/view/layer/CastleBuildingView";
import BattleWnd from "../../battle/BattleWnd";
import { PlayerBagCell } from "../../../component/item/PlayerBagCell";
import { PlayerEquipCell } from "../../../component/item/PlayerEquipCell";
import { FarmManager } from "../../../manager/FarmManager";
// // import { IAction } from "../../../interfaces/IAction";
// import FarmScene from '../../../scene/FarmScene';
import { FarmLandItem } from "../../farm/view/item/FarmLandItem";
import { FarmOperateType } from "../../../constant/FarmOperateType";
import GoodsSonType from "../../../constant/GoodsSonType";
import ForgeWnd from "../../forge/ForgeWnd";
import LevelUpWnd from "../../levelup/LevelUpWnd";
import { SRoleWnd } from "../../sbag/SRoleWnd";
import { FarmMapView } from "../../farm/view/FarmMapView";
import FarmWnd from "../../farm/view/FarmWnd";
import FarmCtrl from "../../farm/control/FarmCtrl";
import PveCampaignWnd from "../../pve/pveCampaign/PveCampaignWnd";
import { IAction } from "@/script/game/interfaces/Actiont";

/**
 * 新手指引基本触发条件集
 */
export default class NewbieBaseConditionMediator {
  /**
   * 检查玩家等级
   * @param grade  等级
   */
  public static checkPlayerGrade(grade: number): boolean {
    return ArmyManager.Instance.thane.grades >= grade;
  }

  /**
   * 检查是否处于该场景
   * @param sceneId  场景id
   * @param mapId  地图id
   */
  public static checkInScene(sceneId: number, mapId: number = 0): boolean {
    var curType: string = SceneManager.Instance.currentType;
    let curScene = SceneManager.Instance.currentScene;
    if (
      curType == SceneType.getSceneTypeById(sceneId) &&
      curScene &&
      curScene.isEnterOver
    ) {
      if (mapId > 0 && curType == SceneType.CAMPAIGN_MAP_SCENE) {
        var mapModel: CampaignMapModel = CampaignManager.Instance.mapModel;
        // 加一重判断, 防止进副本的同时 新手执行找不到节点视图
        let mapView = CampaignManager.Instance.mapView;
        return mapModel && mapModel.mapId == mapId && Boolean(mapView);
      }

      // 战斗场景必须要等到战斗界面初始化完成
      if (curType == SceneType.BATTLE_SCENE) {
        return BattleWnd.ISINIT;
      }

      return true;
    }
    return false;
  }

  /**
   * 检查是否不处于该场景
   * @param sceneId  场景id
   * @param mapId  地图id
   */
  public static checkNotInScene(sceneId: number, mapId: number = 0): boolean {
    var curType: string = SceneManager.Instance.currentType;
    if (curType != SceneType.getSceneTypeById(sceneId)) {
      return true;
    } else {
      if (mapId > 0 && curType == SceneType.CAMPAIGN_MAP_SCENE) {
        var mapModel: CampaignMapModel = CampaignManager.Instance.mapModel;
        return !mapModel || mapModel.mapId != mapId;
      }
      return false;
    }
  }

  /**
   * 检查内城建筑是否存在
   * @param sonType  建筑sonType
   */
  public static checkCastleBuild(sonType: number): boolean {
    sonType = Number(sonType);
    let curScene = SceneManager.Instance.currentScene as CastleScene;
    if (!curScene.castleMap) {
      return false;
    }

    var bInfo: BuildInfo =
      BuildingManager.Instance.getBuildingInfoBySonType(sonType);
    if (bInfo) {
      var bView: CastleBuildingView = curScene.castleMap.buildingsDic.get(
        bInfo.buildingId,
      );
      return Boolean(bView && bView.curView);
    }
    return false;
  }

  /**
   * 检查任务是否完成
   * @param tempId  任务模板id
   */
  public static checkTaskIsComplete(tempId: number): boolean {
    tempId = Number(tempId);
    var taskTemp: TaskTemplate = TaskManage.Instance.getTaskByID(tempId);
    let isFinish = taskTemp && taskTemp.isCompleted;
    //Logger.xjy("[NewBie]checkTaskIsComplete",tempId, isFinish)
    return isFinish;
  }

  /**
   * 检查技能是否存在
   * @param sontype  技能sontype
   */
  public static checkSkillInfo(sontype: number): boolean {
    sontype = Number(sontype);
    return Boolean(ArmyManager.Instance.thane.getSkillBySontype(sontype));
  }

  /**
   * 检查是否完成过此任务
   * @param tempId  任务模板id
   */
  public static checkTaskHasCompleted(tempId: number): boolean {
    tempId = Number(tempId);
    let isFinish = TaskManage.Instance.IsTaskFinish(tempId);
    //Logger.xjy("[NewBie]checkTaskHasCompleted",tempId, isFinish)
    return isFinish;
  }

  /**
   * 检查模块窗口是否打开
   * @param emWindow  EmWindow
   */
  public static checkFrame(emWindow: string): boolean {
    let isOpen = UIManager.Instance.isShowing(emWindow as EmWindow);
    if (!isOpen) {
      isOpen = FrameCtrlManager.Instance.isOpen(emWindow as EmWindow);
    }
    return isOpen;
  }

  /**
   * 检查模块窗口是否打开 配置表
   * @param type  NewbieConfig.Type2EmWindow
   */
  public static checkFrameByType(type: string): boolean {
    let emWindow: EmWindow = NewbieConfig.Type2EmWindow[type];
    if (!emWindow) return;
    if (emWindow == EmWindow.LevelUp && LevelUpWnd.open) {
      // Logger.xjy("检查升级界面打开中")
      return true;
    }
    let check = NewbieBaseConditionMediator.checkFrame(emWindow);
    return check;
  }

  /**
   * 检查副本节点是否处于某状态
   * @param nodeId  节点id
   * @param stateType  状态类型
   */
  public static checkCampaignNodeState(
    nodeId: number,
    stateType: number,
  ): boolean {
    nodeId = Number(nodeId);
    stateType = Number(stateType);
    var mapModel: CampaignMapModel = CampaignManager.Instance.mapModel;
    if (mapModel) {
      var cn: CampaignNode = mapModel.getMapNodeByNodeId(nodeId);
      return cn && cn.info.state == stateType;
    }
    return false;
  }

  /**
   * 检查副本节点视图是否存在
   * @param nodeId  节点id
   * @param checkWidth  判断宽度, 默认为-1, 即不判断
   * @param checkHeight  判断高度, 默认为-1, 即不判断
   */
  public static checkCampaignNodeView(
    nodeId: number,
    checkWidth: number = -1,
    checkHeight: number = -1,
  ): boolean {
    nodeId = Number(nodeId);
    checkWidth = Number(checkWidth);
    checkHeight = Number(checkHeight);
    var mapModel: CampaignMapModel = CampaignManager.Instance.mapModel;
    if (mapModel) {
      var nodeView: DisplayObject = mapModel.getNodeByNodeId(nodeId);
      return (
        nodeView &&
        nodeView.stage &&
        nodeView.visible &&
        nodeView.width >= checkWidth &&
        nodeView.height >= checkHeight
      );
    }
    return false;
  }

  /**
   * 检查物品数量
   * @param tempId  物品模板id
   * @param checkNum  判断数量
   */
  public static checkGoodsNum(tempId: number, checkNum: number = 0): boolean {
    tempId = Number(tempId);
    checkNum = Number(checkNum);
    return GoodsManager.Instance.getGoodsNumByTempId(tempId) >= checkNum;
  }

  /**
   * 检查背包格子是否存在物品
   * @param $pos  格子位置
   */
  public static checkPlayerBagItemIsExistData($pos: number): boolean {
    $pos = Number($pos);
    if (!NewbieBaseConditionMediator.checkFrame(EmWindow.SRoleWnd)) {
      return false;
    }
    let frame = NewbieUtils.getFrame(EmWindow.SRoleWnd) as SRoleWnd;
    var item: PlayerBagCell = frame.getBaseBagItemByPos($pos);
    return Boolean(item && item.info);
  }

  /**
   * 检查装备格子是否存在物品
   * @param $pos  格子位置
   */
  public static checkEquipBagItemIsExistData($pos: number): boolean {
    $pos = Number($pos);
    if (!NewbieBaseConditionMediator.checkFrame(EmWindow.SRoleWnd)) {
      return false;
    }
    let frame = NewbieUtils.getFrame(EmWindow.SRoleWnd) as SRoleWnd;
    var item: PlayerEquipCell = frame.getItemViewByPos($pos);
    return Boolean(item && item.info);
  }

  /**
   * 检查是否拥有某类士兵
   * @param sontype  士兵sontype
   */
  public static checkHavePawn(sontype: number): boolean {
    sontype = Number(sontype);
    return ArmyManager.Instance.getTotalPawnsNumberBySonType(sontype) > 0;
  }

  /**
   * 检查是否在内城或天空之城或外城
   */
  public static checkInCastleOrSpace(): boolean {
    return (
      NewbieBaseConditionMediator.checkInScene(1) ||
      NewbieBaseConditionMediator.checkInScene(10) ||
      NewbieBaseConditionMediator.checkInScene(2)
    );
  }

  /**
   * 检查战斗中角色数量
   * @param checkNum  判断数量
   */
  public static checkRolesNumInBattle(checkNum: number): boolean {
    checkNum = Number(checkNum);
    var battleModel: BattleModel = BattleManager.Instance.battleModel;
    if (!battleModel) return false;
    let count = 0;
    //forEach优化 计算数量, 用size???
    // battleModel.roleList.forEach(element => {
    // 	count++
    // });
    //forEach优化--
    count = battleModel.roleList.size;
    return count < checkNum;
  }

  /**
   *
   * @param nodeId
   * @param state
   * @return
   *
   */
  public static checkNodeIsOccupy(posX: number, posY: number): boolean {
    // var physics: * = OuterCityManager.Instance.model.getPhysicsByXY(posX, posY);
    // if (physics.info.info.occupyPlayerId == ArmyManager.Instance.thane.userId) {
    // 	return true;
    // }
    return false;
  }

  /**
   *
   * 判断金矿任务进度为1/2
   */
  public static checkTaskProcess(tempId: number, index: number): boolean {
    tempId = Number(tempId);
    index = Number(index);
    for (let i = 0; i < TaskManage.Instance.cate.acceptedList.length; i++) {
      const task: TaskTemplate = TaskManage.Instance.cate.acceptedList[i];
      if (task.TemplateId == 60) {
        //金矿任务
        if (index == 1 && task.getProgress()[0] == "(1 / 2)") {
          return true;
        }
        return false;
      }
    }
  }

  /**
   * 检查副本节点avatar状态
   * @param nodeId  节点id, -1为自己
   * @param state  avatar状态
   */
  public static checkCampaignNodeAvatarState(
    nodeId: number,
    state: number,
  ): boolean {
    // var mapModel: CampaignMapModel = CampaignManager.Instance.mapModel;
    // if (mapModel) {
    // 	var nodeView: Object = (nodeId == -1 ? CampaignManager.Instance.controller.getArmyVIew(mapModel.selfMemberData) : mapModel.getNodeByNodeId(nodeId));
    // 	return (nodeView && nodeView["avatarView"] && nodeView["avatarView"]["state"] == state);
    // }
    return false;
  }

  /**
   * 判断外城人物传送动画是否完成
   */
  public static getTransferOuterCityActionIsFinish() {
    let curAction: IAction = GameBaseQueueManager.Instance.actionsQueue.current;
    if (curAction) {
      return curAction.finished;
    } else {
      return true;
    }
  }

  /**
   *
   * @param nodeStr
   * @param symbol
   * @returns
   */
  public static checkNewbieNodeFinish(nodeStr: string, symbol: string = "0") {
    if (!nodeStr) return false;
    let arr = nodeStr.split("_");

    let isReachAllCons = false;
    for (let index = 0; index < arr.length; index++) {
      const mainNodeId = arr[index];
      isReachAllCons = NewbieModule.Instance.checkNodeFinish(
        Number(mainNodeId),
      );
      if (symbol == "0") {
        // 有一个检测不通过 则不通过
        if (!isReachAllCons) break;
      } else {
        // 有一个检测通过 则通过
        if (isReachAllCons) break;
      }
    }
    return isReachAllCons;
  }

  public static checkHasConsortia() {
    return PlayerManager.Instance.currentPlayerModel.playerInfo.consortiaID > 0;
  }

  /**
   * 条件集
   * @param type  类型
   * @param param1  参数1
   * @param param2  参数2
   * @param param3  参数3
   */
  public static checkConditionCommon(
    type: number,
    param1: string = null,
    param2: string = null,
    param3: string = null,
  ): boolean {
    type = Number(type);

    let btn: any;
    let curScene: any;
    let frame: any;
    let item: any;
    switch (type) {
      case 1: //多人本地图选择窗口是否存在
        Logger.xjy(
          "[NewbieBaseConditionMediator]多人本地图选择窗口 c9 1  使用 c6 702900 代替",
        );
        return false;
      case 2: //当前任务完成提示是否存在
        // TODO Newbie jeremy.xu 需要检测完成任务窗口是否存在
        Logger.xjy(
          "[NewbieBaseConditionMediator]TODO 需要检测完成任务窗口是否存在",
        );
        return false;
      // var curAction: IAction = GameBaseQueueManager.Instance.actionsQueue.current;
      // return (curAction && curAction is CompleteTaskAction && curAction["taskTip"] && curAction["taskTip"].stage && curAction["taskTip"].visible);
      case 3: //任务追踪栏是否存在(p1: taskTempId:int, 如有配置则再检查某任务追踪item是否存在)
        let spaceTaskInfoWnd = NewbieUtils.getFrame(
          EmWindow.SpaceTaskInfoWnd,
        ) as SpaceTaskInfoWnd;
        var barIsExist: boolean = NewbieBaseConditionMediator.checkFrame(
          EmWindow.SpaceTaskInfoWnd,
        );
        var taskTempId: number = Number(param1);
        if (taskTempId > 0) {
          return (
            barIsExist &&
            Boolean(spaceTaskInfoWnd) &&
            Boolean(spaceTaskInfoWnd.getTraceItemByTaskTempId(taskTempId))
          );
        } else {
          return barIsExist;
        }
      case 4: //士兵招募窗口是否存在
        Logger.xjy("[NewbieBaseConditionMediator]士兵招募");
        return false;
      case 5: //推荐好友是否存在
        return true;
      // return MainToolBar.Instance.recommendBtnIsExist();
      case 6: //升级界面是否存在
        Logger.xjy("[NewbieBaseConditionMediator]请使用");
        return false;
      case 7: //检查某sontype物品数量(p1: sontype:int, p2: bagType:int, p3: checkNum:number)
        return (
          GoodsManager.Instance.getCountBySontypeAndBagType(
            Number(param1),
            Number(param2),
          ) >= Number(param3)
        );
      case 8: //是否神秘人
        return ArmyManager.Instance.thane.templateId == JobType.NEWCOMER;
      case 9: //检查已携带士兵数量(p1: checkNum:number)
        return (
          ArmyManager.Instance.army.countAllArmyPawnNmber() >= Number(param1)
        );
      case 10: //能否觉醒
        var battleModel: BattleModel = BattleManager.Instance.battleModel;
        return (
          battleModel && battleModel.selfHero && battleModel.selfHero.canMorph()
        );
      case 11: //主工具条是否实例化完毕
        // Logger.xjy("[NewbieBaseConditionMediator]主工具条是否实例化完毕", MainToolBar.ISINIT)
        return MainToolBar.ISINIT;
      case 12: //是否处于任何场景
        var sceneType: string = SceneManager.Instance.currentType;
        return (
          sceneType && sceneType != "" && sceneType != SceneType.EMPTY_SCENE
        );
      case 13: //单人本选择操作按钮是否存在(p1: 按钮名)
        // var frame: BaseWindow = FrameCtrlManager.Instance.getCtrl(EmWindow.SelectCampaign).view;
        // var btn = frame[param1];
        // return (NewbieBaseConditionMediator.checkFrame(EmWindow.SelectCampaign) && btn && btn.parent && btn.visible && btn.enable);
        return true;
      case 14: //检查好友数量(p1: checkNum:number)
        return null;
      // return (FriendManager.getInstance().countFriend >= Number(param1));
      case 15: //是否已进入地下迷宫
        var playerModel: PlayerModel =
          PlayerManager.Instance.currentPlayerModel;
        return (
          playerModel &&
          playerModel.towerInfo &&
          playerModel.towerInfo.towerIndex > 0
        );
      case 16: //能否使用自动战斗
        btn = BattleManager.Instance.battleUIView
          ? BattleManager.Instance.battleUIView.autoFightBtn
          : null;
        return btn && btn.visible && btn.enabled && btn.selected;
      case 17: //自动战斗按钮是否可见
        btn = BattleManager.Instance.battleUIView
          ? BattleManager.Instance.battleUIView.autoFightBtn
          : null;
        return btn && btn.visible;
      case 18: //战斗觉醒UI是否初始化完成
        Logger.xjy(
          "[NewbieBaseConditionMediator]battleAwakenUIInit",
          BattleModel.battleAwakenUIInit,
        );
        return BattleModel.battleAwakenUIInit;
      case 21: //战斗窗口是否实例化完毕
        Logger.xjy(
          "[NewbieBaseConditionMediator]战斗窗口是否实例化完毕",
          BattleWnd.ISINIT,
        );
        return BattleWnd.ISINIT;
      case 22: //AllocateWnd中是否已经配兵
        let ap = ArmyManager.Instance.army.getPawnByIndex(0);
        return ap && ap.templateInfo && ap.ownPawns > 0;
      case 23: //农场背包是否打开
        Logger.xjy(
          "[NewbieBaseConditionMediator]showingBag",
          FarmManager.Instance.showingBag,
        );
        return FarmManager.Instance.showingBag;
      case 24: //农场土地是否可种植  TODO
        let ctrl = FrameCtrlManager.Instance.getCtrl(EmWindow.Farm) as FarmCtrl;
        let wnd: FarmWnd = ctrl.view as FarmWnd;
        if (wnd.isShowing) {
          let landLayer = wnd.getFarmLand();
          if (landLayer) {
            let item = landLayer.getLandItem(parseInt(param1)) as FarmLandItem;
            return (
              item && item.info && item.info.curOper == FarmOperateType.PLANT
            );
          }
          return false;
        }
        return true;
      case 25: //农场是否浇水过
        let ctrl1 = FrameCtrlManager.Instance.getCtrl(
          EmWindow.Farm,
        ) as FarmCtrl;
        let wnd1: FarmWnd = ctrl1.view as FarmWnd;
        if (wnd1.isShowing) {
          let farmTree = wnd1.getFarmTree();
          if (farmTree) {
            return farmTree.isTreeWatered;
          }
        }
        return false;
      case 26: //是否有种子
        return (
          GoodsManager.Instance.getGoodsNumBySonType(
            GoodsSonType.SONTYPE_SEED,
          ) > 0
        );
      case 27: //农场土地是否初始化完成
        return FarmMapView.IS_FARMLAND_INIT;
      case 28:
        frame = NewbieUtils.getFrame(EmWindow.Forge) as ForgeWnd;
        if (param1) {
          if (Number(param1) == 1) {
            let wepapon = frame.getWeaponItem();
            return Boolean(wepapon);
          }
        }
        return false;
      case 30:
        frame = NewbieUtils.getFrame(EmWindow.PveCampaignWnd) as PveCampaignWnd;
        return frame && frame.getSweepEnabled();
      case 70: //判断该功能开关是否开启
        var info: SwitchInfo = ConfigManager.info;
        return info && info[param1];
    }
    return false;
  }
}
