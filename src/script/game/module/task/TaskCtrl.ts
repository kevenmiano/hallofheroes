import OfferRewardManager from '../../manager/OfferRewardManager';
import { TaskManage } from '../../manager/TaskManage';
import { TaskSocketManager } from '../../manager/TaskSocketManager';
import FrameCtrlBase from '../../mvc/FrameCtrlBase';
import { t_s_campaignData } from '../../config/t_s_campaign';
import { WorldBossSocketOutManager } from '../../manager/WorldBossSocketOutManager';
export default class TaskCtrl extends FrameCtrlBase {
    show() {
        super.show()

    }

    hide() {
        super.hide()
    }

    dispose() {
        super.dispose()
    }

    public sendGetTaskReward(tid: number, gid: number, autoComplete: boolean = false) {
        TaskSocketManager.sendGetTaskReward(tid, gid, autoComplete);
    }

    public sendEnterBattle(bossTemplate: t_s_campaignData) {
        if (bossTemplate)
            WorldBossSocketOutManager.sendWorldBossCmd(bossTemplate.CampaignId);
    }

    public checkExitstTask(): boolean {
        var flag: boolean = true;
        var exitst: boolean = TaskManage.Instance.cate.acceptedList.length != 0;
        if (!exitst && OfferRewardManager.Instance.model.baseRewardDic.getList().length <= 0) {
            flag = true;
            // var str:string = LangManager.Instance.GetTranslation("task.TaskControler.command01");
            // MessageTipManager.Instance.show(str);
            // return;
        }
        return flag;
    }
}