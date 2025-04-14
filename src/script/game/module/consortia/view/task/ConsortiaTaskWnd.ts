//@ts-expect-error: External dependencies
/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-02-24 17:48:40
 * @LastEditTime: 2024-04-19 14:22:31
 * @LastEditors: jeremy.xu
 * @DemandLink: 【公会任务】https://www.tapd.cn/36229514/prong/stories/view/1136229514001044430
 * @Description:
 */

import LangManager from "../../../../../core/lang/LangManager";
import BaseWindow from "../../../../../core/ui/Base/BaseWindow";
import UIButton from "../../../../../core/ui/UIButton";
import UIManager from "../../../../../core/ui/UIManager";
import SimpleAlertHelper from "../../../../component/SimpleAlertHelper";
import { BaseItem } from "../../../../component/item/BaseItem";
import BaseTipItem from "../../../../component/item/BaseTipItem";
import { FinishStatus, PayType } from "../../../../constant/Const";
import TemplateIDConstant from "../../../../constant/TemplateIDConstant";
import { EmWindow } from "../../../../constant/UIDefine";
import { ConsortiaEvent } from "../../../../constant/event/NotificationEvent";
import { ConsortiaManager } from "../../../../manager/ConsortiaManager";
import { ConsortiaSocketOutManager } from "../../../../manager/ConsortiaSocketOutManager";
import { MessageTipManager } from "../../../../manager/MessageTipManager";
import { ConsortiaModel } from "../../model/ConsortiaModel";
import ConsortiaTaskScoreItem from "./ConsortiaTaskScoreItem";

export default class ConsortiaTaskWnd extends BaseWindow {
  protected setScenterValue: boolean = true;

  private _guildModel: ConsortiaModel;
  private cFinishTodayTask: fgui.Controller;
  private cMaxStar: fgui.Controller;
  private guildRewardList: fgui.GList;
  private selfRewardList: fgui.GList;
  private recordList: fgui.GList;
  private scoreBoxlist: fgui.GList;
  private txtTaskContent: fgui.GLabel;
  private txtDifficulty: fgui.GLabel;
  private txtGuildReward: fgui.GLabel;
  private txtSelfReward: fgui.GLabel;
  private txtWeekScore: fgui.GLabel;
  private txtResetTip: fgui.GLabel;
  private txtFinishTodayTask: fgui.GLabel;
  private txtTaskRecordTitle: fgui.GLabel;
  private txtUpgradeStarMax: fgui.GLabel;

  private txtTaskTitle: fgui.GLabel;
  private txtTaskContentVal: fgui.GLabel;
  private txtWeekScoreVal: fgui.GLabel;
  private txtCurTodayTask: fgui.GLabel;
  private txtTaskProg: fgui.GLabel;
  private txtUpgradeStarCost: fgui.GLabel;
  private progBar: fgui.GProgressBar;
  private btnFinish: UIButton;
  private btnUpGradeStar: UIButton;
  private diamondItem: BaseTipItem;

  OnInitWind() {
    super.OnInitWind();
    this.initView();
  }

  /**界面打开 */
  OnShowWind() {
    super.OnShowWind();
    this.addEvent();
    this.update();
    ConsortiaSocketOutManager.sendReqTaskInfo();
  }

  /**关闭界面 */
  OnHideWind() {
    this.removeEvent();
    super.OnHideWind();
  }

  private addEvent() {
    this._guildModel.on(ConsortiaEvent.TASK_INFO, this.updateInfo, this);
    this._guildModel.on(ConsortiaEvent.TASK_RECORD, this.updateRecord, this);
    this._guildModel.on(
      ConsortiaEvent.TASK_WEEK_REWARD,
      this.updateWeekReward,
      this,
    );
  }

  private removeEvent() {
    this._guildModel.off(ConsortiaEvent.TASK_INFO, this.updateInfo, this);
    this._guildModel.off(ConsortiaEvent.TASK_RECORD, this.updateRecord, this);
    this._guildModel.off(
      ConsortiaEvent.TASK_WEEK_REWARD,
      this.updateWeekReward,
      this,
    );
  }

  private initView() {
    this._guildModel = ConsortiaManager.Instance.model;
    this.diamondItem.setInfo(TemplateIDConstant.TEMP_ID_GIFT);
    this.cFinishTodayTask = this.getController("cFinishTodayTask");
    this.cMaxStar = this.getController("cMaxStar");
    this.guildRewardList.itemRenderer = Laya.Handler.create(
      this,
      this.onGuildRewardRenderItem,
      null,
      false,
    );
    this.selfRewardList.itemRenderer = Laya.Handler.create(
      this,
      this.onSelfRewardRenderItem,
      null,
      false,
    );
    this.recordList.itemRenderer = Laya.Handler.create(
      this,
      this.onRecordRenderItem,
      null,
      false,
    );
    this.scoreBoxlist.itemRenderer = Laya.Handler.create(
      this,
      this.onScoreBoxRenderItem,
      null,
      false,
    );
    this.scoreBoxlist.on(
      fgui.Events.CLICK_ITEM,
      this,
      this.onScoreBoxClickItem,
    );

    this.txtFrameTitle.text = LangManager.Instance.GetTranslation(
      "ConsortiaTaskWnd.title",
    );
    this.txtTaskContent.text = LangManager.Instance.GetTranslation(
      "ConsortiaTaskWnd.taskCon",
    );
    this.txtDifficulty.text = LangManager.Instance.GetTranslation(
      "ConsortiaTaskWnd.difficulty",
    );
    this.txtGuildReward.text = LangManager.Instance.GetTranslation(
      "ConsortiaTaskWnd.guildReward",
    );
    this.txtSelfReward.text = LangManager.Instance.GetTranslation(
      "ConsortiaTaskWnd.selfReward",
    );
    this.txtFinishTodayTask.text = LangManager.Instance.GetTranslation(
      "ConsortiaTaskWnd.finishTodayTask",
    );
    this.txtTaskRecordTitle.text = LangManager.Instance.GetTranslation(
      "ConsortiaTaskWnd.taskRecord",
    );
    this.txtWeekScore.text = LangManager.Instance.GetTranslation(
      "ConsortiaTaskWnd.weekScore",
    );
    this.txtResetTip.text = LangManager.Instance.GetTranslation(
      "ConsortiaTaskWnd.ResetTip",
    );
    this.txtUpgradeStarMax.text = LangManager.Instance.GetTranslation(
      "ConsortiaTaskWnd.upgradeStarTipMax2",
    );

    this.btnFinish.title = LangManager.Instance.GetTranslation("public.finish");
    this.btnUpGradeStar.title = LangManager.Instance.GetTranslation(
      "ConsortiaTaskWnd.upgrade",
    );
  }

  private update() {
    this.updateInfo();
    this.updateRecord();
    this.updateWeekReward();
  }

  private updateInfo() {
    let taskInfo = this._guildModel.taskInfo;
    this.txtTaskTitle.text = taskInfo.taskTitle;
    this.txtTaskContentVal.text = taskInfo.taskContent;
    for (let index = 1; index <= this._guildModel.TaskStarNum; index++) {
      this["star" + index].visible = taskInfo.starNum >= index;
    }

    // 公会奖励
    this.guildRewardList.numItems = taskInfo.guildRewardInfoList.length;

    // 个人奖励
    this.selfRewardList.numItems = taskInfo.selfRewardInfoList.length;

    // 任务进度
    this.txtTaskProg.text = LangManager.Instance.GetTranslation(
      "ConsortiaTaskWnd.progress",
      taskInfo.progNum + "/" + taskInfo.finishNeedNum,
    );

    // 升星价格
    this.txtUpgradeStarCost.text = this._guildModel
      .getTaskUpgradeStarPrice(taskInfo.starNum)
      .toString();

    let maxStar =
      this._guildModel.taskInfo.starNum >= this._guildModel.TaskStarNum;
    this.cMaxStar.setSelectedIndex(maxStar ? 1 : 0);
    this.btnUpGradeStar.enabled = !maxStar;
    this.cFinishTodayTask.setSelectedIndex(taskInfo.status);
    this.btnFinish.enabled = taskInfo.status == FinishStatus.FINISHED;
  }

  private updateRecord() {
    this.recordList.numItems = this._guildModel.taskRecordList.length;
    this.txtCurTodayTask.text = LangManager.Instance.GetTranslation(
      "ConsortiaTaskWnd.finshNum",
      this._guildModel.taskFinishNum,
      this._guildModel.consortiaInfo.currentCount,
    );
  }

  private updateWeekReward() {
    this.scoreBoxlist.numItems =
      this._guildModel.taskWeekScoreRewardList.length;
    this.txtWeekScoreVal.text =
      this._guildModel.taskWeekScore + "/" + this._guildModel.taskWeekScoreMax;
    this.progBar.value =
      (this._guildModel.taskWeekScore / this._guildModel.taskWeekScoreMax) *
      100;
    this.progBar.getChild("title").text = "";
  }

  private onGuildRewardRenderItem(index: number, item: fgui.GComponent) {
    let info = this._guildModel.taskInfo.guildRewardInfoList[index];
    item.getChild("title").text = info.count.toString();
    (item.getChild("tipItem") as BaseTipItem).setInfo(info.templateId);
  }

  private onSelfRewardRenderItem(index: number, item: BaseItem) {
    let info = this._guildModel.taskInfo.selfRewardInfoList[index];
    item.info = info;
  }

  private onRecordRenderItem(index: number, item: fgui.GComponent) {
    let str = this._guildModel.taskRecordList[index];
    item.getChild("title").text = str;
  }

  private onScoreBoxRenderItem(index: number, item: ConsortiaTaskScoreItem) {
    let info = this._guildModel.taskWeekScoreRewardList[index];
    item.index = index;
    item.info = info;
  }

  private onScoreBoxClickItem(item: ConsortiaTaskScoreItem) {
    if (item.info.canRecevie) {
      ConsortiaSocketOutManager.sendGetWeekScoreReward(item.index + 1);
    }
  }

  private btnRefreshClick() {
    let left =
      this._guildModel.TaskMaxRefreshNum - this._guildModel.taskRefreshNum;
    if (left <= 0) {
      // 发送消息给服务器弹提示
      ConsortiaSocketOutManager.sendRefreshTask();
    } else {
      let str = LangManager.Instance.GetTranslation(
        "ConsortiaTaskWnd.refreshTip",
        left,
      );
      SimpleAlertHelper.Instance.ShowSimple(
        SimpleAlertHelper.SIMPLE_ALERT,
        null,
        str,
        (b: boolean) => {
          if (b) {
            ConsortiaSocketOutManager.sendRefreshTask();
          }
        },
      );
    }
  }

  private btnFinishClick() {
    ConsortiaSocketOutManager.sendFinishTask();
  }

  private btnUpGradeStarClick() {
    if (this._guildModel.taskInfo.starNum >= this._guildModel.TaskStarNum) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "ConsortiaTaskWnd.upgradeStarTipMax",
        ),
      );
      return;
    }
    let price = this._guildModel.getTaskUpgradeStarPrice(
      this._guildModel.taskInfo.starNum,
    );
    let str = LangManager.Instance.GetTranslation(
      "ConsortiaTaskWnd.upgradeStarTip",
      price,
    );
    SimpleAlertHelper.Instance.ShowSimple(
      SimpleAlertHelper.USEBINDPOINT_ALERT,
      { checkDefault: true },
      str,
      (b: boolean, flag: boolean) => {
        if (b) {
          ConsortiaSocketOutManager.sendUpgradeTaskStar(
            flag ? PayType.BindDiamond : PayType.Diamond,
          );
        }
      },
    );
  }

  private helpBtnClick() {
    let content = LangManager.Instance.GetTranslation("ConsortiaTaskWnd.help");
    UIManager.Instance.ShowWind(EmWindow.Help, { content: content });
  }

  dispose() {
    super.dispose();
  }
}
