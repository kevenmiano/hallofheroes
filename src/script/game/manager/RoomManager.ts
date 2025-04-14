import Logger from "../../core/logger/Logger";
import { PackageIn } from "../../core/net/PackageIn";
import { ServerDataManager } from "../../core/net/ServerDataManager";
import SDKManager from "../../core/sdk/SDKManager";
import WanChannel from "../../core/sdk/wan/WanChannel";
import { BattleManager } from "../battle/BattleManager";
import { t_s_campaignData } from "../config/t_s_campaign";
import {
  ChatEvent,
  NotificationEvent,
} from "../constant/event/NotificationEvent";
import { S2CProtocol } from "../constant/protocol/S2CProtocol";
import { RoomType } from "../constant/RoomDefine";
import { StateType } from "../constant/StateType";
import { ChatChannel } from "../datas/ChatChannel";
import { PlayerInfo } from "../datas/playerinfo/PlayerInfo";
import { ThaneInfo } from "../datas/playerinfo/ThaneInfo";
import { CampaignArmy } from "../map/campaign/data/CampaignArmy";
import { SceneManager } from "../map/scene/SceneManager";
import SceneType from "../map/scene/SceneType";
import ChatData from "../module/chat/data/ChatData";
import { RoomInfo } from "../mvc/model/room/RoomInfo";
import RoomScene from "../scene/RoomScene";
import { SwitchPageHelp } from "../utils/SwitchPageHelp";
import { ArmyManager } from "./ArmyManager";
import { NotificationManager } from "./NotificationManager";
import { PlayerManager } from "./PlayerManager";

//@ts-expect-error: External dependencies
import ArmyFightPosEditListMsg = com.road.yishi.proto.army.ArmyFightPosEditListMsg;
//@ts-expect-error: External dependencies
import HeroEquUpdatedMsg = com.road.yishi.proto.army.HeroEquUpdatedMsg;
//@ts-expect-error: External dependencies
import ChangeMasterRspMsg = com.road.yishi.proto.room.ChangeMasterRspMsg;
//@ts-expect-error: External dependencies
import EditRoomRspMsg = com.road.yishi.proto.room.EditRoomRspMsg;
//@ts-expect-error: External dependencies
import KillPlayerRspMsg = com.road.yishi.proto.room.KillPlayerRspMsg;
//@ts-expect-error: External dependencies
import PlaceStateRspMsg = com.road.yishi.proto.room.PlaceStateRspMsg;
//@ts-expect-error: External dependencies
import PlayerReadyRspMsg = com.road.yishi.proto.room.PlayerReadyRspMsg;
//@ts-expect-error: External dependencies
import PlayerReady = com.road.yishi.proto.room.PlayerReadyRspMsg.PlayerReady;
//@ts-expect-error: External dependencies
import RoomExitRspMsg = com.road.yishi.proto.room.RoomExitRspMsg;
//@ts-expect-error: External dependencies
import RoomPlayerListMsg = com.road.yishi.proto.room.RoomPlayerListMsg;
//@ts-expect-error: External dependencies
import RoomPlayerMsg = com.road.yishi.proto.room.RoomPlayerMsg;
//@ts-expect-error: External dependencies
import RoomStateRspMsg = com.road.yishi.proto.room.RoomStateRspMsg;
//@ts-expect-error: External dependencies
import RoomReqMsg = com.road.yishi.proto.room.RoomReqMsg;
//@ts-expect-error: External dependencies
import PropertyMsg = com.road.yishi.proto.simple.PropertyMsg;
import { NativeChannel } from "../../core/sdk/native/NativeChannel";
import { FrameCtrlManager } from "../mvc/FrameCtrlManager";
import { EmWindow } from "../constant/UIDefine";
import { RoomState } from "../constant/RoomState";
import { CampaignAreaInfo } from "../module/pve/pveCampaign/model/CampaignAreaInfo";

export class RoomManager {
  /**
   *是否退出房间
   */
  public exit: boolean;
  public controller: RoomScene;
  public isSetUp: boolean;
  // 记录副本信息,选择副本后创建房间 不做清理
  public static selectAreaInfo: CampaignAreaInfo;
  public static selectDiffculty: number;
  private static _selectCampaign: t_s_campaignData;
  public static get selectCampaign(): t_s_campaignData {
    if (!RoomManager.selectAreaInfo || !RoomManager.selectDiffculty) {
      Logger.warn(
        "[RoomManager]selectAreaInfo=",
        RoomManager.selectAreaInfo,
        "selectDiffculty",
        RoomManager.selectDiffculty,
      );
      return null;
    }
    RoomManager._selectCampaign = RoomManager.selectAreaInfo.getMapByDifficult(
      RoomManager.selectDiffculty,
    );
    return RoomManager._selectCampaign;
  }
  public static set selectCampaign(value) {
    if (!value) {
      RoomManager.selectAreaInfo = null;
      RoomManager.selectDiffculty = null;
    }
    RoomManager._selectCampaign = value;
  }

  private _roomInfo: RoomInfo;
  public get roomInfo(): RoomInfo {
    return this._roomInfo;
  }
  public set roomInfo(value: RoomInfo) {
    this._roomInfo = value;
  }

  private static _instance: RoomManager;
  public static get Instance(): RoomManager {
    if (!RoomManager._instance) RoomManager._instance = new RoomManager();
    return RoomManager._instance;
  }

  public setup($roomInfo: RoomInfo) {
    Logger.info("[RoomManager]setup", $roomInfo);

    this.exit = false;
    this.isSetUp = true;
    if ($roomInfo.roomType == RoomType.MATCH) {
      BattleManager.preScene = SceneType.PVP_ROOM_SCENE;
    } else if ($roomInfo.roomType == RoomType.NORMAL) {
      BattleManager.preScene = SceneType.PVE_ROOM_SCENE;
    }
    this._roomInfo = $roomInfo;
    ServerDataManager.listen(
      S2CProtocol.U_C_CAMPAIGN_ROOM_MEMBER,
      this,
      this.__roomMemberHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_CAMPAIGN_ARMYPOS_SEND,
      this,
      this.__requestTeamPosHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_CAMPAIGN_ROOM_EDIT,
      this,
      this.__updateRoomInfoHandler,
    );

    ServerDataManager.listen(
      S2CProtocol.U_C_CAMPAIGN_ROOM_KILLPLAYER,
      this,
      this.__campaingkillOutHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_PLAYER_READY_STATE,
      this,
      this.__updateReaderStateHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_CAMPAIGN_ROOM_EXIT,
      this,
      this.__returnRoomHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_CAMPAIGN_ROOM_MASTER,
      this,
      this.__updateHouseOwnerHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_ROOM_STATE,
      this,
      this.__updateRoomStateHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_CAMPAGIN_ROOM_PLACESTATE,
      this,
      this.__roomPlaceStateChangeHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_HERO_BROAD_EQUIPMENT,
      this,
      this.__otherHeroInfoChange,
    );
    NotificationManager.Instance.addEventListener(
      ChatEvent.UPDATE_CHAT_VIEW,
      this.__playerChatHandler,
      this,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_VOTE_KILLPLAYE,
      this,
      this.__crossCampaingkillOutHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_MATCH_COMFIRE,
      this,
      this.__crossMatchComfirmHandler,
    );
  }

  public dispose() {
    ServerDataManager.cancel(
      S2CProtocol.U_C_CAMPAIGN_ROOM_MEMBER,
      this,
      this.__roomMemberHandler,
    );
    ServerDataManager.cancel(
      S2CProtocol.U_C_CAMPAIGN_ARMYPOS_SEND,
      this,
      this.__requestTeamPosHandler,
    );
    ServerDataManager.cancel(
      S2CProtocol.U_C_CAMPAIGN_ROOM_EDIT,
      this,
      this.__updateRoomInfoHandler,
    );

    ServerDataManager.cancel(
      S2CProtocol.U_C_CAMPAIGN_ROOM_KILLPLAYER,
      this,
      this.__campaingkillOutHandler,
    );
    ServerDataManager.cancel(
      S2CProtocol.U_C_PLAYER_READY_STATE,
      this,
      this.__updateReaderStateHandler,
    );
    ServerDataManager.cancel(
      S2CProtocol.U_C_CAMPAIGN_ROOM_EXIT,
      this,
      this.__returnRoomHandler,
    );
    ServerDataManager.cancel(
      S2CProtocol.U_C_CAMPAIGN_ROOM_MASTER,
      this,
      this.__updateHouseOwnerHandler,
    );
    ServerDataManager.cancel(
      S2CProtocol.U_C_ROOM_STATE,
      this,
      this.__updateRoomStateHandler,
    );
    ServerDataManager.cancel(
      S2CProtocol.U_C_CAMPAGIN_ROOM_PLACESTATE,
      this,
      this.__roomPlaceStateChangeHandler,
    );
    ServerDataManager.cancel(
      S2CProtocol.U_C_HERO_BROAD_EQUIPMENT,
      this,
      this.__otherHeroInfoChange,
    );
    ServerDataManager.cancel(
      S2CProtocol.U_C_VOTE_KILLPLAYE,
      this,
      this.__crossCampaingkillOutHandler,
    );
    ServerDataManager.cancel(
      S2CProtocol.U_C_MATCH_COMFIRE,
      this,
      this.__crossMatchComfirmHandler,
    );
    NotificationManager.Instance.removeEventListener(
      ChatEvent.UPDATE_CHAT_VIEW,
      this.__playerChatHandler,
      this,
    );
    // 从副本退出有时候需要回到房间大厅 此时需要roomInfo信息, 所以在创建副本的时候覆盖
    // this._roomInfo = null;
    this.controller = null;
    this.isSetUp = false;
    RoomManager._instance = null;
    if (
      BattleManager.preScene == SceneType.PVP_ROOM_SCENE ||
      BattleManager.preScene == SceneType.PVE_ROOM_SCENE
    ) {
      BattleManager.preScene = "";
    }
    ArmyManager.Instance.thane.inviteContent = "";
  }

  /** 判断自己是否在房间 */
  public get isSelfInRoom() {
    if (this._roomInfo) {
      let army = this._roomInfo.getPlayerByUserId(
        ArmyManager.Instance.thane.userId,
      );
      return Boolean(army);
    }
    return false;
  }

  private __playerChatHandler(data: ChatData) {
    var chatData: ChatData = data as ChatData;
    if (SceneManager.Instance.currentType == SceneType.CAMPAIGN_MAP_SCENE) {
      return;
    }
    if (
      chatData.channel != ChatChannel.TEAM &&
      chatData.channel != ChatChannel.WORLD &&
      chatData.channel != ChatChannel.BIGBUGLE &&
      chatData.channel != ChatChannel.CONSORTIA
    ) {
      return;
    }

    var aInfo: CampaignArmy = this._roomInfo.getPlayerByUserId(
      chatData.uid,
      chatData.serverName,
    );
    if (aInfo) aInfo.chatData = chatData;
  }

  private __otherHeroInfoChange(pkg: PackageIn) {
    var msg = pkg.readBody(HeroEquUpdatedMsg) as HeroEquUpdatedMsg;
    var userId: number = msg.playerId;
    var army: CampaignArmy = this.roomInfo.getPlayerByUserId(userId, "");
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

  private __roomMemberHandler(pkg: PackageIn) {
    let msg = pkg.readBody(RoomPlayerListMsg) as RoomPlayerListMsg;
    Logger.xjy("[RoomManager]__roomMemberHandler", msg);
    for (var i: number = 0; i < msg.roomPlayer.length; i++) {
      this.readMember(msg.roomPlayer[i] as RoomPlayerMsg);
    }
  }

  private __requestTeamPosHandler(pkg: PackageIn) {
    let msg = pkg.readBody(ArmyFightPosEditListMsg) as ArmyFightPosEditListMsg;
    Logger.xjy("[RoomManager]__requestTeamPosHandler 队伍位置改变", msg);
    this.roomInfo.armyFightPos = msg.armyFightPos;
  }

  private readMember(player: RoomPlayerMsg) {
    Logger.xjy("[RoomManager]添加玩家", player);
    this._roomInfo.id = player.roomId;
    this._roomInfo.curCount = player.count;

    var aInfo: CampaignArmy = this.roomInfo.getPlayerByUserId(
      player.playerId,
      player.serverName,
    );
    if (!aInfo) {
      aInfo = new CampaignArmy();
    }
    var hInfo: ThaneInfo;
    aInfo.pos = player.currentRoomIndex;
    aInfo.roomState = player.playerState;
    var id: number = player.heroId;
    var userId: number = player.playerId;
    if (userId == PlayerManager.Instance.currentPlayerModel.playerInfo.userId) {
      hInfo = ArmyManager.Instance.thane;
      aInfo.baseHero = hInfo;
    } else {
      hInfo = aInfo.baseHero;
    }
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
    hInfo.job = player.job;

    aInfo.userId = userId;
    aInfo.id = player.armyId;
    aInfo.combatPower = player.fightingCapacity;
    aInfo.curPosX = player.curPosX;
    aInfo.curPosY = player.curPosY;
    aInfo.mapId = player.campaignId;
    aInfo.online = player.onlineState;
    aInfo.isNoGet = player.isNoGet;
    aInfo.mountTemplateId = player.mountTempId;
    aInfo.mountGrade = player.mountGrade;
    if (player.vehicleTemplateId) {
      hInfo.vehicleTempId = player.vehicleTemplateId;
    }
    if (player.petTemplateId) {
      hInfo.petTemplateId = player.petTemplateId;
      aInfo.petInfo.petTemplateId = player.petTemplateId;
    } else {
      hInfo.petTemplateId = 0;
      aInfo.petInfo.petTemplateId = 0;
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

    if (player.mulSportScore) {
      hInfo.mulSportScore = player.mulSportScore;
    } else {
      hInfo.mulSportScore = 0;
    }
    if (player.segmentId) {
      hInfo.segmentId = player.segmentId;
    } else {
      hInfo.segmentId = 1001;
    }

    hInfo.consortiaID = player.consortiaId;
    hInfo.consortiaName = player.consortiaName;
    aInfo.isReturnedPlayer = player.isReturnedPlayer;
    this._roomInfo.addArmy(aInfo);
    this._roomInfo.commit();
  }

  private __updateRoomInfoHandler(pkg: PackageIn) {
    var msg = pkg.readBody(EditRoomRspMsg) as EditRoomRspMsg;
    Logger.xjy("[RoomManager]__updateRoomInfoHandler 刷新房间", msg);
    var roomId: number = msg.roomId;
    var campaignId: number = msg.startCampaignId;
    var houseOwnerId: number = msg.masterId;
    var curCount: number = msg.count;
    var capacity: number = msg.capacity;
    if (this._roomInfo.id == roomId) {
      this._roomInfo.houseOwnerId = houseOwnerId;
      this._roomInfo.campaignId = campaignId;
      this._roomInfo.curCount = curCount;
      this._roomInfo.capacity = capacity;
      // 为空取消房间密码
      this._roomInfo.password = msg.passWord;
      this._roomInfo.commit();

      ArmyManager.Instance.thane.inviteContent = "";
    }
  }

  /**
   * 踢人
   * @param evt
   *
   */
  private __campaingkillOutHandler(pkg: PackageIn) {
    var msg = pkg.readBody(KillPlayerRspMsg) as KillPlayerRspMsg;
    Logger.xjy("[RoomManager]__campaingkillOutHandler 踢人", msg);
    var roomId: number = msg.roomId;
    var userId: number = msg.killedPlayerId;
    if (this._roomInfo && roomId == this._roomInfo.id) {
      if (userId == this.selfPlayerInfo.userId) {
        this.exit = true;
        var data: object;
        var curScene: string = SceneManager.Instance.currentType;
        if (curScene == SceneType.PVE_ROOM_SCENE) {
          data = { isOpenPveRoomList: true };
        } else if (curScene == SceneType.PVP_ROOM_SCENE) {
          data = { isOpenPvpRoomList: true };
        } else if (this._roomInfo.roomType == RoomType.VEHICLE) {
          NotificationManager.Instance.sendNotification(
            NotificationEvent.VEHICLE_ROOM_KILL_OUT,
            userId,
          );
          this.dispose();
          return;
        }
        SwitchPageHelp.returnToSpace(data);
      } else {
        var killPlayer: CampaignArmy = this._roomInfo.removePlayerByUserId(
          userId,
          "",
        );
        if (killPlayer)
          NotificationManager.Instance.sendNotification(
            NotificationEvent.ROOM_KILL_OUT,
            killPlayer.id,
          );
      }
    }
    this._roomInfo.commit();
  }

  private __updateReaderStateHandler(pkg: PackageIn) {
    let msg = pkg.readBody(PlayerReadyRspMsg) as PlayerReadyRspMsg;
    for (var i: number = 0; i < msg.readyState.length; i++) {
      var userId: number = (msg.readyState[i] as PlayerReady).playerId;
      var roomState: number = (msg.readyState[i] as PlayerReady).readyState;
      var roomPlayer: CampaignArmy = this._roomInfo.getPlayerByUserId(
        userId,
        "",
      );
      if (roomPlayer) {
        roomPlayer.roomState = roomState;
        roomPlayer.commit();
        Logger.log("玩家准备位置状态改变: ===" + roomState);
      }
    }
    this._roomInfo.commit();
  }
  /**
   * 从房间返回 , 如果是自己从房间返回, 则进入内城, 如果是别人, 则从房间中移除该玩家
   * @param evt
   *
   */
  private __returnRoomHandler(pkg: PackageIn) {
    let msg = pkg.readBody(RoomExitRspMsg) as RoomExitRspMsg;
    Logger.xjy("[RoomManager]__returnRoomHandler离开房间", msg);
    var userId: number = msg.playerId;
    if (this._roomInfo) {
      let channel = SDKManager.Instance.getChannel();
      if (channel instanceof WanChannel) {
        channel.exitTeamRoom(this._roomInfo.id + "");
      } else if (channel instanceof NativeChannel) {
        let roomId = NativeChannel.TEAM_ROOM + this._roomInfo.id;
        channel.leaveChatRoom(roomId);
      }
      this._roomInfo.removePlayerByUserId(userId, "");
      if (userId == this.selfPlayerInfo.userId) {
        this.exit = true; //标记为退出, 则在离开房间场景时, 会销毁房间信息
        var data: object;
        var curScene: string = SceneManager.Instance.currentType;
        if (curScene == SceneType.PVE_ROOM_SCENE) {
          data = { isOpenPveRoomList: true };
        } else if (curScene == SceneType.PVP_ROOM_SCENE) {
          data = { isOpenPvpRoomList: true };
        }
        SwitchPageHelp.returnToSpace(data);
      }
      this._roomInfo.commit();
    }
  }

  private __updateHouseOwnerHandler(pkg: PackageIn) {
    let msg = pkg.readBody(ChangeMasterRspMsg) as ChangeMasterRspMsg;
    var houseOwnerId: number = msg.masterId;
    if (this._roomInfo) {
      this._roomInfo.houseOwnerId = houseOwnerId;
      this._roomInfo.isCross = msg.isCross;
      if (msg.isCross) this._roomInfo.serverName = msg.serverName;
      this._roomInfo.commit();
      var roomPlayer: CampaignArmy = this._roomInfo.getPlayerByUserId(
        houseOwnerId,
        "",
      );
      if (roomPlayer) roomPlayer.commit();
    }
  }

  private __updateRoomStateHandler(pkg: PackageIn) {
    let msg = pkg.readBody(RoomStateRspMsg) as RoomStateRspMsg;
    var state: number = msg.roomState;
    this._roomInfo.roomState = state;
    this._roomInfo.commit();
  }

  private __roomPlaceStateChangeHandler(pkg: PackageIn) {
    var msg = pkg.readBody(PlaceStateRspMsg) as PlaceStateRspMsg;
    var len: number = msg.placeState.length;
    var temp: any[] = [];
    for (var i: number = 0; i < len; i++) {
      temp[i] = msg.placeState[i];
    }
    this.roomInfo.placesState = temp;
  }

  /**
   *跨服表决踢人
   *
   */
  private __crossCampaingkillOutHandler(pkg: PackageIn) {
    var msg: RoomReqMsg = pkg.readBody(RoomReqMsg) as RoomReqMsg;
    FrameCtrlManager.Instance.open(EmWindow.CrossPvPVoteWnd, {
      descStr: msg.password,
    });
  }

  /**
   *跨服收到撮合成功提示界面
   *
   */
  private __crossMatchComfirmHandler(pkg: PackageIn) {
    var msg: PropertyMsg = pkg.readBody(PropertyMsg) as PropertyMsg;
    var frameData: any = {};
    frameData.leftBoss = msg.param1;
    frameData.totalBoss = msg.param2;
    frameData.campaignName = msg.param4;
    frameData.campaignUid = msg.param5;
    frameData.roomId = msg.param6;
    FrameCtrlManager.Instance.open(EmWindow.CrossPvPSuccessWnd, {
      leftBoss: msg.param1,
      totalBoss: msg.param2,
      campaignName: msg.param4,
      campaignUid: msg.param5,
      roomId: msg.param6,
    });
  }

  public get selfPlayerInfo(): PlayerInfo {
    return PlayerManager.Instance.currentPlayerModel.playerInfo;
  }
}
