//@ts-expect-error: External dependencies
/*
 * @Author: jeremy.xu
 * @Date: 2023-10-26 14:47:24
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-12-28 14:24:45
 * @Description:
 */

import OutCityWarDeclearReq = com.road.yishi.proto.outcitywar.OutCityWarDeclearReq;
import NodeStateReqMsg = com.road.yishi.proto.outcitywar.NodeStateReqMsg;
import OutCityWarStateMsg = com.road.yishi.proto.outcitywar.OutCityWarStateMsg;
import CastlePlayerMsg = com.road.yishi.proto.outcitywar.CastlePlayerMsg;
import PlayerStatusMsg = com.road.yishi.proto.outcitywar.PlayerStatusMsg;
import BuildStateMsg = com.road.yishi.proto.outcitywar.BuildStateMsg;
import CastleMsg = com.road.yishi.proto.outcitywar.CastleMsg;
import GuildMsg = com.road.yishi.proto.outcitywar.GuildMsg;
import OneGuildBuildMsg = com.road.yishi.proto.outcitywar.OneGuildBuildMsg;
import MonsterScoreMsg = com.road.yishi.proto.outcitywar.MonsterScoreMsg;
import MapPhysicAttackMsg = com.road.yishi.proto.worldmap.MapPhysicAttackMsg;
import PetInfoMsg = com.road.yishi.proto.pet.PetInfoMsg;

import { SocketManager } from "../../../../core/net/SocketManager";
import { C2SProtocol } from "../../../constant/protocol/C2SProtocol";
import { OuterCityWarModel } from "../model/OuterCityWarModel";
import { PackageIn } from "../../../../core/net/PackageIn";
import Logger from "../../../../core/logger/Logger";
import { ServerDataManager } from "../../../../core/net/ServerDataManager";
import { S2CProtocol } from "../../../constant/protocol/S2CProtocol";
import { OuterCityWarPlayerInfo } from "../model/OuterCityWarPlayerInfo";
import {
  EmOuterCityWarCastlePeriodType,
  EmOuterCityWarHeroType,
  EmOuterCityWarPlayerState,
} from "../../../constant/OuterCityWarDefine";
import { OuterCityManager } from "../../../manager/OuterCityManager";
import {
  OuterCityEvent,
  OuterCityWarEvent,
} from "../../../constant/event/NotificationEvent";
import { NotificationManager } from "../../../manager/NotificationManager";
import { BooleanType, CampType } from "../../../constant/Const";
import { PetData } from "../../pet/data/PetData";
import { OuterCityWarGuildInfo } from "../model/OuterCityWarGuildInfo";
import BuildingType from "../../../map/castle/consant/BuildingType";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { EmWindow } from "../../../constant/UIDefine";
import { OuterCityWarBuildBuffInfo } from "../model/OuterCityWarBuildBuffInfo";
import { BaseCastle } from "../../../datas/template/BaseCastle";

export class OuterCityWarManager {
  private static _instance: OuterCityWarManager;
  public static get Instance(): OuterCityWarManager {
    if (!this._instance) this._instance = new OuterCityWarManager();
    return this._instance;
  }

  private _model: OuterCityWarModel;
  public get model(): OuterCityWarModel {
    return this._model;
  }

  public setup() {
    if (!this._model) {
      this._model = new OuterCityWarModel();
      this._model.initConfig();
      this.addEvent();
    }
  }

  private addEvent() {
    /** 接收处理外城所有城堡的下发信息 */
    ServerDataManager.listen(
      S2CProtocol.U_C_OUTCITYWAR_NODE_STATE,
      this,
      this.onCastleInfo,
    );
    /** 只接收处理当前所在城堡的下发信息 */
    ServerDataManager.listen(
      S2CProtocol.U_C_OUTCITYWAR_BUILD_STATE,
      this,
      this.onBuildInfo,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_OUT_CITY_WAR_GUILD_INFO_UPDATE,
      this,
      this.onGuildInfoUpdate,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_OUT_CITY_WAR_GUILD_NOTICE,
      this,
      this.onGuildNoticeUpdate,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_OUT_CITY_WAR_SCORE_INFO,
      this,
      this.onNpcScore,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_OUTCITYWAR_PLAYER,
      this,
      this.onPlayerInfo,
    );

    //
  }

  private removeEvent() {
    ServerDataManager.cancel(
      S2CProtocol.U_C_OUTCITYWAR_NODE_STATE,
      this,
      this.onCastleInfo,
    );
    ServerDataManager.cancel(
      S2CProtocol.U_C_OUTCITYWAR_BUILD_STATE,
      this,
      this.onBuildInfo,
    );
    ServerDataManager.cancel(
      S2CProtocol.U_C_OUT_CITY_WAR_GUILD_INFO_UPDATE,
      this,
      this.onGuildInfoUpdate,
    );
    ServerDataManager.cancel(
      S2CProtocol.U_C_OUT_CITY_WAR_GUILD_NOTICE,
      this,
      this.onGuildNoticeUpdate,
    );
    ServerDataManager.cancel(
      S2CProtocol.U_C_OUT_CITY_WAR_SCORE_INFO,
      this,
      this.onNpcScore,
    );
    ServerDataManager.cancel(
      S2CProtocol.U_C_OUTCITYWAR_PLAYER,
      this,
      this.onPlayerInfo,
    );
  }

  /** C_OUT_CITY_WAR_All_NODE = 0x2578 城堡信息 */
  private onCastleInfo(pkg: PackageIn) {
    let castleNodeId = this._model.castleNodeId;
    let nodeMsg = pkg.readBody(OutCityWarStateMsg);

    ///////////////////////////////处理所有城堡数据 用于外城场景城堡相关显示/////////////////////////////////////
    let outcityModel = OuterCityManager.Instance.model;
    if (outcityModel) {
      for (let index = 0; index < nodeMsg.castleStateMsg.length; index++) {
        const msg = nodeMsg.castleStateMsg[index] as CastleMsg;
        let castleInfo = outcityModel.getCastleById(msg.nodeId);
        if (castleInfo) {
          OuterCityWarManager.syncCastleInfoWithMsg(msg, castleInfo);
        } else {
          Logger.outcityWar("未找到对应的城堡节点", msg);
        }
      }
      Logger.info("城堡数据", outcityModel.allCastlesMap);
      NotificationManager.Instance.dispatchEvent(OuterCityEvent.CASTLE_INFO);
    }

    ///////////////////////////////单个城堡相关数据 用于城战界面相关显示/////////////////////////////////////
    if (!castleNodeId) {
      Logger.outcityWar("不在城战界面");
      return;
    }

    let castleMsg: CastleMsg;
    for (let index = 0; index < nodeMsg.castleStateMsg.length; index++) {
      const msg = nodeMsg.castleStateMsg[index] as CastleMsg;
      if (msg.nodeId == castleNodeId) {
        castleMsg = msg;
        break;
      }
    }
    if (!castleMsg) {
      Logger.outcityWar("当前所在城堡信息服务器未推送", nodeMsg);
      return;
    }

    if (castleMsg.hasOwnProperty("isGiveUp")) {
      if (castleMsg.isGiveUp) {
        Logger.outcityWar("放弃城堡 退回外城", nodeMsg);
        this._model.clear();
        FrameCtrlManager.Instance.exit(EmWindow.OuterCityWarWnd);
        return;
      }
    }

    let curState = BaseCastle.getCastleStateName(castleMsg.state);
    let lastState = BaseCastle.getCastleStateName(this._model.castleState);
    Logger.outcityWar(
      "返回: 城堡节点：" +
        lastState +
        "->" +
        curState +
        "-" +
        castleMsg.leftTime,
      castleMsg,
    );

    if (castleMsg.hasOwnProperty("state")) {
      let state1 =
        this._model.castleState == EmOuterCityWarCastlePeriodType.Fighting &&
        castleMsg.state == EmOuterCityWarCastlePeriodType.Peace;
      let state2 =
        this._model.castleState == EmOuterCityWarCastlePeriodType.Fighting &&
        castleMsg.state == EmOuterCityWarCastlePeriodType.Protected;

      if (castleMsg.state == EmOuterCityWarCastlePeriodType.Fighting) {
        FrameCtrlManager.Instance.exit(EmWindow.OuterCityWarDefenceSettingWnd);
      }

      this._model.castleState = castleMsg.state;

      if (state1 || state2) {
        Logger.outcityWar("争夺期->和平期 or 争夺期->保护期 退回外城");
        this._model.clear();
        this.closeAllWnd();
        return;
      }
    }

    if (castleMsg.hasOwnProperty("leftTime")) {
      this._model.leftTime = castleMsg.leftTime;
    }

    if (castleMsg.hasOwnProperty("guildMsg") && castleMsg.guildMsg.length > 0) {
      for (let i = 0; i < castleMsg.guildMsg.length; i++) {
        let msg = castleMsg.guildMsg[i] as GuildMsg;

        let guildInfo: OuterCityWarGuildInfo;
        for (let index = 0; index < this._model.guildInfoList.length; index++) {
          let temp = this._model.guildInfoList[index];
          if (msg.guildId == temp.guildId) {
            guildInfo = temp;
            break;
          }
        }
        if (!guildInfo) {
          guildInfo = new OuterCityWarGuildInfo();
          this._model.guildInfoList.push(guildInfo);
        }
        guildInfo.guildId = msg.guildId;
        guildInfo.guildName = msg.guildName;
        guildInfo.camp = msg.camp;
        guildInfo.guildStatus = msg.guildStatus;
        guildInfo.guildScore = msg.guildScore;
        if (msg.guildId == this._model.playerInfo.consortiaID) {
          this._model.curCastleNoticeStr = msg.noticeMsg;
        }
      }

      let attackGuildIdx = 0;
      for (let index = 0; index < this._model.guildInfoList.length; index++) {
        let guildInfo = this._model.guildInfoList[index];
        if (guildInfo.camp != CampType.Attack) continue;

        let sonType = this._model.attackBuildingList[attackGuildIdx];
        let buildInfo = this._model.buildingInfoMap.get(sonType);
        if (buildInfo && buildInfo.isAttackSite) {
          attackGuildIdx++;
          buildInfo.attackGuildId = guildInfo.guildId;
          buildInfo.attackGuildName = guildInfo.guildName;
        }
      }
    }
    NotificationManager.Instance.dispatchEvent(OuterCityWarEvent.CASTLE_INFO);

    this.sendReqCastleNodeAllPlayer();
  }

  /** C_OUT_CITY_WAR_All_PLARER = 0x2582 */
  private recvPlayerInfoCnt = 0;
  private onPlayerInfo(pkg: PackageIn) {
    let msg = pkg.readBody(CastlePlayerMsg) as CastlePlayerMsg;
    if (this.filterInfo(msg.nodeId)) return;

    let allNum;
    if (msg.hasOwnProperty("allNum")) {
      allNum = msg.allNum;
    } else {
      allNum = 0;
      this.recvPlayerInfoCnt = 0;
    }

    let attackPlayInfo: OuterCityWarPlayerInfo;
    this.recvPlayerInfoCnt += msg.playerStatusMsg.length;
    Logger.outcityWar(
      "返回: 城堡节点玩家  当前进度:" + this.recvPlayerInfoCnt + "/" + allNum,
      msg,
    );
    for (let index = 0; index < msg.playerStatusMsg.length; index++) {
      let temp = msg.playerStatusMsg[index] as PlayerStatusMsg;
      let key = OuterCityWarPlayerInfo.getKey(temp.userId, temp.heroType);
      let playInfo = this._model.playerListMap.get(key);
      if (playInfo) {
        OuterCityWarManager.createPlayInfoWithMsg(temp, playInfo);
      } else {
        playInfo = OuterCityWarManager.createPlayInfoWithMsg(temp);
        this._model.playerListMap.set(key, playInfo);
      }
      // 自己的信息
      if (
        playInfo.userId == this._model.playerInfo.userId &&
        playInfo.heroType == EmOuterCityWarHeroType.Hero
      ) {
        let temp = playInfo.actionPoint.split(";");
        for (let index = 0; index < temp.length; index++) {
          const actionPointStr = temp[index];
          const actionPointArr = actionPointStr.split(",");
          if (this._model.castleNodeId == Number(actionPointArr[0])) {
            this._model.curCastleActionPoint = Number(actionPointArr[1]);
          }
        }
        this._model.selfPlayInfo = playInfo;
        NotificationManager.Instance.dispatchEvent(
          OuterCityWarEvent.ACTION_POINT,
        );
      }
    }

    if (this.recvPlayerInfoCnt == allNum) {
      Logger.outcityWar(
        "返回: 城堡节点玩家 接收完成",
        this._model.playerListMap,
      );
      this.recvPlayerInfoCnt = 0;
      this.calculateBuildInfo();
      NotificationManager.Instance.dispatchEvent(
        OuterCityWarEvent.ALL_BUILD_INFO,
      );
    }
  }

  public calculateBuildInfo() {
    // 计算所有建筑驻防点被占领信息
    for (const buildInfo of this._model.buildingInfoMap.values()) {
      if (buildInfo.isAttackSite) continue;

      let map: Map<number, OuterCityWarPlayerInfo> = new Map();
      for (const pInfo of this._model.playerListMap.values()) {
        if (
          !this._model.checkInCurCastleJoinBattleList(
            pInfo.userId,
            pInfo.heroType,
          )
        ) {
          continue;
        }
        if (buildInfo.isHeroBuild) {
          if (pInfo.defenseSite == buildInfo.sonType && pInfo.orderId > 0) {
            map.set(pInfo.orderId, pInfo);
          }
        }
        if (buildInfo.isPetBuild) {
          if (
            pInfo.defenseSitePet == buildInfo.sonType &&
            pInfo.orderIdPet > 0
          ) {
            map.set(pInfo.orderIdPet, pInfo);
          }
        }
      }

      for (let index = 0; index < OuterCityWarModel.BuildSiteCount; index++) {
        let siteInfo = buildInfo.siteInfoList[index];
        let pInfo = map.get(siteInfo.orderId);
        if (pInfo) {
          siteInfo.setOccupy(pInfo.userId, pInfo.heroType);
        } else {
          siteInfo.setOccupy(0, 0);
        }
      }
    }

    /**
     * 计算所有建筑完全占领状态
     * 1.先计算每个建筑的完全占领状态
     * 2.再计算每个建筑的前置建筑完全占领状态
     */
    for (
      let index = 0;
      index < this._model.buildingSontypeList.length;
      index++
    ) {
      const sonType = this._model.buildingSontypeList[index];
      let buildInfo = this._model.buildingInfoMap.get(sonType);
      if (buildInfo.isAttackSite) continue;

      if (sonType == BuildingType.GATE_BUILD) {
        Logger.info("");
      }

      let cntDefance = 0;
      let cntAttack = 0;
      for (let i = 0; i < OuterCityWarModel.BuildSiteCount; i++) {
        let siteInfo = buildInfo.siteInfoList[i];
        let sitePlayerInfo = siteInfo.playerInfo;
        if (!sitePlayerInfo) {
          // Logger.outcityWar("建筑驻防节点不存在玩家信息 属于中立节点", siteInfo)
          continue;
        }

        let camp = sitePlayerInfo.camp;
        let state = buildInfo.isPetBuild
          ? sitePlayerInfo.statePet
          : sitePlayerInfo.state;
        if (state == EmOuterCityWarPlayerState.DEFANCE) {
          if (camp == CampType.Defence) {
            cntDefance++;
          }
          if (camp == CampType.Attack) {
            cntAttack++;
          }
        }
      }

      if (cntDefance >= OuterCityWarModel.BuildSiteCount) {
        buildInfo.completeOccupyCamp = CampType.Defence;
      } else if (cntAttack >= OuterCityWarModel.BuildSiteCount) {
        buildInfo.completeOccupyCamp = CampType.Attack;
      } else {
        buildInfo.completeOccupyCamp = CampType.Neutrality;
      }

      // Logger.outcityWar("建筑状态数据：" + buildInfo.buildName, buildInfo.siteInfoList)
    }

    let ocuppyStr = "所有建筑前置完全占领状态:";
    for (
      let index = 0;
      index < this._model.buildingSontypeList.length;
      index++
    ) {
      const sonType = this._model.buildingSontypeList[index];
      let buildInfo = this._model.buildingInfoMap.get(sonType);
      if (buildInfo.isAttackSite) continue;

      if (sonType == BuildingType.TRAINING_GROUND_BUILD) {
        Logger.info("");
      }
      buildInfo.checkPreOneCompleteOccupy();

      ocuppyStr +=
        "\n" +
        buildInfo.buildName +
        ": " +
        buildInfo.preOneCompleteOccupyByAttacker +
        "-" +
        buildInfo.preOneCompleteOccupyByDefencer +
        ";";
    }
    Logger.outcityWar(ocuppyStr);
  }

  private onGuildInfoUpdate(pkg: PackageIn) {
    let castleMsg = pkg.readBody(CastleMsg);

    if (this.filterInfo(castleMsg.nodeId)) return;

    Logger.outcityWar("返回: 公会相关信息", castleMsg);
    // 这里也要更新时间，要不然每次都用最开始保存的，会导致倒计时偏差
    if (castleMsg.hasOwnProperty("leftTime")) {
      this._model.leftTime = castleMsg.leftTime;
    }
    for (let i = 0; i < castleMsg.guildMsg.length; i++) {
      let msg = castleMsg.guildMsg[i] as GuildMsg;
      for (let index = 0; index < this._model.guildInfoList.length; index++) {
        let guildInfo = this._model.guildInfoList[index];
        if (msg.guildId == guildInfo.guildId) {
          if (msg.hasOwnProperty("guildStatus")) {
            guildInfo.guildStatus = msg.guildStatus;
          }
          if (msg.hasOwnProperty("guildScore")) {
            guildInfo.guildScore = msg.guildScore;
          }
          if (msg.hasOwnProperty("noticeMsg")) {
            this._model.curCastleNoticeStr = msg.noticeMsg;
          }
        }
      }
    }

    NotificationManager.Instance.dispatchEvent(OuterCityWarEvent.CASTLE_INFO);
  }

  /** C_OUT_CITY_WAR_EDIT_GUILD_NOTICE = 0x2582 */
  private onGuildNoticeUpdate(pkg: PackageIn) {
    let msg = pkg.readBody(GuildMsg) as GuildMsg;

    Logger.outcityWar("返回 公会通知", msg);

    if (msg.hasOwnProperty("noticeMsg")) {
      this._model.curCastleNoticeStr = msg.noticeMsg;
      NotificationManager.Instance.dispatchEvent(
        OuterCityWarEvent.GUILD_NOTICE,
      );
    }
  }

  private onNpcScore(pkg: PackageIn) {
    let msg = pkg.readBody(MonsterScoreMsg) as MonsterScoreMsg;
    if (this.filterInfo(msg.nodeId)) return;

    Logger.outcityWar("推送 守城方NPC积分", msg);

    let score = msg.score > 0 ? msg.score : 0;
    this._model.castleDefenceNpcScore = score;
    NotificationManager.Instance.dispatchEvent(
      OuterCityWarEvent.DEFENCE_NPC_SCORE,
    );
  }

  /** C_OUT_CITY_WAR_NODE_STATE = 0x2582 */
  private onBuildInfo(pkg: PackageIn) {
    let msg = pkg.readBody(BuildStateMsg) as BuildStateMsg;

    if (this.filterInfo(msg.nodeId)) return;

    Logger.outcityWar("返回 城堡建筑信息", msg);

    let buildInfo = this._model.buildingInfoMap.get(msg.defenseSite);
    if (buildInfo) {
      buildInfo.buffType = msg.buffType;
      buildInfo.buffCondition = msg.buffCondition;
      for (let i = 0; i < buildInfo.siteInfoList.length; i++) {
        const siteInfo = buildInfo.siteInfoList[i];
        for (let index = 0; index < msg.oneBuildStateMsg.length; index++) {
          const element = msg.oneBuildStateMsg[index];
          if (element.orderId == siteInfo.orderId) {
            siteInfo.state = element.state;
          }
        }
      }
      NotificationManager.Instance.dispatchEvent(
        OuterCityWarEvent.BUILD_INFO,
        buildInfo,
      );
    }
  }

  /** 只接收玩家当前所在的城堡的信息 */
  private filterInfo(nodeId: number): boolean {
    let castleNodeId = this._model.castleNodeId;
    if (!castleNodeId) {
      // Logger.outcityWar("当前未选择城堡")
      return true;
    }
    if (castleNodeId != nodeId) {
      // Logger.outcityWar("不属于玩家当前所在的城堡的信息")
      return true;
    }
    return false;
  }

  /** 更新城战所有信息 */
  public commitAll() {
    NotificationManager.Instance.dispatchEvent(OuterCityWarEvent.CASTLE_INFO);
    NotificationManager.Instance.dispatchEvent(
      OuterCityWarEvent.ALL_BUILD_INFO,
    );
  }

  /** 请求: 城堡 */
  sendReqAllCastleInfo() {
    Logger.outcityWar("请求: 所有城堡信息");
    let msg: OutCityWarDeclearReq = new OutCityWarDeclearReq();
    SocketManager.Instance.send(C2SProtocol.C_OUT_CITY_WAR_All_NODE, msg);
  }

  sendReqCastleInfo() {
    let castleNodeId = this._model.castleNodeId;
    Logger.outcityWar("请求: 城堡");
    let msg: OutCityWarDeclearReq = new OutCityWarDeclearReq();
    msg.nodeId = castleNodeId;
    SocketManager.Instance.send(C2SProtocol.C_OUT_CITY_WAR_All_NODE, msg);
  }

  /** 请求: 城堡-建筑 */
  sendReqBuildInfo(sonType: number) {
    let castleNodeId = this._model.castleNodeId;
    let msg: NodeStateReqMsg = new NodeStateReqMsg();
    msg.nodeId = castleNodeId;
    msg.buildId = sonType;

    // Logger.outcityWar("请求: 城堡-建筑", msg)
    SocketManager.Instance.send(C2SProtocol.C_OUT_CITY_WAR_NODE_STATE, msg);
  }

  /** 请求: 城堡-所有玩家 */
  sendReqCastleNodeAllPlayer() {
    let castleNodeId = this._model.castleNodeId;
    Logger.outcityWar("请求: 城堡-所有玩家", castleNodeId);
    let msg: OutCityWarDeclearReq = new OutCityWarDeclearReq();
    msg.nodeId = castleNodeId;
    SocketManager.Instance.send(C2SProtocol.C_OUT_CITY_WAR_All_PLARER, msg);
  }

  /** 请求: 宣战-城堡 */
  sendDeclareWar() {
    let castleNodeId = this._model.castleNodeId;
    Logger.outcityWar("请求: 宣战-城堡", castleNodeId);
    let msg: OutCityWarDeclearReq = new OutCityWarDeclearReq();
    msg.nodeId = castleNodeId;
    SocketManager.Instance.send(C2SProtocol.C_OUT_CITY_DECLEAR_WAR, msg);
  }

  /**（防守方）请求: 放弃-城堡 */
  sendGiveUpCastle() {
    let castleNodeId = this._model.castleNodeId;
    let msg: OutCityWarDeclearReq = new OutCityWarDeclearReq();
    msg.nodeId = castleNodeId;

    Logger.outcityWar("请求: 放弃-城堡", castleNodeId);
    SocketManager.Instance.send(C2SProtocol.C_OUT_CITY_WAR_GIVE_UP_CASTLE, msg);
  }

  /**
   * 请求: 攻打 城堡-建筑-驻防点
   * @param sonType 建筑
   * @param orderId 驻防点1 2 3 4 5
   * @returns
   */
  sendAttackDefencerBuildSite(sonType: number, orderId: number = 0) {
    if (!OuterCityManager.Instance.model) {
      Logger.outcityWar("调用失败 不在外城");
      return;
    }

    if (!this._model.castleInfo) {
      Logger.outcityWar("调用失败 未找到当前城堡信息");
      return;
    }

    var msg: MapPhysicAttackMsg = new MapPhysicAttackMsg();
    msg.mapId = OuterCityManager.Instance.model.mapId;
    msg.posX = this._model.castleInfo.posX;
    msg.posY = this._model.castleInfo.posY;
    msg.nodeId = sonType;
    msg.sonNodeId = orderId;

    Logger.outcityWar("请求: 攻打 城堡-建筑-驻防点 ", msg);
    SocketManager.Instance.send(C2SProtocol.U_C_ARMY_ATTACK, msg);
  }

  /**
   * 请求: 攻打进攻公会阵营 服务器随机一个玩家
   * @param guildId 公会id
   * @returns
   */
  sendAttackAttackerBuild(guildId: number) {
    let castleNodeId = this._model.castleNodeId;
    let msg: NodeStateReqMsg = new NodeStateReqMsg();
    msg.nodeId = castleNodeId;
    msg.guildId = guildId;

    Logger.outcityWar("请求: 攻打进攻公会阵营", msg);
    SocketManager.Instance.send(C2SProtocol.C_OUT_CITY_WAR_ATTACK, msg);
  }

  /** 请求: 占领 城堡-建筑-驻防点 */
  sendOccupyBuildSite(sonType: number, orderId: number) {
    let castleNodeId = this._model.castleNodeId;

    let msg: OutCityWarDeclearReq = new OutCityWarDeclearReq();
    msg.nodeId = castleNodeId;
    msg.buildId = sonType;
    msg.orderId = orderId;

    Logger.outcityWar(
      "请求: 占领 城堡-建筑-驻防点",
      castleNodeId,
      sonType,
      orderId,
    );
    SocketManager.Instance.send(C2SProtocol.C_OUT_CITY_WAR_OCCUPY_BUILD, msg);
  }

  /** 请求: 放弃 城堡-建筑-驻防点 */
  sendGiveUpBuildSite(sonType: number, orderId: number) {
    let castleNodeId = this._model.castleNodeId;

    let msg: OutCityWarDeclearReq = new OutCityWarDeclearReq();
    msg.nodeId = castleNodeId;
    msg.buildId = sonType;
    msg.orderId = orderId;

    Logger.outcityWar(
      "请求: 放弃 城堡-建筑-驻防点",
      castleNodeId,
      sonType,
      orderId,
    );
    SocketManager.Instance.send(C2SProtocol.C_OUT_CITY_WAR_GIVE_UP_CASTLE, msg);
  }

  /** 请求: 设置参战 */
  sendJoinWar(userId: number, attend: BooleanType) {
    let castleNodeId = this._model.castleNodeId;
    let msg: NodeStateReqMsg = new NodeStateReqMsg();
    msg.nodeId = castleNodeId;
    msg.userId = userId;
    msg.attend = attend;

    Logger.outcityWar("请求:  设置玩家参战", msg, attend);
    SocketManager.Instance.send(
      C2SProtocol.C_OUT_CITY_WAR_ARRANGE_GARRISON,
      msg,
    );
  }

  /**请求:  安排玩家驻守 城堡-建筑-驻防点 */
  sendDefenceBuild(userId: number, sonType: number, orderId: number) {
    let castleNodeId = this._model.castleNodeId;
    let msg: NodeStateReqMsg = new NodeStateReqMsg();
    msg.nodeId = castleNodeId;
    msg.buildId = sonType;
    msg.userId = userId;
    msg.orderId = orderId;

    Logger.outcityWar("请求: 安排玩家驻守某一个建筑", msg);
    SocketManager.Instance.send(
      C2SProtocol.C_OUT_CITY_WAR_ARRANGE_GARRISON,
      msg,
    );
  }

  /** 请求: 购买行动力 城堡 */
  sendBuyActionPoint() {
    let castleNodeId = this._model.castleNodeId;
    let msg: NodeStateReqMsg = new NodeStateReqMsg();
    msg.nodeId = castleNodeId;

    Logger.outcityWar("请求: 购买行动力 ", castleNodeId);
    SocketManager.Instance.send(
      C2SProtocol.C_OUT_CITY_WAR_BUY_ACTION_POINT,
      msg,
    );
  }

  /** 请求: 编辑会长通知 */
  sendEditNotice(str: string) {
    let msg: NodeStateReqMsg = new NodeStateReqMsg();
    msg.guildNotice = str;

    Logger.outcityWar("请求: 编辑会长通知 ", str);
    SocketManager.Instance.send(
      C2SProtocol.C_OUT_CITY_WAR_EDIT_GUILD_NOTICE,
      msg,
    );
  }

  /** 请求: 离开外城界面
   * 服务器记录用来给未参战公会玩家实时推送消息
   */
  sendLeaveOutcityWar(op: number) {
    Logger.outcityWar("请求: 进入/离开外城界面 ", op);
    let castleNodeId = this._model.castleNodeId;
    let msg: NodeStateReqMsg = new NodeStateReqMsg();
    msg.nodeId = castleNodeId;
    msg.op = op;
    SocketManager.Instance.send(C2SProtocol.C_OUT_CITY_WAR_OBSERVE_LEFT, msg);
  }

  /** 请求: 解锁建筑点
   * 驻防点被攻下 提示放弃原先的占领新攻下的驻点  此时服务器锁住该节点不可被其他玩家占领（30s倒计时自动解锁）
   */
  sendUnLockBuildSite(sonType: number, orderId: number) {
    Logger.outcityWar("请求: 解锁建筑点 ");
    let castleNodeId = this._model.castleNodeId;
    let msg: NodeStateReqMsg = new NodeStateReqMsg();
    msg.nodeId = castleNodeId;
    msg.buildId = sonType;
    msg.orderId = orderId;
    SocketManager.Instance.send(C2SProtocol.C_OUT_CITY_WAR_CANCEL_OCCUPY, msg);
  }

  /** 请求：更新自己的信息 */
  sendSelfPlayInfo() {
    Logger.outcityWar("请求：更新自己的信息 ");
    let castleNodeId = this._model.castleNodeId;
    let msg: NodeStateReqMsg = new NodeStateReqMsg();
    msg.nodeId = castleNodeId;
    SocketManager.Instance.send(
      C2SProtocol.C_OUT_CITY_WAR_ONE_PLAYER_STATUS,
      msg,
    );
  }

  static createPlayInfoWithMsg(
    msg: PlayerStatusMsg,
    playerInfo: OuterCityWarPlayerInfo = null,
  ): OuterCityWarPlayerInfo {
    if (!playerInfo) {
      playerInfo = new OuterCityWarPlayerInfo();
    }
    if (msg.hasOwnProperty("orderId")) {
      playerInfo.orderId = msg.orderId;
    }
    if (msg.hasOwnProperty("orderIdPet")) {
      playerInfo.orderIdPet = msg.orderIdPet;
    }
    if (msg.hasOwnProperty("userId")) {
      playerInfo.userId = msg.userId;
    }
    if (msg.hasOwnProperty("userName")) {
      playerInfo.userName = msg.userName;
    }
    if (msg.hasOwnProperty("userGrade")) {
      playerInfo.userGrade = msg.userGrade;
    }
    if (msg.hasOwnProperty("job")) {
      playerInfo.job = msg.job;
    }
    if (msg.hasOwnProperty("userGrade")) {
      playerInfo.userGrade = msg.userGrade;
    }
    if (msg.hasOwnProperty("guildId")) {
      playerInfo.guildId = msg.guildId;
    }
    if (msg.hasOwnProperty("guildName")) {
      playerInfo.guildName = msg.guildName;
    }
    if (msg.hasOwnProperty("guildDutyId")) {
      playerInfo.guildDutyId = msg.guildDutyId;
    }
    if (msg.hasOwnProperty("defenseForce")) {
      playerInfo.defenseForce = msg.defenseForce;
    }
    if (msg.hasOwnProperty("defenseSite")) {
      playerInfo.defenseSite = msg.defenseSite;
    }
    if (msg.hasOwnProperty("state")) {
      playerInfo.state = msg.state;
    }
    if (msg.hasOwnProperty("defenseForcePet")) {
      playerInfo.defenseForcePet = msg.defenseForcePet;
    }
    if (msg.hasOwnProperty("defenseSitePet")) {
      playerInfo.defenseSitePet = msg.defenseSitePet;
    }
    if (msg.hasOwnProperty("statePet")) {
      playerInfo.statePet = msg.statePet;
    }
    if (msg.hasOwnProperty("fightCapaity")) {
      playerInfo.heroCapaity = msg.fightCapaity;
    }
    if (msg.hasOwnProperty("pawnTempId")) {
      playerInfo.pawnTempId = msg.pawnTempId;
    }
    if (msg.hasOwnProperty("camp")) {
      playerInfo.camp = msg.camp;
    }
    if (msg.hasOwnProperty("nodeId")) {
      playerInfo.enterWarCastleNodeId = msg.nodeId;
    }
    if (msg.hasOwnProperty("heroType")) {
      playerInfo.heroType = msg.heroType;
    }
    if (msg.hasOwnProperty("enterWar")) {
      playerInfo.enterWar = msg.enterWar;
    }
    if (msg.hasOwnProperty("actionPoint")) {
      playerInfo.actionPoint = msg.actionPoint;
    }
    if (msg.hasOwnProperty("isOnline")) {
      playerInfo.online = msg.isOnline;
    }
    if (msg.hasOwnProperty("petData") && msg.petData.length > 0) {
      playerInfo.petList = [];
      msg.petData.forEach((petMsg) => {
        let petdata: PetData = new PetData();
        petdata.userId = msg.userId;
        PetData.createWithMsg(petMsg as PetInfoMsg, petdata);
        playerInfo.petList.push(petdata);
      });
    }
    if (msg.hasOwnProperty("buffMsg")) {
      playerInfo.buffInfoList = [];
      for (let index = 0; index < msg.buffMsg.length; index++) {
        let buffMsg = msg.buffMsg[index] as OneGuildBuildMsg;
        playerInfo.buffInfoList[index] = new OuterCityWarBuildBuffInfo(
          buffMsg.buildId,
          buffMsg.buffId,
          buffMsg.buffType,
          buffMsg.buffCondition,
        );
      }
    }
    return playerInfo;
  }

  static syncCastleInfoWithMsg(
    msg: CastleMsg,
    castleInfo: BaseCastle,
  ): BaseCastle {
    castleInfo.state = msg.state;
    for (let i = 0; i < msg.guildMsg.length; i++) {
      let guildMsg = msg.guildMsg[i] as GuildMsg;
      if (guildMsg.camp == CampType.Defence) {
        castleInfo.defencerGuildName = guildMsg.guildName;
        castleInfo.defencerGuildCnt = guildMsg.attendNum;
      }
    }
    castleInfo.commit();
    return castleInfo;
  }

  public closeAllWnd() {
    FrameCtrlManager.Instance.exit(EmWindow.OuterCityWarWnd);
    FrameCtrlManager.Instance.exit(EmWindow.OuterCityWarDefencerBuildWnd);
    FrameCtrlManager.Instance.exit(EmWindow.OuterCityWarAttackerBuildWnd);
    FrameCtrlManager.Instance.exit(EmWindow.OuterCityWarDefenceSettingWnd);
    FrameCtrlManager.Instance.exit(EmWindow.OuterCityWarEnterWarSettingWnd);
    FrameCtrlManager.Instance.exit(EmWindow.OuterCityWarNoticeWnd);
  }

  public dispose() {
    this.removeEvent();
    this._model.clear();
    this._model = null;
  }
}
