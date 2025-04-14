import GameEventDispatcher from "../../../core/event/GameEventDispatcher";
import { PackageIn } from "../../../core/net/PackageIn";
import { ServerDataManager } from "../../../core/net/ServerDataManager";
import { t_s_mapnodeData } from "../../config/t_s_mapnode";
import {
  PK_Event,
  SLGSocketEvent,
  SocketDataProxyEventEvent,
  SpaceEvent,
} from "../../constant/event/NotificationEvent";
import { S2CProtocol } from "../../constant/protocol/S2CProtocol";
import { StateType } from "../../constant/StateType";
import { PlayerInfo } from "../../datas/playerinfo/PlayerInfo";
import { ThaneInfo } from "../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../manager/ArmyManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { SocketSceneBufferManager } from "../../manager/SocketSceneBufferManager";
import { SocketDataProxyManager } from "../../proxy/SocketDataProxyManager";
import { SceneManager } from "../scene/SceneManager";
import SceneType from "../scene/SceneType";
import { MapData } from "./data/MapData";
import { PhysicInfo } from "./data/PhysicInfo";
import { SpaceNode } from "./data/SpaceNode";
import { SpaceModel } from "./SpaceModel";
import SpaceActionsFactory from "../../action/map/SpaceActionsFactory";
import SpaceScene from "../../scene/SpaceScene";
import { SpaceSceneMapView } from "./view/SpaceSceneMapView";

import RoomEnterMsg = com.road.yishi.proto.room.RoomEnterMsg;
import RoomPlayerMsg = com.road.yishi.proto.room.RoomPlayerMsg;
import SpacePlayerMoveMsg = com.road.yishi.proto.campaign.SpacePlayerMoveMsg;
import SpacePlayerMsg = com.road.yishi.proto.campaign.SpacePlayerMsg;
import CampaignExitMsg = com.road.yishi.proto.campaign.CampaignExitMsg;
import HeroEquUpdatedMsg = com.road.yishi.proto.army.HeroEquUpdatedMsg;
import PropertyMsg = com.road.yishi.proto.simple.PropertyMsg;
import PlayerMovieMsg = com.road.yishi.proto.player.PlayerMovieMsg;
import StandPosMsg = com.road.yishi.proto.campaign.StandPosMsg;
import HangupAttackMsg = com.road.yishi.proto.campaign.HangupAttackMsg;
import Logger from "../../../core/logger/Logger";
import { SpaceNpcView } from "./view/physics/SpaceNpcView";
import { SwitchPageHelp } from "../../utils/SwitchPageHelp";
import { CampaignSocketOutManager } from "../../manager/CampaignSocketOutManager";
import { SpaceSocketOutManager } from "./SpaceSocketOutManager";

/**
 * @author:shujin.ou
 * @email:1009865728@qq.com
 * @data: 2020-11-23 11:17
 */
export default class SpaceManager extends GameEventDispatcher {
  private static _instance: SpaceManager;
  private _model: SpaceModel;
  public static PKInviteAlertShowTime: number = 10000;
  public static _PKInvite: boolean = false;
  public static SpaceMapId: number = 10000;
  public static ClickEnterHome: boolean = false;
  public static set PKInvite(b: boolean) {
    this._PKInvite = b;
    if (b) {
      Laya.timer.once(this.PKInviteAlertShowTime, this, () => {
        this._PKInvite = false;
      });
    }
  }
  public static get PKInvite(): boolean {
    return this._PKInvite;
  }

  public mapId: number = 0;
  public exit: boolean = false;
  private _controller: SpaceScene;
  private _mapView: any;
  private _isPopFrame: boolean = true;
  private _callback: Function = null;
  public static get Instance(): SpaceManager {
    if (!this._instance) {
      this._instance = new this();
    }
    return this._instance;
  }

  constructor() {
    super();
    this._model = new SpaceModel();
  }

  private _isUse: boolean = false;
  public setup(
    $mapId: number = SpaceManager.SpaceMapId,
    isProxy: boolean = false,
  ) {
    if (this.mapId == $mapId && this.exit == false) {
      return;
    }
    this.mapId = $mapId;
    this.exit = false;
    if (!this._model) {
      this._model = new SpaceModel();
    }
    this._model.mapId = this.mapId;
    if (this._isUse) {
      return;
    }
    this._isUse = true;
    if (isProxy) {
      this.removeSocketEvent(ServerDataManager.Instance);
      this.addSocketEvent(SocketDataProxyManager.Instance.model);
      SocketDataProxyManager.Instance.model.addEventListener(
        SocketDataProxyEventEvent.READ_SOCKET_DATA_OVEW,
        this.__readOverHandler,
        this,
      );
      SocketDataProxyManager.Instance.readSocketDataByType(
        SceneType.SPACE_SCENE,
      );
    } else {
      this.removeSocketEvent(SocketDataProxyManager.Instance.model);
      this.addSocketEvent(ServerDataManager.Instance);
    }
    this.addEvent();
  }

  private addSocketEvent(item: GameEventDispatcher) {
    item.addEventListener(
      S2CProtocol.U_C_PLAYER_SPACE_ENTER,
      this.__spaceEnterHandler,
      this,
    );
    item.addEventListener(
      S2CProtocol.U_C_PLAYER_SPACE_LEAVE,
      this.__spaceLeaveHandler,
      this,
    );
    item.addEventListener(
      S2CProtocol.U_C_PLAYER_SPACE_SYNC_POS,
      this.__spaceMoveHandler,
      this,
    );
    item.addEventListener(
      S2CProtocol.U_C_HERO_BROAD_EQUIPMENT,
      this.__otherHeroInfoChange,
      this,
    );
    item.addEventListener(
      S2CProtocol.U_C_PLAYER_SPACE_EVENT,
      this.__spaceEventHandler,
      this,
    );
    item.addEventListener(
      SLGSocketEvent.U_PLAY_MOVIE,
      this.__playMovieHandler,
      this,
    );
    item.addEventListener(
      S2CProtocol.U_C_SEND_STANDPOS,
      this.__standPosHandler,
      this,
    );
  }

  private removeSocketEvent(item: GameEventDispatcher) {
    item.removeEventListener(
      S2CProtocol.U_C_PLAYER_SPACE_ENTER,
      this.__spaceEnterHandler,
      this,
    );
    item.removeEventListener(
      S2CProtocol.U_C_PLAYER_SPACE_LEAVE,
      this.__spaceLeaveHandler,
      this,
    );
    item.removeEventListener(
      S2CProtocol.U_C_PLAYER_SPACE_SYNC_POS,
      this.__spaceMoveHandler,
      this,
    );
    item.removeEventListener(
      S2CProtocol.U_C_HERO_BROAD_EQUIPMENT,
      this.__otherHeroInfoChange,
      this,
    );
    item.removeEventListener(
      S2CProtocol.U_C_PLAYER_SPACE_EVENT,
      this.__spaceEventHandler,
      this,
    );
    item.removeEventListener(
      SLGSocketEvent.U_PLAY_MOVIE,
      this.__playMovieHandler,
      this,
    );
    item.removeEventListener(
      S2CProtocol.U_C_SEND_STANDPOS,
      this.__standPosHandler,
      this,
    );
  }

  private __readOverHandler(data: string) {
    if (data != SceneType.SPACE_SCENE) {
      return;
    }
    this.removeSocketEvent(SocketDataProxyManager.Instance.model);
    this.addSocketEvent(ServerDataManager.Instance);
    SocketDataProxyManager.Instance.model.removeEventListener(
      SocketDataProxyEventEvent.READ_SOCKET_DATA_OVEW,
      this.__readOverHandler,
      this,
    );
  }

  public stop() {
    if (this._mapView && this._mapView.walkLayer) {
      this._mapView.walkLayer.stop();
    }
  }

  public get controller(): SpaceScene {
    return this._controller;
  }

  public set controller(value: SpaceScene) {
    this._controller = value;
  }

  public visitSpaceNPC(
    npcId: number,
    isPopFrame: boolean = true,
    callback: Function = null,
  ) {
    this._isPopFrame = isPopFrame;
    this._callback = callback;
    PlayerManager.Instance.currentPlayerModel.spaceNodeId = npcId;
    if (SceneManager.Instance.currentType == SceneType.SPACE_SCENE) {
      NotificationManager.Instance.dispatchEvent(SpaceEvent.FIND_NODE, null);
    } else {
      if (SceneManager.Instance.currentType == SceneType.CAMPAIGN_MAP_SCENE) {
        var bArmy: any = ArmyManager.Instance.army;
        if (bArmy) {
          CampaignSocketOutManager.Instance.sendReturnCampaignRoom(bArmy.id);
        }
      } else {
        SwitchPageHelp.enterToSpace();
      }
    }
  }

  // 寻路访问某个npc的时候停止其AI移动
  public setNpcBeingVisit(b: boolean) {
    if (!this._model) return;
    let beingVisitNode = this._model.beingVisitNode;
    if (!beingVisitNode) return;

    let nodeView = this.controller.getNpcView(beingVisitNode) as SpaceNpcView;
    if (nodeView) {
      Logger.info("[SpaceManager]npc被访问", b, nodeView.nodeInfo);
      nodeView.setBeingVisit(b);
    }
    if (!b) {
      this._model.beingVisitNode = null;
    }
  }

  public checkIsOnObstacle() {
    if (SceneManager.Instance.currentType != SceneType.SPACE_SCENE) return;

    if (this._model && this._model.isOnObstacle) {
      SpaceSocketOutManager.Instance.resetSpacePosition();
    }
  }

  public get callback(): Function {
    return this._callback;
  }

  public get isPopFrame(): boolean {
    return this._isPopFrame;
  }

  private addEvent() {
    ServerDataManager.listen(
      S2CProtocol.U_C_PLAYER_SPACE_SEND_EXSIT,
      this,
      this.__initPlayerListHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_PLAYER_REMOVE_IN_SPACE,
      this,
      this.__removePlayerListHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_HANGUP_PVP,
      this,
      this.__onPKRequestHandler,
    );
  }

  private removeEvent() {
    ServerDataManager.cancel(
      S2CProtocol.U_C_PLAYER_SPACE_SEND_EXSIT,
      this,
      this.__initPlayerListHandler,
    );
    ServerDataManager.cancel(
      S2CProtocol.U_C_PLAYER_REMOVE_IN_SPACE,
      this,
      this.__removePlayerListHandler,
    );
    ServerDataManager.cancel(
      S2CProtocol.U_C_HANGUP_PVP,
      this,
      this.__onPKRequestHandler,
    );
  }

  /**PK */
  private __onPKRequestHandler(pkg: PackageIn) {
    let msg = pkg.readBody(HangupAttackMsg) as HangupAttackMsg;
    // if (ChildManager.instance.arenaModel.isInChildArena) return;
    // if (EclipticPalaceManager.instance.model.openEclipticPalaceFrame) return;
    // if (FrameControllerManager.instance.dreamArenaController.dreamArenaMatching) return;
    NotificationManager.Instance.dispatchEvent(PK_Event.SPACE_PK, msg);
  }

  private __spaceEnterHandler(pkg: PackageIn) {
    let msg = pkg.readBody(RoomEnterMsg) as RoomEnterMsg;
    for (const key in msg.player) {
      let player: RoomPlayerMsg = msg.player[key] as RoomPlayerMsg;
      SpaceManager.Instance.readMember(player);
    }
  }

  private __spaceLeaveHandler(pkg: PackageIn) {
    let msg = pkg.readBody(CampaignExitMsg) as CampaignExitMsg;
    var aInfo: any = null;
    if (
      msg.playerId != this.selfPlayerInfo.userId &&
      SpaceManager.Instance.model
    ) {
      if (SpaceManager.Instance.model)
        aInfo = SpaceManager.Instance.model.removeBaseArmyByArmyId(
          msg.playerId,
        );
    }
  }

  private __spaceMoveHandler(pkg: PackageIn) {
    SocketSceneBufferManager.Instance.addPkgToBuffer(
      pkg,
      SceneType.SPACE_SCENE,
      this.__spaceSyncPosHandler.bind(this),
    );
  }

  private __spaceSyncPosHandler(pkg: PackageIn) {
    if (SceneManager.Instance.currentType != SceneType.SPACE_SCENE) {
      return;
    }
    let msg = pkg.readBody(SpacePlayerMoveMsg) as SpacePlayerMoveMsg;
    if (SpaceManager.Instance.model)
      SpaceManager.Instance.model.moveArmyTo(msg);
  }

  private __otherHeroInfoChange(pkg: PackageIn) {
    let msg = pkg.readBody(HeroEquUpdatedMsg) as HeroEquUpdatedMsg;
    var userId: number = msg.playerId;
    var army: any;
    if (SpaceManager.Instance.model) {
      army = SpaceManager.Instance.model.getBaseArmyByUserId(userId);
    }
    if (army && army.baseHero) {
      army.baseHero.beginChanges();
      army.baseHero.armsEquipAvata = msg.armStr;
      army.baseHero.bodyEquipAvata = msg.clothStr;
      army.baseHero.wingAvata = msg.wing;
      army.baseHero.hairFashionAvata = msg.hat;
      army.baseHero.armsFashionAvata = msg.fashionArm;
      army.baseHero.bodyFashionAvata = msg.fashionCloth;
      army.baseHero.hideFashion = msg.hide;
      army.baseHero.appellId = msg.appellId;
      army.baseHero.commit();
    }
  }

  private __spaceEventHandler(pkg: PackageIn) {
    let msg = pkg.readBody(PropertyMsg) as PropertyMsg;
    NotificationManager.Instance.dispatchEvent(
      SpaceEvent.SELECT_NODE,
      msg.param1,
    );
  }

  private __playMovieHandler(pkg: PackageIn) {
    let msg = pkg.readBody(PlayerMovieMsg) as PlayerMovieMsg;
    var nodeView: any;
    var node: SpaceNode;
    if (!SpaceManager.Instance.model) {
      return;
    }
    if (msg.movieTargetType == 0) {
      //节点
      node = SpaceManager.Instance.model.getMapNodeById(msg.targetId);
      if (!node) {
        return;
      }
      nodeView = node.nodeView;
      if (!nodeView) {
        return;
      }
    }
    SpaceActionsFactory.createAction(
      msg.movieType,
      nodeView,
      pkg,
      75,
      msg.targetId,
    );
  }

  private __standPosHandler(pkg: PackageIn) {
    if (SceneManager.Instance.currentType != SceneType.SPACE_SCENE) return;
    let msg = pkg.readBody(StandPosMsg) as StandPosMsg;

    if (!SpaceManager.Instance.model) return;

    var army = SpaceManager.Instance.model.getBaseArmyByUserId(msg.id);
    if (!army) return;
    army.curPosX = msg.posX;
    army.curPosY = msg.posY;
    var selfArmy: any = ArmyManager.Instance.army;
    if (selfArmy.id == army.id) {
      selfArmy.curPosX = msg.posX;
      selfArmy.curPosY = msg.posY;
    }
    if (SpaceManager.Instance.controller) {
      var aView: any = SpaceManager.Instance.controller.getArmyView(army);
      if (aView) {
        aView.x = msg.posX * 20;
        aView.y = msg.posY * 20;
        aView.info.pathInfo = [];
      }
    }
  }

  private __initPlayerListHandler(pkg: PackageIn) {
    let msg = pkg.readBody(RoomEnterMsg) as RoomEnterMsg;
    for (const key in msg.player) {
      if (msg.player.hasOwnProperty(key)) {
        let player: RoomPlayerMsg = msg.player[key] as RoomPlayerMsg;
        this.readMember(player);
      }
    }
  }

  private __removePlayerListHandler(pkg: PackageIn) {
    let msg = pkg.readBody(SpacePlayerMoveMsg) as SpacePlayerMoveMsg;
    for (const key in msg.players) {
      if (msg.players.hasOwnProperty(key)) {
        let playerMsg: SpacePlayerMsg = msg.players[key] as SpacePlayerMsg;
        if (
          playerMsg.playerId != this.selfPlayerInfo.userId &&
          SpaceManager.Instance.model
        ) {
          SpaceManager.Instance.model.removeBaseArmyByArmyId(
            playerMsg.playerId,
          );
        }
      }
    }
  }

  public get selfPlayerInfo(): PlayerInfo {
    return PlayerManager.Instance.currentPlayerModel.playerInfo;
  }

  public readMember(player: com.road.yishi.proto.room.RoomPlayerMsg) {
    var id: number = player.heroId;
    var userId: number = player.playerId;
    var aInfo = SpaceManager.Instance.model.getBaseArmyByUserId(userId);
    if (aInfo == null) {
      //SpaceArmy
      let cls = Laya.ClassUtils.getClass("SpaceArmy");
      aInfo = new cls();
    }
    var hInfo: ThaneInfo;
    if (userId == PlayerManager.Instance.currentPlayerModel.playerInfo.userId) {
      hInfo = ArmyManager.Instance.thane;
      aInfo.baseHero = hInfo;
    } else {
      hInfo = aInfo.baseHero;
    }
    hInfo.beginChanges();
    hInfo.id = id;
    hInfo.userId = userId;
    hInfo.IsVipAndNoExpirt = player.isVip;
    hInfo.vipType = player.vipType;
    hInfo.grades = player.grades;
    hInfo.nickName = player.nickName;
    hInfo.templateId = player.templateId;
    hInfo.headId = player.headId;
    hInfo.frameId = player.frameId;
    hInfo.armsEquipAvata = player.arm;
    hInfo.bodyEquipAvata = player.cloth;
    hInfo.fightingCapacity = player.fightingCapacity;
    player.wing && (hInfo.wingAvata = player.wing);
    hInfo.hairFashionAvata = player.hat;
    hInfo.armsFashionAvata = player.fashionArm;
    hInfo.bodyFashionAvata = player.fashionCloth;
    hInfo.hideFashion = player.hide;
    hInfo.attackProrerty.totalConatArmy;
    hInfo.changeShapeId = player.changeShapeId;
    hInfo.state = player.onlineState ? StateType.ONLINE : StateType.OFFLINE;
    hInfo.honer = player.geste;
    hInfo.appellId = player.appellid;
    hInfo.fateSkill = player.fateSkills;

    aInfo.userId = userId == 0 ? player.armyId : userId;
    aInfo.id = player.armyId;
    aInfo.nickName = player.nickName;
    aInfo.curPosX = player.curPosX;
    aInfo.curPosY = player.curPosY;
    aInfo.mapId = player.campaignId;
    aInfo.state = player.armyState;
    hInfo.petTemplateId = player.petTemplateId;
    aInfo.mountTemplateId = player.mountTempId;
    aInfo.petInfo.petTemplateId = player.petTemplateId;
    if (player.mountGrade) {
      aInfo.mountGrade = player.mountGrade;
    }
    if (player.vehicleTemplateId) {
      hInfo.vehicleTempId = player.vehicleTemplateId;
    }
    if (player.petName) {
      aInfo.petInfo.petName = player.petName;
      hInfo.petName = player.petName;
    }
    if (player.petQuqlity) {
      aInfo.petInfo.petQuaity = (player.petQuqlity - 1) / 5 + 1;
      aInfo.petInfo.petTemQuality = player.petQuqlity;
      hInfo.petQuaity = (player.petQuqlity - 1) / 5 + 1;
      hInfo.temQuality = player.petQuqlity;
    }
    hInfo.consortiaID = player.consortiaId;
    hInfo.consortiaName = player.consortiaName;
    hInfo.commit();
    aInfo.petInfo.commit();
    SpaceManager.Instance.model.addBaseArmy(aInfo);
  }

  public readSpaceNodeInfo($node: t_s_mapnodeData): SpaceNode {
    var node: SpaceNode = new SpaceNode();
    var info: PhysicInfo = new PhysicInfo();
    var nodeName: any[] = $node.NodeNameLang.split(",");
    info.id = $node.Id;
    info.mapId = $node.MapId;
    info.posX = $node.PosX;
    info.posY = $node.PosY;
    info.names = nodeName[0];
    info.nodeName = nodeName[1];
    info.types = $node.MasterType;
    info.state = 1;
    node.nodeId = $node.Id;
    node.sonType = $node.SonType;
    node.curPosX = $node.PosX;
    node.curPosY = $node.PosY;
    node.resetPosX = $node.BackPosX;
    node.resetPosY = $node.BackPosY;
    node.fixX = $node.FixX;
    node.fixY = $node.FixY;
    node.moveToMapId = $node.MoveToMapId;
    node.moveToNodeId = $node.MoveToNodeId;
    node.patrolPos = $node.PatrolPos; // 4
    node.nameColor = $node.NameColor; // 4
    node.sizeType = $node.SizeType;
    node.toward = $node.Toward;
    node.resource = $node.Resource;
    node.handlerRange = $node.HandlerRange; // 4
    node.dialogue = $node.DialogueLang;
    node.param1 = $node.Param1;
    node.param2 = $node.Param2;
    node.param3 = $node.Param3Lang;
    node.param4 = $node.Param4;
    node.param5 = $node.Param5Lang;
    if ($node.Sort != 0) {
      node.sort = $node.Sort;
    } else {
      node.sort = $node.Id;
    }
    if (nodeName[1]) {
      node.funcType = nodeName[1];
    } else {
      node.funcType = "";
    }

    node.info = info;
    return node;
  }

  public get mapView(): SpaceSceneMapView {
    return this._mapView;
  }

  public set mapView(value: SpaceSceneMapView) {
    this._mapView = value;
  }

  public dispose() {
    this.removeEvent();
    this._isUse = false;
    if (this._model) {
      this._model.dispose();
    }
    MapData.clearData();
    this._model = null;
    this._controller = null;
    this._mapView = null;
    this.exit = true;
  }

  public get model(): SpaceModel {
    return this._model;
  }
}
