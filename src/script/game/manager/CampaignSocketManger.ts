import GameEventDispatcher from "../../core/event/GameEventDispatcher";
import LangManager from "../../core/lang/LangManager";
import Logger from "../../core/logger/Logger";
import { PackageIn } from "../../core/net/PackageIn";
import { ServerDataManager } from "../../core/net/ServerDataManager";
import { SocketManager } from "../../core/net/SocketManager";
import { ArrayConstant, ArrayUtils } from "../../core/utils/ArrayUtils";
import { DateFormatter } from "../../core/utils/DateFormatter";
import { ArmyType } from "../constant/ArmyType";
import {
  CampaignEvent,
  CampaignMapEvent,
  ChatEvent,
  NotificationEvent,
  PvpWarFightEvent,
  SLGSocketEvent,
  SocketDataProxyEventEvent,
  WorldBossEvent,
} from "../constant/event/NotificationEvent";
import { GlobalConfig } from "../constant/GlobalConfig";
import { C2SProtocol } from "../constant/protocol/C2SProtocol";
import { S2CProtocol } from "../constant/protocol/S2CProtocol";
import { EmWindow } from "../constant/UIDefine";
import { ChatChannel } from "../datas/ChatChannel";
import { GoodsInfo } from "../datas/goods/GoodsInfo";
import { PlayerInfo } from "../datas/playerinfo/PlayerInfo";
import { ThaneInfo } from "../datas/playerinfo/ThaneInfo";
import { TrailPropInfo } from "../datas/TrailPropInfo";
import AIBaseInfo from "../map/ai/AIBaseInfo";
import { CampaignArmy } from "../map/campaign/data/CampaignArmy";
import { GuildWarJoinPlayerInfo } from "../map/campaign/data/GuildWarJoinPlayerInfo";
import { MineralCarInfo } from "../map/campaign/data/MineralCarInfo";
import { SceneManager } from "../map/scene/SceneManager";
import SceneType from "../map/scene/SceneType";
import { NodeState } from "../map/space/constant/NodeState";
import { PosType } from "../map/space/constant/PosType";
import Tiles from "../map/space/constant/Tiles";
import { BaseArmy } from "../map/space/data/BaseArmy";
import { CampaignNode } from "../map/space/data/CampaignNode";
import { ChestInfo } from "../map/space/data/ChestInfo";
import { PhysicInfo } from "../map/space/data/PhysicInfo";
import { AvatarBaseView } from "../map/view/hero/AvatarBaseView";
import ChatData from "../module/chat/data/ChatData";
import ConsortiaBossInfo from "../module/consortia/data/ConsortiaBossInfo";
import ConsortiaBossUserInfo from "../module/consortia/data/ConsortiaBossUserInfo";
import { GvgContributionInfo } from "../module/consortia/data/gvg/GvgContributionInfo";
import { GvgTopTenInfo } from "../module/consortia/data/gvg/GvgTopTenInfo";
import { GvgWarBufferInfo } from "../module/consortia/data/gvg/GvgWarBufferInfo";
import { GvgMapModel } from "../module/consortia/model/GvgMapModel";
import NewbieBaseActionMediator from "../module/guide/mediators/NewbieBaseActionMediator";
import WarFightOrderInfo from "../module/rvrBattle/data/WarFightOrderInfo";
import WarReportInfo from "../module/rvrBattle/data/WarReportInfo";
import { FrameCtrlManager } from "../mvc/FrameCtrlManager";
import { CampaignMapModel } from "../mvc/model/CampaignMapModel";
import CampaignNodeType from "../mvc/model/CampaignNodeType";
import MineralModel from "../mvc/model/MineralModel";
import PvpWarFightModel from "../mvc/model/PvpWarFightModel";
import { RoomInfo } from "../mvc/model/room/RoomInfo";
import TrialModel from "../mvc/model/TrialModel";
import WorldBossModel from "../mvc/model/worldboss/WorldBossModel";
import { WoundInfo } from "../mvc/model/worldboss/WoundInfo";
import { SocketDataProxyManager } from "../proxy/SocketDataProxyManager";
import { SwitchPageHelp } from "../utils/SwitchPageHelp";
import { ThaneInfoHelper } from "../utils/ThaneInfoHelper";
import { WorldBossHelper } from "../utils/WorldBossHelper";
import { ArmyManager } from "./ArmyManager";
import { CampaignManager } from "./CampaignManager";
import { ConsortiaManager } from "./ConsortiaManager";
import { CoreTransactionManager } from "./CoreTransactionManager";
import { NotificationManager } from "./NotificationManager";
import { PlayerManager } from "./PlayerManager";
import { RoomManager } from "./RoomManager";
import { SocketGameReader } from "./SocketGameReader";
import { SocketSceneBufferManager } from "./SocketSceneBufferManager";
import { TaskTraceTipManager } from "./TaskTraceTipManager";
//@ts-expect-error: External dependencies
import CampaignNodeListMsg = com.road.yishi.proto.campaign.CampaignNodeListMsg;
//@ts-expect-error: External dependencies
import CampaignFogMsg = com.road.yishi.proto.campaign.CampaignFogMsg;
//@ts-expect-error: External dependencies
import HangupInfoMsg = com.road.yishi.proto.campaign.HangupInfoMsg;
//@ts-expect-error: External dependencies
import CampaignFogUpdateMsg = com.road.yishi.proto.campaign.CampaignFogUpdateMsg;
//@ts-expect-error: External dependencies
import CampaignNodeSuccMsg = com.road.yishi.proto.campaign.CampaignNodeSuccMsg;
//@ts-expect-error: External dependencies
import PlayerMoveCameraMsg = com.road.yishi.proto.player.PlayerMoveCameraMsg;
//@ts-expect-error: External dependencies
import ArmyMsg = com.road.yishi.proto.army.ArmyMsg;
//@ts-expect-error: External dependencies
import CrossArmyListMsg = com.road.yishi.proto.army.CrossArmyListMsg;

//@ts-expect-error: External dependencies
import CrossArmyMsg = com.road.yishi.proto.army.CrossArmyMsg;
//@ts-expect-error: External dependencies
import CampaignLoginMsg = com.road.yishi.proto.campaign.CampaignLoginMsg;
//@ts-expect-error: External dependencies
import NPCMoveMsg = com.road.yishi.proto.campaign.NPCMoveMsg;
//@ts-expect-error: External dependencies
import CampaignNodeUpdateMsg = com.road.yishi.proto.campaign.CampaignNodeUpdateMsg;
//@ts-expect-error: External dependencies
import CampaignExitMsg = com.road.yishi.proto.campaign.CampaignExitMsg;
//@ts-expect-error: External dependencies
import BossArmyListMsg = com.road.yishi.proto.army.BossArmyListMsg;
//@ts-expect-error: External dependencies
import BossInviteMsg = com.road.yishi.proto.campaign.BossInviteMsg;
//@ts-expect-error: External dependencies
import GuildJoinPlayerInfoMsg = com.road.yishi.proto.guildcampaign.GuildJoinPlayerInfoMsg;
//@ts-expect-error: External dependencies
import NodeLockReqMsg = com.road.yishi.proto.campaign.NodeLockReqMsg;
//@ts-expect-error: External dependencies
import CampaignNodeMsg = com.road.yishi.proto.campaign.CampaignNodeMsg;
//@ts-expect-error: External dependencies
import FogUpdateMsg = com.road.yishi.proto.campaign.FogUpdateMsg;
//@ts-expect-error: External dependencies

import SimpleHeroInfoMsg = com.road.yishi.proto.army.SimpleHeroInfoMsg;
//@ts-expect-error: External dependencies
import ArmyPawnInfoMsg = com.road.yishi.proto.army.ArmyPawnInfoMsg;
//@ts-expect-error: External dependencies
import FightPlayerMsg = com.road.yishi.proto.army.FightPlayerMsg;
//@ts-expect-error: External dependencies
import StandPosMsg = com.road.yishi.proto.campaign.StandPosMsg;
//@ts-expect-error: External dependencies
import NPCFollowMsg = com.road.yishi.proto.campaign.NPCFollowMsg;
//@ts-expect-error: External dependencies
import WorldBossInfoMsg = com.road.yishi.proto.simple.WorldBossInfoMsg;
//@ts-expect-error: External dependencies
import WoundInfoMsg = com.road.yishi.proto.simple.WoundInfoMsg;
//@ts-expect-error: External dependencies
import WorldBossPlayerStateMsg = com.road.yishi.proto.simple.WorldBossPlayerStateMsg;
//@ts-expect-error: External dependencies
import PlayerStateListMsg = com.road.yishi.proto.simple.PlayerStateListMsg;
//@ts-expect-error: External dependencies
import ArmyPosUpdatedMsg = com.road.yishi.proto.army.ArmyPosUpdatedMsg;
//@ts-expect-error: External dependencies
import PosMoveMsg = com.road.yishi.proto.worldmap.PosMoveMsg;
//@ts-expect-error: External dependencies
import MultiCampaignHpSyncMsg = com.road.yishi.proto.campaign.MultiCampaignHpSyncMsg;
//@ts-expect-error: External dependencies
import MultiPlayerHpSyncMsg = com.road.yishi.proto.campaign.MultiPlayerHpSyncMsg;
//@ts-expect-error: External dependencies
import PlayerHangupStateListMsg = com.road.yishi.proto.campaign.PlayerHangupStateListMsg;
//@ts-expect-error: External dependencies
import PlayerHangupStateMsg = com.road.yishi.proto.campaign.PlayerHangupStateMsg;
//@ts-expect-error: External dependencies
import ArmyBufferMsg = com.road.yishi.proto.army.ArmyBufferMsg;
//@ts-expect-error: External dependencies
import ArmyBufferListMsg = com.road.yishi.proto.army.ArmyBufferListMsg;
//@ts-expect-error: External dependencies
import NodeHpMsg = com.road.yishi.proto.guildcampaign.NodeHpMsg;
//@ts-expect-error: External dependencies
import BattleReportMsg = com.road.yishi.proto.battle.BattleReportMsg;
//@ts-expect-error: External dependencies
import BaseItemMsg = com.road.yishi.proto.battle.BaseItemMsg;
//@ts-expect-error: External dependencies
import CampaignNodePosRefershListMsg = com.road.yishi.proto.campaign.CampaignNodePosRefershListMsg;
//@ts-expect-error: External dependencies
import CampaignNodePosRefershMsg = com.road.yishi.proto.campaign.CampaignNodePosRefershMsg;
//@ts-expect-error: External dependencies
import NodeHpListMsg = com.road.yishi.proto.guildcampaign.NodeHpListMsg;
//@ts-expect-error: External dependencies
import CampaignNpcMoveListMsg = com.road.yishi.proto.campaign.CampaignNpcMoveListMsg;
//@ts-expect-error: External dependencies
import CampaignNpcMoveMsg = com.road.yishi.proto.campaign.CampaignNpcMoveMsg;
//@ts-expect-error: External dependencies
import TowerDiedMsg = com.road.yishi.proto.campaign.TowerDiedMsg;
//@ts-expect-error: External dependencies
import PlayerTrialMsg = com.road.yishi.proto.battle.PlayerTrialMsg;
//@ts-expect-error: External dependencies
import TrialInfoMsg = com.road.yishi.proto.battle.TrialInfoMsg;
//@ts-expect-error: External dependencies
import WarFightInfoMsg = com.road.yishi.proto.campaign.WarFightInfoMsg;
//@ts-expect-error: External dependencies
import WarReportListMsg = com.road.yishi.proto.campaign.WarReportListMsg;
//@ts-expect-error: External dependencies
import TimeJudgeMsg = com.road.yishi.proto.campaign.TimeJudgeMsg;
//@ts-expect-error: External dependencies
import WarReportMsg = com.road.yishi.proto.campaign.WarReportMsg;
//@ts-expect-error: External dependencies
import TramcarInfoMsg = com.road.yishi.proto.campaign.TramcarInfoMsg;
//@ts-expect-error: External dependencies
import CarInfo = com.road.yishi.proto.campaign.CarInfo;
//@ts-expect-error: External dependencies
import GuildWarInfoListMsg = com.road.yishi.proto.guildcampaign.GuildWarInfoListMsg;
//@ts-expect-error: External dependencies
import GuildWarInfoMsg = com.road.yishi.proto.guildcampaign.GuildWarInfoMsg;
//@ts-expect-error: External dependencies
import GuildBufferListMsg = com.road.yishi.proto.guildcampaign.GuildBufferListMsg;
//@ts-expect-error: External dependencies
import GuildBufferMsg = com.road.yishi.proto.guildcampaign.GuildBufferMsg;
//@ts-expect-error: External dependencies
import GuildMsg = com.road.yishi.proto.guildcampaign.GuildMsg;
//@ts-expect-error: External dependencies
import NoviceReqMsgMsg = com.road.yishi.proto.novice.NoviceReqMsgMsg;
//@ts-expect-error: External dependencies
import ConsortiaBossStateMsg = com.road.yishi.proto.consortia.ConsortiaBossStateMsg;
//@ts-expect-error: External dependencies
import ConsortiaBossPlayerMsg = com.road.yishi.proto.consortia.ConsortiaBossPlayerMsg;
import NewbieModule from "../module/guide/NewbieModule";
import NewbieConfig from "../module/guide/data/NewbieConfig";
import SimpleAlertHelper from "../component/SimpleAlertHelper";
/**
 * @author:shujin.ou
 * @email:1009865728@qq.com
 * @data: 2020-12-15 10:00
 */
export default class CampaignSocketManger {
  private get mapModel(): CampaignMapModel {
    return CampaignManager.Instance.mapModel;
  }

  private get worldBossModel(): WorldBossModel {
    return CampaignManager.Instance.worldBossModel;
  }

  private get pvpWarFightModel(): PvpWarFightModel {
    return CampaignManager.Instance.pvpWarFightModel;
  }

  private get gvgModel(): GvgMapModel {
    return CampaignManager.Instance.gvgModel;
  }

  private get trialModel(): TrialModel {
    return CampaignManager.Instance.trialModel;
  }

  private get mineralModel(): MineralModel {
    return CampaignManager.Instance.mineralModel;
  }

  private static _instance: CampaignSocketManger;
  private _isProxy: boolean;
  /**
   *该socketmanager是否已在使用中
   * 也就是在当前副本中是否已开启使用
   */
  private _isUse: boolean;

  public static get Instance(): CampaignSocketManger {
    if (!CampaignSocketManger._instance) {
      CampaignSocketManger._instance = new CampaignSocketManger();
    }
    return CampaignSocketManger._instance;
  }

  /**
   *
   * @param isProxy 是否需要读取代理数据
   *
   */
  public setup(isProxy: boolean = false) {
    if (this._isUse) {
      return;
    }
    this._isProxy = isProxy;
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
        SceneType.CAMPAIGN_MAP_SCENE,
      );
    } else {
      this.removeSocketEvent(SocketDataProxyManager.Instance.model);
      this.addSocketEvent(ServerDataManager.Instance);
    }
    NotificationManager.Instance.on(
      CampaignEvent.CAMPAIGN_OVER,
      this.__campaignOverHandler,
      this,
    );
  }

  private __readOverHandler(data: string) {
    Logger.info("[CampaignSocketManger]代理数据读取结束");
    if (data != SceneType.CAMPAIGN_MAP_SCENE) {
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

  private __campaignOverHandler(data: any) {
    this._isUse = false;
    this.removeSocketEvent(ServerDataManager.Instance);
    this.removeSocketEvent(SocketDataProxyManager.Instance.model);
    NotificationManager.Instance.removeEventListener(
      CampaignEvent.CAMPAIGN_OVER,
      this.__campaignOverHandler,
      this,
    );
  }

  private addSocketEvent(dispatch: GameEventDispatcher) {
    Logger.info("addSocketEvent", dispatch);
    dispatch.addEventListener(
      S2CProtocol.U_C_CAMPAIGN_NODE,
      this.__campaignDataHandler,
      this,
    );
    dispatch.addEventListener(
      S2CProtocol.U_C_CAMPAIGN_FOG,
      this.__campaignFogHandler,
      this,
    );
    dispatch.addEventListener(
      S2CProtocol.U_C_LEFT_WEARY,
      this.__hookTimeHandler,
      this,
    );
    dispatch.addEventListener(
      S2CProtocol.U_C_CAMPAIGN_NODE_ADD,
      this.__campaignNodeAddHandler,
      this,
    );
    dispatch.addEventListener(
      S2CProtocol.U_C_NPC_MOVE,
      this.__npcMoveHandler,
      this,
    );
    dispatch.addEventListener(
      S2CProtocol.U_C_CAMPAIGN_NODE_UPDATE,
      this.__updateCampaignNodeHandler,
      this,
    );
    dispatch.addEventListener(
      S2CProtocol.U_C_CAMPAIGN_ARMY_UPDATE,
      this.__updateCampaignArmyHandler,
      this,
    );
    dispatch.addEventListener(
      S2CProtocol.U_C_CAMPAIGN_REPORT,
      this.__campaignResultHandler,
      this,
    );
    dispatch.addEventListener(
      S2CProtocol.U_C_CAMPAIGN_FINISH,
      this.__campaignFinishInfoHandler,
      this,
    );
    dispatch.addEventListener(
      S2CProtocol.U_C_CAMPAIGN_ARMY_UPDATE,
      this.__campaingArmyInfoHandler,
      this,
    );
    dispatch.addEventListener(
      S2CProtocol.U_C_CAMPAIGN_LOGIN_IN,
      this.__campaignLoginInHandler,
      this,
    );
    dispatch.addEventListener(
      S2CProtocol.U_C_CAMPAIGN_LOGIN_OUT,
      this.__campaingLoginOutHandler,
      this,
    );
    dispatch.addEventListener(
      S2CProtocol.U_C_CAMPAIGN_EXIT,
      this.__exitCampaignSceneHandler,
      this,
    );
    dispatch.addEventListener(
      S2CProtocol.U_C_CAMERA_MOVE,
      this.__campaignSceneMoveHandler,
      this,
    );
    dispatch.addEventListener(
      S2CProtocol.U_C_NODE_SUCCESS,
      this.__attackNodeHandler,
      this,
    );
    dispatch.addEventListener(
      S2CProtocol.U_C_CAMPAIGN_FOG_UPDATE,
      this.__updateFogHandler,
      this,
    );
    dispatch.addEventListener(
      S2CProtocol.U_C_CAMPAIGN_BOSS_ARMY_LIST,
      this.__campaignBossArmyListHandler,
      this,
    );
    dispatch.addEventListener(
      S2CProtocol.U_C_CAMPAIGN_BOSS_ARMY_INVITE,
      this.__campaignBossArmyInviteHandler,
      this,
    );
    dispatch.addEventListener(
      S2CProtocol.U_C_ESCORT_NPC_FOLLOW,
      this.__followNpcHandler,
      this,
    );
    dispatch.addEventListener(
      S2CProtocol.U_C_SEND_STANDPOS,
      this.__standPosHandler,
      this,
    );
    dispatch.addEventListener(
      S2CProtocol.U_C_SYNC_BOSS_HP,
      this.__syncBossHpHandler,
      this,
    );
    dispatch.addEventListener(
      S2CProtocol.U_C_PLAYER_DIE_STATE,
      this.__playerDieStateHandler,
      this,
    );
    dispatch.addEventListener(
      S2CProtocol.U_C_MULTI_HPSYNC,
      this.__multiHpsyncHandler,
      this,
    );
    dispatch.addEventListener(
      S2CProtocol.U_C_ARMY_POS_UPDATE,
      this.__updateArmyPosHandler,
      this,
    );
    dispatch.addEventListener(
      S2CProtocol.U_C_ARMYPOS_BROAD,
      this.__armyPosBroadHandler,
      this,
    );
    dispatch.addEventListener(
      S2CProtocol.U_C_ALTARNPC_MOVE,
      this.__altarNpcMoveHandler,
      this,
    );
    dispatch.addEventListener(
      S2CProtocol.U_C_PLAYER_HANGUPSTATE,
      this.__playerHangupstateHandler,
      this,
    );
    dispatch.addEventListener(
      S2CProtocol.U_C_NODE_HP,
      this.__nodeHpHandler,
      this,
    );
    dispatch.addEventListener(
      S2CProtocol.U_C_CAMPIAGN_OPEN_MV,
      this.__campiagnOpenMv,
      this,
    );
    dispatch.addEventListener(
      S2CProtocol.U_BATTLE_REPORT,
      this.__battleInfoResultHandler,
      this,
    );
    dispatch.addEventListener(
      S2CProtocol.U_C_NPC_LOCK,
      this.__lockNpcHandler,
      this,
    );
    dispatch.addEventListener(
      S2CProtocol.U_C_CROSS_ARMY_UPDATE,
      this.__crossArmyUpdateHandler,
      this,
    );
    dispatch.addEventListener(
      S2CProtocol.U_C_NODEPOS_REFERSH,
      this.__nodePosRefershHandler,
      this,
    );
    dispatch.addEventListener(
      S2CProtocol.U_C_BROADBUFFER,
      this.__broadBufferHandler,
      this,
    );
    dispatch.addEventListener(
      SLGSocketEvent.U_PLAY_MOVIE,
      this.__playMovieHandler,
      this,
    );

    NotificationManager.Instance.on(
      NotificationEvent.BATTLE_RESULT,
      this.__battleResultHandler,
      this,
    );
    NotificationManager.Instance.on(
      NotificationEvent.UPDTAE_ARMY,
      this.__updateArmyHandler,
      this,
    );
    NotificationManager.Instance.on(
      NotificationEvent.ROOM_KILL_OUT,
      this.__roomKillOutHandler,
      this,
    );
    dispatch.addEventListener(
      S2CProtocol.U_C_WARFIELD_INFO,
      this.__warfieldInfoHandler,
      this,
    );
    dispatch.addEventListener(
      S2CProtocol.U_C_WARREPORT,
      this.__warreportHandler,
      this,
    );
    dispatch.addEventListener(
      S2CProtocol.U_C_ORDERREQUEST,
      this.__orderrequestHandler,
      this,
    );
    dispatch.addEventListener(
      S2CProtocol.U_C_TIME_JUDGE,
      this.__timeJudgeHandler,
      this,
    );
    dispatch.addEventListener(
      S2CProtocol.U_C_GUILDWAR_SCORE,
      this.__guildWarScoreHandler,
      this,
    );
    dispatch.addEventListener(
      S2CProtocol.U_C_GUILDWAR_BUFFER,
      this.__guildWarBufferHandler,
      this,
    );
    dispatch.addEventListener(
      S2CProtocol.U_C_GUILDWAR_OPEN_LEFTTIME,
      this.__guildWarOpenLeftTimeHandler,
      this,
    );
    dispatch.addEventListener(
      S2CProtocol.U_C_GUILDWAR_JOIN_PLAYER_COUNT,
      this.__guildWarJoinPlayerCount,
      this,
    );
    dispatch.addEventListener(
      S2CProtocol.U_C_GUILDWAR_WOUND,
      this.__gvgWoundListHandler,
      this,
    );
    dispatch.addEventListener(
      S2CProtocol.U_C_TOWER_DIED,
      this.__towerDiedHandler,
      this,
    );
    dispatch.addEventListener(
      S2CProtocol.U_HERO_TRIAL_IFNO,
      this.__trailPropInfoHandler,
      this,
    );
    NotificationManager.Instance.on(
      ChatEvent.UPDATE_CHAT_VIEW,
      this.__playerChatHandler,
      this,
    );
    dispatch.addEventListener(
      S2CProtocol.U_C_SYNC_MINE_TRAMCAR,
      this.__mineralHandler,
      this,
    );
    dispatch.addEventListener(
      S2CProtocol.U_C_CONSORTIA_BOSS_SYNC_HP,
      this.__consortiaBossHpHandler,
      this,
    );
    dispatch.addEventListener(
      S2CProtocol.U_C_CONSORTIA_BOSS_STATE,
      this.__consortiaBossStateUpdateHandler,
      this,
    );
  }

  private removeSocketEvent(dispatch: GameEventDispatcher) {
    dispatch.removeEventListener(
      S2CProtocol.U_C_CAMPAIGN_NODE,
      this.__campaignDataHandler,
      this,
    );
    dispatch.removeEventListener(
      S2CProtocol.U_C_CAMPAIGN_FOG,
      this.__campaignFogHandler,
      this,
    );
    dispatch.removeEventListener(
      S2CProtocol.U_C_LEFT_WEARY,
      this.__hookTimeHandler,
      this,
    );
    dispatch.removeEventListener(
      S2CProtocol.U_C_CAMPAIGN_NODE_ADD,
      this.__campaignNodeAddHandler,
      this,
    );
    dispatch.removeEventListener(
      S2CProtocol.U_C_NPC_MOVE,
      this.__npcMoveHandler,
      this,
    );
    dispatch.removeEventListener(
      S2CProtocol.U_C_CAMPAIGN_NODE_UPDATE,
      this.__updateCampaignNodeHandler,
      this,
    );
    dispatch.removeEventListener(
      S2CProtocol.U_C_CAMPAIGN_ARMY_UPDATE,
      this.__updateCampaignArmyHandler,
      this,
    );
    dispatch.removeEventListener(
      S2CProtocol.U_C_CAMPAIGN_REPORT,
      this.__campaignResultHandler,
      this,
    );
    dispatch.removeEventListener(
      S2CProtocol.U_C_CAMPAIGN_FINISH,
      this.__campaignFinishInfoHandler,
      this,
    );
    dispatch.removeEventListener(
      S2CProtocol.U_C_CAMPAIGN_ARMY_UPDATE,
      this.__campaingArmyInfoHandler,
      this,
    );
    dispatch.removeEventListener(
      S2CProtocol.U_C_CAMPAIGN_LOGIN_IN,
      this.__campaignLoginInHandler,
      this,
    );
    dispatch.removeEventListener(
      S2CProtocol.U_C_CAMPAIGN_LOGIN_OUT,
      this.__campaingLoginOutHandler,
      this,
    );
    dispatch.removeEventListener(
      S2CProtocol.U_C_CAMPAIGN_EXIT,
      this.__exitCampaignSceneHandler,
      this,
    );
    dispatch.removeEventListener(
      S2CProtocol.U_C_CAMERA_MOVE,
      this.__campaignSceneMoveHandler,
      this,
    );
    dispatch.removeEventListener(
      S2CProtocol.U_C_NODE_SUCCESS,
      this.__attackNodeHandler,
      this,
    );
    dispatch.removeEventListener(
      S2CProtocol.U_C_CAMPAIGN_FOG_UPDATE,
      this.__updateFogHandler,
      this,
    );
    dispatch.removeEventListener(
      S2CProtocol.U_C_CAMPAIGN_BOSS_ARMY_LIST,
      this.__campaignBossArmyListHandler,
      this,
    );
    dispatch.removeEventListener(
      S2CProtocol.U_C_CAMPAIGN_BOSS_ARMY_INVITE,
      this.__campaignBossArmyInviteHandler,
      this,
    );
    dispatch.removeEventListener(
      S2CProtocol.U_C_ESCORT_NPC_FOLLOW,
      this.__followNpcHandler,
      this,
    );
    dispatch.removeEventListener(
      S2CProtocol.U_C_SEND_STANDPOS,
      this.__standPosHandler,
      this,
    );
    dispatch.removeEventListener(
      S2CProtocol.U_C_SYNC_BOSS_HP,
      this.__syncBossHpHandler,
      this,
    );
    dispatch.removeEventListener(
      S2CProtocol.U_C_PLAYER_DIE_STATE,
      this.__playerDieStateHandler,
      this,
    );
    dispatch.removeEventListener(
      S2CProtocol.U_C_MULTI_HPSYNC,
      this.__multiHpsyncHandler,
      this,
    );
    dispatch.removeEventListener(
      S2CProtocol.U_C_ARMY_POS_UPDATE,
      this.__updateArmyPosHandler,
      this,
    );
    dispatch.removeEventListener(
      S2CProtocol.U_C_ARMYPOS_BROAD,
      this.__armyPosBroadHandler,
      this,
    );
    dispatch.removeEventListener(
      S2CProtocol.U_C_ALTARNPC_MOVE,
      this.__altarNpcMoveHandler,
      this,
    );
    dispatch.removeEventListener(
      S2CProtocol.U_C_PLAYER_HANGUPSTATE,
      this.__playerHangupstateHandler,
      this,
    );
    dispatch.removeEventListener(
      S2CProtocol.U_C_NODE_HP,
      this.__nodeHpHandler,
      this,
    );
    dispatch.removeEventListener(
      S2CProtocol.U_C_CAMPIAGN_OPEN_MV,
      this.__campiagnOpenMv,
      this,
    );
    dispatch.removeEventListener(
      S2CProtocol.U_BATTLE_REPORT,
      this.__battleInfoResultHandler,
      this,
    );
    dispatch.removeEventListener(
      S2CProtocol.U_C_NPC_LOCK,
      this.__lockNpcHandler,
      this,
    );
    dispatch.removeEventListener(
      S2CProtocol.U_C_CROSS_ARMY_UPDATE,
      this.__crossArmyUpdateHandler,
      this,
    );
    dispatch.removeEventListener(
      S2CProtocol.U_C_NODEPOS_REFERSH,
      this.__nodePosRefershHandler,
      this,
    );
    dispatch.removeEventListener(
      S2CProtocol.U_C_BROADBUFFER,
      this.__broadBufferHandler,
      this,
    );
    dispatch.removeEventListener(
      SLGSocketEvent.U_PLAY_MOVIE,
      this.__playMovieHandler,
      this,
    );

    NotificationManager.Instance.off(
      NotificationEvent.BATTLE_RESULT,
      this.__battleResultHandler,
      this,
    );
    NotificationManager.Instance.off(
      NotificationEvent.UPDTAE_ARMY,
      this.__updateArmyHandler,
      this,
    );
    NotificationManager.Instance.off(
      NotificationEvent.ROOM_KILL_OUT,
      this.__roomKillOutHandler,
      this,
    );

    dispatch.removeEventListener(
      S2CProtocol.U_C_WARFIELD_INFO,
      this.__warfieldInfoHandler,
      this,
    );
    dispatch.removeEventListener(
      S2CProtocol.U_C_WARREPORT,
      this.__warreportHandler,
      this,
    );
    dispatch.removeEventListener(
      S2CProtocol.U_C_ORDERREQUEST,
      this.__orderrequestHandler,
      this,
    );
    dispatch.removeEventListener(
      S2CProtocol.U_C_TIME_JUDGE,
      this.__timeJudgeHandler,
      this,
    );
    dispatch.removeEventListener(
      S2CProtocol.U_C_GUILDWAR_SCORE,
      this.__guildWarScoreHandler,
      this,
    );
    dispatch.removeEventListener(
      S2CProtocol.U_C_GUILDWAR_BUFFER,
      this.__guildWarBufferHandler,
      this,
    );
    dispatch.removeEventListener(
      S2CProtocol.U_C_GUILDWAR_OPEN_LEFTTIME,
      this.__guildWarOpenLeftTimeHandler,
      this,
    );
    dispatch.removeEventListener(
      S2CProtocol.U_C_GUILDWAR_JOIN_PLAYER_COUNT,
      this.__guildWarJoinPlayerCount,
      this,
    );
    dispatch.removeEventListener(
      S2CProtocol.U_C_GUILDWAR_WOUND,
      this.__gvgWoundListHandler,
      this,
    );
    dispatch.removeEventListener(
      S2CProtocol.U_C_TOWER_DIED,
      this.__towerDiedHandler,
      this,
    );
    dispatch.removeEventListener(
      S2CProtocol.U_HERO_TRIAL_IFNO,
      this.__trailPropInfoHandler,
      this,
    );
    NotificationManager.Instance.off(
      ChatEvent.UPDATE_CHAT_VIEW,
      this.__playerChatHandler,
      this,
    );
    dispatch.removeEventListener(
      S2CProtocol.U_C_SYNC_MINE_TRAMCAR,
      this.__mineralHandler,
      this,
    );
    dispatch.removeEventListener(
      S2CProtocol.U_C_CONSORTIA_BOSS_SYNC_HP,
      this.__consortiaBossHpHandler,
      this,
    );
    dispatch.removeEventListener(
      S2CProtocol.U_C_CONSORTIA_BOSS_STATE,
      this.__consortiaBossStateUpdateHandler,
      this,
    );
  }

  /**
   * 战役进入步骤
   * 1.创建战役(获取房间信息与战役信息)
   * 2.节点信息
   * 3.迷雾信息
   * 4.部队信息（获取房间成员与战役部队）
   */
  private __campaignDataHandler(pkg: PackageIn) {
    //节点数据
    let msg = pkg.readBody(CampaignNodeListMsg) as CampaignNodeListMsg;
    let list: Array<CampaignNode> = [];
    for (const key in msg.node) {
      if (msg.node.hasOwnProperty(key)) {
        let $node: CampaignNodeMsg = msg.node[key] as CampaignNodeMsg;
        list.push(this.readNodeInfo($node));
      }
    }
    Logger.info("[CampaignSocketManger]节点数据", list);
    this.mapModel.mapNodesData = list;
  }

  private readNodeInfo(
    $node: CampaignNodeMsg,
    isAdd: boolean = false,
  ): CampaignNode {
    let node: CampaignNode;
    if (isAdd) {
      node = this.mapModel.getMapNodesById($node.nodeId);
    }
    if (!node) {
      node = new CampaignNode();
    }
    let info: PhysicInfo = new PhysicInfo();
    info.id = $node.nodeId;
    node.nodeId = $node.campDataId;
    info.names = $node.nodeName;
    info.types = $node.masterType;
    node.sonType = $node.sonType;
    node.preNodeIds = $node.preNodeIds;
    node.nextNodeIds = $node.nextNodeIds;
    info.state = $node.state;
    info.posX = $node.posX;
    info.posY = $node.posY;
    node.curPosX = $node.curX;
    node.curPosY = $node.curY;
    info.grade = $node.level;
    node.styleType = $node.styleType;
    node.attackTypes = $node.attackTypes;
    node.nameColor = $node.nameColor;
    node.toward = $node.toward;
    node.resource = $node.resource;
    node.resetPosX = $node.resetX;
    node.resetPosY = $node.resetY;
    node.visitServerNames = $node.visitServerName;
    node.visitUserIds = $node.visitUserIds;
    node.fixX = $node.fixX;
    node.fixY = $node.fixY;
    node.handlerRange = $node.handlerRange;
    node.heroTemplateId = $node.heroTempId;
    node.sizeType = $node.sizeType;
    node.fightCapaity = $node.fightCapaity;
    node.param1 = $node.param1;
    node.param2 = $node.param2;
    node.param3 = $node.param3;
    node.param4 = $node.param4;
    if ($node.hasOwnProperty("param5")) {
      node.param5 = $node.param5;
    }
    node.info = info;
    return node;
  }

  /**
   * 更新迷雾信息
   * @param evt
   *
   */
  private __campaignFogHandler(pkg: PackageIn) {
    let msg = pkg.readBody(CampaignFogMsg) as CampaignFogMsg;
    if (!this.mapModel || !this.mapModel.mapTempInfo) return;
    if (this.mapModel.mapTempInfo.Id != msg.mapTempId) {
      return;
    }
    let row: number = msg.row;
    let col: number = msg.col;
    let server: any[] = [];
    let count: number = 0;
    for (let i: number = 0; i < row; i++) {
      let arr: any[] = [];
      for (let j: number = 0; j < msg.forArray[i].length; j++) {
        arr[j] = msg.forArray[i][j];
      }
      server[i] = arr;
    }
    this.mapModel.fogData = server;
    Logger.info("迷雾数据", server);
  }

  /**
   * 修行神殿 挂机剩余
   * @param e
   *
   */
  private __hookTimeHandler(pkg: PackageIn) {
    let msg = pkg.readBody(HangupInfoMsg) as HangupInfoMsg;
    this.mapModel.hookleftWeay = msg.leftWeay;
  }

  /**
   * 添加多个副本节点
   * @param evt
   *
   */
  private __campaignNodeAddHandler(pkg: PackageIn) {
    let msg = pkg.readBody(CampaignNodeListMsg) as CampaignNodeListMsg;
    let list: any[] = [];
    for (const key in msg.node) {
      let $node: CampaignNodeMsg = msg.node[key] as CampaignNodeMsg;
      let node: CampaignNode = this.readNodeInfo($node, true);
      if (!this.mapModel.getMapNodesById(node.info.id)) {
        list.push(node);
      }
    }
    this.mapModel.addNodes = list;
  }

  private static fogViewUnitWidth: number = 110;

  private __updateFogHandler(pkg: PackageIn) {
    let col: number = Math.ceil(
      this.mapModel.mapTempInfo.Width / CampaignSocketManger.fogViewUnitWidth,
    );
    let msg = pkg.readBody(CampaignFogUpdateMsg) as CampaignFogUpdateMsg;
    for (let i: number = 0; i < msg.fogUpdate.length; i++) {
      let fog: FogUpdateMsg = msg.fogUpdate[i] as FogUpdateMsg;
      this.mapModel.syscFogNode(fog.index, fog.fogByte, col);
    }
    msg = null;
  }

  private __attackNodeHandler(pkg: PackageIn) {
    let msg = pkg.readBody(CampaignNodeSuccMsg) as CampaignNodeSuccMsg;
    this.mapModel.currentDieNodeId = msg.nodeId;
    Logger.xjy(
      "[CampaignSocketManger __attackNodeHandler]下一个攻击点nodeId==",
      msg.nodeId,
    );
    msg = null;
    pkg = null;
  }

  private __campaignSceneMoveHandler(pkg: PackageIn) {
    let msg = pkg.readBody(PlayerMoveCameraMsg) as PlayerMoveCameraMsg;
    SocketSceneBufferManager.Instance.addPkgToBuffer(
      pkg,
      msg.scene,
      this.addQueue.bind(this),
    );
    msg = null;
  }

  private __playMovieHandler(pkg: PackageIn) {
    SocketSceneBufferManager.Instance.addPkgToBuffer(
      pkg,
      SceneType.CAMPAIGN_MAP_SCENE,
      this.addQueue.bind(this),
    );
  }

  private __towerDiedHandler(pkg: PackageIn) {
    //地下迷宫死亡,引导复活
    SocketSceneBufferManager.Instance.addPkgToBuffer(
      pkg,
      SceneType.CAMPAIGN_MAP_SCENE,
      this.riverTower.bind(this),
    );
  }

  private riverTower(pkg: PackageIn) {
    let msg: TowerDiedMsg = pkg.readBody(TowerDiedMsg) as TowerDiedMsg;
    let v: any = this.mapModel.selfMemberData;
    this.mapModel.selfMemberData.isDie = 1;
    NotificationManager.Instance.dispatchEvent(
      CampaignMapEvent.MAZE_DIE,
      parseInt(msg.msg),
    );
  }

  private addQueue(pkg: PackageIn) {
    if (CampaignManager.Instance.exit) {
      return;
    }
    CoreTransactionManager.getInstance().currentTimeAddQueue(pkg);
  }

  /**
   * 进入战斗 退出战斗更新玩家的位置 状态
   * @param pkg
   */
  private __updateCampaignArmyHandler(pkg: PackageIn) {
    let msg: ArmyMsg = pkg.readBody(ArmyMsg) as ArmyMsg;
    let otherMsg: CrossArmyMsg = new CrossArmyMsg();
    otherMsg.armyId = msg.armyId;
    otherMsg.curPosX = msg.curPosX;
    otherMsg.curPosY = msg.curPosY;
    otherMsg.playerId = msg.playerId;
    otherMsg.serverName = msg.serverName;
    otherMsg.state = msg.state;
    this.updatePlayerArmyInfo(otherMsg);
  }

  /**
   * 跨服的军队信息更新
   * @param evt
   *
   */
  private __crossArmyUpdateHandler(pkg: PackageIn) {
    let msg = pkg.readBody(CrossArmyListMsg) as CrossArmyListMsg;
    for (const key in msg.armyList) {
      let element: CrossArmyMsg = msg.armyList[key] as CrossArmyMsg;
      this.updatePlayerArmyInfo(element);
    }
  }

  private updatePlayerArmyInfo(msg: CrossArmyMsg) {
    if (null == msg) {
      return;
    }
    let isSysArmy: boolean = false;
    let serverName: string = "";
    if (msg.hasOwnProperty("serverName")) {
      serverName = msg.serverName;
    }
    let army: CampaignArmy = this.mapModel.getBaseArmyByArmyId(
      msg.armyId,
      serverName,
    );
    if (!army) {
      isSysArmy = true;
      army = this.mapModel.getSysArmyByArmyId(msg.armyId, serverName);
      if (!army) {
        army = new CampaignArmy();
        army.id = msg.armyId;
        army.userId = msg.playerId;
        army.baseHero.serviceName = serverName;
        this.mapModel.addSysArmy(army);
      }
    }
    army.state = msg.state;
    army.curPosX = msg.curPosX;
    army.curPosY = msg.curPosY;
    army.syncArmyInfo();
    let selfArmy = ArmyManager.Instance.army;
    if (isSysArmy) {
      NotificationManager.Instance.dispatchEvent(
        CampaignEvent.SYS_ARMY_UPDATE,
        army,
      );
    } else if (this.isSelf(msg.playerId, serverName)) {
      selfArmy.curPosX = msg.curPosX;
      selfArmy.curPosY = msg.curPosY;
    }
    msg = null;
  }

  /**
   * 玩家上线
   * @param evt
   *
   */
  private __campaignLoginInHandler(pkg: PackageIn) {
    let msg = pkg.readBody(CampaignLoginMsg) as CampaignLoginMsg;
    let armyInfo: CampaignArmy = this.mapModel.getBaseArmyByUserId(
      msg.playerId,
      msg.serverName,
    );
    if (armyInfo) {
      armyInfo.online = true;
    }
    NotificationManager.Instance.dispatchEvent(
      NotificationEvent.UPDATE_TEAM_ONLINE_STATUS,
    );
    msg = null;
  }

  /**
   * 玩家下线
   * @param evt
   *
   */
  private __campaingLoginOutHandler(pkg: PackageIn) {
    let msg = pkg.readBody(CampaignLoginMsg) as CampaignLoginMsg;
    let army: CampaignArmy = this.mapModel.getBaseArmyByUserId(
      msg.playerId,
      msg.serverName,
    );
    if (army) {
      army.online = false;
    }
    NotificationManager.Instance.dispatchEvent(
      NotificationEvent.UPDATE_TEAM_ONLINE_STATUS,
    );
    msg = null;
  }

  /**
   *
   * 更新副本军队的状态信息
   *
   */
  private __campaingArmyInfoHandler(pkg: PackageIn) {
    let msg = pkg.readBody(ArmyMsg) as ArmyMsg;
    let id: number = msg.armyId;
    let userId: number = msg.playerId;
    let nickName: string = msg.nickName;
    let type: number = msg.type;
    let serverName: string = "";
    if (msg.hasOwnProperty("serverName")) {
      serverName = msg.serverName;
    }
    let army: BaseArmy;
    if (this.isSelf(userId, serverName)) {
      army = ArmyManager.Instance.army;
    } else {
      army = type == ArmyType.ARMY_SYSTEM ? new BaseArmy() : new BaseArmy();
      army.id = id;
      army.nickName = nickName;
      army.userId = userId;
      army.baseHero.serviceName = serverName;
      army.type = type;
    }
    army.mapId = msg.mapId;
    army.curPosX = msg.curPosX;
    army.curPosY = msg.curPosY;
    army.state = msg.state;

    // 为null依然可以进
    if (msg.simpleHeroInfo) {
      army.baseHero.consortiaID = msg.consortiaId;
      army.baseHero.consortiaName = msg.consortiaName;
      ThaneInfoHelper.readHeroInfo(
        army.baseHero,
        msg.simpleHeroInfo as SimpleHeroInfoMsg,
      );
    }

    for (let k: number = 0; k < msg.armyPawn.length; k++) {
      SocketGameReader.readArmyPawnInfo(
        army,
        msg.armyPawn[k] as ArmyPawnInfoMsg,
      );
    }
    if (army.type == ArmyType.ARMY_SYSTEM) {
      this.mapModel.addSysArmy(army);
    }
  }

  /**
   * 副本通关结果
   * @param evt
   *
   */
  private __campaignResultHandler(pkg: PackageIn) {
    CampaignManager.CampaignOverState = true;
    SocketSceneBufferManager.Instance.addPkgToBuffer(
      pkg,
      SceneType.CAMPAIGN_MAP_SCENE,
      this.addQueue.bind(this),
    );
    TaskTraceTipManager.Instance.clean();
  }

  /**
   * 离开副本
   * @param evt
   *
   */
  private __campaignFinishInfoHandler(pkg: PackageIn) {
    SocketSceneBufferManager.Instance.addPkgToBuffer(
      pkg,
      SceneType.CAMPAIGN_MAP_SCENE,
      this.addQueue.bind(this),
    );
  }

  /**
   * 更新节点的状态
   * @param evt
   *
   */
  private __npcMoveHandler(pkg: PackageIn) {
    if (!this.mapModel) {
      return;
    }
    let msg = pkg.readBody(NPCMoveMsg) as NPCMoveMsg;
    let node: CampaignNode = this.mapModel.getMapNodesById(msg.id);
    if (
      node &&
      SceneManager.Instance.currentType != SceneType.CAMPAIGN_MAP_SCENE
    ) {
      //如果不在副本场景, 直接更新节点坐标信息（如在副本进入战斗中收到此协议）
      node.curPosX = msg.curPosX;
      node.curPosY = msg.curPosY;
    }
    if (node && node.info.types == PosType.BOMBER_MAN) {
      SocketSceneBufferManager.Instance.addPkgToBuffer(
        pkg,
        SceneType.CAMPAIGN_MAP_SCENE,
        this.npcMove.bind(this),
      );
    } else {
      this.mapModel.moveNpc(msg);
      pkg = null;
    }
  }

  private npcMove(pkg: PackageIn) {
    if (!this.mapModel) {
      return;
    }
    let msg = pkg.readBody(NPCMoveMsg) as NPCMoveMsg;
    this.mapModel.moveNpc(msg);
  }

  private __updateCampaignNodeHandler(pkg: PackageIn) {
    let msg = pkg.readBody(CampaignNodeUpdateMsg) as CampaignNodeUpdateMsg;
    let nodeId: number = msg.nodeId;
    let state: number = msg.nodeState;
    let node: CampaignNode = this.mapModel.getMapNodesById(nodeId);
    if (node) {
      node.param1 = msg.param1;
      node.uid = msg.uuId;
      node.fightUserId = msg.userId;
      if (msg.sonType != 0) node.sonType = msg.sonType;
      node.info.state = state;
      if (
        node.info.types == CampaignNodeType.WORLD_BOSS_NOT_PASS &&
        this.mapModel.campaignTemplate.Types == 1
      ) {
        if (node.info.state == NodeState.DESTROYED) {
          NotificationManager.Instance.dispatchEvent(
            WorldBossEvent.UPDATE_WORLDBOSS_NODE_STATE,
          );
        }
      }
      node.visitServerNames = msg.visitServerName;
      node.visitUserIds = msg.visitUserIds;
    }
  }

  private __exitCampaignSceneHandler(pkg: PackageIn) {
    let msg = pkg.readBody(CampaignExitMsg) as CampaignExitMsg;
    Logger.base("[CampaignSocketManger]收到退出副本", msg);
    SimpleAlertHelper.Instance.Hide();

    // 处理新手重连会进内城bug
    if (!NewbieModule.Instance.checkEnterCastle()) {
      return;
    }

    if (msg.result > 0) {
      let userId: number = msg.playerId;
      let armyId: number = msg.armyId;

      if (this.isSelf(userId, msg.serverName)) {
        RoomManager.Instance.dispose();
        CampaignManager.Instance.exit = true;
        NotificationManager.Instance.dispatchEvent(
          NotificationEvent.CROSS_ADD_GOONBTN,
        ); //跨副本自己退出
        this.exitBack();
      } else {
        if (this.mapModel) {
          this.mapModel.removeBaseArmyByArmyId(armyId, msg.serverName);
          if (this.roomInfo)
            this.roomInfo.removePlayerByUserId(userId, msg.serverName);
        }
        if (this.roomInfo) {
          this.roomInfo.removePlayerByUserId(userId, msg.serverName);
        }
      }
    }
  }

  private isSelf(userId: number, serverName: string): boolean {
    if (this.mapModel && this.mapModel.isCross) {
      return (
        userId == this.selfPlayerInfo.userId &&
        serverName == this.selfPlayerInfo.serviceName
      );
    } else {
      return userId == this.selfPlayerInfo.userId;
    }
  }

  private get roomInfo(): RoomInfo {
    return RoomManager.Instance.roomInfo;
  }

  private __campaignBossArmyListHandler(pkg: PackageIn) {
    let msg = pkg.readBody(BossArmyListMsg) as BossArmyListMsg;

    let boss: ThaneInfo = new ThaneInfo();
    boss.nickName = msg.bossName;
    boss.grades = msg.level;
    boss.templateId = msg.bossTemplateId;
    let dic: Map<number, ThaneInfo> = new Map();
    for (const key in msg.fightPlayer) {
      if (msg.fightPlayer.hasOwnProperty(key)) {
        let fPlayer: FightPlayerMsg = msg.fightPlayer[key] as FightPlayerMsg;
        let playerInfo: ThaneInfo = new ThaneInfo();
        playerInfo.userId = fPlayer.playerId;
        playerInfo.nickName = fPlayer.nickName;
        playerInfo.pics = fPlayer.pic;
        dic[playerInfo.userId] = playerInfo;
      }
    }
    this.mapModel.attackBossTeam(dic, msg.leftFightTime, boss);
    pkg = null;
    msg = null;
  }

  private __campaignBossArmyInviteHandler(pkg: PackageIn) {
    let msg = pkg.readBody(BossInviteMsg) as BossInviteMsg;
    let boss: ThaneInfo = new ThaneInfo();
    boss.nickName = msg.bossNick;
    boss.grades = msg.level;
    boss.templateId = msg.templateId;

    this.mapModel.inviteAttackBoos(
      msg.nickName,
      boss,
      msg.leftFightTime,
      new Laya.Point(msg.posX, msg.posY),
    );
    msg = null;
    pkg = null;
  }

  /**
   * 玩家说话泡泡
   * @param evt
   */
  private __playerChatHandler(evtData) {
    var chatData: ChatData = evtData as ChatData;
    if (!this.mapModel || !chatData) return;
    if (
      chatData.channel != ChatChannel.TEAM &&
      chatData.channel != ChatChannel.WORLD &&
      chatData.channel != ChatChannel.BIGBUGLE &&
      chatData.channel != ChatChannel.CONSORTIA
    ) {
      return;
    }
    var aInfo: CampaignArmy = this.mapModel.getUserArmyByUserId(
      chatData.uid,
      chatData.serverName,
    );
    if (aInfo) aInfo.chatData = chatData;
  }

  /**
   * 同步站立位置
   * @param evt
   *
   */
  private __standPosHandler(pkg: PackageIn) {
    let msg = pkg.readBody(StandPosMsg) as StandPosMsg;
    let army: CampaignArmy = this.mapModel.getBaseArmyByArmyId(
      msg.id,
      msg.serverName,
    );
    army.curPosX = msg.posX;
    army.curPosY = msg.posY;
    let selfArmy = ArmyManager.Instance.army;
    if (selfArmy.id == msg.id) {
      selfArmy.curPosX = msg.posX;
      selfArmy.curPosY = msg.posY;
    }
    this.mapModel.standPos(msg);
  }

  /**
   * NPC跟随
   * @param evt
   *
   */
  private __followNpcHandler(pkg: PackageIn) {
    let msg = pkg.readBody(NPCFollowMsg) as NPCFollowMsg;
    let node: CampaignNode = this.mapModel.getMapNodesById(msg.escortId);
    if (node) {
      node.curPosX = msg.curPosX;
      node.curPosY = msg.curPosY;
      node.followTarget = msg.followId;
    }
    msg = null;
  }

  /**
   * 同步世界boss血量 及伤害榜
   * @param evt
   *
   */
  private __syncBossHpHandler(pkg: PackageIn) {
    let msg = pkg.readBody(WorldBossInfoMsg) as WorldBossInfoMsg;
    if (this.mapModel.campaignTemplate.CampaignId != msg.campaignId) {
      return;
    }
    Logger.xjy(
      "[CampaignSocketManger]__syncBossHpHandler",
      msg.curHp,
      msg.totalHp,
    );
    this.worldBossModel.curHp = msg.curHp;
    this.worldBossModel.totalHp = msg.totalHp;
    this.worldBossModel.campaignId = msg.campaignId;
    this.worldBossModel.totalNum = msg.totalNum;
    this.worldBossModel.buffGrade = msg.bufferGrade;
    this.worldBossModel.selfWoundInfo.wound = msg.myWound;
    this.worldBossModel.selfWoundInfo.totalHp = msg.totalHp;
    this.worldBossModel.selfWoundInfo.nickName =
      PlayerManager.Instance.currentPlayerModel.playerInfo.nickName;
    this.worldBossModel.selfWoundInfo.job =
      PlayerManager.Instance.currentPlayerModel.playerInfo.job;
    this.worldBossModel.bossGrades = msg.grades;
    for (let i: number = 0; i < msg.woundInfo.length; i++) {
      let temp: WoundInfoMsg = msg.woundInfo[i] as WoundInfoMsg;
      let wound: WoundInfo = this.worldBossModel.getWoundInfoByNickname(
        temp.nickName,
      );
      if (!wound) {
        wound = new WoundInfo(i);
      }
      if (wound) {
        wound.nickName = temp.nickName;
        wound.wound = temp.wound;
        wound.userId = temp.userId;
        wound.totalHp = this.worldBossModel.totalHp;
        wound.job = temp.job;
      }
      this.worldBossModel.addWoundInfo(wound);
    }
    this.worldBossModel.commit();
  }

  /**
   * 同步玩家死亡状态
   * @param evt
   *
   */
  private __playerDieStateHandler(pkg: PackageIn) {
    let msg = pkg.readBody(PlayerStateListMsg) as PlayerStateListMsg;
    for (const key in msg.playerState) {
      let pInfo: WorldBossPlayerStateMsg = msg.playerState[
        key
      ] as WorldBossPlayerStateMsg;
      let bNode: CampaignArmy = this.mapModel.getBaseArmyByArmyId(
        pInfo.armyId,
        pInfo.serverName,
      );
      if (bNode) {
        bNode.riverStartTime = new Date().getTime();
        bNode.riverTime = pInfo.leftTime;
        bNode.isDie = pInfo.state;
      }
    }
  }

  private __multiHpsyncHandler(pkg: PackageIn) {
    let msg = pkg.readBody(MultiCampaignHpSyncMsg) as MultiCampaignHpSyncMsg;
    let curNode: CampaignNode = this.mapModel.getMapNodeByNodeId(msg.nodeId);
    if (curNode) {
      curNode.totalHp = msg.nodeTotalHp;
      curNode.curHp = msg.nodeHp;
    }
    for (const key in msg.playerHp) {
      let pMsg: MultiPlayerHpSyncMsg = msg.playerHp[
        key
      ] as MultiPlayerHpSyncMsg;
      let aInfo: CampaignArmy = this.mapModel.getBaseArmyByArmyId(pMsg.armyId);
      if (aInfo) {
        aInfo.totalHp = pMsg.totalHp;
        aInfo.curHp = pMsg.curHp;
      }
    }
  }

  private __updateArmyPosHandler(pkg: PackageIn) {
    let msg = pkg.readBody(ArmyPosUpdatedMsg) as ArmyPosUpdatedMsg;
    this.mapModel.gotoPosArmy(msg);
  }

  /**
   * 同步玩家位置
   * @param evt
   *
   */
  private __armyPosBroadHandler(pkg: PackageIn) {
    let msg = pkg.readBody(PosMoveMsg) as PosMoveMsg;
    this.mapModel.movePathsArmy(msg);
  }

  /**
   * 同步玩家的挂机状态
   * @param evt
   *
   */
  private __playerHangupstateHandler(pkg: PackageIn) {
    let msg = pkg.readBody(
      PlayerHangupStateListMsg,
    ) as PlayerHangupStateListMsg;
    let arr: any[] = msg.hanupState;
    for (const key in arr) {
      let info: PlayerHangupStateMsg = arr[key] as PlayerHangupStateMsg;
      let cArmy: CampaignArmy = this.mapModel.getBaseArmyByArmyId(info.armyId);
      if (cArmy) {
        cArmy.hangupState = info.state; //0未挂机, 1挂机
      }
    }
  }

  /**
   * 更新部队的信息
   * @param evt
   *
   */
  private __updateArmyHandler(data: any) {
    let bArmy: any = data;
    if (!bArmy || !bArmy.baseHero || !this.roomInfo) {
      return;
    }
    let aInfo: CampaignArmy = this.roomInfo.getPlayerByUserId(
      bArmy.userId,
      bArmy.baseHero.serviceName,
    );
    if (aInfo && aInfo.baseHero) {
      aInfo.baseHero.armsEquipAvata = bArmy.baseHero.armsEquipAvata;
      aInfo.baseHero.bodyEquipAvata = bArmy.baseHero.bodyEquipAvata;
      aInfo.baseHero.hideFashion = bArmy.baseHero.hideFashion;
      aInfo.baseHero.armsFashionAvata = bArmy.baseHero.armsFashionAvata;
      aInfo.baseHero.bodyFashionAvata = bArmy.baseHero.bodyFashionAvata;
      aInfo.baseHero.wingAvata = bArmy.baseHero.wingAvata;
      aInfo.baseHero.hairFashionAvata = bArmy.baseHero.hairFashionAvata;
    }
  }

  private __battleResultHandler(data: any) {
    if (!data && this.mapModel && this.mapModel.selfMemberData) {
      this.mapModel.selfMemberData.angle = -1;
    }
  }

  /**
   * 部队buffer
   * @param evt
   *
   */
  private __broadBufferHandler(pkg: PackageIn) {
    let msg = pkg.readBody(ArmyBufferListMsg) as ArmyBufferListMsg;
    for (const key in msg.armyBuffer) {
      let aBuffer: ArmyBufferMsg = msg.armyBuffer[key] as ArmyBufferMsg;
      let aInfo: CampaignArmy = this.mapModel.getBaseArmyByUserId(
        aBuffer.userId,
      );
      aInfo.bufferTempId = aBuffer.bufferTempId;
    }
  }

  /**
   * 战场最后10秒时间同步动画
   * @param event
   *
   */
  protected __campiagnOpenMv(pkg: PackageIn) {
    this.mapModel.showOpenTimeMv();
  }

  /**
   * 魔神祭坛移动npc
   */
  private __altarNpcMoveHandler(pkg: PackageIn) {
    SocketSceneBufferManager.Instance.addPkgToBuffer(
      pkg,
      SceneType.CAMPAIGN_MAP_SCENE,
      this.moveNpc.bind(this),
    );
  }

  private moveNpc(pkg: PackageIn) {
    if (!this.mapModel) {
      return;
    }
    let msgList = pkg.readBody(
      CampaignNpcMoveListMsg,
    ) as CampaignNpcMoveListMsg;
    for (const key in msgList.campaignNpcMove) {
      let msg: CampaignNpcMoveMsg = msgList.campaignNpcMove[
        key
      ] as CampaignNpcMoveMsg;
      let node: CampaignNode = this.mapModel.getMapNodesById(msg.nodeId);
      if (node && node.info && node.nodeView) {
        node.uid = msg.uuId;
        let sysTime: Date =
          PlayerManager.Instance.currentPlayerModel.sysCurtime;
        let showTime: Date = DateFormatter.parse(
          msg.showTime,
          "YYYY-MM-DD hh:mm:ss",
        );
        let offTime: number = sysTime.getTime() - showTime.getTime();
        node.createTime = showTime.getTime();
        offTime = offTime < 0 ? 0 : offTime;
        let paths: any[];
        let frame: number;
        if (msg.centerX > 0 && msg.centerY > 0) {
          paths = CampaignManager.Instance.controller.findPath.find(
            new Laya.Point(msg.startX, msg.startY),
            new Laya.Point(msg.centerX, msg.centerY),
          );
          paths = paths.concat(
            CampaignManager.Instance.controller.findPath.find(
              new Laya.Point(msg.centerX, msg.centerY - 1),
              new Laya.Point(msg.endX, msg.endY),
            ),
          );
        } else {
          paths = CampaignManager.Instance.controller.findPath.find(
            new Laya.Point(msg.startX, msg.startY),
            new Laya.Point(msg.endX, msg.endY),
          );
        }
        switch (node.info.types) {
          case PosType.BOMBER_MAN:
            frame = offTime / 400;
            break;
          default:
            frame = offTime / 800;
        }
        if (!paths) {
          return;
        }
        if (frame >= paths.length) {
          node.nodeView.x = msg.endX * 20;
          node.nodeView.y = msg.endY * 20;
          (node.nodeView["aiInfo"] as AIBaseInfo).pathInfo = null;
        } else {
          let p: Laya.Point = paths[frame];
          node.nodeView.x = p.x * 20;
          node.nodeView.y = p.y * 20;
          if (msg.isMove && node.info.state != NodeState.FIGHTING) {
            (node.nodeView["aiInfo"] as AIBaseInfo).pathInfo = paths;
            if (frame > 1) {
              (node.nodeView["aiInfo"] as AIBaseInfo).walkIndex = frame;
            }
          } else {
            (node.nodeView["aiInfo"] as AIBaseInfo).pathInfo = null;
          }
        }
      }
    }
  }

  /**
   * 节点位置变更
   * @param evt
   *
   */
  private __nodePosRefershHandler(pkg: PackageIn) {
    let msg = pkg.readBody(
      CampaignNodePosRefershListMsg,
    ) as CampaignNodePosRefershListMsg;
    for (const key in msg.node) {
      let item: CampaignNodePosRefershMsg = msg.node[
        key
      ] as CampaignNodePosRefershMsg;
      if (this.mapModel.mapId != item.mapId) {
        return;
      }
      let nodeInfo: CampaignNode = this.mapModel.getMapNodesById(item.nodeId);
      nodeInfo.info.state = item.state;
      nodeInfo.info.posX = item.posX;
      nodeInfo.info.posY = item.posY;
      nodeInfo.fixX = item.posX * Tiles.WIDTH;
      nodeInfo.fixY = item.posY * Tiles.HEIGHT;
      nodeInfo.curPosX = item.posX;
      nodeInfo.curPosY = item.posY;
      nodeInfo.move(item.posX, item.posY);
    }
  }

  /**
   * 同步血量
   * @param evt
   *
   */
  private __nodeHpHandler(pkg: PackageIn) {
    let msg = pkg.readBody(NodeHpListMsg) as NodeHpListMsg;
    for (const key in msg.nodeHp) {
      let node: NodeHpMsg = msg.nodeHp[key] as NodeHpMsg;
      let nInfo: CampaignNode = this.mapModel.getMapNodeByNodeId(node.nodeId);
      if (nInfo) {
        nInfo.totalHp = node.totalHp;
        nInfo.curHp = node.currentHp;
      }
    }
  }

  private __mineralHandler(pkg: PackageIn) {
    let msg = pkg.readBody(TramcarInfoMsg) as TramcarInfoMsg;
    var leng: number = msg.carInfo.length;
    if (!this.mineralModel) return;
    this.mineralModel.maxCount = msg.count;
    this.mineralModel.multiple = msg.multiple;
    if (leng > 1) this.mineralModel.resetCarInfos();
    for (var i: number = 0; i < leng; i++) {
      var userId: number = msg.carInfo[i].userId;
      var info: MineralCarInfo = this.mineralModel.getCarInfoById(userId);
      if (!info) info = new MineralCarInfo();
      info.ownerId = userId;
      info.isUpdate = true;
      info.armyId = msg.carInfo[i].armyId;
      info.minerals = msg.carInfo[i].minerals;
      info.quality = msg.carInfo[i].quality;
      info.get_count = msg.carInfo[i].tramcarCount;
      info.hand_count = msg.carInfo[i].handCount;
      info.pick_count = msg.carInfo[i].pickCount;
      if (info.is_own != msg.carInfo[i].isOwn) {
        info.is_own = msg.carInfo[i].isOwn;
        this.mineralModel.addCarInfo(info);
        this.setCarUpdate(userId);
      } else {
        info.is_own = msg.carInfo[i].isOwn;
        this.mineralModel.addCarInfo(info);
      }
    }
    this.mineralModel.activeTime = msg.activeTime;
    this.mineralModel.commit();
  }

  /**
   * 同步公会boss血量
   * @param evt
   *
   */
  private __consortiaBossHpHandler(pkg: PackageIn) {
    let msg: WorldBossInfoMsg = pkg.readBody(
      WorldBossInfoMsg,
    ) as WorldBossInfoMsg;
    if (!WorldBossHelper.checkConsortiaBoss(this.mapModel.mapId)) return;
    Logger.xjy(
      "CampaignSocketManger consortiaBossHpHandler curHp==",
      msg.curHp,
    );
    Logger.xjy(
      "CampaignSocketManger consortiaBossHpHandler totalHp==",
      msg.totalHp,
    );
    this.worldBossModel.consortiaBossCurHp = msg.curHp;
    this.worldBossModel.consortiaBosstotalHp = msg.totalHp;
    this.worldBossModel.commitConosrtiaBossHp();
  }

  private __consortiaBossStateUpdateHandler(pkg: PackageIn) {
    let msg: ConsortiaBossStateMsg = pkg.readBody(
      ConsortiaBossStateMsg,
    ) as ConsortiaBossStateMsg;
    let bossInfo: ConsortiaBossInfo = ConsortiaManager.Instance.model.bossInfo;
    bossInfo.taskProcessArr = [
      msg.missionAProcess,
      msg.missionBProcess,
      msg.missionCProcess,
    ];
    bossInfo.taskSkillIdProcessArr = [
      msg.missionASkillId,
      msg.missionBSkillId,
      msg.missionCSkillId,
    ];
    for (let i: number = 0; i < msg.playerList.length; i++) {
      let bossPlayerMsg: ConsortiaBossPlayerMsg = msg.playerList[
        i
      ] as ConsortiaBossPlayerMsg;
      var bossUserInfo: ConsortiaBossUserInfo =
        bossInfo.getBossUserInfoByUserId(bossPlayerMsg.userid);
      if (!bossUserInfo) {
        bossUserInfo = new ConsortiaBossUserInfo();
        bossUserInfo.userid = bossPlayerMsg.userid;
        bossInfo.addBossUserInfo(bossUserInfo);
      }
      bossUserInfo.mineralsCount = bossPlayerMsg.collectCount;
      bossUserInfo.propCount = bossPlayerMsg.missionItemCount;
    }
    NotificationManager.Instance.dispatchEvent(
      NotificationEvent.CONSORTIA_BOSS_STATE_UPDATE,
    );
  }

  /**
   * 创建或者删除矿车
   * @param userId
   *
   */
  private setCarUpdate(userId: number) {
    var army: CampaignArmy = this.mapModel.getUserArmyByUserId(userId);
    if (army) {
      this.mineralModel.updateCar(army);
    }
  }

  /**
   * 战斗结果, 掉落宝箱
   * @param evt
   *
   */
  private __battleInfoResultHandler(pkg: PackageIn) {
    let msg = pkg.readBody(BattleReportMsg) as BattleReportMsg;

    let goods: any[] = [];
    let _signId: string;
    let _pos: Laya.Point;
    let goodsCount: number = msg.baseItem.length;
    let baseItem: BaseItemMsg;
    for (let j: number = 0; j < goodsCount; j++) {
      baseItem = msg.baseItem[j] as BaseItemMsg;

      let goodInfo: GoodsInfo = new GoodsInfo();
      goodInfo.templateId = baseItem.templateId;
      goodInfo.count = baseItem.count;
      goods.push(goodInfo);
    }

    if (goodsCount > 0) {
      _signId = msg.signId;
      _pos = new Laya.Point(msg.posX, msg.posY);
    }

    if (goods.length > 0 && this.mapModel) {
      let node: CampaignNode = new CampaignNode();
      let info: ChestInfo = new ChestInfo();
      let army: any = this.mapModel.selfMemberData;
      if (!army) {
        army = ArmyManager.Instance.army;
      }
      info.id = 1000000000000 + Number(Math.random() * 100000);
      node.nodeId = 1000000000000 + Number(Math.random() * 100000);
      info.signId = _signId;
      info.names = LangManager.Instance.GetTranslation(
        "battle.handler.BattleResultHandler.name",
      );
      info.types = PosType.FALL_CHEST;
      node.sonType = 2201;
      node.preNodeIds = "";
      node.nextNodeIds = "";
      info.state = NodeState.EXIST;
      info.posX = army.curPosX;
      info.posY = army.curPosY;

      info.nodePosX = _pos.x;
      info.nodePosY = _pos.y;
      info.grade = 0;
      node.info = info;
      node.tempData = goods;
      this.mapModel.addTempChestNode(node);
    }
  }

  /**
   * 退出房间
   * @param evt
   *
   */
  private __roomKillOutHandler(data: number) {
    let armyId: number = data;
    let aInfo: CampaignArmy;
    if (this.mapModel) {
      aInfo = this.mapModel.removeBaseArmyByArmyId(armyId);
    }
  }

  /**
   * 同步公会战参战人数信息
   *
   * @param pkg
   */
  private __guildWarJoinPlayerCount(pkg: PackageIn) {
    let msg = pkg.readBody(GuildJoinPlayerInfoMsg) as GuildJoinPlayerInfoMsg;
    let info: GuildWarJoinPlayerInfo = new GuildWarJoinPlayerInfo();
    info.red_count = msg.redCount;
    info.red_id = msg.redConsortiaId;
    info.blue_count = msg.blueCount;
    info.blue_id = msg.blueConsortiaId;
    this.gvgModel.joinPlayerinfo = info;
  }

  private exitBack() {
    if (SceneManager.Instance.currentType != SceneType.CAMPAIGN_MAP_SCENE) {
      CampaignManager.Instance.dispose();
    } else {
      SwitchPageHelp.returnToSpace();
    }
  }

  public get selfPlayerInfo(): PlayerInfo {
    return PlayerManager.Instance.currentPlayerModel.playerInfo;
  }

  private __lockNpcHandler(pkg: PackageIn) {
    let msg = pkg.readBody(NodeLockReqMsg) as NodeLockReqMsg;
    let node: CampaignNode = this.mapModel.getMapNodeByNodeId(msg.nodeId);
    if (node && node.nodeView instanceof AvatarBaseView) {
      let nodeView: AvatarBaseView = node.nodeView as AvatarBaseView;
      nodeView.info.pathInfo = [];
      nodeView.restrictMoveCount = 130; //限制130帧
    }
  }

  /**
   * 英雄试炼BUFF信息
   */
  private __trailPropInfoHandler(pkg: PackageIn) {
    let msg = pkg.readBody(PlayerTrialMsg) as PlayerTrialMsg;
    Logger.xjy("[CampaignSocketManger]__trailPropInfoHandler", msg);
    this.trialModel.currentLayer = msg.param1;
    this.trialModel.rewardExp = msg.param2;
    this.trialModel.rewardBox = msg.param3;
    msg.trialInfos.forEach((item: TrialInfoMsg) => {
      let info: TrailPropInfo = this.trialModel.getShopItemByIndex(item.index);
      if (!info) {
        info = new TrailPropInfo();
        this.trialModel.addShopItem(info);
      }
      info.index = item.index;
      info.id = item.skillId;
      info.currentCount = item.param1;
      info.maxCount = item.param2;
      info.cost = item.param3;
    });
  }

  /**
   * 战场的相关信息
   *
   */
  private __warfieldInfoHandler(pkg: PackageIn) {
    let msg = pkg.readBody(WarFightInfoMsg) as WarFightInfoMsg;
    this.pvpWarFightModel.pvpWarFightInfo.hitCount = msg.hitCount;
    this.pvpWarFightModel.pvpWarFightInfo.leftTime = msg.leftTime;
    this.pvpWarFightModel.pvpWarFightInfo.oneCount = msg.oneCount;
    this.pvpWarFightModel.pvpWarFightInfo.oneScore = msg.oneScore;
    this.pvpWarFightModel.pvpWarFightInfo.order = msg.order;
    this.pvpWarFightModel.pvpWarFightInfo.score = msg.score;
    this.pvpWarFightModel.pvpWarFightInfo.teamId = msg.teamId;
    this.pvpWarFightModel.pvpWarFightInfo.geste = msg.geste;
    this.pvpWarFightModel.pvpWarFightInfo.twoCount = msg.twoCount;
    this.pvpWarFightModel.pvpWarFightInfo.twoScore = msg.twoScore;
    this.pvpWarFightModel.pvpWarFightInfo.commit();
  }

  /**
   * 战场结束以后的结束面板
   *
   */
  private __warreportHandler(pkg: PackageIn) {
    let rtnScene: string = SwitchPageHelp.returnScene;
    SocketSceneBufferManager.Instance.addPkgToBuffer(
      pkg,
      rtnScene,
      this.__warReportCall.bind(this),
    );
  }

  /**
   * 战场中的排名
   *
   */
  private __orderrequestHandler(pkg: PackageIn) {
    let msg = pkg.readBody(WarReportListMsg) as WarReportListMsg;
    let arr: any[] = [];
    for (let i: number = 0; i < msg.info.length; i++) {
      let item: WarReportMsg = msg.info[i] as WarReportMsg;
      let info: WarFightOrderInfo = new WarFightOrderInfo();
      info.hitCount = item.hitCount;
      info.nickName = item.nickName;
      info.order = item.order;
      info.score = item.score;
      info.userId = item.userId;
      info.teamId = item.teamId;
      info.geste = item.geste;
      info.serverName = item.serverName;
      arr.push(info);
    }
    this.pvpWarFightModel.warFightOrderList = arr;
    NotificationManager.Instance.dispatchEvent(
      PvpWarFightEvent.PVP_WAR_FIGHT_ORDER_REPORT,
      { list: arr, report: null },
    );
  }

  /**
   * 时间容错
   *
   */
  private __timeJudgeHandler(pkg: PackageIn) {
    let msg = pkg.readBody(TimeJudgeMsg) as TimeJudgeMsg;
    this.mapModel.syncErrorTime = msg.secondCount;
  }

  /**
   * 公会战比分
   *
   * @param pkg
   */
  private __guildWarScoreHandler(pkg: PackageIn) {
    let msg: GuildWarInfoListMsg = pkg.readBody(
      GuildWarInfoListMsg,
    ) as GuildWarInfoListMsg;
    for (let i = 0, len = msg.guildWarInfos.length; i < len; i++) {
      const info: GuildWarInfoMsg = msg.guildWarInfos[i] as GuildWarInfoMsg;
      if (
        info.consortiaId ==
        PlayerManager.Instance.currentPlayerModel.playerInfo.consortiaID
      ) {
        this.gvgModel.selfConsortiaId = info.consortiaId;
        this.gvgModel.selfConsortiaName = info.consrotiaName;
        this.gvgModel.selfScore = info.score;
        this.gvgModel.selfGuardCount = info.noviceCount;
      } else {
        this.gvgModel.enemyConsortiaId = info.consortiaId;
        this.gvgModel.enemyConsortiaName = info.consrotiaName;
        this.gvgModel.enemyScore = info.score;
        this.gvgModel.enemyGuardCount = info.noviceCount;
      }
    }
    this.gvgModel.commit();
  }

  /**
   * 公会战技能信息
   *
   * @param pkg
   */
  private __guildWarBufferHandler(pkg: PackageIn) {
    let msg: GuildBufferListMsg = pkg.readBody(
      GuildBufferListMsg,
    ) as GuildBufferListMsg;
    for (let i = 0, len = msg.buffers.length; i < len; i++) {
      const gmsg: GuildBufferMsg = msg.buffers[i] as GuildBufferMsg;
      let g: GvgWarBufferInfo = this.gvgModel.getGvgBufferByTemplateId(
        gmsg.templateId,
      );
      if (!g) g = new GvgWarBufferInfo();
      g.bufferNameLang = gmsg.bufferName;
      g.consortiaId = gmsg.consortiaId;
      g.curreCount = gmsg.curreCount;
      g.maxCdTimer = gmsg.maxCdTimer;
      g.startDateStr = gmsg.param1;
      g.needPay = gmsg.needPay;
      g.objectData = gmsg.objectData;
      g.templateId = gmsg.templateId;
      g.DescriptionLang = gmsg.descr;

      this.gvgModel.addGvgBuffer(g);
    }
    this.gvgModel.commit();
  }

  /**
   * 公会战开启倒计时
   *
   * @param pkg
   */
  private __guildWarOpenLeftTimeHandler(pkg: PackageIn) {
    SocketSceneBufferManager.Instance.addPkgToBuffer(
      pkg,
      SceneType.CAMPAIGN_MAP_SCENE,
      this.guildWarOpenLeftTime.bind(this),
    );
  }

  private guildWarOpenLeftTime(pkg: PackageIn) {
    if (CampaignManager.Instance.exit) return;
    let msg: GuildMsg = pkg.readBody(GuildMsg) as GuildMsg;

    if (msg.param1 > 0) {
      this.gvgModel.dispatchGuildWarOpenLeftTime(msg.param1);
    }
  }

  /**
   * 公会战贡献排行
   * @param evt
   *
   */
  private __gvgWoundListHandler(pkg: PackageIn) {
    let msg: WorldBossInfoMsg = pkg.readBody(
      WorldBossInfoMsg,
    ) as WorldBossInfoMsg;
    let info: GvgTopTenInfo = new GvgTopTenInfo();
    info.list = [];
    let topTenItem: GvgContributionInfo;
    for (let i = 0, len = msg.castleWound.length; i < len; i++) {
      const item: WoundInfoMsg = msg.castleWound[i] as WoundInfoMsg;
      topTenItem = new GvgContributionInfo();
      topTenItem.contribution = item.wound;
      topTenItem.job = item.job;
      topTenItem.nickName = item.nickName;
      topTenItem.userId = item.userId;
      info.list.push(topTenItem);
      if (item.userId == ArmyManager.Instance.thane.userId) {
        info.contribution = item.wound;
      }
    }

    info.list = ArrayUtils.sortOn(
      info.list,
      "contribution",
      ArrayConstant.DESCENDING | ArrayConstant.NUMERIC,
    );
    this.gvgModel.topTen = info;
  }

  private __warReportCall(pkg: PackageIn) {
    let msg = pkg.readBody(WarReportListMsg) as WarReportListMsg;
    let report: WarReportInfo = new WarReportInfo();
    report.ownCount = msg.ownCount;
    report.teamCount = msg.teamCount;
    report.oneScore = msg.oneScore;
    report.twoScore = msg.twoScore;
    report.thdScore = msg.thdScore;
    report.oneTeamId = msg.oneTeamId;
    report.tempId = msg.tempId;
    report.thdTeamId = msg.thdTemaId;
    report.twoTeamId = msg.twoTeamId;
    this.pvpWarFightModel.fightReportInfo = report;
    report.commit();
    let arr: Array<WarFightOrderInfo> = [];
    for (let i = 0; i < msg.info.length; i++) {
      let item: WarReportMsg = msg.info[i] as WarReportMsg;
      let info: WarFightOrderInfo = new WarFightOrderInfo();
      info.hitCount = item.hitCount;
      info.nickName = item.nickName;
      info.order = item.order;
      info.score = item.score;
      info.userId = item.userId;
      info.teamId = item.teamId;
      info.geste = item.geste;
      info.serverName = item.serverName;
      info.honner = item.winGesteCount;
      info.medal = item.itemCount;
      arr.push(info);
    }
    this.pvpWarFightModel.warFightOrderList = arr;
    FrameCtrlManager.Instance.open(EmWindow.RvrBattleResultWnd, { type: 2 });
    NotificationManager.Instance.dispatchEvent(
      PvpWarFightEvent.PVP_WAR_FIGHT_ORDER_REPORT,
      { list: arr, report: report },
    );
  }

  public dispose() {
    this.removeSocketEvent(ServerDataManager.Instance);
  }
}
