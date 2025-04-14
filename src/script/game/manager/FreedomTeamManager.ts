import LangManager from "../../core/lang/LangManager";
import { PackageIn } from "../../core/net/PackageIn";
import { ServerDataManager } from "../../core/net/ServerDataManager";
import { NativeChannel } from "../../core/sdk/native/NativeChannel";
import SDKManager from "../../core/sdk/SDKManager";
import WanChannel from "../../core/sdk/wan/WanChannel";
import FreedomTeamApplyAction from "../battle/actions/FreedomTeamApplyAction";
import {
  FreedomTeamEvent,
  SpaceEvent,
} from "../constant/event/NotificationEvent";
import { S2CProtocol } from "../constant/protocol/S2CProtocol";
import { StateType } from "../constant/StateType";
import { ThaneInfo } from "../datas/playerinfo/ThaneInfo";
import { SceneManager } from "../map/scene/SceneManager";
import SceneType from "../map/scene/SceneType";
import { BaseArmy } from "../map/space/data/BaseArmy";
import FreedomTeamModel from "../module/team/FreedomTeamModel";
import PopFrameCheck from "../utils/PopFrameCheck";
import { WorldBossHelper } from "../utils/WorldBossHelper";
import { ArmyManager } from "./ArmyManager";
import { CampaignManager } from "./CampaignManager";
import FreedomTeamSocketOutManager from "./FreedomTeamSocketOutManager";
import { MessageTipManager } from "./MessageTipManager";
import { NotificationManager } from "./NotificationManager";
import { PlayerManager } from "./PlayerManager";

//@ts-expect-error: External dependencies
import PropertyMsg = com.road.yishi.proto.simple.PropertyMsg;
//@ts-expect-error: External dependencies
import InviteTeamMsg = com.road.yishi.proto.team.InviteTeamMsg;
//@ts-expect-error: External dependencies
import MemberFightPosListMsg = com.road.yishi.proto.team.MemberFightPosListMsg;
//@ts-expect-error: External dependencies
import TeamInfoMsg = com.road.yishi.proto.team.TeamInfoMsg;
//@ts-expect-error: External dependencies
import TeamPlayerInfoMsg = com.road.yishi.proto.team.TeamPlayerInfoMsg;

/**
 * @author:pzlricky
 * @data: 2021-04-29 16:27
 * @description ***
 */
export default class FreedomTeamManager {
  private static _instance: FreedomTeamManager;
  public static get Instance(): FreedomTeamManager {
    if (!FreedomTeamManager._instance) {
      FreedomTeamManager._instance = new FreedomTeamManager();
    }
    return FreedomTeamManager._instance;
  }

  private _model: FreedomTeamModel;
  public get model(): FreedomTeamModel {
    return this._model;
  }

  public setup() {
    ServerDataManager.listen(
      S2CProtocol.U_C_TEAM_CREATE,
      this,
      this.__teamCreateHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_TEAM_DISMISS,
      this,
      this.__teamDismissHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_TEAM_ADD_MEMBER,
      this,
      this.__teamAddMemberHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_TEAM_PLAYER_INFO,
      this,
      this.__teamPlayerInfoHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_TEAM_INVITE,
      this,
      this.__teamInviteHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_TEAM_LEAVE_FOR_NOW,
      this,
      this.__teamAFKHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_TEAM_CAPTAIN_CHANGE,
      this,
      this.__teamCaptainChangeHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_TEAM_MEMBER_LEFT,
      this,
      this.__teamMemberLeftHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_TEAM_KICK_MEMBER,
      this,
      this.__teamKickMemberHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_TEAM_FIGHT_POS_CHANGE,
      this,
      this.__teamFightPosChangeHandler,
    );
  }

  private __teamCreateHandler(pkg: PackageIn) {
    let msg = pkg.readBody(TeamInfoMsg) as TeamInfoMsg;
    if (this._model) {
      this._model.dispose();
    }
    this._model = new FreedomTeamModel();
    this._model.captainId = msg.captainId;
    this._model.memberId = msg.memberId;
    this._model.teamId = msg.teamId;
    for (var i: number = 0; i < msg.memberDetail.length; i++) {
      this.readMember(msg.memberDetail[i] as TeamPlayerInfoMsg);
    }
    NotificationManager.Instance.dispatchEvent(
      FreedomTeamEvent.TEAM_INFO_UPDATE,
      null,
    );
    // 队伍相关操作去掉人物显示隐藏
    // NotificationManager.Instance.dispatchEvent(SpaceEvent.HIDE_OTHERS, null);
    //加入组队
    let channel = SDKManager.Instance.getChannel();
    if (channel instanceof WanChannel) {
      if (msg.teamId) {
        channel.joinTeamRoom(msg.teamId.toString(), true);
      }
    } else if (channel instanceof NativeChannel) {
      let roomId = NativeChannel.TEAM + msg.teamId;
      channel.joinChatRoom(roomId);
    }
  }

  private __teamDismissHandler(pkg: PackageIn) {
    if (this._model) {
      this._model.dispose();
      this._model = null;
      NotificationManager.Instance.dispatchEvent(
        FreedomTeamEvent.TEAM_INFO_UPDATE,
        null,
      );
    }
    // 队伍相关操作去掉人物显示隐藏
    // NotificationManager.Instance.dispatchEvent(SpaceEvent.HIDE_OTHERS, null);
  }

  private __teamAddMemberHandler(pkg: PackageIn) {
    let msg = pkg.readBody(TeamInfoMsg) as TeamInfoMsg;
    if (!this._model) {
      this._model = new FreedomTeamModel();
    }
    this._model.captainId = msg.captainId;
    this._model.memberId = msg.memberId;
    this._model.teamId = msg.teamId;
    for (var i: number = 0; i < msg.memberDetail.length; i++) {
      this.readMember(msg.memberDetail[i] as TeamPlayerInfoMsg);
    }
    NotificationManager.Instance.dispatchEvent(
      FreedomTeamEvent.TEAM_INFO_UPDATE,
      null,
    );
    // 队伍相关操作去掉人物显示隐藏
    // NotificationManager.Instance.dispatchEvent(SpaceEvent.HIDE_OTHERS, null);
  }

  private __teamPlayerInfoHandler(pkg: PackageIn) {
    if (!this._model) {
      return;
    }
    let msg = pkg.readBody(TeamInfoMsg) as TeamInfoMsg;
    for (var i: number = 0; i < msg.memberDetail.length; i++) {
      this.readMember(msg.memberDetail[i] as TeamPlayerInfoMsg);
    }
    NotificationManager.Instance.dispatchEvent(
      FreedomTeamEvent.TEAM_INFO_SYNC,
      null,
    );
  }

  private __teamInviteHandler(pkg: PackageIn) {
    let msg = pkg.readBody(InviteTeamMsg) as InviteTeamMsg;

    if (this.checkScene()) {
      var content: string = LangManager.Instance.GetTranslation(
        "managers.FreedomTeamManager.teamInviteTxt",
        msg.inviterName,
      );
      PopFrameCheck.Instance.addAction(
        new FreedomTeamApplyAction(msg.inviterId, content),
      );
    }
  }

  public inviteMember(userId: number) {
    if (this.checkScene(true)) {
      FreedomTeamSocketOutManager.sendInvite(userId);
    }
  }

  private checkScene(showTips: boolean = false): boolean {
    var currentType: string = SceneManager.Instance.currentType;
    switch (currentType) {
      case SceneType.WARLORDS_ROOM:
        if (showTips) {
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation(
              "managers.FreedomTeamManager.checkSceneTipsTxt01",
            ),
          );
        }
        return false;
        break;
    }
    return true;
  }

  private __teamAFKHandler(pkg: PackageIn) {
    if (!this._model) {
      return;
    }

    let msg = pkg.readBody(PropertyMsg) as PropertyMsg;

    NotificationManager.Instance.dispatchEvent(
      FreedomTeamEvent.TEAM_INFO_UPDATE,
      null,
    );
  }

  private __teamCaptainChangeHandler(pkg: PackageIn) {
    if (!this._model) {
      return;
    }
    let msg = pkg.readBody(PropertyMsg) as PropertyMsg;
    this._model.captainId = msg.param1;
    NotificationManager.Instance.dispatchEvent(
      FreedomTeamEvent.TEAM_INFO_UPDATE,
      null,
    );
  }

  private __teamMemberLeftHandler(pkg: PackageIn) {
    if (!this._model) {
      return;
    }
    let msg = pkg.readBody(PropertyMsg) as PropertyMsg;
    this.removeMemberByUserId(msg.param1);
    // 队伍相关操作去掉人物显示隐藏
    // NotificationManager.Instance.dispatchEvent(SpaceEvent.HIDE_OTHERS, null);
  }

  private __teamKickMemberHandler(pkg: PackageIn) {
    if (!this._model) {
      return;
    }
    let msg = pkg.readBody(PropertyMsg) as PropertyMsg;
    this.removeMemberByUserId(msg.param1);
    // 队伍相关操作去掉人物显示隐藏
    // NotificationManager.Instance.dispatchEvent(SpaceEvent.HIDE_OTHERS, null);
  }

  private removeMemberByUserId(userId: number) {
    if (userId == PlayerManager.Instance.currentPlayerModel.playerInfo.userId) {
      if (this._model) {
        //移出组队
        let channel = SDKManager.Instance.getChannel();
        if (channel instanceof WanChannel) {
          if (this._model.teamId) {
            channel.exitTeamRoom(this._model.teamId.toString(), true);
          }
        } else if (channel instanceof NativeChannel) {
          let roomId = NativeChannel.TEAM + this._model.teamId;
          channel.leaveChatRoom(roomId);
        }
        this._model.dispose();
        this._model = null;
      }
    } else {
      this._model.removeMemberByUserId(userId);
    }
    NotificationManager.Instance.dispatchEvent(
      FreedomTeamEvent.TEAM_INFO_UPDATE,
      null,
    );
  }

  private __teamFightPosChangeHandler(pkg: PackageIn) {
    if (!this._model) {
      return;
    }
    let msg = pkg.readBody(MemberFightPosListMsg) as MemberFightPosListMsg;
    this._model.memberFightPos = msg.memberPos;
    NotificationManager.Instance.dispatchEvent(
      FreedomTeamEvent.TEAM_INFO_UPDATE,
      null,
    );
  }

  private readMember(player: TeamPlayerInfoMsg) {
    var aInfo: BaseArmy = this._model.getMemberByUserId(player.playerId);
    if (!aInfo) {
      aInfo = new BaseArmy();
    }
    var hInfo: ThaneInfo;
    if (
      player.playerId ==
      PlayerManager.Instance.currentPlayerModel.playerInfo.userId
    ) {
      hInfo = ArmyManager.Instance.thane;
      aInfo.baseHero = hInfo;
    } else {
      hInfo = aInfo.baseHero;
    }
    if (player.hasOwnProperty("frameId")) {
      hInfo.frameId = player.frameId;
    }
    if (player.hasOwnProperty("heroId")) {
      hInfo.id = player.heroId;
    }
    if (player.hasOwnProperty("playerId")) {
      hInfo.userId = player.playerId;
    }
    if (player.hasOwnProperty("isVip")) {
      hInfo.IsVipAndNoExpirt = player.isVip;
    }
    if (player.hasOwnProperty("vipType")) {
      hInfo.vipType = player.vipType;
    }
    if (player.hasOwnProperty("grades")) {
      hInfo.grades = player.grades;
    }
    if (player.hasOwnProperty("nickName")) {
      hInfo.nickName = player.nickName;
    }
    if (player.hasOwnProperty("templateId")) {
      hInfo.templateId = player.templateId;
    }
    if (player.hasOwnProperty("headId")) {
      hInfo.headId = player.headId;
    }
    if (player.hasOwnProperty("arm")) {
      hInfo.armsEquipAvata = player.arm;
    }
    if (player.hasOwnProperty("cloth")) {
      hInfo.bodyEquipAvata = player.cloth;
    }
    if (player.hasOwnProperty("wing")) {
      hInfo.wingAvata = player.wing;
    }
    if (player.hasOwnProperty("hat")) {
      hInfo.hairFashionAvata = player.hat;
    }
    if (player.hasOwnProperty("fashionArm")) {
      hInfo.armsFashionAvata = player.fashionArm;
    }
    if (player.hasOwnProperty("fashionCloth")) {
      hInfo.bodyFashionAvata = player.fashionCloth;
    }
    if (player.hasOwnProperty("hide")) {
      hInfo.hideFashion = player.hide;
    }
    if (player.hasOwnProperty("changeShapeId")) {
      hInfo.changeShapeId = player.changeShapeId;
    }
    if (player.hasOwnProperty("onlineState")) {
      hInfo.state = player.onlineState ? StateType.ONLINE : StateType.OFFLINE;
    }
    if (player.hasOwnProperty("geste")) {
      hInfo.honer = player.geste;
    }
    if (player.hasOwnProperty("appellid")) {
      hInfo.appellId = player.appellid;
    }
    if (player.hasOwnProperty("vehicleTemplateId")) {
      hInfo.vehicleTempId = player.vehicleTemplateId;
    }
    if (player.hasOwnProperty("petTemplateId")) {
      aInfo.petInfo.petTemplateId = player.petTemplateId;
      hInfo.petTemplateId = player.petTemplateId;
    }
    if (player.hasOwnProperty("petName")) {
      aInfo.petInfo.petName = player.petName;
      hInfo.petName = player.petName;
    }
    if (player.hasOwnProperty("petQuqlity")) {
      aInfo.petInfo.petQuaity = (player.petQuqlity - 1) / 5 + 1;
      aInfo.petInfo.petTemQuality = player.petQuqlity;
      hInfo.petQuaity = (player.petQuqlity - 1) / 5 + 1;
      hInfo.temQuality = player.petQuqlity;
    }
    if (player.hasOwnProperty("consortiaId")) {
      hInfo.consortiaID = player.consortiaId;
    }
    if (player.hasOwnProperty("consortiaName")) {
      hInfo.consortiaName = player.consortiaName;
    }
    if (player.hasOwnProperty("fightingCapacity")) {
      hInfo.fightingCapacity = player.fightingCapacity;
    }

    if (player.hasOwnProperty("playerId")) {
      aInfo.userId = player.playerId;
    }
    if (player.hasOwnProperty("armyId")) {
      aInfo.id = player.armyId;
    }
    if (player.hasOwnProperty("curPosX")) {
      aInfo.curPosX = player.curPosX;
    }
    if (player.hasOwnProperty("curPosY")) {
      aInfo.curPosY = player.curPosY;
    }
    if (player.hasOwnProperty("campaignId")) {
      aInfo.mapId = player.campaignId;
    }
    if (player.hasOwnProperty("nickName")) {
      aInfo.nickName = player.nickName;
    }
    if (player.hasOwnProperty("hp")) {
      aInfo.hp = player.hp;
    }
    if (player.hasOwnProperty("maxHp")) {
      aInfo.maxHp = player.maxHp;
    }
    if (player.hasOwnProperty("job")) {
      hInfo.job = player.job;
    }
    // if (player.hasOwnProperty('mountTempId')) {
    aInfo.mountTemplateId = player.mountTempId;
    // }
    // if (player.hasOwnProperty('mountGrade')) {
    aInfo.mountGrade = player.mountGrade;
    // }

    if (player.hasOwnProperty("fightingCapacity")) {
      this._model.memberFightCapacity[player.playerId] =
        player.fightingCapacity;
    }
    if (player.hasOwnProperty("onlineState")) {
      this._model.memberState[player.playerId] = player.onlineState;
    }
    this._model.addMember(aInfo);
    aInfo.petInfo.commit();
  }

  public memeberGradesValid(min: number): boolean {
    if (this.hasTeam) {
      for (const member in this._model.allMembers) {
        if (
          Object.prototype.hasOwnProperty.call(this._model.allMembers, member)
        ) {
          const element = this._model.allMembers[member];
          if (element.baseHero.grades < min) {
            return false;
          }
        }
      }
    }
    return true;
  }

  public get isCaptain(): boolean {
    if (
      this.hasTeam &&
      this._model.captainId ==
        PlayerManager.Instance.currentPlayerModel.playerInfo.userId
    ) {
      return true;
    }
    return false;
  }

  public get hasTeam(): boolean {
    if (this._model) {
      return true;
    }
    return false;
  }

  public get showTeam(): boolean {
    if (SceneManager.Instance.currentType == SceneType.SPACE_SCENE) {
      return true;
    } else if (
      SceneManager.Instance.currentType == SceneType.CAMPAIGN_MAP_SCENE
    ) {
      if (CampaignManager.Instance.mapModel) {
        var mapId: number = CampaignManager.Instance.mapModel.mapId;
        if (
          WorldBossHelper.checkPetLand(mapId) ||
          WorldBossHelper.checkMineral(mapId)
        ) {
          return true;
        }
      }
    }
    return false;
  }

  public memberIsOnline(userId: number): boolean {
    if (this.hasTeam && this._model.memberState[userId]) {
      return this._model.memberState[userId];
    }
    return false;
  }

  public memberFightCapacity(userId: number): number {
    if (this.hasTeam && this._model.memberFightCapacity[userId]) {
      return this._model.memberFightCapacity[userId];
    }
    return 0;
  }

  public canInviteMember(userId: number): boolean {
    if (ArmyManager.Instance.thane.grades < 20) {
      return false;
    }
    if (this.hasTeam && this.inMyTeam(userId)) {
      return false;
    }
    return true;
  }

  public inMyTeam(userId: number): boolean {
    if (this.hasTeam) {
      if (this._model.memberId.indexOf(userId) < 0) {
        return false;
      } else {
        return true;
      }
    }
    return false;
  }

  public get teamIsFull(): boolean {
    if (this.hasTeam) {
      if (this._model.memberId.length < 4) {
        return false;
      }
      return true;
    }
    return false;
  }

  public getTransferMapping(key: string): number {
    if (this.hasTeam) {
      if (this._model.transferMapping[key]) {
        return this._model.transferMapping[key];
      }
    }
    return 0;
  }
}
