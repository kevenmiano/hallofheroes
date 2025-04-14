import { OuterCityModel } from "../map/outercity/OuterCityModel";
import { ServerDataManager } from "../../core/net/ServerDataManager";
import { S2CProtocol } from "../constant/protocol/S2CProtocol";
import { PackageIn } from "../../core/net/PackageIn";
import { SocketManager } from "../../core/net/SocketManager";
import { BattleGetMoviesAction } from "../action/map/BattleGetMoviesAction";
import { OuterCityEvent } from "../constant/event/NotificationEvent";
import { BoxMsgInfo } from "../map/outercity/BoxMsgInfo";
import SceneType from "../map/scene/SceneType";
import { GameBaseQueueManager } from "./GameBaseQueueManager";
import { NotificationManager } from "./NotificationManager";
import { SocketSceneBufferManager } from "./SocketSceneBufferManager";
import { C2SProtocol } from "../constant/protocol/C2SProtocol";
//@ts-expect-error: External dependencies
import MapBossMsg = com.road.yishi.proto.army.MapBossMsg;
//@ts-expect-error: External dependencies
import MapBoxMsg = com.road.yishi.proto.army.MapBoxMsg;
//@ts-expect-error: External dependencies
import BoxMsg = com.road.yishi.proto.army.BoxMsg;
//@ts-expect-error: External dependencies
import FightOverMoiveMsg = com.road.yishi.proto.simple.FightOverMoiveMsg;
//@ts-expect-error: External dependencies
import MapBossQuestMsg = com.road.yishi.proto.army.MapBossQuestMsg;
//@ts-expect-error: External dependencies
import MapPhysicAttackMsg = com.road.yishi.proto.worldmap.MapPhysicAttackMsg;
//@ts-expect-error: External dependencies
import VehicleReqMsg = com.road.yishi.proto.outercity.VehicleReqMsg;
//@ts-expect-error: External dependencies
import VehicleInfoMsg = com.road.yishi.proto.outercity.VehicleInfoMsg;
//@ts-expect-error: External dependencies
import VehicleAllInfoMsg = com.road.yishi.proto.outercity.VehicleAllInfoMsg;
//@ts-expect-error: External dependencies
import PlayerMsg = com.road.yishi.proto.outercity.PlayerMsg;
import { OuterCityScene } from "../scene/OuterCityScene";
import { OuterCityMap } from "../map/outercity/OuterCityMap";
import ConfigInfoManager from "./ConfigInfoManager";
import { PhysicInfo } from "../map/space/data/PhysicInfo";
import { PosType } from "../map/space/constant/PosType";
import { WildLand } from "../map/data/WildLand";
import { ArrayConstant, ArrayUtils } from "../../core/utils/ArrayUtils";
import VehiclePlayerInfo from "../map/data/VehiclePlayerInfo";
import { PlayerManager } from "./PlayerManager";
import StringHelper from "../../core/utils/StringHelper";

/**
 * @description 外城Manager
 * @author yuanzhan.yu
 * @date 2021/11/16 16:05
 * @ver 1.0
 */
export class OuterCityManager {
  private _model: OuterCityModel;
  private _controler: OuterCityScene;
  private _mapView: OuterCityMap;
  private coolDownUint: ReturnType<typeof setInterval> | null = null;
  // 资源数据进外城前需要被预加载
  public loadBeforeEnterScene: boolean = false;
  public floorData: Map<string, any>; // = new Map();
  public moviesData: Map<string, any>; // = new Map();
  public topsData: Map<string, any>; // = new Map();
  public mapTielsData: Map<string, any>; // = new Map();

  public get mapView(): OuterCityMap {
    return this._mapView;
  }

  public set mapView(value: OuterCityMap) {
    this._mapView = value;
  }

  public steup($contro: OuterCityScene, $model: OuterCityModel): void {
    this._controler = $contro;
    this._model = $model;
    this._model.mineUpperLimitArr =
      ConfigInfoManager.Instance.getOuterCityMineUpperLimit();

    ServerDataManager.listen(
      S2CProtocol.U_C_PLAY_GETMOIVE,
      this,
      this.__playGetMovieHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_MAPBOSS_DATAS,
      this,
      this.onGetBossInfo,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_MAPBOSS_FOG,
      this,
      this.onMapBossFog,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_MAPBOSS_BOX,
      this,
      this.onMapBossBox,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_OUT_CITY_VEHICLE_INFO,
      this,
      this.onMapVehicleInfo,
    );
    if (this.coolDownUint === null) {
      this.coolDownUint = setInterval(this.coolDownHandler.bind(this), 1000);
    }
  }

  /**
   * 监听BOSS信息返回协议
   */
  private onGetBossInfo(pkg: PackageIn): void {
    let msg: MapBossMsg = pkg.readBody(MapBossMsg) as MapBossMsg;

    this.model.bossInfo.count1 = msg.count1;
    this.model.bossInfo.count2 = msg.count2;
    this.model.bossInfo.count3 = msg.count3;
    this.model.bossInfo.leftFogTime = msg.leftFogTime;
    if (this.model.bossInfo.leftFogTime > 0) {
      NotificationManager.Instance.dispatchEvent(
        OuterCityEvent.OUTER_CITY_REMOVE_FOG,
        null,
      );
    }
    this.model.bossInfo.bosslist = [];
    let i: number;
    let wildLand: WildLand;
    let pInfo: PhysicInfo;
    for (i = 0; i < msg.bosslist.length; i++) {
      wildLand = new WildLand();
      wildLand.bossName = msg.bosslist[i].bossName;
      wildLand.grade = msg.bosslist[i].grade;
      wildLand.bossStatus = msg.bosslist[i].type;
      wildLand.templateId = msg.bosslist[i].posId;
      wildLand.refreshTime = msg.bosslist[i].leftTime;
      pInfo = new PhysicInfo();
      pInfo.posX = msg.bosslist[i].posX;
      pInfo.posY = msg.bosslist[i].posY;
      pInfo.types = PosType.OUTERCITY_BOSS_NPC;
      pInfo.state = msg.bosslist[i].state;
      wildLand.info = pInfo;
      this.model.bossInfo.bosslist.push(wildLand);
    }
    this.model.bossInfo.bosslist = ArrayUtils.sortOn(
      this.model.bossInfo.bosslist,
      "grade",
      ArrayConstant.DESCENDING,
    );
    NotificationManager.Instance.dispatchEvent(
      OuterCityEvent.OUTER_CITY_GET_BOSSINFO,
      this.model,
    );
  }

  /**
   * 外城物资车信息返回
   */
  private onMapVehicleInfo(pkg: PackageIn) {
    let msg: VehicleAllInfoMsg = pkg.readBody(
      VehicleAllInfoMsg,
    ) as VehicleAllInfoMsg;
    if (msg) {
      let wildLand: WildLand;
      let pInfo: PhysicInfo;
      for (let i: number = 0; i < msg.allVehicleInfo.length; i++) {
        let item: VehicleInfoMsg = msg.allVehicleInfo[i] as VehicleInfoMsg;
        wildLand = new WildLand();
        wildLand.templateId = item.id;
        wildLand.nodeId = item.nodeId;
        wildLand.targetPosX = item.targetPosX;
        wildLand.targetPosY = item.targetPosY;
        wildLand.leftTime = item.leftTime;
        wildLand.status = item.status;
        wildLand.movePosX = item.movePosX;
        wildLand.movePosY = item.movePosY;
        wildLand.speed = item.speed;
        wildLand.protectStatus = item.protectStatus;
        wildLand.pushStatus = item.pushStatus;
        wildLand.fightUserIdArray = this.getFightUserArr(item);
        pInfo = new PhysicInfo();
        pInfo.posX = parseInt(item.movePosX.toString());
        pInfo.posY = parseInt(item.movePosY.toString());
        pInfo.types = PosType.OUTERCITY_VEHICLE;
        pInfo.occupyLeagueName = item.guildName;
        pInfo.occupyLeagueConsortiaId = item.guildId;
        pInfo.state = item.status; //物资车状态 1 存在 2 销毁 3 战斗中
        wildLand.info = pInfo;
        wildLand.pushPlayer = this.getPlayerArr(item, 1);
        wildLand.protectPlayer = this.getPlayerArr(item, 2);
        this.model.allVehicleNode.set(wildLand.templateId, wildLand);
      }
    }
    NotificationManager.Instance.dispatchEvent(
      OuterCityEvent.OUTER_CITY_VEHICLE_UPDATE,
    );
  }

  private getPlayerArr(
    info: VehicleInfoMsg,
    type: number,
  ): Array<VehiclePlayerInfo> {
    let playerArr: Array<VehiclePlayerInfo> = [];
    let vehiclePlayerInfo: VehiclePlayerInfo;
    let item: PlayerMsg;
    if (type == 1) {
      //推进
      for (let i: number = 0; i < info.pushPlayer.length; i++) {
        item = info.pushPlayer[i] as PlayerMsg;
        vehiclePlayerInfo = new VehiclePlayerInfo();
        vehiclePlayerInfo.userId = item.userId;
        vehiclePlayerInfo.headId = item.avatar;
        vehiclePlayerInfo.job = item.job;
        vehiclePlayerInfo.grade = item.grade;
        vehiclePlayerInfo.frameId = item.avatarIcon;
        vehiclePlayerInfo.nickName = item.nickName;
        vehiclePlayerInfo.guildId = item.guildId;
        playerArr.push(vehiclePlayerInfo);
      }
    } else if (type == 2) {
      //护卫
      for (let i: number = 0; i < info.protectPlayer.length; i++) {
        item = info.protectPlayer[i] as PlayerMsg;
        vehiclePlayerInfo = new VehiclePlayerInfo();
        vehiclePlayerInfo.userId = item.userId;
        vehiclePlayerInfo.headId = item.avatar;
        vehiclePlayerInfo.job = item.job;
        vehiclePlayerInfo.grade = item.grade;
        vehiclePlayerInfo.frameId = item.avatarIcon;
        vehiclePlayerInfo.nickName = item.nickName;
        vehiclePlayerInfo.guildId = item.guildId;
        playerArr.push(vehiclePlayerInfo);
      }
    }
    return playerArr;
  }

  private getFightUserArr(info: VehicleInfoMsg): Array<string> {
    let arr: Array<string> = [];
    if (!StringHelper.isNullOrEmpty(info.fightPlayer)) {
      arr = info.fightPlayer.split(",");
    }
    return arr;
  }

  private coolDownHandler() {
    this.coolDownFog();
  }

  /**
   *迷雾散去时间倒计时
   *
   */
  private coolDownFog(): void {
    if (this.model.bossInfo.leftFogTime < 0) {
      return;
    }
    if (this.model.bossInfo.leftFogTime == 0) {
      NotificationManager.Instance.dispatchEvent(
        OuterCityEvent.OUTER_CITY_ADD_FOG,
        null,
      );
    }
    this.model.bossInfo.leftFogTime -= 1;
  }

  /**
   * 监听使用神圣之光道具, 更新移除迷雾时间
   *
   */
  private onMapBossFog(pkg: PackageIn): void {
    let msg: MapBossMsg = pkg.readBody(MapBossMsg) as MapBossMsg;

    this.model.bossInfo.leftFogTime = msg.leftFogTime;
    NotificationManager.Instance.dispatchEvent(
      OuterCityEvent.OUTER_CITY_REMOVE_FOG,
      null,
    );
  }

  /**
   * 外城击杀怪物掉落宝箱
   *
   */
  private onMapBossBox(pkg: PackageIn): void {
    let msg: MapBoxMsg = pkg.readBody(MapBoxMsg) as MapBoxMsg;

    this.model.bossInfo.bossBoxList = [];
    let boxMsgInfo: BoxMsgInfo;
    let boxMsg: BoxMsg;
    for (let i: number = 0; i < msg.boxlist.length; i++) {
      boxMsg = msg.boxlist[i] as BoxMsg;
      boxMsgInfo = new BoxMsgInfo();
      boxMsgInfo.boxId = boxMsg.boxId;
      boxMsgInfo.grade = boxMsg.grade;
      boxMsgInfo.mapId = boxMsg.mapId;
      boxMsgInfo.type = boxMsg.type;
      boxMsgInfo.userId = boxMsg.userId;
      boxMsgInfo.x = boxMsg.x;
      boxMsgInfo.y = boxMsg.y;
      this.model.bossInfo.bossBoxList.push(boxMsgInfo);
    }
    NotificationManager.Instance.dispatchEvent(
      OuterCityEvent.OUTER_CITY_UPDATE_BOX,
      null,
    );
  }
  /**
   * 外城战斗获取动画
   *
   */
  private __playGetMovieHandler(pkg: PackageIn): void {
    SocketSceneBufferManager.Instance.addPkgToBuffer(
      pkg,
      SceneType.OUTER_CITY_SCENE,
      this.playGetMovie.bind(this),
    );
  }

  private playGetMovie(pkg: PackageIn): void {
    let msg: FightOverMoiveMsg = pkg.readBody(
      FightOverMoiveMsg,
    ) as FightOverMoiveMsg;
    GameBaseQueueManager.Instance.addAction(
      new BattleGetMoviesAction(this._controler.selfArmy, msg),
    );
    msg = null;
  }

  /**
   *外城请求BOSS信息
   * @param mapId
   *
   */
  public getBossInfo(mapId: number): void {
    let msg: MapBossQuestMsg = new MapBossQuestMsg();
    msg.mapId = mapId;
    SocketManager.Instance.send(C2SProtocol.C_MAPBOSS_DATAS, msg);
  }

  /**
   * 请求外城金矿和城堡信息
   */
  public getMineAndCityInfo() {
    var msg: MapPhysicAttackMsg = new MapPhysicAttackMsg();
    msg.op = 1;
    SocketManager.Instance.send(C2SProtocol.C_OUT_CITY_GOLDN_LIST, msg);
  }

  /**
   *外城拾取怪物宝箱
   *
   */
  public getBossBox(_msg: BoxMsg): void {
    let msg: BoxMsg = _msg;
    SocketManager.Instance.send(C2SProtocol.C_MAPBOX_PICK, msg);
  }

  public get model(): OuterCityModel {
    return this._model;
  }
  public set model(v: OuterCityModel) {
    this._model = v;
  }

  public get controler(): OuterCityScene {
    return this._controler;
  }

  public dispose(): void {
    this._controler = null;
    this._model = null;
    this._mapView = null;

    clearInterval(this.coolDownUint);
    this.coolDownUint = null;
    ServerDataManager.cancel(
      S2CProtocol.U_C_PLAY_GETMOIVE,
      this,
      this.__playGetMovieHandler,
    );
    ServerDataManager.cancel(
      S2CProtocol.U_C_MAPBOSS_DATAS,
      this,
      this.onGetBossInfo,
    );
    ServerDataManager.cancel(
      S2CProtocol.U_C_MAPBOSS_FOG,
      this,
      this.onMapBossFog,
    );
    ServerDataManager.cancel(
      S2CProtocol.U_C_MAPBOSS_BOX,
      this,
      this.onMapBossBox,
    );
    ServerDataManager.cancel(
      S2CProtocol.U_C_OUT_CITY_VEHICLE_INFO,
      this,
      this.onMapVehicleInfo,
    );
  }

  private static _instance: OuterCityManager;

  public static get Instance(): OuterCityManager {
    if (!OuterCityManager._instance) {
      OuterCityManager._instance = new OuterCityManager();
    }
    return OuterCityManager._instance;
  }

  /**
   *外城请求物资车信息
   * @param mapId
   *
   */
  public getVehicleInfo(): void {
    let msg: VehicleReqMsg = new VehicleReqMsg();
    SocketManager.Instance.send(C2SProtocol.C_OUT_CITY_VEHICLE_INFO, msg);
  }

  /**
   *外城物资车操作
   * @param type   1 护送上阵 2 推进上阵 3 护送退出 4 推进退出
   * @param nodeId 物资车 节点id
   */
  public vehicleOperation(type: number, templateId: number) {
    let msg: VehicleReqMsg = new VehicleReqMsg();
    msg.type = type;
    msg.nodeId = templateId;
    SocketManager.Instance.send(
      C2SProtocol.C_OUT_CITY_VEHICLE_CHANGE_PLAYER,
      msg,
    );
  }

  /**
   * 物资车攻击
   * @param type
   * @param nodeId
   */
  public vehicleAttck(templateId: number) {
    let msg: VehicleReqMsg = new VehicleReqMsg();
    msg.nodeId = templateId;
    SocketManager.Instance.send(C2SProtocol.C_OUT_CITY_VEHICLE_ATTACK, msg);
  }

  public changePlayerPosition(posX: number, posY: number) {
    let msg: VehicleReqMsg = new VehicleReqMsg();
    msg.posX = posX;
    msg.posY = posY;
    SocketManager.Instance.send(C2SProtocol.C_OUT_CITY_VEHICLE_FIXPOS, msg);
  }
}
