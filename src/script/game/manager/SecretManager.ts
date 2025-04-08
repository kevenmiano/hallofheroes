/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-04-22 12:04:42
 * @LastEditTime: 2024-05-06 17:27:27
 * @LastEditors: jeremy.xu
* @Description: 秘境
*/
import SecretReqMsg = com.road.yishi.proto.secret.SecretReqMsg
import SecretInfoMsg = com.road.yishi.proto.secret.SecretInfoMsg
import AllSecretInfoMsg = com.road.yishi.proto.secret.AllSecretInfoMsg
import SecretTreasureMsg = com.road.yishi.proto.secret.SecretTreasureMsg


import { PackageIn } from "../../core/net/PackageIn";
import { SocketManager } from "../../core/net/SocketManager";
import { SecretEvent } from "../constant/event/NotificationEvent";
import { C2SProtocol } from "../constant/protocol/C2SProtocol";
import SecretModel from "../datas/secret/SecretModel";
import { NotificationManager } from "./NotificationManager";
import { RoomListSocketOutManager } from "./RoomListSocketOutManager";
import { RoomSocketOuterManager } from "./RoomSocketOuterManager";
import { ServerDataManager } from "../../core/net/ServerDataManager";
import { S2CProtocol } from "../constant/protocol/S2CProtocol";
import Logger from "../../core/logger/Logger";
import { SecretSceneState } from "../module/pve/pveSecretScene/model/SecretSceneState";
import { SecretEnterType, SecretStartType, SecretType } from "../datas/secret/SecretConst";
import { PayType } from "../constant/Const";

export class SecretManager {
    static Debug = false

    public model: SecretModel = new SecretModel();
    private static _instance: SecretManager;
    public static get Instance(): SecretManager {
        if (SecretManager._instance == null) SecretManager._instance = new SecretManager();
        return SecretManager._instance;
    }

    public setup() {
        this.initEvent();
    }

    private initEvent() {
        ServerDataManager.listen(S2CProtocol.U_C_SECRET_INFO, this, this.onSecretInfoHandler);
        ServerDataManager.listen(S2CProtocol.U_C_SECRET_LAYER_INFO, this, this.onSecretRecordInfoHandler);
        ServerDataManager.listen(S2CProtocol.U_C_SECRET_GET_TREASURE, this, this.onSecretTresureHandler);
    }

    private onSecretRecordInfoHandler(pkg: PackageIn) {
        let allMsg = pkg.readBody(AllSecretInfoMsg) as AllSecretInfoMsg;
        Logger.info("[SecretManager]最大未通关秘境记录信息更新", allMsg)
        for (let index = 0; index < allMsg.allSecretInfoMsg.length; index++) {
            const msg = allMsg.allSecretInfoMsg[index] as SecretInfoMsg;
            let secretInfo = this.model.getMaxSecretRecordInfo(msg.type)
            if (secretInfo) {
                secretInfo.type = msg.type;
                secretInfo.secretId = msg.secretId;
                secretInfo.maxLayer = msg.maxLayer;
            }
        }
        NotificationManager.Instance.dispatchEvent(SecretEvent.SECRET_RECORD_INFO)
    }

    private onSecretInfoHandler(pkg: PackageIn) {
        let allMsg = pkg.readBody(AllSecretInfoMsg) as AllSecretInfoMsg;
        Logger.info("[SecretManager]秘境信息更新", allMsg)

        for (let index = 0; index < allMsg.allSecretInfoMsg.length; index++) {
            const msg = allMsg.allSecretInfoMsg[index] as SecretInfoMsg;
            let secretInfo = this.model.getSecretInfo(msg.type)
            if (secretInfo) {
                if (msg.hasOwnProperty("secretId")) {
                    secretInfo.secretId = msg.secretId;
                } else {
                    secretInfo.secretId = 0;
                }
                if (msg.hasOwnProperty("type")) {
                    secretInfo.type = msg.type;
                }
                if (msg.hasOwnProperty("maxLayer")) {
                    secretInfo.maxLayer = msg.maxLayer;
                }
                if (msg.hasOwnProperty("curLayer")) {
                    secretInfo.curLayer = msg.curLayer;
                }
                if (msg.hasOwnProperty("eventId")) {
                    secretInfo.eventId = msg.eventId;
                } else { 
                    secretInfo.eventId = 0;
                }
                if (msg.hasOwnProperty("passSecret")) {
                    secretInfo.passSecret = msg.passSecret;
                }
                if (msg.hasOwnProperty("curStatus")) {
                    secretInfo.curStatus = msg.curStatus;
                }
                if (msg.hasOwnProperty("treasure")) {
                    secretInfo.treasure = msg.treasure;
                } else {
                    secretInfo.treasure = "";
                }
                if (msg.hasOwnProperty("enterNum")) {
                    secretInfo.curCount = msg.enterNum;
                } else {
                    secretInfo.curCount = 0;
                }
                if (msg.hasOwnProperty("dropItem")) {
                    secretInfo.dropItem = msg.dropItem;
                } else {
                    secretInfo.dropItem = ""
                }
                if (msg.hasOwnProperty("dropType")) {
                    secretInfo.dropType = msg.dropType;
                } 
            }
        }

        NotificationManager.Instance.dispatchEvent(SecretEvent.SECRET_INFO)
    }

    private onSecretTresureHandler(pkg: PackageIn) {
        let msg = pkg.readBody(SecretTreasureMsg) as SecretTreasureMsg;

        Logger.info("[SecretManager]秘境秘宝信息更新", msg)
        /**
         * 临时保存
         * 1. 两种都有  先弹失去提示
         * 2. 只有一种  直接弹对应提示
         */
        this.model.gainTreasure = msg.receiveTreasure
        this.model.lostTreasure = msg.lostTreasure
        if (msg.lostTreasure && msg.receiveTreasure) {
            NotificationManager.Instance.dispatchEvent(SecretEvent.LOSE_TRESURE)
        } else {
            if (msg.receiveTreasure) {
                NotificationManager.Instance.dispatchEvent(SecretEvent.GAIN_TRESURE)
            }else if (msg.lostTreasure) {
                NotificationManager.Instance.dispatchEvent(SecretEvent.LOSE_TRESURE)
            }
        }

        let secretInfo = this.model.getSecretInfo(msg.type)
        if (msg.ownTreasure) {
            secretInfo.treasure = msg.ownTreasure
        } else {
            secretInfo.treasure = ""
        }
        NotificationManager.Instance.dispatchEvent(SecretEvent.UPDATE_TRESURE)
    }

    public sendSecretInfo() {
        SocketManager.Instance.send(C2SProtocol.C_SECRET_INFO);
    }

    /** 最高秘境通过的最大层数：
     * 前置秘境显示通关，不需要记录
     */
    public sendSecretRecordLayer() {
        SocketManager.Instance.send(C2SProtocol.C_SECRET_LAYER_INFO);
    }

    /** 自动化流程：省去创建房间界面这一步
     * 创建房间 SecretManager.sendCreateRoom
     * 收到房间信息返回 0x000C 
     * 自动请求开始副本 SecretManager.sendStartCampaign
     */
    public sendCreateRoom(capacity: number, secretId: number, enterType: SecretEnterType, startType:SecretStartType) {
        RoomListSocketOutManager.sendCreateSecretRoom(capacity, secretId, enterType, startType);
    }

    public sendStartCampaign(secretId: number) {
        RoomSocketOuterManager.sendStartCampaignScene(secretId);
    }

    // 下一层
    public sendGotoNext(secretId: number, curLayer:number) {
        Logger.info("[SecretManager]下一层", secretId)
        let msg: SecretReqMsg = new SecretReqMsg();
        msg.secretId = secretId;
        msg.opType = 1;
        msg.curLayer = curLayer;
        SocketManager.Instance.send(C2SProtocol.C_SECRET_OP, msg);
    }

    // 放弃
    public sendGiveUp(secretId: number) {
        Logger.info("[SecretManager]放弃", secretId)
        let msg: SecretReqMsg = new SecretReqMsg();
        msg.secretId = secretId;
        msg.opType = 2;
        SocketManager.Instance.send(C2SProtocol.C_SECRET_OP, msg);
    }

    /**
     * 复活
     * @param secretId 
     * @param payType
     */
    public sendReviver(secretId: number, payType:PayType) {
        Logger.info("[SecretManager]复活", secretId)
        let msg: SecretReqMsg = new SecretReqMsg();
        msg.secretId = secretId;
        msg.opType = 3;
        msg.payType = payType;
        SocketManager.Instance.send(C2SProtocol.C_SECRET_OP, msg);
    }

    /**
     * 事件里面的选项：服务器根据类型做处理
     */
    public sendEventOpt(secretId: number, optionId: number, curLayer:number) {
        // Logger.info("[SecretManager]选项操作", secretId, optionId, curLayer)
        let msg: SecretReqMsg = new SecretReqMsg();
        msg.secretId = secretId;
        msg.optionId = optionId;
        msg.curLayer = curLayer;
        SocketManager.Instance.send(C2SProtocol.C_SECRET_CHOOSE, msg);
    }

    public test() {
        if (!SecretManager.Debug) {
            return
        }

        Logger.info("[SecretManager]测试秘境信息更新")
        let secretInfo = this.model.getSecretInfo(SecretType.Single)
        secretInfo.secretId = 101;
        secretInfo.type = 1;
        secretInfo.maxLayer = 10;
        secretInfo.curLayer = 1;
        secretInfo.eventId = 5;
        secretInfo.passSecret = "";
        secretInfo.curStatus = SecretSceneState.Sucess;
        secretInfo.treasure = "101:1,201:2";

        NotificationManager.Instance.dispatchEvent(SecretEvent.SECRET_INFO)
    }
}