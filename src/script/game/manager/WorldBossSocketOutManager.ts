// @ts-nocheck
import { Message } from "../../../../protobuf/library/protobuf-library";
import { PackageOut } from "../../core/net/PackageOut";
import { SocketManager } from "../../core/net/SocketManager";
import { MessageTipManager } from "./MessageTipManager";
import LangManager from '../../core/lang/LangManager';
import CampaignReqMsg = com.road.yishi.proto.campaign.CampaignReqMsg;
import OprateReplacemntMsg = com.road.yishi.proto.campaign.OprateReplacemntMsg;
import WorldBossLiveMsg = com.road.yishi.proto.campaign.WorldBossLiveMsg;
import PayTypeMsg = com.road.yishi.proto.player.PayTypeMsg;
import WorldBossMsg = com.road.yishi.proto.worldmap.WorldBossMsg;
import { C2SProtocol } from "../constant/protocol/C2SProtocol";
/**
 *世界BOSS的操作及相关请求服务器 
 * 
 */
export class WorldBossSocketOutManager {
    constructor() {
    }

    private static _intervalTime: number = 0;
    public static sendWorldBossCmd(mapId: number) {
        if (new Date().getTime() - WorldBossSocketOutManager._intervalTime < 5000) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("activity.view.ActivityItem.command01"));
            return;
        }
        WorldBossSocketOutManager._intervalTime = new Date().getTime();
        var msg: WorldBossMsg = new WorldBossMsg();
        msg.param1 = mapId;//1进入, 2离开, 3攻击
		SocketManager.Instance.send(C2SProtocol.C_WORLD_BOSS_CMD, msg);
    }

    /**
     * 世界BOSS请求
     * @mapId  地图ID
    */
    public static reqWorldBossCmd(mapId: number) {
        var msg: WorldBossMsg = new WorldBossMsg();
        msg.mapId = mapId;
        SocketManager.Instance.send(C2SProtocol.C_WORLD_BOSS_REQ, msg);
    }

    /**
     * 请求世界BOSS状态
    */
    public static reqWorldBossStates() {
        SocketManager.Instance.send(C2SProtocol.C_WORLDBOSS_STATE, null);
    }

    /**
     * 发送立即复活请求
    */
    public static sendRiver(useBind: boolean = true) {
        var msg: PayTypeMsg = new PayTypeMsg();
        msg.payType = 0;
        if (!useBind) {
            msg.payType = 1;
        }
        SocketManager.Instance.send(C2SProtocol.C_WORLDBOSS_PLAYER_LIVE, msg);
    }

    /**
     * 发送立即复活并进入战斗
    */
    public static sendEnterBattle(useBind: boolean = true) {
        var msg: PayTypeMsg = new PayTypeMsg();
        msg.payType = 0;
        if (!useBind) {
            msg.payType = 1;
        }
        SocketManager.Instance.send(C2SProtocol.C_WORLDBOSS_PLAYER_LIVE, msg);
    }

    /**
     * 发送购买替身请求（op=1）
    * @campaignId 世界BOSS模板场景ID
    */
    public static sendBuyStunmanFor(campaignId: number) {
        var msg: OprateReplacemntMsg = new OprateReplacemntMsg();
        msg.op = 1; // 1 购买 2 取消
        msg.campaignId = campaignId;
        SocketManager.Instance.send(C2SProtocol.C_OPRATE_REPLACEMENTS, msg);
    }

    /**
     * 发送购买替身请求(op=2)
    */
    public static sendCancelStunmanFor(campaignId: number) {
        var msg: OprateReplacemntMsg = new OprateReplacemntMsg();
        msg.op = 2;  // 1 购买 2 取消
        msg.campaignId = campaignId;
        SocketManager.Instance.send(C2SProtocol.C_OPRATE_REPLACEMENTS, msg);
    }
}