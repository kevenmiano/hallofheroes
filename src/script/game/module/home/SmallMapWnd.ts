import FUI_MemberItem from "../../../../fui/Home/FUI_MemberItem";
import FUI_NpcItem from "../../../../fui/Home/FUI_NpcItem";
import FUI_PathPointItem from "../../../../fui/Home/FUI_PathPointItem";
import FUI_TransferItem from "../../../../fui/Home/FUI_TransferItem";
import Logger from "../../../core/logger/Logger";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIButton from "../../../core/ui/UIButton";
import { ArrayConstant, ArrayUtils } from "../../../core/utils/ArrayUtils";
import Dictionary from "../../../core/utils/Dictionary";
import ObjectUtils from "../../../core/utils/ObjectUtils";
import { FilterFrameText } from "../../component/FilterFrameText";
import { t_s_rewardcondictionData } from "../../config/t_s_rewardcondiction";
import {
  CampaignMapEvent,
  FreedomTeamEvent,
  NotificationEvent,
  ObjectsEvent,
  TreasureMapEvent,
} from "../../constant/event/NotificationEvent";
import { IEnterFrame } from "../../interfaces/IEnterFrame";
import { EnterFrameManager } from "../../manager/EnterFrameManager";
import FreedomTeamManager from "../../manager/FreedomTeamManager";
import { NotificationManager } from "../../manager/NotificationManager";
import RingTaskManager from "../../manager/RingTaskManager";
import TreasureMapManager from "../../manager/TreasureMapManager";
import { CampaignArmy } from "../../map/campaign/data/CampaignArmy";
import Tiles from "../../map/space/constant/Tiles";
import { BaseArmy } from "../../map/space/data/BaseArmy";
import { CampaignNode } from "../../map/space/data/CampaignNode";
import SpaceArmy from "../../map/space/data/SpaceArmy";
import { SpaceNode } from "../../map/space/data/SpaceNode";
import SpaceManager from "../../map/space/SpaceManager";
import { SpaceModel } from "../../map/space/SpaceModel";
import { CampaignMapModel } from "../../mvc/model/CampaignMapModel";
import { StageReferance } from "../../roadComponent/pickgliss/toplevel/StageReferance";
import FUIHelper from "../../utils/FUIHelper";
import { PathPointUtils } from "../../utils/PathPointUtils";
import { RingTask } from "../ringtask/RingTask";
import SmalMapRightItem from "./SmalMapRightItem";
import { SpaceArmyView } from "../../map/space/view/physics/SpaceArmyView";
import { CampaignArmyView } from "../../map/campaign/view/physics/CampaignArmyView";
import { EmPackName } from "../../constant/UIDefine";
import { PathManager } from "../../manager/PathManager";
import ResMgr from "../../../core/res/ResMgr";
import SpaceNodeType from "../../map/space/constant/SpaceNodeType";
export default class SmallMapWnd extends BaseWindow implements IEnterFrame {
  protected _model: SpaceModel | CampaignMapModel;
  protected _selfArmy: SpaceArmy | CampaignArmy;
  protected _selfArmyView: SpaceArmyView | CampaignArmyView;
  protected _pathPointDic: Dictionary;
  protected _nodeContainer1: Laya.Sprite;
  protected _nodeContainer2: Laya.Sprite;
  protected _teamContainer: Laya.Sprite;
  protected itemList: fgui.GList = null;
  protected _pathContainer: Laya.Sprite;
  protected _syncSelfPositionFlag: boolean = true;
  protected _memberList: Dictionary;
  public selfImg: fgui.GImage;
  public scaleBigBtn: UIButton;
  public resetBtn: UIButton;
  public scaleSmallBtn: UIButton;
  public comMapImg: fgui.GComponent;
  public mapPath: string;
  protected mapChildImg: fgui.GLoader;
  protected _flushtime: number = 0;
  protected _path: Array<Laya.Point>;
  protected _itemList: Dictionary;
  protected _rect: Laya.Rectangle;
  protected FRAME_HEIGHT: number = 512;
  protected GROUP_WIDTH: number = 248;
  protected FRAME_WIDTH: number = 800;
  protected _showTypes: Array<number> = [61, 171];
  protected _walkTarget: fgui.GComponent;
  protected isSpaceMap: fgui.Controller;
  protected isMineral: fgui.Controller;

  protected enableMap: boolean = false; //限制放大, 限制拖动

  public OnInitWind() {
    super.OnInitWind();
    this.initController();
    this.initData();
    this.addEvent();
    this.setCenter();
  }

  OnShowWind() {
    super.OnShowWind();
    this._rect = new Laya.Rectangle(0, 0, this.FRAME_WIDTH, this.FRAME_HEIGHT);
    TreasureMapManager.Instance.model.mapFrameOpened = true;
    TreasureMapManager.Instance.model.commit();

    let selfImgPos = this.getSelfImgPos();
    var posX: number =
      this.positionConvert(this._selfArmyView.x * this.mapScaleTimes * 0.05) +
      selfImgPos.x;
    var posY: number =
      this.positionConvert(this._selfArmyView.y * this.mapScaleTimes * 0.05) +
      selfImgPos.y;
    this.selfImg.x = posX;
    this.selfImg.y = posY;
    this.initNodePosition();
    this.initMembersPositioin();
    this.syncSelfPath();
    this.updateBtnState();
    this.loadMap();

    this.__treasureInfoUpdateHandler();
  }

  protected initController() {
    this.isSpaceMap = this.getController("isSpaceMap");
    this.isSpaceMap.selectedIndex = 1;
    this.isMineral = this.getController("isMineral");
    this.isMineral.selectedIndex = 0;
  }

  protected initData() {
    this.modelEnable = false;
    this._model = SpaceManager.Instance.model;
    this._selfArmy = this._model.selfArmy;
    this._selfArmyView = SpaceManager.Instance.controller.getArmyView(
      this._selfArmy,
    ) as SpaceArmyView;

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
    this.mapPath = PathManager.getSMapPath(SpaceManager.SpaceMapId);
  }

  protected addEvent() {
    EnterFrameManager.Instance.registeEnterFrame(this);
    this.mapChildImg.on(
      Laya.Event.MOUSE_DOWN,
      this,
      this.__mapMouseDownHandler,
    );
    this.mapChildImg.on(Laya.Event.MOUSE_UP, this, this.__mapMouseUpHandler);
    this.scaleBigBtn.visible = true;
    this.resetBtn.visible = true;
    this.scaleSmallBtn.visible = true;
    this.scaleBigBtn.onClick(this, this.onScaleBigHandler.bind(this));
    this.resetBtn.onClick(this, this.onScaleResetHandler.bind(this));
    this.scaleSmallBtn.onClick(this, this.onScaleSmallHandler.bind(this));
    this._model.addEventListener(
      CampaignMapEvent.UPDATE_WALK_TARGET,
      this.__updateWalkTargetHandler,
      this,
    );
    this._selfArmyView.aiInfo.addEventListener(
      ObjectsEvent.WALK_NEXT,
      this.__walkNextHandler,
      this,
    );
    this._selfArmyView.aiInfo.addEventListener(
      ObjectsEvent.WALK_OVER,
      this.__walkOverHandler,
      this,
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

  protected mapScaleTimes: number = 1; //地图缩放倍数
  protected mapScaleMaxTimes: number = 2;
  protected mapScaleMinTimes: number = 1;
  protected mapScalePercent: number = 0.25; //地图缩放比例
  /**地图放大,每次放大25% 最大至2倍 */
  onScaleBigHandler() {
    if (this.enableMap || this.mapScaleTimes >= this.mapScaleMaxTimes) {
      return;
    }
    this.mapScaleTimes += this.mapScalePercent;
    this.updateScaleMapState();
  }

  /**重置地图至原始大小 */
  onScaleResetHandler() {
    if (this.enableMap || this.mapScaleTimes == 1) {
      return;
    }
    this.mapScaleTimes = 1;
    this.updateScaleMapState();
  }

  /**地图缩小, 每次缩小25%, 最小至1倍 */
  onScaleSmallHandler() {
    if (this.enableMap || this.mapScaleTimes <= this.mapScaleMinTimes) {
      return;
    }
    this.mapScaleTimes -= this.mapScalePercent;
    this.updateScaleMapState();
  }

  protected loadMap() {
    ResMgr.Instance.loadRes(this.mapPath, (res) => {
      if (this.destroyed) return;
      this.mapChildImg.icon = this.mapPath;
    });
  }

  protected updateScaleMapState() {
    Logger.warn(this.mapScaleTimes);
    this.mapChildImg.width = 500 * this.mapScaleTimes;
    this.mapChildImg.height = 480 * this.mapScaleTimes;
    if (this.mapScaleTimes == 1) {
      this.mapChildImg.x = this.mapChildImg.y = 0;
    }
    this._nodeContainer1.x = this.mapChildImg.x;
    this._nodeContainer1.y = this.mapChildImg.y;
    this._nodeContainer2.x = this.mapChildImg.x;
    this._nodeContainer2.y = this.mapChildImg.y;
    this._teamContainer.x = this.mapChildImg.x;
    this._teamContainer.y = this.mapChildImg.y;
    this._pathContainer.x = this.mapChildImg.x;
    this._pathContainer.y = this.mapChildImg.y;
    this.syncSelfPosition();
    this.initNodePosition();
    this.initMembersPositioin();
    this.syncSelfPath();
    this.updateBtnState();
  }

  protected updateBtnState() {
    this.scaleSmallBtn.enabled =
      this.mapScaleTimes > this.mapScaleMinTimes && !this.enableMap;
    this.scaleBigBtn.enabled =
      this.mapScaleTimes < this.mapScaleMaxTimes && !this.enableMap;
    this.resetBtn.enabled = this.mapScaleTimes != 1 && !this.enableMap;
  }

  protected removeEvent() {
    EnterFrameManager.Instance.unRegisteEnterFrame(this);
    this.mapChildImg.off(
      Laya.Event.MOUSE_DOWN,
      this,
      this.__mapMouseDownHandler,
    );
    this.mapChildImg.off(Laya.Event.MOUSE_UP, this, this.__mapMouseUpHandler);
    this._model.removeEventListener(
      CampaignMapEvent.UPDATE_WALK_TARGET,
      this.__updateWalkTargetHandler,
      this,
    );
    this._selfArmyView.aiInfo.removeEventListener(
      ObjectsEvent.WALK_NEXT,
      this.__walkNextHandler,
      this,
    );
    this._selfArmyView.aiInfo.removeEventListener(
      ObjectsEvent.WALK_OVER,
      this.__walkOverHandler,
      this,
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

  protected isMouseDown: boolean = false;
  protected preMousePostion: Laya.Point;
  protected mouseDownPoint: Laya.Point = new Laya.Point();
  protected forceVector: Laya.Point = new Laya.Point();
  protected __mapMouseDownHandler(event: Laya.Event) {
    this.isMouseDown = true;
    this.preMousePostion = new Laya.Point(event.stageX, event.stageY);
    this.mapChildImg.on(
      Laya.Event.MOUSE_MOVE,
      this,
      this.__mapMouseMoveHandler,
    );
  }

  protected __mapMouseUpHandler(event: Laya.Event) {
    this.isMouseDown = false;
    if (this._isMoveing) {
      this.mapChildImg.off(
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
      ((targetPos.x - selfImgPos.x) * 10) / this.mapScaleTimes;
    var targetY: number =
      ((targetPos.y - selfImgPos.y) * 10) / this.mapScaleTimes;
    SpaceManager.Instance.controller.moveArmyByPos(targetX, targetY, true);
  }

  protected _isMoveing: boolean = false;
  protected __mapMouseMoveHandler(evt: Laya.Event) {
    if (this.mapScaleTimes <= 1 || !this.isMouseDown || this.enableMap) return;
    // Logger.error('__mapMouseMoveHandler');//移动地图
    let globalPos = new Laya.Point(evt.stageX, evt.stageY);
    this.forceVector.x = globalPos.x - this.preMousePostion.x;
    this.forceVector.y = globalPos.y - this.preMousePostion.y;
    this.preMousePostion.x = globalPos.x;
    this.preMousePostion.y = globalPos.y;

    let currPos = this.comMapImg.globalToLocal(globalPos.x, globalPos.y);

    this._isMoveing = true;
    if (
      currPos.x <= this.comMapImg.x ||
      currPos.x >= this.comMapImg.x + this.comMapImg.width
    ) {
      return;
    } else if (
      currPos.y <= this.comMapImg.y ||
      currPos.y >= this.comMapImg.y + this.comMapImg.height
    ) {
      return;
    }
    //移动
    this.mapChildImg.x += this.forceVector.x;
    this.mapChildImg.y += this.forceVector.y;
    if (this.mapChildImg.x >= 0) {
      this.mapChildImg.x = 0;
    }
    if (this.mapChildImg.x <= this.comMapImg.width - this.mapChildImg.width) {
      this.mapChildImg.x = this.comMapImg.width - this.mapChildImg.width;
    }
    if (this.mapChildImg.y >= 0) {
      this.mapChildImg.y = 0;
    }
    if (this.mapChildImg.y <= this.comMapImg.height - this.mapChildImg.height) {
      this.mapChildImg.y = this.comMapImg.height - this.mapChildImg.height;
    }
    this._nodeContainer1.x = this.mapChildImg.x;
    this._nodeContainer1.y = this.mapChildImg.y;
    this._nodeContainer2.x = this.mapChildImg.x;
    this._nodeContainer2.y = this.mapChildImg.y;
    this._teamContainer.x = this.mapChildImg.x;
    this._teamContainer.y = this.mapChildImg.y;
    this._pathContainer.x = this.mapChildImg.x;
    this._pathContainer.y = this.mapChildImg.y;
    this.initNodePosition();
    this.initMembersPositioin();
    this.syncSelfPosition();
    this.syncSelfPath();
  }

  protected __updateWalkTargetHandler(data: Laya.Point) {
    var end: Laya.Point = data;
    if (end) {
      this._syncSelfPositionFlag = true;
      this.syncSelfPath(end);
    } else {
      this._syncSelfPositionFlag = false;
      this._walkTarget.visible = false;
    }
  }

  protected __walkNextHandler(data: any) {
    if (this._path.length == 0) return;
    var p: Laya.Point = data.point as Laya.Point;
    for (var i: number = p.x - 1; i <= p.x + 1; i++) {
      for (var j: number = p.y - 1; j <= p.y + 1; j++) {
        var key: string = i + "_" + j;
        var pathPoint: FUI_PathPointItem = this._pathPointDic[key];
        ObjectUtils.disposeObject(pathPoint);
        delete this._pathPointDic[key];
      }
    }
  }

  protected __walkOverHandler(evt: ObjectsEvent) {
    if (!this._pathContainer) return;
    if (this._walkTarget) this._walkTarget.visible = false;
    this._pathContainer.removeChildren();
    this.enableMap = false;
    this.updateBtnState();
  }

  protected __updateTeamInfoHandler() {
    this.initMembersPositioin();
  }

  protected __syncTeamInfoHandler() {
    this.syncMembersPosition();
  }

  protected __treasureInfoUpdateHandler() {
    if (TreasureMapManager.Instance.model.useFrameOpened) {
      this._rect.width = this.GROUP_WIDTH;
      this.contentPane.setPivot(0.5, 0.5);
      this.contentPane.scaleX = 0.9;
      this.contentPane.scaleY = 0.9; //和藏宝图同屏时显示不下, 所以缩小
    } else {
      this._rect.width = this.FRAME_WIDTH;
      this.contentPane.setPivot(0.5, 0.5);
      this.contentPane.scaleX = 1;
      this.contentPane.scaleY = 1;
    }
    this.x = (StageReferance.stageWidth - this._rect.width) / 2;
  }

  protected initMembersPositioin() {
    this._teamContainer.removeChildren();
    if (!FreedomTeamManager.Instance.hasTeam) {
      return;
    }
    this._memberList = new Dictionary();
    var member: FUI_MemberItem;
    var members: Array<any> = FreedomTeamManager.Instance.model.allMembers;
    for (let i: number = 0; i < members.length; i++) {
      let army: BaseArmy = members[i];
      if (army.userId == this._selfArmy.userId) {
        continue;
      }
      member = FUI_MemberItem.createInstance();
      member.visible = false;
      this._teamContainer.addChild(member.displayObject);
      member.x = this.positionConvert(army.curPosX) - member.width * 0.5;
      member.y = this.positionConvert(army.curPosY) - member.height * 0.5;
      member.onClick(this, this.__memberClickHandler, [army.userId]);
      this._memberList[army.userId] = member;
      if (army.mapId != this._selfArmy.mapId) {
        continue;
      }
      if (!FreedomTeamManager.Instance.memberIsOnline(army.userId)) {
        continue;
      }
      member.visible = true;
    }
  }

  protected syncMembersPosition() {
    if (!FreedomTeamManager.Instance.hasTeam) {
      return;
    }
    var member: FUI_MemberItem;
    var members: Array<any> = FreedomTeamManager.Instance.model.allMembers;
    for (let i: number = 0; i < members.length; i++) {
      let army: BaseArmy = members[i];
      if (army.userId == this._selfArmy.userId) {
        continue;
      }
      member = this._memberList[army.userId];
      if (member) {
        member.visible = true;
        if (army.mapId != this._selfArmy.mapId) {
          member.visible = false;
          continue;
        }
        if (!FreedomTeamManager.Instance.memberIsOnline(army.userId)) {
          member.visible = false;
          continue;
        }
        member.x = this.positionConvert(army.curPosX) - member.width * 0.5;
        member.y = this.positionConvert(army.curPosY) - member.height * 0.5;
      }
    }
  }

  protected __memberClickHandler(data: any) {
    var userId: number = data;
    FreedomTeamManager.Instance.model.followId = userId; //我点跟随时保存被跟随者id
    NotificationManager.Instance.sendNotification(
      NotificationEvent.LOCK_TEAM_FOLLOW_TARGET,
      userId,
    );
  }

  protected __nodeClickHandler(data: any) {
    var npcId: number = data;
    SpaceManager.Instance.visitSpaceNPC(npcId);
  }

  /**
   * 按照地图比例转换坐标值
   *
   */
  protected positionConvert(pos: number): number {
    return parseInt(pos.toString()) * 2 + 1;
  }

  /**
   * 同步玩家移动路径
   *
   */
  protected syncSelfPath(end: Laya.Point = null) {
    this._path = [];
    var point: Laya.Point;
    var lastPoint: Laya.Point;
    var endPoint: Laya.Point = end;
    var walkIndex: number = this._selfArmyView.aiInfo.walkIndex;
    let selfImgPos = this.getSelfImgPos();
    if (!endPoint) {
      if (
        !this._selfArmyView.aiInfo.pathInfo ||
        this._selfArmyView.aiInfo.pathInfo.length == 0
      ) {
        return;
      }
      if (
        this._selfArmyView.isStand &&
        walkIndex >= this._selfArmyView.aiInfo.pathInfo.length
      )
        return;
      lastPoint =
        this._selfArmyView.aiInfo.pathInfo[
          this._selfArmyView.aiInfo.pathInfo.length - 1
        ];
      for (
        var i: number = walkIndex - 1;
        i < this._selfArmyView.aiInfo.pathInfo.length;
        i++
      ) {
        point = this._selfArmyView.aiInfo.pathInfo[i] as Laya.Point;
        this._path.push(point);
      }
      if (this._path.length == 0) return;
      endPoint = lastPoint;

      this._walkTarget.x =
        this.positionConvert(endPoint.x * this.mapScaleTimes) + selfImgPos.x;
      this._walkTarget.y =
        this.positionConvert(endPoint.y * this.mapScaleTimes) + selfImgPos.y;
    } else {
      this._path = this._selfArmyView.aiInfo.pathInfo.slice();

      this._walkTarget.x =
        this.positionConvert(endPoint.x * this.mapScaleTimes * 0.05) +
        selfImgPos.x;
      this._walkTarget.y =
        this.positionConvert(endPoint.y * this.mapScaleTimes * 0.05) +
        selfImgPos.y;
    }
    this._walkTarget.visible = true;
    this.showPath();
  }

  protected showPath() {
    if (!this._path) {
      return;
    }
    this._pathPointDic = new Dictionary();
    var pos: Laya.Point;
    var pathPoint: FUI_PathPointItem;
    this._pathContainer.removeChildren();
    var i: number = 1;
    //填充路径
    var fullPath: Array<Laya.Point> = [];
    for (i = 0; i < this._path.length; i++) {
      var p1: Laya.Point;
      if (i > 0) {
        p1 = this._path[i - 1];
      } else {
        p1 = new Laya.Point(
          parseInt((this._selfArmyView.x / Tiles.WIDTH).toString()),
          parseInt((this._selfArmyView.y / Tiles.HEIGHT).toString()),
        );
      }
      var p2: Laya.Point = this._path[i];
      var tempArr: Array<Laya.Point> = PathPointUtils.findPoints(p1, p2);
      tempArr.shift();
      fullPath = fullPath.concat(tempArr);
    }
    this._path = fullPath;
    var index: number = 0;
    let posSelfImg = this.getSelfImgPos();
    for (i = 0; i < this._path.length; i++) {
      if (i > 0) {
        var d: number = 0;
        if (i == this._path.length - 1) {
          d = pos.distance(this._path[i].x, this._path[i].y);
          if (d <= 2.5) {
            continue;
          }
        } else {
          if (i - index <= 3) continue;
          d = pos.distance(this._path[i].x, this._path[i].y);
          if (d < 5) {
            continue;
          }
        }
      }
      index = i;
      pos = this._path[i] as Laya.Point;
      pathPoint = FUI_PathPointItem.createInstance();
      pathPoint.x = this.positionConvert(pos.x * this.mapScaleTimes);
      pathPoint.y = this.positionConvert(pos.y * this.mapScaleTimes);
      this._pathContainer.addChild(pathPoint.displayObject);
      this._pathPointDic[pos.x + "_" + pos.y] = pathPoint;
    }
  }

  protected getSelfImgPos(): Laya.Point {
    let mapChildImg = this.mapChildImg;
    var posX: number = mapChildImg.x;
    var posY: number = mapChildImg.y;
    return new Laya.Point(posX, posY);
  }

  /**同步自己坐标 */
  protected syncSelfPosition() {
    if (this.selfImg) {
      var t: number = new Date().getTime();
      let selfImgPos = this.getSelfImgPos();
      var posX: number =
        this.positionConvert(this._selfArmyView.x * this.mapScaleTimes * 0.05) +
        selfImgPos.x;
      var posY: number =
        this.positionConvert(this._selfArmyView.y * this.mapScaleTimes * 0.05) +
        selfImgPos.y;
      if (this._isMoveing) {
        this.selfImg.x = posX;
        this.selfImg.y = posY;
      } else {
        if (t - this._flushtime > 200) {
          this._flushtime = t;
          TweenLite.killTweensOf(this.selfImg);
          TweenLite.to(this.selfImg, 0.2, { x: posX, y: posY });
        }
      }
    }
  }

  /**Normal */
  //todo 正常
  protected initNodePosition() {
    this._itemList = new Dictionary();
    while (this.itemList.numChildren > 0) {
      this.itemList.removeChildToPoolAt(0);
    }
    var list: Array<SpaceNode | CampaignNode> = this._model.mapNodesData;
    var nodeInfo: SpaceNode;
    var npc: FUI_NpcItem;
    var transfer: FUI_TransferItem;
    var nameText: FilterFrameText;
    var mapNodeItem: SmalMapRightItem;
    var i: number = 0;
    var j: number = 0;
    list = ArrayUtils.sortOn(list, "sort", ArrayConstant.NUMERIC);
    this._nodeContainer1.removeChildren();
    this._nodeContainer2.removeChildren();
    let selfImgPos = this.getSelfImgPos();
    for (i; i < list.length; i++) {
      nodeInfo = list[i] as SpaceNode;
      if (this._showTypes.indexOf(nodeInfo.info.types) == -1) {
        continue;
      }
      if (nodeInfo.nodeId == SpaceNodeType.ID_SINGLE_PASS) {
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
      if (nodeInfo.info.types == 171) {
        nameText.text = nodeInfo.info.names;
        transfer = FUI_TransferItem.createInstance();
        this._nodeContainer1.addChild(transfer.displayObject);
        this._nodeContainer1.addChild(nameText);
        transfer.x =
          this.positionConvert(nodeInfo.curPosX * this.mapScaleTimes) -
          transfer.width * 0.5;
        transfer.y =
          this.positionConvert(nodeInfo.curPosY * this.mapScaleTimes) - 40;
        nameText.x = transfer.x - (nameText.width - transfer.width) * 0.5;
        nameText.y = transfer.y;
        if (nameText.y <= nameText.height) {
          nameText.y = transfer.y + 50;
        }
        transfer.onClick(this, this.__nodeClickHandler, [nodeInfo.nodeId]);
      } else {
        if (nodeInfo.nodeId == 18) {
          var ringtask: RingTask = RingTaskManager.Instance.getRingTask();
          if (!ringtask) {
            continue;
          }
          var condition: t_s_rewardcondictionData = ringtask
            .conditionList[0] as t_s_rewardcondictionData;
          if (condition.CondictionType != 4) {
            //不是采集
            continue;
          }
          if (condition.Para1 + "" != nodeInfo.param4) {
            continue;
          }
          if (ringtask.isCompleted) {
            continue;
          }
        }
        nameText.text = nodeInfo.funcType;
        npc = FUI_NpcItem.createInstance();
        this._nodeContainer2.addChild(npc.displayObject);
        this._nodeContainer2.addChild(nameText);
        npc.x =
          this.positionConvert(nodeInfo.curPosX * this.mapScaleTimes) -
          npc.width * 0.5;
        npc.y =
          this.positionConvert(nodeInfo.curPosY * this.mapScaleTimes) -
          npc.height * 0.5;
        nameText.x = npc.x - (nameText.width - npc.width) * 0.5;
        nameText.y = npc.y - nameText.height;
        npc.onClick(this, this.__nodeClickHandler, [nodeInfo.nodeId]);
      }
      mapNodeItem = <SmalMapRightItem>this.itemList.addItemFromPool();
      mapNodeItem.vData = nodeInfo;
      this._itemList[nodeInfo.nodeId] = mapNodeItem;
      j++;

      if (nodeInfo.nodeId == 4) {
        //英灵兑换节点
        nameText.x = nameText.x + 15;
      } else if (nodeInfo.nodeId == 19) {
        //藏宝图
        nameText.x = nameText.x - 25;
      } else if (nodeInfo.nodeId == 15) {
        //紫晶矿场
        nameText.x = nameText.x + 15;
      } else if (nodeInfo.nodeId == 5) {
        //英灵岛
        nameText.x = nameText.x + 5;
      }
    }
  }

  // 新手用
  public getMapNodeItemByNodeId(nodeId: number): SmalMapRightItem {
    let item = this._itemList[nodeId];
    if (!item) return null;

    let scrollIdx: number = 0;
    for (let i = 0; i < this.itemList.numChildren; i++) {
      let tItem = this.itemList.getChildAt(i);
      if (item == tItem) {
        scrollIdx = i;
      }
    }
    this.itemList.scrollToView(scrollIdx);
    return this._itemList[nodeId];
  }

  enterFrame() {
    if (this._syncSelfPositionFlag) {
      this.syncSelfPosition();
    }
  }

  public dispose() {
    TreasureMapManager.Instance.model.mapFrameOpened = false;
    TreasureMapManager.Instance.model.commit();
    if (this.selfImg) {
      TweenLite.killTweensOf(this.selfImg);
    }
    while (this.itemList.numChildren > 0) {
      this.itemList.removeChildToPoolAt(0);
    }
    this.removeEvent();
    ResMgr.Instance.cancelLoadByUrl(this.mapPath);
    ResMgr.Instance.releaseRes(this.mapPath);
    this._pathContainer && this._pathContainer.removeChildren();
    this._pathContainer = null;
    this._nodeContainer1 && this._nodeContainer1.removeChildren();
    this._nodeContainer1 = null;
    this._nodeContainer2 && this._nodeContainer2.removeChildren();
    this._nodeContainer2 = null;
    this._teamContainer && this._teamContainer.removeChildren();
    this._teamContainer = null;
    this._model = null;
    this._selfArmy = null;
    this._selfArmyView = null;
    this._pathPointDic = null;
    this._itemList = null;
    this._path = [];
    super.dispose();
  }
}
