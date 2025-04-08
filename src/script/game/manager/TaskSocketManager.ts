// @ts-nocheck
import { PackageOut } from "../../core/net/PackageOut";
import { SocketManager } from "../../core/net/SocketManager";
import { C2SProtocol } from "../constant/protocol/C2SProtocol";
import TaskCampaignReqMsg = com.road.yishi.proto.campaign.TaskCampaignReqMsg;
import CheckSend = com.road.yishi.proto.player.CheckSend;
import QuestAddedMsg = com.road.yishi.proto.quest.QuestAddedMsg;
import QuestFinishedReqMsg = com.road.yishi.proto.quest.QuestFinishedReqMsg;
/**
     *任务信息的管理类, 请求服务器的相关 
     * @author 
     * 
     */
export class TaskSocketManager {
    /**
     * 获取任务奖励 
     * @param tid（任务的模板ID）
     * @param gid(一般为0)
     * @param autoComplete 是否自动完成（一般为false）
     * 
     */
    public static sendGetTaskReward(tid: number, gid: number, autoComplete: boolean = false) {
        var msg: QuestFinishedReqMsg = new QuestFinishedReqMsg();
        msg.templateId = tid;
        msg.rewardItemId = gid;
        msg.isPass = autoComplete;
        SocketManager.Instance.send(C2SProtocol.U_C_QUEST_FINISH, msg);
    }

    /**
     * 发送添加用户任务请求 
     * @param arr 任务模板templateId数组
     * 
     */
    public static sendRequestTask(arr: any[]) {
        var msg: QuestAddedMsg = new QuestAddedMsg();
        for (var i: number = 0; i < arr.length; i++) {
            msg.questId.push(arr[i]);
        }
        SocketManager.Instance.send(C2SProtocol.U_C_QUEST_ADD, msg);
    }

    /**
     * 发送是否填写过手机号请求
     * 
     */
    public static sendCheckMobileNumber() {
        var msg: CheckSend = new CheckSend;
        SocketManager.Instance.send(C2SProtocol.C_CHECK_SEND, msg);
    }
}