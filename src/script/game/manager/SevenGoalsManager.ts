import GameEventDispatcher from "../../core/event/GameEventDispatcher";
import { PackageIn } from "../../core/net/PackageIn";
import { ArrayUtils, ArrayConstant } from "../../core/utils/ArrayUtils";
import SevenTaskInfo from "../module/welfare/data/SevenTaskInfo";
import { NotificationManager } from "./NotificationManager";
import SevenSignReceiveReq = com.road.yishi.proto.active.SevenSignReceiveReq;
import SevenSignReceiveRsp = com.road.yishi.proto.active.SevenSignReceiveRsp;
import SevenTargetInfoRsp = com.road.yishi.proto.active.SevenTargetInfoRsp;
import TaskReceiveReq = com.road.yishi.proto.active.TaskReceiveReq;
import SevenTargetInfoReq = com.road.yishi.proto.active.SevenTargetInfoReq;
import SevenTaskMsg = com.road.yishi.proto.active.SevenTaskMsg;
import TaskReceiveRsp = com.road.yishi.proto.active.TaskReceiveRsp;
import GiftReceiveReq = com.road.yishi.proto.active.GiftReceiveReq;
import GiftReceiveRsp = com.road.yishi.proto.active.GiftReceiveRsp;
import { SocketManager } from "../../core/net/SocketManager";
import { C2SProtocol } from "../constant/protocol/C2SProtocol";
import { ServerDataManager } from "../../core/net/ServerDataManager";
import { S2CProtocol } from "../constant/protocol/S2CProtocol";
import SevenGoalsModel from "../module/sevengoals/SevenGoalsModel";
import { NotificationEvent } from "../constant/event/NotificationEvent";

export default class SevenGoalsManager extends GameEventDispatcher {
    private static _instance: SevenGoalsManager;
    private _sevenGoalsModel: SevenGoalsModel;
    public static get Instance(): SevenGoalsManager {
        if (!this._instance) this._instance = new SevenGoalsManager();
        return this._instance;
    }

    constructor() {
        super();
        if (!this._sevenGoalsModel) {
            this._sevenGoalsModel = new SevenGoalsModel();
        }
    }

    public get sevenGoalsModel(): SevenGoalsModel {
        return this._sevenGoalsModel;
    }

    public setup() {
        this.initEvent();
    }

    private initEvent() {
        ServerDataManager.listen(S2CProtocol.U_C_SEVEN_TARGET_INFO, this, this.sevenGoalsInfo);
        ServerDataManager.listen(S2CProtocol.U_C_SEVEN_TARGET_TASK_RECEIVE, this, this.sevenGoalsTaskRewardInfo);
        ServerDataManager.listen(S2CProtocol.U_C_SEVEN_TARGET_GIFT_RECEIVE, this, this.sevenGoalsBagRewardInfo);
    }

    /**七日目标信息返回 */
    private sevenGoalsInfo(pkg: PackageIn) {
        let msg: SevenTargetInfoRsp = pkg.readBody(SevenTargetInfoRsp) as SevenTargetInfoRsp;
        let flag: boolean = false;
        if (msg) {
            let item: SevenTaskInfo;
            let sevenTaskMsg: SevenTaskMsg;
            this._sevenGoalsModel.startTime = msg.startTime;
            this._sevenGoalsModel.leftTime = msg.residualTime;
            this._sevenGoalsModel.sevenCurrentDay = msg.day;
            this._sevenGoalsModel.rewardSite = msg.rewardSite;
            this._sevenGoalsModel.giftSite = msg.giftSite;
            if (this._sevenGoalsModel.starNum != msg.starNum) {
                flag = true;
            }
            this._sevenGoalsModel.starNum = msg.starNum;
            if (msg.sevenTask.length > 1) {//请求全部的数据返回的
                let taskArr: Array<SevenTaskInfo> = [];
                for (let i = 0; i < msg.sevenTask.length; i++) {
                    sevenTaskMsg = msg.sevenTask[i] as SevenTaskMsg;
                    item = this.readSevenTaskInfo(sevenTaskMsg);
                    taskArr.push(item);
                }
                taskArr = ArrayUtils.sortOn(taskArr, ["status"], [ArrayConstant.NUMERIC]);
                this._sevenGoalsModel.sevenTask = taskArr;
            }
            else {//更新某一个任务数据
                for (let i = 0; i < msg.sevenTask.length; i++) {
                    sevenTaskMsg = msg.sevenTask[i] as SevenTaskMsg;
                    let item:SevenTaskInfo;
                    for(let j:number = 0;j<this._sevenGoalsModel.sevenTask.length;j++){
                        item = this._sevenGoalsModel.sevenTask[j];
                        if(item.taskId == sevenTaskMsg.taskId){
                            item = this.readSevenTaskInfo(sevenTaskMsg);
                        }
                    }
                }
                this._sevenGoalsModel.sevenTask = ArrayUtils.sortOn(this._sevenGoalsModel.sevenTask, ["status"], [ArrayConstant.NUMERIC]);
            }
        }
        if (flag) {
            NotificationManager.Instance.dispatchEvent(NotificationEvent.SEVEN_GOALS_REWARD_LOOK_UPDATE);
        }
        NotificationManager.Instance.dispatchEvent(NotificationEvent.SEVEN_GOALS_TASK_UPDATE);
    }

    /**七日目标任务奖励领取返回  */
    private sevenGoalsTaskRewardInfo(pkg: PackageIn) {
        let msg: TaskReceiveRsp = pkg.readBody(TaskReceiveRsp) as TaskReceiveRsp;
        if (msg) {
            this._sevenGoalsModel.starNum = msg.starNum;
            let len = this._sevenGoalsModel.sevenTask.length;
            let sevenTaskInfo: SevenTaskInfo;
            for (let i = 0; i < len; i++) {
                sevenTaskInfo = this._sevenGoalsModel.sevenTask[i];
                if (sevenTaskInfo && sevenTaskInfo.taskId == msg.status.taskId) {
                    sevenTaskInfo.status = msg.status.status;
                    break;
                }
            }
            this._sevenGoalsModel.sevenTask = ArrayUtils.sortOn(this._sevenGoalsModel.sevenTask, ["status"], [ArrayConstant.NUMERIC]);
        }
        NotificationManager.Instance.dispatchEvent(NotificationEvent.SEVEN_GOALS_TASKGET_UPDATE);
    }

    /**七日目标积分或特惠礼包领取返回 */
    private sevenGoalsBagRewardInfo(pkg: PackageIn) {
        let msg: GiftReceiveRsp = pkg.readBody(GiftReceiveRsp) as GiftReceiveRsp;
        if (msg) {
            this._sevenGoalsModel.rewardSite = msg.rewardSite;
            this._sevenGoalsModel.giftSite = msg.giftSite;
        }
    }

    private readSevenTaskInfo(msg: SevenTaskMsg): SevenTaskInfo {
        let sevenTaskInfo: SevenTaskInfo = new SevenTaskInfo();
        if (msg) {
            sevenTaskInfo.taskId = msg.taskId;
            sevenTaskInfo.taskType = msg.taskType;
            sevenTaskInfo.status = msg.status;
            sevenTaskInfo.finishNum = msg.finishNum;
            sevenTaskInfo.day = this._sevenGoalsModel.getDayValue(sevenTaskInfo.taskId);
        }
        return sevenTaskInfo;
    }

    /**
     * 请求七日目标活动任务数据
     * @param day //第几天的信息  0 获取全部信息  8 第一次,达到条件(等级第一次达到开放等级的时候请求数据)
     */
    public requestTaskInfo(day: number = 0) {
        let msg: SevenTargetInfoReq = new SevenTargetInfoReq();
        msg.day = day;
        SocketManager.Instance.send(C2SProtocol.C_SEVEN_TARGET_INFO, msg);
    }

    /**
     * 七日目标积分或特惠礼包领取
     * @param op 1 领取积分奖励 2购买特惠礼包
     * @param site 领取第几个礼包
     */
    public getBoxBagReward(op: number, site: number) {
        let msg: GiftReceiveReq = new GiftReceiveReq();
        msg.op = op;
        msg.site = site;
        SocketManager.Instance.send(C2SProtocol.C_SEVEN_TARGET_GIFT_RECEIVE, msg);
    }

    /**
     * 七日目标任务奖励领取
     * @param taskId 任务id
     */
    public getTaskReward(taskId: number) {
        let msg: TaskReceiveReq = new TaskReceiveReq();
        msg.taskId = taskId;
        SocketManager.Instance.send(C2SProtocol.C_SEVEN_TARGET_TASK_RECEIVE, msg);
    }

}