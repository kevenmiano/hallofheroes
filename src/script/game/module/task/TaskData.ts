//@ts-expect-error: External dependencies
import { TaskType } from "../../constant/TaskType";
import OfferRewardManager from "../../manager/OfferRewardManager";
import RingTaskManager from "../../manager/RingTaskManager";
import { TaskManage } from "../../manager/TaskManage";
import FrameDataBase from "../../mvc/FrameDataBase";
import SelectTaskItemData from "./SelectTaskItemData";
import TaskCategory from "./TaskCategory";
import LangManager from "../../../core/lang/LangManager";
import { TaskSelectEvent } from "../../constant/event/NotificationEvent";
import { ArmyManager } from "../../manager/ArmyManager";
import { ConfigManager } from "../../manager/ConfigManager";
import { eSelectCampaignItemType } from "../pve/pveCampaign/PveCampaignData";

export enum eSelectTaskItemType {
  FirstItem,
  SecondItem,
}
export default class TaskData extends FrameDataBase {
  private _taskTypeList: Array<number>;
  private _selectedData: any;

  public set selectedData(value: any) {
    this._selectedData = value;
    this.dispatchEvent(TaskSelectEvent.ITEM_SELECTED, null);
  }

  public get selectedData(): any {
    return this._selectedData;
  }

  public get taskTypeList(): Array<number> {
    return this._taskTypeList;
  }

  public getTreeData(): any[] {
    let firstData = [];
    this.refreshTaskType();
    for (let index = 0; index < this._taskTypeList.length; index++) {
      let type = this._taskTypeList[index];
      let cpName = TaskManage.Instance.cate.getTitleNameByType(type);
      if (type != TaskType.RING_TASK) {
        firstData.push(
          new SelectTaskItemData(
            eSelectCampaignItemType.FirstItem,
            type,
            cpName,
          ),
        );
      }
    }
    if (ArmyManager.Instance.thane.grades >= 35) {
      let str: string = LangManager.Instance.GetTranslation("task.titleName6");
      firstData.push(
        new SelectTaskItemData(eSelectCampaignItemType.FirstItem, -2, str),
      );
    }
    return [firstData];
  }

  private refreshTaskType() {
    this._taskTypeList = TaskManage.Instance.existTaskType;
    if (this.rewardManager.model.baseRewardDic.getList().length > 0)
      //判断是否存在悬赏任务
      this._taskTypeList.push(100);
    this._taskTypeList.sort(this.sortTaskTypeList);
    this._taskTypeList.push(TaskType.RING_TASK);
  }

  private sortTaskTypeList(a: number, b: number): number {
    if (a > b) {
      return 1;
    } else if (a < b) {
      return -1;
    }
    return 0;
  }

  private get rewardManager(): OfferRewardManager {
    return OfferRewardManager.Instance;
  }

  private get ringTaskManager(): RingTaskManager {
    return RingTaskManager.Instance;
  }

  private get cate(): TaskCategory {
    return TaskManage.Instance.cate;
  }
}
