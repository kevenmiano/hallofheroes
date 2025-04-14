/*
 * @Author: jeremy.xu
 * @Date: 2023-03-16 15:22:02
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-09-11 11:48:00
 * @Description: QQ大厅自动引导
 */

import Logger from "../../../../core/logger/Logger";
import UIManager from "../../../../core/ui/UIManager";
import { GlobalConfig } from "../../../constant/GlobalConfig";
import { EmWindow } from "../../../constant/UIDefine";
import { SwitchPageHelp } from "../../../utils/SwitchPageHelp";
import DialogWnd from "../../dialog/DialogWnd";
import SpaceTaskInfoWnd from "../../home/SpaceTaskInfoWnd";
import NewbieModule from "../NewbieModule";
import AutoNewbieBase from "./AutoNewbieBase";
import AutoNewbieMgr from "./AutoNewbieMgr";

export default class AutoNewbieQQ extends AutoNewbieBase {
  public channelName: string = "QQ大厅";

  public processFunc(time: number) {
    super.processFunc(time);

    // 倒计时文字
    let showTime = (this.autoTimeMs - time) / 1000;
    this.setDialogTip(this.getAutoDialogueTip(showTime));
    this.setArrowTip(this.getAutoExecTip(showTime));

    let isOpenDialog = AutoNewbieMgr.Instance.showingDialog;
    this.showArrowTip(
      !isOpenDialog && !AutoNewbieMgr.Instance.executingAutoPath,
    );
    this.showDialogTip(
      isOpenDialog && !AutoNewbieMgr.Instance.executingAutoDialog,
    );
  }

  public processEndFunc() {
    super.processEndFunc();
    Logger.info("[AutoNewbieQQ]processEndFunc");

    let isOpenDialog = AutoNewbieMgr.Instance.showingDialog;
    if (isOpenDialog) {
      AutoNewbieMgr.Instance.executingAutoDialog = true;
      let wnd = UIManager.Instance.FindWind(EmWindow.Dialog) as DialogWnd;
      wnd.triggerAutoClick();
    } else {
      AutoNewbieMgr.Instance.executingAutoPath = true;
      let targetNodeStr = SwitchPageHelp.formatSearchNode(
        GlobalConfig.CampaignID.NewbieLayer2,
        GlobalConfig.CampaignNodeID.Node_1000205,
      );
      SwitchPageHelp.walkToCrossMapTarget(targetNodeStr);
    }
  }

  public showAllTip(b: boolean) {
    super.showAllTip(b);
  }

  public showDialogTip(b: boolean) {
    if (UIManager.Instance.isShowing(EmWindow.Dialog)) {
      let wnd = UIManager.Instance.FindWind(EmWindow.Dialog) as DialogWnd;
      wnd.showAutoClickTip(b);
    }
  }

  public showArrowTip(b: boolean) {
    if (UIManager.Instance.isShowing(EmWindow.SpaceTaskInfoWnd)) {
      let wnd = UIManager.Instance.FindWind(
        EmWindow.SpaceTaskInfoWnd,
      ) as SpaceTaskInfoWnd;
      wnd.noviceArrow.showAutoClickTip(b);
    }
  }

  public setDialogTip(str: string = "") {
    let wnd = UIManager.Instance.FindWind(EmWindow.Dialog) as DialogWnd;
    wnd && wnd.setAutoClickTip(str);
  }

  public setArrowTip(str: string = "") {
    let wnd = UIManager.Instance.FindWind(
      EmWindow.SpaceTaskInfoWnd,
    ) as SpaceTaskInfoWnd;
    if (wnd && wnd.noviceArrow) {
      wnd.noviceArrow.setAutoClickTip(str);
    }
  }

  public get open(): boolean {
    return !NewbieModule.Instance.checkEnterCastle();
  }

  public get autoDialogue() {
    return this.open;
  }
}
