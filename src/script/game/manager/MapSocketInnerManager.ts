import Logger from "../../core/logger/Logger";
import { PackageIn } from "../../core/net/PackageIn";
import { ServerDataManager } from "../../core/net/ServerDataManager";
import { BattleManager } from "../battle/BattleManager";
import { VictoryFailTransaction } from "../battle/transaction/VictoryFailTransaction";
import { SLGSocketEvent } from "../constant/event/NotificationEvent";
import { S2CProtocol } from "../constant/protocol/S2CProtocol";
import { ChatManager } from "./ChatManager";
import { CoreTransactionManager } from "./CoreTransactionManager";
import MapUpdatedMsg = com.road.yishi.proto.army.MapUpdatedMsg;

/**
 * @description 从SocketManager里面解耦出来的
 * @author yuanzhan.yu
 * @date 2021/1/6 9:25
 * @ver 1.0
 *
 */
export class MapSocketInnerManager {
    private static _instance: MapSocketInnerManager;

    public static get Instance(): MapSocketInnerManager {
        if (!this._instance) {
            this._instance = new MapSocketInnerManager();
        }
        return this._instance;
    }

    constructor() {
    }

    public setup() {
        ServerDataManager.listen(S2CProtocol.U_C_MAPDATA_SYNC, this, this.s2c_mapdata_sync);
        ServerDataManager.listen(S2CProtocol.U_C_PLAY_MOVIE, this, this.s2c_play_movie);
        ServerDataManager.listen(S2CProtocol.U_B_PREPARE_OVER, this, this.s2c_prepare_over);
        //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>战斗>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>;
        ServerDataManager.listen(S2CProtocol.U_C_BATTLE_TALK, this, this.s2c_battle_talk);// 战斗剧情
        ServerDataManager.listen(S2CProtocol.U_B_PREPARE, this, this.s2c_prepare);//准备战斗
        ServerDataManager.listen(S2CProtocol.U_B_ATTACKING, this, this.s2c_battleHandle);
        ServerDataManager.listen(S2CProtocol.U_B_START, this, this.s2c_battleHandle);
        ServerDataManager.listen(S2CProtocol.U_B_GAME_OVER, this, this.s2c_battleHandle);
        ServerDataManager.listen(S2CProtocol.U_B_USER_REINFORCE, this, this.s2c_battleHandle);
        ServerDataManager.listen(S2CProtocol.U_B_USER_STOP, this, this.s2c_battleHandle);
        ServerDataManager.listen(S2CProtocol.U_B_FIGHT_MODE, this, this.s2c_battleHandle);
        ServerDataManager.listen(S2CProtocol.U_B_LOAD_RES, this, this.s2c_battleHandle);
        ServerDataManager.listen(S2CProtocol.U_B_BATTLE_NOTICE, this, this.s2c_battleHandle);
        ServerDataManager.listen(S2CProtocol.U_C_UPDATE_AWAKE, this, this.s2c_battleHandle);

    }

    private static UPDATE_CASTLE: number = 2;
    private static UPDATE_WILDLAND: number = 1;
    private static UPDATE_ARMY: number = 3;

    private s2c_mapdata_sync(pkg: PackageIn) {
        Logger.yyz("收到更新大地图响应");
        let msg: MapUpdatedMsg = pkg.readBody(MapUpdatedMsg) as MapUpdatedMsg;
        switch (msg.updatedType) {
            case MapSocketInnerManager.UPDATE_CASTLE:
                //throw new Error("大地图更新, type为0");
                ServerDataManager.Instance.dispatchEvent(SLGSocketEvent.UPDATE_CASTLE, msg.baseCastle);
                break;
            case MapSocketInnerManager.UPDATE_WILDLAND:
                ServerDataManager.Instance.dispatchEvent(SLGSocketEvent.UPDATE_WILDLAND, msg.wildLand);
                break;
            case MapSocketInnerManager.UPDATE_ARMY:
                ServerDataManager.Instance.dispatchEvent(SLGSocketEvent.UPDTAE_ARMY, msg.army);
                break;
        }
    }

    private s2c_play_movie(pkg: PackageIn) {
        ServerDataManager.Instance.dispatchEvent(SLGSocketEvent.U_PLAY_MOVIE, pkg);
        if (!ChatManager.Instance.model) {
            return;
        }
        let interval = Laya.Browser.now() - ChatManager.Instance.model.getProtocolTimeByID(pkg.extend1);
        if (interval >= 3) {
            Logger.info("SLGSocketEvent.EVENT+AcceptProtocolType.U_C_PLAY_MOVIE协议超时 3 秒以上");
        }
        ChatManager.Instance.model.removeReceiveProtocol(pkg.extend1);
    }

    private s2c_prepare_over(pkg: PackageIn) {
        VictoryFailTransaction.handle(pkg);
        if (!ChatManager.Instance.model) {
            return;
        }
        let interval = Laya.Browser.now() - ChatManager.Instance.model.getProtocolTimeByID(pkg.extend1);
        if (interval >= 3) {
            Logger.info("SLGSocketEvent.EVENT+AcceptProtocolType.U_CH_CHANNEL_CHA协议超时 3 秒以上");
        }
        ChatManager.Instance.model.removeReceiveProtocol(pkg.extend1);
    }

    private s2c_battle_talk(pkg: PackageIn) {
        BattleManager.Instance.plotHandler.handler(pkg);
    }

    private s2c_prepare(pkg: PackageIn) {
        CoreTransactionManager.getInstance().handlerPackage(pkg);
    }

    private s2c_battleHandle(pkg: PackageIn) {
        ServerDataManager.Instance.dispatchEvent(SLGSocketEvent.GAME_CMD, pkg);
    }
}