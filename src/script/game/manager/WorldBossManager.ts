// TODO FIX
import { PlayerInfo } from "../datas/playerinfo/PlayerInfo";
import { CampaignManager } from "./CampaignManager";
import { NotificationManager } from "./NotificationManager";
import { WorldBossSocketOutManager } from "./WorldBossSocketOutManager";
import { PackageIn } from "../../core/net/PackageIn";
import { S2CProtocol } from "../constant/protocol/S2CProtocol";
import { ServerDataManager } from "../../core/net/ServerDataManager";
import { MessageTipManager } from "./MessageTipManager";
import LangManager from "../../core/lang/LangManager";
import { WorldBossHelper } from "../utils/WorldBossHelper";
import {
  NotificationEvent,
  WorldBossEvent,
} from "../constant/event/NotificationEvent";
import { PlayerManager } from "./PlayerManager";
import WorldBossStuntmanInfo from "../mvc/model/worldboss/WorldBossStuntmanInfo";
import WorldRewardVO from "../mvc/model/worldboss/WorldRewardVO";
import { t_s_campaignData } from "../config/t_s_campaign";
import ConfigMgr from "../../core/config/ConfigMgr";
import { DataCommonManager } from "./DataCommonManager";

//@ts-expect-error: External dependencies
import OprateReplacemntMsg = com.road.yishi.proto.campaign.OprateReplacemntMsg;
//@ts-expect-error: External dependencies
import ReplacementMsg = com.road.yishi.proto.campaign.ReplacementMsg;
//@ts-expect-error: External dependencies
import WorldBossStateMsg = com.road.yishi.proto.campaign.WorldBossStateMsg;
//@ts-expect-error: External dependencies
import WorldBossWoundRewardListMsg = com.road.yishi.proto.campaign.WorldBossWoundRewardListMsg;
//@ts-expect-error: External dependencies
import CampaignNodeUpdateMsg = com.road.yishi.proto.campaign.CampaignNodeUpdateMsg;
import { NodeState } from "../map/space/constant/NodeState";
/**
 * @author:pzlricky
 * @data: 2021-07-19 20:43
 * @description 世界Boss
 */
export default class WorldBossManager {
  private _stuntman: WorldBossStuntmanInfo;
  /** 世界boss替身 */
  public get stuntman(): WorldBossStuntmanInfo {
    return this._stuntman;
  }

  private static _instance: WorldBossManager;
  public static get Instance(): WorldBossManager {
    if (!this._instance) this._instance = new WorldBossManager();
    return this._instance;
  }

  public setup() {
    this._stuntman = new WorldBossStuntmanInfo();
    ServerDataManager.listen(
      S2CProtocol.U_C_CAMPAIGN_STATE,
      this,
      this.__updateWorldsBossStateHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_WARFIELD_STATE,
      this,
      this.__updateWarFightStateHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.C_WORLDBOSSWOUND_REWARD,
      this,
      this.__updateRewardStateHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_OPRATE_REPLACEMENT_STATE,
      this,
      this.__buyStuntmanResultHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_REPLACEMENT_STATE,
      this,
      this.__initStuntmanInfoHanlder,
    );
    this.reqWorldBossStates();
  }

  private __buyStuntmanResultHandler(pkg: PackageIn) {
    var msg: OprateReplacemntMsg = pkg.readBody(
      OprateReplacemntMsg,
    ) as OprateReplacemntMsg;

    if (msg.op == 1) {
      //购买
      if (msg.result == 1) {
        this.stuntman.buyFor(msg.campaignId);
      } else {
        this.stuntman.buyFor(msg.campaignId, 0);
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation(
            "worldboss.BuyAvatarFrame.command05",
          ),
        );
      }
    } else if (msg.op == 2) {
      //取消
      this.stuntman.cancelBuyFor(msg.campaignId);
    }
  }

  private __initStuntmanInfoHanlder(pkg: PackageIn) {
    var msg: ReplacementMsg = pkg.readBody(ReplacementMsg) as ReplacementMsg;
    this.stuntman.parseFromString(msg.stateStr);
  }

  private __updateWorldsBossStateHandler(pkg: PackageIn) {
    var msg: WorldBossStateMsg = pkg.readBody(
      WorldBossStateMsg,
    ) as WorldBossStateMsg;
    var newBossOpen: boolean = false;
    var worldBossTemplateDict = ConfigMgr.Instance.worldBossDic;
    for (const key in msg.worldBossInfo) {
      if (Object.prototype.hasOwnProperty.call(msg.worldBossInfo, key)) {
        var boss = msg.worldBossInfo[key];
        var cTemp: t_s_campaignData = worldBossTemplateDict[boss.campaignId];
        cTemp.state = boss.state;
      }
    }
    let dic = worldBossTemplateDict;
    for (const key in dic) {
      if (Object.prototype.hasOwnProperty.call(dic, key)) {
        var bossTemp: t_s_campaignData = dic[key];
        if (
          bossTemp.state == 0 &&
          WorldBossHelper.checkWorldBoss(bossTemp.CampaignId)
        )
          newBossOpen = true;
      }
    }
    this.playerInfo.beginChanges();
    this.playerInfo.worldbossState = newBossOpen;
    this.playerInfo.commit();
  }

  private __updateWarFightStateHandler(pkg: PackageIn) {
    var msg: WorldBossStateMsg = pkg.readBody(
      WorldBossStateMsg,
    ) as WorldBossStateMsg;
    var newBossOpen: boolean = false;
    var pvpWarFightDic = ConfigMgr.Instance.pvpWarFightDic;
    for (const key in msg.worldBossInfo) {
      if (Object.prototype.hasOwnProperty.call(msg.worldBossInfo, key)) {
        var boss = msg.worldBossInfo[key];
        var cTemp: t_s_campaignData = pvpWarFightDic[boss.campaignId];
        if (cTemp) cTemp.state = boss.state;
      }
    }
    for (const key in pvpWarFightDic) {
      if (Object.prototype.hasOwnProperty.call(pvpWarFightDic, key)) {
        var bossTemp = pvpWarFightDic[key];
        if (
          bossTemp.state == 0 &&
          WorldBossHelper.checkPvp(bossTemp.CampaignId)
        )
          newBossOpen = true;
      }
    }
    DataCommonManager.playerInfo.isOpenPvpWar = newBossOpen;
    NotificationManager.Instance.dispatchEvent(
      WorldBossEvent.UPDATE_WARFIGHT_STATE_LIST,
    );
  }

  private __updateRewardStateHandler(pkg: PackageIn) {
    var msg: WorldBossWoundRewardListMsg = pkg.readBody(
      WorldBossWoundRewardListMsg,
    ) as WorldBossWoundRewardListMsg;
    if (CampaignManager.Instance.worldBossModel) {
      var initFlag: boolean = false;
      if (!CampaignManager.Instance.worldBossModel.rewards) {
        CampaignManager.Instance.worldBossModel.rewards = [];
        initFlag = true;
      }
      var i: number = 0;
      var reward = null;
      if (initFlag) {
        for (i = 0; i < msg.rewardinfo.length; i++) {
          reward = msg.rewardinfo[i];
          var vo: WorldRewardVO = new WorldRewardVO();
          vo.campaignId = reward.campaignId;
          vo.rewardid = reward.rewardid;
          vo.rewardmsg = reward.rewardmsg;
          vo.state = reward.state;
          vo.woundmsg = reward.woundmsg;
          if (vo.state == 1) {
            vo.needEffect = false;
          }
          CampaignManager.Instance.worldBossModel.rewards.push(vo);
        }
        NotificationManager.Instance.dispatchEvent(
          WorldBossEvent.REWARDS_INIT,
          null,
        );
      } else {
        for (i = 0; i < msg.rewardinfo.length; i++) {
          reward = msg.rewardinfo[i];
          let rewards = CampaignManager.Instance.worldBossModel.rewards;
          for (const key in rewards) {
            if (Object.prototype.hasOwnProperty.call(rewards, key)) {
              let vo = rewards[key];
              if (vo.rewardid == reward.rewardid) {
                vo.state = reward.state;
              }
            }
          }
        }
      }
    }
  }

  public reqWorldBossStates() {
    WorldBossSocketOutManager.reqWorldBossStates();
  }

  private get playerInfo(): PlayerInfo {
    return PlayerManager.Instance.currentPlayerModel.playerInfo;
  }

  ///////////////////
  public sendEnterBattle(bossTemplate: t_s_campaignData) {
    if (bossTemplate)
      WorldBossSocketOutManager.sendWorldBossCmd(bossTemplate.CampaignId);
  }

  public sendCancelStunmanFor(campaignId: number) {
    WorldBossSocketOutManager.sendCancelStunmanFor(campaignId);
  }
}
