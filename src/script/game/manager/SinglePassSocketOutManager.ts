// @ts-nocheck
import { SocketManager } from "../../core/net/SocketManager";
import { C2SProtocol } from "../constant/protocol/C2SProtocol";
import ChallengeMsg = com.road.yishi.proto.player.ChallengeMsg;
import VipRouletteMsg = com.road.yishi.proto.vip.VipRouletteMsg;
import RankInfoMsg = com.road.yishi.proto.tollgate.RankInfoMsg;
export default class SinglePassSocketOutManager {

    constructor() {
    }
    /**
         * 天穹之径信息
         * 
         */
    public static sendRequestSinglePassInfo() {
        var msg: ChallengeMsg = new ChallengeMsg();
        msg.type = 0;
        SocketManager.Instance.send(C2SProtocol.C_TOLLGATE_REQUEST, msg);
    }

    /**
     * 天穹之径挑战
     * 
     */
    public static sendRequestSinglePassAttack(targetIndex: number) {
        var msg: ChallengeMsg = new ChallengeMsg();
        msg.type = 0;
        msg.tarUserId = targetIndex;
        SocketManager.Instance.send(C2SProtocol.C_TOLLGATE_REQUEST_ATTACK, msg);
    }

    /**
     * 天穹之径升级区域
     * 
     */
    public static sendRequestUpdateArea() {
        SocketManager.Instance.send(C2SProtocol.C_UPDATE_AREA);
    }

    /**
     * 天穹之径手动领取区域奖励
     * 
     */
    public static sendRequestGetAreaReward(index:number) {
        var msg: RankInfoMsg = new RankInfoMsg();
        msg.index = index;
        SocketManager.Instance.send(C2SProtocol.C_GET_AREA_REWARD,msg);
    }

    /**
     * 天穹之径手动领取天国号角道具
     * 
     */
    public static sendRequestGetBugle() {
        SocketManager.Instance.send(C2SProtocol.C_GET_BUGLE);
    }

    /**
     * 天穹之径许愿墙转盘
     * 
     */
    public static sendRequestBugleRoulette(index: number, useBind: boolean = true) {
        var msg: VipRouletteMsg = new VipRouletteMsg();
        msg.leftCount = index;
        if (useBind) {
            msg.opType = 0;
        }
        else {
            msg.opType = 1;
        }
        SocketManager.Instance.send(C2SProtocol.C_BUGLE_ROULETTE, msg);
    }

    /**
     * 天穹之径许愿墙洗牌
     * 
     */
    public static sendRequestBugleOpen() {
        SocketManager.Instance.send(C2SProtocol.C_BUGLE_OPEN);
    }
}