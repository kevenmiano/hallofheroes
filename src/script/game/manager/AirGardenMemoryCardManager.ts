import GameEventDispatcher from "../../core/event/GameEventDispatcher";
import LangManager from "../../core/lang/LangManager";
import { PackageIn } from "../../core/net/PackageIn";
import { ServerDataManager } from "../../core/net/ServerDataManager";
import { SocketManager } from "../../core/net/SocketManager";
import { C2SProtocol } from "../constant/protocol/C2SProtocol";
import { S2CProtocol } from "../constant/protocol/S2CProtocol";
import { AirGardenGameEvent } from "../module/carnival/games/AirGardenGameEvent";
import MemoryCardData from "../module/carnival/model/memorycard/MemoryCardData";
import MemoryCardModel from "../module/carnival/model/memorycard/MemoryCardModel";

import MemoryCardRewardMsg = com.road.yishi.proto.carnival.MemoryCardRewardMsg;
import MemoryCardMsg = com.road.yishi.proto.carnival.MemoryCardMsg;
import SimpleAlertHelper, { AlertBtnType } from "../component/SimpleAlertHelper";
import Logger from "../../core/logger/Logger";
/**
 * 记忆翻牌小游戏 
 */
export default class AirGardenMemoryCardManager extends GameEventDispatcher {

    /**开始游戏*/
    public static OP_START: number = 1;
    /**翻牌*/
    public static OP_FLIP: number = 2;
    /**自动翻牌*/
    public static OP_AUTO: number = 3;
    /**揭牌*/
    public static OP_SHOW: number = 4;
    /**关闭界面*/
    public static OP_CLOSE: number = 5;

    private static _instance: AirGardenMemoryCardManager;

    public static get Instance(): AirGardenMemoryCardManager {
        if (!this._instance)
            this._instance = new AirGardenMemoryCardManager();
        return this._instance;
    }


    private _model: MemoryCardModel;
    public get model(): MemoryCardModel {
        if (!this._model) {
            this._model = new MemoryCardModel();
        }
        return this._model;
    }

    public setup() {
        this._model = new MemoryCardModel();
        ServerDataManager.listen(S2CProtocol.U_C_MEMORY_CARD_INFO, this, this.infoHandler);
        ServerDataManager.listen(S2CProtocol.U_C_MEMORY_CARD_REWARD, this, this.scoreAwardHandler);
    }

    private infoHandler(pkg: PackageIn) {
        let msg = pkg.readBody(MemoryCardMsg) as MemoryCardMsg;
        Logger.info("嘉年华记忆翻牌", msg)
        this.model.addScore = msg.addScore;
        this.model.addScore2 = msg.addScore2;
        this.model.duration = msg.duration;
        if (msg.hasOwnProperty("curTurn")) {
            this.model.curTurn = msg.curTurn;
        }
        if (msg.hasOwnProperty("leftAutoChance")) {
            this.model.leftAutoChance = msg.leftAutoChance;
        }
        if (msg.hasOwnProperty("leftCheckChance")) {
            this.model.leftCheckChance = msg.leftCheckChance;
        }
        if (msg.hasOwnProperty("score")) {
            this.model.score = msg.score;
        }
        this.model.result = msg.result;
        this.model.cIndex1 = msg.cIndex1;
        this.model.cIndex2 = msg.cIndex2;

        var tempData: MemoryCardData;
        if (msg.op == AirGardenMemoryCardManager.OP_FLIP) {
            this.dispatchEvent(AirGardenGameEvent.FLIP_MEMORY_CARD);
        } else if (msg.op == AirGardenMemoryCardManager.OP_AUTO) {
            this.sendEvent(AirGardenGameEvent.AUTO_MEMORY_CARD);
        } else if (msg.op == AirGardenMemoryCardManager.OP_SHOW) {
            this.model.cardShow = new Map();
            for (const key in msg.cards) {
                if (Object.prototype.hasOwnProperty.call(msg.cards, key)) {
                    let temp2 = msg.cards[key];
                    tempData = new MemoryCardData(temp2);
                    this.model.cardShow.set(tempData.index, tempData);
                }
            }
            this.sendEvent(AirGardenGameEvent.SHOW_MEMORY_CARD);
        } else {
            if (msg.cards && msg.cards.length) {
                //初始化
                var delay: number = 0;
                if (this.model.cards && this.model.cards.size) {
                    //如果是新的一局 则延迟一会儿发送
                    delay = 2000;
                }
                setTimeout(() => {
                    Logger.info("嘉年华记忆翻牌初始化")
                    this.model.cards = new Map();
                    for (const key in msg.cards) {
                        if (Object.prototype.hasOwnProperty.call(msg.cards, key)) {
                            var temp: any = msg.cards[key];
                            tempData = new MemoryCardData(temp);
                            this.model.cards.set(tempData.index, tempData);
                        }
                    }
                    this.sendEvent(AirGardenGameEvent.INIT_MEMORY_CARD);
                }, delay)
            }
        }
        this.sendEvent(AirGardenGameEvent.UPDATE_DATA_MEMORY_CARD);
    }


    /**
     * 奖励 
     */
    private scoreAwardHandler(pkg: PackageIn) {
        let msg = pkg.readBody(MemoryCardRewardMsg) as MemoryCardRewardMsg;
        var str: string = LangManager.Instance.GetTranslation("AirGardenGame.hint3", msg.score, msg.count);
        var prompt: string = LangManager.Instance.GetTranslation("public.prompt");
        var confirm1: string = LangManager.Instance.GetTranslation("public.confirm");
        SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, null, prompt, str, confirm1, null, () => {
        }, AlertBtnType.O);
    }

    /**
     * 开始
     */
    public sendStart() {
        var msg: MemoryCardMsg = new MemoryCardMsg();
        msg.op = AirGardenMemoryCardManager.OP_START;
        this.sendProtoBuffer(C2SProtocol.C_MEMORY_CARD_OP, msg);
    }


    /**
     * 翻牌
     */
    public sendFlip(index1: number, index2: number) {
        var msg: MemoryCardMsg = new MemoryCardMsg();
        msg.op = AirGardenMemoryCardManager.OP_FLIP;
        msg.cIndex1 = index1;
        msg.cIndex2 = index2;
        this.sendProtoBuffer(C2SProtocol.C_MEMORY_CARD_OP, msg);
    }

    /**
     * 自动翻
     */
    public sendAuto() {
        var msg: MemoryCardMsg = new MemoryCardMsg();
        msg.op = AirGardenMemoryCardManager.OP_AUTO;
        this.sendProtoBuffer(C2SProtocol.C_MEMORY_CARD_OP, msg);
    }

    /**
     * 揭牌
     */
    public sendShow() {
        var msg: MemoryCardMsg = new MemoryCardMsg();
        msg.op = AirGardenMemoryCardManager.OP_SHOW;
        this.sendProtoBuffer(C2SProtocol.C_MEMORY_CARD_OP, msg);
    }

    /**
     * 关闭界面 
     */
    public sendClose() {
        var msg: MemoryCardMsg = new MemoryCardMsg();
        msg.op = AirGardenMemoryCardManager.OP_CLOSE;
        this.sendProtoBuffer(C2SProtocol.C_MEMORY_CARD_OP, msg);
    }

    public sendProtoBuffer(code: number, message) {
        SocketManager.Instance.send(code, message);
    }


}