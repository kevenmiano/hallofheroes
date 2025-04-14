/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-05-10 15:37:27
 * @LastEditTime: 2023-10-10 16:14:35
 * @LastEditors: jeremy.xu
 * @Description: 离线单人挑战
 */

import ConfigMgr from "../../../../core/config/ConfigMgr";
import Logger from "../../../../core/logger/Logger";
import { PackageIn } from "../../../../core/net/PackageIn";
import { ServerDataManager } from "../../../../core/net/ServerDataManager";
import { SocketManager } from "../../../../core/net/SocketManager";
import { DateFormatter } from "../../../../core/utils/DateFormatter";
import { t_s_itemtemplateData } from "../../../config/t_s_itemtemplate";
import { ConfigType } from "../../../constant/ConfigDefine";
import { C2SProtocol } from "../../../constant/protocol/C2SProtocol";
import { S2CProtocol } from "../../../constant/protocol/S2CProtocol";
import { EmWindow } from "../../../constant/UIDefine";
import { BuildingOrderInfo } from "../../../datas/playerinfo/BuildingOrderInfo";
import { ThaneInfo } from "../../../datas/playerinfo/ThaneInfo";
import { PlayerManager } from "../../../manager/PlayerManager";
import { SocketSendManager } from "../../../manager/SocketSendManager";
import { CampaignArmy } from "../../../map/campaign/data/CampaignArmy";
import BuildingManager from "../../../map/castle/BuildingManager";
import FrameCtrlBase from "../../../mvc/FrameCtrlBase";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { ColosseumEventData } from "./ColosseumData";

import ChallengeRequestMsg = com.road.yishi.proto.pet.ChallengeRequestMsg;
import ChallengeMsg = com.road.yishi.proto.player.ChallengeMsg;
import ChallengeInfoMsg = com.road.yishi.proto.simple.ChallengeInfoMsg;
import AvaterMsg = com.road.yishi.proto.simple.AvaterMsg;
import ChallengeRankRewardMsg = com.road.yishi.proto.player.ChallengeRankRewardMsg;
import ChallengeCoolTimeMsg = com.road.yishi.proto.player.ChallengeCoolTimeMsg;
import ChallengeRewardReq = com.road.yishi.proto.simple.ChallengeRewardReq;

export default class ColosseumCtrl extends FrameCtrlBase {
  constructor() {
    super();
    ServerDataManager.listen(
      S2CProtocol.U_C_CHALLENGE_TIME,
      this,
      this.__colosseumTimeHandler,
    );
  }

  protected startPreLoadData() {
    ColosseumCtrl.requestChallengeData();
  }

  protected addDataListener() {
    super.addDataListener();
    ServerDataManager.listen(
      S2CProtocol.U_C_CHALLENGE_INFO,
      this,
      this.onChallengeInfo,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_TAKECHALLENGE_RESULT,
      this,
      this.onTakeChallengeResult,
    );
  }
  protected delDataListener() {
    super.delDataListener();
    ServerDataManager.cancel(
      S2CProtocol.U_C_CHALLENGE_INFO,
      this,
      this.onChallengeInfo,
    );
    ServerDataManager.cancel(
      S2CProtocol.U_C_TAKECHALLENGE_RESULT,
      this,
      this.onTakeChallengeResult,
    );
  }

  private onTakeChallengeResult(pkg: PackageIn) {
    let msg = pkg.readBody(ChallengeRankRewardMsg) as ChallengeRankRewardMsg;
    PlayerManager.Instance.currentPlayerModel.playerInfo.isChallReward =
      msg.isTake;
  }

  private __colosseumTimeHandler(pkg: PackageIn) {
    var order: BuildingOrderInfo =
      BuildingManager.Instance.model.colosseumOrderList[0];
    let msg: ChallengeCoolTimeMsg = pkg.readBody(
      ChallengeCoolTimeMsg,
    ) as ChallengeCoolTimeMsg;

    if (!order || msg.type == 1) return;
    order.totalCount = msg.totalCount;
    order.currentCount = msg.challengeCount;
    order.totalBuyCount = msg.totalBuyCount;
    order.remainTime = msg.leftTime;
    if (this.view) {
      this.view.initOrder();
    }
  }

  private onChallengeInfo(pkg: PackageIn) {
    let msg = pkg.readBody(ChallengeInfoMsg) as ChallengeInfoMsg;
    this.data.totalFreeCount = msg.totalCount;
    // this.data.totalBuyCount = msg.totalBuyCount;
    this.data.currentCount = msg.challengeCount;
    // this.data.currentRank = msg.curRank;
    this.data.lastWinCount = msg.lastWinCount;
    // this.data.leftDay = msg.leftDay;
    this.data.curScore = msg.curScore;
    this.data.winCountReward = msg.winCountReward;
    this.data.nextRefreshTime = msg.nextRefreshTime;
    if (msg.noticMsg) {
      let str: string = msg.noticMsg;
      let srr: any[] = str.match(/\<([^>]*)>*/g);
      for (let i: number = 0; i < srr.length; i++) {
        // let s: string = srr[i]
        // let xml: XML = new XML(s);
        // let name: string = xml.@name;
        // str = str.replace(s, name);
      }
      this.data.noticMsg = str;
    } else {
      this.data.noticMsg = "";
    }
    this.data.heroList.length = 0;
    this.data.eventsList.length = 0;
    let len: number = msg.simplePlayer.length;
    let thane: ThaneInfo;
    for (let i = 0; i < len; i++) {
      let aInfo: CampaignArmy = new CampaignArmy();
      let sInfo = msg.simplePlayer[i];
      thane = new ThaneInfo();
      thane.userId = sInfo.userId;
      /**
       * 人机采用heroTempId
       * 玩家采用job, 玩家的heroTempId服务器不好处理
       */
      thane.templateId = sInfo.job;
      if (sInfo.heroTempId) {
        thane.templateId = sInfo.heroTempId;
      }
      thane.nickName = sInfo.nickName;
      thane.sexs = sInfo.sexs;
      thane.pics = sInfo.pics;
      thane.consortiaName = sInfo.consortiaName;
      thane.consortiaID = sInfo.consortiaID;
      thane.grades = sInfo.grades;
      thane.fightingCapacity = sInfo.fightingCapacity;
      thane.challengeRank = sInfo.challengeRank;
      thane.jewelGrades = sInfo.storeGrade;
      thane.challengeScore = sInfo.challengeScore;

      aInfo.userId = sInfo.userId;
      aInfo.baseHero = thane;
      thane.frameId = sInfo.frameId;
      if (thane.challengeRank == 0) this.data.heroList.unshift(aInfo);
      else this.data.heroList.push(aInfo);
    }
    this.data.heroList.sort((a: CampaignArmy, b: CampaignArmy) => {
      return a.baseHero.fightingCapacity - b.baseHero.fightingCapacity;
    });
    this.data.heroList.sort((a: CampaignArmy, b: CampaignArmy) => {
      return a.baseHero.challengeScore - b.baseHero.challengeScore;
    });
    len = msg.avater.length;
    for (let i = 0; i < len; i++) {
      let avatarInfo: AvaterMsg = msg.avater[i] as AvaterMsg;
      let aInfo = this.data.getThaneInfoById(avatarInfo.userId);
      if (aInfo) {
        let thane = aInfo.baseHero;
        let temp: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(
          ConfigType.t_s_itemtemplate,
          avatarInfo.clothTempId,
        );
        if (temp) {
          thane.bodyEquipAvata = temp.Avata;
        }
        temp = ConfigMgr.Instance.getTemplateByID(
          ConfigType.t_s_itemtemplate,
          avatarInfo.armTempId,
        );
        if (temp) {
          thane.armsEquipAvata = temp.Avata;
        }
        temp = ConfigMgr.Instance.getTemplateByID(
          ConfigType.t_s_itemtemplate,
          avatarInfo.fashionWingTempId,
        );
        if (temp) thane.wingAvata = temp.Avata;
        temp = ConfigMgr.Instance.getTemplateByID(
          ConfigType.t_s_itemtemplate,
          avatarInfo.fashionArmTempId,
        );
        if (temp) thane.armsFashionAvata = temp.Avata;
        temp = ConfigMgr.Instance.getTemplateByID(
          ConfigType.t_s_itemtemplate,
          avatarInfo.fashionClothTempId,
        );
        if (temp) thane.bodyFashionAvata = temp.Avata;
        temp = ConfigMgr.Instance.getTemplateByID(
          ConfigType.t_s_itemtemplate,
          avatarInfo.fashionHeadTempId,
        );
        if (temp) thane.hairFashionAvata = temp.Avata;
      }
    }
    len = msg.challengeLog.length;
    for (let i = 0; i < len; i++) {
      let log = msg.challengeLog[i];
      let eventData: ColosseumEventData = new ColosseumEventData();
      eventData.userId = log.userId;
      eventData.tarUserId = log.tarUserId;
      eventData.tarNickName = log.tarNickName;
      eventData.tarGrade = log.grades;
      eventData.tarGp = log.gp;
      eventData.tarOrder = log.gpOrder;
      eventData.tarTemplateId = log.job;
      eventData.isAttack = log.isAttack;
      eventData.forward = log.forward;
      eventData.logDate = DateFormatter.parse(
        log.logDate,
        "YYYY-MM-DD hh:mm:ss",
      );
      eventData.restult = log.result;
      eventData.curRankResult = log.curRankResult;
      eventData.curScore = log.curScore;

      this.data.eventsList.push(eventData);
      if (this.data.eventsList.length > 10) this.data.eventsList.splice(9, 1);
    }
    if (this._loadDataFlag) {
      super.preLoadDataComplete();
    } else if (FrameCtrlManager.Instance.isOpen(EmWindow.Colosseum)) {
      this.view && this.view.refresh();
    }
  }

  public static requestChallengeData() {
    let msg: ChallengeRequestMsg = new ChallengeRequestMsg();
    msg.type = 0;
    SocketManager.Instance.send(C2SProtocol.C_CHALLENGEINFO_REQUEST, msg);
  }

  /**
   * 领取宝箱
   * @param id 宝箱id
   */
  public static requestChallengeReward(id: number) {
    let msg: ChallengeRewardReq = new ChallengeRewardReq();
    msg.rewardId = id;
    SocketManager.Instance.send(C2SProtocol.C_CHALLENGE_REQUEST, msg);
  }

  /**
   * 单人挑战
   * @param uid 玩家Id
   */
  public static sendChallengeById(uid: number, payType: number = 0) {
    let msg: ChallengeMsg = new ChallengeMsg();
    msg.tarUserId = uid;
    msg.payType = payType;
    SocketManager.Instance.send(C2SProtocol.C_CHALLENGE, msg);
  }

  public static sendCoolColosseun(type: number = 0, useBind: boolean = true) {
    SocketSendManager.Instance.sendCoolColosseun(type, useBind);
  }

  /**
   * 领取排名奖励
   * @param type
   * @param useBind
   */
  public static sendTakeReward(type: number = 0, useBind: boolean = true) {
    let msg: ChallengeRankRewardMsg = new ChallengeRankRewardMsg();
    SocketManager.Instance.send(C2SProtocol.C_TAKE_CHALLENGEREWARD, msg);
  }
}
