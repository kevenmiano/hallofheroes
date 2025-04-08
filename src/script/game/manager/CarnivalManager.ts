/**
 * 嘉年华 
 */

import GameEventDispatcher from "../../core/event/GameEventDispatcher";
import { PackageIn } from "../../core/net/PackageIn";
import { ServerDataManager } from "../../core/net/ServerDataManager";
import { SocketManager } from "../../core/net/SocketManager";
import { S2CProtocol } from "../constant/protocol/S2CProtocol";
import CarnivalModel from "../module/carnival/model/CarnivalModel";
import CarnivalTaskInfo from "../module/carnival/model/CarnivalTaskInfo";
import { NotificationManager } from "./NotificationManager";
import { C2SProtocol } from "../constant/protocol/C2SProtocol";

import CarnivalMsg = com.road.yishi.proto.carnival.CarnivalMsg;
import CarnivalTaskListMsg = com.road.yishi.proto.carnival.CarnivalTaskListMsg;
import CarnivalTaskMsg = com.road.yishi.proto.carnival.CarnivalTaskMsg;
import PropertyMsg = com.road.yishi.proto.simple.PropertyMsg;
import PlayerOpMsg = com.road.yishi.proto.player.PlayerOpMsg;
import { NotificationEvent } from "../constant/event/NotificationEvent";
import { FrameCtrlManager } from "../mvc/FrameCtrlManager";
import { EmWindow } from "../constant/UIDefine";


export default class CarnivalManager extends GameEventDispatcher {

    public static OP_OPEN: number = 1;// 打开界面
    public static OP_SCORE_REWARD: number = 2;// 领取积分奖励
    public static OP_CHARGE_LOTTERY: number = 3;// 充值抽奖
    public static OP_LUCK_LOTTERY: number = 4;// 幸运抽奖
    public static OP_BUY_GIFT: number = 5;// 购买礼包
    public static OP_LUCK_TREASURE: number = 6;// 幸运夺宝
    public static OP_TASK_REWARD: number = 7;// 任务奖励
    public static OP_ONLINE_REWARD: number = 8;// 在线奖励
    public static OP_GAME: number = 9;// 小游戏

    public static EVENT_UPDATE: string = "carn.EVENT_UPDATE";
    public static EVENT_TASK_UPDATE: string = "carn.EVENT_TASK_UPDATE";

    private _model: CarnivalModel;
    public isOpen: boolean = false;
    public isRewardTime = true;

    public rrewardTime = "";

    private static inst: CarnivalManager;

    public static get Instance(): CarnivalManager {
        if (!this.inst) {
            this.inst = new CarnivalManager();
        }
        return this.inst;
    }

    public get model(): CarnivalModel {
        if (!this._model) {
            this._model = new CarnivalModel();
        }
        return this._model;
    }


    public setup() {
        this._model = new CarnivalModel();
        ServerDataManager.listen(S2CProtocol.U_C_CARNIVAL_DATA, this, this.__activeInfoHandler);
        ServerDataManager.listen(S2CProtocol.U_C_CARNIVAL_TASK_DATA, this, this.__taskInfoHandler);
        ServerDataManager.listen(S2CProtocol.U_C_TOP_TOOL_BTN, this, this.__topBtnHandler);
    }

    private __topBtnHandler(pkg: PackageIn) {
        let msg = pkg.readBody(PropertyMsg) as PropertyMsg;
        if (msg.param1 == 1) {//嘉年华
            this.isOpen = msg.param7;

            let change = this.isRewardTime;

            this.isRewardTime = msg.param9;
            this.rrewardTime = msg.param6;
            //状态变更
            change = change != this.isRewardTime;


            if (!this.isOpen || (change && !this.isRewardTime)) {
                FrameCtrlManager.Instance.exit(EmWindow.AirGardenGameSuDuWnd);
                FrameCtrlManager.Instance.exit(EmWindow.AirGardenGameLLK);
                FrameCtrlManager.Instance.exit(EmWindow.AirGardenGameMemoryCard);
                FrameCtrlManager.Instance.exit(EmWindow.Carnival);
            }
            NotificationManager.Instance.sendNotification(NotificationEvent.REFRESH_TOPTOOLS);
        }
    }

    private __activeInfoHandler(pkg: PackageIn) {
        let msg = pkg.readBody(CarnivalMsg) as CarnivalMsg;

        this.model.score = msg.score;
        this.model.scoreRewardInfo = msg.scoreRewardInfo;
        this.model.totalCharge = msg.totalCharge
        this.model.lotteryCount = msg.lotteryCount;
        this.model.dayCharge = msg.dayCharge;
        this.model.giftBuyInfo = msg.giftBuyInfo;
        this.model.dayOnline = msg.dayOnline;
        this.model.onlineDate = msg.onlineDate;
        this.model.onlineRewardInfo = msg.onlineRewardInfo;
        this.model.luckCount = msg.luckCount;
        this.model.luckNum = msg.luckNum;
        this.model.gameInfo = msg.gameInfo;
        this.model.result = msg.result;

        this.dispatchEvent(CarnivalManager.EVENT_UPDATE, msg.opType);
    }

    private __taskInfoHandler(pkg: PackageIn) {
        let msg = pkg.readBody(CarnivalTaskListMsg) as CarnivalTaskListMsg;
        var info: CarnivalTaskInfo;
        for (const key in msg.tasks) {
            if (Object.prototype.hasOwnProperty.call(msg.tasks, key)) {
                let item = msg.tasks[key];
                info = this.model.getTaskInfo(item.taskId);
                if (!info) {
                    info = new CarnivalTaskInfo();
                    info.taskId = item.taskId;
                    this.model.putTaskInfo(info);
                }
                info.data = item.data;
                info.isReward = item.isReward ? 1 : 0;
            }
        }
        this.dispatchEvent(CarnivalManager.EVENT_TASK_UPDATE);
    }

    /**请求操作 */
    public opRequest(op: number, id: number = 0, count = 1) {
        var msg: PlayerOpMsg = new PlayerOpMsg();
        msg.op = op;
        msg.id = id;
        msg.count = count;
        this.sendProtoBuffer(C2SProtocol.C_CARNIVAL_OP, msg);
    }

    public sendProtoBuffer(code: number, message) {
        SocketManager.Instance.send(code, message);
    }

}