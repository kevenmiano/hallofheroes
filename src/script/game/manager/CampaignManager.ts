import Logger from "../../core/logger/Logger";
import { PackageIn } from "../../core/net/PackageIn";
import { ServerDataManager } from "../../core/net/ServerDataManager";
import { BattleManager } from "../battle/BattleManager";
import { BattleModel } from "../battle/BattleModel";
import { CampaignEvent } from "../constant/event/NotificationEvent";
import LoginState from "../constant/LoginState";
import { S2CProtocol } from "../constant/protocol/S2CProtocol";
import { StateType } from "../constant/StateType";
import { ArmyPetInfo } from "../datas/ArmyPetInfo";
import { ThaneInfo } from "../datas/playerinfo/ThaneInfo";
import { CampaignArmy } from "../map/campaign/data/CampaignArmy";
import { CampaignMapView } from "../map/campaign/view/CampaignMapView";
import SceneType from "../map/scene/SceneType";
import { CampaignMapModel } from "../mvc/model/CampaignMapModel";
import MineralModel from "../mvc/model/MineralModel";
import PvpWarFightModel from "../mvc/model/PvpWarFightModel";
import { RoomInfo } from "../mvc/model/room/RoomInfo";
import TrialModel from "../mvc/model/TrialModel";
import WorldBossModel from "../mvc/model/worldboss/WorldBossModel";
import { CampaignMapScene } from "../scene/CampaignMapScene";
import { SwitchPageHelp } from "../utils/SwitchPageHelp";
import { NotificationManager } from "./NotificationManager";
import { PlayerManager } from "./PlayerManager";
import { RoomManager } from "./RoomManager";
import { ArmyManager } from "./ArmyManager";
import { GvgMapModel } from "../module/consortia/model/GvgMapModel";

//@ts-expect-error: External dependencies
import RoomEnterMsg = com.road.yishi.proto.room.RoomEnterMsg;
//@ts-expect-error: External dependencies
import RoomPlayerMsg = com.road.yishi.proto.room.RoomPlayerMsg;
import PetBossModel from "../module/petguard/PetBossModel";
import { SharedManager } from "./SharedManager";
import { WorldBossHelper } from "../utils/WorldBossHelper";
/**
 * 副本管理类
 */
export class CampaignManager {
  public static ROOM_STATE: number = 0x01;
  public static MAP_STATE: number = 0x02;
  public static NOVICE_CAMPAIGN_LIST: any[] = [10002];
  public static CampaignOverState: boolean = false;
  /**
   *退出战役
   */
  public exit: boolean = false;
  private _mapModel: CampaignMapModel;
  private _worldBossModel: WorldBossModel;
  private _pvpWarFightModel: PvpWarFightModel;
  private _gvgModel: GvgMapModel;
  private _trialModel: TrialModel;
  private _mineralModel: MineralModel;
  private _petBossModel: PetBossModel;

  constructor() {
    this._mineralModel = new MineralModel(); //提前初始化
  }

  public get petBossModel(): PetBossModel {
    if (this._petBossModel == null) this._petBossModel = new PetBossModel();
    return this._petBossModel;
  }

  public get mineralModel(): MineralModel {
    return this._mineralModel;
  }

  public get trialModel(): TrialModel {
    return this._trialModel;
  }

  public get gvgModel(): GvgMapModel {
    return this._gvgModel;
  }

  public get worldBossModel(): WorldBossModel {
    return this._worldBossModel;
  }

  public get mapModel(): CampaignMapModel {
    return this._mapModel;
  }

  public get pvpWarFightModel(): PvpWarFightModel {
    return this._pvpWarFightModel;
  }

  public mapId: number = 0;

  public setup(campaignId: number) {
    if (this.mapId === campaignId && this.exit === false) {
      return;
    }
    if (this._mapModel) {
      this.dispose();
    }
    this.mapId = campaignId;
    CampaignManager.CampaignOverState = false;
    this.exit = false;
    this._mapModel = new CampaignMapModel();
    this._mapModel.mapId = campaignId;
    this._worldBossModel = new WorldBossModel();
    this._gvgModel = new GvgMapModel();
    this._trialModel = new TrialModel();
    this._pvpWarFightModel = new PvpWarFightModel();
    //不检查在紫金矿产才初始化(天空之城需要展示图标)
    // if (WorldBossHelper.checkMineral(this.mapId)) {

    // }
    BattleManager.preScene = SceneType.CAMPAIGN_MAP_SCENE;
    this.addEvent();
  }

  private addEvent() {
    ServerDataManager.listen(
      S2CProtocol.U_C_CAMPAIGN_ENTER,
      this,
      this.__campaignStartHandler,
    );
  }

  private removeEvent() {
    ServerDataManager.cancel(
      S2CProtocol.U_C_CAMPAIGN_ENTER,
      this,
      this.__campaignStartHandler,
    );
  }

  /**
   * 同步房间成员信息, 部队信息
   * @param evt
   *
   */
  private __campaignStartHandler(pkg: PackageIn) {
    let msg = pkg.readBody(RoomEnterMsg) as RoomEnterMsg;
    Logger.info("[CampaignManager]同步房间成员信息, 部队信息", msg);
    if (msg.result <= 0) return;
    for (const key in msg.player) {
      let member: RoomPlayerMsg = msg.player[key] as RoomPlayerMsg;
      this.readMember(member);
    }
  }

  private readMember(mInfo: RoomPlayerMsg) {
    //读取房间成员
    let aInfo: CampaignArmy;
    let hInfo: any;
    let petInfo: ArmyPetInfo;
    let userId: number = mInfo.playerId;
    let serverName: string = "";
    if (mInfo.hasOwnProperty("serverName")) {
      serverName = mInfo.serverName;
    }
    if (this.roomInfo) {
      this.roomInfo.id = mInfo.roomId;
      this.roomInfo.curCount = mInfo.count;
      aInfo = this.roomInfo.getPlayerByUserId(userId, serverName);
    }
    let pos: number = mInfo.currentRoomIndex;
    let roomState: number = mInfo.playerState;
    let id: number = mInfo.heroId;
    if (!aInfo) {
      aInfo = new CampaignArmy();
      hInfo = new ThaneInfo();
    } else {
      hInfo = aInfo.baseHero;
    }
    petInfo = aInfo.petInfo;
    hInfo.beginChanges();
    aInfo.isNoGet = mInfo.isNoGet;
    aInfo.hp = mInfo.hp;
    aInfo.maxHp = mInfo.maxHp;
    hInfo.hp = mInfo.hp;
    hInfo.maxHp = mInfo.maxHp;
    aInfo.pos = pos;
    aInfo.roomState = roomState;
    hInfo.id = id;
    aInfo.userId = userId;
    hInfo.userId = userId;
    hInfo.IsVipAndNoExpirt = mInfo.isVip;
    hInfo.vipType = mInfo.vipType;
    hInfo.grades = mInfo.grades;
    aInfo.nickName = mInfo.nickName;
    aInfo.setTranseferWait(false, 0, 0);
    hInfo.nickName = aInfo.nickName;
    hInfo.templateId = mInfo.templateId;
    hInfo.headId = mInfo.headId;
    hInfo.armsEquipAvata = mInfo.arm;
    hInfo.bodyEquipAvata = mInfo.cloth;
    if (mInfo.hasOwnProperty("wing")) {
      hInfo.wingAvata = mInfo.wing;
    }
    hInfo.hairFashionAvata = mInfo.hat;
    hInfo.armsFashionAvata = mInfo.fashionArm;
    hInfo.bodyFashionAvata = mInfo.fashionCloth;
    hInfo.hideFashion = mInfo.hide;
    hInfo.changeShapeId = mInfo.changeShapeId;
    hInfo.fightingCapacity = mInfo.fightingCapacity;
    hInfo.honer = mInfo.geste;
    hInfo.headId = mInfo.headId;
    hInfo.fateSkill = mInfo.fateSkills;
    hInfo.mulSportScore = mInfo.mulSportScore;
    hInfo.segmentId = mInfo.segmentId;
    aInfo.id = mInfo.armyId;
    aInfo.combatPower = mInfo.fightingCapacity;
    aInfo.curPosX = mInfo.curPosX;
    aInfo.curPosY = mInfo.curPosY;
    aInfo.state = mInfo.armyState;
    aInfo.teamId = mInfo.teamId;
    aInfo.bufferTempId = mInfo.bufferTempId;
    hInfo.appellId = mInfo.appellid;
    if (mInfo.hasOwnProperty("serverName")) {
      hInfo.serviceName = mInfo.serverName;
    }
    if (mInfo.hasOwnProperty("mountTempId")) {
    }
    let selfBaseHero = ArmyManager.Instance.army.baseHero;
    if (
      userId == selfBaseHero.userId &&
      serverName == selfBaseHero.serviceName
    ) {
      ArmyManager.Instance.army.mountTemplateId = mInfo.mountTempId;
    }
    petInfo.petTemplateId = mInfo.petTemplateId;
    aInfo.mountTemplateId = mInfo.mountTempId;
    aInfo.mountGrade = mInfo.mountGrade;
    if (mInfo.hasOwnProperty("petName")) {
      petInfo.petName = mInfo.petName;
      hInfo.petName = mInfo.petName;
    }
    if (mInfo.hasOwnProperty("petQuqlity")) {
      petInfo.petQuaity = Math.floor((mInfo.petQuqlity - 1) / 5 + 1);
      petInfo.petTemQuality = mInfo.petQuqlity;
      hInfo.petQuaity = Math.floor((mInfo.petQuqlity - 1) / 5 + 1);
      hInfo.temQuality = mInfo.petQuqlity;
    }
    hInfo.petTemplateId = mInfo.petTemplateId;
    if (mInfo.hasOwnProperty("hide")) {
      hInfo.hideFashion = mInfo.hide;
    }
    if (mInfo.hasOwnProperty("fashionArm")) {
      hInfo.armsFashionAvata = mInfo.fashionArm;
    }
    if (mInfo.hasOwnProperty("fashionCloth")) {
      hInfo.bodyFashionAvata = mInfo.fashionCloth;
    }
    if (mInfo.hasOwnProperty("hat")) {
      hInfo.hairFashionAvata = mInfo.hat;
    }
    let isSwitchMap: boolean = false;
    if (aInfo.mapId > 0 && aInfo.mapId != mInfo.campaignId) isSwitchMap = true;
    aInfo.mapId = mInfo.campaignId;
    aInfo.online = mInfo.onlineState;
    hInfo.state = mInfo.onlineState ? StateType.ONLINE : StateType.OFFLINE;
    hInfo.consortiaID = mInfo.consortiaId;
    hInfo.consortiaName = mInfo.consortiaName;
    hInfo.frameId = mInfo.frameId;
    aInfo.baseHero = hInfo;
    if (this.roomInfo) this.roomInfo.addArmy(aInfo, false);
    this.mapModel.addBaseArmy(aInfo, isSwitchMap);
    hInfo.commit();
    petInfo.commit();
    // Logger.info("[CampaignManager]readMember", aInfo.nickName, petInfo.petName);
  }

  public dispose() {
    Logger.base("[CampaignManager]副本结束");
    this.removeEvent();
    this.mapId = 0;
    NotificationManager.Instance.dispatchEvent(
      CampaignEvent.CAMPAIGN_OVER,
      null,
    );
    CampaignManager.CampaignOverState = false;
    BattleModel.allowAutoFight = true;
    CampaignMapModel.inMazeFlag = false;
    CampaignMapModel.isHangUp = false;
    this.exit = true;
    PlayerManager.Instance.loginState = LoginState.INCASTLE;
    BattleManager.preScene = SwitchPageHelp.returnScene;
    if (this._mapModel) {
      this._mapModel.exit = true;
    }
    this._mapModel = null;
    this._worldBossModel = null;
    this._gvgModel = null;
    this._trialModel = null;
    this.mapView = null;
  }

  private get roomInfo(): RoomInfo {
    return RoomManager.Instance.roomInfo;
  }

  private static _instance: CampaignManager;
  public static get Instance(): CampaignManager {
    if (!CampaignManager._instance) {
      CampaignManager._instance = new CampaignManager();
    }
    return CampaignManager._instance;
  }

  public mapView: CampaignMapView;
  public controller: CampaignMapScene;

  /**
   * 检查当前场景身体是否显示
   * @param mapId 当前地图ID
   * @param online 是否在线状态
   */
  public getScenePlayerVisible(mapId: number, online: boolean): boolean {
    let hideOtherPlayer = SharedManager.Instance.hideOtherPlayer;
    if (this.needHidePlayerScene(mapId)) {
      return !hideOtherPlayer && online;
    }
    return online;
  }

  /**
   * 检查当前场景昵称是否显示
   * @param mapId 当前地图ID
   * @param online 是否在线状态
   */
  public getScenePlayerNameVisible(mapId: number, online: boolean): boolean {
    return online;
    // if (!SharedManager.Instance.hideOtherPlayer) {
    //     let hideOtherName = SharedManager.Instance.hidePlayerName;
    //     if (this.needHidePlayerScene(mapId)) {
    //         return !hideOtherName && online;
    //     }
    // }
    // return online;
  }

  public needHidePlayerScene(mapId: number): boolean {
    return (
      WorldBossHelper.checkWorldBoss(mapId) ||
      WorldBossHelper.checkPetLand(mapId)
    );
  }
}
