//@ts-expect-error: External dependencies
import FUI_NpcItem from "../../../../fui/Home/FUI_NpcItem";
import FUI_TransferItem from "../../../../fui/Home/FUI_TransferItem";
import Dictionary from "../../../core/utils/Dictionary";
import { FilterFrameText } from "../../component/FilterFrameText";
import {
  CampaignMapEvent,
  FreedomTeamEvent,
  ObjectsEvent,
  TreasureMapEvent,
} from "../../constant/event/NotificationEvent";
import { CampaignManager } from "../../manager/CampaignManager";
import { EnterFrameManager } from "../../manager/EnterFrameManager";
import { NotificationManager } from "../../manager/NotificationManager";
import OfferRewardManager from "../../manager/OfferRewardManager";
import RingTaskManager from "../../manager/RingTaskManager";
import TreasureMapManager from "../../manager/TreasureMapManager";
import { CampaignNode } from "../../map/space/data/CampaignNode";
import FUIHelper from "../../utils/FUIHelper";
import { WorldBossHelper } from "../../utils/WorldBossHelper";
import SmallMapWnd from "./SmallMapWnd";
import SmalMapRightItem from "./SmalMapRightItem";
import { EmPackName } from "../../constant/UIDefine";
import AudioManager from "../../../core/audio/AudioManager";
import { SoundIds } from "../../constant/SoundIds";
import { ArrayUtils, ArrayConstant } from "../../../core/utils/ArrayUtils";
import { PosType } from "../../map/space/constant/PosType";
import { NodeState } from "../../map/space/constant/NodeState";
import { ActionUtils } from "../../action/ActionUtils";
import { PathManager } from "../../manager/PathManager";

/**
 * @author:pzlricky
 * @data: 2021-11-09 14:55
 * @description 副本地图
 */
export default class CampaignMapWnd extends SmallMapWnd {
  /**
   * 单页地图节点列表显示最大数量
   */
  private static NODE_COUNT_MAX: number = 16;

  private _sortDataDic: Dictionary;
  private _sortData: Array<number>;

  protected initController() {
    super.initController();
    this.isSpaceMap.selectedIndex = 0;
    let mapId = CampaignManager.Instance.mapId;
    if (WorldBossHelper.checkMineral(mapId)) {
      this.isMineral.selectedIndex = 1;
    } else {
      this.isMineral.selectedIndex = 0;
    }
  }

  protected initData() {
    this._showTypes = [61, 171, 91, 1003];
    this._model = CampaignManager.Instance.mapModel;
    this._selfArmy = this._model.selfMemberData;
    var armyView = CampaignManager.Instance.controller.getArmyView(
      this._selfArmy,
    );
    this._selfArmyView = armyView;

    this._sortDataDic = new Dictionary();
    this._sortDataDic[20001] = [2000102, 2000150, 2000148, 2000149];
    this._sortDataDic[20002] = [2000202, 2000201, 2000261];
    this._sortDataDic[20003] = [2000341, 2000301, 2000340];
    this._sortDataDic[20004] = [2000401, 2000448];
    this._sortDataDic[30000] = [
      3000003, 3000004, 3000002, 3000005, 3000006, 3000008, 3000009,
    ];
    this._sortData = [];
    this._sortData = this._sortDataDic[CampaignManager.Instance.mapId];
    this._pathPointDic = new Dictionary();
    this._nodeContainer1 = new Laya.Sprite();
    this._nodeContainer2 = new Laya.Sprite();
    this._teamContainer = new Laya.Sprite();
    this._pathContainer = new Laya.Sprite();
    this._walkTarget = FUIHelper.createFUIInstance(
      "Home",
      "WalkTarget",
    ) as fgui.GComponent;
    this.comMapImg.displayObject.addChild(this._nodeContainer1);
    this.comMapImg.displayObject.addChild(this._nodeContainer2);
    this.comMapImg.displayObject.addChild(this._teamContainer);
    this.comMapImg.displayObject.addChild(this._pathContainer);
    this.comMapImg.addChild(this._walkTarget);
    this._walkTarget.visible = false;
    this.selfImg = this.comMapImg.getChild("selfImg").asImage;
    this.mapChildImg = this.comMapImg.getChild("mapImg").asLoader;
    let mapId = this._model.mapId;
    if (mapId == 20004) {
      mapId = 20001;
    }
    this.mapPath = PathManager.getSMapPath(mapId);

    // let selfImgPos = this.getSelfImgPos();
    // var posX: number = this.positionConvert(this._selfArmyView.x * this.mapScaleTimes * 0.05) + selfImgPos.x;
    // var posY: number = this.positionConvert(this._selfArmyView.y * this.mapScaleTimes * 0.05) + selfImgPos.y;
    // this.selfImg.x = posX;
    // this.selfImg.y = posY;
    // this.initNodePosition();
    // this.initMembersPositioin();
    // this.syncSelfPath();
    // this.updateBtnState();
    // this.loadMap();
  }

  protected addEvent() {
    EnterFrameManager.Instance.registeEnterFrame(this);
    this.comMapImg.on(Laya.Event.MOUSE_DOWN, this, this.__mapMouseDownHandler);
    this.comMapImg.on(Laya.Event.MOUSE_UP, this, this.__mapMouseUpHandler);
    this._model.addEventListener(
      CampaignMapEvent.UPDATE_WALK_TARGET,
      this.__updateWalkTargetHandler,
      this,
    );
    this._selfArmyView.on(
      ObjectsEvent.WALK_NEXT,
      this,
      this.__walkNextHandler.bind(this),
    );
    this._selfArmyView.on(
      ObjectsEvent.WALK_OVER,
      this,
      this.__walkOverHandler.bind(this),
    );
    NotificationManager.Instance.addEventListener(
      FreedomTeamEvent.TEAM_INFO_UPDATE,
      this.__updateTeamInfoHandler,
      this,
    );
    NotificationManager.Instance.addEventListener(
      FreedomTeamEvent.TEAM_INFO_SYNC,
      this.__syncTeamInfoHandler,
      this,
    );
    TreasureMapManager.Instance.model.addEventListener(
      TreasureMapEvent.TREASURE_INFO_UPDATE,
      this.__treasureInfoUpdateHandler,
      this,
    );
  }

  protected removeEvent() {
    EnterFrameManager.Instance.unRegisteEnterFrame(this);
    this.comMapImg.off(Laya.Event.MOUSE_DOWN, this, this.__mapMouseDownHandler);
    this.comMapImg.off(Laya.Event.MOUSE_UP, this, this.__mapMouseUpHandler);
    this._model.removeEventListener(
      CampaignMapEvent.UPDATE_WALK_TARGET,
      this.__updateWalkTargetHandler,
      this,
    );
    this._selfArmyView.off(
      ObjectsEvent.WALK_NEXT,
      this,
      this.__walkNextHandler.bind(this),
    );
    this._selfArmyView.off(
      ObjectsEvent.WALK_OVER,
      this,
      this.__walkOverHandler.bind(this),
    );
    NotificationManager.Instance.removeEventListener(
      FreedomTeamEvent.TEAM_INFO_UPDATE,
      this.__updateTeamInfoHandler,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      FreedomTeamEvent.TEAM_INFO_SYNC,
      this.__syncTeamInfoHandler,
      this,
    );
    TreasureMapManager.Instance.model.removeEventListener(
      TreasureMapEvent.TREASURE_INFO_UPDATE,
      this.__treasureInfoUpdateHandler,
      this,
    );
  }

  protected __mapMouseDownHandler(event: Laya.Event) {
    this.isMouseDown = true;
    this.preMousePostion = new Laya.Point(event.stageX, event.stageY);
    this.comMapImg.on(Laya.Event.MOUSE_MOVE, this, this.__mapMouseMoveHandler);
  }

  protected initNodePosition() {
    this._itemList = new Dictionary();
    while (this.itemList.numChildren > 0) {
      this.itemList.removeChildToPoolAt(0);
    }
    var list = this._model.mapNodesData;
    var nodeInfo: CampaignNode;
    var npc: FUI_NpcItem;
    var transfer: FUI_TransferItem;
    var nameText: FilterFrameText;
    var mapNodeItem: SmalMapRightItem;
    var i: number = 0;
    var j: number = 0;
    var taskId: number = 0;
    list = ArrayUtils.sortOn(list, "nodeId", ArrayConstant.NUMERIC);
    for (i; i < list.length; i++) {
      nodeInfo = list[i] as CampaignNode;
      if (this._showTypes.indexOf(nodeInfo.info.types) == -1) {
        continue;
      }
      if (nodeInfo.resource != 2 && nodeInfo.info.types == 91) {
        continue;
      }
      if (
        WorldBossHelper.checkInPetBossFloor(this._model.mapId) &&
        nodeInfo.info.types == PosType.PET_BOSS_MONSTER &&
        nodeInfo.param4 != "3"
      ) {
        continue;
      }
      if (
        nodeInfo.info.state == NodeState.HIDE ||
        nodeInfo.info.state == NodeState.DESTROYED
      ) {
        continue;
      }
      nameText = new FilterFrameText(
        100,
        20,
        undefined,
        18,
        "#fffd4f",
        "center",
        undefined,
        0,
      );
      nameText.mouseEnabled = false;
      if (nodeInfo.info.types == 171 || nodeInfo.sonType == 2336) {
        nameText.text = nodeInfo.info.names;
        transfer = FUI_TransferItem.createInstance();
        this._nodeContainer1.addChild(transfer.displayObject);
        this._nodeContainer1.addChild(nameText);
        transfer.x =
          this.positionConvert(nodeInfo.curPosX) - transfer.width * 0.5;
        transfer.y = this.positionConvert(nodeInfo.curPosY) - 40;
        nameText.x = transfer.x - (nameText.width - transfer.width) * 0.5;
        if (nodeInfo.curPosY == 166) {
          //避免神秘人和传送阵文字重叠
          nameText.y = transfer.y + 50;
        } else {
          nameText.y = transfer.y;
        }

        if (nameText.y <= nameText.height) {
          nameText.y = transfer.y + 50;
        }
        //北美特殊处理传送阵
        if (nodeInfo.nodeId == 3000002) {
          nameText.x = transfer.x - 30;
        }
        transfer.onClick(this, this.__nodeClickHandler, [nodeInfo]);
      } else {
        var wantedTasks: Array<string> = nodeInfo.param4.split(",");
        var isShow: boolean = true;
        var mapId: number = CampaignManager.Instance.mapId;
        if (nodeInfo.info.types == 91 && WorldBossHelper.checkPetLand(mapId)) {
          isShow = false;
          for (const key in wantedTasks) {
            if (Object.prototype.hasOwnProperty.call(wantedTasks, key)) {
              taskId = Number(wantedTasks[key]);
              if (
                OfferRewardManager.Instance.model.hasTaskAndNotCompleted(
                  taskId,
                ) ||
                RingTaskManager.Instance.hasTaskAndNotCompleted(taskId)
              ) {
                isShow = true;
                break;
              }
            }
          }
        }
        if (!isShow) {
          continue;
        }
        // 紫晶原矿名字显示太密集
        if (nodeInfo.sonType == 2351) {
          nameText.text = "";
        } else {
          nameText.text = nodeInfo.info.names;
        }
        npc = FUI_NpcItem.createInstance();
        this._nodeContainer2.addChild(npc.displayObject);
        this._nodeContainer2.addChild(nameText);
        npc.x = this.positionConvert(nodeInfo.curPosX) - npc.width * 0.5;
        npc.y = this.positionConvert(nodeInfo.curPosY) - npc.height * 0.5;
        nameText.x = npc.x - (nameText.width - npc.width) * 0.5;
        nameText.y = npc.y - nameText.height;
        npc.onClick(this, this.__nodeClickHandler, [nodeInfo]);

        if (
          WorldBossHelper.checkInPetBossFloor(this._model.mapId) &&
          nodeInfo.info.types == PosType.PET_BOSS_MONSTER &&
          nodeInfo.param4 == "3"
        ) {
          nameText.color = "#ff0000";
        }
      }
      mapNodeItem = <SmalMapRightItem>this.itemList.addItemFromPool();
      mapNodeItem.vData = nodeInfo;
      this._itemList[nodeInfo.nodeId] = mapNodeItem;
      if (this._sortData.indexOf(nodeInfo.nodeId) == -1) {
        this._sortData.push(nodeInfo.nodeId);
      }
      j++;
    }
  }

  protected positionConvert(pos: number): number {
    return parseInt(pos.toString()) * 2.5 + 1;
  }

  protected __mapMouseUpHandler(event: Laya.Event) {
    this.isMouseDown = false;
    if (this._isMoveing) {
      this.comMapImg.off(
        Laya.Event.MOUSE_MOVE,
        this,
        this.__mapMouseMoveHandler,
      );
      this._isMoveing = false;
      this.preMousePostion = null;
      return;
    }
    this.enableMap = true;
    this.updateScaleMapState();
    let currPos = this.comMapImg.globalToLocal(event.stageX, event.stageY);
    let targetPos = new Laya.Point(currPos.x, currPos.y);
    let selfImgPos = this.getSelfImgPos();
    var targetX: number =
      ((targetPos.x - selfImgPos.x) * 8) / this.mapScaleTimes;
    var targetY: number =
      ((targetPos.y - selfImgPos.y) * 8) / this.mapScaleTimes;
    CampaignManager.Instance.controller.moveArmyByPos(targetX, targetY, true);
    ActionUtils.cancelClollectActionDetection();
  }

  protected __nodeClickHandler(node) {
    AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
    CampaignManager.Instance.mapModel.selectNode = node;
    CampaignManager.Instance.controller.moveArmyByPos(
      node.curPosX * 20,
      node.curPosY * 20,
      true,
    );
  }
}
