/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-02-25 15:56:47
 * @LastEditTime: 2021-05-26 11:52:32
 * @LastEditors: jeremy.xu
 * @Description: 已经通过的副本
 */

import GameEventDispatcher from "../../core/event/GameEventDispatcher";
import { PackageIn } from "../../core/net/PackageIn";
import { ServerDataManager } from "../../core/net/ServerDataManager";
import { SimpleDictionary } from "../../core/utils/SimpleDictionary";
import { S2CProtocol } from "../constant/protocol/S2CProtocol";
import { RankInfo } from "../datas/playerinfo/RankInfo";
import { CampaignTemplateManager } from "./CampaignTemplateManager";
import Logger from "../../core/logger/Logger";

//@ts-expect-error: External dependencies
import RankListRspMsg = com.road.yishi.proto.campaign.RankListRspMsg;

//@ts-expect-error: External dependencies
import IRankMsg = com.road.yishi.proto.campaign.IRankMsg;

export class CampaignRankManager extends GameEventDispatcher {
  private static _instance: CampaignRankManager;
  public static get Instance(): CampaignRankManager {
    if (!CampaignRankManager._instance) {
      CampaignRankManager._instance = new CampaignRankManager();
    }
    return CampaignRankManager._instance;
  }

  private _rankDic: SimpleDictionary;

  /**
   * 初始化
   * @param t
   */
  preSetup(t?: any) {}

  public setup() {
    this._rankDic = new SimpleDictionary();
    this.initEvent();
  }

  private initEvent() {
    ServerDataManager.listen(
      S2CProtocol.U_C_RANK_LIST,
      this,
      this.__rankListHandler,
    );
  }

  private __rankListHandler(pkg: PackageIn) {
    let msg = pkg.readBody(RankListRspMsg) as RankListRspMsg;
    Logger.xjy("[CampaignRankManager]__rankListHandler", msg);
    for (let index = 0; index < msg.rankInfo.length; index++) {
      const info: IRankMsg = msg.rankInfo[index];
      var rank: RankInfo = new RankInfo();
      rank.campaignId = info.campaignId;
      rank.rank = info.rank;
      this._rankDic.add(rank.campaignId, rank);
    }
    CampaignTemplateManager.Instance.checkCanChoose();
  }

  public get rankDic(): SimpleDictionary {
    return this._rankDic;
  }
}
